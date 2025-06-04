// scripts/ammv4_simulate_swap.js
const { Connection, PublicKey } = require("@solana/web3.js");
const { Raydium, TxVersion } = require("@raydium-io/raydium-sdk-v2");
const BN = require('bn.js');
const Decimal = require('decimal.js');
Decimal.set({ precision: 50 });

// ----- Pool info -----
const POOL_ID = "9CTxEyRStwTKLfVTS6c7rfQc7PTxY42YPdQcrHTv53Ao";
const WSOL_VAULT = "CLJRTMaqkc2oq8jEWKAvshWuwBJLTSpZ6B9SVQ5k3Rb5";
const TOKEN_VAULT = "7zesqXvg9WeVQCZk84gXAdYJxbrEtMnGyZ6z84yPtDdT";
const WSOL_MINT = "So11111111111111111111111111111111111111112";
const TOKEN_MINT = "h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood";
const TOKEN_DECIMALS = 6;
const SOL_DECIMALS = 9;
const BUY_SOL = 0.01; // How much SOL to swap
const SLIPPAGE = 1;   // %

function calculateStandardAmmSwapQuote(inputAmountUi, isInputSol, poolReserves, slippagePercent) {
  if (!poolReserves || inputAmountUi <= 0) {
    return null;
  }
  const inputAmountDecimal = new Decimal(inputAmountUi);
  let A0_ui, B0_ui, outputTokenDecimalsForTx;
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
    return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
  }
  if (B0_ui.isZero()) {
    return { estimatedOutputUi: new Decimal(0), priceImpactPercent: new Decimal(100), minAmountOutRaw: new BN(0) };
  }
  // CPMM math
  const feeNumerator = 9975;
  const feeDenominator = 10000;
  const amountInWithFee = inputAmountDecimal.mul(feeNumerator).div(feeDenominator);
  const k = A0_ui.mul(B0_ui);
  const newReserveA_ui = A0_ui.plus(amountInWithFee);
  const newReserveB_ui = k.div(newReserveA_ui);
  const estimatedOutputUi = B0_ui.minus(newReserveB_ui);
  const marketPrice_OutputPerInput = A0_ui.isZero() ? new Decimal(0) : B0_ui.div(A0_ui);
  const executionPrice_OutputPerInput = estimatedOutputUi.div(inputAmountDecimal);
  let priceImpactPercent = new Decimal(0);
  if (marketPrice_OutputPerInput.isFinite() && marketPrice_OutputPerInput.gt(0)) {
    priceImpactPercent = marketPrice_OutputPerInput.minus(executionPrice_OutputPerInput).abs().div(marketPrice_OutputPerInput).mul(100);
  } else if (executionPrice_OutputPerInput.isFinite() && executionPrice_OutputPerInput.gt(0)) {
    priceImpactPercent = new Decimal(100);
  } else {
    priceImpactPercent = new Decimal(100);
  }
  const slippageDecimal = new Decimal(slippagePercent).div(100);
  const minOutputUiAfterSlippage = estimatedOutputUi.mul(new Decimal(1).minus(slippageDecimal));
  const minAmountOutRaw = new BN(
    minOutputUiAfterSlippage.mul(new Decimal(10).pow(outputTokenDecimalsForTx)).floor().toString()
  );
  return {
    estimatedOutputUi,
    priceImpactPercent: priceImpactPercent.isFinite() ? priceImpactPercent : new Decimal(100),
    minAmountOutRaw,
    executionPriceUi: executionPrice_OutputPerInput,
  };
}

(async () => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  // 1. Fetch live vault balances
  const wsolBalRes = await connection.getTokenAccountBalance(new PublicKey(WSOL_VAULT));
  const tokenBalRes = await connection.getTokenAccountBalance(new PublicKey(TOKEN_VAULT));
  const uiSolReserve = Number(wsolBalRes.value.amount) / 1e9;
  const uiTokenReserve = Number(tokenBalRes.value.amount) / 10 ** TOKEN_DECIMALS;

  // Compose pool reserves for manual CPMM math
  const poolReserves = {
    uiSolReserve,
    uiTokenReserve,
    pairedTokenDecimals: TOKEN_DECIMALS,
    solDecimals: SOL_DECIMALS,
  };

  // 2. Compute quote
  const quote = calculateStandardAmmSwapQuote(BUY_SOL, true, poolReserves, SLIPPAGE);

  if (!quote || quote.minAmountOutRaw.lte(new BN(0))) {
    console.error("Quote calculation failed or zero output.");
    process.exit(1);
  }

  console.log("\n=== QUOTE (Manual CPMM) ===");
  console.log(`Buy ${BUY_SOL} SOL worth of HOOD:`);
  console.log(`Estimated Output (UI):      ${quote.estimatedOutputUi.toString()} HOOD`);
  console.log(`Price Impact (%):           ${quote.priceImpactPercent.toFixed(2)}`);
  console.log(`Min Amount Out (raw BN):    ${quote.minAmountOutRaw.toString()} (use in swap)`);
  const minOutUi = new Decimal(quote.minAmountOutRaw.toString()).div(new Decimal(10).pow(TOKEN_DECIMALS));
  console.log(`Min Amount Out (UI):        ${minOutUi.toString()} HOOD (after slippage)`);

  // 3. Build Raydium SDK swap transaction (DO NOT send!)
  const dummyUser = new PublicKey("11111111111111111111111111111111");
  const raydium = await Raydium.load({ connection, cluster: "mainnet", owner: dummyUser });
  const poolId = new PublicKey(POOL_ID);
  const poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId);

  // Simulated user keys (placeholders for TX build test)
  const dummyWSOLAta = new PublicKey("11111111111111111111111111111111");
  const dummyTokenAta = new PublicKey("11111111111111111111111111111111");

  try {
    const { execute, transaction } = await raydium.liquidity.swap({
      poolKeys,
      amountIn: Math.floor(BUY_SOL * 1e9),
      amountOut: quote.minAmountOutRaw,
      fixedSide: 'in', // exact-in swap
      inputMint: new PublicKey(WSOL_MINT),
      outputMint: new PublicKey(TOKEN_MINT),
      txVersion: TxVersion.V0,
      owner: dummyUser,
      userKeys: {
        inputTokenAccount: dummyWSOLAta,
        outputTokenAccount: dummyTokenAta,
        owner: dummyUser,
      },
    });

    console.log("\n=== SWAP TX BUILD RESULT (SIMULATED) ===");
    if (!transaction) {
      console.error("TX build failed!");
      process.exit(1);
    }
    console.log("Transaction built successfully.");
    console.log("Instructions in transaction:", transaction.instructions.length);
    transaction.instructions.forEach((ix, idx) => {
      console.log(`  Instruction ${idx}:`, ix.programId.toBase58());
    });
    console.log("\nSimulated Raydium V4 swap build complete. You can now wire this logic into your actual app!");

  } catch (e) {
    // Only print message and short stack trace
    console.error("\n[Raydium Swap Build Error]");
    if (e && e.message) console.error("Error message:", e.message);
    if (e && e.stack) {
      const lines = e.stack.split('\n').slice(0, 5).join('\n');
      console.error(lines);
    }
    process.exit(1);
  }
})();

