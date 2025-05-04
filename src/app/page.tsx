// src/app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { sepolia, bscTestnet } from 'wagmi/chains';
import { formatEther, type Abi, zeroAddress, Address } from 'viem'; // Dodano Address z viem

// Import komponentu karty
import CampaignCard from './components/CampaingCard'; // Sprawdź poprawność nazwy pliku!

// Import konfiguracji i adresu z wagmi.ts
import { crowdfundContractAddressSepolia } from './wagmi';
// const crowdfundContractAddressBscTestnet = '0x4aACB8F57341bEE519f2981Ba91935EEdd20E43e';

// Import ABI
import CrowdfundAbi from './contracts/Crowdfund.json';

// Adresy Kontraktów dla różnych sieci
const contractAddresses: { [chainId: number]: `0x${string}` | undefined } = {
  [sepolia.id]: crowdfundContractAddressSepolia,
  // [bscTestnet.id]: crowdfundContractAddressBscTestnet, 
};

// Typ dla danych z kontraktu (struktura pozostaje taka sama dla logiki)
interface CampaignContractData {
  creator: Address; // Używamy typu Address z viem
  targetAmount: bigint;
  raisedAmount: bigint;
  totalEverRaised: bigint;
  dataCID: string;
  endTime: bigint;
  status: number;
  creationTimestamp: bigint;
  reclaimDeadline: bigint;
}

// Typ dla danych połączonych
interface CombinedCampaignData {
  id: number;
  contractData: CampaignContractData; 
  ipfsData: { title: string; description: string; imageUrl: string; }
}

// Stałe dla paginacji
const CAMPAIGNS_PER_LOAD = 20;
const INITIAL_CAMPAIGN_COUNT = 12;


