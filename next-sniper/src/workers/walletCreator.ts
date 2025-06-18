self.onmessage = async (ev) => {
  const { totalSol, duration, network, rpcUrl } = ev.data;
  const web3 = await import('@solana/web3.js');
  const connection = new web3.Connection(rpcUrl, 'confirmed');

  const bots: any[] = [];
  const intermediates: any[] = [];
  for (let i = 0; i < 6; i++) {
    bots.push(web3.Keypair.generate());
    intermediates.push(web3.Keypair.generate());
  }

  self.postMessage({
    log: `Generated 6 bot wallets and 6 intermediate wallets`,
  });

  const base = totalSol / 6;
  let remaining = totalSol;
  const amounts: number[] = [];
  for (let i = 0; i < 5; i++) {
    const amt = parseFloat((base * (1 + (Math.random() * 0.2 - 0.1))).toFixed(4));
    amounts.push(amt);
    remaining -= amt;
  }
  amounts.push(parseFloat(remaining.toFixed(4)));

  const durationMs = duration * 60 * 1000;
  let elapsed = 0;

  for (let i = 0; i < 6; i++) {
    let delay = Math.floor(5000 + Math.random() * 30000);
    elapsed += delay;
    if (elapsed > durationMs) {
      delay -= elapsed - durationMs;
      elapsed = durationMs;
    }
    setTimeout(() => processWallet(i, amounts[i]), delay);
  }

  async function processWallet(index: number, amount: number) {
    const intWallet = intermediates[index];
    const botWallet = bots[index];
    try {
      self.postMessage({ log: `Funding bot ${index + 1} with ${amount.toFixed(3)} SOL` });

      if (network === 'devnet') {
        const sig = await connection.requestAirdrop(intWallet.publicKey, amount * web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(sig, 'confirmed');
        self.postMessage({ log: `Airdropped ${amount.toFixed(3)} SOL to intermediate ${index + 1}` });
      } else {
        self.postMessage({ log: `Please send ${amount.toFixed(3)} SOL to ${intWallet.publicKey.toBase58()} from your wallet` });
      }

      const tx = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: intWallet.publicKey,
          toPubkey: botWallet.publicKey,
          lamports: amount * web3.LAMPORTS_PER_SOL,
        }),
      );
      const sig2 = await web3.sendAndConfirmTransaction(connection, tx, [intWallet]);
      self.postMessage({ log: `Transferred ${amount.toFixed(3)} SOL to bot ${index + 1} (${sig2})` });
    } catch (err: any) {
      self.postMessage({ log: `Error funding bot ${index + 1}: ${err.message}` });
    }
  }
};
export {};