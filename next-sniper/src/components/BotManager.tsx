'use client';

import React, { useState, useEffect } from 'react';
import { Keypair } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetwork } from '@/context/NetworkContext';
import TradingBot from './TradingBot';
import { generateBotWallet, saveBotWallet, loadBotWallet, clearBotWallet } from '@/utils/botWalletManager';

export default function BotManager() {
  const { connection, network } = useNetwork();
  const userWallet = useWallet(); // Get the main user wallet state
  const [botWallet, setBotWallet] = useState<Keypair | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadedWallet = loadBotWallet(network);
    setBotWallet(loadedWallet);
    setIsLoading(false);
  }, [network]);

  const handleCreateBotWallet = () => {
    if (window.confirm("Are you sure? This will overwrite any existing bot wallet for this network.")) {
        const newWallet = generateBotWallet();
        saveBotWallet(network, newWallet);
        setBotWallet(newWallet);
    }
  };

  const handleClearBotWallet = () => {
    if (window.confirm("Are you sure? This will permanently delete the current bot wallet for this network.")) {
        clearBotWallet(network);
        setBotWallet(null);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8 text-gray-400">Loading Bot Wallet...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-3">
          Bot Wallet Management ({network})
        </h2>
        {botWallet ? (
          <div className='flex items-center justify-between'>
            <p className="text-sm text-green-400">
              Bot wallet loaded: <span className='font-mono text-xs text-gray-300'>{botWallet.publicKey.toBase58()}</span>
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

      {botWallet ? (
        <TradingBot
          key={botWallet.publicKey.toBase58()}
          botKeypair={botWallet}
          userWallet={userWallet} // Pass the main user wallet down
          connection={connection}
          network={network}
        />
      ) : (
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Create a bot wallet to begin trading.</p>
        </div>
      )}
    </div>
  );
}