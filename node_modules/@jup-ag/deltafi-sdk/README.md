# deltafi-sdk

This repository contains deltafi-dex-v2 anchor client and example to do swap on deltafi-dex-v2.

## Instruction to run the example

Install packages first:
``` 
yarn install
```

Then run the example with test keypair on testnet
```
yarn ts-node src/example/example.ts swap -k ./keypairs/testnet-keypair.json -n testnet
```

You can also use your own keypair on mainnet-beta to swap `1` token between `USDC` and `USDT`
```
yarn ts-node src/example/example.ts swap -k <your_keypair> -n mainnet-beta
```

Deposit `1` token to `USDC-USDT` pool.
```
yarn ts-node src/example/example.ts deposit -k <your_keypair> -n mainnet-beta
```

Withdraw `1` token from `USDC-USDT` pool.
```
yarn ts-node src/example/example.ts withdraw -k <your_keypair> -n mainnet-beta
```

The config in this repo may not be up to date. You can read the latest config with our public api.
```
yarn ts-node src/example/example.ts get-config
```
The response will contain all available swap pools.

