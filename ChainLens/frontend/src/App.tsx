import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Manufacturer from './pages/Manufacturer';
import Distributor from './pages/Distributor';
import Scan from './pages/Scan';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manufacturer" element={<Manufacturer />} />
            <Route path="/distributor" element={<Distributor />} />
            <Route path="/scan" element={<Scan />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
