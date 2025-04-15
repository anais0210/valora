import React from 'react';
import { useConverterStore } from '../store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ConversionHistory: React.FC = () => {
  const conversions = useConverterStore((state) => state.conversions);

  if (conversions.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6 bg-surface-light rounded-lg border-2 border-primary-100">
        Aucune conversion dans l'historique
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
        <h2 className="text-lg font-bold text-white">Historique des conversions</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {conversions.map((conversion, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-surface-light to-surface p-4 rounded-lg border-2 border-primary-100 hover:border-primary-300 transition-all duration-200"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-primary-600">{conversion.amount}</span>
                    <span className="text-primary-700">{conversion.from}</span>
                    <span className="text-primary-400">→</span>
                    <span className="font-bold text-primary-600">{conversion.result}</span>
                    <span className="text-primary-700">{conversion.to}</span>
                  </div>
                  <div className="text-sm text-primary-400">
                    {format(conversion.timestamp, 'PPp', { locale: fr })}
                  </div>
                </div>
                <div className="text-sm text-primary-500 bg-primary-50 rounded-md px-3 py-1 inline-block">
                  Taux: 1 {conversion.from} = {conversion.rate} {conversion.to}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 