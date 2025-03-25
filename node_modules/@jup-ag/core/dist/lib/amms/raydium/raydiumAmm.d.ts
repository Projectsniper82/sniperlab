/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { AccountInfoMap, Amm, ExactOutSwapParams, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
type SerumMarketKeys = {
    serumBids: PublicKey;
    serumAsks: PublicKey;
    serumEventQueue: PublicKey;
    serumCoinVaultAccount: PublicKey;
    serumPcVaultAccount: PublicKey;
    serumVaultSigner: PublicKey;
};
type SerumMarketKeysString = Record<keyof SerumMarketKeys, string>;
export declare class RaydiumAmm implements Amm {
    ammId: PublicKey;
    id: string;
    label: "Raydium";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    coinMint: PublicKey;
    pcMint: PublicKey;
    status: number;
    serumProgramId: PublicKey;
    serumMarket: PublicKey;
    ammOpenOrders: PublicKey;
    ammTargetOrders: PublicKey;
    poolCoinTokenAccount: PublicKey;
    poolPcTokenAccount: PublicKey;
    serumMarketKeys: SerumMarketKeys;
    coinReserve: JSBI | undefined;
    pcReserve: JSBI | undefined;
    private feePct;
    private calculator;
    constructor(ammId: PublicKey, ammAccountInfo: AccountInfo<Buffer>, params: SerumMarketKeysString);
    static decodeSerumMarketKeysString(raydiumAmmId: PublicKey, serumProgramId: PublicKey, serumMarket: PublicKey, serumMarketInfo: AccountInfo<Buffer>): SerumMarketKeysString;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    private getQuoteInternal;
    getQuote({ sourceMint, amount, swapMode }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    createExactOutSwapInstruction(swapParams: ExactOutSwapParams): import("@solana/web3.js").TransactionInstruction;
    get reserveTokenMints(): PublicKey[];
    get isTradable(): boolean;
}
export {};
