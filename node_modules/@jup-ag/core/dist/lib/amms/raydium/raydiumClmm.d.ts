/// <reference types="node" />
import JSBI from 'jsbi';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { PoolState } from '@jup-ag/raydium-clmm-sdk';
import { AccountInfoMap, Amm, QuoteParams, SwapParams, ExactOutSwapParams } from '../../amm';
export declare class RaydiumClmm implements Amm {
    private address;
    label: "Raydium CLMM";
    id: string;
    reserveTokenMints: PublicKey[];
    hasDynamicAccounts: boolean;
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    private programId;
    poolState: PoolState;
    private coder;
    private tickArrayPks;
    private tickArrayCache;
    private ammV3PoolInfo;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote(quoteParams: QuoteParams): {
        notEnoughLiquidity: boolean;
        inAmount: JSBI;
        outAmount: JSBI;
        feeAmount: JSBI;
        feeMint: string;
        feePct: number;
        priceImpactPct: number;
    };
    getSwapLegAndAccounts(swapParams: SwapParams): import("../../amm").SwapLegAndAccounts;
    createExactOutSwapInstruction(swapParams: ExactOutSwapParams): import("@solana/web3.js").TransactionInstruction;
}
