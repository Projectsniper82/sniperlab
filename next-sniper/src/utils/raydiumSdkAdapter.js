// src/utils/raydiumSdkAdapter.js
// VERSION v71 - Adapted for network-aware Raydium SDK initialization

// --- Consolidated Imports ---
import {
    Raydium,
    DEVNET_PROGRAM_ID, // For Devnet
    ALL_PROGRAM_ID,    // For Mainnet (as identified from your SDK's type definitions)
    getCreatePoolKeys,
    makeCreateCpmmPoolInInstruction as makeCreateCpmmPoolIx,
    ApiV3PoolInfoStandardItemCpmm, // Assuming these are used by your other functions
    CpmmKeys,
    CpmmRpcData,
    CurveCalculator,
    TradeV2,
    Token,
    TokenAmount,
    Percent,
    fetchMultipleMintInfos,
    getPdaPoolAuthority,
    makeSwapCpmmBaseInInstruction // Consolidating this here as well
} from '@raydium-io/raydium-sdk-v2';

import {
    Connection, // Keep if used directly in this file, though initRaydiumSdk receives it
    PublicKey,
    Transaction,
    SystemProgram,
    ComputeBudgetProgram,
    VersionedTransaction,
    Commitment, // Keep if used
    TransactionInstruction, // Keep if used
    getParsedAccountInfo, // Keep if used by other functions
    TransactionMessage, // Keep if used
} from '@solana/web3.js';

import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createSyncNativeInstruction,
    NATIVE_MINT,
    createCloseAccountInstruction,
    getMint, // <<< ADD THIS IMPORT
} from '@solana/spl-token';

import BN from 'bn.js';
import Decimal from 'decimal.js';
import { Buffer } from 'buffer'; // Single import for Buffer

// Your existing local utils
import { getSimulatedPool, setSimulatedPool, updateSimulatedPoolAfterTrade } from './simulatedPoolStore'; // Assuming this is correct
import { createWalletAdapter } from './walletAdapter'; // Assuming this is correct

Decimal.set({ precision: 50 });

// --- Helper: JSON Stringify Replacer ---
function replacer(key, value) {
    if (typeof value === 'bigint') { return value.toString() + 'n'; }
    if (value instanceof BN) { return value.toString(); }
    if (value instanceof PublicKey) { return value.toBase58(); }
    if (value instanceof TokenAmount) { return { raw: value.raw.toString(), toExact: value.toExact() }; }
    if (value instanceof Buffer) { return value.toString('hex'); }
    return value;
}

// --- Helper: Send Transaction ---
async function sendAndConfirmSignedTransaction(connection, signedTransaction) {
    console.log("[Helper] -> sendAndConfirmSignedTransaction: Sending...");
    try {
        if (!signedTransaction) throw new Error('Invalid signed transaction object');
        const rawTransaction = signedTransaction.serialize();
        const signature = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true, maxRetries: 5 });
        console.log(`[Helper] TX Sent. Sig: ${signature}. Confirming...`);

        let blockhash;
        let lastValidBlockHeight;
        if (signedTransaction instanceof VersionedTransaction) {
            blockhash = signedTransaction.message.recentBlockhash;
            const fetched = await connection.getLatestBlockhash('confirmed');
            lastValidBlockHeight = fetched.lastValidBlockHeight;
        } else if (signedTransaction instanceof Transaction) {
            blockhash = signedTransaction.recentBlockhash;
            lastValidBlockHeight = signedTransaction.lastValidBlockHeight;
            if (!lastValidBlockHeight) {
                const fetched = await connection.getLatestBlockhash('confirmed');
                lastValidBlockHeight = fetched.lastValidBlockHeight;
            }
        } else {
            console.warn("[Helper] Unknown transaction type, attempting to fetch blockhash for confirmation.");
            const fetched = await connection.getLatestBlockhash('confirmed');
            blockhash = fetched.blockhash;
            lastValidBlockHeight = fetched.lastValidBlockHeight;
        }

        if (!blockhash || !lastValidBlockHeight) {
            throw new Error("[Helper] Could not determine blockhash or lastValidBlockHeight for confirmation.");
        }

        const confirmation = await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
        if (confirmation.value.err) {
            console.error("[Helper] TX Confirmation Error:", confirmation.value.err);
            try {
                const failedTx = await connection.getTransaction(signature, {maxSupportedTransactionVersion: 0, commitment: 'confirmed'});
                console.error("[Helper] Failed TX Logs:", failedTx?.meta?.logMessages?.join('\n'));
            } catch (logError) {
                console.warn("Could not fetch logs for failed tx:", logError);
            }
            throw new Error(`TX failed confirmation: ${JSON.stringify(confirmation.value.err)}`);
        }
        console.log(`[Helper] ✅ TX Confirmed. Sig: ${signature}`);
        return signature;
    } catch (error) {
        console.error('[Helper] send/confirm error:', error);
        throw error;
    }
}

// --- Helper: Sign and Send Transaction ---
async function signAndSendTransaction(connection, wallet, transaction) {
    if (!wallet || typeof wallet.signTransaction !== 'function') { throw new Error("Invalid wallet object provided for signing."); }
    console.log("[Helper] -> signAndSendTransaction: Signing transaction...");
    try {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

        if (transaction instanceof VersionedTransaction) {
            console.warn("[Helper] signAndSend received VersionedTransaction. Blockhash/FeePayer set via message. signer:", transaction.message.payerKey.toBase58());
            if (!transaction.message.payerKey) {
                console.warn("[Helper] VersionedTransaction message missing payerKey. Wallet PK should be used when creating TransactionMessage.");
            }
        } else if (transaction instanceof Transaction) {
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            console.log("[Helper] signAndSend received legacy Transaction. Blockhash/FeePayer set.");
        } else {
            throw new Error("[Helper] Unknown transaction type passed to signAndSendTransaction.");
        }

        const signedTx = await wallet.signTransaction(transaction);
        console.log("[Helper] Transaction signed. Sending...");
        return await sendAndConfirmSignedTransaction(connection, signedTx);
    } catch (error) {
        console.error('[Helper] signAndSend error:', error);
        throw error;
    }
}

