'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { useGlobalLogs } from './GlobalLogContext';
import type { NetworkType } from './NetworkContext';
import { useNetwork } from './NetworkContext';
import { useChartData } from './ChartDataContext';
import { useToken } from './TokenContext';


// Template used when initializing new bot code in the editor
const DEFAULT_BOT_CODE = `exports.strategy = async (wallet, log, ctx) => {
  log('executing default strategy on ' + ctx.rpcUrl);
  if (!ctx.tokenAddress) {
    log('no token configured');
    return;
  }
  log('wallet ' + wallet.publicKey.toBase58() + ' ready for token ' + ctx.tokenAddress);
  // Add trading actions here. Wallet is already wrapped with a wallet adapter
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
  getSystemState: () => { allBots: BotInstance[]; tradeCounts: Record<string, number> };
}

export const BotContext = createContext<BotContextState | undefined>(undefined);

export const BotProvider = ({ children }: { children: React.ReactNode }) => {
  const [allBotsByNetwork, setAllBotsByNetwork] = useState<BotsByNetwork>({
    devnet: [],
    'mainnet-beta': [],
  });
  const { network, rpcUrl } = useNetwork();
  const { lastPrice, currentMarketCap, currentLpValue, solUsdPrice } =
    useChartData();
  const { tokenAddress, isLpActive } = useToken();
  const [botCode, setBotCode] = useState(DEFAULT_BOT_CODE);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isTradingActive, setIsTradingActive] = useState(false);
  const tradeCountsRef = useRef<Record<string, number>>({});
  const workerRef = useRef<Worker | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const runBotLogicRef = useRef<(() => void) | null>(null);
  const { append } = useGlobalLogs();

  const getSystemState = useCallback(() => {
    return {
      allBots: Object.values(allBotsByNetwork).flat(),
      tradeCounts: { ...tradeCountsRef.current },
    };
  }, [allBotsByNetwork]);

  const runBotLogic = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../../public/workers/bot-worker.js', import.meta.url),
        { type: 'module' }
      );
      workerRef.current.onmessage = (ev) => {
        const { log, error } = ev.data || {};
        if (log) append(log);
        if (error) append(`error: ${error}`);
      };
      workerRef.current.onerror = (e) => {
        append(`error: ${e.message}`);
      };
    }
    const bots = allBotsByNetwork[network] || [];
    bots.forEach((b) => {
      tradeCountsRef.current[b.id] = (tradeCountsRef.current[b.id] || 0) + 1;
    });
    const systemState = getSystemState();
    const context: any = {
      rpcUrl,
      tokenAddress,
      isLpActive,
      market: {
        lastPrice,
        currentMarketCap,
        currentLpValue,
        solUsdPrice,
      },
    };
    if (isAdvancedMode) {
      context.systemState = systemState;
    }
    workerRef.current.postMessage({
      code: botCode,
      bots: bots.map((b) => b.secret),
      context,
    });
  }, [
    allBotsByNetwork,
    botCode,
    network,
    rpcUrl,
    lastPrice,
    currentMarketCap,
    currentLpValue,
    solUsdPrice,
    isAdvancedMode,
    tokenAddress,
    isLpActive,
  ]);

   const startTrading = useCallback(() => {
    setIsTradingActive(true);
    runBotLogicRef.current?.();
  }, []);
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
    getSystemState,
  };

  return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
};

export const useBotContext = () => {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBotContext must be used within BotProvider');
  return ctx;
};
