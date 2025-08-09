import { Modal, ModalContent, ModalHeader } from '@heroui/react';
import { ModalBody, ModalFooter, Button } from '@heroui/react';
import React from 'react';

type NFTLike = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  price?: string;
};

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  nft,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nft?: NFTLike | null;
  onConfirm?: () => void | Promise<void>;
}) {
  console.log('isOpen', isOpen);
  console.log('nft', nft);
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <h2 className="text-2xl font-bold">Confirm Adoption</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-300 font-mono">
                {nft
                  ? `Adopt ${nft.name}${nft.price ? ` for ${nft.price} ETH` : ''}?`
                  : 'Are you sure you want to proceed?'}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  if (onConfirm) await onConfirm();
                  onClose();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
