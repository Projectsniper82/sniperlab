import type { AnchorProvider as AnchorProviderImpl, Provider as IAnchorProvider } from "@project-serum/anchor";
import type { Provider as SaberProvider, ReadonlyProvider as ReadonlySaberProvider, Wallet } from "@saberhq/solana-contrib";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
/**
 * Interface of an AnchorProvider.
 */
export interface AnchorProvider extends IAnchorProvider {
    wallet: Wallet;
    opts: ConfirmOptions;
}
/**
 * Class used to create new {@link AnchorProvider}s.
 */
export declare const AnchorProviderClass: AnchorProviderCtor & typeof AnchorProviderImpl;
/**
 * Constructor for an Anchor provider.
 */
export declare type AnchorProviderCtor = new (connection: Connection, wallet: Wallet, opts: ConfirmOptions) => AnchorProvider;
/**
 * Create a new Anchor provider.
 *
 * @param connection
 * @param wallet
 * @param opts
 * @returns
 */
export declare const buildAnchorProvider: (connection: Connection, wallet: Wallet, opts: ConfirmOptions) => AnchorProvider;
/**
 * Creates a readonly Saber Provider from an Anchor provider.
 * @param anchorProvider The Anchor provider.
 * @returns
 */
export declare const makeReadonlySaberProvider: (anchorProvider: IAnchorProvider) => ReadonlySaberProvider;
/**
 * Creates a Saber Provider from an Anchor provider.
 * @param anchorProvider The Anchor provider.
 * @returns
 */
export declare const makeSaberProvider: (anchorProvider: AnchorProvider) => SaberProvider;
/**
 * Creates an Anchor Provider from a Saber provider.
 * @param saberProvider
 * @returns
 */
export declare const makeAnchorProvider: (saberProvider: ReadonlySaberProvider) => AnchorProvider;
//# sourceMappingURL=provider.d.ts.map