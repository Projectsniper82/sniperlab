import { StableSwap } from '@saberhq/stableswap-sdk';
import { PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapParams, SwapLegAndAccounts } from '../../amm';
import JSBI from 'jsbi';
export declare class SaberAmm implements Amm {
    private stableSwap;
    id: string;
    label: "Saber";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    tokenReserveAmounts: JSBI[] | undefined;
    private stableSwapState;
    private calculator;
    constructor(stableSwap: StableSwap);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
