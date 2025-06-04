import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  NATIVE_MINT,
  TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID,
  createSyncNativeInstruction,
  createCloseAccountInstruction,
} from '@solana/spl-token';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { getOrCreateATA } from './getOrCreateATA';
import { DiscoveredPoolDetailed } from './poolFinder';
import {
  buildSwapInstruction,
  BuildSwapInstructionParams,
} from './SwapHelpers';
import { getStandardPoolUiData, calculateStandardAmmSwapQuote } from './ammSwapCalculator';

import { initRaydiumSdk } from './initRaydiumSdk'; // << USE YOUR SINGLETON

const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
const toPublicKey = (key: string | PublicKey): PublicKey => typeof key === 'string' ? new PublicKey(key) : key;

export async function mainnetBuySwap(
  wallet: any,
  connection: Connection,
  selectedPool: DiscoveredPoolDetailed,
  buyAmountSOLFloat: number,
  slippagePercent: number // e.g., 1 for 1%
): Promise<string> {
  console.log('[mainnetBuySwap] --- BEGIN MAINNET BUY SWAP ---');
  // ... (your early checks remain the same) ...

  const payer = toPublicKey(wallet.publicKey);
  const amountInLamports = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
  const inputMint = NATIVE_MINT;
  let outputMint: PublicKey;
  let poolInputVault: PublicKey;
  let poolOutputVault: PublicKey;

  if (selectedPool.mintA.toString() === NATIVE_MINT.toBase58()) {
    outputMint = toPublicKey(selectedPool.mintB);
    poolInputVault = toPublicKey(selectedPool.vaultA);
    poolOutputVault = toPublicKey(selectedPool.vaultB);
  } else if (selectedPool.mintB.toString() === NATIVE_MINT.toBase58()) {
    outputMint = toPublicKey(selectedPool.mintA);
    poolInputVault = toPublicKey(selectedPool.vaultB);
    poolOutputVault = toPublicKey(selectedPool.vaultA);
  } else {
    throw new Error('Selected pool does not involve SOL/WSOL, cannot proceed with this buy utility.');
  }

  // 1. Ensure user has ATAs
  const userWsolAta = await getOrCreateATA({
    connection,
    walletPublicKey: payer,
    mintPublicKey: inputMint,
    payer,
    signTransaction: wallet.signTransaction,
  });
  const userTokenAta = await getOrCreateATA({
    connection,
    walletPublicKey: payer,
    mintPublicKey: outputMint,
    payer,
    signTransaction: wallet.signTransaction,
  });

  // 2. Calculate minAmountOut
  const uiPoolReserves = getStandardPoolUiData(selectedPool);
  if (!uiPoolReserves) throw new Error('Could not extract pool reserves for minOut calculation. Aborting swap.');
  const swapQuote = calculateStandardAmmSwapQuote(
    buyAmountSOLFloat,
    true,
    uiPoolReserves,
    slippagePercent
  );
  if (!swapQuote || swapQuote.minAmountOutRaw.isZero()) throw new Error('Calculated minAmountOut is zero (or quote calculation failed).');

  const minAmountOut = swapQuote.minAmountOutRaw;

  // 3. Raydium SDK usage - GET FROM SINGLETON
  const sdk = await initRaydiumSdk();
  console.log("[mainnetBuyUtil] SDK loaded:", !!sdk, "SDK version:", sdk?.version, "liquidity:", !!sdk?.liquidity, "makeSwapInstruction:", typeof sdk?.liquidity?.makeSwapInstruction);
  if (!sdk) throw new Error('Raydium SDK instance not initialized!');
  // ** CRITICAL: fetch poolKeys from SDK with the real pool ID! **
  const poolKeys = await sdk.liquidity.getAmmPoolKeys(selectedPool.id);

  // Prepare userKeys
  const userKeys = {
    payer,
    userInputAccount: userWsolAta,
    userOutputAccount: userTokenAta,
  };

  // Build the swap instruction
  const params: BuildSwapInstructionParams = {
    sdk,
    poolKeys,
    userKeys,
    amountIn: amountInLamports,
    minAmountOut,
  };
  const swapInstruction = await buildSwapInstruction(params);

  // 4. Build the transaction
  const transaction = new Transaction();
  transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25000 }),
  );
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: userWsolAta,
      lamports: amountInLamports.toNumber(),
    }),
    createSyncNativeInstruction(userWsolAta, SPL_TOKEN_PROGRAM_ID)
  );
  transaction.add(swapInstruction);
  transaction.add(
    createCloseAccountInstruction(
      userWsolAta,
      payer,
      payer,
      [],
      SPL_TOKEN_PROGRAM_ID
    )
  );
  transaction.feePayer = payer;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;

  try {
    const signedTx = await wallet.signTransaction(transaction);
    const txSignature = await connection.sendRawTransaction(signedTx.serialize());
    const confirmation = await connection.confirmTransaction({
      signature: txSignature,
      blockhash: blockhash,
      lastValidBlockHeight: lastValidBlockHeight
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed confirmation: ${JSON.stringify(confirmation.value.err)}`);
    }
    return txSignature;

  } catch (signOrSendError) {
    throw signOrSendError;
  }
}
