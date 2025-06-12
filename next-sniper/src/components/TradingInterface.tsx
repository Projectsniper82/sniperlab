// src/components/TradingInterface.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';
// REMOVE or COMMENT OUT this old import and call:
// import { initRaydiumSdk } from '@/utils/initRaydiumSdk';
// await initRaydiumSdk(); // ensure it’s ready  <--- REMOVE THIS LINE

// You will use initRaydiumSdkForUser inside mainnetBuyUtil.ts as we set it up.
// TradingInterface itself doesn't need to call initRaydiumSdkForUser directly
// if mainnetBuyUtil.ts handles SDK initialization internally with the passed connection and wallet.

import { getSimulatedPool, updateSimulatedPoolAfterTrade } from '@/utils/simulatedPoolStore';
import { isRaydiumPool, swapRaydiumTokens } from '@/utils/raydiumSdkAdapter'; // Ensure this adapter is correctly set up
import { DiscoveredPoolDetailed } from '@/utils/poolFinder';
import { NetworkType, useNetwork } from '@/context/NetworkContext'; // Assuming useNetwork is correctly imported
import { executeJupiterSwap } from '@/utils/jupiterSwapUtil';
import { getOptimalPriorityFee } from '@/utils/priorityFee';
// ... rest of your TradingInterfaceProps and component

type NotificationType = 'success' | 'error' | 'info' | '';

interface TradingInterfaceProps {
    wallet: any;
    connection: Connection;
    tokenAddress: string;
    tokenDecimals: number;
    tokenBalance: string;
    solBalance: number;
    refreshBalances: () => Promise<void>;
    subtractBalances: (amounts: { tokenAmount: number | string | BN, solAmount: number }) => void;
    selectedPool: DiscoveredPoolDetailed | null;
    setNotification: React.Dispatch<React.SetStateAction<{ show: boolean; message: string; type: NotificationType; }>>;
    network: NetworkType;
    isPoolSelected: boolean;
    // New props for Jupiter
    priceInSol: number | null;
    isPriceLoading: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

}

