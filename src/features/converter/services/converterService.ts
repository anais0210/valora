import ExcelJS from 'exceljs';
import { Conversion, ConverterSettings } from '../types';

const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

export class ConverterService {
  private static instance: ConverterService;
  private settings: ConverterSettings;
  private CURRENCY_NAMES: Record<string, string> = {
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
    IMP: "Livre de l'île de Man",
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
    TOP: "Pa'anga tongan",
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
    XAF: "Franc CFA d'Afrique centrale",
    XCD: 'Dollar des Caraïbes orientales',
    XDR: 'Droit de tirage spécial',
    XOF: "Franc CFA d'Afrique de l'Ouest",
    XPF: 'Franc CFP',
    YER: 'Rial yéménite',
    ZAR: 'Rand sud-africain',
    ZMW: 'Kwacha zambien',
    ZWL: 'Dollar zimbabwéen',
  };

  private constructor(settings: ConverterSettings) {
    this.settings = settings;
  }

  static getInstance(settings: ConverterSettings): ConverterService {
    if (!ConverterService.instance) {
      ConverterService.instance = new ConverterService(settings);
    }
    return ConverterService.instance;
  }

  async convert(from: string, to: string, amount: number, rate: number): Promise<Conversion> {
    const result = this.round(amount * rate);

    const conversion: Conversion = {
      from,
      to,
      amount,
      result,
      rate,
      timestamp: Date.now(),
    };

    return conversion;
  }

  private round(value: number): number {
    const factor = Math.pow(10, this.settings.decimalPlaces);
    return Math.round(value * factor) / factor;
  }

  isCacheValid(): boolean {
    return !this.settings.isOfflineMode && Date.now() - this.settings.lastUpdate < CACHE_DURATION;
  }

  updateSettings(settings: Partial<ConverterSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  public getCurrencyNames(): Record<string, string> {
    return this.CURRENCY_NAMES;
  }

  public async fetchCurrencyRates(): Promise<{ currency: string; rate: number }[]> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      return Object.entries(data.rates).map(([currency, rate]) => ({
        currency,
        rate: rate as number,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des taux de change:', error);
      throw error;
    }
  }

  public async exportToExcel(conversions: Conversion[], sourceCurrency: string, targetCurrency: string): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Valora';
    workbook.lastModifiedBy = 'Valora';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet('Conversions de devises');

    worksheet.columns = [
      { header: "Valeur d'origine", key: 'originalValue', width: 15 },
      { header: "Devise d'origine", key: 'originalCurrency', width: 15 },
      { header: 'Valeur convertie', key: 'convertedValue', width: 15 },
      { header: 'Devise cible', key: 'targetCurrency', width: 15 },
      { header: 'Taux de change', key: 'rate', width: 15 },
    ];

    conversions.forEach(result => {
      const rate = result.result / result.amount;
      worksheet.addRow({
        originalValue: result.amount,
        originalCurrency: result.from,
        convertedValue: result.result,
        targetCurrency: result.to,
        rate: rate,
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    worksheet.getColumn('originalValue').numFmt = '#,##0.00';
    worksheet.getColumn('convertedValue').numFmt = '#,##0.00';
    worksheet.getColumn('rate').numFmt = '#,##0.0000';

    const infoSheet = workbook.addWorksheet('Informations');
    infoSheet.columns = [
      { header: 'Information', key: 'info', width: 30 },
      { header: 'Valeur', key: 'value', width: 30 },
    ];

    infoSheet.addRow({ info: 'Date de conversion', value: new Date().toLocaleString() });
    infoSheet.addRow({ info: 'Devise source', value: sourceCurrency });
    infoSheet.addRow({ info: 'Devise cible', value: targetCurrency });
    infoSheet.addRow({ info: 'Nombre de conversions', value: conversions.length });

    infoSheet.getRow(1).font = { bold: true };
    infoSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }

  public copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }

  static getCurrencyNames(): Record<string, string> {
    return {
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
      IMP: "Livre de l'île de Man",
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
      TOP: "Pa'anga tongan",
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
      XAF: "Franc CFA d'Afrique centrale",
      XCD: 'Dollar des Caraïbes orientales',
      XDR: 'Droit de tirage spécial',
      XOF: "Franc CFA d'Afrique de l'Ouest",
      XPF: 'Franc CFP',
      YER: 'Rial yéménite',
      ZAR: 'Rand sud-africain',
      ZMW: 'Kwacha zambien',
      ZWL: 'Dollar zimbabwéen',
    };
  }
}
