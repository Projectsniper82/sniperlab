// scripts/clmmSwapHelper.ts

import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import BN from 'bn.js'

// Simple Buffer helpers from SDK, you probably have them already but included here for copy-paste.
function u64(name: string) {
    return { property: name, type: 'u64' }
}
function u128(name: string) {
    return { property: name, type: 'u128' }
}
function bool(name: string) {
    return { property: name, type: 'bool' }
}
function struct(fields: any[]) {
    // Minimal fake struct, real one should encode data correctly. Replace if you have a better implementation.
    // For now, just allocate a dummy Buffer. You'll want to swap for SDK's real "struct" for production use.
    return {
        span: 64,
        encode: (_: any, buf: Buffer) => { buf.fill(0) }
    }
}

// ==========
// Replace these with your actual program IDs/constants if needed
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdGj5bLyzSRmJ5r5yVZKDgMkQ3FscKwtjA8QZ')
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
const ZERO = new BN(0)
// ==========

const anchorDataBuf = {
    swap: [43, 4, 237, 11, 26, 201, 30, 98],
}

export function swapInstruction(
    programId: PublicKey,
    payer: PublicKey,
    poolId: PublicKey,
    ammConfigId: PublicKey,
    inputTokenAccount: PublicKey,
    outputTokenAccount: PublicKey,
    inputVault: PublicKey,
    outputVault: PublicKey,
    inputMint: PublicKey,
    outputMint: PublicKey,
    tickArray: PublicKey[],
    observationId: PublicKey,
    amount: BN,
    otherAmountThreshold: BN,
    sqrtPriceLimitX64: BN,
    isBaseInput: boolean,
    exTickArrayBitmap?: PublicKey,
) {
    const dataLayout = struct([
        u64('amount'),
        u64('otherAmountThreshold'),
        u128('sqrtPriceLimitX64'),
        bool('isBaseInput'),
    ])

    const remainingAccounts = [
        ...(exTickArrayBitmap ? [{ pubkey: exTickArrayBitmap, isSigner: false, isWritable: true }] : []),
        ...tickArray.map((i) => ({ pubkey: i, isSigner: false, isWritable: true })),
    ]

    const keys = [
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: ammConfigId, isSigner: false, isWritable: false },
        { pubkey: poolId, isSigner: false, isWritable: true },
        { pubkey: inputTokenAccount, isSigner: false, isWritable: true },
        { pubkey: outputTokenAccount, isSigner: false, isWritable: true },
        { pubkey: inputVault, isSigner: false, isWritable: true },
        { pubkey: outputVault, isSigner: false, isWritable: true },
        { pubkey: observationId, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: MEMO_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: inputMint, isSigner: false, isWritable: false },
        { pubkey: outputMint, isSigner: false, isWritable: false },
        ...remainingAccounts,
    ]

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
        {
            amount,
            otherAmountThreshold,
            sqrtPriceLimitX64,
            isBaseInput,
        },
        data,
    )

    const aData = Buffer.from([...anchorDataBuf.swap, ...data])

    return new TransactionInstruction({
        keys,
        programId,
        data: aData,
    })
}
