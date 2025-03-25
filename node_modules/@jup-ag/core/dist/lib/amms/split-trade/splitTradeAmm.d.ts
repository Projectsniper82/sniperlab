import { PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { SerumMarket } from '../../market';
export declare class SplitTradeAmm implements Amm {
    firstAmm: Amm;
    secondAmm: Amm;
    reserveTokenMints: PublicKey[];
    market: SerumMarket | null;
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private portion1;
    private portion2;
    constructor(firstAmm: Amm, secondAmm: Amm, reserveTokenMints: PublicKey[]);
    static getAmmIdsFromSplitTradeAmmId(id: string): string[];
    static create(firstAmm: Amm, secondAmm: Amm): SplitTradeAmm | undefined;
    setPortions(portion1: number, portion2: number): void;
    get id(): string;
    get label(): "Aldrin" | "Crema" | "Cropper" | "Cykura" | "DeltaFi" | "GooseFX" | "Invariant" | "Lifinity" | "Lifinity V2" | "Marinade" | "Mercurial" | "Meteora" | "Raydium" | "Raydium CLMM" | "Saber" | "Serum" | "Orca" | "Step" | "Penguin" | "Saros" | "Stepn" | "Orca (Whirlpools)" | "Sencha" | "Saber (Decimals)" | "Dradex" | "Balansol" | "Openbook" | "Oasis" | "BonkSwap" | "Phoenix" | "Symmetry" | "Unknown";
    getAccountsForUpdate(): never[];
    update(_accountInfoMap: AccountInfoMap): void;
    getQuote(quoteParams: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
}
