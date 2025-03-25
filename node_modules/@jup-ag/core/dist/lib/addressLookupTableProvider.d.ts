import { AddressLookupTableAccount, Connection } from '@solana/web3.js';
import { MarketsCache } from './routes';
export interface AddressLookupTableProvider {
    getAdressLookupTableAccounts(ammIds: string[]): Promise<AddressLookupTableAccount[]>;
}
/** Prefered for light usage as less fetching involved */
export declare class LazyAddressLookupTableCache implements AddressLookupTableProvider {
    private connection;
    private ammIdToAddressLookupTable;
    private ammIdToAddressLookupTableAccount;
    constructor(connection: Connection, ammIdToAddressLookupTable: Map<string, string>);
    getAdressLookupTableAccounts(ammIds: string[]): Promise<AddressLookupTableAccount[]>;
}
/** Prefered in a high load setup where we likely will repeatedly fetch otherwise */
export declare class PreloadedAddressLookupTableCache implements AddressLookupTableProvider {
    private ammIdToAddressLookupTableAccount;
    private constructor();
    static load(connection: Connection, ammIdToAddressLookupTable: Map<string, string>): Promise<PreloadedAddressLookupTableCache>;
    getAdressLookupTableAccounts(ammIds: string[]): Promise<AddressLookupTableAccount[]>;
}
export declare function createAddressLookupTableProvider(connection: Connection, marketsCache: MarketsCache, usePreloadedCache: boolean): Promise<AddressLookupTableProvider>;
