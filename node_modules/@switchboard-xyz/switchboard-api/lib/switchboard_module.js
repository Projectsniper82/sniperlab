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
exports.signTransactions = exports.packTransactions = exports.packInstructions = exports.initAccount = exports.createOwnedStateAccount = exports.removeFeedBundle = exports.addFeedBundle = exports.setBundleAuthConfigs = exports.createBundleAuth = exports.createBundle = exports.parseVrfAccountData = exports.requestRandomness = exports.createVrfAccount = exports.setAuthConfigs = exports.createFulfillmentManagerAuth = exports.initFulfillmentManagerAuthAccount = exports.setFulfillmentManagerConfigs = exports.createFulfillmentManager = exports.initFulfillmentManagerAccount = exports.setDataFeedConfigs = exports.updateFeed = exports.removeFeedJob = exports.addFeedParseOptimizedAccount = exports.addFeedJob = exports.createDataFeed = exports.initDataFeedAccount = exports.publishSwitchboardAccount = exports.parseOracleJobAccountData = exports.parseFulfillmentAccountData = exports.parseAggregatorAccountData = exports.parseBundleAuthAccountData = exports.SWITCHBOARD_MAINNET_PID = exports.SWITCHBOARD_TESTNET_PID = exports.SWITCHBOARD_DEVNET_PID = void 0;
const web3_js_1 = require("@solana/web3.js");
const compiled_1 = require("./compiled");
exports.SWITCHBOARD_DEVNET_PID = new web3_js_1.PublicKey("7azgmy1pFXHikv36q1zZASvFq5vFa39TT9NweVugKKTU");
exports.SWITCHBOARD_TESTNET_PID = new web3_js_1.PublicKey("6by54r25x6qUe87SiQCb11sGhGY8hachdVva6H3N22Wt");
exports.SWITCHBOARD_MAINNET_PID = new web3_js_1.PublicKey("DtmE9D2CSB4L5D6A15mraeEjrGMm6auWVzgaD8hK2tZM");
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the bundle auth account to parse.
 * @return BundleAuth
 */
function parseBundleAuthAccountData(connection, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(address);
        if (accountInfo == null) {
            throw new Error(`Failed to fetch information on account ${address.toBase58()}.`);
        }
        let data = accountInfo.data;
        if (data.length == 0 || data[0] != compiled_1.SwitchboardAccountType.TYPE_BUNDLE_AUTH) {
            throw new Error(`Switchboard account parser was not provided with a bundle auth account: ${address.toBase58()}`);
        }
        return compiled_1.BundleAuth.decodeDelimited(accountInfo.data.slice(1));
    });
}
exports.parseBundleAuthAccountData = parseBundleAuthAccountData;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the aggregator account to parse.
 * @return AggregatorState
 */
function parseAggregatorAccountData(connection, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(address);
        if (accountInfo == null) {
            throw new Error(`Failed to fetch information on account ${address.toBase58()}.`);
        }
        let data = accountInfo.data;
        if (data.length == 0 || data[0] != compiled_1.SwitchboardAccountType.TYPE_AGGREGATOR) {
            throw new Error(`Switchboard account parser was not provided with an aggregator account: ${address.toBase58()}`);
        }
        return compiled_1.AggregatorState.decodeDelimited(accountInfo.data.slice(1));
    });
}
exports.parseAggregatorAccountData = parseAggregatorAccountData;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the Fulfillment Manager account to parse.
 * @return FulfillmentManagerState
 */
function parseFulfillmentAccountData(connection, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(address);
        if (accountInfo == null) {
            throw new Error(`Failed to fetch information on account ${address.toBase58()}.`);
        }
        let data = accountInfo.data;
        if (data.length == 0 ||
            data[0] != compiled_1.SwitchboardAccountType.TYPE_FULFILLMENT_MANAGER) {
            throw new Error(`Switchboard account parser was not provided with a fulfillment manager account: ${address.toBase58()}`);
        }
        return compiled_1.FulfillmentManagerState.decodeDelimited(accountInfo.data.slice(1));
    });
}
exports.parseFulfillmentAccountData = parseFulfillmentAccountData;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the Oracle Job account to parse.
 * @return OracleJob
 */
