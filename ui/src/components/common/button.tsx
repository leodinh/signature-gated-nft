import { Button, ButtonProps } from '@heroui/react';
import React from 'react';
import clsx from 'clsx';

export type PrimaryButtonProps = ButtonProps & {
  className?: string;
};

export default function PrimaryButton({
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={clsx(
        'font-buddy', // Reduced text size, padding, shadow, and border
        className,
        'focus:!outline-none'
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
