import React from 'react';
import { useConverterStore } from '../store';
import { ConverterService } from '../services/converterService';

export const ConversionHistory: React.FC = () => {
  const { conversions, settings, resetConversions } = useConverterStore();
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
      console.error("Erreur lors de l'export Excel:", error);
    }
  };

  const handleResetHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer tout l'historique des conversions ?")) {
      resetConversions();
    }
  };

  if (conversions.length === 0) {
    return (
      <div className="bg-surface-light rounded-lg p-4 border-2 border-primary-200 text-center">
        <p className="text-primary-600">Aucune conversion enregistrée</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          Historique des conversions
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-1 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm"
          >
            Exporter Excel
          </button>
          <button
            onClick={handleResetHistory}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="divide-y divide-primary-100">
        {conversions.map((conversion, index) => (
          <div
            key={`${conversion.from}-${conversion.to}-${conversion.timestamp}-${index}`}
            className="p-4 bg-gradient-to-r from-surface-light to-surface hover:from-primary-50 hover:to-primary-100 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-primary-700">{conversion.from}</span>
                  <span className="text-primary-400">→</span>
                  <span className="font-medium text-primary-700">{conversion.to}</span>
                </div>
                <div className="text-sm text-primary-600">
                  {conversion.amount.toFixed(settings.decimalPlaces)} {conversion.from} ={' '}
                  <span className="font-semibold">
                    {conversion.result.toFixed(settings.decimalPlaces)} {conversion.to}
                  </span>
                </div>
                <div className="text-xs text-primary-500">
                  Taux: 1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}
                </div>
              </div>
              <div className="text-xs text-primary-400">
                {new Date(conversion.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
