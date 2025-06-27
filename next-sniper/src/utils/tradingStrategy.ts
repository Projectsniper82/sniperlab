export type TradingStrategy = (wallet: import('@solana/web3.js').Keypair, log: (msg: string) => void) => Promise<void> | void;

export const defaultStrategy: TradingStrategy = async (_wallet, log) => {
  log('executing default strategy');
};

export function compileStrategy(code: string): TradingStrategy {
  try {
    const exports: Record<string, any> = {};
    const fn = new Function('exports', code);
    fn(exports);
    if (typeof exports.strategy === 'function') {
      return exports.strategy as TradingStrategy;
    }
  } catch (err) {
    console.error('[compileStrategy] Failed to compile', err);
  }
  return defaultStrategy;
}