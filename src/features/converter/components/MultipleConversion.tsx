import React, { useState, useEffect } from 'react';
import { useConverterStore } from '../store';
import { ConverterService } from '../services/converterService';
import { Conversion } from '../types';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];

interface MultipleConversionProps {
  selectedFrom: string;
  selectedTo: string;
  onConversionsChange: (conversions: Conversion[]) => void;
}

export const MultipleConversion: React.FC<MultipleConversionProps> = ({
  selectedFrom,
  selectedTo,
  onConversionsChange,
}) => {
  const [amounts, setAmounts] = useState('');
  const [from, setFrom] = useState(selectedFrom);
  const [to, setTo] = useState(selectedTo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversions, setCurrentConversions] = useState<Conversion[]>([]);

  const settings = useConverterStore((state) => state.settings);
  const addConversion = useConverterStore((state) => state.addConversion);
  const converterService = ConverterService.getInstance(settings);

  // Mettre à jour les devises lorsque la sélection change
  useEffect(() => {
    setFrom(selectedFrom);
    setTo(selectedTo);
  }, [selectedFrom, selectedTo]);

  const parseAmounts = (input: string): number[] => {
    // Accepte les virgules, points-virgules, espaces comme séparateurs
    const values = input
      .split(/[,;\s]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => Number(v.replace(',', '.')))
      .filter(v => !isNaN(v));
    
    return values;
  };

  const handleConvertAll = async () => {
    setError(null);
    const values = parseAmounts(amounts);
    
    if (values.length === 0) {
      setError('Veuillez entrer au moins un montant valide');
      return;
    }

    setIsLoading(true);
    try {
      // Ajouter les conversions courantes à l'historique
      currentConversions.forEach(conversion => {
        addConversion(conversion);
      });

      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockRate = Math.random() * 2;

      const newConversions: Conversion[] = [];
      for (const amount of values) {
        const conversion = await converterService.convert(
          from,
          to,
          amount,
          mockRate
        );
        newConversions.push(conversion);
      }

      // Mettre à jour les conversions courantes
      setCurrentConversions(newConversions);
      onConversionsChange(newConversions);
    } catch (err) {
      setError('Une erreur est survenue lors de la conversion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAmounts('');
    setCurrentConversions([]);
    onConversionsChange([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-surface-light to-surface p-4 rounded-lg border-2 border-accent-100">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-accent-700 mb-2">
            Montants (séparés par des virgules, points-virgules ou espaces)
          </label>
          <textarea
            value={amounts}
            onChange={(e) => setAmounts(e.target.value)}
            className="block w-full px-4 py-3 text-lg border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-lg transition-all duration-200 min-h-[100px]"
            placeholder="Exemple: 100, 200, 300 ou 100 200 300"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-accent-700 mb-2">
              De
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="block w-full px-3 py-2 border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-md transition-all duration-200"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-accent-700 mb-2">
              Vers
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="block w-full px-3 py-2 border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-md transition-all duration-200"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Réinitialiser
        </button>
        <button
          onClick={handleConvertAll}
          disabled={isLoading || !amounts.trim()}
          className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Conversion...' : 'Convertir tout'}
        </button>
      </div>

      {/* Tableau des conversions courantes */}
      {currentConversions.length > 0 && (
        <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
            <h2 className="text-lg font-bold text-white">Résultats des conversions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">De</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Vers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Montant</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Résultat</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Taux</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentConversions.map((conversion, index) => (
                  <tr key={index} className="hover:bg-primary-50 transition-colors duration-200">
                    <td className="px-4 py-3 text-primary-700">{conversion.from}</td>
                    <td className="px-4 py-3 text-primary-700">{conversion.to}</td>
                    <td className="px-4 py-3 text-primary-700">{conversion.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-medium text-primary-700">{conversion.result.toFixed(2)}</td>
                    <td className="px-4 py-3 text-primary-600">{conversion.rate.toFixed(4)}</td>
                    <td className="px-4 py-3 text-primary-600">
                      {new Date(conversion.timestamp).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 