import { Commitment, Connection, PublicKey } from '@solana/web3.js';
import { Product, PriceData } from '.';
export interface PythHttpClientResult {
    assetTypes: string[];
    /** The name of each product, e.g., "Crypto.BTC/USD" */
    symbols: string[];
    products: Product[];
    /** Metadata for each product. */
    productFromSymbol: Map<string, Product>;
    /** The current price of each product. */
    productPrice: Map<string, PriceData>;
    prices: PriceData[];
}
/**
 * Reads Pyth price data from a solana web3 connection. This class uses a single HTTP call.
 * Use the method getData() to get updated prices values.
 */
export declare class PythHttpClient {
    connection: Connection;
    pythProgramKey: PublicKey;
    commitment: Commitment;
    constructor(connection: Connection, pythProgramKey: PublicKey, commitment?: Commitment);
    getData(): Promise<PythHttpClientResult>;
}
