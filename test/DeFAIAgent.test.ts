import { expect } from "chai";
import { ethers } from "hardhat";

describe("DeFAIAgent", function () {
    it("Should deploy and execute payout on valid proof", async function () {
        const [owner, recipient, other] = await ethers.getSigners();

        const MockFDC = await ethers.getContractFactory("MockFlareDataConnector");
        const mockFdc = await MockFDC.deploy();

        const conditionId = ethers.keccak256(ethers.toUtf8Bytes("BitcoinTransaction123"));
        await mockFdc.setMockedEventId(conditionId);

        const DeFAIAgent = await ethers.getContractFactory("DeFAIAgent");
        const agent = await DeFAIAgent.deploy(owner.address, recipient.address, await mockFdc.getAddress(), conditionId);

        await owner.sendTransaction({
            to: await agent.getAddress(),
            value: ethers.parseEther("1.0")
        });

        const proof = ethers.toUtf8Bytes("valid_proof_data");

        await expect(agent.connect(other).execute(proof))
            .to.changeEtherBalances(
                [agent, recipient],
                [ethers.parseEther("-1.0"), ethers.parseEther("1.0")]
            );
    });

    it("Should fail on invalid proof", async function () {
        const [owner, recipient] = await ethers.getSigners();

        const MockFDC = await ethers.getContractFactory("MockFlareDataConnector");
        const mockFdc = await MockFDC.deploy();

        const conditionId = ethers.keccak256(ethers.toUtf8Bytes("CorrectEvent"));
        await mockFdc.setMockedEventId(ethers.keccak256(ethers.toUtf8Bytes("WrongEvent")));

        const DeFAIAgent = await ethers.getContractFactory("DeFAIAgent");
        const agent = await DeFAIAgent.deploy(owner.address, recipient.address, await mockFdc.getAddress(), conditionId);

        const proof = ethers.toUtf8Bytes("proof");

        await expect(agent.execute(proof)).to.be.revertedWith("Invalid proof condition");
    });
});
