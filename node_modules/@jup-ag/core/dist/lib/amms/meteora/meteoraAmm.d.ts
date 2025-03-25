/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { PoolState, VaultState } from '@mercurial-finance/dynamic-amm-sdk';
import { u64 } from '@solana/spl-token';
interface MeteoraParams {
    vaultLpMint: {
        a: string;
        b: string;
    };
    vaultToken: {
        a: string;
        b: string;
    };
}
export declare class MeteoraAmm implements Amm {
    private address;
    id: string;
    label: "Meteora";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private poolState;
    private data;
    private depegAccount?;
    private depegAccounts;
    private vaultLpMint;
    private vaultToken;
    private feePct;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>, params: MeteoraParams);
    static accountInfoToMeteoraSwapLayout: (accountInfo: AccountInfo<Buffer>) => PoolState;
    static accountInfoToVaultLayout: (accountInfo: AccountInfo<Buffer>) => VaultState;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get currentTime(): number;
    get poolVaults(): VaultState[];
    get poolVaultLPShares(): u64[];
    get poolVaultLPTotalSupplies(): u64[];
    get reserveTokenMints(): PublicKey[];
}
export {};