function parseOracleJobAccountData(connection, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(address);
        if (accountInfo == null) {
            throw new Error(`Failed to fetch information on account ${address.toBase58()}.`);
        }
        let data = accountInfo.data;
        if (data.length == 0 ||
            data[0] != compiled_1.SwitchboardAccountType.TYPE_JOB_DEFINITION) {
            throw new Error(`Switchboard account parser was not provided with a fulfillment manager account: ${address.toBase58()}`);
        }
        return compiled_1.OracleJob.decodeDelimited(accountInfo.data.slice(1));
    });
}
exports.parseOracleJobAccountData = parseOracleJobAccountData;
/**
 * Publishes a premade account on chain, initialized as the provided account type.
 * @param connection Solana network connection object.
 * @param account The account which will be published and type will be set.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid Switchboard program ID.
 * @param type The type to set the account to.
 * @param accountSize The size to initialize the account to.
 */
function publishSwitchboardAccount(connection, account, payerAccount, switchboardPid, type, accountSize = 5000) {
    return __awaiter(this, void 0, void 0, function* () {
        const space = accountSize;
        const lamports = yield connection.getMinimumBalanceForRentExemption(space);
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
            fromPubkey: payerAccount.publicKey,
            newAccountPubkey: account.publicKey,
            lamports,
            space,
            programId: switchboardPid,
        }));
        yield performTransaction(connection, transaction, [payerAccount, account]);
        yield initAccount(connection, payerAccount, account, type);
        return account;
    });
}
exports.publishSwitchboardAccount = publishSwitchboardAccount;
//  === Data Feed Utilities ===
/**
 * Permanently sets the account type to an Aggregator account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account for which type will be set.
 */
function initDataFeedAccount(connection, payerAccount, dataFeedAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initAccount(connection, payerAccount, dataFeedAccount, compiled_1.SwitchboardAccountType.TYPE_AGGREGATOR);
    });
}
exports.initDataFeedAccount = initDataFeedAccount;
/**
 * Creates an account and permanently sets the account type to an Aggregator account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid The Switchboard Program pubkey that will own the account.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account The new switchboard account that can hold a data feed.
 */
function createDataFeed(connection, payerAccount, switchboardPid, accountSize = 5000) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccount = yield createOwnedStateAccount(connection, payerAccount, accountSize, switchboardPid);
        yield initAccount(connection, payerAccount, dataFeedAccount, compiled_1.SwitchboardAccountType.TYPE_AGGREGATOR);
        return dataFeedAccount;
    });
}
exports.createDataFeed = createDataFeed;
/**
 * Adds a new task list to be performed when the provided data feed is updated.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account holding the data feed being mutated.
 * @param tasks The {@linkcode OracleJob.Task} list representing the newly created job.
 * @returns the Account holding the newly created job.
 */
function addFeedJob(connection, payerAccount, dataFeedAccount, jobTasks) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedAccount.publicKey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let buffer = Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
            registerJobInstruction: compiled_1.SwitchboardInstruction.RegisterJobInstruction.create({
                job: compiled_1.OracleJob.create({
                    tasks: jobTasks,
                }),
            }),
        })).finish());
        let jobAccount = yield createOwnedStateAccount(connection, payerAccount, buffer.length, dataFeedAccountInfo.owner);
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: dataFeedAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: jobAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            ],
            programId: dataFeedAccountInfo.owner,
            data: buffer,
        });
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), [payerAccount, dataFeedAccount, jobAccount]);
        return jobAccount;
    });
}
exports.addFeedJob = addFeedJob;
/**
 * Adds a zero-copy mirror account that holds information surrounding the last
 * confirmed aggregator result.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account holding the data feed being mutated.
 * @param accountSize Size of the parseOptimizedAcccount to be created.
 * @returns the AggregatorParseOptimized account
 */
