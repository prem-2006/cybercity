import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Clock } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                Supply Chain Transparency <br /> on Flare Network
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mb-10">
                ChainLens uses Flare Smart Accounts and FTSO to track products from factory to consumer, ensuring authenticity and optimal storage conditions.
            </p>

            <div className="flex gap-4 mb-20">
                <Link to="/scan" className="px-8 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 transition flex items-center gap-2">
                    Verify Product <ArrowRight size={20} />
                </Link>
                <Link to="/manufacturer" className="px-8 py-3 bg-white text-slate-800 border border-slate-300 rounded-full font-bold shadow-sm hover:bg-slate-50 transition">
                    Manufacturer Portal
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                <FeatureCard
                    icon={<Shield className="text-red-500" size={40} />}
                    title="Anti-Counterfeit"
                    desc="Immutable blockchain records prove product origin and authenticity."
                />
                <FeatureCard
                    icon={<Globe className="text-blue-500" size={40} />}
                    title="Global Tracking"
                    desc="Real-time location and status updates across the supply chain."
                />
                <FeatureCard
                    icon={<Clock className="text-amber-500" size={40} />}
                    title="Condition Monitoring"
                    desc="FTSO data confirms temperature and weather conditions during transit."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-slate-50 rounded-full">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-slate-600">{desc}</p>
        </div>
    );
}
