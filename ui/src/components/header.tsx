'use client';

// import { useWalletInfo } from '@web3modal/wagmi/react';
import Image from 'next/image';
import PrimaryButton from './common/button';
// import PlusIcon from './icons/plus';
import Grid from './common/grid';
// import ConnectButton from './web3/connect-button';
// import { useAccount } from 'wagmi';
import { Avatar } from '@heroui/react';
// import { shortenAddress } from '@/utils';
import { useState } from 'react';
// import DemoModal from './modals/app-demo-modal';
// import toast from 'react-hot-toast';
// import { usePendingToken } from '@/hooks';

export default function Header() {
  //   const { address, status, isConnected } = useAccount();
  //   const { walletInfo } = useWalletInfo();

  const [isCreateCoinModalOpen, setIsCreateCoinModalOpen] = useState(false);
  const [isCreatePendingTokenModalOpen, setIsCreatePendingTokenModalOpen] =
    useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  //   const { data: pendingToken } = usePendingToken(address!);

  //   const handleCreateCoin = () => {
  //     if (!isConnected || !address) {
  //       return toast.error('Please connect your wallet to create a coin.', {
  //         id: 'create-coin-error',
  //       });
  //     }

  //     if (pendingToken) {
  //       setIsCreatePendingTokenModalOpen(true);
  //       setIsCreateCoinModalOpen(false);
  //     } else {
  //       setIsCreateCoinModalOpen(true);
  //       setIsCreatePendingTokenModalOpen(false);
  //     }
  //   };

  const handleBlock = () => {
    setIsBlocked(true);
  };

  const handleUnblock = () => {
    setIsBlocked(false);
  };

  return (
    <>
      <header className="relative z-10 m-4 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <Image src="/logo-full.png" alt="logo" width={50} height={100} />
          </div>
          <div className="flex items-center space-x-4">
            <PrimaryButton className="px-6 py-2 rounded text-white neon-border border-2 font-bold">
              Connect Wallet
            </PrimaryButton>
          </div>
        </div>
      </header>
    </>
  );
}
