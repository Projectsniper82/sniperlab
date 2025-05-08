// src/components/SimulatedLiquidityManager.js
// Original version from response #6 / #57, updated with Step 2

import React, { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js'; // Already imported, no need to re-add
import BN from 'bn.js';
import Decimal from 'decimal.js';

// --- ADD THESE IMPORTS ---
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import {
  TOKEN_PROGRAM_ID, // Included as per instructions, though not directly used in the new effect
  ASSOCIATED_TOKEN_PROGRAM_ID, // Included as per instructions, though not directly used in the new effect
  getTokenAccountBalance,
  NATIVE_MINT
} from '@solana/spl-token';
import { setSimulatedPool } from '../utils/simulatedPoolStore'; // Assuming correct relative path
// --- END ADDED IMPORTS ---


// Assuming these simulation functions exist in LiquidityManager.js
import {
  createSimulatedLiquidityPool,
  addSimulatedLiquidityToPool,
} from './LiquidityManager'; // Adjust path if necessary

import {
  createRaydiumPool,
  isRaydiumPool
} from '../utils/raydiumSdkAdapter'; // Ensure path is correct

// Configure Decimal.js
Decimal.set({ precision: 50 });

// JSDoc type hints for props
/**
 * @param {object} props
 * @param {any} props.wallet
 * @param {import('@solana/web3.js').Connection} props.connection
 * @param {string} props.tokenAddress
 * @param {number} props.tokenDecimals
 * @param {string} props.tokenBalance - Raw balance string
 * @param {number} props.solBalance - UI balance number
 * @param {() => Promise<void>} props.refreshBalances
 * @param {(amounts: { tokenAmount: any, solAmount: number }) => void} props.subtractBalances
 */
function SimulatedLiquidityManager({
  wallet,
  connection,
  tokenAddress,
  tokenDecimals,
  tokenBalance, // Raw balance string
  solBalance,
  refreshBalances,
  subtractBalances,
}) {
  const [solAmount, setSolAmount] = useState(''); // UI SOL string
  const [tokenPercentage, setTokenPercentage] = useState(90);
  const [existingPoolInfo, setExistingPoolInfo] = useState(null); // Internal state
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [error, setError] = useState('');
  const [isUsingRaydium, setIsUsingRaydium] = useState(true);

  // Calculate estimated UI token amount for display
  const estimatedTokenAmountUI = useMemo(() => {
    if (!tokenBalance || tokenDecimals === undefined || tokenDecimals === null) return 0;
    try {
      const rawBalance = new BN(tokenBalance);
      const rawAmount = rawBalance.mul(new BN(tokenPercentage)).div(new BN(100));
      return new Decimal(rawAmount.toString()).div(10 ** tokenDecimals).toNumber();
    } catch (e) { console.error("Error calculating estimated UI token amount:", e); return 0; }
  }, [tokenBalance, tokenPercentage, tokenDecimals]);

  // Calculate display value for available token balance (UI Amount)
    const displayAvailableToken = useMemo(() => {
        if (!tokenBalance || tokenDecimals === undefined || tokenDecimals === null) return '0';
        try { return new Decimal(tokenBalance).div(10**tokenDecimals).toDP(tokenDecimals).toString(); }
        catch (e) { console.error("Error calculating displayAvailableToken", e); return 'Error'; }
    }, [tokenBalance, tokenDecimals]);


  useEffect(() => { /* Optional: Add checks or logs if needed */ }, [wallet]);

  // --- ADD THIS EFFECT: On tokenAddress change, try to seed any existing on‑chain pool ---
  useEffect(() => {
    async function seedOnChainPool() {
      // Clear previous pool info when token changes, before attempting to load new one
      setExistingPoolInfo(null);
      setSimulatedPool(null); // Also clear the shared store

      if (!wallet?.publicKey || !connection || !tokenAddress || tokenDecimals === undefined || tokenDecimals === null) {
        console.debug("Seed pool check skipped: Missing wallet, connection, tokenAddress, or tokenDecimals.");
        return;
      }

      try {
        // Ensure tokenAddress is valid before proceeding
        let mintB;
        try {
             mintB = new PublicKey(tokenAddress);
        } catch (e) {
             console.debug("Seed pool check skipped: Invalid token address format", tokenAddress);
             return; // Don't proceed if address is invalid
        }


        console.log("Attempting to seed pool for token:", tokenAddress);
        // Devnet CPMM + fee IDs (must match your create logic)
        const cpmmProgramId = new PublicKey("CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW");
        const feeConfigId   = new PublicKey("9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6");

        // Derive PDAs for the pool
        const mintA = NATIVE_MINT;                      // SOL
        // mintB derived above
        const poolKeys = getCreatePoolKeys({
          programId: cpmmProgramId,
          configId:  feeConfigId,
          mintA,
          mintB
        });
        console.debug("Derived Pool Keys:", JSON.stringify(poolKeys, (key, value) => typeof value === 'bigint' ? value.toString() : value)); // Log derived keys

        // Read vault account balances
        console.debug("Fetching SOL vault balance:", poolKeys.vaultA.toBase58());
        const solBalInfo = await connection.getTokenAccountBalance(poolKeys.vaultA, 'confirmed');
        const solBal = solBalInfo.value.uiAmount || 0;

        console.debug("Fetching Token vault balance:", poolKeys.vaultB.toBase58());
        const tokenBalInfo = await connection.getTokenAccountBalance(poolKeys.vaultB, 'confirmed');
        const tokenBal = tokenBalInfo.value.uiAmount || 0;


        console.log(`On-chain balances found: SOL=${solBal}, Token=${tokenBal}`);
        if (solBal === 0 || tokenBal === 0) {
            console.log("No existing on-chain pool found (zero balance in one or both vaults).");
            return; // no pool yet
        }

        // Build initial poolInfo
        const price = solBal / tokenBal; // Price: SOL per Token
        const poolInfo = {
          // Ensure consistency with how pool info is stored elsewhere
          tokenAddress:   tokenAddress.toLowerCase(), // Use lowercase for consistency?
          tokenDecimals,
          tokenAmount:    tokenBal,   // Store as number (UI amount)
          solAmount:      solBal,     // Store as number (UI amount)
          price,
          volume:         0, // Initialize volume
          candles: [{       // Initialize candle data
            open:      price,
            high:      price,
            low:       price,
            close:     price,
            timestamp: Date.now()
          }],
          // Raydium specific info
          raydiumPoolId:   poolKeys.poolId.toBase58(),
          raydiumPoolKeys: JSON.stringify(poolKeys), // Store the derived keys
          // Add a flag indicating this was seeded from on-chain data?
          isSeeded: true,
        };

        console.log("Seeding existing pool info:", poolInfo);
        // Seed both component state and the simulated store
        setExistingPoolInfo(poolInfo);
        setSimulatedPool(poolInfo); // Update shared store for the chart
      } catch (err) {
        // Log more specific errors if possible, e.g., account not found means no pool
        if (err.message && err.message.includes('Account does not exist')) {
             console.debug("No existing on‐chain pool found for", tokenAddress, "(Vault account not found)");
        } else {
             console.error("Error trying to seed on‐chain pool for", tokenAddress, err);
        }
        // Ensure state is clear if an error occurs
        setExistingPoolInfo(null);
        setSimulatedPool(null);
      }
    }
    seedOnChainPool();
  }, [wallet, connection, tokenAddress, tokenDecimals, setSimulatedPool]); // Added setSimulatedPool to dependencies if it comes from context/prop
  // --- END ADDED EFFECT ---


  // handleCreateLiquidity using internal state
  const handleCreateLiquidity = async () => {
    setError(''); setIsCreatingPool(true);
    if (!wallet?.publicKey || !connection || !tokenAddress || tokenDecimals === undefined || !tokenBalance) { setError("Wallet/Connection/Token details missing."); setIsCreatingPool(false); return; }
    let mintPublicKey; try { mintPublicKey = new PublicKey(tokenAddress); } catch (e) { setError(`Invalid token address format`); setIsCreatingPool(false); return; }
    // Removed direct mint check here as the seed effect might handle existing pools
    // try { const mintInfo = await connection.getAccountInfo(mintPublicKey); if (!mintInfo) { setError(`Mint ${tokenAddress} not found.`); setIsCreatingPool(false); return; } console.log("[Direct Check] SUCCESS: Mint account found directly."); }
    // catch (e) { setError(`Error checking mint: ${e.message}.`); setIsCreatingPool(false); return; }

    try {
      let rawTokenBalance; try { rawTokenBalance = new BN(tokenBalance); } catch(e) { setError(`Invalid tokenBalance format`); setIsCreatingPool(false); return; }
      if (rawTokenBalance.isZero()) { setError("Token Balance is zero."); setIsCreatingPool(false); return; }
      const rawTokenAmountToSend = rawTokenBalance.mul(new BN(tokenPercentage)).div(new BN(100));
      if (rawTokenAmountToSend.isZero()) { setError(`Calculated token amount is zero.`); setIsCreatingPool(false); return; }
      const solAmountFloat = parseFloat(solAmount);
      if (isNaN(solAmountFloat) || solAmountFloat <= 0) { setError("Invalid or zero SOL amount."); setIsCreatingPool(false); return; }
      const solLamportsBN = new BN(new Decimal(solAmountFloat).mul(1e9).toFixed(0));
      console.log("[DEBUG UI] Create LP Args:", { tokenAddress, tokenDecimals, rawTokenAmountToSend: rawTokenAmountToSend.toString(), solLamportsBN: solLamportsBN.toString() });

      let result;
      if (isUsingRaydium) {
        console.log("[RAYDIUM] Creating pool via SDK");
        // Calls the adapter, ensure adapter uses the manual build with ATA fix from #61
        result = await createRaydiumPool(wallet, connection, tokenAddress, tokenDecimals, rawTokenAmountToSend, solLamportsBN);
      } else {
        console.log("[SIMULATION] Creating simulated pool");
        result = await createSimulatedLiquidityPool(wallet, tokenAddress, tokenDecimals, rawTokenAmountToSend, solLamportsBN, subtractBalances);
      }

      // Use result.poolInfo or result.poolKeys
      const poolData = result?.poolInfo || result?.poolKeys; // Adapt based on what createRaydiumPool/createSimulatedLiquidityPool returns

      if (poolData && result?.signature) {
          // Add basic check for safety
          // Adapt this check based on the actual structure of poolData from both Raydium and Simulation
          const isDataComplete = poolData.tokenAddress && poolData.tokenDecimals !== undefined;
          if(!isDataComplete) { throw new Error("Pool data received is incomplete."); }

          // Update local state *and* shared state
          setExistingPoolInfo(poolData);
          setSimulatedPool(poolData); // Update shared store

          alert(`✅ Pool created! Sig: ${result.signature}`);
          refreshBalances(); // Refresh balances to reflect used amounts
      } else {
          if(result?.signature) { alert(`❓ Pool TX sent, but state/pool info missing. Sig: ${result.signature}`); }
          else { throw new Error("Pool creation function did not return expected result."); }
      }
    } catch (error) {
      console.error(`[DEBUG UI] LP creation error:`, error); setError(`Create LP Error: ${error.message || 'Unknown error'}`);
    } finally { setIsCreatingPool(false); }
  };


  // handleAddLiquidity using internal state
  const handleAddLiquidity = async () => {
      setError(''); setIsAddingLiquidity(true);
      if (!wallet?.publicKey || !connection) { setError("Wallet/Connection missing."); setIsAddingLiquidity(false); return; }
      try {
        if (!existingPoolInfo) { setError("No active pool found. Create or load one first."); setIsAddingLiquidity(false); return; }
        // Validate the structure of existingPoolInfo before proceeding
        if (!existingPoolInfo.tokenAddress || existingPoolInfo.tokenDecimals === undefined ) { setError("Internal pool data incomplete."); setIsAddingLiquidity(false); return; }
        if (existingPoolInfo.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) { setError("Loaded token does not match the active pool's token."); setIsAddingLiquidity(false); return; }

        let rawTokenBalance; try { rawTokenBalance = new BN(tokenBalance); } catch(e) { setError(`Invalid tokenBalance format`); setIsAddingLiquidity(false); return; }
        if (rawTokenBalance.isZero()) { setError("Token Balance is zero."); setIsAddingLiquidity(false); return; }
        const rawTokenAmountToAdd = rawTokenBalance.mul(new BN(tokenPercentage)).div(new BN(100));
        if (rawTokenAmountToAdd.isZero()) { setError(`Calculated token amount is zero.`); setIsAddingLiquidity(false); return; }
        const solAmountFloat = parseFloat(solAmount);
        if (isNaN(solAmountFloat) || solAmountFloat <= 0) { setError("Invalid SOL amount."); setIsAddingLiquidity(false); return; }
        const solLamportsBN = new BN(new Decimal(solAmountFloat).mul(1e9).toFixed(0));
        console.log("[DEBUG UI] Add LP Args:", { rawTokenAmountToAdd: rawTokenAmountToAdd.toString(), solLamportsBN: solLamportsBN.toString() });

        let signature;
        let updatedPoolInfo = null; // To store updated state after adding

        if (isUsingRaydium && isRaydiumPool(existingPoolInfo)) { // Use isRaydiumPool helper from adapter
          console.log("[RAYDIUM] Adding liquidity via SDK");
          // Assuming addRaydiumLiquidity returns { signature, updatedPoolInfo }
          const result = await addRaydiumLiquidity(wallet, connection, existingPoolInfo, rawTokenAmountToAdd, solLamportsBN);
          signature = result?.signature;
          updatedPoolInfo = result?.updatedPoolInfo; // Get updated state if adapter provides it

        } else if (!isUsingRaydium){
          console.log("[SIMULATION] Adding simulated liquidity");
          // Assuming addSimulatedLiquidityToPool returns { signature, updatedPoolInfo }
          const result = await addSimulatedLiquidityToPool(wallet, existingPoolInfo, rawTokenAmountToAdd, solLamportsBN, subtractBalances);
           signature = result?.signature;
           updatedPoolInfo = result?.updatedPoolInfo; // Get updated state from simulation

        } else {
            throw new Error("Cannot add liquidity - pool keys missing or mode mismatch.");
        }

        if (signature) {
             alert(`✅ Liquidity added! Sig: ${signature}`);
             if (updatedPoolInfo) {
                setExistingPoolInfo(updatedPoolInfo); // Update local state
                setSimulatedPool(updatedPoolInfo); // Update shared store
             }
             refreshBalances(); // Refresh wallet balances
        } else {
            throw new Error("Add liquidity function did not return a signature.");
        }

      } catch (error) {
        console.error(`[DEBUG UI] Add liquidity error:`, error); setError(`Add LP Error: ${error.message || 'Unknown error'}`);
      } finally { setIsAddingLiquidity(false); }
  };

  // --- Render JSX ---
  const displayEstimatedToken = estimatedTokenAmountUI.toLocaleString(undefined, { maximumFractionDigits: tokenDecimals ?? 2 });
  // Use existingPoolInfo directly to determine button states
  const canCreate = !existingPoolInfo;
  const canAdd = !!existingPoolInfo;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        {/* Pool Active indicator relies on existingPoolInfo */}
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-white"> {isUsingRaydium ? '🌊 Raydium Liquidity (Devnet)' : '💧 Simulated Liquidity'} </h2>
           {existingPoolInfo && (
             <div className="px-3 py-1 bg-green-900 rounded-full text-green-400 text-xs font-medium">Pool Active</div>
           )}
        </div>
        {error && ( <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">{error}</div> )}
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="sol-amount-input-lp">SOL to Add</label>
            <input
               id="sol-amount-input-lp"
               type="number"
               value={solAmount}
               onChange={(e) => setSolAmount(e.target.value)}
               className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
               placeholder="e.g., 0.1"
               step="any"
               min="0"
            />
             <p className="text-gray-500 text-xs mt-1">Available: {solBalance?.toFixed(4) ?? '0.0000'} SOL</p>
        </div>
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <label className="text-gray-400 text-sm" htmlFor="token-percentage-slider-lp">Token % to Use</label>
                <span className="text-blue-400">{tokenPercentage}%</span>
            </div>
            <input
               id="token-percentage-slider-lp"
               type="range"
               min={1} max={100}
               value={tokenPercentage}
               onChange={(e) => setTokenPercentage(parseInt(e.target.value))}
               className="w-full appearance-none h-2 bg-gray-700 rounded-lg outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500" />
             <p className="text-gray-500 text-xs mt-1">Tokens to add: ~{displayEstimatedToken}</p>
             <p className="text-gray-500 text-xs mt-1">Available: {displayAvailableToken}</p>
        </div>
        <div className="p-4 mb-4 rounded-lg bg-gray-800">
            <h3 className="text-white text-md mb-2">Est. Contribution</h3>
            <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-400 text-xs">SOL</p><p className="text-white">{solAmount || '0'}</p></div>
                <div><p className="text-gray-400 text-xs">Tokens (UI)</p><p className="text-white">{displayEstimatedToken}</p></div>
             </div>
        </div>
        {isUsingRaydium && (
            <div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex">
                   <div className="text-blue-500 mr-2 text-lg">ⓘ</div>
                   <div className="text-blue-300 text-sm"><p>Using Raydium SDK for real LP on Solana Devnet.</p></div>
                </div>
            </div>)}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Buttons use canCreate/canAdd which depend on existingPoolInfo */}
            <button
                onClick={handleCreateLiquidity}
                disabled={isCreatingPool || !canCreate || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress} // Added !tokenAddress check
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-150 ${isCreatingPool || !canCreate || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}`}>
                {isCreatingPool ? (
                    <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...</>
                ) : (
                    <span>{canCreate ? 'Create LP' : 'Pool Exists'}</span> // Text changes based on pool existence
                )}
            </button>
            <button
                onClick={handleAddLiquidity}
                disabled={isAddingLiquidity || !canAdd || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress} // Added !tokenAddress check
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-150 ${isAddingLiquidity || !canAdd || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'}`}>
                 {isAddingLiquidity ? (
                     <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Adding...</>
                 ) : (
                     <span>Add More LP</span>
                 )}
             </button>
         </div>
     </div>
  );
}

export default SimulatedLiquidityManager;