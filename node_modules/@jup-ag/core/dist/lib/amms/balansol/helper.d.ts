import { BN } from '@coral-xyz/anchor';
import { PoolPairData } from './type';
export declare const calcOutGivenInSwap: (amountIn: number, balanceOut: BN, balanceIn: BN, weightOut: number, weightIn: number, swapFee: BN) => number;
export declare const calcNormalizedWeight: (weights: BN[], weightToken: BN) => number;
export declare const calcSpotPriceExactInSwap: (amount: number, poolPairData: PoolPairData) => number;
export declare const calcPriceImpactSwap: (bidAmount: number, poolPairData: PoolPairData) => number;
