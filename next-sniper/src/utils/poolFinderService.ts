// poolFinderService.ts

import axios from 'axios'
import { Connection, PublicKey } from '@solana/web3.js'

// ─── CONFIG ─────────────────────────────────────────────────────────────────────

const RPC_URL         = 'https://api.mainnet-beta.solana.com'
const RAYDIUM_API_URL = 'https://api-v3.raydium.io/pools/info/mint'
const POOL_TYPES      = ['standard','clmm','stable','liquidity-ext'] as const
const MAX_RETRIES     = 3
const RETRY_DELAY_MS  = 1000

// ─── TYPES ──────────────────────────────────────────────────────────────────────

/** Minimal shape of the pools returned by /pools/info/mint */
export interface PoolInfo {
  id:           string
  poolType:     typeof POOL_TYPES[number]
  mintA:        { address: string }
  mintB:        { address: string }
  price:        string
  mintAmountA:  string
  mintAmountB:  string
}

// ─── UTILITIES ───────────────────────────────────────────────────────────────────

/** Normalize API responses into an array of PoolInfo */
function normalize(response: any): PoolInfo[] {
  if (!response) return []
  const arr = Array.isArray(response)
    ? response
    : Array.isArray(response.data)
      ? response.data
      : []
  return arr.filter((p: any) =>
    p?.id &&
    p?.mintA?.address &&
    p?.mintB?.address &&
    p?.price &&
    p?.mintAmountA &&
    p?.mintAmountB
  ) as PoolInfo[]
}

/**
 * Fetch pools of a given type for one mint (with simple retry)
 */
async function fetchByType(
  tokenMint: string,
  type: typeof POOL_TYPES[number],
  page: number = 1,
  pageSize: number = 100
): Promise<PoolInfo[]> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.get(RAYDIUM_API_URL, {
        params: {
          mint1:         tokenMint,
          mint2:         '',
          poolType:      type,
          poolSortField: 'default',
          sortType:      'desc',
          pageSize,
          page,
        }
      })
      return normalize(res.data).map(p => ({ ...p, poolType: type }))
    } catch (err: any) {
      console.warn(`[${type}] attempt ${attempt} failed:`, err.message)
      if (attempt === MAX_RETRIES) return []
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
    }
  }
  return []
}

/**
 * Fetch all pool types, paginated, dedupe by pool.id
 */
export async function findPoolsForMint(tokenMint: string): Promise<PoolInfo[]> {
  // 1) validate
  try {
    new PublicKey(tokenMint)
  } catch {
    throw new Error(`Invalid token mint address: ${tokenMint}`)
  }

  // 2) fan out all types + pages
  const seen: Record<string,PoolInfo> = {}
  await Promise.all(
    POOL_TYPES.map(async (type) => {
      let page = 1
      while (true) {
        const list = await fetchByType(tokenMint, type, page)
        if (list.length === 0) break
        list.forEach(p => { seen[p.id] = p })
        if (list.length < 100) break
        page++
      }
    })
  )

  return Object.values(seen)
}

// ─── (optional) SCRIPT ENTRYPOINT ────────────────────────────────────────────────

if (require.main === module) {
  // Example: in a standalone Node script you can still call it:
  const TOKEN_FROM_CLI = process.argv[2]
  if (!TOKEN_FROM_CLI) {
    console.error('Usage: ts-node poolFinderService.ts <tokenMint>')
    process.exit(1)
  }

  console.log(`\n🔎 finding all Raydium pools for: ${TOKEN_FROM_CLI}\n`)
  findPoolsForMint(TOKEN_FROM_CLI)
    .then(pools => {
      console.log(`Found ${pools.length} pool(s):\n`)
      pools.forEach((p,i) => {
        console.log(`#${i+1} [${p.poolType.toUpperCase()}] ID=${p.id}`)
      })
    })
    .catch(err => {
      console.error('Error:', err)
      process.exit(1)
    })
}
