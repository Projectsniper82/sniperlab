import { Buffer } from './libs/buffer.js';

// Load web3 once and reuse the promise across messages
const web3Promise = import(
  'https://cdn.jsdelivr.net/npm/@solana/web3.js@1.98.2/lib/index.browser.esm.js'
);

self.onmessage = async (ev) => {
 const { code, bots = [], context = {} } = ev.data || {};
  try {
    // Provide window polyfill similar to walletCreator
    globalThis.window = self;
    if (!globalThis.Buffer) {
      globalThis.Buffer = Buffer;
    }
    const web3 = await web3Promise;
    const { rpcUrl, systemState, ...restContext } = context;
  const connection = new web3.Connection(rpcUrl, 'confirmed');
  const workerContext = { ...restContext, rpcUrl, connection };
  if (systemState) workerContext.systemState = systemState;
    
    const wallets = bots.map((sk) => {
      try {
        return web3.Keypair.fromSecretKey(Uint8Array.from(sk));
      } catch (_) {
        return null;
      }
    }).filter(Boolean);

    const log = (msg) => {
      self.postMessage({ log: msg });
    };

    const exports = {};
    // Execute the provided code in a function scope
    const fn = new Function('exports', 'context', code);
    fn(exports, workerContext);

    if (typeof exports.strategy !== 'function') {
      log('No strategy function exported as "strategy"');
      return;
    }

    for (const wallet of wallets) {
      try {
        await exports.strategy(wallet, log, workerContext);
      } catch (err) {
        log(`Error executing strategy for ${wallet.publicKey.toBase58()}: ${err?.message || err}`);
      }
    }
  } catch (err) {
    console.error('[bot-worker] Error executing code', err);
    self.postMessage({ error: err.message || String(err) });
  }
};

export {};
