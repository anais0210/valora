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
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${className}`}
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
