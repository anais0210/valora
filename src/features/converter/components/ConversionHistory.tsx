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
      <div
        className="bg-[var(--color-beige-light)] rounded-xl p-4 border-2 border-[var(--color-green-200)] text-center shadow-sm"
        role="region"
        aria-label="Historique des conversions"
      >
        <p className="text-[var(--color-green-800)]">Aucune conversion enregistrée</p>
      </div>
    );
  }

  // Grouper les conversions par jour
  const groupedConversions = conversions.reduce(
    (groups, conversion) => {
      const date = new Date(conversion.timestamp).toLocaleDateString('fr-FR');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(conversion);
      return groups;
    },
    {} as Record<string, typeof conversions>
  );

  return (
    <div
      className="bg-[var(--color-beige-light)] rounded-xl shadow-md border-2 border-[var(--color-green-200)] overflow-hidden"
      role="region"
      aria-label="Historique des conversions"
    >
      <div className="bg-gradient-to-r from-[var(--color-green-500)] to-[var(--color-green-600)] p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
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
            className="px-3 py-1 bg-white text-[var(--color-green-600)] rounded-xl hover:bg-[var(--color-green-50)] transition-colors text-sm"
            aria-label="Exporter l'historique au format Excel"
          >
            Exporter Excel
          </button>
          <button
            onClick={handleResetHistory}
            className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm"
            aria-label="Réinitialiser l'historique des conversions"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="divide-y divide-[var(--color-green-100)]" role="list">
        {Object.entries(groupedConversions).map(([date, dayConversions]) => (
          <div key={date} className="p-4" role="group" aria-label={`Conversions du ${date}`}>
            <h3 className="text-sm font-semibold text-[var(--color-green-800)] mb-2">{date}</h3>
            <div className="space-y-3">
              {dayConversions.map((conversion, index) => (
                <div
                  key={`${conversion.from}-${conversion.to}-${conversion.timestamp}-${index}`}
                  className="p-3 bg-white rounded-lg hover:bg-[var(--color-amber-50)] transition-all duration-200 ease-in-out"
                  role="listitem"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[var(--color-green-800)]">
                          {conversion.from}
                        </span>
                        <span className="text-[var(--color-amber-600)]" aria-hidden="true">
                          →
                        </span>
                        <span className="font-medium text-[var(--color-green-800)]">
                          {conversion.to}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--color-green-700)]">
                        {conversion.amount.toFixed(settings.decimalPlaces)} {conversion.from} ={' '}
                        <span className="font-semibold">
                          {conversion.result.toFixed(settings.decimalPlaces)} {conversion.to}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-green-600)]">
                        Taux: 1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}
                      </div>
                    </div>
                    <div className="text-xs text-[var(--color-amber-600)]">
                      {new Date(conversion.timestamp).toLocaleTimeString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
