'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetwork } from '@/context/NetworkContext';

export default function AirdropCommand() {
  const { publicKey, connected } = useWallet();
  const { network } = useNetwork();
  const [amount, setAmount] = useState('1');

  if (!connected || !publicKey || network !== 'devnet') {
    return null;
  }

  const cmd = `solana airdrop ${amount} ${publicKey.toBase58()} --url https://api.devnet.solana.com`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">Devnet SOL Airdrop</label>
      <div className="flex space-x-2">
        <input
          type="number"
          value={amount}
          min="0.1"
          step="0.1"
          onChange={(e) => setAmount(e.target.value)}
          className="w-24 p-2 bg-gray-800 text-white border border-gray-700 rounded"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Copy Command
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1 font-mono break-all">{cmd}</p>
    </div>
  );
}