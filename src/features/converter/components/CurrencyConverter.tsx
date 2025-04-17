import React, { useState } from 'react';
import { ConversionHistory } from './ConversionHistory';
import { FavoritePairs } from './FavoritePairs';
import { DataManagement } from './DataManagement';
import { SingleConversion } from './SingleConversion';
import { MultipleConversion } from './MultipleConversion';
import { ExchangeRatesTable } from './ExchangeRatesTable';
import { useConverterStore } from '../store';

export const CurrencyConverter: React.FC = () => {
  const [conversionMode, setConversionMode] = useState<'single' | 'multiple'>('single');
  const { currentConversion, currentMultipleConversions, updateCurrencies } = useConverterStore();

  const handlePairSelection = (from: string, to: string) => {
    updateCurrencies(from, to);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale avec le convertisseur */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-light rounded-lg shadow-lg border-2 border-primary-200 p-6">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border-2 border-primary-200 p-1">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    conversionMode === 'single'
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setConversionMode('single')}
                >
                  Conversion simple
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    conversionMode === 'multiple'
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setConversionMode('multiple')}
                >
                  Conversion multiple
                </button>
              </div>
            </div>

            {conversionMode === 'single' ? <SingleConversion /> : <MultipleConversion />}
          </div>

          <ConversionHistory />
        </div>

        {/* Colonne latérale avec les favoris et la gestion des données */}
        <div className="space-y-8">
          <FavoritePairs onSelectPair={handlePairSelection} />
          <DataManagement
            currentConversion={currentConversion}
            currentMultipleConversions={currentMultipleConversions}
            conversionMode={conversionMode}
          />
          <ExchangeRatesTable />
        </div>
      </div>
    </div>
  );
};