Decimal.set({ precision: 50 });

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
    setNotification,
    network,
    isPoolSelected,
    priceInSol,
    isPriceLoading,
    isLoading,
    setIsLoading,
}: TradingInterfaceProps) {
    useEffect(() => {
        console.log("[TradingInterface][PROP isLoading] CHANGED TO:", isLoading);
        console.log("[DEBUG][TradingInterface] wallet:", wallet);
        console.log("[DEBUG][TradingInterface] selectedPool:", selectedPool);
        console.log("[DEBUG][TradingInterface] isPoolSelected:", isPoolSelected);
    }, [isLoading]);
    const [buyAmount, setBuyAmount] = useState<string>('');
    const [sellAmount, setSellAmount] = useState<string>('');
    const [expectedBuyOutput, setExpectedBuyOutput] = useState<number>(0);
    const [expectedSellOutput, setExpectedSellOutput] = useState<number>(0);
    const [buyPriceImpact, setBuyPriceImpact] = useState<number>(0);
    const [sellPriceImpact, setSellPriceImpact] = useState<number>(0);
    const [slippage, setSlippage] = useState<number>(1);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [jupiterQuote, setJupiterQuote] = useState<any>(null);
    const poolDataForCalculations = useMemo(() => {
        console.log('[MEMO_DEBUG] Recomputing poolDataForCalculations. SelectedPool ID:', selectedPool?.id, 'Price:', selectedPool?.price);
        if (selectedPool && typeof selectedPool.price === 'number' && !isNaN(selectedPool.price)) {
            const price = selectedPool.price;

            const rawInfo = selectedPool.rawSdkPoolInfo as any;
            // const currentTokenMintAddressFromProp = tokenAddress; // Not strictly needed here if we use mintA/B info from pool

            let uiSolAmountInPool: number = 0;
            let uiTokenAmountInPool: number = 0;

            const mintA_PoolInfo = rawInfo?.mintA;
            const mintB_PoolInfo = rawInfo?.mintB;

            console.log('[MEMO_DEBUG] Pool Mint A Addr:', mintA_PoolInfo?.address, 'Pool Mint A Decimals:', mintA_PoolInfo?.decimals);
            console.log('[MEMO_DEBUG] Pool Mint B Addr:', mintB_PoolInfo?.address, 'Pool Mint B Decimals:', mintB_PoolInfo?.decimals);

            const nativeMintAddrStr = NATIVE_MINT.toBase58(); // Cache for comparison

            if (typeof rawInfo?.mintAmountA === 'number' && typeof rawInfo?.mintAmountB === 'number') {
                console.log('[MEMO_DEBUG] Detected Mainnet-like SDK structure (mintAmountA/B are UI numbers).');
                if (mintA_PoolInfo?.address?.toString() === nativeMintAddrStr) {
                    uiSolAmountInPool = rawInfo.mintAmountA;
                    uiTokenAmountInPool = rawInfo.mintAmountB;
                } else if (mintB_PoolInfo?.address?.toString() === nativeMintAddrStr) {
                    uiSolAmountInPool = rawInfo.mintAmountB;
                    uiTokenAmountInPool = rawInfo.mintAmountA;
                } else {
                    uiSolAmountInPool = rawInfo.mintAmountA;
                    uiTokenAmountInPool = rawInfo.mintAmountB;
                    console.warn('[MEMO_DEBUG] Mainnet-like structure, but neither mintA nor mintB is NATIVE_MINT. Assuming A=base, B=quote for UI amounts.');
                }
            } else if (rawInfo?.baseReserve && rawInfo?.quoteReserve) {
                console.log('[MEMO_DEBUG] Detected Devnet/Simulated structure (baseReserve/quoteReserve are raw).');
                const rawBaseReserveStr = String(rawInfo.baseReserve);
                const rawQuoteReserveStr = String(rawInfo.quoteReserve);
                const decimalsForPoolMintA = mintA_PoolInfo?.decimals;
                const decimalsForPoolMintB = mintB_PoolInfo?.decimals;

                if (typeof decimalsForPoolMintA === 'number' && typeof decimalsForPoolMintB === 'number') {
                    const mintAAddrStr = mintA_PoolInfo?.address?.toString(); // Ensure string for comparison
                    const mintBAddrStr = mintB_PoolInfo?.address?.toString(); // Ensure string for comparison

                    if (mintAAddrStr === nativeMintAddrStr) {
                        uiSolAmountInPool = parseFloat(new Decimal(rawBaseReserveStr).div(new Decimal(10).pow(decimalsForPoolMintA)).toString());
                        uiTokenAmountInPool = parseFloat(new Decimal(rawQuoteReserveStr).div(new Decimal(10).pow(decimalsForPoolMintB)).toString());
                        console.log(`[MEMO_DEBUG] Devnet path: SOL is MintA. Decimals used for SOL: ${decimalsForPoolMintA}, for Token: ${decimalsForPoolMintB}`);
                    } else if (mintBAddrStr === nativeMintAddrStr) {
                        uiSolAmountInPool = parseFloat(new Decimal(rawQuoteReserveStr).div(new Decimal(10).pow(decimalsForPoolMintB)).toString());
                        uiTokenAmountInPool = parseFloat(new Decimal(rawBaseReserveStr).div(new Decimal(10).pow(decimalsForPoolMintA)).toString());
                        console.log(`[MEMO_DEBUG] Devnet path: SOL is MintB. Decimals used for SOL: ${decimalsForPoolMintB}, for Token: ${decimalsForPoolMintA}`);
                    } else {
                        console.error('[MEMO_DEBUG] Devnet structure, but after converting to string, Neither mintA nor mintB is NATIVE_MINT. This is unexpected if a SOL pair. Defaulting A=base, B=quote.');
                        uiSolAmountInPool = parseFloat(new Decimal(rawBaseReserveStr).div(new Decimal(10).pow(decimalsForPoolMintA)).toString());
                        uiTokenAmountInPool = parseFloat(new Decimal(rawQuoteReserveStr).div(new Decimal(10).pow(decimalsForPoolMintB)).toString());
                    }
                } else {
                    console.error('[MEMO_DEBUG] Devnet: Decimals for mintA or mintB are missing in rawSdkPoolInfo.');
                }
            } else {
                console.warn('[MEMO_DEBUG] No recognized reserve structure found. Using price-based fallbacks or 0.');
                uiSolAmountInPool = (price > 0) ? 1 : 0;
                uiTokenAmountInPool = (price > 0) ? 1 / price : 0;
                if (price <= 0) { uiSolAmountInPool = 0; uiTokenAmountInPool = 0; }
            }
            console.log('[MEMO_DEBUG] Final UI solAmount for pool:', uiSolAmountInPool, 'Final UI tokenAmount for pool:', uiTokenAmountInPool);
            return { price, solAmount: uiSolAmountInPool, tokenAmount: uiTokenAmountInPool };
        }

        console.log('[MEMO_DEBUG] Conditions not met for main logic or fallback to simulated pool needed.');
        const pool = getSimulatedPool();
        if (!pool || typeof pool.price !== 'number' || isNaN(pool.price)) {
            console.log('[MEMO_DEBUG] Simulated pool not found or price invalid, returning default invalid.');
            return { price: 0, solAmount: 0, tokenAmount: 0 };
        }
        console.log('[MEMO_DEBUG] Using simulated pool:', pool);
        return { price: pool.price, solAmount: pool.solAmount, tokenAmount: pool.tokenAmount };
    }, [selectedPool, tokenAddress, tokenDecimals]);

    useEffect(() => {
        if (poolDataForCalculations && typeof poolDataForCalculations.price === 'number') {
            setCurrentPrice(poolDataForCalculations.price);
        } else {
            setCurrentPrice(0);
        }
    }, [poolDataForCalculations]);

    // PASTE THIS NEW CODE IN ITS PLACE
    useEffect(() => {
        // This effect handles fetching quotes from Jupiter for Mainnet
        if (network !== 'mainnet-beta') {
            // For devnet, we clear any jupiter quotes and rely on the old logic.
            if (jupiterQuote) setJupiterQuote(null);
            return;
        }

        // Determine which amount to use for the quote
        const amountToQuote = activeTab === 'buy' ? buyAmount : sellAmount;
        const amountFloat = parseFloat(amountToQuote);

        // If amount is invalid, clear the quote and stop.
        if (isNaN(amountFloat) || amountFloat <= 0) {
            setJupiterQuote(null);
            return;
        }

        // This is a "debounce" timer. It waits until you stop typing for 300ms before fetching.
        const handler = setTimeout(async () => {
            try {
                setIsLoading(true); // Show a subtle loading state
               console.log("[TradingInterface][setIsLoading] set to TRUE (jupiter quote fetch)");
                const inputMint = activeTab === 'buy' ? NATIVE_MINT : new PublicKey(tokenAddress);
                const outputMint = activeTab === 'buy' ? new PublicKey(tokenAddress) : NATIVE_MINT;

                // Convert the UI amount to the correct lamports/raw amount
                const amountInSmallestUnit = new BN(
                    new Decimal(amountFloat).mul(
                        new Decimal(10).pow(activeTab === 'buy' ? 9 : tokenDecimals)
                    ).toFixed(0)
                );

                // Fetch the quote from your utility function
                const quote = await executeJupiterSwap({
                    wallet,
                    connection,
                    inputMint,
                    outputMint,
                    amount: amountInSmallestUnit,
                    slippageBps: slippage * 100,
                    onlyGetQuote: true
                });

                console.log("Received Jupiter Quote:", quote);
                setJupiterQuote(quote); // Store the entire quote object

            } catch (error) {
                console.error("Failed to get Jupiter quote:", error);
                setJupiterQuote(null);
            } finally {
                setIsLoading(false);
                console.log("[TradingInterface][setIsLoading] set to FALSE (jupiter quote fetch)");
            }
        }, 300); // 300ms delay

        // This cleans up the timer if you type again before it finishes.
        return () => {
            clearTimeout(handler);
        };

    }, [buyAmount, sellAmount, activeTab, network, tokenAddress, tokenDecimals, slippage, connection, wallet]);

    useEffect(() => {
        if (poolDataForCalculations && typeof poolDataForCalculations.price === 'number') {
            setCurrentPrice(poolDataForCalculations.price);
        }
    }, [poolDataForCalculations]);


const handleBuy = async () => {
    if (!wallet?.publicKey || !isPoolSelected) {
        setErrorMessage("Wallet not connected or no valid pool/route selected.");
        return;
    }
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
    console.log("[TradingInterface][setIsLoading] set to TRUE (handleBuy)");
    setErrorMessage('');
    setNotification({ show: true, message: `Processing buy on ${network}...`, type: 'info' });

    try {
        let txSignature: string;
        const amountInLamports = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));

        if (network === 'mainnet-beta') {
            const priorityFee = await getOptimalPriorityFee(connection);
            txSignature = await executeJupiterSwap({
                wallet,
                connection,
                inputMint: NATIVE_MINT,
                outputMint: new PublicKey(tokenAddress),
                amount: amountInLamports,
                slippageBps: slippage * 100,
                priorityFeeMicroLamports: priorityFee,
                asLegacyTransaction: true,
            });
        } else { // Devnet Logic
            if (!selectedPool || !selectedPool.id) throw new Error("Devnet pool not selected.");
            const slippageDecimal = slippage / 100;
            txSignature = await swapRaydiumTokens(wallet, connection, selectedPool.id, NATIVE_MINT.toBase58(), amountInLamports, slippageDecimal);
            updateSimulatedPoolAfterTrade(tokenAddress, { solIn: buyAmountSOLFloat });
        }
        
        setNotification({ show: true, message: `Buy successful!`, type: 'success' });
        setBuyAmount('');
        await refreshBalances();

    } catch (error: any) {
        console.error(`[handleBuy] Error:`, error);
        setErrorMessage(`Buy Failed: ${error.message}`);
        setNotification({ show: true, message: `Buy Failed: ${error.message.substring(0, 100)}`, type: 'error' });
    } finally {
        setIsLoading(false);
        console.log("[TradingInterface][setIsLoading] set to FALSE (handleBuy)");
    }
};

