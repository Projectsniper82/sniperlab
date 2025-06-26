'use client';

import React, { createContext, useContext, useState } from 'react';

export interface BotInstance {
  id: string;
}

export type BotsByNetwork = {
  devnet: BotInstance[];
  mainnet: BotInstance[];
};

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

const BotContext = createContext<BotContextState | undefined>(undefined);

export const BotProvider = ({ children }: { children: React.ReactNode }) => {
  const [allBotsByNetwork, setAllBotsByNetwork] = useState<BotsByNetwork>({ devnet: [], mainnet: [] });
  const [botCode, setBotCode] = useState('');
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
