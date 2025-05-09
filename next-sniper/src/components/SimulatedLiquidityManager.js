// src/components/SimulatedLiquidityManager.js
// Version with enhanced logging for network awareness debugging

import React, { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import { NATIVE_MINT } from '@solana/spl-token'; // getTokenAccountBalance is usually on connection
import { setSimulatedPool, getSimulatedPool } from '../utils/simulatedPoolStore';

// Assuming these simulation functions exist in LiquidityManager.js or are local
import {
  createSimulatedLiquidityPool,
  addSimulatedLiquidityToPool,
} from './LiquidityManager'; // Adjust path if necessary

import {
  createRaydiumPool,
} from '../utils/raydiumSdkAdapter';

const isRaydiumPool = (poolInfo) => {
  return poolInfo && !!poolInfo.raydiumPoolId;
};

Decimal.set({ precision: 50 });

/**
 * @param {object} props
 * @param {any} props.wallet
 * @param {import('@solana/web3.js').Connection} props.connection
 * @param {string} props.tokenAddress
 * @param {number} props.tokenDecimals
 * @param {string} props.tokenBalance
 * @param {number} props.solBalance
 * @param {() => Promise<void>} props.refreshBalances
 * @param {(amounts: { tokenAmount: any, solAmount: number }) => void} props.subtractBalances
 * @param {string} props.network // Crucial for network awareness
 */
function SimulatedLiquidityManager({
  wallet,
  connection,
  tokenAddress,
  tokenDecimals,
  tokenBalance,
  solBalance,
  refreshBalances,
  subtractBalances,
  network, // Network prop
}) {
  const [solAmount, setSolAmount] = useState('');
  const [tokenPercentage, setTokenPercentage] = useState(90);
  const [existingPoolInfo, setExistingPoolInfo] = useState(null);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [error, setError] = useState('');
  const [isUsingRaydium, setIsUsingRaydium] = useState(true);


  const estimatedTokenAmountUI = useMemo(() => {
    if (!tokenBalance || tokenDecimals === undefined || tokenDecimals === null) return 0;
    try {
      const rawBalance = new BN(tokenBalance);
      const rawAmount = rawBalance.mul(new BN(tokenPercentage)).div(new BN(100));
      return new Decimal(rawAmount.toString()).div(10 ** tokenDecimals).toNumber();
    } catch (e) { console.error("[SimulatedLiquidityManager] Error calculating estimated UI token amount:", e); return 0; }
  }, [tokenBalance, tokenPercentage, tokenDecimals]);

  const displayAvailableToken = useMemo(() => {
    if (!tokenBalance || tokenDecimals === undefined || tokenDecimals === null) return '0';
    try { return new Decimal(tokenBalance).div(10**tokenDecimals).toDP(tokenDecimals).toString(); }
    catch (e) { console.error("[SimulatedLiquidityManager] Error calculating displayAvailableToken", e); return 'Error'; }
  }, [tokenBalance, tokenDecimals]);

  // Effect for seeding on-chain pool info
  useEffect(() => {
    const logPrefix = "[SimulatedLiquidityManager][seedOnChainPool]";
    console.log(`${logPrefix} Effect triggered. Current network: ${network}, Token: ${tokenAddress}`);

    async function seedOnChainPool() {
      console.log(`${logPrefix} Starting pool seeding process.`);
      setExistingPoolInfo(null);
      setSimulatedPool(null); // Clear shared store

      if (!wallet?.publicKey) { console.log(`${logPrefix} Skipped: Wallet not connected.`); return; }
      if (!connection) { console.log(`${logPrefix} Skipped: Connection object missing.`); return; }
      if (!tokenAddress) { console.log(`${logPrefix} Skipped: Token address missing.`); return; }
      if (tokenDecimals === undefined || tokenDecimals === null) { console.log(`${logPrefix} Skipped: Token decimals missing.`); return; }
      if (!network) { console.log(`${logPrefix} Skipped: Network prop missing.`); return; }

      let mintB_PublicKey;
      try {
        mintB_PublicKey = new PublicKey(tokenAddress);
        console.log(`${logPrefix} Validated tokenAddress to PublicKey: ${mintB_PublicKey.toBase58()}`);
      } catch (e) {
        console.log(`${logPrefix} Skipped: Invalid token address format "${tokenAddress}". Error: ${e.message}`);
        return;
      }

      console.log(`${logPrefix} Attempting to seed pool for token: ${tokenAddress} on network: ${network}`);

      let programIdToUse;
      let configIdStrToUse;
      let MAINNET_AMM_V4_PROGRAM_ID, DEVNET_AMM_V4_PROGRAM_ID, MAINNET_AMM_V4_CONFIG_ID_STR, DEVNET_AMM_V4_CONFIG_ID_STR;

      try {
        // Dynamically import constants
        const consts = await import('../utils/raydiumConsts');
        MAINNET_AMM_V4_PROGRAM_ID = consts.MAINNET_AMM_V4_PROGRAM_ID;
        DEVNET_AMM_V4_PROGRAM_ID = consts.DEVNET_AMM_V4_PROGRAM_ID;
        MAINNET_AMM_V4_CONFIG_ID_STR = consts.MAINNET_AMM_V4_CONFIG_ID_STR;
        DEVNET_AMM_V4_CONFIG_ID_STR = consts.DEVNET_AMM_V4_CONFIG_ID_STR;
        console.log(`${logPrefix} Successfully imported Raydium constants.`);
      } catch (e) {
        console.error(`${logPrefix} Failed to import Raydium constants:`, e);
        setError("Internal error: Failed to load Raydium configuration.");
        return;
      }

      if (network === 'mainnet-beta') {
        programIdToUse = MAINNET_AMM_V4_PROGRAM_ID;
        configIdStrToUse = MAINNET_AMM_V4_CONFIG_ID_STR;
        console.log(`${logPrefix} Using MAINNET IDs. Program: ${programIdToUse?.toBase58()}, ConfigStr: ${configIdStrToUse}`);
      } else { // Default to devnet
        programIdToUse = DEVNET_AMM_V4_PROGRAM_ID;
        configIdStrToUse = DEVNET_AMM_V4_CONFIG_ID_STR;
        console.log(`${logPrefix} Using DEVNET IDs. Program: ${programIdToUse?.toBase58()}, ConfigStr: ${configIdStrToUse}`);
      }

      if (!programIdToUse) {
        console.error(`${logPrefix} Program ID is undefined for network: ${network}. Check raydiumConsts.ts and import.`);
        setError(`Internal error: Missing Raydium Program ID for ${network}.`);
        return;
      }
      if (!configIdStrToUse) {
        console.error(`${logPrefix} Config ID String is undefined for network: ${network}. Check raydiumConsts.ts and import.`);
        setError(`Internal error: Missing Raydium Config ID String for ${network}.`);
        return;
      }

      let configIdToUse_PublicKey;
      try {
        configIdToUse_PublicKey = new PublicKey(configIdStrToUse);
        console.log(`${logPrefix} Successfully created PublicKey from Config ID string "${configIdStrToUse}".`);
      } catch (e) {
        console.error(`${logPrefix} Invalid Config ID string "${configIdStrToUse}" for PublicKey creation on ${network}:`, e);
        setError(`Internal error: Invalid Raydium config ID format for ${network}.`);
        return;
      }

      try {
        const mintA_PublicKey = NATIVE_MINT;
        console.log(`${logPrefix} Deriving pool keys with Program=${programIdToUse.toBase58()}, Config=${configIdToUse_PublicKey.toBase58()}, MintA=${mintA_PublicKey.toBase58()}, MintB=${mintB_PublicKey.toBase58()}`);

        const poolKeys = getCreatePoolKeys({
          programId: programIdToUse,
          configId:  configIdToUse_PublicKey,
          mintA: mintA_PublicKey,
          mintB: mintB_PublicKey
        });
        console.log(`${logPrefix} Derived Pool Keys: PoolId=${poolKeys.poolId.toBase58()}, VaultA=${poolKeys.vaultA.toBase58()}, VaultB=${poolKeys.vaultB.toBase58()}`);

        console.log(`${logPrefix} Fetching SOL vault (VaultA) balance: ${poolKeys.vaultA.toBase58()}`);
        const solBalInfo = await connection.getTokenAccountBalance(poolKeys.vaultA, 'confirmed');
        const solBal = solBalInfo.value.uiAmount || 0;
        console.log(`${logPrefix} SOL vault balance: ${solBal}`);

        console.log(`${logPrefix} Fetching Token vault (VaultB) balance: ${poolKeys.vaultB.toBase58()}`);
        const tokenBalInfo = await connection.getTokenAccountBalance(poolKeys.vaultB, 'confirmed');
        const tokenBal = tokenBalInfo.value.uiAmount || 0;
        console.log(`${logPrefix} Token vault balance: ${tokenBal}`);

        console.log(`${logPrefix} On-chain balances for derived vaults: SOL=${solBal}, Token=${tokenBal}`);
        if (solBal === 0 || tokenBal === 0) {
            console.log(`${logPrefix} No existing on-chain pool found with this specific derivation (zero balance in one or both vaults).`);
            setSimulatedPool(null); // Explicitly clear if no pool found by this method
            return;
        }

        const price = solBal / tokenBal;
        const poolInfo = {
          tokenAddress:   tokenAddress.toLowerCase(),
          tokenDecimals,
          tokenAmount:    tokenBal,
          solAmount:      solBal,
          price,
          volume:         0,
          candles: [{ open: price, high: price, low: price, close: price, timestamp: Date.now() }],
          raydiumPoolId:   poolKeys.poolId.toBase58(),
          raydiumPoolKeys: JSON.stringify(poolKeys),
          isSeeded: true,
        };

        console.log(`${logPrefix} Seeding existing pool info into component state and shared store:`, poolInfo);
        setExistingPoolInfo(poolInfo);
        setSimulatedPool(poolInfo);
        setError(''); // Clear previous errors if successful
      } catch (err) {
        // Log specific errors if possible, e.g., account not found means no pool
        if (err.message && (err.message.includes('could not find account') || err.message.includes('TokenAccountNotFoundError'))) {
             console.log(`${logPrefix} No existing on‐chain pool found for ${tokenAddress} on ${network}. Vault account(s) not found for this specific derivation. Error: ${err.message}`);
        } else {
             console.error(`${logPrefix} Error during on-chain pool seeding for ${tokenAddress} on ${network}:`, err);
             setError(`Seed Error: ${err.message || 'Unknown error during pool seeding.'}`);
        }
        // Ensure state is clear if an error occurs
        setExistingPoolInfo(null);
        setSimulatedPool(null);
      }
    }

    seedOnChainPool();
  }, [wallet, connection, tokenAddress, tokenDecimals, network]); // Removed setSimulatedPool from deps as it's an import, not prop/state

  // ... (handleCreateLiquidity and handleAddLiquidity functions remain the same as in your file) ...
  // Make sure handleCreateLiquidity calls createRaydiumPool which ALSO needs to be network aware.

  const handleCreateLiquidity = async () => {
    const logPrefix = "[SimulatedLiquidityManager][handleCreateLiquidity]";
    setError(''); setIsCreatingPool(true);
    console.log(`${logPrefix} Initiated. Network: ${network}`);

    if (!wallet?.publicKey || !connection || !tokenAddress || tokenDecimals === undefined || !tokenBalance || !network) {
      const missing = [];
      if (!wallet?.publicKey) missing.push("Wallet");
      if (!connection) missing.push("Connection");
      if (!tokenAddress) missing.push("Token Address");
      if (tokenDecimals === undefined) missing.push("Token Decimals");
      if (!tokenBalance) missing.push("Token Balance");
      if (!network) missing.push("Network");
      const errMsg = `Create LP Error: Missing prerequisites - ${missing.join(', ')}.`;
      console.error(`${logPrefix} ${errMsg}`);
      setError(errMsg);
      setIsCreatingPool(false);
      return;
    }

    let mintPublicKey;
    try {
      mintPublicKey = new PublicKey(tokenAddress);
    } catch (e) {
      console.error(`${logPrefix} Invalid token address format: ${tokenAddress}. Error: ${e.message}`);
      setError(`Invalid token address format.`);
      setIsCreatingPool(false);
      return;
    }

    try {
      let rawTokenBalanceBN;
      try {
        rawTokenBalanceBN = new BN(tokenBalance);
      } catch(e) {
        console.error(`${logPrefix} Invalid tokenBalance string format: ${tokenBalance}. Error: ${e.message}`);
        setError(`Invalid tokenBalance format.`);
        setIsCreatingPool(false);
        return;
      }

      if (rawTokenBalanceBN.isZero()) {
        console.warn(`${logPrefix} Token Balance is zero. Cannot create LP.`);
        setError("Token Balance is zero.");
        setIsCreatingPool(false);
        return;
      }

      const rawTokenAmountToSendBN = rawTokenBalanceBN.mul(new BN(tokenPercentage)).div(new BN(100));
      if (rawTokenAmountToSendBN.isZero()) {
        console.warn(`${logPrefix} Calculated token amount to send is zero (TokenBalance: ${tokenBalance}, Percentage: ${tokenPercentage}%).`);
        setError(`Calculated token amount to send is zero. Adjust percentage or balance.`);
        setIsCreatingPool(false);
        return;
      }

      const solAmountFloat = parseFloat(solAmount);
      if (isNaN(solAmountFloat) || solAmountFloat <= 0) {
        console.warn(`${logPrefix} Invalid or zero SOL amount: ${solAmount}.`);
        setError("Invalid or zero SOL amount.");
        setIsCreatingPool(false);
        return;
      }
      const solLamportsBN = new BN(new Decimal(solAmountFloat).mul(1e9).toFixed(0));

      console.log(`${logPrefix} Args for LP creation: TokenAddress=${tokenAddress}, Decimals=${tokenDecimals}, RawTokenAmountToSend=${rawTokenAmountToSendBN.toString()}, SolLamports=${solLamportsBN.toString()}`);

      let result;
      if (isUsingRaydium) {
        console.log(`${logPrefix} Using Raydium SDK for pool creation on ${network}.`);
        // IMPORTANT: createRaydiumPool in raydiumSdkAdapter.js ALSO needs to be made network-aware.
        // Pass the network to it if it's modified to accept it.
        result = await createRaydiumPool(wallet, connection, tokenAddress, tokenDecimals, rawTokenAmountToSendBN, solLamportsBN /*, network */);
        console.log(`${logPrefix} createRaydiumPool result:`, result);
      } else {
        console.log(`${logPrefix} Using simulation for pool creation.`);
        result = await createSimulatedLiquidityPool(wallet, tokenAddress, tokenDecimals, rawTokenAmountToSendBN, solLamportsBN, subtractBalances);
        console.log(`${logPrefix} createSimulatedLiquidityPool result:`, result);
      }

      const poolData = result?.poolInfo || result?.poolKeys; // poolKeys is for older compatibility

      if (poolData && result?.signature) {
          const isDataComplete = poolData.tokenAddress && poolData.tokenDecimals !== undefined;
          if(!isDataComplete) {
            console.error(`${logPrefix} Pool data received from creation function is incomplete:`, poolData);
            throw new Error("Pool data received is incomplete after creation.");
          }
          console.log(`${logPrefix} Pool creation successful. Pool Data:`, poolData, "Signature:", result.signature);
          setExistingPoolInfo(poolData);
          setSimulatedPool(poolData); // Update shared store
          alert(`✅ Pool created! Sig: ${result.signature.substring(0,15)}...`);
          refreshBalances();
      } else {
          console.error(`${logPrefix} Pool creation function did not return expected result. Result:`, result);
          if(result?.signature) {
            alert(`❓ Pool TX sent (${result.signature.substring(0,15)}...), but state/pool info might be missing from result.`);
          } else {
            throw new Error("Pool creation function did not return signature or pool data.");
          }
      }
    } catch (error) {
      console.error(`${logPrefix} LP creation failed:`, error);
      setError(`Create LP Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreatingPool(false);
      console.log(`${logPrefix} Creation process finished.`);
    }
  };

  const handleAddLiquidity = async () => {
    const logPrefix = "[SimulatedLiquidityManager][handleAddLiquidity]";
    setError(''); setIsAddingLiquidity(true);
    console.log(`${logPrefix} Initiated. Network: ${network}`);

    if (!wallet?.publicKey || !connection) {
      const errMsg = "Add LP Error: Wallet/Connection missing.";
      console.error(`${logPrefix} ${errMsg}`);
      setError(errMsg);
      setIsAddingLiquidity(false);
      return;
    }
    try {
      if (!existingPoolInfo) {
        const errMsg = "Add LP Error: No active pool found. Create or load one first.";
        console.warn(`${logPrefix} ${errMsg}`);
        setError(errMsg);
        setIsAddingLiquidity(false);
        return;
      }
      if (!existingPoolInfo.tokenAddress || existingPoolInfo.tokenDecimals === undefined ) {
        const errMsg = "Add LP Error: Internal pool data incomplete.";
        console.error(`${logPrefix} ${errMsg} Pool Info:`, existingPoolInfo);
        setError(errMsg);
        setIsAddingLiquidity(false);
        return;
      }
      if (existingPoolInfo.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) {
        const errMsg = `Add LP Error: Loaded token ${tokenAddress} does not match the active pool's token ${existingPoolInfo.tokenAddress}.`;
        console.warn(`${logPrefix} ${errMsg}`);
        setError(errMsg);
        setIsAddingLiquidity(false);
        return;
      }

      let rawTokenBalanceBN;
      try {
        rawTokenBalanceBN = new BN(tokenBalance);
      } catch(e) {
        console.error(`${logPrefix} Invalid tokenBalance string format: ${tokenBalance}. Error: ${e.message}`);
        setError(`Invalid tokenBalance format.`);
        setIsAddingLiquidity(false);
        return;
      }
      if (rawTokenBalanceBN.isZero()) {
        console.warn(`${logPrefix} Token Balance is zero. Cannot add liquidity.`);
        setError("Token Balance is zero.");
        setIsAddingLiquidity(false);
        return;
      }

      const rawTokenAmountToAddBN = rawTokenBalanceBN.mul(new BN(tokenPercentage)).div(new BN(100));
      if (rawTokenAmountToAddBN.isZero()) {
        console.warn(`${logPrefix} Calculated token amount to add is zero.`);
        setError(`Calculated token amount to add is zero. Adjust percentage or balance.`);
        setIsAddingLiquidity(false);
        return;
      }

      const solAmountFloat = parseFloat(solAmount);
      if (isNaN(solAmountFloat) || solAmountFloat <= 0) {
        console.warn(`${logPrefix} Invalid or zero SOL amount: ${solAmount}.`);
        setError("Invalid SOL amount for adding liquidity.");
        setIsAddingLiquidity(false);
        return;
      }
      const solLamportsToAddBN = new BN(new Decimal(solAmountFloat).mul(1e9).toFixed(0));
      console.log(`${logPrefix} Args for adding LP: RawTokenAmountToAdd=${rawTokenAmountToAddBN.toString()}, SolLamportsToAdd=${solLamportsToAddBN.toString()}`);


      let signature;
      let updatedPoolInfo = null;

      if (isUsingRaydium && isRaydiumPool(existingPoolInfo)) {
        console.log(`${logPrefix} Using Raydium SDK to add liquidity on ${network}.`);
        // IMPORTANT: This part needs a real implementation in raydiumSdkAdapter.js for adding to existing Raydium pools
        // const result = await addRaydiumLiquidity(wallet, connection, existingPoolInfo, rawTokenAmountToAddBN, solLamportsToAddBN /*, network */);
        // signature = result?.signature;
        // updatedPoolInfo = result?.updatedPoolInfo;
        const notImplMsg = "Functionality to add liquidity to an existing *Raydium* pool via SDK is not fully implemented in the adapter yet.";
        console.warn(`${logPrefix} ${notImplMsg}`);
        setError(notImplMsg);
        throw new Error(notImplMsg);

      } else if (!isUsingRaydium && existingPoolInfo){ // Ensure existingPoolInfo is available for simulation
        console.log(`${logPrefix} Using simulation to add liquidity.`);
        // addSimulatedLiquidityToPool expects the current pool state as `existingPoolInfo`
        const result = await addSimulatedLiquidityToPool(wallet, existingPoolInfo, rawTokenAmountToAddBN, solLamportsToAddBN, subtractBalances);
        signature = result?.signature; // Assuming it returns { signature, updatedPoolInfo } or just signature string
        updatedPoolInfo = result?.updatedPoolInfo || getSimulatedPool(); // Get updated pool from store if not directly returned
        console.log(`${logPrefix} addSimulatedLiquidityToPool result signature: ${signature}, updatedPoolInfo:`, updatedPoolInfo);
      } else {
          const errMsg = "Cannot add liquidity - pool keys missing, pool not found, or mode mismatch.";
          console.error(`${logPrefix} ${errMsg}`);
          throw new Error(errMsg);
      }

      if (signature) {
           console.log(`${logPrefix} Liquidity added successfully. Signature: ${signature}`);
           alert(`✅ Liquidity added! Sig: ${typeof signature === 'string' ? signature.substring(0,15) : 'sim_sig'}...`);
           if (updatedPoolInfo) {
              console.log(`${logPrefix} Updating component and shared store with new pool info:`, updatedPoolInfo);
              setExistingPoolInfo(updatedPoolInfo);
              setSimulatedPool(updatedPoolInfo);
           } else {
               console.warn(`${logPrefix} updatedPoolInfo was null after adding liquidity.`);
           }
           refreshBalances();
      } else {
          console.error(`${logPrefix} Add liquidity function did not return a signature.`);
          throw new Error("Add liquidity function did not return a signature.");
      }
    } catch (error) {
      console.error(`${logPrefix} Add liquidity failed:`, error);
      setError(`Add LP Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAddingLiquidity(false);
      console.log(`${logPrefix} Add liquidity process finished.`);
    }
  };


  // --- Render JSX ---
  const displayEstimatedToken = estimatedTokenAmountUI.toLocaleString(undefined, { maximumFractionDigits: tokenDecimals ?? 2 });
  const canCreate = !existingPoolInfo; // Simplification: can create if no pool is currently loaded/seeded
  const canAdd = !!existingPoolInfo;   // Can add if a pool is loaded/seeded

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-white"> {isUsingRaydium ? `🌊 Raydium Liquidity (${network || 'N/A'})` : '💧 Simulated Liquidity'} </h2>
           {existingPoolInfo && (
             <div className="px-3 py-1 bg-green-900 rounded-full text-green-400 text-xs font-medium">Pool Active/Seeded</div>
           )}
        </div>
        {error && ( <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">{error}</div> )}
        {/* SOL Amount Input */}
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="sol-amount-input-lp">SOL to Add</label>
            <input
               id="sol-amount-input-lp" type="number" value={solAmount}
               onChange={(e) => setSolAmount(e.target.value)}
               className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
               placeholder="e.g., 0.1" step="any" min="0" />
             <p className="text-gray-500 text-xs mt-1">Available: {solBalance?.toFixed(4) ?? '0.0000'} SOL</p>
        </div>
        {/* Token Percentage Slider */}
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <label className="text-gray-400 text-sm" htmlFor="token-percentage-slider-lp">Token % to Use</label>
                <span className="text-blue-400">{tokenPercentage}%</span>
            </div>
            <input
               id="token-percentage-slider-lp" type="range" min={1} max={100} value={tokenPercentage}
               onChange={(e) => setTokenPercentage(parseInt(e.target.value))}
               className="w-full appearance-none h-2 bg-gray-700 rounded-lg outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500" />
             <p className="text-gray-500 text-xs mt-1">Tokens to add: ~{displayEstimatedToken}</p>
             <p className="text-gray-500 text-xs mt-1">Available: {displayAvailableToken}</p>
        </div>
        {/* Estimated Contribution Display */}
        <div className="p-4 mb-4 rounded-lg bg-gray-800">
            <h3 className="text-white text-md mb-2">Est. Contribution</h3>
            <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-400 text-xs">SOL</p><p className="text-white">{solAmount || '0'}</p></div>
                <div><p className="text-gray-400 text-xs">Tokens (UI)</p><p className="text-white">{displayEstimatedToken}</p></div>
             </div>
        </div>
        {/* Raydium Info Box */}
        {isUsingRaydium && (
            <div className="p-3 mb-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <div className="flex">
                   <div className="text-blue-500 mr-2 text-lg">ⓘ</div>
                   <div className="text-blue-300 text-sm"><p>Using Raydium SDK for real LP operations on Solana {network || 'N/A'}. Ensure adapter is also network-aware for creation.</p></div>
                </div>
            </div>
        )}
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
                onClick={handleCreateLiquidity}
                disabled={isCreatingPool || !canCreate || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress || !network}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-150 ${(isCreatingPool || !canCreate || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress || !network) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}`}>
                {isCreatingPool ? 'Creating...' : (canCreate ? 'Create LP' : 'Pool Active/Seeded')}
            </button>
            <button
                onClick={handleAddLiquidity}
                disabled={isAddingLiquidity || !canAdd || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress || !network}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-150 ${(isAddingLiquidity || !canAdd || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress || !network) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'}`}>
                 {isAddingLiquidity ? 'Adding...' : 'Add More LP'}
             </button>
         </div>
     </div>
  );
}

export default SimulatedLiquidityManager;