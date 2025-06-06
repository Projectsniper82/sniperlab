// src/utils/mainnetBuyUtil.ts
import {
    Connection,
    PublicKey,
    VersionedTransaction,
} from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { DiscoveredPoolDetailed } from './poolFinder';
import {
    createAmmV4SwapTransactionPayload,
    MySdkPoolInfo, // Still needed for ammSwapCalculator
    MyAmmV4Keys,   // Still needed for ammSwapCalculator
    MyLiquiditySwapPayload,
    MyTokenInfoFromSDK
} from './SwapHelpers'; // CreateAmmV4SwapPayloadParams now expects raw SDK pool data
import {
    getStandardPoolUiData,
    calculateStandardAmmSwapQuote,
    UiPoolReserves,
    SwapTransactionQuote
} from './ammSwapCalculator';
import { initRaydiumSdkForUser } from './initRaydiumSdk';

import type { Raydium } from '@raydium-io/raydium-sdk-v2';

const toPublicKey = (key: string | PublicKey): PublicKey => typeof key === 'string' ? new PublicKey(key) : key;

// transformTokenInfo and your custom MySdkPoolInfo/MyAmmV4Keys transformations are kept
// because your ammSwapCalculator and possibly UI logic depend on them.
// However, for the actual swap, we will pass the raw SDK objects to SwapHelpers.
const transformTokenInfo = (rawTokenInfo: any, fieldNameForError: string): MyTokenInfoFromSDK => {
    const addressStr = rawTokenInfo?.address?.toString();
    const programIdStr = rawTokenInfo?.programId?.toString();
    const decimalsNum = rawTokenInfo?.decimals;

    if (!addressStr || !programIdStr || typeof decimalsNum !== 'number') {
        console.error(`Raw token info for '${fieldNameForError}' is missing or has invalid fields (address, programId, decimals). Received:`, rawTokenInfo);
        throw new Error(`Invalid raw token info structure for ${fieldNameForError}.`);
    }
    return {
        address: new PublicKey(addressStr),
        programId: new PublicKey(programIdStr),
        decimals: decimalsNum,
        chainId: rawTokenInfo.chainId,
        logoURI: rawTokenInfo.logoURI || "",
        symbol: rawTokenInfo.symbol || "",
        name: rawTokenInfo.name || "",
        tags: Array.isArray(rawTokenInfo.tags) ? rawTokenInfo.tags : [],
        extensions: typeof rawTokenInfo.extensions === 'object' && rawTokenInfo.extensions !== null ? rawTokenInfo.extensions : {},
    };
};

