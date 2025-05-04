// src/components/CampaignCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';

// Style dla karty
const cardBg = 'bg-white';
const cardTextColor = 'text-gray-700';
const cardTitleColor = 'text-gray-900';
// ZMIANA: Definicja cienia - mocniejszy i fioletowy na hover
const cardShadowBase = 'shadow-lg'; 
// Użyjemy fioletu 400 z 60% przezroczystości - dostosuj odcień/przezroczystość wg potrzeb
const cardShadowHover = 'hover:shadow-2xl hover:shadow-purple-400/60'; 
const cardBorderRadius = 'rounded-xl'; 
const imageBorderRadius = 'rounded-t-xl'; 
const progressBarFill = 'bg-blue-600'; 
const progressBarBg = 'bg-gray-200'; 

// Style dla fioletowego przycisku "Donate" (przeniesione z poprzedniej odpowiedzi)
const buttonBaseStyle = "px-5 py-2 rounded-lg font-semibold transition-all duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"; 
const donateButtonStyle = `${buttonBaseStyle} bg-[#c5baff] text-white hover:bg-[#b1a5f0] focus:ring-[#c5baff] active:bg-[#a89dd9] active:shadow-inner`; 

interface CampaignCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: string; 
  raisedAmount: string; 
  endDate: string; 
  onDonateClick?: (campaignId: number) => void; // Dodajemy prop dla kliknięcia
}

export function CampaignCard({
  id,
  title,
  description,
  imageUrl,
  targetAmount,
  raisedAmount,
  endDate,
  onDonateClick, // Odbieramy prop
}: CampaignCardProps) {

  const raisedNum = parseFloat(raisedAmount.split(' ')[0]) || 0;
  const targetNum = parseFloat(targetAmount.split(' ')[0]) || 1; 
  const progress = targetNum > 0 ? Math.min((raisedNum / targetNum) * 100, 100) : 0; 

  // Obsługa kliknięcia przycisku Donate
  const handleDonate = (e: React.MouseEvent) => {
      e.stopPropagation(); 
      if (onDonateClick) {
          onDonateClick(id); 
      } else {
          console.warn("onDonateClick handler not provided for campaign ID:", id);
      }
  };

  return (
    // Główny kontener karty - DODANO 'group', ZMIENIONO cień hover, dodano transition-all
    <div 
        className={`group flex flex-col h-full ${cardBg} ${cardBorderRadius} ${cardShadowBase} ${cardShadowHover} overflow-hidden transition-all duration-300 ease-in-out cursor-pointer`} // Dodano group, transition-all, cursor-pointer
    >
      {/* Kontener obrazka - proporcje 1:1, zaokrąglenie górne, overflow-hidden */}
      <div className={`relative w-full aspect-square ${imageBorderRadius} overflow-hidden`}> 
        <Image
          src={imageUrl || `https://placehold.co/600x600/E5E7EB/9CA3AF?text=Kamp.+${id}`} // Placeholder 1:1
          alt={`Obrazek kampanii ${title}`}
          fill 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
          style={{ objectFit: 'cover' }}
          // DODANO: Efekt rozmycia i transition na obrazku przy najechaniu na KARTĘ (group-hover)
          className="transition-all duration-300 ease-in-out group-hover:blur-sm" // Użyto blur-sm
        />

        {/* NOWOŚĆ: Nakładka (Overlay) pojawiająca się na hover */}
        <div 
            className={`absolute inset-0 flex items-center justify-center 
                       bg-black/40 backdrop-blur-[1px]  
                       opacity-0 group-hover:opacity-100 
                       transition-opacity duration-300 ease-in-out 
                       rounded-t-xl`} // Dopasowujemy zaokrąglenie do obrazka
        >
            {/* Fioletowy Przycisk Donate */}
            <button 
                onClick={handleDonate}
                // Dodano animację skalowania dla przycisku
                className={`${donateButtonStyle} transform scale-90 group-hover:scale-100 transition-transform duration-200 ease-in-out`}
            >
                Wesprzyj
            </button>
        </div>
        {/* Koniec Nakładki */}

        {/* Element maskujący tworzący łuk (pozostaje bez zmian, tworzy wypukły łuk) */}
        <div 
            className={`absolute bottom-0 left-0 right-0 h-6 ${cardBg} rounded-t-full -mb-1`} 
        ></div>
      </div> {/* Koniec kontenera obrazka */}

      {/* Sekcja z tekstem - Padding p-8 (bez zmian) */}
      <div className={`p-8 flex flex-col flex-grow ${cardTextColor}`}> 
        <h3 className={`text-lg font-semibold mb-2 truncate ${cardTitleColor}`}>{title}</h3>
        <p className="text-sm mb-4 line-clamp-3 opacity-90 flex-grow">{description}</p> 
        
        {/* Pasek Postępu (bez zmian) */}
        <div className={`w-full ${progressBarBg} rounded-full h-2 mb-2.5 overflow-hidden`}> 
          <div
            className={`${progressBarFill} h-2 rounded-full transition-all duration-500 ease-out`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Statystyki (bez zmian) */}
        <div className="flex justify-between text-xs font-medium mb-1.5 opacity-90"> 
          <span>Zebrano: {raisedAmount} ETH</span> 
          <span>Cel: {targetAmount} ETH</span> 
        </div>
        <div className="text-xs opacity-70">Koniec: {endDate}</div> 
      </div>
    </div>
  );
}

export default CampaignCard;