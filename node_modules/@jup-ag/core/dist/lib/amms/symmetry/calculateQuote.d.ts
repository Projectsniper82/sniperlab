import { CurveChainData, TokenInfoData, TokenPriceData } from './types';
import { PriceData } from '@pythnetwork/client';
import { PublicKey } from '@solana/web3.js';
import { FundState } from './types';
export declare function calculateQuote(tokenInfoData: TokenInfoData[], curveChainData: CurveChainData, fund: FundState, pythPrices: PriceData[], fromTokenMint: PublicKey, toTokenMint: PublicKey, fromAmount: number): {
    inAmount: number;
    outAmount: number;
    feeMint: PublicKey;
    feeAmount: number;
    priceImpact: number;
    feePct: number;
} | undefined;
export declare function calculateOutputAmountForBuyingAsset(currentAmount: number, targetAmount: number, pyth: number, amountValue: number, curveData: TokenPriceData, decimals: number): number;
export declare function calculateOutputValueForSellingAsset(currentAmount: number, targetAmount: number, pyth: number, amount: number, curveData: TokenPriceData, decimals: number): number;
export declare function mulDiv(a: number, b: number, c: number): number;
