console.log('[walletCreator] Worker script loaded');

self.onmessage = async (ev) => {
  const { totalSol, duration, network, rpcUrl } = ev.data;
  console.log('[walletCreator] Received params', {
    totalSol,
    duration,
    network,
    rpcUrl,
  });
  console.log('[walletCreator] Start wallet generation');
  try {
    // Provide a window object for libraries expecting a browser environment
    globalThis.window = self;
    const web3 = await import('@solana/web3.js');

    const tradingWallets = [];
    const intermediateWallets = [];
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
   } catch (err: any) { // Add ': any' to explicitly cast err to any
    console.error('[walletCreator] Error during wallet creation', err);
    // You can safely access .message after casting to `any`
    self.postMessage({ error: err.message });
  }
};

export {};