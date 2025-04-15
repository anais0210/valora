import { useState } from 'react';
import { useConverterStore } from '../store';
import { Conversion } from '../types';
import { useConversionHistory } from './useConversionHistory';

export const useMultipleConversion = () => {
  const [multipleAmounts, setMultipleAmounts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    fromCurrency,
    toCurrency,
    exchangeRate,
    updateCurrentMultipleConversions,
    addConversion
  } = useConverterStore();

  const { updateMultipleHistory } = useConversionHistory();

  const parseAmounts = (input: string): number[] => {
    return input
      .split(/[,;\s]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => Number(v.replace(',', '.')))
      .filter(v => !isNaN(v));
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newConversions: Conversion[] = values.map(amount => ({
        from: fromCurrency,
        to: toCurrency,
        amount,
        rate: exchangeRate,
        timestamp: Date.now(),
        result: amount * exchangeRate
      }));

      updateCurrentMultipleConversions(newConversions);
      newConversions.forEach(conversion => {
        addConversion(conversion);
      });
      updateMultipleHistory(newConversions);
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

  return {
    multipleAmounts,
    setMultipleAmounts,
    isLoading,
    error,
    handleConvertAll,
    handleReset
  };
}; 