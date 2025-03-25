/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { MarketState, QuoteCalculator } from '@jup-ag/dradex-sdk';
import { Order } from '@jup-ag/dradex-idl';
interface Params {
    marketUser: string;
}
export declare class DradexAmm implements Amm {
    private address;
    id: string;
    label: "Dradex";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    state: MarketState;
    orderBookState?: {
        bids: Order[];
        asks: Order[];
    };
    quoteCalculator?: QuoteCalculator;
    marketUser: PublicKey;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>, params: Params);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote(quoteParams: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
export {};
