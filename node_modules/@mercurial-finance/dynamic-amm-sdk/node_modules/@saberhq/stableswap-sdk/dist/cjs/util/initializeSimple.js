"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitializeStableSwapInstructionsSimple = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const token_utils_1 = require("@saberhq/token-utils");
const web3_js_1 = require("@solana/web3.js");
const index_1 = require("../index");
const initialize_1 = require("./initialize");
const initializeSwapTokenInfoSync = ({ provider, mint, authority, admin, rentExemptTokenAccountBalance, }) => {
    // Create Swap Token Account
    const { key: tokenAccount, tx: createSwapTokenAccountInstructions } = (0, token_utils_1.buildCreateTokenAccountTX)({
        provider,
        mint,
        owner: authority,
        payer: provider.wallet.publicKey,
        rentExemptAccountBalance: rentExemptTokenAccountBalance,
    });
    // Create Admin Fee Account
    const { key: adminFeeAccount, tx: createAdminFeeAccountInstructions } = (0, token_utils_1.buildCreateTokenAccountTX)({
        provider,
        mint,
        owner: admin,
        payer: provider.wallet.publicKey,
        rentExemptAccountBalance: rentExemptTokenAccountBalance,
    });
    return {
        info: {
            mint,
            reserve: tokenAccount,
            adminFeeAccount: adminFeeAccount,
        },
        instructions: createSwapTokenAccountInstructions.combine(createAdminFeeAccountInstructions),
    };
};
/**
 * Creates a set of instructions to create a new StableSwap instance.
 *
 * After calling this, you must sign this transaction with the accounts:
 * - payer -- Account that holds the SOL to seed the account.
 * - args.config.stableSwapAccount -- This account is used once then its key is no longer relevant
 * - all returned signers
 */
const createInitializeStableSwapInstructionsSimple = async ({ provider, adminAccount, ampFactor, fees, reservesA, reservesB, initialLiquidityProvider = adminAccount, swapAccountSigner = web3_js_1.Keypair.generate(), poolTokenMintSigner = web3_js_1.Keypair.generate(), seedPoolAccounts, }) => {
    const rentExemptTokenAccountBalance = await token_utils_1.SPLToken.getMinBalanceRentForExemptAccount(provider.connection);
    const rentExemptMintBalance = await token_utils_1.SPLToken.getMinBalanceRentForExemptMint(provider.connection);
    // Create swap account if not specified
    const swapAccount = swapAccountSigner.publicKey;
    // Create authority and nonce
    const [authority, nonce] = (0, index_1.findSwapAuthorityKeySync)(swapAccount);
    // Create LP token mint
    const { decimals } = reservesA.token;
    if (reservesA.token.decimals !== reservesB.token.decimals) {
        throw new Error("decimals mismatch");
    }
    const createLPTokenMint = (0, token_utils_1.createInitMintTX)({
        provider,
        mintKP: poolTokenMintSigner,
        mintAuthority: authority,
        decimals,
        rentExemptMintBalance,
    });
    const poolTokenMint = poolTokenMintSigner.publicKey;
    // Create initial LP token account
    const initialLPAccount = (0, token_utils_1.getATAAddressSync)({
        mint: poolTokenMint,
        owner: initialLiquidityProvider,
    });
    const createInitialLPTokenAccount = new solana_contrib_1.TransactionEnvelope(provider, [
        (0, token_utils_1.createATAInstruction)({
            address: (0, token_utils_1.getATAAddressSync)({
                mint: poolTokenMint,
                owner: initialLiquidityProvider,
            }),
            mint: poolTokenMint,
            owner: initialLiquidityProvider,
            payer: provider.wallet.publicKey,
        }),
    ]);
    // Create Swap Token A account
    const { info: tokenA, instructions: createSwapTokenAAccounts } = initializeSwapTokenInfoSync({
        provider,
        mint: reservesA.token.mintAccount,
        authority,
        admin: adminAccount,
        rentExemptTokenAccountBalance,
    });
    // Create Swap Token B account
    const { info: tokenB, instructions: createSwapTokenBAccounts } = initializeSwapTokenInfoSync({
        provider,
        mint: reservesB.token.mintAccount,
        authority,
        admin: adminAccount,
        rentExemptTokenAccountBalance,
    });
    // Seed the swap's Token A and token B accounts with tokens
    // On testnet, this is usually a mint.
    // On mainnet, this is usually a token transfer.
    const seedPoolAccountsResult = seedPoolAccounts({
        tokenAAccount: tokenA.reserve,
        tokenBAccount: tokenB.reserve,
    });
    const seedPoolAccountsTX = new solana_contrib_1.TransactionEnvelope(provider, [...seedPoolAccountsResult.instructions], [...seedPoolAccountsResult.signers]);
    const initializeSwapInstruction = {
        config: {
            swapAccount: swapAccount,
            authority,
            swapProgramID: index_1.SWAP_PROGRAM_ID,
            tokenProgramID: token_utils_1.TOKEN_PROGRAM_ID,
        },
        adminAccount,
        tokenA,
        tokenB,
        poolTokenMint,
        destinationPoolTokenAccount: initialLPAccount,
        nonce,
        ampFactor,
        fees,
    };
    const { balanceNeeded: swapBalanceNeeded, instructions: initializeStableSwapInstructions, } = await (0, initialize_1.createInitializeStableSwapInstructionsRaw)({
        provider,
        initializeSwapInstruction,
    });
    const initializeSwap = new solana_contrib_1.TransactionEnvelope(provider, [...initializeStableSwapInstructions], [swapAccountSigner]);
    const instructions = {
        createLPTokenMint,
        createInitialLPTokenAccount,
        createSwapTokenAAccounts,
        createSwapTokenBAccounts,
        seedPoolAccounts: seedPoolAccountsTX,
        initializeSwap,
    };
    return {
        initializeArgs: initializeSwapInstruction,
        balanceNeeded: rentExemptMintBalance +
            swapBalanceNeeded +
            rentExemptTokenAccountBalance * 2,
        instructions,
    };
};
exports.createInitializeStableSwapInstructionsSimple = createInitializeStableSwapInstructionsSimple;
//# sourceMappingURL=initializeSimple.js.map