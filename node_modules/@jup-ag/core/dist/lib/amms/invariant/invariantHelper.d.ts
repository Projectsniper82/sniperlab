/// <reference types="node" />
import { PoolStructure, Tick, Tickmap, simulateSwap } from '@jup-ag/invariant';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { SwapMode } from '../../amm';
type SimulationResult = ReturnType<typeof simulateSwap>;
export type TickIndexToTickPubkeyHash = Map<number, PublicKey>;
export declare class InvariantHelper {
    static parsePoolStructure(accountInfo: AccountInfo<Buffer>): PoolStructure;
    static parseTickmap(accountInfo: AccountInfo<Buffer>): Tickmap;
    static parseTick(accountInfo: AccountInfo<Buffer>): Tick;
    static getQuote(poolStructure: PoolStructure, ticks: Map<number, Tick>, tickmap: Tickmap, sourceMint: PublicKey, amount: JSBI, swapMode: SwapMode): SimulationResult;
    static getTickIndexToTickPubkeyHash(address: PublicKey, poolStructure: PoolStructure, tickmap?: Tickmap): TickIndexToTickPubkeyHash;
    private static getTickAddress;
}
export {};
