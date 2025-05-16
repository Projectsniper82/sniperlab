// app/page.tsx
'use client';

// Polyfill must come first
import '@/utils/bufferPolyfill';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
// Solana Web3 & SPL Token
import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { NATIVE_MINT, getMint } from '@solana/spl-token';
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import Decimal from 'decimal.js';

// Context
import { useNetwork, NetworkType } from '@/context/NetworkContext';

// Utils
import {
    MAINNET_AMM_V4_PROGRAM_ID,
    DEVNET_AMM_V4_PROGRAM_ID, // This is HWy1...
    MAINNET_AMM_V4_CONFIG_ID_STR,
    DEVNET_AMM_V4_CONFIG_ID_STR,
    // We need the correct one for finding standard Devnet CPMM pools
    DEVNET_CREATE_POOL_PROGRAM_ID // This is CPMDWB...
} from '@/utils/raydiumConsts';
import { mintTokenWithPhantomWallet } from '@/utils/mintWithPhantom';
import { initRaydiumSdk } from '@/utils/raydiumSdkAdapter';
import {
    checkRaydiumDependencies,
    getInstallationInstructions
} from '@/utils/dependencyChecker';
import { fetchRaydiumPoolsFromSDK, DiscoveredPoolDetailed } from '@/utils/poolFinder';

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

// PhantomWallet Interface for app/page.tsx state and isPhantomWallet guard
interface PhantomWallet {
    publicKey: { toString(): string; toBase58(): string; } | PublicKey;
    signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
    signAllTransactions: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
    isPhantom?: boolean;
}

// Type guard for PhantomWallet
function isPhantomWallet(wallet: any): wallet is PhantomWallet {
    console.log("[isPhantomWallet Check] Starting validation for wallet object:", wallet);
    if (!wallet || typeof wallet !== 'object') {
        console.log("[isPhantomWallet Check] Failed: Wallet is null, undefined, or not an object.");
        return false;
    }
    const hasPublicKeyProp = wallet.hasOwnProperty('publicKey') && wallet.publicKey;
    const publicKeyLooksValid = hasPublicKeyProp && typeof wallet.publicKey.toString === 'function';
    if (!publicKeyLooksValid) {
        console.log("[isPhantomWallet Check] Failed: publicKey property is missing, null, or lacks a toString method.");
        return false;
    }
    try {
        new PublicKey(wallet.publicKey.toString());
        console.log(`[isPhantomWallet Check] publicKey validation: OK`);
    } catch (e) {
        console.log("[isPhantomWallet Check] Failed: publicKey could not be constructed into a PublicKey instance from string:", wallet.publicKey.toString(), e);
         return false;
    }
    const hasSignTransaction = typeof wallet.signTransaction === 'function';
    const hasSignAllTransactions = typeof wallet.signAllTransactions === 'function';
    if (!hasSignTransaction || !hasSignAllTransactions) {
        console.log("[isPhantomWallet Check] Failed: Missing required signing function(s).", { hasSignTransaction, hasSignAllTransactions });
        return false;
    }
    console.log("[isPhantomWallet Check] Signing functions: OK");
    // isPhantom flag check can be optional depending on strictness
    console.log("[isPhantomWallet Check] Passed all checks, wallet appears compatible.");
    return true;
}

// Interface for the wallet object passed to mintTokenWithPhantomWallet
interface StrictPhantomWalletForMinting {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    isPhantom?: boolean;
}


