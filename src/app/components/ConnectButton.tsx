// src/components/ConnectButton.tsx
'use client'; // Ten komponent będzie używał hooków, więc musi być kliencki

import { useWeb3Modal } from '@web3modal/wagmi/react'; // Importujemy hook do otwierania modala
import { useAccount, useDisconnect } from 'wagmi'; // Importujemy hooki do sprawdzania statusu połączenia i rozłączania

export function ConnectButton() {
  // Pobieramy funkcję do otwierania modala Web3Modal
  const { open } = useWeb3Modal();
  // Pobieramy informacje o połączonym koncie
  const { address, isConnected } = useAccount();
  // Pobieramy funkcję do rozłączania portfela
  const { disconnect } = useDisconnect();

  // Prosty przycisk, który zmienia swoje zachowanie w zależności od statusu połączenia
  return (
    <button
      onClick={() => (isConnected ? disconnect() : open())} // Jeśli połączony - rozłącz, jeśli nie - otwórz modal
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" // Proste style Tailwind
    >
      {isConnected ? (
        // Jeśli połączony, wyświetl skrócony adres i opcję rozłączenia
        <span>
          Połączono: {address?.slice(0, 6)}...{address?.slice(-4)} (Rozłącz)
        </span>
      ) : (
        // Jeśli nie połączony, wyświetl tekst zachęcający do połączenia
        'Połącz Portfel'
      )}
    </button>
  );

  /*
  // --- Alternatywa: Gotowy przycisk od Web3Modal ---
  // Jeśli nie chcesz stylować własnego przycisku, możesz użyć gotowego:
  // return <w3m-button />;
  // Ten komponent sam obsłuży całą logikę i wygląd.
  // Aby go użyć, nie potrzebujesz hooków useWeb3Modal, useAccount, useDisconnect w tym pliku.
  */
}

// Eksportujemy domyślnie, aby łatwiej używać w innych miejscach
export default ConnectButton;
