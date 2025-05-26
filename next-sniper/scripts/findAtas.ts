import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

// ---- INPUT: put your wallet and token mints here ----
const wallet = new PublicKey('DhH8JpPBn8AdUa6T7t7Fphw88ZWoC9vbRjL5iPqJm5cs');
const tokens = [
  { symbol: "WSOL", mint: 'So11111111111111111111111111111111111111112' },
  { symbol: "H5N", mint: 'h5NciPdMZ5QCB5BYETJMYBMpVx9ZuitR6HcVjyBhood' }
];
// ------------------------------------------------------

tokens.forEach(t => {
  const ata = getAssociatedTokenAddressSync(
    new PublicKey(t.mint),
    wallet,
    false // allowOwnerOffCurve = false for most use cases
  );
  console.log(`ATA for ${t.symbol} (${t.mint}): ${ata.toBase58()}`);
});

