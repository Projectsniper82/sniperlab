// findDecoder.js (Complete, Corrected Version with Encrypted Key, Correct RPC, and Fixed Logging)
const fs = require('fs'); // May still be used by SDK dependencies
const { Connection, Keypair, PublicKey, VersionedTransaction } = require('@solana/web3.js');
const { Raydium, TxVersion } = require('@raydium-io/raydium-sdk-v2');
const BN = require('bn.js');
const crypto = require('crypto');
const readlineSync = require('readline-sync');
const path = require('path');

// Load .env.local first
try {
    require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
} catch (e) {
    console.warn("Warning: 'dotenv' package might be missing or .env.local not found. This is okay if .env.local doesn't exist yet for some reason, but script relies on it for secrets.", e.message);
}

// --- Configuration ---
// Correctly get the full RPC URL from the environment variable
const RPC_URL_FROM_ENV = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
// console.log(`DEBUG: Value of NEXT_PUBLIC_MAINNET_RPC_URL read from process.env: "${RPC_URL_FROM_ENV}"`); // Optional debug

// If RPC_URL_FROM_ENV has a value (i.e., your Helius URL from .env.local), use it directly.
// Otherwise, use the public fallback.
const RPC_URL = RPC_URL_FROM_ENV || 'https://api.mainnet-beta.solana.com';
// This log will now confirm which RPC URL is actually being used
console.log(`--- Initializing with RPC URL: ${RPC_URL} ---`);


// --- POOL DETAILS (from your version) ---
const TARGET_POOL_ID_STR = '9CTxEyRStwTKLfVTS6c7rfQc7PTxY42YPdQcrHTv53Ao';
const INPUT_MINT_PK = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL
const OUTPUT_MINT_PK = new PublicKey('h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood');

const SWAP_AMOUNT_IN_LAMPORTS_BN = new BN(10000000); // 0.01 SOL
const SLIPPAGE_PERCENTAGE = 0.05; // 5% slippage

