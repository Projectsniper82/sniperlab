import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
export interface PoolStructure {
    tokenX: PublicKey;
    tokenY: PublicKey;
    poolXAccount: PublicKey;
    poolYAccount: PublicKey;
    admin: PublicKey;
    projectOwner: PublicKey;
    constK: Product;
    price: FixedPoint;
    lpFee: FixedPoint;
    buybackFee: FixedPoint;
    projectFee: FixedPoint;
    mercantiFee: FixedPoint;
    tokenXReserve: Token;
    tokenYReserve: Token;
    selfShares: Token;
    allShares: Token;
    buybackAmountX: Token;
    buybackAmountY: Token;
    projectAmountX: Token;
    projectAmountY: Token;
    mercantiAmountX: Token;
    mercantiAmountY: Token;
    lpAccumulatorX: Token;
    lpAccumulatorY: Token;
    farmCount: BN;
    bump: number;
}
export interface FixedPoint {
    v: BN;
}
export interface Token {
    v: BN;
}
export interface Product {
    v: BN;
}
