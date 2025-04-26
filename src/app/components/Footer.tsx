// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link'; // Do tworzenia linków

export function Footer() {
  const currentYear = new Date().getFullYear(); // Automatycznie pobieramy bieżący rok

  return (
    <footer className="bg-gray-50 shadow-md mt-auto"> {/* Jasnoszare tło, cień, mt-auto "popycha" stopkę w dół */}
      <div className="container mx-auto px-6 py-4 text-center text-gray-600 text-sm"> {/* Kontener centrujący, padding, wyśrodkowany tekst */}

        {/* Informacja o prawach autorskich */}
        <p>&copy; {currentYear} CrowdPlatform. Wszelkie prawa zastrzeżone.</p>

        {/* Link do kodu źródłowego - WAŻNE dla transparentności w Web3 */}
        <p className="mt-2">
          Zobacz kod źródłowy na{' '}
          <Link
            href="https://github.com/twoj-uzytkownik/twoje-repozytorium" // WAŻNE: Zmień na prawdziwy link do Twojego repozytorium!
            target="_blank" // Otwiera link w nowej karcie
            rel="noopener noreferrer" // Dobre praktyki bezpieczeństwa dla linków zewnętrznych
            className="text-blue-600 hover:text-blue-800 underline"
          >
            GitHub
          </Link>
          .
        </p>

        {/* Możesz tu dodać więcej linków w przyszłości, np. do regulaminu */}
        {/* <div className="mt-2 space-x-4">
          <Link href="/terms" className="hover:underline">Regulamin</Link>
          <Link href="/privacy" className="hover:underline">Polityka Prywatności</Link>
        </div> */}

      </div>
    </footer>
  );
}

// Eksportujemy domyślnie
export default Footer;
