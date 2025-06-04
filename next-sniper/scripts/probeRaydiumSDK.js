const { Raydium } = require('@raydium-io/raydium-sdk-v2');
const { Connection, PublicKey } = require('@solana/web3.js');

(async () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  // Use any public key (doesn't matter here)
  const owner = new PublicKey('11111111111111111111111111111111');
  
  let sdk;
  try {
    sdk = await Raydium.load({
      connection,
      cluster: 'mainnet',
      owner,
      disableLoadToken: false,
      disableFeatureCheck: false,
    });
    console.log('[SDK] Raydium SDK loaded:', !!sdk);
    console.log('[SDK] typeof Raydium:', typeof Raydium);
    console.log('[SDK] SDK keys:', Object.keys(sdk));
    console.log('[SDK] SDK version:', sdk.version);
    console.log('[SDK] .liquidity keys:', Object.keys(sdk.liquidity || {}));
    console.log('[SDK] .api keys:', Object.keys(sdk.api || {}));
  } catch (e) {
    console.error('[SDK] Failed to load Raydium SDK:', e);
    process.exit(1);
  }

  // Look for swap-like functions
  ['swap', 'makeSwapInstruction', 'makeSwapTx', 'swapV4', 'cpmmSwap', 'cpmmMakeSwapInstruction'].forEach(fn => {
    const val = sdk[fn] || (sdk.liquidity && sdk.liquidity[fn]);
    console.log(`[SDK] sdk.${fn} =`, typeof val);
  });

  // See if getAmmPoolKeys is present and testable
  if (sdk.liquidity && typeof sdk.liquidity.getAmmPoolKeys === 'function') {
    try {
      console.log('[SDK] getAmmPoolKeys exists, calling with example pool...');
      const poolId = '6UeS4iU8nZBW4cmSmVmjK7bfnh9YxRxK9RbM5J6F4XJb'; // random known Raydium pool
      const keys = await sdk.liquidity.getAmmPoolKeys(poolId);
      console.log('[SDK] getAmmPoolKeys result:', keys);
    } catch (err) {
      console.error('[SDK] getAmmPoolKeys failed:', err);
    }
  } else {
    console.log('[SDK] getAmmPoolKeys not found');
  }

  // Print anything else useful from .liquidity
  if (sdk.liquidity) {
    console.log('[SDK] .liquidity prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(sdk.liquidity)));
  }

  // Print example .api usage
  if (sdk.api && typeof sdk.api.fetchPoolByMints === 'function') {
    try {
      const pools = await sdk.api.fetchPoolByMints({
        mint1: 'So11111111111111111111111111111111111111112',
        mint2: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      });
      console.log('[SDK] api.fetchPoolByMints result:', pools);
    } catch (e) {
      console.error('[SDK] api.fetchPoolByMints failed:', e);
    }
  } else {
    console.log('[SDK] .api.fetchPoolByMints not found');
  }
})();