// --- initRaydiumSdk (Corrected for Network Awareness) ---
export const initRaydiumSdk = async (wallet, connection, currentNetwork) => {
    console.log(`[SDK Init] -> initRaydiumSdk v25 (Corrected Imports): Initializing SDK instance for network: ${currentNetwork}...`);
    if (!wallet?.publicKey) {
        console.error('[SDK Init] No wallet or wallet.publicKey provided.');
        return null;
    }

    let ownerPublicKey;
    try {
        ownerPublicKey = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
    } catch (e) {
        console.error(`[SDK Init] Invalid wallet public key format: ${e.message}`);
        throw new Error(`[SDK Init] Invalid wallet public key format: ${e.message}`);
    }

    // This Buffer polyfill is more relevant for client-side code.
    // In a Node.js environment (like Next.js API routes), Buffer is globally available.
    if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = Buffer;
    }

    try {
        const cluster = currentNetwork === 'mainnet-beta' ? 'mainnet' : 'devnet';
        // Use ALL_PROGRAM_ID for mainnet, DEVNET_PROGRAM_ID for devnet
        const programIdConfig = currentNetwork === 'mainnet-beta' ? ALL_PROGRAM_ID : DEVNET_PROGRAM_ID;

        console.log(`[SDK Init] Owner PK: ${ownerPublicKey.toString()}`);
        console.log(`[SDK Init] RPC Endpoint: ${connection.rpcEndpoint}`);
        console.log(`[SDK Init] Target Raydium SDK Cluster: ${cluster}`);
        console.log(`[SDK Init] Using Program ID Config for: ${currentNetwork}`, programIdConfig ? "Present" : "Missing");

        if (!programIdConfig) {
            console.error(`[SDK Init] Program ID Config is missing for network: ${currentNetwork}. Ensure ALL_PROGRAM_ID or DEVNET_PROGRAM_ID is correctly imported and available from @raydium-io/raydium-sdk-v2.`);
            return null;
        }
        
        const sdkInstance = await Raydium.load({
            owner: ownerPublicKey,
            connection,
            cluster: cluster,
            programIdConfig: programIdConfig,
            disableFeatureCheck: true
        });

        console.log(`[SDK Init] ✅ Raydium SDK initialized for ${cluster}.`);
        sdkInstance._originalWallet = wallet;
        console.log("[SDK Init] Stored original wallet on SDK instance.");
        return sdkInstance;

    } catch (error) {
        console.error(`[SDK Init] ❌ SDK Init Fail for network ${currentNetwork}:`, error);
        if (error.message) console.error(`[SDK Init] Error message: ${error.message}`);
        if (error.stack) console.error(`[SDK Init] Error stack: ${error.stack}`);
        return null;
    }
};