function addFeedParseOptimizedAccount(connection, payerAccount, dataFeedAccount, accountSize = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedAccount.publicKey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let parseOptimizedAccount = yield createOwnedStateAccount(connection, payerAccount, accountSize, dataFeedAccountInfo.owner);
        yield initAccount(connection, payerAccount, parseOptimizedAccount, compiled_1.SwitchboardAccountType.TYPE_AGGREGATOR_RESULT_PARSE_OPTIMIZED);
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: dataFeedAccount.publicKey, isSigner: true, isWritable: true },
                {
                    pubkey: parseOptimizedAccount.publicKey,
                    isSigner: true,
                    isWritable: true,
                },
            ],
            programId: dataFeedAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                linkParseOptimizedAccountInstruction: compiled_1.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.create({}),
            })).finish()),
        });
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), [payerAccount, dataFeedAccount, parseOptimizedAccount]);
        return parseOptimizedAccount;
    });
}
exports.addFeedParseOptimizedAccount = addFeedParseOptimizedAccount;
/**
 * Adds a new task list to be performed when the provided data feed is updated.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account holding the data feed being mutated.
 * @param job The public key of the job account to remove from this aggregator.
 */
function removeFeedJob(connection, payerAccount, dataFeedAccount, job) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedAccount.publicKey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: dataFeedAccount.publicKey, isSigner: true, isWritable: true },
            ],
            programId: dataFeedAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                unregisterJobInstruction: compiled_1.SwitchboardInstruction.UnregisterJobInstruction.create({
                    jobPubkey: job.toBuffer(),
                }),
            })).finish()),
        });
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), [payerAccount, dataFeedAccount]);
    });
}
exports.removeFeedJob = removeFeedJob;
/**
 * updateFeed will request a new fulfillment agreement for the aggregator and
 * notify nodes to fulfill the aggregator jobs.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedPubkey The public key of the data feed being updated.
 * @param authKey The public key of the authorization account allowing this data feed to use the linked fulfillment manager.
 * @throws Error If authorization fails or if the data feed is not allowed to be updated at the time of calling.
 * @returns TransactionSignature of the update transaction.
 */
function updateFeed(connection, payerAccount, dataFeedPubkey, authKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedPubkey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let aggregator = compiled_1.AggregatorState.decodeDelimited(dataFeedAccountInfo.data.slice(1));
        let fulfillmentManagerStatePubKey = new web3_js_1.PublicKey(aggregator.fulfillmentManagerPubkey);
        let keys = [
            { pubkey: dataFeedPubkey, isSigner: false, isWritable: true },
            {
                pubkey: fulfillmentManagerStatePubKey,
                isSigner: false,
                isWritable: false,
            },
            { pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
        ];
        if (authKey != null) {
            keys.push({ pubkey: authKey, isSigner: false, isWritable: false });
        }
        let agreementInstruction = new web3_js_1.TransactionInstruction({
            keys,
            programId: dataFeedAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                reachFulfillerAgreementInstruction: compiled_1.SwitchboardInstruction.ReachFulfillerAgreementInstruction.create({}),
            })).finish()),
        });
        let updateInstruction = new web3_js_1.TransactionInstruction({
            keys: [{ pubkey: dataFeedPubkey, isSigner: false, isWritable: true }],
            programId: dataFeedAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                updateAggregateInstruction: compiled_1.SwitchboardInstruction.UpdateAggregateInstruction.create({}),
            })).finish()),
        });
        let txAccounts = [payerAccount];
        return connection.sendTransaction(new web3_js_1.Transaction().add(agreementInstruction).add(updateInstruction), txAccounts);
    });
}
exports.updateFeed = updateFeed;
/**
 * setDataFeedConfigs allows settings changes to an owned data feed account
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account of the data feed being configured.
 * @param configs A dictonary object specifying the configurations to be updated.<br>
 *                 `minConfirmations`: Number of results required to accept a new round.<br>
 *                 `minUpdateDelaySeconds`: How often this feed is permitted to be updated.<br>
 *                 `fulfillmentManagerPubkey`: The public key of the fulfillment manager to attach to.<br>
 *                 `lock`: Once a data feed is locked, all future configuration updates are forbidden.
 */
