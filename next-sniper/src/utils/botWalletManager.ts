import { Keypair } from '@solana/web3.js';
import { NetworkType } from '@/context/NetworkContext';

let cachedPassword: string | null = null;

export const resetEncryptionPassword = (): void => {
    cachedPassword = null;
};

const getEncryptionPassword = (): string => {
    if (cachedPassword) return cachedPassword;
    const envPass = process.env.NEXT_PUBLIC_WALLET_PASSWORD;
    if (envPass && envPass !== '') {
        cachedPassword = envPass;
        return envPass;
    }
    if (typeof window !== 'undefined') {
        const input = window.prompt('Enter encryption password for bot wallets:');
        if (input && input !== '') {
            cachedPassword = input;
            return input;
        }
    }
    throw new Error('Encryption password not provided');
};

export function generateBotWallet(): Keypair {
    const keypair = Keypair.generate();
    console.log(`[BotWalletManager] Generated new bot wallet: ${keypair.publicKey.toBase58()}`);
    return keypair;
}

// Utilities for a single wallet are kept for backwards compatibility but the new
// implementation focuses on handling multiple wallets. The storage key now uses
// the plural form `bot-wallets-${network}` and is normalized so mainnet-beta is
// stored under `bot-wallets-mainnet`.

const storageKey = (network: NetworkType) => {
    const net = network === 'devnet' ? 'devnet' : 'mainnet';
    return `bot-wallets-${net}`;
};

export function generateBotWallets(count: number): Keypair[] {
    return Array.from({ length: count }, () => generateBotWallet());
}

const MARKER = 'wallets_v1';

export async function saveBotWallets(network: NetworkType, keypairs: Keypair[]): Promise<void> {
    try {
        const password = getEncryptionPassword();

        const markerBytes = Array.from(new TextEncoder().encode(MARKER)).map((b, idx) => b ^ password.charCodeAt(idx % password.length));

        const encryptedKeys = keypairs.map(kp => {
            return Array.from(kp.secretKey).map((byte, idx) => byte ^ password.charCodeAt(idx % password.length));
        });

        const payload = { marker: markerBytes, wallets: encryptedKeys };

        localStorage.setItem(storageKey(network), JSON.stringify(payload));
        console.log(`[BotWalletManager] Saved ${keypairs.length} bot wallet(s) for ${network} to localStorage.`);
    } catch (error) {
        console.error(`[BotWalletManager] Failed to save wallets for ${network}:`, error);
        throw new Error('Failed to save bot wallets.');
    }
}

export function loadBotWallets(network: NetworkType): Keypair[] {
    try {
        const stored = localStorage.getItem(storageKey(network));
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        const password = getEncryptionPassword();

        // Backwards compatibility: if parsed is an array, treat as old format
        let encryptedWallets: number[][];
        let markerBytes: number[] | null = null;

        if (Array.isArray(parsed)) {
            encryptedWallets = parsed as number[][];
        } else {
            encryptedWallets = parsed.wallets;
            markerBytes = parsed.marker;
        }

        if (markerBytes) {
            const markerDecoded = markerBytes.map((byte: number, idx: number) => byte ^ password.charCodeAt(idx % password.length));
            const markerString = new TextDecoder().decode(Uint8Array.from(markerDecoded));
            if (markerString !== MARKER) {
                throw new Error('Incorrect password for bot wallets.');
            }
        }

        const wallets = encryptedWallets.map(arr => {
            const decrypted = arr.map((byte, idx) => byte ^ password.charCodeAt(idx % password.length));
            const secretKey = new Uint8Array(decrypted);
            return Keypair.fromSecretKey(secretKey);
        });
        console.log(`[BotWalletManager] Loaded ${wallets.length} bot wallet(s) for ${network}.`);
        return wallets;
    } catch (error) {
        console.error(`[BotWalletManager] Failed to load wallets for ${network}:`, error);
        resetEncryptionPassword();
        throw new Error('Failed to load bot wallets. Please re-enter the correct password.');
    }
}

export function clearBotWallets(network: NetworkType): void {
     localStorage.removeItem(storageKey(network));
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