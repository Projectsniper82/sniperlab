// src/utils/poolFinder.ts
// @ts-nocheck (you can remove this later by adding more specific types)

import { Connection, PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { Raydium, ApiPoolInfo, ClmmPoolInfo, AmmPoolKeys } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';

export interface DiscoveredPoolDetailed {
    id: string;
    programId: string;
    type: string;
    price: number | string;
    tvl: number | string;
    mintA: string; // Your input mintStr (token)
    mintB: string; // NATIVE_MINT (SOL)
    vaultA: string; // Vault for mintA (token)
    vaultB: string; // Vault for mintB (SOL)
    rawSdkPoolInfo: any;
    lpMint?: string;
}

const DEFAULT_RPC_REQUEST_DELAY_MS = 3000; // Further increased delay

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const safeToBase58 = (value: any): string => {
    if (value instanceof PublicKey) {
        return value.toBase58();
    }
    if (typeof value === 'string') {
        try {
            new PublicKey(value);
            return value;
        } catch (e) {
            return 'N/A';
        }
    }
    if (value && typeof value.toString === 'function' && !(value instanceof BN)) {
        const strVal = value.toString();
        try {
            new PublicKey(strVal);
            return strVal;
        } catch (e) {
            return 'N/A';
        }
    }
    return 'N/A';
};

export async function fetchRaydiumPoolsFromSDK(
    connection: Connection,
    mintStr: string,
    clusterString: 'mainnet' | 'devnet',
    owner: PublicKey, // Ensuring owner is the 4th parameter as called from page.tsx
    delayMs: number = DEFAULT_RPC_REQUEST_DELAY_MS // delayMs is the 5th parameter
): Promise<DiscoveredPoolDetailed[]> {
    if (!mintStr) {
        console.error('[poolFinder] Token mint string (mintStr) is required.');
        return [];
    }
    // The original poolfindtest.ts does not use an owner for loading the SDK for this task.
    // If this 'owner' is not strictly necessary for Raydium.load for these read operations,
    // it could be a point of divergence. However, we are matching the call signature from page.tsx.
    if (!owner) {
        console.warn('[poolFinder] Owner PublicKey is expected by signature but was not provided.');
    }

    console.log(`[poolFinder] Initializing Raydium SDK for cluster: ${clusterString}`);
    let sdk: Raydium;
    try {
        sdk = await Raydium.load({
            connection,
            cluster: clusterString,
            owner, // Pass owner to Raydium.load
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
        console.error(`[poolFinder] Error fetching pools list via SDK API:`, fetchError);
        return [];
    }

    if (!poolsApiResult || poolsApiResult.length === 0) {
        console.log('[poolFinder] No pools found for the given mint pair from API result.');
        return [];
    }
    // Ensure delayMs is treated as a number for logging and sleep
    const actualDelayMs = Number(delayMs);
    console.log(`[poolFinder] Found ${poolsApiResult.length} potential pool(s) from API. Processing sequentially with ${actualDelayMs}ms delays...`);

    const detailedPools: DiscoveredPoolDetailed[] = [];
    const NATIVE_MINT_STRING = NATIVE_MINT.toBase58();

    for (const p of poolsApiResult) {
        console.log('[poolFinder] ─'.repeat(40));
        console.log(`[poolFinder] Processing pool ID: ${p.id} (Type: ${p.type})`);

        await sleep(actualDelayMs); // Use the numeric delay

        let determinedVaultA = 'N/A';
        let determinedVaultB = 'N/A';
        let lpMintAddress: string | undefined = undefined;
        let specificPoolSdkInfo: any = p;

        try {
            if (p.type === 'Concentrated') {
                console.log(`[poolFinder]   Fetching details for Concentrated pool ${p.id}...`);
                const { poolInfo: clmmPoolInfo } = await sdk.clmm.getPoolInfoFromRpc(p.id) as { poolInfo: ClmmPoolInfo };
                specificPoolSdkInfo = clmmPoolInfo;

                const mintAFromPool = safeToBase58(clmmPoolInfo?.mintA?.address);
                const mintBFromPool = safeToBase58(clmmPoolInfo?.mintB?.address);

                if (mintAFromPool === 'N/A' || mintBFromPool === 'N/A') {
                     console.warn(`[poolFinder]   Concentrated pool ${p.id}: Could not reliably determine mint addresses from clmmPoolInfo. Vaults cannot be confidently mapped.`);
                } else {
                    if (mintAFromPool === mintStr && mintBFromPool === NATIVE_MINT_STRING) {
                        determinedVaultA = safeToBase58(clmmPoolInfo.vaultA);
                        determinedVaultB = safeToBase58(clmmPoolInfo.vaultB);
                    } else if (mintBFromPool === mintStr && mintAFromPool === NATIVE_MINT_STRING) {
                        determinedVaultA = safeToBase58(clmmPoolInfo.vaultB);
                        determinedVaultB = safeToBase58(clmmPoolInfo.vaultA);
                    } else {
                        console.warn(`[poolFinder]   Concentrated pool ${p.id}: Mints (${mintAFromPool}, ${mintBFromPool}) do not match expected pair (${mintStr}, ${NATIVE_MINT_STRING}). Vaults cannot be confidently mapped.`);
                    }
                }
            } else if (p.type === 'Standard') {
                console.log(`[poolFinder]   Fetching details for Standard pool ${p.id}...`);
                const poolPubkey = new PublicKey(p.id);
                const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey) as AmmPoolKeys;
                specificPoolSdkInfo = keys;
                lpMintAddress = safeToBase58(keys.lpMint);

                const keyBaseMintStr = safeToBase58(keys.baseMint);
                const keyQuoteMintStr = safeToBase58(keys.quoteMint);

                if (keyBaseMintStr !== 'N/A' && keyQuoteMintStr !== 'N/A') {
                    if (keyBaseMintStr === mintStr && keyQuoteMintStr === NATIVE_MINT_STRING) {
                        determinedVaultA = safeToBase58(keys.baseVault);
                        determinedVaultB = safeToBase58(keys.quoteVault);
                    } else if (keyQuoteMintStr === mintStr && keyBaseMintStr === NATIVE_MINT_STRING) {
                        determinedVaultA = safeToBase58(keys.quoteVault);
                        determinedVaultB = safeToBase58(keys.baseVault);
                    } else {
                         console.warn(`[poolFinder]   Standard pool ${p.id}: SDK key mints (Base: ${keyBaseMintStr}, Quote: ${keyQuoteMintStr}) do not match user's pair. Vaults cannot be confidently mapped to user's token vs SOL.`);
                    }
                } else {
                     console.warn(`[poolFinder]   Standard pool ${p.id}: Could not determine base/quote mints from SDK keys. Vaults cannot be confidently mapped to user's token vs SOL.`);
                }
            } else {
                console.warn(`[poolFinder]   Unknown or unhandled pool type: ${p.type} for pool ${p.id}`);
                continue;
            }

            if (determinedVaultA !== 'N/A' && determinedVaultB !== 'N/A') {
                console.log(`[poolFinder]     Token Vault (for ${mintStr.substring(0, 6)}...): ${determinedVaultA}`);
                console.log(`[poolFinder]     SOL Vault (for SOL): ${determinedVaultB}`);
                if (lpMintAddress && lpMintAddress !== 'N/A') console.log(`[poolFinder]     LP Mint: ${lpMintAddress}`);

                detailedPools.push({
                    id: p.id,
                    programId: p.programId,
                    type: p.type,
                    price: p.price,
                    tvl: p.tvl,
                    mintA: mintStr,
                    mintB: NATIVE_MINT_STRING,
                    vaultA: determinedVaultA,
                    vaultB: determinedVaultB,
                    rawSdkPoolInfo: specificPoolSdkInfo,
                    lpMint: (lpMintAddress === 'N/A' ? undefined : lpMintAddress)
                });
            } else {
                console.warn(`[poolFinder] ⚠️ Could not confidently assign vaults for pool ${p.id} (Type: ${p.type}) to match required mintA/mintB structure.`);
            }

        } catch (err: any) {
            console.error(`[poolFinder] ⚠️ Error processing details for pool ${p.id} (Type: ${p.type}): ${err.message}`, err.stack ? err.stack.substring(0, 300) : '');
        }
    }

    console.log(`[poolFinder] Finished processing. Returning ${detailedPools.length} pool(s) with assigned vault details.`);
    return detailedPools;
}