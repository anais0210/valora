import React from 'react';
import { Conversion, ConverterSettings } from '../types';

interface ConversionResultProps {
  conversion: Conversion | null;
  toCurrency: string;
  settings: ConverterSettings;
  className?: string;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  conversion,
  toCurrency,
  settings,
  className = ''
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Résultat
      </label>
      <div className={`w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg ${className}`}>
        {conversion?.result ? 
          `${conversion.result.toFixed(settings.decimalPlaces)} ${toCurrency}` : 
          `0.${'0'.repeat(settings.decimalPlaces)} ${toCurrency}`}
      </div>
    </div>
  );
}; 