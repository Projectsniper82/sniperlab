#!/usr/bin/env tsx
// @ts-nocheck

import dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import { Raydium } from "@raydium-io/raydium-sdk-v2";

async function main() {
    const mintStr = process.argv[2];
    const clusterString = process.argv[3] || "mainnet-beta";
    if (!mintStr) {
        console.error("Usage: tsx findPoolUniversal.ts <TOKEN_MINT> <mainnet-beta|devnet>");
        process.exit(1);
    }

    const endpoint =
        clusterString === "mainnet-beta"
            ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL || clusterApiUrl("mainnet-beta")
            : process.env.NEXT_PUBLIC_DEVNET_RPC_URL || clusterApiUrl("devnet");

    const connection = new Connection(endpoint, "confirmed");
    console.log(`🔍 Loading Raydium SDK on ${clusterString}…`);
    const sdk = await Raydium.load({
        connection,
        cluster: clusterString.startsWith("mainnet") ? "mainnet" : "devnet",
        disableLoadToken: true,
        disableFeatureCheck: true,
    });
    console.log("✅ SDK ready\n");

    console.log(`🔍 Fetching pools for ${mintStr} / ${NATIVE_MINT.toBase58()}…`);
    let poolsApiResult: any[] = [];
    try {
        const result = await sdk.api.fetchPoolByMints({
            mint1: mintStr,
            mint2: NATIVE_MINT.toBase58(),
        });
        poolsApiResult = result.data || [];
    } catch (err: any) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[poolFinder] Error fetching pools: ${msg}`);
        process.exit(1);
    }
    if (!poolsApiResult.length) {
        console.log("No pools found.");
        return;
    }

    console.log(`✅ Found ${poolsApiResult.length} pool(s):\n`);

    for (const p of poolsApiResult) {
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
            } else {
                // Standard/CPMM
                const poolPubkey = new PublicKey(p.id);
                const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey);

                if (keys.vault && keys.vault.A && keys.vault.B) {
                    vaultA = keys.vault.A.toString();
                    vaultB = keys.vault.B.toString();
                } else if ("baseVault" in keys && "quoteVault" in keys) {
                    vaultA = keys.baseVault.toBase58();
                    vaultB = keys.quoteVault.toBase58();
                }
                authority = (keys.authority && keys.authority.toBase58?.()) || keys.authority || "N/A";
                lpMint = (keys.lpMint && keys.lpMint.toBase58?.()) || keys.lpMint || lpMint;
                configAddress = (keys.config && keys.config.toBase58?.()) || keys.config || "";
                feeReceiver = (keys.feeReceiver && keys.feeReceiver.toBase58?.()) || keys.feeReceiver || "";

                if (
                    keys.programId?.toString() === "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"
                    || p.type === "CPMM"
                ) {
                    poolType = "cpmm";
                } else {
                    poolType = "standard";
                }

                // Try to extract ALL fee-related info possible
                fees = {};
                if (
                    "tradeFeeNumerator" in keys && "tradeFeeDenominator" in keys
                ) {
                    fees.tradeFeeNumerator = keys.tradeFeeNumerator?.toString();
                    fees.tradeFeeDenominator = keys.tradeFeeDenominator?.toString();
                }
                if (
                    "protocolFeeNumerator" in keys && "protocolFeeDenominator" in keys
                ) {
                    fees.protocolFeeNumerator = keys.protocolFeeNumerator?.toString();
                    fees.protocolFeeDenominator = keys.protocolFeeDenominator?.toString();
                }
                if (
                    "fundFeeNumerator" in keys && "fundFeeDenominator" in keys
                ) {
                    fees.fundFeeNumerator = keys.fundFeeNumerator?.toString();
                    fees.fundFeeDenominator = keys.fundFeeDenominator?.toString();
                }
                if (
                    "tradeFeeRate" in p.config
                ) {
                    fees.tradeFeeRate = p.config.tradeFeeRate;
                    fees.protocolFeeRate = p.config.protocolFeeRate;
                    fees.fundFeeRate = p.config.fundFeeRate;
                    fees.createPoolFee = p.config.createPoolFee;
                }
                feesSource = Object.keys(fees).length ? "poolKeys/config" : null;
            }
        } catch (err: any) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(`[WARN] Could not fully fetch pool info for ${p.id}: ${msg}`);
        }

        // ---------- SUMMARY OUTPUT ----------
        console.log("────────────────────────────────────────");
        console.log(`Pool ID     : ${p.id}`);
        console.log(`Program ID  : ${p.programId}`);
        console.log(`Type        : ${p.type} (${poolType})`);
        console.log(`Price       : ${p.price}`);
        console.log(`TVL         : ${p.tvl}`);
        console.log(`MintA       : ${mintA} (decimals: ${decimalsA})`);
        console.log(`MintB       : ${mintB} (decimals: ${decimalsB})`);
        console.log(`VaultA      : ${vaultA}`);
        console.log(`VaultB      : ${vaultB}`);
        console.log(`Authority   : ${authority}`);
        console.log(`LP Mint     : ${lpMint}`);
        if (poolType === "cpmm" || poolType === "concentrated" || configAddress) {
            console.log(`Config      : ${configAddress}`);
        }
        if (poolType === "cpmm" || feeReceiver) {
            console.log(`FeeReceiver : ${feeReceiver}`);
        }
        if (poolType === "concentrated") {
            console.log(`TickSpacing : ${tickSpacing}`);
            console.log(`CurrentTick : ${currentTick}`);
            console.log(`Observation : ${observationAccount}`);
            console.log(`ExBitmap    : ${exBitmapAccount}`);
        }
        // Fees
        if (feesSource === "clmm") {
            console.log("CLMM: Fees are dynamic, use SDK during swap");
        } else {
            console.log("FEES:");
            console.log(fees && Object.keys(fees).length ? fees : "{}");
            if (feesSource) console.log(`[DEBUG] Fee source: ${feesSource}`);
        }
    }
}

main().catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Fatal error: ${msg}`);
    process.exit(1);
});
























































