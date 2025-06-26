export type TradingStrategy = (wallet: import('@solana/web3.js').Keypair, log: (msg: string) => void) => Promise<void> | void;

export const defaultStrategy: TradingStrategy = async (_wallet, log) => {
  log('executing default strategy');
};