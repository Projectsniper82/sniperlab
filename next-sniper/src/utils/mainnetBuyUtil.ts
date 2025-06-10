// src/utils/mainnetBuySwap.ts
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import BN from 'bn.js';
import Decimal from 'decimal.js';

import { DiscoveredPoolDetailed } from './poolFinder';
import {
  createAmmV4SwapTransactionPayload,
  MySdkPoolInfo,
  MyLiquiditySwapPayload,
  MyTokenInfoFromSDK,
} from './SwapHelpers';
import {
  getStandardPoolUiData,
  calculateStandardAmmSwapQuote,
  UiPoolReserves,
  SwapTransactionQuote,
} from './ammSwapCalculator';
import { initRaydiumSdkForUser } from './initRaydiumSdk';

import type { Raydium } from '@raydium-io/raydium-sdk-v2';

const toPublicKey = (key: string | PublicKey): PublicKey =>
  typeof key === 'string' ? new PublicKey(key) : key;

const transformTokenInfo = (rawTokenInfo: any, fieldNameForError: string): MyTokenInfoFromSDK => {
  const addressStr = rawTokenInfo?.address?.toString();
  const programIdStr = rawTokenInfo?.programId?.toString();
  const decimalsNum = rawTokenInfo?.decimals;

  if (!addressStr || !programIdStr || typeof decimalsNum !== 'number') {
    console.error(
      `Raw token info for '${fieldNameForError}' is invalid:`,
      rawTokenInfo
    );
    throw new Error(`Invalid raw token info for ${fieldNameForError}.`);
  }
  return {
    address: new PublicKey(addressStr),
    programId: new PublicKey(programIdStr),
    decimals: decimalsNum,
    chainId: rawTokenInfo.chainId,
    logoURI: rawTokenInfo.logoURI || '',
    symbol: rawTokenInfo.symbol || '',
    name: rawTokenInfo.name || '',
    tags: Array.isArray(rawTokenInfo.tags) ? rawTokenInfo.tags : [],
    extensions:
      typeof rawTokenInfo.extensions === 'object' && rawTokenInfo.extensions !== null
        ? rawTokenInfo.extensions
        : {},
  };
};

