import React from 'react';
import { ConverterSettings } from '../types';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  settings: ConverterSettings;
  className?: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  label,
  settings,
  className = '',
}) => {
  const id = `currency-select-${label.toLowerCase()}`;
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-green-800)] mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-2 border border-[var(--color-gray-300)] rounded-xl focus:ring-2 focus:ring-[var(--color-green-500)] focus:border-[var(--color-green-500)] transition-all duration-200 ease-in-out ${className}`}
        aria-label={`Sélectionner la devise ${label.toLowerCase()}`}
      >
        {settings?.availableCurrencies &&
          Object.keys(settings.availableCurrencies).map(currency => (
            <option key={currency} value={currency}>
              {currency} - {settings.availableCurrencies[currency]}
            </option>
          ))}
      </select>
    </div>
  );
};
