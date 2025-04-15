import { Conversion, ConverterSettings } from '../types';

const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

export class ConverterService {
  private static instance: ConverterService;
  private settings: ConverterSettings;

  private constructor(settings: ConverterSettings) {
    this.settings = settings;
  }

  static getInstance(settings: ConverterSettings): ConverterService {
    if (!ConverterService.instance) {
      ConverterService.instance = new ConverterService(settings);
    }
    return ConverterService.instance;
  }

  async convert(
    from: string,
    to: string,
    amount: number,
    rate: number
  ): Promise<Conversion> {
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
    return (
      !this.settings.isOfflineMode &&
      Date.now() - this.settings.lastUpdate < CACHE_DURATION
    );
  }

  updateSettings(settings: Partial<ConverterSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }
} 