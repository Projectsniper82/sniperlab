'use client';

import React, { createContext, useContext, useState } from 'react';
import type { NetworkType } from './NetworkContext';

// Template used when initializing new bot code in the editor
const DEFAULT_BOT_CODE = `export const strategy = async (wallet, log) => {
  log('executing default strategy');
};`;

export interface BotInstance {
  id: string;
}

// Map each network to its associated trading bots. The keys must exactly match
// NetworkContext's `NetworkType` so we can safely index with the current
// network value throughout the app.
export type BotsByNetwork = Record<NetworkType, BotInstance[]>;

interface BotContextState {
  allBotsByNetwork: BotsByNetwork;
  setAllBotsByNetwork: React.Dispatch<React.SetStateAction<BotsByNetwork>>;
  botCode: string;
  setBotCode: React.Dispatch<React.SetStateAction<string>>;
  isAdvancedMode: boolean;
  setIsAdvancedMode: React.Dispatch<React.SetStateAction<boolean>>;
  isTradingActive: boolean;
  setIsTradingActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BotContext = createContext<BotContextState | undefined>(undefined);

export const BotProvider = ({ children }: { children: React.ReactNode }) => {
  const [allBotsByNetwork, setAllBotsByNetwork] = useState<BotsByNetwork>({
    devnet: [],
    'mainnet-beta': [],
  });
  const [botCode, setBotCode] = useState(DEFAULT_BOT_CODE);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isTradingActive, setIsTradingActive] = useState(false);

  const value: BotContextState = {
    allBotsByNetwork,
    setAllBotsByNetwork,
    botCode,
    setBotCode,
    isAdvancedMode,
    setIsAdvancedMode,
    isTradingActive,
    setIsTradingActive,
  };

  return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
};

export const useBotContext = () => {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBotContext must be used within BotProvider');
  return ctx;
};
