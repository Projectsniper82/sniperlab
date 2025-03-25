/// <reference types="node" />
import { u64 } from '@solana/spl-token';
import { AccountInfo } from '@solana/web3.js';
export declare const tokenAmountAccessor: (tokenAccountInfo: AccountInfo<Buffer>) => u64;
export declare const mintTotalSupplyAccessor: (mintAccountInfo: AccountInfo<Buffer>) => u64;
