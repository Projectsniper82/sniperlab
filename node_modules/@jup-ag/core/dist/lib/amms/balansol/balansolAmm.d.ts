/// <reference types="node" />
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { PublicKey, AccountInfo } from '@solana/web3.js';
import { PoolData } from './type';
export declare class BalansolAmm implements Amm {
    private address;
    label: "Balansol";
    id: string;
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    poolData: PoolData;
    static getIDL: () => import("./type").BalancerAmm;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
