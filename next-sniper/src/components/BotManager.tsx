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

// Define the props the BotManager will accept from the page

interface BotManagerProps {
    selectedTokenAddress: string;
    isLpActive: boolean;
}

export default function BotManager({ selectedTokenAddress, isLpActive }: BotManagerProps) {
    const { connection, network } = useNetwork();
    const { publicKey: userPublicKey, sendTransaction } = useWallet();
    const { addBot, removeBot, startBot, stopBot } = useBotService();
    const { isLogicEnabled } = useBotLogic();
    const [botWallets, setBotWallets] = useState<Keypair[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const loaded = loadBotWallets(network);
        setBotWallets(loaded);
        setIsLoading(false);
    }, [network]);

    useEffect(() => {
        botWallets.forEach(w => addBot(w));
    }, [botWallets, addBot]);

    useEffect(() => {
        botWallets.forEach(w => {
            const id = w.publicKey.toBase58();
            if (isLogicEnabled) startBot(id); else stopBot(id);
        });
    }, [isLogicEnabled, botWallets, startBot, stopBot]);

    const handleCreateBotWallet = () => {
        const newWallet = generateBotWallet();
        const updated = [...botWallets, newWallet];
        saveBotWallets(network, updated);
        setBotWallets(updated);
    };

        const confirmAndClearWallets = () => {
        botWallets.forEach(w => removeBot(w.publicKey.toBase58()));
        clearBotWallets(network);
        setBotWallets([]);
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
            const sig = await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(sig, 'confirmed');
            return sig;
        }
        if (!userPublicKey || !sendTransaction) throw new Error('User wallet not connected.');
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userPublicKey,
                toPubkey: wallet.publicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        const sig = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(sig, 'confirmed');
        return sig;
    }, [userPublicKey, sendTransaction, connection, network]);

    const createWithdrawHandler = useCallback((wallet: Keypair) => async (recipientAddress: string, amount: number): Promise<string> => {
        const recipientPublicKey = new PublicKey(recipientAddress);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipientPublicKey,
                lamports: amount * LAMPORTS_PER_SOL,
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
            <div className="max-w-4xl mx-auto">
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

                {botWallets.length > 0 ? (
                    botWallets.map(wallet => (
                        <TradingBot
                            key={wallet.publicKey.toBase58()}
                            botWallet={wallet}
                            botPublicKeyString={wallet.publicKey.toBase58()}
                            onFund={createFundHandler(wallet)}
                            onWithdraw={createWithdrawHandler(wallet)}
                            onWithdrawToken={createWithdrawTokenHandler(wallet)}
                            tokenMintAddress={selectedTokenAddress}
                            isLogicEnabled={isLogicEnabled}
                            selectedTokenAddress={selectedTokenAddress}
                            isLpActive={isLpActive}
                        />
                    ))
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
