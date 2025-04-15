import React from 'react';
import { useConversionHistory } from '../hooks/useConversionHistory';

export const ConversionHistory: React.FC = () => {
  const { conversions } = useConversionHistory();

  if (conversions.length === 0) {
    return (
      <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
          <h2 className="text-lg font-bold text-white">Historique des Conversions</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          Aucune conversion dans l'historique
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
        <h2 className="text-lg font-bold text-white">Historique des Conversions</h2>
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
            {conversions.map((conversion, index) => (
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
  );
}; 