import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-beige-light)] border-t border-[var(--color-green-200)] py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <Link
            to="/privacy-policy"
            className="text-[var(--color-green-800)] hover:text-[var(--color-green-600)] transition-colors duration-200 text-sm"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};