const handleSell = async () => {
    if (!wallet?.publicKey || !isPoolSelected) {
        setErrorMessage("Wallet not connected or no valid pool/route selected.");
        return;
    }
    const sellAmountTokensFloat = parseFloat(sellAmount);
    if (isNaN(sellAmountTokensFloat) || sellAmountTokensFloat <= 0) {
        setErrorMessage("Please enter a valid token amount to sell");
        return;
    }
    const rawTokenBalanceBN = new BN(tokenBalance);
    const rawTokensToSell = new BN(new Decimal(sellAmountTokensFloat).mul(10 ** tokenDecimals).toFixed(0));
    if (rawTokensToSell.gt(rawTokenBalanceBN)) {
        setErrorMessage(`Not enough token balance.`);
        return;
    }

    setIsLoading(true);
    console.log("[TradingInterface][setIsLoading] set to TRUE (handleSell)");
    setErrorMessage('');
    setNotification({ show: true, message: `Processing sell on ${network}...`, type: 'info' });

    try {
        let txSignature: string;

        if (network === 'mainnet-beta') {
            const priorityFee = await getOptimalPriorityFee(connection);
            txSignature = await executeJupiterSwap({
                wallet,
                connection,
                inputMint: new PublicKey(tokenAddress),
                outputMint: NATIVE_MINT,
                amount: rawTokensToSell,
                slippageBps: slippage * 100,
                priorityFeeMicroLamports: priorityFee,
                asLegacyTransaction: true,
            });
        } else { // Devnet Logic
            if (!selectedPool || !selectedPool.id) throw new Error("Devnet pool not selected.");
            const slippageDecimal = slippage / 100;
            txSignature = await swapRaydiumTokens(wallet, connection, selectedPool.id, tokenAddress, rawTokensToSell, slippageDecimal);
            updateSimulatedPoolAfterTrade(tokenAddress, { tokenIn: sellAmountTokensFloat });
        }
        
        setNotification({ show: true, message: 'Sell successful!', type: 'success' });
        setSellAmount('');
        await refreshBalances();

    } catch (error: any) {
        console.error(`[handleSell] Error:`, error);
        setErrorMessage(`Sell Error: ${error.message}`);
        setNotification({ show: true, message: `Sell Failed: ${error.message.substring(0, 100)}`, type: 'error' });
    } finally {
        setIsLoading(false);
        console.log("[TradingInterface][setIsLoading] set to FALSE (handleSell)");
    }
};

    let priceToDisplay = network === 'mainnet-beta' ? priceInSol : currentPrice;
    const displayPriceString = typeof priceToDisplay === 'number' && priceToDisplay > 0
        ? priceToDisplay.toFixed(Math.max(9, -Math.floor(Math.log10(priceToDisplay)) + 4))
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

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">
                    {errorMessage}
                </div>
            )}

            <div className="mb-4 bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                        {selectedPool ? `Pool (${selectedPool.id.substring(0, 6)}...) Price:` : "Price:"}
                    </span>
                    <span className="text-white font-semibold text-lg">
                        {displayPriceString} <span className="text-xs text-gray-500"> SOL/Token</span>
                    </span>
                </div>
            </div>

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

        {selectedPool && (
            <div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex">
                    <div className="text-blue-500 mr-2 text-lg">ⓘ</div>
                    <div className="text-blue-300 text-sm">
                        <p>
                            Trading against selected Raydium pool{" "}
                            <span className="font-mono text-xs">{selectedPool.id.substring(0, 6)}...</span> on {network}.
                        </p>
                    </div>
                </div>
            </div>
        )}

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
                    <p className="text-gray-500 text-xs mt-1">
                        Available: {solBalance?.toFixed(6) ?? '0.00'}
                    </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Tokens Received:</span>
                        <span className="text-white">
                            {jupiterQuote ? new Decimal(jupiterQuote.outAmount).div(10 ** tokenDecimals).toFixed(6) : '0.00'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Price Impact:</span>
                        <span className={`font-medium ${jupiterQuote && jupiterQuote.priceImpactPct * 100 > 5 ? 'text-red-400' : jupiterQuote && jupiterQuote.priceImpactPct * 100 > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {jupiterQuote ? `${(jupiterQuote.priceImpactPct * 100).toFixed(4)}%` : '0.00%'}
                        </span>
                    </div>
                </div>
                    <button
                        onClick={handleBuy}
                        disabled={
                            isLoading ||
                            !buyAmount ||
                            parseFloat(buyAmount) <= 0 ||
                            !wallet?.publicKey
                        }
                        className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${isLoading || !wallet?.publicKey
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : !buyAmount || parseFloat(buyAmount) <= 0
                                    ? 'bg-green-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isLoading ? "Processing..." : "Buy Token"}
                    </button>

                </div>
        )}

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
                        Available: {tokenBalance && typeof tokenDecimals === 'number' ? new Decimal(tokenBalance).div(10 ** tokenDecimals).toDP(tokenDecimals).toString() : '0'}
                    </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">SOL Received:</span>
                        <span className="text-white">
                            {activeTab === 'sell' && jupiterQuote ? new Decimal(jupiterQuote.outAmount).div(10 ** 9).toFixed(6) : '0.00'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Price Impact:</span>
                        <span className={`font-medium ${activeTab === 'sell' && jupiterQuote && jupiterQuote.priceImpactPct * 100 > 5 ? 'text-red-400' : activeTab === 'sell' && jupiterQuote && jupiterQuote.priceImpactPct * 100 > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {activeTab === 'sell' && jupiterQuote ? `${(jupiterQuote.priceImpactPct * 100).toFixed(4)}%` : '0.00%'}
                        </span>
                    </div>
                </div>
                <button
                        onClick={handleSell}
                        disabled={
                            isLoading ||
                            !sellAmount ||
                            parseFloat(sellAmount) <= 0 ||
                            !wallet?.publicKey
                        }
                        className={`w-full py-3 mt-auto rounded-lg font-bold transition-colors ${isLoading || !wallet?.publicKey
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : !sellAmount || parseFloat(sellAmount) <= 0
                                    ? 'bg-red-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        {isLoading ? "Processing..." : "Sell Token"}
                    </button>

                </div>
            )}
    </div>
);
}
export default TradingInterface;