export async function mainnetBuySwap(
  wallet: any,
  connection: Connection,
  selectedPoolFromFinder: DiscoveredPoolDetailed,
  buyAmountSOLFloat: number,
  slippagePercent: number
): Promise<string> {
  console.log(
    '[mainnetBuySwap] --- Orchestrating AMM V4 Buy Swap (SOL → Token) ---'
  );

  const payer: PublicKey = toPublicKey(wallet.publicKey);
  const amountInLamports = new BN(
    new Decimal(buyAmountSOLFloat).mul(1e9).toFixed(0)
  );
  const inputMintPk = NATIVE_MINT; // SOL
  console.log(`[mainnetBuySwap] Input SOL lamports: ${amountInLamports.toString()}`);

  console.log('[mainnetBuySwap] Initializing SDK...');
  const sdk: Raydium = await initRaydiumSdkForUser(connection, payer);

  console.log(`[mainnetBuySwap] Fetching live pool data (ID: ${selectedPoolFromFinder.id})`);
  let sdkFetchedPoolDataRaw: any;
  try {
    sdkFetchedPoolDataRaw = await sdk.liquidity.getPoolInfoFromRpc({
      poolId: selectedPoolFromFinder.id,
    });
    if (!sdkFetchedPoolDataRaw?.poolInfo || !sdkFetchedPoolDataRaw?.poolKeys) {
      throw new Error("getPoolInfoFromRpc failed to return both poolInfo and poolKeys.");
    }
    console.log(
      '[mainnetBuySwap DEBUG] Raw poolInfo:', 
      JSON.stringify(sdkFetchedPoolDataRaw.poolInfo, null, 2)
    );
    console.log(
      '[mainnetBuySwap DEBUG] Raw poolKeys:',
      JSON.stringify(sdkFetchedPoolDataRaw.poolKeys, null, 2)
    );
  } catch (e: any) {
    console.error(`[mainnetBuySwap] RPC fetch error: ${e.message}`, e);
    throw e;
  }

  // Transform raw SDK poolInfo into MySdkPoolInfo for the calculator
  const rawPoolInfoForCalc = sdkFetchedPoolDataRaw.poolInfo;
  const rawPoolKeysForCalc = sdkFetchedPoolDataRaw.poolKeys;
  const lpMintFromInfo = transformTokenInfo(rawPoolInfoForCalc.lpMint, 'poolInfo.lpMint');
  const lpAmountNumber = parseFloat(rawPoolInfoForCalc.lpAmount);
  if (isNaN(lpAmountNumber) || typeof rawPoolInfoForCalc.lpMint?.decimals !== 'number') {
    throw new Error('Invalid lpAmount or lpMint.decimals in rawPoolInfo.');
  }

  const processedLivePoolInfoForCalc: MySdkPoolInfo = {
    id: new PublicKey(rawPoolInfoForCalc.id),
    version: parseInt(rawPoolInfoForCalc.version.toString(), 10),
    status: new BN(rawPoolInfoForCalc.status.toString()),
    programId: new PublicKey(rawPoolInfoForCalc.programId),
    mintA: transformTokenInfo(rawPoolInfoForCalc.mintA, 'poolInfo.mintA'),
    mintB: transformTokenInfo(rawPoolInfoForCalc.mintB, 'poolInfo.mintB'),
    lpMint: lpMintFromInfo,
    baseReserve: new BN(rawPoolInfoForCalc.baseReserve.toString()),
    quoteReserve: new BN(rawPoolInfoForCalc.quoteReserve.toString()),
    lpSupply: new BN(
      String(Math.floor(lpAmountNumber * Math.pow(10, lpMintFromInfo.decimals)))
    ),
    openTime: new BN(rawPoolInfoForCalc.openTime.toString()),
    marketId: new PublicKey(rawPoolInfoForCalc.marketId),
    fees: {
      swapFeeNumerator: new BN(
        rawPoolInfoForCalc.fees?.swapFeeNumerator?.toString() ||
          Math.round(parseFloat(rawPoolInfoForCalc.feeRate) * 10000)
      ),
      swapFeeDenominator: new BN(rawPoolInfoForCalc.fees?.swapFeeDenominator?.toString() || '10000'),
      hostFeeNumerator: new BN(rawPoolInfoForCalc.fees?.hostFeeNumerator?.toString() || '0'),
      hostFeeDenominator: new BN(rawPoolInfoForCalc.fees?.hostFeeDenominator?.toString() || '0'),
    },
    authority: new PublicKey(rawPoolKeysForCalc.authority),
    openOrders: new PublicKey(rawPoolKeysForCalc.openOrders),
    targetOrders: new PublicKey(rawPoolKeysForCalc.targetOrders),
    baseVault: new PublicKey(rawPoolKeysForCalc.vault.A),
    quoteVault: new PublicKey(rawPoolKeysForCalc.vault.B),
    configId: rawPoolInfoForCalc.configId
      ? new PublicKey(rawPoolInfoForCalc.configId)
      : undefined,
    baseDecimals: rawPoolInfoForCalc.mintA.decimals,
    quoteDecimals: rawPoolInfoForCalc.mintB.decimals,
    lpDecimals: rawPoolInfoForCalc.lpMint.decimals,
    price: parseFloat(rawPoolInfoForCalc.price),
  };

  // Determine which side of the pool is SOL
  let outputMintPk: PublicKey;
  if (processedLivePoolInfoForCalc.mintA.address.equals(inputMintPk)) {
    outputMintPk = processedLivePoolInfoForCalc.mintB.address;
  } else if (processedLivePoolInfoForCalc.mintB.address.equals(inputMintPk)) {
    outputMintPk = processedLivePoolInfoForCalc.mintA.address;
  } else {
    throw new Error('Pool mints do not include SOL on the A or B side.');
  }
  console.log(`[mainnetBuySwap] Output mint (Token) = ${outputMintPk.toBase58()}`);

  console.log('[mainnetBuySwap] Calculating minAmountOut via ammSwapCalculator...');
  const uiPoolReserves: UiPoolReserves | null = getStandardPoolUiData(
    processedLivePoolInfoForCalc,
    inputMintPk.toBase58()
  );
  if (!uiPoolReserves) {
    throw new Error('Could not prepare UI pool reserves for calculation.');
  }
  const swapQuote: SwapTransactionQuote | null = calculateStandardAmmSwapQuote(
    buyAmountSOLFloat,
    true,
    uiPoolReserves,
    slippagePercent
  );
  if (!swapQuote?.minAmountOutRaw || swapQuote.minAmountOutRaw.isZero()) {
    throw new Error('minAmountOut calculation failed or yielded zero.');
  }
  const minAmountOut = swapQuote.minAmountOutRaw;
  console.log(`[mainnetBuySwap] minAmountOut = ${minAmountOut.toString()} (lamports of Token)`);

  console.log('[mainnetBuySwap] Calling SwapHelpers.createAmmV4SwapTransactionPayload()...');
  let swapPayload: MyLiquiditySwapPayload;
  try {
    swapPayload = await createAmmV4SwapTransactionPayload({
      sdk,
      poolInfoFromSdk: sdkFetchedPoolDataRaw.poolInfo,
      poolKeysFromSdk: sdkFetchedPoolDataRaw.poolKeys,
      userPublicKey: payer,
      inputTokenMint: inputMintPk,
      outputTokenMint: outputMintPk,
      amountIn: amountInLamports,
      minAmountOut,
    });
  } catch (e: any) {
    console.error('[mainnetBuySwap] createAmmV4SwapTransactionPayload error:', e);
    throw e;
  }

  if (!swapPayload?.transaction) {
    throw new Error('SwapHelpers did not return a valid transaction.');
  }
  const transaction: VersionedTransaction = swapPayload.transaction;

  console.log('[mainnetBuySwap] Requesting wallet to sign buy transaction...');
  const signedTx = await wallet.signTransaction(transaction);
  if (!signedTx) {
    throw new Error('Buy transaction not signed by wallet.');
  }

  console.log('[mainnetBuySwap] Sending raw buy transaction...');
  const txSignature = await connection.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: true,
    maxRetries: 5,
  });
  console.log(`[mainnetBuySwap] Sent. Signature = ${txSignature}`);

  console.log('[mainnetBuySwap] Confirming buy transaction...');
  const latestBlockhashForConfirmation = await connection.getLatestBlockhashAndContext('confirmed');
  const confirmation = await connection.confirmTransaction(
    {
      signature: txSignature,
      blockhash: transaction.message.recentBlockhash || latestBlockhashForConfirmation.value.blockhash,
      lastValidBlockHeight: latestBlockhashForConfirmation.value.lastValidBlockHeight,
    },
    'confirmed'
  );
  if (confirmation.value.err) {
    throw new Error(`Buy transaction failed: ${JSON.stringify(confirmation.value.err)}`);
  }
  console.log(`[mainnetBuySwap] SWAP SUCCESSFUL. Signature = ${txSignature}`);
  return txSignature;
}
