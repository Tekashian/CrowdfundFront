// src/components/Header.tsx
'use client'; // Komponent nadal musi być kliencki

import React, { useState, useEffect } from 'react'; // Importujemy hooki useState i useEffect
import Link from 'next/link';
import { ConnectButton } from './ConnectButton';

export function Header() {
  // --- Logika do śledzenia przewijania ---
  const [isScrolled, setIsScrolled] = useState(false); // Stan: czy strona jest przewinięta?

  useEffect(() => {
    // Funkcja, która będzie sprawdzać pozycję przewinięcia
    const handleScroll = () => {
      // Jeśli przewinięto więcej niż 10 pikseli od góry, ustawiamy isScrolled na true
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        // W przeciwnym razie ustawiamy na false
        setIsScrolled(false);
      }
    };

    // Dodajemy "nasłuchiwacz" na zdarzenie przewijania strony
    window.addEventListener('scroll', handleScroll);

    // Ważne: Sprzątamy po sobie, gdy komponent przestaje być widoczny
    // Usuwamy "nasłuchiwacz", aby nie działał niepotrzebnie w tle
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Pusta tablica zależności oznacza, że ten efekt uruchomi się tylko raz, po załadowaniu komponentu
  // --- Koniec logiki przewijania ---

  return (
    // --- Zmiany w tagu <header> ---
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-white/90 shadow-lg backdrop-blur-sm' : 'bg-white shadow-md'}
      `}
      // Klasy:
      // sticky top-0 z-50: Przykleja nagłówek do góry ekranu i nadaje mu wysoki priorytet (z-index)
      // transition-all duration-300 ease-in-out: Dodaje płynne przejście dla zmian wyglądu
      // ${isScrolled ? ... : ...}: Warunkowe dodawanie klas:
      //   - Jeśli isScrolled jest true (przewinięto):
      //     - bg-white/90: Białe tło z lekką przezroczystością (90%)
      //     - shadow-lg: Mocniejszy cień
      //     - backdrop-blur-sm: Lekkie rozmycie tła pod nagłówkiem (efekt "oszronionej szyby")
      //   - Jeśli isScrolled jest false (na górze strony):
      //     - bg-white: Pełne białe tło
      //     - shadow-md: Standardowy, lekki cień
    >
      {/* Reszta kodu nawigacji pozostaje taka sama */}
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Sekcja Lewa: Logo */}
        <div>
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            CrowdPlatform
          </Link>
        </div>

        {/* Sekcja Środkowa: Menu Nawigacyjne */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Przeglądaj Kampanie
          </Link>
          {/* <Link href="/create" className="text-gray-700 hover:text-blue-600">Stwórz Kampanię</Link> */}
          {/* <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600">Jak to działa?</Link> */}
        </div>

        {/* Sekcja Prawa: Przycisk Portfela */}
        <div>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}

export default Header;
