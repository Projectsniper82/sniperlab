'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNetwork } from '@/context/NetworkContext';
import { useToken } from '@/context/TokenContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { getTokenBalance } from '@/utils/solanaUtils';

/**
 * Reworked TradingBot Component
 *
 * This component is now "dumber". It only knows about a bot's public key (as a string)
 * and receives a function to call when the user wants to fund it.
 * This decouples it from its parent and makes it stable.
 */
interface TradingBotProps {
  botPublicKeyString: string; // Receive the public key as a STABLE string.
  onFund: (amount: number) => Promise<string>; // Receive a STABLE callback for funding.
}

export default function TradingBot({ botPublicKeyString, onFund }: TradingBotProps) {
  console.log(`[TradingBot] Component is rendering for bot: ${botPublicKeyString.substring(0, 6)}...`);

  // Get dependencies from context
  const { connection } = useNetwork();
  const { tokenAddress } = useToken();
  const { publicKey: userPublicKey } = useWallet();

  // Component state
  const [logs, setLogs] = useState<string[]>([]);
  const [isTrading, setIsTrading] = useState(false);
  const [botSolBalance, setBotSolBalance] = useState(0);
  const [botTokenBalance, setBotTokenBalance] = useState(0);
  const [isFunding, setIsFunding] = useState(false);

  // Refs for stability
  const lastLogRef = useRef<string | null>(null);

  // Create a stable PublicKey object from the string prop. This only re-runs if the string changes.
  const botPublicKey = useMemo(() => new PublicKey(botPublicKeyString), [botPublicKeyString]);

  // Stable logger to prevent console spam
  const log = useCallback((message: string) => {
    // This check prevents the same message from flooding the log state and causing re-renders.
    if (message === lastLogRef.current) return;
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    console.log(`[TRADING BOT LOG] ${message}`); // Log to console for easier debugging.
    setLogs(prev => [fullMessage, ...prev.slice(0, 100)]);
    lastLogRef.current = message;
  }, []);

  // Stable balance fetcher
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
      log(`Error refreshing balances: ${error.message}`);
    }
  }, [connection, botPublicKey, tokenAddress, log]);

  // Main effect hook. This will now only run ONCE per bot, which is correct.
  useEffect(() => {
    console.log('[TradingBot useEffect] Running. This should only happen once per bot.');
    log(`Initializing bot...`);
    
    refreshBotBalances(); // Initial fetch
    
    // Set up polling for balance updates
    const intervalId = setInterval(refreshBotBalances, 30000); // Poll every 30 seconds
    console.log(`[TradingBot useEffect] Set new balance polling interval. ID: ${intervalId}`);

    // Cleanup function. This runs when the component unmounts (e.g., when the bot is changed).
    return () => {
      console.log(`[TradingBot Cleanup] Clearing interval ID: ${intervalId}`);
      clearInterval(intervalId);
    };
    // The dependency array is now stable.
  }, [botPublicKeyString, tokenAddress, refreshBotBalances, log]);


  const handleFundClick = async () => {
    if (!userPublicKey) {
        log("Cannot fund: Your main wallet is not connected.");
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
    log(`Sending ${amount} SOL funding request...`);
    try {
      const signature = await onFund(amount); // Call the stable callback from the parent
      log(`Funding transaction confirmed! TX: ${signature.substring(0,10)}...`);
      await refreshBotBalances(); // Manually refresh after confirmed funding
    } catch(error: any) {
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
            <p className="text-xs font-mono text-gray-400 break-all">{botPublicKeyString}</p>
        </div>
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
                <label htmlFor={`trading-toggle-${botPublicKeyString}`} className="text-xs text-gray-300">
                    Auto-Trade
                </label>
                <button
                    onClick={() => setIsTrading(!isTrading)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isTrading ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                    id={`trading-toggle-${botPublicKeyString}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isTrading ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
            </div>
            <button
                onClick={handleFundClick}
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
