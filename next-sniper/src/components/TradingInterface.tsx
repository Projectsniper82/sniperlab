// src/components/TradingInterface.tsx (FIXED VERSION)
// Fixed txSignature null checks, added network prop

import React, { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';

import { getSimulatedPool, updateSimulatedPoolAfterTrade } from '@/utils/simulatedPoolStore';
import { isRaydiumPool, swapRaydiumTokens } from '@/utils/raydiumSdkAdapter';
import { NetworkType } from '@/context/NetworkContext'; // Import NetworkType

// Define NotificationType
type NotificationType = 'success' | 'error' | 'info' | 'warning' | '';

// Define an interface for the component's props
interface TradingInterfaceProps {
    wallet: any;
    connection: Connection;
    tokenAddress: string;
    tokenDecimals: number;
    tokenBalance: string;
    solBalance: number;
    refreshBalances: () => Promise<void>;
    subtractBalances: (amounts: { tokenAmount: number | string | BN, solAmount: number }) => void;
    setNotification: (notification: { show: boolean; message: string; type: NotificationType }) => void;
    // *** FIX: Added network prop type ***
    network: NetworkType; // To display current network
}

// Configure Decimal.js
Decimal.set({ precision: 50 });

// Use the Props interface
function TradingInterface({
    wallet,
    connection,
    tokenAddress,
    tokenDecimals,
    tokenBalance,
    solBalance,
    refreshBalances,
    subtractBalances,
    setNotification,
    // *** FIX: Destructure network prop ***
    network
}: TradingInterfaceProps) {
    const [buyAmount, setBuyAmount] = useState<string>('');
    const [sellAmount, setSellAmount] = useState<string>('');
    const [expectedBuyOutput, setExpectedBuyOutput] = useState<number>(0);
    const [expectedSellOutput, setExpectedSellOutput] = useState<number>(0);
    const [buyPriceImpact, setBuyPriceImpact] = useState<number>(0);
    const [sellPriceImpact, setSellPriceImpact] = useState<number>(0);
    const [slippage, setSlippage] = useState<number>(1);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUsingRaydium, setIsUsingRaydium] = useState<boolean>(true);

    const updatePoolData = useCallback(() => {
        const pool = getSimulatedPool();
        if (!pool || pool.price === undefined || pool.price === null || pool.tokenAddress?.toLowerCase() !== tokenAddress?.toLowerCase()) {
            setCurrentPrice(0);
            return null;
        }
        setCurrentPrice(pool.price);
        setIsUsingRaydium(isRaydiumPool(pool));
        return pool;
    }, [tokenAddress]);

    useEffect(() => {
        // ... (calculations - no changes needed here) ...
        const pool = updatePoolData();
        if (!pool || pool.price <= 0 || pool.solAmount <= 0 || pool.tokenAmount <= 0) {
             setExpectedBuyOutput(0); setBuyPriceImpact(0);
             setExpectedSellOutput(0); setSellPriceImpact(0);
             return;
        };

        // Buy Calculations
        try {
            const buyAmountFloat = parseFloat(buyAmount);
            if (!isNaN(buyAmountFloat) && buyAmountFloat > 0) {
                const inputSOL = buyAmountFloat;
                const k = new Decimal(pool.solAmount).mul(pool.tokenAmount);
                const newSolReserve = new Decimal(pool.solAmount).add(inputSOL);
                if (newSolReserve.isZero()) throw new Error("New SOL reserve zero");
                const newTokenReserve = k.div(newSolReserve);
                const estimatedOutputTokens = new Decimal(pool.tokenAmount).sub(newTokenReserve);
                if (estimatedOutputTokens.isZero() || estimatedOutputTokens.isNegative()) {
                    setExpectedBuyOutput(0); setBuyPriceImpact(100);
                } else {
                    const effectivePrice = new Decimal(inputSOL).div(estimatedOutputTokens);
                    const impactRatio = effectivePrice.sub(pool.price).abs().div(pool.price);
                    setExpectedBuyOutput(estimatedOutputTokens.toNumber());
                    setBuyPriceImpact(impactRatio.mul(100).toNumber());
                }
            } else { setExpectedBuyOutput(0); setBuyPriceImpact(0); }
        } catch (e) { console.error("Buy calc error:", e); setExpectedBuyOutput(0); setBuyPriceImpact(0); }

        // Sell Calculations
        try {
            const sellAmountFloat = parseFloat(sellAmount);
             if (!isNaN(sellAmountFloat) && sellAmountFloat > 0) {
                const inputTokens = sellAmountFloat;
                const k = new Decimal(pool.solAmount).mul(pool.tokenAmount);
                const newTokenReserve = new Decimal(pool.tokenAmount).add(inputTokens);
                 if (newTokenReserve.isZero()) throw new Error("New Token reserve zero");
                const newSolReserve = k.div(newTokenReserve);
                const estimatedOutputSOL = new Decimal(pool.solAmount).sub(newSolReserve);
                 if (estimatedOutputSOL.isZero() || estimatedOutputSOL.isNegative()) {
                    setExpectedSellOutput(0); setSellPriceImpact(100);
                 } else {
                     const effectivePrice = estimatedOutputSOL.div(inputTokens);
                     const impactRatio = new Decimal(pool.price).sub(effectivePrice).abs().div(pool.price);
                     setExpectedSellOutput(estimatedOutputSOL.toNumber());
                     setSellPriceImpact(impactRatio.mul(100).toNumber());
                 }
            } else { setExpectedSellOutput(0); setSellPriceImpact(0); }
        } catch (e) { console.error("Sell calc error:", e); setExpectedSellOutput(0); setSellPriceImpact(0); }
    }, [buyAmount, sellAmount, currentPrice, updatePoolData]);

     useEffect(() => {
        updatePoolData();
        const interval = setInterval(updatePoolData, 5000);
        return () => clearInterval(interval);
     }, [updatePoolData]);


    // --- Execute Buy Transaction ---
    const handleBuy = async () => {
        console.log("[handleBuy] Initiated.");
        const clearNotification = () => setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);

        const buyAmountSOLFloat = parseFloat(buyAmount);
        if (isNaN(buyAmountSOLFloat) || buyAmountSOLFloat <= 0) {
            setNotification({ show: true, message: "Please enter a valid SOL amount to buy", type: 'error' });
            clearNotification(); return;
        }
        if (buyAmountSOLFloat > solBalance) {
            setNotification({ show: true, message: "Not enough SOL balance", type: 'error' });
            clearNotification(); return;
        }

        setIsLoading(true);
        setNotification({ show: true, message: "Processing buy order...", type: 'info' });

        try {
            const pool = getSimulatedPool();
             console.log("[handleBuy] Fetched pool state:", pool);
            if (!pool?.raydiumPoolId || !pool.tokenAddress || pool.tokenDecimals === undefined) {
                 throw new Error("Active pool data or Pool ID is missing.");
            }
             if (pool.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) {
                 throw new Error("Loaded token does not match the active pool token.");
             }

            const solLamportsIn = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
            const inputMint = NATIVE_MINT.toBase58();
            const slippageDecimal = slippage / 100;

            let txSignature: string | null = null;

            if (isUsingRaydium && isRaydiumPool(pool)) {
                console.log("[RAYDIUM] Performing buy swap (SOL->Token) via SDK Adapter...");
                txSignature = await swapRaydiumTokens( wallet, connection, pool.raydiumPoolId, inputMint, solLamportsIn, slippageDecimal);
                 console.log("[RAYDIUM] Buy swap successful, Tx:", txSignature);
                 // *** FIX: Check if txSignature is not null ***
                 if (txSignature) {
                    setNotification({ show: true, message: `Buy successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
                 } else {
                    // Handle case where swap function might have returned null without throwing error
                    setNotification({ show: true, message: `Buy submitted, but transaction signature was not returned. Check wallet/explorer.`, type: 'warning' });
                 }
            } else {
                 console.log("[SIMULATION] Performing simulated buy swap");
                 if(expectedBuyOutput <= 0) throw new Error("Simulated output is zero or negative.");
                 updateSimulatedPoolAfterTrade(-expectedBuyOutput, buyAmountSOLFloat);
                 txSignature = `simulated_buy_${Date.now()}`; // Simulation always yields a "signature"
                 setNotification({ show: true, message: 'Simulated buy executed.', type: 'success' });
            }

            console.log("[handleBuy] Swap function finished. Refreshing balances...");
            await refreshBalances();
            setBuyAmount('');
            setExpectedBuyOutput(0);
            console.log("[handleBuy] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleBuy Error:`, error);
            setNotification({ show: true, message: `Buy Error: ${error.message || 'Unknown error'}`, type: 'error' });
        } finally {
            setIsLoading(false);
            clearNotification();
        }
    };


    // --- Execute Sell Transaction ---
    const handleSell = async () => {
        console.log("[handleSell] Initiated.");
        const clearNotification = () => setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);

        const sellAmountTokensFloat = parseFloat(sellAmount);
        if (isNaN(sellAmountTokensFloat) || sellAmountTokensFloat <= 0) {
            setNotification({ show: true, message: "Please enter a valid token amount to sell", type: 'error' });
            clearNotification(); return;
        }

        const rawTokenBalanceBN = new BN(tokenBalance);
        const rawTokensToSell = new BN(new Decimal(sellAmountTokensFloat).mul(10 ** tokenDecimals).toFixed(0));

        if (rawTokensToSell.gt(rawTokenBalanceBN)) {
             setNotification({ show: true, message: `Not enough token balance. Have: ${new Decimal(tokenBalance).div(10**tokenDecimals).toString()}, Trying to sell: ${sellAmountTokensFloat}`, type: 'error' });
             clearNotification(); return;
        }

        setIsLoading(true);
        setNotification({ show: true, message: "Processing sell order...", type: 'info' });

        try {
            const pool = getSimulatedPool();
             console.log("[handleSell] Fetched pool state:", pool);
             if (!pool?.raydiumPoolId || !pool.tokenAddress || pool.tokenDecimals === undefined) {
                 throw new Error("Active pool data or Pool ID is missing.");
             }
              if (pool.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) {
                 throw new Error("Loaded token does not match the active pool token.");
             }

            const inputMint = tokenAddress;
            const slippageDecimal = slippage / 100;

             let txSignature: string | null = null;

            if (isUsingRaydium && isRaydiumPool(pool)) {
                console.log("[RAYDIUM] Performing sell swap (Token->SOL) via SDK Adapter...");
                txSignature = await swapRaydiumTokens( wallet, connection, pool.raydiumPoolId, inputMint, rawTokensToSell, slippageDecimal);
                 console.log("[RAYDIUM] Sell swap successful, Tx:", txSignature);
                  // *** FIX: Check if txSignature is not null ***
                 if (txSignature) {
                    setNotification({ show: true, message: `Sell successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
                 } else {
                    setNotification({ show: true, message: `Sell submitted, but transaction signature was not returned. Check wallet/explorer.`, type: 'warning' });
                 }
            } else {
                 console.log("[SIMULATION] Performing simulated sell swap");
                 if(expectedSellOutput <= 0) throw new Error("Simulated output is zero or negative.");
                 updateSimulatedPoolAfterTrade(sellAmountTokensFloat, -expectedSellOutput);
                 txSignature = `simulated_sell_${Date.now()}`;
                 setNotification({ show: true, message: 'Simulated sell executed.', type: 'success' });
            }

            console.log("[handleSell] Swap function finished. Refreshing balances...");
            await refreshBalances();
            setSellAmount('');
            setExpectedSellOutput(0);
            console.log("[handleSell] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleSell Error:`, error);
            setNotification({ show: true, message: `Sell Error: ${error.message || 'Unknown error'}`, type: 'error' });
        } finally {
            setIsLoading(false);
            clearNotification();
        }
    };


    // --- Render JSX ---
    return (
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white">
                {isUsingRaydium ? '🔄 Raydium Trading' : '📉 Simulated Trading'}
            </h2>

            {/* Tab Navigation */}
            <div className="flex mb-4 bg-gray-800 rounded-lg p-1">
                <button
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'buy' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('buy')} >
                    Buy
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('sell')} >
                    Sell
                </button>
            </div>

            {/* Price Info */}
             <div className="mb-4 bg-gray-800 p-3 rounded-lg">
                 <div className="flex justify-between items-center">
                     <span className="text-gray-400 text-sm">Current Price:</span>
                     <span className="text-white font-semibold text-lg">
                          {currentPrice > 0 ? currentPrice.toFixed(Math.max(9, -Math.floor(Math.log10(currentPrice))+4)) : 'N/A'}
                          <span className="text-xs text-gray-500"> SOL / Token</span>
                     </span>
                 </div>
             </div>

            {/* Slippage Setting */}
            <div className="mb-4">
                <label htmlFor="slippage-input" className="block text-gray-400 text-sm mb-1">Slippage Tolerance (%)</label>
                <input
                    id="slippage-input" type="number" value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                    step="0.1" min="0.1" max="50" />
            </div>

            {/* Raydium Info Box - *** FIX: Use network prop *** */}
           {isUsingRaydium && (
                 <div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                    <div className="flex items-center">
                       <div className="text-blue-500 mr-2 text-lg">ⓘ</div>
                       <div className="text-blue-300 text-sm">
                         {/* Use the network prop here */}
                         <p>Using Raydium SDK for swaps on Solana {network}.</p>
                       </div>
                    </div>
                 </div>)}

            {/* Buy Form */}
            {activeTab === 'buy' && (
                // ... Buy form JSX ... (no changes needed inside structure)
                  <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="buy-amount-input" className="block text-gray-400 text-sm mb-1">SOL Amount to Spend</label>
                        <input id="buy-amount-input" type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter SOL amount" step="any" min="0" />
                         <p className="text-gray-500 text-xs mt-1">Available: {solBalance?.toFixed(6) ?? '0.00'}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Min. Tokens Received:</span>
                            <span className="text-white">
                                 {(expectedBuyOutput * (1 - slippage / 100)).toLocaleString(undefined, { maximumFractionDigits: tokenDecimals ?? 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Price Impact:</span>
                            <span className={`font-medium ${buyPriceImpact > 5 ? 'text-red-400' : buyPriceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                                 {buyPriceImpact.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <button onClick={handleBuy} disabled={isLoading || !buyAmount || parseFloat(buyAmount) <= 0 || !wallet?.publicKey}
                        className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${
                             isLoading || !wallet?.publicKey ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                             !buyAmount || parseFloat(buyAmount) <= 0
                                 ? 'bg-green-800 text-gray-500 cursor-not-allowed'
                                 : 'bg-green-600 hover:bg-green-700 text-white'
                         }`} >
                        {isLoading ? "Processing..." : "Buy Tokens"}
                    </button>
                </div>
            )}

            {/* Sell Form */}
            {activeTab === 'sell' && (
                 // ... Sell form JSX ... (no changes needed inside structure)
                 <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="sell-amount-input" className="block text-gray-400 text-sm mb-1">Token Amount to Sell</label>
                        <input id="sell-amount-input" type="number" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter token amount" step="any" min="0" />
                         <p className="text-gray-500 text-xs mt-1">
                             Available: {tokenBalance ? new Decimal(tokenBalance).div(10**tokenDecimals).toDP(tokenDecimals).toString() : '0'}
                         </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-gray-400">Min. SOL Received:</span>
                           <span className="text-white">
                                {(expectedSellOutput * (1 - slippage / 100)).toFixed(6)}
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-400">Price Impact:</span>
                           <span className={`font-medium ${sellPriceImpact > 5 ? 'text-red-400' : sellPriceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {sellPriceImpact.toFixed(2)}%
                           </span>
                        </div>
                    </div>
                    <button onClick={handleSell} disabled={isLoading || !sellAmount || parseFloat(sellAmount) <= 0 || !wallet?.publicKey}
                         className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${
                             isLoading || !wallet?.publicKey ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                             !sellAmount || parseFloat(sellAmount) <= 0
                                 ? 'bg-red-800 text-gray-500 cursor-not-allowed'
                                 : 'bg-red-600 hover:bg-red-700 text-white'
                         }`} >
                        {isLoading ? "Processing..." : "Sell Tokens"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default TradingInterface;