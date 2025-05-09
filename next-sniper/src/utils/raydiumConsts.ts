// src/utils/raydiumConsts.ts (Correct "Export Strings for Configs" version)
import { PublicKey } from '@solana/web3.js';
import { ALL_PROGRAM_ID, DEVNET_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2';

// This version ("v6/Final" or "Export Strings for Configs") is correct
console.log("[RaydiumConsts-v6/Final] File loading. Exporting SDK PublicKey objects and Config ID strings.");

export const MAINNET_AMM_V4_PROGRAM_ID: PublicKey = ALL_PROGRAM_ID.AMM_V4;
export const DEVNET_AMM_V4_PROGRAM_ID: PublicKey = DEVNET_PROGRAM_ID.AmmV4;
export const MAINNET_CREATE_POOL_PROGRAM_ID: PublicKey = ALL_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM;
export const DEVNET_CREATE_POOL_PROGRAM_ID: PublicKey = DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM;
export const MAINNET_AMM_V4_CONFIG_ID_STR = "5Q544fKrFoe6tsEbD7S8sLhYDCdLMDMDeYNsPSJ9Y3oS";
export const DEVNET_AMM_V4_CONFIG_ID_STR = "9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6";

// ... (logging to confirm values) ...
console.log("[RaydiumConsts-v6/Final] Module parsed.");