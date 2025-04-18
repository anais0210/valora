import React, { useRef, useState } from 'react';
import { useConverterStore } from '../store';
import { ExportService } from '../services/exportService';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Conversion } from '../types';

interface DataManagementProps {
  currentConversion: Conversion | null;
  currentMultipleConversions?: Conversion[];
  conversionMode: 'single' | 'multiple';
}

export const DataManagement: React.FC<DataManagementProps> = ({
  currentConversion,
  currentMultipleConversions = [],
  conversionMode,
}) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addConversion, addFavorite } = useConverterStore();

  const getCurrentConversions = () => {
    if (conversionMode === 'single') {
      return currentConversion ? [currentConversion] : [];
    }
    return currentMultipleConversions;
  };

  const handleExportJSON = () => {
    const conversions = getCurrentConversions();
    if (conversions.length === 0) return;

    const jsonStr = JSON.stringify(conversions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, 'conversions_courantes.json');
  };

  const handleExportExcel = () => {
    const conversions = getCurrentConversions();
    if (conversions.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      conversions.map(conv => ({
        De: conv.from,
        Vers: conv.to,
        Montant: conv.amount,
        Résultat: conv.result,
        Taux: conv.rate,
        Date: new Date(conv.timestamp).toLocaleString('fr-FR'),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Conversions');

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'conversions_courantes.xlsx');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await ExportService.importFromJSON(file);

      // Ajouter les conversions importées
      data.conversions.forEach(conversion => {
        addConversion(conversion);
      });

      // Ajouter les favoris importés
      data.favorites.forEach(favorite => {
        addFavorite(favorite);
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import");
    }

    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasConversions = getCurrentConversions().length > 0;

  if (!hasConversions) {
    return (
      <div className="bg-surface-light rounded-lg p-4 border-2 border-primary-200 text-center">
        <p className="text-primary-600">Aucune conversion en cours à exporter</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-lg shadow-md border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-primary-700 mb-4">Gestion des données</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={handleExportJSON}
          className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow transition-colors duration-200"
        >
          Exporter en JSON
        </button>

        <button
          onClick={handleExportExcel}
          className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          Exporter en Excel
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Importer des données
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>
        {error && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
