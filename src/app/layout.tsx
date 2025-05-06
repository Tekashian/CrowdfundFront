// src/app/layout.tsx
// Server Component (BEZ 'use client')

import type { Metadata } from "next";
// UŻYJ TEGO IMPORTU PO INSTALACJI 'geist':
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Web3ProviderClientLoader } from './providers/Web3ProviderClientLoader'; // Dostosuj ścieżkę!
import { Header } from './components/Header'; // Dostosuj ścieżkę!
import Footer from './components/Footer'; // Dostosuj ścieżkę!
import React from "react";

// Metadane (bez zmian)
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
    // Używamy rekomendowanego className z GeistSans
    <html lang="pl" className={GeistSans.className}>
      <body className="antialiased flex flex-col min-h-screen bg-gray-50">
        <Web3ProviderClientLoader>
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 pb-10">
            {children}
          </main>
          <Footer />
        </Web3ProviderClientLoader>
      </body>
    </html>
  );
}