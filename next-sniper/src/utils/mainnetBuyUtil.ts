// src/utils/mainnetBuyUtil.ts
import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    ComputeBudgetProgram,
    TransactionInstruction, // Added for clarity
} from '@solana/web3.js';
import {
    NATIVE_MINT,
    TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID, // Explicit alias
    createSyncNativeInstruction,
    createCloseAccountInstruction,
    // getAssociatedTokenAddress, // getOrCreateATA handles this
} from '@solana/spl-token';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { getOrCreateATA } from './getOrCreateATA';
import { DiscoveredPoolDetailed } from './poolFinder'; // Ensure this path is correct
import {
    buildStandardAmmSwapInstruction,
    BuildStandardAmmSwapInstructionParams, // Import the params interface
} from './SwapHelpers'; // Ensure this path is correct

// Default/Placeholder PublicKeys if not available from pool object
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); // SystemProgram.programId

// Helper to ensure PublicKey conversion
const toPublicKey = (key: string | PublicKey): PublicKey => {
  if (typeof key === 'string') {
    return new PublicKey(key);
  }
  return key;
};

export async function mainnetBuySwap(
  wallet: any, // Should have publicKey and signTransaction
  connection: Connection,
  selectedPool: DiscoveredPoolDetailed,
  buyAmountSOLFloat: number,
  slippagePercent: number // e.g., 1 for 1%
): Promise<string> {
  console.log('[mainnetBuySwap] --- BEGIN MAINNET BUY SWAP ---');
  console.log('[mainnetBuySwap] Wallet PK:', wallet?.publicKey?.toString());
  console.log('[mainnetBuySwap] Selected Pool ID:', selectedPool?.id);
  console.log('[mainnetBuySwap] Selected Pool Type:', selectedPool?.type, '| Program ID:', selectedPool?.programId);
  console.log('[mainnetBuySwap] Buy Amount (SOL float):', buyAmountSOLFloat);
  console.log('[mainnetBuySwap] Slippage (%):', slippagePercent);

  if (!wallet || !wallet.publicKey || typeof wallet.signTransaction !== 'function') {
    throw new Error('Wallet not connected or does not support signTransaction.');
  }
  if (!selectedPool || !selectedPool.id || !selectedPool.programId) {
    throw new Error('No pool selected or critical pool IDs (id, programId) are missing.');
  }
  if (buyAmountSOLFloat <= 0) {
    throw new Error('Buy amount must be greater than zero.');
  }
  if (slippagePercent < 0 || slippagePercent > 50) { // Basic sanity check for slippage
    throw new Error('Slippage must be between 0 and 50 percent.');
  }


  const payer = toPublicKey(wallet.publicKey);
  const amountInLamports = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));

  console.log(`[mainnetBuySwap] Payer: ${payer.toBase58()}`);
  console.log(`[mainnetBuySwap] Amount In (lamports): ${amountInLamports.toString()}`);

  const inputMint = NATIVE_MINT; // Buying with SOL (which will be wrapped to WSOL)
  let outputMint: PublicKey;
  let poolInputVault: PublicKey;  // This will be the pool's WSOL vault
  let poolOutputVault: PublicKey; // This will be the pool's vault for the token we are buying
  let actualPoolAuthority = toPublicKey(selectedPool.authority); // Authority from the pool details

  // Determine correct mints and vaults based on selectedPool structure
  // poolFinder.ts usually pairs with NATIVE_MINT. We need to confirm which field (mintA or mintB) is NATIVE_MINT.
  if (selectedPool.mintA.toString() === NATIVE_MINT.toBase58()) {
    outputMint = toPublicKey(selectedPool.mintB);
    poolInputVault = toPublicKey(selectedPool.vaultA);
    poolOutputVault = toPublicKey(selectedPool.vaultB);
    console.log('[mainnetBuySwap] Pool Mint A is WSOL. Output Mint (Token):', outputMint.toBase58());
  } else if (selectedPool.mintB.toString() === NATIVE_MINT.toBase58()) {
    outputMint = toPublicKey(selectedPool.mintA);
    poolInputVault = toPublicKey(selectedPool.vaultB); // VaultB is WSOL
    poolOutputVault = toPublicKey(selectedPool.vaultA); // VaultA is the other token
    console.log('[mainnetBuySwap] Pool Mint B is WSOL. Output Mint (Token):', outputMint.toBase58());
  } else {
    console.error('[mainnetBuySwap] Critical Error: Selected pool does not seem to involve SOL/WSOL.', selectedPool);
    throw new Error('Selected pool does not involve SOL/WSOL, cannot proceed with this buy utility.');
  }
  console.log(`[mainnetBuySwap] Pool Input Vault (WSOL): ${poolInputVault.toBase58()}, Pool Output Vault (Token): ${poolOutputVault.toBase58()}`);


  // 1. Ensure user has ATAs
  console.log('[mainnetBuySwap] Ensuring Input ATA (WSOL)...');
  const userWsolAta = await getOrCreateATA({
    connection,
    walletPublicKey: payer,
    mintPublicKey: inputMint, // NATIVE_MINT for WSOL
    payer,
    signTransaction: wallet.signTransaction,
  });
  console.log('[mainnetBuySwap] User WSOL ATA:', userWsolAta.toBase58());

  console.log('[mainnetBuySwap] Ensuring Output ATA (Token)...');
  const userTokenAta = await getOrCreateATA({
    connection,
    walletPublicKey: payer,
    mintPublicKey: outputMint,
    payer,
    signTransaction: wallet.signTransaction,
  });
  console.log('[mainnetBuySwap] User Token ATA:', userTokenAta.toBase58());

  // 2. CRITICAL TODO: Calculate minAmountOut based on current price, amountIn, and slippage
  // This requires fetching live pool reserves and calculating expected output.
  // Using a hardcoded '1' is ONLY for instruction structure testing and WILL cause issues in real swaps.
  // Example placeholder:
  const minAmountOut = new BN(1);
  console.warn(`[mainnetBuySwap] WARNING: Using placeholder minAmountOut = ${minAmountOut.toString()}. This MUST be replaced with a dynamic calculation based on current pool price and slippage for a real swap to function correctly and safely.`);
  // For a real implementation, you would:
  // 1. Fetch pool reserves for `poolInputVault` and `poolOutputVault`.
  // 2. Calculate expected output: `const expectedOutput = Liquidity.computeAmountOut({ poolKeys: ..., amountIn, ... }).amountOut;`
  // 3. Apply slippage: `const calculatedMinAmountOut = expectedOutput.mul(new BN(10000 - (slippagePercent * 100))).div(new BN(10000));`
  // And then use `calculatedMinAmountOut`.


  let swapInstruction: TransactionInstruction;

  const poolProgramId = toPublicKey(selectedPool.programId);

  // Assuming this util is for Standard AMM V4 based on your focus
  if (poolProgramId.equals(new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')) || selectedPool.type === "Standard") {
    console.log('[mainnetBuySwap] Preparing Standard AMM V4 Swap Instruction...');

    const params: BuildStandardAmmSwapInstructionParams = {
        programId: poolProgramId,
        payer: payer,
        poolId: toPublicKey(selectedPool.id),
        poolAuthority: actualPoolAuthority,
        // Use SystemProgram.programId if configAddress is not available or not applicable for this pool type, as per your test scripts
        poolConfigId: selectedPool.configAddress && selectedPool.configAddress !== "" ? toPublicKey(selectedPool.configAddress) : SYSTEM_PROGRAM_ID,
        inputTokenAccount: userWsolAta,
        outputTokenAccount: userTokenAta,
        inputVault: poolInputVault,
        outputVault: poolOutputVault,
        inputTokenProgramId: SPL_TOKEN_PROGRAM_ID,
        outputTokenProgramId: SPL_TOKEN_PROGRAM_ID,
        inputMint: inputMint, // WSOL
        outputMint: outputMint, // Token being bought
        // Use SystemProgram.programId if observationAccount is not available or not applicable
        poolObservationId: selectedPool.observationAccount && selectedPool.observationAccount !== "" ? toPublicKey(selectedPool.observationAccount) : SYSTEM_PROGRAM_ID,
        amountIn: amountInLamports,
        minAmountOut: minAmountOut, // Use the calculated value here
    };
    swapInstruction = await buildStandardAmmSwapInstruction(params);
  } else {
    console.error(`[mainnetBuySwap] Selected pool (ID: ${selectedPool.id}, Program: ${selectedPool.programId.toString()}) is not a recognized Standard AMM V4 pool for this utility.`);
    throw new Error(`Unsupported pool type for this buy utility: ${selectedPool.type} / ${selectedPool.programId.toString()}`);
  }

  // 3. Build the transaction
  const transaction = new Transaction();
  console.log('[mainnetBuySwap] Created new Transaction.');

  // Add compute budget instructions (recommended)
  transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }) // Adjust as needed
  );
  transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25000 }) // Adjust priority fee as needed
  );
  console.log('[mainnetBuySwap] Added Compute Budget instructions.');

  // Instructions to wrap SOL to WSOL
  // This needs to happen if the user is paying with SOL and the pool uses WSOL
  if (amountInLamports.gtn(0)) { // only if there's an amount to wrap
      console.log(`[mainnetBuySwap] Adding instructions to wrap ${amountInLamports.toString()} lamports to WSOL ATA: ${userWsolAta.toBase58()}`);
      transaction.add(
          SystemProgram.transfer({
              fromPubkey: payer,
              toPubkey: userWsolAta, // Transfer SOL to the WSOL ATA
              lamports: amountInLamports.toNumber(), // amountInLamports is already BN, SystemProgram.transfer takes number for lamports
          }),
          createSyncNativeInstruction(userWsolAta, SPL_TOKEN_PROGRAM_ID) // Sync the WSOL ATA balance
      );
  }

  // Add the main swap instruction
  transaction.add(swapInstruction);
  console.log('[mainnetBuySwap] Added swap instruction to transaction.');

  // Instruction to close the WSOL ATA and reclaim SOL
  // This should come AFTER the swap instruction that uses the WSOL.
  console.log(`[mainnetBuySwap] Adding instruction to close WSOL ATA: ${userWsolAta.toBase58()}`);
  transaction.add(
      createCloseAccountInstruction(
          userWsolAta,    // Account to close
          payer,          // Destination for remaining SOL
          payer,          // Authority to close account
          [],             // Multi-signers for wrapped SOL; typically empty for user's ATA
          SPL_TOKEN_PROGRAM_ID
      )
  );

  transaction.feePayer = payer;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight; // Optional but good for new Transaction features

  console.log('[mainnetBuySwap] Transaction fully assembled and ready for signing.');
  console.log('[mainnetBuySwap] Fee Payer:', transaction.feePayer.toBase58());
  console.log('[mainnetBuySwap] Recent Blockhash:', transaction.recentBlockhash);
  console.log('[mainnetBuySwap] Instructions in transaction:', transaction.instructions.length);
  transaction.instructions.forEach((ix, index) => {
    console.log(`  [mainnetBuySwap] Instruction ${index}: ProgramId: ${ix.programId.toBase58()}`);
    ix.keys.forEach((key, ki) => console.log(`    Key ${ki}: ${key.pubkey.toBase58()}, isSigner: ${key.isSigner}, isWritable: ${key.isWritable}`));
    // console.log(`    Data: ${ix.data.toString('hex')}`); // Can be very verbose
  });


  // --- SIGN AND SEND (COMMENTED OUT FOR SAFETY DURING TESTING) ---
  // try {
  //   console.log('[mainnetBuySwap] Requesting signature from wallet...');
  //   const signedTx = await wallet.signTransaction(transaction);
  //   console.log('[mainnetBuySwap] Transaction signed by wallet.');

  //   console.log('[mainnetBuySwap] Sending raw transaction...');
  //   const txSignature = await connection.sendRawTransaction(signedTx.serialize());
  //   console.log('[mainnetBuySwap] Transaction sent. Signature:', txSignature);

  //   console.log('[mainnetBuySwap] Confirming transaction...');
  //   const confirmation = await connection.confirmTransaction({
  //       signature: txSignature,
  //       blockhash: blockhash,
  //       lastValidBlockHeight: lastValidBlockHeight
  //   }, 'confirmed');

  //   if (confirmation.value.err) {
  //       console.error('[mainnetBuySwap] Transaction confirmation error:', confirmation.value.err);
  //       throw new Error(`Transaction failed confirmation: ${JSON.stringify(confirmation.value.err)}`);
  //   }
  //   console.log('[mainnetBuySwap] ✅ Transaction confirmed successfully! Signature:', txSignature);
  //   return txSignature;

  // } catch (signOrSendError) {
  //    console.error('[mainnetBuySwap] Error during signing or sending:', signOrSendError);
  //    throw signOrSendError;
  // }
  // --- END SIGN AND SEND ---

  console.log('[mainnetBuySwap] --- TRANSACTION BUILT. SIGN/SEND IS COMMENTED OUT. ---');
  return `DUMMY_TX_BUILT_FOR_${selectedPool.id.substring(0,6)}`;
}