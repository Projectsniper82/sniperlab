'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import Decimal from 'decimal.js';

const CPMM_PROGRAM_ID = new PublicKey('CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW');
const FEE_CONFIG_ID = new PublicKey('9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6');
Decimal.set({ precision: 50 });
const POLLING_INTERVAL_MS = 5_000;
const MAX_RAW_TICKS = Math.max(300, (15 * 60 * 1000) / POLLING_INTERVAL_MS * 3);

interface PriceTick { timestamp: number; price: number; }
interface MarketCapPoint { timestamp: number; marketCap: number; }

interface VaultKeys { vaultA: PublicKey; vaultB: PublicKey; }

interface ChartDataState {
  rawPriceHistory: PriceTick[];
  marketCapHistory: MarketCapPoint[];
  lastPrice: number;
  currentMarketCap: number;
  currentLpValue: number;
  solUsdPrice: number | null;
  isLoadingSolPrice: boolean;
  errorMsg: string;
  isInitialLoading: boolean;
}

interface ChartDataContextType extends ChartDataState {
  startTracking: (
    tokenMint: string,
    connection: Connection,
    decimals: number,
    supply: string,
    selectedPool?: { vaultA?: string; vaultB?: string }
  ) => void;
  stopTracking: () => void;
}

const ChartDataContext = createContext<ChartDataContextType | undefined>(undefined);

