import { useState } from 'react';
import { api } from '../utils/api';
import { PackagePlus, QrCode } from 'lucide-react';

export default function Manufacturer() {
    const [productId, setProductId] = useState('');
    const [batchId, setBatchId] = useState('');
    const [qrImage, setQrImage] = useState('');
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.registerProduct(productId, batchId, "QmMockHash");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((res as any).success) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setQrImage((res as any).qrImage);
            }
        } catch (err) {
            console.error(err);
            alert("Registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <PackagePlus className="text-red-600" /> Manufacturer Portal
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-md">
                    <h3 className="text-xl font-semibold mb-6">Register New Product</h3>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product ID (GTIN/UUID)</label>
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={productId} onChange={e => setProductId(e.target.value)}
                                placeholder="PROD-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Batch ID</label>
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={batchId} onChange={e => setBatchId(e.target.value)}
                                placeholder="101"
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            {loading ? "Registering..." : "Register Product"}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-xl font-semibold mb-6">Generated Identity</h3>
                    {qrImage ? (
                        <div className="text-center">
                            <img src={qrImage} alt="QR Code" className="w-48 h-48 mb-4 mx-auto border" />
                            <p className="text-sm text-slate-500">Scan to track or verify</p>
                            <a href={qrImage} download="qr.png" className="text-red-600 underline text-sm mt-2 block">Download QR</a>
                        </div>
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <QrCode size={64} className="mb-4 opacity-20" />
                            <p>Register a product to generate QR</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
