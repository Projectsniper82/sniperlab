const { Raydium } = require('@raydium-io/raydium-sdk-v2');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');

(async () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  // Use any valid pubkey for 'owner'
  const owner = Keypair.generate().publicKey;

  console.log('[INFO] Loading Raydium SDK...');
  const raydium = await Raydium.load({
    connection,
    owner,
    disableLoadToken: true,
    disableFeatureCheck: true,
  });

  function printKeys(obj, name = 'root', depth = 1) {
    if (depth > 3) return; // don't go too deep to avoid noise
    const keys = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(obj)))
      .filter((v, i, a) => a.indexOf(v) === i && v !== 'constructor');
    console.log(`\n== Keys of ${name}:`);
    keys.forEach(k => {
      try {
        if (typeof obj[k] === 'function') {
          console.log(`  [fn] ${k}`);
        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
          console.log(`  [obj] ${k}`);
          // Optionally, dive into a submodule for top-level modules
          if (depth === 1) printKeys(obj[k], `${name}.${k}`, depth + 1);
        } else {
          console.log(`  [val] ${k}`);
        }
      } catch (e) {
        console.log(`  [??] ${k}`);
      }
    });
  }

  printKeys(raydium, 'raydium');

  console.log('\n[INFO] Top-level function list complete.');
})();
