/// <reference types="node" />
import { AccountInfo, AccountMeta, Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { AccountInfo as TokenAccountInfo } from '@solana/spl-token';
import JSBI from 'jsbi';
import { SwapLegType } from './jupiterEnums';
import { PlatformFee, QuoteMintToReferrer, TokenMintAddress } from '@jup-ag/common';
export declare enum SwapMode {
    ExactIn = "ExactIn",
    ExactOut = "ExactOut"
}
export interface QuoteParams {
    sourceMint: PublicKey;
    destinationMint: PublicKey;
    amount: JSBI;
    swapMode: SwapMode;
}
export interface Quote {
    notEnoughLiquidity: boolean;
    minInAmount?: JSBI;
    minOutAmount?: JSBI;
    inAmount: JSBI;
    outAmount: JSBI;
    feeAmount: JSBI;
    feeMint: TokenMintAddress;
    feePct: number;
    priceImpactPct: number;
}
export interface SwapParams {
    sourceMint: PublicKey;
    destinationMint: PublicKey;
    userSourceTokenAccount: PublicKey;
    userDestinationTokenAccount: PublicKey;
    userTransferAuthority: PublicKey;
    /**
     * amount is used for instruction and can be null when it is an intermediate swap, only the first swap has an amount
     */
    amount: JSBI;
    swapMode: SwapMode;
    openOrdersAddress?: PublicKey;
    quoteMintToReferrer?: QuoteMintToReferrer;
}
export interface ExactOutSwapParams extends SwapParams {
    inAmount: JSBI;
    slippageBps: number;
    platformFee?: PlatformFee;
    overflowFeeAccount?: PublicKey;
}
export type AccountInfoMap = Map<string, AccountInfo<Buffer> | null>;
export type SwapLegAndAccounts = [SwapLegType, AccountMeta[]];
type AmmLabel = 'Aldrin' | 'Crema' | 'Cropper' | 'Cykura' | 'DeltaFi' | 'GooseFX' | 'Invariant' | 'Lifinity' | 'Lifinity V2' | 'Marinade' | 'Mercurial' | 'Meteora' | 'Raydium' | 'Raydium CLMM' | 'Saber' | 'Serum' | 'Orca' | 'Step' | 'Penguin' | 'Saros' | 'Stepn' | 'Orca (Whirlpools)' | 'Sencha' | 'Saber (Decimals)' | 'Dradex' | 'Balansol' | 'Openbook' | 'Oasis' | 'BonkSwap' | 'Phoenix' | 'Symmetry' | 'Unknown';
export interface Amm {
    label: AmmLabel;
    id: string;
    reserveTokenMints: PublicKey[];
    hasDynamicAccounts: boolean;
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote(quoteParams: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    createExactOutSwapInstruction?(swapParams: ExactOutSwapParams): TransactionInstruction;
}
export declare const mapAddressToAccountInfos: (accountInfoMap: AccountInfoMap, addresses: PublicKey[]) => AccountInfo<Buffer>[];
export declare const tokenAccountsToJSBIs: (tokenAccounts: TokenAccountInfo[]) => JSBI[];
export declare const tokenAccountInfoToJSBIs: (tokenAccountInfos: AccountInfo<Buffer>[]) => JSBI[];
export declare const MISSING_TOKEN_RESERVE_AMOUNTS = "Missing tokenReserveAmounts";
export declare const prefetchAmms: (amms: Amm[], connection: Connection) => Promise<void>;
export {};
