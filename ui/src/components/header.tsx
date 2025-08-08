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
      <header className="w-full">
        <Grid className="pt-4 w-full bg-appBackground pb-[22px]">
          <div className="flex col-span-8 justify-between items-center">
            <Image src="/logo.png" width={74} height={58} alt="Meme VC Logo" />
            <div className="flex gap-3">
              <PrimaryButton
                className="bg-[var(--yellow)]"
                // onPress={handleCreateCoin}
                disabled={isBlocked}
              >
                Create Coin
                {/* <PlusIcon /> */}
              </PrimaryButton>
              <PrimaryButton
                className="bg-[var(--blue)]"
                onPress={() => setIsDemoModalOpen(true)}
              >
                WTF is This?
              </PrimaryButton>
            </div>
          </div>
          <div className="flex col-span-4 justify-between items-center">
            {/* {status === 'connected' && address && (
              <div className="flex gap-3 items-center text-xs">
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={address}
                  size="sm"
                  src={walletInfo?.icon}
                />
                <p>{shortenAddress(address)}</p>
              </div>
            )} */}
            <div className="flex w-full justify-end">
              {/* <ConnectButton /> */}
            </div>
            <PrimaryButton
              className="bg-yellow"
              // onPress={handleCreateCoin}
              disabled={isBlocked}
            >
              Connect Wallet
              {/* <PlusIcon /> */}
            </PrimaryButton>
          </div>
        </Grid>
      </header>
      {/* <CreateCoinModal
        isOpen={isCreateCoinModalOpen}
        onClose={() => setIsCreateCoinModalOpen(false)}
        onBlock={handleBlock}
      />
      <CreatePendingTokenModal
        isOpen={isCreatePendingTokenModalOpen}
        onClose={() => setIsCreatePendingTokenModalOpen(false)}
        onBlock={handleBlock}
        isBlocked={isBlocked}
        onUnblock={handleUnblock}
      />
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      /> */}
    </>
  );
}
