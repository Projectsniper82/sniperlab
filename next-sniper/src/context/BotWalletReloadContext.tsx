'use client';

import React, { createContext, useContext, useRef } from 'react';

interface BotWalletReloadCtx {
  reloadWallets: () => void;
  registerReloader: (fn: () => void) => void;
}

const BotWalletReloadContext = createContext<BotWalletReloadCtx | undefined>(undefined);

export const BotWalletReloadProvider = ({ children }: { children: React.ReactNode }) => {
  const reloadRef = useRef<() => void>(() => {});

  const registerReloader = (fn: () => void) => {
    reloadRef.current = fn;
  };

  const reloadWallets = () => {
    reloadRef.current();
  };

  return (
    <BotWalletReloadContext.Provider value={{ reloadWallets, registerReloader }}>
      {children}
    </BotWalletReloadContext.Provider>
  );
};

export const useBotWalletReload = () => {
  const ctx = useContext(BotWalletReloadContext);
  if (!ctx) throw new Error('useBotWalletReload must be used within BotWalletReloadProvider');
  return ctx;
};