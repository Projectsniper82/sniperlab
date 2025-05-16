// src/utils/poolFinder.ts
// @ts-nocheck (keep or address specific types later)

import { Connection, PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { Raydium, ApiPoolInfo } from '@raydium-io/raydium-sdk-v2';

export interface DiscoveredPoolDetailed {
    id: string;
    programId: string;
    type: string;
    price: number | string;
    tvl: number | string;
    mintA: string;
    mintB: string;
    vaultA: string;
    vaultB: string;
    rawSdkPoolInfo: ApiPoolInfo;
}

// Helper function for a simple delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchRaydiumPoolsFromSDK(
    connection: Connection,
    mintStr: string,
    clusterString: 'mainnet' | 'devnet',
    owner: PublicKey
): Promise<DiscoveredPoolDetailed[]> {
    if (!mintStr) {
        console.error('[poolFinder] Token mint string (mintStr) is required.');
        return [];
    }
    if (!owner) {
        console.error('[poolFinder] Owner PublicKey is required for Raydium.load.');
        return [];
    }

    console.log(`[poolFinder] Initializing Raydium SDK for cluster: ${clusterString}`);
    let sdk;
    try {
        sdk = await Raydium.load({
            connection,
            cluster: clusterString,
            owner,
            disableLoadToken: true,
            disableFeatureCheck: true,
        });
    } catch (sdkLoadError: any) {
        console.error(`[poolFinder] Failed to load Raydium SDK:`, sdkLoadError);
        throw new Error(`Raydium SDK load failed: ${sdkLoadError.message}`);
    }
    console.log('[poolFinder] Raydium SDK loaded successfully.');

    console.log(`[poolFinder] Fetching pools for token ${mintStr} paired with SOL (${NATIVE_MINT.toBase58()})`);
    let poolsApiResult: ApiPoolInfo[] = [];
    try {
        const result = await sdk.api.fetchPoolByMints({
            mint1: mintStr,
            mint2: NATIVE_MINT.toBase58(),
        });
        poolsApiResult = result.data || [];
    } catch (fetchError: any) {
        console.error(`[poolFinder] Error fetching pools via SDK API:`, fetchError);
        if (fetchError.message?.includes("404") || fetchError.message?.includes("not found")) {
            console.log('[poolFinder] No pools found (API 404 or similar).');
            return [];
        }
        if (fetchError.message?.includes("429")) {
             console.error('[poolFinder] Rate limited on initial pool list fetch. The process will likely fail for subsequent details. Consider a longer delay or checking RPC limits.');
             // We can still try to process what we got, or throw here
        }
        // For other errors, we might still want to throw to indicate a more fundamental issue
        // For now, let's allow it to proceed to the loop to see what was fetched, if anything
        // throw new Error(`API fetchPoolByMints failed: ${fetchError.message}`);
    }

    if (!poolsApiResult || poolsApiResult.length === 0) {
        console.log('[poolFinder] No pools found for the given mint pair.');
        return [];
    }
    console.log(`[poolFinder] Found ${poolsApiResult.length} potential pool(s) from API. Processing one by one with delay...`);

    const detailedPools: DiscoveredPoolDetailed[] = [];
    // ***** INCREASED DELAY and made it configurable at the top if needed *****
    const DELAY_BETWEEN_POOL_PROCESSING_MS = 1500; // Start with 1.5 seconds, adjust if needed

    for (const p of poolsApiResult) {
        let vaultA = 'N/A';
        let vaultB = 'N/A';
        console.log(`[poolFinder] Attempting to process pool ID: ${p.id}, Type: ${p.type}`);
        try {
            if (p.type === 'Concentrated') {
                console.log(`[poolFinder]   Type Concentrated. Calling sdk.clmm.getPoolInfoFromRpc for ${p.id}...`);
                // It's possible getPoolInfoFromRpc itself is rate-limited or returns partial data under stress
                const { poolInfo: clmmPoolInfo, error: clmmError } = await sdk.clmm.getPoolInfoFromRpc(p.id);
                
                // Log the raw response immediately
                console.log(`[poolFinder]   CLMM Pool ${p.id} - Raw clmmPoolInfo:`, clmmPoolInfo ? 'Data received' : 'No clmmPoolInfo object', clmmPoolInfo ? JSON.stringify(clmmPoolInfo) : undefined);
                if (clmmError) {
                    console.error(`[poolFinder]   CLMM Pool ${p.id} - SDK explicitly reported error during getPoolInfoFromRpc:`, clmmError);
                }

                if (clmmPoolInfo) { // Check if clmmPoolInfo object exists
                    if (clmmPoolInfo.vaultA && typeof clmmPoolInfo.vaultA.toBase58 === 'function') {
                        vaultA = clmmPoolInfo.vaultA.toBase58();
                    } else {
                        console.warn(`[poolFinder]   CLMM Pool ${p.id} - vaultA is missing, not a PublicKey, or toBase58 failed. Value:`, clmmPoolInfo.vaultA);
                        vaultA = clmmPoolInfo.vaultA ? String(clmmPoolInfo.vaultA) : 'N/A (SDK vaultA issue)';
                    }
                    if (clmmPoolInfo.vaultB && typeof clmmPoolInfo.vaultB.toBase58 === 'function') {
                        vaultB = clmmPoolInfo.vaultB.toBase58();
                    } else {
                        console.warn(`[poolFinder]   CLMM Pool ${p.id} - vaultB is missing, not a PublicKey, or toBase58 failed. Value:`, clmmPoolInfo.vaultB);
                        vaultB = clmmPoolInfo.vaultB ? String(clmmPoolInfo.vaultB) : 'N/A (SDK vaultB issue)';
                    }
                } else {
                    console.warn(`[poolFinder]   CLMM Pool ${p.id} - clmmPoolInfo object itself was null or undefined after SDK call (possibly due to earlier rate limit affecting internal fetches).`);
                }
            } else { // Standard AMM / CPMM pools
                console.log(`[poolFinder]   Type Standard. Calling sdk.liquidity.getAmmPoolKeys for ${p.id}...`);
                const poolPubkey = new PublicKey(p.id);
                const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey);
                console.log(`[poolFinder]   Standard Pool ${p.id} - Raw AMM Keys from SDK:`, keys ? 'Data received' : 'No data', keys ? JSON.stringify(keys) : undefined);

                if (keys.vault && keys.vault.A && keys.vault.B) {
                    vaultA = keys.vault.A.toString(); 
                    vaultB = keys.vault.B.toString(); 
                } else if ('baseVault' in keys && 'quoteVault' in keys) { 
                    vaultA = (keys as any).baseVault.toBase58();
                    vaultB = (keys as any).quoteVault.toBase58();
                } else {
                    console.warn(`[poolFinder]   Standard Pool ${p.id} - Unexpected keys structure:`, keys);
                }
            }
        } catch (err: any) {
            console.error(`[poolFinder] ⚠️ Error during vault processing for pool ${p.id} (Type: ${p.type}): ${err.message}. Vaults will be N/A for this pool.`, err.stack);
            // Vaults remain 'N/A' due to the error in this iteration
        }
        
        detailedPools.push({
            id: p.id,
            programId: p.programId,
            type: p.type,
            price: p.price,
            tvl: p.tvl,
            mintA: mintStr,
            mintB: NATIVE_MINT.toBase58(),
            vaultA,
            vaultB,
            rawSdkPoolInfo: p,
        });
        console.log(`[poolFinder]   Successfully processed pool ${p.id}. VaultA: ${vaultA}, VaultB: ${vaultB}`);

        // Add delay here before processing the next pool
        if (poolsApiResult.indexOf(p) < poolsApiResult.length - 1) { // Don't sleep after the last pool
            console.log(`[poolFinder]   Delaying for ${DELAY_BETWEEN_POOL_PROCESSING_MS}ms before next pool...`);
            await sleep(DELAY_BETWEEN_POOL_PROCESSING_MS);
        }
    }

    console.log(`[poolFinder] Finished processing all ${detailedPools.length} pools with vault details.`);
    return detailedPools;
}
