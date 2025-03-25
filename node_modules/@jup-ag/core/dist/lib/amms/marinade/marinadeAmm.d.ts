/// <reference types="node" />
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import BN from 'bn.js';
import { Program } from '@coral-xyz/anchor';
import { MarinadeStateResponse } from './marinade-state.types';
export declare class MarinadeAmm implements Amm {
    address: PublicKey;
    id: string;
    label: "Marinade";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    marinadeFinanceProgram: Program;
    marinadeStateResponse: MarinadeStateResponse;
    liqPoolSolLegPdaAddress: PublicKey;
    marinadeState: MarinadeState | undefined;
    constructor(address: PublicKey, accountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
    private findProgramDerivedAddress;
}
declare class MarinadeState {
    private state;
    private liqPoolSolLegPdaLamports;
    private liqPoolMSOLLegAmount;
    constructor(state: MarinadeStateResponse, liqPoolSolLegPdaLamports: BN, liqPoolMSOLLegAmount: BN);
    depositQuote(lamports: BN): {
        outAmount: BN;
        feeAmount: number;
        feePct: number;
        priceImpactPct: number;
    };
    private checkStakingCap;
    private calcMSOLFromLamports;
    private calcLamportsFromMSOLAmount;
    private totalVirtualStakedLamports;
    private totalLamportsUnderControl;
    private totalCoolingDown;
    liquidUnstakeQuote(msolAmount: BN): {
        outAmount: BN;
        feeAmount: BN;
        feePct: number;
        priceImpactPct: number;
    };
}
export {};
