import { Market as SerumMarket } from '@project-serum/serum';
import { PublicKey } from '@solana/web3.js';
import { StableSwap } from '@saberhq/stableswap-sdk';
import { Amm } from './amm';
import JSBI from 'jsbi';
import { Fee } from '@jup-ag/common';
export { SerumMarket, StableSwap };
export interface MarketInfo {
    amm: Amm;
    inputMint: PublicKey;
    outputMint: PublicKey;
    minInAmount?: JSBI;
    minOutAmount?: JSBI;
    inAmount: JSBI;
    outAmount: JSBI;
    notEnoughLiquidity: boolean;
    priceImpactPct: number;
    lpFee: Fee;
    platformFee: Fee;
}
export type IsValidRouteParams = {
    amms: Amm[];
    asLegacyTransaction?: boolean;
    isSplit?: boolean;
};
export declare const isValidRoute: ({ amms, asLegacyTransaction, isSplit }: IsValidRouteParams) => boolean;
export declare function isSerumAndRaydium(marketInfos: MarketInfo[]): boolean;
