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
  conversionMode
}) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const conversions = useConverterStore((state) => state.conversions);
  const favorites = useConverterStore((state) => state.favorites);
  const addConversion = useConverterStore((state) => state.addConversion);
  const addFavorite = useConverterStore((state) => state.addFavorite);

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
        Date: new Date(conv.timestamp).toLocaleString('fr-FR')
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Conversions');
    
    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'conversions_courantes.xlsx');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await ExportService.importFromJSON(file);
      
      // Ajouter les conversions importées
      data.conversions.forEach((conversion) => {
        addConversion(conversion);
      });

      // Ajouter les favoris importés
      data.favorites.forEach((favorite) => {
        addFavorite(favorite);
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
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
      <h2 className="text-lg font-semibold text-primary-700 mb-4">Exporter la conversion en cours</h2>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleExportJSON}
          className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow transition-colors duration-200"
        >
          Exporter en JSON
        </button>
        
        <button
          onClick={handleExportExcel}
          className="flex-1 py-2 px-4 bg-accent-600 hover:bg-accent-700 text-white rounded-lg shadow transition-colors duration-200"
        >
          Exporter en Excel
        </button>
      </div>
    </div>
  );
}; 