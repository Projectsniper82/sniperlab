// src/utils/quoteFetcher.ts
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

/**
 * Fetches a quote from Jupiter's v6 API.
 * This function is used to check for liquidity and get a price estimate for a swap.
 *
 * @param inputMint The public key of the input token mint.
 * @param outputMint The public key of the output token mint.
 * @param amount The amount of the input token to swap, in its smallest unit (lamports).
 * @returns The JSON response from the Jupiter API, or null if an error occurs.
 */
export async function getJupiterQuote(
    inputMint: PublicKey, 
    outputMint: PublicKey, 
    amount: BN
) {
    console.log(`[getJupiterQuote] Fetching quote for ${inputMint.toBase58()} -> ${outputMint.toBase58()}`);

    try {
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.toBase58()}&outputMint=${outputMint.toBase58()}&amount=${amount.toString()}&onlyDirectRoutes=false&slippageBps=50`;

        const response = await fetch(quoteUrl);
        if (!response.ok) {
            // Log the error response from the API for better debugging
            const errorBody = await response.text();
            console.warn(`[getJupiterQuote] Jupiter API returned an error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
            return null;
        }

        const quoteResponse = await response.json();

        if (quoteResponse.error) {
            console.warn(`[getJupiterQuote] Jupiter API logical error: ${quoteResponse.error}`);
            return null; // Return null if no route is found or for other specific errors
        }

        return quoteResponse;

    } catch (e) {
        console.error("[getJupiterQuote] An unexpected error occurred while fetching the quote:", e);
        return null;
    }
}