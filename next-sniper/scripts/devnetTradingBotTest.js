const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const BN = require('bn.js');
const fs = require('fs');

const { createWalletAdapter } = require('../src/utils/walletAdapter');
const { executeJupiterSwap } = require('../src/utils/jupiterSwapUtil');

(async () => {
  const secret = JSON.parse(fs.readFileSync(require('path').join(__dirname,'../phantom-keypair.json'), 'utf8'));
  const kp = Keypair.fromSecretKey(Uint8Array.from(secret));
  const connection = new Connection('https://api.devnet.solana.com');
  const wallet = createWalletAdapter(kp, connection);

  try {
    await executeJupiterSwap({
      wallet,
      connection,
      inputMint: new PublicKey('So11111111111111111111111111111111111111112'),
      outputMint: new PublicKey('So11111111111111111111111111111111111111112'),
      amount: new BN(1),
      slippageBps: 50,
      onlyGetQuote: true
    });
    console.log('Buy flow succeeded');
  } catch (e) {
    console.error('Buy flow failed', e);
  }
})();