import { Account, Connection, PublicKey, Transaction, TransactionInstruction, Keypair } from "@solana/web3.js";
import { AggregatorState, OracleJob, FulfillmentManagerState, SwitchboardAccountType, BundleAuth, VrfAccountData } from "./compiled";
export declare const SWITCHBOARD_DEVNET_PID: PublicKey;
export declare const SWITCHBOARD_TESTNET_PID: PublicKey;
export declare const SWITCHBOARD_MAINNET_PID: PublicKey;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the bundle auth account to parse.
 * @return BundleAuth
 */
export declare function parseBundleAuthAccountData(connection: Connection, address: PublicKey): Promise<BundleAuth>;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the aggregator account to parse.
 * @return AggregatorState
 */
export declare function parseAggregatorAccountData(connection: Connection, address: PublicKey): Promise<AggregatorState>;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the Fulfillment Manager account to parse.
 * @return FulfillmentManagerState
 */
export declare function parseFulfillmentAccountData(connection: Connection, address: PublicKey): Promise<FulfillmentManagerState>;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the Oracle Job account to parse.
 * @return OracleJob
 */
export declare function parseOracleJobAccountData(connection: Connection, address: PublicKey): Promise<OracleJob>;
/**
 * Publishes a premade account on chain, initialized as the provided account type.
 * @param connection Solana network connection object.
 * @param account The account which will be published and type will be set.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid Switchboard program ID.
 * @param type The type to set the account to.
 * @param accountSize The size to initialize the account to.
 */
export declare function publishSwitchboardAccount(connection: Connection, account: Account, payerAccount: Account, switchboardPid: PublicKey, type: SwitchboardAccountType, accountSize?: number): Promise<Account>;
/**
 * Permanently sets the account type to an Aggregator account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account for which type will be set.
 */
export declare function initDataFeedAccount(connection: Connection, payerAccount: Account, dataFeedAccount: Account): Promise<void>;
/**
 * Creates an account and permanently sets the account type to an Aggregator account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid The Switchboard Program pubkey that will own the account.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account The new switchboard account that can hold a data feed.
 */
export declare function createDataFeed(connection: Connection, payerAccount: Account, switchboardPid: PublicKey, accountSize?: number): Promise<Account>;
/**
 * Adds a new task list to be performed when the provided data feed is updated.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account holding the data feed being mutated.
 * @param tasks The {@linkcode OracleJob.Task} list representing the newly created job.
 * @returns the Account holding the newly created job.
 */
export declare function addFeedJob(connection: Connection, payerAccount: Account, dataFeedAccount: Account, jobTasks: OracleJob.Task[]): Promise<Account>;
/**
 * Adds a zero-copy mirror account that holds information surrounding the last
 * confirmed aggregator result.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account holding the data feed being mutated.
 * @param accountSize Size of the parseOptimizedAcccount to be created.
 * @returns the AggregatorParseOptimized account
 */
export declare function addFeedParseOptimizedAccount(connection: Connection, payerAccount: Account, dataFeedAccount: Account, accountSize?: number): Promise<Account>;
/**
 * Adds a new task list to be performed when the provided data feed is updated.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param dataFeedAccount The account holding the data feed being mutated.
 * @param job The public key of the job account to remove from this aggregator.
 */
export declare function removeFeedJob(connection: Connection, payerAccount: Account, dataFeedAccount: Account, job: PublicKey): Promise<void>;
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
export declare function updateFeed(connection: Connection, payerAccount: Account, dataFeedPubkey: PublicKey, authKey?: PublicKey): Promise<string>;
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
export declare function setDataFeedConfigs(connection: Connection, payerAccount: Account, dataFeedAccount: Account, configs: any): Promise<void>;
/**
 * Permanently sets the account type to a FulfillmentManager account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAccount The account for which type will be set.
 */
export declare function initFulfillmentManagerAccount(connection: Connection, payerAccount: Account, fulfillmentManagerAccount: Account): Promise<void>;
/**
 * Creates an account and permanently sets the account type to a FulfillmentManagerAuth account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid The Switchboard Program pubkey.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account New switchboard account that can hold a fulfillment manager.
 */
export declare function createFulfillmentManager(connection: Connection, payerAccount: Account, switchboardPid: PublicKey, accountSize?: number): Promise<Account>;
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
export declare function setFulfillmentManagerConfigs(connection: Connection, payerAccount: Account, fulfillmentManagerAccount: Account, configs: any): Promise<void>;
/**
 * Permanently sets the account type to a FulfillmentManagerAuth account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param fulfillmentManagerAuthAccount The account for which type will be set.
 */
