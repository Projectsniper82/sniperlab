'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// FIX: Add isLpActive and its setter to the context's type definition
interface TokenContextState {
  tokenAddress: string;
  setTokenAddress: (address: string) => void;
  isLpActive: boolean;
  setIsLpActive: (isActive: boolean) => void;
}

const TokenContext = createContext<TokenContextState | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  
  // FIX: Create the state for isLpActive here
  const [isLpActive, setIsLpActive] = useState(false);

  // FIX: Provide the new state and setter in the context value
  const value = {
    tokenAddress,
    setTokenAddress,
    isLpActive,
    setIsLpActive
  };

  return (
    <TokenContext.Provider value={value}>
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