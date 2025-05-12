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
    // This is the version that was working for minting from our previous interactions
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
    let canBePublicKeyInstance = false;
    let publicKeyString = '';
    try {
        publicKeyString = wallet.publicKey.toString();
        new PublicKey(publicKeyString);
        canBePublicKeyInstance = true;
        console.log(`[isPhantomWallet Check] publicKey validation: OK (String: ${publicKeyString.substring(0,6)}...)`);
    } catch (e) {
        console.log("[isPhantomWallet Check] Failed: publicKey could not be constructed into a PublicKey instance from string:", publicKeyString, e);
         return false;
    }
    const hasSignTransaction = typeof wallet.signTransaction === 'function';
    const hasSignAllTransactions = typeof wallet.signAllTransactions === 'function';
    if (!hasSignTransaction || !hasSignAllTransactions) {
        console.log("[isPhantomWallet Check] Failed: Missing required signing function(s).", { hasSignTransaction, hasSignAllTransactions });
        return false;
    }
    console.log("[isPhantomWallet Check] Signing functions: OK");
    const isPhantomFlag = wallet.isPhantom === true;
     if (!isPhantomFlag) {
         console.log("[isPhantomWallet Check] Note: isPhantom flag is not explicitly true. Allowing for now (could be other compatible wallet).");
     } else {
          console.log("[isPhantomWallet Check] isPhantom flag: OK (true)");
     }
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
        console.log("[fetchLpTokenDetails] Attempting to fetch LP details...");
        if (!wallet?.publicKey || !tokenAddress || !connection || !tokenInfo) {
            console.log("[fetchLpTokenDetails] Skipped: Prerequisites not met (wallet, tokenAddress, connection, or tokenInfo).");
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
        if (typeof tokenInfo.decimals !== 'number' || isNaN(tokenInfo.decimals)) {
            console.warn("[fetchLpTokenDetails] skipped: tokenInfo.decimals not available or invalid.", tokenInfo.decimals);
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }

        let localNotification = { show: true, message: `Workspaceing LP details for ${tokenAddress.substring(0,6)} on ${network}...`, type: 'info' as NotificationType };
        setNotification(localNotification);

        try {
            const mintA_SOL = NATIVE_MINT;
            const mintB_Token = new PublicKey(tokenAddress);

            // **** CORRECTED PROGRAM ID USAGE FOR DEVNET ****
            const cpmmProgramIdToUse = network === 'mainnet-beta'
                ? MAINNET_AMM_V4_PROGRAM_ID // Standard AMM V4 for mainnet
                : DEVNET_CREATE_POOL_PROGRAM_ID; // Use CREATE_POOL_PROGRAM_ID for Devnet CPMM pools

            const feeConfigIdToUse = network === 'mainnet-beta' ? new PublicKey(MAINNET_AMM_V4_CONFIG_ID_STR) : new PublicKey(DEVNET_AMM_V4_CONFIG_ID_STR);
            
            console.log(`[fetchLpTokenDetails] For ${network}: Using CPMM Program ID: ${cpmmProgramIdToUse.toBase58()}, Fee Config ID: ${feeConfigIdToUse.toBase58()}`);

            const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramIdToUse, configId: feeConfigIdToUse, mintA: mintA_SOL, mintB: mintB_Token });
            const { lpMint: lpMintAddress, vaultA: vaultAAddress, vaultB: vaultBAddress } = derivedPoolKeys;

            if (!(lpMintAddress instanceof PublicKey) || !(vaultAAddress instanceof PublicKey) || !(vaultBAddress instanceof PublicKey)) {
                const errorMsgText = `[fetchLpTokenDetails] Derived pool key(s) are not valid for ${network}. Token pair might not have a matching Raydium AMMv4 LP.`;
                console.error(errorMsgText, "Derived Keys:", derivedPoolKeys);
                localNotification = { show: true, message: "Could not derive valid pool addresses for LP details.", type: 'error'};
                throw new Error(errorMsgText);
            }
            console.log(`[fetchLpTokenDetails] For ${network}: Derived LP Mint: ${lpMintAddress.toBase58()}, Vault A (SOL): ${vaultAAddress.toBase58()}, Vault B (Token): ${vaultBAddress.toBase58()}`);
            
            const ownerPkForLp = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
            const lpTokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPkForLp, { mint: lpMintAddress }, 'confirmed');
            let currentLpBalanceBN = new BN(0);
            if (lpTokenAccounts.value.length > 0) currentLpBalanceBN = new BN(lpTokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
            setLpTokenBalance(currentLpBalanceBN.toString());
            console.log(`[fetchLpTokenDetails] User LP Balance (raw): ${currentLpBalanceBN.toString()}`);

            const lpMintInfo = await getMint(connection, lpMintAddress);
            const currentTotalLpSupplyBN = new BN(lpMintInfo.supply.toString());
            setTotalLpSupply(currentTotalLpSupplyBN.toString());
            setLpTokenDecimals(lpMintInfo.decimals);
            console.log(`[fetchLpTokenDetails] LP Mint Decimals: ${lpMintInfo.decimals}, Total Supply: ${currentTotalLpSupplyBN.toString()}`);

            const vaultAInfoRaw = await connection.getAccountInfo(vaultAAddress);
            const vaultBInfoRaw = await connection.getAccountInfo(vaultBAddress);

            if (!vaultAInfoRaw || !vaultBInfoRaw) {
                setUserPairedSOL(0); setUserPairedToken(0);
                localNotification = { show: true, message: `LP pool vaults not found for this token on ${network}. Pool might not exist or be initialized with this config.`, type: 'info'};
                console.warn(`[fetchLpTokenDetails] LP Vaults not found for token: ${tokenAddress} on ${network}. Derived vaults: A=${vaultAAddress.toBase58()}, B=${vaultBAddress.toBase58()}`);
            } else {
                const vaultASolBalanceInfo = await connection.getTokenAccountBalance(vaultAAddress, 'confirmed');
                const totalSolInPoolBN = new BN(vaultASolBalanceInfo.value.amount);
                const vaultBTokenBalanceInfo = await connection.getTokenAccountBalance(vaultBAddress, 'confirmed');
                const totalTokenInPoolBN = new BN(vaultBTokenBalanceInfo.value.amount);
                console.log(`[fetchLpTokenDetails] Pool Reserves: SOL=${totalSolInPoolBN.toString()}, Token=${totalTokenInPoolBN.toString()}`);

                if (currentTotalLpSupplyBN.gtn(0) && currentLpBalanceBN.gtn(0) && tokenInfo.decimals >= 0) {
                    const userShareSolLamportsBN = currentLpBalanceBN.mul(totalSolInPoolBN).div(currentTotalLpSupplyBN);
                    setUserPairedSOL(new Decimal(userShareSolLamportsBN.toString()).div(1e9).toNumber());
                    
                    const userShareTokenRawBN = currentLpBalanceBN.mul(totalTokenInPoolBN).div(currentTotalLpSupplyBN);
                    const tokenDivisor = new Decimal(10).pow(tokenInfo.decimals);
                    setUserPairedToken(tokenDivisor.isZero() ? 0 : new Decimal(userShareTokenRawBN.toString()).div(tokenDivisor).toNumber());
                    
                    console.log(`[fetchLpTokenDetails] User share: SOL=${userPairedSOL}, Token=${userPairedToken}`);
                    localNotification = { show: true, message: 'LP details loaded!', type: 'success' };
                } else {
                    setUserPairedSOL(0); setUserPairedToken(0);
                    const messageText = currentLpBalanceBN.eqn(0) ? 'You have no LP tokens for this pool.' : 'LP details updated (cannot calculate share: zero LP supply or user balance).';
                    localNotification = { show: true, message: messageText, type: 'info' };
                    console.log(`[fetchLpTokenDetails] Cannot calculate user share: LP Supply=${currentTotalLpSupplyBN.toString()}, User LP=${currentLpBalanceBN.toString()}`);
                }
            }
        } catch (err: any) {
            console.error(`[fetchLpTokenDetails] Error on ${network}:`, err, err.stack);
            const errMessageText = err.message ? err.message.toLowerCase() : '';
            if (errMessageText.includes('could not find account') || errMessageText.includes('failed to get account info') || errMessageText.includes('invalid param: could not find mint') || errMessageText.includes('invalid public key') || errMessageText.includes('pool key(s) are not valid') || errMessageText.includes('non-base58')) {
                localNotification = { show: true, message: `Error fetching LP details for token on ${network}. Details: ${err.message.substring(0,70)}...`, type: 'info' };
            } else {
                localNotification = { show: true, message: `Failed to fetch LP details on ${network}: ${err.message ? err.message.substring(0,100) : 'Unknown error'}...`, type: 'error' };
            }
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
        } finally {
            setNotification(localNotification);
            setTimeout(() => setNotification(prev => prev.message === localNotification.message ? { show: false, message: '', type: '' } : prev), 4000);
        }
    }, [wallet, tokenAddress, connection, tokenInfo, network, setNotification, userPairedSOL, userPairedToken]);

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
        [connection, tokenAddress, fetchTokenBalance, network, setNotification, setIsLoading]
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
                await fetchLpTokenDetails();
            } else {
                setTokenBalance('0');
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
                setNotification({show: true, message: `Balances refreshed! (No token loaded)`, type: 'success'});
                setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
            }
            if (notification.message === currentRefreshMessage) {
                 setNotification({show: true, message: `Balances refreshed on ${network}!`, type: 'success'});
                 setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
            }
        } catch (err: any) {
            console.error(`Error refreshing balances on ${network}:`, err);
            setNotification({show: true, message: `Error refreshing balances: ${err.message}`, type: 'error'});
            setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        } finally {
            setIsLoading(false);
             setTimeout(() => setNotification(prev => prev.message === currentRefreshMessage ? { show: false, message: '', type: '' } : prev), 500);
        }
    }, [wallet, connection, tokenAddress, tokenInfo, fetchTokenBalance, fetchLpTokenDetails, network, setIsLoading, setNotification, notification.message]);

    const loadTokenInfo = useCallback(async () => {
        if (!tokenAddress) {
            setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
            setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            return;
        }
        setIsLoading(true);
        setTokenInfo(null); setTokenBalance('0'); setErrorMessage('');
        setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
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
            setTimeout(() => setNotification(prev => prev.message === currentLoadTokenMsg ? { show: false, message: '', type: '' } : prev), 3000);
        }
    }, [tokenAddress, connection, wallet, fetchTokenBalance, network, setNotification, setIsLoading]);


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
    }, [tokenAddress, network, loadTokenInfo]);

    useEffect(() => {
        if (tokenInfo && tokenInfo.isInitialized && typeof tokenInfo.decimals === 'number' && wallet?.publicKey && connection) {
            fetchLpTokenDetails();
        } else { 
             if (lpTokenBalance !== '0' || userPairedSOL !== 0 || userPairedToken !== 0 || totalLpSupply !== '0' || lpTokenDecimals !== 0) {
                setLpTokenBalance('0'); setUserPairedSOL(0); setUserPairedToken(0); setTotalLpSupply('0'); setLpTokenDecimals(0);
            }
        }
    }, [tokenInfo, wallet, connection, fetchLpTokenDetails]);

    const subtractBalances = useCallback(
        ({ tokenAmount, solAmount }: { tokenAmount: number | string | BN; solAmount: number }) => {
            console.warn('subtractBalances called', { tokenAmount, solAmount });
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
                <p className="text-gray-400 text-xs mt-1">Test token minting, LP management, and live pricing.</p>
            </header>

            {wallet && (
                <div className="mb-6 text-center">
                    <button
                        onClick={async () => {
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
                                    setTokenAddress(result.mintAddress);
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
                        // setNotification={setNotification} // Prop removed as per previous error fix
                        // network={network} // Prop removed as per THIS error fix
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
                        // notification.type === 'warning' ? 'bg-yellow-700 text-yellow-100' : // Removed warning from your type
                        'bg-blue-700 text-blue-100'
                    }`}>
                        {notification.message}
                    </div>
                </div>
            )}
        </div>
    );
}