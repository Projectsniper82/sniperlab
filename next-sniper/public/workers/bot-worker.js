import { Buffer } from './libs/buffer.js';

function createWalletAdapter(web3, wallet) {
  let kp = null;
  let pk = null;
  if (wallet instanceof web3.Keypair) {
    kp = wallet;
    pk = wallet.publicKey;
  } else if (wallet?.secretKey) {
    try {
      const sk = wallet.secretKey instanceof Uint8Array ? wallet.secretKey : Uint8Array.from(wallet.secretKey);
      kp = web3.Keypair.fromSecretKey(sk);
      pk = kp.publicKey;
    } catch (_) {}
  }
  if (!pk && wallet?.publicKey) {
    try { pk = new web3.PublicKey(wallet.publicKey.toString()); } catch (_) {}
  }
  if (!pk) throw new Error('Invalid wallet for adapter');
  const signTx = async (tx) => {
    if (kp) {
      if (tx instanceof web3.VersionedTransaction) tx.sign([kp]);
      else tx.partialSign(kp);
      return tx;
    }
    return await wallet.signTransaction(tx);
  };
  const signAll = async (txs) => {
    if (kp) {
      txs.forEach((t) => {
        if (t instanceof web3.VersionedTransaction) t.sign([kp]);
        else t.partialSign(kp);
      });
      return txs;
    }
    return await wallet.signAllTransactions(txs);
  };
  return { publicKey: pk, signTransaction: signTx, signAllTransactions: signAll, get connected() { return true; } };
}


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
  const workerContext = { ...restContext, rpcUrl, connection, web3 };
  if (systemState) workerContext.systemState = systemState;
    
    const wallets = bots.map((sk) => {
      try {
        const kp = web3.Keypair.fromSecretKey(Uint8Array.from(sk));
        return createWalletAdapter(web3, kp);
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
