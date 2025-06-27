'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BotLogicState {
  isLogicEnabled: boolean;
  setIsLogicEnabled: (value: boolean) => void;
}

const BotLogicContext = createContext<BotLogicState | undefined>(undefined);

export const BotLogicProvider = ({ children }: { children: ReactNode }) => {
 const [isLogicEnabled, setIsLogicEnabledState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLogicEnabled') === 'true';
    }
    return false;
  });

  const setIsLogicEnabled = (value: boolean) => {
    setIsLogicEnabledState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLogicEnabled', value.toString());
    }
  };

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