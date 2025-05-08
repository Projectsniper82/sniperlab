// src/utils/walletAdapter.js
// FINAL VERSION - Added signAllTransactions

import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Simple adapter to provide necessary properties/methods for Raydium SDK
export const createWalletAdapter = (wallet, connection) => {
    console.log("[createWalletAdapter] Received wallet object. Validating...");
    let pkInstance = null;

    // Ensure publicKey is a PublicKey instance
    if (wallet?.publicKey) {
        if (wallet.publicKey instanceof PublicKey) {
            pkInstance = wallet.publicKey;
            console.log("  > publicKey is already PublicKey instance:", pkInstance.toString());
        } else {
            try {
                pkInstance = new PublicKey(wallet.publicKey.toString());
                console.log("  > publicKey was not instance, created PublicKey from string:", pkInstance.toString());
            } catch (e) {
                console.error("  > Failed to create PublicKey from wallet.publicKey:", wallet.publicKey, e);
                pkInstance = null; // Ensure it's null if conversion fails
            }
        }
    }

    // Validate required properties/methods
    // *** ADD CHECK FOR signAllTransactions ***
    if (!pkInstance || typeof wallet?.signTransaction !== 'function' || typeof wallet?.signAllTransactions !== 'function') {
        console.error("[createWalletAdapter] Wallet object missing publicKey, signTransaction, or signAllTransactions", {
            hasPublicKey: !!pkInstance,
            hasSignTx: typeof wallet?.signTransaction === 'function',
            hasSignAllTx: typeof wallet?.signAllTransactions === 'function',
        });
        throw new Error("Invalid wallet object provided to createWalletAdapter (missing required functions/properties).");
    }

    console.log("[createWalletAdapter] Adapter creation proceeding with PK:", pkInstance.toString());

    // Return an object conforming to the basic WalletAdapter interface needed by Raydium
    return {
        publicKey: pkInstance,

        // Pass through signTransaction
        signTransaction: async (transaction) => {
            console.log("[walletAdapter] signTransaction called");
            if (!wallet || typeof wallet.signTransaction !== 'function') {
                throw new Error("Wallet does not support signTransaction");
            }
            // Ensure it's the correct transaction type expected by the wallet
             if (transaction instanceof VersionedTransaction) {
                console.warn("[walletAdapter] Passing VersionedTransaction to wallet.signTransaction");
             } else if (transaction instanceof Transaction) {
                 console.log("[walletAdapter] Passing legacy Transaction to wallet.signTransaction");
             }
            return await wallet.signTransaction(transaction);
        },

        // *** ADD signAllTransactions METHOD ***
        signAllTransactions: async (transactions) => {
            console.log(`[walletAdapter] signAllTransactions called with ${transactions.length} transactions`);
             if (!wallet || typeof wallet.signAllTransactions !== 'function') {
                throw new Error("Wallet does not support signAllTransactions");
            }
            // Log types of transactions being passed
            transactions.forEach((tx, i) => console.log(`  TX[${i}] type: ${tx.constructor.name}`));
            return await wallet.signAllTransactions(transactions);
        },

        // Add a dummy connected getter if required by SDK internals (harmless)
        get connected() {
            return true;
        }
    };
};