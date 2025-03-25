/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { AccountInfoMap, Amm, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { IdlAccounts } from '@coral-xyz/anchor';
import { AddDecimals } from './add_decimals';
export type WrappedToken = IdlAccounts<AddDecimals>['wrappedToken'];
export declare class SaberAddDecimalsAmm implements Amm {
    private address;
    accountInfo: AccountInfo<Buffer>;
    id: string;
    label: "Saber (Decimals)";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private wrappedToken;
    private multiplierJsbi;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(_accountInfoMap: AccountInfoMap): void;
    toWrappedAmount(amount: JSBI): JSBI;
    toUnderlyingAmount(amount: JSBI): JSBI;
    getAmounts(amount: JSBI, deposit: boolean): [JSBI, JSBI];
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
    get wrapperMint(): PublicKey;
}
