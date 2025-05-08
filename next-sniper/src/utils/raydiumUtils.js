// src/utils/raydiumUtils.js

let simulatedPool = null;

// ✅ Return a mock pool status and placeholder price
export const checkPoolExists = async (connection, tokenAddress) => {
  console.log("🔍 Mock checking if pool exists for:", tokenAddress);

  const exists = simulatedPool?.tokenAddress === tokenAddress;
  const price = simulatedPool?.price || 0.0001;

  return { exists, price };
};

// ✅ Simulated Raydium pool data access for chart, price, volume, etc.
export const getLiquidity = async (connection, tokenAddress) => {
  if (!simulatedPool || simulatedPool.tokenAddress !== tokenAddress) {
    console.warn("⚠️ No simulated pool found for token:", tokenAddress);
    throw new Error("No simulated pool for this token");
  }

  return simulatedPool;
};

// ✅ Get chart-style candle data
export const getSimulatedPool = () => {
  return simulatedPool;
};

// ✅ Set simulated pool from LiquidityManager simulation
export const setSimulatedPool = (pool) => {
  simulatedPool = pool;
};



