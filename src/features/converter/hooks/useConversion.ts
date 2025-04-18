import { useState, useEffect, useCallback } from 'react';
import { useConverterStore } from '../store';
import { Conversion } from '../types';

export const useConversion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const {
    currentConversion,
    fromCurrency,
    toCurrency,
    exchangeRate,
    settings,
    updateCurrencies,
    updateCurrentConversion,
    updateExchangeRate,
    addConversion,
  } = useConverterStore();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();

        // Si la devise source est EUR, on utilise directement le taux de la devise cible
        // Sinon, on calcule le taux croisé via EUR
        const rate =
          fromCurrency === 'EUR'
            ? data.rates[toCurrency]
            : data.rates[toCurrency] / data.rates[fromCurrency];

        updateExchangeRate(rate);

        // Ne mettre à jour la conversion que si elle existe et que le montant est défini
        if (currentConversion && currentConversion.amount !== undefined) {
          const newResult = currentConversion.amount * rate;
          const updatedConversion = {
            ...currentConversion,
            rate,
            result: newResult,
          };
          updateCurrentConversion(updatedConversion);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du taux de change:', err);
        setError('Impossible de récupérer le taux de change');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency, updateExchangeRate]);

  // Effet séparé pour mettre à jour le résultat lorsque le taux de change ou la conversion change
  useEffect(() => {
    if (currentConversion && currentConversion.amount !== undefined && exchangeRate) {
      const newResult = currentConversion.amount * exchangeRate;
      const updatedConversion = {
        ...currentConversion,
        rate: exchangeRate,
        result: newResult,
      };
      updateCurrentConversion(updatedConversion);
    }
  }, [exchangeRate, currentConversion?.amount, updateCurrentConversion]);

  const debouncedAddConversion = useCallback(
    (conversion: Conversion) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        addConversion(conversion);
      }, 500);

      setDebounceTimer(timer);
    },
    [debounceTimer, addConversion]
  );

  const handleAmountChange = (amount: number) => {
    if (!isNaN(amount)) {
      const conversion = {
        from: fromCurrency,
        to: toCurrency,
        amount,
        rate: exchangeRate,
        timestamp: Date.now(),
        result: amount * exchangeRate,
      };
      updateCurrentConversion(conversion);
      debouncedAddConversion(conversion);
    }
  };

  const handleCurrencyChange = (from: string, to: string) => {
    updateCurrencies(from, to);
  };

  const handleReset = () => {
    updateCurrentConversion(null);
    setError(null);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
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
    setError,
  };
};
