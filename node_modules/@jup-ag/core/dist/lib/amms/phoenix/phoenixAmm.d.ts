/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { Ladder } from '@jup-ag/phoenix-sdk';
import { AccountInfoMap, Amm, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import JSBI from 'jsbi';
export declare class PhoenixAmm implements Amm {
    private address;
    id: string;
    label: "Phoenix";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private marketData;
    ladder?: Ladder;
    private outAmountWithoutFeesMultiplier;
    private baseLotsPerBaseUnit;
    private baseLotSize;
    private quoteLotSize;
    private tickSizeInQuoteLotsPerBaseUnitPerTick;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    private JSBImin;
    private computeQuote;
    computAmountAfterFees(outAmount: JSBI): JSBI;
    getQuote({ sourceMint, amount }: QuoteParams): {
        notEnoughLiquidity: boolean;
        inAmount: JSBI;
        outAmount: JSBI;
        feeAmount: JSBI;
        feeMint: string;
        feePct: number;
        priceImpactPct: number;
    };
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
