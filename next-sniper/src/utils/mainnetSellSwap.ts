// src/utils/mainnetSellSwap.ts
import {
    Connection,
    PublicKey,
    VersionedTransaction,
} from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'; // For decoding base64 transaction

// We no longer need most of the other local imports for the swap itself,
// as Jupiter handles the logic. We only need the wallet and connection.

/**
 * [REWRITTEN] Orchestrates a sell swap from SPL token → SOL using the Jupiter Aggregator API.
 * This is more robust and finds the best route for the swap.
 *
 * @param wallet                 - Your wallet adapter (must have `publicKey` and `signTransaction`).
 * @param connection             - A confirmed Connection instance pointing to mainnet.
 * @param sellAmountTokenFloat   - How many SPL tokens (in human units) you want to sell.
 * @param slippageBps            - Slippage tolerance in basis points (e.g., 50 for 0.5%).
 * @param inputTokenActualMint   - The string of the SPL token mint you are selling.
 *
 * @returns The confirmed transaction signature once the swap succeeds.
 * @throws If any step fails (API errors, signing rejected, on-chain error, etc.).
 */
export async function mainnetSellSwap(
    wallet: any, 
    connection: Connection,
    // selectedPoolFromFinder is no longer needed as Jupiter finds the best pool
    selectedPoolFromFinder: any | null, 
    sellAmountTokenFloat: number, 
    slippagePercent: number, // We'll convert this to BPS for Jupiter
    inputTokenActualMint: string 
): Promise<string> {
    console.log('[mainnetSellSwap] --- Starting Sell Swap via Jupiter Aggregator ---');

    // 1) Basic parameter validation
    if (sellAmountTokenFloat <= 0) {
        throw new Error('Sell amount must be greater than zero.');
    }
    if (!inputTokenActualMint) {
        throw new Error('Input token mint address is required.');
    }

    const userPublicKey = wallet.publicKey;
    if (!userPublicKey) {
        throw new Error("Wallet not connected.");
    }

    // Get input token info to calculate amount in lamports
    const inputToken = new PublicKey(inputTokenActualMint);
    const tokenInfo = await connection.getParsedAccountInfo(inputToken);
    if (!tokenInfo.value || !('parsed' in tokenInfo.value.data)) {
        throw new Error("Could not fetch token info to determine decimals.");
    }
    const inputTokenDecimals = tokenInfo.value.data.parsed.info.decimals;

    const amountInLamports = new BN(
        new Decimal(sellAmountTokenFloat)
          .mul(new Decimal(10).pow(inputTokenDecimals))
          .toFixed(0)
    );
    
    // Convert slippage from percent to basis points (BPS) for Jupiter
    const slippageBps = slippagePercent * 100;

    console.log(`[mainnetSellSwap] Payer: ${userPublicKey.toBase58()}`);
    console.log(`[mainnetSellSwap] Selling Token: ${inputToken.toBase58()}`);
    console.log(`[mainnetSellSwap] Sell Amount (lamports): ${amountInLamports.toString()}`);
    console.log(`[mainnetSellSwap] Slippage: ${slippagePercent}% (${slippageBps} BPS)`);


    // --- STEP 1: Get a Quote from Jupiter API ---
    console.log(`[mainnetSellSwap] Fetching quote from Jupiter...`);
    
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken.toBase58()}&outputMint=${NATIVE_MINT.toBase58()}&amount=${amountInLamports.toString()}&slippageBps=${slippageBps}`;
    const quoteResponse = await (await fetch(quoteUrl)).json();

    if (!quoteResponse || quoteResponse.error) {
        console.error("Jupiter Quote API Error:", quoteResponse?.error);
        throw new Error(`Failed to get quote from Jupiter: ${quoteResponse?.error || 'Unknown error'}`);
    }
    console.log(`[mainnetSellSwap] Quote received: Selling ${sellAmountTokenFloat} tokens for ~${new Decimal(quoteResponse.outAmount).div(10**9).toFixed(6)} SOL`);


    // --- STEP 2: Get the Swap Transaction from Jupiter API ---
    console.log("[mainnetSellSwap] Fetching swap transaction from Jupiter...");
    
    const swapResponse = await (await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: userPublicKey.toBase58(),
            wrapAndUnwrapSol: true, // This handles WSOL automatically
        })
    })).json();

    if (!swapResponse || !swapResponse.swapTransaction) {
        console.error("Jupiter Swap API Error:", swapResponse?.error);
        throw new Error(`Failed to get transaction from Jupiter: ${swapResponse?.error || 'Unknown error'}`);
    }
    const swapTransactionB64 = swapResponse.swapTransaction;


    // --- STEP 3: Deserialize, Sign, and Send the Transaction ---
    console.log("[mainnetSellSwap] Deserializing transaction...");
    const swapTransactionBuf = Buffer.from(swapTransactionB64, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log("[mainnetSellSwap] Transaction deserialized.");

    console.log("[mainnetSellSwap] Requesting wallet signature...");
    const signedTx = await wallet.signTransaction(transaction);
    if (!signedTx) {
        throw new Error('Sell transaction was not signed by the wallet.');
    }
    console.log("[mainnetSellSwap] Transaction signed.");

    console.log("[mainnetSellSwap] Sending raw transaction...");
    const txSignature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false, // It's good practice to let the RPC run preflight checks
        maxRetries: 5,
    });
    console.log(`[mainnetSellSwap] Transaction sent. Signature: ${txSignature}`);

    console.log("[mainnetSellSwap] Confirming transaction...");
    const latest = await connection.getLatestBlockhashAndContext('confirmed');
    const confirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: latest.value.blockhash,
        lastValidBlockHeight: latest.value.lastValidBlockHeight,
    }, 'confirmed');

    if (confirmation.value.err) {
        console.error('❌ Transaction confirmed with an error:', confirmation.value.err);
        throw new Error(`Sell transaction failed after sending: ${JSON.stringify(confirmation.value.err)}`);
    }

    console.log(`[mainnetSellSwap] --- JUPITER SELL SWAP SUCCESSFUL! --- Signature: ${txSignature}`);
    return txSignature;
}

