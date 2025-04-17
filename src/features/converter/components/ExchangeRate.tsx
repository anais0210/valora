import React from 'react';

interface ExchangeRateProps {
  from: string;
  to: string;
  rate: number;
  isOffline: boolean;
}

export const ExchangeRate: React.FC<ExchangeRateProps> = ({ from, to, rate, isOffline }) => {
  return (
    <div className="mt-2 text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">
          1 <span className="font-medium text-primary-600">{from}</span> ={' '}
          <span className="font-medium text-primary-600">{rate.toFixed(4)}</span> {to}
        </span>
        {isOffline && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            Hors ligne
          </span>
        )}
      </div>
    </div>
  );
};
