/// <reference types="bn.js" />
import { PublicKey } from '@solana/web3.js';
import { BN, IdlAccounts, Program } from '@coral-xyz/anchor';
import { FundsIDL } from './idl';
export declare const SYMMETRY_PROGRAM: Program<FundsIDL>;
export type FundState = IdlAccounts<FundsIDL>['fundState'];
export declare const TOKEN_INFO_ADDRESS: PublicKey;
export declare const CURVE_DATA_ADDRESS: PublicKey;
export declare const SWAP_FEE_ACCOUNT: PublicKey;
export declare const PDA_ACCOUNT: PublicKey;
export type TokenInfoData = {
    id: number;
    mint: string;
    pdaAccount: string;
    pyth: string;
    decimals: number;
};
export type CurveChainData = {
    buy: TokenPriceData[];
    sell: TokenPriceData[];
};
export type TokenPriceData = {
    amount: BN[];
    price: BN[];
};