function setDataFeedConfigs(connection, payerAccount, dataFeedAccount, configs) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedAccount.publicKey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let keys = [
            { pubkey: dataFeedAccount.publicKey, isSigner: true, isWritable: true },
        ];
        let fmPubkey = null;
        if (configs["fulfillmentManagerPubkey"] !== undefined) {
            fmPubkey = new web3_js_1.PublicKey(configs["fulfillmentManagerPubkey"]);
            keys.push({ pubkey: fmPubkey, isSigner: false, isWritable: false });
        }
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys,
            programId: dataFeedAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                setAggregatorConfigsInstruction: compiled_1.SwitchboardInstruction.SetAggregatorConfigsInstruction.create({
                    minConfirmations: configs["minConfirmations"],
                    minUpdateDelaySeconds: configs["minUpdateDelaySeconds"],
                    fulfillmentManagerPubkey: fmPubkey === null || fmPubkey === void 0 ? void 0 : fmPubkey.toBytes(),
                    lock: configs["lock"],
                }),
            })).finish()),
        });
        let txAccounts = [payerAccount, dataFeedAccount];
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), txAccounts);
    });
}
exports.setDataFeedConfigs = setDataFeedConfigs;
//  === Fulfillment Manager Utilities ===
/**
 * Permanently sets the account type to a FulfillmentManager account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAccount The account for which type will be set.
 */
function initFulfillmentManagerAccount(connection, payerAccount, fulfillmentManagerAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initAccount(connection, payerAccount, fulfillmentManagerAccount, compiled_1.SwitchboardAccountType.TYPE_FULFILLMENT_MANAGER);
    });
}
exports.initFulfillmentManagerAccount = initFulfillmentManagerAccount;
/**
 * Creates an account and permanently sets the account type to a FulfillmentManagerAuth account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid The Switchboard Program pubkey.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account New switchboard account that can hold a fulfillment manager.
 */
function createFulfillmentManager(connection, payerAccount, switchboardPid, accountSize = 3000) {
    return __awaiter(this, void 0, void 0, function* () {
        let fulfillmentManagerAccount = yield createOwnedStateAccount(connection, payerAccount, accountSize, switchboardPid);
        yield initAccount(connection, payerAccount, fulfillmentManagerAccount, compiled_1.SwitchboardAccountType.TYPE_FULFILLMENT_MANAGER);
        return fulfillmentManagerAccount;
    });
}
exports.createFulfillmentManager = createFulfillmentManager;
/**
 * setDataFeedConfigs allows settings changes to an owned data feed account
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAccount The account of the fulfillment manager to being configured.
 * @param configs A dictionary object specifying the configurations to be updated.<br>
 *                `heartbeatAuthRequired`: Authorization is required for nodes to join this fulfiller.<br>
 *                `usageAuthRequired`: Authorization is required for data feeds to use this fulfiller.<br>
 *                `lock`: Once the account is locked, all future configuration updates are forbidden.
 */
function setFulfillmentManagerConfigs(connection, payerAccount, fulfillmentManagerAccount, configs) {
    return __awaiter(this, void 0, void 0, function* () {
        let fmAccountInfo = yield connection.getAccountInfo(fulfillmentManagerAccount.publicKey);
        if (fmAccountInfo == null) {
            throw new Error("Failed to fetch information on the Fulfillment Manager account");
        }
        let keys = [
            {
                pubkey: fulfillmentManagerAccount.publicKey,
                isSigner: true,
                isWritable: true,
            },
        ];
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys,
            programId: fmAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                setFulfillmentManagerConfigsInstruction: compiled_1.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.create({
                    heartbeatAuthRequired: configs["heartbeatAuthRequired"],
                    usageAuthRequired: configs["usageAuthRequired"],
                    lock: configs["lock"],
                }),
            })).finish()),
        });
        let txAccounts = [payerAccount, fulfillmentManagerAccount];
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), txAccounts);
    });
}
exports.setFulfillmentManagerConfigs = setFulfillmentManagerConfigs;
//  === Fulfillment Manager Authorization Utilities ===
/**
 * Permanently sets the account type to a FulfillmentManagerAuth account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAuthAccount The account for which type will be set.
 */
