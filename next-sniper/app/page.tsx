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
    console.log("[MINT_COMPAT_CHECK] >>>>> isPhantomWallet VALIDATION START <<<<<");
    console.log("[MINT_COMPAT_CHECK] Raw wallet object received:", wallet);
    // For complex objects, console.dir might be more insightful in the browser
    if (typeof wallet === 'object' && wallet !== null) {
        console.log("[MINT_COMPAT_CHECK] Wallet object properties:", Object.keys(wallet));
    }


    if (!wallet || typeof wallet !== 'object') {
        console.error("[MINT_COMPAT_CHECK] FAILED: Wallet is null, undefined, or not an object.");
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (is null/not object) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: Wallet is an object and not null/undefined.");

    // Check 1: publicKey property exists and is truthy
    const hasPublicKeyProp = wallet.hasOwnProperty('publicKey') && wallet.publicKey;
    if (!hasPublicKeyProp) {
        console.error("[MINT_COMPAT_CHECK] FAILED: Wallet is missing 'publicKey' property or publicKey is falsy.");
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (no publicKey prop) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: Wallet has 'publicKey' property and it's truthy.");
    console.log("[MINT_COMPAT_CHECK] wallet.publicKey object is:", wallet.publicKey);

    // Check 2: publicKey.toString is a function
    const publicKeyToStringIsFunction = typeof wallet.publicKey.toString === 'function';
    if (!publicKeyToStringIsFunction) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.publicKey.toString is NOT a function. typeof is:", typeof wallet.publicKey.toString);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (publicKey.toString not function) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.publicKey.toString IS a function.");

    // Check 3: publicKey.toString() executes and returns a non-empty string
    let pkStringForConstructorTest: string | undefined;
    try {
        pkStringForConstructorTest = wallet.publicKey.toString();
        console.log("[MINT_COMPAT_CHECK] wallet.publicKey.toString() executed, result: '", pkStringForConstructorTest, "' (type:", typeof pkStringForConstructorTest, ")");
    } catch (e: any) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.publicKey.toString() threw an error:", e.message, e.stack);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (publicKey.toString error) <<<<<");
        return false;
    }
    
    if (typeof pkStringForConstructorTest !== 'string' || pkStringForConstructorTest.length === 0) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.publicKey.toString() did NOT return a non-empty string. Returned:", pkStringForConstructorTest);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (publicKey.toString invalid result) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.publicKey.toString() returned a non-empty string.");

    // Check 4: new PublicKey(wallet.publicKey.toString()) does not throw
    try {
        const testPk = new PublicKey(pkStringForConstructorTest); // Use the string we already got
        console.log("[MINT_COMPAT_CHECK] PASSED: new PublicKey(pkStringForConstructorTest) did not throw. Result:", testPk.toBase58());
    } catch (e: any) {
        console.error("[MINT_COMPAT_CHECK] FAILED: new PublicKey(pkStringForConstructorTest) threw an error for string '"+ pkStringForConstructorTest +"':", e.message, e.stack);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (new PublicKey failed) <<<<<");
        return false;
    }

    // Check 5: signTransaction is a function
    const hasSignTransaction = typeof wallet.signTransaction === 'function';
    if (!hasSignTransaction) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.signTransaction is NOT a function. typeof is:", typeof wallet.signTransaction);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (no signTransaction) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.signTransaction IS a function.");

    // Check 6: signAllTransactions is a function
    const hasSignAllTransactions = typeof wallet.signAllTransactions === 'function';
    if (!hasSignAllTransactions) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.signAllTransactions is NOT a function. typeof is:", typeof wallet.signAllTransactions);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (no signAllTransactions) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.signAllTransactions IS a function.");
    
    // Optional: Check for isPhantom property if you rely on it.
    // if (wallet.isPhantom !== true) {
    //     console.warn("[MINT_COMPAT_CHECK] OPTIONAL CHECK: wallet.isPhantom is not strictly true (value:", wallet.isPhantom, "). This might be okay for some wallets but usually present for Phantom.");
    // }

    console.log("[MINT_COMPAT_CHECK] >>>>> ALL CHECKS PASSED - VALIDATION END - RETURNING TRUE <<<<<");
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
    const [tokenBalance, setTokenBalance] = useState('0'); // Raw string balance
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

    // useEffect for dependency checks
    useEffect(() => {
        const { isReady, missingDependencies } = checkRaydiumDependencies();
        if (!isReady) {
            const instructions = getInstallationInstructions();
            setNotification({ show: true, message: `Missing SDK dependencies: ${missingDependencies.join(', ')}\n${instructions}`, type: 'error' });
            console.error(`Missing SDK deps: ${missingDependencies.join(', ')}\n${instructions}`);
            setErrorMessage(`Missing SDK dependencies`);
        }
    }, []);

    // fetchTokenBalance
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

    // fetchLpTokenDetails
    const fetchLpTokenDetails = useCallback(async () => {
        if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo || !selectedPool) {
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
        if (typeof tokenInfo.decimals !== 'number' || isNaN(tokenInfo.decimals)) return;

        let lpMintToQuery: PublicKey | null = null;
        if (selectedPool.rawSdkPoolInfo && (selectedPool.rawSdkPoolInfo as any).lpMint) {
            try { lpMintToQuery = new PublicKey((selectedPool.rawSdkPoolInfo as any).lpMint); } catch (e) { console.error("Invalid LP Mint in selected pool", e); }
        }

        if (!lpMintToQuery) {
            const mintA_SOL = NATIVE_MINT;
            const mintB_Token = new PublicKey(tokenAddress);
            const cpmmProgramIdToUse = network === 'mainnet-beta' ? MAINNET_AMM_V4_PROGRAM_ID : DEVNET_CREATE_POOL_PROGRAM_ID;
            const feeConfigIdToUse = network === 'mainnet-beta' ? new PublicKey(MAINNET_AMM_V4_CONFIG_ID_STR) : new PublicKey(DEVNET_AMM_V4_CONFIG_ID_STR);
            try {
                const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramIdToUse, configId: feeConfigIdToUse, mintA: mintA_SOL, mintB: mintB_Token });
                if (!derivedPoolKeys.lpMint) { console.error("Could not derive LP Mint."); return; }
                lpMintToQuery = derivedPoolKeys.lpMint;
            } catch (e) { console.error("Error deriving LP Mint:", e); return; }
        }
        
        let localNotificationUpdate = { show: true, message: `Workspaceing LP details for ${selectedPool.id.substring(0,6)}...`, type: 'info' as NotificationType };
        setNotification(localNotificationUpdate);

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

            const vaultAAddress = new PublicKey(selectedPool.vaultA);
            const vaultBAddress = new PublicKey(selectedPool.vaultB);
            const vaultAInfoRaw = await connection.getAccountInfo(vaultAAddress);
            const vaultBInfoRaw = await connection.getAccountInfo(vaultBAddress);

            if (!vaultAInfoRaw || !vaultBInfoRaw) {
                setUserPairedSOL(0); setUserPairedToken(0);
                localNotificationUpdate = { show: true, message: `LP pool vaults for ${selectedPool.id.substring(0,6)} not found.`, type: 'info'};
            } else {
                const vaultASolBalanceInfo = await connection.getTokenAccountBalance(vaultAAddress, 'confirmed');
                const totalAssetAVaultBN = new BN(vaultASolBalanceInfo.value.amount);
                const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(vaultBAddress, 'confirmed');
                const totalAssetBVaultBN = new BN(vaultBTokenBalanceInfo.value.amount);

                let totalSolInPoolBN: BN, totalTokenInPoolBN: BN;
                if (selectedPool.mintA.toUpperCase() === NATIVE_MINT.toBase58().toUpperCase() || selectedPool.mintB.toUpperCase() === NATIVE_MINT.toBase58().toUpperCase()) {
                    if (selectedPool.mintA.toUpperCase() === tokenAddress.toUpperCase()){ 
                        totalTokenInPoolBN = totalAssetAVaultBN; totalSolInPoolBN = totalAssetBVaultBN;
                    } else { 
                        totalSolInPoolBN = totalAssetAVaultBN; totalTokenInPoolBN = totalAssetBVaultBN;
                    }
                } else { 
                    throw new Error("Selected pool is not Token vs SOL");
                }

                if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0) && tokenInfo.decimals >= 0) {
                    const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
                    setUserPairedSOL(new Decimal(userShareSolLamportsBN.toString()).div(1e9).toNumber());
                    const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
                    const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
                    setUserPairedToken(tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber());
                    localNotificationUpdate = { show: true, message: 'LP details loaded!', type: 'success' };
                } else {
                    setUserPairedSOL(0); setUserPairedToken(0);
                    localNotificationUpdate = { show: true, message: currentLpBalanceBN.eqn(0) ? 'No LP tokens for this pool.' : 'LP details updated.', type: 'info' };
                }
            }
        } catch (err: any) {
            console.error(`[fetchLpTokenDetails] Error:`, err, err.stack);
            localNotificationUpdate = { show: true, message: `Failed to fetch LP details: ${err.message?.substring(0,70) || 'Unknown error'}`, type: 'error' };
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        } finally {
            setNotification(localNotificationUpdate);
            setTimeout(() => setNotification(prev => prev.message === localNotificationUpdate.message ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, tokenAddress, connection, tokenInfo, network, setNotification, selectedPool]);

    // handleWalletConnected
const handleWalletConnected = useCallback(
    async (phantomProvider: any) => { // Change type to any temporarily, as it's the raw provider
        console.log('[WALLET CONNECT] handleWalletConnected: Received phantomProvider object:');
        console.dir(phantomProvider);

        if (!phantomProvider || typeof phantomProvider.connect !== 'function') {
            setNotification({ show: true, message: 'Invalid wallet provider object.', type: 'error' });
            return;
        }

        try {
            // Ensure connection if not already connected, or re-verify publicKey
            // Phantom's connect() method might be called by WalletConnect.js already.
            // We need to ensure we get the public key correctly.
            // If WalletConnect.js already calls connect and passes the provider,
            // the public key might be on phantomProvider.publicKey after that.
            // Let's assume WalletConnect's setWallet(provider) call happens after provider.connect()
            // and phantomProvider.publicKey is now populated by Phantom.

            let currentPublicKey = phantomProvider.publicKey;

            if (!currentPublicKey) {
                // If WalletConnect.js didn't ensure it, or if we need to re-fetch
                console.log("[WALLET CONNECT] phantomProvider.publicKey not immediately available, trying to connect/get it.");
                // This might be redundant if WalletConnect already did this.
                // However, some providers might require a connect call to populate .publicKey
                // For Phantom, after a successful `await provider.connect()`, `provider.publicKey` should be set.
                // Let's assume WalletConnect.js's setWallet(provider) ensures provider.publicKey is available.
                // If it's still null here, the connection process in WalletConnect.js might need review.
                 setNotification({ show: true, message: 'Wallet connection failed: Public key not available from provider.', type: 'error' });
                 return;
            }
            
            console.log('[WALLET CONNECT] Public key from provider:', currentPublicKey.toString());

            // Create an object that conforms to your PhantomWallet interface
            const conformingWallet: PhantomWallet = {
                publicKey: currentPublicKey, // This should now be the object with toString/toBase58 or PublicKey instance
                signTransaction: phantomProvider.signTransaction.bind(phantomProvider),
                signAllTransactions: phantomProvider.signAllTransactions.bind(phantomProvider),
                isPhantom: phantomProvider.isPhantom,
                // Add any other methods from PhantomWallet interface if the provider has them directly
            };

            setWallet(conformingWallet); // Set the conformed object to state
            setNotification({show: true, message: `Wallet connected on ${network}! PK: ${currentPublicKey.toBase58().substring(0,6)}...`, type: 'success'});
            setTimeout(() => setNotification(prev => prev.message.includes("Wallet connected") ? { show: false, message: '', type: '' } : prev), 3000);

            setIsLoading(true);
            // Use currentPublicKey for subsequent operations directly
            const pkInstance = currentPublicKey instanceof PublicKey 
                ? currentPublicKey
                : new PublicKey(currentPublicKey.toString());
            
            const bal = await connection.getBalance(pkInstance);
            setSolBalance(bal / 1e9);
            
            console.log('[WALLET CONNECT] Attempting initRaydiumSdk with conforming wallet...');
            // Pass the conformingWallet or just the essential parts to initRaydiumSdk
            // initRaydiumSdk might also need adaptation if it expects the raw provider
            await initRaydiumSdk(conformingWallet, connection, network); 
            console.log('[WALLET CONNECT] initRaydiumSdk call finished.');

            if (tokenAddress) {
                await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
            }
        } catch (e: any) {
            console.error(`Error during wallet connection or post-connection ops on ${network}:`, e.message, e.stack, e);
            setNotification({show: true, message: `Connection Ops Error: ${e.message}`, type: 'error'});
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
        } finally {
            setIsLoading(false);
        }
    },
    [connection, network, tokenAddress, fetchTokenBalance, setNotification, setIsLoading]
);

    // Also, update the useEffect that logs the `wallet` state if it uses JSON.stringify
    useEffect(() => {
        if (wallet) {
            console.log('[WALLET STATE] HomePage wallet state updated (see next log for details):');
            console.dir(wallet); // Use console.dir for the stateful wallet object
            if (wallet.publicKey) {
                console.log('[WALLET STATE] HomePage wallet.publicKey.toString():', wallet.publicKey.toString());
            }
        } else {
            console.log('[WALLET STATE] HomePage wallet state updated to: null');
        }
    }, [wallet]);

    // refreshBalances
    const refreshBalances = useCallback(async () => {
        if (!wallet?.publicKey) return;
        setIsLoading(true);
        setNotification({ show: true, message: `Refreshing balances on ${network}...`, type: 'info' });
        try {
            const pkInstance = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            const bal = await connection.getBalance(pkInstance);
            setSolBalance(bal / 1e9);
            if (tokenAddress && tokenInfo) {
                await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
                if (selectedPool) await fetchLpTokenDetails();
                else { setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0); }
            } else {
                setTokenBalance('0');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
            setNotification({show: true, message: `Balances refreshed!`, type: 'success'});
        } catch (err: any) {
            setNotification({show: true, message: `Error refreshing: ${err.message}`, type: 'error'});
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => (prev.message.includes("Refreshing") || prev.message.includes("refreshed")) ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [wallet, connection, tokenAddress, tokenInfo, selectedPool, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification]);

    // loadTokenInfo
    const loadTokenInfo = useCallback(async () => {
        if (!tokenAddress) {
            setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            setDiscoveredPools([]); setSelectedPool(null);
            return;
        }
        setIsLoading(true); /* Reset states */
        setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        setDiscoveredPools([]); setSelectedPool(null);
        let msg = `Loading token ${tokenAddress.substring(0,6)}...`;
        setNotification({ show: true, message: msg, type: 'info' });
        try {
            const mintPub = new PublicKey(tokenAddress);
            const info = await connection.getParsedAccountInfo(mintPub);
            if (!info.value?.data || !('parsed' in info.value.data)) throw new Error('Mint account not found/invalid');
            const parsedData = info.value.data as any;
            if (parsedData.program !== 'spl-token' || parsedData.parsed.type !== 'mint') throw new Error('Not an SPL Token mint');
            const ti: TokenInfoState = { address: tokenAddress, decimals: Number(parsedData.parsed.info.decimals ?? 0), supply: parsedData.parsed.info.supply ?? '0', isInitialized: true };
            setTokenInfo(ti);
            msg = 'Token info loaded.'; setNotification({ show: true, message: msg, type: 'success' });
            if (wallet?.publicKey) await fetchTokenBalance(wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString()), mintPub);
        } catch (err: any) {
            msg = `Error loading token: ${err.message}`; setErrorMessage(msg);
            setNotification({show: true, message: msg, type: 'error'});
            setTokenInfo(null); setTokenBalance('0');
        } finally {
            setIsLoading(false);
            setTimeout(() => setNotification(prev => prev.message === msg ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [tokenAddress, connection, wallet, fetchTokenBalance, network, setNotification, setIsLoading, setErrorMessage]);

    // handleFetchAndDisplayPools
     const handleFetchAndDisplayPools = useCallback(async (addressToFetch: string) => {
        console.log('[LOGGING PLAN - POOL_FETCH] handleFetchAndDisplayPools called for token address:', addressToFetch);
        console.log('[LOGGING PLAN - POOL_FETCH] Current HomePage wallet state available to pool fetch:', wallet ? 'Exists' : 'null');
         if (wallet && wallet.publicKey) {
             console.log('[LOGGING PLAN - POOL_FETCH] Current HomePage wallet.publicKey.toString():', wallet.publicKey.toString());
        }

        if (!addressToFetch || !wallet?.publicKey) {
            setDiscoveredPools([]); setSelectedPool(null);
            if (addressToFetch && !wallet?.publicKey) {
                setNotification({ show: true, message: "Please connect your wallet to fetch pools.", type: 'info' });
                setTimeout(() => setNotification(prev => prev.message.includes("Please connect") ? {show:false, message:'', type:''} : prev), 3000);
            }
            return;
        }
        setIsFetchingPools(true); setDiscoveredPools([]); setSelectedPool(null);
        const loadingMsg = `Workspaceing pools for ${addressToFetch.substring(0, 6)}...`;
        setNotification({ show: true, message: loadingMsg, type: 'info' });
        try {
            const sdkCluster = network === 'mainnet-beta' ? 'mainnet' : 'devnet';
            let ownerPk: PublicKey;
            try {
                ownerPk = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
                console.log('[LOGGING PLAN - POOL_FETCH] ownerPk created:', ownerPk.toBase58(), 'Is instance?', ownerPk instanceof PublicKey);
            } catch (e:any) {
                console.error('[LOGGING PLAN - POOL_FETCH ERROR] Failed to create ownerPk:', e.message, e.stack);
                throw new Error(`Failed to prepare wallet for pool fetching: ${e.message}`);
            }
            
            const pools = await fetchRaydiumPoolsFromSDK(connection, addressToFetch, sdkCluster, ownerPk);
            if (pools.length > 0) {
                setDiscoveredPools(pools);
                setNotification({ show: true, message: `Found ${pools.length} pool(s).`, type: 'success' });
                setIsPoolListCollapsed(false);
            } else {
                setNotification({ show: true, message: `No pools found for this token.`, type: 'info' });
                setIsPoolListCollapsed(false);
            }
        } catch (error: any) {
            const shortError = error.message?.substring(0, 100) || 'Unknown error fetching pools';
            setErrorMessage(shortError);
            setNotification({ show: true, message: `Error fetching pools: ${shortError}`, type: 'error' });
        } finally {
            setIsFetchingPools(false);
            setTimeout(() => setNotification(prev => (prev.message === loadingMsg || prev.message.includes("Found") || prev.message.includes("No pools")) ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, connection, network, setNotification, setErrorMessage]);

    // useEffect for tokenAddress change
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (tokenAddress) {
                try { new PublicKey(tokenAddress); await loadTokenInfo(); } catch (e) {
                    setErrorMessage('Invalid token address format.');
                    setTokenInfo(null); setTokenBalance('0'); setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                    setDiscoveredPools([]); setSelectedPool(null);
                }
            } else {
                setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                setDiscoveredPools([]); setSelectedPool(null);
            }
        }, 600);
        return () => clearTimeout(handler);
    }, [tokenAddress, network, loadTokenInfo]);

    // useEffect for fetching pools when tokenInfo and wallet are available
    useEffect(() => {
        if (tokenInfo && tokenAddress && wallet?.publicKey) {
            handleFetchAndDisplayPools(tokenAddress);
        } else if (!wallet?.publicKey && tokenAddress) {
            setDiscoveredPools([]); setSelectedPool(null);
            setNotification({ show: true, message: "Connect wallet to see pools.", type: 'info' });
            setTimeout(() => setNotification(prev => prev.message.includes("Connect wallet") ? {show:false, message:'', type:''} : prev), 3000);
        } else {
            setDiscoveredPools([]); setSelectedPool(null);
        }
    }, [tokenInfo, tokenAddress, wallet?.publicKey?.toString(), network, handleFetchAndDisplayPools]);

    // useEffect for fetching LP details when a pool is selected
    useEffect(() => {
        if (tokenInfo?.isInitialized && typeof tokenInfo.decimals === 'number' && wallet?.publicKey && connection && selectedPool) {
            fetchLpTokenDetails();
        } else {
            if (lpTokenBalance !== '0' || userPairedSOL !== 0 || userPairedToken !== 0 || totalLpSupply !== '0' || lpTokenDecimals !== 0) {
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
        }
    }, [tokenInfo, wallet?.publicKey?.toString(), connection, network, selectedPool, fetchLpTokenDetails]);
    
    // handlePoolSelection
    const handlePoolSelection = (pool: DiscoveredPoolDetailed) => {
        setSelectedPool(pool); setIsPoolListCollapsed(true);
        setNotification({ show: true, message: `Pool selected: ${pool.id.substring(0,6)}...`, type: 'info' });
        setTimeout(() => setNotification(prev => prev.message.includes("Pool selected") ? {show: false, message:'',type:''} : prev), 4000);
    };

    // subtractBalances (placeholder)
    const subtractBalances = useCallback(
        ({ tokenAmount, solAmount }: { tokenAmount: number | string | BN; solAmount: number }) => {
            console.warn('subtractBalances called (placeholder)', { tokenAmount, solAmount });
        }, [] );

    // handleNetworkChange
    const handleNetworkChange = (newNetwork: NetworkType) => {
        if (network === newNetwork) return;
        setWallet(null); setTokenAddress(''); setTokenInfo(null); setSolBalance(0); setTokenBalance('0');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        setErrorMessage(''); setIsLoading(false); setDiscoveredPools([]); setSelectedPool(null); setIsPoolListCollapsed(false);
        setNetwork(newNetwork);
        setNotification({ show: true, message: `Switched to ${newNetwork}. Reconnect wallet & load token.`, type: 'info' });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
    };

// ==========================================================================================
// MAIN JSX RETURN for HomePage component
// ==========================================================================================
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

            {/* Mint Button Section */}
            {wallet && (
                <div className="mb-6 text-center">
                    <button
                        onClick={async () => {
                            console.log('[LOGGING PLAN - MINT START] Mint button clicked.');
                            if (wallet && wallet.publicKey) {
                                 console.log('[LOGGING PLAN - MINT] Current HomePage wallet.publicKey.toString():', wallet.publicKey.toString());
                            }
                
                            if (!isPhantomWallet(wallet)) {
                                setNotification({ show: true, message: 'Wallet not compatible for minting. Check console.', type: 'error' });
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                                return;
                            }
                            if (network !== 'devnet') {
                                setNotification({show: true, message: 'Token minting is only enabled on Devnet.', type: 'info'});
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
                                return;
                            }
                            
                            const pkForMinting = wallet.publicKey instanceof PublicKey
                                ? wallet.publicKey
                                : new PublicKey(wallet.publicKey.toString());
                            console.log('[MINT FIX] pkForMinting for adapter:', pkForMinting.toBase58());

                            // Potentially problematic adapter from previous attempt
                            const walletForMintingAdapter: StrictPhantomWalletForMinting = {
                                publicKey: pkForMinting,
                                signTransaction: async (transactionToSign: Transaction): Promise<Transaction> => {
                                    console.log('[MINT FIX - ADAPTER] signTransaction: Received legacy TX to sign:', transactionToSign);
                                    if (!wallet || typeof wallet.signTransaction !== 'function') {
                                        console.error('[MINT FIX - ADAPTER ERROR] Main wallet or signTransaction method is missing!');
                                        throw new Error("Wallet or signTransaction method missing from main wallet object.");
                                    }
                                    const signedResultFromWallet = await wallet.signTransaction(transactionToSign);
                                    console.log('[MINT FIX - ADAPTER] signTransaction: Wallet returned signedResultFromWallet:', signedResultFromWallet);
                            
                                    if (signedResultFromWallet instanceof Transaction) {
                                        console.log('[MINT FIX - ADAPTER] signTransaction: Wallet returned a direct Transaction instance.');
                                        return signedResultFromWallet;
                                    }
                                    if (signedResultFromWallet instanceof VersionedTransaction) {
                                        console.error('[MINT FIX - ADAPTER ERROR] Wallet returned VersionedTransaction, legacy expected.');
                                        throw new Error("Wallet signed VersionedTransaction; legacy Transaction needed.");
                                    }
                                    interface SignedTransactionObject {
                                        signatures?: Array<{ publicKey: { toString(): string }, signature: Uint8Array | Buffer | number[] }>;
                                        feePayer?: { toString(): string }; recentBlockhash?: string;
                                    }
                                    const plainSignedTx = signedResultFromWallet as SignedTransactionObject;
                                    if (plainSignedTx && typeof plainSignedTx === 'object' && plainSignedTx.signatures && plainSignedTx.feePayer && plainSignedTx.recentBlockhash) {
                                        console.log('[MINT FIX - ADAPTER] Wallet returned plain object. Reconstructing legacy Transaction.');
                                        const reconstructedTx = new Transaction({
                                            feePayer: new PublicKey(plainSignedTx.feePayer.toString()),
                                            recentBlockhash: plainSignedTx.recentBlockhash,
                                        });
                                        reconstructedTx.add(...transactionToSign.instructions);
                                        if (Array.isArray(plainSignedTx.signatures)) {
                                            plainSignedTx.signatures.forEach((sigInfo) => {
                                                if (sigInfo.publicKey && sigInfo.signature) {
                                                    reconstructedTx.addSignature(
                                                        new PublicKey(sigInfo.publicKey.toString()),
                                                        Buffer.isBuffer(sigInfo.signature) ? sigInfo.signature : Buffer.from(sigInfo.signature)
                                                    );
                                                }
                                            });
                                        }
                                        return reconstructedTx;
                                    } else {
                                        console.error('[MINT FIX - ADAPTER ERROR] Wallet returned unexpected structure:', signedResultFromWallet);
                                        throw new Error("Unrecognized transaction format after signing.");
                                    }
                                },
                                signAllTransactions: async (transactionsToSign: Transaction[]): Promise<Transaction[]> => {
                                    if (!wallet || typeof wallet.signAllTransactions !== 'function') throw new Error("Wallet signAllTransactions missing.");
                                    const signedResults = await wallet.signAllTransactions(transactionsToSign);
                                    if (!Array.isArray(signedResults) || signedResults.length !== transactionsToSign.length) throw new Error("Wallet signAllTransactions unexpected return.");
                                    interface SignedTransactionObject { signatures?: Array<{ publicKey: { toString(): string }, signature: Uint8Array | Buffer | number[] }>; feePayer?: { toString(): string }; recentBlockhash?: string; }
                                    return signedResults.map((item, index) => {
                                        const originalTx = transactionsToSign[index];
                                        if (item instanceof Transaction) return item;
                                        if (item instanceof VersionedTransaction) throw new Error(`Versioned TX at index ${index} not supported for this mint.`);
                                        const plainItem = item as SignedTransactionObject;
                                        if (plainItem && plainItem.signatures && plainItem.feePayer && plainItem.recentBlockhash) {
                                            const reconTx = new Transaction({ feePayer: new PublicKey(plainItem.feePayer.toString()), recentBlockhash: plainItem.recentBlockhash });
                                            reconTx.add(...originalTx.instructions);
                                            if(Array.isArray(plainItem.signatures)) plainItem.signatures.forEach(si => { if(si.publicKey && si.signature) reconTx.addSignature(new PublicKey(si.publicKey.toString()), Buffer.isBuffer(si.signature) ? si.signature : Buffer.from(si.signature) )});
                                            return reconTx;
                                        }
                                        throw new Error(`Unrecognized TX format at index ${index}.`);
                                    });
                                },
                                isPhantom: wallet.isPhantom,
                            };
                            console.log('[MINT FIX] walletForMintingAdapter created.');
                            setIsLoading(true);
                            setNotification({ show: true, message: `Minting TestToken...`, type: 'info' });
                            try {
                                const result = await mintTokenWithPhantomWallet(walletForMintingAdapter, connection, 'TestToken');
                                if (result?.mintAddress) {
                                    setTokenAddress(result.mintAddress);
                                    setNotification({show: true, message: `Token minted! Address: ${result.mintAddress.substring(0,10)}...`, type: 'success'});
                                } else { throw new Error('Minting did not return address.'); }
                            } catch (err: any) {
                                console.error('Mint error:', err);
                                setNotification({show: true, message: `Mint Failed: ${err.message || 'Unknown'}`, type: 'error'});
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                            } finally {
                                setIsLoading(false);
                                setTimeout(() => setNotification(prev => prev.message.includes("Minting TestToken") || prev.message.includes("Token minted!") ? { show: false, message: '', type: '' } : prev), 4000);
                            }
                        }}
                        disabled={isLoading || network === 'mainnet-beta'}
                        className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : `Mint New Token (Devnet Only)`}
                    </button>
                </div>
            )}

            {/* Main Content Grid (Wallet Connect, Token Info, Chart) */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1 space-y-6">
                    {/* Token Address Input & Refresh */}
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
                        <label htmlFor="token-address-input" className="block text-lg mb-2 text-gray-200">Token Address ({network})</label>
                        <input id="token-address-input" type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder={`Paste ${network} token mint address`} className="w-full mb-3 p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        {errorMessage && (<p className="text-red-400 text-sm mb-3">{errorMessage}</p>)}
                        <div className="flex flex-wrap gap-2">
                            <button onClick={refreshBalances} disabled={!wallet || isLoading} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">{isLoading ? 'Refreshing...' : 'Refresh Balances'}</button>
                        </div>
                    </div>
                    {/* WalletConnect Component */}
                    <WalletConnect setWallet={handleWalletConnected} connection={connection} refreshBalances={refreshBalances} setNotification={setNotification}/>
                </div>

                {/* Token Info & Live Chart Section */}
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
                                selectedPool={selectedPool} // Pass selectedPool here
                            />
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 flex items-center justify-center bg-gray-900 p-6 rounded-lg border border-gray-800 text-gray-500 min-h-[200px]">
                        {isLoading ? 'Processing...' : !wallet ? `Connect wallet to see token details on ${network}.` : `Load a token on ${network} to see live chart and LP details.`}
                    </div>
                )}
            </div>
            
            {/* Discovered Pools Section */}
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
                    {isFetchingPools && <div className="flex items-center text-gray-400"><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>Searching...</div>}
                    {!isPoolListCollapsed && !isFetchingPools && discoveredPools.length === 0 && tokenAddress && (
                        <p className="text-gray-500 mt-2">No liquidity pools found for this token on {network}.</p>
                    )}
                    {!isPoolListCollapsed && discoveredPools.length > 0 && (
                        <ul className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {discoveredPools.map((pool, index) => (
                                <li key={pool.id + "_" + index} 
                                    className={`p-3 rounded-md border text-xs shadow-md transition-all duration-150 ease-in-out ${selectedPool?.id === pool.id ? 'bg-green-700 border-green-500' : 'bg-gray-800 border-gray-700 hover:border-indigo-500'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className={`font-semibold ${selectedPool?.id === pool.id ? 'text-white' : 'text-blue-400'}`}>Pool ID: <span className={`${selectedPool?.id === pool.id ? 'text-gray-200' : 'text-white'} font-mono`}>{pool.id}</span></p>
                                        <button onClick={() => navigator.clipboard.writeText(pool.id)} title="Copy Pool ID" className="ml-2 text-gray-500 hover:text-gray-300 text-sm p-1 rounded hover:bg-gray-700">📋</button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-1">
                                        <p><span className="text-gray-400">Type:</span> <span className="text-white font-medium">{pool.type}</span></p>
                                        <p><span className="text-gray-400">Price:</span> <span className="text-white">{Number(pool.price).toExponential(6)}</span></p>
                                        <p><span className="text-gray-400">TVL:</span> <span className="text-white">${Number(pool.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                                        <p className="sm:col-span-2"><span className="text-gray-400">Program:</span> <span className="text-white font-mono text-xs break-all">{pool.programId}</span></p>
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

            {/* Liquidity Manager & Trading Interface Section */}
            {wallet && tokenInfo ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* @ts-ignore */}
                    <SimulatedLiquidityManager
                        wallet={wallet}
                        connection={connection}
                        tokenAddress={tokenAddress}
                        tokenDecimals={tokenInfo.decimals}
                        tokenBalance={tokenBalance} // Pass raw string balance
                        solBalance={solBalance}     // Pass UI number balance
                        refreshBalances={refreshBalances}
                        subtractBalances={subtractBalances}
                        // selectedPool={selectedPool} // Pass selectedPool if needed by this component
                    />
                    <TradingInterface
                        wallet={wallet}
                        connection={connection}
                        tokenAddress={tokenAddress}
                        tokenDecimals={tokenInfo.decimals}
                        tokenBalance={tokenBalance} // Pass raw string balance
                        solBalance={solBalance}     // Pass UI number balance
                        refreshBalances={refreshBalances}
                        subtractBalances={subtractBalances}
                        selectedPool={selectedPool}
                        // ADDED MISSING PROPS:
                        setNotification={setNotification}
                        network={network}
                        isPoolSelected={!!selectedPool}
                    />
                </div>
            ) : (
                 <div className="mt-10 text-center text-gray-400">
                    {!wallet ? `Connect wallet to manage liquidity and trade.` : `Load a token to manage liquidity and trade.`}
                </div>
            )}

            {/* Global Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Processing...</p>
                    </div>
                </div>
            )}

            {/* Notification Popup */}
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