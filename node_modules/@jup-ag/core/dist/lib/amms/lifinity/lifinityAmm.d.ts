/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
export declare class LifinityAmm implements Amm {
    private ammAccountInfo;
    id: string;
    label: "Lifinity";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private swapState;
    private poolInfo;
    private ammData;
    private slot;
    constructor(address: PublicKey, ammAccountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
    get isTradeFrozen(): boolean;
}
