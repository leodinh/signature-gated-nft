'use client';

import { Image } from '@heroui/react';

interface NFTCardProps {
  nft: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: string;
    tokenURI: string;
    active: boolean;
  };
  onMint: (nft: any) => void;
  isMinting: boolean;
  selectedNFTId?: number;
}

export default function NFTCard({
  nft,
  onMint,
  isMinting,
  selectedNFTId,
}: NFTCardProps) {
  return (
    <div
      className={`cyber-card overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 ${
        !nft.active ? 'opacity-50' : ''
      }`}
    >
      <Image
        src={nft.image}
        alt={nft.name}
        className="w-full h-full object-cover"
        width={500}
        height={300}
        isZoomed
      />

      <div className="space-y-3 p-4">
        <h3 className="neon-text text-2xl font-bold font-buddy">{nft.name}</h3>
        <p className="text-gray-300 text-sm font-mono">{nft.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-white font-bold font-mono">
            {nft.price} ETH
          </span>
          <button
            onClick={() => onMint(nft)}
            disabled={!nft.active || isMinting}
            className={`cyber-button font-buddy text-lg px-6 py-2 rounded text-white font-bold transition-all duration-300 cursor-pointer ${
              !nft.active || isMinting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105'
            }`}
          >
            {isMinting && selectedNFTId === nft.id
              ? 'Adopting...'
              : 'Adopt Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
