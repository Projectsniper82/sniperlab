/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts, ExactOutSwapParams } from '../../amm';
import { WhirlpoolData } from '@jup-ag/whirlpools-sdk';
export declare class WhirlpoolAmm implements Amm {
    private address;
    id: string;
    label: "Orca (Whirlpools)";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    whirlpoolData: WhirlpoolData;
    private tickArrays;
    private tickPks;
    private oracle;
    private feePct;
    constructor(address: PublicKey, whirlpoolAccountInfo: AccountInfo<Buffer>);
    getTickArrayPks(): {
        aToB: PublicKey[];
        bToA: PublicKey[];
    };
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount, swapMode }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    createExactOutSwapInstruction(swapParams: ExactOutSwapParams): import("@solana/web3.js").TransactionInstruction;
    get reserveTokenMints(): PublicKey[];
}
