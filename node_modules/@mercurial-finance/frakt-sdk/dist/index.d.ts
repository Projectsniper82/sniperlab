import { BN, web3, Program } from '@project-serum/anchor';
export { AnchorProvider, BN, web3 } from '@project-serum/anchor';

interface TokenExtensions {
    readonly website?: string;
    readonly bridgeContract?: string;
    readonly assetContract?: string;
    readonly address?: string;
    readonly explorer?: string;
    readonly twitter?: string;
    readonly github?: string;
    readonly medium?: string;
    readonly tgann?: string;
    readonly tggroup?: string;
    readonly discord?: string;
    readonly serumV3Usdt?: string;
    readonly serumV3Usdc?: string;
    readonly coingeckoId?: string;
    readonly imageUrl?: string;
    readonly description?: string;
}
interface TokenInfo {
    readonly chainId: number;
    readonly address: string;
    readonly name: string;
    readonly decimals: number;
    readonly symbol: string;
    readonly logoURI?: string;
    readonly tags?: string[];
    readonly extensions?: TokenExtensions;
}
interface TokenView {
    tokenAccountPubkey: string;
    mint: string;
    owner: string;
    amount: number;
    amountBN: BN;
    delegateOption: boolean;
    delegate: string;
    state: number;
    isNativeOption: boolean;
    isNative: number;
    delegatedAmount: number;
    closeAuthorityOption: boolean;
    closeAuthority: string;
}
interface BulkNftRaw {
    nftMint: string;
    loanValue: number;
    interest: number;
    maxLoanValue: number;
    minLoanValue: number;
    amountOfDays: number;
}
interface BulkNft {
    nftMint: string;
    loanValue: number;
    interest: number;
    amountOfDays: number;
}

declare const SOL_TOKEN: TokenInfo;

