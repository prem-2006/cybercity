import express, { Request, Response } from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
// In a real app, importing TypeChain types or ABI json is needed.
// For prototype, we might include the ABI inline or read from file.

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- MOCK DATABASE / STATE for simple prototype integration if blockchain is slow ---
// In production, everything reads from blockchain.
// Here we might cache it.

app.get('/', (req: Request, res: Response) => {
    res.send('ChainLens Backend is Running');
});

// --- API: Register Product ---
app.post('/register', async (req: Request, res: Response) => {
    try {
        const { productId, batchId, metaHash, signature } = req.body;
        // Verify signature (Flare Smart Account logic)
        // Submit tx to blockchain (or return payload for frontend to submit)

        // For Hackathon Demo: Return success and generated QR data

        const qrData = JSON.stringify({ productId, metaHash });
        const qrImage = await QRCode.toDataURL(qrData);

        res.json({ success: true, productId, qrImage, txHash: "0x123...mock" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// --- API: Update Checkpoint ---
app.post('/checkpoint', async (req: Request, res: Response) => {
    try {
        const { productId, location, status } = req.body;

        // In real flow: Validate user role via signature
        // Fetch FTSO data (simulated here or in contract)

        res.json({ success: true, message: "Checkpoint updated", location, timestamp: Date.now() });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// --- API: Fetch Product History (Scan) ---
app.get('/product/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    // Mock History Replay
    const history = [
        { location: "Factory", temp: 20, timestamp: Date.now() - 100000, handler: "Manufacturer" },
        { location: "London Warehouse", temp: 18, timestamp: Date.now(), handler: "Distributor" }
    ];

    res.json({ productId: id, history, authentic: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
