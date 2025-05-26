import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token'

/**
 * Checks if an Associated Token Account (ATA) exists for a given mint & wallet,
 * creates it if not, and returns its public key.
 *
 * @param connection      - Solana RPC connection
 * @param walletPublicKey - User or bot wallet public key
 * @param mintPublicKey   - SPL token mint public key (input or output token)
 * @param payer           - Wallet that pays for ATA creation (usually same as walletPublicKey)
 * @param signTransaction - Function to sign and send the transaction (Phantom or bot wallet)
 * @returns               - PublicKey of the ATA (guaranteed to exist after running)
 */
export async function getOrCreateATA({
  connection,
  walletPublicKey,
  mintPublicKey,
  payer,
  signTransaction, // (transaction: Transaction) => Promise<Transaction>
}: {
  connection: Connection
  walletPublicKey: PublicKey
  mintPublicKey: PublicKey
  payer: PublicKey
  signTransaction: (transaction: Transaction) => Promise<Transaction>
}): Promise<PublicKey> {
  console.log(`[ATA] Checking ATA for wallet ${walletPublicKey.toBase58()} and mint ${mintPublicKey.toBase58()}`)

  // 1. Calculate the expected ATA address
  const ata = await getAssociatedTokenAddress(mintPublicKey, walletPublicKey, false)
  console.log(`[ATA] Expected ATA: ${ata.toBase58()}`)

  // 2. See if it exists
  const ataInfo = await connection.getAccountInfo(ata)
  if (ataInfo) {
    console.log(`[ATA] Exists ✅`)
    return ata
  }

  // 3. Create if not exists
  console.log(`[ATA] Not found, creating...`)
  const ix = createAssociatedTokenAccountInstruction(
    payer,          // Payer of the transaction
    ata,            // ATA address to create
    walletPublicKey, // Owner of the ATA
    mintPublicKey,   // SPL token mint
  )

  const tx = new Transaction().add(ix)
  tx.feePayer = payer
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  // Let wallet (or bot) sign it
  const signed = await signTransaction(tx)

  // 4. Send and confirm
  const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false })
  await connection.confirmTransaction(sig, 'confirmed')
  console.log(`[ATA] Created: ${ata.toBase58()} ✅ | Tx: ${sig}`)

  return ata
}
