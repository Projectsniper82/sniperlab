'use client';

import React, { useState } from 'react';
import AdvancedModeModal from './AdvancedModeModal';
import { useGlobalLogs } from '@/context/GlobalLogContext';
import { useBotContext } from '@/context/BotContext';
import { UserStrategy } from '@/context/BotLogicContext';

const DEFAULT_PRESET = `
// Basic example strategy. It buys 0.01 SOL worth of a token when the
// last observed price is below 0.5 SOL. Replace \`POOL_ID\` and token
// mint addresses with the market you want to trade.
exports.strategy = async (wallet, log, context) => {
  const { connection, market } = context ?? {};
  if (!wallet?.publicKey || !connection) {
    return log('wallet or connection unavailable');
  }
  if (!market || typeof market.lastPrice !== 'number') {
    return log('price data unavailable');
  }
 
if (market.lastPrice < 0.5) {
    const { createWalletAdapter } = await import('@/utils/walletAdapter');
    const { swapRaydiumTokens } = await import('@/utils/raydiumSdkAdapter');
    const { default: BN } = await import('bn.js');

    const adapter = createWalletAdapter(wallet, connection);
    const lamports = new BN(0.01 * 1e9); // spend 0.01 SOL
    const poolId = 'POOL_ID'; // update with your Raydium pool ID
    const wsol = 'So11111111111111111111111111111111111111112';
    try {
      await swapRaydiumTokens(adapter, connection, poolId, wsol, lamports, 0.01);
      log('buy order submitted');
    } catch (e) {
      log('buy failed: ' + (e?.message || e));
    }
  } else {
    log('price above threshold, no trade');
  }
};
// You can tweak the thresholds, amounts and pool/token addresses above
// to implement your own custom logic.`;

const MARKET_MAKER_PRESET = `
// Simple market making example. On each run it either buys or sells a
// tiny amount around the current price. Adjust the pool and mint
// addresses as well as the price spread to suit your needs.
exports.strategy = async (wallet, log, context) => {
  const { connection, market } = context ?? {};
  if (!wallet?.publicKey || !connection) {
    return log('wallet or connection unavailable');
  }
  if (!market || typeof market.lastPrice !== 'number') {
    return log('price data unavailable');
  }

  const { createWalletAdapter } = await import('@/utils/walletAdapter');
  const { swapRaydiumTokens } = await import('@/utils/raydiumSdkAdapter');
  const { default: BN } = await import('bn.js');

  const adapter = createWalletAdapter(wallet, connection);
  const poolId = 'POOL_ID'; // your Raydium pool
  const tokenMint = 'TOKEN_MINT';
  const wsol = 'So11111111111111111111111111111111111111112';

  const buyTarget = market.lastPrice * 0.95;  // 5% below market
  const sellTarget = market.lastPrice * 1.05; // 5% above market

  try {
    if (market.lastPrice <= buyTarget) {
      await swapRaydiumTokens(
        adapter,
        connection,
        poolId,
        wsol,
        new BN(0.005 * 1e9),
        0.01
      );
      log('market maker buy placed');
    } else if (market.lastPrice >= sellTarget) {
      await swapRaydiumTokens(
        adapter,
        connection,
        poolId,
        tokenMint,
        new BN(1),
        0.01
      );
      log('market maker sell placed');
    } else {
      log('within spread, nothing to do');
    }
  } catch (e) {
    log('market maker error: ' + (e?.message || e));
  }
};
// Modify the spread and trade sizes above to experiment with different
// market making behaviours.`;


// Define the props for the component
interface GlobalBotControlsProps {
    isLogicEnabled: boolean;
    onToggleLogic: (isEnabled: boolean) => void;
    botCode: string;
    setBotCode: (code: string) => void;
    onSelectPreset: (preset: string) => void;
    isAdvancedMode: boolean;
    onToggleAdvancedMode: (checked: boolean) => void;
    userStrategies: UserStrategy[];
    onSaveCurrentStrategy: (name: string) => void;
    onLoadStrategy: (id: string) => void;
    onDeleteStrategy: (id: string) => void;
}

