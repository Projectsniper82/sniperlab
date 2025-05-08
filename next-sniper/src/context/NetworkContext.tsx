// src/context/NetworkContext.tsx
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';

export type NetworkType = 'devnet' | 'mainnet-beta';

interface NetworkContextType {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  connection: Connection;
  rpcUrl: string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<NetworkType>('devnet'); // Default to devnet

  const rpcUrl = useMemo(() => {
    return network === 'mainnet-beta'
      ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL || clusterApiUrl('mainnet-beta') // Allow override via env var
      : process.env.NEXT_PUBLIC_DEVNET_RPC_URL || clusterApiUrl('devnet');       // Allow override via env var
  }, [network]);

  const connection = useMemo(() => {
    console.log(`NetworkContext: Creating new connection for ${network} using RPC: ${rpcUrl}`);
    return new Connection(rpcUrl, 'confirmed');
  }, [rpcUrl, network]); // Recreate connection when rpcUrl (and thus network) changes

  const contextValue = useMemo(() => ({
    network,
    setNetwork,
    connection,
    rpcUrl,
  }), [network, setNetwork, connection, rpcUrl]);

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};