export declare function initFulfillmentManagerAuthAccount(connection: Connection, payerAccount: Account, fulfillmentManagerAuthAccount: Account): Promise<void>;
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
export declare function createFulfillmentManagerAuth(connection: Connection, payerAccount: Account, fulfillmentManagerAccount: Account, nomineePubkey: PublicKey, configs: any, accountSize?: number): Promise<Account>;
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
export declare function setAuthConfigs(connection: Connection, payerAccount: Account, fulfillmentManagerAccount: Account, fulfillmentManagerAuthPubkey: PublicKey, nomineePubkey: PublicKey, configs: any): Promise<void>;
/**
 * Creates an account and permanently sets the account type to a VRF account.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid The Switchboard Program pubkey.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account New VRF Account
 */
export declare function createVrfAccount(connection: Connection, payerAccount: Account, switchboardPid: PublicKey, accountSize?: number): Promise<Account>;
/**
 * Requests new randomness for a provided VRF account
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param vrfAccount The VRF account for which randomness is being requested.
 * @param vrfProducerPermit The permit pubkey authorizing this VRF to request randomness.
 * @param fmPermit The permit pubkey authorizing use of a specific fulfillment group to verify proofs.
 */
export declare function requestRandomness(connection: Connection, payerAccount: Account, vrfAccount: Account, vrfProducerPermit: PublicKey, fmPermit: PublicKey): Promise<void>;
/**
 * Pull accountInfo from a provided account address and attempt to parse the state.
 * @param connection Solana network connection object.
 * @param address The address of the VRF account to parse.
 * @return VrfAccountData
 */
export declare function parseVrfAccountData(connection: Connection, address: PublicKey): Promise<VrfAccountData>;
export declare function createBundle(connection: Connection, payerAccount: Account, switchboardPid: PublicKey, accountSize?: number): Promise<Account>;
/**
 * Creates an account which controls permissions access to write to a bundle.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param switchboardPid Switchboard program ID.
 * @param accountSize: byte size to allocate for the created account.
 * @returns Account The account holding the new authorization config.
 */
export declare function createBundleAuth(connection: Connection, payerAccount: Account, switchboardPid: PublicKey, accountSize?: number): Promise<Account>;
export declare function setBundleAuthConfigs(connection: Connection, payerAccount: Account, bundleAuthAccount: Account, bundleAccount: Account, aggregatorPubkey: PublicKey, auth_idx: number): Promise<void>;
export declare function addFeedBundle(connection: Connection, payerAccount: Account, dataFeedAccount: Account, bundleAuth: PublicKey): Promise<void>;
export declare function removeFeedBundle(connection: Connection, payerAccount: Account, dataFeedAccount: Account, bundleAuth: PublicKey): Promise<null>;
/**
 * Helper for creating rent exempted accounts.
 * @param connection Solana network connection object.
 * @param payerAccount Transaction funder account.
 * @param size Data size this account will be able to hold
 * @param parent The public key of the program that will own this account.
 */
export declare function createOwnedStateAccount(connection: Connection, payerAccount: Account, size: number, parent: PublicKey, programStateAccount?: Account | null): Promise<Account>;
export declare function initAccount(connection: Connection, payerAccount: Account, account: Account, type: SwitchboardAccountType): Promise<void>;
/**
 * Pack instructions into transactions as tightly as possible
 * @param instructions Instructions to pack down into transactions
 * @param feePayer Optional feepayer
 * @param recentBlockhash Optional blockhash
 * @returns Transaction[]
 */
export declare function packInstructions(instructions: TransactionInstruction[], feePayer?: PublicKey, recentBlockhash?: string): Transaction[];
/**
 * Repack Transactions and sign them
 * @param connection Web3.js Connection
 * @param transactions Transactions to repack
 * @param signers Signers for each transaction
 */
export declare function packTransactions(connection: Connection, transactions: Transaction[], signers: Keypair[], feePayer: PublicKey): Promise<Transaction[]>;
/**
 * Sign transactions with correct signers
 * @param transactions array of transactions to sign
 * @param signers array of keypairs to sign the array of transactions with
 * @returns transactions signed
 */
export declare function signTransactions(transactions: Transaction[], signers: Keypair[]): Transaction[];
