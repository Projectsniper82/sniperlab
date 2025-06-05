// src/utils/mainnetBuyUtil.ts
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
    MySdkPoolInfo,
    MyAmmV4Keys,
    MyLiquiditySwapPayload,
    MyTokenInfoFromSDK
} from './SwapHelpers';
import {
    getStandardPoolUiData,
    calculateStandardAmmSwapQuote,
    UiPoolReserves,
    SwapTransactionQuote
} from './ammSwapCalculator';
// Import the new SDK initialization function
import { initRaydiumSdkForUser } from './initRaydiumSdk'; // Changed import
import type { Raydium } from '@raydium-io/raydium-sdk-v2';

const toPublicKey = (key: string | PublicKey): PublicKey => typeof key === 'string' ? new PublicKey(key) : key;

const transformTokenInfo = (rawTokenInfo: any, fieldNameForError: string): MyTokenInfoFromSDK => {
    // ... (transformTokenInfo function remains the same as previously provided)
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
    wallet: any, // Your wallet object with publicKey and signTransaction method
    connection: Connection, // This connection from NetworkContext (SHOULD BE HELIUS)
    selectedPoolFromFinder: DiscoveredPoolDetailed,
    buyAmountSOLFloat: number,
    slippagePercent: number
): Promise<string> {
    console.log('[mainnetBuySwap Refactored] --- Orchestrating AMM V4 Buy Swap ---');

    const payer: PublicKey = toPublicKey(wallet.publicKey); // This is the user's PublicKey
    const amountInLamports = new BN(new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0));
    const inputMintPk = NATIVE_MINT;

    console.log(`[mainnetBuySwap Refactored] Payer: ${payer.toBase58()}`);
    console.log(`[mainnetBuySwap Refactored] Target Pool ID: ${selectedPoolFromFinder.id}`);

    if (selectedPoolFromFinder.programId !== "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8") {
        throw new Error(`This utility is for AMM V4 pools. Program ID mismatch: ${selectedPoolFromFinder.programId}`);
    }

    // 1. Initialize SDK with the user's connection and public key as owner
    console.log(`[mainnetBuySwap] Initializing SDK with connection from NetworkContext (RPC: ${connection.rpcEndpoint}) and payer: ${payer.toBase58()}`);
    const sdk: Raydium = await initRaydiumSdkForUser(connection, payer); // Pass user's connection and PK

    if (!sdk || !sdk.liquidity || !sdk.liquidity.getPoolInfoFromRpc) {
        throw new Error('Raydium SDK instance or getPoolInfoFromRpc not available!');
    }

    // 2. Fetch Live Pool Data (uses the connection the SDK was initialized with)
    console.log(`[mainnetBuySwap Refactored] Fetching live pool data for ID: ${selectedPoolFromFinder.id}`);
    let sdkFetchedPoolDataRaw: any;
    try {
        sdkFetchedPoolDataRaw = await sdk.liquidity.getPoolInfoFromRpc({ poolId: selectedPoolFromFinder.id });
        if (!sdkFetchedPoolDataRaw || !sdkFetchedPoolDataRaw.poolInfo || !sdkFetchedPoolDataRaw.poolKeys) {
            throw new Error("SDK's getPoolInfoFromRpc failed to return poolInfo and poolKeys.");
        }
    } catch (e: any) {
        console.error(`Error fetching pool info from RPC for pool ${selectedPoolFromFinder.id}: ${e.message || 'Unknown RPC error'}`, e);
        throw e;
    }

    const rawPoolInfoFromSDK = sdkFetchedPoolDataRaw.poolInfo;
    const rawPoolKeysFromSDK = sdkFetchedPoolDataRaw.poolKeys;

    // --- Transform raw SDK data (same as before) ---
    const lpMintFromInfo = transformTokenInfo(rawPoolInfoFromSDK.lpMint, 'poolInfo.lpMint');
    const lpAmountNumber = parseFloat(rawPoolInfoFromSDK.lpAmount);
    if (isNaN(lpAmountNumber) || typeof rawPoolInfoFromSDK.lpMint?.decimals !== 'number') {
        throw new Error('lpAmount or lpMint.decimals from rawPoolInfo is invalid or missing for lpSupply calculation.');
    }

    const processedLivePoolInfo: MySdkPoolInfo = {
        id: new PublicKey(rawPoolInfoFromSDK.id),
        version: parseInt(rawPoolInfoFromSDK.version, 10),
        status: new BN(rawPoolInfoFromSDK.status.toString()),
        programId: new PublicKey(rawPoolInfoFromSDK.programId),
        mintA: transformTokenInfo(rawPoolInfoFromSDK.mintA, 'poolInfo.mintA'),
        mintB: transformTokenInfo(rawPoolInfoFromSDK.mintB, 'poolInfo.mintB'),
        lpMint: lpMintFromInfo,
        baseReserve: new BN(rawPoolInfoFromSDK.baseReserve.toString()),
        quoteReserve: new BN(rawPoolInfoFromSDK.quoteReserve.toString()),
        lpSupply: new BN(String(Math.floor(lpAmountNumber * Math.pow(10, lpMintFromInfo.decimals)))),
        openTime: new BN(rawPoolInfoFromSDK.openTime.toString()),
        marketId: new PublicKey(rawPoolInfoFromSDK.marketId),
        fees: {
            swapFeeNumerator: new BN(rawPoolInfoFromSDK.fees?.swapFeeNumerator?.toString() || Math.round(parseFloat(rawPoolInfoFromSDK.feeRate) * 10000)),
            swapFeeDenominator: new BN(rawPoolInfoFromSDK.fees?.swapFeeDenominator?.toString() || 10000),
            hostFeeNumerator: new BN(rawPoolInfoFromSDK.fees?.hostFeeNumerator?.toString() || '0'),
            hostFeeDenominator: new BN(rawPoolInfoFromSDK.fees?.hostFeeDenominator?.toString() || '0'),
        },
        authority: new PublicKey(rawPoolKeysFromSDK.authority),
        openOrders: new PublicKey(rawPoolKeysFromSDK.openOrders),
        targetOrders: new PublicKey(rawPoolKeysFromSDK.targetOrders),
        baseVault: new PublicKey(rawPoolKeysFromSDK.vault.A),
        quoteVault: new PublicKey(rawPoolKeysFromSDK.vault.B),
        configId: rawPoolInfoFromSDK.configId ? new PublicKey(rawPoolInfoFromSDK.configId) : undefined,
        baseDecimals: rawPoolInfoFromSDK.mintA.decimals,
        quoteDecimals: rawPoolInfoFromSDK.mintB.decimals,
        lpDecimals: rawPoolInfoFromSDK.lpMint.decimals,
        price: parseFloat(rawPoolInfoFromSDK.price),
    };

    const processedLivePoolKeys: MyAmmV4Keys = {
        id: new PublicKey(rawPoolKeysFromSDK.id),
        programId: new PublicKey(rawPoolKeysFromSDK.programId),
        baseMint: new PublicKey(rawPoolKeysFromSDK.mintA.address),
        quoteMint: new PublicKey(rawPoolKeysFromSDK.mintB.address),
        lpMint: new PublicKey(rawPoolKeysFromSDK.mintLp.address),
        version: parseInt(rawPoolInfoFromSDK.version, 10),
        authority: new PublicKey(rawPoolKeysFromSDK.authority),
        openOrders: new PublicKey(rawPoolKeysFromSDK.openOrders),
        targetOrders: new PublicKey(rawPoolKeysFromSDK.targetOrders),
        baseVault: new PublicKey(rawPoolKeysFromSDK.vault.A),
        quoteVault: new PublicKey(rawPoolKeysFromSDK.vault.B),
        marketProgramId: new PublicKey(rawPoolKeysFromSDK.marketProgramId),
        marketId: new PublicKey(rawPoolKeysFromSDK.marketId),
        marketAuthority: new PublicKey(rawPoolKeysFromSDK.marketAuthority),
        marketBaseVault: new PublicKey(rawPoolKeysFromSDK.marketBaseVault),
        marketQuoteVault: new PublicKey(rawPoolKeysFromSDK.marketQuoteVault),
        marketBids: new PublicKey(rawPoolKeysFromSDK.marketBids),
        marketAsks: new PublicKey(rawPoolKeysFromSDK.marketAsks),
        marketEventQueue: new PublicKey(rawPoolKeysFromSDK.marketEventQueue),
    };
    // --- End Data Transformation ---

    // 3. Determine Output Mint (same as before)
    let outputMintPk: PublicKey;
    const sdkMintA_pk = processedLivePoolInfo.mintA.address;
    const sdkMintB_pk = processedLivePoolInfo.mintB.address;
    if (sdkMintA_pk.equals(inputMintPk)) { outputMintPk = sdkMintB_pk;}
    else if (sdkMintB_pk.equals(inputMintPk)) { outputMintPk = sdkMintA_pk;}
    else { throw new Error('SDK pool mints (after processing) do not include input SOL mint.'); }
    console.log(`[mainnetBuySwap Refactored] Determined Output Mint: ${outputMintPk.toBase58()}`);

    // 4. Calculate minAmountOut (same as before, assuming getStandardPoolUiData is fixed)
    console.log("[mainnetBuySwap Refactored] Calculating minAmountOut via ammSwapCalculator...");
    const uiPoolReserves: UiPoolReserves | null = getStandardPoolUiData(processedLivePoolInfo, inputMintPk.toBase58());
    if (!uiPoolReserves) throw new Error('Could not prepare UI pool reserves for calculation.');
    const swapQuote: SwapTransactionQuote | null = calculateStandardAmmSwapQuote(buyAmountSOLFloat, true, uiPoolReserves, slippagePercent);
    if (!swapQuote || !swapQuote.minAmountOutRaw || swapQuote.minAmountOutRaw.isZero()) {
        throw new Error('Manual minAmountOut calculation resulted in zero or failed.');
    }
    const minAmountOut = swapQuote.minAmountOutRaw;
    console.log(`[mainnetBuySwap Refactored] Manually Calculated minAmountOut: ${minAmountOut.toString()}`);

    // 5. Call SwapHelpers to get the transaction payload (same as before)
    console.log("[mainnetBuySwap Refactored] Calling SwapHelpers.createAmmV4SwapTransactionPayload...");
    let swapPayload: MyLiquiditySwapPayload;
    try {
        swapPayload = await createAmmV4SwapTransactionPayload({
            sdk, // This SDK instance is now initialized with the user's context
            poolInfo: processedLivePoolInfo,
            poolKeys: processedLivePoolKeys,
            userPublicKey: payer, // This is passed to SwapHelpers
            inputTokenMint: inputMintPk,
            outputTokenMint: outputMintPk,
            amountIn: amountInLamports,
            minAmountOut: minAmountOut,
        });
    } catch(e: any) {
        console.error(`SwapHelper createAmmV4SwapTransactionPayload failed: ${e.message || 'Unknown error'}`, e);
        throw e;
    }

    if (!swapPayload || !swapPayload.transaction) {
        throw new Error("SwapHelpers did not return a valid transaction payload.");
    }
    const transaction: VersionedTransaction = swapPayload.transaction;

    // 6. Sign and Send Transaction (same as before)
    console.log("[mainnetBuySwap Refactored] Requesting wallet to sign transaction...");
    const signedTx = await wallet.signTransaction(transaction);
    if (!signedTx) throw new Error("Transaction not signed by wallet.");

    console.log("[mainnetBuySwap Refactored] Sending raw transaction...");
    const txSignature = await connection.sendRawTransaction(signedTx.serialize()); // Uses Helius connection
    console.log(`[mainnetBuySwap Refactored] Transaction sent. Signature: ${txSignature}`);

    console.log("[mainnetBuySwap Refactored] Confirming transaction...");
    const { value: rpcBlockhashContext } = await connection.getLatestBlockhashAndContext('confirmed');
    const confirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: transaction.message.recentBlockhash || rpcBlockhashContext.blockhash,
        lastValidBlockHeight: transaction.message.recentBlockhash ?
            (await connection.getBlockHeight('confirmed')) :
            rpcBlockhashContext.lastValidBlockHeight,
    }, 'confirmed');

    if (confirmation.value.err) {
        throw new Error(`Transaction failed confirmation: ${JSON.stringify(confirmation.value.err)}`);
    }
    console.log(`[mainnetBuySwap Refactored] --- SWAP SUCCESSFUL --- Signature: ${txSignature}`);
    return txSignature;
}