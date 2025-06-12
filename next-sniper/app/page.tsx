'use client';

// Polyfill must come first
import '@/utils/bufferPolyfill';
import AppHeader from '@/components/AppHeader';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';

// Solana Web3 & SPL Token
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import {
    NATIVE_MINT,
    getMint,
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { getCreatePoolKeys, LiquidityPoolKeys } from '@raydium-io/raydium-sdk-v2'; // Corrected import
import BN from 'bn.js';
import Decimal from 'decimal.js';

// Context
import { useNetwork, NetworkType } from '@/context/NetworkContext';
import { useToken } from '@/context/TokenContext';
// Utils
import {
    MAINNET_AMM_V4_PROGRAM_ID,
    MAINNET_AMM_V4_CONFIG_ID_STR,
    DEVNET_AMM_V4_CONFIG_ID_STR,   // This is the Devnet CPMM Config ID "9zSz..."
    DEVNET_CREATE_POOL_PROGRAM_ID // This is the Devnet CPMM Program ID "CPMDWB..."
} from '@/utils/raydiumConsts';
import { mintTokenWithPhantomWallet } from '@/utils/mintWithPhantom';
import { initRaydiumSdkForUser } from '@/utils/initRaydiumSdk'; 
import {
    checkRaydiumDependencies,
    getInstallationInstructions
} from '@/utils/dependencyChecker';
import { fetchRaydiumPoolsFromSDK, DiscoveredPoolDetailed } from '@/utils/poolFinder';
import { getSimulatedPool } from '@/utils/simulatedPoolStore'; // *** ENSURED IMPORT ***
import { getJupiterQuote } from '@/utils/quoteFetcher';
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

// PhantomWallet Interface
interface PhantomWallet {
    publicKey: { toString(): string; toBase58(): string; } | PublicKey;
    signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
    signAllTransactions: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
    isPhantom?: boolean;
}

function isPhantomWallet(wallet: any): wallet is PhantomWallet {
    // ... (Your existing isPhantomWallet function)
    console.log("[MINT_COMPAT_CHECK] >>>>> isPhantomWallet VALIDATION START <<<<<");
    console.log("[MINT_COMPAT_CHECK] Raw wallet object received:", wallet);
    if (typeof wallet === 'object' && wallet !== null) {
        console.log("[MINT_COMPAT_CHECK] Wallet object properties:", Object.keys(wallet));
    }
    if (!wallet || typeof wallet !== 'object') {
        console.error("[MINT_COMPAT_CHECK] FAILED: Wallet is null, undefined, or not an object.");
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (is null/not object) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: Wallet is an object and not null/undefined.");
    const hasPublicKeyProp = wallet.hasOwnProperty('publicKey') && wallet.publicKey;
    if (!hasPublicKeyProp) {
        console.error("[MINT_COMPAT_CHECK] FAILED: Wallet is missing 'publicKey' property or publicKey is falsy.");
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (no publicKey prop) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: Wallet has 'publicKey' property and it's truthy.");
    console.log("[MINT_COMPAT_CHECK] wallet.publicKey object is:", wallet.publicKey);
    const publicKeyToStringIsFunction = typeof wallet.publicKey.toString === 'function';
    if (!publicKeyToStringIsFunction) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.publicKey.toString is NOT a function. typeof is:", typeof wallet.publicKey.toString);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (publicKey.toString not function) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.publicKey.toString IS a function.");
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
    try {
        const testPk = new PublicKey(pkStringForConstructorTest);
        console.log("[MINT_COMPAT_CHECK] PASSED: new PublicKey(pkStringForConstructorTest) did not throw. Result:", testPk.toBase58());
    } catch (e: any) {
        console.error("[MINT_COMPAT_CHECK] FAILED: new PublicKey(pkStringForConstructorTest) threw an error for string '" + pkStringForConstructorTest + "':", e.message, e.stack);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (new PublicKey failed) <<<<<");
        return false;
    }
    const hasSignTransaction = typeof wallet.signTransaction === 'function';
    if (!hasSignTransaction) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.signTransaction is NOT a function. typeof is:", typeof wallet.signTransaction);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (no signTransaction) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.signTransaction IS a function.");
    const hasSignAllTransactions = typeof wallet.signAllTransactions === 'function';
    if (!hasSignAllTransactions) {
        console.error("[MINT_COMPAT_CHECK] FAILED: wallet.signAllTransactions is NOT a function. typeof is:", typeof wallet.signAllTransactions);
        console.log("[MINT_COMPAT_CHECK] >>>>> VALIDATION END - RETURNING FALSE (no signAllTransactions) <<<<<");
        return false;
    }
    console.log("[MINT_COMPAT_CHECK] PASSED: wallet.signAllTransactions IS a function.");
    console.log("[MINT_COMPAT_CHECK] >>>>> ALL CHECKS PASSED - VALIDATION END - RETURNING TRUE <<<<<");
    return true;
}

interface StrictPhantomWalletForMinting {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    isPhantom?: boolean;
}

export default function HomePage() {
    const { network, setNetwork, connection, rpcUrl } = useNetwork();
const loadIdRef = useRef(0);

    const [wallet, setWallet] = useState<PhantomWallet | null>(null);
    const { tokenAddress, setTokenAddress } = useToken();
    const [tokenInfo, setTokenInfo] = useState<TokenInfoState | null>(null);
    const [solBalance, setSolBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [simPoolRefresh, setSimPoolRefresh] = useState(0);

    useEffect(() => {
}, [isLoading]);

    const [errorMessage, setErrorMessage] = useState('');
    const [notification, setNotification] = useState<{
        show: boolean; message: string; type: NotificationType; id?: number;
    }>({ show: false, message: '', type: '' });

    const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');
    const [userPairedSOL, setUserPairedSOL] = useState<number>(0);
    const [userPairedToken, setUserPairedToken] = useState<number>(0);
    const [totalLpSupply, setTotalLpSupply] = useState<string>('0');
    const [lpTokenDecimals, setLpTokenDecimals] = useState<number>(0);

    const [discoveredPools, setDiscoveredPools] = useState<DiscoveredPoolDetailed[]>([]);
    const [isFetchingPools, setIsFetchingPools] = useState(false);
    const [selectedPool, setSelectedPool] = useState<DiscoveredPoolDetailed | null>(null);
    const [isPoolListCollapsed, setIsPoolListCollapsed] = useState<boolean>(true);
    const [priceInfo, setPriceInfo] = useState<{ price: number | null, loading: boolean }>({ price: null, loading: false });
    useEffect(() => {
        const { isReady, missingDependencies } = checkRaydiumDependencies();
        if (!isReady) {
            const instructions = getInstallationInstructions();
            setNotification({ show: true, message: `Missing SDK dependencies: <span class="math-inline">\{missingDependencies\.join\(', '\)\}\\n</span>{instructions}`, type: 'error' });
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
        // LOG 1: Indicate function was called and state of critical dependencies
        console.log('[fetchLpTokenDetails_DEBUG] Called.', {
            walletPk: wallet?.publicKey?.toString(),
            tokenAddress,
            selectedPoolId: selectedPool?.id,
            selectedPoolType: selectedPool?.type,
            tokenInfoDecimals: tokenInfo?.decimals
        });

        if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo || !selectedPool) {
            console.log('[fetchLpTokenDetails_DEBUG] Bailing: Missing prerequisites.', {
                hasWalletPk: !!wallet?.publicKey,
                hasTokenAddress: !!tokenAddress,
                hasConnection: !!connection,
                hasTokenInfo: !!tokenInfo,
                hasSelectedPool: !!selectedPool
            });
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
        if (typeof tokenInfo.decimals !== 'number' || isNaN(tokenInfo.decimals)) {
            console.error("[fetchLpTokenDetails_DEBUG] Bailing: Token info decimals are invalid.");
            return;
        }

        let lpMintToQuery: PublicKey | null = null;
        const rawInfo = selectedPool.rawSdkPoolInfo as any;

        if (rawInfo && rawInfo.mintLp && rawInfo.mintLp.address) {
            try { lpMintToQuery = new PublicKey(rawInfo.mintLp.address); }
            catch (eCatch) {
                const e = eCatch as any;
                console.error("[fetchLpTokenDetails_DEBUG] Invalid LP Mint in selectedPool.rawSdkPoolInfo.mintLp.address", e.message);
            }
        } else if (rawInfo && rawInfo.lpMint && typeof rawInfo.lpMint === 'string') {
            try { lpMintToQuery = new PublicKey(rawInfo.lpMint); }
            catch (eCatch) {
                const e = eCatch as any;
                console.error("[fetchLpTokenDetails_DEBUG] Invalid LP Mint string in selectedPool.rawSdkPoolInfo.lpMint", e.message);
            }
        } else if (rawInfo && rawInfo.lpMint instanceof PublicKey) {
            lpMintToQuery = rawInfo.lpMint;
        }

        console.log('[fetchLpTokenDetails_DEBUG] lpMintToQuery (direct from selectedPool):', lpMintToQuery?.toBase58());

        if (!lpMintToQuery) {
            if (network === 'mainnet-beta') {
                return;
            }
            const mintA_SOL = NATIVE_MINT;
            let mintB_Token_Addr_For_Derivation: PublicKey | null = null;
            try {
                mintB_Token_Addr_For_Derivation = new PublicKey(tokenAddress);
            } catch (eCatch) {
                const e = eCatch as any;
                console.error("[fetchLpTokenDetails_DEBUG] Invalid tokenAddress for LP derivation:", tokenAddress, e.message);
                setNotification({ show: true, message: `Invalid token address for LP derivation.`, type: 'error' as NotificationType });
                setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
                return;
            }

            const cpmmProgramIdToUse = network === 'devnet' ? DEVNET_CREATE_POOL_PROGRAM_ID : MAINNET_AMM_V4_PROGRAM_ID;
            const feeConfigIdToUse = network === 'devnet' ? new PublicKey(DEVNET_AMM_V4_CONFIG_ID_STR) : new PublicKey(MAINNET_AMM_V4_CONFIG_ID_STR);
            try {
                const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramIdToUse, configId: feeConfigIdToUse, mintA: mintA_SOL, mintB: mintB_Token_Addr_For_Derivation });
                if (!derivedPoolKeys.lpMint) {
                    console.error("[fetchLpTokenDetails_DEBUG] Could not derive LP Mint.");
                } else {
                    lpMintToQuery = derivedPoolKeys.lpMint;
                    console.log('[fetchLpTokenDetails_DEBUG] lpMintToQuery (after derivation):', lpMintToQuery?.toBase58());
                }
            } catch (eCatch) {
                const e = eCatch as any;
                console.error("[fetchLpTokenDetails_DEBUG] Error deriving LP Mint:", e.message);
                setNotification({ show: true, message: `Error deriving LP mint: ${e.message}`, type: 'error' as NotificationType });
                setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
                return;
            }
        }

        if (!lpMintToQuery) {
            console.error("[fetchLpTokenDetails_DEBUG] Failed to determine LP Mint address definitively. Cannot fetch LP details.");
            setNotification({ show: true, message: 'Failed to ID LP Mint.', type: 'error' as NotificationType });
            setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
            return;
        }

        const notificationId = Date.now();
        // Initialize localNotificationUpdateState here
        let localNotificationUpdateState: { id: number; show: boolean; message: string; type: NotificationType; } = {
            id: notificationId,
            show: true,
            message: `Workspaceing LP details for pool ${selectedPool.id.substring(0, 6)}...`, // selectedPool is checked not null before
            type: 'info' as NotificationType
        };
        setNotification(localNotificationUpdateState); // Show initial "Fetching..."

        try {
            const ownerPkForLp = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            console.log(`[fetchLpTokenDetails_DEBUG] Fetching LP token accounts for owner ${ownerPkForLp.toBase58()} and LP mint ${lpMintToQuery.toBase58()}`);

            const lpTokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPkForLp, { mint: lpMintToQuery }, 'confirmed');
            let currentLpBalanceBN = new BN(0);

            if (lpTokenAccounts.value.length > 0) {
                currentLpBalanceBN = new BN(lpTokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
                console.log('[fetchLpTokenDetails_DEBUG] User LP token accounts found. Raw amount:', currentLpBalanceBN.toString());
            } else {
                console.log('[fetchLpTokenDetails_DEBUG] No LP token accounts found for this user and LP mint.');
            }
            setLpTokenBalance(currentLpBalanceBN.toString());

            const lpMintInfo = await getMint(connection, lpMintToQuery);
            const currentTotalLpSupplyBN = new BN(lpMintInfo.supply.toString());
            setTotalLpSupply(currentTotalLpSupplyBN.toString());
            setLpTokenDecimals(lpMintInfo.decimals);
            console.log('[fetchLpTokenDetails_DEBUG] User LP Balance BN:', currentLpBalanceBN.toString(), 'Total LP Supply BN:', currentTotalLpSupplyBN.toString(), 'LP Decimals:', lpMintInfo.decimals);

            const vaultAAddress = new PublicKey(selectedPool.vaultA);
            const vaultBAddress = new PublicKey(selectedPool.vaultB);

            const vaultASolBalanceInfo = await connection.getTokenAccountBalance(vaultAAddress, 'confirmed').catch(() => null);
            const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(vaultBAddress, 'confirmed').catch(() => null);

            console.log('[fetchLpTokenDetails_DEBUG] Vault A (SOL) raw amount:', vaultASolBalanceInfo?.value?.amount);
            console.log('[fetchLpTokenDetails_DEBUG] Vault B (Token) raw amount:', vaultBTokenBalanceInfo?.value?.amount);

            if (!vaultASolBalanceInfo || !vaultBTokenBalanceInfo || !vaultASolBalanceInfo.value?.amount || !vaultBTokenBalanceInfo.value?.amount) {
                console.warn("[fetchLpTokenDetails_DEBUG] Vault info incomplete or vaults empty.");
                setUserPairedSOL(0); setUserPairedToken(0);
                localNotificationUpdateState = { ...localNotificationUpdateState, message: `LP pool vaults for ${selectedPool.id.substring(0, 6)} empty or not found.`, type: 'info' as NotificationType };
            } else {
                const totalAssetAVaultBN = new BN(vaultASolBalanceInfo.value.amount);
                const totalAssetBVaultBN = new BN(vaultBTokenBalanceInfo.value.amount);

                let totalSolInPoolBN: BN = new BN(0);
                let totalTokenInPoolBN: BN = new BN(0);

                const poolMintA_str = selectedPool.mintA?.toString().toUpperCase();
                const poolMintB_str = selectedPool.mintB?.toString().toUpperCase();
                const currentTokenAddr_str = tokenAddress.toUpperCase();
                const nativeMint_str = NATIVE_MINT.toBase58().toUpperCase();
                console.log('[fetchLpTokenDetails_DEBUG] Mint matching check:', { poolMintA_str, poolMintB_str, currentTokenAddr_str, nativeMint_str });

                if (poolMintA_str === nativeMint_str && poolMintB_str === currentTokenAddr_str) {
                    totalSolInPoolBN = totalAssetAVaultBN;
                    totalTokenInPoolBN = totalAssetBVaultBN;
                } else if (poolMintB_str === nativeMint_str && poolMintA_str === currentTokenAddr_str) {
                    totalSolInPoolBN = totalAssetBVaultBN;
                    totalTokenInPoolBN = totalAssetAVaultBN;
                } else {
                    console.error("[fetchLpTokenDetails_DEBUG] Pool mints do not match expected Token vs SOL pairing!");
                    setUserPairedSOL(0); setUserPairedToken(0);
                    localNotificationUpdateState = { ...localNotificationUpdateState, message: 'Error: Pool mints misaligned.', type: 'error' as NotificationType };
                }
                console.log('[fetchLpTokenDetails_DEBUG] Pool reserves (after matching): totalSolInPoolBN:', totalSolInPoolBN.toString(), 'totalTokenInPoolBN:', totalTokenInPoolBN.toString());

                console.log(`[fetchLpTokenDetails_DEBUG] Condition for share calculation: currentTotalLpSupplyBN=${currentTotalLpSupplyBN.toString()} > 0? <span class="math-inline">\{currentTotalLpSupplyBN\.gtn\(0\)\}, currentLpBalanceBN\=</span>{currentLpBalanceBN.toString()} > 0? <span class="math-inline">\{currentLpBalanceBN\.gtn\(0\)\}, tokenInfo\.decimals\=</span>{tokenInfo.decimals} >= 0? ${typeof tokenInfo.decimals === 'number' && tokenInfo.decimals >= 0}`);

                if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0) && typeof tokenInfo.decimals === 'number' && tokenInfo.decimals >= 0) {
                    console.log('[fetchLpTokenDetails_DEBUG] Condition for share calculation is TRUE.');
                    const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
                    const calculatedUserPairedSOL = new Decimal(userShareSolLamportsBN.toString()).div(1e9).toNumber();
                    setUserPairedSOL(calculatedUserPairedSOL);

                    const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
                    const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
                    const calculatedUserPairedToken = tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber();
                    setUserPairedToken(calculatedUserPairedToken);

                    console.log(`[fetchLpTokenDetails_DEBUG] Calculated Shares: userPairedSOL=<span class="math-inline">\{calculatedUserPairedSOL\}, userPairedToken\=</span>{calculatedUserPairedToken}`);
                    localNotificationUpdateState = { ...localNotificationUpdateState, message: 'LP details loaded!', type: 'success' as NotificationType };
                } else {
                    console.log('[fetchLpTokenDetails_DEBUG] Condition for share calculation is FALSE. Setting shares to 0.');
                    setUserPairedSOL(0); setUserPairedToken(0);
                    localNotificationUpdateState = { ...localNotificationUpdateState, message: currentLpBalanceBN.eqn(0) ? 'You have no LP tokens for this pool.' : 'LP details updated (e.g., zero total supply).', type: 'info' as NotificationType };
                }
            }
        } catch (errCatch: any) {
            const err = errCatch as any;
            console.error(`[fetchLpTokenDetails_DEBUG] Error in try block:`, err.message, err);
            localNotificationUpdateState = {
                ...localNotificationUpdateState,
                message: `Failed to fetch LP details: ${err.message?.substring(0, 100) || 'Unknown error'}`,
                type: 'error' as NotificationType
            };
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        } finally {
            setNotification(localNotificationUpdateState);
            setTimeout(() => setNotification(prev => ((prev as any).id === notificationId || prev.message === localNotificationUpdateState.message) ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, tokenAddress, connection, tokenInfo, network, selectedPool, setNotification /* Add other state setters like setLpTokenBalance, setUserPairedSOL etc., if your linter requires them */]);


    const handleWalletConnected = useCallback(async (phantomProvider: any) => {
        // ... (Keep this function exactly as it is in your provided code)
        console.log('[WALLET CONNECT] handleWalletConnected: Received phantomProvider object:');
        console.dir(phantomProvider);
        if (!phantomProvider || typeof phantomProvider.connect !== 'function') {
            setNotification({ show: true, message: 'Invalid wallet provider object.', type: 'error' }); return;
        }
        try {
            let currentPublicKey = phantomProvider.publicKey;
            if (!currentPublicKey) {
                setNotification({ show: true, message: 'Wallet connection failed: Public key not available from provider.', type: 'error' }); return;
            }
            console.log('[WALLET CONNECT] Public key from provider:', currentPublicKey.toString());
            const conformingWallet: PhantomWallet = {
                publicKey: currentPublicKey,
                signTransaction: phantomProvider.signTransaction.bind(phantomProvider),
                signAllTransactions: phantomProvider.signAllTransactions.bind(phantomProvider),
                isPhantom: phantomProvider.isPhantom,
            };
            setWallet(conformingWallet);
            setNotification({ show: true, message: `Wallet connected on ${network}! PK: ${currentPublicKey.toBase58().substring(0, 6)}...`, type: 'success' });
            setTimeout(() => setNotification(prev => prev.message.includes("Wallet connected") ? { show: false, message: '', type: '' } : prev), 3000);
            setIsLoading(true);
            const pkInstance = currentPublicKey instanceof PublicKey ? currentPublicKey : new PublicKey(currentPublicKey.toString());
            const bal = await connection.getBalance(pkInstance);
            setSolBalance(bal / 1e9);
            
            const ownerPkInstance = conformingWallet.publicKey instanceof PublicKey
                ? conformingWallet.publicKey
                : new PublicKey(conformingWallet.publicKey.toString());

            await initRaydiumSdkForUser(connection, ownerPkInstance);
            if (tokenAddress) {
                await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
            }
        } catch (e: any) {
            console.error(`Error during wallet connection or post-connection ops on ${network}:`, e.message, e.stack, e);
            setNotification({ show: true, message: `Connection Ops Error: ${e.message}`, type: 'error' });
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
        } finally {
            setIsLoading(false);
          console.log("[HomePage][setIsLoading] set to FALSE (FUNCTION_NAME)");
  
        }
    }, [connection, network, tokenAddress, fetchTokenBalance, setNotification, setIsLoading]);

    useEffect(() => {
        // ... (Keep this wallet logging useEffect as is)
        if (wallet) {
            console.log('[WALLET STATE] HomePage wallet state updated (see next log for details):');
            console.dir(wallet);
            if (wallet.publicKey) {
                console.log('[WALLET STATE] HomePage wallet.publicKey.toString():', wallet.publicKey.toString());
            }
        } else {
            console.log('[WALLET STATE] HomePage wallet state updated to: null');
        }
    }, [wallet]);

    const refreshBalances = useCallback(async () => {
        // ... (Keep this function exactly as is, it correctly uses selectedPool)
        if (!wallet?.publicKey) return;
        setIsLoading(true);
        console.log("[HomePage][setIsLoading] set to TRUE (FUNCTION_NAME)");

        const notificationId = Date.now();
        setNotification({ id: notificationId, show: true, message: `Refreshing balances on ${network}...`, type: 'info' });
        try {
            const pkInstance = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            const bal = await connection.getBalance(pkInstance);
            setSolBalance(bal / 1e9);
            if (tokenAddress && tokenInfo) {
                await fetchTokenBalance(pkInstance, new PublicKey(tokenAddress));
                if (selectedPool) {
                    await fetchLpTokenDetails();
                } else {
                    setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                }
            } else {
                setTokenBalance('0');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
            setNotification({ id: notificationId, show: true, message: `Balances refreshed!`, type: 'success' });
        } catch (err: any) {
            setNotification({ id: notificationId, show: true, message: `Error refreshing: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
            console.log("[HomePage][setIsLoading] set to FALSE (FUNCTION_NAME)");

            setTimeout(() => setNotification(prev => (prev as any).id === notificationId ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [wallet, connection, tokenAddress, tokenInfo, selectedPool, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification]);

// Replace your existing loadTokenInfo function with this one.
const loadTokenInfo = useCallback(async () => {
    if (!tokenAddress) {
        setTokenInfo(null);
        setTokenBalance('0');
        setErrorMessage('');
        setDiscoveredPools([]);
        setSelectedPool(null);
        return;
    }

    // Reset state and turn loading ON
    setIsLoading(true);
    console.log("[HomePage][setIsLoading] set to TRUE (FUNCTION_NAME)");

    setTokenInfo(null);
    setTokenBalance('0');
    setErrorMessage('');
    setSelectedPool(null);
    setNotification({ show: true, message: `Loading token ${tokenAddress.substring(0, 6)}...`, type: 'info' });

    try {
        const mintPub = new PublicKey(tokenAddress);
        const mintInfo = await getMint(connection, mintPub);

        const ti: TokenInfoState = {
            address: tokenAddress,
            decimals: mintInfo.decimals,
            supply: mintInfo.supply.toString(),
            isInitialized: true,
        };
        setTokenInfo(ti);
        setNotification({ show: true, message: 'Token info loaded!', type: 'success' });

        if (wallet?.publicKey) {
            const ownerPk = wallet.publicKey instanceof PublicKey
                ? wallet.publicKey
                : new PublicKey(wallet.publicKey.toString());
            await fetchTokenBalance(ownerPk, mintPub);
        }
    } catch (err: any) {
        const msg = `Error loading token: ${err.message}`;
        setErrorMessage(msg);
        setNotification({ show: true, message: msg, type: 'error' });
        setTokenInfo(null);
        setTokenBalance('0');
    } finally {
        // This GUARANTEES the loading spinner is turned off,
        // no matter if loading the token succeeded or failed.
        setIsLoading(false);
        console.log("[HomePage][setIsLoading] set to FALSE (FUNCTION_NAME)");

    }
}, [tokenAddress, connection, wallet, fetchTokenBalance, setNotification, setIsLoading, setErrorMessage]);


    const handleFetchAndDisplayPools = useCallback(async (addressToFetch: string) => {
        // *** THIS FUNCTION IS NOW MAINNET-SPECIFIC ***
        if (network !== 'mainnet-beta') {
            console.log("[handleFetchAndDisplayPools] Skipped: Not mainnet-beta. Current network:", network);
            return;
        }

        console.log('[POOL_FETCH] Mainnet: handleFetchAndDisplayPools for token:', addressToFetch);
        if (!addressToFetch || !wallet?.publicKey) {
            if (discoveredPools.length > 0) setDiscoveredPools([]); // Clear if conditions not met
            // setSelectedPool(null); // Don't clear if a mainnet pool was already selected unless token changes
            if (addressToFetch && !wallet?.publicKey) {
                // Notification for wallet connection can be handled by a general UI element
            }
            return;
        }
        setIsFetchingPools(true);
        // setDiscoveredPools([]); // Let new fetch replace
        // setSelectedPool(null); // Do not clear selected pool here, only on new token load or network change
        const notificationId = Date.now();
        const loadingMsg = `Workspaceing Mainnet pools for ${addressToFetch.substring(0, 6)}...`;
        setNotification({ id: notificationId, show: true, message: loadingMsg, type: 'info' });
        try {
            const sdkCluster = 'mainnet';
            let ownerPk = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            const pools = await fetchRaydiumPoolsFromSDK(connection, addressToFetch, sdkCluster, ownerPk);

            setDiscoveredPools(pools);
            if (pools.length > 0) {
                setNotification({ id: notificationId, show: true, message: `Found ${pools.length} Mainnet pool(s).`, type: 'success' });
                setIsPoolListCollapsed(false);
            } else {
                setNotification({ id: notificationId, show: true, message: `No Mainnet pools found for this token.`, type: 'info' });
                setIsPoolListCollapsed(true);
            }
        } catch (error: any) {
            const shortError = error.message?.substring(0, 100) || 'Unknown error fetching pools';
            setErrorMessage(shortError);
            setNotification({ id: notificationId, show: true, message: `Error fetching Mainnet pools: ${shortError}`, type: 'error' });
        } finally {
            setIsFetchingPools(false);
            setTimeout(() => setNotification(prev => (prev as any).id === notificationId ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, connection, network, setNotification, setErrorMessage]);

useEffect(() => {
    loadIdRef.current += 1; // bump a "version" for every change
    const currentLoadId = loadIdRef.current;

    setIsLoading(true);

    const handler = setTimeout(async () => {
        if (!tokenAddress) {
            if (loadIdRef.current === currentLoadId) {
                setTokenInfo(null);
                setTokenBalance('0');
                setErrorMessage('');
                setLpTokenBalance('0');
                setUserPairedSOL(0);
                setUserPairedToken(0);
                setTotalLpSupply('0');
                setLpTokenDecimals(0);
                setDiscoveredPools([]);
                setSelectedPool(null);
                setIsLoading(false);
            }
            return;
        }
        try {
            new PublicKey(tokenAddress);
            await loadTokenInfo();
        } catch (e) {
            if (loadIdRef.current === currentLoadId) {
                setErrorMessage('Invalid token address format.');
                setTokenInfo(null);
                setTokenBalance('0');
                setLpTokenBalance('0');
                setUserPairedSOL(0);
                setUserPairedToken(0);
                setTotalLpSupply('0');
                setLpTokenDecimals(0);
                setDiscoveredPools([]);
                setSelectedPool(null);
            }
        } finally {
            // Only the most recent invocation should clear loading!
            if (loadIdRef.current === currentLoadId) setIsLoading(false);
        }
    }, 600);

    return () => clearTimeout(handler);
}, [tokenAddress, loadTokenInfo]);

 useEffect(() => {
        const walletPublicKeyString = wallet?.publicKey?.toString();
        const simPoolFromStore = getSimulatedPool();
        const selectedPoolBeforeLogic = selectedPool;

        if (network === 'devnet') {
            // YOUR DEVNET LOGIC IS PRESERVED
            if (tokenInfo && tokenAddress && walletPublicKeyString && connection) {
                if (simPoolFromStore &&
                    simPoolFromStore.tokenAddress === tokenAddress.toLowerCase() &&
                    simPoolFromStore.isSeeded &&
                    (simPoolFromStore.type === 'CPMM_DEVNET_SEEDED' || simPoolFromStore.type === 'CPMM_DEVNET_CREATED') &&
                    simPoolFromStore.id &&
                    simPoolFromStore.rawSdkPoolInfo) {
                    if (selectedPoolBeforeLogic?.id !== simPoolFromStore.id) {
                        setSelectedPool(simPoolFromStore as DiscoveredPoolDetailed);
                    }
                } else {
                    if (selectedPoolBeforeLogic) {
                        setSelectedPool(null);
                    }
                }
            } else {
                if (selectedPoolBeforeLogic) {
                    setSelectedPool(null);
                }
            }
        } else if (network === 'mainnet-beta') {
            // JUPITER LOGIC FOR MAINNET
            const checkLiquidityAndPrice = async () => {
                if (tokenInfo && tokenAddress && walletPublicKeyString) {
                    setPriceInfo({ price: null, loading: true });
                    const oneSol = new BN(1e9);
                    const quote = await getJupiterQuote(NATIVE_MINT, new PublicKey(tokenAddress), oneSol);

                    if (quote && quote.outAmount) {
                        const outAmount = new BN(quote.outAmount);
                        const pricePerSol = new Decimal(outAmount.toString()).div(new Decimal(10).pow(tokenInfo.decimals));
                        const priceInSol = pricePerSol.isZero() ? new Decimal(0) : new Decimal(1).div(pricePerSol);
                        setPriceInfo({ price: priceInSol.toNumber(), loading: false });
                    } else {
                        setPriceInfo({ price: null, loading: false });
                    }
                } else {
                    setPriceInfo({ price: null, loading: false });
                }
            };
            checkLiquidityAndPrice();
            if (selectedPool) setSelectedPool(null);
            if (discoveredPools.length > 0) setDiscoveredPools([]);
        }
    }, [
        network,
        tokenAddress,
        tokenInfo,
        wallet?.publicKey?.toString(),
        connection,
        simPoolRefresh,
        // THIS IS THE CRUCIAL PART THAT WAS MISSING TO DETECT DEVNET POOL CHANGES
        JSON.stringify(getSimulatedPool())
    ]);

    useEffect(() => {
        if (tokenInfo?.isInitialized &&
            typeof tokenInfo.decimals === 'number' &&
            wallet?.publicKey &&
            connection &&
            selectedPool && selectedPool.id
        ) {
            fetchLpTokenDetails();
        } else {
            if (lpTokenBalance !== '0' || userPairedSOL !== 0 || userPairedToken !== 0 || totalLpSupply !== '0' || lpTokenDecimals !== 0) {
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
        }
    }, [tokenInfo, wallet?.publicKey?.toString(), connection, selectedPool, fetchLpTokenDetails]);

    const handlePoolSelection = (pool: DiscoveredPoolDetailed) => {
        console.log('[page.tsx handlePoolSelection DEBUG] Function called. Current network:', network);
        console.log('[page.tsx handlePoolSelection DEBUG] Pool object passed for selection (type, id, programId, rawSdkPoolInfo.config/ammConfig if present):',
            JSON.stringify({
                id: pool?.id,
                type: pool?.type,
                programId: pool?.programId,
                rawConfig: pool?.rawSdkPoolInfo?.config, // This is where CLMM's ammConfig would be if structured as `config`
                rawFeeRate: pool?.rawSdkPoolInfo?.feeRate, // For standard pools
                // For standard pools from ApiPoolInfo, pool.rawSdkPoolInfo.config was logged as undefined by poolFinder
                // For CLMM pools from ApiPoolInfo+clmmRpc, pool.rawSdkPoolInfo.config should contain the CLMM ammConfig
            }, null, 2)
        );

        if (network === 'mainnet-beta') {
            console.log('[page.tsx handlePoolSelection DEBUG] MAINNET: Setting selectedPool with ID:', pool?.id, 'Type:', pool?.type);
            setSelectedPool(pool);
            setIsPoolListCollapsed(true);
            const notifId = Date.now();
            setNotification({ id: notifId, show: true, message: `Pool selected: ${pool.id.substring(0, 6)}... Type: ${pool.type}`, type: 'info' });
            setTimeout(() => setNotification(prev => (prev as any).id === notifId ? { show: false, message: '', type: '' } : prev), 4000);
        } else {
            console.warn("[page.tsx handlePoolSelection DEBUG] Manual pool selection is for Mainnet only. No change to selectedPool. Current selectedPool ID:", selectedPool?.id);
        }
    };

    const subtractBalances = useCallback(
        ({ tokenAmount, solAmount }: { tokenAmount: number | string | BN; solAmount: number }) => {
            console.warn('subtractBalances called (placeholder)', { tokenAmount, solAmount });
        }, []
    );

    const handleNetworkChange = (newNetwork: NetworkType) => {
        if (network === newNetwork) return;
        setWallet(null); setTokenAddress(''); setTokenInfo(null); setSolBalance(0); setTokenBalance('0');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        setErrorMessage(''); setIsLoading(false);
        console.log("[HomePage][setIsLoading] set to FALSE (FUNCTION_NAME)");

        setDiscoveredPools([]);
        setSelectedPool(null);
        setIsPoolListCollapsed(true);
        setNetwork(newNetwork);
        const notifId = Date.now();
        setNotification({ id: notifId, show: true, message: `Switched to ${newNetwork}. Reconnect wallet & load token.`, type: 'info' });
        setTimeout(() => setNotification(prev => (prev as any).id === notifId ? { show: false, message: '', type: '' } : prev), 5000);
    };

    // ==========================================================================================
    // MAIN JSX RETURN for HomePage component
    // ==========================================================================================
    return (
        <div className="p-4 sm:p-6 text-white bg-gray-950 min-h-screen font-sans">
            {/* Header */}
            <AppHeader onNetworkChange={handleNetworkChange} />

            {/* Mint Button Section */}
            {wallet && (
                <div className="mb-6 text-center">
                    <button
                        onClick={async () => {
                            // ... (Mint button logic - keep as is)
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
                                setNotification({ show: true, message: 'Token minting is only enabled on Devnet.', type: 'info' });
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
                                return;
                            }

                            const pkForMinting = wallet.publicKey instanceof PublicKey
                                ? wallet.publicKey
                                : new PublicKey(wallet.publicKey.toString());
                            console.log('[MINT FIX] pkForMinting for adapter:', pkForMinting.toBase58());

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
                                            if (Array.isArray(plainItem.signatures)) plainItem.signatures.forEach(si => { if (si.publicKey && si.signature) reconTx.addSignature(new PublicKey(si.publicKey.toString()), Buffer.isBuffer(si.signature) ? si.signature : Buffer.from(si.signature)) });
                                            return reconTx;
                                        }
                                        throw new Error(`Unrecognized TX format at index ${index}.`);
                                    });
                                },
                                isPhantom: wallet.isPhantom,
                            };
                            console.log('[MINT FIX] walletForMintingAdapter created.');
                            setIsLoading(true);
                            console.log("[HomePage][setIsLoading] set to TRUE (FUNCTION_NAME)");

                            setNotification({ show: true, message: `Minting TestToken...`, type: 'info' });
                            try {
                                const result = await mintTokenWithPhantomWallet(walletForMintingAdapter, connection, 'TestToken');
                                if (result?.mintAddress) {
                                    setTokenAddress(result.mintAddress);
                                    setNotification({ show: true, message: `Token minted! Address: ${result.mintAddress.substring(0, 10)}...`, type: 'success' });
                                } else { throw new Error('Minting did not return address.'); }
                            } catch (err: any) {
                                console.error('Mint error:', err);
                                setNotification({ show: true, message: `Mint Failed: ${err.message || 'Unknown'}`, type: 'error' });
                                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
                            } finally {
                                setIsLoading(false);
                                console.log("[HomePage][setIsLoading] set to FALSE (FUNCTION_NAME)");

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

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
                        <label htmlFor="token-address-input" className="block text-lg mb-2 text-gray-200">Token Address ({network})</label>
                        <input id="token-address-input" type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder={`Paste ${network} token mint address`} className="w-full mb-3 p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                selectedPool={selectedPool}
                                network={network} // Pass network prop
                            />
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 flex items-center justify-center bg-gray-900 p-6 rounded-lg border border-gray-800 text-gray-500 min-h-[200px]">
                        {isLoading ? 'Processing...' : !wallet ? `Connect wallet to see token details on ${network}.` : `Load a token on ${network} to see live chart and LP details.`}
                    </div>
                )}
            </div>

            {/* *** MODIFIED: Discovered Pools Section - Only for Mainnet *** */}
            {network === 'mainnet-beta' && wallet?.publicKey && tokenAddress && (
                <div className="my-6 bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-white">
                            Discovered Pools on <span className="text-yellow-400">{network}</span> for <span className="font-mono text-sm text-purple-300">{tokenAddress.substring(0, 6)}...</span>
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
                    {selectedPool && network === 'mainnet-beta' && (
                        <div className="mb-3 p-3 bg-gray-800 border border-gray-700 rounded-md text-sm">
                            <p className="font-semibold text-green-400">Selected Mainnet Pool:</p>
                            <p><span className="text-gray-400">ID:</span> <span className="text-white font-mono">{selectedPool.id}</span></p>
                            <p><span className="text-gray-400">TVL:</span> <span className="text-white">${selectedPool.tvl ? Number(selectedPool.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</span></p>
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
                                        <p><span className="text-gray-400">Price:</span> <span className="text-white">{pool.price ? Number(pool.price).toExponential(6) : 'N/A'}</span></p>
                                        <p><span className="text-gray-400">TVL:</span> <span className="text-white">${pool.tvl ? Number(pool.tvl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</span></p>
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

            {/* Display for Auto-Configured Devnet Pool */}
            {network === 'devnet' && selectedPool && selectedPool.id && selectedPool.type === 'CPMM_DEVNET_SEEDED' && (
                <div className="my-6 bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
                    <h3 className="text-xl font-semibold text-white mb-3">
                        Auto-Configured Devnet Pool
                    </h3>
                    <div className="p-3 bg-gray-800 border border-gray-700 rounded-md text-sm">
                        <p><span className="text-gray-400">Pool ID:</span> <span className="text-white font-mono">{selectedPool.id}</span></p>
                        <p><span className="text-gray-400">Type:</span> <span className="text-white">{selectedPool.type}</span></p>
                        <p><span className="text-gray-400">Price:</span> <span className="text-white">{selectedPool.price ? Number(selectedPool.price).toExponential(6) : 'N/A'}</span></p>
                    </div>
                </div>
            )}
            {/* Message if on Devnet and no pool is yet configured */}
            {network === 'devnet' && !selectedPool && tokenAddress && wallet && (
                <div className="my-6 bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 shadow">
                    <p className="text-gray-400">Attempting to load/configure Devnet pool for {tokenAddress.substring(0, 6)}...</p>
                    {/* This message will show if SimulatedLiquidityManager hasn't yet seeded the store, or if the pool doesn't exist */}
                </div>
            )}

            {/* Liquidity Manager & Trading Interface Section */}
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
                        network={network} // *** Pass network prop ***
                        onSimPoolSeeded={() => setSimPoolRefresh(v => v + 1)}
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
    setNotification={setNotification}
    network={network}
    selectedPool={selectedPool}
    priceInSol={priceInfo.price}
    isPriceLoading={priceInfo.loading}
    isPoolSelected={network === "mainnet-beta" ? (priceInfo.price !== null && priceInfo.price > 0) : !!(selectedPool && selectedPool.id)}
    isLoading={isLoading}
    setIsLoading={setIsLoading}
/>

                </div>
            ) : (
                <div className="mt-10 text-center text-gray-400">
                    {!wallet ? `Connect wallet to manage liquidity and trade.` : `Load a token to manage liquidity and trade.`}
                </div>
            )}

            {/* Global Loading Overlay & Notification Popup */}
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
                    <div className={`px-4 py-3 rounded shadow-lg text-sm break-words whitespace-pre-wrap ${notification.type === 'success' ? 'bg-green-700 text-green-100' :
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