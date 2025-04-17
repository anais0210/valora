import { Conversion, FavoritePair } from '../types';
import * as XLSX from 'xlsx';

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

  static exportToXLS(conversions: Conversion[], favorites: FavoritePair[]): void {
    // Créer un classeur Excel
    const workbook = XLSX.utils.book_new();

    // Préparer les données des conversions
    const conversionsData = conversions.map(conv => ({
      Date: new Date(conv.timestamp).toLocaleString('fr-FR'),
      De: conv.from,
      Vers: conv.to,
      Montant: conv.amount,
      Résultat: conv.result,
      Taux: conv.rate,
    }));

    // Créer une feuille pour les conversions
    const conversionsSheet = XLSX.utils.json_to_sheet(conversionsData);
    XLSX.utils.book_append_sheet(workbook, conversionsSheet, 'Conversions');

    // Préparer les données des favoris
    const favoritesData = favorites.map(fav => ({
      De: fav.from,
      Vers: fav.to,
    }));

    // Créer une feuille pour les favoris
    const favoritesSheet = XLSX.utils.json_to_sheet(favoritesData);
    XLSX.utils.book_append_sheet(workbook, favoritesSheet, 'Favoris');

    // Générer le fichier Excel
    XLSX.writeFile(workbook, `valora-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

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
