"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionProcessor = void 0;
class TransactionProcessor {
    constructor(connection, wallet, commitment = "confirmed") {
        this.connection = connection;
        this.wallet = wallet;
        this.commitment = commitment;
    }
    signTransaction(txRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transactions, lastValidBlockHeight, blockhash } = yield this.signTransactions([
                txRequest,
            ]);
            return { transaction: transactions[0], lastValidBlockHeight, blockhash };
        });
    }
    signTransactions(txRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blockhash, lastValidBlockHeight } = yield this.connection.getLatestBlockhash(this.commitment);
            const feePayer = this.wallet.publicKey;
            const pSignedTxs = txRequests.map((txRequest) => {
                return rewriteTransaction(txRequest, feePayer, blockhash);
            });
            const transactions = yield this.wallet.signAllTransactions(pSignedTxs);
            return {
                transactions,
                lastValidBlockHeight,
                blockhash,
            };
        });
    }
    sendTransaction(transaction, lastValidBlockHeight, blockhash) {
        return __awaiter(this, void 0, void 0, function* () {
            const execute = this.constructSendTransactions([transaction], lastValidBlockHeight, blockhash);
            const txs = yield execute();
            const ex = txs[0];
            if (ex.status === "fulfilled") {
                return ex.value;
            }
            else {
                throw ex.reason;
            }
        });
    }
    constructSendTransactions(transactions, lastValidBlockHeight, blockhash, parallel = true) {
        const executeTx = (tx) => __awaiter(this, void 0, void 0, function* () {
            const rawTxs = tx.serialize();
            return this.connection.sendRawTransaction(rawTxs, {
                preflightCommitment: this.commitment,
            });
        });
        const confirmTx = (txId) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.connection.confirmTransaction({
                signature: txId,
                lastValidBlockHeight: lastValidBlockHeight,
                blockhash,
            }, this.commitment);
            if (result.value.err) {
                throw new Error(`Transaction failed: ${JSON.stringify(result.value)}`);
            }
        });
        return () => __awaiter(this, void 0, void 0, function* () {
            if (parallel) {
                const results = transactions.map((tx) => __awaiter(this, void 0, void 0, function* () {
                    const txId = yield executeTx(tx);
                    yield confirmTx(txId);
                    return txId;
                }));
                return Promise.allSettled(results);
            }
            else {
                const results = [];
                for (const tx of transactions) {
                    const txId = yield executeTx(tx);
                    yield confirmTx(txId);
                    results.push(txId);
                }
                return Promise.allSettled(results);
            }
        });
    }
    signAndConstructTransaction(txRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transaction, lastValidBlockHeight, blockhash } = yield this.signTransaction(txRequest);
            return {
                signedTx: transaction,
                execute: () => __awaiter(this, void 0, void 0, function* () { return this.sendTransaction(transaction, lastValidBlockHeight, blockhash); }),
            };
        });
    }
    signAndConstructTransactions(txRequests, parallel = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transactions, lastValidBlockHeight, blockhash } = yield this.signTransactions(txRequests);
            const execute = this.constructSendTransactions(transactions, lastValidBlockHeight, blockhash, parallel);
            return { signedTxs: transactions, execute };
        });
    }
}
exports.TransactionProcessor = TransactionProcessor;
function rewriteTransaction(txRequest, feePayer, blockhash) {
    var _a;
    const signers = (_a = txRequest.signers) !== null && _a !== void 0 ? _a : [];
    const tx = txRequest.transaction;
    tx.feePayer = feePayer;
    tx.recentBlockhash = blockhash;
    signers.filter((s) => s !== undefined).forEach((keypair) => tx.partialSign(keypair));
    return tx;
}
