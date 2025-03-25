import { deserializeAccount, deserializeMint, parseBigintIsh, Token, TokenAmount, } from "@saberhq/token-utils";
import BN from "bn.js";
import { default as invariant } from "tiny-invariant";
import { SWAP_PROGRAM_ID } from "../constants.js";
import { StableSwap } from "../stable-swap.js";
import { loadProgramAccount } from "../util/account.js";
/**
 * Calculates the amp factor of a swap.
 * @param state
 * @param now
 * @returns
 */
export const calculateAmpFactor = (state, now = Date.now() / 1000) => {
    const { initialAmpFactor, targetAmpFactor, startRampTimestamp, stopRampTimestamp, } = state;
    // The most common case is that there is no ramp in progress.
    if (now >= stopRampTimestamp) {
        return parseBigintIsh(targetAmpFactor);
    }
    // If the ramp is about to start, use the initial amp.
    if (now <= startRampTimestamp) {
        return parseBigintIsh(initialAmpFactor);
    }
    invariant(stopRampTimestamp >= startRampTimestamp, "stop must be after start");
    // Calculate how far we are along the ramp curve.
    const percent = now >= stopRampTimestamp
        ? 1
        : now <= startRampTimestamp
            ? 0
            : (now - startRampTimestamp) / (stopRampTimestamp - startRampTimestamp);
    const diff = Math.floor(parseFloat(targetAmpFactor.sub(initialAmpFactor).toString()) * percent);
    return parseBigintIsh(initialAmpFactor.add(new BN(diff)));
};
/**
 * Creates an IExchangeInfo from parameters.
 * @returns
 */
export const makeExchangeInfo = ({ exchange, swap, accounts, }) => {
    const swapAmountA = deserializeAccount(accounts.reserveA).amount;
    const swapAmountB = deserializeAccount(accounts.reserveB).amount;
    const poolMintSupply = accounts.poolMint
        ? deserializeMint(accounts.poolMint).supply
        : undefined;
    const ampFactor = calculateAmpFactor(swap.state);
    return {
        ampFactor,
        fees: swap.state.fees,
        lpTotalSupply: new TokenAmount(exchange.lpToken, poolMintSupply !== null && poolMintSupply !== void 0 ? poolMintSupply : 0),
        reserves: [
            {
                reserveAccount: swap.state.tokenA.reserve,
                adminFeeAccount: swap.state.tokenA.adminFeeAccount,
                amount: new TokenAmount(exchange.tokens[0], swapAmountA),
            },
            {
                reserveAccount: swap.state.tokenB.reserve,
                adminFeeAccount: swap.state.tokenB.adminFeeAccount,
                amount: new TokenAmount(exchange.tokens[1], swapAmountB),
            },
        ],
    };
};
/**
 * Loads exchange info.
 * @param exchange
 * @param swap
 * @returns
 */
export const loadExchangeInfo = async (connection, exchange, swap) => {
    if (!exchange.programID.equals(swap.config.swapProgramID)) {
        throw new Error("Swap program id mismatch");
    }
    const reserveA = await loadProgramAccount(connection, swap.state.tokenA.reserve, swap.config.tokenProgramID);
    const reserveB = await loadProgramAccount(connection, swap.state.tokenB.reserve, swap.config.tokenProgramID);
    const poolMint = await loadProgramAccount(connection, swap.state.poolTokenMint, swap.config.tokenProgramID);
    return makeExchangeInfo({
        swap,
        exchange,
        accounts: {
            reserveA,
            reserveB,
            poolMint,
        },
    });
};
/**
 * Creates an IExchange from an ExchangeBasic.
 * @param tokenMap
 * @param param1
 * @returns
 */
export const makeExchange = ({ swapAccount, lpToken, tokenA, tokenB, }) => {
    const exchange = {
        swapAccount,
        programID: SWAP_PROGRAM_ID,
        lpToken: new Token({
            symbol: "SLP",
            name: `${tokenA.symbol}-${tokenB.symbol} Saber LP`,
            logoURI: "https://app.saber.so/tokens/slp.png",
            decimals: tokenA.decimals,
            address: lpToken.toString(),
            chainId: tokenA.chainId,
            tags: ["saber-stableswap-lp"],
        }),
        tokens: [new Token(tokenA), new Token(tokenB)],
    };
    return exchange;
};
/**
 * Get exchange info from just the swap account.
 * @param connection
 * @param swapAccount
 * @param tokenA
 * @param tokenB
 * @returns
 */
export const loadExchangeInfoFromSwapAccount = async (connection, swapAccount, tokenA = undefined, tokenB = undefined) => {
    var _a, _b;
    const stableSwap = await StableSwap.load(connection, swapAccount);
    const theTokenA = tokenA !== null && tokenA !== void 0 ? tokenA : (_a = (await Token.load(connection, stableSwap.state.tokenA.mint))) === null || _a === void 0 ? void 0 : _a.info;
    if (!theTokenA) {
        throw new Error(`Token ${stableSwap.state.tokenA.mint.toString()} not found`);
    }
    const theTokenB = tokenB !== null && tokenB !== void 0 ? tokenB : (_b = (await Token.load(connection, stableSwap.state.tokenB.mint))) === null || _b === void 0 ? void 0 : _b.info;
    if (!theTokenB) {
        throw new Error(`Token ${stableSwap.state.tokenB.mint.toString()} not found`);
    }
    const exchange = makeExchange({
        swapAccount,
        lpToken: stableSwap.state.poolTokenMint,
        tokenA: theTokenA,
        tokenB: theTokenB,
    });
    if (exchange === null) {
        return null;
    }
    return await loadExchangeInfo(connection, exchange, stableSwap);
};
//# sourceMappingURL=exchange.js.map