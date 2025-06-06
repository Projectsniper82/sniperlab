// src/utils/mainnetSellSwap.ts
import {
    Connection,
    PublicKey,
    VersionedTransaction,
} from '@solana/web3.js';
import { 
    NATIVE_MINT, 
} from '@solana/spl-token';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { DiscoveredPoolDetailed } from './poolFinder';
import {
    createAmmV4SwapTransactionPayload,
    MySdkPoolInfo, // Using your existing interfaces for consistency with calculator
    MyAmmV4Keys,
    MyLiquiditySwapPayload,
    MyTokenInfoFromSDK
} from './SwapHelpers'; // Ensure SwapHelpers is the version that uses raw SDK pool data
import {
    getStandardPoolUiData,
    calculateStandardAmmSwapQuote,
    UiPoolReserves,
    SwapTransactionQuote
} from './ammSwapCalculator';
import { initRaydiumSdkForUser } from './initRaydiumSdk';

import type { Raydium } from '@raydium-io/raydium-sdk-v2';

const toPublicKey = (key: string | PublicKey): PublicKey => typeof key === 'string' ? new PublicKey(key) : key;

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


export async function mainnetSellSwap(
    wallet: any, 
    connection: Connection,
    selectedPoolFromFinder: DiscoveredPoolDetailed | null,
    sellAmountTokenFloat: number, 
    slippagePercent: number,
    inputTokenActualMint: string 
): Promise<string> {
    console.log('[mainnetSellSwap] --- Orchestrating AMM V4 Sell Swap (Token for SOL, FindDecoder Approach) ---');

    if (!selectedPoolFromFinder) {
        throw new Error("No pool selected for the sell swap.");
    }
    if (sellAmountTokenFloat <= 0) {
        throw new Error("Sell amount must be greater than zero.");
    }
    if (!inputTokenActualMint || typeof inputTokenActualMint !== 'string') {
        throw new Error("Input token mint address (string) is required for selling.");
    }

    const payer: PublicKey = toPublicKey(wallet.publicKey);
    const inputTokenMintPk = new PublicKey(inputTokenActualMint); 
    const outputTokenMintPk = NATIVE_MINT; // Output is SOL (via WSOL)

    console.log(`[mainnetSellSwap] Payer: ${payer.toBase58()}`);
    console.log(`[mainnetSellSwap] Target Pool ID: ${selectedPoolFromFinder.id}`);
    console.log(`[mainnetSellSwap] Selling Token Mint: ${inputTokenMintPk.toBase58()}`);
    console.log(`[mainnetSellSwap] Receiving Mint (SOL/WSOL): ${outputTokenMintPk.toBase58()}`);
    console.log(`[mainnetSellSwap] Sell Amount (Tokens): ${sellAmountTokenFloat}`);

    if (selectedPoolFromFinder.programId !== "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8") {
        throw new Error(`This utility is for AMM V4 pools. Program ID mismatch: ${selectedPoolFromFinder.programId}`);
    }

    console.log(`[mainnetSellSwap] Initializing SDK with connection (RPC: ${connection.rpcEndpoint}) and payer: ${payer.toBase58()}`);
    const sdk: Raydium = await initRaydiumSdkForUser(connection, payer);

    if (!sdk || !sdk.liquidity || !sdk.liquidity.getPoolInfoFromRpc || !sdk.liquidity.swap) {
        throw new Error('Raydium SDK instance or required liquidity functions not available!');
    }

    console.log(`[mainnetSellSwap] Fetching live pool data for ID: ${selectedPoolFromFinder.id}`);
    let sdkFetchedPoolDataRaw: any;
    try {
        sdkFetchedPoolDataRaw = await sdk.liquidity.getPoolInfoFromRpc({ poolId: selectedPoolFromFinder.id });
        if (!sdkFetchedPoolDataRaw || !sdkFetchedPoolDataRaw.poolInfo || !sdkFetchedPoolDataRaw.poolKeys) {
            throw new Error("SDK's getPoolInfoFromRpc failed to return poolInfo and poolKeys.");
        }
        console.log("[mainnetSellSwap DEBUG] Raw poolInfo direct from SDK:", JSON.stringify(sdkFetchedPoolDataRaw.poolInfo, null, 2));
        // *** CORRECTED LINE BELOW ***
        console.log("[mainnetSellSwap DEBUG] Raw poolKeys direct from SDK:", JSON.stringify(sdkFetchedPoolDataRaw.poolKeys, null, 2));
    } catch (e: any) {
        console.error(`Error fetching pool info from RPC for pool ${selectedPoolFromFinder.id}: ${e.message || 'Unknown RPC error'}`, e);
        throw e;
    }

    const rawPoolInfoForCalc = sdkFetchedPoolDataRaw.poolInfo;
    const rawPoolKeysForCalc = sdkFetchedPoolDataRaw.poolKeys;

    let inputTokenDecimals: number;
    const poolMintA = new PublicKey(rawPoolInfoForCalc.mintA.address);
    const poolMintB = new PublicKey(rawPoolInfoForCalc.mintB.address);

    if (poolMintA.equals(inputTokenMintPk)) {
        inputTokenDecimals = rawPoolInfoForCalc.mintA.decimals;
    } else if (poolMintB.equals(inputTokenMintPk)) {
        inputTokenDecimals = rawPoolInfoForCalc.mintB.decimals;
    } else {
        throw new Error(`Input token mint ${inputTokenMintPk.toBase58()} not found in the selected pool's mints (A: ${poolMintA.toBase58()}, B: ${poolMintB.toBase58()}).`);
    }
    console.log(`[mainnetSellSwap] Input Token Decimals: ${inputTokenDecimals}`);
    const amountInLamports = new BN(new Decimal(sellAmountTokenFloat).mul(Math.pow(10, inputTokenDecimals)).toFixed(0));
    console.log(`[mainnetSellSwap] Sell Amount (Lamports of input token): ${amountInLamports.toString()}`);

    const lpMintFromInfo = transformTokenInfo(rawPoolInfoForCalc.lpMint, 'poolInfo.lpMint');
    const lpAmountNumber = parseFloat(rawPoolInfoForCalc.lpAmount);
    if (isNaN(lpAmountNumber) || typeof rawPoolInfoForCalc.lpMint?.decimals !== 'number') {
        throw new Error('lpAmount or lpMint.decimals from rawPoolInfo is invalid or missing for lpSupply calculation.');
    }
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

    console.log("[mainnetSellSwap] Calculating minAmountOut (SOL) via ammSwapCalculator...");
    const uiPoolReserves: UiPoolReserves | null = getStandardPoolUiData(processedLivePoolInfoForCalc, inputTokenMintPk.toBase58());
    if (!uiPoolReserves) throw new Error('Could not prepare UI pool reserves for calculation.');

    const swapQuote: SwapTransactionQuote | null = calculateStandardAmmSwapQuote(sellAmountTokenFloat, false, uiPoolReserves, slippagePercent);
    if (!swapQuote || !swapQuote.minAmountOutRaw || swapQuote.minAmountOutRaw.isZero()) {
        throw new Error('Manual minAmountOut (SOL) calculation resulted in zero or failed.');
    }
    const minAmountOutLamports = swapQuote.minAmountOutRaw;
    console.log(`[mainnetSellSwap] Calculated minAmountOut (SOL lamports): ${minAmountOutLamports.toString()}`);

    console.log("[mainnetSellSwap] Calling SwapHelpers.createAmmV4SwapTransactionPayload (Token for SOL)...");
    let swapPayload: MyLiquiditySwapPayload;
    try {
        swapPayload = await createAmmV4SwapTransactionPayload({
            sdk,
            poolInfoFromSdk: sdkFetchedPoolDataRaw.poolInfo,
            poolKeysFromSdk: sdkFetchedPoolDataRaw.poolKeys,
            userPublicKey: payer,
            inputTokenMint: inputTokenMintPk,
            outputTokenMint: outputTokenMintPk,
            amountIn: amountInLamports,
            minAmountOut: minAmountOutLamports,
        });
    } catch(e: any) {
        console.error(`SwapHelper createAmmV4SwapTransactionPayload failed: ${e.message || 'Unknown error'}`, e);
        throw e;
    }

    if (!swapPayload || !swapPayload.transaction) {
        throw new Error("SwapHelpers did not return a valid transaction payload.");
    }
    const transaction: VersionedTransaction = swapPayload.transaction;

    console.log("[mainnetSellSwap] Requesting wallet to sign main sell transaction...");
    const signedTx = await wallet.signTransaction(transaction);
    if (!signedTx) throw new Error("Main sell transaction not signed by wallet.");

    console.log("[mainnetSellSwap] Sending raw main sell transaction...");
    const txSignature = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true, maxRetries: 5 });
    console.log(`[mainnetSellSwap] Main sell transaction sent. Signature: ${txSignature}`);

    console.log("[mainnetSellSwap] Confirming main sell transaction...");
    const latestBlockhashForConfirmation = await connection.getLatestBlockhashAndContext('confirmed');
    const mainSwapConfirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: transaction.message.recentBlockhash || latestBlockhashForConfirmation.value.blockhash,
        lastValidBlockHeight: latestBlockhashForConfirmation.value.lastValidBlockHeight,
    }, 'confirmed');

    if (mainSwapConfirmation.value.err) {
        throw new Error(`Main sell transaction failed confirmation: ${JSON.stringify(mainSwapConfirmation.value.err)}`);
    }
    console.log(`[mainnetSellSwap] --- SELL SWAP SUCCESSFUL (Token for SOL) --- Signature: ${txSignature}`);
    return txSignature;
}