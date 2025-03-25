/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { Marcopolo } from './idl';
import { Program } from '@coral-xyz/anchor';
import { PoolStructure } from './type';
import Decimal from 'decimal.js';
import JSBI from 'jsbi';
export declare const DEFAULT_DENOMINATOR: Decimal;
export declare class MarcoPoloAmm implements Amm {
    private address;
    id: string;
    label: Amm['label'];
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private isBonkSwap;
    pool: PoolStructure;
    private calculator;
    private feePct;
    tokenReserveAmounts: JSBI[] | undefined;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    static getProgram: () => Program<Marcopolo>;
    private decodePoolState;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
