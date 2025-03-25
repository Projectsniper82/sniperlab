/// <reference types="node" />
import { AccountInfo } from '@solana/web3.js';
import { PoolState, VaultState } from '@mercurial-finance/dynamic-amm-sdk';
export declare const accountInfoToMeteoraSwapLayout: (accountInfo: AccountInfo<Buffer>) => PoolState;
export declare const accountInfoToVaultLayout: (accountInfo: AccountInfo<Buffer>) => VaultState;
