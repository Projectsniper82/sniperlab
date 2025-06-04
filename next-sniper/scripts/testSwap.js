// scripts/manualSwapTest.js
const { Raydium } = require('@raydium-io/raydium-sdk-v2');
const { Connection, PublicKey, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');

(async () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  // !! Replace with your real wallet secret if you want to actually sign and send
  const owner = Keypair.generate(); // Keypair.fromSecretKey(Uint8Array.from([...]))
  const wallet = { publicKey: owner.publicKey }; // Faking for structure

  const raydium = await Raydium.load({
    connection,
    owner: owner.publicKey,
    disableLoadToken: false,
    disableFeatureCheck: false,
  });

  // Fetch a poolId, for example SOL/USDC
  const inputMint = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL
  const outputMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
  const poolData = await raydium.api.fetchPoolByMints({
    mint1: inputMint.toBase58(),
    mint2: outputMint.toBase58(),
  });
  const poolId = poolData.data[0]?.id;
  console.log('[TEST] Using pool ID:', poolId);

  const amount = 1_000_000; // 0.001 SOL (for testing, raw lamports)
  const slippageBps = 50; // 0.5%

  // Compose swap params
  const swapParams = {
    inputMint,
    outputMint,
    amount,
    swapMode: 'ExactIn',
    slippageBps,
    owner: owner.publicKey,
    connection,
    poolId: poolId ? new PublicKey(poolId) : undefined,
    txVersion: 'V0',
    unwrapSol: true,
  };

  // Try swap - this just builds the transaction, does NOT send unless you want to sign
  try {
    const swapResult = await raydium.swap(swapParams);
    console.log('[TEST] swapResult keys:', Object.keys(swapResult));
    console.log('[TEST] swapResult:', swapResult);

    // If you want to sign/send: (skip if just probing)
    // const versionedTx = swapResult.transaction;
    // versionedTx.sign([owner, ...swapResult.signers]);
    // const txid = await connection.sendTransaction(versionedTx, { skipPreflight: true });
    // console.log('[TEST] TX sent:', txid);
  } catch (e) {
    console.error('[TEST] swap() call failed:', e);
  }
})();


