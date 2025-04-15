import { useState, useEffect } from 'react';
import { useConverterStore } from '../store';
import { Conversion } from '../types';
import { ConverterService } from '../services/converterService';
import { useConversionHistory } from './useConversionHistory';

export const useConversion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    currentConversion,
    fromCurrency,
    toCurrency,
    exchangeRate,
    settings,
    updateCurrencies,
    updateCurrentConversion,
    updateExchangeRate,
    addConversion
  } = useConverterStore();

  const converterService = ConverterService.getInstance(settings);

  useEffect(() => {
    const defaultRate = 1.2;
    updateExchangeRate(defaultRate);

    if (currentConversion) {
      const newResult = currentConversion.amount * defaultRate;
      const updatedConversion = {
        ...currentConversion,
        rate: defaultRate,
        result: newResult
      };
      updateCurrentConversion(updatedConversion);
      addConversion(updatedConversion);
    }
  }, []);

  const handleAmountChange = (amount: number) => {
    if (!isNaN(amount)) {
      const conversion = {
        from: fromCurrency,
        to: toCurrency,
        amount,
        rate: exchangeRate,
        timestamp: Date.now(),
        result: amount * exchangeRate
      };
      updateCurrentConversion(conversion);
      addConversion(conversion);
    }
  };

  const handleCurrencyChange = (from: string, to: string) => {
    updateCurrencies(from, to);
  };

  const handleReset = () => {
    updateCurrentConversion(null);
    setError(null);
  };

  return {
    isLoading,
    error,
    currentConversion,
    fromCurrency,
    toCurrency,
    exchangeRate,
    settings,
    handleAmountChange,
    handleCurrencyChange,
    handleReset,
    setError
  };
}; 