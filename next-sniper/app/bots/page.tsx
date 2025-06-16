'use client';

import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import BotManager from '@/components/BotManager';
import GlobalBotControls from '@/components/GlobalBotControls';
import WalletCreationManager from '@/components/WalletCreationManager';

export default function TradingBotsPage() {
    const [isLogicEnabled, setIsLogicEnabled] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 199)]);
    };

    const handleToggleLogic = (isEnabled: boolean) => {
        setIsLogicEnabled(isEnabled);
        addLog(`Global trading logic has been turned ${isEnabled ? 'ON' : 'OFF'}.`);
    };

    const handleStartCreation = (totalSol: number) => {
        addLog('--- Starting Batch Creation Simulation ---');
        addLog(`Total SOL to distribute: ${totalSol}`);
        addLog(`This will create 6 main bot wallets and 6 intermediate wallets.`);
        addLog(`Funding will be scheduled randomly from the main connected wallet.`);
        addLog('--- Simulation End ---');
        // Future: Implement complex, multi-step creation and funding process here.
    };

    return (
        <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
            <AppHeader />
            <main className="max-w-7xl mx-auto mt-4 space-y-8">
                {/* Top Control Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlobalBotControls 
                        isLogicEnabled={isLogicEnabled}
                        onToggleLogic={handleToggleLogic}
                    />
                    <WalletCreationManager 
                        onStartCreation={handleStartCreation}
                    />
                </div>
                
                {/* Global Action Log */}
                <div>
                     <h3 className="text-lg font-bold text-white mb-2">Global Action Logs</h3>
                     <div className="bg-black p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs text-gray-400 space-y-1 custom-scrollbar">
                        {logs.length > 0 ? logs.map((log, i) => <p key={i}><span className="text-gray-600 mr-2">{'>'}</span>{log}</p>) : <p className="text-gray-500">No global actions yet.</p>}
                    </div>
                </div>

                {/* Bot Instances Section */}
                <BotManager isLogicEnabled={isLogicEnabled} />
            </main>
        </div>
    );
}