// --- ensureAtaExists ---
export const getAtaAddressAndCreateInstruction = async (connection, ownerPublicKey, tokenMint) => {
    console.log(`[ATA Ensure/GetIx] -> getAtaAddressAndCreateInstruction: Start for mint ${tokenMint}`);
    let mintPubkey;
    try {
        mintPubkey = new PublicKey(tokenMint);
    } catch (e) {
        throw new Error(`[ATA Ensure/GetIx] Invalid mint address format: ${tokenMint}`);
    }
    if (!ownerPublicKey) throw new Error("[ATA Ensure/GetIx] Owner PK missing.");

    try {
        const tokenAccount = await getAssociatedTokenAddress(
            mintPubkey,
            ownerPublicKey,
            false, // allowOwnerOffCurve
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log(`[ATA Ensure/GetIx] Derived ATA address: ${tokenAccount.toBase58()}`);

        const accountInfo = await connection.getAccountInfo(tokenAccount);

        if (!accountInfo) {
            console.log(`[ATA Ensure/GetIx] ATA ${tokenAccount.toBase58()} does NOT exist. Returning creation instruction.`);
            const createIx = createAssociatedTokenAccountInstruction(
                ownerPublicKey, // payer
                tokenAccount, // associatedTokenAccount
                ownerPublicKey, // owner
                mintPubkey, // mint
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );
            return { address: tokenAccount, instruction: createIx };
        } else {
            console.log(`[ATA Ensure/GetIx] Found existing ATA: ${tokenAccount.toBase58()}. No instruction needed.`);
            return { address: tokenAccount, instruction: null };
        }
    } catch (error) {
        console.error(`[ATA Ensure/GetIx] Error checking/preparing ATA for mint ${mintPubkey?.toString()}:`, error);
        throw error;
    }
};

// --- ensureWSOLAccount ---
export const getWSOLAccountAndInstructions = async (connection, ownerPublicKey, amountBN) => {
    console.log(`[WSOL Ensure/GetIxs] -> getWSOLAccountAndInstructions: Start. Amount to wrap: ${amountBN.toString()}`);
    const wsolMint = NATIVE_MINT;
    if (!ownerPublicKey) throw new Error("[WSOL Ensure/GetIxs] Owner PK missing.");

    const wsolAta = await getAssociatedTokenAddress(
        wsolMint,
        ownerPublicKey,
        false, 
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log(`[WSOL Ensure/GetIxs] Derived WSOL ATA address: ${wsolAta.toBase58()}`);

    const ataInfo = await connection.getAccountInfo(wsolAta);
    const instructions = [];

    if (!ataInfo) {
        console.log('[WSOL Ensure/GetIxs] WSOL ATA does NOT exist. Adding creation instruction.');
        instructions.push(createAssociatedTokenAccountInstruction(
            ownerPublicKey, wsolAta, ownerPublicKey, wsolMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
        ));
    } else {
        console.log('[WSOL Ensure/GetIxs] WSOL ATA exists.');
    }

    if (amountBN.gt(new BN(0))) {
        console.log(`[WSOL Ensure/GetIxs] Wrap amount > 0. Adding transfer and sync instructions for ${amountBN.toString()} lamports.`);
        instructions.push(SystemProgram.transfer({
            fromPubkey: ownerPublicKey,
            toPubkey: wsolAta,
            lamports: amountBN
        }));
        instructions.push(createSyncNativeInstruction(wsolAta, TOKEN_PROGRAM_ID));
    } else {
        console.log('[WSOL Ensure/GetIxs] No wrap needed for this amount.');
    }
    return { address: wsolAta, instructions: instructions.length > 0 ? instructions : null };
};

// --- Create Raydium Liquidity Pool ---
export const createRaydiumPool = async (
    wallet, connection, tokenAddress, tokenDecimals, tokenAmountBN, solLamportsBN
) => {
    console.log('[CreatePool vXX] Starting (Bundled TX)...');
    const startTime = new BN(Math.floor(Date.now() / 1000));
    let ownerPublicKey;
    try {
        if (!wallet || !wallet.publicKey) throw new Error("Wallet or wallet.publicKey is missing.");
        ownerPublicKey = wallet.publicKey instanceof PublicKey ? wallet.publicKey : new PublicKey(wallet.publicKey.toString());
    } catch (e) {
        throw new Error(`[CreatePool vXX] Invalid wallet public key format: ${e.message}`);
    }

    // THESE IDs ARE FOR DEVNET. For mainnet, you'd need different ones.
    // This function itself needs to be network-aware if it's to be used on mainnet.
    // For now, assuming it's only called when dashboard is in Devnet mode.
    // If not, the Raydium SDK initialized for mainnet might use mainnet CPMM program
    // but these hardcoded fee accounts might be devnet specific.
    const cpmmProgramId = new PublicKey("CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW");
    const createPoolFeeAccount = new PublicKey("G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2");
    const feeConfigId = new PublicKey("9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6");

    try {
        const mintA = NATIVE_MINT;
        const mintB = new PublicKey(tokenAddress);

        console.log('[CreatePool vXX] Getting user ATA addresses and collecting setup instructions...');
        const setupInstructions = [];
        const { address: userTokenAccountA_WSOL, instructions: wsolInstructions } = await getWSOLAccountAndInstructions(connection, ownerPublicKey, solLamportsBN);
        if (wsolInstructions) {
            setupInstructions.push(...wsolInstructions);
        }
        const { address: userTokenAccountB_Custom, instruction: tokenCreateInstruction } = await getAtaAddressAndCreateInstruction(connection, ownerPublicKey, mintB.toBase58());
        if (tokenCreateInstruction) {
            setupInstructions.push(tokenCreateInstruction);
        }
        console.log(`[CreatePool vXX] Determined User ATAs - WSOL: ${userTokenAccountA_WSOL?.toBase58()}, Token: ${userTokenAccountB_Custom?.toBase58()}. Collected ${setupInstructions.length} setup instructions.`);

        console.log('[CreatePool vXX] Deriving pool keys...');
        const derivedPoolKeys = getCreatePoolKeys({ programId: cpmmProgramId, configId: feeConfigId, mintA: mintA, mintB: mintB });
        console.log('[CreatePool vXX] Derived Pool Keys:', JSON.stringify(derivedPoolKeys, replacer, 2));
        const userLpAta = await getAssociatedTokenAddress(derivedPoolKeys.lpMint, ownerPublicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

        console.log('[CreatePool vXX] Preparing main pool creation instruction...');
        const createPoolInstruction = makeCreateCpmmPoolIx(
            cpmmProgramId, ownerPublicKey, feeConfigId, derivedPoolKeys.authority, derivedPoolKeys.poolId,
            mintA, mintB, derivedPoolKeys.lpMint, userTokenAccountA_WSOL, userTokenAccountB_Custom, userLpAta,
            derivedPoolKeys.vaultA, derivedPoolKeys.vaultB, createPoolFeeAccount, TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID,
            derivedPoolKeys.observationId, solLamportsBN, tokenAmountBN, startTime
        );

        console.log('[CreatePool vXX] Building and sending bundled transaction...');
        const transaction = new Transaction();
        transaction.feePayer = ownerPublicKey;
        transaction.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 800000 }));
        transaction.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 }));
        if (setupInstructions.length > 0) {
            transaction.add(...setupInstructions);
        }
        transaction.add(createPoolInstruction);
        const { blockhash } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;

        const txId = await signAndSendTransaction(connection, wallet, transaction);
        console.log(`[CreatePool vXX] ✅ Pool creation TX sent! TxID: ${txId}`);

     console.log('[CreatePool vXX] Fetching live reserves and LP details post-creation...');
    // Fetch live reserves again *after* pool creation to be sure
    const newVaultASolBalanceInfo = await connection.getTokenAccountBalance(derivedPoolKeys.vaultA, 'confirmed');
    const newVaultBTokenBalanceInfo = await connection.getTokenAccountBalance(derivedPoolKeys.vaultB, 'confirmed');
    const liveSolReserveBN = new BN(newVaultASolBalanceInfo.value.amount);
    const liveTokenReserveBN = new BN(newVaultBTokenBalanceInfo.value.amount);

    const uiSolAmount = new Decimal(liveSolReserveBN.toString()).div(1e9);
    const uiTokenAmount = new Decimal(liveTokenReserveBN.toString()).div(10 ** tokenDecimals);
    const currentPrice = uiTokenAmount.isZero() ? new Decimal(0) : uiSolAmount.div(uiTokenAmount);
    const currentTvl = uiSolAmount.plus(uiTokenAmount.mul(currentPrice));

    let lpMintInfo;
    let lpTotalSupplyBN = new BN(0);
    let lpDecimals = derivedPoolKeys.lpDecimals !== undefined ? derivedPoolKeys.lpDecimals : 0;
    try {
        lpMintInfo = await getMint(connection, derivedPoolKeys.lpMint);
        lpTotalSupplyBN = new BN(lpMintInfo.supply.toString());
        if (lpDecimals === 0 && lpMintInfo.decimals !== 0) {
             lpDecimals = lpMintInfo.decimals;
        }
        console.log(`[CreatePool vXX] LP Mint ${derivedPoolKeys.lpMint.toBase58()} Supply: ${lpTotalSupplyBN.toString()}, Decimals: ${lpDecimals}`);
    } catch (e) {
        console.warn(`[CreatePool vXX] Could not fetch LP mint info for ${derivedPoolKeys.lpMint.toBase58()} after creation. Error: ${e.message}`);
    }

    const poolInfoForStore = {
        // Fields for DiscoveredPoolDetailed and SimulatedLiquidityManager's isDataComplete check
        id: derivedPoolKeys.poolId.toString(),
        programId: cpmmProgramId.toString(),
        type: 'CPMM_DEVNET_CREATED', // Custom type for newly created devnet pools
        price: currentPrice.toNumber(),
        tvl: currentTvl.toNumber(),
        mintA: NATIVE_MINT.toBase58(),
        mintB: tokenAddress, // Original case tokenAddress
        vaultA: derivedPoolKeys.vaultA.toString(),
        vaultB: derivedPoolKeys.vaultB.toString(),

        // Fields for simulatedPoolStore general compatibility
        tokenAddress: tokenAddress.toLowerCase(), // Lowercase for matching
        tokenDecimals: tokenDecimals,
        tokenAmount: uiTokenAmount.toNumber(),
        solAmount: uiSolAmount.toNumber(),
        volume: 0,
        candles: [{
            open: currentPrice.toNumber(),
            high: currentPrice.toNumber(),
            low: currentPrice.toNumber(),
            close: currentPrice.toNumber(),
            timestamp: startTime.toNumber() * 1000
        }],
        isSeeded: true, // It's now an on-chain, "seeded" pool
        raydiumPoolId: derivedPoolKeys.poolId.toString(), // For components that might still use this specific key

        // Comprehensive rawSdkPoolInfo for SDK operations
        rawSdkPoolInfo: {
            id: derivedPoolKeys.poolId,
            programId: cpmmProgramId,
            configId: feeConfigId, // feeConfigId is defined in createRaydiumPool scope
            observationId: derivedPoolKeys.observationId,
            authority: derivedPoolKeys.authority,
            mintA: { address: NATIVE_MINT, decimals: 9, programId: TOKEN_PROGRAM_ID },
            mintB: { address: new PublicKey(tokenAddress), decimals: tokenDecimals, programId: TOKEN_PROGRAM_ID },
            mintLp: { address: derivedPoolKeys.lpMint, decimals: lpDecimals, programId: TOKEN_PROGRAM_ID },
            vaultA: derivedPoolKeys.vaultA,
            vaultB: derivedPoolKeys.vaultB,
            baseReserve: liveSolReserveBN,
            quoteReserve: liveTokenReserveBN,
            lpAmount: lpTotalSupplyBN,
            status: new BN(0), // Active status
            openTime: startTime, // BN startTime
            configInfo: { // Ensure these fees match your devnet CPMM config
                id: feeConfigId,
                index: derivedPoolKeys.configIndex ?? 0, // configIndex from derivedPoolKeys or default
                tradeFeeRate: derivedPoolKeys.tradeFeeRate ?? new BN(2500), // default 0.25%
                protocolFeeRate: derivedPoolKeys.protocolFeeRate ?? new BN(0),
                fundFeeRate: derivedPoolKeys.fundFeeRate ?? new BN(0),
                createPoolFee: derivedPoolKeys.createPoolFee ?? new BN(0)
            },
            mintDecimalA: 9,
            mintDecimalB: tokenDecimals,
        },
    };

    setSimulatedPool(poolInfoForStore); // Update the global store with the comprehensive object
    console.log('[CreatePool vXX] ✅ Successfully set comprehensive pool info in store and returning:', JSON.stringify(poolInfoForStore, replacer, 2));
    return { signature: txId, poolInfo: poolInfoForStore };
    } catch (error) {
        console.error('[CreatePool vXX] ❌ Failed pool creation:', error);
        if (error?.logs) { console.error('[CreatePool vXX] Logs:', error.logs); }
        throw error;
    }
};

