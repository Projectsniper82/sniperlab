'use client';

import React, { useState } from 'react';
import { useNetwork, NetworkType } from '@/context/NetworkContext';
import { clearBotWallet, loadBotWallet } from '@/utils/botWalletManager';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

let walletWorker: Worker | null = null;

export function initWalletCreationWorker(onMessage: (data: any) => void): Worker {
    if (!walletWorker) {
        walletWorker = new Worker(new URL('../workers/walletCreator.ts', import.meta.url));
    }
    walletWorker.onmessage = (ev) => onMessage(ev.data);
    return walletWorker;
}

export function postWalletCreationMessage(params: { totalSol: number; duration: number; network: string; rpcUrl: string }) {
    if (!walletWorker) throw new Error('Worker not initialized');
    walletWorker.postMessage(params);
}

const NumberInputStepper = ({ label, value, onChange, step, min, unit, helpText }: { label:string, value:string, onChange:(v:string)=>void, step:number, min:number, unit:string, helpText:string }) => {
    const handleStep = (direction: 'up' | 'down') => {
        const currentValue = parseFloat(value) || 0;
        const newValue = direction === 'up' ? currentValue + step : Math.max(min, currentValue - step);
        onChange(newValue.toFixed(2));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="flex items-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-l-md text-white text-center font-mono"
                    placeholder="0.0"
                />
                <div className="flex flex-col">
                    <button onClick={() => handleStep('up')} className="px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-white rounded-tr-md border-b border-gray-700">+</button>
                    <button onClick={() => handleStep('down')} className="px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-white rounded-br-md">-</button>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{helpText}</p>
        </div>
    );
};

interface WalletCreationManagerProps {
      onStartCreation: (
        totalSol: number,
        durationMinutes: number,
        network: NetworkType,
        rpcUrl: string
    ) => void;
    onClearWallets: () => void;
    isProcessing: boolean;
}

export default function WalletCreationManager({ onStartCreation, onClearWallets, isProcessing }: WalletCreationManagerProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [totalSol, setTotalSol] = useState('0.6');
    const [duration, setDuration] = useState('30');
    const { connection, network, rpcUrl } = useNetwork();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const confirmAndClearCurrentWallet = () => {
        clearBotWallet(network);
        setShowConfirmModal(false);
        // Assuming onClearWallets might refresh state, otherwise call a refresh function if needed
        onClearWallets(); 
    };

    const handleClearCurrentWallet = async () => {
        const wallet = loadBotWallet(network);
        if (wallet) {
            const sol = await connection.getBalance(wallet.publicKey);
            const tokens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_PROGRAM_ID });
            const tokenNonZero = tokens.value.some(t => (t.account.data as any).parsed.info.tokenAmount.uiAmount > 0);
            
            if (sol > 0 || tokenNonZero) {
                setShowConfirmModal(true);
                return;
            }
        }
        if (window.confirm("Are you sure? This will permanently delete the current bot wallet for this network.")) {
            confirmAndClearCurrentWallet();
        }
    };

    const handleCreateClick = () => {
        const solAmount = parseFloat(totalSol);
        const durationMinutes = parseInt(duration, 10);
        if (isNaN(solAmount) || solAmount <= 0) {
            alert("Please enter a valid amount of SOL.");
            return;
        }
        if (isNaN(durationMinutes) || durationMinutes < 1) {
            alert("Please enter a valid duration in minutes.");
            return;
        }
        onStartCreation(solAmount, durationMinutes, network, rpcUrl);
    };

    return (
        <>
            <div className="bg-gradient-to-b from-gray-800 to-gray-800/80 rounded-xl border border-gray-700 shadow-lg overflow-hidden transition-all duration-300">
                <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-purple-400">❖</span>
                        Bot Creation Manager
                    </h2>
                    <span className={`transition-transform transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </div>
                
                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 border-t border-gray-700/50 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <NumberInputStepper 
                                label="Total SOL to Distribute"
                                value={totalSol}
                                onChange={setTotalSol}
                                step={0.1}
                                min={0.1}
                                unit="SOL"
                                helpText="From your main wallet."
                            />
                             <NumberInputStepper 
                                label="Duration"
                                value={duration}
                                onChange={setDuration}
                                step={5}
                                min={1}
                                unit="Min"
                                helpText="For random creation."
                            />
                        </div>
                        <button 
                            onClick={handleCreateClick} 
                            disabled={isProcessing}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition text-white font-semibold shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? "Processing..." : "Start Batch Creation (6 Bots)"}
                        </button>
                        <button
                            onClick={onClearWallets}
                            disabled={isProcessing}
                            className="w-full py-2 bg-red-900/50 hover:bg-red-800/70 border border-red-700/50 rounded-lg transition text-red-300 text-sm font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Clear All Bot Wallets
                        </button>
                        <button
                            onClick={handleClearCurrentWallet}
                            disabled={isProcessing}
                            className="w-full py-2 bg-red-800/50 hover:bg-red-700/70 border border-red-700/50 rounded-lg transition text-red-300 text-sm font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Clear Bot Wallet
                        </button>
                    </div>
                </div>
            </div>
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg text-center space-y-4">
                        <p className="text-white">The bot wallet still contains SOL or tokens. Withdraw funds before deleting. Continue anyway?</p>
                        <div className="space-x-2">
                            <button onClick={() => setShowConfirmModal(false)} className="px-3 py-1 bg-gray-700 text-white rounded">Cancel</button>
                            <button onClick={confirmAndClearCurrentWallet} className="px-3 py-1 bg-red-800 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}