export default function HomePage() {
    const { network, setNetwork, connection, rpcUrl } = useNetwork();

    const [wallet, setWallet] = useState<PhantomWallet | null>(null);
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

    const [discoveredPools, setDiscoveredPools] = useState<DiscoveredPoolDetailed[]>([]);
    const [isFetchingPools, setIsFetchingPools] = useState(false);

    // +++++ STEP 1: Add state for selected pool and collapse state +++++
    const [selectedPool, setSelectedPool] = useState<DiscoveredPoolDetailed | null>(null);
    const [isPoolListCollapsed, setIsPoolListCollapsed] = useState<boolean>(false);


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
        // This function might need to be significantly refactored later
        // to use the `selectedPool` data if we want its info to be specific
        // to the user-chosen pool from the `discoveredPools` list.
        // For now, its existing logic (deriving based on tokenAddress + NATIVE_MINT with default AMMv4) will remain.
        console.log("[fetchLpTokenDetails] Attempting to fetch LP details (current logic might not reflect selected pool)...");
        if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo || !selectedPool) { // Modified to require selectedPool
            console.log("[fetchLpTokenDetails] Skipped: Prerequisites not met (wallet, tokenAddress, connection, tokenInfo, or NO SELECTED POOL).");
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
        if (typeof tokenInfo.decimals !== 'number' || isNaN(tokenInfo.decimals)) {
            console.warn("[fetchLpTokenDetails] skipped: tokenInfo.decimals not available or invalid.", tokenInfo.decimals);
            return;
        }

        // If a specific pool is selected, we should try to get LP info for THAT pool's LP mint.
        // This requires `WorkspaceRaydiumPoolsFromSDK` to return the lpMint address for the discovered pool.
        // Assuming `selectedPool.rawSdkPoolInfo.lpMint` exists and is the LP mint address string.
        // This part needs `poolFinder.ts` to reliably provide `lpMint`.
        // For now, let's assume `selectedPool.rawSdkPoolInfo.lpMint` is available if the pool type allows.

        let lpMintToQuery: PublicKey | null = null;
        if (selectedPool.rawSdkPoolInfo && (selectedPool.rawSdkPoolInfo as any).lpMint) { // Check if lpMint exists
             try {
                lpMintToQuery = new PublicKey((selectedPool.rawSdkPoolInfo as any).lpMint);
             } catch (e) {
                console.error("[fetchLpTokenDetails] Selected pool's lpMint is not a valid PublicKey:", (selectedPool.rawSdkPoolInfo as any).lpMint);
                // Fallback to old derivation or simply error out for LP details
             }
        }

        if (!lpMintToQuery) {
             // Fallback to old derivation if selected pool doesn't have lpMint readily available
             // Or, better, indicate that LP details for this specific pool type aren't available yet with this method
            console.warn(`[fetchLpTokenDetails] LP Mint for selected pool ${selectedPool.id} not available directly. Attempting derivation (might be inaccurate for selected pool).`);
            const mintA_SOL = NATIVE_MINT;
            const mintB_Token = new PublicKey(tokenAddress);
            const cpmmProgramIdToUse = network === 'mainnet-beta' ? MAINNET_AMM_V4_PROGRAM_ID : DEVNET_CREATE_POOL_PROGRAM_ID;
            const feeConfigIdToUse = network === 'mainnet-beta' ? new PublicKey(MAINNET_AMM_V4_CONFIG_ID_STR) : new PublicKey(DEVNET_AMM_V4_CONFIG_ID_STR);
            try {
                const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramIdToUse, configId: feeConfigIdToUse, mintA: mintA_SOL, mintB: mintB_Token });
                if (derivedPoolKeys.lpMint) {
                    lpMintToQuery = derivedPoolKeys.lpMint;
                } else {
                     console.error("[fetchLpTokenDetails] Could not derive LP Mint for default AMM pool.");
                     setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                     return;
                }
            } catch (e) {
                console.error("[fetchLpTokenDetails] Error deriving default AMM pool keys:", e);
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                return;
            }
        }
        
        console.log(`[fetchLpTokenDetails] Querying LP details for LP Mint: ${lpMintToQuery.toBase58()}`);
        let localNotification = { show: true, message: `Workspaceing LP details for ${selectedPool.id.substring(0,6)} on ${network}...`, type: 'info' as NotificationType };
        setNotification(localNotification);

        try {
            const ownerPkForLp = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            const lpTokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPkForLp, { mint: lpMintToQuery }, 'confirmed');
            let currentLpBalanceBN = new BN(0);
            if (lpTokenAccounts.value.length > 0) currentLpBalanceBN = new BN(lpTokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
            setLpTokenBalance(currentLpBalanceBN.toString());

            const lpMintInfo = await getMint(connection, lpMintToQuery);
            const currentTotalLpSupplyBN = new BN(lpMintInfo.supply.toString());
            setTotalLpSupply(currentTotalLpSupplyBN.toString());
            setLpTokenDecimals(lpMintInfo.decimals);

            // Vaults from the selected pool directly
            const vaultAAddress = new PublicKey(selectedPool.vaultA);
            const vaultBAddress = new PublicKey(selectedPool.vaultB);

            const vaultAInfoRaw = await connection.getAccountInfo(vaultAAddress);
            const vaultBInfoRaw = await connection.getAccountInfo(vaultBAddress);

            if (!vaultAInfoRaw || !vaultBInfoRaw) {
                setUserPairedSOL(0); setUserPairedToken(0);
                localNotification = { show: true, message: `LP pool vaults for selected pool ${selectedPool.id.substring(0,6)} not found.`, type: 'info'};
            } else {
                const vaultASolBalanceInfo = await connection.getTokenAccountBalance(vaultAAddress, 'confirmed'); // Assuming vaultA is SOL if mintA of pool is SOL etc. This needs careful mapping based on selectedPool.mintA/mintB
                const totalAssetAVaultBN = new BN(vaultASolBalanceInfo.value.amount);
                
                const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(vaultBAddress, 'confirmed');
                const totalAssetBVaultBN = new BN(vaultBTokenBalanceInfo.value.amount);

                // Determine which vault holds SOL and which holds the token based on selectedPool.mintA/mintB
                let totalSolInPoolBN: BN, totalTokenInPoolBN: BN;
                if (selectedPool.mintA.toUpperCase() === NATIVE_MINT.toBase58().toUpperCase() || selectedPool.mintB.toUpperCase() === NATIVE_MINT.toBase58().toUpperCase()) { // one is SOL
                    if (selectedPool.mintA.toUpperCase() === tokenAddress.toUpperCase()){ // VaultA = Token, VaultB = SOL
                        totalTokenInPoolBN = totalAssetAVaultBN;
                        totalSolInPoolBN = totalAssetBVaultBN;
                    } else { // VaultA = SOL, VaultB = Token
                        totalSolInPoolBN = totalAssetAVaultBN;
                        totalTokenInPoolBN = totalAssetBVaultBN;
                    }
                } else { // Should not happen if pools are always Token vs SOL
                     console.error("[fetchLpTokenDetails] Selected pool is not Token vs SOL, cannot determine vault mapping.");
                     setUserPairedSOL(0); setUserPairedToken(0);
                     throw new Error("Selected pool is not Token vs SOL");
                }


                if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0) && tokenInfo.decimals >= 0) {
                    const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
                    setUserPairedSOL(new Decimal(userShareSolLamportsBN.toString()).div(1e9).toNumber());
                    
                    const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
                    const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
                    setUserPairedToken(tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber());
                    localNotification = { show: true, message: 'LP details for selected pool loaded!', type: 'success' };
                } else {
                    setUserPairedSOL(0); setUserPairedToken(0);
                    const messageText = currentLpBalanceBN.eqn(0) ? 'You have no LP tokens for this pool.' : 'LP details updated (cannot calculate share).';
                    localNotification = { show: true, message: messageText, type: 'info' };
                }
            }
        } catch (err: any) {
            console.error(`[fetchLpTokenDetails] Error for selected pool on ${network}:`, err, err.stack);
            localNotification = { show: true, message: `Failed to fetch LP details for selected pool: ${err.message ? err.message.substring(0,70) : 'Unknown error'}...`, type: 'error' };
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        } finally {
            setNotification(localNotification);
            setTimeout(() => setNotification(prev => prev.message === localNotification.message ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, tokenAddress, connection, tokenInfo, network, setNotification, selectedPool]); // Added selectedPool


    const handleWalletConnected = useCallback(
        async (walletAdapter: PhantomWallet) => {
            if (!walletAdapter?.publicKey) {
                setNotification({show: true, message: 'Failed wallet connection.', type: 'error'}); return;
            }
            setWallet(walletAdapter);
            setNotification({show: true, message: `Wallet connected on ${network}!`, type: 'success'});
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);

            setIsLoading(true);
            try {
                const pkInstance = walletAdapter.publicKey instanceof PublicKey ? walletAdapter.publicKey : new PublicKey(walletAdapter.publicKey.toString());
                const bal = await connection.getBalance(pkInstance);
                setSolBalance(bal / 1e9);
                await initRaydiumSdk(walletAdapter, connection, network);

                if (tokenAddress) { // If a token address was already entered
                    await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
                    // The useEffect depending on tokenInfo and wallet will trigger handleFetchAndDisplayPools
                }
            } catch (e: any) {
                console.error(`Error on connect on ${network}:`, e);
                setNotification({show: true, message: `Connect Error on ${network}: ${e.message}`, type: 'error'});
            } finally {
                setIsLoading(false);
            }
        },
        [connection, network, tokenAddress, fetchTokenBalance, setNotification, setIsLoading] // Removed `initRaydiumSdk` as it's called within
    );

    const refreshBalances = useCallback(async () => {
        if (!wallet?.publicKey) return;
        setIsLoading(true);
        let currentRefreshMessage = `Refreshing balances on ${network}...`;
        setNotification({ show: true, message: currentRefreshMessage, type: 'info' });
        try {
            const pkInstance = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            const bal = await connection.getBalance(pkInstance);
            setSolBalance(bal / 1e9);
            if (tokenAddress && tokenInfo) {
                await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
                if (selectedPool) { // Only fetch LP details if a pool is selected
                    await fetchLpTokenDetails();
                } else {
                    setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                }
            } else {
                setTokenBalance('0');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
             setNotification({show: true, message: `Balances refreshed on ${network}!`, type: 'success'});
        } catch (err: any) {
            console.error(`Error refreshing balances on ${network}:`, err);
            setNotification({show: true, message: `Error refreshing balances: ${err.message}`, type: 'error'});
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => (prev.message.includes("Refreshing balances") || prev.message.includes("Balances refreshed")) ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [wallet, connection, tokenAddress, tokenInfo, selectedPool, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification]);


    const loadTokenInfo = useCallback(async () => {
        if (!tokenAddress) {
            setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            setDiscoveredPools([]); 
            setSelectedPool(null); // +++++ Clear selected pool +++++
            return;
        }
        setIsLoading(true);
        setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        setDiscoveredPools([]); 
        setSelectedPool(null); // +++++ Clear selected pool +++++
        let currentLoadTokenMsg = `Loading token info for ${tokenAddress.substring(0,6)}... on ${network}...`;
        setNotification({ show: true, message: currentLoadTokenMsg, type: 'info' });

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
            currentLoadTokenMsg = 'Token info loaded.';
            setNotification({ show: true, message: currentLoadTokenMsg, type: 'success' });

            if (wallet?.publicKey) {
                const pkInstance = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
                await fetchTokenBalance(pkInstance, mintPub);
            }
        } catch (err: any) {
            console.error(`Error loading token info for ${tokenAddress} on ${network}:`, err);
            currentLoadTokenMsg = `Error loading token on ${network}: ${err.message}`;
            setErrorMessage(currentLoadTokenMsg);
            setNotification({show: true, message: currentLoadTokenMsg, type: 'error'});
            setTokenInfo(null); setTokenBalance('0');
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => prev.message === currentLoadTokenMsg || prev.message.includes("Token info loaded") ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [tokenAddress, connection, wallet, fetchTokenBalance, network, setNotification, setIsLoading, setErrorMessage]);

    const handleFetchAndDisplayPools = useCallback(async (addressToFetch: string) => {
        if (!addressToFetch || !wallet?.publicKey) {
            setDiscoveredPools([]);
            setSelectedPool(null); // +++++ Clear selected pool +++++
            if (addressToFetch && !wallet?.publicKey) {
                setNotification({ show: true, message: "Please connect your wallet to fetch pools.", type: 'info' });
                setTimeout(() => setNotification(prev => prev.message.includes("Please connect") ? { show: false, message: '', type: '' } : prev), 3000);
            }
            return;
        }

        setIsFetchingPools(true);
        setDiscoveredPools([]); 
        setSelectedPool(null); // +++++ Clear selected pool before fetching new ones +++++
        const loadingMsg = `Workspaceing pools for ${addressToFetch.substring(0, 6)}... on ${network}...`;
        setNotification({ show: true, message: loadingMsg, type: 'info' });

        try {
            const sdkCluster = network === 'mainnet-beta' ? 'mainnet' : 'devnet';
            const ownerPk = wallet.publicKey instanceof PublicKey 
                ? wallet.publicKey 
                : new PublicKey(wallet.publicKey.toString());
            
            console.log(`[Page] Calling fetchRaydiumPoolsFromSDK with: token=${addressToFetch}, cluster=${sdkCluster}, owner=${ownerPk.toBase58()}`);
            const pools = await fetchRaydiumPoolsFromSDK(
                connection,
                addressToFetch,
                sdkCluster,
                ownerPk
            );

            if (pools.length > 0) {
                setDiscoveredPools(pools);
                setNotification({ show: true, message: `Found ${pools.length} pool(s) on ${network}.`, type: 'success' });
                setIsPoolListCollapsed(false); // +++++ Expand list when new pools are found +++++
            } else {
                setDiscoveredPools([]);
                setNotification({ show: true, message: `No pools found for this token on ${network}.`, type: 'info' });
                setIsPoolListCollapsed(false); // +++++ Still expand (or keep expanded) to show "no pools" message +++++
            }

        } catch (error: any) {
            console.error(`[Page] Error calling fetchRaydiumPoolsFromSDK on ${network}:`, error);
            const shortError = error.message?.substring(0, 100) || 'Unknown error fetching pools';
            setErrorMessage(shortError);
            setNotification({ show: true, message: `Error fetching pools: ${shortError}`, type: 'error' });
            setDiscoveredPools([]);
        } finally {
            setIsFetchingPools(false);
            setTimeout(() => {
                setNotification(prev => {
                    if (prev.message === loadingMsg || prev.message.includes("Found") || prev.message.includes("No pools found")) {
                        return { show: false, message: '', type: '' };
                    }
                    return prev;
                });
            }, 4000);
        }
    }, [wallet, connection, network, setNotification, setErrorMessage]);


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
                    setDiscoveredPools([]);
                    setSelectedPool(null); // +++++ Clear selected pool +++++
                }
            } else {
                setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                setDiscoveredPools([]);
                setSelectedPool(null); // +++++ Clear selected pool +++++
            }
        }, 600); 
        return () => clearTimeout(handler);
    }, [tokenAddress, network, loadTokenInfo]);

    useEffect(() => {
        if (tokenInfo && tokenAddress && wallet?.publicKey) {
            handleFetchAndDisplayPools(tokenAddress);
        } else if (!wallet?.publicKey && tokenAddress) {
            setDiscoveredPools([]);
            setSelectedPool(null); // +++++ Clear selected pool +++++
             setNotification({ show: true, message: "Connect wallet to see available pools.", type: 'info' });
             setTimeout(() => setNotification({show: false, message: '', type: ''}), 3000);
        } else {
             setDiscoveredPools([]);
             setSelectedPool(null); // +++++ Clear selected pool +++++
        }
    }, [tokenInfo, tokenAddress, wallet?.publicKey?.toString(), network, handleFetchAndDisplayPools]);


    useEffect(() => {
        if (tokenInfo && tokenInfo.isInitialized && typeof tokenInfo.decimals === 'number' && wallet?.publicKey && connection && selectedPool) { // Fetch LP details for selected pool
            fetchLpTokenDetails();
        } else {
            if (lpTokenBalance !== '0' || userPairedSOL !== 0 || userPairedToken !== 0 || totalLpSupply !== '0' || lpTokenDecimals !== 0) {
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
        }
    }, [tokenInfo, wallet?.publicKey?.toString(), connection, network, selectedPool, fetchLpTokenDetails]); // Added selectedPool and network

    // +++++ STEP 2: Implement handler for pool selection +++++
    const handlePoolSelection = (pool: DiscoveredPoolDetailed) => {
        console.log("[Page] Pool selected:", pool);
        setSelectedPool(pool);
        setIsPoolListCollapsed(true); // Collapse the list after selection
        setNotification({ 
            show: true, 
            message: `Pool selected: ${pool.id.substring(0,6)}...\nTVL: $${Number(pool.tvl).toLocaleString()}`, 
            type: 'info' 
        });
        setTimeout(() => setNotification(prev => prev.message.includes("Pool selected") ? {show: false, message: '', type: ''} : prev), 4000);
        
        // When a pool is selected, trigger fetching its specific LP details
        if (tokenInfo && wallet?.publicKey) {
            // fetchLpTokenDetails will now use this selectedPool
        }
    };

    const subtractBalances = useCallback(
        ({ tokenAmount, solAmount }: { tokenAmount: number | string | BN; solAmount: number }) => {
            console.warn('subtractBalances called (placeholder)', { tokenAmount, solAmount });
        },
        [] 
    );

    const handleNetworkChange = (newNetwork: NetworkType) => {
        if (network === newNetwork) return;
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
        setDiscoveredPools([]); 
        setSelectedPool(null); // +++++ Clear selected pool on network change +++++
        setIsPoolListCollapsed(false); // +++++ Reset collapse state +++++
        
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
                {/* ... existing header ... */}
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
                <p className="text-gray-400 text-xs mt-1">Test token minting, LP management, and live pricing.</p>
            </header>

            {wallet && (
                <div className="mb-6 text-center">
                    <button
                        onClick={async () => {
                            // ... (Mint button logic remains the same) ...
                            console.log("[Mint Button onClick] Wallet object being checked:", wallet);
                            if (!isPhantomWallet(wallet)) {
                                setNotification({ show: true, message: 'Wallet connected is not compatible for minting. Check console.', type: 'error' });
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                                return;
                            }
                            if (network !== 'devnet') {
                                setNotification({show: true, message: 'Token minting is only enabled on Devnet for this sandbox.', type: 'info'});
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
                                return;
                            }
                            
                            const pkForMinting = wallet.publicKey instanceof PublicKey
                                ? wallet.publicKey
                                : new PublicKey(wallet.publicKey.toString());

                            const walletForMintingAdapter: StrictPhantomWalletForMinting = {
                                publicKey: pkForMinting,
                                signTransaction: async (tx: Transaction): Promise<Transaction> => {
                                    const signedTx = await wallet.signTransaction(tx);
                                    if (!(signedTx instanceof Transaction)) {
                                        console.error("Minting: signTransaction expected legacy Transaction, received different type.");
                                        throw new Error("Signing error: Expected legacy transaction for minting.");
                                    }
                                    return signedTx;
                                },
                                signAllTransactions: async (txs: Transaction[]): Promise<Transaction[]> => {
                                    const signedTxs = await wallet.signAllTransactions(txs);
                                    if (!signedTxs.every((t: any) => t instanceof Transaction)) {
                                        console.error("Minting: signAllTransactions expected array of legacy Transactions.");
                                        throw new Error("Signing error: Expected legacy transactions for minting.");
                                    }
                                    return signedTxs as Transaction[];
                                },
                                isPhantom: wallet.isPhantom, 
                            };

                            setIsLoading(true);
                            setNotification({ show: true, message: `Minting TestToken on ${network}...`, type: 'info' });
                            try {
                                const result = await mintTokenWithPhantomWallet(walletForMintingAdapter, connection, 'TestToken');
                                if (result?.mintAddress) {
                                    setTokenAddress(result.mintAddress); // This will trigger useEffect to load info and fetch pools
                                    setNotification({show: true, message: `Token minted on ${network}!\nAddress: ${result.mintAddress.substring(0,10)}... Loading info...`, type: 'success'});
                                } else {
                                    throw new Error('Minting did not return address.');
                                }
                            } catch (err: any) {
                                console.error('Mint error:', err);
                                setNotification({show: true, message: `Mint Failed on ${network}: ${err.message || 'Unknown'}`, type: 'error'});
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                            } finally {
                                setIsLoading(false);
                                setTimeout(() => setNotification(prev => prev.message.includes("Minting TestToken") ? { show: false, message: '', type: '' } : prev), 4000);
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
                            <TokenInfo
                                tokenInfo={tokenInfo}
                                tokenBalance={tokenBalance}
                                solBalance={solBalance}
                                lpTokenBalance={lpTokenBalance}
                                userPairedSOL={userPairedSOL}
                                userPairedToken={userPairedToken}
                                totalLpSupply={totalLpSupply}
                                lpTokenDecimals={lpTokenDecimals}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <LiveTokenChart
                                tokenMint={tokenAddress}
                                tokenDecimals={tokenInfo.decimals}
                                tokenSupply={tokenInfo.supply}
                                connection={connection}
                                // +++++ Pass selectedPool to LiveTokenChart (optional for now, future step) +++++
                                // selectedPool={selectedPool}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 flex items-center justify-center bg-gray-900 p-6 rounded-lg border border-gray-800 text-gray-500 min-h-[200px]">
                        {isLoading ? 'Processing...' : !wallet ? `Connect wallet to see token details on ${network}.` : `Load a token on ${network} to see live chart and LP details.`}
                    </div>
                )}
            </div>
            
            {/* +++++ STEP 3: Modify JSX for Discovered Pools with Collapse/Expand and Selection Info +++++ */}
            {wallet?.publicKey && tokenAddress && (
                <div className="my-6 bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-white">
                            Discovered Pools on <span className="text-yellow-400">{network}</span> for <span className="font-mono text-sm text-purple-300">{tokenAddress.substring(0,6)}...</span>
                            <span className="text-gray-400"> ({discoveredPools.length})</span>
                        </h3>
                        {discoveredPools.length > 0 && (
                             <button 
                                onClick={() => setIsPoolListCollapsed(!isPoolListCollapsed)}
                                className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                            >
                                {isPoolListCollapsed ? 'Show Pools' : 'Hide Pools'}
                            </button>
                        )}
                    </div>

                    {selectedPool && (
                        <div className="mb-3 p-3 bg-gray-800 border border-gray-700 rounded-md text-sm">
                            <p className="font-semibold text-green-400">Selected Pool:</p>
                            <p><span className="text-gray-400">ID:</span> <span className="text-white font-mono">{selectedPool.id}</span></p>
                            <p><span className="text-gray-400">TVL:</span> <span className="text-white">${Number(selectedPool.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                            <p><span className="text-gray-400">Type:</span> <span className="text-white">{selectedPool.type}</span></p>
                        </div>
                    )}

                    {isFetchingPools && <div className="flex items-center text-gray-400"><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>Searching for liquidity pools...</div>}
                    
                    {!isPoolListCollapsed && !isFetchingPools && discoveredPools.length === 0 && tokenAddress && (
                        <p className="text-gray-500 mt-2">No liquidity pools found for this token when paired with SOL on {network}.</p>
                    )}

                    {!isPoolListCollapsed && discoveredPools.length > 0 && (
                        <ul className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {discoveredPools.map((pool, index) => (
                                <li key={pool.id + "_" + index} 
                                    className={`p-3 rounded-md border text-xs shadow-md transition-all duration-150 ease-in-out 
                                                ${selectedPool?.id === pool.id ? 'bg-green-700 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-500'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className={`font-semibold ${selectedPool?.id === pool.id ? 'text-white' : 'text-blue-400'}`}>
                                            Pool ID: <span className={`${selectedPool?.id === pool.id ? 'text-gray-200' : 'text-white'} font-mono`}>{pool.id}</span>
                                        </p>
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(pool.id)} 
                                            title="Copy Pool ID" 
                                            className="ml-2 text-gray-500 hover:text-gray-300 text-sm p-1 rounded hover:bg-gray-700"
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-1">
                                        <p><span className="text-gray-400">Type:</span> <span className="text-white font-medium">{pool.type}</span></p>
                                        <p><span className="text-gray-400">Price (vs SOL):</span> <span className="text-white">{Number(pool.price).toExponential(6)}</span></p>
                                        <p><span className="text-gray-400">TVL (USD):</span> <span className="text-white">${Number(pool.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                                        <p className="sm:col-span-2"><span className="text-gray-400">Program ID:</span> <span className="text-white font-mono text-xs break-all">{pool.programId}</span></p>
                                        <p><span className="text-gray-400">Vault A:</span> <span className="text-white font-mono text-xs break-all">{pool.vaultA}</span></p>
                                        <p><span className="text-gray-400">Vault B:</span> <span className="text-white font-mono text-xs break-all">{pool.vaultB}</span></p>
                                    </div>
                                    <button
                                        onClick={() => handlePoolSelection(pool)}
                                        className={`mt-2 w-full px-3 py-1.5 text-xs rounded transition-colors ${selectedPool?.id === pool.id ? 'bg-gray-600 text-gray-400 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                                        disabled={selectedPool?.id === pool.id}
                                    >
                                        {selectedPool?.id === pool.id ? '✓ Selected' : 'Select This Pool'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}


            {wallet && tokenInfo ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* @ts-ignore */}
                    <SimulatedLiquidityManager
                        wallet={wallet}
                        connection={connection}
                        tokenAddress={tokenAddress}
                        tokenDecimals={tokenInfo.decimals}
                        tokenBalance={tokenBalance}
                        solBalance={solBalance}
                        refreshBalances={refreshBalances}
                        subtractBalances={subtractBalances}
                        // +++++ Pass selectedPool to SimulatedLiquidityManager (optional for now, future step) +++++
                        // selectedPool={selectedPool} 
                    />
                    <TradingInterface
                        wallet={wallet}
                        connection={connection}
                        tokenAddress={tokenAddress} // This might eventually become selectedPool.mintA (if not SOL)
                        tokenDecimals={tokenInfo.decimals} // This might need to come from selectedPool.mintA's decimals
                        tokenBalance={tokenBalance}
                        solBalance={solBalance}
                        refreshBalances={refreshBalances}
                        subtractBalances={subtractBalances}
                        // +++++ Pass selectedPool to TradingInterface +++++
                        selectedPool={selectedPool}
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
                        'bg-blue-700 text-blue-100'
                    }`}>
                        {notification.message}
                    </div>
                </div>
            )}
        </div>
    );
}