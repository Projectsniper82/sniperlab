import { TransactionEnvelope } from "@saberhq/solana-contrib";
import type { TokenAmount } from "@saberhq/token-utils";
import type { InitializeSwapInstruction } from "../index";
import type { InitializeNewStableSwapArgs } from "./initialize";
export declare type InitializeNewStableSwapSimpleArgs = Omit<InitializeNewStableSwapArgs, "swapProgramID" | "tokenAMint" | "tokenBMint" | "useAssociatedAccountForInitialLP"> & {
    reservesA: TokenAmount;
    reservesB: TokenAmount;
};
/**
 * Creates a set of instructions to create a new StableSwap instance.
 *
 * After calling this, you must sign this transaction with the accounts:
 * - payer -- Account that holds the SOL to seed the account.
 * - args.config.stableSwapAccount -- This account is used once then its key is no longer relevant
 * - all returned signers
 */
export declare const createInitializeStableSwapInstructionsSimple: ({ provider, adminAccount, ampFactor, fees, reservesA, reservesB, initialLiquidityProvider, swapAccountSigner, poolTokenMintSigner, seedPoolAccounts, }: InitializeNewStableSwapSimpleArgs) => Promise<{
    initializeArgs: InitializeSwapInstruction;
    /**
     * Lamports needed to be rent exempt.
     */
    balanceNeeded: number;
    instructions: {
        /**
         * Create accounts for the LP token
         */
        createLPTokenMint: TransactionEnvelope;
        /**
         * Create LP token account for the initial LP
         */
        createInitialLPTokenAccount: TransactionEnvelope;
        /**
         * Create accounts for swap token A
         */
        createSwapTokenAAccounts: TransactionEnvelope;
        /**
         * Create accounts for swap token B
         */
        createSwapTokenBAccounts: TransactionEnvelope;
        /**
         * Seed the accounts for the pool
         */
        seedPoolAccounts: TransactionEnvelope;
        /**
         * Initialize the swap
         */
        initializeSwap: TransactionEnvelope;
    };
}>;
//# sourceMappingURL=initializeSimple.d.ts.map