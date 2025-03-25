/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { SwapInfo } from '@jup-ag/deltafi-sdk';
import { PriceData } from '@pythnetwork/client';
import { BigNumber } from 'bignumber.js';
export declare class DeltaFiAmm implements Amm {
    private address;
    id: string;
    label: "DeltaFi";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    swapInfo: SwapInfo;
    feePct: number;
    prices: {
        marketPrice: BigNumber;
        lowPrice: BigNumber;
        highPrice: BigNumber;
    } | undefined;
    pythAddresses: PublicKey[];
    constructor(address: PublicKey, acountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    getPriceData(accountInfoMap: AccountInfoMap, pythPubkey: PublicKey): PriceData;
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
