// src/utils/ammSwapCalculator.ts
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { DiscoveredPoolDetailed } from '@/utils/poolFinder'; // Ensure this path is correct

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

export function getStandardPoolUiData( // Renamed from getProcessedPoolReserves for clarity
    selectedPool: DiscoveredPoolDetailed | null
): UiPoolReserves | null {
    const FN_NAME = '[ammSwapCalculator.getStandardPoolUiData]';
    console.log(FN_NAME, 'Called. SelectedPool ID:', selectedPool?.id, 'Price:', selectedPool?.price);

    if (!selectedPool || !selectedPool.rawSdkPoolInfo || typeof selectedPool.price !== 'number' || isNaN(selectedPool.price)) {
        console.error(FN_NAME, 'Invalid selectedPool or missing essential price/rawSdkPoolInfo.');
        return null;
    }

    const rawInfo = selectedPool.rawSdkPoolInfo as any;
    const priceFromPool = selectedPool.price;

    let uiSolAmount = 0;
    let uiTokenAmount = 0;
    let pairedTokenMintAddr = '';
    let pairedTokenDecs = 0;
    const solDecimals = 9;
    const solMintAddress = NATIVE_MINT.toBase58();

    const poolMintAData = rawInfo?.mintA;
    const poolMintBData = rawInfo?.mintB;
    
    const poolMintAAddressStr = typeof poolMintAData?.address === 'string' ? poolMintAData.address : poolMintAData?.address?.toBase58();
    const poolMintBAddressStr = typeof poolMintBData?.address === 'string' ? poolMintBData.address : poolMintBData?.address?.toBase58();
    const poolMintADecimals = poolMintAData?.decimals;
    const poolMintBDecimals = poolMintBData?.decimals;

    console.log(FN_NAME, 'Pool Mint A Addr:', poolMintAAddressStr, 'Pool Mint A Decimals:', poolMintADecimals);
    console.log(FN_NAME, 'Pool Mint B Addr:', poolMintBAddressStr, 'Pool Mint B Decimals:', poolMintBDecimals);

    if (typeof rawInfo?.mintAmountA === 'number' && typeof rawInfo?.mintAmountB === 'number') {
        console.log(FN_NAME, 'Detected Mainnet-like SDK structure (mintAmountA/B are UI numbers).');
        if (poolMintAAddressStr === solMintAddress && typeof poolMintBDecimals === 'number') {
            uiSolAmount = rawInfo.mintAmountA;
            uiTokenAmount = rawInfo.mintAmountB;
            pairedTokenMintAddr = poolMintBAddressStr || '';
            pairedTokenDecs = poolMintBDecimals;
        } else if (poolMintBAddressStr === solMintAddress && typeof poolMintADecimals === 'number') {
            uiSolAmount = rawInfo.mintAmountB;
            uiTokenAmount = rawInfo.mintAmountA;
            pairedTokenMintAddr = poolMintAAddressStr || '';
            pairedTokenDecs = poolMintADecimals;
        } else {
            console.warn(FN_NAME, 'Mainnet-like structure, NATIVE_MINT not IDed or decimals missing. Assuming A=SOL, B=Token if structure matches.');
            // This fallback might be risky if mints are not SOL and Token.
            uiSolAmount = rawInfo.mintAmountA;
            uiTokenAmount = rawInfo.mintAmountB;
            if (poolMintAAddressStr === solMintAddress) { // For setting pairedToken info
                 pairedTokenMintAddr = poolMintBAddressStr || ''; pairedTokenDecs = poolMintBDecimals || 0;
            } else if (poolMintBAddressStr === solMintAddress) {
                 pairedTokenMintAddr = poolMintAAddressStr || ''; pairedTokenDecs = poolMintADecimals || 0;
            } else { // Default to B if cannot determine
                 pairedTokenMintAddr = poolMintBAddressStr || ''; pairedTokenDecs = poolMintBDecimals || 0;
            }
        }
    } else if (rawInfo?.baseReserve && rawInfo?.quoteReserve) {
        console.log(FN_NAME, 'Detected Devnet/Simulated structure (baseReserve/quoteReserve are raw).');
        const rawBaseReserveStr = String(rawInfo.baseReserve);
        const rawQuoteReserveStr = String(rawInfo.quoteReserve);

        console.log(FN_NAME, 'Devnet Raw baseReserve Str:', rawBaseReserveStr, 'Raw quoteReserve Str:', rawQuoteReserveStr);

        if (typeof poolMintADecimals === 'number' && typeof poolMintBDecimals === 'number') {
            // For Devnet pools from seedDevnetPoolToStore, mintA is defined as SOL and mintB as the token.
            // baseReserve should correspond to mintA, quoteReserve to mintB.
            if (poolMintAAddressStr === solMintAddress) {
                uiSolAmount = parseFloat(new Decimal(rawBaseReserveStr).div(new Decimal(10).pow(poolMintADecimals)).toString());
                uiTokenAmount = parseFloat(new Decimal(rawQuoteReserveStr).div(new Decimal(10).pow(poolMintBDecimals)).toString());
                pairedTokenMintAddr = poolMintBAddressStr || '';
                pairedTokenDecs = poolMintBDecimals;
                console.log(FN_NAME, `Devnet path: Assumed MintA/baseReserve is SOL. SOL Dec: ${poolMintADecimals}, Token Dec: ${poolMintBDecimals}`);
            } else if (poolMintBAddressStr === solMintAddress) { // If mintB was SOL
                uiSolAmount = parseFloat(new Decimal(rawQuoteReserveStr).div(new Decimal(10).pow(poolMintBDecimals)).toString());
                uiTokenAmount = parseFloat(new Decimal(rawBaseReserveStr).div(new Decimal(10).pow(poolMintADecimals)).toString());
                pairedTokenMintAddr = poolMintAAddressStr || '';
                pairedTokenDecs = poolMintADecimals;
                console.log(FN_NAME, `Devnet path: Assumed MintB/quoteReserve is SOL. SOL Dec: ${poolMintBDecimals}, Token Dec: ${poolMintADecimals}`);
            } else {
                // This else block should ideally not be reached if the pool is a SOL pair and mintA/B data is consistent.
                console.error(FN_NAME, 'Devnet structure, but NATIVE_MINT not matched to mintA or mintB via address. Defaulting to A=base, B=quote based on structure.');
                uiSolAmount = parseFloat(new Decimal(rawBaseReserveStr).div(new Decimal(10).pow(poolMintADecimals)).toString());
                uiTokenAmount = parseFloat(new Decimal(rawQuoteReserveStr).div(new Decimal(10).pow(poolMintBDecimals)).toString());
                // Try to infer paired token based on which is not SOL; if both not SOL, this is more complex.
                 pairedTokenMintAddr = poolMintBAddressStr || ''; // Default assumption
                 pairedTokenDecs = poolMintBDecimals;
            }
        } else {
            console.error(FN_NAME, 'Devnet structure, but mint decimals for pool are missing.');
            return null;
        }
    } else {
        console.warn(FN_NAME, 'No recognized reserve data structure in rawSdkPoolInfo.');
        return null;
    }
    
    if (!pairedTokenMintAddr || typeof pairedTokenDecs !== 'number' ) {
         console.warn(FN_NAME, 'Paired token mint or decimals could not be determined.');
         // This might be acceptable if we only need SOL reserves for some reason, but generally indicates an issue for a pair.
    }
    if (uiSolAmount <= 0 || uiTokenAmount <= 0) {
        console.warn(FN_NAME, 'Resulting UI reserves are zero or invalid. Pool ID:', selectedPool.id);
    }

    console.log(FN_NAME, 'Final UI solAmount for pool:', uiSolAmount, 'Final UI tokenAmount for pool:', uiTokenAmount);
    return { priceFromPool, uiSolReserve: uiSolAmount, uiTokenReserve: uiTokenAmount, solMintAddress, solDecimals, pairedTokenMintAddress: pairedTokenMintAddr, pairedTokenDecimals: pairedTokenDecs };
}

