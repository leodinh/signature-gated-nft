'use client';

import { useFormStatus } from 'react-dom';
import PrimaryButton, { PrimaryButtonProps } from './button';

interface SubmitButtonProps extends PrimaryButtonProps {
  loadingText?: string;
  externalLoading?: boolean;
  children?: React.ReactNode;
}

export default function SubmitButton({
  children,
  loadingText,
  externalLoading = false,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = externalLoading || (loadingText ? pending : false);

  return (
    <PrimaryButton
      type="submit"
      isLoading={isLoading}
      disabled={isLoading}
      {...props}
    >
      {isLoading && loadingText ? loadingText : children}
    </PrimaryButton>
  );
}
