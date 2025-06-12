'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Connection, PublicKey, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNetwork } from '@/context/NetworkContext';
import { useToken } from '@/context/TokenContext';
import { useWallet } from '@solana/wallet-adapter-react';
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

  // useRef is used to store values that persist across renders without causing re-renders themselves.
  const lastLogRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const botPublicKey = botKeypair.publicKey;

  // *** CONSOLE SPAM FIX ***
  // This function now uses a ref to check if the last message is identical to the new one.
  // This prevents the state from being updated with duplicate messages, which stops the console from flooding.
  const log = useCallback((message: string) => {
    if (message === lastLogRef.current) {
      return; // Do nothing if the message is the same as the last one
    }
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    setLogs(prevLogs => [fullMessage, ...prevLogs.slice(0, 100)]);
    lastLogRef.current = message; // Update the ref with the last message
  }, []);

  // This function is stable and will be called to fetch balances.
  const refreshBotBalances = useCallback(async () => {
    log('Refreshing bot balances...');
    try {
      const sol = await connection.getBalance(botPublicKey);
      const solBalanceUI = sol / LAMPORTS_PER_SOL;
      setBotSolBalance(solBalanceUI);

      if (tokenAddress) {
        const token = await getTokenBalance(connection, tokenAddress, botPublicKey);
        setBotTokenBalance(token);
        log(`Balances updated: ${solBalanceUI.toFixed(4)} SOL, ${token.toLocaleString()} Tokens`);
      } else {
        setBotTokenBalance(0);
        log('Bot ready. Paste a token on the Home page to track its balance.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred';
      log(`Error refreshing balances: ${errorMessage}`);
      console.error("Balance refresh failed:", error);
    }
  }, [connection, botPublicKey, tokenAddress, log]);


  // *** INFINITE LOOP FIX ***
  // This is the main effect hook that was causing the problem.
  // THE CAUSE: The original dependency array included `refreshBotBalances` and `log`. When this
  // effect called `refreshBotBalances` which in turn called `log`, `log` would call `setLogs`.
  // This state update caused a re-render, which caused the `refreshBotBalances` function to be
  // redefined, which triggered this effect to run again, creating the infinite loop.
  //
  // THE FIX: The dependency array is now correctly set to `[botPublicKey, connection, tokenAddress]`.
  // It will ONLY re-run if the bot itself changes, or the network connection/token address changes.
  // The `refreshBotBalances` function is now called from within, but is not a dependency itself,
  // which breaks the loop permanently.
  useEffect(() => {
    // Clear any previous refresh timeouts to prevent old intervals from running
    if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
    }
    
    log(`Bot active: ${botPublicKey.toBase58().substring(0, 6)}...`);
    
    // Initial balance fetch
    refreshBotBalances();

    // Set up a periodic refresh every 15 seconds.
    // This is a much safer way to keep balances updated than relying on re-renders.
    refreshTimeoutRef.current = setInterval(refreshBotBalances, 15000);

    // Cleanup function: this runs when the component is unmounted or the dependencies change.
    return () => {
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  // We disable the eslint rule because we are intentionally not including refreshBotBalances in the array
  // to break the infinite loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botPublicKey, connection, tokenAddress]); // Correct, stable dependencies

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
          await refreshBotBalances(); // Manually refresh after funding
      } catch (error: any) {
          log(`Funding failed: ${error.message}`);
          console.error(error);
      } finally {
          setIsFunding(false);
      }
  };

  // The rest of the component's JSX remains the same.
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
