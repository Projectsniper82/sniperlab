"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapAuthorityKey = exports.findSwapAuthorityKeySync = exports.findSwapAuthorityKey = exports.StableSwap = exports.createSaberWithdrawOneInstruction = exports.createSaberWithdrawInstruction = exports.createSaberDepositInstruction = exports.createSaberSwapInstruction = void 0;
const tslib_1 = require("tslib");
const solana_contrib_1 = require("@saberhq/solana-contrib");
const token_utils_1 = require("@saberhq/token-utils");
const web3_js_1 = require("@solana/web3.js");
const constants_js_1 = require("./constants.js");
const instructions = tslib_1.__importStar(require("./instructions/index.js"));
const index_js_1 = require("./state/index.js");
const layout_js_1 = require("./state/layout.js");
const account_js_1 = require("./util/account.js");
/**
 * Swap token A for token B
 * @param userSource
 * @param poolSource
 * @param poolDestination
 * @param userDestination
 * @param amountIn
 * @param minimumAmountOut
 */
function createSaberSwapInstruction({ config, state }, args) {
    const adminDestination = args.poolDestination.equals(state.tokenA.reserve)
        ? state.tokenA.adminFeeAccount
        : state.tokenB.adminFeeAccount;
    return instructions.swapInstruction({
        config: config,
        ...args,
        adminDestination,
    });
}
exports.createSaberSwapInstruction = createSaberSwapInstruction;
/**
 * Deposit tokens into the pool.
 */
function createSaberDepositInstruction({ config, state }, args) {
    return instructions.depositInstruction({
        config: config,
        tokenAccountA: state.tokenA.reserve,
        tokenAccountB: state.tokenB.reserve,
        poolTokenMint: state.poolTokenMint,
        ...args,
    });
}
exports.createSaberDepositInstruction = createSaberDepositInstruction;
/**
 * Withdraw tokens from the pool
 */
function createSaberWithdrawInstruction({ config, state }, args) {
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
exports.createSaberWithdrawInstruction = createSaberWithdrawInstruction;
/**
 * Withdraw tokens from the pool
 */
function createSaberWithdrawOneInstruction({ config, state }, args) {
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
exports.createSaberWithdrawOneInstruction = createSaberWithdrawOneInstruction;
class StableSwap {
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
        return await connection.getMinimumBalanceForRentExemption(layout_js_1.StableSwapLayout.span);
    }
    /**
     * Load an onchain StableSwap program.
     *
     * @param connection A {@link Connection} to use.
     * @param swapAccount The {@link PublicKey} of the swap account to load. You can obtain this pubkey by visiting [app.saber.so](https://app.saber.so/], navigating to the pool you want to load, and getting the "swap account" key.
     * @param programID Address of the onchain StableSwap program.
     */
    static async load(connection, swapAccount, programID = constants_js_1.SWAP_PROGRAM_ID) {
        const data = await (0, account_js_1.loadProgramAccount)(connection, swapAccount, programID);
        const authority = (0, exports.getSwapAuthorityKey)(swapAccount, programID);
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
        const [authority] = await (0, exports.findSwapAuthorityKey)(data.publicKey);
        return StableSwap.fromProgramAccountWithAuthority(data, authority);
    }
    /**
     * Loads the swap object from a program account.
     * @param data
     * @returns
     */
    static fromData(data) {
        const authority = (0, exports.getSwapAuthorityKey)(data.publicKey);
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
            swapProgramID: constants_js_1.SWAP_PROGRAM_ID,
            tokenProgramID: token_utils_1.TOKEN_PROGRAM_ID,
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
    static loadWithData(swapAccount, swapAccountData, authority, programID = constants_js_1.SWAP_PROGRAM_ID) {
        try {
            const state = (0, index_js_1.decodeSwap)(swapAccountData);
            if (!state.isInitialized) {
                throw new Error(`Invalid token swap state`);
            }
            return new StableSwap({
                swapAccount: swapAccount,
                swapProgramID: programID,
                tokenProgramID: token_utils_1.TOKEN_PROGRAM_ID,
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
exports.StableSwap = StableSwap;
/**
 * Finds the swap authority address that is used to sign transactions on behalf of the swap.
 *
 * @param swapAccount
 * @param swapProgramID
 * @returns
 */
const findSwapAuthorityKey = (swapAccount, swapProgramID = constants_js_1.SWAP_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddress([swapAccount.toBuffer()], swapProgramID);
exports.findSwapAuthorityKey = findSwapAuthorityKey;
/**
 * Finds the swap authority address that is used to sign transactions on behalf of the swap.
 *
 * @param swapAccount
 * @param swapProgramID
 * @returns
 */
const findSwapAuthorityKeySync = (swapAccount, swapProgramID = constants_js_1.SWAP_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddressSync([swapAccount.toBuffer()], swapProgramID);
exports.findSwapAuthorityKeySync = findSwapAuthorityKeySync;
/**
 * Finds the swap authority address that is used to sign transactions on behalf of the swap.
 *
 * @param swapAccount
 * @param swapProgramID
 * @returns
 */
const getSwapAuthorityKey = (swapAccount, swapProgramID = constants_js_1.SWAP_PROGRAM_ID) => (0, solana_contrib_1.getProgramAddress)([swapAccount.toBuffer()], swapProgramID);
exports.getSwapAuthorityKey = getSwapAuthorityKey;
//# sourceMappingURL=stable-swap.js.map