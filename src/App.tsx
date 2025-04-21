import { CurrencyConverter } from './features/converter/components/CurrencyConverter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col" role="application" aria-label="Convertisseur de devises">
        <header className="bg-white shadow-sm" role="banner">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-green-800">Valora - Convertisseur de devises</h1>
          </div>
        </header>
        <main className="flex-grow" role="main" id="main-content">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<CurrencyConverter />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;