interface CollectionInfoView {
    collectionInfoPubkey: string;
    creator: string;
    liquidityPool: string;
    pricingLookupAddress: string;
    royaltyAddress: string;
    royaltyFeeTime: number;
    royaltyFeePrice: number;
    loanToValue: number;
    collaterizationRate: number;
    availableLoanTypes: string;
    expirationTime: number;
}
interface LendingStakeView {
    lendingStakePubkey: string;
    stakeType: string;
    loan: string;
    stakeContract: string;
    stakeConstractOptional: string;
    stakeState: string;
    identity: string;
    dataA: string;
    dataB: string;
    dataC: string;
    dataD: string;
    totalHarvested: number;
    totalHarvestedOptional: number;
    lastTime: number;
}
interface FarmerView {
    farmerPubkey: string;
    farm: string;
    identity: string;
    vault: string;
    state: string;
    gemsStaked: number;
    minStakingEndsTs: number;
    cooldownEndsTs: number;
    rewardA: GemFarmRewardView;
    rewardB: GemFarmRewardView;
}
interface GemFarmRewardView {
    paidOutReward: number;
    accruedReward: number;
    variableRate: number;
    fixedRate: FixedRateView;
}
interface FixedRateView {
    beginStakingTs: number;
    beginScheduleTs: number;
    lastUpdatedTs: number;
    promisedSchedule: PromisedSchedule;
    promisedDuration: number;
}
interface PromisedSchedule {
    baseRate: number;
    tier1: number;
    tier2: number;
    tier3: number;
    denominator: number;
}
interface TimeBasedLiquidityPoolView {
    liquidityPoolPubkey: string;
    id: number;
    rewardInterestRateTime: number;
    feeInterestRateTime: number;
    rewardInterestRatePrice: number;
    feeInterestRatePrice: number;
    liquidityAmount: number;
    liqOwner: string;
    amountOfStaked: number;
    userRewardsAmount: number;
    apr: number;
    cumulative: number;
    lastTime: number;
    oldCumulative: number;
    period: number;
}
interface PriceBasedLiquidityPoolView {
    liquidityPoolPubkey: string;
    id: number;
    baseBorrowRate: number;
    variableSlope1: number;
    variableSlope2: number;
    utilizationRateOptimal: number;
    reserveFactor: number;
    reserveAmount: number;
    liquidityAmount: number;
    liqOwner: string;
    amountOfStaked: number;
    depositApr: number;
    borrowApr: number;
    borrowCumulative: number;
    depositCumulative: number;
    lastTime: number;
    depositCommission: number;
    borrowCommission: number;
}
interface DepositView {
    depositPubkey: string;
    liquidityPool: string;
    user: string;
    amount: number;
    stakedAt: number;
    stakedAtCumulative: number;
}
interface LoanView {
    loanPubkey: string;
    user: string;
    nftMint: string;
    nftUserTokenAccount: string;
    liquidityPool: string;
    collectionInfo: string;
    startedAt: number;
    expiredAt: number;
    finishedAt: number;
    originalPrice: number;
    amountToGet: number;
    rewardAmount: number;
    feeAmount: number;
    royaltyAmount: number;
    borrowedAtCumulative: number;
    loanStatus: string;
    loanType: string;
}
interface BorrowNft {
    mint: string;
    name: string;
    imageUrl: string;
    valuation: string;
    maxLoanValue: string;
    timeBased: {
        returnPeriodDays: number;
        ltvPercents: number;
        fee: string;
        feeDiscountPercents: string;
        repayValue: string;
        liquidityPoolPubkey: string;
        loanValue: string;
    };
    priceBased?: {
        liquidityPoolPubkey: string;
        ltvPercents: number;
        borrowAPRPercents: number;
        collaterizationRate: number;
    };
}
interface LiquidityPool {
    pubkey: string;
    isPriceBased: boolean;
    name: string;
    imageUrl: string[];
    totalLiquidity: number;
    totalBorrowed: number;
    utilizationRate: number;
    depositApr: number;
    borrowApr?: number;
    activeloansAmount: number;
    collectionsAmount: number;
    userDeposit?: {
        pubkey: string;
        harvestAmount: number;
        depositAmount: number;
        depositAmountLamports: string;
    };
    userActiveLoansAmount?: number;
}
interface Loan {
    pubkey: string;
    mint: string;
    name: string;
    imageUrl: string;
    isPriceBased: boolean;
    loanValue: number;
    repayValue: number;
    repayValueLamports: string;
    startedAt: string;
    expiredAt?: string;
    liquidityPool: string;
    collectionInfo: string;
    royaltyAddress: string;
    liquidationPrice?: number;
    valuation?: number;
    health?: number;
}
interface LiquidityPoolView {
    liquidityPoolPubkey: string;
    id: number;
    rewardInterestRateTime: number;
    feeInterestRateTime: number;
    rewardInterestRatePrice: number;
    feeInterestRatePrice: number;
    liquidityAmount: number;
    liqOwner: string;
    amountOfStaked: number;
    userRewardsAmount: number;
    apr: number;
    cumulative: number;
    lastTime: number;
    oldCumulative: number;
    period: number;
}
interface LoanData {
    collectionsInfo: CollectionInfoView[];
    deposits: DepositView[];
    liquidityPool: LiquidityPoolView;
    loans: LoanView[];
}
interface LotTicketView {
    liquidationLot: string;
    user: string;
    usedNftAttempts: string;
    ticketState: string;
    publicKey: string;
}
interface NftAttemptView {
    nftMint: string;
    blockedUntil: number;
    attempts: number;
    cycleStartedAt: number;
    lastTriedAt: number;
    publicKey: string;
}
interface LiquidationLotView {
    loan: string;
    nftMint: string;
    vaultNftTokenAccount: string;
    lotNoFeesPrice: number;
    winningChanceInBasePoints: number;
    startedAt: number;
    endingAt: number;
    lotState: string;
    ticketsCount: number;
    gracePeriod: number;
    graceFee: number;
    publicKey: string;
}

