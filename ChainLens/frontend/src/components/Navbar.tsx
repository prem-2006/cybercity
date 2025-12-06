import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Truck, ScanLine } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-slate-900 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-red-500">
                    <ShieldCheck size={32} />
                    <span>ChainLens</span>
                </Link>
                <div className="flex gap-6">
                    <Link to="/manufacturer" className="flex items-center gap-1 hover:text-red-400 transition">
                        <Package size={18} /> Manufacturer
                    </Link>
                    <Link to="/distributor" className="flex items-center gap-1 hover:text-red-400 transition">
                        <Truck size={18} /> Logistics
                    </Link>
                    <Link to="/scan" className="flex items-center gap-1 hover:text-red-400 transition">
                        <ScanLine size={18} /> Verify
                    </Link>
                </div>
            </div>
        </nav>
    );
}
