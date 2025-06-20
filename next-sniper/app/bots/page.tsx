'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import BotManager from '@/components/BotManager';
import GlobalBotControls from '@/components/GlobalBotControls';
import WalletCreationManager, {
    initWalletCreationWorker,
    postWalletCreationMessage,
    terminateWalletCreationWorker,
} from '@/components/WalletCreationManager';
import { saveBotWallets } from '@/utils/botWalletManager';
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import { useToken } from '@/context/TokenContext';
import { useBotLogic } from '@/context/BotLogicContext';
import { useNetwork, NetworkType } from '@/context/NetworkContext';
import { useGlobalLogs } from '@/context/GlobalLogContext';

// Import other hooks and utilities you use for fetching LP data
import { useWallet } from '@solana/wallet-adapter-react';

export default function TradingBotsPage() {
    const { publicKey, sendTransaction } = useWallet();
    const { isLogicEnabled, setIsLogicEnabled } = useBotLogic();
    const { logs, append } = useGlobalLogs();
    const { network, rpcUrl, connection } = useNetwork();
    const walletCreatorRef = useRef<Worker | null>(null);
    const creationParamsRef = useRef<{ totalSol: number; durationMinutes: number } | null>(null);
    const [creationState, setCreationState] = useState<'idle' | 'processing'>('idle');

    // FIX: Get the setter function from the context
    const { tokenAddress, isLpActive, setIsLpActive, setTokenAddress } = useToken();

    // --- Placeholder for your LP fetching logic ---
    // You likely have a more complex version of this.
    // The key is to call setIsLpActive based on the result.
    const fetchLpTokenDetails = useCallback(async () => {
        if (!tokenAddress || !publicKey) {
            setIsLpActive(false);
            return;
        }

        console.log(`[DEBUG] Starting LP check for token: ${tokenAddress}`);

        try {
            // SIMULATION of your fetching logic from the logs
            // Replace this with your actual implementation (e.g., call to Raydium SDK)
            const poolFound = true; // Assume your logic sets this to true on success

            if (poolFound) {
                console.log("[DEBUG] LP was found, updating context.");
                setIsLpActive(true);
            } else {
                console.log("[DEBUG] LP not found.");
                setIsLpActive(false);
            }
        } catch (error) {
            console.error("Failed to fetch LP details", error);
            setIsLpActive(false);
        }

    }, [tokenAddress, publicKey, setIsLpActive]);

    // Initialize worker for wallet creation logs
useEffect(() => {
     try {
        walletCreatorRef.current = initWalletCreationWorker((data: any) => {
            console.log('[TradingBotsPage] Worker response', data);
            if (data?.log) addLog(data.log);
            if (data?.error) {
                addLog(`Worker error: ${data.error}`);
                setCreationState('idle');
                return;
            }
            if (data?.wallets) {
                const { trading, intermediates } = data.wallets as { trading: number[][]; intermediates: number[][] };
                const tradingWallets = trading.map(arr => Keypair.fromSecretKey(new Uint8Array(arr)));
                const intermediateWallets = intermediates.map(arr => Keypair.fromSecretKey(new Uint8Array(arr)));
                addLog(`Received ${tradingWallets.length} trading and ${intermediateWallets.length} intermediate wallets`);

                if (creationParamsRef.current && publicKey) {
                    distributeFunds(tradingWallets, intermediateWallets, creationParamsRef.current.totalSol, creationParamsRef.current.durationMinutes);
                } else {
                    addLog('Missing creation params or main wallet connection.');
                    setCreationState('idle');
                }
            }
        });
     
    } catch (err) {
        console.error('[TradingBotsPage] Failed to initialize worker', err);
    }
    return () => {
         terminateWalletCreationWorker();
        walletCreatorRef.current = null;
    };
}, [network, publicKey, sendTransaction, connection]);

    // Run the check whenever the token or wallet changes
    useEffect(() => {
        fetchLpTokenDetails();
    }, [fetchLpTokenDetails]);

    // --- Other handlers ---
    const addLog = (message: string) => {
        append(message);
    };

    const handleToggleLogic = (isEnabled: boolean) => {
        setIsLogicEnabled(isEnabled);
        addLog(`Global trading logic has been turned ${isEnabled ? 'ON' : 'OFF'}.`);
    };

    const handleStartCreation = (
        totalSol: number,
        duration: number,
        network: NetworkType,
        rpcUrl: string
    ) => {
        setCreationState('processing');
        creationParamsRef.current = { totalSol, durationMinutes: duration };
            console.log('[TradingBotsPage] Sending creation message', { totalSol, duration, network, rpcUrl });
        try {
            postWalletCreationMessage({ totalSol, duration, network, rpcUrl });
        } catch (err) {
            console.error('[TradingBotsPage] Failed to post message to worker', err);
        }
        addLog(`Started wallet creation on ${network} via ${rpcUrl}`);
    };

    const handleClearAll = () => {
        addLog("Simulation: Clear all wallets.");
    };

    const distributeFunds = (
        tradingWallets: Keypair[],
        intermediateWallets: Keypair[],
        totalSol: number,
        durationMinutes: number
    ) => {
        console.log('[TradingBotsPage] distributeFunds started');
        const baseAmount = totalSol / tradingWallets.length;
        const amounts = tradingWallets.map(() => baseAmount * (0.9 + Math.random() * 0.2));
        const diff = totalSol - amounts.reduce((a, b) => a + b, 0);
        amounts[amounts.length - 1] += diff;

        const scheduleTimes: number[] = [];
        const baseDelay = (durationMinutes * 60 * 1000) / tradingWallets.length;
        for (let i = 0; i < tradingWallets.length; i++) {
            scheduleTimes.push(baseDelay * i + Math.random() * baseDelay * 0.5);
        }

        const run = async (i: number) => {
            const amount = amounts[i];
            const lamports = Math.round(amount * LAMPORTS_PER_SOL);
            try {
                const balance = await connection.getBalance(publicKey!);
                const required = totalSol * LAMPORTS_PER_SOL;
                if (balance < required) {
                    addLog('Insufficient balance to fund wallets.');
                    setCreationState('idle');
                    return;
                }

                const tx1 = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey!,
                        toPubkey: intermediateWallets[i].publicKey,
                        lamports,
                    })
                );
                const sig1 = await sendTransaction(tx1, connection);
                await connection.confirmTransaction(sig1, 'confirmed');
                addLog(`Funded intermediate ${intermediateWallets[i].publicKey.toBase58()} with ${amount.toFixed(4)} SOL`);

                const tx2 = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: intermediateWallets[i].publicKey,
                        toPubkey: tradingWallets[i].publicKey,
                        lamports,
                    })
                );
                const sig2 = await connection.sendTransaction(tx2, [intermediateWallets[i]]);
                await connection.confirmTransaction(sig2, 'confirmed');
                addLog(`Transferred ${amount.toFixed(4)} SOL to trading wallet ${tradingWallets[i].publicKey.toBase58()}`);

                if (i === tradingWallets.length - 1) {
                    saveBotWallets(network, tradingWallets);
                    addLog(`Saved ${tradingWallets.length} trading wallets`);
                    setCreationState('idle');
                    console.log('[TradingBotsPage] distributeFunds completed'); 
                }
            } catch (err: any) {
                addLog(`Error funding wallet ${i + 1}: ${err.message}`);
                setCreationState('idle');
            }
        };

        scheduleTimes.forEach((delay, i) => {
            setTimeout(() => run(i), delay);
        });
    };


    return (
        <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
            <AppHeader />
            <main className="max-w-7xl mx-auto mt-4 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlobalBotControls
                        isLogicEnabled={isLogicEnabled}
                        onToggleLogic={handleToggleLogic}
                    />
                    <WalletCreationManager
                        onStartCreation={handleStartCreation}
                        onClearWallets={handleClearAll}
                        isProcessing={creationState === 'processing'}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-2">Global Action Logs</h3>
                    <div className="bg-black p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs text-gray-400 space-y-1 custom-scrollbar">
                        {logs.length > 0 ? logs.map((log, i) => <p key={i}><span className="text-gray-600 mr-2">{'>'}</span>{log}</p>) : <p className="text-gray-500">No global actions yet.</p>}
                    </div>
                </div>

                <BotManager
                    selectedTokenAddress={tokenAddress}
                    isLpActive={isLpActive}
                />
            </main>
        </div>
    );
}