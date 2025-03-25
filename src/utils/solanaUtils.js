import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Helper function to get token info
export const getTokenInfo = async (connection, tokenAddress, wallet) => {
  try {
    const mintPubkey = new PublicKey(tokenAddress);
    const token = new Token(connection, mintPubkey, TOKEN_PROGRAM_ID, wallet);
    const mintInfo = await token.getMintInfo();
    
    return {
      address: tokenAddress,
      decimals: mintInfo.decimals,
      supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
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
    
    return Number(amount) / Math.pow(10, decimals);
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
