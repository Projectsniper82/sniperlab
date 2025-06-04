const { Connection, Transaction, PublicKey } = require('@solana/web3.js');
const { makeSwapCpmmBaseInInstruction } = require('@raydium-io/raydium-sdk-v2');
const BN = require('bn.js');

// POOL DATA — replace with your own if needed
const programId = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
const payer = new PublicKey('DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs');
const authority = new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1');
const configId = new PublicKey('3R2ShkgKJUP6VnFK5otcgjjshb3gfezYoVhUssmJwkua'); // Use your pool's targetOrders
const poolId = new PublicKey('9CTxEyRStwTKLfVTS6c7rfQc7PTxY42YPdQcrHTv53Ao');

const userInputAccount = new PublicKey('DuRSM3UwLgEqyYTywJu4F4VhDq2GLCNfQpEVhECX38Qx'); // WSOL ATA
const userOutputAccount = new PublicKey('5qnQ9YpR8UWtTCMurHFBMLVsfg7oJoN7NfMCxJLzMJCs'); // HOOD ATA

const inputVault = new PublicKey('CLJRTMaqkc2oq8jEWKAvshWuwBJLTSpZ6B9SVQ5k3Rb5'); // WSOL vault
const outputVault = new PublicKey('7zesqXvg9WeVQCZk84gXAdYJxbrEtMnGyZ6z84yPtDdT'); // HOOD vault

const inputTokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const outputTokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const inputMint = new PublicKey('So11111111111111111111111111111111111111112'); // WSOL
const outputMint = new PublicKey('h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood'); // HOOD

const observationId = configId; // Use targetOrders as observationId if that's what your pool uses

const amountIn = new BN(1_000_000); // 0.001 SOL
const amountOutMin = new BN(1);

(async () => {
  try {
    console.log('[PROBE] Building swap instruction...');
    const ix = await makeSwapCpmmBaseInInstruction(
      programId, payer, authority, configId, poolId,
      userInputAccount, userOutputAccount,
      inputVault, outputVault,
      inputTokenProgram, outputTokenProgram,
      inputMint, outputMint,
      observationId, amountIn, amountOutMin
    );

    // Create a transaction and add the instruction
    const tx = new Transaction().add(ix);

    console.log('\n[SUCCESS] Built transaction (not signed, not sent):');
    console.dir(tx, { depth: 6 });

    // Optionally, simulate the transaction:
    // const connection = new Connection('https://api.mainnet-beta.solana.com');
    // const simulation = await connection.simulateTransaction(tx);
    // console.log('Simulation result:', simulation);

  } catch (e) {
    console.error('[FAIL] Could not build swap instruction:');
    console.error(e);
  }
})();







