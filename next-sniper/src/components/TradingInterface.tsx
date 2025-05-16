// src/components/TradingInterface.tsx
// Added detailed logging
// Added selectedPool prop
// Corrected setNotification prop type
// ADDED isPoolSelected prop to interface

import React, { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js'; // Import types
import BN from 'bn.js'; // Import BN
import Decimal from 'decimal.js'; // Import Decimal
import { NATIVE_MINT } from '@solana/spl-token'; // Import NATIVE_MINT

import { getSimulatedPool, updateSimulatedPoolAfterTrade } from '@/utils/simulatedPoolStore';
import { isRaydiumPool, swapRaydiumTokens } from '@/utils/raydiumSdkAdapter';
import { DiscoveredPoolDetailed } from '@/utils/poolFinder';
import { NetworkType } from '@/context/NetworkContext';

// +++++ DEFINE NotificationType LOCALLY OR IMPORT FROM A SHARED FILE +++++
// For this fix, defining it locally to match app/page.tsx
type NotificationType = 'success' | 'error' | 'info' | '';

// Define an interface for the component's props
interface TradingInterfaceProps {
    wallet: any; // Use a more specific wallet type if available
    connection: Connection;
    tokenAddress: string;
    tokenDecimals: number;
    tokenBalance: string; // Raw balance as string
    solBalance: number;   // UI balance as number
    refreshBalances: () => Promise<void>;
    subtractBalances: (amounts: { tokenAmount: number | string | BN, solAmount: number }) => void;
    selectedPool: DiscoveredPoolDetailed | null;
    setNotification: React.Dispatch<React.SetStateAction<{ show: boolean; message: string; type: NotificationType; }>>; // +++++ CORRECTED type here +++++
    network: NetworkType;
    isPoolSelected: boolean; // +++++ ADDED THIS PROP +++++
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
    selectedPool,
    setNotification, // Destructured
    network,       // Destructured
    isPoolSelected, // Destructured
}: TradingInterfaceProps) {
    const [buyAmount, setBuyAmount] = useState<string>('');
    const [sellAmount, setSellAmount] = useState<string>('');
    const [expectedBuyOutput, setExpectedBuyOutput] = useState<number>(0);
    const [expectedSellOutput, setExpectedSellOutput] = useState<number>(0);
    const [buyPriceImpact, setBuyPriceImpact] = useState<number>(0);
    const [sellPriceImpact, setSellPriceImpact] = useState<number>(0);
    const [slippage, setSlippage] = useState<number>(1); // Percentage
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    // const [isUsingRaydium, setIsUsingRaydium] = useState<boolean>(true); // Not explicitly used for switching in this version

    // Get current pool data and price
    const updatePoolData = () => {
        if (selectedPool && selectedPool.price) {
            const price = typeof selectedPool.price === 'string' ? parseFloat(selectedPool.price) : selectedPool.price;
            setCurrentPrice(price);
            // For k-based calculations, try to get reserves if available
            const baseReserveRaw = (selectedPool.rawSdkPoolInfo as any)?.baseReserve?.toString();
            const quoteReserveRaw = (selectedPool.rawSdkPoolInfo as any)?.quoteReserve?.toString();
            const solAmount = baseReserveRaw ? parseFloat(new Decimal(baseReserveRaw).div(1e9).toString()) : 1;
            const tokenAmount = quoteReserveRaw && tokenDecimals !== undefined ? parseFloat(new Decimal(quoteReserveRaw).div(10**tokenDecimals).toString()) : (price > 0 ? 1/price : 1) ;

            return { price, solAmount, tokenAmount };
        }

        const pool = getSimulatedPool(); // Fallback to simulated pool if no selected pool or no price
        if (!pool || pool.price === undefined || pool.price === null) {
            setCurrentPrice(0);
            return null;
        }
        setCurrentPrice(pool.price);
        return pool;
    };

    // Update calculations whenever input values or pool change
    useEffect(() => {
        const poolToUse = updatePoolData();
        
        if (!poolToUse || poolToUse.price <= 0) {
             setExpectedBuyOutput(0); setBuyPriceImpact(0);
             setExpectedSellOutput(0); setSellPriceImpact(0);
            return;
        };

        const buyAmountFloat = parseFloat(buyAmount);
        if (!isNaN(buyAmountFloat) && buyAmountFloat > 0) {
            const inputSOL = buyAmountFloat;
            if (poolToUse.solAmount > 0 && poolToUse.tokenAmount > 0 && poolToUse.solAmount !== 1 && poolToUse.tokenAmount !== (poolToUse.price > 0 ? 1/poolToUse.price : 1) ) { // Check if amounts are not placeholders
                const k = new Decimal(poolToUse.solAmount).mul(poolToUse.tokenAmount);
                const newSolReserve = new Decimal(poolToUse.solAmount).plus(inputSOL);
                const newTokenReserve = k.div(newSolReserve);
                const estimatedOutputTokens = new Decimal(poolToUse.tokenAmount).minus(newTokenReserve).toNumber();
                
                if (estimatedOutputTokens > 0) {
                    const effectivePrice = new Decimal(inputSOL).div(estimatedOutputTokens); // SOL per Token
                    const impactRatio = effectivePrice.minus(poolToUse.price).abs().div(poolToUse.price);
                    setExpectedBuyOutput(estimatedOutputTokens);
                    setBuyPriceImpact(isFinite(impactRatio.toNumber()) ? impactRatio.mul(100).toNumber() : 0);
                } else {
                    setExpectedBuyOutput(0); setBuyPriceImpact(100); // Or some large number / error indicator
                }
            } else { 
                setExpectedBuyOutput(inputSOL / poolToUse.price);
                setBuyPriceImpact(0); 
            }
        } else {
            setExpectedBuyOutput(0); setBuyPriceImpact(0);
        }

        const sellAmountFloat = parseFloat(sellAmount);
         if (!isNaN(sellAmountFloat) && sellAmountFloat > 0) {
            const inputTokens = sellAmountFloat;
             if (poolToUse.solAmount > 0 && poolToUse.tokenAmount > 0 && poolToUse.solAmount !== 1 && poolToUse.tokenAmount !== (poolToUse.price > 0 ? 1/poolToUse.price : 1) ) {
                 const k = new Decimal(poolToUse.solAmount).mul(poolToUse.tokenAmount);
                 const newTokenReserve = new Decimal(poolToUse.tokenAmount).plus(inputTokens);
                 const newSolReserve = k.div(newTokenReserve);
                 const estimatedOutputSOL = new Decimal(poolToUse.solAmount).minus(newSolReserve).toNumber();

                if (estimatedOutputSOL > 0) {
                    const effectivePrice = new Decimal(estimatedOutputSOL).div(inputTokens); // SOL per Token
                    const impactRatio = new Decimal(poolToUse.price).minus(effectivePrice).abs().div(poolToUse.price);
                    setExpectedSellOutput(estimatedOutputSOL);
                    setSellPriceImpact(isFinite(impactRatio.toNumber()) ? impactRatio.mul(100).toNumber() : 0);
                } else {
                    setExpectedSellOutput(0); setSellPriceImpact(100);
                }
             } else { 
                 setExpectedSellOutput(inputTokens * poolToUse.price);
                 setSellPriceImpact(0);
             }
        } else {
            setExpectedSellOutput(0); setSellPriceImpact(0);
        }

    }, [buyAmount, sellAmount, currentPrice, selectedPool, tokenDecimals]);


     useEffect(() => {
        updatePoolData(); 
        const interval = setInterval(updatePoolData, 5000); 
        return () => clearInterval(interval);
     }, [selectedPool, tokenDecimals]); // Add tokenDecimals as it's used in updatePoolData logic


    const handleBuy = async () => {
        console.log("[handleBuy] Initiated on network:", network);
        console.log("[handleBuy] Current State:", { buyAmount, solBalance, tokenAddress, tokenDecimals, slippage, selectedPoolId: selectedPool?.id });
        console.log("[handleBuy] Wallet Prop PK:", wallet?.publicKey?.toString());

        const buyAmountSOLFloat = parseFloat(buyAmount);

        if (isNaN(buyAmountSOLFloat) || buyAmountSOLFloat <= 0) {
            setErrorMessage("Please enter a valid SOL amount to buy");
            return;
        }
        if (buyAmountSOLFloat > solBalance) {
            setErrorMessage("Not enough SOL balance");
            return;
        }
        if (!selectedPool || !selectedPool.id) {
            setErrorMessage("No pool selected for trading.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const poolIdToUse = selectedPool.id;
            const inputMint = NATIVE_MINT.toBase58();
            
            console.log(`[handleBuy] Using selected pool ID: ${poolIdToUse} for SOL -> Token swap.`);
            
            const solLamportsIn = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
            const slippageDecimal = slippage / 100;

            console.log("[handleBuy] Calling swapRaydiumTokens with:", { /* ... */ });
            
            const txSignature = await swapRaydiumTokens(
                wallet, connection, poolIdToUse, inputMint, solLamportsIn, slippageDecimal
            );
            
            setNotification({ show: true, message: `Buy successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
            console.log("[handleBuy] Raydium Buy swap successful, Tx:", txSignature);
            
            await refreshBalances();
            setBuyAmount('');
            setExpectedBuyOutput(0);
            console.log("[handleBuy] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleBuy Error on ${network}:`, error);
            setErrorMessage(`Buy Error: ${error.message || 'Unknown error'}`);
            setNotification({ show: true, message: `Buy Failed: ${error.message?.substring(0,100)}...`, type: 'error' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => (prev.message.includes("Buy successful") || prev.message.includes("Buy Failed")) ? {show: false, message: '', type: ''} : prev), 4000);
        }
    };

    const handleSell = async () => {
        console.log("[handleSell] Initiated on network:", network);
        console.log("[handleSell] Current State:", { sellAmount, tokenBalance, tokenAddress, tokenDecimals, slippage, selectedPoolId: selectedPool?.id });
        console.log("[handleSell] Wallet Prop PK:", wallet?.publicKey?.toString());
        
        const sellAmountTokensFloat = parseFloat(sellAmount);

        if (isNaN(sellAmountTokensFloat) || sellAmountTokensFloat <= 0) {
            setErrorMessage("Please enter a valid token amount to sell"); return;
        }

        const rawTokenBalanceBN = new BN(tokenBalance);
        const rawTokensToSell = new BN(new Decimal(sellAmountTokensFloat).mul(10 ** tokenDecimals).toFixed(0));

        if (rawTokensToSell.gt(rawTokenBalanceBN)) {
             setErrorMessage(`Not enough token balance.`); return;
        }
        if (!selectedPool || !selectedPool.id) {
            setErrorMessage("No pool selected for trading."); return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const poolIdToUse = selectedPool.id;
            const inputMint = tokenAddress; 
            
            console.log(`[handleSell] Using selected pool ID: ${poolIdToUse} for Token -> SOL swap.`);
            const slippageDecimal = slippage / 100;
            console.log("[handleSell] Calling swapRaydiumTokens with:", { /* ... */ });
            
            const txSignature = await swapRaydiumTokens(
                wallet, connection, poolIdToUse, inputMint, rawTokensToSell, slippageDecimal
            );

            setNotification({ show: true, message: `Sell successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
            console.log("[handleSell] Raydium Sell swap successful, Tx:", txSignature);
            
            await refreshBalances();
            setSellAmount('');
            setExpectedSellOutput(0);
            console.log("[handleSell] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleSell Error on ${network}:`, error);
            setErrorMessage(`Sell Error: ${error.message || 'Unknown error'}`);
            setNotification({ show: true, message: `Sell Failed: ${error.message?.substring(0,100)}...`, type: 'error' });
        } finally {
            setIsLoading(false);
             setTimeout(() => setNotification(prev => (prev.message.includes("Sell successful") || prev.message.includes("Sell Failed")) ? {show: false, message: '', type: ''} : prev), 4000);
        }
    };

    let priceToDisplay = currentPrice;
    if (selectedPool?.price) {
        const selectedPriceNum = typeof selectedPool.price === 'string' ? parseFloat(selectedPool.price) : selectedPool.price;
        if (selectedPriceNum > 0) priceToDisplay = selectedPriceNum;
    }
    const displayPriceString = priceToDisplay > 0 
        ? priceToDisplay.toFixed(Math.max(9, -Math.floor(Math.log10(priceToDisplay))+4)) 
        : 'N/A';


    return (
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white">Raydium Trading</h2>

            <div className="flex mb-4 bg-gray-800 rounded-lg p-1">
                <button
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'buy' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('buy')}
                >Buy Token</button>
                <button
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('sell')}
                >Sell Token</button>
            </div>

            {errorMessage && ( <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">{errorMessage}</div> )}

             <div className="mb-4 bg-gray-800 p-3 rounded-lg">
                 <div className="flex justify-between items-center">
                     <span className="text-gray-400 text-sm">{selectedPool ? `Pool (${selectedPool.id.substring(0,6)}...) Price:` : "Price (No Pool):"}</span>
                     <span className="text-white font-semibold text-lg">{displayPriceString} <span className="text-xs text-gray-500"> SOL/Token</span></span>
                 </div>
             </div>

            <div className="mb-4">
                <label htmlFor="slippage-input" className="block text-gray-400 text-sm mb-1">Slippage Tolerance (%)</label>
                <input id="slippage-input" type="number" value={slippage} onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none" step="0.1" min="0.1" max="50"/>
            </div>

            {selectedPool && ( <div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg"> <div className="flex"> <div className="text-blue-500 mr-2 text-lg">ⓘ</div> <div className="text-blue-300 text-sm"><p>Trading against selected Raydium pool <span className="font-mono text-xs">{selectedPool.id.substring(0,6)}...</span> on {network}.</p></div> </div> </div>)}
            {!selectedPool && ( <div className="p-3 mb-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg"> <div className="flex"> <div className="text-yellow-500 mr-2 text-lg">⚠️</div> <div className="text-yellow-300 text-sm"><p>No pool selected. Please select a pool from the list to enable trading.</p></div> </div> </div> )}

            {activeTab === 'buy' && (
                <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="buy-amount-input" className="block text-gray-400 text-sm mb-1">SOL Amount to Spend</label>
                        <input id="buy-amount-input" type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none" placeholder="Enter SOL amount" step="any" min="0"/>
                        <p className="text-gray-500 text-xs mt-1">Available: {solBalance?.toFixed(6) ?? '0.00'}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Min. Tokens Received:</span><span className="text-white">{(expectedBuyOutput * (1 - slippage / 100)).toLocaleString(undefined, { maximumFractionDigits: tokenDecimals ?? 2 })}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Price Impact:</span><span className={`font-medium ${buyPriceImpact > 5 ? 'text-red-400' : buyPriceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>{buyPriceImpact.toFixed(2)}%</span></div>
                    </div>
                    <button onClick={handleBuy} disabled={isLoading || !buyAmount || parseFloat(buyAmount) <= 0 || !wallet?.publicKey || !selectedPool} className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${isLoading || !wallet?.publicKey || !selectedPool ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : !buyAmount || parseFloat(buyAmount) <= 0 ? 'bg-green-800 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>{isLoading ? "Processing..." : "Buy Token"}</button>
                </div>
            )}

            {activeTab === 'sell' && (
                <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="sell-amount-input" className="block text-gray-400 text-sm mb-1">Token Amount to Sell</label>
                        <input id="sell-amount-input" type="number" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none" placeholder="Enter token amount" step="any" min="0"/>
                        <p className="text-gray-500 text-xs mt-1">Available: {tokenBalance && tokenDecimals !== undefined ? new Decimal(tokenBalance).div(10**tokenDecimals).toDP(tokenDecimals).toString() : '0'}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Min. SOL Received:</span><span className="text-white">{(expectedSellOutput * (1 - slippage / 100)).toFixed(6)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Price Impact:</span><span className={`font-medium ${sellPriceImpact > 5 ? 'text-red-400' : sellPriceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>{sellPriceImpact.toFixed(2)}%</span></div>
                    </div>
                    <button onClick={handleSell} disabled={isLoading || !sellAmount || parseFloat(sellAmount) <= 0 || !wallet?.publicKey || !selectedPool} className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${isLoading || !wallet?.publicKey || !selectedPool ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : !sellAmount || parseFloat(sellAmount) <= 0 ? 'bg-red-800 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}>{isLoading ? "Processing..." : "Sell Token"}</button>
                </div>
            )}
        </div>
    );
}

export default TradingInterface;