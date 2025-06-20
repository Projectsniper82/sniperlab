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
  // Cast to any to avoid Window vs WorkerGlobalScope type mismatch
  (globalThis as any).window = self as any;
    const web3 = await import(
    'https://cdn.jsdelivr.net/npm/@solana/web3.js@1.98.2/lib/index.browser.esm.js'
  );

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

    console.log('[walletCreator] Posting generated wallets');
  self.postMessage({ wallets: serialized });
  console.log('[walletCreator] Posted generated wallets');
  } catch (err: any) {
    console.log('[walletCreator] Caught error, sending to main thread');
    console.error('[walletCreator] Error during wallet creation', err);
     const msg = err?.message || 'Unknown error';
    self.postMessage({ log: `[walletCreator] Error during wallet creation: ${msg}` });
    self.postMessage({ error: msg });
  }
};

export {};