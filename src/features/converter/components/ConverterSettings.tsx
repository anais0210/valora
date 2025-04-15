import React from 'react';
import { useConverterStore } from '../store';
import { ConverterSettings as Settings } from '../types';

export const ConverterSettings: React.FC = () => {
  const settings = useConverterStore((state) => state.settings);
  const updateSettings = useConverterStore((state) => state.updateSettings);

  const handleDecimalPlacesChange = (value: Settings['decimalPlaces']) => {
    updateSettings({ decimalPlaces: value });
  };

  const handleOfflineModeChange = (isOffline: boolean) => {
    updateSettings({ isOfflineMode: isOffline });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 text-primary-700">Paramètres</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de décimales
          </label>
          <select
            value={settings.decimalPlaces}
            onChange={(e) => handleDecimalPlacesChange(Number(e.target.value) as Settings['decimalPlaces'])}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value={2}>2 décimales</option>
            <option value={3}>3 décimales</option>
            <option value={4}>4 décimales</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="offline-mode"
            checked={settings.isOfflineMode}
            onChange={(e) => handleOfflineModeChange(e.target.checked)}
            className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
          />
          <label
            htmlFor="offline-mode"
            className="ml-2 block text-sm text-gray-700"
          >
            Mode hors ligne
          </label>
        </div>

        {settings.isOfflineMode && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
            Le mode hors ligne utilise les derniers taux de change enregistrés.
            Dernière mise à jour :{' '}
            {new Date(settings.lastUpdate).toLocaleString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
}; 