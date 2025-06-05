// src/utils/ammSwapCalculator.ts
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';
// We will use 'any' for livePoolInfo for now, or you can import MySdkPoolInfo if paths are set up
// import { MySdkPoolInfo, MyTokenInfoFromSDK } from './SwapHelpers'; // Adjust path as needed

Decimal.set({ precision: 50 });

export interface UiPoolReserves {
    priceFromPool: number;
    uiSolReserve: number;
    uiTokenReserve: number;
    solMintAddress: string;
    solDecimals: number;
    pairedTokenMintAddress: string;
    pairedTokenDecimals: number;
}

export interface SwapTransactionQuote {
    estimatedOutputUi: Decimal;
    priceImpactPercent: Decimal;
    minAmountOutRaw: BN;
    executionPriceUi?: Decimal;
}

// MODIFIED to accept two arguments and work with MySdkPoolInfo structure
export function getStandardPoolUiData(
    livePoolInfo: any, // Expecting an object structured like MySdkPoolInfo
    inputMintForOrientation: string // e.g., NATIVE_MINT.toBase58()
): UiPoolReserves | null {
    const FN_NAME = '[ammSwapCalculator.getStandardPoolUiData]';
    console.log(FN_NAME, 'Called. livePoolInfo ID:', livePoolInfo?.id?.toBase58(), 'InputMintForOrientation:', inputMintForOrientation);

    // Validate livePoolInfo based on MySdkPoolInfo structure
    if (!livePoolInfo || 
        !(livePoolInfo.id instanceof PublicKey) ||
        !(livePoolInfo.mintA?.address instanceof PublicKey) || typeof livePoolInfo.mintA?.decimals !== 'number' ||
        !(livePoolInfo.mintB?.address instanceof PublicKey) || typeof livePoolInfo.mintB?.decimals !== 'number' ||
        !(livePoolInfo.baseReserve instanceof BN) ||
        !(livePoolInfo.quoteReserve instanceof BN) ||
        typeof livePoolInfo.price !== 'number' || isNaN(livePoolInfo.price) // price comes from DiscoveredPoolDetailed via mainnetBuyUtil
       ) {
        console.error(FN_NAME, 'Invalid livePoolInfo or missing essential fields. livePoolInfo received:', livePoolInfo);
        return null;
    }

    const priceFromPool = livePoolInfo.price;

    let uiSolAmount = 0;
    let uiTokenAmount = 0;
    let pairedTokenMintAddr = '';
    let pairedTokenDecs = 0;
    const solDecimals = 9; // NATIVE_MINT.decimals
    const solMintAddress = NATIVE_MINT.toBase58();

    // livePoolInfo.mintA and mintB should be MyTokenInfoFromSDK-like objects
    // with 'address' as PublicKey and 'decimals' as number
    const poolMintAAddressStr = livePoolInfo.mintA.address.toBase58();
    const poolMintBAddressStr = livePoolInfo.mintB.address.toBase58();
    const poolMintADecimals = livePoolInfo.mintA.decimals;
    const poolMintBDecimals = livePoolInfo.mintB.decimals;

    // Reserves are BNs from livePoolInfo (MySdkPoolInfo)
    const baseReserveBN = livePoolInfo.baseReserve as BN;
    const quoteReserveBN = livePoolInfo.quoteReserve as BN;

    // Determine which reserve is SOL and which is the token.
    // inputMintForOrientation is NATIVE_MINT.toBase58() when buying with SOL.
    if (poolMintAAddressStr === inputMintForOrientation && poolMintAAddressStr === solMintAddress) { // Mint A is SOL (input)
        uiSolAmount = parseFloat(new Decimal(baseReserveBN.toString()).div(new Decimal(10).pow(poolMintADecimals)).toString());
        uiTokenAmount = parseFloat(new Decimal(quoteReserveBN.toString()).div(new Decimal(10).pow(poolMintBDecimals)).toString());
        pairedTokenMintAddr = poolMintBAddressStr;
        pairedTokenDecs = poolMintBDecimals;
    } else if (poolMintBAddressStr === inputMintForOrientation && poolMintBAddressStr === solMintAddress) { // Mint B is SOL (input)
        uiSolAmount = parseFloat(new Decimal(quoteReserveBN.toString()).div(new Decimal(10).pow(poolMintBDecimals)).toString());
        uiTokenAmount = parseFloat(new Decimal(baseReserveBN.toString()).div(new Decimal(10).pow(poolMintADecimals)).toString());
        pairedTokenMintAddr = poolMintAAddressStr;
        pairedTokenDecs = poolMintADecimals;
    } else {
        // This case implies inputMintForOrientation is not SOL, or pool doesn't directly pair with the input.
        // For a buy-with-SOL utility, inputMintForOrientation should always be SOL.
        // If pool doesn't have SOL, mainnetBuyUtil should have caught it earlier.
        // This block is more of a safeguard or for other use cases.
        console.warn(FN_NAME, `Pool mints (${poolMintAAddressStr}, ${poolMintBAddressStr}) do not directly match inputMintForOrientation (${inputMintForOrientation}) as SOL. Attempting orientation assuming input is SOL.`);
        if (poolMintAAddressStr === solMintAddress) { // A is SOL, B is token
            uiSolAmount = parseFloat(new Decimal(baseReserveBN.toString()).div(new Decimal(10).pow(poolMintADecimals)).toString());
            uiTokenAmount = parseFloat(new Decimal(quoteReserveBN.toString()).div(new Decimal(10).pow(poolMintBDecimals)).toString());
            pairedTokenMintAddr = poolMintBAddressStr;
            pairedTokenDecs = poolMintBDecimals;
        } else if (poolMintBAddressStr === solMintAddress) { // B is SOL, A is token
            uiSolAmount = parseFloat(new Decimal(quoteReserveBN.toString()).div(new Decimal(10).pow(poolMintBDecimals)).toString());
            uiTokenAmount = parseFloat(new Decimal(baseReserveBN.toString()).div(new Decimal(10).pow(poolMintADecimals)).toString());
            pairedTokenMintAddr = poolMintAAddressStr;
            pairedTokenDecs = poolMintADecimals;
        } else {
            console.error(FN_NAME, 'NATIVE_MINT (SOL) not found in pool mints. Cannot reliably determine SOL reserves.');
            return null;
        }
    }
    
    if (!pairedTokenMintAddr || typeof pairedTokenDecs !== 'number' || pairedTokenDecs < 0 ) {
         console.warn(FN_NAME, 'Paired token mint or decimals could not be determined or are invalid.');
         // Depending on strictness, you might want to return null here.
    }
    // It's possible for a pool to have zero reserves for one side if it's completely drained.
    // if (uiSolAmount <= 0 || uiTokenAmount <= 0) { 
    //     console.warn(FN_NAME, 'Resulting UI reserves are zero or invalid. Pool ID:', livePoolInfo.id.toBase58());
    // }

    console.log(FN_NAME, 'Final UI solAmount for pool:', uiSolAmount, 'Final UI tokenAmount for pool:', uiTokenAmount);
    return { priceFromPool, uiSolReserve: uiSolAmount, uiTokenReserve: uiTokenAmount, solMintAddress, solDecimals, pairedTokenMintAddress: pairedTokenMintAddr, pairedTokenDecimals: pairedTokenDecs };
}

