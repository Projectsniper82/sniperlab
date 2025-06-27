import { Buffer } from './libs/buffer.js';
import * as web3 from './libs/web3.js';

console.log('[bot-worker] Worker script loaded');

self.onmessage = async (ev) => {
  const { code, bots = [], context } = ev.data || {};
  console.log('[bot-worker] Received message', { bots: bots.length });
  try {
    // Provide window polyfill similar to walletCreator
    globalThis.window = self;
    if (!globalThis.Buffer) {
      globalThis.Buffer = Buffer;
    }
    
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
    fn(exports, context);

    if (typeof exports.strategy !== 'function') {
      log('No strategy function exported as "strategy"');
      return;
    }

    for (const wallet of wallets) {
      try {
        await exports.strategy(wallet, log, context);
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