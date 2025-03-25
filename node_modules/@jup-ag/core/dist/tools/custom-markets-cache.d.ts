/**
 * For development purposes we want to be able to fetch a market cache and add to it to push into another development market cache to quickly iterate
 */
/// <reference types="node" />
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
export type KeyedAccountInfo<T = Buffer> = AccountInfo<T> & {
    pubkey: PublicKey;
    params?: any;
};
export declare function chunkedGetMultipleAccountInfos(connection: Connection, pks: PublicKey[], chunkSize?: number): Promise<Map<string, AccountInfo<Buffer> | null>>;
export declare function sleep(ms: number): Promise<void>;
