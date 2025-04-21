import { CurrencyConverter } from './features/converter/components/CurrencyConverter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<CurrencyConverter />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;
