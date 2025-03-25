/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { CyclosCore } from '@jup-ag/cykura-sdk';
import type { IdlAccounts } from '@coral-xyz/anchor';
export type PoolState = IdlAccounts<CyclosCore>['poolState'];
export declare class CykuraAmm implements Amm {
    private address;
    label: "Cykura";
    id: string;
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private poolState;
    private pool;
    private tickDataProvider;
    private tokens;
    vaults: {
        vault0: PublicKey;
        vault1: PublicKey;
    };
    private feePct;
    private fee;
    constructor(address: PublicKey, accountInfoOrPoolState: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
