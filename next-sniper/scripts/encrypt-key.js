// encrypt-key.js (Focus on robust bs58 loading and diagnostics)
const crypto = require('crypto');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

// Attempt to load .env.local first to make sure other env vars are available if needed by any package
try {
    require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
} catch (e) {
    // This is not fatal for this script's core logic if dotenv is missing,
    // as we only use it to read existing .env.local content when writing back.
    console.warn("Warning: 'dotenv' package might be missing or .env.local not found. This is okay if .env.local doesn't exist yet.", e.message);
}

function encryptKey() {
    console.log("--- Private Key Encryption Utility (Phantom Compatible) ---");

    let bs58Module;
    try {
        bs58Module = require('bs58');
    } catch (e) {
        console.error("-------------------------------------------------------------------------------------------");
        console.error("FATAL ERROR: Failed to `require('bs58')`. The 'bs58' package might be missing or corrupted.");
        console.error("This is the most common reason for this script to fail at this stage.");
        console.error("Please try running: `npm install bs58` in your project directory.");
        console.error("If it's already installed, the installation might be corrupted. Consider removing");
        console.error("node_modules and package-lock.json (or yarn.lock) and running `npm install` (or `yarn install`) again.");
        console.error("Underlying error from require('bs58'):", e);
        console.error("-------------------------------------------------------------------------------------------");
        process.exit(1);
    }

    let decodeBs58Function;
    if (bs58Module && typeof bs58Module.decode === 'function') {
        console.log("DEBUG: Using bs58.decode directly.");
        decodeBs58Function = bs58Module.decode;
    } else if (bs58Module && bs58Module.default && typeof bs58Module.default.decode === 'function') {
        console.log("DEBUG: Using bs58.default.decode as bs58.decode was not found directly.");
        decodeBs58Function = bs58Module.default.decode;
    } else {
        console.error("-------------------------------------------------------------------------------------------");
        console.error("FATAL ERROR: 'bs58' module was loaded, but a usable 'decode' function was NOT found on `bs58Module` or `bs58Module.default`.");
        console.log("This indicates an unexpected structure for the 'bs58' module in your environment.");
        console.log("Typeof bs58Module:", typeof bs58Module);
        if (bs58Module) {
            console.log("Keys in bs58Module object:", Object.keys(bs58Module));
            if (bs58Module.default) {
                console.log("Typeof bs58Module.default:", typeof bs58Module.default);
                console.log("Keys in bs58Module.default object:", Object.keys(bs58Module.default));
            }
        }
        console.error("Please check your 'bs58' installation or possible module conflicts.");
        console.error("-------------------------------------------------------------------------------------------");
        process.exit(1);
    }

    const base58PrivateKeyString = readlineSync.question(
        'Paste your Base58 encoded private key string (exported from Phantom): ',
        { hideEchoBack: false, history: false }
    );

    if (!base58PrivateKeyString || base58PrivateKeyString.trim() === "") {
        console.error("No private key string entered. Exiting.");
        process.exit(1);
    }

    let secretKeyBytes;
    try {
        secretKeyBytes = decodeBs58Function(base58PrivateKeyString.trim());
        // Phantom typically exports a 64-byte secret key (private + public key concatenated) Base58 encoded.
        // Keypair.fromSecretKey can handle this 64-byte array.
        if (secretKeyBytes.length !== 64) {
            console.warn(`Warning: Decoded private key length is ${secretKeyBytes.length} bytes. Expected 64 bytes for a standard Solana secret key. Ensure this is the correct full key from Phantom.`);
        }
    } catch (e) {
        console.error("-------------------------------------------------------------------------------------------");
        console.error("ERROR: Could not decode the Base58 private key string. It might be invalid or corrupted.");
        console.error("Please ensure you copied the exact string from Phantom's 'Export Private Key' feature.");
        console.error("Underlying error during decoding:", e.message);
        console.error("-------------------------------------------------------------------------------------------");
        process.exit(1); // Exit if decoding fails
    }

    const privateKeyJsonArrayString = JSON.stringify(Array.from(secretKeyBytes));

    const password = readlineSync.questionNewPassword(
        'Enter a strong password to encrypt this key (REMEMBER THIS PASSWORD!): ',
        { min: 8, mixCase: true, mixNumber: true, mask: '*' }
    );

    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);
    const derivedKey = crypto.pbkdf2Sync(password, salt, 200000, 32, 'sha512'); // Increased iterations
    const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
    let encrypted = cipher.update(privateKeyJsonArrayString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    console.log("\n--- Encryption Successful! ---");
    console.log("The following lines will be added/updated in your .env.local file:");
    console.log("----------------------------------------------------");
    const envVars = [
        `ENCRYPTED_PRIVATE_KEY_HEX="${encrypted}"`,
        `KEY_SALT_HEX="${salt.toString('hex')}"`,
        `KEY_IV_HEX="${iv.toString('hex')}"`,
        `KEY_AUTHTAG_HEX="${authTag.toString('hex')}"`
    ];
    envVars.forEach(v => console.log(v));
    console.log("----------------------------------------------------");

    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    let envContent = "";
    try {
        if (fs.existsSync(envLocalPath)) {
            envContent = fs.readFileSync(envLocalPath, 'utf8');
        }
    } catch (e) {
        console.warn(`Warning: Could not read existing .env.local file. A new one might be created. Error: ${e.message}`);
    }
    
    const keysToUpdate = ["ENCRYPTED_PRIVATE_KEY_HEX", "KEY_SALT_HEX", "KEY_IV_HEX", "KEY_AUTHTAG_HEX"];
    keysToUpdate.forEach(key => {
        const regex = new RegExp(`^${key}=.*\n?`, "gm");
        envContent = envContent.replace(regex, "");
    });
    const newEnvVarBlock = envVars.join("\n");
    envContent = envContent.trim();
    if (envContent && !envContent.endsWith("\n")) envContent += "\n"; // Ensure newline if content exists
    if (!envContent && newEnvVarBlock) envContent = newEnvVarBlock; // If envContent was empty
    else if (newEnvVarBlock) envContent += newEnvVarBlock;
    
    try {
        fs.writeFileSync(envLocalPath, envContent.trim() + "\n");
        console.log(`\nSuccessfully updated (or created) ${envLocalPath}`);
    } catch (e) {
        console.error(`FATAL ERROR: Could not write to ${envLocalPath}. Please check permissions. Error: ${e.message}`);
        process.exit(1);
    }
    console.log("IMPORTANT: Store your password securely (do not write it down here). Ensure .env.local is in .gitignore.");
}

// Main execution wrapped in a try-catch for any unexpected top-level errors
try {
    encryptKey();
} catch (error) {
    console.error("-------------------------------------------------------------------------------------------");
    console.error("An unexpected critical error occurred during script execution:", error);
    console.error("-------------------------------------------------------------------------------------------");
    process.exit(1);
}