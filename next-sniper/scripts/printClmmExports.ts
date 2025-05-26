import { Clmm } from '@raydium-io/raydium-sdk-v2';

console.log('Clmm functions/properties:');
for (const key of Object.keys(Clmm)) {
  console.log('-', key, typeof (Clmm as any)[key]);
}
