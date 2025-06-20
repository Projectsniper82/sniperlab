'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalLogContextState {
  logs: string[];
  append: (entry: string) => void;
  clear: () => void;
}

const GlobalLogContext = createContext<GlobalLogContextState | undefined>(undefined);

export const GlobalLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const append = (entry: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()}: ${entry}`, ...prev.slice(0, 199)]);
  };

  const clear = () => setLogs([]);

  return (
    <GlobalLogContext.Provider value={{ logs, append, clear }}>
      {children}
    </GlobalLogContext.Provider>
  );
};

export const useGlobalLogs = () => {
  const ctx = useContext(GlobalLogContext);
  if (!ctx) throw new Error('useGlobalLogs must be used within GlobalLogProvider');
  return ctx;
};