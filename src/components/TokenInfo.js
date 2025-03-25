import React, { useState, useEffect } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, getAccount, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

const TokenInfo = ({ tokenAddress, connection, wallet }) => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [solBalance, setSolBalance] = useState(0);

  useEffect(() => {
    if (!tokenAddress || !connection || !wallet) return;

    const fetchTokenInfo = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get SOL balance
        const lamports = await connection.getBalance(wallet.publicKey);
        setSolBalance(lamports / LAMPORTS_PER_SOL);
        
        // Convert string to PublicKey
        const mintPubkey = new PublicKey(tokenAddress);
        
        // Get token supply and info
        const mintInfo = await getMint(connection, mintPubkey);
        
        // Get token account if it exists
        let userTokenBalance = 0;
        try {
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            wallet.publicKey,
            { mint: mintPubkey }
          );
          
          if (tokenAccounts.value.length > 0) {
            const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
            const amount = accountInfo.tokenAmount.amount;
            const decimals = accountInfo.tokenAmount.decimals;
            userTokenBalance = Number(amount) / Math.pow(10, decimals);
          }
        } catch (err) {
          console.log('No token account found for this user');
        }
        
        // Set token info state
        setTokenInfo({
          address: tokenAddress,
          decimals: mintInfo.decimals,
          supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
          userBalance: userTokenBalance,
          isInitialized: mintInfo.isInitialized,
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching token info:', err);
        setError('Failed to load token information. Make sure the address is correct.');
        setLoading(false);
      }
    };

    fetchTokenInfo();
  }, [tokenAddress, connection, wallet]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Token Information</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : tokenInfo ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Token Address</p>
            <p className="font-mono text-xs truncate">{tokenInfo.address}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Decimals</p>
              <p className="font-medium">{tokenInfo.decimals}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Supply</p>
              <p className="font-medium">{tokenInfo.supply.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Your Token Balance</p>
              <p className="font-medium">{tokenInfo.userBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Your SOL Balance</p>
              <p className="font-medium">{solBalance.toFixed(4)} SOL</p>
            </div>
          </div>
        </div>
      ) : tokenAddress ? (
        <div className="text-gray-500 text-center py-6">
          Enter a valid token address to view details
        </div>
      ) : (
        <div className="text-gray-500 text-center py-6">
          No token address provided
        </div>
      )}
    </div>
  );
};

export default TokenInfo;