function initFulfillmentManagerAuthAccount(connection, payerAccount, fulfillmentManagerAuthAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initAccount(connection, payerAccount, fulfillmentManagerAuthAccount, compiled_1.SwitchboardAccountType.TYPE_FULFILLMENT_MANAGER_AUTH);
    });
}
exports.initFulfillmentManagerAuthAccount = initFulfillmentManagerAuthAccount;
// TODO(mgild): Make single transaction
/**
 * Creates an account which controls permissions access to a fulfillment manager.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAccount The {@linkcode FulfillmentManagerState} account that this authorization will attach to.
 * @param nomineePubkey The public key for which authorization is being linked to the fulfillment manager account.
 * @param configs Denotes the settings to initalize the authorization account with.<br>
 *                `authorizeHeartbeat`: Set to `true` to let this account authorize heartbeats from the `nomineePubkey` to the provided {@linkcode FulfillmentManagerState}.<br>
 *                `authorizeUsage`: Set to `true` to let the nominee use the provided Fulfillment manager to fulfill {@linkcode updateFeed} requests.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account The account holding the new authorization config.
 */
function createFulfillmentManagerAuth(connection, payerAccount, fulfillmentManagerAccount, nomineePubkey, configs, accountSize = 300) {
    return __awaiter(this, void 0, void 0, function* () {
        let fmAccountInfo = yield connection.getAccountInfo(fulfillmentManagerAccount.publicKey);
        if (fmAccountInfo == null) {
            throw new Error("Failed to fetch account info for " +
                fulfillmentManagerAccount.publicKey.toString());
        }
        let fulfillmentManagerAuthAccount = yield createOwnedStateAccount(connection, payerAccount, accountSize, fmAccountInfo.owner);
        yield initFulfillmentManagerAuthAccount(connection, payerAccount, fulfillmentManagerAuthAccount);
        yield setAuthConfigs(connection, payerAccount, fulfillmentManagerAccount, fulfillmentManagerAuthAccount.publicKey, nomineePubkey, configs);
        return fulfillmentManagerAuthAccount;
    });
}
exports.createFulfillmentManagerAuth = createFulfillmentManagerAuth;
/**
 * Modifies an authorization account for a fulfillment manager. This can be used
 * to disable or enable authorization for an account to interact with a
 * {@linkcode FulfillmentManagerState}.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAccount The {@linkcode FulfillmentManagerState} account for which usage is being authorized.
 * @param fulfillmentManagerAuthPubkey The {@linkcode FulfillmentManagerAuth} account for which auth settings are being modified.
 * @param nomineePubkey The public key for which authorization is being linked to the fulfillment manager account.
 * @param configs Denotes the parameters of the {@linkcode FulfillmentManagerAuth} that are being modified.<br>
 *                `authorizeHeartbeat`: Set to `true` to let this account authorize heartbeats from the `nomineePubkey` to the provided FulfillmentManager.<br>
 *                `authorizeUsage`: Set to `true` to let the nominee use the provided Fulfillment manager to fulfill {@linkcode updateFeed} requests.
 */
function setAuthConfigs(connection, payerAccount, fulfillmentManagerAccount, fulfillmentManagerAuthPubkey, nomineePubkey, configs) {
    return __awaiter(this, void 0, void 0, function* () {
        let fmAccountInfo = yield connection.getAccountInfo(fulfillmentManagerAccount.publicKey);
        if (fmAccountInfo == null) {
            throw new Error("Failed to fetch account info for " +
                fulfillmentManagerAccount.publicKey.toString());
        }
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: fulfillmentManagerAuthPubkey,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fulfillmentManagerAccount.publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                { pubkey: nomineePubkey, isSigner: false, isWritable: false },
            ],
            programId: fmAccountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                registerAuthInstruction: compiled_1.SwitchboardInstruction.RegisterAuthInstruction.create({
                    authorizeHeartbeat: configs["authorizeHeartbeat"],
                    authorizeUsage: configs["authorizeUsage"],
                }),
            })).finish()),
        });
        let txAccounts = [payerAccount, fulfillmentManagerAccount];
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), txAccounts);
    });
}
exports.setAuthConfigs = setAuthConfigs;
/**
 * Creates an account and permanently sets the account type to a VRF account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid The Switchboard Program pubkey.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account New VRF Account
 */
