// src/utils/initRaydiumSdk.ts
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { Connection, PublicKey } from '@solana/web3.js';

// YOU MUST NOT use a static owner if you want security. For now this is fine for mainnet bot.
const RPC = 'https://api.mainnet-beta.solana.com';
const OWNER = new PublicKey('11111111111111111111111111111111'); // or any valid pubkey

export async function initRaydiumSdk() {
  // Prevent duplicate inits, work in both SSR and client
  if (typeof window !== "undefined") {
    if ((window as any).raydiumSdkInstance) return (window as any).raydiumSdkInstance;
  } else {
    if ((globalThis as any).raydiumSdkInstance) return (globalThis as any).raydiumSdkInstance;
  }

  const connection = new Connection(RPC);
  const sdk = await Raydium.load({
    connection,
    cluster: 'mainnet',
    owner: OWNER,
    disableLoadToken: false,
    disableFeatureCheck: false,
  });

  // Save instance globally for re-use
  if (typeof window !== "undefined") {
    (window as any).raydiumSdkInstance = sdk;
  } else {
    (globalThis as any).raydiumSdkInstance = sdk;
  }

  return sdk;
}

