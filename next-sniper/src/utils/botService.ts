import { Keypair } from '@solana/web3.js';

interface BotLog {
  timestamp: number;
  message: string;
}

interface BotState {
  wallet: Keypair;
  isRunning: boolean;
  logs: BotLog[];
  intervalId?: NodeJS.Timeout;
}

const bots: Record<string, BotState> = {};

export function addBot(wallet: Keypair) {
  const id = wallet.publicKey.toBase58();
  if (!bots[id]) {
    bots[id] = { wallet, isRunning: false, logs: [] };
  }
}

export function removeBot(id: string) {
  const bot = bots[id];
  if (bot?.intervalId) clearInterval(bot.intervalId);
  delete bots[id];
}

export function startBot(id: string) {
  const bot = bots[id];
  if (!bot || bot.isRunning) return;
  bot.isRunning = true;
  bot.intervalId = setInterval(() => {
    log(id, 'running');
    // TODO: hook real trading logic here
  }, 5000);
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