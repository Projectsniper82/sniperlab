'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBotContext } from './BotContext';
import { loadStrategiesFromLocalStorage, saveStrategiesToLocalStorage } from '@/utils/strategyManager';

export interface UserStrategy {
  id: string;
  name: string;
  code: string;
}

interface BotLogicState {
  isLogicEnabled: boolean;
  setIsLogicEnabled: (value: boolean) => void;
   userStrategies: UserStrategy[];
  handleSaveCurrentStrategy: (name: string) => void;
  handleLoadStrategy: (strategyId: string) => void;
  handleDeleteStrategy: (strategyId: string) => void;
}

const BotLogicContext = createContext<BotLogicState | undefined>(undefined);

export const BotLogicProvider = ({ children }: { children: ReactNode }) => {
  const [isLogicEnabled, setIsLogicEnabledState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLogicEnabled') === 'true';
    }
    return false;
  });
  const [userStrategies, setUserStrategies] = useState<UserStrategy[]>([]);
  const { botCode, setBotCode } = useBotContext();

  const setIsLogicEnabled = (value: boolean) => {
    setIsLogicEnabledState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLogicEnabled', value.toString());
    }
  };

  useEffect(() => {
    const loadedStrategies = loadStrategiesFromLocalStorage();
    setUserStrategies(loadedStrategies);
  }, []);

  const handleSaveCurrentStrategy = (name: string) => {
    const newStrategy: UserStrategy = {
      id: crypto.randomUUID(),
      name,
      code: botCode,
    };
    const updatedStrategies = [...userStrategies, newStrategy];
    setUserStrategies(updatedStrategies);
    saveStrategiesToLocalStorage(updatedStrategies);
  };

  const handleLoadStrategy = (strategyId: string) => {
    const strategyToLoad = userStrategies.find((s) => s.id === strategyId);
    if (strategyToLoad) {
      setBotCode(strategyToLoad.code);
    }
  };

  const handleDeleteStrategy = (strategyId: string) => {
    const updatedStrategies = userStrategies.filter((s) => s.id !== strategyId);
    setUserStrategies(updatedStrategies);
    saveStrategiesToLocalStorage(updatedStrategies);
  };


  return (
    <BotLogicContext.Provider
      value={{
        isLogicEnabled,
        setIsLogicEnabled,
        userStrategies,
        handleSaveCurrentStrategy,
        handleLoadStrategy,
        handleDeleteStrategy,
      }}
    >
      {children}
    </BotLogicContext.Provider>
  );
};

export const useBotLogic = () => {
  const ctx = useContext(BotLogicContext);
  if (!ctx) throw new Error('useBotLogic must be used within BotLogicProvider');
  return ctx;
};