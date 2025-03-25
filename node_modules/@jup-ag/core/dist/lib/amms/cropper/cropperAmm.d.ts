/// <reference types="node" />
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { CropperPoolState } from './swapLayout';
interface CropperParams {
    tokenAFeeAccount: string;
    tokenBFeeAccount: string;
    returnFeeNumerator: number;
    fixedFeeNumerator: number;
    feeDenominator: number;
}
export declare class CropperAmm implements Amm {
    id: string;
    label: "Cropper";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    poolState: CropperPoolState;
    tokenReserveAmounts: JSBI[] | undefined;
    private calculator;
    private feePct;
    private params;
    static getStateFromStateAccount(connection: Connection): Promise<import("./swapLayout").CropperState>;
    static decodePoolState: (address: PublicKey, accountInfo: AccountInfo<Buffer>) => CropperPoolState;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>, params: CropperParams);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
export {};
