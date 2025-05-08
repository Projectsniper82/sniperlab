// src/utils/versionedTransactions.js
import { VersionedTransaction, TransactionMessage } from '@solana/web3.js';

export const createVersionedTransaction = async (connection, payer, instructions) => {
  // Get the latest blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  
  // Create a message with the provided instructions
  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions
  }).compileToV0Message();
  
  // Create a versioned transaction using the message
  return new VersionedTransaction(messageV0);
};