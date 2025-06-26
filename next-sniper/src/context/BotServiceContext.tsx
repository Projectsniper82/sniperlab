'use client';
import React, { createContext, useContext } from 'react';
import { Keypair } from '@solana/web3.js';
import * as service from '@/utils/botService';

import type { TradingStrategy } from '@/utils/tradingStrategy';

interface BotServiceCtx {
 addBot: (wallet: Keypair, strategy?: TradingStrategy, intervalMs?: number) => void;
  removeBot: (id: string) => void;
  startBot: (id: string, strategy?: TradingStrategy, intervalMs?: number) => void;
  stopBot: (id: string) => void;
  log: (id: string, message: string) => void;
  getLogs: (id: string) => { timestamp: number; message: string }[];
}

const BotServiceContext = createContext<BotServiceCtx | null>(null);

export const BotServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const value: BotServiceCtx = {
    addBot: service.addBot,
    removeBot: service.removeBot,
    startBot: service.startBot,
    stopBot: service.stopBot,
    log: service.log,
    getLogs: service.getLogs,
  };
  return <BotServiceContext.Provider value={value}>{children}</BotServiceContext.Provider>;
};

export const useBotService = () => {
  const ctx = useContext(BotServiceContext);
  if (!ctx) throw new Error('useBotService must be used within BotServiceProvider');
  return ctx;
};