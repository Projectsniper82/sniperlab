// src/utils/SwapHelpers.ts
import { PublicKey, VersionedTransaction, Signer } from '@solana/web3.js';
import BN from 'bn.js';
import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { NATIVE_MINT } from '@solana/spl-token';

// --- Custom Interface Definitions ---
// These interfaces are based on the structure observed in your findDecoder.js log output.
// You should review and refine these based on your detailed logs.

export interface MyTokenInfoFromSDK {
    chainId?: number; // Optional as not strictly needed for swap logic itself
    address: PublicKey; // Expecting actual PublicKey instance for internal consistency
    configId?: PublicKey;
    programId: PublicKey;
    decimals: number;
    logoURI?: string;
    symbol?: string;
    name?: string;
    tags?: string[];
    extensions?: object;
}

export interface MySdkPoolInfo {
    id: PublicKey;
    version: number;
    status: BN;
    programId: PublicKey;
    mintA: MyTokenInfoFromSDK;
    mintB: MyTokenInfoFromSDK;
    lpMint: MyTokenInfoFromSDK;
    baseReserve: BN;
    quoteReserve: BN;
    lpSupply: BN;
    openTime: BN;
    marketId: PublicKey;
    // For the fees object, ensure it matches what sdk.liquidity.swap expects.
    // This might be derived from poolInfo.feeRate if the full object isn't directly available
    // in the `sdkFetchedPoolData.poolInfo` from `getPoolInfoFromRpc`.
    // A common structure for AMMv4:
    fees: {
        swapFeeNumerator: BN;
        swapFeeDenominator: BN;
        hostFeeNumerator: BN; // Often 0 for standard pools
        hostFeeDenominator: BN; // Often 0 for standard pools
    };
    // From your findDecoder.js log, these might be present:
    price?: number;
    mintAmountA?: number; // UI amount, actual reserve is baseReserve
    mintAmountB?: number; // UI amount, actual reserve is quoteReserve
    feeRate?: number; // If this is present, use it to construct the 'fees' object above
    tvl?: number;
    // These are essential for AMM V4 interaction and should be part of the processed poolInfo
    authority: PublicKey;
    openOrders: PublicKey;
    targetOrders: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    configId?: PublicKey;
    baseDecimals?: number; // Should align with mintA.decimals
    quoteDecimals?: number; // Should align with mintB.decimals
    lpDecimals?: number; // Should align with lpMint.decimals
    // [key: string]: any; // Use as a last resort
}

export interface MyAmmV4Keys {
    id: PublicKey;
    configId?: PublicKey;
    programId: PublicKey;
    baseMint: PublicKey;
    quoteMint: PublicKey;
    lpMint: PublicKey;
    version: number;
    authority: PublicKey;
    openOrders: PublicKey;
    targetOrders: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    marketProgramId: PublicKey;
    marketId: PublicKey;
    marketAuthority: PublicKey;
    marketBaseVault: PublicKey;
    marketQuoteVault: PublicKey;
    marketBids: PublicKey;
    marketAsks: PublicKey;
    marketEventQueue: PublicKey;
}

export interface MyLiquiditySwapPayload {
    transaction: VersionedTransaction;
    signers?: Signer[];
}

export interface CreateAmmV4SwapPayloadParams {
    sdk: Raydium;
    poolInfo: MySdkPoolInfo;
    poolKeys: MyAmmV4Keys;
    userPublicKey: PublicKey;
    inputTokenMint: PublicKey;
    outputTokenMint: PublicKey;
    amountIn: BN;
    minAmountOut: BN;
}

export async function createAmmV4SwapTransactionPayload(
    params: CreateAmmV4SwapPayloadParams
): Promise<MyLiquiditySwapPayload> {
    const {
        sdk,
        poolInfo,
        poolKeys,
        userPublicKey,
        inputTokenMint,
        outputTokenMint,
        amountIn,
        minAmountOut,
    } = params;

    console.log('[SwapHelpers] Creating AMM V4 Swap Payload...');
    console.log(`  Input: ${amountIn.toString()} of ${inputTokenMint.toBase58()}`);
    console.log(`  Min Output: ${minAmountOut.toString()} of ${outputTokenMint.toBase58()}`);

    if (!sdk.liquidity || !sdk.liquidity.swap) {
        throw new Error("[SwapHelpers] SDK liquidity module or swap function is not available.");
    }

    try {
        const swapPayloadFromSDK = await sdk.liquidity.swap({
            poolInfo: poolInfo as any, // Continue to cast if MySdkPoolInfo isn't an exact SDK type
            poolKeys: poolKeys as any, // Continue to cast if MyAmmV4Keys isn't an exact SDK type
            // --- THE FIX IS HERE ---
            inputMint: inputTokenMint.toBase58(), // Pass as base58 string
            // outputMint: outputTokenMint.toBase58(), // Only if SDK types require it AND you intend to pass it.
                                                    // The Raydium SDK usually infers outputMint.
            // --- END OF FIX ---
            amountIn,
            amountOut: minAmountOut,
            fixedSide: 'in',
            txVersion: TxVersion.V0,
            computeBudgetConfig: {
                units: 400000,
                microLamports: 25000,
            },
            config: {
                associatedOnly: true,
                inputUseSolBalance: inputTokenMint.equals(NATIVE_MINT),
                outputUseSolBalance: outputTokenMint.equals(NATIVE_MINT),
            },
        });
        console.log("[SwapHelpers] Payload from sdk.liquidity.swap received.");
        return swapPayloadFromSDK as MyLiquiditySwapPayload;

    } catch (error) {
        console.error("[SwapHelpers] Error calling sdk.liquidity.swap:", error);
        throw error;
    }
}