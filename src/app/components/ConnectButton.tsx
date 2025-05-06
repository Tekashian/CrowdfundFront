// src/components/ConnectButton.tsx
'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import React from 'react'; // Dodaj import React dla JSX

// --- Style (bez zmian) ---
const buttonBaseStyle = "px-5 py-2 rounded-2xl font-medium text-sm transition-all duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap";
const primaryButtonStyle = `${buttonBaseStyle} bg-[#c5baff] text-white hover:bg-[#b1a5f0] focus:ring-[#c5baff] active:bg-[#a89dd9] active:shadow-inner`;
// ----------------------------------------------------------------

export function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  // Funkcja obsługująca kliknięcie
  const handleClick = () => {
    if (isConnected) {
      console.log('Button clicked: Disconnecting...'); // Log przed rozłączeniem
      disconnect();
    } else {
      console.log('Button clicked: Opening Web3Modal...'); // Log przed otwarciem modala
      open(); // Wywołanie funkcji otwierającej modal
    }
  };

  return (
    <button
      onClick={handleClick} // Używamy nowej funkcji
      className={primaryButtonStyle}
      title={isConnected ? `Połączony jako ${address} przez ${connector?.name ?? 'nieznany portfel'}` : 'Połącz portfel'}
    >
      {isConnected ? (
        <span>
           {address?.slice(0, 5)}...{address?.slice(-4)}
        </span>
      ) : (
        'Połącz Portfel'
      )}
    </button>
  );
}