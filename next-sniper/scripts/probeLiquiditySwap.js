// scripts/probeLiquiditySwap.js
const { Raydium } = require('@raydium-io/raydium-sdk-v2');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');

(async () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const owner = Keypair.generate().publicKey;

  console.log("[PROBE] Loading Raydium SDK...");
  const raydium = await Raydium.load({
    connection,
    owner,
    disableLoadToken: true,
    disableFeatureCheck: true,
  });

  // Find an actual pool
  const poolId = new PublicKey('58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'); // SOL-USDC
  console.log('[PROBE] .liquidity.swap type:', typeof raydium.liquidity.swap);

  // Try to call .liquidity.swap (WILL FAIL unless you pass real params!)
  try {
    // This is just a dry probe: print the function, don't actually run it (unless you know all required params)
    console.log('[PROBE] .liquidity.swap signature:', raydium.liquidity.swap.toString());
  } catch (e) {
    console.error('[PROBE] .liquidity.swap() test threw:', e);
  }
})();
