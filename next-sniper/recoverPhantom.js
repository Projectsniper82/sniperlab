const bip39 = require("bip39");
const bs58 = require("bs58");
const { derivePath } = require("ed25519-hd-key");
const { Keypair } = require("@solana/web3.js");
const fs = require("fs");

// Paste this block in its place
const seedPhrase = process.env.PHANTOM_SEED;

if (!seedPhrase) {
  console.error("PHANTOM_SEED environment variable is not set");
  process.exit(1);
}

const run = async () => {
  const seed = await bip39.mnemonicToSeed(seedPhrase);
  const path = "m/44'/501'/0'/0'"; // Phantom derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  const keypairArray = Array.from(keypair.secretKey);
  fs.writeFileSync("phantom-keypair.json", JSON.stringify(keypairArray));

  console.log("✅ Phantom wallet recovered");
  console.log("📥 Saved to: phantom-keypair.json");
  console.log("📬 Public Key:", keypair.publicKey.toBase58());
};

run();
