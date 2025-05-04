// src/app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { sepolia, bscTestnet } from 'wagmi/chains';
import { formatEther, type Abi, zeroAddress, Address } from 'viem'; 

// Import komponentu karty
import CampaignCard from './components/CampaingCard'; // Sprawdź nazwę!

// Import konfiguracji i adresu z wagmi.ts
import { crowdfundContractAddressSepolia } from './wagmi'; 
// const crowdfundContractAddressBscTestnet = '0x...'; 

// Import ABI
import CrowdfundAbi from './contracts/Crowdfund.json';

// Adresy Kontraktów
const contractAddresses: { [chainId: number]: `0x${string}` | undefined } = {
  [sepolia.id]: crowdfundContractAddressSepolia,
  // [bscTestnet.id]: crowdfundContractAddressBscTestnet, 
};

// --- Typy Danych (bez zmian) ---
interface CampaignContractData {
  creator: Address; targetAmount: bigint; raisedAmount: bigint; totalEverRaised: bigint;
  dataCID: string; endTime: bigint; status: number; creationTimestamp: bigint; reclaimDeadline: bigint;
}
interface CombinedCampaignData {
  id: number; contractData: CampaignContractData; 
  ipfsData: { title: string; description: string; imageUrl: string; }
}
// -----------------------------

// Stałe dla paginacji
const CAMPAIGNS_PER_LOAD = 20;
const INITIAL_CAMPAIGN_COUNT = 12;

// --- Style dla przycisków (Fioletowe) ---
const buttonBaseStyle = "px-8 py-3 rounded-xl font-semibold transition-all duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"; // Dodano większe zaokrąglenie i cień
const primaryButtonStyle = `${buttonBaseStyle} bg-[#c5baff] text-white hover:bg-[#b1a5f0] focus:ring-[#c5baff] active:bg-[#a89dd9]`; // Fioletowy
const secondaryButtonStyle = `${buttonBaseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400`; // Szary
// ---------------------------------------


