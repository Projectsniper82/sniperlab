import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { Commitment, Connection, Transaction } from "@solana/web3.js";
import { SendTxRequest } from "./types";
export declare class TransactionProcessor {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly commitment: Commitment;
    constructor(connection: Connection, wallet: Wallet, commitment?: Commitment);
    signTransaction(txRequest: SendTxRequest): Promise<{
        transaction: Transaction;
        lastValidBlockHeight: number;
        blockhash: string;
    }>;
    signTransactions(txRequests: SendTxRequest[]): Promise<{
        transactions: Transaction[];
        lastValidBlockHeight: number;
        blockhash: string;
    }>;
    sendTransaction(transaction: Transaction, lastValidBlockHeight: number, blockhash: string): Promise<string>;
    constructSendTransactions(transactions: Transaction[], lastValidBlockHeight: number, blockhash: string, parallel?: boolean): () => Promise<PromiseSettledResult<string>[]>;
    signAndConstructTransaction(txRequest: SendTxRequest): Promise<{
        signedTx: Transaction;
        execute: () => Promise<string>;
    }>;
    signAndConstructTransactions(txRequests: SendTxRequest[], parallel?: boolean): Promise<{
        signedTxs: Transaction[];
        execute: () => Promise<PromiseSettledResult<string>[]>;
    }>;
}
