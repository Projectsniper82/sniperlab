// src/utils/jupiterSwapUtil.ts
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import BN from 'bn.js';

interface JupiterSwapParams {
    wallet: any;
    connection: Connection;
    inputMint: PublicKey;
    outputMint: PublicKey;
    amount: BN; // Amount in lamports
    slippageBps: number; // Slippage in basis points (e.g., 50 for 0.5%)
    priorityFeeMicroLamports?: number; // Optional priority fee
}

export async function executeJupiterSwap({
    wallet,
    connection,
    inputMint,
    outputMint,
    amount,
    slippageBps,
    priorityFeeMicroLamports = 0, // Default to 0 if not provided
}: JupiterSwapParams): Promise<string> {
    console.log('[executeJupiterSwap] Starting swap via Jupiter Aggregator...');
    
    const userPublicKey = wallet.publicKey;
    if (!userPublicKey) throw new Error("Wallet not connected.");

    // 1. Get Quote from Jupiter API
    console.log(`[executeJupiterSwap] Fetching quote...`);
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.toBase58()}&outputMint=${outputMint.toBase58()}&amount=${amount.toString()}&slippageBps=${slippageBps}`;
    
    const quoteResponse = await (await fetch(quoteUrl)).json();
    if (!quoteResponse || quoteResponse.error) {
        throw new Error(`Failed to get quote from Jupiter: ${quoteResponse?.error || 'No route found'}`);
    }

    // 2. Get Swap Transaction from Jupiter API
    console.log("[executeJupiterSwap] Fetching swap transaction...");
    const swapResponse = await (await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: userPublicKey.toBase58(),
            wrapAndUnwrapSol: true,
            computeUnitPriceMicroLamports: priorityFeeMicroLamports,
        })
    })).json();

    if (!swapResponse || !swapResponse.swapTransaction) {
        throw new Error(`Failed to get transaction from Jupiter: ${swapResponse?.error || 'Unknown error'}`);
    }
    const swapTransactionB64 = swapResponse.swapTransaction;

    // 3. Deserialize, Sign, and Send
    const swapTransactionBuf = Buffer.from(swapTransactionB64, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    
    console.log("[executeJupiterSwap] Requesting wallet signature...");
    const signedTx = await wallet.signTransaction(transaction);

    console.log("[executeJupiterSwap] Sending raw transaction...");
    const txSignature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        maxRetries: 5,
    });

    console.log("[executeJupiterSwap] Confirming transaction...");
    const latest = await connection.getLatestBlockhashAndContext('confirmed');
    await connection.confirmTransaction({
        signature: txSignature,
        blockhash: latest.value.blockhash,
        lastValidBlockHeight: latest.value.lastValidBlockHeight,
    }, 'confirmed');

    console.log(`[executeJupiterSwap] --- JUPITER SWAP SUCCESSFUL! --- Signature: ${txSignature}`);
    return txSignature;
}