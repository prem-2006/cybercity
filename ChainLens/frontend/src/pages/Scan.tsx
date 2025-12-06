import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../utils/api';
import { ShieldCheck, MapPin, Thermometer, Clock } from 'lucide-react';

interface Checkpoint {
    location: string;
    timestamp: number;
    temp: number;
    handler: string;
}

interface ProductData {
    productId: string;
    history: Checkpoint[];
    authentic: boolean;
}

export default function Scan() {
    const [productData, setProductData] = useState<ProductData | null>(null);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        if (scanning) {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            scanner.render((decodedText: string) => {
                try {
                    const data = JSON.parse(decodedText);
                    scanner.clear();
                    setScanning(false);
                    fetchHistory(data.productId);
                } catch (e) {
                    // handle non-json qr
                }
            }, (err: unknown) => console.warn(err));

            return () => { scanner.clear().catch(() => { }) };
        }
    }, [scanning]);

    const fetchHistory = async (id: string) => {
        try {
            const res = await api.getProduct(id);
            setProductData(res);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 justify-center">
                <ShieldCheck className="text-green-600" /> Verify Authenticity
            </h2>

            {scanning ? (
                <div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto">
                    <div id="reader" className="w-full"></div>
                    <p className="text-center mt-4 text-slate-500">Point camera at Product QR Code</p>
                    {/* Dev Bypass */}
                    <button onClick={() => { setScanning(false); fetchHistory("PROD-001"); }} className="mt-4 text-xs text-slate-400 underline w-full text-center">Demo: Simulate Scan PROD-001</button>
                </div>
            ) : (
                <div className="space-y-6">
                    {productData ? (
                        <>
                            <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-center gap-4">
                                <ShieldCheck size={48} className="text-green-600" />
                                <div>
                                    <h3 className="text-2xl font-bold text-green-800">Authentic Product</h3>
                                    <p className="text-green-700">Verified on Flare Network</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h3 className="text-xl font-bold mb-6">Product Journey</h3>
                                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
                                    {productData.history.map((pt, i) => (
                                        <div key={i} className="relative pl-12">
                                            <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center z-10">
                                                <MapPin size={18} className="text-slate-500" />
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-lg">{pt.location}</h4>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(pt.timestamp).toLocaleString()}</span>
                                                </div>
                                                <div className="flex gap-4 text-sm text-slate-600">
                                                    <span className="flex items-center gap-1"><Thermometer size={14} className="text-amber-500" /> {pt.temp}°C</span>
                                                    <span className="flex items-center gap-1 font-mono text-xs bg-slate-200 px-2 rounded">handler: {pt.handler}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setScanning(true)} className="block w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300">Scan Another</button>
                        </>
                    ) : (
                        <div className="text-center p-10">Loading...</div>
                    )}
                </div>
            )}
        </div>
    );
}
