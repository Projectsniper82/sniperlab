'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BotLogicState {
  isLogicEnabled: boolean;
  setIsLogicEnabled: (value: boolean) => void;
}

const BotLogicContext = createContext<BotLogicState | undefined>(undefined);

export const BotLogicProvider = ({ children }: { children: ReactNode }) => {
  const [isLogicEnabled, setIsLogicEnabled] = useState(false);
  return (
    <BotLogicContext.Provider value={{ isLogicEnabled, setIsLogicEnabled }}>
      {children}
    </BotLogicContext.Provider>
  );
};

export const useBotLogic = () => {
  const ctx = useContext(BotLogicContext);
  if (!ctx) throw new Error('useBotLogic must be used within BotLogicProvider');
  return ctx;
};