function createVrfAccount(connection, payerAccount, switchboardPid, accountSize = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        let vrfAccount = yield createOwnedStateAccount(connection, payerAccount, accountSize, switchboardPid);
        yield initAccount(connection, payerAccount, vrfAccount, compiled_1.SwitchboardAccountType.TYPE_VRF);
        let transactionInstruction1 = new web3_js_1.TransactionInstruction({
            keys: [{ pubkey: vrfAccount.publicKey, isSigner: true, isWritable: true }],
            programId: switchboardPid,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                setVrfConfigsInstruction: compiled_1.SwitchboardInstruction.SetVrfConfigsInstruction.create({
                    minProofConfirmations: 5,
                    lockConfigs: true,
                }),
            })).finish()),
        });
        let signature = yield web3_js_1.sendAndConfirmTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction1), [payerAccount, vrfAccount]);
        return vrfAccount;
    });
}
exports.createVrfAccount = createVrfAccount;
/**
 * Requests new randomness for a provided VRF account
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param vrfAccount The VRF account for which randomness is being requested.
 * @param vrfProducerPermit The permit pubkey authorizing this VRF to request randomness.
 * @param fmPermit The permit pubkey authorizing use of a specific fulfillment group to verify proofs.
 */
function requestRandomness(connection, payerAccount, vrfAccount, vrfProducerPermit, fmPermit) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(vrfAccount.publicKey);
        if (accountInfo == null) {
            throw new Error(`Failed to fetch information on account ${vrfAccount.publicKey.toBase58()}.`);
        }
        let transactionInstruction1 = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: vrfAccount.publicKey, isSigner: true, isWritable: true },
                {
                    pubkey: web3_js_1.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                { pubkey: vrfProducerPermit, isSigner: false, isWritable: false },
                { pubkey: fmPermit, isSigner: false, isWritable: false },
            ],
            programId: accountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                requestRandomnessInstruction: compiled_1.SwitchboardInstruction.RequestRandomnessInstruction.create({}),
            })).finish()),
        });
        let signature = yield web3_js_1.sendAndConfirmTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction1), [payerAccount, vrfAccount]);
    });
}
exports.requestRandomness = requestRandomness;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the VRF account to parse.
 * @return VrfAccountData
 */
function parseVrfAccountData(connection, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(address);
        if (accountInfo == null) {
            throw new Error(`Failed to fetch information on account ${address.toBase58()}.`);
        }
        let data = accountInfo.data;
        if (data.length == 0 || data[0] != compiled_1.SwitchboardAccountType.TYPE_VRF) {
            throw new Error(`Switchboard account parser was not provided with a VRF account: ${address.toBase58()}`);
        }
        return compiled_1.VrfAccountData.decodeDelimited(accountInfo.data.slice(1));
    });
}
exports.parseVrfAccountData = parseVrfAccountData;
function createBundle(connection, payerAccount, switchboardPid, accountSize = 10000000) {
    return __awaiter(this, void 0, void 0, function* () {
        let account = yield createOwnedStateAccount(connection, payerAccount, accountSize, switchboardPid);
        yield initAccount(connection, payerAccount, account, compiled_1.SwitchboardAccountType.TYPE_BUNDLE);
        return account;
    });
}
exports.createBundle = createBundle;
/**
 * Creates an account which controls permissions access to write to a bundle.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid Switchboard program ID.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account The account holding the new authorization config.
 */