interface Wallet {
    publicKey: web3.PublicKey;
    signTransaction(tx: web3.Transaction): Promise<web3.Transaction>;
    signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>;
}
declare class NodeWallet implements Wallet {
    readonly payer: web3.Keypair;
    constructor(payer: web3.Keypair);
    signTransaction(tx: web3.Transaction): Promise<web3.Transaction>;
    signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>;
    get publicKey(): web3.PublicKey;
}

declare const createFakeWallet: () => NodeWallet;
declare const findAssociatedTokenAddress: (walletAddress: web3.PublicKey, tokenMintAddress: web3.PublicKey) => Promise<web3.PublicKey>;
declare const getTokenBalance: (pubkey: web3.PublicKey, connection: web3.Connection) => Promise<number>;
declare const createAssociatedTokenAccountInstruction: (associatedTokenAddress: web3.PublicKey, payer: web3.PublicKey, walletAddress: web3.PublicKey, splTokenMintAddress: web3.PublicKey) => web3.TransactionInstruction[];
declare const getSuggestedLoans: (items: BulkNftRaw[], minValue: number) => {
    best: BulkNft[];
    safest: BulkNft[];
    cheapest: BulkNft[];
};

declare const index$1_createAssociatedTokenAccountInstruction: typeof createAssociatedTokenAccountInstruction;
declare const index$1_createFakeWallet: typeof createFakeWallet;
declare const index$1_findAssociatedTokenAddress: typeof findAssociatedTokenAddress;
declare const index$1_getSuggestedLoans: typeof getSuggestedLoans;
declare const index$1_getTokenBalance: typeof getTokenBalance;
declare namespace index$1 {
  export {
    index$1_createAssociatedTokenAccountInstruction as createAssociatedTokenAccountInstruction,
    index$1_createFakeWallet as createFakeWallet,
    index$1_findAssociatedTokenAddress as findAssociatedTokenAddress,
    index$1_getSuggestedLoans as getSuggestedLoans,
    index$1_getTokenBalance as getTokenBalance,
  };
}

type ApproveLoanByAdmin = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    loan: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    nftPrice: number | BN;
    discount: number | BN;
    user: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const approveLoanByAdmin: ApproveLoanByAdmin;

type CloseLoanByAdmin = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    loan: web3.PublicKey;
    admin: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const closeLoanByAdmin: CloseLoanByAdmin;

type InitializeCollectionInfo = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    liquidityPool: web3.PublicKey;
    admin: web3.PublicKey;
    creatorAddress: web3.PublicKey;
    pricingLookupAddress: web3.PublicKey;
    loanToValue: number | BN;
    collaterizationRate: number | BN;
    royaltyAddress: web3.PublicKey;
    royaltyFeeTime: number | BN;
    royaltyFeePrice: number | BN;
    expirationTime: number | BN;
    isPriceBased: boolean;
    sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const initializeCollectionInfo: InitializeCollectionInfo;

type InitializePriceBasedLiquidityPool = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    baseBorrowRate: number;
    variableSlope1: number;
    variableSlope2: number;
    utilizationRateOptimal: number;
    reserveFactor: number;
    depositCommission: number;
    borrowCommission: number;
    id: number;
    sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const initializePriceBasedLiquidityPool: InitializePriceBasedLiquidityPool;

type InitializeTimeBasedLiquidityPool = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    rewardInterestRateTime: number | BN;
    feeInterestRateTime: number | BN;
    rewardInterestRatePrice: number | BN;
    feeInterestRatePrice: number | BN;
    id: number | BN;
    period: number | BN;
    sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const initializeTimeBasedLiquidityPool: InitializeTimeBasedLiquidityPool;

type LiquidateLoanByAdmin = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    liquidator: web3.PublicKey;
    user: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const liquidateLoanByAdmin: LiquidateLoanByAdmin;

type RevealLotTicketByAdmin$1 = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    lotTicket: web3.PublicKey;
    isWinning: boolean;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const revealLotTicketByAdmin: RevealLotTicketByAdmin$1;

