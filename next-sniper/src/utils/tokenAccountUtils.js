// src/utils/tokenAccountUtils.js
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

export const ensureTokenAccount = async (connection, wallet, tokenMint) => {
  const mintPubkey = new PublicKey(tokenMint);
  const ownerPubkey = wallet.publicKey;
  
  // Get the token account address
  const tokenAccount = await getAssociatedTokenAddress(
    mintPubkey,
    ownerPubkey,
    false
  );
  
  // Check if the account exists
  const accountInfo = await connection.getAccountInfo(tokenAccount);
  
  if (!accountInfo) {
    console.log(`Creating token account for mint: ${tokenMint.toString()}`);
    
    // Create token account instruction
    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        ownerPubkey,
        tokenAccount,
        ownerPubkey,
        mintPubkey
      )
    );
    
    // Send the transaction
    const signature = await connection.sendTransaction(transaction, [wallet]);
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`Token account created: ${tokenAccount.toString()}`);
  }
  
  return tokenAccount;
};