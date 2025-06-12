// src/context/NetworkContext.tsx
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

export type NetworkType = 'devnet' | 'mainnet-beta';

interface NetworkContextType {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  connection: Connection;
  rpcUrl: string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<NetworkType>('devnet');

  const rpcUrl = useMemo(() => {
    return network === 'mainnet-beta'
      ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL || clusterApiUrl('mainnet-beta')
      : process.env.NEXT_PUBLIC_DEVNET_RPC_URL || clusterApiUrl('devnet');
  }, [network]);

  // This useMemo is correct. The connection object is stable and only changes
  // when the network or rpcUrl changes.
  const connection = useMemo(() => {
    console.log(`NetworkContext: Creating new connection for ${network} using RPC: ${rpcUrl}`);
    return new Connection(rpcUrl, 'confirmed');
  }, [rpcUrl, network]);

  // *** THE ROOT CAUSE OF THE INFINITE LOOP IS HERE ***
  // THE CAUSE: The original dependency array was `[network, setNetwork, connection, rpcUrl]`.
  // Including `connection` (an object) in this dependency array made the `contextValue` object
  // unstable. It was being recreated on every render, which forced every component using this
  // context (like TradingBot) into an infinite re-render loop.
  //
  // THE FIX: We remove `connection` from the dependency array. The `contextValue` will now only
  // be recreated when the `network`, `setNetwork` function, or `rpcUrl` string changes. This
  // makes the context stable and breaks the loop permanently.
  const contextValue = useMemo(() => ({
    network,
    setNetwork,
    connection,
    rpcUrl,
  }), [network, setNetwork, rpcUrl]); // <--- CORRECTED STABLE DEPENDENCIES

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