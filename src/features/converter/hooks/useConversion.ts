import { useState, useEffect } from 'react';
import { useConverterStore } from '../store';

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
        const rate = fromCurrency === 'EUR' 
          ? data.rates[toCurrency]
          : data.rates[toCurrency] / data.rates[fromCurrency];
        
        updateExchangeRate(rate);

        if (currentConversion) {
          const newResult = currentConversion.amount * rate;
          const updatedConversion = {
            ...currentConversion,
            rate,
            result: newResult,
          };
          updateCurrentConversion(updatedConversion);
          addConversion(updatedConversion);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du taux de change:', err);
        setError('Impossible de récupérer le taux de change');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

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
    setError,
  };
};
