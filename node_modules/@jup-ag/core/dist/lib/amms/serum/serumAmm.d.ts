import { Orderbook } from '@project-serum/serum';
import { PublicKey } from '@solana/web3.js';
import { AccountInfoMap, Amm, Quote, QuoteParams, SwapLegAndAccounts, SwapParams } from '../../amm';
import { SerumMarket } from '../../market';
import { getL2 } from './market';
export declare class SerumAmm implements Amm {
    market: SerumMarket;
    id: string;
    label: Amm['label'];
    shouldPrefetch: boolean;
    exactOutputSupported: boolean;
    hasDynamicAccounts: boolean;
    private _orderbooks;
    private isOpenbook;
    constructor(market: SerumMarket);
    get orderbooks(): {
        asks: Orderbook;
        bids: Orderbook;
    } | undefined;
    static getL2: typeof getL2;
    getAccountsForUpdate(): PublicKey[];
    update(accountInfoMap: AccountInfoMap): void;
    getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote;
    getSwapLegAndAccounts(swapParams: SwapParams): SwapLegAndAccounts;
    get reserveTokenMints(): PublicKey[];
}
