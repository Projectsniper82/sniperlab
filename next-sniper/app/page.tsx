// app/page.tsx
'use client';

// Polyfill must come first
import '@/utils/bufferPolyfill';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
// Solana Web3 & SPL Token
import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction, TransactionMessage, TransactionInstruction } from '@solana/web3.js';
import { NATIVE_MINT, getMint } from '@solana/spl-token';
import { getCreatePoolKeys } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import Decimal from 'decimal.js';

// Context
import { useNetwork, NetworkType } from '@/context/NetworkContext';

// Utils
import {
    MAINNET_AMM_V4_PROGRAM_ID,
    DEVNET_AMM_V4_PROGRAM_ID, // Used for Mainnet AMMv4 derivation if selectedPool is of that type
    MAINNET_AMM_V4_CONFIG_ID_STR,
    DEVNET_AMM_V4_CONFIG_ID_STR, // Used for Devnet CPMM derivation
    DEVNET_CREATE_POOL_PROGRAM_ID // Used for Devnet CPMM derivation
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
    signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction | any>; 
    signAllTransactions: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[] | any[]>;
    isPhantom?: boolean;
}

// Type guard for PhantomWallet
function isPhantomWallet(wallet: any): wallet is PhantomWallet {
    console.log("[isPhantomWallet Check] Validating wallet object:", wallet);
    if (!wallet || typeof wallet !== 'object') {
        console.log("[isPhantomWallet Check] Failed: Wallet is null, undefined, or not an object.");
        return false;
    }
    if (!wallet.publicKey || typeof wallet.publicKey.toString !== 'function') {
        console.log("[isPhantomWallet Check] Failed: publicKey property is missing or lacks a toString method.");
        return false;
    }
    try {
        new PublicKey(wallet.publicKey.toString());
         console.log(`[isPhantomWallet Check] publicKey validation: OK (${wallet.publicKey.toString().substring(0,6)}...)`);
    } catch (e) {
        console.log("[isPhantomWallet Check] Failed: publicKey construction error:", e);
        return false;
    }
    if (typeof wallet.signTransaction !== 'function' || typeof wallet.signAllTransactions !== 'function') {
        console.log("[isPhantomWallet Check] Failed: Missing required signing function(s).");
        return false;
    }
    console.log("[isPhantomWallet Check] Passed all checks.");
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

    const fetchTokenBalance = useCallback(async (ownerPublicKey: PublicKey, mintPublicKey: PublicKey) => {
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
    }, [connection, network]);

    const fetchLpTokenDetails = useCallback(async () => {
        console.log("[fetchLpTokenDetails] Attempting to fetch LP details...");
        if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo) {
            console.log("[fetchLpTokenDetails] Skipped: Prerequisites not met (wallet, tokenAddress, connection, or tokenInfo).");
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
        if (typeof tokenInfo.decimals !== 'number' || isNaN(tokenInfo.decimals)) {
            console.warn("[fetchLpTokenDetails] skipped: tokenInfo.decimals not available or invalid.", tokenInfo.decimals);
            return;
        }
    
        let localNotificationMessage = `Workspaceing LP details for ${tokenAddress.substring(0, 6)}...`;
        setNotification({ show: true, message: localNotificationMessage, type: 'info' });
    
        let lpMintToQuery: PublicKey | null = null;
        let vaultAAddressToQuery: PublicKey | null = null;
        let vaultBAddressToQuery: PublicKey | null = null;
        let poolMintAString: string = ''; // Will be SOL or Token
        let poolMintBString: string = ''; // Will be Token or SOL
    
        if (selectedPool) {
            console.log("[fetchLpTokenDetails] Using selectedPool:", selectedPool.id);
            localNotificationMessage = `Workspaceing LP details for selected pool ${selectedPool.id.substring(0,6)}...`;
            setNotification({ show: true, message: localNotificationMessage, type: 'info' });

            if (selectedPool.rawSdkPoolInfo && (selectedPool.rawSdkPoolInfo as any).lpMint) {
                try { lpMintToQuery = new PublicKey((selectedPool.rawSdkPoolInfo as any).lpMint); } catch (e) { /* ignore error, will fallback */ }
            }
            // If lpMint still not found from rawSdkPoolInfo, it might be in the top-level of selectedPool for some pool types
            if (!lpMintToQuery && (selectedPool as any).lpMint) {
                 try { lpMintToQuery = new PublicKey((selectedPool as any).lpMint); } catch (e) { /* ignore */ }
            }

            try { vaultAAddressToQuery = new PublicKey(selectedPool.vaultA); } catch (e) { /* ... */ }
            try { vaultBAddressToQuery = new PublicKey(selectedPool.vaultB); } catch (e) { /* ... */ }
            poolMintAString = selectedPool.mintA;
            poolMintBString = selectedPool.mintB;

        }
        
        // Fallback or if selectedPool didn't provide all info (especially lpMint)
        if (!lpMintToQuery || !vaultAAddressToQuery || !vaultBAddressToQuery || !poolMintAString || !poolMintBString) {
            console.log("[fetchLpTokenDetails] Deriving pool keys as selectedPool info was insufficient or missing.");
            const mintA_SOL = NATIVE_MINT;
            const mintB_Token = new PublicKey(tokenAddress);
            // Use CREATE_POOL_PROGRAM_ID for Devnet CPMM pools, AMM_V4 for mainnet standard pools
            const cpmmProgramIdToUse = network === 'mainnet-beta' ? MAINNET_AMM_V4_PROGRAM_ID : DEVNET_CREATE_POOL_PROGRAM_ID;
            const feeConfigIdToUse = network === 'mainnet-beta' ? new PublicKey(MAINNET_AMM_V4_CONFIG_ID_STR) : new PublicKey(DEVNET_AMM_V4_CONFIG_ID_STR);
            try {
                const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramIdToUse, configId: feeConfigIdToUse, mintA: mintA_SOL, mintB: mintB_Token });
                lpMintToQuery = derivedPoolKeys.lpMint;
                vaultAAddressToQuery = derivedPoolKeys.vaultA;
                vaultBAddressToQuery = derivedPoolKeys.vaultB;
                poolMintAString = mintA_SOL.toBase58();
                poolMintBString = mintB_Token.toBase58();
                console.log("[fetchLpTokenDetails] Derived keys: LP Mint:", lpMintToQuery?.toBase58(), "VaultA:", vaultAAddressToQuery?.toBase58(), "VaultB:", vaultBAddressToQuery?.toBase58());
            } catch (e) {
                console.error("[fetchLpTokenDetails] Error deriving default AMM pool keys:", e);
                setNotification({ show: true, message: "Could not derive pool keys for LP details.", type: 'error' });
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                return;
            }
        }

        if (!lpMintToQuery || !vaultAAddressToQuery || !vaultBAddressToQuery) {
            console.error("[fetchLpTokenDetails] Critical error: One or more pool addresses (LP Mint, Vaults) are null.");
            setNotification({ show: true, message: "Error: Pool address information is incomplete.", type: 'error'});
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
    
        console.log(`[fetchLpTokenDetails] Final query targets: LP Mint=${lpMintToQuery.toBase58()}, VaultA=${vaultAAddressToQuery.toBase58()}, VaultB=${vaultBAddressToQuery.toBase58()}`);
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
    
            const vaultAInfoRaw = await connection.getAccountInfo(vaultAAddressToQuery);
            const vaultBInfoRaw = await connection.getAccountInfo(vaultBAddressToQuery);
    
            if (!vaultAInfoRaw || !vaultBInfoRaw) {
                setUserPairedSOL(0); setUserPairedToken(0);
                setNotification({ show: true, message: `LP pool vaults not found. Pool might not exist or be initialized with this config.`, type: 'info'});
            } else {
                const vaultASolBalanceInfo = await connection.getTokenAccountBalance(vaultAAddressToQuery, 'confirmed');
                const totalAssetAVaultBN = new BN(vaultASolBalanceInfo.value.amount);
                const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(vaultBAddressToQuery, 'confirmed');
                const totalAssetBVaultBN = new BN(vaultBTokenBalanceInfo.value.amount);
    
                let totalSolInPoolBN: BN, totalTokenInPoolBN: BN;
                const NATIVE_MINT_STR_UPPER = NATIVE_MINT.toBase58().toUpperCase();
                const TOKEN_ADDRESS_STR_UPPER = tokenAddress.toUpperCase(); // Current token in input box
                const POOL_MINT_A_STR_UPPER = poolMintAString.toUpperCase();
                const POOL_MINT_B_STR_UPPER = poolMintBString.toUpperCase();
                
                console.log("[fetchLpTokenDetails] Vault Matching Logic Inputs:", { POOL_MINT_A_STR_UPPER, POOL_MINT_B_STR_UPPER, NATIVE_MINT_STR_UPPER, TOKEN_ADDRESS_STR_UPPER });

                if (POOL_MINT_A_STR_UPPER === NATIVE_MINT_STR_UPPER && POOL_MINT_B_STR_UPPER === TOKEN_ADDRESS_STR_UPPER) { 
                    totalSolInPoolBN = totalAssetAVaultBN; totalTokenInPoolBN = totalAssetBVaultBN;
                    console.log("[fetchLpTokenDetails] Matched: VaultA=SOL, VaultB=Token");
                } else if (POOL_MINT_A_STR_UPPER === TOKEN_ADDRESS_STR_UPPER && POOL_MINT_B_STR_UPPER === NATIVE_MINT_STR_UPPER) { 
                    totalTokenInPoolBN = totalAssetAVaultBN; totalSolInPoolBN = totalAssetBVaultBN;
                    console.log("[fetchLpTokenDetails] Matched: VaultA=Token, VaultB=SOL");
                } else {
                    console.error("[fetchLpTokenDetails] Pool's mints do not match NATIVE_MINT and current tokenAddress.", { poolMintAString, poolMintBString, nativeMint: NATIVE_MINT.toBase58(), currentToken: tokenAddress });
                    setUserPairedSOL(0); setUserPairedToken(0);
                    throw new Error("Pool mints do not match expected pair (SOL & current token).");
                }
    
                if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0) && tokenInfo.decimals >= 0) {
                    const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
                    setUserPairedSOL(new Decimal(userShareSolLamportsBN.toString()).div(1e9).toNumber());
                    const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
                    const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
                    setUserPairedToken(tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber());
                    setNotification({ show: true, message: 'LP details loaded!', type: 'success' });
                } else {
                    setUserPairedSOL(0); setUserPairedToken(0);
                    const messageText = currentLpBalanceBN.eqn(0) ? 'You have no LP tokens for this pool.' : 'LP details updated (cannot calculate share).';
                    setNotification({ show: true, message: messageText, type: 'info' });
                }
            }
        } catch (err: any) {
            console.error(`[fetchLpTokenDetails] Error for pool on ${network}:`, err, err.stack);
            setNotification({ show: true, message: `Failed to fetch LP details: ${err.message ? err.message.substring(0,70) : 'Unknown error'}...`, type: 'error' });
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        } finally {
            // Clear notification only if it's the one we set, to avoid clearing other transient messages
            setTimeout(() => setNotification(prev => prev.message.startsWith("Fetching LP details") || prev.message.includes("LP details loaded") ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, tokenAddress, connection, tokenInfo, network, selectedPool, setNotification]);


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

                if (tokenAddress) { 
                    await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
                }
            } catch (e: any) {
                console.error(`Error on connect on ${network}:`, e);
                setNotification({show: true, message: `Connect Error on ${network}: ${e.message}`, type: 'error'});
            } finally {
                setIsLoading(false);
            }
        },
        [connection, network, tokenAddress, fetchTokenBalance, setNotification, setIsLoading]
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
                // Always try to fetch LP token details, it will use selectedPool or derive
                await fetchLpTokenDetails(); 
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
    }, [wallet, connection, tokenAddress, tokenInfo, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification]);


    const loadTokenInfo = useCallback(async () => {
        console.log(`[loadTokenInfo] Called. Address: '${tokenAddress}', Network: ${network}`);
        if (!tokenAddress) {
            console.log("[loadTokenInfo] No tokenAddress provided. Resetting tokenInfo and related states.");
            setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            setDiscoveredPools([]); setSelectedPool(null);
            return;
        }
        setIsLoading(true);
        console.log("[loadTokenInfo] Resetting tokenInfo to null before fetching.");
        setTokenInfo(null); 
        setTokenBalance('0'); setErrorMessage('');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        setDiscoveredPools([]); setSelectedPool(null); 
        
        let currentLoadTokenMsg = `Loading token info for ${tokenAddress.substring(0,6)}... on ${network}...`;
        setNotification({ show: true, message: currentLoadTokenMsg, type: 'info' });
        console.log(`[loadTokenInfo] Fetching info for mint: ${tokenAddress}`);

        try {
            const mintPub = new PublicKey(tokenAddress);
            const info = await connection.getParsedAccountInfo(mintPub);
            console.log("[loadTokenInfo] Raw account info from RPC:", info);

            if (!info.value?.data || !('parsed' in info.value.data)) {
                console.error("[loadTokenInfo] Mint account data is invalid or not found:", info);
                throw new Error('Mint account not found or its data is invalid');
            }
            
            const parsedData = info.value.data as any; 
            if (parsedData.program !== 'spl-token' || parsedData.parsed.type !== 'mint') {
                 console.error("[loadTokenInfo] The provided address is not an SPL Token mint account:", parsedData);
                throw new Error('Address is not a valid SPL Token mint');
            }
            
            const decs = parsedData.parsed.info.decimals ?? 0;
            const supply = parsedData.parsed.info.supply ?? '0';
            const ti: TokenInfoState = { address: tokenAddress, decimals: Number(decs), supply, isInitialized: true };
            
            setTokenInfo(ti); 
            console.log("[loadTokenInfo] Successfully set tokenInfo state:", ti);
            currentLoadTokenMsg = 'Token info loaded.';
            setNotification({ show: true, message: currentLoadTokenMsg, type: 'success' });

            if (wallet?.publicKey) {
                const pkInstance = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
                await fetchTokenBalance(pkInstance, mintPub);
            }
        } catch (err: any) {
            console.error(`[loadTokenInfo] Error loading token info for ${tokenAddress} on ${network}:`, err.message, err.stack);
            currentLoadTokenMsg = `Error loading token: ${err.message}`;
            setErrorMessage(currentLoadTokenMsg);
            setNotification({show: true, message: currentLoadTokenMsg, type: 'error'});
            setTokenInfo(null); 
            setTokenBalance('0');
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => (prev.message === currentLoadTokenMsg || prev.message.includes("Token info loaded.")) ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [tokenAddress, connection, wallet, fetchTokenBalance, network, setNotification, setIsLoading, setErrorMessage]);
    
    useEffect(() => {
        console.log("[Debug] HomePage: tokenInfo state has changed to:", tokenInfo);
    }, [tokenInfo]);

    const handleFetchAndDisplayPools = useCallback(async (addressToFetch: string) => {
        if (!addressToFetch || !wallet?.publicKey) {
            setDiscoveredPools([]); setSelectedPool(null);
            if (addressToFetch && !wallet?.publicKey) {
                setNotification({ show: true, message: "Please connect your wallet to fetch pools.", type: 'info' });
                setTimeout(() => setNotification(prev => prev.message.includes("Please connect") ? { show: false, message: '', type: '' } : prev), 3000);
            }
            return;
        }

        setIsFetchingPools(true);
        setDiscoveredPools([]); setSelectedPool(null);
        const loadingMsg = `Workspaceing pools for ${addressToFetch.substring(0, 6)}... on ${network}...`;
        setNotification({ show: true, message: loadingMsg, type: 'info' });

        try {
            const sdkCluster = network === 'mainnet-beta' ? 'mainnet' : 'devnet';
            const ownerPk = wallet.publicKey instanceof PublicKey 
                ? wallet.publicKey 
                : new PublicKey(wallet.publicKey.toString());
            
            console.log(`[Page] Calling fetchRaydiumPoolsFromSDK with: token=${addressToFetch}, cluster=${sdkCluster}, owner=${ownerPk.toBase58()}`);
            const pools = await fetchRaydiumPoolsFromSDK(
                connection, addressToFetch, sdkCluster, ownerPk
            );

            if (pools.length > 0) {
                setDiscoveredPools(pools);
                setNotification({ show: true, message: `Found ${pools.length} pool(s) on ${network}.`, type: 'success' });
                setIsPoolListCollapsed(false);
                 // If only one pool is found on Devnet, auto-select it
                 if (network === 'devnet' && pools.length === 1) {
                    console.log("[Page] Auto-selecting the only discovered Devnet pool.");
                    handlePoolSelection(pools[0]);
                }

            } else {
                setDiscoveredPools([]);
                setNotification({ show: true, message: `No pools found for this token on ${network}.`, type: 'info' });
                setIsPoolListCollapsed(false);
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
    }, [wallet, connection, network, setNotification, setErrorMessage]); // Removed handlePoolSelection from deps to avoid re-triggering


    useEffect(() => {
        console.log(`[useEffect for tokenAddress/network] tokenAddress: '${tokenAddress}', network: ${network}`);
        const handler = setTimeout(async () => {
            console.log(`[useEffect for tokenAddress/network] Debounced call. tokenAddress: '${tokenAddress}'`);
            if (tokenAddress) {
                try {
                    new PublicKey(tokenAddress); 
                    await loadTokenInfo(); 
                } catch (e: any) {
                    console.error(`[useEffect for tokenAddress/network] Invalid token address format: ${tokenAddress}`, e.message);
                    setErrorMessage('Invalid token address format.');
                    setTokenInfo(null); setTokenBalance('0');
                    setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                    setDiscoveredPools([]); setSelectedPool(null);
                }
            } else {
                console.log("[useEffect for tokenAddress/network] No tokenAddress, ensuring states are clear.");
                setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                setDiscoveredPools([]); setSelectedPool(null);
            }
        }, 600); 
        return () => clearTimeout(handler);
    }, [tokenAddress, network, loadTokenInfo]);

    useEffect(() => {
        if (tokenInfo && tokenAddress && wallet?.publicKey) {
            // Only fetch pools if not on devnet OR if on devnet and no pool is selected yet (to allow auto-selection of single pool)
            if (network !== 'devnet' || (network === 'devnet' && !selectedPool && discoveredPools.length === 0) ) {
                 handleFetchAndDisplayPools(tokenAddress);
            } else if (network === 'devnet' && selectedPool) {
                console.log("[Page] On Devnet with a selected pool, skipping redundant pool fetch.");
            }
        } else if (!wallet?.publicKey && tokenAddress) {
            setDiscoveredPools([]); setSelectedPool(null);
            setNotification({ show: true, message: "Connect wallet to see available pools.", type: 'info' });
            setTimeout(() => setNotification({show: false, message: '', type: ''}), 3000);
        } else {
            setDiscoveredPools([]); setSelectedPool(null);
        }
    }, [tokenInfo, tokenAddress, wallet?.publicKey?.toString(), network, handleFetchAndDisplayPools, selectedPool, discoveredPools.length]);


    useEffect(() => {
        // Fetch LP details if tokenInfo is available AND (a selectedPool exists OR we are on devnet where we derive)
        const canFetch = tokenInfo && 
                         tokenInfo.isInitialized && 
                         typeof tokenInfo.decimals === 'number' && 
                         wallet?.publicKey && 
                         connection;

        if (canFetch && (selectedPool || network === 'devnet')) {
            console.log(`[useEffect for LP Details] Conditions met. SelectedPool: ${selectedPool ? selectedPool.id : 'null'}, Network: ${network}. Calling fetchLpTokenDetails.`);
            fetchLpTokenDetails();
        } else {
            console.log(`[useEffect for LP Details] Conditions NOT met or selectedPool is null on Mainnet. Clearing LP details. SelectedPool: ${selectedPool ? selectedPool.id : 'null'}, Network: ${network}`);
            if (lpTokenBalance !== '0' || userPairedSOL !== 0 || userPairedToken !== 0 || totalLpSupply !== '0' || lpTokenDecimals !== 0) {
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
        }
    }, [tokenInfo, wallet?.publicKey?.toString(), connection, network, selectedPool, fetchLpTokenDetails]);


    const handlePoolSelection = (pool: DiscoveredPoolDetailed) => {
        console.log("[Page] Pool selected:", pool);
        setSelectedPool(pool);
        setIsPoolListCollapsed(true); // Collapse list after selection
        setNotification({ 
            show: true, 
            message: `Pool selected: ${pool.id.substring(0,6)}...\nTVL: $${Number(pool.tvl).toLocaleString()}`, 
            type: 'info' 
        });
        setTimeout(() => setNotification(prev => prev.message.includes("Pool selected") ? {show: false, message: '', type: ''} : prev), 4000);
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
        setWallet(null); setTokenAddress(''); setTokenInfo(null);
        setSolBalance(0); setTokenBalance('0');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0);
        setTotalLpSupply('0'); setLpTokenDecimals(0);
        setErrorMessage(''); setIsLoading(false);
        setDiscoveredPools([]); setSelectedPool(null);
        setIsPoolListCollapsed(false);
        
        setNetwork(newNetwork);
        
        setNotification({
            show: true,
            message: `Switched to ${newNetwork}. Reconnect wallet and reload token if needed.`,
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
                <p className="text-gray-400 text-xs mt-1">Test token minting, LP management, and live pricing.</p>
            </header>

            {wallet && (
                <div className="mb-6 text-center">
                    <button
                        onClick={async () => {
                            const isCompatible = isPhantomWallet(wallet);
                            console.log("[Mint Button onClick] isPhantomWallet compatible:", isCompatible);

                            if (!isCompatible) {
                                setNotification({ show: true, message: 'Wallet connected is not compatible for minting. Check console for isPhantomWallet logs.', type: 'error' });
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
                                    console.log("[Mint Adapter.signTransaction] Legacy tx received by adapter for signing by wallet:", tx);
                                    const signedResultFromWallet = await wallet.signTransaction(tx); // This is the actual wallet provider call
                                    console.log("[Mint Adapter.signTransaction] Raw result from wallet.signTransaction:", signedResultFromWallet);

                                    if (signedResultFromWallet instanceof Transaction) {
                                        console.log("[Mint Adapter.signTransaction] Wallet returned a legacy Transaction instance. OK.");
                                        return signedResultFromWallet;
                                    } else if (signedResultFromWallet && typeof signedResultFromWallet === 'object' && 
                                               signedResultFromWallet.signatures && signedResultFromWallet.feePayer && 
                                               signedResultFromWallet.instructions && signedResultFromWallet.recentBlockhash) {
                                        console.log("[Mint Adapter.signTransaction] Wallet returned plain object, reconstructing as legacy Transaction.");
                                        
                                        const reconstructedTx = new Transaction();
                                        reconstructedTx.feePayer = new PublicKey(signedResultFromWallet.feePayer.toString());
                                        reconstructedTx.recentBlockhash = signedResultFromWallet.recentBlockhash;
                                        if (signedResultFromWallet.lastValidBlockHeight) {
                                            reconstructedTx.lastValidBlockHeight = signedResultFromWallet.lastValidBlockHeight;
                                        }

                                        signedResultFromWallet.instructions.forEach((instr: any) => {
                                            reconstructedTx.add(new TransactionInstruction({
                                                keys: instr.keys.map((k: any) => ({
                                                    pubkey: new PublicKey(k.pubkey.toString()),
                                                    isSigner: k.isSigner,
                                                    isWritable: k.isWritable,
                                                })),
                                                programId: new PublicKey(instr.programId.toString()),
                                                data: Buffer.isBuffer(instr.data) ? instr.data : Buffer.from(instr.data),
                                            }));
                                        });
                                       
                                        const finalSignaturesMap = new Map<string, Buffer>();
                                        // Prioritize signatures from the wallet's response, as it should be the most complete.
                                        if (Array.isArray(signedResultFromWallet.signatures)) {
                                            signedResultFromWallet.signatures.forEach((sigInfo: any) => {
                                                if (sigInfo.signature && sigInfo.publicKey) { 
                                                    finalSignaturesMap.set(new PublicKey(sigInfo.publicKey.toString()).toBase58(), 
                                                                         Buffer.isBuffer(sigInfo.signature) ? sigInfo.signature : Buffer.from(sigInfo.signature));
                                                }
                                            });
                                        }
                                        // Ensure original tx signatures (like mintKeypair's) are also included if not already present
                                        // (though Phantom's response should ideally contain all relevant signatures it processed/added)
                                        tx.signatures.forEach(sigPair => {
                                            if (sigPair.signature && sigPair.publicKey) {
                                                const pkStr = sigPair.publicKey.toBase58();
                                                if (!finalSignaturesMap.has(pkStr)) { // Add only if not already set from wallet's response
                                                    console.log(`[Mint Adapter.signTransaction] Adding signature from original tx for ${pkStr} as it was not in wallet's direct response signatures list.`);
                                                    finalSignaturesMap.set(pkStr, sigPair.signature);
                                                }
                                            }
                                        });
                                        
                                        finalSignaturesMap.forEach((signature, pubkeyString) => {
                                            reconstructedTx.addSignature(new PublicKey(pubkeyString), signature);
                                        });
                                        
                                        console.log("[Mint Adapter.signTransaction] Reconstructed legacy Transaction with processed signatures:", reconstructedTx.signatures);
                                        return reconstructedTx;

                                    } else if (signedResultFromWallet instanceof VersionedTransaction) {
                                        console.error("[Mint Adapter.signTransaction] Wallet returned VersionedTransaction. This is not directly usable by the legacy minting utility.");
                                        throw new Error("Wallet returned a VersionedTransaction; minting utility expects legacy Transaction instance.");
                                    } else {
                                        console.error("[Mint Adapter.signTransaction] Wallet returned an unknown or incomplete transaction type:", signedResultFromWallet);
                                        throw new Error("Wallet returned an unknown or incomplete transaction type after signing.");
                                    }
                                },
                                signAllTransactions: async (txs: Transaction[]): Promise<Transaction[]> => {
                                    console.log("[Mint Adapter.signAllTransactions] Legacy transactions received:", txs);
                                    const signedResultsFromWallet = await wallet.signAllTransactions(txs);
                                     console.log("[Mint Adapter.signAllTransactions] Results from wallet:", signedResultsFromWallet);
                                    if (signedResultsFromWallet.every((t:any) => t instanceof Transaction || (t && typeof t === 'object' && t.signatures))) {
                                        return signedResultsFromWallet.map((signedResult: any, index: number) => {
                                            if (signedResult instanceof Transaction) return signedResult;
                                            if (signedResult && typeof signedResult === 'object' && signedResult.signatures) {
                                                const originalTx = txs[index];
                                                const reconstructedTx = new Transaction();
                                                reconstructedTx.feePayer = new PublicKey(signedResult.feePayer.toString());
                                                reconstructedTx.recentBlockhash = signedResult.recentBlockhash;
                                                signedResult.instructions.forEach((instr: any) => reconstructedTx.add(new TransactionInstruction({ keys: instr.keys.map((k: any) => ({ pubkey: new PublicKey(k.pubkey.toString()), isSigner: k.isSigner, isWritable: k.isWritable })), programId: new PublicKey(instr.programId.toString()), data: Buffer.from(instr.data) })));
                                                const finalSigsMap = new Map<string, Buffer>();
                                                originalTx.signatures.forEach(s => { if(s.signature) finalSigsMap.set(s.publicKey.toBase58(), s.signature);});
                                                signedResult.signatures.forEach((si: any) => { if(si.signature && si.publicKey) finalSigsMap.set(new PublicKey(si.publicKey.toString()).toBase58(), Buffer.from(si.signature));});
                                                finalSigsMap.forEach((sig, pkStr) => reconstructedTx.addSignature(new PublicKey(pkStr), sig));
                                                return reconstructedTx;
                                            }
                                            throw new Error(`signAllTransactions: Unsupported type at index ${index}`);
                                        }) as Transaction[];
                                    }
                                    throw new Error("signAllTransactions: Wallet returned unexpected types.");
                                },
                                isPhantom: wallet.isPhantom,
                            };

                            setIsLoading(true);
                            setNotification({ show: true, message: `Minting TestToken on ${network}...`, type: 'info' });
                            try {
                                const result = await mintTokenWithPhantomWallet(walletForMintingAdapter, connection, 'TestToken');
                                if (result?.mintAddress) {
                                    setTokenAddress(result.mintAddress); 
                                    setNotification({show: true, message: `Token minted on ${network}!\nAddress: ${result.mintAddress.substring(0,10)}... Loading info...`, type: 'success'});
                                } else { 
                                    throw new Error('Minting did not return address.'); 
                                }
                            } catch (err: any) {
                                console.error('Mint error:', err.message, err.stack);
                                setNotification({show: true, message: `Mint Failed on ${network}: ${err.message || 'Unknown'}`, type: 'error'});
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
                            />
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 flex items-center justify-center bg-gray-900 p-6 rounded-lg border border-gray-800 text-gray-500 min-h-[200px]">
                        {isLoading ? 'Processing...' : !wallet ? `Connect wallet to see token details on ${network}.` : `Load a token on ${network} to see live chart and LP details.`}
                    </div>
                )}
            </div>
            
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
                        <ul className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
                            {discoveredPools.map((pool, index) => (
                                <li key={pool.id + "_" + index} 
                                    className={`p-3 rounded-md border text-xs shadow-md transition-all duration-150 ease-in-out 
                                        ${selectedPool?.id === pool.id ? 'bg-green-700 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-500'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className={`font-semibold ${selectedPool?.id === pool.id ? 'text-white' : 'text-blue-400'}`}>
                                            Pool ID: <span className={`${selectedPool?.id === pool.id ? 'text-gray-200' : 'text-white'} font-mono`}>{pool.id}</span>
                                        </p>
                                        <button onClick={() => navigator.clipboard.writeText(pool.id)} title="Copy Pool ID" className="ml-2 text-gray-500 hover:text-gray-300 text-sm p-1 rounded hover:bg-gray-700">📋</button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-1">
                                        <p><span className="text-gray-400">Type:</span> <span className="text-white font-medium">{pool.type}</span></p>
                                        <p><span className="text-gray-400">Price (vs SOL):</span> <span className="text-white">{Number(pool.price).toExponential(6)}</span></p>
                                        <p><span className="text-gray-400">TVL (USD):</span> <span className="text-white">${Number(pool.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                                        <p className="sm:col-span-2"><span className="text-gray-400">Program ID:</span> <span className="text-white font-mono text-xs break-all">{pool.programId}</span></p>
                                        <p><span className="text-gray-400">Vault A:</span> <span className="text-white font-mono text-xs break-all">{pool.vaultA}</span></p>
                                        <p><span className="text-gray-400">Vault B:</span> <span className="text-white font-mono text-xs break-all">{pool.vaultB}</span></p>
                                    </div>
                                    <button onClick={() => handlePoolSelection(pool)} className={`mt-2 w-full px-3 py-1.5 text-xs rounded transition-colors ${selectedPool?.id === pool.id ? 'bg-gray-600 text-gray-400 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`} disabled={selectedPool?.id === pool.id}>
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
                    <SimulatedLiquidityManager
                        wallet={wallet}
                        connection={connection}
                        tokenAddress={tokenAddress}
                        tokenDecimals={tokenInfo.decimals}
                        tokenBalance={tokenBalance}
                        solBalance={solBalance}
                        refreshBalances={refreshBalances}
                        subtractBalances={subtractBalances}
                    />
                    <TradingInterface
                        wallet={wallet}
                        connection={connection}
                        tokenAddress={tokenAddress}
                        tokenDecimals={tokenInfo.decimals}
                        tokenBalance={tokenBalance}
                        solBalance={solBalance}
                        refreshBalances={refreshBalances}
                        subtractBalances={subtractBalances}
                        selectedPool={selectedPool}
                        setNotification={setNotification}
                        network={network}
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