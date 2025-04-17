import React, { useState, useEffect } from 'react';
import { useConverterStore } from '../store';

export const ExchangeRatesTable: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useConverterStore();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        setRates(data.rates);
      } catch (err) {
        console.error('Erreur lors de la récupération des taux:', err);
        setError('Impossible de charger les taux de change');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des taux de change...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-light rounded-lg shadow-lg border-2 border-red-200 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const currencies = Object.keys(settings.availableCurrencies);

  return (
    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
        <h2 className="text-xl font-semibold text-white">Taux de change (EUR)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-100">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Devise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Taux
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary-100">
            {currencies.map(currency => (
              <tr key={currency} className="hover:bg-primary-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {settings.availableCurrencies[currency]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                  {currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rates[currency]?.toFixed(4) || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-primary-50 p-4 text-sm text-primary-600">
        Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
      </div>
    </div>
  );
}; 