export const ChartDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [rawPriceHistory, setRawPriceHistory] = useState<PriceTick[]>([]);
  const [marketCapHistory, setMarketCapHistory] = useState<MarketCapPoint[]>([]);
  const [lastPrice, setLastPrice] = useState(0);
  const [currentMarketCap, setCurrentMarketCap] = useState(0);
  const [currentLpValue, setCurrentLpValue] = useState(0);
  const [solUsdPrice, setSolUsdPrice] = useState<number | null>(null);
  const [isLoadingSolPrice, setIsLoadingSolPrice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const tokenMintRef = useRef<string>('');
  const decimalsRef = useRef<number>(0);
  const supplyRef = useRef<string>('0');
  const connectionRef = useRef<Connection | null>(null);
  const selectedPoolRef = useRef<{ vaultA?: string; vaultB?: string } | undefined>(undefined);
  const vaultKeysRef = useRef<VaultKeys | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const solIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadingRef = useRef(false);
  const lastPriceRef = useRef(0);
  const lastTrackedMintRef = useRef<string>('');
  const lastTrackedConnectionRef = useRef<Connection | null>(null);

  const resetState = () => {
    setRawPriceHistory([]);
    setMarketCapHistory([]);
    setLastPrice(0);
    lastPriceRef.current = 0;
    setCurrentMarketCap(0);
    setCurrentLpValue(0);
    setErrorMsg('');
    setIsInitialLoading(true);
    isInitialLoadingRef.current = true;
  };

  const fetchSolPrice = useCallback(async () => {
    setIsLoadingSolPrice(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const priceData = await response.json();
      if (priceData?.solana?.usd) setSolUsdPrice(priceData.solana.usd);
    } catch (err) {
      console.error('ChartDataProvider: Failed to fetch SOL/USD price', (err as Error).message);
      setSolUsdPrice(null);
    } finally {
      setIsLoadingSolPrice(false);
    }
  }, []);

  const processNewData = useCallback((price: number, marketCap: number, timestamp: number) => {
    setRawPriceHistory(prev => {
      const newTick = { timestamp, price };
      const updated = [...prev, newTick];
      return updated.length > MAX_RAW_TICKS ? updated.slice(-MAX_RAW_TICKS) : updated;
    });
    setMarketCapHistory(prev => {
      const newPoint = { timestamp, marketCap };
      const updated = [...prev, newPoint];
      return updated.length > MAX_RAW_TICKS ? updated.slice(-MAX_RAW_TICKS) : updated;
    });
    setLastPrice(price);
    lastPriceRef.current = price;
    setCurrentMarketCap(marketCap);
  }, []);

  const fetchReserves = useCallback(async () => {
    const connection = connectionRef.current;
    const vaultKeys = vaultKeysRef.current;
    const decimals = decimalsRef.current;
    const supply = supplyRef.current;
    if (!connection || !vaultKeys) return;
    try {
      const acctA = await getAccount(connection, vaultKeys.vaultA, 'confirmed');
      const solReserve = new Decimal(acctA.amount.toString()).div(1e9);
      const acctB = await getAccount(connection, vaultKeys.vaultB, 'confirmed');
      const tokenReserve = new Decimal(acctB.amount.toString()).div(new Decimal(10).pow(decimals));

      let priceNum: number;
      let marketCapNum: number;
      const prevPrice = lastPriceRef.current;
      if (tokenReserve.isZero()) {
       priceNum = prevPrice || 0;
        marketCapNum = 0;
        setCurrentLpValue(solReserve.toNumber());
      } else {
        const priceDecimal = solReserve.div(tokenReserve);
        priceNum = priceDecimal.toNumber();
        const uiSupply = new Decimal(supply.toString()).div(new Decimal(10).pow(decimals));
        const marketCapDecimal = priceDecimal.mul(uiSupply);
        marketCapNum = marketCapDecimal.toNumber();
        const totalLpValueSol = solReserve.plus(tokenReserve.mul(priceDecimal));
        setCurrentLpValue(totalLpValueSol.toNumber());
      }
      processNewData(isNaN(priceNum) ? 0 : priceNum, isNaN(marketCapNum) ? 0 : marketCapNum, Date.now());
      setErrorMsg('');
      if (isInitialLoadingRef.current) {
        setIsInitialLoading(false);
        isInitialLoadingRef.current = false;
      }
    } catch (err) {
      console.error('ChartDataProvider: fetchReserves error', err);
      setErrorMsg('Error fetching pool data');
      setIsInitialLoading(false);
      isInitialLoadingRef.current = false;
    }
  }, [processNewData]);

  const deriveVaultKeys = useCallback((mint: string, pool?: { vaultA?: string; vaultB?: string }) => {
    if (pool?.vaultA && pool?.vaultB) {
      try {
        return { vaultA: new PublicKey(pool.vaultA), vaultB: new PublicKey(pool.vaultB) };
      } catch (e) {
        console.error('ChartDataProvider: invalid pool vault keys', e);
      }
    }
    try {
      const mintA = new PublicKey('So11111111111111111111111111111111111111112');
      const mintB = new PublicKey(mint);
      const keys = getCreatePoolKeys({ programId: CPMM_PROGRAM_ID, configId: FEE_CONFIG_ID, mintA, mintB });
      return { vaultA: keys.vaultA, vaultB: keys.vaultB };
    } catch (e) {
      console.error('ChartDataProvider: Error deriving vault keys', e);
    }
    return null;
  }, []);

  const startTracking = useCallback(
    (mint: string, connection: Connection, decimals: number, supply: string, pool?: { vaultA?: string; vaultB?: string }) => {
      const isNewToken = lastTrackedMintRef.current !== mint;
      const isNewConnection = lastTrackedConnectionRef.current !== connection;

      tokenMintRef.current = mint;
      decimalsRef.current = decimals;
      supplyRef.current = supply;
      connectionRef.current = connection;
      selectedPoolRef.current = pool;
      vaultKeysRef.current = deriveVaultKeys(mint, pool);
       if (isNewToken || isNewConnection) {
        resetState();
        setIsInitialLoading(true);
        isInitialLoadingRef.current = true;
      }
      if (!solIntervalRef.current) {
        fetchSolPrice();
        solIntervalRef.current = setInterval(fetchSolPrice, 60000);
      }
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchReserves, POLLING_INTERVAL_MS);
      }
      fetchReserves();
      lastTrackedMintRef.current = mint;
      lastTrackedConnectionRef.current = connection;
    },
    [deriveVaultKeys, fetchReserves, fetchSolPrice]
  );

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (solIntervalRef.current) {
      clearInterval(solIntervalRef.current);
      solIntervalRef.current = null;
    }
    vaultKeysRef.current = null;
    connectionRef.current = null;
    tokenMintRef.current = '';
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (solIntervalRef.current) clearInterval(solIntervalRef.current);
    };
  }, []);

  const value: ChartDataContextType = {
    rawPriceHistory,
    marketCapHistory,
    lastPrice,
    currentMarketCap,
    currentLpValue,
    solUsdPrice,
    isLoadingSolPrice,
    errorMsg,
    isInitialLoading,
    startTracking,
    stopTracking,
  };

  return <ChartDataContext.Provider value={value}>{children}</ChartDataContext.Provider>;
};

export const useChartData = () => {
  const ctx = useContext(ChartDataContext);
  if (!ctx) throw new Error('useChartData must be used within ChartDataProvider');
  return ctx;
};