'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNetwork } from '@/context/NetworkContext';
import { useToken } from '@/context/TokenContext';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { getTokenBalance } from '@/utils/solanaUtils';

interface TradingBotProps {
  botKeypair: Keypair;
}

export default function TradingBot({ botKeypair }: TradingBotProps) {
  const { connection } = useNetwork();
  const { tokenAddress } = useToken();
  const { publicKey: userPublicKey, signTransaction } = useWallet();

  const [logs, setLogs] = useState<string[]>([]);
  const [isTrading, setIsTrading] = useState(false);
  const [botSolBalance, setBotSolBalance] = useState(0);
  const [botTokenBalance, setBotTokenBalance] = useState(0);
  const [isFunding, setIsFunding] = useState(false);

  const botPublicKey = botKeypair.publicKey;

  // This function is now stable
  const log = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs.slice(0, 100)]);
  }, []); 

  // This function is now stable
  const refreshBotBalances = useCallback(async () => {
    log('Refreshing bot balances...');
    try {
      const sol = await connection.getBalance(botPublicKey);
      setBotSolBalance(sol / LAMPORTS_PER_SOL);
      
      if (tokenAddress) {
        const token = await getTokenBalance(connection, tokenAddress, botPublicKey);
        setBotTokenBalance(token);
        log(`Balances updated: ${(sol / LAMPORTS_PER_SOL).toFixed(4)} SOL, ${token.toLocaleString()} Tokens`);
      } else {
        log(`SOL Balance updated: ${(sol / LAMPORTS_PER_SOL).toFixed(4)}`);
      }
    } catch (error: any) {
      log(`Error refreshing balances: ${error.message}`);
      console.error(error);
    }
  }, [connection, botPublicKey, tokenAddress, log]);

  // This useEffect will now only run when the bot's public key changes (i.e., when a new bot is loaded)
  useEffect(() => {
    log(`Bot active: ${botPublicKey.toBase58().substring(0, 6)}...`);
    refreshBotBalances();
  }, [botPublicKey, refreshBotBalances, log]);
  
  const handleFundBot = async () => {
      if (!userPublicKey || !signTransaction) {
          log("Main wallet not connected or cannot sign.");
          return;
      }
      const amountStr = window.prompt("How much SOL to send to the bot?", "0.1");
      if (!amountStr) return;

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
          log("Invalid amount.");
          return;
      }
      
      setIsFunding(true);
      log(`Funding bot with ${amount} SOL...`);
      try {
          const transaction = new Transaction().add(
              SystemProgram.transfer({
                  fromPubkey: userPublicKey,
                  toPubkey: botPublicKey,
                  lamports: amount * LAMPORTS_PER_SOL,
              })
          );
          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = userPublicKey;

          const signed = await signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signed.serialize());
          await connection.confirmTransaction(signature, 'confirmed');

          log(`Funding successful! TX: ${signature.substring(0, 10)}...`);
          await refreshBotBalances();
      } catch (error: any) {
          log(`Funding failed: ${error.message}`);
          console.error(error);
      } finally {
          setIsFunding(false);
      }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
      <div className="flex justify-between items-start">
        <div>
            <h4 className="font-bold text-white">Trading Bot</h4>
            <p className="text-xs font-mono text-gray-400 break-all">{botPublicKey.toBase58()}</p>
        </div>
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
                <label htmlFor={`trading-toggle-${botPublicKey.toBase58()}`} className="text-xs text-gray-300">
                    Auto-Trade
                </label>
                <button
                    onClick={() => setIsTrading(!isTrading)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isTrading ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                    id={`trading-toggle-${botPublicKey.toBase58()}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isTrading ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
            </div>
            <button
                onClick={handleFundBot}
                disabled={isFunding || !userPublicKey}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded disabled:bg-gray-500"
            >
                {isFunding ? 'Funding...' : 'Fund Bot'}
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-900 p-2 rounded">
            <p className="text-xs text-gray-400">Bot SOL Balance</p>
            <p className="text-lg font-semibold text-white">{botSolBalance.toFixed(4)}</p>
        </div>
         <div className="bg-gray-900 p-2 rounded">
            <p className="text-xs text-gray-400">Bot Token Balance</p>
            <p className="text-lg font-semibold text-white">{botTokenBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-black p-2 rounded-md h-32 overflow-y-auto font-mono text-xs text-gray-300">
        {logs.map((logMsg, i) => (
          <p key={i}>{logMsg}</p>
        ))}
      </div>
    </div>
  );
}