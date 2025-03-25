/// <reference types="node" />
import { Stable } from '@jup-ag/math';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { MercurialSwapLayoutState } from './swapLayout';
interface MercurialParams {
    tokenMints: string[];
}
export declare class MercurialAmm implements Amm {
    private address;
    private params;
    id: string;
    label: "Mercurial";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    swapLayout: MercurialSwapLayoutState;
    private tokenMints;
    tokenReserveAmounts: JSBI[] | undefined;
    private calculator;
    static decodeSwapLayout: (address: PublicKey, accountInfo: AccountInfo<Buffer>) => MercurialSwapLayoutState;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>, params: MercurialParams);
    getAccountsForUpdate(): PublicKey[];
    static calculatorFromSwapState(swapState: MercurialSwapLayoutState): Stable;
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
export {};
