    // src/providers/Web3ModalProvider.tsx
    'use client'; // Nadal Client Component

    import React, { ReactNode, useState, useEffect } from 'react';
    // Importujemy konfigurację wagmi
    import { config, projectId, chains } from '../wagmi'; // Dostosuj ścieżkę jeśli trzeba
    import { createWeb3Modal } from '@web3modal/wagmi/react';
    // Importujemy WagmiProvider
    import { WagmiProvider } from 'wagmi';
    // NOWE IMPORTY: Importujemy rzeczy z @tanstack/react-query
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

    // --- Inicjalizacja Web3Modal ---
    if (!projectId) throw new Error("Project ID is not defined in Web3ModalProvider");
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      chains,
    });
    // -----------------------------

    // NOWOŚĆ: Tworzymy instancję klienta zapytań (nasze "biurko")
    // Robimy to tylko raz, aby nie tworzyć nowego przy każdym renderowaniu
    const queryClient = new QueryClient();

    export function Web3ModalProvider({ children }: { children: ReactNode }) {
      const [isMounted, setIsMounted] = useState(false);
      useEffect(() => { setIsMounted(true); }, []);

      if (!isMounted) { return null; }

      return (
        // NOWOŚĆ: OWIJAMY wszystko w QueryClientProvider
        <QueryClientProvider client={queryClient}>
          {/* WagmiProvider jest teraz WEWNĄTRZ QueryClientProvider */}
          <WagmiProvider config={config} reconnectOnMount={false}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      );
    }
    