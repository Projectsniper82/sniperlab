// src/utils/SwapHelpers.ts
import { PublicKey, VersionedTransaction, Signer } from '@solana/web3.js';
import BN from 'bn.js';
import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { NATIVE_MINT, getAssociatedTokenAddressSync } from '@solana/spl-token';

// --- Custom Interface Definitions ---
export interface MyTokenInfoFromSDK {
  chainId?: number;
  address: PublicKey;
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
  fees: {
    swapFeeNumerator: BN;
    swapFeeDenominator: BN;
    hostFeeNumerator: BN;
    hostFeeDenominator: BN;
  };
  authority: PublicKey;
  openOrders: PublicKey;
  targetOrders: PublicKey;
  baseVault: PublicKey;
  quoteVault: PublicKey;
  configId?: PublicKey;
  baseDecimals?: number;
  quoteDecimals?: number;
  lpDecimals?: number;
  price?: number;
  tvl?: number;
}
export interface MyAmmV4Keys {
  id: PublicKey;
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
  configId?: PublicKey;
}
export interface MyLiquiditySwapPayload {
  transaction: VersionedTransaction;
  signers?: Signer[];
}

// Interface for parameters to `createAmmV4SwapTransactionPayload`
export interface CreateAmmV4SwapPayloadParams {
  sdk: Raydium;
  poolInfoFromSdk: any;  // raw SDK `poolInfo`
  poolKeysFromSdk: any;  // raw SDK `poolKeys`
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
    // @ts-ignore - PublicKey objects are accepted by the SDK
    inputMint: inputTokenMint,
    // @ts-ignore
    outputMint: outputTokenMint,
    amountIn,
    amountOut: minAmountOut,
    fixedSide: 'in',
    txVersion: TxVersion.V0,
    computeBudgetConfig: {
      units: 400000,
      microLamports: 1000, // keep priority fee low for testing
    },
    owner: userPublicKey,
    config: {
      associatedOnly: true,
      inputUseSolBalance: isInputSol,
      outputUseSolBalance: isOutputSol,
    },
    // userKeys will be set (or omitted) below
  };

  if (isInputSol) {
    // --- BUY PATH (SOL → Token) ---
    // When input is SOL, the SDK will derive all ATA accounts for you.
    console.log('[SwapHelpers] BUY path: Input is SOL. Letting SDK derive ATAs.');
    swapFunctionParams.userKeys = undefined;
  } else {
    // --- SELL PATH (Token → SOL) ---
    // You must pass in your ATA addresses explicitly to avoid "insufficient funds" errors.
    const userInputTokenAccount = getAssociatedTokenAddressSync(inputTokenMint, userPublicKey, false);
    const userOutputTokenAccount = getAssociatedTokenAddressSync(outputTokenMint, userPublicKey, false);

    console.log(`[SwapHelpers] SELL path: Derived User Input ATA: ${userInputTokenAccount.toBase58()}`);
    console.log(`[SwapHelpers] SELL path: Derived User Output ATA: ${userOutputTokenAccount.toBase58()}`);

    swapFunctionParams.userKeys = {
      inputTokenAccount: userInputTokenAccount,
      outputTokenAccount: userOutputTokenAccount,
    };
  }

  console.log(
    '[SwapHelpers] DEBUG: Final parameters for sdk.liquidity.swap:',
    JSON.stringify(
      swapFunctionParams,
      (key, value) =>
        value instanceof PublicKey
          ? value.toBase58()
          : value instanceof BN
          ? value.toString()
          : (key === 'poolInfo' || key === 'poolKeys')
          ? '[Object – see mainnetBuy/mainnetSell logs]'
          : value,
      2
    )
  );

  try {
    const swapPayloadFromSDK = await sdk.liquidity.swap(swapFunctionParams);
    console.log('[SwapHelpers] Payload from sdk.liquidity.swap received successfully.');
    return {
      transaction: swapPayloadFromSDK.transaction as VersionedTransaction,
      signers: swapPayloadFromSDK.signers as Signer[] | undefined,
    };
  } catch (error) {
    console.error('[SwapHelpers] Error calling sdk.liquidity.swap:', error);
    throw error;
  }
}
