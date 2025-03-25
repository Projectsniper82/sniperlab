/// <reference types="node" />
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import type { ClmmpoolData, TickArrayMapData } from '@jup-ag/crema-sdk-v2';
interface CremaParams {
    decimalA: number;
    decimalB: number;
}
export declare class CremaAmm implements Amm {
    private address;
    id: string;
    label: "Crema";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    clmmpoolData: ClmmpoolData;
    reserveTokenDecimals: number[];
    private tickArrayMapPubkey;
    private feeRate;
    private tickArrayMap;
    private tickArrayPubkeys;
    private tickArrays;
    private arrayStartIndex;
    private swapTicks;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>, params: CremaParams);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getTickArrayPubkeys(address: PublicKey, tickArrayMap: TickArrayMapData): PublicKey[];
    getQuote(quoteParams: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
export {};
