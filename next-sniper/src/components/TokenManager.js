
import React, { useState, useEffect } from 'react';
import { fetchTokens, getWallet } from '@/utils/solanaUtils';
import { createLiquidityPool, addLiquidityToPool } from '@/LiquidityManager';

function TokenManager() {
  const [tokens, setTokens] = useState([]);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [existingPoolKeys, setExistingPoolKeys] = useState(null);

  // Fetch tokens on component mount
  useEffect(() => {
    fetchTokens()
      .then((data) => setTokens(data))
      .catch((error) => console.error('Error fetching tokens:', error));
  }, []);

  const handleCreateLP = async () => {
    try {
      if (!tokenAddress || !tokenBalance || !solAmount) {
        alert("Please enter Token Address, Token Amount, and SOL Amount.");
        return;
      }

      const tokenDecimals = 9;  // Adjust if your token uses different decimals
      const tokenAmount = parseFloat(tokenBalance) * (10 ** tokenDecimals);
      const solLamports = parseFloat(solAmount) * 1e9; // Convert SOL to lamports

      const { signature, poolKeys } = await createLiquidityPool(
        tokenAddress,
        tokenDecimals,
        tokenAmount,
        solLamports
      );

      setExistingPoolKeys(poolKeys);
      alert(`Liquidity Pool Created! Signature: ${signature}`);
      console.log("Pool keys:", poolKeys);
    } catch (error) {
      console.error("LP creation error:", error);
      alert("Error creating LP: " + error.message);
    }
  };

  const handleAddLiquidity = async () => {
    try {
      if (!existingPoolKeys) {
        alert("Please create the liquidity pool first.");
        return;
      }

      if (!tokenAddress || !tokenBalance || !solAmount) {
        alert("Please enter Token Address, Token Amount, and SOL Amount.");
        return;
      }

      const tokenDecimals = 9;  // Adjust if necessary
      const tokenAmount = parseFloat(tokenBalance) * (10 ** tokenDecimals);
      const solLamports = parseFloat(solAmount) * 1e9;

      const signature = await addLiquidityToPool(
        existingPoolKeys,
        tokenAddress,
        tokenDecimals,
        tokenAmount,
        solLamports
      );

      alert(`Liquidity Added Successfully! Signature: ${signature}`);
    } catch (error) {
      console.error("Add liquidity error:", error);
      alert("Error adding liquidity: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Solana Token Manager</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Token Mint Address</label>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Token Mint Address"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Token Amount</label>
        <input
          type="number"
          value={tokenBalance}
          onChange={(e) => setTokenBalance(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Token Amount"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">SOL Amount</label>
        <input
          type="number"
          value={solAmount}
          onChange={(e) => setSolAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter SOL Amount"
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleCreateLP}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Liquidity Pool
        </button>

        <button
          onClick={handleAddLiquidity}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Liquidity
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-6">Available Tokens</h3>
      {tokens.length === 0 ? (
        <p>No tokens available.</p>
      ) : (
        <ul className="list-disc pl-5 mt-2">
          {tokens.map((token, index) => (
            <li key={index}>
              {token.name} - {token.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TokenManager;
