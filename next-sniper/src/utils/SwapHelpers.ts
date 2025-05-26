import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { makeSwapCpmmBaseInInstruction } from '@raydium-io/raydium-sdk-v2';

/**
 * Build a Raydium STANDARD swap instruction (CPMM V2).
 * Every argument MUST be passed in, in order (no hardcoding).
 * Logs everything for max transparency/debug.
 */
export async function buildStandardSwapIx(
  programId: PublicKey,
  payer: PublicKey,
  authority: PublicKey,
  configId: PublicKey,
  poolId: PublicKey,
  userInputAccount: PublicKey,
  userOutputAccount: PublicKey,
  inputVault: PublicKey,
  outputVault: PublicKey,
  inputTokenProgram: PublicKey,
  outputTokenProgram: PublicKey,
  inputMint: PublicKey,
  outputMint: PublicKey,
  observationId: PublicKey,
  amountIn: BN,
  amountOutMin: BN
): Promise<TransactionInstruction> {
  // --- LOG EVERYTHING ---
  console.log('[buildStandardSwapIx] CALLED WITH:');
  console.log({ 
    programId: programId.toBase58(),
    payer: payer.toBase58(),
    authority: authority.toBase58(),
    configId: configId.toBase58(),
    poolId: poolId.toBase58(),
    userInputAccount: userInputAccount.toBase58(),
    userOutputAccount: userOutputAccount.toBase58(),
    inputVault: inputVault.toBase58(),
    outputVault: outputVault.toBase58(),
    inputTokenProgram: inputTokenProgram.toBase58(),
    outputTokenProgram: outputTokenProgram.toBase58(),
    inputMint: inputMint.toBase58(),
    outputMint: outputMint.toBase58(),
    observationId: observationId.toBase58(),
    amountIn: amountIn.toString(),
    amountOutMin: amountOutMin.toString(),
  });

  // -- Build the swap instruction exactly like your working test script --
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

  console.log('[buildStandardSwapIx] Built swap instruction:', ix);
  return ix;
}


















