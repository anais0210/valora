import React from 'react';
import { CurrencySelect } from './CurrencySelect';
import { useMultipleConversion } from '../hooks/useMultipleConversion';
import { useConverterStore } from '../store';

export const MultipleConversion: React.FC = () => {
  const {
    multipleAmounts,
    setMultipleAmounts,
    isLoading,
    error,
    handleConvertAll,
    handleReset
  } = useMultipleConversion();

  const { fromCurrency, toCurrency, settings, updateCurrencies } = useConverterStore();

  return (
    <div className="multiple-conversion-container">
      <div className="bg-gradient-to-r from-surface-light to-surface p-4 rounded-lg border-2 border-accent-100 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-accent-700 mb-2">
            Montants (séparés par des virgules, points-virgules ou espaces)
          </label>
          <textarea
            value={multipleAmounts}
            onChange={(e) => setMultipleAmounts(e.target.value)}
            className="block w-full px-4 py-3 text-lg border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-lg transition-all duration-200 min-h-[100px]"
            placeholder="Exemple: 100, 200, 300 ou 100 200 300"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencySelect
            value={fromCurrency}
            onChange={(value) => updateCurrencies(value, toCurrency)}
            label="De"
            settings={settings}
            className="block w-full px-3 py-2 border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-md transition-all duration-200"
          />

          <CurrencySelect
            value={toCurrency}
            onChange={(value) => updateCurrencies(fromCurrency, value)}
            label="Vers"
            settings={settings}
            className="block w-full px-3 py-2 border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-md transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Réinitialiser
        </button>
        <button
          onClick={handleConvertAll}
          disabled={isLoading || !multipleAmounts.trim()}
          className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Conversion...' : 'Convertir tout'}
        </button>
      </div>
    </div>
  );
}; 