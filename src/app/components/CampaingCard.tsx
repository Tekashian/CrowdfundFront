// src/components/CampaignCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface CampaignCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: string;
  raisedAmount: string;
  endDate: string;
}

export function CampaignCard({
  id,
  title,
  description,
  imageUrl,
  targetAmount,
  raisedAmount,
  endDate,
}: CampaignCardProps) {

  const progress = (parseFloat(raisedAmount) / parseFloat(targetAmount)) * 100 || 0;

  return (
    // --- Główny kontener karty ---
    // Dodajemy klasę 'group' i efekty hover dla całej karty
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"> {/* Dodano hover:scale-105 */}

      {/* Kontener obrazka - ustawiamy relative, aby overlay mógł być absolute */}
      <div className="relative h-48 w-full"> {/* Można dostosować wysokość obrazka (h-48) */}
        {/* Obrazek */}
        <Image
          src={imageUrl || `https://placehold.co/600x400/E2E8F0/A0AEC0?text=Kampania+${id}`}
          alt={`Obrazek kampanii ${title}`}
          layout="fill"
          objectFit="cover"
          // Dodajemy efekt rozmycia i przyciemnienia PO NAJECHANIU na KARTĘ (group-hover)
          className="transition-all duration-300 ease-in-out group-hover:blur-sm group-hover:brightness-50"
        />

        {/* --- Nakładka (Overlay) z informacjami --- */}
        {/* Początkowo niewidoczna (opacity-0), pojawia się płynnie po najechaniu na KARTĘ (group-hover:opacity-100) */}
        <div className="absolute inset-0 bg-black bg-opacity-60 p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"> {/* Zwiększono bg-opacity, dodano cursor-pointer */}
          {/* Tytuł na nakładce */}
          <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
          {/* Opis na nakładce */}
          <p className="text-xs mb-2 line-clamp-2">{description}</p>
          {/* Pasek postępu na nakładce */}
          <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
            <div
              className="bg-green-500 h-1.5 rounded-full" // Używamy zielonego dla postępu
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {/* Informacje o kwotach na nakładce */}
          <div className="flex justify-between text-xs mb-1">
            <span>Zebrano: {raisedAmount}</span>
            <span>Cel: {targetAmount}</span>
          </div>
          {/* Data zakończenia na nakładce */}
          <div className="text-xs">Koniec: {endDate}</div>
        </div>
        {/* --- Koniec Nakładki --- */}

      </div>

      {/* ===== SEKCJA USUNIĘTA ===== */}
      {/* Usunęliśmy poniższy div, który zawierał powtórzone informacje */}
      {/*
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {title}
        </h3>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
         <span>Zebrano: {raisedAmount}</span>
         <span>Cel: {targetAmount}</span>
       </div>
        <div className="text-xs text-gray-500">
         Koniec: {endDate}
       </div>
      </div>
      */}
      {/* ===== KONIEC SEKCJI USUNIĘTEJ ===== */}

    </div>
  );
}

export default CampaignCard;