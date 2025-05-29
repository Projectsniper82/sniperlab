import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=f0617c48-43a7-4419-a7f9-9775f2226c75');
const POOL_ID = '6UeJwE3kaGbYXQckD7XkR3U8Am99LaX3t2iZRRh5GgbF';

(async () => {
    const info = await connection.getAccountInfo(new PublicKey(POOL_ID));
    console.log(info ? '[OK] Pool account fetched.' : '[FAIL] No account info returned.');
})();






