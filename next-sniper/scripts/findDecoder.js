// findDecoder.js (Universal Jupiter Swap Tester - Buy/Sell)
const { Connection, Keypair, PublicKey, VersionedTransaction } = require('@solana/web3.js');
const BN = require('bn.js');
const crypto = require('crypto');
const readlineSync = require('readline-sync');
const path =require('path');
const Decimal = require('decimal.js');

// Load .env.local first
try {
    require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
} catch (e) {
    //
}

// --- Configuration ---
const RPC_URL_FROM_ENV = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
const RPC_URL = RPC_URL_FROM_ENV || 'https://api.mainnet-beta.solana.com';
const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';

// Decryption function for your keypair
async function loadAndDecryptKeypair() { /* ... same as before ... */ }
// ... (omitted for brevity, please keep your existing working function here)
async function loadAndDecryptKeypair() {
    console.log("Attempting to load keypair from encrypted .env.local...");
    const encryptedKeyHex = process.env.ENCRYPTED_PRIVATE_KEY_HEX;
    const saltHex = process.env.KEY_SALT_HEX;
    const ivHex = process.env.KEY_IV_HEX;
    const authTagHex = process.env.KEY_AUTHTAG_HEX;

    if (!encryptedKeyHex || !saltHex || !ivHex || !authTagHex) {
        console.error('Error: Encrypted key environment variables not found in .env.local');
        process.exit(1);
    }
    const password = readlineSync.question('Enter password to decrypt private key: ', { hideEchoBack: true, history: false });
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
        return Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
    } catch (error) {
        console.error('Decryption failed.', error.message);
        process.exit(1);
    }
}


async function main() {
    const fetch = (await import('node-fetch')).default;

    console.log("--- Universal Jupiter Swap Tester ---");

    // --- Get Swap Details from User ---
    const swapDirection = readlineSync.keyInSelect(['Buy (SOL -> Token)', 'Sell (Token -> SOL)'], 'Which direction?');

    if (swapDirection === -1) {
        console.log('Cancelled.');
        return;
    }

    let inputMint, outputMint, amountHuman, inputDecimals;

    if (swapDirection === 0) { // Buy
        console.log("\n--- Buying Token with SOL ---");
        inputMint = SOL_MINT_ADDRESS;
        inputDecimals = 9;
        outputMint = readlineSync.question('Enter the TOKEN MINT you want to buy: ');
        amountHuman = readlineSync.question(`Enter the amount of SOL to spend (e.g., 0.01): `);
    } else { // Sell
        console.log("\n--- Selling Token for SOL ---");
        outputMint = SOL_MINT_ADDRESS;
        inputMint = readlineSync.question('Enter the TOKEN MINT you want to sell: ');
        inputDecimals = readlineSync.questionInt(`Enter the decimals for this token: `);
        amountHuman = readlineSync.question(`Enter the amount of the token to sell (e.g., 5000): `);
    }

    const slippageBps = readlineSync.questionInt('Enter slippage in basis points (e.g., 50 for 0.5%): ');

    const amountInLamports = new BN(
        new Decimal(amountHuman)
          .mul(new Decimal(10).pow(inputDecimals))
          .toFixed(0)
    );

    let ownerKeypair = await loadAndDecryptKeypair(); 
    const userPublicKey = ownerKeypair.publicKey;
    console.log(`\nOwner Public Key: ${userPublicKey.toBase58()}`);
    const connection = new Connection(RPC_URL, 'confirmed');

    // --- Jupiter API Calls ---
    console.log(`\n--- Fetching Quote from Jupiter ---`);
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInLamports.toString()}&slippageBps=${slippageBps}`;
    console.log("Calling URL:", quoteUrl);
    const quoteResponse = await (await fetch(quoteUrl)).json();
    if (quoteResponse.error) throw new Error(`Failed to get quote: ${quoteResponse.error}`);

    console.log(`\n--- Fetching Swap Transaction from Jupiter ---`);
    const swapResponse = await (await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: userPublicKey.toBase58(),
            wrapAndUnwrapSol: true,
        })
    })).json();
    if (swapResponse.error) throw new Error(`Failed to get swap transaction: ${swapResponse.error}`);
    
    // --- Simulation ---
    console.log(`\n--- Simulating Transaction ---`);
    const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([ownerKeypair]);
    
    const simResult = await connection.simulateTransaction(transaction);
    if (simResult.value.err) {
        console.error(`❌ Simulation Failed:`, JSON.stringify(simResult.value.err));
        console.error(`Logs:`);
        (simResult.value.logs || []).forEach(log => console.error(`  ${log}`));
    } else {
        console.log(`🎉 Simulation Successful!`);
        console.log(`Logs:`);
        (simResult.value.logs || []).forEach(log => console.log(`  ${log}`));
    }
    
    console.log("\n--- Script Finished ---");
}

main().catch(e => {
    console.error("\n--- FATAL ERROR ---");
    console.error(e);
});
