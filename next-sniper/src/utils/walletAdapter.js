// src/utils/walletAdapter.js
// FINAL VERSION - Added signAllTransactions and Keypair detection

import { PublicKey, Transaction, VersionedTransaction, Keypair } from '@solana/web3.js';

// Simple adapter to provide necessary properties/methods for Raydium SDK
export const createWalletAdapter = (wallet, connection) => {
    console.log("[createWalletAdapter] Received wallet object. Validating...");
    let pkInstance = null;
    let keypairInstance = null;

    // Detect if wallet is a Keypair or contains a secretKey
    if (wallet instanceof Keypair) {
        keypairInstance = wallet;
        pkInstance = wallet.publicKey;
        console.log("  > Wallet is a Keypair instance", pkInstance.toString());
    } else if (wallet?.secretKey) {
        try {
            const sk = wallet.secretKey instanceof Uint8Array ? wallet.secretKey : Uint8Array.from(wallet.secretKey);
            keypairInstance = Keypair.fromSecretKey(sk);
            pkInstance = keypairInstance.publicKey;
            console.log("  > Wallet contains secretKey. Keypair created:", pkInstance.toString());
        } catch (e) {
            console.error("  > Failed to construct Keypair from secretKey", e);
        }
    }

    // Ensure publicKey is a PublicKey instance if not derived from secretKey
    if (!pkInstance && wallet?.publicKey) {
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

    // Validate required methods when not using an internal Keypair
    const hasSignTx = typeof wallet?.signTransaction === 'function';
    const hasSignAllTx = typeof wallet?.signAllTransactions === 'function';

    if (!pkInstance) {
        throw new Error("Invalid wallet object provided to createWalletAdapter (missing publicKey).");
    }
    if (!keypairInstance && (!hasSignTx || !hasSignAllTx)) {
        console.error("[createWalletAdapter] Wallet object missing signTransaction or signAllTransactions", {
            hasPublicKey: !!pkInstance,
            hasSignTx,
            hasSignAllTx,
        });
        throw new Error("Invalid wallet object provided to createWalletAdapter (missing required functions/properties).");
    }

    console.log("[createWalletAdapter] Adapter creation proceeding with PK:", pkInstance.toString());

    // Return an object conforming to the basic WalletAdapter interface needed by Raydium
    return {
        publicKey: pkInstance,

        // Sign a single transaction
        signTransaction: async (transaction) => {
            console.log("[walletAdapter] signTransaction called");
            if (keypairInstance) {
                if (transaction instanceof VersionedTransaction) {
                    transaction.sign([keypairInstance]);
                } else if (transaction instanceof Transaction) {
                    transaction.partialSign(keypairInstance);
                }
                return transaction;
            }

            if (!wallet || typeof wallet.signTransaction !== 'function') {
                throw new Error("Wallet does not support signTransaction");
            }
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
            if (keypairInstance) {
                transactions.forEach((tx) => {
                    if (tx instanceof VersionedTransaction) {
                        tx.sign([keypairInstance]);
                    } else if (tx instanceof Transaction) {
                        tx.partialSign(keypairInstance);
                    }
                });
                return transactions;
            }

            if (!wallet || typeof wallet.signAllTransactions !== 'function') {
                throw new Error("Wallet does not support signAllTransactions");
            }
            transactions.forEach((tx, i) => console.log(`  TX[${i}] type: ${tx.constructor.name}`));
            return await wallet.signAllTransactions(transactions);
        },

        // Add a dummy connected getter if required by SDK internals (harmless)
        get connected() {
            return true;
        }
    };
};