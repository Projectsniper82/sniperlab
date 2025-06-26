import { Keypair } from '@solana/web3.js';
import { defaultStrategy, TradingStrategy } from './tradingStrategy';

interface BotLog {
  timestamp: number;
  message: string;
}

interface BotState {
  wallet: Keypair;
  isRunning: boolean;
  logs: BotLog[];
  intervalId?: NodeJS.Timeout;
  strategy: TradingStrategy;
  intervalMs: number;
}

const bots: Record<string, BotState> = {};

export function addBot(wallet: Keypair, strategy: TradingStrategy = defaultStrategy, intervalMs = 5000) {
  const id = wallet.publicKey.toBase58();
  if (!bots[id]) {
    bots[id] = { wallet, isRunning: false, logs: [], strategy, intervalMs };
  }
}

export function removeBot(id: string) {
  const bot = bots[id];
  if (bot?.intervalId) clearInterval(bot.intervalId);
  delete bots[id];
}

export function startBot(id: string, strategy?: TradingStrategy, intervalMs?: number) {
  const bot = bots[id];
  if (!bot || bot.isRunning) return;
  if (strategy) bot.strategy = strategy;
  if (intervalMs) bot.intervalMs = intervalMs;
  bot.isRunning = true;
  bot.intervalId = setInterval(async () => {
    try {
      await bot.strategy(bot.wallet, (msg) => log(id, msg));
    } catch (e: any) {
      log(id, `error: ${e.message || e}`);
    }
  }, bot.intervalMs);
}

export function stopBot(id: string) {
  const bot = bots[id];
  if (!bot || !bot.isRunning) return;
  if (bot.intervalId) clearInterval(bot.intervalId);
  bot.intervalId = undefined;
  bot.isRunning = false;
}

export function log(id: string, message: string) {
  const bot = bots[id];
  if (!bot) return;
  bot.logs.unshift({ timestamp: Date.now(), message });
  if (bot.logs.length > 100) bot.logs.pop();
}

export function getLogs(id: string): BotLog[] {
  return bots[id]?.logs ?? [];
}

export function isRunning(id: string): boolean {
  return bots[id]?.isRunning ?? false;
}

export function listBots(): string[] {
  return Object.keys(bots);
}