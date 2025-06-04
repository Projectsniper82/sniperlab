// src/global.d.ts

import type { Raydium } from '@raydium-io/raydium-sdk-v2';

declare global {
  // Use 'any' if you don't know the type, otherwise use Raydium or your actual SDK type.
  var raydiumSdkInstance: Raydium | any;
}

export {}; // This makes it a module
