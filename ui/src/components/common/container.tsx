import React from 'react';

export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-4 max-w-[1400px] pb-5 app-container">
      {children}
    </div>
  );
}
