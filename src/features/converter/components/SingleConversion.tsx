import React from 'react';
import { CurrencySelect } from './CurrencySelect';
import { ConversionResult } from './ConversionResult';
import { useConversion } from '../hooks/useConversion';
import { useConverterStore } from '../store';

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

  const { addFavorite } = useConverterStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      handleAmountChange(amount);
    }
  };

  const localAmount = currentConversion?.amount?.toString() || '';

  return (
    <div className="space-y-6">
      <div className="single-conversion-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-green-800)] mb-2">
              Montant
            </label>
            <input
              type="text"
              id="amount"
              value={localAmount}
              onChange={handleInputChange}
              className="block w-full px-4 py-3 text-lg border-2 border-[var(--color-green-200)] focus:border-[var(--color-green-500)] focus:ring-2 focus:ring-[var(--color-green-400)] rounded-xl transition-all duration-200 ease-in-out"
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

        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={() => {
              const favorite = {
                from: fromCurrency,
                to: toCurrency,
                id: `${fromCurrency}-${toCurrency}-${Date.now()}`,
              };
              addFavorite(favorite);
            }}
            className="px-6 py-3 bg-[var(--color-amber-100)] hover:bg-[var(--color-amber-200)] text-[var(--color-amber-800)] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Ajouter aux favoris
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-[var(--color-gray-100)] hover:bg-[var(--color-gray-200)] text-[var(--color-gray-700)] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center gap-2"
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
