// app/page.tsx (Relevant section for passing the 'network' prop)
'use client';

// Polyfill must come first
import '@/utils/bufferPolyfill';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
// Solana Web3 & SPL Token
import { PublicKey, Connection, AccountInfo, Transaction, VersionedTransaction } from '@solana/web3.js';
import { NATIVE_MINT, getMint } from '@solana/spl-token';
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import Decimal from 'decimal.js';

// Context
import { useNetwork, NetworkType } from '@/context/NetworkContext';

// Utils
import {
    DEVNET_AMM_V4_PROGRAM_ID,
    MAINNET_AMM_V4_PROGRAM_ID,
    DEVNET_AMM_V4_CONFIG_ID_STR,
    MAINNET_AMM_V4_CONFIG_ID_STR
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


// --- Helper to get AMM V4 IDs (Renamed for clarity) ---
const getAmmV4Ids = (network: 'devnet' | 'mainnet-beta') => {
    const functionName = "[getAmmV4Ids]";
    const devnetConfigStr = DEVNET_AMM_V4_CONFIG_ID_STR;
    const mainnetConfigStr = MAINNET_AMM_V4_CONFIG_ID_STR;

    let selectedProgramId;
    let selectedConfigStr;

    if (network === 'mainnet-beta') {
        selectedProgramId = MAINNET_AMM_V4_PROGRAM_ID;
        selectedConfigStr = mainnetConfigStr;
        console.log(`${functionName} Selected mainnet config string: "${selectedConfigStr}" (Type: ${typeof selectedConfigStr})`);
    } else { // Default to devnet
        selectedProgramId = DEVNET_AMM_V4_PROGRAM_ID;
        selectedConfigStr = devnetConfigStr;
        // console.log(`${functionName} Selected devnet config string: "${selectedConfigStr}" (Type: ${typeof selectedConfigStr})`);
    }

    if (!selectedProgramId) {
         console.error(`${functionName} Program ID is undefined for network: ${network}`);
         throw new Error(`Program ID is undefined for network: ${network}`);
    }
    if (typeof selectedConfigStr !== 'string' || selectedConfigStr.length < 32) {
        console.error(`${functionName} Config ID String is invalid or undefined for network ${network}:`, selectedConfigStr);
        throw new Error(`Config ID String is invalid or undefined for network ${network}`);
    }

    try {
        console.log(`[getAmmV4Ids] String for PublicKey: ${JSON.stringify(selectedConfigStr)}`);
        console.log(`[getAmmV4Ids] Char codes: ${JSON.stringify(selectedConfigStr.split('').map(c => c.charCodeAt(0)))}`);
        const configIdPublicKey = new PublicKey(selectedConfigStr);
        console.log(`${functionName} Successfully created PublicKey for Config ID on ${network}.`);
        return {
            AMM_PROGRAM_ID: selectedProgramId,
            AMM_CONFIG_ID: configIdPublicKey
        };
    } catch (e: any) {
       console.error(`[getAmmV4Ids] Error creating PublicKey from config string "${selectedConfigStr}" for network ${network}. Original error: ${e.message}`, e);
       // More specific error for base58 issues
       if (e.message && e.message.toLowerCase().includes("base-58")) {
            throw new Error(`Non-base58 character detected in config ID string "${selectedConfigStr}" for network ${network}. Original error: ${e.message}`);
       }
       throw new Error(`Failed to create PublicKey from config ID string "${selectedConfigStr}" for network ${network}. Original error: ${e.message}`);
    }
};


type NotificationType = 'success' | 'error' | 'info' | 'warning' | '';

interface TokenInfoState {
    address: string;
    decimals: number;
    supply: string;
    isInitialized: boolean;
}

interface LpTokenDetailsState {
    lpTokenBalance: string;
    userPairedSOL: number;
    userPairedToken: number;
    totalLpSupply: string;
    lpTokenDecimals: number;
}

interface PhantomWallet {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

function isPhantomWallet(wallet: any): wallet is PhantomWallet {
     return wallet &&
            typeof wallet === 'object' &&
            wallet.publicKey instanceof PublicKey &&
            typeof wallet.signTransaction === 'function' &&
            typeof wallet.signAllTransactions === 'function';
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
    const [lpDetails, setLpDetails] = useState<LpTokenDetailsState>({
        lpTokenBalance: '0',
        userPairedSOL: 0,
        userPairedToken: 0,
        totalLpSupply: '0',
        lpTokenDecimals: 0,
    });


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
             console.log(`[fetchTokenBalance] Fetching balance for mint ${mintPublicKey.toBase58()}`);
             try {
                 const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                     ownerPublicKey, { mint: mintPublicKey }, 'confirmed'
                 );
                 if (tokenAccounts.value.length > 0) {
                     const best = tokenAccounts.value.reduce((acc, curr) => {
                         const bal = new BN(curr.account.data.parsed.info.tokenAmount.amount);
                         return bal.gt(acc.balance) ? { info: curr.account.data.parsed.info, balance: bal } : acc;
                     }, { info: null as any, balance: new BN(0) });
                     setTokenBalance(best.info?.tokenAmount.amount ?? '0');
                     console.log(`[fetchTokenBalance] Balance found: ${best.info?.tokenAmount.uiAmountString ?? '0'} (raw: ${best.info?.tokenAmount.amount ?? '0'})`);
                 } else {
                     setTokenBalance('0');
                     console.log(`[fetchTokenBalance] No token account found for mint ${mintPublicKey.toBase58()}`);
                 }
             } catch (err) {
                 console.error(`[fetchTokenBalance] Failed for ${mintPublicKey.toBase58()} on ${network}:`, err);
                 setTokenBalance('0');
             }
         },
         [connection, network]
    );


    const fetchLpTokenDetails = useCallback(async () => {
        const functionName = "[fetchLpTokenDetails]";
        setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });

        if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo || typeof tokenInfo.decimals !== 'number') {
            console.log(`${functionName} Skipped: Missing wallet, tokenAddress, connection, or valid tokenInfo.decimals.`);
            return;
        }

        let localNotification = { show: true, message: `Workspaceing LP details for ${tokenAddress.substring(0,6)}... on ${network}...`, type: 'info' as NotificationType };
        setNotification(localNotification);

        try {
            const pastedTokenMintPk = new PublicKey(tokenAddress);
            const ammV4Ids = getAmmV4Ids(network);

            console.log(`${functionName} Deriving potential AMM V4 pool keys using Program ${ammV4Ids.AMM_PROGRAM_ID.toBase58()} and Config ${ammV4Ids.AMM_CONFIG_ID.toBase58()}`);
            let potentialPoolKeys;
            potentialPoolKeys = getCreatePoolKeys({
                 programId: ammV4Ids.AMM_PROGRAM_ID,
                 configId: ammV4Ids.AMM_CONFIG_ID,
                 mintA: NATIVE_MINT,
                 mintB: pastedTokenMintPk,
             });
             console.log(`${functionName} Potential Pool ID: ${potentialPoolKeys.poolId.toBase58()}, LP Mint: ${potentialPoolKeys.lpMint.toBase58()}, VaultA (SOL): ${potentialPoolKeys.vaultA.toBase58()}, VaultB (Token): ${potentialPoolKeys.vaultB.toBase58()}`);

            let lpMintData;
            try {
                console.log(`${functionName} Verifying LP Mint: ${potentialPoolKeys.lpMint.toBase58()}`);
                lpMintData = await getMint(connection, potentialPoolKeys.lpMint, 'confirmed');
                if (!lpMintData || !lpMintData.isInitialized) {
                   throw new Error(`Derived LP Mint ${potentialPoolKeys.lpMint.toBase58()} is not initialized.`);
                }
                console.log(`${functionName} LP Mint verified. Decimals: ${lpMintData.decimals}, Supply: ${lpMintData.supply.toString()}`);
            } catch (err: any) {
                 console.warn(`${functionName} Derived LP Mint ${potentialPoolKeys.lpMint.toBase58()} not found or failed verification on ${network}:`, err.message);
                 localNotification = { show: true, message: `No active LP found for this token/pair with the expected config on ${network}.`, type: 'info' };
                 setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
                 setNotification(localNotification);
                 setTimeout(() => setNotification(prev => prev.message === localNotification.message ? { show: false, message: '', type: '' } : prev), 4000);
                 return;
            }

            let currentLpBalanceBN = new BN(0);
            try {
                console.log(`${functionName} Fetching user LP balance for mint ${potentialPoolKeys.lpMint.toBase58()}`);
                const lpTokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    wallet.publicKey,
                    { mint: potentialPoolKeys.lpMint },
                    'confirmed'
                );
                if (lpTokenAccounts.value.length > 0) {
                    currentLpBalanceBN = new BN(lpTokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
                }
                console.log(`${functionName} Raw User LP Balance: ${currentLpBalanceBN.toString()}`);
            } catch (err: any) {
                 console.error(`${functionName} Error fetching user LP token accounts for ${potentialPoolKeys.lpMint.toBase58()} on ${network}:`, err);
                 if (err.message && err.message.includes("could not find mint")) {
                   localNotification = { show: true, message: `RPC error finding user LP balance for this pool (Mint: ${potentialPoolKeys.lpMint.toBase58().substring(0,6)}...). Try refreshing.`, type: 'warning' };
                 } else {
                   localNotification = { show: true, message: `Error fetching your LP balance: ${err.message.substring(0, 70)}...`, type: 'error' };
                 }
                 setLpDetails(prev => ({ ...prev, lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: lpMintData?.supply.toString() ?? '0', lpTokenDecimals: lpMintData?.decimals ?? 0 }));
            }

            let totalSolInPoolBN = new BN(0);
            let totalTokenInPoolBN = new BN(0);
            let reservesFetched = false;
            try {
                console.log(`${functionName} Fetching vault balances. VaultA (SOL): ${potentialPoolKeys.vaultA.toBase58()}, VaultB (Token): ${potentialPoolKeys.vaultB.toBase58()}`);
                const [vaultASolBalanceInfo, vaultBTokenBalanceInfo] = await Promise.all([
                    connection.getTokenAccountBalance(potentialPoolKeys.vaultA, 'confirmed'),
                    connection.getTokenAccountBalance(potentialPoolKeys.vaultB, 'confirmed')
                ]);
                totalSolInPoolBN = new BN(vaultASolBalanceInfo.value.amount);
                totalTokenInPoolBN = new BN(vaultBTokenBalanceInfo.value.amount);
                reservesFetched = true;
                console.log(`${functionName} Raw Reserves - SOL: ${totalSolInPoolBN.toString()}, Token: ${totalTokenInPoolBN.toString()}`);
            } catch (err: any) {
                console.warn(`${functionName} Error fetching pool vault balances for ${tokenAddress} on ${network}. Vaults might be empty or pool not fully initialized.`, err);
                localNotification = { show: true, message: `Pool found, but reserves couldn't be fetched (maybe empty?).`, type: 'warning' };
                 setLpDetails(prev => ({ ...prev, lpTokenBalance: currentLpBalanceBN.toString(), userPairedSOL: 0, userPairedToken: 0, totalLpSupply: lpMintData.supply.toString(), lpTokenDecimals: lpMintData.decimals }));
            }

            const currentTotalLpSupplyBN = new BN(lpMintData.supply.toString());
            const lpDecimals = lpMintData.decimals;
            const finalLpDetails: LpTokenDetailsState = {
                lpTokenBalance: currentLpBalanceBN.toString(),
                totalLpSupply: currentTotalLpSupplyBN.toString(),
                lpTokenDecimals: lpDecimals,
                userPairedSOL: 0,
                userPairedToken: 0,
            };

            if (reservesFetched && tokenInfo.decimals >= 0) {
                 const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
                 const solDivisor = new Decimal(1e9);

                 if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0)) {
                      const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
                      finalLpDetails.userPairedSOL = new Decimal(userShareSolLamportsBN.toString()).div(solDivisor).toNumber();

                      const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
                      finalLpDetails.userPairedToken = tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber();
                 }
                 setLpDetails(finalLpDetails);
                 if (localNotification.type !== 'error' && localNotification.type !== 'warning') {
                      localNotification = { show: true, message: 'LP details updated!', type: 'success' };
                 }
            } else {
                setLpDetails(finalLpDetails);
                 if (localNotification.type !== 'error' && localNotification.type !== 'warning') {
                      localNotification = { show: true, message: 'Updated LP balance (pool reserves unavailable).', type: 'info' };
                 }
            }
        } catch (err: any) {
            console.error(`${functionName} Error processing LP details for ${tokenAddress} on ${network}:`, err);
            if (localNotification.type !== 'error') {
                localNotification = { show: true, message: `Failed to process LP details: ${err.message.substring(0,100)}...`, type: 'error' };
            }
            setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
        } finally {
            setNotification(localNotification);
            setTimeout(() => setNotification(prev => prev.message === localNotification.message ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, tokenAddress, connection, tokenInfo, network, setNotification]);


    const handleWalletConnected = useCallback(
         async (walletAdapter: any) => {
             if (!walletAdapter?.publicKey) {
               setNotification({ show: true, message: 'Failed wallet connection.', type: 'error' });
               setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
               return;
             }
             setWallet(walletAdapter);
             setNotification({ show: true, message: `Wallet connected on ${network}!`, type: 'success' });
             setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);

             setIsLoading(true);
             try {
                 const bal = await connection.getBalance(walletAdapter.publicKey);
                 setSolBalance(bal / 1e9);
                 await initRaydiumSdk(walletAdapter, connection, network);

                 if (tokenAddress) {
                     console.log("[handleWalletConnected] Fetching initial token balance for:", tokenAddress);
                     await fetchTokenBalance(walletAdapter.publicKey, new PublicKey(tokenAddress));
                 }
             } catch (e: any) {
                 console.error(`Error on connect actions on ${network}:`, e);
                 setNotification({ show: true, message: `Connect Actions Error on ${network}: ${e.message}`, type: 'error' });
                 setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
             } finally {
                 setIsLoading(false);
             }
         },
         [connection, tokenAddress, fetchTokenBalance, network, setNotification, setIsLoading]
    );

    const refreshBalances = useCallback(async () => {
         if (!wallet?.publicKey) return;
         setIsLoading(true);
         let initialNotification = { show: true, message: `Refreshing balances on ${network}...`, type: 'info' as NotificationType };
         setNotification(initialNotification);

         try {
             const bal = await connection.getBalance(wallet.publicKey);
             setSolBalance(bal / 1e9);

             if (tokenAddress && tokenInfo) {
                 await fetchTokenBalance(wallet.publicKey, new PublicKey(tokenAddress));
                 await fetchLpTokenDetails();
                 setTimeout(() => setNotification(prev => {
                    if(prev.message === initialNotification.message || prev.type === 'success') {
                        return {show: true, message: `Balances refreshed!`, type: 'success'};
                    }
                    return prev;
                 }), 100);

             } else {
                 setTokenBalance('0');
                 setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
                  setNotification({show: true, message: `Balances refreshed!`, type: 'success'});
                  setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2500);
             }
         } catch (err: any) {
             console.error(`Error refreshing balances on ${network}:`, err);
             setNotification({ show: true, message: `Error refreshing balances: ${err.message}`, type: 'error' });
              setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
         } finally {
             setIsLoading(false);
              setTimeout(() => setNotification(prev => (prev.message.includes("Refreshing balances") || prev.message.includes("Balances refreshed!")) ? { show: false, message: '', type: '' } : prev), 3000);
         }
    }, [wallet, connection, tokenAddress, tokenInfo, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification]);

     const loadTokenInfo = useCallback(async () => {
         setTokenInfo(null);
         setTokenBalance('0');
         setErrorMessage('');
         setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });

         if (!tokenAddress) { return; }

         setIsLoading(true);
         let currentNotification = { show: true, message: `Loading token info for ${tokenAddress.substring(0,6)}... on ${network}...`, type: 'info' as NotificationType };
         setNotification(currentNotification);
         let localTokenInfo: TokenInfoState | null = null;

         try {
             const mintPub = new PublicKey(tokenAddress);
             const info = await getMint(connection, mintPub, 'confirmed');

             localTokenInfo = {
                 address: tokenAddress,
                 decimals: info.decimals,
                 supply: info.supply.toString(),
                 isInitialized: info.isInitialized,
             };

             setTokenInfo(localTokenInfo);
             currentNotification = { show: true, message: 'Token info loaded.', type: 'success' };
             setNotification(currentNotification);


             if (wallet?.publicKey) {
                 await fetchTokenBalance(wallet.publicKey, mintPub);
             }
         } catch (err: any) {
             console.error(`Error loading token info for ${tokenAddress} on ${network}:`, err);
             const userFriendlyError = (err.message && err.message.includes("Invalid public key"))
                 ? "Invalid token address format."
                 : (err.message && (err.message.includes("failed to get account info") || err.message.includes("could not find account")))
                   ? "Token mint address not found on this network."
                   : `Failed to load token: ${err.message.substring(0, 70)}...`;

             setErrorMessage(userFriendlyError);
             currentNotification = { show: true, message: userFriendlyError, type: 'error' };
             setNotification(currentNotification);
             setTokenInfo(null);
             setTokenBalance('0');
             setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
         } finally {
             setIsLoading(false);
             const messageToClear = currentNotification.message;
              setTimeout(() => setNotification(prev => prev.message === messageToClear ? { show: false, message: '', type: '' } : prev), 3000);
         }
    }, [tokenAddress, connection, wallet, fetchTokenBalance, network, setNotification]);

    useEffect(() => {
        let isValidFormat = false;
        if(tokenAddress && tokenAddress.length >= 32 && tokenAddress.length <= 44) {
            try { new PublicKey(tokenAddress); isValidFormat = true; } catch(e) { /* Invalid format */ }
        }

        if (!isValidFormat && tokenAddress) {
            setErrorMessage('Invalid token address format.');
            setTokenInfo(null); setTokenBalance('0');
            setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
             return;
        } else if (isValidFormat) {
            setErrorMessage('');
        }


        const handler = setTimeout(() => {
            if (tokenAddress && isValidFormat) {
                loadTokenInfo();
            }
             else if (!tokenAddress) {
                setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
                setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
            }
        }, 600);

        return () => clearTimeout(handler);
    }, [tokenAddress, network, loadTokenInfo]);

    useEffect(() => {
        if (tokenInfo && tokenInfo.isInitialized && typeof tokenInfo.decimals === 'number' && wallet?.publicKey && connection) {
            console.log("[useEffect Trigger] Fetching LP details because tokenInfo/wallet/connection changed.");
            fetchLpTokenDetails();
        } else {
             console.log("[useEffect Trigger] Resetting LP details because prerequisites are not met.");
             if (lpDetails.lpTokenBalance !== '0' || lpDetails.totalLpSupply !== '0') {
                 setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
             }
        }
    }, [tokenInfo, wallet, connection, fetchLpTokenDetails]);

    const subtractBalances = useCallback(
          ({ tokenAmount, solAmount }: { tokenAmount: number | string | BN; solAmount: number }) => {
             console.warn('[subtractBalances] Placeholder called - UI update needed if simulating before TX confirmation.', { tokenAmount, solAmount });
         },
         []
    );

    const handleNetworkChange = (newNetwork: NetworkType) => {
         if (newNetwork === network) return;

         console.log("[handleNetworkChange] Switching to:", newNetwork);
         setWallet(null);
         setTokenAddress('');
         setTokenInfo(null);
         setSolBalance(0);
         setTokenBalance('0');
         setLpDetails({ lpTokenBalance: '0', userPairedSOL: 0, userPairedToken: 0, totalLpSupply: '0', lpTokenDecimals: 0 });
         setErrorMessage('');
         setIsLoading(false);

         setNetwork(newNetwork);

         setNotification({
             show: true,
             message: `Switched to ${newNetwork}. Please reconnect wallet and load a token for this network.`,
             type: 'info',
         });
         setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
    };


    // --- Render Logic ---
    return (
        <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
            {/* Header */}
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
                 <p className="text-gray-400 text-xs mt-1">Test token minting, LP management, swaps, and live pricing.</p>
            </header>

            {wallet && (
                 <div className="mb-6 text-center">
                     <button
                         onClick={async () => {
                             if (!isPhantomWallet(wallet)) {
                                 setNotification({ show: true, message: 'Wallet connected is not compatible for minting (requires Phantom-like wallet).', type: 'error' });
                                 setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                                 return;
                             }
                             if (network !== 'devnet') {
                                 setNotification({ show: true, message: 'Token minting is only enabled on Devnet.', type: 'info' });
                                 setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
                                 return;
                             }
                             setIsLoading(true);
                             setNotification({ show: true, message: `Minting TestToken on ${network}...`, type: 'info' });
                             try {
                                 const result = await mintTokenWithPhantomWallet(wallet, connection, 'TestToken');
                                 if (result?.mintAddress) {
                                     setTokenAddress(result.mintAddress);
                                     setNotification({ show: true, message: `Token minted!\nAddress: ${result.mintAddress.substring(0, 10)}... Now loading info...`, type: 'success' });
                                 } else { throw new Error('Minting did not return address.'); }
                             } catch (err: any) {
                                 console.error('Mint error:', err);
                                 setNotification({ show: true, message: `Mint Failed on ${network}: ${err.message || 'Unknown'}`, type: 'error' });
                                 setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                             } finally {
                                 setIsLoading(false);
                                 setTimeout(() => setNotification(prev => prev.message.includes("Minting") ? { show: false, message: '', type: '' } : prev), 4000);
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
                        <input
                            id="token-address-input"
                            type="text"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            placeholder={`Paste ${network} token mint address`}
                            className="w-full mb-3 p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errorMessage && (<p className="text-red-400 text-sm mb-3">{errorMessage}</p>)}
                        <div className="flex flex-wrap gap-2">
                            <button onClick={refreshBalances} disabled={!wallet || isLoading} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">{isLoading ? 'Refreshing...' : 'Refresh Balances'}</button>
                        </div>
                    </div>
                    <WalletConnect setWallet={handleWalletConnected} connection={connection} refreshBalances={refreshBalances} setNotification={setNotification} />
                </div>

                {wallet && tokenInfo ? (
                     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-1">
                             <TokenInfo
                                 tokenInfo={tokenInfo}
                                 tokenBalance={tokenBalance}
                                 solBalance={solBalance}
                                 lpTokenBalance={lpDetails.lpTokenBalance}
                                 userPairedSOL={lpDetails.userPairedSOL}
                                 userPairedToken={lpDetails.userPairedToken}
                                 totalLpSupply={lpDetails.totalLpSupply}
                                 lpTokenDecimals={lpDetails.lpTokenDecimals}
                             />
                         </div>
                         <div className="md:col-span-2">
                             <LiveTokenChart
                                 tokenMint={tokenAddress}
                                 tokenDecimals={tokenInfo?.decimals}
                                 tokenSupply={tokenInfo?.supply}
                                 connection={connection}
                                 network={network} // network prop is already correctly passed here
                             />
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
                     {/* SimulatedLiquidityManager - Ensure network prop is passed */}
                     <SimulatedLiquidityManager
                          wallet={wallet as any} // Cast to any if using JS component with TS parent
                          connection={connection}
                          tokenAddress={tokenAddress}
                          tokenDecimals={tokenInfo?.decimals}
                          tokenBalance={tokenBalance}
                          solBalance={solBalance}
                          refreshBalances={refreshBalances}
                          subtractBalances={subtractBalances}
                          network={network} // <<<< THIS IS THE KEY ADDITION/CONFIRMATION
                     />
                     <TradingInterface
                          wallet={wallet as any}
                          connection={connection}
                          tokenAddress={tokenAddress}
                          tokenDecimals={tokenInfo?.decimals}
                          tokenBalance={tokenBalance}
                          solBalance={solBalance}
                          refreshBalances={refreshBalances}
                          subtractBalances={subtractBalances}
                          setNotification={setNotification}
                          network={network} // network prop is already correctly passed here
                     />
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
                      <div className={`px-4 py-3 rounded shadow-lg text-sm break-words whitespace-pre-wrap ${
                           notification.type === 'success' ? 'bg-green-700 text-green-100' :
                           notification.type === 'error' ? 'bg-red-700 text-red-100' :
                           notification.type === 'warning' ? 'bg-yellow-700 text-yellow-100' :
                           'bg-blue-700 text-blue-100'
                      }`}>
                           {notification.message}
                      </div>
                 </div>
            )}
        </div>
    );
}