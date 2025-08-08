import React from 'react';
import clsx from 'clsx';

type GridProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Grid({ children, className, ...props }: GridProps) {
  return (
    <div
      className={clsx(
        'grid grid-cols-12 items-center gap-5 container mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
