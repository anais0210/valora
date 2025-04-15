import React, { useState } from 'react';
import { ConversionHistory } from './ConversionHistory';
import { FavoritePairs } from './FavoritePairs';
import { ExchangeRate } from './ExchangeRate';
import { DataManagement } from './DataManagement';
import { ConverterSettings } from './ConverterSettings';
import { SingleConversion } from './SingleConversion';
import { MultipleConversion } from './MultipleConversion';
import { useConverterStore } from '../store';

export const CurrencyConverter: React.FC = () => {
  const [conversionMode, setConversionMode] = useState<'single' | 'multiple'>('single');
  const { 
    currentConversion, 
    currentMultipleConversions,
    fromCurrency, 
    toCurrency, 
    exchangeRate, 
    settings,
    updateCurrencies 
  } = useConverterStore();

  const handlePairSelection = (from: string, to: string) => {
    updateCurrencies(from, to);
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
                <SingleConversion />
              ) : (
                <MultipleConversion />
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