// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    // Białe tło stopki z subtelną linią górną
    <footer className="bg-white border-t border-gray-200 mt-auto"> 
      <div className="container mx-auto px-6 py-6 text-center text-gray-600 text-sm"> 

        <p>&copy; {currentYear} CrowdPlatform. Wszelkie prawa zastrzeżone.</p>

        <p className="mt-2">
          Zobacz kod źródłowy na{' '}
          <Link
            href="https://github.com/twoj-uzytkownik/twoje-repozytorium" // WAŻNE: Zmień link!
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline transition-colors" // Standardowy niebieski link
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;