export interface Conversion {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface FavoritePair {
  from: string;
  to: string;
  id: string;
}

export interface ConverterSettings {
  decimalPlaces: 2 | 3 | 4;
  isOfflineMode: boolean;
  lastUpdate: number;
  cachedRates: Record<string, number>;
  availableCurrencies: Record<string, string>;
}
