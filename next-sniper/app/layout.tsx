
import './globals.css';
import React from 'react';
import { NetworkProvider } from '@/context/NetworkContext';
import { AppWalletProvider } from '@/context/AppWalletProvider';
import { TokenProvider } from '@/context/TokenContext'; // <--- ADD THIS IMPORT
import '@solana/wallet-adapter-react-ui/styles.css';

export const metadata = {
  title: 'Raydium Trading Interface',
  description: 'Built with Next.js + Solana Devnet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NetworkProvider>
          <TokenProvider> {/* <--- WRAP a new provider here */}
            <AppWalletProvider>
              {children}
            </AppWalletProvider>
          </TokenProvider> {/* <--- END a new wrap here */}
        </NetworkProvider>
      </body>
    </html>
  );
}