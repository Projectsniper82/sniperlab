/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { SenchaPoolState } from './swapLayout';
import JSBI from 'jsbi';
export declare class SenchaAmm implements Amm {
    id: string;
    label: "Sencha";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    poolState: SenchaPoolState;
    private calculator;
    tokenReserveAmounts: JSBI[] | undefined;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    get isPaused(): boolean;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
