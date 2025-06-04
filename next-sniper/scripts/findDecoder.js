const fs = require('fs');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Raydium, TxVersion } = require('@raydium-io/raydium-sdk-v2');
const BN = require('bn.js');

// --- Configuration & Hardcoded Data ---
// ⚠️ ENSURE THIS PATH POINTS TO THE JSON KEYPAIR FILE FOR DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs
const WALLET_PATH = '/mnt/c/Users/shine/Documents/working_LP_v1/next-sniper/my_wallet_keypair.json';
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=f0617c48-43a7-4419-a7f9-9775f2226c75';

// --- NEW POOL DETAILS ---
const TARGET_POOL_ID_STR = '9CTxEyRStwTKLfVTS6c7rfQc7PTxY42YPdQcrHTv53Ao';
const INPUT_MINT_PK = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL - This is Mint B from your logs
const OUTPUT_MINT_PK = new PublicKey('h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood');   // This is Mint A from your logs
// --- END NEW POOL DETAILS ---

const SWAP_AMOUNT_IN_LAMPORTS_BN = new BN(10000000); // 0.01 SOL
const SLIPPAGE_PERCENTAGE = 0.05; // 5% slippage

async function main() {
    console.log("--- Script Starting ---");

    // 1. Initialize Connection, Wallet, Raydium SDK
    console.log("\n--- 1. Initializing ---");
    const connection = new Connection(RPC_URL, 'confirmed');
    console.log(`Connected to RPC: ${RPC_URL}`);

    let ownerKeypair;
    try {
        const secretKeyString = fs.readFileSync(WALLET_PATH, { encoding: 'utf8' });
        const secretKey = JSON.parse(secretKeyString);
        ownerKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`Owner Public Key (from ${WALLET_PATH}): ${ownerKeypair.publicKey.toBase58()}`);
        if (ownerKeypair.publicKey.toBase58() !== 'DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs') {
            console.warn("WARNING: Loaded wallet is NOT DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs. Please ensure WALLET_PATH is correct.");
        }
    } catch (error) {
        console.error(`Failed to load wallet from ${WALLET_PATH}:`, error.message);
        return;
    }

    const raydium = await Raydium.load({ connection, owner: ownerKeypair, blockhashCommitment: 'confirmed' });
    console.log("Raydium SDK Loaded.");
    if (!raydium.liquidity || !raydium.liquidity.getPoolInfoFromRpc) {
        console.error("Raydium SDK liquidity module or getPoolInfoFromRpc function not found.");
        return;
    }

    // 2. Define Target Pool and Mints
    console.log("\n--- 2. Defining Targets ---");
    const poolId = new PublicKey(TARGET_POOL_ID_STR);
    console.log(`Target Pool ID: ${poolId.toBase58()}`);
    console.log(`Input Mint (WSOL): ${INPUT_MINT_PK.toBase58()}`);
    console.log(`Output Mint: ${OUTPUT_MINT_PK.toBase58()}`);

    // 3. Fetch Parsed Pool Data using Raydium SDK
    console.log("\n--- 3. Fetching Parsed Pool Data via SDK ---");
    let sdkFetchedPoolData;
    try {
        sdkFetchedPoolData = await raydium.liquidity.getPoolInfoFromRpc({ poolId: poolId.toBase58() });
        console.log("Successfully fetched and parsed pool data via SDK.");

        if (!sdkFetchedPoolData || !sdkFetchedPoolData.poolInfo || !sdkFetchedPoolData.poolRpcData || !sdkFetchedPoolData.poolKeys) {
            console.error("SDK's getPoolInfoFromRpc did not return the expected structure.");
            return;
        }
        console.log("SDK poolInfo (structure for compute functions) received.");
        // Log some key fields for verification based on SDK's interpretation of MintA/MintB
        console.log(`  SDK poolInfo.mintA (Address: ${new PublicKey(sdkFetchedPoolData.poolInfo.mintA.address).toBase58()}, Decimals: ${sdkFetchedPoolData.poolInfo.mintA.decimals})`);
        console.log(`  SDK poolInfo.mintB (Address: ${new PublicKey(sdkFetchedPoolData.poolInfo.mintB.address).toBase58()}, Decimals: ${sdkFetchedPoolData.poolInfo.mintB.decimals})`);
        console.log(`  SDK poolInfo.baseReserve (corresponds to mintA): ${new BN(sdkFetchedPoolData.poolInfo.baseReserve).toString()}`);
        console.log(`  SDK poolInfo.quoteReserve (corresponds to mintB): ${new BN(sdkFetchedPoolData.poolInfo.quoteReserve).toString()}`);


    } catch (e) {
        console.error("Error during SDK pool data fetching/parsing:", e);
        console.error(e.stack);
        return;
    }

    const poolInfoForSDK = sdkFetchedPoolData.poolInfo;
    const ammPoolKeysFromSDK = sdkFetchedPoolData.poolKeys;

    console.log("\n--- 4. Verifying Mint Alignment with SDK Data ---");
    // This check ensures the INPUT_MINT_PK and OUTPUT_MINT_PK align with the pool's actual mintA and mintB
    const sdkMintA = new PublicKey(poolInfoForSDK.mintA.address);
    const sdkMintB = new PublicKey(poolInfoForSDK.mintB.address);

    if (!((sdkMintA.equals(INPUT_MINT_PK) && sdkMintB.equals(OUTPUT_MINT_PK)) ||
          (sdkMintB.equals(INPUT_MINT_PK) && sdkMintA.equals(OUTPUT_MINT_PK)))) {
        console.error("CRITICAL: Script's INPUT_MINT/OUTPUT_MINT do not match the SDK-parsed poolInfo.mintA/mintB for the new pool.");
        console.error(`  SDK Mint A: ${sdkMintA.toBase58()}, SDK Mint B: ${sdkMintB.toBase58()}`);
        console.error(`  Script Input Mint: ${INPUT_MINT_PK.toBase58()}, Script Output Mint: ${OUTPUT_MINT_PK.toBase58()}`);
        return;
    }
    console.log("Mint alignment verified with SDK's poolInfo for the new pool.");


    // 5. Compute Swap Amount Out
    console.log("\n--- 5. Computing Swap Amount Out (using SDK data) ---");
    let amountOutResult;
    try {
        console.log(`Calculating with SLIPPAGE_PERCENTAGE: ${SLIPPAGE_PERCENTAGE * 100}%`);
        amountOutResult = raydium.liquidity.computeAmountOut({
            poolInfo: poolInfoForSDK,
            amountIn: SWAP_AMOUNT_IN_LAMPORTS_BN,
            mintIn: INPUT_MINT_PK,     // This is WSOL
            mintOut: OUTPUT_MINT_PK,    // This is h5Nci...
            slippage: SLIPPAGE_PERCENTAGE,
        });
        console.log("Swap Amount Out Computed:");
        console.log(`  Expected Amount Out (lamports): ${amountOutResult.amountOut.toString()}`);
        console.log(`  Minimum Amount Out (lamports after ${SLIPPAGE_PERCENTAGE * 100}% slippage): ${amountOutResult.minAmountOut.toString()}`);
    } catch (e) {
        console.error("Error computing amount out:", e);
        console.error(e.stack);
        return;
    }

    // 6. Construct and Simulate Swap Transaction
    console.log("\n--- 6. Constructing and Simulating Swap Transaction ---");
    try {
        const swapPayload = await raydium.liquidity.swap({
            poolInfo: poolInfoForSDK,
            poolKeys: ammPoolKeysFromSDK,
            amountIn: SWAP_AMOUNT_IN_LAMPORTS_BN,
            amountOut: amountOutResult.minAmountOut,
            fixedSide: 'in',
            inputMint: INPUT_MINT_PK,
            txVersion: TxVersion.V0,
            computeBudgetConfig: { units: 400000, microLamports: 25000 },
            config: {
                associatedOnly: true,
                inputUseSolBalance: (INPUT_MINT_PK.toBase58() === 'So11111111111111111111111111111111111111112'),
                outputUseSolBalance: (OUTPUT_MINT_PK.toBase58() === 'So11111111111111111111111111111111111111112'),
            }
        });
        console.log("Swap payload constructed by SDK.");

        if (swapPayload.transaction) {
            console.log("Transaction object found in swapPayload.");
            const transaction = swapPayload.transaction;

            if (!transaction.message.recentBlockhash) {
                console.log("Fetching and setting recent blockhash for the transaction...");
                const recentBlockhashResult = await connection.getLatestBlockhashAndContext();
                transaction.message.recentBlockhash = recentBlockhashResult.value.blockhash;
                console.log(`Recent Blockhash set: ${transaction.message.recentBlockhash}`);
            } else {
                console.log(`Transaction already has a recentBlockhash: ${transaction.message.recentBlockhash}`);
            }

            console.log("Signing transaction...");
            if (swapPayload.signers && swapPayload.signers.length > 0) {
                const keypairSigners = swapPayload.signers.filter(s => s instanceof Keypair);
                if (keypairSigners.length > 0) {
                    transaction.sign(keypairSigners);
                    console.log(`Signed with ${keypairSigners.length} signer(s) from swapPayload.signers. First signer: ${keypairSigners[0].publicKey.toBase58()}`);
                } else if (transaction.signatures[0] && transaction.signatures[0].every(b => b === 0)) {
                    console.log("No explicit Keypair signers in swapPayload.signers and fee payer slot empty. Signing with ownerKeypair.");
                    transaction.sign([ownerKeypair]);
                } else {
                     console.log("Transaction might already be signed or doesn't require explicit keypair signers from payload for this step.");
                }
            } else {
                 console.log("No signers array in swapPayload. Signing with ownerKeypair.");
                 transaction.sign([ownerKeypair]);
            }
            if (transaction.signatures[0] && transaction.signatures[0].every(b => b === 0)) {
                console.log("Fee payer signature slot still empty. Explicitly signing with ownerKeypair.");
                transaction.sign([ownerKeypair]);
            }

            console.log("Simulating the transaction...");
            const simResult = await connection.simulateTransaction(transaction, {
                replaceRecentBlockhash: false,
                sigVerify: false,
                commitment: "confirmed",
            });

            if (simResult.value.err) {
                console.error(`❌ Simulation Failed for pool ${TARGET_POOL_ID_STR}:`, JSON.stringify(simResult.value.err));
                console.error(`Logs:`);
                (simResult.value.logs || []).forEach(log => console.error(`  ${log}`));
            } else {
                console.log(`🎉 Simulation Successful for pool ${TARGET_POOL_ID_STR}!`);
                console.log(`Logs:`);
                (simResult.value.logs || []).forEach(log => console.log(`  ${log}`));
                console.log(`Consumed CUs: ${simResult.value.unitsConsumed}`);
            }

        } else {
            console.error("Swap payload did not contain a direct 'transaction' object.");
            console.log("Full Swap Payload for debugging:", JSON.stringify(swapPayload, null, 2));
            if (typeof swapPayload.execute === 'function') {
                console.log("An 'execute' function is available. SDK might intend this for sending/simulation. Check docs.");
            }
        }
    } catch (e) {
        console.error("Error during swap transaction construction or simulation:", e);
        console.error(e.stack);
    }
    console.log("\n--- Script Finished ---");
}

main().catch(e => {
    console.error("Fatal error in main execution:", e);
    console.error(e.stack);
});
