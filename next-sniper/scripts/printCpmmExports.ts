import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=f0617c48-43a7-4419-a7f9-9775f2226c75');
const owner = Keypair.generate().publicKey;

(async () => {
    const sdk = await Raydium.load({ owner, connection, cluster: 'mainnet' });
    console.log('Raydium.cpmm functions:');
    for (const k of Object.keys(sdk.cpmm)) {
        console.log('-', k, typeof (sdk.cpmm as any)[k]);
    }
})();
