/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { Fraction, TokenSwapConstantProduct, TokenSwapStable } from '@jup-ag/math';
import JSBI from 'jsbi';
import { u64 } from '@solana/spl-token';
export declare class SplTokenSwapAmm implements Amm {
    label: Amm['label'];
    id: string;
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private tokenSwapState;
    private curveType;
    private feePct;
    tokenReserveAmounts: JSBI[] | undefined;
    calculator: TokenSwapConstantProduct | TokenSwapStable;
    constructor(address: PublicKey, swapStateAccountInfo: AccountInfo<Buffer>, label: Amm['label']);
    static getFeeFraction(numerator: u64, denominator: u64): Fraction;
    static getFeeDecimal(numerator: u64, denominator: u64): Decimal;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