function createBundleAuth(connection, payerAccount, switchboardPid, accountSize = 500) {
    return __awaiter(this, void 0, void 0, function* () {
        let account = yield createOwnedStateAccount(connection, payerAccount, accountSize, switchboardPid);
        yield initAccount(connection, payerAccount, account, compiled_1.SwitchboardAccountType.TYPE_BUNDLE_AUTH);
        return account;
    });
}
exports.createBundleAuth = createBundleAuth;
function setBundleAuthConfigs(connection, payerAccount, bundleAuthAccount, bundleAccount, aggregatorPubkey, auth_idx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let pid = (_a = (yield connection.getAccountInfo(bundleAuthAccount.publicKey))) === null || _a === void 0 ? void 0 : _a.owner;
        if (pid == null) {
            throw new Error("Failed to fetch account info for " +
                bundleAuthAccount.publicKey.toString());
        }
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: bundleAuthAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: bundleAccount.publicKey, isSigner: true, isWritable: false },
                { pubkey: aggregatorPubkey, isSigner: false, isWritable: false },
            ],
            programId: pid,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
                setBundleAuthConfigsInstruction: compiled_1.SwitchboardInstruction.SetBundleAuthConfigsInstruction.create({
                    idx: auth_idx,
                }),
            })).finish()),
        });
        let txAccounts = [payerAccount, bundleAuthAccount, bundleAccount];
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), txAccounts);
    });
}
exports.setBundleAuthConfigs = setBundleAuthConfigs;
function addFeedBundle(connection, payerAccount, dataFeedAccount, bundleAuth) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedAccount.publicKey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let buffer = Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
            addBundleAuthInstruction: compiled_1.SwitchboardInstruction.AddBundleAuthInstruction.create({}),
        })).finish());
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: dataFeedAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: bundleAuth, isSigner: false, isWritable: false },
            ],
            programId: dataFeedAccountInfo.owner,
            data: buffer,
        });
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), [payerAccount, dataFeedAccount]);
    });
}
exports.addFeedBundle = addFeedBundle;
function removeFeedBundle(connection, payerAccount, dataFeedAccount, bundleAuth) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataFeedAccountInfo = yield connection.getAccountInfo(dataFeedAccount.publicKey);
        if (dataFeedAccountInfo == null)
            throw new Error("Failed to fetch information on the datafeed account");
        let buffer = Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(compiled_1.SwitchboardInstruction.create({
            removeBundleAuthInstruction: compiled_1.SwitchboardInstruction.RemoveBundleAuthInstruction.create({}),
        })).finish());
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: dataFeedAccount.publicKey, isSigner: true, isWritable: true },
                { pubkey: bundleAuth, isSigner: false, isWritable: false },
            ],
            programId: dataFeedAccountInfo.owner,
            data: buffer,
        });
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), [payerAccount, dataFeedAccount]);
        return null;
    });
}
exports.removeFeedBundle = removeFeedBundle;
// === Exported Helpers ===
/**
 * Helper for creating rent exempted accounts.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param size Data size this account will be able to hold
 * @param parent The public key of the program that will own this account.
 */
function createOwnedStateAccount(connection, payerAccount, size, parent, programStateAccount = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (programStateAccount == null) {
            programStateAccount = new web3_js_1.Account();
        }
        let stateAccountPubkey = programStateAccount.publicKey;
        const space = size;
        const lamports = yield connection.getMinimumBalanceForRentExemption(space);
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
            fromPubkey: payerAccount.publicKey,
            newAccountPubkey: stateAccountPubkey,
            lamports,
            space,
            programId: parent,
        }));
        yield performTransaction(connection, transaction, [
            payerAccount,
            programStateAccount,
        ]);
        return programStateAccount;
    });
}
exports.createOwnedStateAccount = createOwnedStateAccount;
// === Non-Exported helpers ===
// Internal Solana transaction helper.
function performTransaction(connection, transaction, accounts) {
    return __awaiter(this, void 0, void 0, function* () {
        return web3_js_1.sendAndConfirmTransaction(connection, transaction, accounts);
    });
}
// Internal account initialization helper
function initAccount(connection, payerAccount, account, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountInfo = yield connection.getAccountInfo(account.publicKey);
        if (accountInfo == null) {
            throw new Error("Failed to fetch information on the provided account.");
        }
        let switchboardInstruction = compiled_1.SwitchboardInstruction.create({
            initInstruction: compiled_1.SwitchboardInstruction.InitInstruction.create({
                type: type,
            }),
        });
        let transactionInstruction = new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: account.publicKey, isSigner: true, isWritable: true },
                { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            ],
            programId: accountInfo.owner,
            data: Buffer.from(compiled_1.SwitchboardInstruction.encodeDelimited(switchboardInstruction).finish()),
        });
        yield performTransaction(connection, new web3_js_1.Transaction().add(transactionInstruction), [payerAccount, account]);
    });
}
exports.initAccount = initAccount;
/**
 * Pack instructions into transactions as tightly as possible
 * @param instructions Instructions to pack down into transactions
 * @param feePayer Optional feepayer
 * @param recentBlockhash Optional blockhash
 * @returns Transaction[]
 */
