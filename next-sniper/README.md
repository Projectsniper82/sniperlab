This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Recover Phantom Wallet

Use `recoverPhantom.js` to generate a Phantom wallet keypair from a mnemonic. Set the `PHANTOM_SEED` environment variable with your seed phrase before running the script

```bash
PHANTOM_SEED="word1 word2 ... word12" node recoverPhantom.js
```

## Wallet Creation

Wallets are generated directly in the browser when you start the bot creation process. The previous worker build step is no longer required.

Wallets are saved to local storage as soon as funding begins. Early saving
prevents loss of generated wallets if a transfer fails. They are saved again
once all transfers complete for confirmation.

## Strategy Context

WWhen trading bots execute, a `context` object is passed to your strategy
function. The object currently includes:

-`rpcUrl` – the RPC endpoint used for the current network. The worker will
  reconstruct a `Connection` instance from this URL and expose it as
  `context.connection` for your strategy.
- `market` – basic market information with the following fields:
  - `lastPrice` – latest observed token price.
  - `currentMarketCap` – market capitalization derived from pool reserves.
  - `currentLpValue` – total liquidity value in SOL.
  - `solUsdPrice` – current SOL/USD price or `null` if unavailable.

Strategies can inspect these values to make trading decisions.

### Advanced Mode

When Advanced Mode is enabled, your strategy receives an additional
`systemState` property on the context object. This contains aggregated
information about every bot managed by the application, including a list of
all bots and a running tally of how many trades each bot has executed.