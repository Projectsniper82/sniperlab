'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import type { NetworkType } from './NetworkContext';
import { useNetwork } from './NetworkContext';
import { useChartData } from './ChartDataContext';

// Template used when initializing new bot code in the editor
const DEFAULT_BOT_CODE = `exports.strategy = async (wallet, log) => {
  log('executing default strategy');
};`;

export interface BotInstance {
  id: string;
  secret: number[];
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
  startTrading: () => void;
  stopTrading: () => void;
}

export const BotContext = createContext<BotContextState | undefined>(undefined);

export const BotProvider = ({ children }: { children: React.ReactNode }) => {
  const [allBotsByNetwork, setAllBotsByNetwork] = useState<BotsByNetwork>({
    devnet: [],
    'mainnet-beta': [],
  });
  const { network, connection } = useNetwork();
  const { lastPrice, currentMarketCap, currentLpValue, solUsdPrice } =
    useChartData();
  const [botCode, setBotCode] = useState(DEFAULT_BOT_CODE);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isTradingActive, setIsTradingActive] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const runBotLogicRef = useRef<(() => void) | null>(null);


  const runBotLogic = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../../public/workers/bot-worker.js', import.meta.url),
        { type: 'module' }
      );
    }
    const bots = allBotsByNetwork[network] || [];
    const context = {
      connection,
      market: {
        lastPrice,
        currentMarketCap,
        currentLpValue,
        solUsdPrice,
      },
    };
    workerRef.current.postMessage({
      code: botCode,
      bots: bots.map((b) => b.secret),
      context,
    });
  }, [
    allBotsByNetwork,
    botCode,
    network,
    connection,
    lastPrice,
    currentMarketCap,
    currentLpValue,
    solUsdPrice,
  ]);

  const startTrading = useCallback(() => setIsTradingActive(true), []);
  const stopTrading = useCallback(() => setIsTradingActive(false), []);

  useEffect(() => {
    runBotLogicRef.current = runBotLogic;
  }, [runBotLogic]);

  useEffect(() => {
    if (isTradingActive) {
     runBotLogicRef.current?.();
      intervalRef.current = setInterval(() => {
        runBotLogicRef.current?.();
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [isTradingActive]);

  const value: BotContextState = {
    allBotsByNetwork,
    setAllBotsByNetwork,
    botCode,
    setBotCode,
    isAdvancedMode,
    setIsAdvancedMode,
    isTradingActive,
    setIsTradingActive,
    startTrading,
    stopTrading,
  };

  return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
};

export const useBotContext = () => {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBotContext must be used within BotProvider');
  return ctx;
};
