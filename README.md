# DeFAI Agent (Flare Network)

## Concept
The "DeFAI" (Decentralized Finance AI) Play. This is a Conditional Execution Agent wallet that executes transactions on the Flare Network based on events verified by the **Flare Data Connector (FDC)**.

## Features
- **Flare Data Connector Integration**: Proves external events (e.g., Bitcoin transactions, Web2 API attestations).
- **Conditional Payouts**: Holdings are released only when valid proofs are submitted.
- **Strict Code Style**: Codebase maintains a strict "No Comments" policy as per requirements.

## Project Structure
- `contracts/`: Smart contracts (Agent and Interfaces).
- `test/`: Hardhat tests with Mock FDC.
- `scripts/`: Deployment scripts.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Test**
   ```bash
   npx hardhat test
   ```

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.ts --network coston2
   ```

## Configuration
Update `hardhat.config.ts` with your private key (use `.env` recommended) to deploy to live networks.
