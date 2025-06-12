'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenContextState {
  tokenAddress: string;
  setTokenAddress: (address: string) => void;
}

const TokenContext = createContext<TokenContextState | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [tokenAddress, setTokenAddress] = useState('');

  return (
    <TokenContext.Provider value={{ tokenAddress, setTokenAddress }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};