type RejectLoanByAdmin = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    loan: web3.PublicKey;
    nftUserTokenAccount: web3.PublicKey;
    admin: web3.PublicKey;
    user: web3.PublicKey;
    nftMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const rejectLoanByAdmin: RejectLoanByAdmin;

type UpdateCollectionInfo = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    liquidityPool: web3.PublicKey;
    admin: web3.PublicKey;
    creatorAddress: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    pricingLookupAddress: web3.PublicKey;
    loanToValue: number | BN;
    collaterizationRate: number | BN;
    royaltyAddress: web3.PublicKey;
    royaltyFeeTime: number | BN;
    royaltyFeePrice: number | BN;
    expirationTime: number | BN;
    isPriceBased: boolean;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const updateCollectionInfo: UpdateCollectionInfo;

type UpdatePriceBasedLiquidityPool = (params: {
    programId: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    baseBorrowRate: number;
    variableSlope1: number;
    variableSlope2: number;
    utilizationRateOptimal: number;
    reserveFactor: number;
    depositCommission: number;
    borrowCommission: number;
    id: number;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const updatePriceBasedLiquidityPool: UpdatePriceBasedLiquidityPool;

type UpdateTimeBasedLiquidityPool = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    rewardInterestRateTime: number | BN;
    feeInterestRateTime: number | BN;
    rewardInterestRatePrice: number | BN;
    feeInterestRatePrice: number | BN;
    id: number | BN;
    period: number | BN;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const updateTimeBasedLiquidityPool: UpdateTimeBasedLiquidityPool;

type LiquidateLoanToRaffles = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    liquidator: web3.PublicKey;
    gracePeriod: number;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const liquidateLoanToRaffles: LiquidateLoanToRaffles;

type RevealLotTicketByAdmin = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    nftMint: web3.PublicKey;
    liquidationLot: web3.PublicKey;
    loan: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const stopLiquidationRaffles: RevealLotTicketByAdmin;

type UnstakeGemFarmByAdmin = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    gemFarm: web3.PublicKey;
    gemBank: web3.PublicKey;
    farm: web3.PublicKey;
    bank: web3.PublicKey;
    feeAcc: web3.PublicKey;
    nftMint: web3.PublicKey;
    loan: web3.PublicKey;
    isDegod: boolean;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const unstakeGemFarmByAdmin: UnstakeGemFarmByAdmin;

type PutLoanToLiquidationRaffles = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    admin: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    gracePeriod: number;
    sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const putLoanToLiquidationRaffles: PutLoanToLiquidationRaffles;

type DepositLiquidity = (params: {
    programId: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    amount: number;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const depositLiquidity: DepositLiquidity;

type GetAllProgramAccounts = (programId: web3.PublicKey, connection: web3.Connection) => Promise<{
    collectionInfos: CollectionInfoView[];
    deposits: DepositView[];
    timeBasedLiquidityPools: TimeBasedLiquidityPoolView[];
    priceBasedLiquidityPools: PriceBasedLiquidityPoolView[];
    loans: LoanView[];
    lendingStakes: LendingStakeView[];
    liquidationLots: LiquidationLotView[];
    lotTickets: LotTicketView[];
    nftAttempts: NftAttemptView[];
}>;
declare const getAllProgramAccounts: GetAllProgramAccounts;

type HarvestLiquidity = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    liquidityPool: web3.PublicKey;
    user: web3.PublicKey;
    adminPubkey: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const harvestLiquidity: HarvestLiquidity;

type PaybackLoan$1 = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    royaltyAddress: web3.PublicKey;
    paybackAmount?: BN;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const paybackLoan: PaybackLoan$1;

type PaybackLoanIx = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    royaltyAddress: web3.PublicKey;
    paybackAmount?: BN;
}) => Promise<{
    paybackLoanIx: web3.TransactionInstruction;
}>;
declare const paybackLoanIx: PaybackLoanIx;

type ProposeLoan = (params: {
    programId: web3.PublicKey;
    admin: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    nftMint: web3.PublicKey;
    proposedNftPrice: BN;
    loanToValue: BN;
    isPriceBased: boolean;
    sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<{
    loanPubkey: web3.PublicKey;
}>;
type ProposeLoanIx = (params: {
    programId: web3.PublicKey;
    admin: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    nftMint: web3.PublicKey;
    proposedNftPrice: BN;
    loanToValue: BN;
    isPriceBased: boolean;
}) => Promise<{
    loan: web3.Keypair;
    ix: web3.TransactionInstruction;
}>;
declare const proposeLoan: ProposeLoan;
declare const proposeLoanIx: ProposeLoanIx;

type UnstakeLiquidity = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    liquidityPool: web3.PublicKey;
    user: web3.PublicKey;
    amount: BN | number;
    adminPubkey: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const unstakeLiquidity: UnstakeLiquidity;

type RedeemWinningLotTicket = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    royaltyAddress: web3.PublicKey;
    lotTicket: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    liquidationLot: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const redeemWinningLotTicket: RedeemWinningLotTicket;

type GetLotTicket = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    liquidationLot: web3.PublicKey;
    attemptsNftMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const getLotTicket: GetLotTicket;

type InitializeNftAttemptsByStaking = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    fraktNftStake: web3.PublicKey;
    attemptsNftMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const initializeNftAttemptsByStaking: InitializeNftAttemptsByStaking;

type GetLotTicketByStaking = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    liquidationLot: web3.PublicKey;
    attemptsNftMint: web3.PublicKey;
    fraktNftStake: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<web3.PublicKey>;
declare const getLotTicketByStaking: GetLotTicketByStaking;

type PaybackLoan = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    liquidationLot: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    royaltyAddress: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const paybackLoanWithGrace: PaybackLoan;

type PaybackLoanWithGraceIx = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    admin: web3.PublicKey;
    liquidationLot: web3.PublicKey;
    loan: web3.PublicKey;
    nftMint: web3.PublicKey;
    liquidityPool: web3.PublicKey;
    collectionInfo: web3.PublicKey;
    royaltyAddress: web3.PublicKey;
}) => Promise<{
    ixs: web3.TransactionInstruction[];
}>;
declare const paybackLoanWithGraceIx: PaybackLoanWithGraceIx;

type StakeGemFarm = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    gemFarm: web3.PublicKey;
    gemBank: web3.PublicKey;
    farm: web3.PublicKey;
    bank: web3.PublicKey;
    feeAcc: web3.PublicKey;
    nftMint: web3.PublicKey;
    loan: web3.PublicKey;
    isDegod: boolean;
    creatorWhitelistProof: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const stakeGemFarm: StakeGemFarm;

type UnstakeGemFarm = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    gemFarm: web3.PublicKey;
    gemBank: web3.PublicKey;
    farm: web3.PublicKey;
    bank: web3.PublicKey;
    feeAcc: web3.PublicKey;
    nftMint: web3.PublicKey;
    loan: web3.PublicKey;
    isDegod: boolean;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const unstakeGemFarm: UnstakeGemFarm;

type UnstakeGemFarmIx = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    gemFarm: web3.PublicKey;
    gemBank: web3.PublicKey;
    farm: web3.PublicKey;
    bank: web3.PublicKey;
    feeAcc: web3.PublicKey;
    nftMint: web3.PublicKey;
    loan: web3.PublicKey;
    isDegod: boolean;
}) => Promise<web3.TransactionInstruction[]>;
declare const unstakeGemFarmIx: UnstakeGemFarmIx;

