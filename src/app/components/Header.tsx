// src/components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// Importujemy ConnectButton - upewnij się, że ścieżka jest poprawna
import { ConnectButton } from './ConnectButton';

// Ikony SVG (bez zmian)
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" /></svg> );
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg> );
const LanguageIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg> );

// --- Style (bez zmian) ---
const iconButtonBaseStyle = "p-2 rounded-2xl transition-all duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";
const primaryIconButton = `${iconButtonBaseStyle} bg-[#c5baff] text-white hover:bg-[#b1a5f0] focus:ring-[#c5baff] active:bg-[#a89dd9] active:shadow-inner`;
// ------------------------------------------------------------------

// Używamy tylko eksportu nazwanego
export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => { setIsDarkMode(!isDarkMode); console.log("TODO: Implement theme toggle logic"); };
  const toggleLanguage = () => { console.log("TODO: Implement language toggle logic"); };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-6 sm:gap-8">

        {/* Logo */}
        <div>
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
            CrowdPlatform
          </Link>
        </div>

        {/* Nawigacja */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/zbiorki" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Zbiórki
          </Link>
          <Link href="/kampanie" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Kampanie
          </Link>
          <Link href="/startupy" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Startupy
          </Link>
        </div>

        {/* Akcje Użytkownika */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          {/* Przycisk Motywu */}
          <button
            onClick={toggleTheme}
            className={primaryIconButton}
            aria-label="Przełącz motyw"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Przycisk Języka */}
          <button
            onClick={toggleLanguage}
            className={primaryIconButton}
            aria-label="Zmień język"
          >
             <LanguageIcon />
          </button>

          {/* Przycisk Portfela */}
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}

// Usunięto zbędny export default;