import { Amm } from './amm';
import { TokenMintAddress } from '@jup-ag/common';
export type TokenRouteSegments = Map<TokenMintAddress, Map<TokenMintAddress, Amm[]>>;
