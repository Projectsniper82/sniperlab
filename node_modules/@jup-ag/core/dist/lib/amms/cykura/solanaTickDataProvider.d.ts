/// <reference types="bn.js" />
/// <reference types="node" />
import { CyclosCore, TickDataProvider, PoolVars } from '@jup-ag/cykura-sdk';
import { Program, BN, IdlAccounts } from '@coral-xyz/anchor';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
export type TickBitmapState = IdlAccounts<CyclosCore>['tickBitmapState'];
export type TickState = IdlAccounts<CyclosCore>['tickState'];
export declare class SolanaTickDataProvider implements TickDataProvider {
    program: Program<CyclosCore>;
    pool: PoolVars;
    bitmapCache: Map<number, {
        address: PublicKey;
        word: BN;
    }>;
    tickCache: Map<number, {
        address: PublicKey;
        liquidityNet: JSBI;
    }>;
    accountsToFetch: {
        bitmaps: PublicKey[];
        ticks: PublicKey[];
    };
    constructor(program: Program<CyclosCore>, pool: PoolVars);
    /**
     * Caches ticks and bitmap accounts near the current price
     * @param tickCurrent The current pool tick
     * @param tickSpacing The pool tick spacing
     */
    eagerLoadCache(tickCurrent: number, tickSpacing: number): Promise<void>;
    /**
     * Return accounts to cache and returns early if there is insufficient data
     * @param tickCurrent The current pool tick
     * @param tickSpacing The pool tick spacing
     */
    lazyLoadAccountsToCache(tickCurrent: number, tickSpacing: number): PublicKey[];
    getTick(tick: number): {
        address: PublicKey;
        liquidityNet: JSBI;
    };
    getTickAddress(tick: number): Promise<PublicKey>;
    getTickAddressSync(tick: number): PublicKey;
    getBitmapAddress(wordPos: number): Promise<PublicKey>;
    getBitmapAddressSync(wordPos: number): PublicKey;
    /**
     * Fetches the cached bitmap for the word
     * @param wordPos
     */
    getBitmap(wordPos: number): {
        address: PublicKey;
        word: BN;
    };
    /**
     * Finds the next initialized tick in the given word. Fetched bitmaps are saved in a
     * cache for quicker lookups in future.
     * @param tick The current tick
     * @param lte Whether to look for a tick less than or equal to the current one, or a tick greater than or equal to
     * @param tickSpacing The tick spacing for the pool
     * @returns
     */
    nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): [number, boolean, number, number, PublicKey];
    updateCachedAccountInfos(accountInfoMap: Map<string, AccountInfo<Buffer> | null>): void;
}
