import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { swapInstruction } from './clmmSwapHelper'

const programId = new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK');
const payer = new PublicKey('DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs');
const poolId = new PublicKey('4mrxVt1GBdS9dn1p3wG4NAffku5WiSjZhvMKC2koexbw');

const inputMint = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL
const outputMint = new PublicKey('h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood'); // H5N

const inputVault = new PublicKey('86RDsfzn51wAZUEtJDWQWeHgLDr8Q4np7RMbopnSczAa');
const outputVault = new PublicKey('5LJcsaTWiZweWWsWFXiz45tJL863VD2scAsCwuZCfdwL');

// === CHANGE THESE TO YOUR WALLET ATAs! ===
const inputTokenAccount = new PublicKey('DuRSM3UwLgEqyYTywJu4F4VhDq2GLCNfQpEVhECX38Qx'); // WSOL ATA
const outputTokenAccount = new PublicKey('5qnQ9YpR8UWtTCMurHFBMLVsfg7oJoN7NfMCxJLzMJCs'); // H5N ATA

// === DUMMY VALUES BELOW (replace if you have real ones) ===
const ammConfigId = new PublicKey('11111111111111111111111111111111'); // Usually not needed for CLMM
const tickArray = [new PublicKey('11111111111111111111111111111111')]; // Real one required for actual swap!
const observationId = new PublicKey('11111111111111111111111111111111'); // Real one required for actual swap!

const amount = new BN(1000000); // 0.001 SOL
const otherAmountThreshold = new BN(1);
const sqrtPriceLimitX64 = new BN(0);
const isBaseInput = true;

(async () => {
  try {
    console.log('[DEBUG] Starting concentrated pool swap instruction build...');
    const ix = swapInstruction(
      programId,
      payer,
      poolId,
      ammConfigId,
      inputTokenAccount,
      outputTokenAccount,
      inputVault,
      outputVault,
      inputMint,
      outputMint,
      tickArray,
      observationId,
      amount,
      otherAmountThreshold,
      sqrtPriceLimitX64,
      isBaseInput
    );
    console.log('[SUCCESS] Built CLMM swap instruction:');
    console.dir(ix, { depth: 4 });
  } catch (e) {
    console.error('[FATAL ERROR] CLMM swap instruction failed:', e);
  }
})();

