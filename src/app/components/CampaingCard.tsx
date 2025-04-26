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
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">

      {/* Kontener obrazka - ustawiamy relative i PROPORCJE */}
      {/* Zamiast stałej wysokości (np. h-64), używamy proporcji */}
      <div className="relative w-full aspect-[3/4]"> {/* ZMIANA: Usunięto h-64, dodano aspect-[3/4] */}
        {/* Obrazek */}
        <Image
          src={imageUrl || `https://placehold.co/600x400/E2E8F0/A0AEC0?text=Kampania+${id}`}
          alt={`Obrazek kampanii ${title}`}
          fill // Zmieniono layout="fill" na fill={true} dla nowszych wersji Next.js/Image
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Pomaga Next.js wybrać optymalny rozmiar obrazka
          style={{ objectFit: 'cover' }} // Zastępuje objectFit klasą style
          className="transition-all duration-300 ease-in-out group-hover:blur-sm group-hover:brightness-50"
        />

        {/* Nakładka (Overlay) z informacjami */}
        <div className="absolute inset-0 bg-black bg-opacity-60 p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer">
          <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
          <p className="text-xs mb-2 line-clamp-2">{description}</p>
          <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>Zebrano: {raisedAmount}</span>
            <span>Cel: {targetAmount}</span>
          </div>
          <div className="text-xs">Koniec: {endDate}</div>
        </div>
      </div>
      {/* Usunęliśmy dolną sekcję z tekstem */}
    </div>
  );
}

export default CampaignCard;
