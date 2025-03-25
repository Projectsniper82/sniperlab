import { PublicKey } from '@solana/web3.js';
import { RouteInfo } from './routes';
import { Instruction, PlatformFee, QuoteMintToReferrer, Owner } from '@jup-ag/common';
type RouteToInstructionsParams = {
    user: Owner;
    openOrdersAddresses: (PublicKey | undefined)[];
    userSourceTokenAccountAddress: PublicKey;
    userIntermediateTokenAccountAddresses: PublicKey[];
    userDestinationTokenAccountAddress: PublicKey;
    routeInfo: RouteInfo;
    platformFee: PlatformFee | undefined;
    computeUnitPriceMicroLamports: number | undefined;
    quoteMintToReferrer: QuoteMintToReferrer;
    asLegacyTransaction?: boolean;
};
declare function routeToInstructions({ user, openOrdersAddresses, userSourceTokenAccountAddress, userIntermediateTokenAccountAddresses, userDestinationTokenAccountAddress, routeInfo, platformFee, computeUnitPriceMicroLamports, quoteMintToReferrer, asLegacyTransaction, }: RouteToInstructionsParams): Promise<{
    instruction: Instruction;
}>;
export default routeToInstructions;
