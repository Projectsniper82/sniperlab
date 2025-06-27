'use client';

import React, { useEffect, useCallback, useState, useContext } from 'react';
import AppHeader from '@/components/AppHeader';
import BotManager from '@/components/BotManager';
import GlobalBotControls from '@/components/GlobalBotControls';
import WalletCreationManager from '@/components/WalletCreationManager';
import { saveBotWallets, loadBotWallets, clearBotWallets } from '@/utils/botWalletManager';
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction, SendTransactionError } from '@solana/web3.js';
import { useToken } from '@/context/TokenContext';
import { useBotLogic } from '@/context/BotLogicContext';
import { useNetwork } from '@/context/NetworkContext';
import { BotContext } from '@/context/BotContext';
import { useGlobalLogs } from '@/context/GlobalLogContext';
import { useBotWalletReload } from '@/context/BotWalletReloadContext';
import { useBotService } from '@/context/BotServiceContext';

// Import other hooks and utilities you use for fetching LP data
import { useWallet } from '@solana/wallet-adapter-react';

export default function TradingBotsPage() {
    const { publicKey, sendTransaction } = useWallet();
    const { isLogicEnabled, setIsLogicEnabled } = useBotLogic();
    const { logs, append } = useGlobalLogs();
    const { network, rpcUrl, connection } = useNetwork();
    const { allBotsByNetwork, setAllBotsByNetwork } = useContext(BotContext);
    const [creationState, setCreationState] = useState<'idle' | 'processing'>('idle');
    const { reloadWallets } = useBotWalletReload();

    // FIX: Get the setter function from the context
    const { tokenAddress, isLpActive, setIsLpActive, setTokenAddress } = useToken();

    const currentBots = allBotsByNetwork[network];
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
         wallets: Keypair[],
        totalSol: number,
         duration: number
    ) => {
        setCreationState('processing');
         // Use an intermediate wallet to reduce Phantom confirmations
        distributeFunds(wallets, totalSol, duration, true);
        addLog(`Started wallet creation on ${network} via ${rpcUrl}`);
    };

    const { removeBot } = useBotService();

    const handleClearAll = () => {
        const wallets = loadBotWallets(network);
        wallets.forEach(w => removeBot(w.publicKey.toBase58()));
        clearBotWallets(network);
        reloadWallets();
        addLog('Cleared all bot wallets.');
    };

      const distributeFunds = async (
        wallets: Keypair[],
        totalSol: number,
        durationMinutes: number,
        useIntermediate: boolean = false,
    ) => {
        console.log('[TradingBotsPage] distributeFunds started');
        const baseAmount = totalSol / wallets.length;
        const amounts = wallets.map(() => baseAmount * (0.9 + Math.random() * 0.2));
        const diff = totalSol - amounts.reduce((a, b) => a + b, 0);
        amounts[amounts.length - 1] += diff;

        const scheduleTimes: number[] = [];
        const baseDelay = (durationMinutes * 60 * 1000) / wallets.length;
        for (let i = 0; i < wallets.length; i++) {
            scheduleTimes.push(baseDelay * i + Math.random() * baseDelay * 0.5);
        }

        if (!useIntermediate) {
            // Save wallets immediately when no intermediate wallet is used so
            // any failures during funding don't lose the generated keypairs.
            saveBotWallets(network, wallets);
            reloadWallets();
        }

        let intermediateWallet: Keypair | null = null;

        if (useIntermediate) {
            // Create an intermediate wallet used purely to stage funds before
            // distributing them. This wallet exists for compliance/legal reasons
            // and allows us to confirm a single Phantom transaction.
            intermediateWallet = Keypair.generate();

            try {
                // Buffer a small amount to cover transaction fees for each wallet
                // Increase the buffer to avoid failures when network fees spike
                const feeBufferLamports = 10000 * wallets.length; 
                const fundTx = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey!,
                        toPubkey: intermediateWallet.publicKey,
                       lamports: Math.round(totalSol * LAMPORTS_PER_SOL) + feeBufferLamports,
                    }),
                );
                const sig = await sendTransaction(fundTx, connection);
                await connection.confirmTransaction(sig, 'confirmed');
                addLog(`Funded intermediate wallet ${intermediateWallet.publicKey.toBase58()}`);
                 // Save wallets immediately after staging funds to avoid losing them
                // if any subsequent transfer fails. They will be saved again at the end
                // once all transfers complete.
                saveBotWallets(network, wallets);
                reloadWallets();
            } catch (err: any) {
                if (err instanceof SendTransactionError) {
                    let logs = err.logs;
                    if (!logs && typeof err.getLogs === 'function') {
                        try {
                            logs = await err.getLogs(connection);
                        } catch (_) {
                            // ignore errors when fetching logs
                        }
                    }
                    const logStr = logs?.join('\n');
                    addLog(
                        `Error funding intermediate wallet: ${err.message}${logStr ? `\n${logStr}` : ''}`,
                    );
                } else {
                    addLog(`Error funding intermediate wallet: ${err.message}`);
                }
                setCreationState('idle');
                return;
            }
        }

        const run = async (i: number) => {
            const amount = amounts[i];
            const lamports = Math.round(amount * LAMPORTS_PER_SOL);
            try {
                 if (!useIntermediate) {
                    const balance = await connection.getBalance(publicKey!);
                    const required = totalSol * LAMPORTS_PER_SOL;
                    if (balance < required) {
                        addLog('Insufficient balance to fund wallets.');
                        setCreationState('idle');
                        return;
                    }
                }

                let sig: string;
                if (useIntermediate && intermediateWallet) {
                    const tx = new Transaction().add(
                        SystemProgram.transfer({
                            fromPubkey: intermediateWallet.publicKey,
                            toPubkey: wallets[i].publicKey,
                            lamports,
                        })
                    );
                    sig = await sendAndConfirmTransaction(connection, tx, [intermediateWallet]);
                } else {
                    const tx = new Transaction().add(
                        SystemProgram.transfer({
                            fromPubkey: publicKey!,
                            toPubkey: wallets[i].publicKey,
                            lamports,
                        })
                    );
                    sig = await sendTransaction(tx, connection);
                    await connection.confirmTransaction(sig, 'confirmed');
                }
                addLog(
                    `Transferred ${amount.toFixed(4)} SOL to trading wallet ${wallets[i].publicKey.toBase58()}`,
                );
                // Refresh balances after each successful transfer so the UI
                // reflects updated wallet states immediately
                reloadWallets();

                if (i === wallets.length - 1) {
                    saveBotWallets(network, wallets);
                    reloadWallets();
                    addLog(`Saved ${wallets.length} trading wallets`);
                    setCreationState('idle');
                    console.log('[TradingBotsPage] distributeFunds completed'); 
                }
            } catch (err: any) {
                 if (err instanceof SendTransactionError) {
                    let logs = err.logs;
                    if (!logs && typeof err.getLogs === 'function') {
                        try {
                            logs = await err.getLogs(connection);
                        } catch (_) {
                            // ignore errors when fetching logs
                        }
                    }
                    const logStr = logs?.join('\n');
                    addLog(
                        `Error funding wallet ${i + 1}: ${err.message}${logStr ? `\n${logStr}` : ''}`,
                    );
                } else {
                    addLog(`Error funding wallet ${i + 1}: ${err.message}`);
                }
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
                         distributeFunds={handleStartCreation}
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
                   bots={currentBots} 
                />
            </main>
        </div>
    );
}