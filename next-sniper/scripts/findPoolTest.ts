#!/usr/bin/env tsx
// @ts-nocheck

import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { Connection, PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { Raydium } from '@raydium-io/raydium-sdk-v2';

async function main() {
  const [mintStr, cluster] = process.argv.slice(2) as [string, string];
  if (!mintStr || !['mainnet-beta', 'devnet'].includes(cluster)) {
    console.error('Usage: npm run test:findpool -- <TOKEN_MINT> <devnet|mainnet-beta>');
    process.exit(1);
  }

  const rpcUrl =
    cluster === 'mainnet-beta'
      ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com'
      : process.env.NEXT_PUBLIC_DEVNET_RPC_URL  || 'https://api.devnet.solana.com';

  const connection = new Connection(rpcUrl, 'confirmed');
  console.log(`\n🔍 Loading Raydium SDK on ${cluster}…`);
  const sdk = await Raydium.load({
    connection,
    cluster: cluster === 'mainnet-beta' ? 'mainnet' : 'devnet',
    disableLoadToken: true,
    disableFeatureCheck: true,
  });
  console.log('✅ SDK ready');

  console.log(`\n🔍 Fetching pools for ${mintStr} / ${NATIVE_MINT.toBase58()}…`);
  const { data: pools } = await sdk.api.fetchPoolByMints({
    mint1: mintStr,
    mint2: NATIVE_MINT.toBase58(),
  });
  if (!pools?.length) {
    console.log('⚠️ No pools found.');
    return;
  }
  console.log(`✅ Found ${pools.length} pool(s):\n`);

  for (const p of pools) {
    console.log('─'.repeat(40));
    console.log(`Pool ID     : ${p.id}`);
    console.log(`Program ID  : ${p.programId}`);
    console.log(`Type        : ${p.type}`);
    console.log(`Price       : ${p.price}`);
    console.log(`TVL         : ${p.tvl}`);

    try {
      if (p.type === 'Concentrated') {
        // — Concentrated pools: unchanged, fast & accurate
        console.log('ℹ️ Processing Concentrated pool…');
        const { poolInfo } = await sdk.clmm.getPoolInfoFromRpc(p.id);
        console.log(`Vault A     : ${poolInfo.vaultA.toBase58()}`);
        console.log(`Vault B     : ${poolInfo.vaultB.toBase58()}`);

      } else {
        // — Standard pools: AMMv4 or CPMM
        console.log('ℹ️ Processing Standard pool via SDK.liquidity.getAmmPoolKeys…');
        const poolPubkey = new PublicKey(p.id);
        const keys = await sdk.liquidity.getAmmPoolKeys(poolPubkey);

        // New SDK format: nested under `vault.A` & `vault.B`
        if (keys.vault && keys.vault.A && keys.vault.B) {
          console.log(`Vault A     : ${keys.vault.A}`);
          console.log(`Vault B     : ${keys.vault.B}`);

        // Fallback for older SDK versions: top-level baseVault/quoteVault
        } else if ('baseVault' in keys && 'quoteVault' in keys) {
          console.log(`Vault A     : ${keys.baseVault.toBase58()}`);
          console.log(`Vault B     : ${keys.quoteVault.toBase58()}`);

        } else {
          console.warn('⚠️ Unexpected keys structure:', keys);
        }
      }

    } catch (err: any) {
      console.error('⚠️ Error fetching vaults:', err.message);
    }
    console.log('');
  }
}

main().catch(e => {
  console.error('❌ Script failed:', e);
  process.exit(1);
});





































