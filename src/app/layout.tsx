// src/app/layout.tsx
// Ten komponent POZOSTAJE Server Component (BEZ 'use client')

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Importujemy nasz komponent-pośrednik Web3
import { Web3ProviderClientLoader } from './providers/Web3ProviderClientLoader'; // Upewnij się, że ścieżka jest poprawna
// Importujemy komponenty Header i Footer
import Header from './components/Header'; // Upewnij się, że ścieżka jest poprawna
import Footer from './components/Footer'; // Upewnij się, że ścieżka jest poprawna
import React from "react";

// Konfiguracja czcionek Geist (bez zmian)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadane - mogą być tutaj
export const metadata: Metadata = {
  title: "Crowdfunding Platform",
  description: "Zdecentralizowana Platforma Crowdfundingowa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Dodajemy klasy flex flex-col min-h-screen dla układu */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Używamy naszego komponentu-pośrednika Web3 */}
        <Web3ProviderClientLoader>
          {/* Nagłówek na górze */}
          <Header />

          {/* Główna treść strony (children) */}
          {/* Klasa flex-grow sprawia, że ten element wypełnia dostępną przestrzeń */}
          <main className="flex-grow container mx-auto px-6 py-4"> {/* Przykładowe style dla treści */}
            {children}
          </main>

          {/* DODAJEMY Stopkę TUTAJ, po głównej treści */}
          <Footer />

        </Web3ProviderClientLoader>
      </body>
    </html>
  );
}
