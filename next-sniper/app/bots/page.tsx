'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import BotManager from '@/components/BotManager';
import GlobalBotControls from '@/components/GlobalBotControls';
import WalletCreationManager from '@/components/WalletCreationManager';
import { useToken } from '@/context/TokenContext';
import { useBotLogic } from '@/context/BotLogicContext';

// Import other hooks and utilities you use for fetching LP data
import { useWallet } from '@solana/wallet-adapter-react';


export default function TradingBotsPage() {
    const { publicKey } = useWallet();
    const { isLogicEnabled, setIsLogicEnabled } = useBotLogic();
    const [logs, setLogs] = useState<string[]>([]);
    
    // FIX: Get the setter function from the context
    const { tokenAddress, isLpActive, setIsLpActive, setTokenAddress } = useToken(); 

    // --- Placeholder for your LP fetching logic ---
    // You likely have a more complex version of this.
    // The key is to call setIsLpActive based on the result.
    const fetchLpTokenDetails = useCallback(async () => {
        if (!tokenAddress || !publicKey) {
            setIsLpActive(false);
            return;
        }

        console.log(`[DEBUG] Starting LP check for token: ${tokenAddress}`);
        
        try {
            // SIMULATION of your fetching logic from the logs
            // Replace this with your actual implementation (e.g., call to Raydium SDK)
            const poolFound = true; // Assume your logic sets this to true on success

            if (poolFound) {
                console.log("[DEBUG] LP was found, updating context.");
                setIsLpActive(true);
            } else {
                console.log("[DEBUG] LP not found.");
                setIsLpActive(false);
            }
        } catch (error) {
            console.error("Failed to fetch LP details", error);
            setIsLpActive(false);
        }

    }, [tokenAddress, publicKey, setIsLpActive]);

    // Run the check whenever the token or wallet changes
    useEffect(() => {
        fetchLpTokenDetails();
    }, [fetchLpTokenDetails]);


    // --- Other handlers ---
    const addLog = (message: string) => {
        setLogs(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 199)]);
    };

    const handleToggleLogic = (isEnabled: boolean) => {
        setIsLogicEnabled(isEnabled);
        addLog(`Global trading logic has been turned ${isEnabled ? 'ON' : 'OFF'}.`);
    };

    const handleStartCreation = (totalSol: number) => {
        addLog('--- Starting Batch Creation Simulation ---');
    };
    
    const handleClearAll = () => {
        addLog("Simulation: Clear all wallets.");
    };

    return (
        <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
            <AppHeader />
            <main className="max-w-7xl mx-auto mt-4 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlobalBotControls 
                        isLogicEnabled={isLogicEnabled}
                        onToggleLogic={handleToggleLogic}
                        botCount={0}
                    />
                    <WalletCreationManager 
                        onStartCreation={handleStartCreation}
                        onClearWallets={handleClearAll}
                        isProcessing={false}
                    />
                </div>
                
                <div>
                     <h3 className="text-lg font-bold text-white mb-2">Global Action Logs</h3>
                     <div className="bg-black p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs text-gray-400 space-y-1 custom-scrollbar">
                        {logs.length > 0 ? logs.map((log, i) => <p key={i}><span className="text-gray-600 mr-2">{'>'}</span>{log}</p>) : <p className="text-gray-500">No global actions yet.</p>}
                    </div>
                </div>

                <BotManager
                    selectedTokenAddress={tokenAddress}
                    isLpActive={isLpActive}
                />
            </main>
        </div>
    );
}