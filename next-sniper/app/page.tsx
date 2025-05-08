// app/page.tsx
'use client';

// Polyfill must come first
import '@/utils/bufferPolyfill';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
// Solana Web3 & SPL Token
import { PublicKey } from '@solana/web3.js';
import { NATIVE_MINT, getMint } from '@solana/spl-token';
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import Decimal from 'decimal.js';

// Context
import { useNetwork, NetworkType } from '@/context/NetworkContext';

// Utils
import {
    MAINNET_AMM_V4_PROGRAM_ID,    // This is a PublicKey from raydiumConsts
    DEVNET_AMM_V4_PROGRAM_ID,     // This is a PublicKey from raydiumConsts
    MAINNET_AMM_V4_CONFIG_ID_STR, // This is a STRING from raydiumConsts
    DEVNET_AMM_V4_CONFIG_ID_STR   // This is a STRING from raydiumConsts
    // Add other constants from raydiumConsts.ts if needed directly in this file
} from '@/utils/raydiumConsts';
import { mintTokenWithPhantomWallet } from '@/utils/mintWithPhantom';
import { initRaydiumSdk } from '@/utils/raydiumSdkAdapter';
import {
  checkRaydiumDependencies,
  getInstallationInstructions
} from '@/utils/dependencyChecker';

// Components
import WalletConnect from '@/components/WalletConnect';
import TokenInfo from '@/components/TokenInfo';
import SimulatedLiquidityManager from '@/components/SimulatedLiquidityManager';
import TradingInterface from '@/components/TradingInterface';
import LiveTokenChart from '@/components/LiveTokenChart';

// Notification types
type NotificationType = 'success' | 'error' | 'info' | '';

// Token info state shape
interface TokenInfoState {
  address: string;
  decimals: number;
  supply: string; // Raw supply
  isInitialized: boolean;
}

