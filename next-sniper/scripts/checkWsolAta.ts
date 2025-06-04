import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, NATIVE_MINT } from '@solana/spl-token';

async function main() {
  // Connect to mainnet
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // Replace with your wallet public key (as string)
  const walletPubkeyString = 'DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs';
  const walletPubkey = new PublicKey(walletPubkeyString);

  // WSOL mint address (native mint)
  const wsolMint = NATIVE_MINT; // So11111111111111111111111111111111111111112

  // Derive the ATA for WSOL for your wallet
  const ata = await getAssociatedTokenAddress(
    wsolMint,
    walletPubkey,
    false,
    TOKEN_PROGRAM_ID
  );

  console.log('Wallet:', walletPubkey.toBase58());
  console.log('WSOL ATA:', ata.toBase58());

  // Check if ATA account exists
  const accountInfo = await connection.getAccountInfo(ata);

  if (accountInfo === null) {
    console.log('ATA does NOT exist on mainnet.');
  } else {
    console.log('ATA exists on mainnet with lamports:', accountInfo.lamports);
  }
}

main().catch(console.error);
