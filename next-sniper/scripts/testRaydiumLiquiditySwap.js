const fs = require('fs');
const { Connection, Keypair, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const {
    Raydium,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    Percent,
    Token,
    TokenAmount,
    CurrencyAmount,
    // We need to find where LIQUIDITY_STATE_LAYOUT_V4 or its equivalent is.
    // It might be nested, e.g., within Raydium.liquidity or a specific layouts import.
    // For example: const { LIQUIDITY_STATE_LAYOUT_V4 } = require('@raydium-io/raydium-sdk-v2/lib/liquidity');
    // Or accessible via the loaded `raydium` instance if it exposes layouts.
    Liquidity // Keep this as it might be used for Liquidity.getAssociatedAuthority
} = require('@raydium-io/raydium-sdk-v2');
const splToken = require('@solana/spl-token');
const BN = require('bn.js');

// -------- CONFIGURATION START --------
const WALLET_PATH = '/home/sniperbot_1/.config/solana/id.json';
const RPC = 'https://api.mainnet-beta.solana.com';

const POOL_ID = new PublicKey('3oEFniXw6csxTyMen7wTCJeEAiVGsAbniwcMGQczb6iK');
const INPUT_MINT_ADDRESS = NATIVE_MINT; // WSOL
const OUTPUT_MINT_ADDRESS = new PublicKey('GmbC2HgWpHpq9SHnmEXZNT5e1zgcU9oASDqbAkGTpump');
const SWAP_AMOUNT_IN_LAMPORTS = new BN(10000000); // 0.01 SOL
const SLIPPAGE_BPS = 50; // 0.5%

const RAYDIUM_V4_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');

const STATIC_FEE_CONFIG = { feeRate: 0.0025, protocolFeeRate: 0.0003 };
// -------- CONFIGURATION END --------

async function main() {
    console.log('[PROBE] Loading wallet from:', WALLET_PATH);
    const secret = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf8'));
    const ownerKeypair = Keypair.fromSecretKey(new Uint8Array(secret));
    console.log('[PROBE] Wallet public key:', ownerKeypair.publicKey.toBase58());

    const connection = new Connection(RPC, 'confirmed');
    console.log('[PROBE] Created mainnet connection.');

    console.log('[PROBE] Loading Raydium SDK instance...');
    const raydium = await Raydium.load({ connection, owner: ownerKeypair });
    if (!raydium || typeof raydium.liquidity.swap !== 'function') {
        console.error('[ERROR] Failed to load Raydium SDK or raydium.liquidity.swap is not a function.');
        process.exit(1);
    }
    console.log('[PROBE] Raydium SDK instance loaded. liquidity.swap is available.');

    // Step 1: Fetch pool account data by poolId on-chain
    console.log('[PROBE] Fetching raw account data for POOL_ID:', POOL_ID.toBase58());
    const poolAccountLamports = await connection.getBalance(POOL_ID);
    if (poolAccountLamports === 0) {
        console.error(`[ERROR] Pool account ${POOL_ID.toBase58()} has zero lamports. It might not exist or be initialized.`);
        process.exit(1);
    }
    const poolAccountDataBuffer = (await connection.getAccountInfo(POOL_ID, 'confirmed'))?.data;
    if (!poolAccountDataBuffer) {
        console.error('[ERROR] Failed to fetch raw pool account data buffer for POOL_ID:', POOL_ID.toBase58());
        process.exit(1);
    }
    console.log(`[PROBE] Raw pool account data buffer fetched (length: ${poolAccountDataBuffer.length}).`);

    // Step 2: Decode pool layout (SDK LiquidityStateLayoutV4.decode or custom)
    let actualPoolInfo; // This is the "poolInfo (decoded layout object)"
    try {
        // CRITICAL: Find the correct V4 layout decoder from your SDK version.
        // This is the most likely point of failure if the path/method is wrong.
        // "ChatGPT said.txt" refers to "LiquidityStateLayoutV4.decode".
        // It might be Raydium.layouts.LIQUIDITY_STATE_LAYOUT_V4.decode or similar.
        // Or from the 'Liquidity' import if that has static layouts.

        let V4LayoutDecoder = null;
        // Attempt common locations based on SDK patterns (these are guesses):
        if (Raydium.layouts && Raydium.layouts.LIQUIDITY_STATE_LAYOUT_V4 && typeof Raydium.layouts.LIQUIDITY_STATE_LAYOUT_V4.decode === 'function') {
            V4LayoutDecoder = Raydium.layouts.LIQUIDITY_STATE_LAYOUT_V4;
            console.log("[INFO] Found V4LayoutDecoder at Raydium.layouts.LIQUIDITY_STATE_LAYOUT_V4");
        } else if (raydium.liquidity && raydium.liquidity.constructor && raydium.liquidity.constructor.STRUCTS && raydium.liquidity.constructor.STRUCTS.LIQUIDITY_STATE_LAYOUT_V4 && typeof raydium.liquidity.constructor.STRUCTS.LIQUIDITY_STATE_LAYOUT_V4.decode === 'function') {
            V4LayoutDecoder = raydium.liquidity.constructor.STRUCTS.LIQUIDITY_STATE_LAYOUT_V4;
             console.log("[INFO] Found V4LayoutDecoder at raydium.liquidity.constructor.STRUCTS.LIQUIDITY_STATE_LAYOUT_V4");
        }
        // Add more attempts here if you find other potential paths from SDK source/docs
        // For example, if Liquidity is a class with static layouts:
        // else if (typeof Liquidity !== 'undefined' && Liquidity.layouts && Liquidity.layouts.LIQUIDITY_STATE_LAYOUT_V4 && typeof Liquidity.layouts.LIQUIDITY_STATE_LAYOUT_V4.decode === 'function') {
        // V4LayoutDecoder = Liquidity.layouts.LIQUIDITY_STATE_LAYOUT_V4;
        // console.log("[INFO] Found V4LayoutDecoder at Liquidity.layouts.LIQUIDITY_STATE_LAYOUT_V4");
        // }


        if (!V4LayoutDecoder) {
            throw new Error("Could not find LIQUIDITY_STATE_LAYOUT_V4.decode in the SDK. You need to locate this specific decoder for AMM V4 pools. Check SDK documentation or source for its exact path/export name.");
        }

        actualPoolInfo = V4LayoutDecoder.decode(poolAccountDataBuffer);
        console.log('[PROBE] Pool account data decoded manually.');
        // console.log('[DEBUG] Manually decoded actualPoolInfo:', actualPoolInfo);

        if (!actualPoolInfo.id) actualPoolInfo.id = POOL_ID; // Add ID if decoder doesn't

    } catch (e) {
        console.error('[ERROR] Could not decode pool state manually:', e.message, e.stack);
        console.log("[INFO] This script relies on finding the SDK's V4 liquidity layout decoder. The path to this decoder needs to be correct.");
        process.exit(1);
    }


    // Step 3: Build poolKeys object
    const constructedPoolKeys = {
        id: POOL_ID,
        programId: RAYDIUM_V4_PROGRAM_ID, // Should match actualPoolInfo.programId
        mintA: new PublicKey(actualPoolInfo.baseMint),
        mintB: new PublicKey(actualPoolInfo.quoteMint),
        vaultA: new PublicKey(actualPoolInfo.baseVault),
        vaultB: new PublicKey(actualPoolInfo.quoteVault),
        lpMint: new PublicKey(actualPoolInfo.lpMint),
        feeConfig: STATIC_FEE_CONFIG,

        baseDecimals: actualPoolInfo.baseDecimal.toNumber ? actualPoolInfo.baseDecimal.toNumber() : actualPoolInfo.baseDecimal,
        quoteDecimals: actualPoolInfo.quoteDecimal.toNumber ? actualPoolInfo.quoteDecimal.toNumber() : actualPoolInfo.quoteDecimal,
        version: 4,
        authority: new PublicKey(actualPoolInfo.authority),
        marketId: new PublicKey(actualPoolInfo.marketId),
        marketProgramId: new PublicKey(actualPoolInfo.marketProgramId),
        marketAuthority: new PublicKey(actualPoolInfo.marketAuthority || (typeof Liquidity !== 'undefined' ? Liquidity.getAssociatedAuthority({ programId: new PublicKey(actualPoolInfo.marketProgramId), marketId: new PublicKey(actualPoolInfo.marketId) }).publicKey : null)), // Market authority might need derivation
        marketBaseVault: new PublicKey(actualPoolInfo.marketBaseVault),
        marketQuoteVault: new PublicKey(actualPoolInfo.marketQuoteVault),
        openOrders: new PublicKey(actualPoolInfo.targetOrders || actualPoolInfo.openOrders) // <-- COMMA REMOVED HERE
    };
    console.log('[PROBE] Constructed `poolKeys` object with static feeConfig.');


    const inputTokenDecimals = constructedPoolKeys.mintA.equals(INPUT_MINT_ADDRESS)
        ? constructedPoolKeys.baseDecimals
        : constructedPoolKeys.quoteDecimals;
    const outputTokenDecimals = constructedPoolKeys.mintB.equals(OUTPUT_MINT_ADDRESS)
        ? constructedPoolKeys.quoteDecimals
        : constructedPoolKeys.baseDecimals;

    if (typeof inputTokenDecimals !== 'number' || typeof outputTokenDecimals !== 'number') {
        console.error('[ERROR] Could not determine token decimals correctly from decoded pool info and input/output mints.');
        process.exit(1);
    }

    const inputTokenMeta = new Token(INPUT_MINT_ADDRESS, inputTokenDecimals);
    const outputTokenMeta = new Token(OUTPUT_MINT_ADDRESS, outputTokenDecimals);

    const amountIn = new TokenAmount(inputTokenMeta, SWAP_AMOUNT_IN_LAMPORTS, false);
    const slippage = new Percent(SLIPPAGE_BPS, 10000);

    let minAmountOut;
    try {
        const computeResult = raydium.liquidity.computeAmountOut({
            poolKeys: constructedPoolKeys,
            poolInfo: actualPoolInfo,
            amountIn: amountIn,
            currencyOut: outputTokenMeta,
            slippage: slippage,
        });
        minAmountOut = computeResult.minAmountOut;
        console.log(`[PROBE] Min Amount Out (after slippage ${slippage.toFixed()}%): ${minAmountOut.toExact()}`);
    } catch(e) {
        console.error("[ERROR] Failed to compute amount out using raydium.liquidity.computeAmountOut:", e.message, e.stack);
        process.exit(1);
    }

    const swapParams = {
        poolInfo: actualPoolInfo,
        poolKeys: constructedPoolKeys,
        amountIn: SWAP_AMOUNT_IN_LAMPORTS,
        amountOut: minAmountOut.raw,
        inputMint: INPUT_MINT_ADDRESS.toBase58(),
        fixedSide: 'in',
        txVersion: 'V0',
        config: {
            associatedOnly: true,
            inputUseSolBalance: INPUT_MINT_ADDRESS.equals(NATIVE_MINT),
            outputUseSolBalance: OUTPUT_MINT_ADDRESS.equals(NATIVE_MINT),
        },
        feePayer: ownerKeypair.publicKey
    };

    console.log('[PROBE] Calling raydium.liquidity.swap with manually prepared params...');

    try {
        const swapResult = await raydium.liquidity.swap(swapParams);

        let transactionsToSimulate = [];
        if (swapResult.setupTransaction) transactionsToSimulate.push(swapResult.setupTransaction);
        if (swapResult.tradeTransaction) {
            transactionsToSimulate.push(swapResult.tradeTransaction);
        } else if (swapResult.transaction) {
             transactionsToSimulate.push(swapResult.transaction);
        } else if (Array.isArray(swapResult.transactions)) {
            transactionsToSimulate.push(...swapResult.transactions);
        } else if (swapResult.signers && swapResult.transaction) {
            transactionsToSimulate.push(swapResult.transaction);
        } else if (swapResult.instructions && swapResult.recentBlockhash) {
             transactionsToSimulate.push(swapResult);
        }


        if (transactionsToSimulate.length === 0) {
             if (swapResult.txId) {
                console.log('[INFO] Swap function might have directly submitted. TxId:', swapResult.txId);
             } else {
                console.error("[ERROR] No transactions were returned by raydium.liquidity.swap for simulation. Result:", swapResult);
             }
            process.exit(1);
        }
        console.log(`[PROBE] Swap function returned ${transactionsToSimulate.length} transaction object(s).`);

        for (let i = 0; i < transactionsToSimulate.length; i++) {
            let tx = transactionsToSimulate[i];
            if (!(tx instanceof Transaction)) {
                 console.warn(`[WARN] Item ${i+1} is not a Transaction object. Attempting to rebuild if possible.`);
                 if (tx.instructions && tx.recentBlockhash) {
                    const rebuiltTx = new Transaction({
                        recentBlockhash: tx.recentBlockhash,
                        feePayer: tx.feePayer || ownerKeypair.publicKey
                    });
                    rebuiltTx.add(...tx.instructions);
                    if (tx.signers && Array.isArray(tx.signers)) rebuiltTx.partialSign(...tx.signers);
                    tx = rebuiltTx;
                 } else {
                    console.error(`[ERROR] Cannot simulate item ${i+1} as it's not a valid transaction structure.`);
                    continue;
                 }
            }

            if (!tx.recentBlockhash) tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
            if (!tx.feePayer) tx.feePayer = ownerKeypair.publicKey;

            console.log(`[PROBE] Simulating transaction ${i + 1}/${transactionsToSimulate.length}...`);
            const simulationResult = await connection.simulateTransaction(tx, { commitment: 'confirmed' });

            if (simulationResult.value.err) {
                console.error(`[ERROR] Simulation failed for transaction ${i + 1}:`, simulationResult.value.err);
                console.error(`[ERROR LOGS (transaction ${i + 1})]:`, simulationResult.value.logs);
            } else {
                console.log(`[RESULT] Simulation successful for transaction ${i + 1}!`);
                console.log(`[RESULT] Units consumed:`, simulationResult.value.unitsConsumed);
                console.log(`[RESULT] Logs:`, simulationResult.value.logs ? simulationResult.value.logs.join('\n') : 'No logs.');
            }
        }

    } catch (e) {
        console.error('[ERROR] Error during raydium.liquidity.swap call or simulation:', e.message, e.stack);
        if (e.logs) console.error("Logs from error:", e.logs);
    }
}

main().catch(err => {
    console.error('[FATAL SCRIPT ERROR]', err.message, err.stack);
    process.exit(1);
});