export default function HomePage() {
  const { network, setNetwork, connection, rpcUrl } = useNetwork();

  const [wallet, setWallet] = useState<any>(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfoState | null>(null);
  const [solBalance, setSolBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: NotificationType;
  }>({ show: false, message: '', type: '' });

  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');
  const [userPairedSOL, setUserPairedSOL] = useState<number>(0);
  const [userPairedToken, setUserPairedToken] = useState<number>(0);
  const [totalLpSupply, setTotalLpSupply] = useState<string>('0');
  const [lpTokenDecimals, setLpTokenDecimals] = useState<number>(0);

  useEffect(() => {
    const { isReady, missingDependencies } = checkRaydiumDependencies();
    if (!isReady) {
      const instructions = getInstallationInstructions();
      setNotification({ show: true, message: `Missing SDK dependencies: ${missingDependencies.join(', ')}\n${instructions}`, type: 'error' });
      console.error(`Missing SDK deps: ${missingDependencies.join(', ')}\n${instructions}`);
      setErrorMessage(`Missing SDK dependencies`);
    }
  }, []);

  const fetchTokenBalance = useCallback(
    async (ownerPublicKey: PublicKey, mintPublicKey: PublicKey) => {
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, { mint: mintPublicKey }, 'confirmed');
        if (tokenAccounts.value.length > 0) {
          const best = tokenAccounts.value.reduce((acc, curr) => {
            const bal = new BN(curr.account.data.parsed.info.tokenAmount.amount);
            return bal.gt(acc.balance) ? { info: curr.account.data.parsed.info, balance: bal } : acc;
          }, { info: null as any, balance: new BN(0) });
          setTokenBalance(best.info?.tokenAmount.amount ?? '0');
        } else {
          setTokenBalance('0');
        }
      } catch (err) {
        console.error(`[fetchTokenBalance] Failed for ${mintPublicKey.toBase58()} on ${network}:`, err);
        setTokenBalance('0');
      }
    },
    [connection, network]
  );

  const fetchLpTokenDetails = useCallback(async () => {
    if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo) {
      setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
      return;
    }
    if (typeof tokenInfo.decimals !== 'number' || isNaN(tokenInfo.decimals)) {
      console.warn("[fetchLpTokenDetails] skipped: tokenInfo.decimals not available or invalid.", tokenInfo.decimals);
      setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
      return;
    }

    let localNotification = { show: true, message: `Workspaceing LP details on ${network}...`, type: 'info' as NotificationType };
    setNotification(localNotification);

    try {
      const mintA_SOL = NATIVE_MINT;
      const mintB_Token = new PublicKey(tokenAddress);

      const programIdStrToUse = network === 'mainnet-beta' ? MAINNET_AMM_V4_PROGRAM_ID.toBase58() : DEVNET_AMM_V4_PROGRAM_ID.toBase58();
      const cpmmProgramIdToUse = new PublicKey(programIdStrToUse);

      const feeConfigIdStringToUse = network === 'mainnet-beta' ? MAINNET_AMM_V4_CONFIG_ID_STR : DEVNET_AMM_V4_CONFIG_ID_STR;
      const feeConfigIdToUse = new PublicKey(feeConfigIdStringToUse);
      
      console.log(`[fetchLpTokenDetails] For ${network}: Using CPMM Program ID: ${cpmmProgramIdToUse.toBase58()}, Fee Config ID: ${feeConfigIdToUse.toBase58()}`);

      const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramIdToUse, configId: feeConfigIdToUse, mintA: mintA_SOL, mintB: mintB_Token });
      const { lpMint: lpMintAddress, vaultA: vaultAAddress, vaultB: vaultBAddress } = derivedPoolKeys;

      if (!(lpMintAddress instanceof PublicKey) || !(vaultAAddress instanceof PublicKey) || !(vaultBAddress instanceof PublicKey)) {
          const errorMsg = `[fetchLpTokenDetails] Derived pool key(s) are not valid for ${network}. Token pair might not have a matching Raydium AMMv4 LP.`;
          console.error(errorMsg, "Derived Keys:", derivedPoolKeys);
          localNotification = { show: true, message: "Could not derive valid pool addresses.", type: 'error'};
          throw new Error(errorMsg);
      }
      console.log(`[fetchLpTokenDetails] For ${network}: Derived LP Mint: ${lpMintAddress.toBase58()}, Vault A: ${vaultAAddress.toBase58()}, Vault B: ${vaultBAddress.toBase58()}`);

      const lpTokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { mint: lpMintAddress }, 'confirmed');
      let currentLpBalanceBN = new BN(0);
      if (lpTokenAccounts.value.length > 0) currentLpBalanceBN = new BN(lpTokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
      setLpTokenBalance(currentLpBalanceBN.toString());

      const lpMintInfo = await getMint(connection, lpMintAddress);
      const currentTotalLpSupplyBN = new BN(lpMintInfo.supply.toString());
      setTotalLpSupply(currentTotalLpSupplyBN.toString());
      setLpTokenDecimals(lpMintInfo.decimals);

      const vaultAInfo = await connection.getAccountInfo(vaultAAddress);
      const vaultBInfo = await connection.getAccountInfo(vaultBAddress);

      if (!vaultAInfo || !vaultBInfo) {
        setUserPairedSOL(0); setUserPairedToken(0);
        localNotification = { show: true, message: `LP pool vaults not found for this token on ${network}. Pool might not exist with this config.`, type: 'info'};
        console.warn(`[fetchLpTokenDetails] LP Vaults not found for token: ${tokenAddress} on ${network}. Derived vaults: A=${vaultAAddress.toBase58()}, B=${vaultBAddress.toBase58()}`);
      } else {
        const vaultASolBalanceInfo = await connection.getTokenAccountBalance(vaultAAddress, 'confirmed');
        const totalSolInPoolBN = new BN(vaultASolBalanceInfo.value.amount);
        const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(vaultBAddress, 'confirmed');
        const totalTokenInPoolBN = new BN(vaultBTokenBalanceInfo.value.amount);

        if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0) && tokenInfo.decimals >= 0) {
          const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
          setUserPairedSOL(new Decimal(userShareSolLamportsBN.toString()).div(1e9).toNumber());
          const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
          const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
          setUserPairedToken(tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber());
          localNotification = { show: true, message: 'LP details loaded!', type: 'success' };
        } else {
          setUserPairedSOL(0); setUserPairedToken(0);
          localNotification = { show: true, message: currentLpBalanceBN.eqn(0) ? 'You have no LP tokens for this pool.' : 'LP details updated (pool/share issue).', type: 'info' };
        }
      }
    } catch (err: any) {
      console.error(`[fetchLpTokenDetails] Error on ${network}:`, err, err.stack);
      if (!localNotification.message.toLowerCase().includes('error')) {
        const errMessage = err.message ? err.message.toLowerCase() : '';
        if (errMessage.includes('could not find account') || errMessage.includes('failed to get account info') || errMessage.includes('invalid param: could not find mint') || errMessage.includes('invalid public key') || errMessage.includes('pool key(s) are not valid') || errMessage.includes('non-base58')) {
          localNotification = { show: true, message: `Error fetching LP details for token on ${network}. Details: ${err.message.substring(0,70)}...`, type: 'info' };
        } else {
          localNotification = { show: true, message: `Failed to fetch LP details on ${network}: ${err.message ? err.message.substring(0,100) : 'Unknown error'}...`, type: 'error' };
        }
      }
      setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
    } finally {
      setNotification(localNotification);
      setTimeout(() => setNotification(prev => prev.message === localNotification.message ? { show: false, message: '', type: '' } : prev), 4000);
    }
  }, [wallet, tokenAddress, connection, tokenInfo, network, setNotification]);

  const handleWalletConnected = useCallback(
    async (walletAdapter: any) => {
      if (!walletAdapter?.publicKey) {
        setNotification({show: true, message: 'Failed wallet connection.', type: 'error'}); return;
      }
      setWallet(walletAdapter);
      setNotification({show: true, message: `Wallet connected on ${network}!`, type: 'success'});
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);

      setIsLoading(true);
      try {
        const bal = await connection.getBalance(walletAdapter.publicKey);
        setSolBalance(bal / 1e9);
        await initRaydiumSdk(walletAdapter, connection, network);

        if (tokenAddress) {
          await fetchTokenBalance(walletAdapter.publicKey, new PublicKey(tokenAddress));
        }
      } catch (e: any) {
        console.error(`Error on connect on ${network}:`, e);
        setNotification({show: true, message: `Connect Error on ${network}: ${e.message}`, type: 'error'});
      } finally {
        setIsLoading(false);
      }
    },
    [connection, tokenAddress, fetchTokenBalance, network, setNotification, setIsLoading]
  );

  const refreshBalances = useCallback(async () => {
    if (!wallet?.publicKey) return;
    setIsLoading(true);
    try {
      const bal = await connection.getBalance(wallet.publicKey);
      setSolBalance(bal / 1e9);
      if (tokenAddress && tokenInfo) {
        await fetchTokenBalance(wallet.publicKey, new PublicKey(tokenAddress));
        await fetchLpTokenDetails();
      } else {
        setTokenBalance('0');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
      }
      setNotification({show: true, message: `Balances refreshed on ${network}!`, type: 'info'});
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
    } catch (err: any) {
      console.error(`Error refreshing balances on ${network}:`, err);
      setNotification({show: true, message: `Error refreshing balances: ${err.message}`, type: 'error'});
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, connection, tokenAddress, tokenInfo, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification]);

  const loadTokenInfo = useCallback(async () => {
    if (!tokenAddress) {
      setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
      setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
      return;
    }
    setIsLoading(true);
    setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
    setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
    setNotification({ show: true, message: `Loading token info for ${tokenAddress.substring(0,6)}... on ${network}...`, type: 'info' });

    try {
      const mintPub = new PublicKey(tokenAddress);
      const info = await connection.getParsedAccountInfo(mintPub);
      if (!info.value?.data || !('parsed' in info.value.data)) throw new Error('Mint account not found or invalid');
      
      const parsedData = info.value.data as any; 
      if (parsedData.program !== 'spl-token' || parsedData.parsed.type !== 'mint') throw new Error('Address is not a valid SPL Token mint');
      
      const decs = parsedData.parsed.info.decimals ?? 0;
      const supply = parsedData.parsed.info.supply ?? '0';
      const ti: TokenInfoState = { address: tokenAddress, decimals: Number(decs), supply, isInitialized: true };
      
      setTokenInfo(ti);
      setNotification({ show: true, message: 'Token info loaded.', type: 'success' });

      if (wallet?.publicKey) {
        await fetchTokenBalance(wallet.publicKey, mintPub);
      }
    } catch (err: any) {
      console.error(`Error loading token info for ${tokenAddress} on ${network}:`, err);
      setErrorMessage(`Error loading token on ${network}: ${err.message}`);
      setNotification({show: true, message: `Failed to load token on ${network}: ${err.message}`, type: 'error'});
      setTokenInfo(null); setTokenBalance('0');
      setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setIsLoading(false);
      const currentNotificationMsg = notification.message; // Capture current message
      if(currentNotificationMsg.startsWith(`Loading token info for`) || currentNotificationMsg.startsWith("Failed to load token on") || currentNotificationMsg === 'Token info loaded.') {
          // Check before clearing to avoid clearing unrelated notifications
          setTimeout(() => setNotification(prev => prev.message === currentNotificationMsg ? { show: false, message: '', type: '' } : prev), 1500);
      }
    }
  }, [tokenAddress, connection, wallet, fetchTokenBalance, network]); // Added notification.message

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (tokenAddress) {
        try {
          new PublicKey(tokenAddress); 
          await loadTokenInfo(); 
        } catch (e) {
          setErrorMessage('Invalid token address format.');
          setTokenInfo(null); setTokenBalance('0');
          setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        }
      } else {
        setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
      }
    }, 600); 
    return () => clearTimeout(handler);
  }, [tokenAddress, network]);

  useEffect(() => {
    if (tokenInfo && tokenInfo.isInitialized && typeof tokenInfo.decimals === 'number' && wallet?.publicKey && connection) {
      fetchLpTokenDetails();
    } else { 
      setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
    }
  }, [tokenInfo, wallet, connection, fetchLpTokenDetails]);

  const subtractBalances = useCallback(
    ({ tokenAmount, solAmount }: { tokenAmount: number | string | BN; solAmount: number }) => {
      console.warn('subtractBalances called', { tokenAmount, solAmount });
    },
    [] 
  );

  const handleNetworkChange = (newNetwork: NetworkType) => {
    console.log("[handleNetworkChange] Requested to switch to:", newNetwork);
    setWallet(null);
    setTokenAddress('');
    setTokenInfo(null);
    setSolBalance(0);
    setTokenBalance('0');
    setLpTokenBalance('0');
    setUserPairedSOL(0);
    setUserPairedToken(0);
    setTotalLpSupply('0');
    setLpTokenDecimals(0);
    setErrorMessage('');
    setIsLoading(false);
    
    setNetwork(newNetwork);
    
    setNotification({
        show: true,
        message: `Switched to ${newNetwork}. Please reconnect wallet if previously connected and load a token for this network.`,
        type: 'info',
    });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  return (
    <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
      <header className="mb-6 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-2 sm:space-x-4 space-y-2 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent pb-2">
            Raydium Sandbox
          </h1>
          <div className="bg-gray-800 p-1 rounded-lg flex space-x-1">
            <button onClick={() => handleNetworkChange('devnet')} className={`px-3 py-1 text-xs rounded-md transition-colors ${network === 'devnet' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Devnet</button>
            <button onClick={() => handleNetworkChange('mainnet-beta')} className={`px-3 py-1 text-xs rounded-md transition-colors ${network === 'mainnet-beta' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>Mainnet</button>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Current Network: <span className="font-bold text-yellow-400">{network}</span> | RPC: <span className="text-xs text-gray-500 break-all">{rpcUrl}</span></p>
        <p className="text-gray-400">Test token minting, LP management, and live pricing.</p>
      </header>

      {wallet && (
        <div className="mb-6 text-center">
          <button
            onClick={async () => {
              if (!wallet) return;
              if (network !== 'devnet') {
                  setNotification({show: true, message: 'Token minting is only enabled on Devnet for this sandbox.', type: 'info'});
                  setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
                  return;
              }
              setIsLoading(true);
              try {
                const result = await mintTokenWithPhantomWallet(wallet, connection, 'TestToken');
                if (result?.mintAddress) {
                    setTokenAddress(result.mintAddress);
                    setNotification({show: true, message: `Token minted on ${network}!\nAddress: ${result.mintAddress.substring(0,10)}...`, type: 'success'});
                    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                  } else {
                    throw new Error('Minting did not return address.');
                  }
              } catch (err: any) {
                console.error('Mint error:', err);
                setNotification({show: true, message: `Mint Failed on ${network}: ${err.message || 'Unknown'}`, type: 'error'});
                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading || network === 'mainnet-beta'}
            className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Mint New Token (Devnet Only)`}
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
            <label htmlFor="token-address-input" className="block text-lg mb-2 text-gray-200">Token Address ({network})</label>
            <input id="token-address-input" type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder={`Paste ${network} token mint address`} className="w-full mb-3 p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            {errorMessage && (<p className="text-red-400 text-sm mb-3">{errorMessage}</p>)}
            <div className="flex flex-wrap gap-2">
              <button onClick={refreshBalances} disabled={!wallet || isLoading} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">{isLoading ? 'Refreshing...' : 'Refresh Balances'}</button>
            </div>
          </div>
          <WalletConnect setWallet={handleWalletConnected} connection={connection} refreshBalances={refreshBalances} setNotification={setNotification}/>
        </div>

        {wallet && tokenInfo ? (
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <TokenInfo tokenInfo={tokenInfo} tokenBalance={tokenBalance} solBalance={solBalance} lpTokenBalance={lpTokenBalance} userPairedSOL={userPairedSOL} userPairedToken={userPairedToken} totalLpSupply={totalLpSupply} lpTokenDecimals={lpTokenDecimals}/>
            </div>
            <div className="md:col-span-2">
              <LiveTokenChart tokenMint={tokenAddress} tokenDecimals={tokenInfo.decimals} tokenSupply={tokenInfo.supply} connection={connection}/>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center bg-gray-900 p-6 rounded-lg border border-gray-800 text-gray-500 min-h-[200px]">
            {isLoading ? 'Processing...' : !wallet ? `Connect wallet to see token details on ${network}.` : `Load a token on ${network} to see live chart and LP details.`}
          </div>
        )}
      </div>

      {wallet && tokenInfo ? (
        <div className="grid md:grid-cols-2 gap-6">
          <SimulatedLiquidityManager wallet={wallet} connection={connection} tokenAddress={tokenAddress} tokenDecimals={tokenInfo.decimals} tokenBalance={tokenBalance} solBalance={solBalance} refreshBalances={refreshBalances} subtractBalances={subtractBalances}/>
          <TradingInterface wallet={wallet} connection={connection} tokenAddress={tokenAddress} tokenDecimals={tokenInfo.decimals} tokenBalance={tokenBalance} solBalance={solBalance} refreshBalances={refreshBalances} subtractBalances={subtractBalances}/>
        </div>
      ) : (
        <div className="mt-10 text-center text-gray-400">
          {!wallet ? `Connect wallet to manage liquidity and trade on ${network}.` : `Load a token to manage liquidity and trade on ${network}.`}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}

      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className={`px-4 py-3 rounded shadow-lg text-sm break-words whitespace-pre-wrap ${notification.type === 'success' ? 'bg-green-700 text-green-100' : notification.type === 'error' ? 'bg-red-700 text-red-100' : 'bg-blue-700 text-blue-100'}`}>
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}