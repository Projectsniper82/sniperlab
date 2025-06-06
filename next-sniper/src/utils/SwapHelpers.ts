// src/utils/SwapHelpers.ts
import { PublicKey, VersionedTransaction, Signer } from '@solana/web3.js';
import BN from 'bn.js';
import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { NATIVE_MINT, getAssociatedTokenAddressSync } from '@solana/spl-token';

// --- Custom Interface Definitions ---
// These interfaces remain unchanged as they are used by your other utilities.
export interface MyTokenInfoFromSDK { chainId?: number; address: PublicKey; configId?: PublicKey; programId: PublicKey; decimals: number; logoURI?: string; symbol?: string; name?: string; tags?: string[]; extensions?: object; }
export interface MySdkPoolInfo { id: PublicKey; version: number; status: BN; programId: PublicKey; mintA: MyTokenInfoFromSDK; mintB: MyTokenInfoFromSDK; lpMint: MyTokenInfoFromSDK; baseReserve: BN; quoteReserve: BN; lpSupply: BN; openTime: BN; marketId: PublicKey; fees: { swapFeeNumerator: BN; swapFeeDenominator: BN; hostFeeNumerator: BN; hostFeeDenominator: BN; }; authority: PublicKey; openOrders: PublicKey; targetOrders: PublicKey; baseVault: PublicKey; quoteVault: PublicKey; configId?: PublicKey; baseDecimals?: number; quoteDecimals?: number; lpDecimals?: number; price?: number; tvl?: number; }
export interface MyAmmV4Keys { id: PublicKey; programId: PublicKey; baseMint: PublicKey; quoteMint: PublicKey; lpMint: PublicKey; version: number; authority: PublicKey; openOrders: PublicKey; targetOrders: PublicKey; baseVault: PublicKey; quoteVault: PublicKey; marketProgramId: PublicKey; marketId: PublicKey; marketAuthority: PublicKey; marketBaseVault: PublicKey; marketQuoteVault: PublicKey; marketBids: PublicKey; marketAsks: PublicKey; marketEventQueue: PublicKey; configId?: PublicKey; }
export interface MyLiquiditySwapPayload { transaction: VersionedTransaction; signers?: Signer[]; }


// Interface for parameters remains the same as our successful version.
export interface CreateAmmV4SwapPayloadParams {
    sdk: Raydium;
    poolInfoFromSdk: any; 
    poolKeysFromSdk: any; 
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
        poolInfoFromSdk,
        poolKeysFromSdk,
        userPublicKey,
        inputTokenMint,
        outputTokenMint,
        amountIn,
        minAmountOut,
    } = params;

    console.log('[SwapHelpers] Creating AMM V4 Swap Payload...');
    console.log(`  Input Mint (PK): ${inputTokenMint.toBase58()}`);
    console.log(`  Output Mint (PK): ${outputTokenMint.toBase58()}`);
    console.log(`  Owner: ${userPublicKey.toBase58()}`);

    if (!sdk.liquidity || !sdk.liquidity.swap) {
        throw new Error("[SwapHelpers] SDK liquidity module or swap function is not available.");
    }

    const isInputSol = inputTokenMint.equals(NATIVE_MINT);
    const isOutputSol = outputTokenMint.equals(NATIVE_MINT);

    const swapFunctionParams: any = {
        poolInfo: poolInfoFromSdk, 
        poolKeys: poolKeysFromSdk, 
        // @ts-ignore - Using PublicKey objects for mints to match the working findDecoder.js behavior
        inputMint: inputTokenMint,
        // @ts-ignore
        outputMint: outputTokenMint,
        amountIn,
        amountOut: minAmountOut,
        fixedSide: 'in',
        txVersion: TxVersion.V0,
        computeBudgetConfig: {
            units: 400000, 
            microLamports: 1000, // Kept priority fee low for testing
        },
        owner: userPublicKey,
        config: {
            associatedOnly: true, 
            inputUseSolBalance: isInputSol,
            outputUseSolBalance: isOutputSol,
        },
        // `userKeys` will be set or removed based on the logic below
    };

    if (isInputSol) {
        // --- THIS IS THE BUYING PATH ---
        // This logic worked for your buy swap. We are not changing it.
        // To match the successful `findDecoder.js` script, we DO NOT pass `userKeys`.
        // The SDK will derive all necessary ATAs.
        console.log('[SwapHelpers] BUY path: Input is SOL. Relying on SDK to derive all user accounts.');
        swapFunctionParams.userKeys = undefined; // Ensure userKeys is not sent
    } else {
        // --- THIS IS THE SELLING PATH ---
        // Input is an SPL Token. We MUST explicitly provide the ATAs to fix the "insufficient funds" error.
        const userInputTokenAccount = getAssociatedTokenAddressSync(inputTokenMint, userPublicKey, false);
        const userOutputTokenAccount = getAssociatedTokenAddressSync(outputTokenMint, userPublicKey, false);

        console.log(`[SwapHelpers] SELL path: Derived User Input ATA (for selling token): ${userInputTokenAccount.toBase58()}`);
        console.log(`[SwapHelpers] SELL path: Derived User Output ATA (for receiving SOL): ${userOutputTokenAccount.toBase58()}`);
        
        swapFunctionParams.userKeys = {
            inputTokenAccount: userInputTokenAccount,
            outputTokenAccount: userOutputTokenAccount,
        };
    }
    
    console.log('[SwapHelpers] DEBUG: Final parameters for sdk.liquidity.swap:', JSON.stringify(swapFunctionParams, (key, value) =>
        value instanceof PublicKey ? value.toBase58() :
        value instanceof BN ? value.toString() :
        (key === "poolInfo" || key === "poolKeys") ? "[Object - Check mainnetBuy/SellUtil logs for raw SDK data fed here]" :
        value
    , 2));

    try {
        const swapPayloadFromSDK = await sdk.liquidity.swap(swapFunctionParams);
        console.log("[SwapHelpers] Payload from sdk.liquidity.swap received successfully.");
        return {
            transaction: swapPayloadFromSDK.transaction as VersionedTransaction,
            signers: swapPayloadFromSDK.signers as Signer[] | undefined,
        };
    } catch (error) {
        console.error("[SwapHelpers] Error calling sdk.liquidity.swap:", error);
        throw error;
    }
}