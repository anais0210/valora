import React from 'react';
import { useConverterStore } from '../store';

interface FavoritePairsProps {
  onSelectPair: (from: string, to: string) => void;
}

export const FavoritePairs: React.FC<FavoritePairsProps> = ({ onSelectPair }) => {
  const favorites = useConverterStore(state => state.favorites);
  const removeFavorite = useConverterStore(state => state.removeFavorite);

  if (favorites.length === 0) {
    return (
      <div className="bg-surface-light rounded-lg p-4 border-2 border-secondary-200 text-center">
        <p className="text-secondary-600">Aucune paire favorite enregistrée</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-lg shadow-lg border-2 border-secondary-200 overflow-hidden">
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Paires favorites
        </h2>
      </div>

      <div className="divide-y divide-secondary-100">
        {favorites.map((favorite, index) => (
          <div
            key={`${favorite.from}-${favorite.to}-${index}`}
            className="p-4 bg-gradient-to-r from-surface-light to-surface hover:from-secondary-50 hover:to-secondary-100 transition-all duration-200 cursor-pointer group flex justify-between items-center"
            onClick={() => onSelectPair(favorite.from, favorite.to)}
          >
            <div className="flex items-center space-x-2">
              <span className="font-medium text-secondary-700">{favorite.from}</span>
              <span className="text-secondary-400">→</span>
              <span className="font-medium text-secondary-700">{favorite.to}</span>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                removeFavorite(favorite);
              }}
              className="opacity-0 group-hover:opacity-100 px-3 py-1 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded transition-all duration-200"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