export async function mainnetBuySwap(
    wallet: any,
    connection: Connection,
    selectedPoolFromFinder: DiscoveredPoolDetailed,
    buyAmountSOLFloat: number,
    slippagePercent: number
): Promise<string> {
    console.log('[mainnetBuySwap Refactored] --- Orchestrating AMM V4 Buy Swap (Using FindDecoder Approach) ---');

    const payer: PublicKey = toPublicKey(wallet.publicKey);
    const amountInLamports = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
    const inputMintPk = NATIVE_MINT; // This is PublicKey NATIVE_MINT

    // ... (initial console logs) ...

    console.log(`[mainnetBuySwap] Initializing SDK...`);
    const sdk: Raydium = await initRaydiumSdkForUser(connection, payer);

    console.log(`[mainnetBuySwap Refactored] Fetching live pool data for ID: ${selectedPoolFromFinder.id}`);
    let sdkFetchedPoolDataRaw: any; // This will hold the raw SDK response
    try {
        sdkFetchedPoolDataRaw = await sdk.liquidity.getPoolInfoFromRpc({ poolId: selectedPoolFromFinder.id });
        if (!sdkFetchedPoolDataRaw || !sdkFetchedPoolDataRaw.poolInfo || !sdkFetchedPoolDataRaw.poolKeys) {
            throw new Error("SDK's getPoolInfoFromRpc failed to return poolInfo and poolKeys.");
        }
        // Log the raw data from SDK - this is what findDecoder.js uses.
        console.log("[mainnetBuySwap DEBUG] Raw poolInfo direct from SDK:", JSON.stringify(sdkFetchedPoolDataRaw.poolInfo, null, 2));
        console.log("[mainnetBuySwap DEBUG] Raw poolKeys direct from SDK:", JSON.stringify(sdkFetchedPoolDataRaw.poolKeys, null, 2));

    } catch (e: any) {
        // ... (error handling) ...
        throw e;
    }

    // For ammSwapCalculator, we still use your transformed MySdkPoolInfo
    // This part assumes your transformation logic is correct for the calculator's needs.
    const rawPoolInfoForCalc = sdkFetchedPoolDataRaw.poolInfo;
    const rawPoolKeysForCalc = sdkFetchedPoolDataRaw.poolKeys; // Needed for some fields in MySdkPoolInfo
    const lpMintFromInfo = transformTokenInfo(rawPoolInfoForCalc.lpMint, 'poolInfo.lpMint');
    const lpAmountNumber = parseFloat(rawPoolInfoForCalc.lpAmount);
    const processedLivePoolInfoForCalc: MySdkPoolInfo = {
        id: new PublicKey(rawPoolInfoForCalc.id),
        version: parseInt(rawPoolInfoForCalc.version, 10),
        status: new BN(rawPoolInfoForCalc.status.toString()),
        programId: new PublicKey(rawPoolInfoForCalc.programId),
        mintA: transformTokenInfo(rawPoolInfoForCalc.mintA, 'poolInfo.mintA'),
        mintB: transformTokenInfo(rawPoolInfoForCalc.mintB, 'poolInfo.mintB'),
        lpMint: lpMintFromInfo,
        baseReserve: new BN(rawPoolInfoForCalc.baseReserve.toString()),
        quoteReserve: new BN(rawPoolInfoForCalc.quoteReserve.toString()),
        lpSupply: new BN(String(Math.floor(lpAmountNumber * Math.pow(10, lpMintFromInfo.decimals)))),
        openTime: new BN(rawPoolInfoForCalc.openTime.toString()),
        marketId: new PublicKey(rawPoolInfoForCalc.marketId),
        fees: {
            swapFeeNumerator: new BN(rawPoolInfoForCalc.fees?.swapFeeNumerator?.toString() || Math.round(parseFloat(rawPoolInfoForCalc.feeRate) * 10000)),
            swapFeeDenominator: new BN(rawPoolInfoForCalc.fees?.swapFeeDenominator?.toString() || 10000),
            hostFeeNumerator: new BN(rawPoolInfoForCalc.fees?.hostFeeNumerator?.toString() || '0'),
            hostFeeDenominator: new BN(rawPoolInfoForCalc.fees?.hostFeeDenominator?.toString() || '0'),
        },
        authority: new PublicKey(rawPoolKeysForCalc.authority),
        openOrders: new PublicKey(rawPoolKeysForCalc.openOrders),
        targetOrders: new PublicKey(rawPoolKeysForCalc.targetOrders),
        baseVault: new PublicKey(rawPoolKeysForCalc.vault.A),
        quoteVault: new PublicKey(rawPoolKeysForCalc.vault.B),
        configId: rawPoolInfoForCalc.configId ? new PublicKey(rawPoolInfoForCalc.configId) : undefined,
        baseDecimals: rawPoolInfoForCalc.mintA.decimals,
        quoteDecimals: rawPoolInfoForCalc.mintB.decimals,
        lpDecimals: rawPoolInfoForCalc.lpMint.decimals,
        price: parseFloat(rawPoolInfoForCalc.price),
    };

    let outputMintPk: PublicKey;
    if (processedLivePoolInfoForCalc.mintA.address.equals(inputMintPk)) { outputMintPk = processedLivePoolInfoForCalc.mintB.address; }
    else if (processedLivePoolInfoForCalc.mintB.address.equals(inputMintPk)) { outputMintPk = processedLivePoolInfoForCalc.mintA.address; }
    else { throw new Error('Pool mints do not include input SOL mint.'); }
    console.log(`[mainnetBuySwap Refactored] Determined Output Mint: ${outputMintPk.toBase58()}`);

    console.log("[mainnetBuySwap Refactored] Calculating minAmountOut via ammSwapCalculator (using transformed data)...");
    const uiPoolReserves: UiPoolReserves | null = getStandardPoolUiData(processedLivePoolInfoForCalc, inputMintPk.toBase58());
    if (!uiPoolReserves) throw new Error('Could not prepare UI pool reserves.');
    const swapQuote: SwapTransactionQuote | null = calculateStandardAmmSwapQuote(buyAmountSOLFloat, true, uiPoolReserves, slippagePercent);
    if (!swapQuote || !swapQuote.minAmountOutRaw || swapQuote.minAmountOutRaw.isZero()) {
        throw new Error('minAmountOut calculation failed.');
    }
    const minAmountOut = swapQuote.minAmountOutRaw;
    console.log(`[mainnetBuySwap Refactored] Calculated minAmountOut: ${minAmountOut.toString()}`);


    console.log("[mainnetBuySwap Refactored] Calling SwapHelpers.createAmmV4SwapTransactionPayload (passing raw SDK pool data)...");
    let swapPayload: MyLiquiditySwapPayload;
    try {
        swapPayload = await createAmmV4SwapTransactionPayload({
            sdk,
            // IMPORTANT: Pass the raw objects from the SDK to SwapHelpers
            poolInfoFromSdk: sdkFetchedPoolDataRaw.poolInfo,
            poolKeysFromSdk: sdkFetchedPoolDataRaw.poolKeys,
            userPublicKey: payer,
            inputTokenMint: inputMintPk,  // This is NATIVE_MINT (PublicKey)
            outputTokenMint: outputMintPk, // This is a PublicKey
            amountIn: amountInLamports,
            minAmountOut: minAmountOut,
        });
    } catch(e: any) {
        // ... (error handling) ...
        throw e;
    }

    // ... (transaction signing and sending logic remains the same) ...
    if (!swapPayload || !swapPayload.transaction) {
        throw new Error("SwapHelpers did not return a valid transaction payload.");
    }
    const transaction: VersionedTransaction = swapPayload.transaction;

    console.log("[mainnetBuySwap Refactored] Requesting wallet to sign main swap transaction...");
    const signedTx = await wallet.signTransaction(transaction);
    if (!signedTx) throw new Error("Main swap transaction not signed by wallet.");

    console.log("[mainnetBuySwap Refactored] Sending raw main swap transaction...");
    const txSignature = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true, maxRetries: 5 });
    console.log(`[mainnetBuySwap Refactored] Main swap transaction sent. Signature: ${txSignature}`);

    console.log("[mainnetBuySwap Refactored] Confirming main swap transaction...");
    const latestBlockhashForConfirmation = await connection.getLatestBlockhashAndContext('confirmed');
    const mainSwapConfirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: transaction.message.recentBlockhash || latestBlockhashForConfirmation.value.blockhash,
        lastValidBlockHeight: latestBlockhashForConfirmation.value.lastValidBlockHeight,
    }, 'confirmed');

    if (mainSwapConfirmation.value.err) {
        throw new Error(`Main swap transaction failed confirmation: ${JSON.stringify(mainSwapConfirmation.value.err)}`);
    }
    console.log(`[mainnetBuySwap Refactored] --- SWAP SUCCESSFUL (FindDecoder Approach) --- Signature: ${txSignature}`);
    return txSignature;
}