import { ethers } from "hardhat";

async function main() {
    const FDC_ADDRESS = "0x0000000000000000000000000000000000000001";
    const CONDITION_ID = ethers.keccak256(ethers.toUtf8Bytes("TargetEvent"));
    const [deployer] = await ethers.getSigners();
    const recipient = deployer.address;

    console.log("Deploying contracts with the account:", deployer.address);

    const DeFAIAgent = await ethers.getContractFactory("DeFAIAgent");
    const agent = await DeFAIAgent.deploy(
        deployer.address,
        recipient,
        FDC_ADDRESS,
        CONDITION_ID
    );

    await agent.waitForDeployment();

    console.log("DeFAIAgent deployed to:", await agent.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
