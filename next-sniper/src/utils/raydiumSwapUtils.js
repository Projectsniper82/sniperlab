import { getSimulatedPool } from '@/utils/simulatedPoolStore';

// 🧪 Get price from the simulated pool
export const getTokenPrice = async (tokenMintAddress) => {
  const pool = getSimulatedPool();

  if (!pool || pool.tokenAddress !== tokenMintAddress) {
    throw new Error("No simulated pool for this token");
  }

  return pool.price;
};

// 🧮 Calculate price impact of a trade
export const calculatePriceImpact = async (tokenMintAddress, inputAmount, isBuy = true) => {
  const pool = getSimulatedPool();

  if (!pool || pool.tokenAddress !== tokenMintAddress) {
    throw new Error("No simulated pool for this token");
  }

  const tokenReserve = pool.tokenAmount;
  const solReserve = pool.solAmount;

  if (isBuy) {
    const newSolReserve = solReserve + inputAmount;
    const newPrice = newSolReserve / tokenReserve;
    const impact = (newPrice - pool.price) / pool.price;
    return impact;
  } else {
    const newTokenReserve = tokenReserve + inputAmount;
    const newPrice = solReserve / newTokenReserve;
    const impact = (pool.price - newPrice) / pool.price;
    return impact;
  }
};

// 🧮 Calculate how much output you'd receive for an input
export const calculateExpectedOutput = async (
  tokenMintAddress,
  inputAmount,
  isBuy = true,
  slippage = 0.01
) => {
  const pool = getSimulatedPool();

  if (!pool || pool.tokenAddress !== tokenMintAddress) {
    throw new Error("No simulated pool for this token");
  }

  const tokenReserve = pool.tokenAmount;
  const solReserve = pool.solAmount;

  if (isBuy) {
    // Buying token with SOL
    const inputWithFee = inputAmount * 0.997;
    const numerator = inputWithFee * tokenReserve;
    const denominator = solReserve + inputWithFee;
    const outputAmount = numerator / denominator;

    return outputAmount * (1 - slippage);
  } else {
    // Selling token for SOL
    const inputWithFee = inputAmount * 0.997;
    const numerator = inputWithFee * solReserve;
    const denominator = tokenReserve + inputWithFee;
    const outputAmount = numerator / denominator;

    return outputAmount * (1 - slippage);
  }
};
