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
  className = '',
}) => {
  const resultValue = conversion?.result
    ? `${conversion.result.toFixed(settings.decimalPlaces)} ${toCurrency}`
    : `0.${'0'.repeat(settings.decimalPlaces)} ${toCurrency}`;

  return (
    <div role="region" aria-label="Résultat de la conversion">
      <label className="block text-sm font-medium text-[var(--color-green-800)] mb-1">
        Résultat
      </label>
      <div
        className={`w-full px-4 py-2 bg-[var(--color-beige-light)] border border-[var(--color-green-200)] rounded-xl ${className}`}
        role="status"
        aria-live="polite"
      >
        {resultValue}
      </div>
    </div>
  );
};