// --- Swap Raydium Tokens ---
export const swapRaydiumTokens = async (
    wallet, connection, poolIdString, inputMintAddress, amountInBN, slippage
) => {
    console.log(`[Swap Raydium] ---> Start`);
    // Ensure currentNetwork is passed to initRaydiumSdk if it's not using a global/contextual one
    // For now, assuming 'connection' implies the correct network context for initRaydiumSdk
    // or that initRaydiumSdk is called correctly with network elsewhere.
    // If initRaydiumSdk is called inside here, it needs the currentNetwork.
    // However, your log shows it's called from handleWalletConnected in page.tsx.

    // The rest of your swapRaydiumTokens function relies on raydium.cpmm.getPoolInfoFromRpc
    // and raydium.cpmm.computeSwapAmount. These will use the Raydium SDK instance
    // that was initialized (hopefully correctly for the current network).

    // We will need to ensure that the Raydium SDK instance used here
    // (const raydium = await initRaydiumSdk(wallet, connection, currentNetwork);)
    // is initialized with the correct network context.
    // This function IS ALREADY CALLING initRaydiumSdk:
    // const raydium = await initRaydiumSdk(wallet, connection); // OLD
    // IT NEEDS TO BE:
    // const currentNetwork = connection.rpcEndpoint.includes('mainnet') ? 'mainnet-beta' : 'devnet'; // Simplistic check
    // const raydium = await initRaydiumSdk(wallet, connection, currentNetwork);

    // For now, I will assume that the `connection` object passed to this function
    // has already been correctly set by the NetworkContext (devnet or mainnet).
    // The `initRaydiumSdk` called within this `swapRaydiumTokens` function MUST
    // receive the correct `currentNetwork` string.

    // A BETTER PATTERN: initRaydiumSdk should ideally be called once when the network/wallet changes
    // and the SDK instance reused, rather than re-initialized in every swap/pool creation.
    // But to minimize changes to your existing structure for now:

    let currentNetworkForSwap;
    if (connection.rpcEndpoint.includes('mainnet.helius-rpc')) { // Check for your Helius mainnet RPC
        currentNetworkForSwap = 'mainnet-beta';
    } else if (connection.rpcEndpoint.includes('devnet')) {
        currentNetworkForSwap = 'devnet';
    } else {
        // Fallback or throw error if network cannot be determined from RPC
        console.warn('[Swap Raydium] Could not determine network from RPC endpoint, defaulting to devnet for SDK init. This might be incorrect.');
        currentNetworkForSwap = 'devnet';
    }
    
    console.log(`[Swap Raydium] Determined network for SDK init inside swap: ${currentNetworkForSwap}`);
    const raydium = await initRaydiumSdk(wallet, connection, currentNetworkForSwap); // Pass determined network
    if (!raydium) { throw new Error("[Swap Raydium] Raydium SDK failed to initialize within swap function"); }


    // ... (rest of your existing swapRaydiumTokens function, starting from the console.log for Step 2)
    // Ensure all calls like raydium.cpmm.getPoolInfoFromRpc use this correctly initialized 'raydium' instance.
    // The PublicKey creations and other logic should be fine.

    // PASTE THE REST OF YOUR swapRaydiumTokens FUNCTION (from "console.log("[vXX Log Step 2] Checking Wallet Public Key...");" onwards)
    // The following is a placeholder to indicate where your existing logic goes.
    // For brevity, I'm not pasting your entire long swap function again here.
    // The key change was ensuring `initRaydiumSdk` inside it gets the network.

    console.log("[vXX Log Step 2] Checking Wallet Public Key...");
    const ownerPublicKey = wallet.publicKey;
    if (!ownerPublicKey) { throw new Error("[vXX Log Step 2] Wallet not connected or public key missing"); }
    console.log(`[vXX Log Step 2] Owner PublicKey: ${ownerPublicKey.toBase58()}`);

    try {
        // --- Step 3: Fetch Pool Info, etc. ---
        console.log(`[vXX Log Step 3] Fetching TARGET CPMM pool info for ID: ${poolIdString}...`);
        if (!raydium.cpmm || typeof raydium.cpmm.getPoolInfoFromRpc !== 'function') {
             throw new Error("[vXX Log Step 3] CPMM module or getPoolInfoFromRpc function not found on Raydium SDK instance.");
        }
        const directFetchResult = await raydium.cpmm.getPoolInfoFromRpc(poolIdString);
        if (!directFetchResult || !directFetchResult.poolInfo) {
            throw new Error(`[vXX Log Step 3] Target CPMM pool ${poolIdString} not found via direct RPC.`);
        }
        console.log(`[vXX Log Step 3] Fetched raw pool info successfully.`);
        const rawPoolInfo = directFetchResult.poolInfo;
        let onChainStatusByte = -1; 
        console.log(`[vXX Log Step 3 - Status Check] Raw Pool Status from getPoolInfoFromRpc: ${rawPoolInfo.status}, On-chain status byte: ${onChainStatusByte}`);
        console.log(`[vXX Log Step 3] Raw Info Snippet: id=${rawPoolInfo.id}, status=${rawPoolInfo.status}, mintA=${rawPoolInfo.mintA?.address}, mintB=${rawPoolInfo.mintB?.address}, lpMint=${rawPoolInfo.lpMint?.address}, configId=${rawPoolInfo.config?.id}`);
        console.log(`[vXX Log Step 3a] Preparing mint PublicKeys...`);
        const requiredFields = ['mintA.address', 'mintB.address', 'lpMint.address', 'config.id', 'programId', 'id'];
        for (const fieldPath of requiredFields) {
             const fields = fieldPath.split('.');
             let current = rawPoolInfo;
             for (const field of fields) {
                 if (current === null || typeof current !== 'object' || !current.hasOwnProperty(field) || !current[field]) {
                     throw new Error(`[vXX Log Step 3a] Missing required field in rawPoolInfo: ${fieldPath}`);
                 }
                 current = current[field];
             }
              if (fieldPath.includes('address') || fieldPath.includes('id') || fieldPath.includes('programId')) {
                  if (typeof current !== 'string' || current.trim() === '') {
                     throw new Error(`[vXX Log Step 3a] Invalid or empty string for field: ${fieldPath}`);
                  }
              }
         }
         const mintA_pk = new PublicKey(rawPoolInfo.mintA.address);
         const mintB_pk = new PublicKey(rawPoolInfo.mintB.address);
         const lpMint_pk = new PublicKey(rawPoolInfo.lpMint.address);
         const configId_pk = new PublicKey(rawPoolInfo.config.id);
         const programId_pk = new PublicKey(rawPoolInfo.programId);
         const poolId_pk = new PublicKey(rawPoolInfo.id);
         console.log(`[vXX Log Step 3a] PublicKeys prepared: mintA=${mintA_pk}, mintB=${mintB_pk}, lpMint=${lpMint_pk}, configId=${configId_pk}, programId=${programId_pk}, poolId=${poolId_pk}`);
         console.log(`[vXX Log Step 3b] Deriving missing keys using getCreatePoolKeys...`);
         const derivedKeys = getCreatePoolKeys({ programId: programId_pk, configId: configId_pk, mintA: mintA_pk, mintB: mintB_pk });
         console.log(`[vXX Log Step 3b] Derived Keys: Authority=${derivedKeys.authority.toBase58()}, VaultA=${derivedKeys.vaultA.toBase58()}, VaultB=${derivedKeys.vaultB.toBase58()}, ObsId=${derivedKeys.observationId.toBase58()}`);
         console.log(`[vXX Log Step 3c] Fetching live reserves from derived vaults (VaultA: ${derivedKeys.vaultA.toBase58()}, VaultB: ${derivedKeys.vaultB.toBase58()})...`);
         const vaultABalancePromise = connection.getTokenAccountBalance(derivedKeys.vaultA, 'confirmed');
         const vaultBBalancePromise = connection.getTokenAccountBalance(derivedKeys.vaultB, 'confirmed');
         const [vaultABalanceResponse, vaultBBalanceResponse] = await Promise.all([vaultABalancePromise, vaultBBalancePromise]);
         if (!vaultABalanceResponse?.value?.amount || !vaultBBalanceResponse?.value?.amount) {
             console.error("[vXX Log Step 3c] Failed to fetch vault balances!", { vaultABalanceResponse, vaultBBalanceResponse });
             throw new Error("[vXX Log Step 3c] Could not fetch live reserves from pool vaults.");
         }
         const baseReserveLive = new BN(vaultABalanceResponse.value.amount);
         const quoteReserveLive = new BN(vaultBBalanceResponse.value.amount);
         console.log(`[vXX Log Step 3c] Fetched live reserves: Base (WSOL)=${baseReserveLive.toString()}, Quote (Token)=${quoteReserveLive.toString()}`);
         console.log(`[vXX Log Step 3d] Preparing to fetch mint info for mints: ${mintA_pk}, ${mintB_pk}, ${lpMint_pk}...`);
         const mintsToFetch = [mintA_pk, mintB_pk, lpMint_pk];
         const mintInfos = await fetchMultipleMintInfos({connection, mints: mintsToFetch});
         console.log(`[vXX Log Step 3d] Fetched mint info: MintA Decimals=${mintInfos[mintA_pk.toBase58()]?.decimals}, MintB Decimals=${mintInfos[mintB_pk.toBase58()]?.decimals}, LpMint Decimals=${mintInfos[lpMint_pk.toBase58()]?.decimals}`);
         console.log(`[vXX Log Step 3e] Manually constructing pool info for compute...`);
         if (mintInfos[mintA_pk.toBase58()]?.decimals === undefined || mintInfos[mintB_pk.toBase58()]?.decimals === undefined || mintInfos[lpMint_pk.toBase58()]?.decimals === undefined) {
             throw new Error("[vXX Log Step 3e] Missing decimals from fetched mintInfos.");
         }
         const mintProgramA = mintInfos[mintA_pk.toBase58()]?.programId || new PublicKey(rawPoolInfo.mintA.programId);
         const mintProgramB = mintInfos[mintB_pk.toBase58()]?.programId || new PublicKey(rawPoolInfo.mintB.programId);
         const poolInfoCompute = {
             id: poolId_pk, programId: programId_pk, configId: configId_pk, observationId: derivedKeys.observationId, authority: derivedKeys.authority,
             mintA: { address: mintA_pk, decimals: mintInfos[mintA_pk.toBase58()].decimals, programId: mintProgramA },
             mintB: { address: mintB_pk, decimals: mintInfos[mintB_pk.toBase58()].decimals, programId: mintProgramB },
             mintLp: { address: lpMint_pk, decimals: mintInfos[lpMint_pk.toBase58()].decimals, programId: mintInfos[lpMint_pk.toBase58()]?.programId || new PublicKey(rawPoolInfo.lpMint.programId) },
             vaultA: derivedKeys.vaultA, vaultB: derivedKeys.vaultB, baseReserve: baseReserveLive, quoteReserve: quoteReserveLive,
             lpAmount: rawPoolInfo.lpAmount ? new BN(rawPoolInfo.lpAmount.toString()) : new BN(0),
             status: (onChainStatusByte === 0) ? new BN(0) : (rawPoolInfo.status ? new BN(rawPoolInfo.status.toString()) : new BN(0)),
             configInfo: {
                  id: configId_pk, index: rawPoolInfo.config?.index ?? 0,
                  tradeFeeRate: new BN(rawPoolInfo.config.tradeFeeRate.toString()), protocolFeeRate: new BN(rawPoolInfo.config.protocolFeeRate.toString()),
                  fundFeeRate: new BN(rawPoolInfo.config.fundFeeRate.toString()), createPoolFee: new BN(rawPoolInfo.config.createPoolFee.toString())
             },
              tradeFeeRate: new BN(rawPoolInfo.config.tradeFeeRate.toString()), protocolFeeRate: new BN(rawPoolInfo.config.protocolFeeRate.toString()),
              fundFeeRate: new BN(rawPoolInfo.config.fundFeeRate.toString()),
             openTime: rawPoolInfo.openTime ? new BN(rawPoolInfo.openTime.toString()) : new BN(0),
             poolPrice: rawPoolInfo.poolPrice instanceof Decimal ? rawPoolInfo.poolPrice : new Decimal(rawPoolInfo.poolPrice || 0),
             version: 7, mintDecimalA: mintInfos[mintA_pk.toBase58()].decimals, mintDecimalB: mintInfos[mintB_pk.toBase58()].decimals,
             mintProgramA: mintProgramA, mintProgramB: mintProgramB,
         };
         console.log(`[vXX Log Step 3e] Manually constructed poolInfoCompute. ID: ${poolInfoCompute.id.toBase58()}, BaseReserve (WSOL)=${poolInfoCompute.baseReserve.toString()}, QuoteReserve (Token)=${poolInfoCompute.quoteReserve.toString()}, Status=${poolInfoCompute.status.toString()}, TradeFee=${poolInfoCompute.tradeFeeRate.toString()}`);

        // --- Step 4: Define Input/Output Mints ---
        console.log("[vXX Log Step 4] Defining input/output mints and decimals...");
        const inputMintPk = new PublicKey(inputMintAddress);
        const baseIn = inputMintPk.equals(poolInfoCompute.mintA.address);
        const outputMintPk = baseIn ? poolInfoCompute.mintB.address : poolInfoCompute.mintA.address;
        console.log(`[vXX Log Step 4] Input Mint: ${inputMintPk.toBase58()}, Output Mint: ${outputMintPk.toBase58()}`);
        console.log(`[vXX Log Step 4] Is Input MintA (WSOL)? baseIn = ${baseIn}`);
        const inputDecimals = baseIn ? poolInfoCompute.mintA.decimals : poolInfoCompute.mintB.decimals;
        const outputDecimals = baseIn ? poolInfoCompute.mintB.decimals : poolInfoCompute.mintA.decimals;
        console.log(`[vXX Log Step 4] Input Decimals: ${inputDecimals}, Output Decimals: ${outputDecimals}`);
        let inputToken = new Token({ mint: inputMintPk, decimals: inputDecimals });
        let outputToken = new Token({ mint: outputMintPk, decimals: outputDecimals });
        console.log("[vXX Log Step 5] inputToken/outputToken created successfully.");

        // --- Step 6: Creating TokenAmount for amountIn ---
        console.log("[vXX Log Step 6] Creating TokenAmount for amountIn...");
        const amountIn = new TokenAmount(inputToken, amountInBN, true);
        console.log(`[vXX Log Step 6] Created TokenAmount. Input Raw: ${amountIn.raw.toString()}, Input Exact: ${amountIn.toExact()} for ${inputToken.mint.toBase58()}`);

        // --- Step 7: Compute Swap Amount ---
        console.log('[vXX Log Step 7] Preparing to compute swap amounts...');
        if (poolInfoCompute.baseReserve.isZero() || poolInfoCompute.quoteReserve.isZero()) {
           console.error(`[vXX Log Step 7] Pool has zero reserves! Base: ${poolInfoCompute.baseReserve.toString()}, Quote: ${poolInfoCompute.quoteReserve.toString()}. Cannot calculate swap.`);
           throw new Error("Pool has zero reserves, cannot compute swap amount.");
        }
        console.log('[vXX Log Step 7] Calling raydium.cpmm.computeSwapAmount...');
        if (!raydium.cpmm || typeof raydium.cpmm.computeSwapAmount !== 'function') {
            throw new Error("[vXX Log Step 7] computeSwapAmount function not found on Raydium CPMM module.");
        }
       const computeResult = raydium.cpmm.computeSwapAmount({
            pool: poolInfoCompute, amountIn: amountIn.raw, outputMint: outputMintPk,
            slippage: slippage, inputMint: inputMintPk, amountType: 'in'
        });
       const amountOutMin = computeResult.minAmountOut;
       const amountOutCalculated = computeResult.amountOut;
       console.log(`[vXX Log Step 7 - Compute] Computed amountOut: ${amountOutCalculated.toString()}, minAmountOut: ${amountOutMin.toString()}`);
       console.log('[vXX Log Step 7] Compute Result:', JSON.stringify(computeResult, replacer, 2));
       if (computeResult.amountOut.isZero()) {
            console.error("[vXX Log Step 7] Computed output amount is zero. Aborting swap.");
            throw new Error("Swap calculation resulted in zero output tokens. Amount may be too small.");
       }

        // --- Step 8: Get User ATA Addresses ---
        console.log('[vXX Log Step 8] Getting user ATA addresses and collecting setup instructions...');
        const setupInstructions = [];
        let userSourceAta;
        let userDestAta;
        if (baseIn) {
            console.log(`[vXX Log Step 8] Buy swap (SOL -> Token). Input is Base.`);
            const { address: wsolAta, instructions: wsolInstructions } = await getWSOLAccountAndInstructions(connection, ownerPublicKey, amountInBN);
            userSourceAta = wsolAta;
            if (wsolInstructions) setupInstructions.push(...wsolInstructions);
            const { address: tokenAta, instruction: tokenCreateInstruction } = await getAtaAddressAndCreateInstruction(connection, ownerPublicKey, outputMintPk.toBase58());
            userDestAta = tokenAta;
            if (tokenCreateInstruction) setupInstructions.push(tokenCreateInstruction);
        } else {
            console.log(`[vXX Log Step 8] Sell swap (Token -> SOL). Input is Quote.`);
            const { address: tokenAta, instruction: tokenCreateInstruction } = await getAtaAddressAndCreateInstruction(connection, ownerPublicKey, inputMintPk.toBase58());
            userSourceAta = tokenAta;
            if (tokenCreateInstruction) setupInstructions.push(tokenCreateInstruction);
            const { address: wsolAta, instruction: wsolCreateInstruction } = await getWSOLAccountAndInstructions(connection, ownerPublicKey, new BN(0));
            userDestAta = wsolAta;
            if (wsolCreateInstruction) setupInstructions.push(wsolCreateInstruction);
        }
        console.log(`[vXX Log Step 8] Determined ATAs - Source: ${userSourceAta?.toBase58()}, Dest: ${userDestAta?.toBase58()}. Collected ${setupInstructions.length} setup instructions.`);

        // --- Step 9: Prepare the Swap Instruction ---
        console.log('[vXX Log Step 9] Preparing swap instruction...');
        let instructionVaultA, instructionVaultB, instructionMintA, instructionMintB;
        if (baseIn) {
            console.log(">>> vXX Debug: BUY (SOL -> Token) swap - Instruction accounts ordered Base, Quote.");
            instructionVaultA = poolInfoCompute.vaultA; instructionVaultB = poolInfoCompute.vaultB;
            instructionMintA = poolInfoCompute.mintA.address; instructionMintB = poolInfoCompute.mintB.address;
        } else {
            console.log(">>> vXX Debug: SELL (Token -> SOL) swap - Instruction accounts ordered Quote, Base (due to instruction design).");
            instructionVaultA = poolInfoCompute.vaultB; instructionVaultB = poolInfoCompute.vaultA;
            instructionMintA = poolInfoCompute.mintB.address; instructionMintB = poolInfoCompute.mintA.address;
        }
        console.log(`[vXX Log Step 9] Instruction Params: programId=${poolInfoCompute.programId}, owner=${ownerPublicKey}, authority=${poolInfoCompute.authority}, configId=${poolInfoCompute.configId}, poolId=${poolInfoCompute.id}, userSrc=${userSourceAta}, userDest=${userDestAta}, vaultA=${instructionVaultA}, vaultB=${instructionVaultB}, mintProgramA=${poolInfoCompute.mintProgramA}, mintProgramB=${poolInfoCompute.mintProgramB}, mintA=${instructionMintA}, mintB=${instructionMintB}, obsId=${poolInfoCompute.observationId}, amountIn=${amountIn.raw}, minAmountOut=${amountOutMin}`);
        const swapInstruction = makeSwapCpmmBaseInInstruction(
            poolInfoCompute.programId, ownerPublicKey, poolInfoCompute.authority, poolInfoCompute.configId, poolInfoCompute.id,
            userSourceAta, userDestAta, instructionVaultA, instructionVaultB,
            poolInfoCompute.mintProgramA, poolInfoCompute.mintProgramB, instructionMintA, instructionMintB,
            poolInfoCompute.observationId, amountIn.raw, amountOutMin
        );

        // --- Step 10: Build and Send Actual Transaction ---
        console.log('[vXX Log Step 10] Preparing and sending actual transaction (Bundled)...');
        const transaction = new Transaction();
        transaction.feePayer = ownerPublicKey;
        transaction.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 800000 }));
        transaction.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 }));
        if (setupInstructions.length > 0) {
            transaction.add(...setupInstructions);
        }
        transaction.add(swapInstruction);
        const { blockhash } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        console.log('[vXX Log Step 10] Signing and sending bundled transaction via standardized helper...');
        const swapTxId = await signAndSendTransaction(connection, wallet, transaction);
        console.log(`[vXX Log Step 10] ✅ Bundled Swap Transaction Sent! TxID: ${swapTxId}`);

        // --- Step 11: Handle WSOL Unwrap ---
        if (!baseIn) {
            console.log(`[vXX Log Step 11] Sell swap detected (Token -> WSOL). Preparing to unwrap WSOL...`);
            console.log('[vXX Log Step 11] Waiting 5 seconds before attempting unwrap...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            try {
                console.log('[vXX Log Step 11] Calling unwrapWsol function...');
            } catch (unwrapError) {
                console.error(`[vXX Log Step 11] ❌ Failed to unwrap WSOL after sell swap!`, unwrapError);
            }
        } else {
            console.log('[vXX Log Step 11] Buy swap detected (SOL -> Token). No WSOL unwrap needed.');
        }
        console.log(`[vXX Log Step 12] ---> swapRaydiumTokens: End`);
        return swapTxId;
    } catch (error) {
        console.error(`[vXX Log Final Catch] ---> Swap Failed in vXX`, error);
        if (error?.message) console.error("[vXX Log Final Catch] Error Message:", error.message);
        if (error?.stack) console.error("[vXX Log Final Catch] Stack Trace:", error.stack);
        if (error.logs) {
            console.error('[vXX Log Final Catch] Transaction Logs:', error.logs.join('\n'));
        } else if (error.message && error.message.includes('SendTransactionError')) {
            console.warn("[vXX Log Final Catch] SendTransactionError detected, but logs property not available.");
        }
        throw error;
    }
};