async function loadAndDecryptKeypair() {
    console.log("Attempting to load keypair from encrypted .env.local...");
    const encryptedKeyHex = process.env.ENCRYPTED_PRIVATE_KEY_HEX;
    const saltHex = process.env.KEY_SALT_HEX;
    const ivHex = process.env.KEY_IV_HEX;
    const authTagHex = process.env.KEY_AUTHTAG_HEX;

    if (!encryptedKeyHex || !saltHex || !ivHex || !authTagHex) {
        console.error('Error: Encrypted key environment variables (ENCRYPTED_PRIVATE_KEY_HEX, KEY_SALT_HEX, KEY_IV_HEX, KEY_AUTHTAG_HEX) not found in .env.local');
        console.log("Please run encrypt-key.js first to set up your .env.local file with these values.");
        process.exit(1);
    }

    const password = readlineSync.question('Enter password to decrypt private key: ', {
        hideEchoBack: true,
        history: false
    });

    if (!password) {
        console.error("No password entered. Exiting.");
        process.exit(1);
    }

    try {
        const salt = Buffer.from(saltHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedKey = Buffer.from(encryptedKeyHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const derivedKey = crypto.pbkdf2Sync(password, salt, 200000, 32, 'sha512');

        const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
        decipher.setAuthTag(authTag);

        let decryptedPrivateKeyJsonArrayString = decipher.update(encryptedKey, null, 'utf8');
        decryptedPrivateKeyJsonArrayString += decipher.final('utf8');
        
        const secretKeyArray = JSON.parse(decryptedPrivateKeyJsonArrayString);
        if (!Array.isArray(secretKeyArray) || secretKeyArray.length !== 64) {
            throw new Error('Decrypted key is not a valid 64-byte array format.');
        }
        return Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

    } catch (error) {
        console.error('Decryption failed. Likely incorrect password or corrupted .env.local data.', error.message);
        process.exit(1);
    }
}

async function main() {
    console.log("--- Script Starting ---");

    let ownerKeypair = await loadAndDecryptKeypair(); 
    console.log(`Owner Public Key (from decrypted key): ${ownerKeypair.publicKey.toBase58()}`);

    console.log("\n--- 1. Initializing Connection & Raydium SDK ---");
    const connection = new Connection(RPC_URL, 'confirmed');

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

        const poolInfoForSDK_intermediate = sdkFetchedPoolData.poolInfo;
        const ammPoolKeysFromSDK_intermediate = sdkFetchedPoolData.poolKeys;

        console.log("\n--- DEBUG: poolInfoForSDK Structure (for TypeScript MySdkPoolInfo interface) ---");
        console.log(JSON.stringify(poolInfoForSDK_intermediate, (key, value) => {
            if (value && value._bn !== undefined) { return value.toString(); }
            if (value && value._isPublicKey) { return value.toBase58(); }
            if (value && value.constructor && value.constructor.name === 'PublicKey') { return value.toBase58(); }
            if (value && Buffer.isBuffer(value)) { return value.toString('hex'); }
            if (key === "fees" && typeof value === "object" && value !== null) {
                const feesFormatted = {};
                for (const feeKey in value) {
                    if (value[feeKey] && value[feeKey]._bn !== undefined) {
                        feesFormatted[feeKey] = value[feeKey].toString();
                    } else {
                        feesFormatted[feeKey] = value[feeKey];
                    }
                }
                return feesFormatted;
            }
            return value;
        }, 2));

        console.log("\n--- DEBUG: ammPoolKeysFromSDK Structure (for TypeScript MyAmmV4Keys interface) ---");
        console.log(JSON.stringify(ammPoolKeysFromSDK_intermediate, (key, value) => {
            if (value && value._isPublicKey) { return value.toBase58(); }
            if (value && value.constructor && value.constructor.name === 'PublicKey') { return value.toBase58(); }
            // For nested objects like mintA, mintB, mintLp within ammPoolKeysFromSDK,
            // which might contain PublicKey instances for their 'address' property:
            if (typeof value === 'object' && value !== null) {
                const cleanedValue = { ...value };
                for (const prop in cleanedValue) {
                    if (cleanedValue[prop] && cleanedValue[prop].constructor && cleanedValue[prop].constructor.name === 'PublicKey') {
                        cleanedValue[prop] = cleanedValue[prop].toBase58();
                    }
                }
                return cleanedValue;
            }
            return value;
        }, 2));

        if (!sdkFetchedPoolData || !sdkFetchedPoolData.poolInfo || !sdkFetchedPoolData.poolKeys) {
            console.error("SDK's getPoolInfoFromRpc did not return the expected structure (poolInfo or poolKeys missing).");
            return;
        }
        console.log(`\n  SDK poolInfo.mintA (Address: ${new PublicKey(sdkFetchedPoolData.poolInfo.mintA.address).toBase58()}, Decimals: ${sdkFetchedPoolData.poolInfo.mintA.decimals})`);
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
    const sdkMintA = new PublicKey(poolInfoForSDK.mintA.address);
    const sdkMintB = new PublicKey(poolInfoForSDK.mintB.address);

    if (!((sdkMintA.equals(INPUT_MINT_PK) && sdkMintB.equals(OUTPUT_MINT_PK)) ||
          (sdkMintB.equals(INPUT_MINT_PK) && sdkMintA.equals(OUTPUT_MINT_PK)))) {
        console.error("CRITICAL: Script's INPUT_MINT/OUTPUT_MINT do not match the SDK-parsed poolInfo.mintA/mintB for the new pool.");
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
            mintIn: INPUT_MINT_PK,
            mintOut: OUTPUT_MINT_PK,
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
    let swapPayload;
    try {
        swapPayload = await raydium.liquidity.swap({
            poolInfo: poolInfoForSDK,
            poolKeys: ammPoolKeysFromSDK,
            owner: ownerKeypair.publicKey,
            inputMint: INPUT_MINT_PK,
            amountIn: SWAP_AMOUNT_IN_LAMPORTS_BN,
            amountOut: amountOutResult.minAmountOut,
            fixedSide: 'in',
            txVersion: TxVersion.V0,
            computeBudgetConfig: { units: 400000, microLamports: 25000 },
            config: {
                associatedOnly: true,
                inputUseSolBalance: (INPUT_MINT_PK.toBase58() === 'So11111111111111111111111111111111111111112'),
                outputUseSolBalance: (OUTPUT_MINT_PK.toBase58() === 'So11111111111111111111111111111111111111112'),
            }
        });
        console.log("Swap payload constructed by SDK.");

        // --- MODIFIED DEBUG LOGGING FOR swapPayload ---
        console.log("\n--- DEBUG: swapPayload Key Properties (for TypeScript MyLiquiditySwapPayload interface) ---");
        if (swapPayload) {
            if (swapPayload.transaction) {
                console.log("  swapPayload.transaction: [Exists - VersionedTransaction Object]");
                console.log("    transaction.message.feePayer:", swapPayload.transaction.message.payerKey?.toBase58());
                console.log("    transaction.message.recentBlockhash:", swapPayload.transaction.message.recentBlockhash);
            } else {
                console.log("  swapPayload.transaction: [Not Found]");
            }
            if (swapPayload.signers && Array.isArray(swapPayload.signers)) {
                console.log("  swapPayload.signers: [Exists]");
                console.log("    Number of signers expected from SDK:", swapPayload.signers.length);
            } else {
                console.log("  swapPayload.signers: [Not Found or Not an Array]");
            }
        } else {
            console.log("  swapPayload: [Not Found or Undefined]");
        }
        // --- END MODIFIED DEBUG LOGGING ---

        if (swapPayload && swapPayload.transaction) { // Added null check for swapPayload
            console.log("Transaction object found in swapPayload.");
            const transaction = swapPayload.transaction;

            if (!transaction.message.recentBlockhash) {
                console.log("Fetching and setting recent blockhash for the transaction...");
                const { blockhash } = await connection.getLatestBlockhashAndContext('confirmed');
                transaction.message.recentBlockhash = blockhash;
                console.log(`Recent Blockhash set: ${transaction.message.recentBlockhash}`);
            } else {
                console.log(`Transaction already has a recentBlockhash: ${transaction.message.recentBlockhash}`);
            }
            
            console.log("Signing transaction with ownerKeypair (decrypted key)...");
            transaction.sign([ownerKeypair]);

            console.log("Simulating the transaction...");
            const simResult = await connection.simulateTransaction(transaction, {
                replaceRecentBlockhash: true, 
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
            console.error("Swap payload did not contain a direct 'transaction' object or swapPayload itself is undefined.");
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


