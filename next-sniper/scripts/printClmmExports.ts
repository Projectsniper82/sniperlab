import * as Raydium from '@raydium-io/raydium-sdk-v2';

console.log('Top-level Raydium SDK exports:');
for (const key of Object.keys(Raydium)) {
  console.log('-', key, typeof (Raydium as any)[key]);
}

