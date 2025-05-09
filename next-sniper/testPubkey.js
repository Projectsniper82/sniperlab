"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// testPubkey.ts
var bs58_1 = require("bs58");
var web3_js_1 = require("@solana/web3.js"); // Keep for optional second test
// The specific string causing issues
var testString = "5Q544fKrFoe6tsEbD7S8sLhYDCdLMDMDeYNsPSJ9Y3oS";
console.log("--- Running bs58 Decode Test Script ---");
var decodedBytes = null;
try {
    console.log("Attempting: bs58.decode(\"".concat(testString, "\")"));
    // Test the core bs58 decode function directly
    decodedBytes = bs58_1.default.decode(testString);
    console.log("SUCCESS! bs58.decode produced ".concat(decodedBytes.length, " bytes."));
    // Optional: Log first few bytes to inspect them if needed
    // console.log(decodedBytes.slice(0, 5));
}
catch (e) {
    // This catch block will execute if bs58.decode itself fails
    console.error("FAILURE in bs58.decode test script:", e);
}
// Only if bs58.decode succeeded, try creating PublicKey from the bytes
if (decodedBytes) {
    console.log("--- Testing PublicKey creation FROM DECODED BYTES ---");
    try {
        var pk = new web3_js_1.PublicKey(decodedBytes); // Test PublicKey constructor with bytes
        console.log("SUCCESS creating PublicKey from bytes: ".concat(pk.toBase58()));
    }
    catch (e) {
        // This catch block executes if creating PublicKey from bytes fails
        console.error("FAILURE creating PublicKey from DECODED BYTES:", e);
    }
}
console.log("--- Finished bs58 Decode Test Script ---");
