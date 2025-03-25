/// <reference types="node" />
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { MarketInfo } from './market';
import { TokenRouteSegments } from './types';
import { Amm, SwapMode } from './amm';
import JSBI from 'jsbi';
import { SingleLevelAmmValidator } from './ammValidator';
import { AddressLookupTableProvider } from './addressLookupTableProvider';
import { TokenMintAddress, TransactionFeeInfo } from '@jup-ag/common';
export interface RouteInfo {
    marketInfos: MarketInfo[];
    inAmount: JSBI;
    outAmount: JSBI;
    amount: JSBI;
    otherAmountThreshold: JSBI;
    slippageBps: number;
    swapMode: SwapMode;
    priceImpactPct: number;
    getDepositAndFee: () => Promise<TransactionFeeInfo | undefined>;
}
export type MarketsCache = Array<Omit<AccountInfo<Buffer>, 'data' | 'owner'> & {
    data: [string, 'base64'];
    owner: string;
    pubkey: string;
    params?: any;
}>;
export type KeyedAccountInfo<T = Buffer> = AccountInfo<T> & {
    pubkey: PublicKey;
    params?: any;
};
export declare const fetchMarketCache: (url: string) => Promise<MarketsCache>;
/** For testing purposes when api does not have the new pools */
export declare function fetchExtraKeyedAccountInfos(connection: Connection, pks: PublicKey[]): Promise<{
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
    pubkey: PublicKey;
}[]>;
export declare function getAllAmmsAndSaberWrapperMintsWithALTProvider({ connection, marketsCache, usePreloadedAddressLookupTableCache, ammsToExclude, mintsToExclude, }: {
    connection: Connection;
    marketsCache: MarketsCache;
    usePreloadedAddressLookupTableCache: boolean;
    ammsToExclude?: SingleLevelAmmValidator;
    mintsToExclude?: PublicKey[];
}): Promise<{
    amms: Amm[];
    saberWrapperMints: string[];
    addressLookupTableProvider: AddressLookupTableProvider;
}>;
export declare function ammCrossProtocolPairs(arr: Amm[], callback: (a: Amm, b: Amm) => void): void;
export declare function getTokenRouteSegments(amms: Amm[]): TokenRouteSegments;
export type Route = {
    amms: Amm[];
    mints: PublicKey[];
};
export declare function computeInputRouteSegments({ inputMint, outputMint, tokenRouteSegments, swapMode, intermediateTokens, onlyDirectRoutes, asLegacyTransaction, }: {
    inputMint: string;
    outputMint: string;
    tokenRouteSegments: TokenRouteSegments;
    intermediateTokens?: Set<TokenMintAddress>;
    swapMode: SwapMode;
    onlyDirectRoutes?: boolean;
    asLegacyTransaction?: boolean;
}): TokenRouteSegments;
export declare function computeRouteMap(tokenRouteSegments: TokenRouteSegments, intermediateTokens?: Set<string>, onlyDirectRoutes?: boolean, asLegacyTransaction?: boolean): Map<string, string[]>;
export declare function getRouteInfoUniqueId(routeInfo: RouteInfo): string;
