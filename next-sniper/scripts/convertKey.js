const fs = require('fs');
const path = require('path'); // For constructing paths reliably

// Try to require bs58
let bs58;
try {
    bs58 = require('bs58');
} catch (e) {
    console.error("ERROR: Failed to require the 'bs58' module. Please ensure it's installed by running: npm install bs58");
    console.error(e);
    process.exit(1);
}

// --- Debugging bs58 import ---
console.log("Inspecting imported 'bs58' module:");
console.log("Type of bs58:", typeof bs58);
console.log("bs58 object:", bs58);
if (bs58 && typeof bs58 === 'object') {
    console.log("Keys in bs58 object:", Object.keys(bs58));
}
// --- End Debugging ---


// -------------------------------------------------------------------------
// ⬇️ PASTE THE PRIVATE KEY STRING YOU COPIED FROM PHANTOM HERE ⬇️
//    (The one from the image: "4rGKzaLHT7Jqtn5Zuf...CEDD")
// -------------------------------------------------------------------------
const privateKeyString = "4rGKzaLHT7Jqtn5Zuf7PdaTt8A5GGvC6R96jP1CWie7q3ToQNyco8RWyoVPzaepWcstKgZ8Uhs63YmT9mCqiCEDD";
// -------------------------------------------------------------------------

const outputFileName = 'my_wallet_keypair.json';
const outputDirectory = path.resolve(__dirname, '../'); // Assumes script is in 'Scripts', output to parent 'next-sniper'
const outputFilePath = path.join(outputDirectory, outputFileName);

if (privateKeyString === "YOUR_PRIVATE_KEY_STRING_FROM_PHANTOM_IMAGE" || !privateKeyString || privateKeyString.length < 80) {
    console.error("ERROR: Please open convertKey.js and paste your actual private key string into the 'privateKeyString' variable.");
    process.exit(1);
}

try {
    console.log("Attempting to decode private key string...");
    let secretKeyBytes;

    // Try different ways to access the decode function
    if (bs58 && typeof bs58.decode === 'function') {
        console.log("Using bs58.decode()...");
        secretKeyBytes = bs58.decode(privateKeyString);
    } else if (bs58 && bs58.default && typeof bs58.default.decode === 'function') {
        console.log("Using bs58.default.decode()...");
        secretKeyBytes = bs58.default.decode(privateKeyString);
    } else {
        throw new TypeError("bs58.decode or bs58.default.decode is not a function. The 'bs58' module might not be imported correctly or is not the expected library.");
    }

    if (secretKeyBytes.length !== 64) {
        console.error(`ERROR: Decoded key length is ${secretKeyBytes.length} bytes, but expected 64 bytes for a Solana secret key.`);
        console.error("Please ensure you copied the entire private key string correctly from Phantom.");
        process.exit(1);
    }

    const secretKeyArray = Array.from(secretKeyBytes);

    console.log(`Attempting to save to: ${outputFilePath}`);
    fs.writeFileSync(outputFilePath, JSON.stringify(secretKeyArray));
    console.log(`✅ Secret key byte array successfully saved to: ${outputFilePath}`);
    console.log("\nNEXT STEP: Update the WALLET_PATH in your 'findDecoder.js' script to this new path:");
    console.log(`const WALLET_PATH = '${outputFilePath.replace(/\\/g, '/')}';`);

} catch (e) {
    console.error("ERROR decoding private key string or writing file:", e);
    console.error("Please ensure the private key string you pasted is correct, complete, and base58 encoded, and that 'bs58' module is correctly installed.");
    if (e.stack) {
        console.error(e.stack);
    }
}