export default function Home() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_CAMPAIGN_COUNT);
  const [fetchedCampaigns, setFetchedCampaigns] = useState<CombinedCampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { chain } = useAccount();
  const currentChainId = chain?.id && contractAddresses[chain.id] ? chain.id : sepolia.id;
  const contractAddress = contractAddresses[currentChainId];
  const contractAbi = CrowdfundAbi.abi as Abi;

  // 1. Pobieramy nextCampaignId
  const {
      data: nextIdFetchResult, 
      isLoading: isLoadingNextId,
      isError: isErrorNextId,
  } = useReadContracts({
      contracts: contractAddress ? [{
          address: contractAddress,
          abi: contractAbi,
          functionName: 'nextCampaignId',
      }] : [],
      query: { enabled: !!contractAddress }
  });

  console.log("(Final Check) Raw nextIdFetchResult:", nextIdFetchResult);

  // Bezpieczne odczytanie wyniku dla nextCampaignId
  const nextCampaignIdResultData = nextIdFetchResult?.[0];
  let nextIdValue: bigint = 1n; 
  
  if (nextCampaignIdResultData?.status === 'success' && 
      nextCampaignIdResultData.result != null) { 
      const resultValue = nextCampaignIdResultData.result;
      if (typeof resultValue === 'bigint' || typeof resultValue === 'number' || typeof resultValue === 'string' || typeof resultValue === 'boolean') {
          try {
              nextIdValue = BigInt(resultValue); 
              console.log("(Final Check) Successfully converted nextCampaignId result to BigInt:", nextIdValue);
          } catch (e) {
              console.error("(Final Check) Could not convert nextCampaignId result to BigInt:", resultValue, e);
          }
      } else {
           console.warn("(Final Check) nextCampaignId result received but is of unexpected type:", typeof resultValue, resultValue);
      }
  } else if (nextCampaignIdResultData?.status === 'failure') {
       console.error("(Final Check) Failed to fetch nextCampaignId (status failure):", nextCampaignIdResultData.error);
  }

  const nextCampaignId = nextIdValue;
  const totalCampaigns = nextCampaignId > 1n ? Number(nextCampaignId - 1n) : 0;

  console.log("(Final Check) Calculated nextCampaignId:", nextCampaignId.toString());
  console.log("(Final Check) Calculated totalCampaigns:", totalCampaigns);

  // 2. Przygotowujemy konfigurację dla useReadContracts
  const campaignReadsConfig = useMemo(() => {
      if (!contractAddress || totalCampaigns === 0 || isLoadingNextId || isErrorNextId) {
          return [];
      }
      return Array.from({ length: totalCampaigns }, (_, i) => ({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'campaigns',
          args: [BigInt(i + 1)], // ID od 1 do totalCampaigns
      }));
  }, [contractAddress, totalCampaigns, isLoadingNextId, isErrorNextId, contractAbi]);

  // 3. Pobieramy dane kampanii (batch)
  const {
      data: campaignsFetchResults,
      isLoading: isLoadingCampaigns,
      isError: isErrorCampaigns,
  } = useReadContracts({
      contracts: campaignReadsConfig,
      query: { enabled: campaignReadsConfig.length > 0 }
  });

  // 4. Efekt do przetwarzania wyników
  useEffect(() => {
      const loading = isLoadingNextId || (campaignReadsConfig.length > 0 && isLoadingCampaigns);
      setIsLoading(loading);

      if (!loading) {
          const fetchNextIdErrorObject = nextIdFetchResult?.[0]?.status === 'failure' ? nextIdFetchResult[0].error : null;
          const fetchCampaignsErrorObject = campaignsFetchResults?.find(r => r.status === 'failure')?.error;

          if (isErrorNextId || isErrorCampaigns) { 
               let errorMsg = "Wystąpił błąd podczas pobierania danych.";
               // ... (logika błędu bez zmian) ...
               if (fetchNextIdErrorObject && fetchNextIdErrorObject instanceof Error) {
                   errorMsg = `Błąd pobierania licznika kampanii: ${fetchNextIdErrorObject.message}`;
               } else if (fetchCampaignsErrorObject && fetchCampaignsErrorObject instanceof Error) {
                   errorMsg = `Błąd pobierania danych kampanii: ${fetchCampaignsErrorObject.message}`;
               } else if (isErrorNextId) {
                    errorMsg = `Błąd pobierania licznika kampanii: Nieznany błąd.`
               } else if (isErrorCampaigns) {
                    errorMsg = `Błąd pobierania danych kampanii: Nieznany błąd.`
               }
              console.error("useEffect: Setting error state:", errorMsg);
              setError(errorMsg);
              setFetchedCampaigns([]);
          } 
          else if (campaignsFetchResults && nextIdFetchResult?.[0]?.status === 'success') {
              console.log("useEffect: Processing results count:", campaignsFetchResults.length);
              setError(null);

              const processedCampaigns = campaignsFetchResults.map((result, index) => {
                  const campaignId = index + 1;
                  let contractData: CampaignContractData | null = null;

                  // Sprawdzamy status i czy wynik jest tablicą o odpowiedniej długości
                  if (result.status === 'success' && Array.isArray(result.result) && result.result.length >= 9) {
                      // POPRAWKA: Odczytujemy dane z tablicy przez indeksy
                      const campaignArray = result.result; 
                      const creatorAddress = campaignArray[0] as Address; // Indeks 0 = creator

                      // Sprawdzamy, czy creator nie jest adresem zerowym
                      if (creatorAddress && creatorAddress !== zeroAddress) { 
                          try {
                              // Składamy obiekt używając indeksów
                              contractData = {
                                  creator: creatorAddress,
                                  targetAmount: BigInt(campaignArray[1] ?? 0n), // Indeks 1 = targetAmount
                                  raisedAmount: BigInt(campaignArray[2] ?? 0n), // Indeks 2 = raisedAmount
                                  totalEverRaised: BigInt(campaignArray[3] ?? 0n), // Indeks 3 = totalEverRaised
                                  dataCID: String(campaignArray[4] ?? ''), // Indeks 4 = dataCID
                                  endTime: BigInt(campaignArray[5] ?? 0n), // Indeks 5 = endTime
                                  status: Number(campaignArray[6] ?? 0), // Indeks 6 = status
                                  creationTimestamp: BigInt(campaignArray[7] ?? 0n), // Indeks 7 = creationTimestamp
                                  reclaimDeadline: BigInt(campaignArray[8] ?? 0n), // Indeks 8 = reclaimDeadline
                              };
                              console.log(`useEffect: Successfully parsed campaign data for ID ${campaignId} using array indices.`);
                          } catch (parseError) {
                                console.error(`useEffect: Error parsing data from array for campaign ID ${campaignId}:`, parseError, campaignArray);
                                contractData = null; 
                          }
                      } else {
                          console.warn(`useEffect: Zero address creator found for campaign ID ${campaignId}. Data:`, campaignArray);
                      }
                  } else if (result.status === 'failure') {
                      console.warn(`useEffect: Failed status for campaign ID ${campaignId}:`, result.error?.message);
                  } else {
                      // Logujemy, jeśli format danych jest nieoczekiwany
                      console.warn(`useEffect: Unexpected result format or status for campaign ID ${campaignId}:`, result);
                  }

                  if (!contractData) return null; 

                  // Symulacja danych IPFS (bez zmian)
                  const imageIndex = (campaignId - 1) % 4;
                  const ipfsData = {
                      title: contractData.dataCID ? `Kampania ${campaignId} (${contractData.dataCID.substring(0, 6)}...)` : `Kampania #${campaignId}`,
                      description: contractData.dataCID ? `Opis dla CID ${contractData.dataCID}` : `To jest opis przykładowej kampanii numer ${campaignId}.`,
                      imageUrl: `/images/${['campaign1', 'campaign2', 'campaign3', 'campaign4'][imageIndex]}.png`,
                  };

                  return {
                      id: campaignId,
                      contractData: contractData, 
                      ipfsData: ipfsData
                  };
              }).filter((c): c is CombinedCampaignData => c !== null); 

              console.log("useEffect: Setting fetched campaigns (count):", processedCampaigns.length);
              setFetchedCampaigns(processedCampaigns);

          } else if (totalCampaigns === 0) {
              console.log("useEffect: No campaigns to fetch (totalCampaigns is 0).");
              setFetchedCampaigns([]);
              setError(null);
          } else {
             console.warn("useEffect: Unexpected state or missing results.");
             setError("Nieoczekiwany błąd lub brak danych.");
             setFetchedCampaigns([]);
          }
      }
  // Zależności useEffect (bez zmian)
  }, [
      isLoadingNextId, isLoadingCampaigns, 
      nextIdFetchResult, campaignsFetchResults, 
      isErrorNextId, isErrorCampaigns, 
      totalCampaigns, 
      campaignReadsConfig.length 
  ]);


  // Funkcja loadMoreCampaigns (bez zmian)
  const loadMoreCampaigns = () => {
      setVisibleCount((prevCount) => Math.min(prevCount + CAMPAIGNS_PER_LOAD, fetchedCampaigns.length));
  };

  // Sprawdzamy, czy są jeszcze kampanie do załadowania (bez zmian)
  const hasMoreCampaigns = visibleCount < fetchedCampaigns.length;

  // --- Renderowanie komponentu (bez zmian) ---
  const showLoading = isLoading;
  const showError = !isLoading && error;
  const showNoCampaigns = !isLoading && !error && fetchedCampaigns.length === 0;
  const showCampaigns = !isLoading && !error && fetchedCampaigns.length > 0;

  return (
      <>
          {/* Sekcja "Stwórz Kampanię" (bez zmian) */}
          <div
              className="relative text-center mb-12 rounded-lg shadow-sm overflow-hidden py-20 px-6 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/campaign1920.png')" }}
          >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">Masz Pomysł? Potrzebujesz Wsparcia?</h1>
                  <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto drop-shadow-sm">
                      Stwórz własną kampanię crowdfundingową na naszej zdecentralizowanej platformie i zbierz potrzebne środki.
                  </p>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow hover:shadow-md cursor-pointer">
                      Stwórz Kampanię {/* TODO: Add logic */}
                  </button>
              </div>
          </div>

          {/* Komunikat ładowania lub błędu lub braku kampanii (bez zmian) */}
          {showLoading && <p className="text-center my-8">Ładowanie kampanii z blockchaina...</p>}
          {showError && <p className="text-center my-8 text-red-600">{error}</p>}
          {showNoCampaigns && (
              <p className="text-center my-8 text-gray-500">Nie znaleziono żadnych aktywnych kampanii.</p>
          )}


          {/* Sekcja "Zbiórki Dnia" (bez zmian) */}
          {showCampaigns && (
              <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Zbiórki Dnia</h2>
                  {fetchedCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                      {fetchedCampaigns.slice(0, 3).map((campaign) => (
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
                  ) : (
                      <p className="text-center text-gray-500">Brak kampanii do wyróżnienia.</p>
                  )}
              </div>
          )}

          {/* Siatka (Grid) ze WSZYSTKIMI Kampaniami (bez zmian) */}
          {showCampaigns && (
              <>
                  <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Wszystkie Kampanie</h2>
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

                  {/* Przycisk "Rozwiń Więcej" (bez zmian) */}
                  {hasMoreCampaigns && (
                      <div className="text-center mt-12 mb-8">
                          <button
                              onClick={loadMoreCampaigns}
                              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold shadow hover:shadow-md cursor-pointer"
                          >
                              Rozwiń Więcej Kampanii
                          </button>
                      </div>
                  )}
              </>
          )}
      </>
  );
}