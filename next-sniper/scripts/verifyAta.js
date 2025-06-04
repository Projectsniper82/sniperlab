const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');

// --- Configuration ---
// Your CORRECT wallet address
const OWNER_WALLET_ADDRESS = 'DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs';
// The mint address of the token for which you want to find the ATA
// This is the GmbC... token (your output token from the swap)
const TOKEN_MINT_ADDRESS = 'GmbC2HgWpHpq9SHnmEXZNT5e1zgcU9oASDqbAkGTpump';

// Optional: RPC URL to verify if the ATA exists on-chain
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=f0617c48-43a7-4419-a7f9-9775f2226c75'; // You can use your preferred RPC

async function findAta() {
    console.log(`--- Finding ATA ---`);
    console.log(`Owner Wallet: ${OWNER_WALLET_ADDRESS}`);
    console.log(`Token Mint: ${TOKEN_MINT_ADDRESS}`);

    try {
        const ownerPublicKey = new PublicKey(OWNER_WALLET_ADDRESS);
        const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);

        // Derive the Associated Token Account address
        const associatedTokenAccountAddress = await getAssociatedTokenAddress(
            mintPublicKey,      // The token mint
            ownerPublicKey,     // The owner's wallet address
            false               // allowOwnerOffCurve (optional, defaults to false, usually false for ATAs)
            // TOKEN_PROGRAM_ID, // (optional, defaults to TOKEN_PROGRAM_ID)
            // ASSOCIATED_TOKEN_PROGRAM_ID // (optional, defaults to ASSOCIATED_TOKEN_PROGRAM_ID)
        );

        console.log(`\nDerived ATA Address: ${associatedTokenAccountAddress.toBase58()}`);

        // Optional: Check if the account exists on-chain
        console.log(`\n--- Verifying ATA On-Chain (Optional) ---`);
        const connection = new Connection(RPC_URL, 'confirmed');
        const ataAccountInfo = await connection.getAccountInfo(associatedTokenAccountAddress);

        if (ataAccountInfo === null) {
            console.log(`ATA Account ${associatedTokenAccountAddress.toBase58()} does NOT exist on-chain.`);
            console.log(`This means the Raydium SDK would need to create it during the swap.`);
        } else {
            console.log(`ATA Account ${associatedTokenAccountAddress.toBase58()} EXISTS on-chain.`);
            console.log(`  Owner Program: ${ataAccountInfo.owner.toBase58()}`);
            // You can add more details like balance if you parse ataAccountInfo.data using AccountLayout from @solana/spl-token
            // const { AccountLayout } = require('@solana/spl-token');
            // const accountData = AccountLayout.decode(ataAccountInfo.data);
            // console.log(`  Mint (from account data): ${new PublicKey(accountData.mint).toBase58()}`);
            // console.log(`  Owner (from account data): ${new PublicKey(accountData.owner).toBase58()}`);
            // console.log(`  Amount (lamports): ${accountData.amount.toString()}`);
        }

    } catch (error) {
        console.error("Error finding or verifying ATA:", error);
        if (error.message.includes("Invalid public key input")) {
            console.error("Please ensure OWNER_WALLET_ADDRESS and TOKEN_MINT_ADDRESS are valid base58 public key strings.");
        }
    }
}

findAta();