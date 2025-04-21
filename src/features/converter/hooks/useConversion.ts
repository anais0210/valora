import { useState, useEffect, useCallback, useRef } from 'react';
import { useConverterStore } from '../store';
import { Conversion } from '../types';

export const useConversion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCurrenciesRef = useRef({ from: '', to: '' });
  const isUpdatingRef = useRef(false);
  const prevAmountRef = useRef<number | null>(null);

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

  const fetchExchangeRate = useCallback(async () => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

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
      isUpdatingRef.current = false;
    }
  }, [fromCurrency, toCurrency, updateExchangeRate]);

  useEffect(() => {
    if (
      prevCurrenciesRef.current.from === fromCurrency &&
      prevCurrenciesRef.current.to === toCurrency
    ) {
      return;
    }

    prevCurrenciesRef.current = { from: fromCurrency, to: toCurrency };
    fetchExchangeRate();
  }, [fromCurrency, toCurrency, fetchExchangeRate]);

  useEffect(() => {
    if (!currentConversion?.amount || !exchangeRate || isUpdatingRef.current) return;
    if (prevAmountRef.current === currentConversion.amount) return;

    isUpdatingRef.current = true;
    const newResult = currentConversion.amount * exchangeRate;
    const updatedConversion = {
      ...currentConversion,
      rate: exchangeRate,
      result: newResult,
    };
    updateCurrentConversion(updatedConversion);
    prevAmountRef.current = currentConversion.amount;
    isUpdatingRef.current = false;
  }, [exchangeRate, currentConversion, updateCurrentConversion]);

  const debouncedAddConversion = useCallback(
    (conversion: Conversion) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        addConversion(conversion);
      }, 500);
    },
    [addConversion]
  );

  const handleAmountChange = useCallback(
    (amount: number) => {
      if (!isNaN(amount) && !isUpdatingRef.current && prevAmountRef.current !== amount) {
        isUpdatingRef.current = true;
        const conversion = {
          from: fromCurrency,
          to: toCurrency,
          amount,
          rate: exchangeRate,
          timestamp: Date.now(),
          result: amount * (exchangeRate || 1),
        };
        updateCurrentConversion(conversion);
        debouncedAddConversion(conversion);
        prevAmountRef.current = amount;
        isUpdatingRef.current = false;
      }
    },
    [fromCurrency, toCurrency, exchangeRate, updateCurrentConversion, debouncedAddConversion]
  );

  const handleCurrencyChange = useCallback(
    (from: string, to: string) => {
      updateCurrencies(from, to);
    },
    [updateCurrencies]
  );

  const handleReset = useCallback(() => {
    updateCurrentConversion(null);
    setError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    prevAmountRef.current = null;
  }, [updateCurrentConversion]);

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
