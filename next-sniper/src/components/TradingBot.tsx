'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

// The props interface now accepts all properties from the parent.
interface TradingBotProps {
    botPublicKeyString: string;
    tokenMintAddress: string;
    isLogicEnabled: boolean;
    onFund: (amount: number) => Promise<string>;
    onWithdraw: (recipientAddress: string, amount: number) => Promise<string>;
    onWithdrawToken: (recipientAddress: string, amount: number, mintAddress: string) => Promise<string>;
}

export default function TradingBot({
    botPublicKeyString,
    tokenMintAddress,
    isLogicEnabled,
    onFund,
    onWithdraw,
    onWithdrawToken
}: TradingBotProps) {
    const { connection } = useNetwork();
    const [solBalance, setSolBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [logs, setLogs] = useState<string[]>(['Initializing bot...']);
    const [isProcessing, setIsProcessing] = useState(false);

    // UI State
    const [isWithdrawVisible, setIsWithdrawVisible] = useState(false);

    // Form State
    const [withdrawSolAmount, setWithdrawSolAmount] = useState('');
    const [withdrawSolAddress, setWithdrawSolAddress] = useState('');
    const [withdrawTokenAmount, setWithdrawTokenAmount] = useState('');
    const [withdrawTokenAddress, setWithdrawTokenAddress] = useState('');

    const balancePollInterval = useRef<NodeJS.Timeout | null>(null);

    const addLog = useCallback((message: string) => {
        console.log(`[TRADING BOT LOG] ${message}`);
        setLogs(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 99)]);
    }, []);

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
                    addLog(`Balances: ${sol.toFixed(4)} SOL, ${balance.toFixed(4)} Tokens`);
                } catch (e) {
                    setTokenBalance(0);
                    addLog(`Balances: ${sol.toFixed(4)} SOL, 0.0000 Tokens (no account found)`);
                }
            } else {
                setTokenBalance(0);
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
        const intervalId = setInterval(refreshBotBalances, 30000);
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [refreshBotBalances]);

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
        if (isNaN(amount) || amount <= 0 || !withdrawSolAddress) return addLog('Invalid amount or address for SOL withdrawal.');
        if (amount > solBalance) return addLog('Insufficient SOL balance.');

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

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
            <div>
                <h3 className="text-lg font-bold text-white">Bot Instance Controller</h3>
                <p className="text-xs font-mono text-gray-400 break-all">{botPublicKeyString}</p>
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

            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <h4 className={`font-bold transition-colors ${isLogicEnabled ? 'text-green-400' : 'text-gray-200'}`}>
                        {isLogicEnabled ? 'Automated Logic is ON' : 'Automated Logic is OFF'}
                    </h4>
                </div>
                {!isLogicEnabled && (
                    <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                         <button disabled={isProcessing} className="w-full px-4 py-2 bg-green-700 hover:bg-green-600 rounded transition text-white font-semibold disabled:bg-gray-500">Manual Buy</button>
                         <button disabled={isProcessing} className="w-full px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition text-white font-semibold disabled:bg-gray-500">Manual Sell</button>
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
                            <button onClick={handleWithdrawSolClick} disabled={isProcessing} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-white disabled:bg-gray-500">Withdraw SOL</button>
                        </div>
                         <div className="space-y-3 md:col-span-2">
                             <h4 className='font-bold text-gray-200 text-sm'>Withdraw Tokens</h4>
                            <input type="text" placeholder="Recipient Address" value={withdrawTokenAddress} onChange={(e) => setWithdrawTokenAddress(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" disabled={isProcessing || !tokenMintAddress} />
                            <input type="number" placeholder="Token Amount" value={withdrawTokenAmount} onChange={(e) => setWithdrawTokenAmount(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" disabled={isProcessing || !tokenMintAddress} />
                            <button onClick={handleWithdrawTokenClick} disabled={isProcessing || !tokenMintAddress} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-white disabled:bg-gray-500">Withdraw Tokens</button>
                        </div>
                    </div>
                )}
            </div>
            
            <div>
                <h4 className="font-bold text-gray-300 mb-2">Logs</h4>
                <div className="bg-black p-3 rounded-lg h-48 overflow-y-auto font-mono text-xs text-gray-400 space-y-1 custom-scrollbar">
                    {logs.map((log, i) => <p key={i}><span className="text-gray-600 mr-2">{'>'}</span>{log}</p>)}
                </div>
            </div>
        </div>
    );
}
