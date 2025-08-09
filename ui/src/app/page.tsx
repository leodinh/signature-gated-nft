'use client';

import { useState, useCallback } from 'react';
import NFTCard from '@/components/nft-card';
import Header from '@/components/header';
import { Tabs, Tab, useDisclosure } from '@heroui/react';
import ConfirmationModal from '@/components/confirmation-modal';

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const myCats = nfts.filter(n => !n.active);
  const mintableCats = nfts.filter(n => n.active);
  const displayed = activeTab === 'my' ? myCats : mintableCats;

  const performMint = useCallback(async (nft: NFT) => {
    setIsMinting(true);
    setMintStatus('Preparing transaction...');
    setTimeout(() => {
      setMintStatus('Minting in progress...');
      setTimeout(() => {
        setMintStatus('NFT minted successfully!');
        setIsMinting(false);
        setNfts(prev =>
          prev.map(item =>
            item.id === nft.id ? { ...item, active: false } : item
          )
        );
        setSelectedNFT(null);
      }, 2000);
    }, 1000);
  }, []);

  return (
    <div className="cyber-bg min-h-screen cyber-grid">
      <div className="container mx-auto">
        <Header />
        <main className="container z-10 mx-auto px-4 py-8">
          <section className="text-center mb-12">
            <h2 className="neon-text text-6xl font-bold font-buddy mb-4">
              ADOPT YOUR <span className="text-white">CYBER CAT</span>
            </h2>
          </section>

          <section className="mb-8">
            <Tabs
              aria-label="Cats tabs"
              selectedKey={activeTab}
              onSelectionChange={key => setActiveTab(key as 'my' | 'mintable')}
              className="text-lg font-bold font-mono mx-auto"
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
                    onMint={() => {
                      setSelectedNFT(nft);
                      onOpen();
                    }}
                    isMinting={isMinting}
                    selectedNFTId={selectedNFT?.id}
                  />
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        nft={selectedNFT}
        onConfirm={() => performMint(selectedNFT as NFT)}
      />
    </div>
  );
}
