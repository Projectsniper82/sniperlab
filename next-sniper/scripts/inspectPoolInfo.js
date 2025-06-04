import { Connection } from '@solana/web3.js';
import { Raydium } from '@raydium-io/raydium-sdk-v2';

(async () => {
  try {
    // Initialize connection
    const connection = new Connection('https://api.mainnet-beta.solana.com');

    // Initialize Raydium SDK
    const raydium = await Raydium.load({ connection });

    // Replace with your actual pool ID
    const poolId = '9CTxEyRStwTKLfVTS6c7rfQc7PTxY42YPdQcrHTv53Ao';

    // Fetch pool information
    const poolInfo = await raydium.api.fetchPoolById({ ids: poolId });

    // Log the structure of poolInfo
    console.log('Fetched poolInfo structure:', JSON.stringify(poolInfo, null, 2));
  } catch (error) {
    console.error('Error fetching poolInfo:', error);
  }
})();
;
