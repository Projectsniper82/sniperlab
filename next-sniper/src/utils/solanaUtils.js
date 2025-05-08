import { PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

export const getTokenInfo = async (connection, tokenAddress) => {
  try {
    if (!tokenAddress || typeof tokenAddress !== 'string' || tokenAddress.trim().length === 0) {
      throw new Error("Invalid or missing token address provided.");
    }

    const mintPubkey = new PublicKey(tokenAddress);
    const mintInfo = await getMint(connection, mintPubkey);

    return {
      address: tokenAddress,
      decimals: mintInfo.decimals,
      supply: Number(mintInfo.supply) / (10 ** mintInfo.decimals),
      isInitialized: mintInfo.isInitialized,
    };
  } catch (err) {
    console.error('Error fetching token info:', err);
    throw err;
  }
};

// Helper function to get token balance
export const getTokenBalance = async (connection, tokenAddress, walletPublicKey) => {
  try {
    const mintPubkey = new PublicKey(tokenAddress);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      { mint: mintPubkey }
    );

    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
    const amount = accountInfo.tokenAmount.amount;
    const decimals = accountInfo.tokenAmount.decimals;

    return Number(amount) / (10 ** decimals);
  } catch (err) {
    console.error('Error fetching token balance:', err);
    return 0;
  }
};

// Format public key for display
export const formatPublicKey = (publicKey, length = 4) => {
  if (!publicKey) return '';
  const pubkeyStr = publicKey.toString();
  return `${pubkeyStr.substring(0, length)}...${pubkeyStr.substring(pubkeyStr.length - length)}`;
};

// Format large numbers
export const formatNumber = (number, maxDecimals = 2) => {
  if (typeof number !== 'number') return '0';

  if (number < 1e3) return number.toFixed(maxDecimals);
  if (number < 1e6) return `${(number / 1e3).toFixed(maxDecimals)}K`;
  if (number < 1e9) return `${(number / 1e6).toFixed(maxDecimals)}M`;
  return `${(number / 1e9).toFixed(maxDecimals)}B`;
};

export const getWallet = () => {
  if (window.solana && window.solana.isPhantom) {
    return window.solana;
  } else {
    throw new Error("Phantom wallet is not installed or connected");
  }
};
