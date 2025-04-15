import React, { useState, useEffect } from 'react';
import { ConversionHistory } from './ConversionHistory';
import { FavoritePairs } from './FavoritePairs';
import { ExchangeRate } from './ExchangeRate';
import { DataManagement } from './DataManagement';
import { ConverterSettings } from './ConverterSettings';
import { useConverterStore } from '../store';
import { Conversion } from '../types';
import { ConverterService } from '../services/converterService';

export const CurrencyConverter: React.FC = () => {
  const [conversionMode, setConversionMode] = useState<'single' | 'multiple'>('single');
  const [multipleAmounts, setMultipleAmounts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentConversion = useConverterStore((state) => state.currentConversion);
  const currentMultipleConversions = useConverterStore((state) => state.currentMultipleConversions);
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const exchangeRate = useConverterStore((state) => state.exchangeRate);
  const settings = useConverterStore((state) => state.settings);
  const updateCurrencies = useConverterStore((state) => state.updateCurrencies);
  const updateCurrentMultipleConversions = useConverterStore((state) => state.updateCurrentMultipleConversions);
  const updateCurrentConversion = useConverterStore((state) => state.updateCurrentConversion);
  const addConversion = useConverterStore((state) => state.addConversion);
  const updateExchangeRate = useConverterStore((state) => state.updateExchangeRate);
  
  const converterService = ConverterService.getInstance(settings);

  useEffect(() => {
    // Initialiser le taux de change avec une valeur par défaut
    const defaultRate = 1.2; // Taux EUR/USD par défaut
    updateExchangeRate(defaultRate);

    // Mettre à jour le résultat si une conversion existe
    if (currentConversion) {
      const newResult = currentConversion.amount * defaultRate;
      updateCurrentConversion({
        ...currentConversion,
        rate: defaultRate,
        result: newResult
      });
    }
  }, []);

  useEffect(() => {
    console.log('Settings:', settings);
    console.log('Available Currencies:', settings?.availableCurrencies);
  }, [settings]);

  const handlePairSelection = (from: string, to: string) => {
    updateCurrencies(from, to);
  };

  const handleMultipleConversionsChange = (conversions: Conversion[]) => {
    const updatedConversions = conversions.map(conversion => ({
      from: conversion.from,
      to: conversion.to,
      amount: conversion.amount,
      rate: exchangeRate,
      timestamp: Date.now(),
      result: conversion.amount * exchangeRate
    }));
    updateCurrentMultipleConversions(updatedConversions);
  };

  const parseAmounts = (input: string): number[] => {
    // Accepte les virgules, points-virgules, espaces comme séparateurs
    const values = input
      .split(/[,;\s]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => Number(v.replace(',', '.')))
      .filter(v => !isNaN(v));
    
    return values;
  };

  const handleConvertAll = async () => {
    setError(null);
    const values = parseAmounts(multipleAmounts);
    
    if (values.length === 0) {
      setError('Veuillez entrer au moins un montant valide');
      return;
    }

    setIsLoading(true);
    try {
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newConversions: Conversion[] = [];
      for (const amount of values) {
        const conversion = {
          from: fromCurrency,
          to: toCurrency,
          amount,
          rate: exchangeRate,
          timestamp: Date.now(),
          result: amount * exchangeRate
        };
        newConversions.push(conversion);
        addConversion(conversion);
      }

      // Mettre à jour les conversions courantes
      handleMultipleConversionsChange(newConversions);
    } catch (err) {
      setError('Une erreur est survenue lors de la conversion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMultipleAmounts('');
    updateCurrentMultipleConversions([]);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale avec le convertisseur */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-light rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-primary-600 mb-6">Convertisseur de Devises</h1>
            
            {/* Sélecteur de mode */}
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  conversionMode === 'single'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setConversionMode('single')}
              >
                Conversion Simple
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  conversionMode === 'multiple'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setConversionMode('multiple')}
              >
                Conversions Multiples
              </button>
            </div>

            <div>
              {conversionMode === 'single' ? (
                <div className="space-y-6">
                  <div className="single-conversion-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Montant
                        </label>
                        <input
                          type="number"
                          id="amount"
                          value={currentConversion?.amount || ''}
                          onChange={(e) => {
                            const amount = parseFloat(e.target.value);
                            if (!isNaN(amount)) {
                              updateCurrentConversion({
                                from: fromCurrency,
                                to: toCurrency,
                                amount,
                                rate: exchangeRate,
                                timestamp: Date.now(),
                                result: amount * exchangeRate
                              });
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Entrez un montant"
                        />
                      </div>
                      <div>
                        <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                          De
                        </label>
                        <select
                          id="fromCurrency"
                          value={fromCurrency}
                          onChange={(e) => updateCurrencies(e.target.value, toCurrency)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {settings?.availableCurrencies && Object.keys(settings.availableCurrencies).map((currency) => (
                            <option key={currency} value={currency}>
                              {currency} - {settings.availableCurrencies[currency]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                          Vers
                        </label>
                        <select
                          id="toCurrency"
                          value={toCurrency}
                          onChange={(e) => updateCurrencies(fromCurrency, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {settings?.availableCurrencies && Object.keys(settings.availableCurrencies).map((currency) => (
                            <option key={currency} value={currency}>
                              {currency} - {settings.availableCurrencies[currency]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Résultat
                        </label>
                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                          {currentConversion?.result ? 
                            `${currentConversion.result.toFixed(settings.decimalPlaces)} ${toCurrency}` : 
                            `0.${'0'.repeat(settings.decimalPlaces)} ${toCurrency}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ExchangeRate
                    from={fromCurrency}
                    to={toCurrency}
                    rate={exchangeRate}
                    isOffline={settings.isOfflineMode}
                  />
                  <ConverterSettings />
                </div>
              ) : (
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
                      <div>
                        <label className="block text-sm font-semibold text-accent-700 mb-2">
                          De
                        </label>
                        <select
                          value={fromCurrency}
                          onChange={(e) => updateCurrencies(e.target.value, toCurrency)}
                          className="block w-full px-3 py-2 border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-md transition-all duration-200"
                        >
                          {settings?.availableCurrencies && Object.keys(settings.availableCurrencies).map((currency) => (
                            <option key={currency} value={currency}>
                              {currency} - {settings.availableCurrencies[currency]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-accent-700 mb-2">
                          Vers
                        </label>
                        <select
                          value={toCurrency}
                          onChange={(e) => updateCurrencies(fromCurrency, e.target.value)}
                          className="block w-full px-3 py-2 border-2 border-accent-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-400 rounded-md transition-all duration-200"
                        >
                          {settings?.availableCurrencies && Object.keys(settings.availableCurrencies).map((currency) => (
                            <option key={currency} value={currency}>
                              {currency} - {settings.availableCurrencies[currency]}
                            </option>
                          ))}
                        </select>
                      </div>
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

                  {/* Affichage des conversions multiples */}
                  {currentMultipleConversions.length > 0 && (
                    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
                        <h2 className="text-lg font-bold text-white">Résultats des conversions</h2>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-primary-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">De</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Vers</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Montant</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Résultat</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Taux</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentMultipleConversions.map((conversion, index) => (
                              <tr key={index} className="hover:bg-primary-50 transition-colors duration-200">
                                <td className="px-4 py-3 text-primary-700">{conversion.from}</td>
                                <td className="px-4 py-3 text-primary-700">{conversion.to}</td>
                                <td className="px-4 py-3 text-primary-700">{conversion.amount.toFixed(2)}</td>
                                <td className="px-4 py-3 font-medium text-primary-700">{conversion.result.toFixed(2)}</td>
                                <td className="px-4 py-3 text-primary-600">{conversion.rate.toFixed(4)}</td>
                                <td className="px-4 py-3 text-primary-600">
                                  {new Date(conversion.timestamp).toLocaleString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <DataManagement 
                currentConversion={currentConversion}
                currentMultipleConversions={currentMultipleConversions}
                conversionMode={conversionMode}
              />
            </div>
          </div>
        </div>

        {/* Colonne de droite avec historique et favoris */}
        <div className="space-y-6">
          <ConversionHistory />
          <FavoritePairs onSelectPair={handlePairSelection} />
        </div>
      </div>
    </div>
  );
}; 