export interface StrategyContext {
  rpcUrl: string;
  market?: {
    lastPrice: number;
    currentMarketCap: number;
    currentLpValue: number;
    solUsdPrice: number | null;
  };
  [key: string]: any;
}

export type TradingStrategy = (
  wallet: import('@solana/web3.js').Keypair,
  log: (msg: string) => void,
  context?: StrategyContext
) => Promise<void> | void;

export const defaultStrategy: TradingStrategy = async (_wallet, log, _context) => {
  log('executing default strategy');
};

export function compileStrategy(code: string): TradingStrategy {
  try {
    const exports: Record<string, any> = {};
     const fn = new Function('exports', 'context', code);
    fn(exports, {});
    if (typeof exports.strategy === 'function') {
      return exports.strategy as TradingStrategy;
    }
  } catch (err) {
    console.error('[compileStrategy] Failed to compile', err);
  }
  return defaultStrategy;
}