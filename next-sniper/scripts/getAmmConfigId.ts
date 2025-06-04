import { Connection, PublicKey } from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";

// Your Raydium pool address here:
const POOL_ADDRESS = "3oEFniXw6csxTyMen7wTCJeEAiVGsAbniwcMGQczb6iK";
const RPC_URL = "https://api.mainnet-beta.solana.com/";

// Minimal layout to get config (fee address) at offset 520 (standard pool)
const CONFIG_OFFSET = 520;
const CONFIG_LENGTH = 32;

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  const poolPubkey = new PublicKey(POOL_ADDRESS);

  // Get pool account data
  const poolAccount = await connection.getAccountInfo(poolPubkey);
  if (!poolAccount?.data) {
    console.error("Failed to fetch pool account data.");
    process.exit(1);
  }

  // Slice config (fee/config) pubkey directly
  const configBuffer = poolAccount.data.slice(CONFIG_OFFSET, CONFIG_OFFSET + CONFIG_LENGTH);
  const configPubkey = new PublicKey(configBuffer);

  console.log("Pool:", POOL_ADDRESS);
  console.log("ammConfig (fee/config account) address:", configPubkey.toBase58());
}

main().catch(e => { console.error(e); process.exit(1); });