type ClaimGemFarm = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    gemFarm: web3.PublicKey;
    farm: web3.PublicKey;
    nftMint: web3.PublicKey;
    loan: web3.PublicKey;
    isDegod: boolean;
    rewardAMint: web3.PublicKey;
    rewardBMint: web3.PublicKey;
    sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;
declare const claimGemFarm: ClaimGemFarm;

type ClaimGemFarmIx = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;
    user: web3.PublicKey;
    gemFarm: web3.PublicKey;
    farm: web3.PublicKey;
    nftMint: web3.PublicKey;
    loan: web3.PublicKey;
    isDegod: boolean;
    rewardAMint: web3.PublicKey;
    rewardBMint: web3.PublicKey;
}) => Promise<web3.TransactionInstruction[]>;
declare const claimGemFarmIx: ClaimGemFarmIx;

type CalculationRewardDegod = (params: {
    farmer: FarmerView;
}) => number;
declare const calculateRewardDegod: CalculationRewardDegod;

type GetAllFarmAccounts = (params: {
    gemFarmProgramId: web3.PublicKey;
    connection: web3.Connection;
}) => Promise<FarmerView[]>;
declare const getAllFarmAccounts: GetAllFarmAccounts;

type GetFarmAccount = (params: {
    lendingStake: LendingStakeView;
    connection: web3.Connection;
}) => Promise<FarmerView>;
declare const getFarmAccount: GetFarmAccount;

