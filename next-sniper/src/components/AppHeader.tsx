'use client';
import React from 'react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNetwork, NetworkType } from '@/context/NetworkContext';

interface AppHeaderProps {
  onNetworkChange?: (network: NetworkType) => void;
}

export default function AppHeader({ onNetworkChange }: AppHeaderProps) {
  const { network, setNetwork, rpcUrl } = useNetwork();

  const handleChange = (n: NetworkType) => {
    // If a custom handler is passed from the parent page (like our homepage), use it.
    if (onNetworkChange) {
      onNetworkChange(n);
    } else {
      // Otherwise, just change the network in the context directly.
      if (network === n) return;
      setNetwork(n);
    }
  };

  return (
    <header className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <nav className="space-x-4">
          <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
          <Link href="/bots" className="text-blue-400 hover:text-blue-300">Trading Bots</Link>
        </nav>
       <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          SniperLab
        </h1>
        <WalletMultiButton />
      </div>
      <div className="flex justify-center items-center mb-2">
        <div className="bg-gray-800 p-1 rounded-lg flex space-x-1">
          <button
            onClick={() => handleChange('devnet')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${network === 'devnet' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          >
            Devnet
          </button>
          <button
            onClick={() => handleChange('mainnet-beta')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${network === 'mainnet-beta' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          >
            Mainnet
          </button>
        </div>
      </div>
              <p className="text-center text-gray-400 text-sm">
          Current Network: <span className="font-bold text-yellow-400">{network}</span> | RPC{' '}
          <span className="text-xs text-gray-500 break-all">{rpcUrl}</span>
        </p>
      </header>
  );
}