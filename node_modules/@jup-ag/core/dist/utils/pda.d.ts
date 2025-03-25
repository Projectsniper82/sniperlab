/// <reference types="node" />
import { PublicKey } from '@solana/web3.js';
export declare const toBuffer: (arr: Buffer | Uint8Array | Array<number>) => Buffer;
/**
 * Derive a program address from seeds and a program ID.
 * Without checking the resulting address is off curve to save computation
 */
export declare function createProgramAddressSyncUnsafe(seeds: Array<Buffer | Uint8Array>, programId: PublicKey): PublicKey;
