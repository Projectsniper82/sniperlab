// src/components/LiveTokenChart.js
'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js' // Import Connection if needed, definitely PublicKey
import { getAccount } from '@solana/spl-token'
import {
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Scatter, Line, Area, Brush
} from 'recharts'
import Decimal from 'decimal.js'
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2'

// --- Import Raydium Constants ---
import {
  MAINNET_AMM_V4_PROGRAM_ID,
  DEVNET_AMM_V4_PROGRAM_ID,
  MAINNET_AMM_V4_CONFIG_ID_STR,
  DEVNET_AMM_V4_CONFIG_ID_STR,
  // You might need other constants depending on pool type, adjust as needed
} from '../utils/raydiumConsts.ts' // Adjust path if necessary

// --- Constants ---
// REMOVED HARDCODED IDs:
// const CPMM_PROGRAM_ID = new PublicKey('...');
// const FEE_CONFIG_ID = new PublicKey('...');
const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL Mint
Decimal.set({ precision: 50 });
const INITIAL_CANDLE_INTERVAL_MS = 60 * 1000; // Default to 1 minute
const POLLING_INTERVAL_MS = 5 * 1000;        // Fetch price every 5s
const MAX_DISPLAY_POINTS = 150;             // Max candles/points shown in main chart history
const MAX_RAW_TICKS = Math.max(300, (15 * 60 * 1000) / POLLING_INTERVAL_MS * 3); // Store enough raw ticks for ~45 mins (for 15m re-aggregation)
const INITIAL_BRUSH_POINTS_VISIBLE = Math.floor(MAX_DISPLAY_POINTS * 0.6); // How many points the brush shows initially (e.g., last 60%)

