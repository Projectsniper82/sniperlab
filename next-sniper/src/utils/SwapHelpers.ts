// src/utils/SwapHelpers.ts
import {
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    makeSwapCpmmBaseInInstruction,
    // TOKEN_PROGRAM_ID and NATIVE_MINT are not exported directly here
} from '@raydium-io/raydium-sdk-v2';
import {
    TOKEN_PROGRAM_ID, // Correct import from @solana/spl-token
    NATIVE_MINT       // Correct import from @solana/spl-token
} from '@solana/spl-token';
import BN from 'bn.js';

// Helper to ensure conversion to PublicKey, especially from strings
const toPublicKey = (key: string | PublicKey): PublicKey => {
  if (typeof key === 'string') {
    return new PublicKey(key);
  }
  return key;
};

export interface BuildStandardAmmSwapInstructionParams {
    programId: PublicKey;
    payer: PublicKey;
    poolId: PublicKey;
    poolAuthority: PublicKey;
    poolConfigId: PublicKey;
    inputTokenAccount: PublicKey;
    outputTokenAccount: PublicKey;
    inputVault: PublicKey;
    outputVault: PublicKey;
    inputTokenProgramId: PublicKey;
    outputTokenProgramId: PublicKey;
    inputMint: PublicKey;
    outputMint: PublicKey;
    poolObservationId: PublicKey;
    amountIn: BN;
    minAmountOut: BN;
}

/**
 * Builds a swap instruction for a Raydium Standard AMM V4 Pool.
 * This function is based on the structure of `testSwapRaydium.ts` and uses
 * `makeSwapCpmmBaseInInstruction`.
 * All parameters must be provided dynamically by the calling function.
 */
export async function buildStandardAmmSwapInstruction({
    programId,
    payer,
    poolId,
    poolAuthority,
    poolConfigId,
    inputTokenAccount,
    outputTokenAccount,
    inputVault,
    outputVault,
    inputTokenProgramId,
    outputTokenProgramId,
    inputMint,
    outputMint,
    poolObservationId,
    amountIn,
    minAmountOut,
}: BuildStandardAmmSwapInstructionParams): Promise<TransactionInstruction> {

    console.log('--------------------------------------------------------------------');
    console.log('[SwapHelpers.buildStandardAmmSwapInstruction] Initiating instruction build...');
    console.log('[SwapHelpers.buildStandardAmmSwapInstruction] Received Parameters:');
    console.log(`  Program ID          : ${toPublicKey(programId).toBase58()}`);
    console.log(`  Payer               : ${toPublicKey(payer).toBase58()}`);
    console.log(`  Pool ID             : ${toPublicKey(poolId).toBase58()}`);
    console.log(`  Pool Authority      : ${toPublicKey(poolAuthority).toBase58()}`);
    console.log(`  Pool Config ID      : ${toPublicKey(poolConfigId).toBase58()} (Note: May be SystemProgram.programId for some V4 pools)`);
    console.log(`  User Input ATA      : ${toPublicKey(inputTokenAccount).toBase58()}`);
    console.log(`  User Output ATA     : ${toPublicKey(outputTokenAccount).toBase58()}`);
    console.log(`  Pool Input Vault    : ${toPublicKey(inputVault).toBase58()}`);
    console.log(`  Pool Output Vault   : ${toPublicKey(outputVault).toBase58()}`);
    console.log(`  Input Token Program : ${toPublicKey(inputTokenProgramId).toBase58()}`);
    console.log(`  Output Token Program: ${toPublicKey(outputTokenProgramId).toBase58()}`);
    console.log(`  Input Mint          : ${toPublicKey(inputMint).toBase58()}`);
    console.log(`  Output Mint         : ${toPublicKey(outputMint).toBase58()}`);
    console.log(`  Pool Observation ID : ${toPublicKey(poolObservationId).toBase58()} (Note: May be SystemProgram.programId if not used by pool)`);
    console.log(`  Amount In (raw)     : ${amountIn.toString()}`);
    console.log(`  Min Amount Out (raw): ${minAmountOut.toString()}`);
    console.log('--------------------------------------------------------------------');

    try {
        const instruction = await makeSwapCpmmBaseInInstruction(
            toPublicKey(programId),
            toPublicKey(payer),
            toPublicKey(poolAuthority),
            toPublicKey(poolConfigId),
            toPublicKey(poolId),
            toPublicKey(inputTokenAccount),
            toPublicKey(outputTokenAccount),
            toPublicKey(inputVault),
            toPublicKey(outputVault),
            toPublicKey(inputTokenProgramId),
            toPublicKey(outputTokenProgramId),
            toPublicKey(inputMint),
            toPublicKey(outputMint),
            toPublicKey(poolObservationId),
            amountIn,
            minAmountOut
        );

        console.log('[SwapHelpers.buildStandardAmmSwapInstruction] Successfully built instruction.');
        console.log('--------------------------------------------------------------------');
        return instruction;
    } catch (error) {
        console.error('[SwapHelpers.buildStandardAmmSwapInstruction] CRITICAL ERROR building swap instruction:', error);
        console.log('--------------------------------------------------------------------');
        throw error;
    }
}

// Add other swap helper functions (buildCpmmSwapInstruction, buildClmmSwapInstruction) here later.