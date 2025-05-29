// src/components/TradingInterface.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';

import { getSimulatedPool, updateSimulatedPoolAfterTrade } from '@/utils/simulatedPoolStore';
import { isRaydiumPool, swapRaydiumTokens } from '@/utils/raydiumSdkAdapter';
import { DiscoveredPoolDetailed } from '@/utils/poolFinder';
import { NetworkType } from '@/context/NetworkContext';

import { mainnetBuySwap } from '@/utils/mainnetBuyUtil';
import { mainnetSellSwap } from '@/utils/mainnetSellSwap';

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
    const [errorMessage, setErrorMessage] = useState<string>('');

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

    useEffect(() => {
        console.log('[EFFECT_CALC] Running calculation useEffect. buyAmount:', buyAmount, 'sellAmount:', sellAmount, 'currentPrice:', currentPrice);
        const poolToUse = poolDataForCalculations;

        if (!poolToUse || typeof poolToUse.price !== 'number' || poolToUse.price <= 0 ||
            typeof poolToUse.solAmount !== 'number' || poolToUse.solAmount < 0 ||
            typeof poolToUse.tokenAmount !== 'number' || poolToUse.tokenAmount < 0 ) {
            console.log('[EFFECT_CALC] Invalid poolToUse data or price <= 0. Setting outputs to 0 and impact to 100.');
            setExpectedBuyOutput(0); setBuyPriceImpact(100);
            setExpectedSellOutput(0); setSellPriceImpact(100);
            return;
        }

        const buyAmountFloat = parseFloat(buyAmount);
        if (!isNaN(buyAmountFloat) && buyAmountFloat > 0) {
            const inputSOL = buyAmountFloat;
            console.log(`[EFFECT_CALC_BUY] Input SOL: ${inputSOL}, Pool SOL: ${poolToUse.solAmount}, Pool Token: ${poolToUse.tokenAmount}, Pool Price (likely T/S): ${poolToUse.price}`);

            if (poolToUse.solAmount > 0 && poolToUse.tokenAmount > 0) {
                const k = new Decimal(poolToUse.solAmount).mul(poolToUse.tokenAmount);
                const newSolReserve = new Decimal(poolToUse.solAmount).plus(inputSOL);
                
                if (newSolReserve.isZero()) {
                     setExpectedBuyOutput(0); setBuyPriceImpact(100);
                } else {
                    const newTokenReserve = k.div(newSolReserve);
                    const estimatedOutputTokens = new Decimal(poolToUse.tokenAmount).minus(newTokenReserve).toNumber();
                    console.log(`[EFFECT_CALC_BUY] k=${k.toString()}, newSolRes=${newSolReserve.toString()}, newTokenRes=${newTokenReserve.toString()}, estOutputTokens=${estimatedOutputTokens}`);

                    if (estimatedOutputTokens > 0) {
                        const marketPrice_TokenPerSol = new Decimal(poolToUse.tokenAmount).div(poolToUse.solAmount); // Assuming pool amounts are correct
                        const executionPrice_TokenPerSol = new Decimal(estimatedOutputTokens).div(inputSOL);
                        let impactRatio = new Decimal(0);
                        if (marketPrice_TokenPerSol.gt(0)) {
                           impactRatio = marketPrice_TokenPerSol.minus(executionPrice_TokenPerSol).abs().div(marketPrice_TokenPerSol);
                        }
                        
                        setExpectedBuyOutput(estimatedOutputTokens);
                        setBuyPriceImpact(isFinite(impactRatio.toNumber()) ? impactRatio.mul(100).toNumber() : 0);
                        console.log(`[EFFECT_CALC_BUY] Market(T/S)=${marketPrice_TokenPerSol.toString()}, Exec(T/S)=${executionPrice_TokenPerSol.toString()}, Impact=${impactRatio.mul(100).toFixed(2)}%`);
                    } else {
                        console.log('[EFFECT_CALC_BUY] estOutputTokens <= 0. Impact 100%.');
                        setExpectedBuyOutput(0); setBuyPriceImpact(100);
                    }
                }
            } else {
                 console.log('[EFFECT_CALC_BUY] Fallback: Zero reserves. Using direct price.');
                 if (poolToUse.price > 0 && typeof poolToUse.price === 'number') {
                    // Assuming selectedPool.price is Token/SOL
                    setExpectedBuyOutput(inputSOL * poolToUse.price); 
                 } else {
                    setExpectedBuyOutput(0);
                 }
                setBuyPriceImpact(0); 
            }
        } else {
            setExpectedBuyOutput(0); setBuyPriceImpact(0);
        }

        const sellAmountFloat = parseFloat(sellAmount);
        if (!isNaN(sellAmountFloat) && sellAmountFloat > 0) {
            const inputTokens = sellAmountFloat;
             console.log(`[EFFECT_CALC_SELL] Input Tokens: ${inputTokens}, Pool SOL: ${poolToUse.solAmount}, Pool Token: ${poolToUse.tokenAmount}, Pool Price (T/S): ${poolToUse.price}`);

            if (poolToUse.solAmount > 0 && poolToUse.tokenAmount > 0) {
                const k = new Decimal(poolToUse.solAmount).mul(poolToUse.tokenAmount);
                const newTokenReserve = new Decimal(poolToUse.tokenAmount).plus(inputTokens);
                
                if (newTokenReserve.isZero()) {
                    setExpectedSellOutput(0); setSellPriceImpact(100);
                } else {
                    const newSolReserve = k.div(newTokenReserve);
                    const estimatedOutputSOL = new Decimal(poolToUse.solAmount).minus(newSolReserve).toNumber();
                    console.log(`[EFFECT_CALC_SELL] k=${k.toString()}, newTokenRes=${newTokenReserve.toString()}, newSolRes=${newSolReserve.toString()}, estOutputSOL=${estimatedOutputSOL}`);

                    if (estimatedOutputSOL > 0) {
                        const marketPrice_TokenPerSol = new Decimal(poolToUse.tokenAmount).div(poolToUse.solAmount);
                        const executionPrice_TokenPerSol = new Decimal(inputTokens).div(estimatedOutputSOL);
                        let impactRatio = new Decimal(0);
                        if (marketPrice_TokenPerSol.gt(0)) {
                            impactRatio = executionPrice_TokenPerSol.minus(marketPrice_TokenPerSol).abs().div(marketPrice_TokenPerSol);
                        }
                        setExpectedSellOutput(estimatedOutputSOL);
                        setSellPriceImpact(isFinite(impactRatio.toNumber()) ? impactRatio.mul(100).toNumber() : 0);
                         console.log(`[EFFECT_CALC_SELL] Market(T/S)=${marketPrice_TokenPerSol.toString()}, Exec(T/S)=${executionPrice_TokenPerSol.toString()}, Impact=${impactRatio.mul(100).toFixed(2)}%`);
                    } else {
                         console.log('[EFFECT_CALC_SELL] estOutputSOL <= 0. Impact 100%.');
                        setExpectedSellOutput(0); setSellPriceImpact(100);
                    }
                }
            } else {
                console.log('[EFFECT_CALC_SELL] Fallback: Zero reserves. Using direct price.');
                if (poolToUse.price > 0 && typeof poolToUse.price === 'number') { // Assuming poolToUse.price is Token/SOL
                    setExpectedSellOutput(inputTokens / poolToUse.price);
                } else {
                    setExpectedSellOutput(0);
                }
                setSellPriceImpact(0);
            }
        } else {
            setExpectedSellOutput(0); setSellPriceImpact(0);
        }

    }, [buyAmount, sellAmount, currentPrice, poolDataForCalculations]);

    useEffect(() => {
        if (poolDataForCalculations && typeof poolDataForCalculations.price === 'number') {
            setCurrentPrice(poolDataForCalculations.price);
        }
    }, [poolDataForCalculations]);


    const handleBuy = async () => {
        console.log('------------------------------------------------------');
        console.log('[TradingInterface DEBUG handleBuy] Swap initiated by user.');
        console.log('[TradingInterface DEBUG handleBuy] Network prop:', network);
        if (selectedPool) {
            console.log('[TradingInterface DEBUG handleBuy] selectedPool prop received: id=', selectedPool.id, 'type=', selectedPool.type);
        } else {
             console.log('[TradingInterface DEBUG handleBuy] selectedPool prop is NULL or UNDEFINED.');
        }

        console.log("[handleBuy] Current State (original log):", { buyAmount, solBalance, tokenAddress, tokenDecimals, slippage, selectedPoolId: selectedPool?.id });
        console.log("[handleBuy] Wallet Prop PK (original log):", wallet?.publicKey?.toString());

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
            console.error('[TradingInterface CRITICAL handleBuy] Aborting: No pool selected or pool ID missing at decision point.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const poolIdToUse = selectedPool.id;
            const inputMint = NATIVE_MINT.toBase58();
            const solLamportsIn = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
            const slippageDecimal = slippage / 100;

            if (["Standard", "CPMM", "CPMM_DEVNET_SEEDED", "CPMM_DEVNET_CREATED"].includes(selectedPool.type)) {
                if (network === 'mainnet-beta') {
                    const txSignature = await mainnetBuySwap(wallet, connection, selectedPool, buyAmountSOLFloat, slippage);
                    setNotification({ show: true, message: `Buy successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
                    console.log("[handleBuy] Mainnet Buy swap successful, Tx:", txSignature);
                } else {
                    const txSignature = await swapRaydiumTokens(wallet, connection, poolIdToUse, inputMint, solLamportsIn, slippageDecimal);
                    setNotification({ show: true, message: `Buy successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
                    console.log("[handleBuy] Standard/CPMM Buy swap successful, Tx:", txSignature);
                }
            } else if (selectedPool.type === "Concentrated") {
                setErrorMessage(`Swap for Concentrated pools (type: ${selectedPool.type}) not yet routed to correct CLMM swap function.`);
                throw new Error(`CLMM swap logic not implemented / misrouted for pool type ${selectedPool.type}.`);
            } else {
                setErrorMessage(`Unknown pool type: ${selectedPool.type}`);
                throw new Error(`Unknown pool type: ${selectedPool.type}`);
            }

            await refreshBalances();
            setBuyAmount('');
            setExpectedBuyOutput(0);
            console.log("[handleBuy] Post-swap operations completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleBuy Error on ${network} for pool ${selectedPool?.id} (Type: ${selectedPool?.type}):`, error);
            setErrorMessage(`Buy Error: ${error.message || 'Unknown error'}`);
            setNotification({ show: true, message: `Buy Failed: ${error.message?.substring(0, 100)}...`, type: 'error' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => (prev.message.includes("Buy successful") || prev.message.includes("Buy Failed")) ? { show: false, message: '', type: '' } : prev), 4000);
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
            const slippageDecimal = slippage / 100;

            if (["Standard", "CPMM", "CPMM_DEVNET_SEEDED", "CPMM_DEVNET_CREATED"].includes(selectedPool.type)) {
                if (network === 'mainnet-beta') {
                    const txSignature = await mainnetSellSwap(wallet, connection, selectedPool, sellAmountTokensFloat, slippage);
                    setNotification({ show: true, message: `Sell successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
                    console.log("[handleSell] Mainnet Sell swap successful, Tx:", txSignature);
                } else {
                    const txSignature = await swapRaydiumTokens(wallet, connection, poolIdToUse, inputMint, rawTokensToSell, slippageDecimal);
                    setNotification({ show: true, message: `Sell successful! Tx: ${txSignature.substring(0, 10)}...`, type: 'success' });
                    console.log("[handleSell] Raydium Sell swap successful, Tx:", txSignature);
                }
            }  else if (selectedPool.type === "Concentrated") {
                setErrorMessage(`Swap for Concentrated pools (type: ${selectedPool.type}) not yet routed to correct CLMM swap function.`);
               throw new Error(`CLMM swap logic not implemented / misrouted for pool type ${selectedPool.type}.`);
           } else {
                setErrorMessage(`Unknown pool type: ${selectedPool.type}`);
               throw new Error(`Unknown pool type: ${selectedPool.type}`);
           }


            await refreshBalances();
            setSellAmount('');
            setExpectedSellOutput(0);
            console.log("[handleSell] Completed successfully.");

        } catch (error: any) {
            console.error(`[ERROR] handleSell Error on ${network}:`, error);
            setErrorMessage(`Sell Error: ${error.message || 'Unknown error'}`);
            setNotification({ show: true, message: `Sell Failed: ${error.message?.substring(0, 100)}...`, type: 'error' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => (prev.message.includes("Sell successful") || prev.message.includes("Sell Failed")) ? { show: false, message: '', type: '' } : prev), 4000);
        }
    };

    let priceToDisplay = currentPrice;
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

            {errorMessage && (<div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">{errorMessage}</div>)}

            <div className="mb-4 bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{selectedPool ? `Pool (${selectedPool.id.substring(0, 6)}...) Price:` : "Price (No Pool):"}</span>
                    <span className="text-white font-semibold text-lg">{displayPriceString} <span className="text-xs text-gray-500"> SOL/Token</span></span>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="slippage-input" className="block text-gray-400 text-sm mb-1">Slippage Tolerance (%)</label>
                <input id="slippage-input" type="number" value={slippage} onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none" step="0.1" min="0.1" max="50" />
            </div>

            {selectedPool && (<div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex">
                    <div className="text-blue-500 mr-2 text-lg">ⓘ</div>
                    <div className="text-blue-300 text-sm"><p>Trading against selected Raydium pool <span className="font-mono text-xs">{selectedPool.id.substring(0, 6)}...</span> on {network}.</p></div>
                </div>
            </div>)}
            {!selectedPool && (<div className="p-3 mb-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                <div className="flex">
                    <div className="text-yellow-500 mr-2 text-lg">⚠️</div>
                    <div className="text-yellow-300 text-sm"><p>No pool selected. Please select a pool from the list to enable trading.</p></div>
                </div>
            </div>)}

            {activeTab === 'buy' && (
                <div className="space-y-4 flex-grow flex flex-col">
                    <div>
                        <label htmlFor="buy-amount-input" className="block text-gray-400 text-sm mb-1">SOL Amount to Spend</label>
                        <input id="buy-amount-input" type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none" placeholder="Enter SOL amount" step="any" min="0" />
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
                        <input id="sell-amount-input" type="number" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none" placeholder="Enter token amount" step="any" min="0" />
                        <p className="text-gray-500 text-xs mt-1">Available: {tokenBalance && typeof tokenDecimals === 'number' ? new Decimal(tokenBalance).div(10 ** tokenDecimals).toDP(tokenDecimals).toString() : '0'}</p>
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