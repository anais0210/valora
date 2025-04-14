import axios from 'axios';

const API_BASE_URL = 'https://happyapi.fr/api/devises';

export interface CurrencyRate {
  code: string;
  rate: number;
}

// Devises par défaut en cas d'erreur de l'API
const DEFAULT_RATES: CurrencyRate[] = [
  { code: 'USD', rate: 1.08 },
  { code: 'GBP', rate: 0.86 },
  { code: 'JPY', rate: 161.23 },
  { code: 'CHF', rate: 0.96 },
  { code: 'CAD', rate: 1.47 },
  { code: 'AUD', rate: 1.65 },
  { code: 'CNY', rate: 7.78 },
  { code: 'INR', rate: 89.45 },
  { code: 'BRL', rate: 5.34 },
  { code: 'RUB', rate: 98.56 }
];

export const currencyApi = {
  getAllRates: async (): Promise<CurrencyRate[]> => {
    try {
      const response = await axios.get(API_BASE_URL);
      
      if (response.data?.result?.result?.devises) {
        return response.data.result.result.devises.map((devise: any) => ({
          code: devise.codeISODevise,
          rate: devise.taux
        }));
      }
      
      throw new Error('Format de données invalide');
    } catch (error) {
      console.error('Erreur lors de la récupération des taux de change:', error);
      throw error;
    }
  },

  convertAmount: (amount: number, fromRate: number, toRate: number): number => {
    // Conversion via EUR comme devise pivot
    const amountInEur = amount / fromRate;
    return amountInEur * toRate;
  }
}; 