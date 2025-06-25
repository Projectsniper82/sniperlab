'use client';

import { useNetwork } from '@/context/NetworkContext';
import { LAMPORTS_PER_SOL, PublicKey, Keypair, SystemProgram, TransactionMessage } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, NATIVE_MINT } from '@solana/spl-token';
import React, { useState, useEffect, useCallback } from 'react';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { executeJupiterSwap } from '@/utils/jupiterSwapUtil';
import { getOptimalPriorityFee } from '@/utils/priorityFee';
import { getSimulatedPool, updateSimulatedPoolAfterTrade } from '@/utils/simulatedPoolStore';
import { calculateStandardAmmSwapQuote } from '@/utils/ammSwapCalculator';
import { swapRaydiumTokens } from '@/utils/raydiumSdkAdapter';
import { createWalletAdapter } from '@/utils/walletAdapter';
import { useBotService } from '@/context/BotServiceContext';

// Approximate network fee for a simple transfer in SOL
const ESTIMATED_TX_FEE_SOL = 0.00001;
// The props interface now accepts all properties from the parent.
interface TradingBotProps {
    botWallet: Keypair;
    botPublicKeyString: string;
    tokenMintAddress: string;
    selectedTokenAddress: string;
    isLpActive: boolean;
    isLogicEnabled: boolean;
    index: number;
    onFund: (amount: number) => Promise<string>;
    onWithdraw: (recipientAddress: string, amount: number) => Promise<string>;
    onWithdrawToken: (
        recipientAddress: string,
        amount: number,
        mintAddress: string
    ) => Promise<string>;
}

