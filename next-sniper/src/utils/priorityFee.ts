// src/utils/priorityFee.ts
import { Connection } from '@solana/web3.js';

/**
 * Fetches recent priority fees from the network and returns a suggested fee.
 * @param connection A Solana Connection object.
 * @returns A suggested priority fee in micro-lamports, or a default value.
 */
export async function getOptimalPriorityFee(connection: Connection): Promise<number> {
    try {
        // Fetch the 150 most recent priority fees
        const priorityFees = await connection.getRecentPrioritizationFees();

        if (priorityFees.length === 0) {
            console.log("[Priority Fee] No recent priority fees found. Using default.");
            return 1000; // Return a safe default if no fees are found
        }

        // Sort fees in ascending order
        const sortedFees = priorityFees.sort((a, b) => a.prioritizationFee - b.prioritizationFee);
        
        // Find the fee at the 50th percentile (the median)
        const medianFee = sortedFees[Math.floor(sortedFees.length / 2)].prioritizationFee;

        // We'll use the median fee to be competitive without overpaying.
        // Let's add a small buffer to it just in case.
        const suggestedFee = Math.ceil(medianFee * 1.2); 

        console.log(`[Priority Fee] Median fee: ${medianFee}, Suggested fee: ${suggestedFee}`);
        
        return suggestedFee;

    } catch (error) {
        console.error("[Priority Fee] Error fetching priority fees:", error);
        // Fallback to a safe default in case of an error
        return 1000;
    }
}