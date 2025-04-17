import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConverterService } from './services/converterService';
import { Conversion, FavoritePair, ConverterSettings } from './types';

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
  removeFavorite: (pair: FavoritePair) => void;
  updateSettings: (settings: Partial<ConverterSettings>) => void;
  getAvailableCurrencies: () => Record<string, string>;
  updateCurrencies: (from: string, to: string) => void;
  updateCurrentConversion: (conversion: Conversion | null) => void;
  updateCurrentMultipleConversions: (conversions: Conversion[]) => void;
  updateExchangeRate: (rate: number) => void;
  resetConversions: () => void;
}

export const useConverterStore = create<ConverterState>()(
  persist(
    (set) => ({
      conversions: [],
      favorites: [],
      currentConversion: null,
      currentMultipleConversions: [],
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      exchangeRate: 1,
      settings: {
        decimalPlaces: 2 as const,
        isOfflineMode: false,
        lastUpdate: Date.now(),
        cachedRates: {},
        availableCurrencies: ConverterService.getCurrencyNames(),
      },
      addConversion: (conversion) =>
        set((state) => ({
          conversions: [conversion, ...state.conversions],
        })),
      addFavorite: (pair) =>
        set((state) => ({
          favorites: [...state.favorites, pair],
        })),
      removeFavorite: (pair) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => f.from !== pair.from || f.to !== pair.to
          ),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      getAvailableCurrencies: () => ConverterService.getCurrencyNames(),
      updateCurrencies: (from, to) =>
        set(() => ({
          fromCurrency: from,
          toCurrency: to,
        })),
      updateCurrentConversion: (conversion) =>
        set(() => ({
          currentConversion: conversion,
        })),
      updateCurrentMultipleConversions: (conversions) =>
        set(() => ({
          currentMultipleConversions: conversions,
        })),
      updateExchangeRate: (rate) =>
        set(() => ({
          exchangeRate: rate,
        })),
      resetConversions: () =>
        set(() => ({
          conversions: [],
          currentConversion: null,
          currentMultipleConversions: [],
        })),
    }),
    {
      name: 'converter-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.settings) {
          ConverterService.getInstance(state.settings);
        }
      },
    }
  )
);
