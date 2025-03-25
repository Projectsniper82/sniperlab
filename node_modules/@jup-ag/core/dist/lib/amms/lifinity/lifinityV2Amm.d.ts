/// <reference types="node" />
import { LifinityAmmV2 } from '@jup-ag/lifinity-sdk-v2';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { IdlAccounts, IdlTypes } from '@coral-xyz/anchor';
type ConfigInput = IdlTypes<LifinityAmmV2>['AmmConfig'];
export type AmmState = Omit<IdlAccounts<LifinityAmmV2>['amm'], 'config'> & {
    config: ConfigInput;
};
export declare class LifinityV2Amm implements Amm {
    private address;
    id: string;
    label: "Lifinity V2";
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private ammState;
    private poolInfo;
    private ammData;
    private slot;
    constructor(address: PublicKey, ammAccountInfo: AccountInfo<Buffer>);
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
    get isTradeFrozen(): boolean;
}
export {};
