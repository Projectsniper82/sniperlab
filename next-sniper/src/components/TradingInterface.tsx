// src/components/TradingInterface.tsx
// Added detailed logging

import React, { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js'; // Import types
import BN from 'bn.js'; // Import BN
import Decimal from 'decimal.js'; // Import Decimal
import { NATIVE_MINT } from '@solana/spl-token'; // Import NATIVE_MINT

import { getSimulatedPool, updateSimulatedPoolAfterTrade } from '@/utils/simulatedPoolStore';
import { isRaydiumPool, swapRaydiumTokens } from '@/utils/raydiumSdkAdapter'; // Assuming isRaydiumPool comes from adapter now

// Define an interface for the component's props
interface TradingInterfaceProps {
    wallet: any; // Use a more specific wallet type if available
    connection: Connection;
    tokenAddress: string;
    tokenDecimals: number;
    tokenBalance: string; // Raw balance as string
    solBalance: number;   // UI balance as number
    refreshBalances: () => Promise<void>; // Add refreshBalances
    subtractBalances: (amounts: { tokenAmount: number | string | BN, solAmount: number }) => void; // Keep original signature for now
}

// Configure Decimal.js
Decimal.set({ precision: 50 });

// Use the Props interface
function TradingInterface({
    wallet,
    connection,
    tokenAddress,
    tokenDecimals,
    tokenBalance, // Raw balance string
    solBalance,   // UI balance number
    refreshBalances, // Destructure refreshBalances
    subtractBalances // Not used currently but keep prop
}: TradingInterfaceProps) {
    const [buyAmount, setBuyAmount] = useState<string>(''); // UI SOL amount (string for input)
    const [sellAmount, setSellAmount] = useState<string>(''); // UI Token amount (string for input)
    const [expectedBuyOutput, setExpectedBuyOutput] = useState<number>(0); // Expected UI Token output
    const [expectedSellOutput, setExpectedSellOutput] = useState<number>(0); // Expected UI SOL output
    const [buyPriceImpact, setBuyPriceImpact] = useState<number>(0);
    const [sellPriceImpact, setSellPriceImpact] = useState<number>(0);
    const [slippage, setSlippage] = useState<number>(1); // Percentage
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isUsingRaydium, setIsUsingRaydium] = useState<boolean>(true); // Default to using Raydium

    // Get current pool data and price
    const updatePoolData = () => {
        const pool = getSimulatedPool();
        if (!pool || pool.price === undefined || pool.price === null) {
            setCurrentPrice(0);
            return null;
        }
        setCurrentPrice(pool.price);
        return pool;
    };

    // Update calculations whenever input values or pool change
    useEffect(() => {
        const pool = updatePoolData();
        if (!pool || pool.price <= 0 || pool.solAmount <= 0 || pool.tokenAmount <= 0) {
             setExpectedBuyOutput(0);
             setBuyPriceImpact(0);
             setExpectedSellOutput(0);
             setSellPriceImpact(0);
            return;
        };

        const buyAmountFloat = parseFloat(buyAmount);
        if (!isNaN(buyAmountFloat) && buyAmountFloat > 0) {
            const inputSOL = buyAmountFloat;
            const k = pool.solAmount * pool.tokenAmount;
            const newSolReserve = pool.solAmount + inputSOL;
            const newTokenReserve = k / newSolReserve;
            const estimatedOutputTokens = pool.tokenAmount - newTokenReserve;
            const effectivePrice = inputSOL / estimatedOutputTokens;
            const impactRatio = Math.abs(effectivePrice - pool.price) / pool.price;
            setExpectedBuyOutput(estimatedOutputTokens);
            setBuyPriceImpact(impactRatio * 100);
        } else {
            setExpectedBuyOutput(0);
            setBuyPriceImpact(0);
        }

        const sellAmountFloat = parseFloat(sellAmount);
         if (!isNaN(sellAmountFloat) && sellAmountFloat > 0) {
            const inputTokens = sellAmountFloat;
            const k = pool.solAmount * pool.tokenAmount;
            const newTokenReserve = pool.tokenAmount + inputTokens;
            const newSolReserve = k / newTokenReserve;
            const estimatedOutputSOL = pool.solAmount - newSolReserve;
            const effectivePrice = estimatedOutputSOL / inputTokens;
            const impactRatio = Math.abs(pool.price - effectivePrice) / pool.price;
            setExpectedSellOutput(estimatedOutputSOL);
            setSellPriceImpact(impactRatio * 100);
        } else {
            setExpectedSellOutput(0);
            setSellPriceImpact(0);
        }

    }, [buyAmount, sellAmount, currentPrice]);


     // Effect to update price display periodically or when pool updates elsewhere
     useEffect(() => {
        updatePoolData(); // Initial update
        const interval = setInterval(updatePoolData, 10000);
        return () => clearInterval(interval);
     }, []);


    // --- Execute Buy Transaction ---
    const handleBuy = async () => {
        // --- ** ADD LOG ** ---
        console.log("[handleBuy] Initiated.");
        console.log("[handleBuy] Current State:", { buyAmount, solBalance, tokenAddress, tokenDecimals, slippage });
        console.log("[handleBuy] Wallet Prop:", wallet);
        console.log("[handleBuy] Wallet Prop PK:", wallet?.publicKey?.toString());
        // --- ** END LOG ** ---

        const buyAmountSOLFloat = parseFloat(buyAmount);

        if (isNaN(buyAmountSOLFloat) || buyAmountSOLFloat <= 0) {
            setErrorMessage("Please enter a valid SOL amount to buy");
            return;
        }
        if (buyAmountSOLFloat > solBalance) {
            setErrorMessage("Not enough SOL balance");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const pool = getSimulatedPool();
            // --- ** ADD LOG ** ---
            console.log("[handleBuy] Fetched pool state:", pool);
            // --- ** END LOG ** ---

            if (!pool?.raydiumPoolId || !pool.tokenAddress || pool.tokenDecimals === undefined) {
                 console.error("[handleBuy] Error: Missing pool ID, token address, or decimals in stored pool state.");
                throw new Error("Active pool data or Pool ID is missing.");
            }
             if (pool.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) {
                 console.error("[handleBuy] Error: Token address mismatch.", { poolToken: pool.tokenAddress, currentToken: tokenAddress });
                 throw new Error("Loaded token does not match the active pool token.");
             }

            const solLamportsIn = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
            const inputMint = NATIVE_MINT.toBase58();
            const slippageDecimal = slippage / 100; // Convert percentage to decimal

            // --- ** ADD LOG ** ---
            console.log("[handleBuy] Calculated Params:", {
                poolId: pool.raydiumPoolId,
                inputMint: inputMint,
                amountInBN_str: solLamportsIn.toString(),
                slippageDecimal: slippageDecimal
            });
            console.log("[handleBuy] Calling swapRaydiumTokens with:", {
                 wallet: wallet ? 'Wallet Object Present' : 'Wallet Missing!',
                 connection: connection ? 'Connection Present' : 'Connection Missing!',
                 poolIdString: pool.raydiumPoolId,
                 inputMintAddress: inputMint,
                 amountInBN: solLamportsIn.toString(), // Log BN as string
                 slippage: slippageDecimal
            });
            // --- ** END LOG ** ---


            let txSignature: string | null = null;

            if (isUsingRaydium && isRaydiumPool(pool)) {
                console.log("[RAYDIUM] Performing buy swap (SOL->Token) via SDK Adapter...");
                txSignature = await swapRaydiumTokens(
                    wallet,
                    connection,
                    pool.raydiumPoolId,
                    inputMint,
                    solLamportsIn,
                    slippageDecimal // Pass decimal slippage
                );
                console.log("[RAYDIUM] Buy swap successful, Tx:", txSignature);
            } else {
                console.log("[SIMULATION] Performing simulated buy swap");
                updateSimulatedPoolAfterTrade(-expectedBuyOutput, buyAmountSOLFloat);
                txSignature = `simulated_buy_${Date.now()}`;
            }

            console.log("[handleBuy] Swap function finished. Refreshing balances...");
            await refreshBalances();
            setBuyAmount('');
            setExpectedBuyOutput(0);
            console.log("[handleBuy] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleBuy Error:`, error); // Log the error object itself
            setErrorMessage(`Buy Error: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };


    // --- Execute Sell Transaction ---
    const handleSell = async () => {
        // --- ** ADD LOG ** ---
        console.log("[handleSell] Initiated.");
        console.log("[handleSell] Current State:", { sellAmount, tokenBalance, tokenAddress, tokenDecimals, slippage });
        console.log("[handleSell] Wallet Prop:", wallet);
        console.log("[handleSell] Wallet Prop PK:", wallet?.publicKey?.toString());
        // --- ** END LOG ** ---

        const sellAmountTokensFloat = parseFloat(sellAmount);

        if (isNaN(sellAmountTokensFloat) || sellAmountTokensFloat <= 0) {
            setErrorMessage("Please enter a valid token amount to sell");
            return;
        }

        const rawTokenBalanceBN = new BN(tokenBalance);
        const rawTokensToSell = new BN(new Decimal(sellAmountTokensFloat).mul(10 ** tokenDecimals).toFixed(0));

        if (rawTokensToSell.gt(rawTokenBalanceBN)) {
             setErrorMessage(`Not enough token balance. Have: ${new Decimal(tokenBalance).div(10**tokenDecimals).toString()}, Trying to sell: ${sellAmountTokensFloat}`);
             return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const pool = getSimulatedPool();
            // --- ** ADD LOG ** ---
            console.log("[handleSell] Fetched pool state:", pool);
            // --- ** END LOG ** ---

            if (!pool?.raydiumPoolId || !pool.tokenAddress || pool.tokenDecimals === undefined) {
                 console.error("[handleSell] Error: Missing pool ID, token address, or decimals in stored pool state.");
                 throw new Error("Active pool data or Pool ID is missing.");
            }
             if (pool.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) {
                 console.error("[handleSell] Error: Token address mismatch.", { poolToken: pool.tokenAddress, currentToken: tokenAddress });
                 throw new Error("Loaded token does not match the active pool token.");
             }

            const inputMint = tokenAddress; // Selling the token
            const slippageDecimal = slippage / 100; // Convert percentage to decimal

            // --- ** ADD LOG ** ---
             console.log("[handleSell] Calculated Params:", {
                poolId: pool.raydiumPoolId,
                inputMint: inputMint,
                amountInBN_str: rawTokensToSell.toString(),
                slippageDecimal: slippageDecimal
            });
             console.log("[handleSell] Calling swapRaydiumTokens with:", {
                 wallet: wallet ? 'Wallet Object Present' : 'Wallet Missing!',
                 connection: connection ? 'Connection Present' : 'Connection Missing!',
                 poolIdString: pool.raydiumPoolId,
                 inputMintAddress: inputMint,
                 amountInBN: rawTokensToSell.toString(), // Log BN as string
                 slippage: slippageDecimal
            });
            // --- ** END LOG ** ---


             let txSignature: string | null = null;

            if (isUsingRaydium && isRaydiumPool(pool)) {
                console.log("[RAYDIUM] Performing sell swap (Token->SOL) via SDK Adapter...");
                txSignature = await swapRaydiumTokens(
                    wallet,
                    connection,
                    pool.raydiumPoolId,
                    inputMint,          // Token is input
                    rawTokensToSell,    // Amount as BN
                    slippageDecimal     // Slippage as decimal
                );
                console.log("[RAYDIUM] Sell swap successful, Tx:", txSignature);
            } else {
                console.log("[SIMULATION] Performing simulated sell swap");
                updateSimulatedPoolAfterTrade(sellAmountTokensFloat, -expectedSellOutput);
                txSignature = `simulated_sell_${Date.now()}`;
            }

            console.log("[handleSell] Swap function finished. Refreshing balances...");
            await refreshBalances();
            setSellAmount('');
            setExpectedSellOutput(0);
            console.log("[handleSell] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleSell Error:`, error); // Log the error object itself
            setErrorMessage(`Sell Error: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };


    // --- Render JSX (Unchanged) ---
    return (
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white">
                {isUsingRaydium ? '🔄 Raydium Trading' : '📉 Simulated Trading'}
            </h2>

            {/* Tab Navigation */}
            <div className="flex mb-4 bg-gray-800 rounded-lg p-1">
                <button
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'buy' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('buy')}
                >
                    Buy
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('sell')}
                >
                    Sell
                </button>
            </div>

            {/* Error message */}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">
                    {errorMessage}
                </div>
            )}

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
                    id="slippage-input"
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                    step="0.1"
                    min="0.1"
                    max="50"
                />
            </div>

             {/* Raydium Info Box */}
            {isUsingRaydium && (
                 <div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                     <div className="flex">
                       <div className="text-blue-500 mr-2 text-lg">ⓘ</div>
                       <div className="text-blue-300 text-sm">
                         <p>Using Raydium SDK for real on-chain swaps on Solana Devnet.</p>
                       </div>
                     </div>
                   </div>
            )}

            {/* Buy Form */}
            {activeTab === 'buy' && (
                <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="buy-amount-input" className="block text-gray-400 text-sm mb-1">SOL Amount to Spend</label>
                        <input
                            id="buy-amount-input"
                            type="number"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter SOL amount"
                            step="any"
                            min="0"
                        />
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

                    <button
                        onClick={handleBuy}
                        disabled={isLoading || !buyAmount || parseFloat(buyAmount) <= 0 || !wallet?.publicKey}
                        className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${
                             isLoading || !wallet?.publicKey ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                             !buyAmount || parseFloat(buyAmount) <= 0
                                 ? 'bg-green-800 text-gray-500 cursor-not-allowed'
                                 : 'bg-green-600 hover:bg-green-700 text-white'
                         }`}
                    >
                        {isLoading ? "Processing..." : "Buy Tokens"}
                    </button>
                </div>
            )}

            {/* Sell Form */}
            {activeTab === 'sell' && (
                <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="sell-amount-input" className="block text-gray-400 text-sm mb-1">Token Amount to Sell</label>
                        <input
                            id="sell-amount-input"
                            type="number"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter token amount"
                            step="any"
                            min="0"
                        />
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

                    <button
                        onClick={handleSell}
                        disabled={isLoading || !sellAmount || parseFloat(sellAmount) <= 0 || !wallet?.publicKey}
                         className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${
                              isLoading || !wallet?.publicKey ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                              !sellAmount || parseFloat(sellAmount) <= 0
                                  ? 'bg-red-800 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                    >
                        {isLoading ? "Processing..." : "Sell Tokens"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default TradingInterface;

