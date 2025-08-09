import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';

const geistSans = Roboto({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CyberCats - Digital Felines for the Future',
  description:
    'Mint your futuristic Cyber Cat NFT. Each cat is unique, enhanced with neon technology and ready for the metaverse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