// calculateStandardAmmSwapQuote function remains unchanged from what you provided
export function calculateStandardAmmSwapQuote(
    inputAmountUi: number,
    isInputSol: boolean,
    poolReserves: UiPoolReserves,
    slippagePercent: number
): SwapTransactionQuote | null {
    const FN_NAME = '[ammSwapCalculator.calculateStandardAmmSwapQuote]';
    // console.log(FN_NAME, 'Called. Input UI:', inputAmountUi, 'isInputSol:', isInputSol, 'Slippage%:', slippagePercent, 'PoolReserves:', poolReserves);

    if (!poolReserves || inputAmountUi <= 0 ) {
        console.error(FN_NAME, 'Invalid inputAmount or no poolReserves.');
        return null;
    }
    if (poolReserves.uiSolReserve < 0 || poolReserves.uiTokenReserve < 0) {
         console.error(FN_NAME, 'Negative pool reserves.');
        return null;
    }
    // Allow swap even if one reserve is zero, but not if input reserve is zero.
    // if (poolReserves.uiSolReserve === 0 && poolReserves.uiTokenReserve === 0) {
    //     console.warn(FN_NAME, 'Both pool reserves are zero.');
    //     return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
    // }

    const inputAmountDecimal = new Decimal(inputAmountUi);
    let A0_ui: Decimal, B0_ui: Decimal, outputTokenDecimalsForTx: number;

    if (isInputSol) {
        A0_ui = new Decimal(poolReserves.uiSolReserve);
        B0_ui = new Decimal(poolReserves.uiTokenReserve);
        outputTokenDecimalsForTx = poolReserves.pairedTokenDecimals;
    } else {
        A0_ui = new Decimal(poolReserves.uiTokenReserve);
        B0_ui = new Decimal(poolReserves.uiSolReserve);
        outputTokenDecimalsForTx = poolReserves.solDecimals;
    }
    
    if (A0_ui.isZero() && inputAmountDecimal.gt(0)) {
        console.warn(FN_NAME, 'Input reserve (A0_ui) is zero. Cannot perform swap.');
        return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
    }

    const k = A0_ui.mul(B0_ui); // Constant product k = X * Y
    // Standard AMM formula: amountOut = (Y * amountIn) / (X + amountIn)
    // For AMMv4, Raydium applies fees. The exact fee-adjusted formula is more complex.
    // This calculator provides a basic quote without fees, then applies slippage.
    // A more accurate quote would incorporate the AMM's fee structure (e.g., 0.25%).
    // Let's assume the fee is effectively reducing the output.
    // A common simplification is (AmountIn * Numerator) / Denominator before calculation
    // For Raydium AMMv4, fee is 0.25%, so amountIn effectively becomes amountIn * (1 - 0.0025) = amountIn * 0.9975
    const feeAdjustedInputAmountDecimal = inputAmountDecimal.mul(new Decimal(1).minus(new Decimal(0.0025))); // Assuming 0.25% fee

    const newReserveA_ui = A0_ui.plus(feeAdjustedInputAmountDecimal); // Input amount added to its reserve
    let estimatedOutputUi: Decimal;

    if (newReserveA_ui.isZero()) { // Should only happen if A0 is negative or becomes zero through weird inputs
        estimatedOutputUi = new Decimal(0);
    } else {
        const newReserveB_ui = k.div(newReserveA_ui); // Y' = k / X'
        estimatedOutputUi = B0_ui.minus(newReserveB_ui); // Amount out = Y - Y'
    }
    // console.log(FN_NAME, `k=${k.toString()}, newReserveA_ui=${newReserveA_ui.toString()}, newReserveB_ui=${k.div(newReserveA_ui).toString()}, estimatedOutputUi=${estimatedOutputUi.toString()}`);

    if (estimatedOutputUi.lte(0)) {
        console.warn(FN_NAME, 'Estimated output is zero or negative.');
        return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
    }

    const marketPrice_OutputPerInput = A0_ui.isZero() ? new Decimal(0) : B0_ui.div(A0_ui);
    const executionPrice_OutputPerInput = estimatedOutputUi.div(inputAmountDecimal); // Based on actual input, not fee-adjusted input

    let priceImpactPercent = new Decimal(0);
    if (marketPrice_OutputPerInput.isFinite() && marketPrice_OutputPerInput.gt(0)) {
        priceImpactPercent = marketPrice_OutputPerInput.minus(executionPrice_OutputPerInput).abs().div(marketPrice_OutputPerInput).mul(100);
    } else if (executionPrice_OutputPerInput.isFinite() && executionPrice_OutputPerInput.gt(0)) {
        priceImpactPercent = new Decimal(100); 
    } else if (!marketPrice_OutputPerInput.isZero() || !executionPrice_OutputPerInput.isZero()){
        priceImpactPercent = new Decimal(100);
    }
    // console.log(FN_NAME, `MarketPrice(Out/In)=${marketPrice_OutputPerInput.toString()}, ExecPrice(Out/In)=${executionPrice_OutputPerInput.toString()}, Impact%=${priceImpactPercent.toFixed(2)}`);

    const slippageDecimal = new Decimal(slippagePercent).div(100);
    const minOutputUiAfterSlippage = estimatedOutputUi.mul(new Decimal(1).minus(slippageDecimal));
    
    const minAmountOutRaw = new BN(
        minOutputUiAfterSlippage.isNegative() ? '0' : minOutputUiAfterSlippage.mul(new Decimal(10).pow(outputTokenDecimalsForTx)).floor().toString()
    );
    // console.log(FN_NAME, `minOutputUiAfterSlippage=${minOutputUiAfterSlippage.toString()}, minAmountOutRaw=${minAmountOutRaw.toString()} (using outputDecimals: ${outputTokenDecimalsForTx})`);

    return {
        estimatedOutputUi: estimatedOutputUi.isNegative() ? new Decimal(0) : estimatedOutputUi,
        priceImpactPercent: priceImpactPercent.isFinite() ? priceImpactPercent : new Decimal(100),
        minAmountOutRaw,
        executionPriceUi: executionPrice_OutputPerInput.isNegative() ? new Decimal(0) : executionPrice_OutputPerInput,
    };
}