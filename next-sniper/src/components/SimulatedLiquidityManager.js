// src/components/SimulatedLiquidityManager.js

import React, { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { getCreatePoolKeys, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk-v2'; // LiquidityPoolKeysV4 for type
import {
    TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    getMint, // Import getMint for fetching LP token decimals
    // ASSOCIATED_TOKEN_PROGRAM_ID, // Not directly used in this file's logic
    // getTokenAccountBalance, // We use connection.getTokenAccountBalance directly
} from '@solana/spl-token';
import { getSimulatedPool, setSimulatedPool } from '../utils/simulatedPoolStore';
import {
    DEVNET_CREATE_POOL_PROGRAM_ID,
    DEVNET_AMM_V4_CONFIG_ID_STR, // This is the CPMM Config ID for Devnet (9zSz...)
} from '../utils/raydiumConsts'; // Import Devnet constants

// Assuming these simulation functions exist in LiquidityManager.js
import {
    createSimulatedLiquidityPool,
    addSimulatedLiquidityToPool,
} from './LiquidityManager';

import {
    createRaydiumPool,
    // isRaydiumPool // We can determine if it's a Raydium pool by checking specific fields like raydiumPoolId
} from '../utils/raydiumSdkAdapter';

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
 * @param {string} props.network - Current network ('devnet' or 'mainnet-beta')
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
    network, // Added network prop
}) {
    const [solAmount, setSolAmount] = useState('');
    const [tokenPercentage, setTokenPercentage] = useState(90);
    const [existingPoolInfo, setExistingPoolInfo] = useState(null);
    const [isCreatingPool, setIsCreatingPool] = useState(false);
    const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
    const [error, setError] = useState('');
    
    // isUsingRaydium now determines if actual Raydium transactions are made for LP management.
    // For Devnet, when a pool is "seeded", we are reading its state, not necessarily creating it via this component.
    // This switch primarily affects the "Create LP" and "Add More LP" buttons' actions.
    const [isUsingRaydium, setIsUsingRaydium] = useState(true); // Default to true for Raydium SDK operations

    const estimatedTokenAmountUI = useMemo(() => {
        if (!tokenBalance || tokenDecimals === undefined || tokenDecimals === null) return 0;
        try {
            const rawBalance = new BN(tokenBalance);
            const rawAmount = rawBalance.mul(new BN(tokenPercentage)).div(new BN(100));
            return new Decimal(rawAmount.toString()).div(new Decimal(10).pow(tokenDecimals)).toNumber();
        } catch (e) { console.error("Error calculating estimated UI token amount:", e); return 0; }
    }, [tokenBalance, tokenPercentage, tokenDecimals]);

    const displayAvailableToken = useMemo(() => {
        if (!tokenBalance || tokenDecimals === undefined || tokenDecimals === null) return '0';
        try { return new Decimal(tokenBalance).div(new Decimal(10).pow(tokenDecimals)).toDP(tokenDecimals).toString(); }
        catch (e) { console.error("Error calculating displayAvailableToken", e); return 'Error'; }
    }, [tokenBalance, tokenDecimals]);

    useEffect(() => { /* Optional: Add checks or logs if needed */ }, [wallet]);

    // Effect to seed on-chain pool info into simulatedPoolStore when on Devnet
    useEffect(() => {
        async function seedDevnetPoolToStore() {
            // Clear local existingPoolInfo for this component; the store is the source of truth for other components.
            setExistingPoolInfo(null); 

            if (network !== 'devnet' || !wallet?.publicKey || !connection || !tokenAddress || tokenDecimals === undefined || tokenDecimals === null) {
                if (network !== 'devnet') { // If switched away from devnet
                    const currentSimPool = getSimulatedPool();
                    if (currentSimPool && currentSimPool.tokenAddress === tokenAddress?.toLowerCase() && currentSimPool.isSeeded && currentSimPool.type === 'CPMM_DEVNET_SEEDED') {
                        console.log("[SimulatedLiquidityManager] Network is not Devnet. Clearing Devnet seeded pool from store.");
                        setSimulatedPool(null);
                    }
                } else {
                     console.debug("[SimulatedLiquidityManager] Seed Devnet pool check skipped (not Devnet or missing critical data).");
                }
                return;
            }

            console.log("[SimulatedLiquidityManager] Attempting to seed Devnet pool info into store for token:", tokenAddress);
            try {
                let mintB_Token;
                try {
                    mintB_Token = new PublicKey(tokenAddress);
                } catch (e) {
                    console.warn("[SimulatedLiquidityManager] Invalid token address format for seeding:", tokenAddress);
                    if (getSimulatedPool()?.tokenAddress === tokenAddress?.toLowerCase()) setSimulatedPool(null);
                    return;
                }

                const cpmmProgramId = DEVNET_CREATE_POOL_PROGRAM_ID;
                const cpmmConfigId = new PublicKey(DEVNET_AMM_V4_CONFIG_ID_STR); // Using the CPMM config ID from raydiumConsts
                const mintA_SOL = NATIVE_MINT;

                const derivedKeys = getCreatePoolKeys({ // Type: LiquidityPoolKeysV4 from SDK
                    programId: cpmmProgramId,
                    configId: cpmmConfigId,
                    mintA: mintA_SOL,
                    mintB: mintB_Token,
                });
                
                console.debug("[SimulatedLiquidityManager] Devnet Derived Pool Keys for seeding store:", JSON.stringify(derivedKeys, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2));

                const vaultASolBalanceInfo = await connection.getTokenAccountBalance(derivedKeys.vaultA, 'confirmed').catch(() => null);
                const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(derivedKeys.vaultB, 'confirmed').catch(() => null);

                if (!vaultASolBalanceInfo || !vaultBTokenBalanceInfo) {
                    console.log("[SimulatedLiquidityManager] Devnet pool vaults not found for derived keys. Pool may not exist. Clearing store if it matches token.");
                    if (getSimulatedPool()?.tokenAddress === tokenAddress?.toLowerCase()) setSimulatedPool(null);
                    setExistingPoolInfo(null); // Also clear local state
                    return;
                }

                const solReserveBN = new BN(vaultASolBalanceInfo.value.amount);
                const tokenReserveBN = new BN(vaultBTokenBalanceInfo.value.amount);
                
                const solReserveUi = new Decimal(solReserveBN.toString()).div(1e9);
                const tokenReserveUi = new Decimal(tokenReserveBN.toString()).div(new Decimal(10).pow(tokenDecimals));
                const price = tokenReserveUi.isZero() ? new Decimal(0) : solReserveUi.div(tokenReserveUi);

                let lpMintSupplyBN = new BN(0);
                let lpDecimalsVal = derivedKeys.lpDecimals ?? 0; // Use lpDecimals from derivedKeys if available
                try {
                    const lpMintInfo = await getMint(connection, derivedKeys.lpMint);
                    lpMintSupplyBN = new BN(lpMintInfo.supply.toString());
                    if(lpDecimalsVal === 0 && lpMintInfo.decimals !==0) lpDecimalsVal = lpMintInfo.decimals; // Prefer fetched if derived was 0
                     console.log(`[SimulatedLiquidityManager] LP Mint ${derivedKeys.lpMint.toBase58()} Supply: ${lpMintSupplyBN.toString()}, Decimals: ${lpDecimalsVal}`);
                } catch (lpError) {
                    console.warn(`[SimulatedLiquidityManager] Could not fetch LP mint info for ${derivedKeys.lpMint.toBase58()}, using defaults/derived:`, lpError);
                }
                
                // Structure for simulatedPoolStore, needs to be consumable by TradingInterface and Chart
                const poolInfoForStore = {
                    id: derivedKeys.poolId.toString(),
                    programId: cpmmProgramId.toString(),
                    type: 'CPMM_DEVNET_SEEDED', // Indicate it's a live, derived Devnet pool
                    price: price.toNumber(),
                    tvl: solReserveUi.plus(tokenReserveUi.mul(price)).toNumber(),
                    mintA: mintA_SOL.toBase58(),
                    mintB: tokenAddress, // Use original case for consistency if preferred by other components
                    vaultA: derivedKeys.vaultA.toString(),
                    vaultB: derivedKeys.vaultB.toString(),
                    
                    // This rawSdkPoolInfo needs to be what swapRaydiumTokens expects
                    rawSdkPoolInfo: {
                        id: derivedKeys.poolId,
                        programId: cpmmProgramId,
                        configId: cpmmConfigId, // from derivedKeys.configId
                        observationId: derivedKeys.observationId,
                        authority: derivedKeys.authority,
                        mintA: { address: mintA_SOL, decimals: 9, programId: derivedKeys.mintAProgramId || TOKEN_PROGRAM_ID },
                        mintB: { address: mintB_Token, decimals: tokenDecimals, programId: derivedKeys.mintBProgramId || TOKEN_PROGRAM_ID },
                        mintLp: { address: derivedKeys.lpMint, decimals: lpDecimalsVal, programId: derivedKeys.mintLpProgramId || TOKEN_PROGRAM_ID },
                        vaultA: derivedKeys.vaultA,
                        vaultB: derivedKeys.vaultB,
                        baseReserve: solReserveBN,
                        quoteReserve: tokenReserveBN,
                        lpAmount: lpMintSupplyBN,
                        status: new BN(derivedKeys.status?.toString() || "0"), // Use status from derivedKeys or default to 0 (Active)
                        openTime: new BN(derivedKeys.openTime?.toString() || Math.floor(Date.now() / 1000).toString()),
                        configInfo: { // These fee rates are examples, SDK might provide them in derivedKeys or they need to be known
                            id: cpmmConfigId,
                            index: derivedKeys.configIndex ?? 0,
                            tradeFeeRate: derivedKeys.tradeFeeRate ?? new BN(2500), // e.g., 0.25%
                            protocolFeeRate: derivedKeys.protocolFeeRate ?? new BN(0),
                            fundFeeRate: derivedKeys.fundFeeRate ?? new BN(0),
                            createPoolFee: derivedKeys.createPoolFee ?? new BN(0)
                        },
                        mintDecimalA: 9, // SOL decimals
                        mintDecimalB: tokenDecimals,
                    },
                    
                    // Keep these for compatibility with existing simulatedPoolStore consumers if any
                    tokenAddress: tokenAddress.toLowerCase(),
                    tokenDecimals: tokenDecimals,
                    tokenAmount: tokenReserveUi.toNumber(),
                    solAmount: solReserveUi.toNumber(),
                    volume: 0, 
                    candles: [{ open: price.toNumber(), high: price.toNumber(), low: price.toNumber(), close: price.toNumber(), timestamp: Date.now() }],
                    isSeeded: true, 
                    // Add raydiumPoolId for components that might use it directly, like old isRaydiumPool check
                    raydiumPoolId: derivedKeys.poolId.toString(), 
                };

                console.log("[SimulatedLiquidityManager] Seeding Devnet pool info into simulatedPoolStore:", poolInfoForStore);
                setSimulatedPool(poolInfoForStore);
                setExistingPoolInfo(poolInfoForStore); // Also set local state for this component's UI (e.g., "Pool Active")

            } catch (err) {
                console.error("[SimulatedLiquidityManager] Error trying to seed Devnet pool for store:", err);
                // Clear store only if the error is for the current token address to avoid race conditions
                const currentSimPool = getSimulatedPool();
                if (currentSimPool && currentSimPool.tokenAddress === tokenAddress?.toLowerCase()) {
                    setSimulatedPool(null);
                }
                setExistingPoolInfo(null);
            }
        }
        // This effect depends on network, wallet, connection, tokenAddress, tokenDecimals
        seedDevnetPoolToStore();

    }, [wallet, connection, tokenAddress, tokenDecimals, network, setSimulatedPool]); // setSimulatedPool is from import, stable.

    const handleCreateLiquidity = async () => {
        setError(''); setIsCreatingPool(true);
        if (!wallet?.publicKey || !connection || !tokenAddress || tokenDecimals === undefined || !tokenBalance) { 
            setError("Wallet/Connection/Token details missing for Create LP."); 
            setIsCreatingPool(false); return; 
        }
        
        // On Devnet, if a pool is already seeded (meaning it exists), prevent accidental re-creation via this button.
        // User should use "Add More LP" or manage it elsewhere if this component isn't for creating *new* Devnet pools.
        if (network === 'devnet' && existingPoolInfo && existingPoolInfo.isSeeded) {
            setError("A Devnet pool already exists or is seeded. Use 'Add More LP' or manage via other means.");
            setIsCreatingPool(false);
            return;
        }

        try {
            let rawTokenBalanceBN; 
            try { rawTokenBalanceBN = new BN(tokenBalance); } 
            catch(e) { setError(`Invalid tokenBalance format`); setIsCreatingPool(false); return; }

            if (rawTokenBalanceBN.isZero()) { setError("Token Balance is zero."); setIsCreatingPool(false); return; }
            const rawTokenAmountToSend = rawTokenBalanceBN.mul(new BN(tokenPercentage)).div(new BN(100));
            if (rawTokenAmountToSend.isZero()) { setError(`Calculated token amount to send is zero.`); setIsCreatingPool(false); return; }
            
            const solAmountFloat = parseFloat(solAmount);
            if (isNaN(solAmountFloat) || solAmountFloat <= 0) { setError("Invalid or zero SOL amount."); setIsCreatingPool(false); return; }
            const solLamportsBN = new BN(new Decimal(solAmountFloat).mul(1e9).toFixed(0));

            console.log("[SimulatedLiquidityManager] Create LP Args:", { tokenAddress, tokenDecimals, rawTokenAmountToSend: rawTokenAmountToSend.toString(), solLamportsBN: solLamportsBN.toString(), isUsingRaydium, network });

            let result;
            if (isUsingRaydium) { // This implies on-chain creation attempt
                if (network !== 'devnet') {
                     setError("On-chain Raydium LP creation via this interface is intended for Devnet only.");
                     setIsCreatingPool(false);
                     return;
                }
                console.log("[SimulatedLiquidityManager] Creating ON-CHAIN Raydium pool (Devnet)...");
                result = await createRaydiumPool(wallet, connection, tokenAddress, tokenDecimals, rawTokenAmountToSend, solLamportsBN);
            } else {
                console.log("[SimulatedLiquidityManager] Creating SIMULATED pool...");
                result = await createSimulatedLiquidityPool(wallet, tokenAddress, tokenDecimals, rawTokenAmountToSend, solLamportsBN, subtractBalances);
            }

            const poolDataFromOp = result?.poolInfo || result?.poolKeys; 

            if (poolDataFromOp && result?.signature) {
                const isDataComplete = poolDataFromOp.tokenAddress && poolDataFromOp.tokenDecimals !== undefined && poolDataFromOp.id; // Added poolDataFromOp.id
                if(!isDataComplete) { throw new Error("Pool data from operation is incomplete."); }

                setExistingPoolInfo(poolDataFromOp);
                setSimulatedPool(poolDataFromOp); 

                alert(`✅ Pool operation successful! Sig: ${result.signature.substring(0,20)}...`);
                refreshBalances();
            } else {
                throw new Error("Pool creation/simulation function did not return expected result (missing data or signature).");
            }
        } catch (error) {
            console.error(`[SimulatedLiquidityManager] Create LP error:`, error); 
            setError(`Create LP Error: ${error.message || 'Unknown error'}`);
        } finally { 
            setIsCreatingPool(false); 
        }
    };

    const handleAddLiquidity = async () => {
        // ... (Current handleAddLiquidity logic seems okay, ensure it uses `existingPoolInfo` correctly)
        // It should also check `network` if `addRaydiumLiquidity` is Devnet-specific.
        // The `existingPoolInfo` would be the one seeded from Devnet or created by this component.
        setError(''); setIsAddingLiquidity(true);
        if (!wallet?.publicKey || !connection) { setError("Wallet/Connection missing."); setIsAddingLiquidity(false); return; }
        
        const currentPoolToAddTo = existingPoolInfo || getSimulatedPool(); // Prioritize local state, fallback to store
        
        if (!currentPoolToAddTo) { 
            setError("No active pool found to add liquidity. Create or load one first."); 
            setIsAddingLiquidity(false); return; 
        }
        if (!currentPoolToAddTo.tokenAddress || currentPoolToAddTo.tokenDecimals === undefined || !currentPoolToAddTo.id ) { 
            setError("Active pool data is incomplete."); 
            setIsAddingLiquidity(false); return; 
        }
        if (currentPoolToAddTo.tokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) { 
            setError("Loaded token does not match the active pool's token."); 
            setIsAddingLiquidity(false); return; 
        }

        try {
            let rawTokenBalanceBN; 
            try { rawTokenBalanceBN = new BN(tokenBalance); } 
            catch(e) { setError(`Invalid tokenBalance format`); setIsAddingLiquidity(false); return; }

            if (rawTokenBalanceBN.isZero()) { setError("Token Balance is zero."); setIsAddingLiquidity(false); return; }
            const rawTokenAmountToAdd = rawTokenBalanceBN.mul(new BN(tokenPercentage)).div(new BN(100));
            if (rawTokenAmountToAdd.isZero()) { setError(`Calculated token amount to add is zero.`); setIsAddingLiquidity(false); return; }
            
            const solAmountFloat = parseFloat(solAmount);
            if (isNaN(solAmountFloat) || solAmountFloat <= 0) { setError("Invalid SOL amount for adding liquidity."); setIsAddingLiquidity(false); return; }
            const solLamportsBN = new BN(new Decimal(solAmountFloat).mul(1e9).toFixed(0));

            console.log("[SimulatedLiquidityManager] Add LP Args:", { poolId: currentPoolToAddTo.id, rawTokenAmountToAdd: rawTokenAmountToAdd.toString(), solLamportsBN: solLamportsBN.toString(), isUsingRaydium, network });
            
            let signature;
            let updatedPoolInfo = null;

            // For adding liquidity, we assume `isUsingRaydium` means an on-chain operation
            // and that currentPoolToAddTo contains a valid `raydiumPoolId` or enough info.
            if (isUsingRaydium && currentPoolToAddTo.raydiumPoolId && currentPoolToAddTo.rawSdkPoolInfo) {
                if (network !== 'devnet') {
                     setError("On-chain Raydium LP addition via this interface is intended for Devnet only.");
                     setIsAddingLiquidity(false);
                     return;
                }
                console.log("[SimulatedLiquidityManager] Adding ON-CHAIN Raydium liquidity (Devnet)...");
                // `addRaydiumLiquidity` function would need to be implemented in `raydiumSdkAdapter.js`
                // It would take `currentPoolToAddTo.rawSdkPoolInfo` or `currentPoolToAddTo.id`
                // For now, this is a placeholder call:
                // const result = await addRaydiumLiquidity(wallet, connection, currentPoolToAddTo, rawTokenAmountToAdd, solLamportsBN);
                // signature = result?.signature;
                // updatedPoolInfo = result?.updatedPoolInfo; 
                setError("On-chain 'Add Liquidity' for Raydium SDK is not fully implemented in this example yet.");
                throw new Error("addRaydiumLiquidity not implemented.");

            } else if (!isUsingRaydium || (currentPoolToAddTo && !currentPoolToAddTo.raydiumPoolId)) { // Fallback to simulation
                console.log("[SimulatedLiquidityManager] Adding SIMULATED liquidity...");
                const result = await addSimulatedLiquidityToPool(wallet, currentPoolToAddTo, rawTokenAmountToAdd, solLamportsBN, subtractBalances);
                signature = result?.signature; // Assuming addSimulatedLiquidityToPool returns this structure
                updatedPoolInfo = result?.updatedPoolInfo; 
            } else {
                throw new Error("Cannot add liquidity - mode mismatch or pool keys missing for Raydium operation.");
            }

            if (signature) {
                alert(`✅ Liquidity added! Sig: ${signature.substring(0,20)}...`);
                if (updatedPoolInfo) {
                    setExistingPoolInfo(updatedPoolInfo); 
                    setSimulatedPool(updatedPoolInfo);
                }
                refreshBalances();
            } else {
                // This case might be hit if addRaydiumLiquidity isn't implemented or sim fails to return sig
                // setError("Add liquidity operation did not return a signature.");
            }

        } catch (error) {
            console.error(`[SimulatedLiquidityManager] Add liquidity error:`, error); 
            setError(`Add LP Error: ${error.message || 'Unknown error'}`);
        } finally { 
            setIsAddingLiquidity(false); 
        }
    };

    const displayEstimatedToken = estimatedTokenAmountUI.toLocaleString(undefined, { maximumFractionDigits: tokenDecimals ?? 2 });
    
    // Determine button states based on whether a pool is active (either from local state or store)
    // For Devnet, existingPoolInfo will be set if a pool is successfully seeded from on-chain.
    // For other modes/networks, it depends on explicit creation.
    const activePoolForUI = existingPoolInfo || (network === 'devnet' ? getSimulatedPool() : null);
    const canCreate = !activePoolForUI || !activePoolForUI.id; // Can create if no pool is active
    const canAdd = !!(activePoolForUI && activePoolForUI.id); // Can add if a pool is active

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                    {network === 'devnet' ? '🌊 Devnet Pool Management' : 
                     isUsingRaydium ? '🌊 Raydium Liquidity (Mainnet - Placeholder)' : '💧 Simulated Liquidity'}
                </h2>
                {activePoolForUI && activePoolForUI.id && (
                    <div className="px-3 py-1 bg-green-900 rounded-full text-green-400 text-xs font-medium">
                        Pool Active: {activePoolForUI.id.substring(0,6)}...
                        {activePoolForUI.isSeeded && network === 'devnet' ? " (Live)" : ""}
                    </div>
                )}
            </div>
            {error && ( <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm break-words">{error}</div> )}
            
            {/* Inputs for SOL and Token Percentage */}
            <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-1" htmlFor="sol-amount-input-lp">SOL to Add/Create</label>
                <input
                    id="sol-amount-input-lp" type="number" value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 0.1" step="any" min="0"
                />
                <p className="text-gray-500 text-xs mt-1">Available: {solBalance?.toFixed(4) ?? '0.0000'} SOL</p>
            </div>
            <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <label className="text-gray-400 text-sm" htmlFor="token-percentage-slider-lp">Token % to Use</label>
                    <span className="text-blue-400">{tokenPercentage}%</span>
                </div>
                <input
                    id="token-percentage-slider-lp" type="range" min={1} max={100} value={tokenPercentage}
                    onChange={(e) => setTokenPercentage(parseInt(e.target.value))}
                    className="w-full appearance-none h-2 bg-gray-700 rounded-lg outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500" />
                <p className="text-gray-500 text-xs mt-1">Tokens to use: ~{displayEstimatedToken}</p>
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

            {/* Info box about current mode */}
            {network === 'devnet' ? (
                 <div className="p-3 mb-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <div className="flex">
                       <div className="text-green-400 mr-2 text-lg">ⓘ</div>
                       <div className="text-green-300 text-sm"><p>Devnet mode: Automatically attempts to use existing on-chain standard CPMM pool. 'Create LP' will use Raydium SDK if no pool is seeded.</p></div>
                    </div>
                </div>
            ) : isUsingRaydium && network === 'mainnet-beta' ? (
                <div className="p-3 mb-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                    <div className="flex">
                       <div className="text-yellow-400 mr-2 text-lg">⚠️</div>
                       <div className="text-yellow-300 text-sm"><p>Mainnet Raydium operations via this UI are highly experimental/placeholder. Use with extreme caution.</p></div>
                    </div>
                </div>
            ) : (
                 <div className="p-3 mb-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                    <div className="flex">
                       <div className="text-purple-400 mr-2 text-lg">ⓘ</div>
                       <div className="text-purple-300 text-sm"><p>Simulation mode is active. No real transactions will be made.</p></div>
                    </div>
                </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={handleCreateLiquidity}
                    disabled={
                        isCreatingPool || 
                        !canCreate || // Can only create if no pool is active/seeded
                        !solAmount || parseFloat(solAmount) <= 0 || 
                        !tokenAddress || 
                        (network === 'mainnet-beta' && isUsingRaydium) // Disable actual mainnet creation via this UI for safety
                    }
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-150 
                        ${isCreatingPool || !canCreate || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress || (network === 'mainnet-beta' && isUsingRaydium)
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}`}
                >
                    {isCreatingPool ? 'Creating...' : (canCreate ? 'Create LP' : 'Pool Active')}
                </button>
                <button
                    onClick={handleAddLiquidity}
                    disabled={
                        isAddingLiquidity || 
                        !canAdd || // Can only add if a pool is active/seeded
                        !solAmount || parseFloat(solAmount) <= 0 || 
                        !tokenAddress ||
                        (network === 'mainnet-beta' && isUsingRaydium) // Disable actual mainnet add via this UI for safety
                    }
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-150 
                        ${isAddingLiquidity || !canAdd || !solAmount || parseFloat(solAmount) <= 0 || !tokenAddress || (network === 'mainnet-beta' && isUsingRaydium)
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'}`}
                >
                    {isAddingLiquidity ? 'Adding...' : 'Add More LP'}
                </button>
            </div>
        </div>
    );
}

export default SimulatedLiquidityManager;