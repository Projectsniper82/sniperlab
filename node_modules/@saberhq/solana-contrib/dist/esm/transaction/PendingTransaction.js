"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingTransaction = void 0;
const tslib_1 = require("tslib");
const promise_retry_1 = tslib_1.__importDefault(require("promise-retry"));
const txLink_js_1 = require("../utils/txLink.js");
const TransactionReceipt_js_1 = require("./TransactionReceipt.js");
/**
 * Transaction which may or may not be confirmed.
 */
class PendingTransaction {
    constructor(connection, signature) {
        this.connection = connection;
        this.signature = signature;
        this._receipt = null;
    }
    /**
     * Gets the transaction receipt, if it has already been fetched.
     *
     * You probably want the async version of this function, `wait`.
     */
    get receipt() {
        return this._receipt;
    }
    /**
     * Waits for the confirmation of the transaction.
     * @returns
     */
    async wait({ commitment = "confirmed", maxSupportedTransactionVersion = 0, useWebsocket = true, ...retryOpts } = {}) {
        if (this._receipt) {
            return this._receipt;
        }
        if (useWebsocket) {
            await this.confirm({ commitment, ...retryOpts });
            return await this.pollForReceipt({
                commitment,
                maxSupportedTransactionVersion,
            });
        }
        return await this.pollForReceipt({
            commitment,
            maxSupportedTransactionVersion,
            ...retryOpts,
        });
    }
    /**
     * Fetches the TransactionReceipt via polling.
     * @returns
     */
    async pollForReceipt({ commitment = "confirmed", maxSupportedTransactionVersion = 0, ...retryOpts } = {}) {
        const receipt = await (0, promise_retry_1.default)(async (retry) => {
            const result = await this.connection.getTransaction(this.signature, {
                commitment,
                maxSupportedTransactionVersion,
            });
            if (!result) {
                retry(new Error("Error fetching transaction"));
                return;
            }
            return new TransactionReceipt_js_1.TransactionReceipt(this.signature, result);
        }, {
            retries: 5,
            minTimeout: 500,
            ...retryOpts,
        });
        if (!receipt) {
            throw new Error("transaction could not be confirmed");
        }
        this._receipt = receipt;
        return receipt;
    }
    /**
     * Awaits the confirmation of the transaction, via onSignature subscription.
     *
     * @deprecated use {@link PendingTransaction#confirm}
     * @returns
     */
    async awaitSignatureConfirmation(commitment = "confirmed") {
        const { value } = await this.connection.confirmTransaction(this.signature, commitment);
        if (value.err) {
            throw value.err;
        }
        return this.signature;
    }
    /**
     * Awaits the confirmation of the transaction, via onSignature subscription.
     * @returns
     */
    async confirm({ commitment = "confirmed", blockhash, lastValidBlockHeight, }) {
        let value;
        if (blockhash && lastValidBlockHeight) {
            value = (await this.connection.confirmTransaction({
                signature: this.signature,
                blockhash,
                lastValidBlockHeight,
            }, commitment)).value;
        }
        else {
            value = (await this.connection.confirmTransaction(this.signature, commitment)).value;
        }
        if (value.err) {
            throw new Error(`Transaction ${this.signature} failed (${JSON.stringify(value)})`);
        }
        return this.signature;
    }
    /**
     * Generates a link to view this {@link PendingTransaction} on the official Solana explorer.
     * @param network
     * @returns
     */
    generateSolanaExplorerLink(cluster = "mainnet-beta") {
        return (0, txLink_js_1.generateTXLink)(this.signature, cluster);
    }
}
exports.PendingTransaction = PendingTransaction;
//# sourceMappingURL=PendingTransaction.js.map