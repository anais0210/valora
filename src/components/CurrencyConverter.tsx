import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';

interface CurrencyRate {
  currency: string;
  rate: number;
}

interface ConversionResult {
  originalValue: number;
  originalCurrency: string;
  convertedValue: number;
  targetCurrency: string;
}

// Noms complets des devises
const CURRENCY_NAMES: Record<string, string> = {
  AED: 'Dirham des Émirats arabes unis',
  AFN: 'Afghani afghan',
  ALL: 'Lek albanais',
  AMD: 'Dram arménien',
  ANG: 'Florin des Antilles néerlandaises',
  AOA: 'Kwanza angolais',
  ARS: 'Peso argentin',
  AUD: 'Dollar australien',
  AWG: 'Florin arubais',
  AZN: 'Manat azerbaïdjanais',
  BAM: 'Mark convertible de Bosnie-Herzégovine',
  BBD: 'Dollar barbadien',
  BDT: 'Taka bangladais',
  BGN: 'Lev bulgare',
  BHD: 'Dinar bahreïni',
  BIF: 'Franc burundais',
  BMD: 'Dollar bermudien',
  BND: 'Dollar de Brunei',
  BOB: 'Boliviano bolivien',
  BRL: 'Real brésilien',
  BSD: 'Dollar bahaméen',
  BTN: 'Ngultrum bhoutanais',
  BWP: 'Pula botswanais',
  BYN: 'Rouble biélorusse',
  BZD: 'Dollar bélizien',
  CAD: 'Dollar canadien',
  CDF: 'Franc congolais',
  CHF: 'Franc suisse',
  CLP: 'Peso chilien',
  CNY: 'Yuan chinois',
  COP: 'Peso colombien',
  CRC: 'Colón costaricain',
  CUP: 'Peso cubain',
  CVE: 'Escudo cap-verdien',
  CZK: 'Couronne tchèque',
  DJF: 'Franc djiboutien',
  DKK: 'Couronne danoise',
  DOP: 'Peso dominicain',
  DZD: 'Dinar algérien',
  EGP: 'Livre égyptienne',
  ERN: 'Nakfa érythréen',
  ETB: 'Birr éthiopien',
  EUR: 'Euro',
  FJD: 'Dollar fidjien',
  FKP: 'Livre des îles Falkland',
  FOK: 'Couronne féroïenne',
  GBP: 'Livre sterling',
  GEL: 'Lari géorgien',
  GGP: 'Livre de Guernesey',
  GHS: 'Cedi ghanéen',
  GIP: 'Livre de Gibraltar',
  GMD: 'Dalasi gambien',
  GNF: 'Franc guinéen',
  GTQ: 'Quetzal guatémaltèque',
  GYD: 'Dollar guyanien',
  HKD: 'Dollar de Hong Kong',
  HNL: 'Lempira hondurien',
  HRK: 'Kuna croate',
  HTG: 'Gourde haïtienne',
  HUF: 'Forint hongrois',
  IDR: 'Roupie indonésienne',
  ILS: 'Shekel israélien',
  IMP: 'Livre de l\'île de Man',
  INR: 'Roupie indienne',
  IQD: 'Dinar irakien',
  IRR: 'Rial iranien',
  ISK: 'Couronne islandaise',
  JEP: 'Livre de Jersey',
  JMD: 'Dollar jamaïcain',
  JOD: 'Dinar jordanien',
  JPY: 'Yen japonais',
  KES: 'Shilling kényan',
  KGS: 'Som kirghize',
  KHR: 'Riel cambodgien',
  KID: 'Dollar des Kiribati',
  KMF: 'Franc comorien',
  KRW: 'Won sud-coréen',
  KWD: 'Dinar koweïtien',
  KYD: 'Dollar des îles Caïmans',
  KZT: 'Tenge kazakh',
  LAK: 'Kip laotien',
  LBP: 'Livre libanaise',
  LKR: 'Roupie srilankaise',
  LRD: 'Dollar libérien',
  LSL: 'Loti lesothan',
  LYD: 'Dinar libyen',
  MAD: 'Dirham marocain',
  MDL: 'Leu moldave',
  MGA: 'Ariary malgache',
  MKD: 'Denar macédonien',
  MMK: 'Kyat birman',
  MNT: 'Tugrik mongol',
  MOP: 'Pataca macanais',
  MRU: 'Ouguiya mauritanien',
  MUR: 'Roupie mauricienne',
  MVR: 'Rufiyaa maldivien',
  MWK: 'Kwacha malawite',
  MXN: 'Peso mexicain',
  MYR: 'Ringgit malaisien',
  MZN: 'Metical mozambicain',
  NAD: 'Dollar namibien',
  NGN: 'Naira nigérian',
  NIO: 'Córdoba nicaraguayen',
  NOK: 'Couronne norvégienne',
  NPR: 'Roupie népalaise',
  NZD: 'Dollar néo-zélandais',
  OMR: 'Rial omanais',
  PAB: 'Balboa panaméen',
  PEN: 'Sol péruvien',
  PGK: 'Kina papou-néo-guinéen',
  PHP: 'Peso philippin',
  PKR: 'Roupie pakistanaise',
  PLN: 'Złoty polonais',
  PYG: 'Guarani paraguayen',
  QAR: 'Riyal qatari',
  RON: 'Leu roumain',
  RSD: 'Dinar serbe',
  RUB: 'Rouble russe',
  RWF: 'Franc rwandais',
  SAR: 'Riyal saoudien',
  SBD: 'Dollar des îles Salomon',
  SCR: 'Roupie seychelloise',
  SDG: 'Livre soudanaise',
  SEK: 'Couronne suédoise',
  SGD: 'Dollar de Singapour',
  SHP: 'Livre de Sainte-Hélène',
  SLL: 'Leone sierra-léonais',
  SOS: 'Shilling somalien',
  SRD: 'Dollar surinamais',
  SSP: 'Livre sud-soudanaise',
  STN: 'Dobra santoméen',
  SYP: 'Livre syrienne',
  SZL: 'Lilangeni swazi',
  THB: 'Baht thaïlandais',
  TJS: 'Somoni tadjik',
  TMT: 'Manat turkmène',
  TND: 'Dinar tunisien',
  TOP: 'Pa\'anga tongan',
  TRY: 'Livre turque',
  TTD: 'Dollar de Trinité-et-Tobago',
  TVD: 'Dollar tuvaluan',
  TWD: 'Dollar taïwanais',
  TZS: 'Shilling tanzanien',
  UAH: 'Hryvnia ukrainienne',
  UGX: 'Shilling ougandais',
  USD: 'Dollar américain',
  UYU: 'Peso uruguayen',
  UZS: 'Sum ouzbek',
  VES: 'Bolívar vénézuélien',
  VND: 'Dong vietnamien',
  VUV: 'Vatu vanuatais',
  WST: 'Tala samoan',
  XAF: 'Franc CFA d\'Afrique centrale',
  XCD: 'Dollar des Caraïbes orientales',
  XDR: 'Droit de tirage spécial',
  XOF: 'Franc CFA d\'Afrique de l\'Ouest',
  XPF: 'Franc CFP',
  YER: 'Rial yéménite',
  ZAR: 'Rand sud-africain',
  ZMW: 'Kwacha zambien',
  ZWL: 'Dollar zimbabwéen'
};

