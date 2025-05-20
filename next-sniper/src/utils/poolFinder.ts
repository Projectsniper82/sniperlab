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
    rawSdkPoolInfo: ApiPoolInfo; // Keep the original ApiPoolInfo
    // You can add other specific, consistently available keys here if needed
    // For example: actualConfigId?: string;
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
        }
    }

    if (!poolsApiResult || poolsApiResult.length === 0) {
        console.log('[poolFinder] No pools found for the given mint pair.');
        return [];
    }
    console.log(`[poolFinder] Found ${poolsApiResult.length} potential pool(s) from API. Processing one by one with delay...`);

    const detailedPools: DiscoveredPoolDetailed[] = [];
    const DELAY_BETWEEN_POOL_PROCESSING_MS = 1500;

    for (const p of poolsApiResult) { // p is an ApiPoolInfo object
        let vaultA = 'N/A';
        let vaultB = 'N/A';
        // ***** ADD LOGS HERE *****
        console.log(`\n[poolFinder LOGGING] ----- Start Processing Pool ID: ${p.id} -----`);
        console.log(`[poolFinder LOGGING] Pool Type from ApiPoolInfo: ${p.type}`);
        console.log(`[poolFinder LOGGING] Pool Program ID from ApiPoolInfo: ${p.programId}`);
        if (p.type === 'Standard' || p.type === 'CPMM') { // CPMM might be a type string used by some SDK versions for standard AMMs
            console.log(`[poolFinder LOGGING] Standard/CPMM Pool - ApiPoolInfo.config:`, JSON.stringify(p.config, null, 2));
        } else if (p.type === 'Concentrated') {
            // For CLMM, the config structure is different, often nested as ammConfig within the poolInfo
            // The `sdk.clmm.getPoolInfoFromRpc` will fetch more detailed info including its specific config
            console.log(`[poolFinder LOGGING] Concentrated Pool - ApiPoolInfo (summary, full details fetched later):`, JSON.stringify({ id: p.id, official: p.official, price: p.price, tvl: p.tvl }, null, 2));
            // The detailed ammConfig for CLMM is fetched inside the 'Concentrated' block below
        }
        console.log(`[poolFinder LOGGING] ApiPoolInfo.lpMint (if available):`, JSON.stringify(p.lpMint, null, 2));
        // ***********************

        console.log(`[poolFinder] Attempting to process pool ID: ${p.id}, Type: ${p.type}`);
        try {
            if (p.type === 'Concentrated') {
                console.log(`[poolFinder]   Type Concentrated. Calling sdk.clmm.getPoolInfoFromRpc for ${p.id}...`);
                const { poolInfo: clmmPoolInfo, error: clmmError } = await sdk.clmm.getPoolInfoFromRpc(p.id);
                
                console.log(`[poolFinder LOGGING] CLMM Pool ${p.id} - Raw clmmPoolInfo from SDK:`, clmmPoolInfo ? 'Data received' : 'No clmmPoolInfo object');
                if (clmmPoolInfo) {
                    console.log(`[poolFinder LOGGING] CLMM Pool ${p.id} - clmmPoolInfo.ammConfig:`, JSON.stringify((clmmPoolInfo as any).ammConfig, null, 2)); // Log the ammConfig for CLMM
                }
                if (clmmError) {
                    console.error(`[poolFinder]   CLMM Pool ${p.id} - SDK explicitly reported error during getPoolInfoFromRpc:`, clmmError);
                }

                if (clmmPoolInfo) {
                    if (clmmPoolInfo.vaultA && typeof clmmPoolInfo.vaultA.toBase58 === 'function') {
                        vaultA = clmmPoolInfo.vaultA.toBase58();
                    } else {
                        vaultA = clmmPoolInfo.vaultA ? String(clmmPoolInfo.vaultA) : 'N/A (SDK vaultA issue)';
                    }
                    if (clmmPoolInfo.vaultB && typeof clmmPoolInfo.vaultB.toBase58 === 'function') {
                        vaultB = clmmPoolInfo.vaultB.toBase58();
                    } else {
                        vaultB = clmmPoolInfo.vaultB ? String(clmmPoolInfo.vaultB) : 'N/A (SDK vaultB issue)';
                    }
                }
            } else { // Standard AMM / CPMM pools
                console.log(`[poolFinder]   Type Standard. Calling sdk.liquidity.getAmmPoolKeys for ${p.id}...`);
                const poolPubkey = new PublicKey(p.id);
                const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey);
                // ***** ADD LOG HERE *****
                console.log(`[poolFinder LOGGING] Standard Pool ${p.id} - Keys from getAmmPoolKeys:`, JSON.stringify(keys, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
                // **********************

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
        }
        
        const poolToPush: DiscoveredPoolDetailed = {
            id: p.id,
            programId: p.programId, // This should be from the ApiPoolInfo `p`
            type: p.type,
            price: p.price,
            tvl: p.tvl,
            mintA: mintStr, // Or from keys if more reliable for standard pools
            mintB: NATIVE_MINT.toBase58(), // Or from keys
            vaultA,
            vaultB,
            rawSdkPoolInfo: p, // Store the original ApiPoolInfo `p`
        };
        // ***** ADD LOG HERE *****
        console.log(`[poolFinder LOGGING] Object to be pushed for pool ${p.id}:`, JSON.stringify(poolToPush, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
        console.log(`[poolFinder LOGGING] ----- End Processing Pool ID: ${p.id} -----`);
        // **********************
        detailedPools.push(poolToPush);

        if (poolsApiResult.indexOf(p) < poolsApiResult.length - 1) {
            console.log(`[poolFinder]   Delaying for ${DELAY_BETWEEN_POOL_PROCESSING_MS}ms before next pool...`);
            await sleep(DELAY_BETWEEN_POOL_PROCESSING_MS);
        }
    }

    console.log(`[poolFinder] Finished processing all ${detailedPools.length} pools with vault details.`);
    return detailedPools;
}
