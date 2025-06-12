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

export async function saveBotWallet(network: NetworkType, keypair: Keypair): Promise<void> {
    try {
        const secretKey = keypair.secretKey;
        const password = getEncryptionPassword();
        const encryptedKey = secretKey.map((byte, index) => byte ^ password.charCodeAt(index % password.length));
        
        const keyToSave = JSON.stringify(Array.from(encryptedKey));
        localStorage.setItem(`bot-wallet-${network}`, keyToSave);
        console.log(`[BotWalletManager] Saved bot wallet for ${network} to localStorage.`);
    } catch (error) {
        console.error(`[BotWalletManager] Failed to save wallet for ${network}:`, error);
        throw new Error("Failed to save bot wallet.");
    }
}

export function loadBotWallet(network: NetworkType): Keypair | null {
    try {
        const storedKey = localStorage.getItem(`bot-wallet-${network}`);
        if (!storedKey) {
            return null;
        }
        const encryptedKeyArray = JSON.parse(storedKey) as number[];
        const password = getEncryptionPassword();
        const decryptedKeyArray = encryptedKeyArray.map((byte, index) => byte ^ password.charCodeAt(index % password.length));
        const secretKey = new Uint8Array(decryptedKeyArray);
        const keypair = Keypair.fromSecretKey(secretKey);
        console.log(`[BotWalletManager] Loaded bot wallet for ${network}: ${keypair.publicKey.toBase58()}`);
        return keypair;
    } catch (error) {
        console.error(`[BotWalletManager] Failed to load or decrypt wallet for ${network}:`, error);
        clearBotWallet(network);
        return null;
    }
}

export function clearBotWallet(network: NetworkType): void {
    localStorage.removeItem(`bot-wallet-${network}`);
    console.log(`[BotWalletManager] Cleared bot wallet for ${network}.`);
}