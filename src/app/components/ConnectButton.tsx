// src/components/ConnectButton.tsx
'use client'; 

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

// --- Style dla fioletowego przycisku z większym zaokrągleniem ---
const buttonBaseStyle = "px-5 py-2 rounded-2xl font-medium text-sm transition-all duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap"; // Bardziej zaokrąglony
const primaryButtonStyle = `${buttonBaseStyle} bg-[#c5baff] text-white hover:bg-[#b1a5f0] focus:ring-[#c5baff] active:bg-[#a89dd9] active:shadow-inner`; // Dodano active:shadow-inner
// ----------------------------------------------------------------

export function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <button
      onClick={() => (isConnected ? disconnect() : open())}
      className={primaryButtonStyle} 
    >
      {isConnected ? (
        <span>
           {address?.slice(0, 5)}...{address?.slice(-4)} (Rozłącz)
        </span>
      ) : (
        'Połącz Portfel'
      )}
    </button>
  );
}

export default ConnectButton;