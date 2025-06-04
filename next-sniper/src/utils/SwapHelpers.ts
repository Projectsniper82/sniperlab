// src/utils/SwapHelpers.ts
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';

export interface BuildSwapInstructionParams {
  sdk: any;         // The Raydium SDK instance (await Raydium.load(...))
  poolKeys: any;    // Object returned by sdk.liquidity.getAmmPoolKeys(poolId)
  userKeys: {
    payer: PublicKey;
    userInputAccount: PublicKey;
    userOutputAccount: PublicKey;
  };
  amountIn: BN;
  minAmountOut: BN;
}

export async function buildSwapInstruction({
  sdk,
  poolKeys,
  userKeys,
  amountIn,
  minAmountOut,
}: BuildSwapInstructionParams): Promise<TransactionInstruction> {
  // Defensive checks and error log
  if (!sdk?.liquidity?.makeSwapInstruction) {
    throw new Error('Raydium SDK not loaded correctly or wrong SDK version!');
  }

  return await sdk.liquidity.makeSwapInstruction({
    poolKeys,
    userKeys,
    amountIn,
    minAmountOut,
  });
}

