// findDecoder.js (Modified to test specific dApp pool and parameters)
const fs = require('fs');
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
    console.warn("Warning: 'dotenv' package might be missing or .env.local not found.", e.message);
}

// --- Configuration ---
const RPC_URL_FROM_ENV = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
const RPC_URL = RPC_URL_FROM_ENV || 'https://api.mainnet-beta.solana.com';
console.log(`--- Initializing with RPC URL: ${RPC_URL} ---`);


// --- POOL DETAILS (Matching dApp's problematic swap) ---
const TARGET_POOL_ID_STR = 'DHgzwASfrYxDcAAedBWAdvHxj9AUbtvhoz14VPNFYosF'; // dApp's pool
const INPUT_MINT_PK = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL (Input is SOL)
const OUTPUT_MINT_PK = new PublicKey('G7ua8G7uSk6baT4GGNYJ1XLxKq2jP4s5TebqQAZpyqGm'); // dApp's output token

const SWAP_AMOUNT_IN_LAMPORTS_BN = new BN(2000000); // 0.002 SOL (Matching dApp input)
const SLIPPAGE_PERCENTAGE = 0.035; // 3.5% slippage (Matching dApp's slippage)

async function loadAndDecryptKeypair() {
    console.log("Attempting to load keypair from encrypted .env.local...");
    const encryptedKeyHex = process.env.ENCRYPTED_PRIVATE_KEY_HEX;
    const saltHex = process.env.KEY_SALT_HEX;
    const ivHex = process.env.KEY_IV_HEX;
    const authTagHex = process.env.KEY_AUTHTAG_HEX;

    if (!encryptedKeyHex || !saltHex || !ivHex || !authTagHex) {
        console.error('Error: Encrypted key environment variables not found in .env.local');
        console.log("Please run encrypt-key.js first.");
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

    // Initialize Raydium SDK with the ownerKeypair for signing
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
    console.log(`Input Amount (Lamports): ${SWAP_AMOUNT_IN_LAMPORTS_BN.toString()}`);
    console.log(`Slippage: ${SLIPPAGE_PERCENTAGE * 100}%`);


    // 3. Fetch Parsed Pool Data using Raydium SDK
    console.log("\n--- 3. Fetching Parsed Pool Data via SDK ---");
    let sdkFetchedPoolData;
    try {
        // Using poolId.toBase58() as getPoolInfoFromRpc expects a string ID
        sdkFetchedPoolData = await raydium.liquidity.getPoolInfoFromRpc({ poolId: poolId.toBase58() });
        console.log("Successfully fetched and parsed pool data via SDK.");

        const poolInfoForSDK_intermediate = sdkFetchedPoolData.poolInfo;
        const ammPoolKeysFromSDK_intermediate = sdkFetchedPoolData.poolKeys;

        // Log the raw structures to compare with dApp's MySdkPoolInfo and MyAmmV4Keys
        console.log("\n--- DEBUG: poolInfo Structure from SDK (fed into poolInfoForSDK) ---");
        console.log(JSON.stringify(poolInfoForSDK_intermediate, (key, value) => {
            if (value && value._bn !== undefined) { return value.toString(); } // BN.js
            if (value && value.constructor && value.constructor.name === 'PublicKey') { return value.toBase58(); } // PublicKey
            if (value && Buffer.isBuffer(value)) { return value.toString('hex'); } // Buffer
            // Handle nested fees object if BNs are present
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

        console.log("\n--- DEBUG: poolKeys Structure from SDK (fed into ammPoolKeysFromSDK) ---");
        console.log(JSON.stringify(ammPoolKeysFromSDK_intermediate, (key, value) => {
            if (value && value.constructor && value.constructor.name === 'PublicKey') { return value.toBase58(); }
            // Handle nested PublicKey instances within objects like mintA, mintB, etc.
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const cleanedValue = { ...value };
                for (const prop in cleanedValue) {
                    if (cleanedValue[prop] && cleanedValue[prop].constructor && cleanedValue[prop].constructor.name === 'PublicKey') {
                        cleanedValue[prop] = cleanedValue[prop].toBase58();
                    } else if (cleanedValue[prop] && cleanedValue[prop]._bn !== undefined) { // Handle BN in nested objects
                        cleanedValue[prop] = cleanedValue[prop].toString();
                    }
                }
                return cleanedValue;
            }
            return value;
        }, 2));


        if (!sdkFetchedPoolData || !sdkFetchedPoolData.poolInfo || !sdkFetchedPoolData.poolKeys) {
            console.error("SDK's getPoolInfoFromRpc did not return the expected structure.");
            return;
        }
        console.log(`\n  SDK poolInfo.mintA (Address: ${new PublicKey(sdkFetchedPoolData.poolInfo.mintA.address).toBase58()}, Decimals: ${sdkFetchedPoolData.poolInfo.mintA.decimals})`);
        console.log(`  SDK poolInfo.mintB (Address: ${new PublicKey(sdkFetchedPoolData.poolInfo.mintB.address).toBase58()}, Decimals: ${sdkFetchedPoolData.poolInfo.mintB.decimals})`);

    } catch (e) {
        console.error("Error during SDK pool data fetching/parsing:", e);
        return;
    }

    // These are the objects directly from the SDK, after ensuring fields are correct types if necessary (SDK usually handles this)
    const poolInfoForSDK = sdkFetchedPoolData.poolInfo;
    const ammPoolKeysFromSDK = sdkFetchedPoolData.poolKeys;


    console.log("\n--- 4. Verifying Mint Alignment with SDK Data ---");
    // Ensure PublicKeys are used for comparison
    const sdkMintA = new PublicKey(poolInfoForSDK.mintA.address);
    const sdkMintB = new PublicKey(poolInfoForSDK.mintB.address);

    if (!((sdkMintA.equals(INPUT_MINT_PK) && sdkMintB.equals(OUTPUT_MINT_PK)) ||
          (sdkMintB.equals(INPUT_MINT_PK) && sdkMintA.equals(OUTPUT_MINT_PK)))) {
        console.error("CRITICAL: Script's INPUT_MINT/OUTPUT_MINT do not match the SDK-parsed poolInfo.mintA/mintB.");
        return;
    }
    console.log("Mint alignment verified with SDK's poolInfo.");


    // 5. Compute Swap Amount Out
    console.log("\n--- 5. Computing Swap Amount Out (using SDK data) ---");
    let amountOutResult;
    try {
        console.log(`Calculating with SLIPPAGE_PERCENTAGE: ${SLIPPAGE_PERCENTAGE * 100}%`);
        // Ensure all mints are PublicKey objects for computeAmountOut
        amountOutResult = raydium.liquidity.computeAmountOut({
            poolInfo: poolInfoForSDK, // Directly from SDK
            amountIn: SWAP_AMOUNT_IN_LAMPORTS_BN,
            mintIn: INPUT_MINT_PK,     // PublicKey object
            mintOut: OUTPUT_MINT_PK,    // PublicKey object
            slippage: SLIPPAGE_PERCENTAGE,
        });
        console.log("Swap Amount Out Computed:");
        console.log(`  Expected Amount Out (lamports): ${amountOutResult.amountOut.toString()}`);
        console.log(`  Minimum Amount Out (lamports after ${SLIPPAGE_PERCENTAGE * 100}% slippage): ${amountOutResult.minAmountOut.toString()}`);
    } catch (e) {
        console.error("Error computing amount out:", e);
        return;
    }

    // 6. Construct and Simulate Swap Transaction
    console.log("\n--- 6. Constructing and Simulating Swap Transaction ---");
    let swapPayload;
    try {
        // Use PublicKey objects for inputMint and outputMint as per SDK's JS examples
        const swapParams = {
            poolInfo: poolInfoForSDK,
            poolKeys: ammPoolKeysFromSDK, // Directly from SDK
            owner: ownerKeypair.publicKey,
            inputMint: INPUT_MINT_PK,     // PublicKey object
            outputMint: OUTPUT_MINT_PK,   // PublicKey object
            amountIn: SWAP_AMOUNT_IN_LAMPORTS_BN,
            amountOut: amountOutResult.minAmountOut,
            fixedSide: 'in',
            txVersion: TxVersion.V0,
            computeBudgetConfig: { units: 400000, microLamports: 25000 },
            config: {
                associatedOnly: true,
                // For SOL input, inputUseSolBalance should be true.
                inputUseSolBalance: INPUT_MINT_PK.equals(new PublicKey('So11111111111111111111111111111111111111112')),
                // If output is SOL, outputUseSolBalance should be true (for unwrapping).
                outputUseSolBalance: OUTPUT_MINT_PK.equals(new PublicKey('So11111111111111111111111111111111111111112')),
            }
        };
        console.log("\n--- DEBUG: Parameters being passed to raydium.liquidity.swap ---");
        console.log(JSON.stringify(swapParams, (key, value) => {
            if (value && value._bn !== undefined) { return value.toString(); }
            if (value && value.constructor && value.constructor.name === 'PublicKey') { return value.toBase58(); }
             // Handle nested fees object if BNs are present
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
            // Handle nested PublicKey instances within poolInfo's mintA, mintB, etc.
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const cleanedValue = { ...value };
                 let hasChanged = false;
                for (const prop in cleanedValue) {
                    if (cleanedValue[prop] && cleanedValue[prop].constructor && cleanedValue[prop].constructor.name === 'PublicKey') {
                        cleanedValue[prop] = cleanedValue[prop].toBase58();
                        hasChanged = true;
                    } else if (cleanedValue[prop] && cleanedValue[prop]._bn !== undefined) { // Handle BN in nested objects
                        cleanedValue[prop] = cleanedValue[prop].toString();
                        hasChanged = true;
                    }
                }
                // Return cleanedValue only if it's not the top-level poolInfo or poolKeys, to avoid overly verbose logging of those.
                // This replacer is primarily for the 'swapParams' object itself.
                if (key === 'poolInfo' || key === 'poolKeys') return "[Object Contents Logged Separately Above]";
                return cleanedValue;
            }
            return value;
        }, 2));


        swapPayload = await raydium.liquidity.swap(swapParams);
        console.log("Swap payload constructed by SDK.");
        
        console.log("\n--- DEBUG: swapPayload Key Properties ---");
        // ... (existing swapPayload logging)

        if (swapPayload && swapPayload.transaction) {
            const transaction = swapPayload.transaction;
            if (!transaction.message.recentBlockhash) {
                const { blockhash } = await connection.getLatestBlockhashAndContext('confirmed');
                transaction.message.recentBlockhash = blockhash;
            }
            transaction.sign([ownerKeypair]);

            console.log("Simulating the transaction...");
            const simResult = await connection.simulateTransaction(transaction, {
                replaceRecentBlockhash: true, 
                sigVerify: false, // Already signed
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
            console.error("Swap payload did not contain a transaction object.");
        }
    } catch (e) {
        console.error("Error during swap transaction construction or simulation:", e);
    }
    console.log("\n--- Script Finished ---");
}

main().catch(e => {
    console.error("Fatal error in main execution:", e);
});


