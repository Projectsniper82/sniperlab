// src/utils/transactionUtils.js
import { sendAndConfirmRawTransaction } from '@solana/web3.js';

export const sendAndConfirmWithRetry = async (connection, signedTransaction, maxRetries = 5, initBackoff = 250) => {
  let signature = null;
  let retries = 0;
  let backoff = initBackoff;
  
  const txid = await connection.sendRawTransaction(signedTransaction);
  console.log(`Transaction submitted: ${txid}`);
  
  while (retries < maxRetries) {
    try {
      signature = await connection.confirmTransaction(txid, 'confirmed');
      console.log(`Transaction confirmed: ${txid}`);
      return signature;
    } catch (err) {
      console.log(`Confirmation failed, retrying (${retries+1}/${maxRetries}): ${err.message}`);
      retries++;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoff));
      backoff *= 1.5;
    }
  }
  
  throw new Error(`Failed to confirm transaction after ${maxRetries} attempts`);
};