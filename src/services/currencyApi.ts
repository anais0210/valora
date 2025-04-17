import axios from 'axios';

const API_BASE_URL = 'https://happyapi.fr/api/devises';

interface APIDevise {
  codeISODevise: string;
  taux: number;
}

export interface CurrencyRate {
  code: string;
  rate: number;
}

// Devises par défaut en cas d'erreur de l'API
// const DEFAULT_RATES: CurrencyRate[] = [];

export const currencyApi = {
  getAllRates: async (): Promise<CurrencyRate[]> => {
    try {
      const response = await axios.get(API_BASE_URL);

      if (response.data?.result?.result?.devises) {
        return response.data.result.result.devises.map((devise: APIDevise) => ({
          code: devise.codeISODevise,
          rate: devise.taux,
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
  },
};
