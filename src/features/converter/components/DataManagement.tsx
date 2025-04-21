import React, { useRef, useState } from 'react';
import { useConverterStore } from '../store';
import { ExportService } from '../services/exportService';
import { saveAs } from 'file-saver';

export const DataManagement: React.FC = () => {
  const { conversions, favorites, resetConversions, resetFavorites } = useConverterStore();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const data = {
      conversions,
      favorites,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `valora-export-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportExcel = async () => {
    if (conversions.length === 0) return;
    await ExportService.exportToExcel(conversions);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await ExportService.importFromJSON(file);
      // Mettre à jour le store avec les données importées
      // Note: Cette partie dépend de votre implémentation du store
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      setError("Erreur lors de l'importation du fichier");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 bg-[var(--color-green-500)] text-white rounded-lg hover:bg-[var(--color-green-600)] transition-colors"
        >
          Exporter en JSON
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-[var(--color-green-500)] text-white rounded-lg hover:bg-[var(--color-green-600)] transition-colors"
        >
          Exporter en Excel
        </button>
      </div>

      <div className="flex justify-end gap-4">
        <label className="px-4 py-2 bg-[var(--color-green-500)] text-white rounded-lg hover:bg-[var(--color-green-600)] transition-colors cursor-pointer">
          Importer
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </label>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex justify-end gap-4">
        <button
          onClick={resetConversions}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Réinitialiser l'historique
        </button>
        <button
          onClick={resetFavorites}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Réinitialiser les favoris
        </button>
      </div>
    </div>
  );
};
