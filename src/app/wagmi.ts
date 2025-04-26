// src/wagmi.ts
import { defaultWagmiConfig } from '@web3modal/wagmi/react'
// Importujemy typ 'Chain' oraz definicje sieci
import { type Chain, sepolia, bscTestnet } from 'wagmi/chains'

// 1. Twój Project ID z WalletConnect Cloud
// USUWAMY 'export' stąd
const projectId = '11e6272e1d9a80a2801aa4cfae0c1948';
if (!projectId) throw new Error('WalletConnect Project ID is required');

// 2. Definiujemy metadane dla Twojej aplikacji (widoczne w modalu WalletConnect)
const metadata = {
  name: 'Crowdfunding Platform', // Zmień na nazwę Twojej aplikacji
  description: 'Zdecentralizowana Platforma Crowdfundingowa', // Zmień na opis
  url: 'https://twoja-domena.com', // WAŻNE: Zmień na adres URL Twojej przyszłej strony
  icons: ['https://avatars.githubusercontent.com/u/37784886'] // WAŻNE: Zmień na URL do ikony Twojej aplikacji
}

// 3. Definiujemy lista sieci, które ma obsługiwać aplikacja
// USUWAMY 'export' stąd
const chains: Chain[] = [sepolia, bscTestnet];
// Możesz dodać więcej sieci w przyszłości, np.:
// import { mainnet, bsc } from 'wagmi/chains';
// const chains: Chain[] = [mainnet, bsc, sepolia, bscTestnet];


// 4. Tworzymy konfigurację wagmi używając funkcji z Web3Modal
// USUWAMY 'export' stąd, bo eksportujemy na dole
const config = defaultWagmiConfig({
  chains: chains, // Przekazujemy jawnie otypowaną tablicę sieci
  projectId, // Twój Project ID z WalletConnect
  metadata, // Metadane aplikacji
  // Opcjonalnie: Możesz wyłączyć niektóre domyślne portfele, np. Coinbase
  // enableCoinbase: false,
})

// Eksportujemy wszystko razem na końcu pliku
export { config, projectId, chains }