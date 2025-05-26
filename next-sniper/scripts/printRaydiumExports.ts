import * as raydium from '@raydium-io/raydium-sdk-v2';
console.log('Raydium SDK v2 All Top-Level Exports:');
for (const key of Object.keys(raydium)) {
  console.log('-', key, typeof (raydium as any)[key]);
}