export default function TradingBot({
    botWallet,
    botPublicKeyString,
    tokenMintAddress,
    selectedTokenAddress,
    isLpActive,
    isLogicEnabled,
    index,
    onFund,
    onWithdraw,
    onWithdrawToken
}: TradingBotProps) {
    const { connection, network } = useNetwork();
    const { getLogs, log } = useBotService();
    const [solBalance, setSolBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const logs = getLogs(botPublicKeyString);
    // UI State
    const [isWithdrawVisible, setIsWithdrawVisible] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);

    // Dynamic network values
    const [minRentSol, setMinRentSol] = useState(0);
    const [txFeeSol, setTxFeeSol] = useState(ESTIMATED_TX_FEE_SOL);
    const [maxWithdrawSol, setMaxWithdrawSol] = useState(0);
    const [withdrawError, setWithdrawError] = useState('');

    // Form State
    const [withdrawSolAmount, setWithdrawSolAmount] = useState('');
    const [withdrawSolAddress, setWithdrawSolAddress] = useState('');
    const [withdrawTokenAmount, setWithdrawTokenAmount] = useState('');
    const [withdrawTokenAddress, setWithdrawTokenAddress] = useState('');

    // Manual trade form state
    const [buyAmount, setBuyAmount] = useState('');
    const [sellAmount, setSellAmount] = useState('');
    const [slippage, setSlippage] = useState(1);
    const [priorityFee, setPriorityFee] = useState('');
    const [recommendedPriorityFee, setRecommendedPriorityFee] = useState<number | null>(null);
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [buyQuote, setBuyQuote] = useState<any>(null);
    const [sellQuote, setSellQuote] = useState<any>(null);

    const addLog = useCallback((message: string) => {
        console.log(`[TRADING BOT LOG] ${message}`);
        log(botPublicKeyString, message);
    }, [log, botPublicKeyString]);

    const refreshBotBalances = useCallback(async () => {
        // This guard prevents multiple refreshes from running at the same time
        if (isRefreshing) return;
        setIsRefreshing(true);
        addLog('Refreshing bot balances...');
        try {
            const botPublicKey = new PublicKey(botPublicKeyString);
            const lamports = await connection.getBalance(botPublicKey);
            const sol = lamports / LAMPORTS_PER_SOL;
            setSolBalance(sol);

            if (tokenMintAddress) {
                try {
                    const mintPublicKey = new PublicKey(tokenMintAddress);
                    const ata = await getAssociatedTokenAddress(mintPublicKey, botPublicKey);
                    const accountInfo = await getAccount(connection, ata);
                    const tokenInfo = await connection.getParsedAccountInfo(mintPublicKey);
                    const decimals = (tokenInfo.value?.data as any)?.parsed?.info?.decimals ?? 0;
                    const balance = Number(accountInfo.amount) / Math.pow(10, decimals);
                    setTokenBalance(balance);
                    setTokenDecimals(decimals);
                    addLog(`Balances: ${sol.toFixed(4)} SOL, ${balance.toFixed(4)} Tokens`);
                } catch (e) {
                    setTokenBalance(0);
                    setTokenDecimals(0);
                    addLog(`Balances: ${sol.toFixed(4)} SOL, 0.0000 Tokens (no account found)`);
                }
            } else {
                setTokenBalance(0);
                setTokenDecimals(0);
                addLog(`Balances: ${sol.toFixed(4)} SOL (no token selected)`);
            }
        } catch (error) {
            console.error('Failed to refresh bot balances:', error);
            addLog('Error refreshing balances.');
        } finally {
            setIsRefreshing(false);
        }
    }, [connection, botPublicKeyString, addLog, tokenMintAddress]); // FIX: `isRefreshing` has been removed from this array.

    useEffect(() => {
        refreshBotBalances();

    }, [refreshBotBalances, botWallet]);

     // Fetch rent exemption and fee data
    useEffect(() => {
        const fetchParams = async () => {
            try {
                const rentLamports = await connection.getMinimumBalanceForRentExemption(0);
                setMinRentSol(rentLamports / LAMPORTS_PER_SOL);

                const { blockhash } = await connection.getLatestBlockhash();
                const message = new TransactionMessage({
                    payerKey: botWallet.publicKey,
                    recentBlockhash: blockhash,
                    instructions: [
                        SystemProgram.transfer({
                            fromPubkey: botWallet.publicKey,
                            toPubkey: botWallet.publicKey,
                            lamports: 1,
                        }),
                    ],
                }).compileToV0Message();
                const feeResponse = await connection.getFeeForMessage(message);
                if (feeResponse && feeResponse.value !== null) {
                    setTxFeeSol(feeResponse.value / LAMPORTS_PER_SOL);
                }
            } catch (e) {
                console.warn('Failed to fetch rent/fee info', e);
            }
        };

        fetchParams();
    }, [connection, botWallet]);

    // Update max withdrawal whenever balance or params change
    useEffect(() => {
        const max = solBalance - minRentSol - txFeeSol;
        setMaxWithdrawSol(max > 0 ? max : 0);
    }, [solBalance, minRentSol, txFeeSol]);

    // Quote for manual buy
    useEffect(() => {
        const amount = parseFloat(buyAmount);
        if (!tokenMintAddress || isNaN(amount) || amount <= 0) { setBuyQuote(null); return; }
        const handler = setTimeout(async () => {
            try {
                if (network === 'mainnet-beta') {
                    const quote = await executeJupiterSwap({
                        wallet: { publicKey: new PublicKey(botPublicKeyString) },
                        connection,
                        inputMint: NATIVE_MINT,
                        outputMint: new PublicKey(tokenMintAddress),
                        amount: new BN(new Decimal(amount).mul(1e9).toFixed(0)),
                        slippageBps: slippage * 100,
                        onlyGetQuote: true,
                    });
                    setBuyQuote({
                        outAmount: new Decimal(quote.outAmount).div(new Decimal(10).pow(tokenDecimals)).toNumber(),
                        minOut: new Decimal(quote.otherAmountThreshold).div(new Decimal(10).pow(tokenDecimals)).toNumber(),
                        priceImpact: quote.priceImpactPct * 100,
                    });
                } else {
                    const pool = getSimulatedPool();
                    if (!pool) { setBuyQuote(null); return; }
                    const q = calculateStandardAmmSwapQuote(amount, true, {
                        priceFromPool: pool.price,
                        uiSolReserve: pool.solAmount,
                        uiTokenReserve: pool.tokenAmount,
                        solMintAddress: NATIVE_MINT.toBase58(),
                        solDecimals: 9,
                        pairedTokenMintAddress: pool.tokenAddress,
                        pairedTokenDecimals: pool.tokenDecimals || 0,
                    }, slippage);
                    if (q) {
                        setBuyQuote({
                            outAmount: q.estimatedOutputUi.toNumber(),
                            minOut: new Decimal(q.minAmountOutRaw.toString()).div(new Decimal(10).pow(pool.tokenDecimals || 0)).toNumber(),
                            priceImpact: q.priceImpactPercent.toNumber(),
                        });
                    } else {
                        setBuyQuote(null);
                    }
                }
            } catch (e) {
                console.error('Buy quote error', e); setBuyQuote(null);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [buyAmount, slippage, tokenMintAddress, tokenDecimals, network, connection, botPublicKeyString]);

    // Quote for manual sell
    useEffect(() => {
        const amount = parseFloat(sellAmount);
        if (!tokenMintAddress || isNaN(amount) || amount <= 0) { setSellQuote(null); return; }
        const handler = setTimeout(async () => {
            try {
                if (network === 'mainnet-beta') {
                    const quote = await executeJupiterSwap({
                        wallet: { publicKey: new PublicKey(botPublicKeyString) },
                        connection,
                        inputMint: new PublicKey(tokenMintAddress),
                        outputMint: NATIVE_MINT,
                        amount: new BN(new Decimal(amount).mul(new Decimal(10).pow(tokenDecimals)).toFixed(0)),
                        slippageBps: slippage * 100,
                        onlyGetQuote: true,
                    });
                    setSellQuote({
                        outAmount: new Decimal(quote.outAmount).div(1e9).toNumber(),
                        minOut: new Decimal(quote.otherAmountThreshold).div(1e9).toNumber(),
                        priceImpact: quote.priceImpactPct * 100,
                    });
                } else {
                    const pool = getSimulatedPool();
                    if (!pool) { setSellQuote(null); return; }
                    const q = calculateStandardAmmSwapQuote(amount, false, {
                        priceFromPool: pool.price,
                        uiSolReserve: pool.solAmount,
                        uiTokenReserve: pool.tokenAmount,
                        solMintAddress: NATIVE_MINT.toBase58(),
                        solDecimals: 9,
                        pairedTokenMintAddress: pool.tokenAddress,
                        pairedTokenDecimals: pool.tokenDecimals || 0,
                    }, slippage);
                    if (q) {
                        setSellQuote({
                            outAmount: q.estimatedOutputUi.toNumber(),
                            minOut: new Decimal(q.minAmountOutRaw.toString()).div(new Decimal(10).pow(9)).toNumber(),
                            priceImpact: q.priceImpactPercent.toNumber(),
                        });
                    } else {
                        setSellQuote(null);
                    }
                }
            } catch (e) {
                console.error('Sell quote error', e); setSellQuote(null);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [sellAmount, slippage, tokenMintAddress, tokenDecimals, network, connection, botPublicKeyString]);
    useEffect(() => {
        async function fetchPriority() {
            const fee = await getOptimalPriorityFee(connection);
            setRecommendedPriorityFee(fee);
            setPriorityFee(String(fee));
        }
        fetchPriority();
    }, [connection]);
    const handleBuy = async () => {
        const amountSol = parseFloat(buyAmount);
        if (isNaN(amountSol) || amountSol <= 0) return addLog('Invalid buy amount.');
        if (amountSol > solBalance) return addLog('Insufficient SOL balance.');
        if (!tokenMintAddress) return addLog('Token mint not set.');

        setIsProcessing(true);
        addLog(`Initiating buy of ${amountSol} SOL worth of tokens...`);
        try {
            const walletAdapter = createWalletAdapter(botWallet, connection);
            const amountLamports = new BN(new Decimal(amountSol).mul(1e9).toFixed(0));
            const fee = parseInt(priorityFee) || recommendedPriorityFee || 1000;

            let txId: string;
            if (network === 'mainnet-beta') {
                txId = await executeJupiterSwap({
                    wallet: walletAdapter,
                    connection,
                    inputMint: NATIVE_MINT,
                    outputMint: new PublicKey(tokenMintAddress),
                    amount: amountLamports,
                    slippageBps: slippage * 100,
                    priorityFeeMicroLamports: fee,
                    asLegacyTransaction: true,
                });
            } else {
                const pool = getSimulatedPool();
                if (!pool || !pool.id) throw new Error('No devnet pool available.');
                txId = await swapRaydiumTokens(
                    walletAdapter,
                    connection,
                    pool.id,
                    NATIVE_MINT.toBase58(),
                    amountLamports,
                    slippage / 100
                );
                updateSimulatedPoolAfterTrade(0, amountSol);
            }
            addLog(`Buy successful. Tx: ${txId}`);
            setBuyAmount('');
            await refreshBotBalances();
        } catch (e: any) {
            console.error('Buy error', e);
            addLog(`Buy failed: ${e.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSell = async () => {
        const amountTokens = parseFloat(sellAmount);
        if (isNaN(amountTokens) || amountTokens <= 0) return addLog('Invalid sell amount.');
        if (amountTokens > tokenBalance) return addLog('Insufficient token balance.');
        if (!tokenMintAddress) return addLog('Token mint not set.');

        setIsProcessing(true);
        addLog(`Initiating sell of ${amountTokens} tokens...`);
        try {
            const walletAdapter = createWalletAdapter(botWallet, connection);
            const amountRaw = new BN(new Decimal(amountTokens).mul(new Decimal(10).pow(tokenDecimals)).toFixed(0));
            const fee = parseInt(priorityFee) || recommendedPriorityFee || 1000;

            let txId: string;
            if (network === 'mainnet-beta') {
                txId = await executeJupiterSwap({
                    wallet: walletAdapter,
                    connection,
                    inputMint: new PublicKey(tokenMintAddress),
                    outputMint: NATIVE_MINT,
                    amount: amountRaw,
                    slippageBps: slippage * 100,
                    priorityFeeMicroLamports: fee,
                    asLegacyTransaction: true,
                });
            } else {
                const pool = getSimulatedPool();
                if (!pool || !pool.id) throw new Error('No devnet pool available.');
                txId = await swapRaydiumTokens(
                    walletAdapter,
                    connection,
                    pool.id,
                    tokenMintAddress,
                    amountRaw,
                    slippage / 100
                );
                updateSimulatedPoolAfterTrade(amountTokens, 0);
            }
            addLog(`Sell successful. Tx: ${txId}`);
            setSellAmount('');
            await refreshBotBalances();
        } catch (e: any) {
            console.error('Sell error', e);
            addLog(`Sell failed: ${e.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFundClick = async () => {
        const amountStr = prompt("Enter amount of SOL to fund the bot:", "0.1");
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return alert("Invalid amount.");

        setIsProcessing(true);
        addLog(`Funding with ${amount} SOL...`);
        try {
            await onFund(amount);
            addLog('Funding successful.');
        } catch (error: any) {
            addLog(`Funding failed: ${error.message}`);
        } finally {
            await refreshBotBalances();
            setIsProcessing(false);
        }
    };

    const handleWithdrawSolClick = async () => {
        const amount = parseFloat(withdrawSolAmount);
        setWithdrawError('');
        if (isNaN(amount) || amount <= 0 || !withdrawSolAddress) {
            setWithdrawError('Invalid amount or address.');
            return;
        }
        if (amount - maxWithdrawSol > 1e-9) {
            setWithdrawError('Amount exceeds available balance.');
            return;
        }

        setIsProcessing(true);
        addLog(`Withdrawing ${amount} SOL...`);
        try {
            await onWithdraw(withdrawSolAddress, amount);
            addLog('SOL withdrawal successful.');
            setWithdrawSolAmount('');
            setWithdrawSolAddress('');
        } catch (error: any) {
            addLog(`SOL withdrawal failed: ${error.message}`);
        } finally {
            await refreshBotBalances();
            setIsProcessing(false);
        }
    };

    const handleWithdrawTokenClick = async () => {
        const amount = parseFloat(withdrawTokenAmount);
        if (isNaN(amount) || amount <= 0 || !withdrawTokenAddress || !tokenMintAddress) return addLog('Invalid amount, address, or token for withdrawal.');
        if (amount > tokenBalance) return addLog('Insufficient token balance.');

        setIsProcessing(true);
        addLog(`Withdrawing ${amount} tokens...`);
        try {
            await onWithdrawToken(withdrawTokenAddress, amount, tokenMintAddress);
            addLog('Token withdrawal successful.');
            setWithdrawTokenAmount('');
            setWithdrawTokenAddress('');
        } catch (error: any) {
            addLog(`Token withdrawal failed: ${error.message}`);
        } finally {
            await refreshBotBalances();
            setIsProcessing(false);
        }
    };

      const handleMaxSolClick = async () => {
     if (maxWithdrawSol <= 0) {
        setWithdrawError('Balance too low to withdraw after fees.');
        setWithdrawSolAmount('');
        return;
    }
    const factor = Math.pow(10, 6);
    const floored = Math.floor(maxWithdrawSol * factor) / factor;
    setWithdrawSolAmount(floored.toFixed(6));
    setWithdrawError('');
};

    const handleMaxTokenClick = () => {
        setWithdrawTokenAmount(tokenBalance.toFixed(6));
    };

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white">Bot Instance Controller</h3>
                    <p
                        className="text-xs font-mono text-gray-400 break-all cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(botPublicKeyString)}
                        title="Click to copy"
                    >
                        {botPublicKeyString}
                    </p>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {index}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Bot SOL Balance</p>
                    <p className="text-xl font-bold text-white">{solBalance.toFixed(4)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Bot Token Balance</p>
                    <p className="text-xl font-bold text-white">{tokenBalance.toFixed(4)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg col-span-2 md:col-span-1">
                    <button onClick={refreshBotBalances} disabled={isRefreshing || isProcessing} className="w-full h-full text-sm font-semibold text-gray-300 hover:text-white transition disabled:opacity-50">
                        {isRefreshing ? 'Refreshing...' : 'Refresh Balances'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg">
                <div className="p-4 flex justify-between items-center">
                    <h4 className="font-bold flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isLogicEnabled ? 'bg-green-400' : 'bg-red-500'}`}></span>
                        <span>{isLogicEnabled ? 'Automated Logic ON' : 'Automated Logic OFF'}</span>
                    </h4>
                    <button
                        onClick={() => !isLogicEnabled && setIsManualOpen(!isManualOpen)}
                        disabled={isLogicEnabled}
                        className={`transition-transform ${isManualOpen ? 'rotate-180' : ''} ${isLogicEnabled ? 'opacity-50 cursor-default' : ''}`}
                    >
                        ▼
                    </button>
                </div>
            {!isLogicEnabled && isManualOpen && (
                    <div className="p-4 pt-0 space-y-6 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Buy Amount (SOL)</label>
                                <input type="number" value={buyAmount} onChange={e => setBuyAmount(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" step="any" min="0" />
                                <p className="text-gray-500 text-xs mt-1">Available: <span className="cursor-pointer hover:underline" onClick={() => setBuyAmount(solBalance.toFixed(6))}>{solBalance.toFixed(6)}</span></p>
                            <div className="bg-gray-700 p-2 rounded mt-2 space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-gray-400">Min Tokens Out:</span><span className="text-white">{buyQuote ? buyQuote.minOut.toFixed(6) : '0.000000'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Price Impact:</span><span className={`font-medium ${buyQuote && buyQuote.priceImpact > 5 ? 'text-red-400' : buyQuote && buyQuote.priceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>{buyQuote ? `${buyQuote.priceImpact.toFixed(4)}%` : '0.00%'}</span></div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Sell Amount (Token)</label>
                            <input type="number" value={sellAmount} onChange={e => setSellAmount(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" step="any" min="0" />
                            <p className="text-gray-500 text-xs mt-1">Available: <span className="cursor-pointer hover:underline" onClick={() => setSellAmount(tokenBalance.toFixed(6))}>{tokenBalance.toFixed(6)}</span></p>
                            <div className="bg-gray-700 p-2 rounded mt-2 space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-gray-400">Min SOL Out:</span><span className="text-white">{sellQuote ? sellQuote.minOut.toFixed(6) : '0.000000'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Price Impact:</span><span className={`font-medium ${sellQuote && sellQuote.priceImpact > 5 ? 'text-red-400' : sellQuote && sellQuote.priceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>{sellQuote ? `${sellQuote.priceImpact.toFixed(4)}%` : '0.00%'}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Slippage (%)</label>
                            <input type="number" value={slippage} onChange={e => setSlippage(parseFloat(e.target.value) || 0)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" step="0.1" min="0" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Priority Fee (μ-lamports)</label>
                            <input type="number" value={priorityFee} onChange={e => setPriorityFee(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" step="1" min="0" />
                            {recommendedPriorityFee !== null && <p className="text-gray-500 text-xs mt-1">Suggested: <span className="cursor-pointer hover:underline" onClick={() => setPriorityFee(String(recommendedPriorityFee))}>{recommendedPriorityFee}</span></p>}
                        </div>
                    </div>
                   <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
                            <button onClick={handleBuy} disabled={isProcessing} className="w-full px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition text-white font-semibold disabled:bg-gray-500">Buy</button>
                            <button onClick={handleSell} disabled={isProcessing} className="w-full px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition text-white font-semibold disabled:bg-gray-500">Sell</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <button onClick={() => setIsWithdrawVisible(!isWithdrawVisible)} className='w-full text-left font-bold text-gray-200'>
                    <h4 className='flex justify-between items-center'>
                        <span>Fund / Withdraw</span>
                        <span className={`transition-transform transform ${isWithdrawVisible ? 'rotate-180' : ''}`}>▼</span>
                    </h4>
                </button>
                {isWithdrawVisible && (
                    <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className='font-bold text-gray-200 text-sm'>Fund Bot</h4>
                            <button onClick={handleFundClick} disabled={isProcessing} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-white font-semibold disabled:bg-gray-500">Fund with SOL</button>
                        </div>
                        <div className="space-y-3">
                            <h4 className='font-bold text-gray-200 text-sm'>Withdraw SOL</h4>
                            <input type="text" placeholder="Recipient Address" value={withdrawSolAddress} onChange={(e) => setWithdrawSolAddress(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" disabled={isProcessing} />
                            <input type="number" placeholder="SOL Amount" value={withdrawSolAmount} onChange={(e) => setWithdrawSolAmount(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" disabled={isProcessing} />
                             <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span className="cursor-pointer hover:underline" onClick={handleMaxSolClick}>Available: {solBalance.toFixed(6)}</span>
                                <button type="button" onClick={handleMaxSolClick} className="text-blue-400 hover:underline">Max</button>
                            </div>
                            {withdrawError && <p className="text-red-500 text-xs">{withdrawError}</p>}
                            {maxWithdrawSol <= 0 && !withdrawError && (
                                <p className="text-yellow-400 text-xs">Balance too low to withdraw after fees.</p>
                            )}
                            <button onClick={handleWithdrawSolClick} disabled={isProcessing || maxWithdrawSol <= 0} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-white disabled:bg-gray-500">Withdraw SOL</button>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                            <h4 className='font-bold text-gray-200 text-sm'>Withdraw Tokens</h4>
                            <input type="text" placeholder="Recipient Address" value={withdrawTokenAddress} onChange={(e) => setWithdrawTokenAddress(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" disabled={isProcessing || !tokenMintAddress} />
                            <input type="number" placeholder="Token Amount" value={withdrawTokenAmount} onChange={(e) => setWithdrawTokenAmount(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" disabled={isProcessing || !tokenMintAddress} />
                             <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span className="cursor-pointer hover:underline" onClick={handleMaxTokenClick}>Available: {tokenBalance.toFixed(6)}</span>
                                <button type="button" onClick={handleMaxTokenClick} className="text-blue-400 hover:underline">Max</button>
                            </div>
                            <button onClick={handleWithdrawTokenClick} disabled={isProcessing || !tokenMintAddress} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-white disabled:bg-gray-500">Withdraw Tokens</button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-bold text-gray-300 mb-2">Logs</h4>
                <div className="bg-black p-3 rounded-lg h-48 overflow-y-auto font-mono text-xs text-gray-400 space-y-1 custom-scrollbar">
                    {logs.map((entry, i) => (
                        <p key={i}><span className="text-gray-600 mr-2">{'>'}</span>{new Date(entry.timestamp).toLocaleTimeString()}: {entry.message}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