export function calculateStandardAmmSwapQuote( // Renamed for clarity
    inputAmountUi: number,
    isInputSol: boolean,
    poolReserves: UiPoolReserves,
    slippagePercent: number
): SwapTransactionQuote | null {
    const FN_NAME = '[ammSwapCalculator.calculateStandardAmmSwapQuote]';
    console.log(FN_NAME, 'Called. Input UI:', inputAmountUi, 'isInputSol:', isInputSol, 'Slippage%:', slippagePercent, 'PoolReserves:', poolReserves);

    if (!poolReserves || inputAmountUi <= 0 ) {
        console.error(FN_NAME, 'Invalid inputAmount or no poolReserves.');
        return null;
    }
    if (poolReserves.uiSolReserve < 0 || poolReserves.uiTokenReserve < 0) { // Allow 0 for one side
         console.error(FN_NAME, 'Negative pool reserves.');
        return null;
    }
    if (poolReserves.uiSolReserve === 0 && poolReserves.uiTokenReserve === 0) {
        console.warn(FN_NAME, 'Both pool reserves are zero.');
        return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
    }

    const inputAmountDecimal = new Decimal(inputAmountUi);
    let A0_ui: Decimal, B0_ui: Decimal, outputTokenDecimalsForTx: number;

    if (isInputSol) {
        A0_ui = new Decimal(poolReserves.uiSolReserve);
        B0_ui = new Decimal(poolReserves.uiTokenReserve);
        outputTokenDecimalsForTx = poolReserves.pairedTokenDecimals;
        console.log(FN_NAME, `Buy scenario: Input SOL (A0_ui)=${A0_ui}, Output Token (B0_ui)=${B0_ui}, OutputDecimals=${outputTokenDecimalsForTx}`);
    } else { // Input is the pairedToken, output is SOL
        A0_ui = new Decimal(poolReserves.uiTokenReserve);
        B0_ui = new Decimal(poolReserves.uiSolReserve);
        outputTokenDecimalsForTx = poolReserves.solDecimals;
        console.log(FN_NAME, `Sell scenario: Input Token (A0_ui)=${A0_ui}, Output SOL (B0_ui)=${B0_ui}, OutputDecimals=${outputTokenDecimalsForTx}`);
    }
    
    if (A0_ui.isZero() && inputAmountDecimal.gt(0)) {
        console.warn(FN_NAME, 'Input reserve (A0_ui) is zero. Cannot perform swap.');
        return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
    }
    if (B0_ui.isZero()){
         console.warn(FN_NAME, 'Output reserve (B0_ui) is zero. Swap will yield zero.');
         // This state is possible if pool is completely drained of one token
    }


    const k = A0_ui.mul(B0_ui);
    const newReserveA_ui = A0_ui.plus(inputAmountDecimal);
    let estimatedOutputUi: Decimal;

    if (newReserveA_ui.isZero()) { // Should only happen if A0 is negative, which is an error state
        estimatedOutputUi = new Decimal(0);
    } else {
        const newReserveB_ui = k.div(newReserveA_ui);
        estimatedOutputUi = B0_ui.minus(newReserveB_ui);
    }
    console.log(FN_NAME, `k=${k.toString()}, newReserveA_ui=${newReserveA_ui.toString()}, newReserveB_ui=${k.div(newReserveA_ui).toString()}, estimatedOutputUi=${estimatedOutputUi.toString()}`);


    if (estimatedOutputUi.lte(0)) {
        console.warn(FN_NAME, 'Estimated output is zero or negative.');
        return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
    }

    // Market price: OutputTokens / InputTokens (based on current reserves BEFORE the trade)
    const marketPrice_OutputPerInput = A0_ui.isZero() ? new Decimal(0) : B0_ui.div(A0_ui);
    // Execution price: Actual OutputTokens / Actual InputTokens
    const executionPrice_OutputPerInput = estimatedOutputUi.div(inputAmountDecimal);

    let priceImpactPercent = new Decimal(0);
    if (marketPrice_OutputPerInput.isFinite() && marketPrice_OutputPerInput.gt(0)) {
        priceImpactPercent = marketPrice_OutputPerInput.minus(executionPrice_OutputPerInput).abs().div(marketPrice_OutputPerInput).mul(100);
    } else if (executionPrice_OutputPerInput.isFinite() && executionPrice_OutputPerInput.gt(0)) {
        priceImpactPercent = new Decimal(100); 
    } else {
        priceImpactPercent = new Decimal(100); 
    }
    console.log(FN_NAME, `MarketPrice(Out/In)=${marketPrice_OutputPerInput.toString()}, ExecPrice(Out/In)=${executionPrice_OutputPerInput.toString()}, Impact%=${priceImpactPercent.toFixed(2)}`);


    const slippageDecimal = new Decimal(slippagePercent).div(100);
    const minOutputUiAfterSlippage = estimatedOutputUi.mul(new Decimal(1).minus(slippageDecimal));
    
    const minAmountOutRaw = new BN(
        minOutputUiAfterSlippage.mul(new Decimal(10).pow(outputTokenDecimalsForTx)).floor().toString()
    );
    console.log(FN_NAME, `minOutputUiAfterSlippage=${minOutputUiAfterSlippage.toString()}, minAmountOutRaw=${minAmountOutRaw.toString()} (using outputDecimals: ${outputTokenDecimalsForTx})`);

    return {
        estimatedOutputUi,
        priceImpactPercent: priceImpactPercent.isFinite() ? priceImpactPercent : new Decimal(100),
        minAmountOutRaw,
        executionPriceUi: executionPrice_OutputPerInput,
    };
}