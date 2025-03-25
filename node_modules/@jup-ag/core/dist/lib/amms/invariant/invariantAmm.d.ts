/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { PoolStructure } from '@jup-ag/invariant';
export declare class InvariantAmm implements Amm {
    private address;
    id: string;
    label: "Invariant";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    poolStructure: PoolStructure;
    private tickmap;
    private tickPkToTickIndexHash;
    private ticks;
    private feePct;
    constructor(address: PublicKey, invariantAccountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount, swapMode }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
