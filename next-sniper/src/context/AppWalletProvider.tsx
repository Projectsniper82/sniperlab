'use client';

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useNetwork } from './NetworkContext'; // Use your existing network context

// Default styles that can be overridden by your app
interface AppWalletProviderProps {
  children: React.ReactNode;
}

export const AppWalletProvider: FC<AppWalletProviderProps> = ({ children }) => {
  // Get the RPC endpoint from your existing NetworkContext
  const { rpcUrl } = useNetwork(); 

  // You can add more wallets here
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};