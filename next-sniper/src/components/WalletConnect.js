// src/components/WalletConnect.js
import React, { useState } from 'react';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'; // Import PublicKey
// Removed Decimal dependency as it's not strictly needed for just constructing the command string
// import Decimal from 'decimal.js';

// Accept connection, refreshBalances, setNotification as props
// Note: 'connection' and 'refreshBalances' are no longer strictly needed by THIS component
// for the airdrop function itself, but keep them for now if other parts use them or for future use.
const WalletConnect = ({ setWallet, connection, refreshBalances, setNotification }) => {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);

  // --- Airdrop State ---
  const [airdropAmount, setAirdropAmount] = useState('1'); // Default to 1 SOL
  // No longer need isAirdropping state for this approach
  // const [isAirdropping, setIsAirdropping] = useState(false);
  // ---------------------

  // Connect using a manually pasted secret key (Keep your actual implementation)
  const connectWallet = () => {
      setIsLoading(true);
      try {
          if (!secretKey) return;
          const keyArray = secretKey.split(',').map(num => parseInt(num.trim()));
          const uint8Array = new Uint8Array(keyArray);
          const wallet = Keypair.fromSecretKey(uint8Array);
          setPublicKey(wallet.publicKey.toString());
          setWallet(wallet);
          setIsPhantomConnected(false);
      } catch (err) {
          console.error('Error connecting wallet:', err);
          alert('Invalid secret key format. Please check and try again.');
      } finally {
          setIsLoading(false);
      }
  };

  // Create a new wallet using a Keypair (Keep your actual implementation)
  const createWallet = () => {
      setIsLoading(true);
      try {
          const newWallet = Keypair.generate();
          setPublicKey(newWallet.publicKey.toString());
          setSecretKey(Array.from(newWallet.secretKey).toString());
          // Paste this block in place of 'setWallet(newWallet);'
const adapter = {
    publicKey: newWallet.publicKey,
    connect: async () => ({ publicKey: newWallet.publicKey }),
    signTransaction: async (transaction) => {
        transaction.partialSign(newWallet);
        return transaction;
    },
    signAllTransactions: async (transactions) => {
        transactions.forEach(tx => tx.partialSign(newWallet));
        return transactions;
    },
    isPhantom: false,
};

setWallet(adapter);
          setIsPhantomConnected(false);
      } catch (err) {
          console.error('Error generating wallet:', err);
      } finally {
          setIsLoading(false);
      }
  };

  // Connect using Phantom wallet (Keep your actual implementation)
  const connectPhantom = async () => {
      setIsLoading(true);
      try {
          const provider = window?.solana;
          if (!provider?.isPhantom) {
              alert("Phantom wallet not found. Please install Phantom.");
              setIsLoading(false);
              return;
          }
          if (provider.isConnected) {
             console.log("Phantom already connected, attempting to reconnect/get info...");
          }
          const resp = await provider.connect({ onlyIfTrusted: false });
          setWallet(provider);
          setPublicKey(resp.publicKey.toString());
          setIsPhantomConnected(true);
          setSecretKey('');
      } catch (err) {
          console.error("Phantom connection error:", err);
           if (err.code === 4001) {
               setNotification({ show: true, message: 'Phantom connection rejected.', type: 'info' });
           } else {
               setNotification({ show: true, message: 'Phantom connection failed.', type: 'error' });
           }
           setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      } finally {
          setIsLoading(false);
      }
  };


  const disconnectWallet = () => {
    setWallet(null);
    setPublicKey('');
    setSecretKey('');
    setIsPhantomConnected(false);
    setAirdropAmount('1'); // Reset airdrop amount
    if (window?.solana?.isPhantom && window.solana.disconnect) {
       window.solana.disconnect().catch(err => {
         console.error("Error disconnecting Phantom:", err);
       });
    }
  };

  // --- Modified Airdrop Handler (Show CLI Command) ---
  const handleShowAirdropCommand = () => {
    if (!publicKey) {
      console.error("Cannot generate command: public key missing.");
      setNotification({ show: true, message: 'Wallet not connected.', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    const amount = parseFloat(airdropAmount);
    if (isNaN(amount) || amount <= 0) {
      setNotification({ show: true, message: 'Invalid airdrop amount.', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }
     if (amount > 5) { // Increased limit slightly, but still good to warn
      setNotification({ show: true, message: 'Warning: Requesting large airdrop (>5 SOL).', type: 'info' });
      // Allow generation, but warn
    }

    // Construct the command string
    // Using the public Solana devnet URL as it's less likely to block CLI airdrops
    const command = `solana airdrop ${amount} ${publicKey} --url https://api.devnet.solana.com`;

    // Display the command in a notification (or you could use a modal/textarea)
    // Use a longer timeout for the notification so the user can copy it
    setNotification({
        show: true,
        message: `Copy and run this in your terminal:\n\n${command}`,
        type: 'info' // Use 'info' type for instructions
    });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 15000); // 15 seconds

    console.log("Generated Airdrop Command:", command);
  };
  // --------------------------------------------------


  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Keep the debug log if you still need it, remove if not
  console.log('[WalletConnect Render Check] Internal publicKey state is:', JSON.stringify(publicKey));

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          {isPhantomConnected ? "🧙 Phantom Wallet" : "🔑 Wallet Connection"}
        </h2>
        {publicKey && (
          <div className="px-3 py-1 bg-green-900 rounded-full text-green-400 text-xs">
            Connected
          </div>
        )}
      </div>

      {/* Connection Options (If not connected) */}
      {!publicKey ? (
        <>
          {/* ... Keep the existing connection options JSX ... */}
           {/* Secret Key Input & Connect */}
           <div className="mb-4">
             <label className="block text-gray-400 text-sm mb-1">
               Secret Key (for existing wallet)
             </label>
             <div className="flex">
               <input
                 type={showSecret ? "text" : "password"}
                 className="flex-1 p-3 rounded-l bg-gray-800 text-white border border-r-0 border-gray-700 focus:border-blue-500 focus:outline-none"
                 placeholder="Paste your secret key..."
                 value={secretKey}
                 onChange={(e) => setSecretKey(e.target.value)}
               />
               <button
                 className="bg-gray-700 text-white px-3 border-t border-r border-b border-gray-700 rounded-r"
                 onClick={() => setShowSecret(!showSecret)}
               >
                 {showSecret ? "Hide" : "Show"}
               </button>
             </div>
             <div className="mt-2">
               <button
                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                 onClick={connectWallet}
                 disabled={isLoading || !secretKey}
               >
                 {isLoading ? "Connecting..." : "Connect Wallet"}
               </button>
             </div>
           </div>
           {/* OR Separator */}
           <div className="text-center">
             <div className="relative mb-4">
               <hr className="border-gray-700" />
               <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-2 text-gray-500 text-sm">
                 OR
               </span>
             </div>
           {/* Create New Wallet Button */}
             <button
               className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
               onClick={createWallet}
               disabled={isLoading}
             >
               {isLoading ? "Creating..." : "Create New Wallet"}
             </button>
           </div>
          {/* Phantom Connect Button */}
           <div className="mt-4">
             <button
               onClick={connectPhantom}
               className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700"
               disabled={isLoading}
             >
               {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
             </button>
           </div>
           {/* ... End of connection options ... */}
        </>
      ) : (
        // Wallet Connected View
        <div>
          {/* Public Key Display */}
          {/* ... Keep existing public key display ... */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
               <span className="text-gray-300">Address</span>
               <span className="text-white font-bold">{formatAddress(publicKey)}</span>
             </div>
             <div className="bg-gray-800/50 p-2 rounded font-mono text-xs text-gray-300 truncate">
               {publicKey}
             </div>
          </div>


          {/* Secret Key Display (If applicable) */}
           {secretKey && (
             <div className="mb-4 p-4 bg-yellow-900/30 rounded-lg border border-yellow-700/50">
                {/* ... Keep existing secret key display ... */}
               <div className="flex justify-between items-center mb-2">
                 <p className="text-yellow-500 font-semibold">Secret Key (Save securely!)</p>
                 <button
                   className="text-xs bg-yellow-800 text-yellow-200 px-2 py-1 rounded"
                   onClick={() => setShowSecret(!showSecret)}
                 >
                   {showSecret ? "Hide" : "Show"}
                 </button>
               </div>
               {showSecret ? (
                 <p className="font-mono text-xs break-all text-yellow-300">{secretKey}</p>
               ) : (
                 <p className="font-mono text-xs break-all text-yellow-300">••••••••••••••••••••••••••••••••</p>
               )}
             </div>
           )}

          {/* --- Airdrop Section (Modified) --- */}
          <div className="my-4 pt-4 border-t border-gray-700">
            <label htmlFor="airdrop-amount" className="block text-sm font-medium text-gray-300 mb-1">Devnet SOL Airdrop (CLI)</label>
            <div className="flex space-x-2">
              <input
                id="airdrop-amount"
                type="number"
                value={airdropAmount}
                onChange={(e) => setAirdropAmount(e.target.value)}
                placeholder="SOL Amount"
                min="0.1"
                max="5" // Adjusted max slightly, still good practice
                step="0.1"
                className="flex-grow p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                // No longer need to disable based on loading state here
              />
              <button
                onClick={handleShowAirdropCommand} // Call the new handler
                // No longer need complex disabled logic based on loading
                disabled={!airdropAmount || parseFloat(airdropAmount) <= 0}
                className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-150 ${!airdropAmount || parseFloat(airdropAmount) <= 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
              >
                 {/* Simplified button text */}
                 Show Airdrop CMD
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Click button to generate the command to run in your terminal.</p>
          </div>
          {/* ----------------------------- */}


          {/* Disconnect Button */}
          <button
            className="w-full mt-4 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;