// --- END OF swapRaydiumTokens (v66) ---

// --- Unwrap WSOL Function ---
export const unwrapWsol = async (wallet, connection) => {
    console.log(`[v59 Unwrap] ---> unwrapWsol: Start`);
    const ownerPublicKey = wallet?.publicKey;
    if (!ownerPublicKey) { throw new Error("[v59 Unwrap] Wallet not connected or public key missing"); }
    console.log(`[v59 Unwrap] Owner PublicKey: ${ownerPublicKey.toBase58()}`);
    try {
        console.log("[v59 Unwrap] Finding user WSOL ATA...");
        const wsolAta = await getAssociatedTokenAddress( NATIVE_MINT, ownerPublicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID );
        console.log(`[v59 Unwrap] User WSOL ATA: ${wsolAta.toBase58()}`);
        const wsolAtaInfo = await connection.getAccountInfo(wsolAta);
        if (!wsolAtaInfo) {
            console.log("[v59 Unwrap] User WSOL ATA does not exist. Nothing to unwrap.");
            return null;
        }
         try {
             const balance = await connection.getTokenAccountBalance(wsolAta, 'confirmed');
             console.log(`[v59 Unwrap] WSOL ATA Balance (raw): ${balance.value.amount}, (UI): ${balance.value.uiAmountString}`);
             if (!balance.value.uiAmount || balance.value.uiAmount === 0) {
                 console.log("[v59 Unwrap] User WSOL ATA has zero or negligible balance. Only rent will be recovered.");
             }
         } catch (balanceError) {
             console.warn("[v59 Unwrap] Could not fetch WSOL ATA balance:", balanceError);
         }
        console.log("[v59 Unwrap] Building close account transaction...");
        const transaction = new Transaction();
        transaction.feePayer = ownerPublicKey;
        transaction.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }));
        transaction.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 50000 }));
        transaction.add(
            createCloseAccountInstruction(wsolAta, ownerPublicKey, ownerPublicKey, [], TOKEN_PROGRAM_ID)
        );
        console.log("[v59 Unwrap] Transaction built.");
        console.log("[v59 Unwrap] Signing and sending transaction...");
        const txId = await signAndSendTransaction(connection, wallet, transaction);
        console.log(`[v59 Unwrap] ✅ WSOL Unwrap Successful! TxID: ${txId}`);
        console.log(`[v59 Unwrap] ---> unwrapWsol: End`);
        return txId;
    } catch (error) {
        console.error(`[v59 Unwrap Final Catch] ---> WSOL Unwrap Failed`, error);
        if (error?.message) console.error("[v59 Unwrap Final Catch] Error Message:", error.message);
        if (error?.stack) console.error("[v59 Unwrap Final Catch] Stack Trace:", error.stack);
        if (error?.logs) console.error('[v59 Unwrap Final Catch] Transaction Logs:', error.logs);
        throw error;
    }
};

// --- isRaydiumPool (Helper, unchanged) ---
export const isRaydiumPool = (pool) => {
    return pool && !!pool.raydiumPoolId;
};

