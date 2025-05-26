import { Connection, PublicKey } from '@solana/web3.js';
import { makeSwapCpmmBaseInInstruction } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';

// === Static info from your logs and pool ===
const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=f0617c48-43a7-4419-a7f9-9775f2226c75');

const programId         = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
const payer             = new PublicKey('DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs');
const authority         = new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1');
const configId          = new PublicKey('11111111111111111111111111111111'); // <-- Use real config if you have it; often 32 1's if not used
const poolId            = new PublicKey('3oEFniXw6csxTyMen7wTCJeEAiVGsAbniwcMGQczb6iK');

const userInputAccount  = new PublicKey('9ZTDbHMeNMgigrGoJS2CbcLPyJWSryPy4JavB8sNbpGV');    // your WSOL ATA
const userOutputAccount = new PublicKey('7mnH5R6AYxq4kioHciytn5QmCenbnJmpGo7ojwpUummP');    // your CATANA ATA

const inputVault        = new PublicKey('CeafKKese66bxXyNWFuZFkiiVudvm7hMc3pdZPm4t1et');     // pool WSOL vault
const outputVault       = new PublicKey('DNC5R8BNYi5fA4Fa5G3p8e6c9CKm2w3NbJ34YoTYrpSG');     // pool CATANA vault

const inputTokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const outputTokenProgram= new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const inputMint         = new PublicKey('So11111111111111111111111111111111111111112');
const outputMint        = new PublicKey('GmbC2HgWpHpq9SHnmEXZNT5e1zgcU9oASDqbAkGTpump');
const observationId     = new PublicKey('11111111111111111111111111111111'); // If not used, just use the default

const amountIn          = new BN(1_000_000); // 0.001 SOL (lamports)
const amountOutMin      = new BN(1);         // Accept any for dry-run

(async () => {
  try {
    // Order: programId, payer, authority, configId, poolId,
    //        userInputAccount, userOutputAccount, inputVault, outputVault,
    //        inputTokenProgram, outputTokenProgram, inputMint, outputMint,
    //        observationId, amountIn, amountOutMin
    const ix = await makeSwapCpmmBaseInInstruction(
      programId,
      payer,
      authority,
      configId,
      poolId,
      userInputAccount,
      userOutputAccount,
      inputVault,
      outputVault,
      inputTokenProgram,
      outputTokenProgram,
      inputMint,
      outputMint,
      observationId,
      amountIn,
      amountOutMin
    );

    console.log('[testSwapRaydium] SUCCESS! Here is the built swap instruction:');
    console.dir(ix, { depth: 4 });
  } catch (e) {
    console.error('[testSwapRaydium] ERROR:', e);
  }
})();
