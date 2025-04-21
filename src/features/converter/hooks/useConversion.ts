import { useState, useEffect, useCallback, useRef } from 'react';
import { useConverterStore } from '../store';
import { Conversion } from '../types';

export const useConversion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const prevCurrenciesRef = useRef({ from: '', to: '' });

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

  // Utiliser useCallback pour la fonction fetchExchangeRate
  const fetchExchangeRate = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();

      const rate =
        fromCurrency === 'EUR'
          ? data.rates[toCurrency]
          : data.rates[toCurrency] / data.rates[fromCurrency];

      updateExchangeRate(rate);
    } catch (err) {
      console.error('Erreur lors de la récupération du taux de change:', err);
      setError('Impossible de récupérer le taux de change');
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency, updateExchangeRate]);

  // Effet pour récupérer le taux de change uniquement quand les devises changent
  useEffect(() => {
    // Vérifier si les devises ont réellement changé
    if (
      prevCurrenciesRef.current.from === fromCurrency &&
      prevCurrenciesRef.current.to === toCurrency
    ) {
      return;
    }

    // Mettre à jour la référence
    prevCurrenciesRef.current = { from: fromCurrency, to: toCurrency };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency, fetchExchangeRate]);

  // Effet pour mettre à jour la conversion quand le taux change
  useEffect(() => {
    if (currentConversion?.amount !== undefined && exchangeRate) {
      const newResult = currentConversion.amount * exchangeRate;
      const updatedConversion = {
        ...currentConversion,
        rate: exchangeRate,
        result: newResult,
      };
      updateCurrentConversion(updatedConversion);
    }
  }, [exchangeRate, currentConversion, updateCurrentConversion]);

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