function packInstructions(instructions, feePayer = web3_js_1.PublicKey.default, recentBlockhash = web3_js_1.PublicKey.default.toBase58()) {
    const packed = [];
    let currentTransaction = new web3_js_1.Transaction();
    currentTransaction.recentBlockhash = recentBlockhash;
    currentTransaction.feePayer = feePayer;
    const encodeLength = (bytes, len) => {
        let rem_len = len;
        for (;;) {
            let elem = rem_len & 0x7f;
            rem_len >>= 7;
            if (rem_len == 0) {
                bytes.push(elem);
                break;
            }
            else {
                elem |= 0x80;
                bytes.push(elem);
            }
        }
    };
    for (let instruction of instructions) {
        // add the new transaction
        currentTransaction.add(instruction);
        let sigCount = [];
        encodeLength(sigCount, currentTransaction.signatures.length);
        if (web3_js_1.PACKET_DATA_SIZE <=
            currentTransaction.serializeMessage().length +
                currentTransaction.signatures.length * 64 +
                sigCount.length) {
            // If the aggregator transaction fits, it will serialize without error. We can then push it ahead no problem
            const trimmedInstruction = currentTransaction.instructions.pop();
            // Every serialize adds the instruction signatures as dependencies
            currentTransaction.signatures = [];
            const overflowInstructions = [trimmedInstruction];
            // add the capped transaction to our transaction - only push it if it works
            packed.push(currentTransaction);
            currentTransaction = new web3_js_1.Transaction();
            currentTransaction.recentBlockhash = recentBlockhash;
            currentTransaction.feePayer = feePayer;
            currentTransaction.instructions = overflowInstructions;
        }
    }
    packed.push(currentTransaction);
    return packed; // just return instructions
}
exports.packInstructions = packInstructions;
/**
 * Repack Transactions and sign them
 * @param connection Web3.js Connection
 * @param transactions Transactions to repack
 * @param signers Signers for each transaction
 */
function packTransactions(connection, transactions, signers, feePayer) {
    return __awaiter(this, void 0, void 0, function* () {
        const instructions = transactions.map((t) => t.instructions).flat();
        const txs = packInstructions(instructions, feePayer);
        const { blockhash } = yield connection.getRecentBlockhash("confirmed");
        txs.forEach((t) => {
            t.recentBlockhash = blockhash;
        });
        return signTransactions(txs, signers);
    });
}
exports.packTransactions = packTransactions;
/**
 * Sign transactions with correct signers
 * @param transactions array of transactions to sign
 * @param signers array of keypairs to sign the array of transactions with
 * @returns transactions signed
 */
function signTransactions(transactions, signers) {
    // Sign with all the appropriate signers
    for (let transaction of transactions) {
        // Get pubkeys of signers needed
        const sigsNeeded = transaction.instructions
            .map((instruction) => {
            const signers = instruction.keys.filter((meta) => meta.isSigner);
            return signers.map((signer) => signer.pubkey);
        })
            .flat();
        // Get matching signers in our supplied array
        let currentSigners = signers.filter((signer) => Boolean(sigsNeeded.find((sig) => sig.equals(signer.publicKey))));
        // Sign all transactions
        for (let signer of currentSigners) {
            transaction.partialSign(signer);
        }
    }
    return transactions;
}
exports.signTransactions = signTransactions;
