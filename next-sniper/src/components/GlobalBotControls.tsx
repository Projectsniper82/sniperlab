'use client';

import React, { useState } from 'react';
import AdvancedModeModal from './AdvancedModeModal';
import { useGlobalLogs } from '@/context/GlobalLogContext';
import { useBotContext } from '@/context/BotContext';

const DEFAULT_PRESET = `exports.strategy = async (wallet, log) => {
  log('executing default strategy');
};`;

const MARKET_MAKER_PRESET = `exports.strategy = async (wallet, log, context) => {
  log('running market maker strategy');
  const { market } = context;
  if (!market || !market.getMidPrice) {
    log('market data unavailable');
    return;
  }
  const mid = await market.getMidPrice();
  const spread = 0.005; // 0.5% total spread
  const bid = mid * (1 - spread / 2);
  const ask = mid * (1 + spread / 2);
  await market.placeOrder(wallet, 'buy', bid, 1);
  await market.placeOrder(wallet, 'sell', ask, 1);
  log(\`placed buy at \${bid} and sell at \${ask}\`);

};`;


// Define the props for the component
interface GlobalBotControlsProps {
    isLogicEnabled: boolean;
    onToggleLogic: (isEnabled: boolean) => void;
    botCode: string;
    setBotCode: (code: string) => void;
    onSelectPreset: (preset: string) => void;
    isAdvancedMode: boolean;
    onToggleAdvancedMode: (checked: boolean) => void;
}

export default function GlobalBotControls({
    isLogicEnabled,
    onToggleLogic,
    botCode,
    setBotCode,
    onSelectPreset,
    isAdvancedMode,
    onToggleAdvancedMode,
}: GlobalBotControlsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAdvancedModal, setShowAdvancedModal] = useState(false);
    const { startTrading, stopTrading } = useBotContext();
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
                </div>
            )}
            {showAdvancedModal && (
                <AdvancedModeModal
                    onConfirm={() => {
                        onToggleAdvancedMode(true);
                        append('Advanced mode enabled');
                        setShowAdvancedModal(false);
                    }}
                    onCancel={() => setShowAdvancedModal(false)}
                />
            )}
        </div>
    );
}