// scripts/testPriorityFee.ts
import { Connection } from '@solana/web3.js';
import { getOptimalPriorityFee } from '../src/utils/priorityFee';
import dotenv from 'dotenv';
import path from 'path';

// --- This is the new part that loads your .env.local file ---
try {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    console.log("Loaded environment variables from .env.local");
} catch (e) {
    console.log("Could not find .env.local file, using default RPC.");
}
// -------------------------------------------------------------

// This now reads from the environment, just like your other scripts
const RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com';

async function main() {
    console.log(`Connecting to ${RPC_URL}...`);
    const connection = new Connection(RPC_URL, 'confirmed');

    console.log("Fetching optimal priority fee...");
    const fee = await getOptimalPriorityFee(connection);

    console.log("\n===================================");
    console.log(`✅ Suggested Priority Fee: ${fee} micro-lamports`);
    console.log("===================================");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});