
import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainLens, MockFtsoRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ChainLens", function () {
    let chainLens: ChainLens;
    let mockFtso: MockFtsoRegistry;
    let owner: HardhatEthersSigner;
    let manufacturer: HardhatEthersSigner;
    let distributor: HardhatEthersSigner;
    let retailer: HardhatEthersSigner;
    let consumer: HardhatEthersSigner;

    const MANUFACTURER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MANUFACTURER_ROLE"));
    const DISTRIBUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR_ROLE"));
    const RETAILER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RETAILER_ROLE"));

    before(async function () {
        [owner, manufacturer, distributor, retailer, consumer] = await ethers.getSigners();

        // Deploy Mock FTSO
        const MockFtso = await ethers.getContractFactory("MockFtsoRegistry");
        // Set mock price to 30000 (representing 30.00 C for simplicity logic in contract)
        mockFtso = (await MockFtso.deploy(30000)) as unknown as MockFtsoRegistry;

        // Deploy ChainLens
        const ChainLensFactory = await ethers.getContractFactory("ChainLens");
        chainLens = (await ChainLensFactory.deploy(await mockFtso.getAddress())) as unknown as ChainLens;
    });

    it("Should setup roles correctly", async function () {
        await chainLens.grantRole(MANUFACTURER_ROLE, manufacturer.address);
        await chainLens.grantRole(DISTRIBUTOR_ROLE, distributor.address);
        await chainLens.grantRole(RETAILER_ROLE, retailer.address);

        expect(await chainLens.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.true;
        expect(await chainLens.hasRole(DISTRIBUTOR_ROLE, distributor.address)).to.be.true;
    });

    it("Should register a product", async function () {
        const metaHash = "QmTestHash123";
        const productId = "PROD-001";
        const batchId = 101;

        await chainLens.connect(manufacturer).registerProduct(productId, metaHash, batchId);

        const product = await chainLens.getProduct(productId);
        expect(product.metaHash).to.equal(metaHash);
        expect(product.status).to.equal(0); // Created
        expect(product.currentHolder).to.equal(manufacturer.address);
    });

    it("Should not allow unauthorized registration", async function () {
        const productId = "PROD-FAKE";
        await expect(
            chainLens.connect(consumer).registerProduct(productId, "hash", 999)
        ).to.be.reverted; // AccessControl revert style varies, checking general revert
    });

    it("Should update checkpoint and fetch FTSO temp", async function () {
        // Distributor updates
        const productId = "PROD-001";
        const location = "Warehouse A, London";

        // Simulate FTSO price change implies temp change in our logic
        // Price 30000 -> 30 degrees

        await expect(chainLens.connect(distributor).updateCheckpoint(productId, location, 2)) // 2 = InStorage
            .to.emit(chainLens, "CheckpointAdded")
            .withArgs(productId, distributor.address, location, 2);

        const history = await chainLens.getProductHistory(productId);
        const latest = history[history.length - 1]; // 0 is factory, 1 is this one

        expect(latest.handler).to.equal(distributor.address);
        expect(latest.temperature).to.equal(30); // 30000 / 1000 % 40 = 30
    });
});
