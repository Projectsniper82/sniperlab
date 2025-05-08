// src/utils/simulatedPoolStore.js
let simulatedPool = null;

export const getSimulatedPool = () => simulatedPool;

export const setSimulatedPool = (pool) => {
  // --- FIX: Handle null input gracefully ---
  if (pool === null) {
    console.log("Clearing simulated pool store.");
    simulatedPool = null;
    return; // Exit early if clearing the pool
  }
  // ----------------------------------------

  // Existing logic only runs if pool is not null:
  // Normalize token address to lowercase for consistent comparisons
  if (pool && pool.tokenAddress) { // Check pool exists here too for safety
    pool.tokenAddress = pool.tokenAddress.toLowerCase();
  } else if (pool) {
      console.warn("Setting pool without tokenAddress property?");
  }

  // Ensure candles array exists
  // Check pool exists before accessing properties
  if (pool && !pool.candles) {
    pool.candles = [];
  } else if(pool && !Array.isArray(pool.candles)) {
     console.warn("Pool candles property is not an array, resetting.");
     pool.candles = [];
  }

  // Add initial candle if none exists and price is available
  // Check pool exists before accessing properties
  if (pool && pool.candles && pool.candles.length === 0 && pool.price !== undefined) {
    pool.candles.push({
      open: pool.price,
      high: pool.price,
      low: pool.price,
      close: pool.price,
      timestamp: Date.now()
    });
  } else if (pool && pool.candles && pool.candles.length === 0) {
      console.warn("Cannot add initial candle, pool price is missing.");
  }

  // Save Raydium-specific info if present
  // Check pool exists before accessing properties
  if (pool && pool.raydiumPoolId) {
    console.log("Setting simulated pool with Raydium data - pool ID:", pool.raydiumPoolId);
  } else {
    console.log("Setting simulated pool (simulation mode or missing Raydium ID)");
  }

  // Log for debugging
  console.log("Setting simulated pool:", pool);

  simulatedPool = pool;
};

// updateSimulatedPoolAfterTrade remains the same
export const updateSimulatedPoolAfterTrade = (tokenDelta, solDelta) => {
  if (!simulatedPool) {
    console.error("Cannot update - Pool not initialized");
    throw new Error("Pool not initialized");
  }

  // Update amounts
  simulatedPool.tokenAmount += tokenDelta;
  simulatedPool.solAmount += solDelta;
  simulatedPool.volume += Math.abs(solDelta);

  // Calculate new price based on constant product formula
  const prevPrice = simulatedPool.price;

  // Calculate new price - prevent divide by zero
  if (simulatedPool.tokenAmount <= 0) {
    console.warn("Simulated token amount reached zero or below, setting minimum.");
    // Set a minimum to prevent divide by zero and allow price calculation
    // This is artificial for simulation; real pools handle this differently
    simulatedPool.tokenAmount = 1 / (10 ** (simulatedPool.tokenDecimals || 0)); // smallest possible unit based on decimals
  }
   if (simulatedPool.solAmount <= 0) {
     console.warn("Simulated SOL amount reached zero or below, setting minimum.");
     simulatedPool.solAmount = 1 / (10**9); // smallest lamport unit
   }


  // Price calculation - Pool price = Quote / Base = SOL / Token
  simulatedPool.price = simulatedPool.solAmount / simulatedPool.tokenAmount;

  // Ensure price is positive (shouldn't be negative in real AMMs)
  if (simulatedPool.price < 0 || !isFinite(simulatedPool.price)) {
     console.error("Invalid price calculated, reverting to previous or zero.", {sol: simulatedPool.solAmount, token: simulatedPool.tokenAmount });
    simulatedPool.price = prevPrice > 0 ? prevPrice : 0; // Fallback
  }

  // Create new candle
  const newCandle = {
    open: prevPrice,
    high: Math.max(prevPrice, simulatedPool.price),
    low: Math.min(prevPrice, simulatedPool.price),
    close: simulatedPool.price,
    timestamp: Date.now(),
  };

  // Add to candles array
  if (!simulatedPool.candles) simulatedPool.candles = []; // Ensure array exists
  simulatedPool.candles.push(newCandle);

  // Keep only the last 100 candles to prevent memory bloat
  if (simulatedPool.candles.length > 100) {
    simulatedPool.candles = simulatedPool.candles.slice(-100);
  }

  console.log("Updated pool after trade:",
    "Token Δ:", tokenDelta,
    "SOL Δ:", solDelta,
    "New Price:", simulatedPool.price ? simulatedPool.price.toFixed(8) : 'N/A'
  );
};

// doesPoolExistForToken remains the same
export const doesPoolExistForToken = (tokenAddress) => {
  if (!simulatedPool || !tokenAddress || !simulatedPool.tokenAddress) return false; // Added check for pool address existence
  const normalizedPoolAddress = simulatedPool.tokenAddress.toLowerCase();
  const normalizedTokenAddress = tokenAddress.toLowerCase();
  return normalizedPoolAddress === normalizedTokenAddress;
};

// isRaydiumPool remains the same
export const isRaydiumPool = () => {
  return simulatedPool && !!simulatedPool.raydiumPoolId;
};