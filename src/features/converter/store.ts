import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversion, FavoritePair } from './types';

interface ConverterState {
  conversions: Conversion[];
  favorites: FavoritePair[];
  settings: ConverterSettings;
  currentConversion: Conversion | null;
  currentMultipleConversions: Conversion[];
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  addConversion: (conversion: Conversion) => void;
  addFavorite: (pair: FavoritePair) => void;
  removeFavorite: (id: string) => void;
  updateSettings: (settings: Partial<ConverterSettings>) => void;
  updateCurrentConversion: (conversion: Conversion | null) => void;
  updateCurrentMultipleConversions: (conversions: Conversion[]) => void;
  updateCurrencies: (from: string, to: string) => void;
  updateExchangeRate: (rate: number) => void;
}

export interface ConverterSettings {
  decimalPlaces: 2 | 3 | 4;
  isOfflineMode: boolean;
  lastUpdate: number;
  cachedRates: Record<string, number>;
  availableCurrencies: Record<string, string>;
}

const defaultSettings: ConverterSettings = {
  decimalPlaces: 2,
  isOfflineMode: false,
  lastUpdate: Date.now(),
  cachedRates: {},
  availableCurrencies: {
    EUR: 'Euro',
    USD: 'Dollar américain',
    GBP: 'Livre sterling',
    JPY: 'Yen japonais',
    CHF: 'Franc suisse',
    CAD: 'Dollar canadien',
    AUD: 'Dollar australien',
    CNY: 'Yuan chinois',
    INR: 'Roupie indienne',
    BRL: 'Real brésilien',
    NZD: 'Dollar néo-zélandais',
    SGD: 'Dollar de Singapour',
    HKD: 'Dollar de Hong Kong',
    SEK: 'Couronne suédoise',
    NOK: 'Couronne norvégienne',
    MXN: 'Peso mexicain',
    ZAR: 'Rand sud-africain',
    TRY: 'Livre turque',
    RUB: 'Rouble russe',
    KRW: 'Won sud-coréen',
  },
};

export const useConverterStore = create<ConverterState>()(
  persist(
    set => ({
      conversions: [],
      favorites: [],
      settings: defaultSettings,
      currentConversion: null,
      currentMultipleConversions: [],
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      exchangeRate: 0,
      addConversion: conversion =>
        set(state => ({
          conversions: [conversion, ...state.conversions].slice(0, 10),
        })),
      addFavorite: pair =>
        set(state => ({
          favorites: [...state.favorites, pair],
        })),
      removeFavorite: id =>
        set(state => ({
          favorites: state.favorites.filter(f => f.id !== id),
        })),
      updateSettings: newSettings =>
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateCurrentConversion: conversion =>
        set(() => ({
          currentConversion: conversion,
        })),
      updateCurrentMultipleConversions: conversions =>
        set(() => ({
          currentMultipleConversions: conversions,
        })),
      updateCurrencies: (from, to) =>
        set(() => ({
          fromCurrency: from,
          toCurrency: to,
        })),
      updateExchangeRate: rate =>
        set(() => ({
          exchangeRate: rate,
        })),
    }),
    {
      name: 'converter-storage',
      onRehydrateStorage: () => state => {
        if (!state?.settings?.availableCurrencies) {
          state?.updateSettings(defaultSettings);
        }
      },
    }
  )
);
