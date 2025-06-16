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

// Utilities for a single wallet are kept for backwards compatibility but the new
// implementation focuses on handling multiple wallets.  The storage key now uses
// the plural form `bot-wallets-${network}`.

export function generateBotWallets(count: number): Keypair[] {
    return Array.from({ length: count }, () => generateBotWallet());
}

export async function saveBotWallets(network: NetworkType, keypairs: Keypair[]): Promise<void> {
    try {
        const password = getEncryptionPassword();
        const encryptedKeys = keypairs.map(kp => {
            return Array.from(kp.secretKey).map((byte, idx) => byte ^ password.charCodeAt(idx % password.length));
        });
        localStorage.setItem(`bot-wallets-${network}`, JSON.stringify(encryptedKeys));
        console.log(`[BotWalletManager] Saved ${keypairs.length} bot wallet(s) for ${network} to localStorage.`);
    } catch (error) {
        console.error(`[BotWalletManager] Failed to save wallets for ${network}:`, error);
        throw new Error('Failed to save bot wallets.');
    }
}

export function loadBotWallets(network: NetworkType): Keypair[] {
    try {
        const stored = localStorage.getItem(`bot-wallets-${network}`);
        if (!stored) return [];
        const encrypted: number[][] = JSON.parse(stored);
        const password = getEncryptionPassword();
        const wallets = encrypted.map(arr => {
            const decrypted = arr.map((byte, idx) => byte ^ password.charCodeAt(idx % password.length));
            const secretKey = new Uint8Array(decrypted);
            return Keypair.fromSecretKey(secretKey);
        });
        console.log(`[BotWalletManager] Loaded ${wallets.length} bot wallet(s) for ${network}.`);
        return wallets;
    } catch (error) {
        console.error(`[BotWalletManager] Failed to load wallets for ${network}:`, error);
        clearBotWallets(network);
        return [];
    }
}

export function clearBotWallets(network: NetworkType): void {
    localStorage.removeItem(`bot-wallets-${network}`);
    console.log(`[BotWalletManager] Cleared bot wallets for ${network}.`);
}

// Deprecated single-wallet helpers for compatibility with older components.
export async function saveBotWallet(network: NetworkType, keypair: Keypair): Promise<void> {
    await saveBotWallets(network, [keypair]);
}

export function loadBotWallet(network: NetworkType): Keypair | null {
    const wallets = loadBotWallets(network);
    return wallets[0] ?? null;
}

export function clearBotWallet(network: NetworkType): void {
    clearBotWallets(network);
}