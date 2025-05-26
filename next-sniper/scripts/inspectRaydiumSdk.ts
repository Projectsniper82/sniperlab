// scripts/inspectRaydiumSdk.ts

import * as Raydium from '@raydium-io/raydium-sdk-v2';

// Print all top-level exports so we know what classes/objects exist
console.log('Top-level Raydium exports:');
for (const k of Object.keys(Raydium)) {
  const v = (Raydium as any)[k];
  let type = typeof v;
  let className = (type === 'function' && v?.prototype?.constructor?.name) ? v.prototype.constructor.name : '';
  console.log(`- ${k}: ${type}${className ? ' (class: ' + className + ')' : ''}`);
}
