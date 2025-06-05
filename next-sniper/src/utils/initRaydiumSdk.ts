// src/utils/initRaydiumSdk.ts
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { Connection, PublicKey } from '@solana/web3.js';

// This function now takes the user-specific connection and their public key as owner.
export async function initRaydiumSdkForUser(
    userConnection: Connection,
    ownerPublicKey: PublicKey
): Promise<Raydium> {
    console.log(`[initRaydiumSdkForUser] Initializing Raydium SDK with user-specific connection and owner: ${ownerPublicKey.toBase58()}`);
    console.log(`[initRaydiumSdkForUser] RPC Endpoint being used: ${userConnection.rpcEndpoint}`);

    // The 'owner' here provides context to the SDK, especially for ATA derivation if the SDK handles it,
    // and for setting the default fee payer on transactions it constructs.
    // The actual signing of the transaction will still be done by the user's wallet adapter.
    const sdk = await Raydium.load({
        connection: userConnection,
        owner: ownerPublicKey, // Use the connected user's public key as the owner context
        cluster: 'mainnet',    // Assuming mainnet, adjust if network can vary
        disableLoadToken: false, // Defaults, adjust if needed
        disableFeatureCheck: false, // Defaults, adjust if needed
    });

    console.log("[initRaydiumSdkForUser] Raydium SDK instance created for user.");
    return sdk;
}

