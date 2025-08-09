'use client';

import { useState } from 'react';
import NFTCard from '@/components/NFTCard';
import Header from '@/components/header';
import { Tabs, Tab } from '@heroui/react';

interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  tokenURI: string;
  active: boolean;
}

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: 1,
      name: 'Chinese Cat #001',
      description: 'A futuristic feline with neon enhancements',
      image: '/nfts/chinese-cat.png',
      price: '0.1',
      tokenURI: 'ipfs://QmCyberCat001',
      active: true,
    },
    {
      id: 2,
      name: 'Guardian Cat #002',
      description: 'Protector of the digital realm',
      image: '/nfts/guardian-cat.png',
      price: '0.2',
      tokenURI: 'ipfs://QmGuardianCat002',
      active: true,
    },
    {
      id: 3,
      name: 'Vietnamese Cat #003',
      description: 'A cat from Vietnam',
      image: '/nfts/vietnamese-cat.png',
      price: '0.15',
      tokenURI: 'ipfs://QmNeonCat003',
      active: true,
    },
    {
      id: 4,
      name: 'British Cat #003',
      description: 'A cat from Britain',
      image: '/nfts/british-cat.png',
      price: '0.15',
      tokenURI: 'ipfs://QmNeonCat003',
      active: true,
    },
  ]);

  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'mintable'>('mintable');

  const myCats = nfts.filter(n => !n.active);
  const mintableCats = nfts.filter(n => n.active);
  const displayed = activeTab === 'my' ? myCats : mintableCats;

  const handleMint = async (nft: NFT) => {
    setSelectedNFT(nft);
    setIsMinting(true);
    setMintStatus('Preparing transaction...');

    // Simulate minting process
    setTimeout(() => {
      setMintStatus('Minting in progress...');
      setTimeout(() => {
        setMintStatus('NFT minted successfully!');
        setIsMinting(false);
        // Update NFT status
        setNfts(prev =>
          prev.map(item =>
            item.id === nft.id ? { ...item, active: false } : item
          )
        );
        setSelectedNFT(null);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="cyber-bg min-h-screen cyber-grid">
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      <div className="container mx-auto">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="container relative z-10 mx-auto px-4 py-8">
          {/* Hero section */}
          <section className="text-center mb-12">
            <h2 className="neon-text text-6xl font-bold font-buddy mb-4">
              ADOPT YOUR <span className="text-white">CYBER CAT</span>
            </h2>
          </section>

          {/* Tabs */}
          <section className="mb-8">
            <Tabs
              aria-label="Cats tabs"
              selectedKey={activeTab}
              onSelectionChange={key => setActiveTab(key as 'my' | 'mintable')}
              color="primary"
              variant="underlined"
              className="text-lg font-bold font-mono w-full lg:w-[50%] mx-auto"
            >
              <Tab
                key="mintable"
                title={`Ready to Adopt (${mintableCats.length})`}
                className={`text-white font-bold cursor-pointer hover:text-cyan-500 items-center justify-center ${
                  activeTab === 'mintable' ? 'text-cyan-500' : 'text-white'
                }`}
              />
              <Tab
                key="my"
                title={`My Cats (${myCats.length})`}
                className={`text-white font-bold cursor-pointer hover:text-cyan-500 items-center justify-center ${
                  activeTab === 'my' ? 'text-cyan-500' : 'text-white'
                }`}
              />
            </Tabs>
          </section>

          {/* NFT Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayed.length === 0 ? (
              <div className="col-span-full text-center text-gray-300 font-mono">
                {activeTab === 'my'
                  ? 'You do not own any cats yet. Adopt one to see it here.'
                  : 'No cats available to adopt right now.'}
              </div>
            ) : (
              displayed.map((nft, index) => (
                <div
                  key={nft.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <NFTCard
                    nft={nft}
                    onMint={handleMint}
                    isMinting={isMinting}
                    selectedNFTId={selectedNFT?.id}
                  />
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
