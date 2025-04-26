// src/app/page.tsx
'use client';

import CampaignCard from './components/CampaingCard'; // Importujemy nasz komponent karty
import React, { useState } from 'react'; // Importujemy useState

// --- Funkcja do generowania przykładowych danych ---
const generateSampleCampaigns = (count: number) => {
  const campaigns = [];
  const imageBaseNames = ['campaign1', 'campaign2', 'campaign3', 'campaign4'];
  const imageExtensions = ['.png', '.png', '.png', '.png']; // Dostosuj, jeśli trzeba

  for (let i = 1; i <= count; i++) {
    const imageIndex = (i - 1) % 4;
    const imageName = imageBaseNames[imageIndex];
    const imageExtension = imageExtensions[imageIndex];
    const target = Math.floor(Math.random() * 10 + 1) * 5000; // Generujemy cel najpierw

    campaigns.push({
      id: i,
      title: `Przykładowa Kampania #${i}`,
      description: `To jest opis dla przykładowej kampanii numer ${i}. Zbieramy fundusze na ważny cel!`,
      imageUrl: `/images/${imageName}${imageExtension}`,
      targetAmount: `${target}`, // Przypisujemy wygenerowany cel
      raisedAmount: `${Math.floor(Math.random() * target)}`, // Losowa kwota, ale nie większa niż cel
      endDate: `31.${Math.floor(Math.random() * 12 + 1)}.2025`,
    });
  }
  return campaigns;
};
// --- Koniec Funkcji Generowania ---

// --- Generujemy WSZYSTKIE 30 przykładowych kampanii ---
const allSampleCampaigns = generateSampleCampaigns(30);
// --- Koniec Generowania ---

// --- Wybieramy kampanie do sekcji "Zbiórki Dnia" ---
const dailyPicks = allSampleCampaigns.slice(0, 2);
// --- Koniec Wybierania ---

// --- Stała określająca, ile kampanii ładować za każdym razem ---
const CAMPAIGNS_PER_LOAD = 20;
// --- Stała określająca, ile kampanii wyświetlić na początku ---
const INITIAL_CAMPAIGN_COUNT = 9;


export default function Home() {
  // --- Stan przechowujący liczbę aktualnie widocznych kampanii ---
  const [visibleCount, setVisibleCount] = useState(INITIAL_CAMPAIGN_COUNT);
  // --- Koniec Stanu ---

  // --- Funkcja do ładowania większej liczby kampanii ---
  const loadMoreCampaigns = () => {
    setVisibleCount((prevCount) => prevCount + CAMPAIGNS_PER_LOAD);
  };
  // --- Koniec Funkcji ---

  // --- Sprawdzamy, czy są jeszcze kampanie do załadowania ---
  const hasMoreCampaigns = visibleCount < allSampleCampaigns.length;
  // --- Koniec Sprawdzania ---

  return (
    <>
      {/* ===== Sekcja "Stwórz Kampanię" Z POPRAWIONĄ ŚCIEŻKĄ TŁA ===== */}
      <div
        className="relative text-center mb-12 rounded-lg shadow-sm overflow-hidden py-20 px-6 bg-cover bg-center"
        // POPRAWIONA ŚCIEŻKA OBRAZKA TŁA - używamy ścieżki względnej od folderu public
        style={{ backgroundImage: "url('/images/campaign1920.png')" }}
      >
        {/* Overlay dla lepszej czytelności tekstu */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Kontener na treść, ustawiony nad overlayem */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">Masz Pomysł? Potrzebujesz Wsparcia?</h1>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto drop-shadow-sm">
            Stwórz własną kampanię crowdfundingową na naszej zdecentralizowanej platformie i zbierz potrzebne środki.
          </p>
          <button
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow hover:shadow-md cursor-pointer"
          >
            Stwórz Kampanię
          </button>
        </div>
      </div>
      {/* ===== KONIEC SEKCJI "Stwórz Kampanię" ===== */}


      {/* Sekcja "Zbiórki Dnia" (bez zmian) */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Zbiórki Dnia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {dailyPicks.map((campaign) => (
            <CampaignCard
              key={`daily-${campaign.id}`}
              id={campaign.id}
              title={campaign.title}
              description={campaign.description}
              imageUrl={campaign.imageUrl}
              targetAmount={campaign.targetAmount}
              raisedAmount={campaign.raisedAmount}
              endDate={campaign.endDate}
            />
          ))}
        </div>
      </div>

      {/* Siatka (Grid) ze WSZYSTKIMI Kampaniami */}
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Wszystkie Kampanie</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allSampleCampaigns.slice(0, visibleCount).map((campaign) => (
          <CampaignCard
            key={campaign.id}
            id={campaign.id}
            title={campaign.title}
            description={campaign.description}
            imageUrl={campaign.imageUrl}
            targetAmount={campaign.targetAmount}
            raisedAmount={campaign.raisedAmount}
            endDate={campaign.endDate}
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
  );
}