type ReturnAnchorProgram = (programId: web3.PublicKey, connection: web3.Connection) => Program;
declare const returnAnchorProgram: ReturnAnchorProgram;
type DecodedCollectionInfo = (decodedCollection: any, address: web3.PublicKey) => CollectionInfoView;
declare const decodedCollectionInfo: DecodedCollectionInfo;
type DecodedLendingStake = (decodedLendingStake: any, address: web3.PublicKey) => LendingStakeView;
declare const decodedLendingStake: DecodedLendingStake;
type DecodedFarmer = (decodedFarmer: any, address: web3.PublicKey) => FarmerView;
declare const decodedFarmer: DecodedFarmer;
type DecodedTimeBasedLiquidityPool = (decodedLiquidityPool: any, address: web3.PublicKey) => TimeBasedLiquidityPoolView;
declare const decodedTimeBasedLiquidityPool: DecodedTimeBasedLiquidityPool;
type DecodedPriceBasedLiquidityPool = (decodedLiquidityPool: any, address: web3.PublicKey) => PriceBasedLiquidityPoolView;
declare const decodedPriceBasedLiquidityPool: DecodedPriceBasedLiquidityPool;
type decodedDeposit = (decodedDeposit: any, address: web3.PublicKey) => DepositView;
declare const decodedDeposit: decodedDeposit;
type DecodedLoan = (decodedLoan: any, address: web3.PublicKey) => LoanView;
declare const decodedLoan: DecodedLoan;
type DecodeLoan = (buffer: Buffer, connection: web3.Connection, programId: web3.PublicKey) => any;
declare const decodeLoan: DecodeLoan;
type DecodeLotTicket = (buffer: Buffer, lotTicketPubkey: web3.PublicKey, connection: web3.Connection, programId: web3.PublicKey) => LotTicketView;
declare const decodeLotTicket: DecodeLotTicket;
type GetMetaplexEditionPda = (mintPubkey: web3.PublicKey) => web3.PublicKey;
declare const getMetaplexEditionPda: GetMetaplexEditionPda;
declare const anchorRawBNsAndPubkeysToNumsAndStrings: (rawAccount: any) => any;
declare const getMostOptimalLoansClosestToNeededSolInBulk: ({ neededSol, possibleLoans, }: {
    possibleLoans: {
        nftMint: string;
        loanValue: number;
        interest: number;
    }[];
    neededSol: number;
}) => {
    nftMint: string;
    loanValue: number;
    interest: number;
}[];
declare function objectBNsAndPubkeysToNums(obj: any): any;

