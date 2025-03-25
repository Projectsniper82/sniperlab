import { getProgramAddress } from "@saberhq/solana-contrib";
import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { SWAP_PROGRAM_ID } from "./constants.js";
import * as instructions from "./instructions/index.js";
import { decodeSwap } from "./state/index.js";
import { StableSwapLayout } from "./state/layout.js";
import { loadProgramAccount } from "./util/account.js";
/**
 * Swap token A for token B
 * @param userSource
 * @param poolSource
 * @param poolDestination
 * @param userDestination
 * @param amountIn
 * @param minimumAmountOut
 */
export function createSaberSwapInstruction({ config, state }, args) {
    const adminDestination = args.poolDestination.equals(state.tokenA.reserve)
        ? state.tokenA.adminFeeAccount
        : state.tokenB.adminFeeAccount;
    return instructions.swapInstruction({
        config: config,
        ...args,
        adminDestination,
    });
}
/**
 * Deposit tokens into the pool.
 */
export function createSaberDepositInstruction({ config, state }, args) {
    return instructions.depositInstruction({
        config: config,
        tokenAccountA: state.tokenA.reserve,
        tokenAccountB: state.tokenB.reserve,
        poolTokenMint: state.poolTokenMint,
        ...args,
    });
}
/**
 * Withdraw tokens from the pool
 */
export function createSaberWithdrawInstruction({ config, state }, args) {
    return instructions.withdrawInstruction({
        config: config,
        poolMint: state.poolTokenMint,
        tokenAccountA: state.tokenA.reserve,
        tokenAccountB: state.tokenB.reserve,
        adminFeeAccountA: state.tokenA.adminFeeAccount,
        adminFeeAccountB: state.tokenB.adminFeeAccount,
        ...args,
    });
}
/**
 * Withdraw tokens from the pool
 */
export function createSaberWithdrawOneInstruction({ config, state }, args) {
    const [quoteTokenAccount, adminDestinationAccount] = args.baseTokenAccount.equals(state.tokenA.reserve)
        ? [state.tokenB.reserve, state.tokenA.adminFeeAccount]
        : [state.tokenA.reserve, state.tokenB.adminFeeAccount];
    return instructions.withdrawOneInstruction({
        config: config,
        poolMint: state.poolTokenMint,
        quoteTokenAccount,
        adminDestinationAccount,
        ...args,
    });
}
export class StableSwap {
    /**
     * Constructor for new StableSwap client object.
     * @param config
     * @param state
     */
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }
    /**
     * Get the minimum balance for the token swap account to be rent exempt
     *
     * @return Number of lamports required
     */
    static async getMinBalanceRentForExemptStableSwap(connection) {
        return await connection.getMinimumBalanceForRentExemption(StableSwapLayout.span);
    }
    /**
     * Load an onchain StableSwap program.
     *
     * @param connection A {@link Connection} to use.
     * @param swapAccount The {@link PublicKey} of the swap account to load. You can obtain this pubkey by visiting [app.saber.so](https://app.saber.so/], navigating to the pool you want to load, and getting the "swap account" key.
     * @param programID Address of the onchain StableSwap program.
     */
    static async load(connection, swapAccount, programID = SWAP_PROGRAM_ID) {
        const data = await loadProgramAccount(connection, swapAccount, programID);
        const authority = getSwapAuthorityKey(swapAccount, programID);
        return StableSwap.loadWithData(swapAccount, data, authority, programID);
    }
    /**
     * Loads an onchain StableSwap program from an {@link IExchange}.
     *
     * @param connection
     * @param exchange
     * @returns
     */
    static async loadFromExchange(connection, exchange) {
        return StableSwap.load(connection, exchange.swapAccount, exchange.programID);
    }
    /**
     * Loads the swap object from a program account.
     * @param data
     * @returns
     */
    static async fromProgramAccount(data) {
        const [authority] = await findSwapAuthorityKey(data.publicKey);
        return StableSwap.fromProgramAccountWithAuthority(data, authority);
    }
    /**
     * Loads the swap object from a program account.
     * @param data
     * @returns
     */
    static fromData(data) {
        const authority = getSwapAuthorityKey(data.publicKey);
        return StableSwap.fromProgramAccountWithAuthority(data, authority);
    }
    /**
     * Loads the swap object from a program account, with the swap authority loaded.
     * @param data
     * @returns
     */
    static fromProgramAccountWithAuthority(data, authority) {
        return new StableSwap({
            swapAccount: data.publicKey,
            swapProgramID: SWAP_PROGRAM_ID,
            tokenProgramID: TOKEN_PROGRAM_ID,
            authority,
        }, data.account);
    }
    /**
     * Loads a StableSwap instance with data.
     *
     * @param programID The program ID.
     * @param swapAccount The address of the swap.
     * @param swapAccountData The data of the swapAccount.
     * @param authority The swap's authority.
     * @returns
     */
    static loadWithData(swapAccount, swapAccountData, authority, programID = SWAP_PROGRAM_ID) {
        try {
            const state = decodeSwap(swapAccountData);
            if (!state.isInitialized) {
                throw new Error(`Invalid token swap state`);
            }
            return new StableSwap({
                swapAccount: swapAccount,
                swapProgramID: programID,
                tokenProgramID: TOKEN_PROGRAM_ID,
                authority,
            }, state);
        }
        catch (e) {
            throw Error(e);
        }
    }
    /**
     * Swap token A for token B
     * @param userSource
     * @param poolSource
     * @param poolDestination
     * @param userDestination
     * @param amountIn
     * @param minimumAmountOut
     */
    swap(args) {
        return createSaberSwapInstruction(this, args);
    }
    /**
     * Deposit tokens into the pool.
     */
    deposit(args) {
        return createSaberDepositInstruction(this, args);
    }
    /**
     * Withdraw tokens from the pool
     */
    withdraw(args) {
        return createSaberWithdrawInstruction(this, args);
    }
    /**
     * Withdraw tokens from the pool
     */
    withdrawOne(args) {
        return createSaberWithdrawOneInstruction(this, args);
    }
}
/**
 * Finds the swap authority address that is used to sign transactions on behalf of the swap.
 *
 * @param swapAccount
 * @param swapProgramID
 * @returns
 */
export const findSwapAuthorityKey = (swapAccount, swapProgramID = SWAP_PROGRAM_ID) => PublicKey.findProgramAddress([swapAccount.toBuffer()], swapProgramID);
/**
 * Finds the swap authority address that is used to sign transactions on behalf of the swap.
 *
 * @param swapAccount
 * @param swapProgramID
 * @returns
 */
export const findSwapAuthorityKeySync = (swapAccount, swapProgramID = SWAP_PROGRAM_ID) => PublicKey.findProgramAddressSync([swapAccount.toBuffer()], swapProgramID);
/**
 * Finds the swap authority address that is used to sign transactions on behalf of the swap.
 *
 * @param swapAccount
 * @param swapProgramID
 * @returns
 */
export const getSwapAuthorityKey = (swapAccount, swapProgramID = SWAP_PROGRAM_ID) => getProgramAddress([swapAccount.toBuffer()], swapProgramID);
//# sourceMappingURL=stable-swap.js.map