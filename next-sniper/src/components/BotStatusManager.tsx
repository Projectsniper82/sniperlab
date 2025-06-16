'use client';

import React from 'react';

// Using a simplified type for now, will expand later
type BotWallet = {
    publicKey: string;
    solBalance: number;
    // We will add more properties like token balances later
};

interface BotStatusManagerProps {
    wallets: BotWallet[];
}

const StatusIndicator = ({ label, value, status }: { label: string, value: string, status: 'ok' | 'warn' | 'neutral' }) => {
    const baseClasses = "text-xs px-2 py-1 rounded-full font-mono flex items-center gap-1.5";
    const statusClasses = {
        ok: "bg-green-500/10 text-green-400",
        warn: "bg-yellow-500/10 text-yellow-400",
        neutral: "bg-gray-500/10 text-gray-300",
    };
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{label}</span>
            <span className={`${baseClasses} ${statusClasses[status]}`}>
                 <span className={`h-2 w-2 rounded-full ${status === 'ok' ? 'bg-green-400' : status === 'warn' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                {value}
            </span>
        </div>
    );
};


export default function BotStatusManager({ wallets }: BotStatusManagerProps) {
    if (!wallets || wallets.length === 0) {
        return (
             <div className="p-6 bg-gray-800 rounded-lg text-center border border-gray-700">
                <p className="text-gray-400">No bot wallets have been created for this network.</p>
                <p className="text-xs text-gray-500 mt-2">Use the Bot Creation Manager to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
             <h3 className="text-lg font-bold text-white">Bot Wallet Status ({wallets.length} Loaded)</h3>
            {wallets.map((wallet, index) => (
                <div key={wallet.publicKey} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-2">
                    <p className="text-sm font-semibold text-white">Bot #{index + 1}: <span className="font-mono text-xs text-indigo-300">{wallet.publicKey}</span></p>
                    <div className="border-t border-gray-700/50 pt-2 space-y-1">
                        <StatusIndicator label="SOL Balance" value={wallet.solBalance.toFixed(4)} status={wallet.solBalance > 0 ? 'ok' : 'warn'} />
                        <StatusIndicator label="Token Account" value="N/A" status={'neutral'} />
                        <StatusIndicator label="LP Active" value="No" status={'neutral'} />
                        <StatusIndicator label="Bot Status" value="Idle" status={'ok'} />
                    </div>
                </div>
            ))}
        </div>
    );
}