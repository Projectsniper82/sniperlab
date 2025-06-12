'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetwork } from '@/context/NetworkContext';
import TradingBot from './TradingBot';
import { generateBotWallet, saveBotWallet, loadBotWallet, clearBotWallet } from '@/utils/botWalletManager';

/**
 * Reworked BotManager Component
 *
 * This component is now the single source of truth for the bot's Keypair.
 * It manages the bot's lifecycle and provides stable props to its children.
 * It no longer passes the unstable Keypair object down.
 */
export default function BotManager() {
  const { connection, network } = useNetwork();
  const { publicKey: userPublicKey, sendTransaction } = useWallet();
  const [botKeypair, setBotKeypair] = useState<Keypair | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load the bot wallet from localStorage whenever the network changes.
  useEffect(() => {
    console.log(`[BotManager] Network changed to: ${network}. Attempting to load wallet.`);
    setIsLoading(true);
    const loadedWallet = loadBotWallet(network);
    setBotKeypair(loadedWallet);
    setIsLoading(false);
    if (loadedWallet) {
      console.log(`[BotManager] Wallet loaded successfully: ${loadedWallet.publicKey.toBase58()}`);
    } else {
      console.log(`[BotManager] No wallet found for ${network}.`);
    }
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

  /**
   * ARCHITECTURAL FIX: The funding logic now lives in the parent component that owns the secret key.
   * This function is wrapped in `useCallback` to ensure it is stable and doesn't cause
   * re-renders in the child component.
   */
  const handleFundBot = useCallback(async (amount: number): Promise<string> => {
    if (!userPublicKey || !botKeypair || !sendTransaction) {
        const errorMsg = "[BotManager] Cannot fund: User wallet or bot wallet not ready.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    console.log(`[BotManager] Preparing to fund bot ${botKeypair.publicKey.toBase58()} with ${amount} SOL.`);
    
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: userPublicKey,
            toPubkey: botKeypair.publicKey,
            lamports: amount * LAMPORTS_PER_SOL,
        })
    );
    
    // We use the main wallet's `sendTransaction` utility, which handles signing and sending.
    const signature = await sendTransaction(transaction, connection, { skipPreflight: true });
    console.log(`[BotManager] Funding transaction sent. Signature: ${signature}`);
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`[BotManager] Funding transaction confirmed.`);
    return signature;
  }, [userPublicKey, botKeypair, connection, sendTransaction]);

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
          // ARCHITECTURAL FIX: Use the public key string as the React `key`.
          // This is critical. It tells React to unmount the old component and mount a
          // fresh instance whenever the bot's public key actually changes.
          key={botKeypair.publicKey.toBase58()}
          // ARCHITECTURAL FIX: Pass the public key as a string. Primitives are stable.
          botPublicKeyString={botKeypair.publicKey.toBase58()}
          // ARCHITECTURAL FIX: Pass the stable funding handler down.
          onFund={handleFundBot}
        />
      ) : (
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Create a bot wallet to begin trading.</p>
        </div>
      )}
    </div>
  );
}