export default function Home() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_CAMPAIGN_COUNT);
  const [fetchedCampaigns, setFetchedCampaigns] = useState<CombinedCampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { chain } = useAccount();
  const currentChainId = chain?.id && contractAddresses[chain.id] ? chain.id : sepolia.id;
  const contractAddress = contractAddresses[currentChainId];
  const contractAbi = CrowdfundAbi.abi as Abi;

  // --- Logika Pobierania Danych (BEZ ZMIAN - wersja działająca z indeksami) ---
  const { data: nextIdFetchResult, isLoading: isLoadingNextId, isError: isErrorNextId } = useReadContracts({ /* ... */ 
      contracts: contractAddress ? [{ address: contractAddress, abi: contractAbi, functionName: 'nextCampaignId' }] : [], query: { enabled: !!contractAddress } });
  const nextCampaignIdResultData = nextIdFetchResult?.[0]; let nextIdValue: bigint = 1n; 
  if (nextCampaignIdResultData?.status === 'success' && nextCampaignIdResultData.result != null) { const resultValue = nextCampaignIdResultData.result; if (typeof resultValue === 'bigint' || typeof resultValue === 'number' || typeof resultValue === 'string' || typeof resultValue === 'boolean') { try { nextIdValue = BigInt(resultValue); } catch (e) { console.error("BigInt conv error", e); } } else { console.warn("Unexpected type for nextId", resultValue); } } else if (nextCampaignIdResultData?.status === 'failure') { console.error("Fetch nextId failed", nextCampaignIdResultData.error); }
  const nextCampaignId = nextIdValue; const totalCampaigns = nextCampaignId > 1n ? Number(nextCampaignId - 1n) : 0;
  const campaignReadsConfig = useMemo(() => { /* ... */ if (!contractAddress || totalCampaigns === 0 || isLoadingNextId || isErrorNextId) return []; return Array.from({ length: totalCampaigns }, (_, i) => ({ address: contractAddress, abi: contractAbi, functionName: 'campaigns', args: [BigInt(i + 1)], })); }, [contractAddress, totalCampaigns, isLoadingNextId, isErrorNextId, contractAbi]);
  const { data: campaignsFetchResults, isLoading: isLoadingCampaigns, isError: isErrorCampaigns } = useReadContracts({ contracts: campaignReadsConfig, query: { enabled: campaignReadsConfig.length > 0 } });
  useEffect(() => { /* ... cała logika przetwarzania i filtrowania z użyciem INDEKSÓW (bez zmian) ... */ const loading = isLoadingNextId || (campaignReadsConfig.length > 0 && isLoadingCampaigns); setIsLoading(loading); if (!loading) { const fetchNextIdErrorObject = nextIdFetchResult?.[0]?.status === 'failure' ? nextIdFetchResult[0].error : null; const fetchCampaignsErrorObject = campaignsFetchResults?.find(r => r.status === 'failure')?.error; if (isErrorNextId || isErrorCampaigns) { let errorMsg = "Wystąpił błąd..."; /* ... */ setError(errorMsg); setFetchedCampaigns([]); } else if (campaignsFetchResults && nextIdFetchResult?.[0]?.status === 'success') { setError(null); const processedCampaigns = campaignsFetchResults.map((result, index) => { const campaignId = index + 1; let contractData: CampaignContractData | null = null; if (result.status === 'success' && Array.isArray(result.result) && result.result.length >= 9) { const campaignArray = result.result; const creatorAddress = campaignArray[0] as Address; if (creatorAddress && creatorAddress !== zeroAddress) { try { contractData = { creator: creatorAddress, targetAmount: BigInt(campaignArray[1]??0n), raisedAmount: BigInt(campaignArray[2]??0n), totalEverRaised: BigInt(campaignArray[3]??0n), dataCID: String(campaignArray[4]??''), endTime: BigInt(campaignArray[5]??0n), status: Number(campaignArray[6]??0), creationTimestamp: BigInt(campaignArray[7]??0n), reclaimDeadline: BigInt(campaignArray[8]??0n) }; } catch (e) { console.error("Parse err",e); contractData = null; } } else { console.warn("Zero creator", campaignId); } } else if (result.status === 'failure') { console.warn("Fetch fail", campaignId, result.error); } else { console.warn("Unexpected format", campaignId, result); } if (!contractData) return null; const imageIndex = (campaignId - 1) % 4; const ipfsData = { title: `Kampania ${campaignId}`, description: `Opis ${campaignId}`, imageUrl: `/images/${['campaign1','campaign2','campaign3','campaign4'][imageIndex]}.png` }; return { id: campaignId, contractData, ipfsData }; }).filter((c): c is CombinedCampaignData => c !== null); setFetchedCampaigns(processedCampaigns); } else if (totalCampaigns === 0) { setFetchedCampaigns([]); setError(null); } else { setError("Nieocz. błąd."); setFetchedCampaigns([]); } } }, [ isLoadingNextId, isLoadingCampaigns, nextIdFetchResult, campaignsFetchResults, isErrorNextId, isErrorCampaigns, totalCampaigns, campaignReadsConfig.length ]);
  // -------------------------------------------------------------------

  const loadMoreCampaigns = () => setVisibleCount(prev => Math.min(prev + CAMPAIGNS_PER_LOAD, fetchedCampaigns.length));
  const hasMoreCampaigns = visibleCount < fetchedCampaigns.length;

  const showLoading = isLoading;
  const showError = !isLoading && error;
  const showNoCampaigns = !isLoading && !error && fetchedCampaigns.length === 0;
  const showCampaigns = !isLoading && !error && fetchedCampaigns.length > 0;

  return (
    // Tło strony jasnoszare
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8"> 
          
          {/* Sekcja Hero */}
          <div className="text-center mb-16 pt-12"> 
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                  Masz Pomysł? Potrzebujesz Wsparcia?
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Stwórz własną kampanię crowdfundingową na naszej zdecentralizowanej platformie i zbierz potrzebne środki.
              </p>
              {/* Przycisk Fioletowy */}
              <button className={primaryButtonStyle}>
                  Stwórz Kampanię {/* TODO: Add logic */}
              </button>
          </div>

          {/* Komunikaty */}
          {showLoading && <p className="text-center my-12 text-lg text-gray-500">Ładowanie kampanii...</p>}
          {showError && <p className="text-center my-12 text-red-600">{error}</p>}
          {showNoCampaigns && ( <p className="text-center my-12 text-gray-500">Nie znaleziono żadnych aktywnych kampanii.</p> )}

          {/* Sekcja Zbiórki Dnia */}
          {showCampaigns && (
              <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Zbiórki Dnia</h2>
                  {fetchedCampaigns.length > 0 ? (
                    // Zmniejszono max-w dla sekcji "Zbiórki Dnia", gap bez zmian
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"> 
                      {fetchedCampaigns.slice(0, 3).map((campaign) => (
                          // Renderujemy BARDZIEJ zaokrągloną kartę
                          <CampaignCard 
                              key={`daily-${campaign.id}`}
                              id={campaign.id}
                              title={campaign.ipfsData.title}
                              description={campaign.ipfsData.description}
                              imageUrl={campaign.ipfsData.imageUrl}
                              targetAmount={formatEther(campaign.contractData.targetAmount)}
                              raisedAmount={formatEther(campaign.contractData.raisedAmount)}
                              endDate={new Date(Number(campaign.contractData.endTime) * 1000).toLocaleDateString()}
                          />
                      ))}
                    </div>
                  ) : ( <p className="text-center text-gray-500">Brak kampanii do wyróżnienia.</p> )}
              </div>
          )}

          {/* Wszystkie Kampanie */}
          {showCampaigns && (
              <>
                  <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Wszystkie Kampanie</h2>
                  {/* Siatka z większymi odstępami */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> 
                      {fetchedCampaigns.slice(0, visibleCount).map((campaign) => (
                          <CampaignCard
                              key={campaign.id}
                              id={campaign.id}
                              title={campaign.ipfsData.title}
                              description={campaign.ipfsData.description}
                              imageUrl={campaign.ipfsData.imageUrl}
                              targetAmount={formatEther(campaign.contractData.targetAmount)}
                              raisedAmount={formatEther(campaign.contractData.raisedAmount)}
                              endDate={new Date(Number(campaign.contractData.endTime) * 1000).toLocaleDateString()}
                          />
                      ))}
                  </div>

                  {/* Przycisk "Rozwiń Więcej" - styl drugorzędny */}
                  {hasMoreCampaigns && (
                      <div className="text-center mt-12 mb-8">
                          <button onClick={loadMoreCampaigns} className={secondaryButtonStyle}>
                              Rozwiń Więcej Kampanii
                          </button>
                      </div>
                  )}
              </>
          )}
      </div>
    </main>
  );
}