'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetwork } from '@/context/NetworkContext';
import { useToken } from '@/context/TokenContext';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import TradingBot from './TradingBot';
import { generateBotWallet, saveBotWallet, loadBotWallet, clearBotWallet } from '@/utils/botWalletManager';

// Define the props the BotManager will accept from the page
interface BotManagerProps {
    isLogicEnabled: boolean;
}

export default function BotManager({ isLogicEnabled }: BotManagerProps) {
    const { connection, network } = useNetwork();
    const { publicKey: userPublicKey, sendTransaction } = useWallet();
    const { tokenAddress } = useToken();
    const [botKeypair, setBotKeypair] = useState<Keypair | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const loadedWallet = loadBotWallet(network);
        setBotKeypair(loadedWallet);
        setIsLoading(false);
    }, [network]);

    const handleCreateBotWallet = () => {
        if (window.confirm("Are you sure? This will overwrite any existing bot wallet for this network.")) {
            const newWallet = generateBotWallet();
            saveBotWallet(network, newWallet);
            setBotKeypair(newWallet);
        }
    };

    const handleClearBotWallet = () => {
        if (window.confirm("Are you sure? This will permanently delete the current bot wallet for this network.")) {
            clearBotWallet(network);
            setBotKeypair(null);
        }
    };

    const handleFundBot = useCallback(async (amount: number): Promise<string> => {
        if (!botKeypair) throw new Error("Bot wallet not ready.");

        if (network === 'devnet') {
            const signature = await connection.requestAirdrop(botKeypair.publicKey, amount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature, 'confirmed');
            return signature;
        }

        if (!userPublicKey || !sendTransaction) throw new Error("User wallet not connected.");
        
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userPublicKey,
                toPubkey: botKeypair.publicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'confirmed');
        return signature;

    }, [userPublicKey, botKeypair, connection, sendTransaction, network]);

    const handleWithdrawFromBot = useCallback(async (recipientAddress: string, amount: number): Promise<string> => {
        if (!botKeypair) throw new Error("Bot wallet not ready.");
        const recipientPublicKey = new PublicKey(recipientAddress);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: botKeypair.publicKey,
                toPubkey: recipientPublicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        return await sendAndConfirmTransaction(connection, transaction, [botKeypair]);
    }, [botKeypair, connection]);
    
    const handleWithdrawTokenFromBot = useCallback(async (recipientAddress: string, amount: number, mintAddress: string): Promise<string> => {
        if (!botKeypair) throw new Error("Bot wallet not ready.");
        if (!mintAddress) throw new Error("Token to withdraw has not been specified.");

        const mintPublicKey = new PublicKey(mintAddress);
        const recipientPublicKey = new PublicKey(recipientAddress);
        
        const fromAta = await getOrCreateAssociatedTokenAccount(connection, botKeypair, mintPublicKey, botKeypair.publicKey);
        const toAta = await getOrCreateAssociatedTokenAccount(connection, botKeypair, mintPublicKey, recipientPublicKey);

        const tokenInfo = await connection.getParsedAccountInfo(mintPublicKey);
        const decimals = (tokenInfo.value?.data as any)?.parsed?.info?.decimals ?? 0;

        const transaction = new Transaction().add(
            createTransferInstruction(fromAta.address, toAta.address, botKeypair.publicKey, amount * Math.pow(10, decimals))
        );

        return await sendAndConfirmTransaction(connection, transaction, [botKeypair]);

    }, [botKeypair, connection]);


    if (isLoading) {
        return <div className="text-center p-8 text-gray-400">Loading Bot Wallet...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-white mb-3">
                    Bot Wallet Management ({network})
                </h2>
                {botKeypair ? (
                    <div className='flex items-center justify-between'>
                        <p className="text-sm text-green-400">
                            Bot wallet loaded: <span className='font-mono text-xs text-gray-300'>{botKeypair.publicKey.toBase58()}</span>
                        </p>
                        <button onClick={handleClearBotWallet} className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded">
                            Clear Wallet
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center justify-between'>
                        <p className="text-sm text-yellow-400">No bot wallet found for {network}.</p>
                        <button onClick={handleCreateBotWallet} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">
                            Create New Bot Wallet
                        </button>
                    </div>
                )}
            </div>

            {botKeypair ? (
                <TradingBot
                    key={botKeypair.publicKey.toBase58()}
                    botPublicKeyString={botKeypair.publicKey.toBase58()}
                    onFund={handleFundBot}
                    onWithdraw={handleWithdrawFromBot}
                    onWithdrawToken={handleWithdrawTokenFromBot}
                    tokenMintAddress={tokenAddress}
                    isLogicEnabled={isLogicEnabled} // Pass the prop down to the bot instance
                />
            ) : (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">Create a bot wallet to begin trading.</p>
                </div>
            )}
        </div>
    );
}