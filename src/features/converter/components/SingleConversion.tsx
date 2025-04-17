import React, { useState, useEffect } from 'react';
import { CurrencySelect } from './CurrencySelect';
import { ConversionResult } from './ConversionResult';
import { useConversion } from '../hooks/useConversion';

export const SingleConversion: React.FC = () => {
  const {
    currentConversion,
    fromCurrency,
    toCurrency,
    settings,
    handleAmountChange,
    handleCurrencyChange,
    handleReset,
  } = useConversion();
  
  const [localAmount, setLocalAmount] = useState<string>('');
  
  useEffect(() => {
    if (currentConversion?.amount !== undefined) {
      setLocalAmount(currentConversion.amount.toString());
    } else {
      setLocalAmount('');
    }
  }, [currentConversion?.amount]);

  return (
    <div className="space-y-6">
      <div className="single-conversion-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant
            </label>
            <input
              type="text"
              id="amount"
              value={localAmount}
              onChange={e => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setLocalAmount(value);
                  if (value !== '') {
                    handleAmountChange(parseFloat(value));
                  }
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Entrez un montant"
            />
          </div>

          <CurrencySelect
            value={fromCurrency}
            onChange={value => handleCurrencyChange(value, toCurrency)}
            label="De"
            settings={settings}
          />

          <CurrencySelect
            value={toCurrency}
            onChange={value => handleCurrencyChange(fromCurrency, value)}
            label="Vers"
            settings={settings}
          />

          <ConversionResult
            conversion={currentConversion}
            toCurrency={toCurrency}
            settings={settings}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};
