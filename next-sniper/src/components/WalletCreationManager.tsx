'use client';

import React, { useState } from 'react';
import { useGlobalLogs } from '@/context/GlobalLogContext';
import { useNetwork, NetworkType } from '@/context/NetworkContext';
import { Keypair } from '@solana/web3.js';
import {
   
    loadBotWallets,
} from '@/utils/botWalletManager';
import { NumberInputStepper } from '@/components/NumberInputStepper';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface WalletCreationManagerProps {
     distributeFunds: (
        wallets: Keypair[],
        totalSol: number,
        durationMinutes: number
    ) => void;
    onClearWallets: () => void;
    isProcessing: boolean;
}

export default function WalletCreationManager({ distributeFunds, onClearWallets, isProcessing }: WalletCreationManagerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [totalSol, setTotalSol] = useState('0.6');
    const [duration, setDuration] = useState('30');
    const { connection, network } = useNetwork();
    const { append } = useGlobalLogs();

        const handleClearAllWallets = async () => {
        const wallets = loadBotWallets(network);
        let hasBalance = false;
        for (const w of wallets) {
            const sol = await connection.getBalance(w.publicKey);
            if (sol > 0) { hasBalance = true; break; }
            const tokens = await connection.getParsedTokenAccountsByOwner(w.publicKey, { programId: TOKEN_PROGRAM_ID });
            const nonZero = tokens.value.some(t => (t.account.data as any).parsed.info.tokenAmount.uiAmount > 0);
            if (nonZero) { hasBalance = true; break; }
        }

        let proceed = true;
        if (hasBalance) {
            proceed = window.confirm('Some bot wallets still hold SOL or tokens. Continue anyway?');
        } else {
            proceed = window.confirm('Are you sure? This will permanently delete all bot wallets for this network.');
        }

        if (proceed) {
            onClearWallets();
            append('Cleared all bot wallets');
        }
    };

    const handleCreateClick = () => {
        const solAmount = parseFloat(totalSol);
        const durationMinutes = parseInt(duration, 10);
        if (isNaN(solAmount) || solAmount < 0) {
            alert("Please enter a valid amount of SOL.");
            return;
        }
        if (isNaN(durationMinutes) || durationMinutes < 1) {
            alert("Please enter a valid duration in minutes.");
            return;
        }
        const wallets = Array.from({ length: 6 }, () => Keypair.generate());
        append(`Generated ${wallets.length} bot wallets`);
        distributeFunds(wallets, solAmount, durationMinutes);
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
                           <div>
                                <NumberInputStepper
                                    label="Total SOL to Distribute"
                                    value={totalSol}
                                    onChange={setTotalSol}
                                    step={0.1}
                                    min={0.1}
                                />
                                <p className="text-xs text-gray-400 mt-1">From your main wallet.</p>
                            </div>
                            <div>
                                <NumberInputStepper
                                    label="Duration"
                                    value={duration}
                                    onChange={setDuration}
                                    step={5}
                                    min={0}
                                />
                                <p className="text-xs text-gray-400 mt-1">For random creation.</p>
                            </div> 
                        </div>
                       <button
                            onClick={handleCreateClick}
                            disabled={isProcessing}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition text-white font-semibold shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processing...
                                </span>
                            ) : (
                                "Start Batch Creation (6 Bots)"
                            )}
                        </button>
                        <button
                            onClick={handleClearAllWallets}
                            disabled={isProcessing}
                            className="w-full py-2 bg-red-900/50 hover:bg-red-800/70 border border-red-700/50 rounded-lg transition text-red-300 text-sm font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Clear All Bot Wallets
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}