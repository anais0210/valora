import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';

interface CurrencyRate {
  currency: string;
  rate: number;
}

interface ExcelData {
  [key: string]: string | number | undefined;
}

export default function ExcelConverter() {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [convertedData, setConvertedData] = useState<ExcelData[]>([]);
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  const fetchCurrencyRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      const rates = Object.entries(data.rates).map(([currency, rate]) => ({
        currency,
        rate: rate as number,
      }));
      setCurrencyRates(rates);
    } catch (err) {
      setError('Erreur lors de la récupération des taux de change');
    }
  };

  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Taux de change');

    // Ajouter les en-têtes de colonnes avec les devises
    const headers = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];
    worksheet.addRow(headers);

    // Ajouter une feuille cachée pour stocker les taux de change
    const ratesSheet = workbook.addWorksheet('Rates');
    ratesSheet.state = 'hidden';
    ratesSheet.addRow(['Currency', 'Rate']);
    currencyRates.forEach(rate => {
      ratesSheet.addRow([rate.currency, rate.rate]);
    });

    // Ajouter 10 lignes vides
    for (let i = 0; i < 10; i++) {
      worksheet.addRow(new Array(headers.length).fill(''));
    }

    // Télécharger le fichier
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_taux_de_change.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Vérifier le type de fichier
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Format de fichier non supporté. Veuillez utiliser un fichier Excel (.xlsx ou .xls)');
      }

      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux. Taille maximale : 10MB');
      }

      const arrayBuffer = await file.arrayBuffer();
      
      // Vérifier si le buffer est vide
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Le fichier est vide');
      }

      const workbook = new ExcelJS.Workbook();
      
      try {
        await workbook.xlsx.load(arrayBuffer);
      } catch (loadError) {
        console.error('Erreur lors du chargement du fichier:', loadError);
        throw new Error('Impossible de lire le fichier Excel. Veuillez vérifier que le fichier n\'est pas corrompu.');
      }

      const worksheet = workbook.getWorksheet(1);
      
      if (!worksheet) {
        throw new Error('Aucune feuille de calcul trouvée dans le fichier');
      }

      // Vérifier si la feuille est vide
      if (worksheet.rowCount < 2) {
        throw new Error('Le fichier ne contient pas de données');
      }

      // Extraire les données du fichier
      const headers: string[] = [];
      worksheet.getRow(1).eachCell((cell) => {
        const headerValue = cell.value?.toString() || '';
        if (headerValue.trim() === '') {
          throw new Error('Les en-têtes de colonnes ne peuvent pas être vides');
        }
        headers.push(headerValue);
      });

      if (headers.length === 0) {
        throw new Error('Aucun en-tête de colonne trouvé');
      }

      const data: ExcelData[] = [];
      let rowNumber = 0;
      
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowData: ExcelData = {};
        let hasData = false;
        
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            // Convertir la valeur en nombre si possible
            const value = cell.value;
            if (typeof value === 'number') {
              rowData[header] = value;
              hasData = true;
            } else if (typeof value === 'string') {
              // Essayer de convertir la chaîne en nombre
              const numValue = parseFloat(value);
              rowData[header] = isNaN(numValue) ? value : numValue;
              hasData = true;
            } else if (value !== null && value !== undefined) {
              // Gérer les autres types de valeurs
              rowData[header] = String(value);
              hasData = true;
            }
          }
        });
        
        // N'ajouter la ligne que si elle contient des données
        if (hasData) {
          data.push(rowData);
        }
      });

      if (data.length === 0) {
        throw new Error('Aucune donnée valide trouvée dans le fichier');
      }

      console.log('Données extraites:', data); // Pour le débogage

      setExcelData(data);
      if (data.length > 0) {
        setAvailableColumns(headers);
        setSourceColumn(headers[0]);
      }

    } catch (err) {
      console.error('Erreur lors du traitement du fichier:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const convertData = () => {
    if (!excelData.length || !sourceColumn) return;

    console.log('Données à convertir:', excelData); // Pour le débogage
    console.log('Colonne source:', sourceColumn); // Pour le débogage
    console.log('Devise cible:', targetCurrency); // Pour le débogage

    const sourceRate = currencyRates.find(r => r.currency === targetCurrency)?.rate || 1;
    console.log('Taux source:', sourceRate); // Pour le débogage

    const converted = excelData.map(row => {
      const newRow = { ...row };
      const sourceValue = row[sourceColumn];
      console.log('Valeur source:', sourceValue); // Pour le débogage
      
      // Convertir en nombre si ce n'est pas déjà un nombre
      let amount = 0;
      if (typeof sourceValue === 'number') {
        amount = sourceValue;
      } else if (typeof sourceValue === 'string') {
        amount = parseFloat(sourceValue);
      }
      
      console.log('Montant converti:', amount); // Pour le débogage
      
      if (!isNaN(amount)) {
        currencyRates.forEach(rate => {
          if (rate.currency !== targetCurrency) {
            const convertedAmount = amount * (rate.rate / sourceRate);
            newRow[`${rate.currency}`] = convertedAmount;
            console.log(`Conversion ${targetCurrency} vers ${rate.currency}:`, convertedAmount); // Pour le débogage
          }
        });
      }
      return newRow;
    });

    console.log('Données converties:', converted); // Pour le débogage
    setConvertedData(converted);
  };

  const downloadConvertedData = async () => {
    if (!convertedData.length) return;

    // Recalculer les conversions pour s'assurer que les valeurs sont à jour
    const sourceRate = currencyRates.find(r => r.currency === targetCurrency)?.rate || 1;
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Données converties');

    // Ajouter les en-têtes
    const headers = Object.keys(convertedData[0]);
    worksheet.columns = headers.map(header => ({
      header,
      key: header
    }));

    // Ajouter les données avec les conversions recalculées
    convertedData.forEach(row => {
      const newRow: { [key: string]: any } = {};
      
      // Copier les valeurs originales
      headers.forEach(header => {
        newRow[header] = row[header];
      });
      
      // Recalculer les conversions
      const sourceValue = row[sourceColumn || ''];
      let amount = 0;
      
      if (typeof sourceValue === 'number') {
        amount = sourceValue;
      } else if (typeof sourceValue === 'string') {
        amount = parseFloat(sourceValue);
      }
      
      if (!isNaN(amount)) {
        currencyRates.forEach(rate => {
          if (rate.currency !== targetCurrency) {
            const convertedAmount = amount * (rate.rate / sourceRate);
            newRow[rate.currency] = convertedAmount;
          }
        });
      }
      
      worksheet.addRow(newRow);
    });

    // Télécharger le fichier
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donnees_converties.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des taux de change...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchCurrencyRates}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Convertisseur Excel</h2>
      
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Télécharger le template
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fichier Excel
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="mt-1 block w-full"
            />
          </div>

          {excelData.length > 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colonne source
                </label>
                <select
                  value={sourceColumn || ''}
                  onChange={(e) => setSourceColumn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {availableColumns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Devise source
                </label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {currencyRates.map((rate) => (
                    <option key={rate.currency} value={rate.currency}>
                      {rate.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={convertData}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Convertir
                </button>
                {convertedData.length > 0 && (
                  <button
                    onClick={downloadConvertedData}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Télécharger les résultats
                  </button>
                )}
              </div>

              {convertedData.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(convertedData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {convertedData.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td
                              key={i}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {convertedData.length > 5 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Affichage des 5 premières lignes sur {convertedData.length}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 