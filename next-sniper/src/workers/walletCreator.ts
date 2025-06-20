self.onmessage = async () => {
  // Provide a window object for libraries expecting a browser environment
  globalThis.window = self as any;
  const web3 = await import('@solana/web3.js');

  const tradingWallets: InstanceType<typeof web3.Keypair>[] = [];
  const intermediateWallets: InstanceType<typeof web3.Keypair>[] = [];
  for (let i = 0; i < 6; i++) {
    tradingWallets.push(web3.Keypair.generate());
    intermediateWallets.push(web3.Keypair.generate());
  }

  self.postMessage({
    log: `Generated 6 trading wallets and 6 intermediate wallets`,
  });

  const serialized = {
    trading: tradingWallets.map((w) => Array.from(w.secretKey)),
    intermediates: intermediateWallets.map((w) => Array.from(w.secretKey)),
  };

  self.postMessage({ wallets: serialized });
};
export { };