declare const index_anchorRawBNsAndPubkeysToNumsAndStrings: typeof anchorRawBNsAndPubkeysToNumsAndStrings;
declare const index_approveLoanByAdmin: typeof approveLoanByAdmin;
declare const index_calculateRewardDegod: typeof calculateRewardDegod;
declare const index_claimGemFarm: typeof claimGemFarm;
declare const index_claimGemFarmIx: typeof claimGemFarmIx;
declare const index_closeLoanByAdmin: typeof closeLoanByAdmin;
declare const index_decodeLoan: typeof decodeLoan;
declare const index_decodeLotTicket: typeof decodeLotTicket;
declare const index_decodedCollectionInfo: typeof decodedCollectionInfo;
declare const index_decodedDeposit: typeof decodedDeposit;
declare const index_decodedFarmer: typeof decodedFarmer;
declare const index_decodedLendingStake: typeof decodedLendingStake;
declare const index_decodedLoan: typeof decodedLoan;
declare const index_decodedPriceBasedLiquidityPool: typeof decodedPriceBasedLiquidityPool;
declare const index_decodedTimeBasedLiquidityPool: typeof decodedTimeBasedLiquidityPool;
declare const index_depositLiquidity: typeof depositLiquidity;
declare const index_getAllFarmAccounts: typeof getAllFarmAccounts;
declare const index_getAllProgramAccounts: typeof getAllProgramAccounts;
declare const index_getFarmAccount: typeof getFarmAccount;
declare const index_getLotTicket: typeof getLotTicket;
declare const index_getLotTicketByStaking: typeof getLotTicketByStaking;
declare const index_getMetaplexEditionPda: typeof getMetaplexEditionPda;
declare const index_getMostOptimalLoansClosestToNeededSolInBulk: typeof getMostOptimalLoansClosestToNeededSolInBulk;
declare const index_harvestLiquidity: typeof harvestLiquidity;
declare const index_initializeCollectionInfo: typeof initializeCollectionInfo;
declare const index_initializeNftAttemptsByStaking: typeof initializeNftAttemptsByStaking;
declare const index_initializePriceBasedLiquidityPool: typeof initializePriceBasedLiquidityPool;
declare const index_initializeTimeBasedLiquidityPool: typeof initializeTimeBasedLiquidityPool;
declare const index_liquidateLoanByAdmin: typeof liquidateLoanByAdmin;
declare const index_liquidateLoanToRaffles: typeof liquidateLoanToRaffles;
declare const index_objectBNsAndPubkeysToNums: typeof objectBNsAndPubkeysToNums;
declare const index_paybackLoan: typeof paybackLoan;
declare const index_paybackLoanIx: typeof paybackLoanIx;
declare const index_paybackLoanWithGrace: typeof paybackLoanWithGrace;
declare const index_paybackLoanWithGraceIx: typeof paybackLoanWithGraceIx;
declare const index_proposeLoan: typeof proposeLoan;
declare const index_proposeLoanIx: typeof proposeLoanIx;
declare const index_putLoanToLiquidationRaffles: typeof putLoanToLiquidationRaffles;
declare const index_redeemWinningLotTicket: typeof redeemWinningLotTicket;
declare const index_rejectLoanByAdmin: typeof rejectLoanByAdmin;
declare const index_returnAnchorProgram: typeof returnAnchorProgram;
declare const index_revealLotTicketByAdmin: typeof revealLotTicketByAdmin;
declare const index_stakeGemFarm: typeof stakeGemFarm;
declare const index_stopLiquidationRaffles: typeof stopLiquidationRaffles;
declare const index_unstakeGemFarm: typeof unstakeGemFarm;
declare const index_unstakeGemFarmByAdmin: typeof unstakeGemFarmByAdmin;
declare const index_unstakeGemFarmIx: typeof unstakeGemFarmIx;
declare const index_unstakeLiquidity: typeof unstakeLiquidity;
declare const index_updateCollectionInfo: typeof updateCollectionInfo;
declare const index_updatePriceBasedLiquidityPool: typeof updatePriceBasedLiquidityPool;
declare const index_updateTimeBasedLiquidityPool: typeof updateTimeBasedLiquidityPool;
declare namespace index {
  export {
    index_anchorRawBNsAndPubkeysToNumsAndStrings as anchorRawBNsAndPubkeysToNumsAndStrings,
    index_approveLoanByAdmin as approveLoanByAdmin,
    index_calculateRewardDegod as calculateRewardDegod,
    index_claimGemFarm as claimGemFarm,
    index_claimGemFarmIx as claimGemFarmIx,
    index_closeLoanByAdmin as closeLoanByAdmin,
    index_decodeLoan as decodeLoan,
    index_decodeLotTicket as decodeLotTicket,
    index_decodedCollectionInfo as decodedCollectionInfo,
    index_decodedDeposit as decodedDeposit,
    index_decodedFarmer as decodedFarmer,
    index_decodedLendingStake as decodedLendingStake,
    index_decodedLoan as decodedLoan,
    index_decodedPriceBasedLiquidityPool as decodedPriceBasedLiquidityPool,
    index_decodedTimeBasedLiquidityPool as decodedTimeBasedLiquidityPool,
    index_depositLiquidity as depositLiquidity,
    index_getAllFarmAccounts as getAllFarmAccounts,
    index_getAllProgramAccounts as getAllProgramAccounts,
    index_getFarmAccount as getFarmAccount,
    index_getLotTicket as getLotTicket,
    index_getLotTicketByStaking as getLotTicketByStaking,
    index_getMetaplexEditionPda as getMetaplexEditionPda,
    index_getMostOptimalLoansClosestToNeededSolInBulk as getMostOptimalLoansClosestToNeededSolInBulk,
    index_harvestLiquidity as harvestLiquidity,
    index_initializeCollectionInfo as initializeCollectionInfo,
    index_initializeNftAttemptsByStaking as initializeNftAttemptsByStaking,
    index_initializePriceBasedLiquidityPool as initializePriceBasedLiquidityPool,
    index_initializeTimeBasedLiquidityPool as initializeTimeBasedLiquidityPool,
    index_liquidateLoanByAdmin as liquidateLoanByAdmin,
    index_liquidateLoanToRaffles as liquidateLoanToRaffles,
    index_objectBNsAndPubkeysToNums as objectBNsAndPubkeysToNums,
    index_paybackLoan as paybackLoan,
    index_paybackLoanIx as paybackLoanIx,
    index_paybackLoanWithGrace as paybackLoanWithGrace,
    index_paybackLoanWithGraceIx as paybackLoanWithGraceIx,
    index_proposeLoan as proposeLoan,
    index_proposeLoanIx as proposeLoanIx,
    index_putLoanToLiquidationRaffles as putLoanToLiquidationRaffles,
    index_redeemWinningLotTicket as redeemWinningLotTicket,
    index_rejectLoanByAdmin as rejectLoanByAdmin,
    index_returnAnchorProgram as returnAnchorProgram,
    index_revealLotTicketByAdmin as revealLotTicketByAdmin,
    index_stakeGemFarm as stakeGemFarm,
    index_stopLiquidationRaffles as stopLiquidationRaffles,
    index_unstakeGemFarm as unstakeGemFarm,
    index_unstakeGemFarmByAdmin as unstakeGemFarmByAdmin,
    index_unstakeGemFarmIx as unstakeGemFarmIx,
    index_unstakeLiquidity as unstakeLiquidity,
    index_updateCollectionInfo as updateCollectionInfo,
    index_updatePriceBasedLiquidityPool as updatePriceBasedLiquidityPool,
    index_updateTimeBasedLiquidityPool as updateTimeBasedLiquidityPool,
  };
}

export { BorrowNft, BulkNft, BulkNftRaw, CollectionInfoView, DepositView, FarmerView, FixedRateView, GemFarmRewardView, LendingStakeView, LiquidationLotView, LiquidityPool, LiquidityPoolView, Loan, LoanData, LoanView, LotTicketView, NftAttemptView, PriceBasedLiquidityPoolView, PromisedSchedule, SOL_TOKEN, TimeBasedLiquidityPoolView, TokenExtensions, TokenInfo, TokenView, index as loans, index$1 as utils };
