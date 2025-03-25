/// <reference types="node" />
import { Program } from '@coral-xyz/anchor';
import { FundsIDL } from './idl';
import { CurveChainData, TokenInfoData } from './types';
export declare function decodeTokenInfo(program: Program<FundsIDL>, data: Buffer): TokenInfoData[];
export declare function decodeCurveData(program: Program<FundsIDL>, data: Buffer): CurveChainData;
