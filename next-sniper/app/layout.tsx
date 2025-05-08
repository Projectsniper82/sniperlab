// src/app/layout.tsx
import './globals.css';
import React from 'react';
import { NetworkProvider } from '@/context/NetworkContext'; // <--- IMPORT (Adjust path if needed)

export const metadata = {
  title: 'Raydium Trading Interface',
  description: 'Built with Next.js + Solana Devnet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NetworkProvider> {/* <--- WRAP HERE */}
          {children}
        </NetworkProvider> {/* <--- END WRAP HERE */}
      </body>
    </html>
  );
}