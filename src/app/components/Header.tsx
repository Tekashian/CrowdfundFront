// src/components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from './ConnectButton'; // Zakładamy, że ten komponent istnieje

// Ikony SVG (bez zmian)
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" /></svg> );
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg> );
const LanguageIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg> );


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Przełączanie motywu - TODO");
  };

  const toggleLanguage = () => {
    console.log("Przełączanie języka - TODO");
  };


  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-gray-50/75 shadow-lg backdrop-blur-sm' : 'bg-black-50 shadow-md'}
      `}
    >
      {/* ZMIANA: Usunięto justify-between, dodano gap dla odstępu */}
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-8"> {/* ZMIANA */}

        {/* Sekcja Lewa: Logo (bez zmian) */}
        <div>
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            CrowdPlatform
          </Link>
        </div>

        {/* Sekcja Środkowa: Menu Nawigacyjne (bez zmian wewnątrz, ale pozycja się zmieni) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/zbiorki" className="text-gray-700 hover:text-blue-600 font-medium">
            Zbiórki
          </Link>
          <Link href="/kampanie" className="text-gray-700 hover:text-blue-600 font-medium">
            Kampanie
          </Link>
          <Link href="/startupy" className="text-gray-700 hover:text-blue-600 font-medium">
            Startupy
          </Link>
        </div>

        {/* Sekcja Prawa: Akcje Użytkownika */}
        {/* ZMIANA: Dodano ml-auto, aby przesunąć całą sekcję w prawo */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-auto"> {/* ZMIANA */}
          {/* Przełącznik Motywu */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            aria-label="Przełącz motyw"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Przełącznik Języka */}
           <button
            onClick={toggleLanguage}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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

export default Header;