export default function CurrencyConverter() {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<string>('');
  const [sourceCurrency, setSourceCurrency] = useState<string>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [sourceSearch, setSourceSearch] = useState<string>('');
  const [targetSearch, setTargetSearch] = useState<string>('');
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  const fetchCurrencyRates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      const rates = Object.entries(data.rates).map(([currency, rate]) => ({
        currency,
        rate: rate as number,
      }));
      setCurrencyRates(rates);
    } catch (err) {
      console.error('Erreur lors de la récupération des taux de change:', err);
      setError('Erreur lors de la récupération des taux de change. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValues(e.target.value);
  };

  const handleSourceSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSourceSearch(e.target.value);
    setIsSourceOpen(true);
  };

  const handleTargetSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetSearch(e.target.value);
    setIsTargetOpen(true);
  };

  const handleSourceSelect = (currency: string) => {
    setSourceCurrency(currency);
    setIsSourceOpen(false);
    setSourceSearch('');
  };

  const handleTargetSelect = (currency: string) => {
    setTargetCurrency(currency);
    setIsTargetOpen(false);
    setTargetSearch('');
  };

  const convertValues = () => {
    if (!inputValues.trim()) {
      setError('Veuillez entrer au moins une valeur à convertir');
      return;
    }

    // Extraire les valeurs numériques du texte
    const values = inputValues
      .split(/[\n,;]/) // Séparer par retour à la ligne, virgule ou point-virgule
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (values.length === 0) {
      setError('Aucune valeur numérique valide trouvée');
      return;
    }

    // Trouver les taux de change
    const sourceRate = currencyRates.find(r => r.currency === sourceCurrency)?.rate || 1;
    const targetRate = currencyRates.find(r => r.currency === targetCurrency)?.rate || 1;

    // Calculer les conversions
    const results = values.map(value => {
      const convertedValue = value * (targetRate / sourceRate);
      return {
        originalValue: value,
        originalCurrency: sourceCurrency,
        convertedValue,
        targetCurrency
      };
    });

    setConversionResults(results);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copié dans le presse-papiers !');
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };

  const exportToExcel = async () => {
    if (conversionResults.length === 0) {
      setError('Aucun résultat à exporter');
      return;
    }

    try {
      // Créer un nouveau classeur Excel
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Valora';
      workbook.lastModifiedBy = 'Valora';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Ajouter une feuille de calcul
      const worksheet = workbook.addWorksheet('Conversions de devises');
      
      // Définir les colonnes
      worksheet.columns = [
        { header: 'Valeur d\'origine', key: 'originalValue', width: 15 },
        { header: 'Devise d\'origine', key: 'originalCurrency', width: 15 },
        { header: 'Valeur convertie', key: 'convertedValue', width: 15 },
        { header: 'Devise cible', key: 'targetCurrency', width: 15 },
        { header: 'Taux de change', key: 'rate', width: 15 }
      ];

      // Ajouter les données
      conversionResults.forEach(result => {
        const rate = result.convertedValue / result.originalValue;
        worksheet.addRow({
          originalValue: result.originalValue,
          originalCurrency: result.originalCurrency,
          convertedValue: result.convertedValue,
          targetCurrency: result.targetCurrency,
          rate: rate
        });
      });

      // Formater les en-têtes
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Formater les cellules numériques
      worksheet.getColumn('originalValue').numFmt = '#,##0.00';
      worksheet.getColumn('convertedValue').numFmt = '#,##0.00';
      worksheet.getColumn('rate').numFmt = '#,##0.0000';

      // Ajouter une feuille d'informations
      const infoSheet = workbook.addWorksheet('Informations');
      infoSheet.columns = [
        { header: 'Information', key: 'info', width: 30 },
        { header: 'Valeur', key: 'value', width: 30 }
      ];

      infoSheet.addRow({ info: 'Date de conversion', value: new Date().toLocaleString() });
      infoSheet.addRow({ info: 'Devise source', value: sourceCurrency });
      infoSheet.addRow({ info: 'Devise cible', value: targetCurrency });
      infoSheet.addRow({ info: 'Nombre de conversions', value: conversionResults.length });

      // Formater les en-têtes de la feuille d'informations
      infoSheet.getRow(1).font = { bold: true };
      infoSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Générer le fichier Excel
      const buffer = await workbook.xlsx.writeBuffer();
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversions_${sourceCurrency}_vers_${targetCurrency}_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors de l\'export Excel:', err);
      setError('Erreur lors de l\'export Excel. Veuillez réessayer.');
    }
  };

  // Filtrer les devises en fonction de la recherche
  const filteredSourceCurrencies = currencyRates.filter(rate => 
    rate.currency.toLowerCase().includes(sourceSearch.toLowerCase()) || 
    (CURRENCY_NAMES[rate.currency] && CURRENCY_NAMES[rate.currency].toLowerCase().includes(sourceSearch.toLowerCase()))
  );

  const filteredTargetCurrencies = currencyRates.filter(rate => 
    rate.currency.toLowerCase().includes(targetSearch.toLowerCase()) || 
    (CURRENCY_NAMES[rate.currency] && CURRENCY_NAMES[rate.currency].toLowerCase().includes(targetSearch.toLowerCase()))
  );

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Convertisseur de devises</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise source
            </label>
            <div className="relative">
              <div 
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                onClick={() => setIsSourceOpen(!isSourceOpen)}
              >
                <div className="flex justify-between items-center">
                  <span>{sourceCurrency} - {CURRENCY_NAMES[sourceCurrency] || 'Devise inconnue'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {isSourceOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <input
                    type="text"
                    value={sourceSearch}
                    onChange={handleSourceSearchChange}
                    placeholder="Rechercher une devise..."
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredSourceCurrencies.map((rate) => (
                      <div
                        key={rate.currency}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSourceSelect(rate.currency)}
                      >
                        {rate.currency} - {CURRENCY_NAMES[rate.currency] || 'Devise inconnue'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise cible
            </label>
            <div className="relative">
              <div 
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                onClick={() => setIsTargetOpen(!isTargetOpen)}
              >
                <div className="flex justify-between items-center">
                  <span>{targetCurrency} - {CURRENCY_NAMES[targetCurrency] || 'Devise inconnue'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {isTargetOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <input
                    type="text"
                    value={targetSearch}
                    onChange={handleTargetSearchChange}
                    placeholder="Rechercher une devise..."
                    className="w-full p-2 border-b border-gray-300 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredTargetCurrencies.map((rate) => (
                      <div
                        key={rate.currency}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleTargetSelect(rate.currency)}
                      >
                        {rate.currency} - {CURRENCY_NAMES[rate.currency] || 'Devise inconnue'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valeurs à convertir (une par ligne, séparées par des virgules ou des points-virgules)
          </label>
          <textarea
            value={inputValues}
            onChange={handleInputChange}
            placeholder="Entrez vos valeurs ici, par exemple: 100&#10;200&#10;300"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 h-32"
          />
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={convertValues}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Convertir
          </button>
        </div>
        
        {conversionResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Résultats</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valeur d'origine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valeur convertie
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conversionResults.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.originalValue.toFixed(2)} {result.originalCurrency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.convertedValue.toFixed(2)} {result.targetCurrency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => copyToClipboard(
                  conversionResults
                    .map(r => `${r.originalValue.toFixed(2)} ${r.originalCurrency} = ${r.convertedValue.toFixed(2)} ${r.targetCurrency}`)
                    .join('\n')
                )}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Copier les résultats
              </button>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Exporter en Excel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 