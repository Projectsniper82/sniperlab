import { Connection, PublicKey } from '@solana/web3.js';
import { makeSwapCpmmBaseInInstruction } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';

console.log('[DEBUG] Script started');

try {
  const programIdStr         = 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C';
  const payerStr             = 'DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs';
  const authorityStr         = 'GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL';
  // ===== FIXED =====
  const configIdStr          = '11111111111111111111111111111111'; // <- Use system program
  // =================
  const poolIdStr            = 'HrpDDHTVF9ndpxXwCjjRFb4GPLqkExeV7Co7qrGfnATr';
  const userInputAccountStr  = 'DuRSM3UwLgEqyYTywJu4F4VhDq2GLCNfQpEVhECX38Qx';
  const userOutputAccountStr = '5qnQ9YpR8UWtTCMurHFBMLVsfg7oJoN7NfMCxJLzMJCs';
  const inputVaultStr        = 'EcFoH6MZQaPhZErNj4e2Y5ZtyUKiqnNbdpxDauEbT1NK';
  const outputVaultStr       = 'CffYiTu2JSb2kPQjjZG2MhnLFma8Qu5RDG8q3F3hvLy9';
  const inputTokenProgramStr = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  const outputTokenProgramStr= 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  const inputMintStr         = 'So11111111111111111111111111111111111111112';
  const outputMintStr        = 'h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood';
  const observationIdStr     = '11111111111111111111111111111111';

  const programId         = new PublicKey(programIdStr);         console.log('[DEBUG] programId:', programIdStr);
  const payer             = new PublicKey(payerStr);             console.log('[DEBUG] payer:', payerStr);
  const authority         = new PublicKey(authorityStr);         console.log('[DEBUG] authority:', authorityStr);
  const configId          = new PublicKey(configIdStr);          console.log('[DEBUG] configId:', configIdStr);
  const poolId            = new PublicKey(poolIdStr);            console.log('[DEBUG] poolId:', poolIdStr);
  const userInputAccount  = new PublicKey(userInputAccountStr);  console.log('[DEBUG] userInputAccount:', userInputAccountStr);
  const userOutputAccount = new PublicKey(userOutputAccountStr); console.log('[DEBUG] userOutputAccount:', userOutputAccountStr);
  const inputVault        = new PublicKey(inputVaultStr);        console.log('[DEBUG] inputVault:', inputVaultStr);
  const outputVault       = new PublicKey(outputVaultStr);       console.log('[DEBUG] outputVault:', outputVaultStr);
  const inputTokenProgram = new PublicKey(inputTokenProgramStr); console.log('[DEBUG] inputTokenProgram:', inputTokenProgramStr);
  const outputTokenProgram= new PublicKey(outputTokenProgramStr);console.log('[DEBUG] outputTokenProgram:', outputTokenProgramStr);
  const inputMint         = new PublicKey(inputMintStr);         console.log('[DEBUG] inputMint:', inputMintStr);
  const outputMint        = new PublicKey(outputMintStr);        console.log('[DEBUG] outputMint:', outputMintStr);
  const observationId     = new PublicKey(observationIdStr);     console.log('[DEBUG] observationId:', observationIdStr);

  const amountIn          = new BN(1000000);  console.log('[DEBUG] amountIn (BN):', amountIn.toString());
  const amountOutMin      = new BN(1);        console.log('[DEBUG] amountOutMin (BN):', amountOutMin.toString());

  (async () => {
    try {
      console.log('[DEBUG] Calling makeSwapCpmmBaseInInstruction...');
      const ix = await makeSwapCpmmBaseInInstruction(
        programId,
        payer,
        authority,
        configId,
        poolId,
        userInputAccount,
        userOutputAccount,
        inputVault,
        outputVault,
        inputTokenProgram,
        outputTokenProgram,
        inputMint,
        outputMint,
        observationId,
        amountIn,
        amountOutMin
      );
      console.log('[testSwapRaydium_H5N] SUCCESS! Here is the built swap instruction:');
      console.dir(ix, { depth: 4 });
    } catch (e) {
      console.error('[testSwapRaydium_H5N] ERROR in async:', e);
    }
  })();
} catch (fatal) {
  console.error('[FATAL ERROR] While parsing public keys or BN:', fatal);
}
