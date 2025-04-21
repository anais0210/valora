import { Conversion, FavoritePair } from '../types';
import ExcelJS from 'exceljs';

interface ExportData {
  conversions: Conversion[];
  favorites: FavoritePair[];
  exportDate: string;
}

export class ExportService {
  static exportToJSON(conversions: Conversion[], favorites: FavoritePair[]): void {
    const data: ExportData = {
      conversions,
      favorites,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `valora-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static exportToExcel = async (conversions: Conversion[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Conversions');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'De', key: 'from', width: 10 },
      { header: 'Vers', key: 'to', width: 10 },
      { header: 'Montant', key: 'amount', width: 15 },
      { header: 'Taux', key: 'rate', width: 15 },
      { header: 'Résultat', key: 'result', width: 15 },
    ];

    conversions.forEach(conversion => {
      worksheet.addRow({
        date: new Date(conversion.timestamp).toLocaleString(),
        from: conversion.from,
        to: conversion.to,
        amount: conversion.amount,
        rate: conversion.rate,
        result: conversion.result,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversions-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  static importFromJSON(file: File): Promise<ExportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const data = JSON.parse(event.target?.result as string) as ExportData;
          resolve(data);
        } catch (error) {
          reject(new Error('Format de fichier invalide'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    });
  }
}
