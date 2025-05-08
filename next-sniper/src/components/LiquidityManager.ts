// src/components/LiquidityManager.ts
// Added missing Decimal import

import { getSimulatedPool, setSimulatedPool } from "@/utils/simulatedPoolStore"; // Ensure path is correct
import BN from "bn.js"; // Import BN type if not already
import Decimal from "decimal.js"; // Add missing Decimal import

// Define types for arguments (use 'any' for wallet/pool initially if full types are complex)
type SubtractBalancesCallback = (amounts: { tokenAmount: any, solAmount: number }) => void;
type PoolInfo = any; // Replace 'any' with a proper interface if you have one defined elsewhere
type Wallet = any;  // Replace 'any' with your actual wallet type

// Function to create a simulated liquidity pool
export const createSimulatedLiquidityPool = async (
  wallet: Wallet,
  tokenAddress: string,
  tokenDecimals: number,
  tokenAmount: BN, // Expect BN
  solLamports: BN, // Expect BN
  subtractBalancesCallback: SubtractBalancesCallback
) => {
  console.log("[SIMULATION] Creating liquidity pool...");
  const ownerAddress = wallet?.publicKey?.toString() || 'N/A'; // Safely get address
  console.log("[SIMULATION] Wallet public key:", ownerAddress);

  const normalizedTokenAddress = tokenAddress.toLowerCase();
  console.log("[SIMULATION] Token address:", normalizedTokenAddress);
  console.log("[SIMULATION] Token decimals:", tokenDecimals);
  console.log("[SIMULATION] Token amount (raw):", tokenAmount.toString());
  console.log("[SIMULATION] SOL lamports:", solLamports.toString());

  // Perform calculations using BN or Decimal.js if needed for precision
  // Example: Convert BN to numbers for calculation (use Decimal for safety with large numbers/decimals)
   const solAmount = parseFloat(new Decimal(solLamports.toString()).div(1e9).toString());
   const tokenUiAmount = parseFloat(new Decimal(tokenAmount.toString()).div(10 ** tokenDecimals).toString());

   if (tokenUiAmount === 0) {
       console.error("[SIMULATION] Calculated token UI amount is zero, cannot calculate price.");
       throw new Error("Calculated token amount is zero.");
   }

  const initialPrice = solAmount / tokenUiAmount; // Price = SOL / Token
  console.log("[SIMULATION] Initial price:", initialPrice);

  const simulatedPool = {
    tokenAddress: normalizedTokenAddress,
    tokenDecimals, // Store decimals
    tokenAmount: tokenUiAmount, // Store UI amount
    solAmount: solAmount, // Store UI amount
    price: initialPrice,
    volume: 0,
    candles: [
      {
        open: initialPrice,
        high: initialPrice,
        low: initialPrice,
        close: initialPrice,
        timestamp: Date.now(),
      },
    ],
    // Add null/undefined for Raydium fields to match potential structure if needed
    raydiumPoolId: undefined,
    raydiumPoolKeys: undefined,
  };

  setSimulatedPool(simulatedPool); // Pass the structured object

  if (typeof subtractBalancesCallback === "function") {
    // Pass UI amounts or raw BN amounts depending on what callback expects
    subtractBalancesCallback({
      tokenAmount: tokenUiAmount, // Or pass tokenAmount BN if needed
      solAmount,
    });
  }

  console.log("[SIMULATION] ✅ Created simulated pool:", simulatedPool);
  return {
    signature: "simulated_signature_" + Math.floor(Math.random() * 10000),
    poolKeys: simulatedPool, // Return the pool object under 'poolKeys' like before
    poolInfo: simulatedPool, // Also add 'poolInfo' for consistency with handleCreateLiquidity check
  };
};

// Function to add liquidity to a simulated pool
export const addSimulatedLiquidityToPool = async (
  wallet: Wallet, // Added type
  pool: PoolInfo, // Added type (use a proper interface if available)
  tokenAmountToAdd: BN, // Expect BN
  solLamportsToAdd: BN, // Expect BN
  subtractBalancesCallback: SubtractBalancesCallback // Added type
): Promise<string> => { // Added return type
  const simulatedPool = getSimulatedPool();
  if (!simulatedPool) {
    throw new Error("No simulated pool exists yet.");
  }
  if (!pool || pool.tokenAddress !== simulatedPool.tokenAddress) {
      throw new Error("Passed pool data doesn't match stored simulated pool.");
  }


  console.log("[SIMULATION] Adding liquidity...");
  console.log("[SIMULATION] Token amount to add (raw):", tokenAmountToAdd.toString());
  console.log("[SIMULATION] SOL lamports to add:", solLamportsToAdd.toString());

  // Convert BN amounts to UI numbers for simulation update
  const solAmountUiToAdd = parseFloat(new Decimal(solLamportsToAdd.toString()).div(1e9).toString());
  const tokenUiAmountToAdd = parseFloat(new Decimal(tokenAmountToAdd.toString()).div(10 ** simulatedPool.tokenDecimals).toString());


  // Update pool values - adding liquidity increases both token and SOL amounts
  simulatedPool.tokenAmount += tokenUiAmountToAdd;
  simulatedPool.solAmount += solAmountUiToAdd;
  simulatedPool.volume += solAmountUiToAdd; // Add SOL value to volume

  // Recalculate price based on new reserves (more realistic)
  const prevPrice = simulatedPool.price;
  if (simulatedPool.tokenAmount > 0) { // Avoid divide by zero
      simulatedPool.price = simulatedPool.solAmount / simulatedPool.tokenAmount;
  } else {
      console.warn("[SIMULATION] Token amount became zero after adding liquidity?");
      // Handle appropriately, maybe keep old price or set to infinity/zero?
  }


  // Add a new candle
  if (simulatedPool.price !== undefined && isFinite(simulatedPool.price)) {
      simulatedPool.candles.push({
        open: prevPrice,
        high: Math.max(prevPrice, simulatedPool.price),
        low: Math.min(prevPrice, simulatedPool.price),
        close: simulatedPool.price,
        timestamp: Date.now(),
      });
      // Limit candle history
      if (simulatedPool.candles.length > 100) {
           simulatedPool.candles = simulatedPool.candles.slice(-100);
      }
  }

  setSimulatedPool(simulatedPool); // Update the stored pool

  if (typeof subtractBalancesCallback === "function") {
    subtractBalancesCallback({
      tokenAmount: tokenUiAmountToAdd, // Pass UI amount
      solAmount: solAmountUiToAdd,
    });
  }

  console.log("[SIMULATION] ✅ Updated simulated pool:", simulatedPool);

  return "simulated_signature_add_" + Math.floor(Math.random() * 10000);
};