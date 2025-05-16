// src/utils/poolFinder.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { 
    Raydium, 
    ApiPoolInfoV4, // Assuming this is the correct type from sdk.api.fetchPoolByMints
    MAINNET_PROGRAM_ID as RAYDIUM_MAINNET_PROGRAM_ID,
    DEVNET_PROGRAM_ID as RAYDIUM_DEVNET_PROGRAM_ID
} from '@raydium-io/raydium-sdk-v2';
import { toast } from 'react-toastify'; // Assuming react-toastify is used for notifications

export interface DiscoveredPoolDetailed {
  id: string;
  type: 'Standard' | 'CLMM' | 'Unknown'; 
  mintA: string; // e.g., tokenMintAddress
  mintB: string; // e.g., baseMintToPair (SOL)
  vaultA: string;
  vaultB: string;
  lpMint: string;
  tvl: number;
  price: number; // Price of mintA in terms of mintB, or vice-versa depending on how API returns it
  programId: string;
  rawSdkPoolInfo: ApiPoolInfoV4; 
  baseSymbol?: string;  // Symbol of mintA (token)
  quoteSymbol?: string; // Symbol of mintB (e.g., SOL)
  baseDecimals?: number;
  quoteDecimals?: number;
  reserveA?: string; 
  reserveB?: string; 
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchRaydiumPoolsFromSDK(
  connection: Connection,
  tokenMintAddress: string, 
  baseMintToPairStr: string, // e.g., NATIVE_MINT.toBase58()   
  cluster: "mainnet" | "devnet", 
  progressCallback?: (message: string) => void
): Promise<DiscoveredPoolDetailed[]> {

  progressCallback?.(`[PoolFinder] Using direct adaptation of findPoolTest.ts for ${cluster}`);
  console.log(`[poolFinder] Using direct adaptation of findPoolTest.ts for ${cluster}`);
  
  if (!tokenMintAddress) {
    console.warn("[poolFinder] tokenMintAddress is undefined or empty.");
    progressCallback?.("[PoolFinder] Error: Token Mint Address is missing.");
    return [];
  }
   if (!baseMintToPairStr) {
    console.warn("[poolFinder] baseMintToPairStr is undefined or empty.");
    progressCallback?.("[PoolFinder] Error: Base Mint to Pair is missing.");
    return [];
  }

  const foundPools: DiscoveredPoolDetailed[] = [];
  const delayMs = 200; // Delay to help with potential rate limits when fetching vault details

  progressCallback?.(`[PoolFinder] Initializing Raydium SDK for ${cluster}...`);
  console.log(`[poolFinder] Initializing Raydium SDK on ${cluster}…`);

  let sdk: Raydium;
  try {
    sdk = await Raydium.load({
      connection,
      cluster: cluster, 
      disableLoadToken: true, 
      disableFeatureCheck: true, 
    });
    console.log('[poolFinder] Raydium SDK V2 loaded successfully.');
    progressCallback?.('[poolFinder] Raydium SDK V2 Loaded.');
  } catch (e: any) {
    console.error('[poolFinder] Failed to load Raydium SDK:', e);
    progressCallback?.(`[PoolFinder] Error: Failed to load Raydium SDK: ${e.message}`);
    toast.error(`SDK Load Error: ${e.message.substring(0, 50)}...`);
    return [];
  }

  progressCallback?.(`[PoolFinder] Fetching pools for ${tokenMintAddress.substring(0,6)}... / ${baseMintToPairStr.substring(0,6)}...`);
  console.log(`[poolFinder] Fetching pools for ${tokenMintAddress} / ${baseMintToPairStr} on ${cluster}...`);

  try {
    const { data: poolsFromApi } = await sdk.api.fetchPoolByMints({
      mint1: tokenMintAddress,
      mint2: baseMintToPairStr,
    });

    if (!poolsFromApi || poolsFromApi.length === 0) {
      console.log('[poolFinder] No pools found by fetchPoolByMints.');
      progressCallback?.('[PoolFinder] No pools found for the given pair.');
      return [];
    }
    console.log(`[poolFinder] Found ${poolsFromApi.length} potential pool(s) from API.`);
    progressCallback?.(`[PoolFinder] Found ${poolsFromApi.length} potential pool(s). Processing details...`);

    for (const p of poolsFromApi) { // p is ApiPoolInfoV4
      await sleep(delayMs); 
      progressCallback?.(`[PoolFinder] Processing pool ${p.id.substring(0,6)}... (${p.type})`);
      console.log('─'.repeat(40));
      console.log(`[poolFinder] Pool ID      : ${p.id}`);
      console.log(`[poolFinder] Program ID   : ${p.programId}`);
      console.log(`[poolFinder] Type         : ${p.type}`); // 'Standard', 'Concentrated'
      console.log(`[poolFinder] Price        : ${p.price}`);
      console.log(`[poolFinder] TVL          : ${p.tvl}`);
      console.log(`[poolFinder] Mint A       : ${p.mintA.address} (Symbol: ${p.mintA.symbol}, Decimals: ${p.mintA.decimals})`);
      console.log(`[poolFinder] Mint B       : ${p.mintB.address} (Symbol: ${p.mintB.symbol}, Decimals: ${p.mintB.decimals})`);
      console.log(`[poolFinder] LP Mint      : ${p.lpMint.address}`);


      let detailedVaultA = p.vaultA?.toString() || 'N/A'; // Already on ApiPoolInfoV4
      let detailedVaultB = p.vaultB?.toString() || 'N/A'; // Already on ApiPoolInfoV4
      let poolTypeEnum: DiscoveredPoolDetailed['type'] = 'Unknown';

      try {
        if (p.type === 'Concentrated') {
          poolTypeEnum = 'CLMM';
          console.log('[poolFinder] ℹ️ Processing Concentrated pool details…');
          const { poolInfo: clmmPoolInfo } = await sdk.clmm.getPoolInfoFromRpc(p.id);
          detailedVaultA = clmmPoolInfo.vaultA.toBase58();
          detailedVaultB = clmmPoolInfo.vaultB.toBase58();
          console.log(`[poolFinder] CLMM Vault A : ${detailedVaultA}`);
          console.log(`[poolFinder] CLMM Vault B : ${detailedVaultB}`);
        } else if (p.type === 'Standard') { // Standard includes AMMv4, AMMv5 (CPMM is usually devnet only)
          poolTypeEnum = 'Standard';
          console.log('[poolFinder] ℹ️ Processing Standard pool details (vaults already on ApiPoolInfoV4)...');
          // Vaults A and B are directly on ApiPoolInfoV4 for standard pools.
          // If you needed to reconstruct full AmmPoolKeys for other operations:
          // const poolPubkey = new PublicKey(p.id);
          // const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey);
          // detailedVaultA = keys.baseVault.toBase58(); // or keys.vault.A
          // detailedVaultB = keys.quoteVault.toBase58(); // or keys.vault.B
          console.log(`[poolFinder] Standard Vault A : ${detailedVaultA}`);
          console.log(`[poolFinder] Standard Vault B : ${detailedVaultB}`);
        } else {
            console.warn(`[poolFinder] Pool ${p.id}: Unhandled pool type for detailed vault fetching: ${p.type}`);
        }
      } catch (err: any) {
        console.error(`[poolFinder] ⚠️ Error fetching detailed vault info for pool ${p.id}:`, err.message);
        progressCallback?.(`[PoolFinder] Error fetching vault details for ${p.id.substring(0,6)}`);
        // Continue to add the pool with basic info if vault fetching fails
      }
      
      const discoveredPool: DiscoveredPoolDetailed = {
        id: p.id,
        type: poolTypeEnum,
        mintA: p.mintA.address.toString(),
        mintB: p.mintB.address.toString(),
        vaultA: detailedVaultA, 
        vaultB: detailedVaultB,
        lpMint: p.lpMint.address.toString(),
        tvl: p.tvl,
        price: parseFloat(p.price.toFixed(p.mintB.decimals > 0 ? p.mintB.decimals : 6)),
        programId: p.programId,
        rawSdkPoolInfo: p, 
        baseSymbol: p.mintA.symbol || 'N/A',
        quoteSymbol: p.mintB.symbol || 'N/A',
        baseDecimals: p.mintA.decimals,
        quoteDecimals: p.mintB.decimals,
        reserveA: p.mintAmountA?.toString() || '0', // From ApiPoolInfoV4
        reserveB: p.mintAmountB?.toString() || '0', // From ApiPoolInfoV4
      };
      foundPools.push(discoveredPool);
      console.log(''); // Newline like in your script
    }

    if (foundPools.length > 0) {
        progressCallback?.(`[PoolFinder] Successfully processed ${foundPools.length} pool(s).`);
        toast.success(`Found ${foundPools.length} pool(s) for ${tokenMintAddress.substring(0,6)}...`);
    } else {
        progressCallback?.(`[PoolFinder] No suitable pools found after detailed processing for ${tokenMintAddress.substring(0,6)}...`);
    }

  } catch (error: any) {
    console.error('[poolFinder] Error during pool fetching or processing:', error);
    progressCallback?.(`[PoolFinder] Error: ${error.message}`);
    toast.error(`PoolFinder Error: ${error.message.substring(0,100)}...`);
  }

  console.log(`[poolFinder] Search complete for ${cluster}. Found ${foundPools.length} pools for ${tokenMintAddress}.`);
  return foundPools;
}

