console.log('[walletCreator] Worker script loaded');

self.onmessage = async () => {
  console.log('[walletCreator] Start wallet generation');
  try {
    // Provide a window object for libraries expecting a browser environment
    globalThis.window = self as any;
    const web3 = await import('@solana/web3.js');

  const tradingWallets: InstanceType<typeof web3.Keypair>[] = [];
    const intermediateWallets: InstanceType<typeof web3.Keypair>[] = [];
    for (let i = 0; i < 6; i++) {
      tradingWallets.push(web3.Keypair.generate());
      intermediateWallets.push(web3.Keypair.generate());
    }

    const logMsg = 'Generated 6 trading wallets and 6 intermediate wallets';
    console.log(`[walletCreator] ${logMsg}`);
    self.postMessage({ log: logMsg });

   const serialized = {
      trading: tradingWallets.map((w) => Array.from(w.secretKey)),
      intermediates: intermediateWallets.map((w) => Array.from(w.secretKey)),
    };

      self.postMessage({ wallets: serialized });
    console.log('[walletCreator] Posted generated wallets');
  } catch (err) {
    console.error('[walletCreator] Error during wallet creation', err);
    self.postMessage({ error: (err as Error).message });
  }
};

export { };