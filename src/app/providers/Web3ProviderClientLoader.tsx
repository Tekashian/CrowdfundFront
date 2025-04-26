    // src/providers/Web3ProviderClientLoader.tsx
    'use client'; // Ten komponent MUSI być kliencki, aby używać dynamic(..., { ssr: false })

    import dynamic from 'next/dynamic';
    import React from 'react';

    // --- Dynamiczny import naszego WŁAŚCIWEGO Providera ---
    // Odbywa się to teraz wewnątrz komponentu klienckiego
    const Web3ModalProvider = dynamic(
      () => import('./Web3ModalProvider').then((mod) => mod.Web3ModalProvider), // Ścieżka do właściwego providera
      {
        ssr: false, // Wyłączamy renderowanie po stronie serwera
        // Opcjonalnie: Komponent ładowania
        // loading: () => <p>Ładowanie Web3...</p>,
      }
    );
    // -----------------------------------------

    // Komponent Pośrednika po prostu renderuje dynamicznie załadowany Provider
    export function Web3ProviderClientLoader({ children }: { children: React.ReactNode }) {
      return (
        <Web3ModalProvider>
          {children}
        </Web3ModalProvider>
      );
    }
    