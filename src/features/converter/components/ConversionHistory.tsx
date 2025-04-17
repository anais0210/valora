import React from 'react';
import { useConverterStore } from '../store';
import { Conversion, ConverterSettings } from '../types';
import { ConverterService } from '../services/converterService';

export const ConversionHistory: React.FC = () => {
  const { conversions, settings } = useConverterStore();
  const converterService = ConverterService.getInstance(settings);

  const handleExportExcel = async () => {
    try {
      const blob = await converterService.exportToExcel(
        conversions,
        conversions[0]?.from || 'EUR',
        conversions[0]?.to || 'USD'
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversions_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
    }
  };

  const handleCopyToClipboard = async (conversion: Conversion) => {
    try {
      const text = `${conversion.amount} ${conversion.from} = ${conversion.result} ${conversion.to}`;
      await converterService.copyToClipboard(text);
      alert('Copié dans le presse-papier !');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  if (conversions.length === 0) {
    return (
      <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 p-6 text-center">
        <p className="text-gray-500">Aucune conversion dans l'historique</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Historique des conversions</h2>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Exporter Excel
        </button>
      </div>
      <div className="divide-y divide-primary-100">
        {conversions.map((conversion, index) => (
          <div
            key={index}
            className="p-4 hover:bg-primary-50 transition-colors flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{conversion.amount}</span>
                <span className="text-primary-600">{conversion.from}</span>
                <span className="text-gray-400">→</span>
                <span className="font-medium">{conversion.result}</span>
                <span className="text-primary-600">{conversion.to}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Taux: {conversion.rate} • {new Date(conversion.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyToClipboard(conversion)}
                className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                title="Copier dans le presse-papier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
