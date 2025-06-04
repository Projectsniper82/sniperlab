#!/usr/bin/env tsx
// @ts-nocheck

import dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });

import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";
import { fetchRaydiumPoolsFromSDK } from "../src/utils/poolFinder"; // Adjust if your path is different
import fetch from "node-fetch"; // npm install node-fetch if needed

const mintStr = process.argv[2] || "GmbC2HgWpHpq9SHnmEXZNT5e1zgcU9oASDqbAkGTpump";
const clusterString = (process.argv[3] || "mainnet") as "mainnet" | "devnet";
if (!mintStr) {
    console.error("Usage: tsx findPoolTest.ts <TOKEN_MINT> [mainnet|devnet]");
    process.exit(1);
}

const endpoint =
    clusterString === "mainnet"
        ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL || clusterApiUrl("mainnet-beta")
        : process.env.NEXT_PUBLIC_DEVNET_RPC_URL || clusterApiUrl("devnet");
const connection = new Connection(endpoint, "confirmed");

const ownerPubkey = process.env.NEXT_PUBLIC_TEST_WALLET_PK
    ? new PublicKey(process.env.NEXT_PUBLIC_TEST_WALLET_PK)
    : Keypair.generate().publicKey;

console.log("=============================================");
console.log("Network    :", clusterString);
console.log("Endpoint   :", endpoint);
console.log("Owner PK   :", ownerPubkey.toBase58());
console.log("Token Mint :", mintStr);
console.log("=============================================");

(async () => {
    // 1. Fetch pools from your poolFinder code
    const pools = await fetchRaydiumPoolsFromSDK(connection, mintStr, clusterString, ownerPubkey);

    // 2. Fetch Raydium pairs API for config address fallback
    let raydiumPairsApi = [];
    try {
        const raydiumApiResp = await fetch("https://api.raydium.io/v2/main/pairs");
        raydiumPairsApi = await raydiumApiResp.json();
    } catch (err) {
        console.error("[findPoolTest] Could not fetch Raydium pairs API:", err);
    }

    if (!pools.length) {
        console.error("❌ No pools found.");
        process.exit(1);
    }
    console.log(`\n✅ Found ${pools.length} pools. Dumping details:\n`);
    pools.forEach((pool: any, i: number) => {
        console.log("────────────────────────────────────────────");
        console.log(`[POOL ${i + 1}]`);
        Object.entries(pool).forEach(([k, v]) => {
            // Highlight configAddress and add fallback
            if (k === "configAddress") {
                let displayConfig = v;
                let fromFallback = false;
                if (!v || v === "" || v === "11111111111111111111111111111111") {
                    // Fallback from Raydium API
                    const found = raydiumPairsApi.find(pair => pair.id === pool.id);
                    if (found && found.config) {
                        displayConfig = found.config;
                        fromFallback = true;
                    }
                }
                if (displayConfig && displayConfig !== "" && displayConfig !== "11111111111111111111111111111111") {
                    if (fromFallback) {
                        console.log(`  configAddress: ${displayConfig}  <-- ✅ Fallback from Raydium API`);
                    } else {
                        console.log(`  configAddress: ${displayConfig}  <-- ✅`);
                    }
                } else {
                    console.warn(`  configAddress: ${displayConfig}  <-- ❌ MISSING OR SYSTEM PROGRAM!`);
                }
            } else {
                console.log(`  ${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
            }
        });
        console.log("────────────────────────────────────────────");
    });

    // Summary
    const poolsWithGoodConfig = pools.filter(p => {
        let cfg = p.configAddress;
        if (!cfg || cfg === "" || cfg === "11111111111111111111111111111111") {
            const found = raydiumPairsApi.find(pair => pair.id === p.id);
            if (found && found.config) return true;
            return false;
        }
        return true;
    });
    if (poolsWithGoodConfig.length < pools.length) {
        console.warn(
            `\n⚠️  ${pools.length - poolsWithGoodConfig.length} out of ${pools.length} pools are missing configAddress, even after fallback!`
        );
    } else {
        console.log("\n✅ All pools have a valid configAddress (direct or fallback).");
    }
})();


























