// --- Helper Functions ---
const formatUsd = (value, detail = false) => {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    if (value === 0) return '$0.00';
    const minFrac = detail ? Math.max(2, Math.min(8, -Math.floor(Math.log10(Math.abs(value))) + 2)) : 2;
    const maxFrac = detail ? Math.max(2, Math.min(8, -Math.floor(Math.log10(Math.abs(value))) + 4)) : 2;
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac });
};
const formatTime = (unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
const defaultTickFormatter = (v) => {
    if (typeof v !== 'number' || isNaN(v)) return '';
    if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
    return v.toFixed(0);
};

// --- Custom Tick Component ---
const DexStylePriceTick = React.memo((props) => {
    const { x, y, payload, textAnchor = "end", fill = "#888", fontSize = 10 } = props;
    const { value } = payload;
    if (typeof value !== 'number' || isNaN(value)) return null;
    let formattedTick = ''; const threshold = 0.001;
    if (value > 0 && value < threshold) { const s = value.toFixed(20); const match = s.match(/^0\.(0+)([1-9]\d{0,3})/); if (match && match[1] && match[2]) { const zeros = match[1].length; const significantDigits = match[2]; if (zeros >= 2) { formattedTick = `0.0..${zeros}..${significantDigits}`; } else { formattedTick = value.toPrecision(4); } } else { formattedTick = value.toExponential(2); } }
    else { if (value === 0) formattedTick = '0'; else if (value >= 1000) formattedTick = defaultTickFormatter(value); else if (value >= 1) formattedTick = value.toFixed(2); else formattedTick = value.toFixed(4); }
    return ( <g transform={`translate(${x},${y})`}> <text x={0} y={0} dy={fontSize * 0.35} textAnchor={textAnchor} fill={fill} fontSize={fontSize}> {formattedTick} </text> </g> );
});
DexStylePriceTick.displayName = 'DexStylePriceTick';

// --- Candlestick Shape Component ---
const CandlestickShape = React.memo((props) => {
  const { x, payload, yAxis, width: candleSlotWidth } = props;
  if (typeof x !== 'number' || isNaN(x)) { return null; }
  if (!payload || typeof payload.open === 'undefined' || !yAxis || typeof yAxis.scale !== 'function' || !candleSlotWidth || candleSlotWidth <= 0 || isNaN(candleSlotWidth)) { return null; }
  const scale = yAxis.scale; const yHigh = typeof payload.high === 'number' ? scale(payload.high) : NaN; const yLow = typeof payload.low === 'number' ? scale(payload.low) : NaN; const yOpen = typeof payload.open === 'number' ? scale(payload.open) : NaN; const yClose = typeof payload.close === 'number' ? scale(payload.close) : NaN;
  if ([yHigh, yLow, yOpen, yClose].some(val => isNaN(val))) { return null; }
  const isGreen = payload.close >= payload.open; const color = isGreen ? '#26A69A' : '#EF5350'; const bodyY = Math.min(yOpen, yClose); const bodyHeight = Math.max(1, Math.abs(yOpen - yClose)); const candleActualWidth = Math.max(1, candleSlotWidth * 0.7); const xCoord = x + (candleSlotWidth - candleActualWidth) / 2;
   if (isNaN(xCoord) || isNaN(bodyY) || isNaN(bodyHeight) || isNaN(candleActualWidth) ) { console.warn("CandlestickShape: NaN value detected before rendering SVG shape", { xCoord, bodyY, bodyHeight, candleActualWidth, yHigh, yLow, props }); return null; }
  return ( <g> <line x1={xCoord + candleActualWidth / 2} y1={yHigh} x2={xCoord + candleActualWidth / 2} y2={yLow} stroke={color} strokeWidth={1.5} /> <rect x={xCoord} y={bodyY} width={candleActualWidth} height={bodyHeight} fill={color} /> </g> );
});
CandlestickShape.displayName = 'CandlestickShape';

// --- Re-aggregation Function ---
const aggregateHistoricalCandles = (rawTicks, intervalMs, maxCandles) => {
    if (!rawTicks || rawTicks.length === 0) return [];
    console.log(`Re-aggregating ${rawTicks.length} raw ticks into ${intervalMs/1000}s candles.`);

    const candles = new Map(); // Use Map for easier aggregation by period start time

    for (const tick of rawTicks) {
        const { timestamp, price } = tick;
        if (typeof timestamp !== 'number' || typeof price !== 'number' || isNaN(timestamp) || isNaN(price)) continue;

        const periodStart = Math.floor(timestamp / intervalMs) * intervalMs;

        if (!candles.has(periodStart)) {
             // Start new candle if it doesn't exist for this period
            candles.set(periodStart, {
                timestamp: periodStart,
                open: price,
                high: price,
                low: price,
                currentClose: price, // Tracks latest price within interval
                volume: 0,
            });
        } else {
            // Update existing candle for this period
            const candle = candles.get(periodStart);
            candle.high = Math.max(candle.high, price);
            candle.low = Math.min(candle.low, price);
            candle.currentClose = price; // Update latest price
        }
    }

    // Convert Map values to array and set final close price
    const aggregatedCandles = Array.from(candles.values()).map(candle => ({
        ...candle,
        close: candle.currentClose // Final close is the last price seen in the interval
    })).sort((a, b) => a.timestamp - b.timestamp); // Ensure sorted by time

    // Return the last 'maxCandles' count
    const result = aggregatedCandles.slice(-maxCandles);
    console.log(`Re-aggregation produced ${result.length} candles.`);
    return result;
};

// --- Main Chart Component ---
// --- ADD 'network' PROP ---
export default function LiveTokenChart({
  tokenMint, tokenDecimals, tokenSupply, connection, network // Added network prop
}) {
  const [selectedCandleIntervalMs, setSelectedCandleIntervalMs] = useState(INITIAL_CANDLE_INTERVAL_MS);
  const [chartMode, setChartMode] = useState('price');
  const [ohlcData, setOhlcData] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(null);
  const [marketCapHistory, setMarketCapHistory] = useState([]);
  const [rawPriceHistory, setRawPriceHistory] = useState([]);
  const [lastPrice, setLastPrice] = useState(0);
  const [currentMarketCap, setCurrentMarketCap] = useState(0);
  const [currentLpValue, setCurrentLpValue] = useState(0);
  const [solUsdPrice, setSolUsdPrice] = useState(null);
  const [vaultKeys, setVaultKeys] = useState(null);
  const [isLoadingSolPrice, setIsLoadingSolPrice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const initialBrushEndIndex = MAX_DISPLAY_POINTS - 1;
  const initialBrushStartIndex = Math.max(0, initialBrushEndIndex - INITIAL_BRUSH_POINTS_VISIBLE + 1);
  const [brushWindow, setBrushWindow] = useState({
      startIndex: initialBrushStartIndex,
      endIndex: initialBrushEndIndex
  });

  // --- MODIFIED Effect to Reset data and SET VAULT KEYS based on NETWORK ---
  useEffect(() => {
    // Reset state whenever token or network changes
    setIsInitialLoading(true);
    setErrorMsg('');
    setOhlcData([]);
    setCurrentCandle(null);
    setMarketCapHistory([]);
    setRawPriceHistory([]);
    setLastPrice(0);
    setCurrentMarketCap(0);
    setCurrentLpValue(0);
    setVaultKeys(null); // Reset vault keys explicitly
    const defaultEndIndex = MAX_DISPLAY_POINTS - 1;
    const defaultStartIndex = Math.max(0, defaultEndIndex - INITIAL_BRUSH_POINTS_VISIBLE + 1);
    setBrushWindow({ startIndex: defaultStartIndex, endIndex: defaultEndIndex });

    // Proceed only if required props are available
    if (tokenMint && tokenDecimals !== undefined && tokenDecimals !== null && network && connection) {
      try {
        const mintA = NATIVE_MINT; // WSOL Mint
        let mintB;
        try {
             mintB = new PublicKey(tokenMint); // Validate tokenMint format early
        } catch(e) {
            throw new Error("Invalid token mint address format.");
        }


        // --- DYNAMIC ID SELECTION ---
        let targetProgramId; // Use AMM V4 Program ID for pool lookups
        let targetConfigIdStr;

        if (network === 'mainnet-beta') {
          targetProgramId = MAINNET_AMM_V4_PROGRAM_ID;
          targetConfigIdStr = MAINNET_AMM_V4_CONFIG_ID_STR;
          console.log("LiveTokenChart: Using MAINNET constants.");
        } else if (network === 'devnet') {
          targetProgramId = DEVNET_AMM_V4_PROGRAM_ID;
          targetConfigIdStr = DEVNET_AMM_V4_CONFIG_ID_STR;
           console.log("LiveTokenChart: Using DEVNET constants.");
        } else {
          // Handle unsupported network case
          throw new Error(`Network "${network}" is not supported or constants are missing.`);
        }

        // Ensure constants were found for the network
        if (!targetProgramId || !targetConfigIdStr) {
          throw new Error(`Raydium constants missing for network: ${network}`);
        }
        console.log(`LiveTokenChart: String for PublicKey: ${JSON.stringify(targetConfigIdStr)}`);
        console.log(`LiveTokenChart: Char codes: ${JSON.stringify(targetConfigIdStr.split('').map(c => c.charCodeAt(0)))}`);
   // --------------------
        const targetConfigId = new PublicKey(targetConfigIdStr); 
        // --- END DYNAMIC ID SELECTION ---

        console.log(`LiveTokenChart: Deriving keys for network "${network}" with Program=${targetProgramId.toBase58()}, Config=${targetConfigId.toBase58()}`);

        // Derive pool keys using the dynamically selected IDs
        // Assuming getCreatePoolKeys works for finding existing AMMv4 pools too.
        // If not, a different Raydium SDK function might be needed for pool lookup.
        const keys = getCreatePoolKeys({
          programId: targetProgramId, // Use dynamic ID
          configId: targetConfigId,   // Use dynamic ID
          mintA,
          mintB
        });

        console.log(`LiveTokenChart: Derived Vault Keys - VaultA: ${keys.vaultA.toBase58()}, VaultB: ${keys.vaultB.toBase58()}`);
        setVaultKeys({ vaultA: keys.vaultA, vaultB: keys.vaultB });
        // Don't set initial loading false here, let the first fetch attempt do it

      } catch (e) {
        console.error("LiveTokenChart: Error setting up vault keys:", e);
        setErrorMsg(`Failed to derive pool keys: ${e.message || 'Unknown error'}`);
        setVaultKeys(null);
        setIsInitialLoading(false); // Set loading false on error during setup
      }
    } else {
      // Handle missing props case
       setIsInitialLoading(false);
       if (tokenMint) { // Only show error if token is present but other props missing
           setErrorMsg("Network, Connection, or Token details missing.");
       }
    }
  // Add 'network' and 'connection' to the dependency array
  }, [tokenMint, tokenDecimals, network, connection]);
  // --- END MODIFIED Effect ---

  // Effect to Fetch SOL Price (Unchanged)
  useEffect(() => {
    const fetchSolPrice = async () => {
        setIsLoadingSolPrice(true);
        try { const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'); if (!response.ok) { const errorText = await response.text().catch(() => "Could not read error text"); console.error(`LiveTokenChart: CoinGecko API error: ${response.status} ${response.statusText}`, errorText); throw new Error(`CoinGecko API error: ${response.status}`); } const priceData = await response.json(); if (priceData?.solana?.usd) { setSolUsdPrice(priceData.solana.usd); } else { console.error("LiveTokenChart: Invalid data format from CoinGecko:", priceData); throw new Error("Invalid data format from CoinGecko"); }
        } catch (error) { console.error("LiveTokenChart: Failed to fetch SOL/USD price:", error.message); setSolUsdPrice(null); } finally { setIsLoadingSolPrice(false); }
    };
    fetchSolPrice(); const intervalId = setInterval(fetchSolPrice, 60000); return () => clearInterval(intervalId);
  }, []);

  // Function to process new LIVE data points (Unchanged conceptually, simplified logging)
   const processNewLiveDataPoint = useCallback((newPrice, newMarketCap, timestamp) => {
      if (typeof newPrice !== 'number' || isNaN(newPrice)) { newPrice = lastPrice; }
      if (typeof newMarketCap !== 'number' || isNaN(newMarketCap)) { newMarketCap = currentMarketCap; }

     // Store raw tick
     setRawPriceHistory(prevRaw => {
         const newTick = { timestamp, price: newPrice };
         if (prevRaw.length > 0 && timestamp === prevRaw[prevRaw.length - 1].timestamp) {
             return prevRaw;
         }
         const updatedRaw = [...prevRaw, newTick];
         return updatedRaw.length > MAX_RAW_TICKS ? updatedRaw.slice(-MAX_RAW_TICKS) : updatedRaw;
     });

     // Update MC history
     setMarketCapHistory(prevHistory => {
         const newPoint = { timestamp, marketCap: newMarketCap };
         if (prevHistory.length > 0 && timestamp - prevHistory[prevHistory.length - 1].timestamp < POLLING_INTERVAL_MS / 2) { return prevHistory; }
         const updatedHistory = [...prevHistory, newPoint];
         return updatedHistory.length > MAX_DISPLAY_POINTS ? updatedHistory.slice(-MAX_DISPLAY_POINTS) : updatedHistory;
     });

     // Update current candle / finalize previous for OHLC display
     setCurrentCandle(prevCandle => {
         const currentPeriodStart = Math.floor(timestamp / selectedCandleIntervalMs) * selectedCandleIntervalMs;
         if (!prevCandle || currentPeriodStart > prevCandle.timestamp) {
             let finalizedCandles = []; if (prevCandle) { finalizedCandles.push({ timestamp: prevCandle.timestamp, open: prevCandle.open, high: prevCandle.high, low: prevCandle.low, close: prevCandle.currentClose, volume: prevCandle.volume, }); }
             if (finalizedCandles.length > 0) {
                 setOhlcData(prevOhlc => {
                     const updatedOhlc = [...prevOhlc, ...finalizedCandles];
                     const uniqueTimestamps = new Set();
                     const uniqueData = updatedOhlc.filter(item => { if (!uniqueTimestamps.has(item.timestamp)) { uniqueTimestamps.add(item.timestamp); return true; } return false; });
                     const finalData = uniqueData.length > MAX_DISPLAY_POINTS ? uniqueData.slice(-MAX_DISPLAY_POINTS) : uniqueData;
                     setBrushWindow(prevBrushWindow => {
                          const maxPossibleIndex = Math.max(0, finalData.length - 1);
                          const desiredWindowSize = INITIAL_BRUSH_POINTS_VISIBLE;
                          const newEndIndex = maxPossibleIndex;
                          const newStartIndex = Math.max(0, newEndIndex - desiredWindowSize + 1);
                          if (newStartIndex !== prevBrushWindow.startIndex || newEndIndex !== prevBrushWindow.endIndex) {
                              return { startIndex: newStartIndex, endIndex: newEndIndex };
                          }
                          return prevBrushWindow;
                     });
                     return finalData;
                 });
             } return { timestamp: currentPeriodStart, open: newPrice, high: newPrice, low: newPrice, currentClose: newPrice, volume: 0, };
         } else if (currentPeriodStart === prevCandle.timestamp) { return { ...prevCandle, high: Math.max(prevCandle.high, newPrice), low: Math.min(prevCandle.low, newPrice), currentClose: newPrice, }; }
         return prevCandle;
     });

     setLastPrice(newPrice);
     setCurrentMarketCap(newMarketCap);

   }, [selectedCandleIntervalMs, lastPrice, currentMarketCap]);

  // Function to fetch reserves and trigger processing (Unchanged conceptually)
  const fetchReservesAndAggregate = useCallback(async () => {
      // Ensure vaultKeys are set before attempting to fetch
      if (!vaultKeys || !connection || tokenDecimals === undefined || tokenSupply === undefined) {
          // Don't set error if tokenMint is missing (handled by initial useEffect)
          if (tokenMint && !vaultKeys && !isInitialLoading && !errorMsg.includes("derive pool keys")) {
              // Only set error if setup failed or props are missing after initial load attempt
              // setErrorMsg("Pool details incomplete or connection missing.");
              console.warn("fetchReservesAndAggregate skipped: Pool details incomplete or connection missing.");
          }
          // No need to set loading false here, handled by the setup effect
          return;
      }

      try {
        console.debug(`Workspaceing reserves from VaultA: ${vaultKeys.vaultA.toBase58()}, VaultB: ${vaultKeys.vaultB.toBase58()}`);
        // Fetch accounts concurrently
        const [acctA, acctB] = await Promise.all([
             getAccount(connection, vaultKeys.vaultA, 'confirmed'),
             getAccount(connection, vaultKeys.vaultB, 'confirmed')
        ]);

        const solReserve = new Decimal(acctA.amount.toString()).div(1e9);
        const tokenReserve = new Decimal(acctB.amount.toString()).div(new Decimal(10).pow(tokenDecimals));
        let priceNum;
        let marketCapNum;

        if (tokenReserve.isZero()) {
            console.warn("LiveTokenChart: Token reserve is zero.");
            priceNum = lastPrice || 0; // Use last known price or 0
            marketCapNum = 0;
            setCurrentLpValue(solReserve.toNumber());
        } else {
            const priceDecimal = solReserve.div(tokenReserve);
            priceNum = priceDecimal.toNumber();
            // Ensure tokenSupply is valid before calculating market cap
            let uiSupply = new Decimal(0);
            if (tokenSupply !== undefined && tokenSupply !== null) {
                 try {
                     uiSupply = new Decimal(tokenSupply.toString()).div(new Decimal(10).pow(tokenDecimals));
                 } catch (e) {
                     console.error("Error parsing tokenSupply:", tokenSupply, e);
                     // Handle error, maybe set marketCapNum to 0 or fallback
                 }
            }
            const marketCapDecimal = priceDecimal.mul(uiSupply);
            marketCapNum = marketCapDecimal.toNumber();
            const totalLpValueSol = solReserve.plus(tokenReserve.mul(priceDecimal));
            setCurrentLpValue(totalLpValueSol.toNumber());
        }

        // Process the fetched/calculated data
         processNewLiveDataPoint( isNaN(priceNum) ? 0 : priceNum, isNaN(marketCapNum) ? 0 : marketCapNum, Date.now());

        if(isInitialLoading) setIsInitialLoading(false); // Mark initial loading complete
        // Clear any previous errors if fetch succeeds
        if (errorMsg) setErrorMsg('');

      } catch (err) {
        // Log specific error and potentially set user-facing message
        console.error(`LiveTokenChart: FetchReserves error for ${tokenMint}:`, err);
        const msg = err.message?.toLowerCase() || '';
        // Check if the error is TokenAccountNotFoundError specifically for the vault accounts
        if (msg.includes('tokenaccountnotfounderror') || msg.includes('could not find account') || msg.includes('failed to get account info')) {
             // This confirms the derived vault accounts likely don't exist on the current network
             setErrorMsg(`Pool not found or not initialized for ${tokenMint?.substring(0,6)}... (Vaults not found)`);
        } else {
             // Generic error fetching data
             setErrorMsg(`Error fetching pool data for ${tokenMint?.substring(0,6)}...`);
        }
        setIsInitialLoading(false); // Stop loading on error
      }
  }, [vaultKeys, connection, tokenDecimals, tokenSupply, processNewLiveDataPoint, lastPrice, currentMarketCap, tokenMint, isInitialLoading, errorMsg]); // Added errorMsg

  // useEffect to run the fetcher (Unchanged)
  useEffect(() => {
      if (vaultKeys && connection) {
          const intervalId = setInterval(fetchReservesAndAggregate, POLLING_INTERVAL_MS);
          // Perform an initial fetch immediately after setting up
          fetchReservesAndAggregate();
          return () => clearInterval(intervalId);
      }
      // No else block needed here, setup effect handles missing vaultKeys/connection
  }, [vaultKeys, connection, fetchReservesAndAggregate]);


  // Effect to Re-aggregate and Reset on interval change (Unchanged)
  useEffect(() => {
    console.log(`LiveTokenChart: Interval changed to ${selectedCandleIntervalMs / 1000}s. Re-aggregating.`);
    const historicalCandles = aggregateHistoricalCandles(rawPriceHistory, selectedCandleIntervalMs, MAX_DISPLAY_POINTS);
    setOhlcData(historicalCandles);
    setCurrentCandle(null);
    setMarketCapHistory([]); // Also clear MC history for consistency

    const newEndIndex = Math.max(0, historicalCandles.length - 1);
    const newStartIndex = Math.max(0, newEndIndex - INITIAL_BRUSH_POINTS_VISIBLE + 1);
    setBrushWindow({ startIndex: newStartIndex, endIndex: newEndIndex });

  }, [selectedCandleIntervalMs, rawPriceHistory]);


  // Prepare data for the chart based on mode (Unchanged)
  const chartSourceData = useMemo(() => {
      if (chartMode === 'price') { const data = [...ohlcData]; if (currentCandle) { data.push({ ...currentCandle, close: currentCandle.currentClose }); } return data.filter(c => c && typeof c.timestamp === 'number' && typeof c.open === 'number').map((c, index) => ({...c, key: `ohlc-${c.timestamp}-${index}`})); }
      else { return marketCapHistory.filter(mc => mc && typeof mc.timestamp === 'number' && typeof mc.marketCap === 'number').map((mc, index) => ({...mc, key: `mc-${mc.timestamp}-${index}`})); }
    }, [ohlcData, currentCandle, marketCapHistory, chartMode]);

 // Calculate Y-axis domain based on visible data in the Brush window (Unchanged conceptually)
 const yAxisDomain = useMemo(() => {
      const currentDataLength = chartSourceData.length;
      const safeStartIndex = Math.max(0, Math.min(brushWindow.startIndex, currentDataLength - 1));
      const safeEndIndex = Math.max(safeStartIndex, Math.min(brushWindow.endIndex, currentDataLength - 1));

      const visibleData = chartSourceData.slice(safeStartIndex, safeEndIndex + 1);

      if (!visibleData || visibleData.length === 0) return ['auto', 'auto'];

      let minVal = Infinity; let maxVal = 0;
      if (chartMode === 'price') { visibleData.forEach(d => { if (d.low > 0) minVal = Math.min(minVal, d.low); if (d.high > 0) maxVal = Math.max(maxVal, d.high); }); }
      else { visibleData.forEach(d => { if (d.marketCap > 0) minVal = Math.min(minVal, d.marketCap); if (d.marketCap > 0) maxVal = Math.max(maxVal, d.marketCap); }); }

      if (minVal === Infinity || maxVal === 0) { const fallbackLast = chartMode === 'price' ? lastPrice : currentMarketCap; if (fallbackLast > 0) return [fallbackLast * 0.5, fallbackLast * 1.5]; return chartMode === 'price' ? [0.00000001, 0.000001] : [1, 1000]; }

      const dataRange = maxVal - minVal; const padding = dataRange > 0 ? dataRange * 0.15 : maxVal * 0.15;
      let domainMin = Math.max(chartMode === 'price' ? 0.0000000001 : 1, minVal - padding);
      let domainMax = maxVal + padding;

      if (domainMin >= domainMax || !isFinite(domainMin) || !isFinite(domainMax)) { domainMin = minVal * 0.8; domainMax = maxVal * 1.2; if (domainMin <=0 && chartMode === 'price') domainMin = minVal > 0 ? minVal / 2 : 0.0000000001; if (domainMin <=0 && chartMode === 'marketCap') domainMin = minVal > 0 ? minVal / 2 : 1; if (domainMin >= domainMax || !isFinite(domainMin) || !isFinite(domainMax) ) { domainMin = 0.0000000001; domainMax = 1;} }
      return [domainMin, domainMax];
  }, [chartSourceData, chartMode, lastPrice, currentMarketCap, brushWindow]);

  // Brush change handler (Unchanged)
  const handleBrushChange = useCallback(({ startIndex, endIndex }) => {
     const currentDataLength = chartSourceData.length; const maxIndex = Math.max(0, currentDataLength - 1);
     const rawStartIndex = (typeof startIndex === 'number' && !isNaN(startIndex)) ? startIndex : 0; const rawEndIndex = (typeof endIndex === 'number' && !isNaN(endIndex)) ? endIndex : maxIndex;
     const finalStartIndex = Math.max(0, Math.min(rawStartIndex, maxIndex)); const finalEndIndex = Math.min(Math.max(finalStartIndex, rawEndIndex), maxIndex);
     setBrushWindow(prev => { if (prev.startIndex !== finalStartIndex || prev.endIndex !== finalEndIndex) { return { startIndex: finalStartIndex, endIndex: finalEndIndex }; } return prev; });
  }, [chartSourceData.length]);


  // --- Render Logic ---
  const currentPriceForStats = currentCandle?.currentClose ?? lastPrice ?? 0;
  const displayPriceUsd = solUsdPrice !== null ? currentPriceForStats * solUsdPrice : null;
  const displayMarketCapUsd = solUsdPrice !== null ? currentMarketCap * solUsdPrice : null;
  const displayLpValueUsd = solUsdPrice !== null ? currentLpValue * solUsdPrice : null;

  // Updated RenderChartContent to handle loading/error states better
  const renderChartContent = () => {
    if (isInitialLoading && !errorMsg) {
        return <div className="text-gray-400 text-center p-10">Loading initial pool data...</div>;
    }
    if (errorMsg && chartSourceData.length === 0) {
        // Display specific error related to pool finding if applicable
         return <div className="text-red-400 text-center p-10">{errorMsg}</div>;
    }
     if (!vaultKeys && tokenMint && !errorMsg && !isInitialLoading) { // Check after initial load attempt
         return <div className="text-yellow-400 text-center p-10">Could not derive pool keys. Ensure token address is correct for the selected network.</div>;
     }
    if (chartSourceData.length === 0 && !errorMsg && !isInitialLoading) {
        return <div className="text-gray-400 text-center p-10">No chart data available. Pool might be inactive or reserves are zero.</div>;
    }
     if (chartSourceData.length === 0) { // Catch-all for empty data after loading attempts
         return <div className="text-gray-400 text-center p-10">Waiting for data...</div>;
     }


    // Ensure brush indices are valid before rendering Brush
    const currentDataLen = chartSourceData.length;
    const validStartIndex = Math.max(0, Math.min(brushWindow.startIndex, currentDataLen - 1));
    const validEndIndex = Math.max(validStartIndex, Math.min(brushWindow.endIndex, currentDataLen - 1));

    return (
      <ResponsiveContainer key={`${chartMode}-${selectedCandleIntervalMs}`} width="100%" height={420}>
        <ComposedChart data={chartSourceData} margin={{ top: 5, right: 5, left: -20, bottom: 60 }}>
          <CartesianGrid stroke="#303030" strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} tick={{ fill: '#888', fontSize: 9, angle: -40 }} axisLine={{ stroke: '#444' }} dy={15} dx={-10} interval="auto" minTickGap={80} textAnchor="end" height={45} />
          <YAxis yAxisId="primary" domain={yAxisDomain} tick={{ fill: '#888', fontSize: 10 }} axisLine={{ stroke: '#444' }} tick={chartMode === 'price' ? <DexStylePriceTick /> : { fill: '#888', fontSize: 10 }} tickFormatter={chartMode !== 'price' ? defaultTickFormatter : undefined} orientation="left" scale={chartMode === 'price' ? "log" : "linear"} allowDataOverflow={false} dx={-2} width={55} />
          <Tooltip formatter={(value, name, entry) => { const { payload } = entry; if (chartMode === 'price' && payload && typeof payload.open !== 'undefined') { const usdO = solUsdPrice !== null ? formatUsd(payload.open * solUsdPrice, true) : 'N/A'; const usdH = solUsdPrice !== null ? formatUsd(payload.high * solUsdPrice, true) : 'N/A'; const usdL = solUsdPrice !== null ? formatUsd(payload.low * solUsdPrice, true) : 'N/A'; const usdC = solUsdPrice !== null ? formatUsd(payload.close * solUsdPrice, true) : 'N/A'; const formattedValue = `O: ${payload.open.toPrecision(6)} (${usdO})\nH: ${payload.high.toPrecision(6)} (${usdH})\nL: ${payload.low.toPrecision(6)} (${usdL})\nC: ${payload.close.toPrecision(6)} (${usdC})`; return [formattedValue, name]; } else if (chartMode === 'marketCap' && name === 'Market Cap') { const usdVal = solUsdPrice !== null ? formatUsd(value * solUsdPrice) : ''; return [`${defaultTickFormatter(value)} SOL ${usdVal}`, "Market Cap"]; } const fallbackUsd = (typeof value === 'number' && solUsdPrice !== null) ? formatUsd(value * solUsdPrice) : ''; return [`${value} ${fallbackUsd}`, name]; }} labelFormatter={(label) => new Date(label).toLocaleString()} contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', borderColor: '#555', borderRadius: '4px', padding: '8px 12px', whiteSpace: 'pre-line' }} itemStyle={{ color: '#eee', fontSize: '11px', padding: '1px 0'}} labelStyle={{ color: '#fff', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold'}} cursor={{fill: 'rgba(200, 200, 200, 0.1)'}} position={{ y: 10 }} />
          {chartMode === 'price' && currentPriceForStats > 0 && ( <ReferenceLine y={currentPriceForStats} yAxisId="primary" stroke="#4CAF50" strokeDasharray="4 4" strokeOpacity={0.8}> <text x="calc(100% - 50px)" y="10" fill="#4CAF50" fontSize="10" textAnchor="middle">{currentPriceForStats.toPrecision(4)}</text> </ReferenceLine> )}

          {chartMode === 'price' ? ( <Scatter yAxisId="primary" name="OHLC Details" dataKey="close" shape={(shapeProps) => { let candleSlotWidth = 10; const { xAxis, viewBox } = shapeProps; if (xAxis && typeof xAxis.scale === 'function' && viewBox?.width > 0 && chartSourceData?.length > 0) { if (typeof xAxis.scale.bandwidth === 'function') { candleSlotWidth = xAxis.scale.bandwidth(); } else { candleSlotWidth = viewBox.width / chartSourceData.length; } } return <CandlestickShape {...shapeProps} width={Math.max(2, candleSlotWidth)} />; }} isAnimationActive={false} key="priceScatter" /> )
          : ( <Area yAxisId="primary" type="monotone" dataKey="marketCap" name="Market Cap" stroke="#8884d8" fill="url(#mcGradient)" fillOpacity={0.5} strokeWidth={1.5} connectNulls={true} isAnimationActive={false} dot={false} key="marketCapArea" /> )}
          <defs> <linearGradient id="mcGradient" x1="0" y1="0" x2="0" y2="1"> <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5}/> <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/> </linearGradient> </defs>

           {/* --- BRUSH --- */}
            {chartSourceData.length > 1 && (
             <Brush
               dataKey="timestamp" height={30} stroke="#555"
               y={380}
               startIndex={validStartIndex}
               endIndex={validEndIndex}
               tickFormatter={formatTime}
               onChange={handleBrushChange}
               travellerWidth={10}
               padding={{ top: 5, bottom: 5 }}
               fill="rgba(60, 60, 60, 0.5)"
             >
                <ComposedChart>
                   <XAxis dataKey="timestamp" hide />
                    {chartMode === 'price' ? ( <Line type="monotone" dataKey="close" stroke="#777" dot={false} isAnimationActive={false} yAxisId="brushY" /> )
                    : ( <Area type="monotone" dataKey="marketCap" stroke="#777" fill="#666" fillOpacity={0.3} dot={false} isAnimationActive={false} yAxisId="brushY"/> )}
                   <YAxis hide domain={yAxisDomain} yAxisId="brushY" scale={chartMode === 'price' ? "log" : "linear"}/>
                </ComposedChart>
             </Brush>
            )}
           {/* --- END BRUSH --- */}

        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // --- Component Return ---
  const intervalOptions = [ {label: '15s', value: 15 * 1000}, {label: '1m', value: 60 * 1000}, {label: '5m', value: 5 * 60 * 1000}, {label: '15m', value: 15 * 60 * 1000}];
  const modeOptions = [ {label: 'Price', value: 'price'}, {label: 'Market Cap', value: 'marketCap'}];

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow-lg">
       {/* UI Controls */}
       <div className="flex flex-wrap justify-between items-center mb-2 gap-y-2"> <h2 className="text-lg sm:text-xl font-bold text-white mr-4">Live Pool Analytics ({network})</h2> <div className="flex items-center space-x-1 sm:space-x-2"> <span className="text-xs text-gray-400 mr-1">Mode:</span> {modeOptions.map(opt => ( <button key={opt.value} onClick={() => setChartMode(opt.value)} className={`text-xs px-2 py-1 rounded-md transition-colors ${chartMode === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}> {opt.label} </button> ))} </div> <div className="flex items-center space-x-1 sm:space-x-2"> <span className="text-xs text-gray-400 mr-1">Interval:</span> {intervalOptions.map(opt => ( <button key={opt.value} onClick={() => setSelectedCandleIntervalMs(opt.value)} className={`text-xs px-2 py-1 rounded-md transition-colors ${selectedCandleIntervalMs === opt.value ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}> {opt.label} </button>))} </div> </div>

       {/* Loading/Error/Empty States */}
       {/* Error message is now displayed within renderChartContent if needed */}
       {!tokenMint && <div className="text-gray-400 text-center py-10">Please load a token to see the chart.</div>}

       {/* Stats and Chart Area */}
       {tokenMint && (
           <>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm"> {/* Stats boxes */} <div className="bg-gray-800 p-2 sm:p-3 rounded-lg"> <p className="text-gray-400 text-xs mb-0.5">Price</p> <p className="text-white font-semibold break-words">{currentPriceForStats.toPrecision(6)} SOL</p> <p className="text-green-400 text-xs mt-0.5"> {isLoadingSolPrice ? 'Loading USD...' : formatUsd(displayPriceUsd, true)} </p> </div> <div className="bg-gray-800 p-2 sm:p-3 rounded-lg"> <p className="text-gray-400 text-xs mb-0.5">Market Cap</p> <p className="text-white font-semibold break-words"> {currentMarketCap.toLocaleString(undefined, { maximumFractionDigits: 0})} SOL </p> <p className="text-green-400 text-xs mt-0.5"> {isLoadingSolPrice ? 'Loading USD...' : formatUsd(displayMarketCapUsd)} </p> </div> <div className="bg-gray-800 p-2 sm:p-3 rounded-lg"> <p className="text-gray-400 text-xs mb-0.5">LP Value</p> <p className="text-white font-semibold break-words"> {currentLpValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} SOL </p> <p className="text-green-400 text-xs mt-0.5"> {isLoadingSolPrice ? 'Loading USD...' : formatUsd(displayLpValueUsd)} </p> </div> </div>
              {renderChartContent()}
           </>
       )}
     </div>
  )
}