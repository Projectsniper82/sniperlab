// src/components/TokenInfo.js
import React from 'react';
import { formatNumber } from '@/utils/solanaUtils'; // Assuming this formats a *number*
import Decimal from 'decimal.js'; // Import Decimal

// Configure Decimal if needed
Decimal.set({ precision: 50 });

// Updated props to include LP information
function TokenInfo({
  tokenInfo,
  tokenBalance, // raw string balance
  solBalance,
  // --- Ensure these New LP Props are destructured ---
  lpTokenBalance, // raw string LP token balance
  userPairedSOL,
  userPairedToken,
  totalLpSupply, // raw string total LP supply
  lpTokenDecimals,
}) {
  // Ensure tokenInfo and decimals exist before proceeding
  if (!tokenInfo || tokenInfo.decimals === undefined || tokenInfo.decimals === null) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 text-gray-400">
        Token info or decimals missing. Cannot display details.
      </div>
    );
  }

  // --- Calculate UI Amount for Main Token Balance ---
  let uiTokenBalance = '0';
  try {
    if (tokenBalance && typeof tokenBalance === 'string' && tokenBalance !== '0') {
      const raw = new Decimal(tokenBalance);
      const factor = new Decimal(10).pow(tokenInfo.decimals);
      if (factor.gt(0)) {
        uiTokenBalance = raw.div(factor).toString();
      }
    } else if (tokenBalance === '0') {
      uiTokenBalance = '0';
    }
  } catch (e) {
    console.error("Error calculating UI token balance:", e, "Raw Balance:", tokenBalance, "Decimals:", tokenInfo.decimals);
    uiTokenBalance = 'Error';
  }
  const balanceToFormat = uiTokenBalance === 'Error' ? 0 : parseFloat(uiTokenBalance);
  const formattedBalance = formatNumber(balanceToFormat, tokenInfo.decimals > 0 ? Math.min(tokenInfo.decimals, 6) : 2);

  // --- Calculate UI Amount for Main Token Supply ---
  let uiSupply = '0';
  try {
    if (tokenInfo.supply && tokenInfo.decimals !== undefined) {
      const rawSupply = new Decimal(tokenInfo.supply.toString());
      const factor = new Decimal(10).pow(tokenInfo.decimals);
      if (factor.gt(0)) {
        uiSupply = rawSupply.div(factor).toString();
      }
    }
  } catch (e) {
    console.error("Error calculating UI supply:", e);
    uiSupply = 'Error';
  }
  const supplyToFormat = uiSupply === 'Error' ? 0 : parseFloat(uiSupply);
  // For total supply, often fewer decimals are shown, e.g., 0 or 2.
  const formattedSupply = formatNumber(supplyToFormat, tokenInfo.decimals > 0 ? 2 : 0);


  // --- Calculate UI Amounts for LP Info ---
  let uiLpTokenBalance = '0';
  if (lpTokenBalance && parseFloat(lpTokenBalance) > 0 && lpTokenDecimals !== undefined && lpTokenDecimals !== null) {
    try {
      const rawLp = new Decimal(lpTokenBalance);
      const factorLp = new Decimal(10).pow(lpTokenDecimals);
      if (factorLp.gt(0)) {
        uiLpTokenBalance = rawLp.div(factorLp).toString();
      }
    } catch (e) {
      console.error("Error calculating UI LP token balance:", e);
      uiLpTokenBalance = 'Error';
    }
  }
  const lpBalanceToFormat = uiLpTokenBalance === 'Error' ? 0 : parseFloat(uiLpTokenBalance);
  // Show more precision for LP tokens if decimals allow
  const formattedLpBalance = formatNumber(lpBalanceToFormat, lpTokenDecimals > 0 ? Math.min(lpTokenDecimals, 6) : 2);

  let uiTotalLpSupply = '0';
   if (totalLpSupply && parseFloat(totalLpSupply) > 0 && lpTokenDecimals !== undefined && lpTokenDecimals !== null) {
    try {
      const rawTotalLp = new Decimal(totalLpSupply);
      const factorTotalLp = new Decimal(10).pow(lpTokenDecimals);
      if (factorTotalLp.gt(0)) {
        uiTotalLpSupply = rawTotalLp.div(factorTotalLp).toString();
      }
    } catch (e) {
      console.error("Error calculating UI total LP supply:", e);
      uiTotalLpSupply = 'Error';
    }
  }
  const totalLpSupplyToFormat = uiTotalLpSupply === 'Error' ? 0 : parseFloat(uiTotalLpSupply);
  const formattedTotalLpSupply = formatNumber(totalLpSupplyToFormat, lpTokenDecimals > 0 ? 2 : 0);


  const showLpInfo = lpTokenBalance && new Decimal(lpTokenBalance).gt(0) && lpTokenDecimals !== undefined; // Use Decimal for gt(0)

  const tokenName = tokenInfo.address ? `${tokenInfo.address.substring(0,4)}...${tokenInfo.address.substring(tokenInfo.address.length - 4)}` : 'Token';


  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">🪙 Token Info</h2>
        <div className="px-3 py-1 bg-gray-800 rounded-full text-blue-400 text-xs">
          SPL Token
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded-lg overflow-hidden">
          <p className="text-gray-400 text-xs mb-1">Token Address</p> {/* Removed (Devnet) as network is global */}
          <p className="text-white font-mono text-sm break-all">{tokenInfo.address || 'N/A'}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-xs mb-1">Total Supply</p>
          <p className="text-white font-bold">{formattedSupply}</p>
          <p className="text-gray-500 text-xs">{tokenInfo.decimals} Decimals</p>
        </div>
      </div>

      {/* --- LP Information Box --- */}
      {showLpInfo && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-md font-semibold text-blue-300 mb-2">Your Liquidity Pool Share</h3>
          <div className="space-y-1 text-sm">
            <div>
              <p className="text-gray-400">LP Tokens Owned:</p>
              <p className="text-white font-medium">{formattedLpBalance}</p>
            </div>
            <div>
              <p className="text-gray-400">Your Share of Pool SOL/WSOL:</p>
              <p className="text-white font-medium">
                {userPairedSOL !== undefined ? userPairedSOL.toLocaleString(undefined, { maximumFractionDigits: 6 }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Your Share of Pool {tokenName}:</p>
              <p className="text-white font-medium">
                {userPairedToken !== undefined ? userPairedToken.toLocaleString(undefined, { maximumFractionDigits: tokenInfo.decimals > 0 ? Math.min(tokenInfo.decimals, 6) : 2 }) : 'N/A'}
              </p>
            </div>
            {new Decimal(totalLpSupply || "0").gt(0) && ( // check totalLpSupply directly
                <p className="text-xs text-gray-500 pt-1">
                    (Pool Total LP Supply: {formattedTotalLpSupply})
                </p>
            )}
          </div>
        </div>
      )}
      {/* --- End of LP Information Box --- */}


      <div className="mt-4 p-5 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow">
        <h3 className="text-white text-lg mb-3">Your Balance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-300 text-xs">Token Balance</p> {/* Simplified from (UI) */}
            <p className="text-white text-xl font-bold">{formattedBalance}</p>
          </div>
          <div>
            <p className="text-gray-300 text-xs">SOL Balance</p>
            <p className="text-white text-xl font-bold">{solBalance?.toFixed(4) ?? '0.0000'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenInfo;