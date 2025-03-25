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
exports.TransactionBuilder = void 0;
const web3_js_1 = require("@solana/web3.js");
const transactions_processor_1 = require("./transactions-processor");
/**
 * @category Transactions Util
 */
class TransactionBuilder {
    constructor(connection, wallet) {
        this.connection = connection;
        this.wallet = wallet;
        this.instructions = [];
        this.signers = [];
    }
    /**
     * Append an instruction into this builder.
     * @param instruction - An Instruction
     * @returns Returns this transaction builder.
     */
    addInstruction(instruction) {
        this.instructions.push(instruction);
        return this;
    }
    /**
     * Append a list of instructions into this builder.
     * @param instructions - A list of Instructions
     * @returns Returns this transaction builder.
     */
    addInstructions(instructions) {
        this.instructions = this.instructions.concat(instructions);
        return this;
    }
    /**
     * Prepend a list of instructions into this builder.
     * @param instruction - An Instruction
     * @returns Returns this transaction builder.
     */
    prependInstruction(instruction) {
        this.instructions.unshift(instruction);
        return this;
    }
    /**
     * Prepend a list of instructions into this builder.
     * @param instructions - A list of Instructions
     * @returns Returns this transaction builder.
     */
    prependInstructions(instructions) {
        this.instructions = instructions.concat(this.instructions);
        return this;
    }
    addSigner(signer) {
        this.signers.push(signer);
        return this;
    }
    isEmpty() {
        return this.instructions.length == 0;
    }
    /**
     * Compresses all instructions & signers in this builder
     * into one single instruction
     * @param compressPost Compress all post instructions into the instructions field
     * @returns Instruction object containing all
     */
    compressIx(compressPost) {
        let instructions = [];
        let cleanupInstructions = [];
        let signers = [];
        this.instructions.forEach((curr) => {
            instructions = instructions.concat(curr.instructions);
            // Cleanup instructions should execute in reverse order
            cleanupInstructions = curr.cleanupInstructions.concat(cleanupInstructions);
            signers = signers.concat(curr.signers);
        });
        if (compressPost) {
            instructions = instructions.concat(cleanupInstructions);
            cleanupInstructions = [];
        }
        return {
            instructions: [...instructions],
            cleanupInstructions: [...cleanupInstructions],
            signers,
        };
    }
    /**
     * Returns the size of the current transaction in bytes.
     * @returns the size of the current transaction in bytes.
     * @throws error if transaction is over maximum package size.
     */
    txnSize(options = { latestBlockhash: undefined }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmpty()) {
                return 0;
            }
            const request = yield this.build(options);
            return request.transaction.serialize({ requireAllSignatures: false }).length;
        });
    }
    /**
     * Constructs a transaction payload with the gathered instructions
     * @returns a TransactionPayload object that can be excuted or agregated into other transactions
     */
    build(options = { latestBlockhash: undefined }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { latestBlockhash } = options;
            let recentBlockhash = !latestBlockhash
                ? yield this.connection.getLatestBlockhash("singleGossip")
                : latestBlockhash;
            const transaction = new web3_js_1.Transaction(Object.assign(Object.assign({}, recentBlockhash), { feePayer: this.wallet.publicKey }));
            const ix = this.compressIx(true);
            transaction.add(...ix.instructions);
            transaction.feePayer = this.wallet.publicKey;
            return {
                transaction: transaction,
                signers: ix.signers.concat(this.signers),
            };
        });
    }
    /**
     * Constructs a transaction payload with the gathered instructions, sign it with the provider and send it out
     * @returns the txId of the transaction
     */
    buildAndExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.build();
            const tp = new transactions_processor_1.TransactionProcessor(this.connection, this.wallet);
            const { execute } = yield tp.signAndConstructTransaction(tx);
            return execute();
        });
    }
    /**
     * Send multiple transactions at once.
     * @deprecated This method is here for legacy reasons and we prefer the use of TransactionProcessor
     */
    static sendAll(provider, txns, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const txRequest = yield Promise.all(txns.map((txBuilder) => __awaiter(this, void 0, void 0, function* () {
                const { transaction, signers } = yield txBuilder.build();
                return { tx: transaction, signers };
            })));
            return yield provider.sendAll(txRequest, opts);
        });
    }
}
exports.TransactionBuilder = TransactionBuilder;
