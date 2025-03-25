import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import WalletConnect from './components/WalletConnect';
import TokenInfo from './components/TokenInfo';
import LiquidityManager from './components/LiquidityManager';
import TokenChart from './components/TokenChart';
import TradingInterface from './components/TradingInterface';

function App() {
  const [wallet, setWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');
    setConnection(conn);
  }, []);

  const handleTokenAddressChange = (address) => {
    try {
      const pubkey = new PublicKey(address);
      setTokenAddress(address);
      // We'll add token info fetching later
    } catch (err) {
      console.error('Invalid token address:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Solana Token Manager</h1>
        <div className="mt-4">
          <WalletConnect setWallet={setWallet} />
        </div>
      </header>

      {wallet ? (
        <>
          <div className="mb-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2">Token Address</h2>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Enter token address..."
                  value={tokenAddress}
                  onChange={(e) => handleTokenAddressChange(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
                  Load Token
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <TokenChart tokenAddress={tokenAddress} connection={connection} />
            </div>
            <div>
              <TokenInfo tokenAddress={tokenAddress} connection={connection} wallet={wallet} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiquidityManager tokenAddress={tokenAddress} connection={connection} wallet={wallet} />
            <TradingInterface tokenAddress={tokenAddress} connection={connection} wallet={wallet} />
          </div>
        </>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-lg text-gray-600">Please connect your wallet to continue</p>
        </div>
      )}
    </div>
  );
}

export default App;
