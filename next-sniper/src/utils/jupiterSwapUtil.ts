// src/utils/jupiterSwapUtil.ts
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import BN from 'bn.js';

// PASTE THIS NEW CODE IN ITS PLACE
interface JupiterSwapParams {
    wallet: any;
    connection: Connection;
    inputMint: PublicKey;
    outputMint: PublicKey;
    amount: BN;
    slippageBps: number;
    onlyGetQuote?: boolean;
    priorityFeeMicroLamports?: number;
    asLegacyTransaction?: boolean;
}

export async function executeJupiterSwap({
    wallet,
    connection,
    inputMint,
    outputMint,
    amount,
    slippageBps,
    onlyGetQuote, // <-- THIS LINE WAS MISSING
    priorityFeeMicroLamports = 1000,
}: JupiterSwapParams): Promise<any> {
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
    if (onlyGetQuote) {
        console.log('[executeJupiterSwap] "onlyGetQuote" is true. Returning quote now.');
        return quoteResponse;
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
            computeUnitPriceMicroLamports: priorityFeeMicroLamports || 1000,
            asLegacyTransaction: true,
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