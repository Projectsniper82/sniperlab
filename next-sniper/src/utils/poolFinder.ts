// src/utils/poolFinder.ts
// @ts-nocheck

import { Connection, PublicKey } from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import { Raydium, ApiPoolInfo } from "@raydium-io/raydium-sdk-v2";

// EXTENDED Pool type for all the fields you want:
export interface DiscoveredPoolDetailed {
  id: string;
  programId: string;
  type: string;
  price: number | string;
  tvl: number | string;
  mintA: string;
  mintB: string;
  decimalsA: number | string;
  decimalsB: number | string;
  vaultA: string;
  vaultB: string;
  authority: string;
  lpMint: string;
  configAddress: string;
  feeReceiver: string;
  tickSpacing?: number;
  currentTick?: number;
  observationAccount?: string;
  exBitmapAccount?: string;
  poolType: "standard" | "cpmm" | "concentrated" | "unknown";
  fees: any;
  feesSource: "config" | "poolKeys" | "clmm" | null;
  rawSdkPoolInfo: ApiPoolInfo;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchRaydiumPoolsFromSDK(
  connection: Connection,
  mintStr: string,
  clusterString: "mainnet" | "devnet",
  owner: PublicKey
): Promise<DiscoveredPoolDetailed[]> {
  if (!mintStr) {
    console.error("[poolFinder] Token mint string (mintStr) is required.");
    return [];
  }
  if (!owner) {
    console.error("[poolFinder] Owner PublicKey is required for Raydium.load.");
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
  console.log("[poolFinder] Raydium SDK loaded successfully.");

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
      console.log("[poolFinder] No pools found (API 404 or similar).");
      return [];
    }
    if (fetchError.message?.includes("429")) {
      console.error("[poolFinder] Rate limited on initial pool list fetch. The process will likely fail for subsequent details. Consider a longer delay or checking RPC limits.");
    }
  }

  if (!poolsApiResult || poolsApiResult.length === 0) {
    console.log("[poolFinder] No pools found for the given mint pair.");
    return [];
  }
  console.log(`[poolFinder] Found ${poolsApiResult.length} potential pool(s) from API. Processing one by one with delay...`);

  const detailedPools: DiscoveredPoolDetailed[] = [];
  const DELAY_BETWEEN_POOL_PROCESSING_MS = 1500;

  for (const p of poolsApiResult) {
    // ---- Setup universal fields ----
    const mintA = (p.mintA && p.mintA.address) || p.mintA || "N/A";
    const mintB = (p.mintB && p.mintB.address) || p.mintB || "N/A";
    const decimalsA = (p.mintA && p.mintA.decimals) || p.decimalsA || "N/A";
    const decimalsB = (p.mintB && p.mintB.decimals) || p.decimalsB || "N/A";

    let vaultA: string = "N/A";
    let vaultB: string = "N/A";
    let authority: string = "N/A";
    let lpMint: string = (p.lpMint && p.lpMint.address) || p.lpMint || "N/A";
    let configAddress: string = "";
    let feeReceiver: string = "";
    let tickSpacing: number | undefined = undefined;
    let currentTick: number | undefined = undefined;
    let observationAccount: string = "";
    let exBitmapAccount: string = "";

    let poolType: "standard" | "cpmm" | "concentrated" | "unknown" = "unknown";
    let fees: any = {};
    let feesSource: "config" | "poolKeys" | "clmm" | null = null;

    try {
      // --- Concentrated Liquidity Pools (CLMM) ---
      if (
        p.type === "Concentrated" ||
        p.type === "CLMM" ||
        (p.programId && p.programId.toString().startsWith("CAMM"))
      ) {
        poolType = "concentrated";
        const clmm = await sdk.clmm.getPoolInfoFromRpc(String(p.id));
        if (clmm && clmm.poolInfo) {
          vaultA = clmm.poolInfo.vaultA.toBase58?.() || "N/A";
          vaultB = clmm.poolInfo.vaultB.toBase58?.() || "N/A";
          authority = clmm.poolInfo.authority?.toBase58?.() || "N/A";
          configAddress = clmm.poolInfo.config?.toBase58?.() || "";
          tickSpacing = clmm.poolInfo.tickSpacing;
          currentTick = clmm.poolInfo.currentTickIndex;
          observationAccount = clmm.poolInfo.observationKey?.toBase58?.() || "";
          exBitmapAccount = clmm.poolInfo.exBitmapKey?.toBase58?.() || "";
        }
        fees = { note: "CLMM fees are dynamic, use SDK during swap" };
        feesSource = "clmm";
      }
      // --- Standard/CPMM/Legacy ---
      else {
        // Legacy (AMMv4) or CPMM
        const poolPubkey = new PublicKey(p.id);
        const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey);

        // Check vaults
        if (keys.vault && keys.vault.A && keys.vault.B) {
          vaultA = keys.vault.A.toString();
          vaultB = keys.vault.B.toString();
        } else if ("baseVault" in keys && "quoteVault" in keys) {
          vaultA = keys.baseVault.toBase58();
          vaultB = keys.quoteVault.toBase58();
        }
        // Authority, LP mint, config (for CPMM)
        authority = (keys.authority && keys.authority.toBase58?.()) || keys.authority || "N/A";
        lpMint = (keys.lpMint && keys.lpMint.toBase58?.()) || keys.lpMint || lpMint;
        configAddress = (keys.config && keys.config.toBase58?.()) || keys.config || "";
        feeReceiver = (keys.feeReceiver && keys.feeReceiver.toBase58?.()) || keys.feeReceiver || "";

        // Identify pool type
        if (
          keys.programId?.toString() === "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"
          || p.type === "CPMM"
        ) {
          poolType = "cpmm";
        } else {
          poolType = "standard";
        }

        // Fees: prefer on-chain
        if (
          "tradeFeeNumerator" in keys &&
          "tradeFeeDenominator" in keys
        ) {
          fees = {
            tradeFeeNumerator: keys.tradeFeeNumerator?.toString(),
            tradeFeeDenominator: keys.tradeFeeDenominator?.toString(),
            protocolFeeNumerator: keys.protocolFeeNumerator?.toString(),
            protocolFeeDenominator: keys.protocolFeeDenominator?.toString(),
            fundFeeNumerator: keys.fundFeeNumerator?.toString(),
            fundFeeDenominator: keys.fundFeeDenominator?.toString(),
          };
          feesSource = "poolKeys";
        } else if (p.config) {
          fees = {
            tradeFeeRate: p.config.tradeFeeRate,
            protocolFeeRate: p.config.protocolFeeRate,
            fundFeeRate: p.config.fundFeeRate,
            createPoolFee: p.config.createPoolFee,
          };
          feesSource = "config";
        }
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[WARN] Could not fully fetch pool info for ${p.id}: ${msg}`);
    }

    // ---------- SUMMARY OBJECT ----------
    detailedPools.push({
      id: p.id,
      programId: p.programId,
      type: p.type,
      price: p.price,
      tvl: p.tvl,
      mintA,
      mintB,
      decimalsA,
      decimalsB,
      vaultA,
      vaultB,
      authority,
      lpMint,
      configAddress,
      feeReceiver,
      tickSpacing,
      currentTick,
      observationAccount,
      exBitmapAccount,
      poolType,
      fees,
      feesSource,
      rawSdkPoolInfo: p,
    });

    // UI/UX delay
    if (poolsApiResult.indexOf(p) < poolsApiResult.length - 1) {
      await sleep(DELAY_BETWEEN_POOL_PROCESSING_MS);
    }
  }

  return detailedPools;
}
