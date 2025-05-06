// src/wagmi.ts
import { defaultWagmiConfig } from '@web3modal/wagmi/react'
// Importujemy typ 'Chain' oraz definicje sieci
import { type Chain, sepolia, bscTestnet } from 'wagmi/chains'

// 1. Twój Project ID z WalletConnect Cloud
const projectId = '11e6272e1d9a80a2801aa4cfae0c1948';
if (!projectId) throw new Error('WalletConnect Project ID is required');

// 2. Definiujemy metadane dla Twojej aplikacji (widoczne w modalu WalletConnect)
const metadata = {
  name: 'Crowdfunding Platform', 
  description: 'Zdecentralizowana Platforma Crowdfundingowa', 
  url: 'http://localhost:3000', // Zmień!
  icons: ['https://avatars.githubusercontent.com/u/37784886'] // Zmień!
}

// 3. Definiujemy lista sieci, które ma obsługiwać aplikacja
const chains: Chain[] = [sepolia, bscTestnet]; 

// --- NOWA SEKCJA: Definicja Adresu Kontraktu ---
// Definiujemy stałą z adresem kontraktu Crowdfund na sieci Sepolia
const crowdfundContractAddressSepolia = '0xbCa6057F8a145f2d514E42A26543d467CfA299B1' as const; 
// 'as const' jest opcjonalne, ale może pomóc TypeScriptowi traktować to jako stałą dosłowną

// Możesz tu dodać adresy dla innych sieci, jeśli planujesz
// const crowdfundContractAddressBscTestnet = '0xTwojAdresNaBscTestnet'; 
// ---------------------------------------------


// 4. Tworzymy konfigurację wagmi używając funkcji z Web3Modal
const config = defaultWagmiConfig({
  chains: chains, 
  projectId, 
  metadata, 
})

// Eksportujemy wszystko razem na końcu pliku
// DODAJEMY NOWĄ STAŁĄ DO EKSPORTU
export { config, projectId, chains, crowdfundContractAddressSepolia } 
// Jeśli dodasz adres dla BSC, też go tu wyeksportuj:
// export { config, projectId, chains, crowdfundContractAddressSepolia, crowdfundContractAddressBscTestnet }