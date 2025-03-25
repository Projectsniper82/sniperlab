/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import { FundState, TokenInfoData } from './types';
interface SymmetryParams {
    tokenInfoData: string;
}
export declare class SymmetryAmm implements Amm {
    address: PublicKey;
    id: string;
    label: "Symmetry";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    fundState: FundState;
    tokenInfos: TokenInfoData[];
    private curveData?;
    private pythPrices;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>, params: SymmetryParams);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
export {};
