// scripts/ammv4_manual_quote_full.js
const { Connection, PublicKey } = require("@solana/web3.js");
const BN = require('bn.js');
const Decimal = require('decimal.js');
Decimal.set({ precision: 50 });

// ----- Pool info -----
const WSOL_VAULT = "CLJRTMaqkc2oq8jEWKAvshWuwBJLTSpZ6B9SVQ5k3Rb5"; // poolKeys.vault.B (WSOL)
const TOKEN_VAULT = "7zesqXvg9WeVQCZk84gXAdYJxbrEtMnGyZ6z84yPtDdT"; // poolKeys.vault.A (HOOD)
const TOKEN_DECIMALS = 6; // For HOOD
const SOL_DECIMALS = 9;
const SOL_MINT = "So11111111111111111111111111111111111111112";
const TOKEN_MINT = "h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood";
const POOL_PRICE = 0; // (not needed for math)
const BUY_SOL = 0.01; // Amount of SOL to spend
const SLIPPAGE = 1; // In percent

function calculateStandardAmmSwapQuote(
  inputAmountUi,         // How much SOL to swap (e.g., 0.01)
  isInputSol,            // true for SOL->token
  poolReserves,          // { uiSolReserve, uiTokenReserve, ... }
  slippagePercent        // e.g., 1 for 1%
) {
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
  // CPMM (constant product) math
  const feeNumerator = 9975;
  const feeDenominator = 10000;
  const amountInWithFee = inputAmountDecimal.mul(feeNumerator).div(feeDenominator);
  const k = A0_ui.mul(B0_ui);
  const newReserveA_ui = A0_ui.plus(amountInWithFee);
  const newReserveB_ui = k.div(newReserveA_ui);
  const estimatedOutputUi = B0_ui.minus(newReserveB_ui);
  // Market price, execution price, price impact
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
  // Apply slippage
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

  // Pull current vault reserves
  const wsolBalRes = await connection.getTokenAccountBalance(new PublicKey(WSOL_VAULT));
  const tokenBalRes = await connection.getTokenAccountBalance(new PublicKey(TOKEN_VAULT));
  const uiSolReserve = Number(wsolBalRes.value.amount) / 1e9;
  const uiTokenReserve = Number(tokenBalRes.value.amount) / 10 ** TOKEN_DECIMALS;

  // For display
  console.log(`[Vault balances at ${new Date().toLocaleString()}]`);
  console.log(`WSOL Vault:   ${wsolBalRes.value.amount} lamports (${uiSolReserve} SOL)`);
  console.log(`TOKEN Vault:  ${tokenBalRes.value.amount} raw (${uiTokenReserve} HOOD)`);

  // Compose pool reserves object
  const poolReserves = {
    priceFromPool: POOL_PRICE,
    uiSolReserve,
    uiTokenReserve,
    solMintAddress: SOL_MINT,
    solDecimals: SOL_DECIMALS,
    pairedTokenMintAddress: TOKEN_MINT,
    pairedTokenDecimals: TOKEN_DECIMALS,
  };

  const inputAmountUi = BUY_SOL;
  const isInputSol = true; // We are buying HOOD with SOL

  const quote = calculateStandardAmmSwapQuote(inputAmountUi, isInputSol, poolReserves, SLIPPAGE);

  console.log("\n=== QUOTE ===");
  if (!quote) {
    console.error("Quote calculation failed.");
    process.exit(1);
  }
  console.log(`Estimated Output (UI):    ${quote.estimatedOutputUi.toString()} HOOD`);
  console.log(`Execution Price (UI):     ${quote.executionPriceUi ? quote.executionPriceUi.toString() : "N/A"}`);
  console.log(`Price Impact (%):         ${quote.priceImpactPercent.toFixed(2)}`);
  console.log(`Min Amount Out (raw BN):  ${quote.minAmountOutRaw.toString()} (to be used in swap)`);
  const minOutUi = new Decimal(quote.minAmountOutRaw.toString()).div(new Decimal(10).pow(TOKEN_DECIMALS));
  console.log(`Min Amount Out (UI):      ${minOutUi.toString()} HOOD (after slippage)`);

})();





