// src/global.d.ts

declare global {
  // Use 'any' if you don't know the type, otherwise use Raydium or your actual SDK type.
 var raydiumSdkInstance: import('@raydium-io/raydium-sdk-v2').Raydium | any;
}

// Allow TypeScript to resolve the CDN-hosted web3 module used by the wallet
// worker. The actual runtime script is fetched from jsDelivr, but we map its
// types to the locally installed @solana/web3.js package so that compilation
// succeeds without `cannot find module` errors.
declare module 'https://cdn.jsdelivr.net/npm/@solana/web3.js@1.98.2/lib/index.browser.esm.js' {
 export const Keypair: any;
}