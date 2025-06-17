diff --git a/next-sniper/src/components/BotManager.tsx b/next-sniper/src/components/BotManager.tsx
index e2c73e88897bf730a996fedb00aa81e161a47b18..fb3b6ca40f0287571b78d02869e3d8bf11d03b8e 100644
--- a/next-sniper/src/components/BotManager.tsx
+++ b/next-sniper/src/components/BotManager.tsx
@@ -1,151 +1,146 @@
 'use client';
 
 import React, { useState, useEffect, useCallback } from 'react';
 import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
 import { useWallet } from '@solana/wallet-adapter-react';
 import { useNetwork } from '@/context/NetworkContext';
 import { useToken } from '@/context/TokenContext';
 import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
 import TradingBot from './TradingBot';
-import { generateBotWallet, saveBotWallet, loadBotWallet, clearBotWallet } from '@/utils/botWalletManager';
+import {
+    generateBotWallet,
+    saveBotWallets,
+    loadBotWallets,
+    clearBotWallets,
+} from '@/utils/botWalletManager';
 
 // Define the props the BotManager will accept from the page
 interface BotManagerProps {
     isLogicEnabled: boolean;
 }
 
 export default function BotManager({ isLogicEnabled }: BotManagerProps) {
     const { connection, network } = useNetwork();
     const { publicKey: userPublicKey, sendTransaction } = useWallet();
     const { tokenAddress } = useToken();
-    const [botKeypair, setBotKeypair] = useState<Keypair | null>(null);
+    const [botWallets, setBotWallets] = useState<Keypair[]>([]);
     const [isLoading, setIsLoading] = useState(true);
 
     useEffect(() => {
         setIsLoading(true);
-        const loadedWallet = loadBotWallet(network);
-        setBotKeypair(loadedWallet);
+        const loaded = loadBotWallets(network);
+        setBotWallets(loaded);
         setIsLoading(false);
     }, [network]);
 
     const handleCreateBotWallet = () => {
-        if (window.confirm("Are you sure? This will overwrite any existing bot wallet for this network.")) {
-            const newWallet = generateBotWallet();
-            saveBotWallet(network, newWallet);
-            setBotKeypair(newWallet);
-        }
+        const newWallet = generateBotWallet();
+        const updated = [...botWallets, newWallet];
+        saveBotWallets(network, updated);
+        setBotWallets(updated);
     };
 
-    const handleClearBotWallet = () => {
-        if (window.confirm("Are you sure? This will permanently delete the current bot wallet for this network.")) {
-            clearBotWallet(network);
-            setBotKeypair(null);
+    const handleClearBotWallets = () => {
+        if (window.confirm("Are you sure? This will permanently delete all bot wallets for this network.")) {
+            clearBotWallets(network);
+            setBotWallets([]);
         }
     };
 
-    const handleFundBot = useCallback(async (amount: number): Promise<string> => {
-        if (!botKeypair) throw new Error("Bot wallet not ready.");
-
+    const createFundHandler = useCallback((wallet: Keypair) => async (amount: number): Promise<string> => {
         if (network === 'devnet') {
-            const signature = await connection.requestAirdrop(botKeypair.publicKey, amount * LAMPORTS_PER_SOL);
-            await connection.confirmTransaction(signature, 'confirmed');
-            return signature;
+            const sig = await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
+            await connection.confirmTransaction(sig, 'confirmed');
+            return sig;
         }
-
-        if (!userPublicKey || !sendTransaction) throw new Error("User wallet not connected.");
-        
+        if (!userPublicKey || !sendTransaction) throw new Error('User wallet not connected.');
         const transaction = new Transaction().add(
             SystemProgram.transfer({
                 fromPubkey: userPublicKey,
-                toPubkey: botKeypair.publicKey,
+                toPubkey: wallet.publicKey,
                 lamports: amount * LAMPORTS_PER_SOL,
             })
         );
-        const signature = await sendTransaction(transaction, connection);
-        await connection.confirmTransaction(signature, 'confirmed');
-        return signature;
+        const sig = await sendTransaction(transaction, connection);
+        await connection.confirmTransaction(sig, 'confirmed');
+        return sig;
+    }, [userPublicKey, sendTransaction, connection, network]);
 
-    }, [userPublicKey, botKeypair, connection, sendTransaction, network]);
-
-    const handleWithdrawFromBot = useCallback(async (recipientAddress: string, amount: number): Promise<string> => {
-        if (!botKeypair) throw new Error("Bot wallet not ready.");
+    const createWithdrawHandler = useCallback((wallet: Keypair) => async (recipientAddress: string, amount: number): Promise<string> => {
         const recipientPublicKey = new PublicKey(recipientAddress);
         const transaction = new Transaction().add(
             SystemProgram.transfer({
-                fromPubkey: botKeypair.publicKey,
+                fromPubkey: wallet.publicKey,
                 toPubkey: recipientPublicKey,
                 lamports: amount * LAMPORTS_PER_SOL,
             })
         );
-        return await sendAndConfirmTransaction(connection, transaction, [botKeypair]);
-    }, [botKeypair, connection]);
-    
-    const handleWithdrawTokenFromBot = useCallback(async (recipientAddress: string, amount: number, mintAddress: string): Promise<string> => {
-        if (!botKeypair) throw new Error("Bot wallet not ready.");
-        if (!mintAddress) throw new Error("Token to withdraw has not been specified.");
+        return await sendAndConfirmTransaction(connection, transaction, [wallet]);
+    }, [connection]);
+
+    const createWithdrawTokenHandler = useCallback((wallet: Keypair) => async (recipientAddress: string, amount: number, mintAddress: string): Promise<string> => {
+        if (!mintAddress) throw new Error('Token to withdraw has not been specified.');
 
         const mintPublicKey = new PublicKey(mintAddress);
         const recipientPublicKey = new PublicKey(recipientAddress);
-        
-        const fromAta = await getOrCreateAssociatedTokenAccount(connection, botKeypair, mintPublicKey, botKeypair.publicKey);
-        const toAta = await getOrCreateAssociatedTokenAccount(connection, botKeypair, mintPublicKey, recipientPublicKey);
+
+        const fromAta = await getOrCreateAssociatedTokenAccount(connection, wallet, mintPublicKey, wallet.publicKey);
+        const toAta = await getOrCreateAssociatedTokenAccount(connection, wallet, mintPublicKey, recipientPublicKey);
 
         const tokenInfo = await connection.getParsedAccountInfo(mintPublicKey);
         const decimals = (tokenInfo.value?.data as any)?.parsed?.info?.decimals ?? 0;
 
         const transaction = new Transaction().add(
-            createTransferInstruction(fromAta.address, toAta.address, botKeypair.publicKey, amount * Math.pow(10, decimals))
+            createTransferInstruction(fromAta.address, toAta.address, wallet.publicKey, amount * Math.pow(10, decimals))
         );
-
-        return await sendAndConfirmTransaction(connection, transaction, [botKeypair]);
-
-    }, [botKeypair, connection]);
+        return await sendAndConfirmTransaction(connection, transaction, [wallet]);
+    }, [connection]);
 
 
     if (isLoading) {
         return <div className="text-center p-8 text-gray-400">Loading Bot Wallet...</div>;
     }
 
     return (
         <div className="max-w-4xl mx-auto">
             <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                 <h2 className="text-xl font-bold text-white mb-3">
                     Bot Wallet Management ({network})
                 </h2>
-                {botKeypair ? (
-                    <div className='flex items-center justify-between'>
-                        <p className="text-sm text-green-400">
-                            Bot wallet loaded: <span className='font-mono text-xs text-gray-300'>{botKeypair.publicKey.toBase58()}</span>
-                        </p>
-                        <button onClick={handleClearBotWallet} className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded">
-                            Clear Wallet
-                        </button>
-                    </div>
-                ) : (
-                    <div className='flex items-center justify-between'>
-                        <p className="text-sm text-yellow-400">No bot wallet found for {network}.</p>
+                <div className='flex items-center justify-between'>
+                    <p className="text-sm text-green-400">
+                        {botWallets.length > 0 ? `${botWallets.length} wallet(s) loaded.` : `No bot wallets found for ${network}.`}
+                    </p>
+                    <div className='space-x-2'>
                         <button onClick={handleCreateBotWallet} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">
-                            Create New Bot Wallet
+                            Add Wallet
                         </button>
+                        {botWallets.length > 0 && (
+                            <button onClick={handleClearBotWallets} className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded">
+                                Clear All
+                            </button>
+                        )}
                     </div>
-                )}
+                </div>
             </div>
 
-            {botKeypair ? (
-                <TradingBot
-                    key={botKeypair.publicKey.toBase58()}
-                    botPublicKeyString={botKeypair.publicKey.toBase58()}
-                    onFund={handleFundBot}
-                    onWithdraw={handleWithdrawFromBot}
-                    onWithdrawToken={handleWithdrawTokenFromBot}
-                    tokenMintAddress={tokenAddress}
-                    isLogicEnabled={isLogicEnabled} // Pass the prop down to the bot instance
-                />
+            {botWallets.length > 0 ? (
+                botWallets.map(wallet => (
+                    <TradingBot
+                        key={wallet.publicKey.toBase58()}
+                        botPublicKeyString={wallet.publicKey.toBase58()}
+                        onFund={createFundHandler(wallet)}
+                        onWithdraw={createWithdrawHandler(wallet)}
+                        onWithdrawToken={createWithdrawTokenHandler(wallet)}
+                        tokenMintAddress={tokenAddress}
+                        isLogicEnabled={isLogicEnabled}
+                    />
+                ))
             ) : (
                 <div className="text-center py-10 bg-gray-800 rounded-lg">
                     <p className="text-gray-400">Create a bot wallet to begin trading.</p>
                 </div>
             )}
         </div>
     );
 }
\ No newline at end of file
diff --git a/next-sniper/src/utils/botWalletManager.ts b/next-sniper/src/utils/botWalletManager.ts
index c4e35abf555f0648ddebb46a9004fdb6954d31b3..4a87843827db4be03e642ec47003a83398bafadb 100644
--- a/next-sniper/src/utils/botWalletManager.ts
+++ b/next-sniper/src/utils/botWalletManager.ts
@@ -1,52 +1,73 @@
 import { Keypair } from '@solana/web3.js';
 import { NetworkType } from '@/context/NetworkContext';
 
 const getEncryptionPassword = () => {
     return 'my-super-secret-password-that-should-be-user-provided';
 };
 
 export function generateBotWallet(): Keypair {
     const keypair = Keypair.generate();
     console.log(`[BotWalletManager] Generated new bot wallet: ${keypair.publicKey.toBase58()}`);
     return keypair;
 }
 
-export async function saveBotWallet(network: NetworkType, keypair: Keypair): Promise<void> {
+// Utilities for a single wallet are kept for backwards compatibility but the new
+// implementation focuses on handling multiple wallets.  The storage key now uses
+// the plural form `bot-wallets-${network}`.
+
+export function generateBotWallets(count: number): Keypair[] {
+    return Array.from({ length: count }, () => generateBotWallet());
+}
+
+export async function saveBotWallets(network: NetworkType, keypairs: Keypair[]): Promise<void> {
     try {
-        const secretKey = keypair.secretKey;
         const password = getEncryptionPassword();
-        const encryptedKey = secretKey.map((byte, index) => byte ^ password.charCodeAt(index % password.length));
-        
-        const keyToSave = JSON.stringify(Array.from(encryptedKey));
-        localStorage.setItem(`bot-wallet-${network}`, keyToSave);
-        console.log(`[BotWalletManager] Saved bot wallet for ${network} to localStorage.`);
+        const encryptedKeys = keypairs.map(kp => {
+            return Array.from(kp.secretKey).map((byte, idx) => byte ^ password.charCodeAt(idx % password.length));
+        });
+        localStorage.setItem(`bot-wallets-${network}`, JSON.stringify(encryptedKeys));
+        console.log(`[BotWalletManager] Saved ${keypairs.length} bot wallet(s) for ${network} to localStorage.`);
     } catch (error) {
-        console.error(`[BotWalletManager] Failed to save wallet for ${network}:`, error);
-        throw new Error("Failed to save bot wallet.");
+        console.error(`[BotWalletManager] Failed to save wallets for ${network}:`, error);
+        throw new Error('Failed to save bot wallets.');
     }
 }
 
-export function loadBotWallet(network: NetworkType): Keypair | null {
+export function loadBotWallets(network: NetworkType): Keypair[] {
     try {
-        const storedKey = localStorage.getItem(`bot-wallet-${network}`);
-        if (!storedKey) {
-            return null;
-        }
-        const encryptedKeyArray = JSON.parse(storedKey) as number[];
+        const stored = localStorage.getItem(`bot-wallets-${network}`);
+        if (!stored) return [];
+        const encrypted: number[][] = JSON.parse(stored);
         const password = getEncryptionPassword();
-        const decryptedKeyArray = encryptedKeyArray.map((byte, index) => byte ^ password.charCodeAt(index % password.length));
-        const secretKey = new Uint8Array(decryptedKeyArray);
-        const keypair = Keypair.fromSecretKey(secretKey);
-        console.log(`[BotWalletManager] Loaded bot wallet for ${network}: ${keypair.publicKey.toBase58()}`);
-        return keypair;
+        const wallets = encrypted.map(arr => {
+            const decrypted = arr.map((byte, idx) => byte ^ password.charCodeAt(idx % password.length));
+            const secretKey = new Uint8Array(decrypted);
+            return Keypair.fromSecretKey(secretKey);
+        });
+        console.log(`[BotWalletManager] Loaded ${wallets.length} bot wallet(s) for ${network}.`);
+        return wallets;
     } catch (error) {
-        console.error(`[BotWalletManager] Failed to load or decrypt wallet for ${network}:`, error);
-        clearBotWallet(network);
-        return null;
+        console.error(`[BotWalletManager] Failed to load wallets for ${network}:`, error);
+        clearBotWallets(network);
+        return [];
     }
 }
 
+export function clearBotWallets(network: NetworkType): void {
+    localStorage.removeItem(`bot-wallets-${network}`);
+    console.log(`[BotWalletManager] Cleared bot wallets for ${network}.`);
+}
+
+// Deprecated single-wallet helpers for compatibility with older components.
+export async function saveBotWallet(network: NetworkType, keypair: Keypair): Promise<void> {
+    await saveBotWallets(network, [keypair]);
+}
+
+export function loadBotWallet(network: NetworkType): Keypair | null {
+    const wallets = loadBotWallets(network);
+    return wallets[0] ?? null;
+}
+
 export function clearBotWallet(network: NetworkType): void {
-    localStorage.removeItem(`bot-wallet-${network}`);
-    console.log(`[BotWalletManager] Cleared bot wallet for ${network}.`);
+    clearBotWallets(network);
 }
\ No newline at end of file
