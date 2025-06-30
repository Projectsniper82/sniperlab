'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetwork } from '@/context/NetworkContext';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import TradingBot from './TradingBot';
import {
    generateBotWallet,
    saveBotWallets,
    loadBotWallets,
    clearBotWallets,
} from '@/utils/botWalletManager';
import { useBotService } from '@/context/BotServiceContext';
import { useBotLogic } from '@/context/BotLogicContext';
import { useBotWalletReload } from '@/context/BotWalletReloadContext';
import { useBotContext, BotInstance } from '@/context/BotContext';
import { compileStrategy } from '@/utils/tradingStrategy';
import { useChartData } from '@/context/ChartDataContext';


// Define the props the BotManager will accept from the page

interface BotManagerProps {
    selectedTokenAddress: string;
    isLpActive: boolean;
    bots: BotInstance[];
}

export default function BotManager({ selectedTokenAddress, isLpActive, bots }: BotManagerProps) {
   const { connection, network, rpcUrl } = useNetwork();
    const { publicKey: userPublicKey, sendTransaction } = useWallet();
    const { addBot, removeBot, startBot, stopBot } = useBotService();
    const { isLogicEnabled } = useBotLogic();
    const { registerReloader } = useBotWalletReload();
    const { setAllBotsByNetwork, isTradingActive, startTrading, stopTrading, botCode } = useBotContext();
    const { lastPrice, currentMarketCap, currentLpValue, solUsdPrice } = useChartData();
    const [botWallets, setBotWallets] = useState<Keypair[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const loaded = loadBotWallets(network);
        setBotWallets(loaded);
        // sync loaded wallets with global context
        setAllBotsByNetwork(prev => ({
            ...prev,
             [network]: loaded.map(w => ({ id: w.publicKey.toBase58(), secret: Array.from(w.secretKey) }))
        }));
        setIsLoading(false);
        registerReloader(() => {
            const refreshed = loadBotWallets(network);
            setBotWallets(refreshed);
            setAllBotsByNetwork(prev => ({
                ...prev,
                [network]: refreshed.map(w => ({ id: w.publicKey.toBase58(), secret: Array.from(w.secretKey) }))
            }));
        });
    }, [network, registerReloader, setAllBotsByNetwork]);

    useEffect(() => {
        botWallets.forEach(w => addBot(w));
    }, [botWallets, addBot]);

    useEffect(() => {
        const strategy = compileStrategy(botCode);
        const context = {
            rpcUrl,
            market: {
                lastPrice,
                currentMarketCap,
                currentLpValue,
                solUsdPrice,
            },
        };
        if (isTradingActive) {
            botWallets.forEach(w => startBot(w.publicKey.toBase58(), strategy, context));
        } else {
            botWallets.forEach(w => stopBot(w.publicKey.toBase58()));
        }
    }, [isTradingActive, botWallets, botCode, startBot, stopBot, rpcUrl, lastPrice, currentMarketCap, currentLpValue, solUsdPrice]);

    const handleCreateBotWallet = async () => {
        const newWallet = generateBotWallet();
        const updated = [...botWallets, newWallet];
        try {
            await saveBotWallets(network, updated);
            setBotWallets(updated);
            // update global bot list
         setAllBotsByNetwork(prev => ({
                ...prev,
                [network]: [...prev[network], { id: newWallet.publicKey.toBase58(), secret: Array.from(newWallet.secretKey) }]
            }));
        } catch (error: any) {
            alert(error?.message || 'Failed to save bot wallets.');
        }
    };

        const confirmAndClearWallets = () => {
        botWallets.forEach(w => removeBot(w.publicKey.toBase58()));
        clearBotWallets(network);
        setBotWallets([]);
        setAllBotsByNetwork(prev => ({ ...prev, [network]: [] }));
        setShowConfirmModal(false);
    };

    const handleClearBotWallets = async () => {
        let hasBalance = false;
        for (const w of botWallets) {
            const sol = await connection.getBalance(w.publicKey);
            if (sol > 0) { hasBalance = true; break; }
            const tokens = await connection.getParsedTokenAccountsByOwner(w.publicKey, { programId: TOKEN_PROGRAM_ID });
            const nonZero = tokens.value.some(t => (t.account.data as any).parsed.info.tokenAmount.uiAmount > 0);
            if (nonZero) { hasBalance = true; break; }
        }
        if (hasBalance) {
            setShowConfirmModal(true);
            return;
        }
        if (window.confirm("Are you sure? This will permanently delete all bot wallets for this network.")) {
               confirmAndClearWallets();
        }
    };

    const createFundHandler = useCallback((wallet: Keypair) => async (amount: number): Promise<string> => {
        if (network === 'devnet') {
            const lamports = Math.round(amount * LAMPORTS_PER_SOL);
            const sig = await connection.requestAirdrop(wallet.publicKey, lamports);
            await connection.confirmTransaction(sig, 'confirmed');
            return sig;
        }
        if (!userPublicKey || !sendTransaction) throw new Error('User wallet not connected.');
        const lamports = Math.round(amount * LAMPORTS_PER_SOL);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userPublicKey,
                toPubkey: wallet.publicKey,
                lamports,
            })
        );
        const sig = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(sig, 'confirmed');
        return sig;
    }, [userPublicKey, sendTransaction, connection, network]);

    const createWithdrawHandler = useCallback((wallet: Keypair) => async (recipientAddress: string, amount: number): Promise<string> => {
        const recipientPublicKey = new PublicKey(recipientAddress);
         const lamports = Math.round(amount * LAMPORTS_PER_SOL);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipientPublicKey,
                lamports,
            })
        );
        return await sendAndConfirmTransaction(connection, transaction, [wallet]);
    }, [connection]);

    const createWithdrawTokenHandler = useCallback((wallet: Keypair) => async (recipientAddress: string, amount: number, mintAddress: string): Promise<string> => {
        if (!mintAddress) throw new Error('Token to withdraw has not been specified.');

        const mintPublicKey = new PublicKey(mintAddress);
        const recipientPublicKey = new PublicKey(recipientAddress);

        const fromAta = await getOrCreateAssociatedTokenAccount(connection, wallet, mintPublicKey, wallet.publicKey);
        const toAta = await getOrCreateAssociatedTokenAccount(connection, wallet, mintPublicKey, recipientPublicKey);

        const tokenInfo = await connection.getParsedAccountInfo(mintPublicKey);
        const decimals = (tokenInfo.value?.data as any)?.parsed?.info?.decimals ?? 0;

        const transaction = new Transaction().add(
            createTransferInstruction(fromAta.address, toAta.address, wallet.publicKey, amount * Math.pow(10, decimals))
        );
        return await sendAndConfirmTransaction(connection, transaction, [wallet]);
    }, [connection]);


    if (isLoading) {
        return <div className="text-center p-8 text-gray-400">Loading Bot Wallet...</div>;
    }

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                    <h2 className="text-xl font-bold text-white mb-3">
                        Bot Wallet Management ({network})
                    </h2>
                    <div className='flex items-center justify-between'>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-300">
                                Token:
                                <span className="font-mono text-xs text-white ml-1 break-all">{selectedTokenAddress || 'N/A'}</span>
                            </p>
                            <p className="text-sm text-gray-300">
                                LP Active:
                                <span className={`ml-1 font-bold ${isLpActive ? 'text-green-400' : 'text-red-400'}`}>{isLpActive ? 'Yes' : 'No'}</span>
                            </p>
                            <p className="text-sm text-green-400">
                                {botWallets.length > 0 ? `${botWallets.length} wallet(s) loaded.` : `No bot wallets found for ${network}.`}
                            </p>
                        </div>
                        <div className='space-x-2'>
                            <button onClick={handleCreateBotWallet} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">
                                Add Wallet
                            </button>
                            {botWallets.length > 0 && (
                                <button onClick={handleClearBotWallets} className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded">
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">Bots for {network}</h3>
                    <div className='space-x-2 mb-2'>
                        <button onClick={() => setAllBotsByNetwork(prev => ({
                                ...prev,
                                 [network]: [...prev[network], { id: crypto.randomUUID(), secret: [] }]
                            }))}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">
                            Add Bot
                        </button>
                    </div>
                    {bots.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
                            {bots.map(b => (
                                <li key={b.id} className="font-mono break-all">{b.id}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm">No bots created for this network.</p>
                    )}
                </div>

                 {isLogicEnabled && (
                    <div className="mb-6">
                        <button
                            onClick={() =>
                                isTradingActive ? stopTrading() : startTrading()
                            }
                            className={`w-full px-4 py-2 font-bold rounded ${isTradingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                        >
                            {isTradingActive ? 'Stop Trading' : 'Start Trading'}
                        </button>
                    </div>
                )}
                {botWallets.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {botWallets.map((wallet, idx) => (
                            <TradingBot
                                key={wallet.publicKey.toBase58()}
                                botWallet={wallet}
                                botPublicKeyString={wallet.publicKey.toBase58()}
                                index={idx + 1}
                                onFund={createFundHandler(wallet)}
                                onWithdraw={createWithdrawHandler(wallet)}
                                onWithdrawToken={createWithdrawTokenHandler(wallet)}
                                tokenMintAddress={selectedTokenAddress}
                                isLogicEnabled={isLogicEnabled}
                                selectedTokenAddress={selectedTokenAddress}
                                isLpActive={isLpActive}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-800 rounded-lg">
                        <p className="text-gray-400">Create a bot wallet to begin trading.</p>
                    </div>
                )}
            </div>
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg text-center space-y-4">
                        <p className="text-white">Some bot wallets still hold SOL or tokens. Withdraw funds before deleting. Continue anyway?</p>
                        <div className="space-x-2">
                            <button onClick={() => setShowConfirmModal(false)} className="px-3 py-1 bg-gray-700 text-white rounded">Cancel</button>
                            <button onClick={confirmAndClearWallets} className="px-3 py-1 bg-red-800 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
