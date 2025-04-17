import { useConverterStore } from '../store';
import { Conversion } from '../types';

export const useConversionHistory = () => {
  const { conversions, addConversion, currentConversion, currentMultipleConversions } =
    useConverterStore();

  const updateHistory = (conversion: Conversion) => {
    addConversion(conversion);
  };

  const updateMultipleHistory = (conversions: Conversion[]) => {
    conversions.forEach(conversion => {
      addConversion(conversion);
    });
  };

  return {
    conversions,
    currentConversion,
    currentMultipleConversions,
    updateHistory,
    updateMultipleHistory,
  };
};
