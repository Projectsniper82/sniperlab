// File: src/utils/mintWithPhantom.ts
import { PublicKey, Connection, Transaction, SystemProgram } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint
} from '@solana/spl-token';
import { Keypair } from '@solana/web3.js';

// Define a minimal wallet interface
interface PhantomWallet {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

// Main function to mint a token to the connected Phantom wallet
export async function mintTokenWithPhantomWallet(
  wallet: PhantomWallet, 
  connection: Connection, 
  tokenName = 'Test1'
) {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Phantom wallet is not connected');
  }

  try {
    console.log(`🚀 Minting token: ${tokenName}`);
    
    // Step 1: Create a keypair for the mint account
    const mintKeypair = Keypair.generate();
    console.log(`Generated mint keypair: ${mintKeypair.publicKey.toBase58()}`);
    
    // Step 2: Get minimum balance for rent exemption
    const rentExemptBalance = await getMinimumBalanceForRentExemptMint(connection);
    
    // Step 3: Create a transaction to create the mint account
    const createMintTx = new Transaction();
    
    // Add instruction to create account for the mint
    createMintTx.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: rentExemptBalance,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID
      })
    );
    
    // Add instruction to initialize the mint
    createMintTx.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9, // 9 decimals
        wallet.publicKey, // mint authority
        wallet.publicKey  // freeze authority
      )
    );
    
    // Step 4: Get or create associated token account for the wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey
    );
    
    // Add instruction to create associated token account if needed
    createMintTx.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAddress, // associated token account
        wallet.publicKey, // owner
        mintKeypair.publicKey // mint
      )
    );
    
    // Step 5: Add instruction to mint some tokens to the wallet
    const mintAmount = 1_000_000_000; // 1 billion tokens
    createMintTx.add(
      createMintToInstruction(
        mintKeypair.publicKey, // mint
        associatedTokenAddress, // destination
        wallet.publicKey, // authority
        mintAmount * (10 ** 9) // amount with decimal places
      )
    );
    
    // Step 6: Set the transaction fee payer and get recent blockhash
    createMintTx.feePayer = wallet.publicKey;
    const { blockhash } = await connection.getRecentBlockhash();
    createMintTx.recentBlockhash = blockhash;
    
    // Step 7: Sign the transaction with the mint account first
    createMintTx.sign(mintKeypair);
    
    // Step 8: Have the wallet sign the transaction
    const signedTx = await wallet.signTransaction(createMintTx);
    
    // Step 9: Send and confirm the transaction
    console.log('Sending transaction...');
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(signature, 'confirmed');
    
    console.log(`✅ Token Mint Address: ${mintKeypair.publicKey.toBase58()}`);
    console.log(`✅ Associated Token Account (ATA): ${associatedTokenAddress.toBase58()}`);
    console.log(`✅ Transaction signature: ${signature}`);
    
    return {
      mintAddress: mintKeypair.publicKey.toBase58(),
      ata: associatedTokenAddress.toBase58(),
      tx: signature
    };
  } catch (error: any) {
    console.error('❌ Error minting token:', error);
    throw new Error(`Failed to mint token: ${error.message}`);
  }
}
