import React, { useState, useEffect } from 'react';
import { Keypair } from '@solana/web3.js';

const WalletConnect = ({ setWallet }) => {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  // Create a new wallet
  const createWallet = () => {
    const newWallet = Keypair.generate();
    setPublicKey(newWallet.publicKey.toString());
    setSecretKey(Array.from(newWallet.secretKey).toString());
    setWallet(newWallet);
  };

  // Connect with existing secret key
  const connectWallet = () => {
    try {
      if (!secretKey) return;
      
      // Parse the secret key (handle array or comma-separated string)
      let keyArray;
      if (typeof secretKey === 'string') {
        keyArray = secretKey.split(',').map(num => parseInt(num.trim()));
      } else {
        keyArray = secretKey;
      }
      
      const uint8Array = new Uint8Array(keyArray);
      const wallet = Keypair.fromSecretKey(uint8Array);
      setPublicKey(wallet.publicKey.toString());
      setWallet(wallet);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      alert('Invalid secret key format. Please check and try again.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null);
    setPublicKey('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Wallet Connection</h2>
      
      {!publicKey ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key (for existing wallet)
            </label>
            <div className="flex">
              <input
                type="password"
                className="flex-1 p-2 border rounded-l"
                placeholder="Paste your secret key..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
                onClick={connectWallet}
              >
                Connect
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">- OR -</p>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
              onClick={createWallet}
            >
              Create New Wallet
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-mono text-xs truncate">{publicKey}</p>
            </div>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
          
          {secretKey && (
            <div className="bg-yellow-100 p-2 rounded border border-yellow-300">
              <p className="text-xs text-yellow-800 font-bold mb-1">Secret Key (Save this securely!)</p>
              <p className="font-mono text-xs break-all">{secretKey}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
