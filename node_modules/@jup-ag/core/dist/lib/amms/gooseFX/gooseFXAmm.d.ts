/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { SyncSwap, PairLayout } from '@jup-ag/goosefx-ssl-sdk';
type GooseFXAccounts = {
    pairAddress: PublicKey;
    sslIn: PublicKey;
    sslOut: PublicKey;
    liabilityVaultIn: PublicKey;
    liabilityVaultOut: PublicKey;
    swappedLiabilityVaultIn: PublicKey;
    swappedLiabilityVaultOut: PublicKey;
};
export declare class GooseFXAmm implements Amm {
    private address;
    id: string;
    label: "GooseFX";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    pairLayout: PairLayout;
    quoter: ReturnType<SyncSwap['getSyncQuoter']>;
    gooseFxAccounts: GooseFXAccounts;
    fixedAccounts: PublicKey[];
    oracleAccounts: PublicKey[];
    quoteParams: Parameters<ReturnType<SyncSwap['getSyncQuoter']>['getQuote']>[1] | undefined;
    isQuoteInvalid: boolean;
    constructor(address: PublicKey, acountInfo: AccountInfo<Buffer>);
    updateOracles(): void;
    getAccountsForUpdate(): PublicKey[];
    isSuspended(currentSlot?: bigint): boolean;
    slot: bigint | undefined;
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
export {};