export default function GlobalBotControls({
    isLogicEnabled,
    onToggleLogic,
    botCode,
    setBotCode,
    onSelectPreset,
    isAdvancedMode,
    onToggleAdvancedMode,
    userStrategies,
    onSaveCurrentStrategy,
    onLoadStrategy,
    onDeleteStrategy,
}: GlobalBotControlsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAdvancedModal, setShowAdvancedModal] = useState(false);
    const { startTrading, stopTrading, getSystemState } = useBotContext();
    const { append } = useGlobalLogs();

    const handleToggle = (checked: boolean) => {
        onToggleLogic(checked);
        if (checked) startTrading(); else stopTrading();
    };

    const handleAdvancedChange = (checked: boolean) => {
        if (checked) {
            setShowAdvancedModal(true);
        } else {
            onToggleAdvancedMode(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            { }
            <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-xl font-bold text-white">
                    Global Bot Controls
                </h2>
                <span className={`transition-transform transform text-white ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </div>
            
            {/* Content is conditionally rendered based on the expanded state */}
            {isExpanded && (
                <div className="p-4 border-t border-gray-600 space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="auto-trade-toggle" className="font-semibold text-gray-200">
                            Automated Trading Logic
                        </label>
                        <div className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="auto-trade-toggle"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    checked={isLogicEnabled}
                                    onChange={(e) => handleToggle(e.target.checked)} 
                                />
                                <div className={`block ${isLogicEnabled ? 'bg-green-600' : 'bg-gray-600'} w-14 h-8 rounded-full`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isLogicEnabled ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-white font-bold">{isLogicEnabled ? 'ON' : 'OFF'}</div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-1">Bot Code</label>
                        <textarea
                            className="w-full bg-gray-900 text-gray-200 p-2 rounded-md text-sm font-mono"
                            rows={6}
                            value={botCode}
                            onChange={(e) => setBotCode(e.target.value)}
                        />
                        <button
                            className="mt-2 px-2 py-1 text-sm bg-blue-700 rounded-md"
                            onClick={() => {
                                const name = prompt('Enter a name for this strategy:');
                                if (name) onSaveCurrentStrategy(name);
                            }}
                        >
                            Save Current Strategy
                        </button>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-1">Presets</h4>
                        <button
                            className="px-2 py-1 text-sm bg-gray-700 rounded-md"
                            onClick={() => onSelectPreset(DEFAULT_PRESET)}
                        >
                            Use Default Template
                        </button>
                        <button
                            className="px-2 py-1 text-sm bg-gray-700 rounded-md ml-2"
                            onClick={() => onSelectPreset(MARKET_MAKER_PRESET)}
                        >
                            Market Maker Logic
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="advanced-toggle"
                            type="checkbox"
                            checked={isAdvancedMode}
                             onChange={(e) => handleAdvancedChange(e.target.checked)}
                        />
                        <label htmlFor="advanced-toggle" className="text-sm text-gray-200">Advanced Mode</label>
                    </div>
                    {isAdvancedMode && (
                        <p className="text-xs text-red-400">
                            Advanced mode executes custom code and may have compliance risks.
                        </p>
                    )}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-1">My Strategies</h4>
                        {userStrategies.length === 0 ? (
                            <p className="text-sm text-gray-400">No saved strategies.</p>
                        ) : (
                            <ul className="space-y-1">
                                {userStrategies.map((s) => (
                                    <li key={s.id} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-200">{s.name}</span>
                                        <div className="space-x-1">
                                            <button
                                                className="px-1 py-0.5 text-xs bg-gray-700 rounded-md"
                                                onClick={() => onLoadStrategy(s.id)}
                                            >
                                                Load
                                            </button>
                                            <button
                                                className="px-1 py-0.5 text-xs bg-red-700 rounded-md"
                                                onClick={() => onDeleteStrategy(s.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
            {showAdvancedModal && (
                <AdvancedModeModal
                    onConfirm={() => {
                        onToggleAdvancedMode(true);
                        const state = getSystemState();
                        const botCount = state.allBots.length;
                        const tradeTotal = Object.values(state.tradeCounts).reduce(
                          (a, b) => a + b,
                          0
                        );
                        append(
                          `Advanced mode enabled. ${botCount} bots, ${tradeTotal} total trades accessible.`
                        );
                        setShowAdvancedModal(false);
                    }}
                    onCancel={() => setShowAdvancedModal(false)}
                />
            )}
        </div>
    );
}