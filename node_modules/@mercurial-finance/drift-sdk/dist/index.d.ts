import * as anchor from '@project-serum/anchor';
import { BN as BN$1, Program, AnchorProvider, Provider, Idl } from '@project-serum/anchor';
export { BN } from '@project-serum/anchor';
import { PublicKey, Transaction, Connection, ConfirmOptions, TransactionSignature, TransactionInstruction, Commitment, Signer, AccountMeta, Finality, TransactionResponse, Keypair, RpcResponseAndContext, SignatureResult } from '@solana/web3.js';
export { PublicKey } from '@solana/web3.js';
export { default as pyth } from '@pythnetwork/client';
import { AccountInfo } from '@solana/spl-token';
import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import StrictEventEmitter$1 from 'strict-event-emitter-types/types/src';
import { Market, Orderbook } from '@project-serum/serum';

declare class ExchangeStatus {
    static readonly ACTIVE: {
        active: {};
    };
    static readonly FUNDING_PAUSED: {
        fundingPaused: {};
    };
    static readonly AMM_PAUSED: {
        ammPaused: {};
    };
    static readonly FILL_PAUSED: {
        fillPaused: {};
    };
    static readonly LIQ_PAUSED: {
        liqPaused: {};
    };
    static readonly WITHDRAW_PAUSED: {
        withdrawPaused: {};
    };
    static readonly PAUSED: {
        paused: {};
    };
}
declare class MarketStatus {
    static readonly INITIALIZED: {
        initialized: {};
    };
    static readonly ACTIVE: {
        active: {};
    };
    static readonly FUNDING_PAUSED: {
        fundingPaused: {};
    };
    static readonly AMM_PAUSED: {
        ammPaused: {};
    };
    static readonly FILL_PAUSED: {
        fillPaused: {};
    };
    static readonly WITHDRAW_PAUSED: {
        withdrawPaused: {};
    };
    static readonly REDUCE_ONLY: {
        reduceOnly: {};
    };
    static readonly SETTLEMENT: {
        settlement: {};
    };
    static readonly DELISTED: {
        delisted: {};
    };
}
declare class UserStatus {
    static readonly ACTIVE: {
        active: {};
    };
    static readonly BEING_LIQUIDATED: {
        beingLiquidated: {};
    };
    static readonly BANKRUPT: {
        bankrupt: {};
    };
}
declare class ContractType {
    static readonly PERPETUAL: {
        perpetual: {};
    };
    static readonly FUTURE: {
        future: {};
    };
}
declare class ContractTier {
    static readonly A: {
        a: {};
    };
    static readonly B: {
        b: {};
    };
    static readonly C: {
        c: {};
    };
    static readonly SPECULATIVE: {
        speculative: {};
    };
    static readonly ISOLATED: {
        isolated: {};
    };
}
declare class AssetTier {
    static readonly COLLATERAL: {
        collateral: {};
    };
    static readonly PROTECTED: {
        protected: {};
    };
    static readonly CROSS: {
        cross: {};
    };
    static readonly ISOLATED: {
        isolated: {};
    };
    static readonly UNLISTED: {
        unlisted: {};
    };
}
declare class SwapDirection {
    static readonly ADD: {
        add: {};
    };
    static readonly REMOVE: {
        remove: {};
    };
}
declare class SpotBalanceType {
    static readonly DEPOSIT: {
        deposit: {};
    };
    static readonly BORROW: {
        borrow: {};
    };
}
declare class PositionDirection {
    static readonly LONG: {
        long: {};
    };
    static readonly SHORT: {
        short: {};
    };
}
declare class DepositDirection {
    static readonly DEPOSIT: {
        deposit: {};
    };
    static readonly WITHDRAW: {
        withdraw: {};
    };
}
declare class OracleSource {
    static readonly PYTH: {
        pyth: {};
    };
    static readonly SWITCHBOARD: {
        switchboard: {};
    };
    static readonly QUOTE_ASSET: {
        quoteAsset: {};
    };
}
declare class OrderType {
    static readonly LIMIT: {
        limit: {};
    };
    static readonly TRIGGER_MARKET: {
        triggerMarket: {};
    };
    static readonly TRIGGER_LIMIT: {
        triggerLimit: {};
    };
    static readonly MARKET: {
        market: {};
    };
    static readonly ORACLE: {
        oracle: {};
    };
}
declare type MarketTypeStr = 'perp' | 'spot';
declare class MarketType {
    static readonly SPOT: {
        spot: {};
    };
    static readonly PERP: {
        perp: {};
    };
}
declare class OrderStatus {
    static readonly INIT: {
        init: {};
    };
    static readonly OPEN: {
        open: {};
    };
}
declare class OrderAction {
    static readonly PLACE: {
        place: {};
    };
    static readonly CANCEL: {
        cancel: {};
    };
    static readonly EXPIRE: {
        expire: {};
    };
    static readonly FILL: {
        fill: {};
    };
    static readonly TRIGGER: {
        trigger: {};
    };
}
declare class OrderActionExplanation {
    static readonly NONE: {
        none: {};
    };
    static readonly INSUFFICIENT_FREE_COLLATERAL: {
        insufficientFreeCollateral: {};
    };
    static readonly ORACLE_PRICE_BREACHED_LIMIT_PRICE: {
        oraclePriceBreachedLimitPrice: {};
    };
    static readonly MARKET_ORDER_FILLED_TO_LIMIT_PRICE: {
        marketOrderFilledToLimitPrice: {};
    };
    static readonly ORDER_EXPIRED: {
        orderExpired: {};
    };
    static readonly LIQUIDATION: {
        liquidation: {};
    };
    static readonly ORDER_FILLED_WITH_AMM: {
        orderFilledWithAmm: {};
    };
    static readonly ORDER_FILLED_WITH_AMM_JIT: {
        orderFilledWithAmmJit: {};
    };
    static readonly ORDER_FILLED_WITH_MATCH: {
        orderFilledWithMatch: {};
    };
    static readonly ORDER_FILLED_WITH_MATCH_JIT: {
        orderFilledWithMatchJit: {};
    };
    static readonly MARKET_EXPIRED: {
        marketExpired: {};
    };
    static readonly RISK_INCREASING_ORDER: {
        riskingIncreasingOrder: {};
    };
    static readonly ORDER_FILLED_WITH_SERUM: {
        orderFillWithSerum: {};
    };
    static readonly REDUCE_ONLY_ORDER_INCREASED_POSITION: {
        reduceOnlyOrderIncreasedPosition: {};
    };
}
declare class OrderTriggerCondition {
    static readonly ABOVE: {
        above: {};
    };
    static readonly BELOW: {
        below: {};
    };
    static readonly TRIGGERED_ABOVE: {
        triggeredAbove: {};
    };
    static readonly TRIGGERED_BELOW: {
        triggeredBelow: {};
    };
}
declare class SpotFulfillmentType {
    static readonly SERUM_v3: {
        serumV3: {};
    };
}
declare class SpotFulfillmentStatus {
    static readonly ENABLED: {
        enabled: {};
    };
    static readonly DISABLED: {
        disabled: {};
    };
}
declare class DepositExplanation {
    static readonly NONE: {
        none: {};
    };
    static readonly TRANSFER: {
        transfer: {};
    };
}
declare class SettlePnlExplanation {
    static readonly NONE: {
        none: {};
    };
    static readonly EXPIRED_POSITION: {
        expiredPosition: {};
    };
}
declare class SpotFulfillmentConfigStatus {
    static readonly ENABLED: {
        enabled: {};
    };
    static readonly DISABLED: {
        disabled: {};
    };
}
declare class StakeAction {
    static readonly STAKE: {
        stake: {};
    };
    static readonly UNSTAKE_REQUEST: {
        unstakeRequest: {};
    };
    static readonly UNSTAKE_CANCEL_REQUEST: {
        unstakeCancelRequest: {};
    };
    static readonly UNSTAKE: {
        unstake: {};
    };
}
declare function isVariant(object: unknown, type: string): boolean;
declare function isOneOfVariant(object: unknown, types: string[]): boolean;
declare function getVariant(object: unknown): string;
declare enum TradeSide {
    None = 0,
    Buy = 1,
    Sell = 2
}
type CandleResolution = '1' | '5' | '15' | '60' | '240' | 'D' | 'W' | 'M';
type NewUserRecord = {
    ts: BN$1;
    userAuthority: PublicKey;
    user: PublicKey;
    subAccount: number;
    name: number[];
    referrer: PublicKey;
};
type DepositRecord = {
    ts: BN$1;
    userAuthority: PublicKey;
    user: PublicKey;
    direction: {
        deposit?: any;
        withdraw?: any;
    };
    marketIndex: number;
    amount: BN$1;
    oraclePrice: BN$1;
    marketDepositBalance: BN$1;
    marketWithdrawBalance: BN$1;
    marketCumulativeDepositInterest: BN$1;
    marketCumulativeBorrowInterest: BN$1;
    totalDepositsAfter: BN$1;
    totalWithdrawsAfter: BN$1;
    depositRecordId: BN$1;
    explanation: DepositExplanation;
    transferUser?: PublicKey;
};
type SpotInterestRecord = {
    ts: BN$1;
    marketIndex: number;
    depositBalance: BN$1;
    cumulativeDepositInterest: BN$1;
    borrowBalance: BN$1;
    cumulativeBorrowInterest: BN$1;
    optimalUtilization: number;
    optimalBorrowRate: number;
    maxBorrowRate: number;
};
type CurveRecord = {
    ts: BN$1;
    recordId: BN$1;
    marketIndex: number;
    pegMultiplierBefore: BN$1;
    baseAssetReserveBefore: BN$1;
    quoteAssetReserveBefore: BN$1;
    sqrtKBefore: BN$1;
    pegMultiplierAfter: BN$1;
    baseAssetReserveAfter: BN$1;
    quoteAssetReserveAfter: BN$1;
    sqrtKAfter: BN$1;
    baseAssetAmountLong: BN$1;
    baseAssetAmountShort: BN$1;
    baseAssetAmountWithAmm: BN$1;
    totalFee: BN$1;
    totalFeeMinusDistributions: BN$1;
    adjustmentCost: BN$1;
    numberOfUsers: BN$1;
    oraclePrice: BN$1;
    fillRecord: BN$1;
};
declare type InsuranceFundRecord = {
    ts: BN$1;
    spotMarketIndex: number;
    perpMarketIndex: number;
    userIfFactor: number;
    totalIfFactor: number;
    vaultAmountBefore: BN$1;
    insuranceVaultAmountBefore: BN$1;
    totalIfSharesBefore: BN$1;
    totalIfSharesAfter: BN$1;
    amount: BN$1;
};
declare type InsuranceFundStakeRecord = {
    ts: BN$1;
    userAuthority: PublicKey;
    action: StakeAction;
    amount: BN$1;
    marketIndex: number;
    insuranceVaultAmountBefore: BN$1;
    ifSharesBefore: BN$1;
    userIfSharesBefore: BN$1;
    totalIfSharesBefore: BN$1;
    ifSharesAfter: BN$1;
    userIfSharesAfter: BN$1;
    totalIfSharesAfter: BN$1;
};
type LPRecord = {
    ts: BN$1;
    user: PublicKey;
    action: LPAction;
    nShares: BN$1;
    marketIndex: number;
    deltaBaseAssetAmount: BN$1;
    deltaQuoteAssetAmount: BN$1;
    pnl: BN$1;
};
declare class LPAction {
    static readonly ADD_LIQUIDITY: {
        addLiquidity: {};
    };
    static readonly REMOVE_LIQUIDITY: {
        removeLiquidity: {};
    };
    static readonly SETTLE_LIQUIDITY: {
        settleLiquidity: {};
    };
}
type FundingRateRecord = {
    ts: BN$1;
    recordId: BN$1;
    marketIndex: number;
    fundingRate: BN$1;
    fundingRateLong: BN$1;
    fundingRateShort: BN$1;
    cumulativeFundingRateLong: BN$1;
    cumulativeFundingRateShort: BN$1;
    oraclePriceTwap: BN$1;
    markPriceTwap: BN$1;
    periodRevenue: BN$1;
    baseAssetAmountWithAmm: BN$1;
    baseAssetAmountWithUnsettledLp: BN$1;
};
type FundingPaymentRecord = {
    ts: BN$1;
    userAuthority: PublicKey;
    user: PublicKey;
    marketIndex: number;
    fundingPayment: BN$1;
    baseAssetAmount: BN$1;
    userLastCumulativeFunding: BN$1;
    ammCumulativeFundingLong: BN$1;
    ammCumulativeFundingShort: BN$1;
};
type LiquidationRecord = {
    ts: BN$1;
    user: PublicKey;
    liquidator: PublicKey;
    liquidationType: LiquidationType;
    marginRequirement: BN$1;
    totalCollateral: BN$1;
    marginFreed: BN$1;
    liquidationId: number;
    bankrupt: boolean;
    canceledOrderIds: BN$1[];
    liquidatePerp: LiquidatePerpRecord;
    liquidateSpot: LiquidateSpotRecord;
    liquidateBorrowForPerpPnl: LiquidateBorrowForPerpPnlRecord;
    liquidatePerpPnlForDeposit: LiquidatePerpPnlForDepositRecord;
    perpBankruptcy: PerpBankruptcyRecord;
    spotBankruptcy: SpotBankruptcyRecord;
};
declare class LiquidationType {
    static readonly LIQUIDATE_PERP: {
        liquidatePerp: {};
    };
    static readonly LIQUIDATE_BORROW_FOR_PERP_PNL: {
        liquidateBorrowForPerpPnl: {};
    };
    static readonly LIQUIDATE_PERP_PNL_FOR_DEPOSIT: {
        liquidatePerpPnlForDeposit: {};
    };
    static readonly PERP_BANKRUPTCY: {
        perpBankruptcy: {};
    };
    static readonly BORROW_BANKRUPTCY: {
        borrowBankruptcy: {};
    };
    static readonly LIQUIDATE_SPOT: {
        liquidateSpot: {};
    };
}
type LiquidatePerpRecord = {
    marketIndex: number;
    oraclePrice: BN$1;
    baseAssetAmount: BN$1;
    quoteAssetAmount: BN$1;
    lpShares: BN$1;
    userOrderId: BN$1;
    liquidatorOrderId: BN$1;
    fillRecordId: BN$1;
    liquidatorFee: BN$1;
    ifFee: BN$1;
};
type LiquidateSpotRecord = {
    assetMarketIndex: number;
    assetPrice: BN$1;
    assetTransfer: BN$1;
    liabilityMarketIndex: number;
    liabilityPrice: BN$1;
    liabilityTransfer: BN$1;
    ifFee: BN$1;
};
type LiquidateBorrowForPerpPnlRecord = {
    perpMarketIndex: number;
    marketOraclePrice: BN$1;
    pnlTransfer: BN$1;
    liabilityMarketIndex: number;
    liabilityPrice: BN$1;
    liabilityTransfer: BN$1;
};
type LiquidatePerpPnlForDepositRecord = {
    perpMarketIndex: number;
    marketOraclePrice: BN$1;
    pnlTransfer: BN$1;
    assetMarketIndex: number;
    assetPrice: BN$1;
    assetTransfer: BN$1;
};
type PerpBankruptcyRecord = {
    marketIndex: number;
    pnl: BN$1;
    ifPayment: BN$1;
    clawbackUser: PublicKey | null;
    clawbackUserPayment: BN$1 | null;
    cumulativeFundingRateDelta: BN$1;
};
type SpotBankruptcyRecord = {
    marketIndex: number;
    borrowAmount: BN$1;
    cumulativeDepositInterestDelta: BN$1;
    ifPayment: BN$1;
};
type SettlePnlRecord = {
    ts: BN$1;
    user: PublicKey;
    marketIndex: number;
    pnl: BN$1;
    baseAssetAmount: BN$1;
    quoteAssetAmountAfter: BN$1;
    quoteEntryAmount: BN$1;
    settlePrice: BN$1;
    explanation: SettlePnlExplanation;
};
type OrderRecord = {
    ts: BN$1;
    user: PublicKey;
    order: Order;
};
type OrderActionRecord = {
    ts: BN$1;
    action: OrderAction;
    actionExplanation: OrderActionExplanation;
    marketIndex: number;
    marketType: MarketType;
    filler: PublicKey | null;
    fillerReward: BN$1 | null;
    fillRecordId: BN$1 | null;
    baseAssetAmountFilled: BN$1 | null;
    quoteAssetAmountFilled: BN$1 | null;
    takerFee: BN$1 | null;
    makerFee: BN$1 | null;
    referrerReward: number | null;
    quoteAssetAmountSurplus: BN$1 | null;
    spotFulfillmentMethodFee: BN$1 | null;
    taker: PublicKey | null;
    takerOrderId: number | null;
    takerOrderDirection: PositionDirection | null;
    takerOrderBaseAssetAmount: BN$1 | null;
    takerOrderCumulativeBaseAssetAmountFilled: BN$1 | null;
    takerOrderCumulativeQuoteAssetAmountFilled: BN$1 | null;
    maker: PublicKey | null;
    makerOrderId: number | null;
    makerOrderDirection: PositionDirection | null;
    makerOrderBaseAssetAmount: BN$1 | null;
    makerOrderCumulativeBaseAssetAmountFilled: BN$1 | null;
    makerOrderCumulativeQuoteAssetAmountFilled: BN$1 | null;
    oraclePrice: BN$1;
};
type StateAccount = {
    admin: PublicKey;
    exchangeStatus: ExchangeStatus;
    whitelistMint: PublicKey;
    discountMint: PublicKey;
    oracleGuardRails: OracleGuardRails;
    numberOfAuthorities: BN$1;
    numberOfSubAccounts: BN$1;
    numberOfMarkets: number;
    numberOfSpotMarkets: number;
    minPerpAuctionDuration: number;
    defaultMarketOrderTimeInForce: number;
    defaultSpotAuctionDuration: number;
    liquidationMarginBufferRatio: number;
    settlementDuration: number;
    signer: PublicKey;
    signerNonce: number;
    srmVault: PublicKey;
    perpFeeStructure: FeeStructure;
    spotFeeStructure: FeeStructure;
    lpCooldownTime: BN$1;
    initialPctToLiquidate: number;
    liquidationDuration: number;
};
type PerpMarketAccount = {
    status: MarketStatus;
    contractType: ContractType;
    contractTier: ContractTier;
    expiryTs: BN$1;
    expiryPrice: BN$1;
    marketIndex: number;
    pubkey: PublicKey;
    name: number[];
    amm: AMM;
    numberOfUsersWithBase: number;
    numberOfUsers: number;
    marginRatioInitial: number;
    marginRatioMaintenance: number;
    nextFillRecordId: BN$1;
    nextFundingRateRecordId: BN$1;
    nextCurveRecordId: BN$1;
    pnlPool: PoolBalance;
    liquidatorFee: number;
    ifLiquidationFee: number;
    imfFactor: number;
    unrealizedPnlImfFactor: number;
    unrealizedPnlMaxImbalance: BN$1;
    unrealizedPnlInitialAssetWeight: number;
    unrealizedPnlMaintenanceAssetWeight: number;
    insuranceClaim: {
        revenueWithdrawSinceLastSettle: BN$1;
        maxRevenueWithdrawPerPeriod: BN$1;
        lastRevenueWithdrawTs: BN$1;
        quoteSettledInsurance: BN$1;
        quoteMaxInsurance: BN$1;
    };
};
type HistoricalOracleData = {
    lastOraclePrice: BN$1;
    lastOracleDelay: BN$1;
    lastOracleConf: BN$1;
    lastOraclePriceTwap: BN$1;
    lastOraclePriceTwap5Min: BN$1;
    lastOraclePriceTwapTs: BN$1;
};
type HistoricalIndexData = {
    lastIndexBidPrice: BN$1;
    lastIndexAskPrice: BN$1;
    lastIndexPriceTwap: BN$1;
    lastIndexPriceTwap5Min: BN$1;
    lastIndexPriceTwapTs: BN$1;
};
type SpotMarketAccount = {
    status: MarketStatus;
    assetTier: AssetTier;
    marketIndex: number;
    pubkey: PublicKey;
    mint: PublicKey;
    vault: PublicKey;
    oracle: PublicKey;
    oracleSource: OracleSource;
    historicalOracleData: HistoricalOracleData;
    historicalIndexData: HistoricalIndexData;
    insuranceFund: {
        vault: PublicKey;
        totalShares: BN$1;
        userShares: BN$1;
        sharesBase: BN$1;
        unstakingPeriod: BN$1;
        lastRevenueSettleTs: BN$1;
        revenueSettlePeriod: BN$1;
        totalFactor: number;
        userFactor: number;
    };
    revenuePool: PoolBalance;
    ifLiquidationFee: number;
    decimals: number;
    optimalUtilization: number;
    optimalBorrowRate: number;
    maxBorrowRate: number;
    cumulativeDepositInterest: BN$1;
    cumulativeBorrowInterest: BN$1;
    totalSocialLoss: BN$1;
    totalQuoteSocialLoss: BN$1;
    depositBalance: BN$1;
    borrowBalance: BN$1;
    maxTokenDeposits: BN$1;
    lastInterestTs: BN$1;
    lastTwapTs: BN$1;
    initialAssetWeight: number;
    maintenanceAssetWeight: number;
    initialLiabilityWeight: number;
    maintenanceLiabilityWeight: number;
    liquidatorFee: number;
    imfFactor: number;
    withdrawGuardThreshold: BN$1;
    depositTokenTwap: BN$1;
    borrowTokenTwap: BN$1;
    utilizationTwap: BN$1;
    nextDepositRecordId: BN$1;
    orderStepSize: BN$1;
    orderTickSize: BN$1;
    nextFillRecordId: BN$1;
    spotFeePool: PoolBalance;
    totalSpotFee: BN$1;
    ordersEnabled: boolean;
};
type PoolBalance = {
    scaledBalance: BN$1;
    marketIndex: number;
};
type AMM = {
    baseAssetReserve: BN$1;
    sqrtK: BN$1;
    cumulativeFundingRate: BN$1;
    lastFundingRate: BN$1;
    lastFundingRateTs: BN$1;
    lastMarkPriceTwap: BN$1;
    lastMarkPriceTwap5Min: BN$1;
    lastMarkPriceTwapTs: BN$1;
    lastTradeTs: BN$1;
    oracle: PublicKey;
    oracleSource: OracleSource;
    historicalOracleData: HistoricalOracleData;
    lastOracleReservePriceSpreadPct: BN$1;
    lastOracleConfPct: BN$1;
    fundingPeriod: BN$1;
    quoteAssetReserve: BN$1;
    pegMultiplier: BN$1;
    cumulativeFundingRateLong: BN$1;
    cumulativeFundingRateShort: BN$1;
    last24hAvgFundingRate: BN$1;
    lastFundingRateShort: BN$1;
    lastFundingRateLong: BN$1;
    totalLiquidationFee: BN$1;
    totalFeeMinusDistributions: BN$1;
    totalFeeWithdrawn: BN$1;
    totalFee: BN$1;
    userLpShares: BN$1;
    baseAssetAmountWithUnsettledLp: BN$1;
    orderStepSize: BN$1;
    orderTickSize: BN$1;
    maxFillReserveFraction: number;
    maxSlippageRatio: number;
    baseSpread: number;
    curveUpdateIntensity: number;
    baseAssetAmountWithAmm: BN$1;
    baseAssetAmountLong: BN$1;
    baseAssetAmountShort: BN$1;
    quoteAssetAmount: BN$1;
    terminalQuoteAssetReserve: BN$1;
    concentrationCoef: BN$1;
    feePool: PoolBalance;
    totalExchangeFee: BN$1;
    totalMmFee: BN$1;
    netRevenueSinceLastFunding: BN$1;
    lastUpdateSlot: BN$1;
    lastOracleNormalisedPrice: BN$1;
    lastOracleValid: boolean;
    lastBidPriceTwap: BN$1;
    lastAskPriceTwap: BN$1;
    longSpread: number;
    shortSpread: number;
    maxSpread: number;
    baseAssetAmountPerLp: BN$1;
    quoteAssetAmountPerLp: BN$1;
    ammJitIntensity: number;
    maxOpenInterest: BN$1;
    maxBaseAssetReserve: BN$1;
    minBaseAssetReserve: BN$1;
    totalSocialLoss: BN$1;
    quoteBreakEvenAmountLong: BN$1;
    quoteBreakEvenAmountShort: BN$1;
    quoteEntryAmountLong: BN$1;
    quoteEntryAmountShort: BN$1;
    markStd: BN$1;
    oracleStd: BN$1;
    longIntensityCount: number;
    longIntensityVolume: BN$1;
    shortIntensityCount: number;
    shortIntensityVolume: BN$1;
    volume24H: BN$1;
    minOrderSize: BN$1;
    maxPositionSize: BN$1;
    bidBaseAssetReserve: BN$1;
    bidQuoteAssetReserve: BN$1;
    askBaseAssetReserve: BN$1;
    askQuoteAssetReserve: BN$1;
};
type PerpPosition = {
    baseAssetAmount: BN$1;
    lastCumulativeFundingRate: BN$1;
    marketIndex: number;
    quoteAssetAmount: BN$1;
    quoteEntryAmount: BN$1;
    quoteBreakEvenAmount: BN$1;
    openOrders: number;
    openBids: BN$1;
    openAsks: BN$1;
    settledPnl: BN$1;
    lpShares: BN$1;
    remainderBaseAssetAmount: number;
    lastBaseAssetAmountPerLp: BN$1;
    lastQuoteAssetAmountPerLp: BN$1;
};
type UserStatsAccount = {
    numberOfSubAccounts: number;
    numberOfSubAccountsCreated: number;
    makerVolume30D: BN$1;
    takerVolume30D: BN$1;
    fillerVolume30D: BN$1;
    lastMakerVolume30DTs: BN$1;
    lastTakerVolume30DTs: BN$1;
    lastFillerVolume30DTs: BN$1;
    fees: {
        totalFeePaid: BN$1;
        totalFeeRebate: BN$1;
        totalTokenDiscount: BN$1;
        totalRefereeDiscount: BN$1;
        totalReferrerReward: BN$1;
        current_epoch_referrer_reward: BN$1;
    };
    referrer: PublicKey;
    isReferrer: boolean;
    authority: PublicKey;
    ifStakedQuoteAssetAmount: BN$1;
};
type UserAccount = {
    authority: PublicKey;
    delegate: PublicKey;
    name: number[];
    subAccountId: number;
    spotPositions: SpotPosition[];
    perpPositions: PerpPosition[];
    orders: Order[];
    status: UserStatus;
    nextLiquidationId: number;
    nextOrderId: number;
    maxMarginRatio: number;
    lastAddPerpLpSharesTs: BN$1;
    settledPerpPnl: BN$1;
    totalDeposits: BN$1;
    totalWithdraws: BN$1;
    totalSocialLoss: BN$1;
    cumulativePerpFunding: BN$1;
    liquidationMarginFreed: BN$1;
    liquidationStartSlot: BN$1;
    isMarginTradingEnabled: boolean;
};
type SpotPosition = {
    marketIndex: number;
    balanceType: SpotBalanceType;
    scaledBalance: BN$1;
    openOrders: number;
    openBids: BN$1;
    openAsks: BN$1;
    cumulativeDeposits: BN$1;
};
type Order = {
    status: OrderStatus;
    orderType: OrderType;
    marketType: MarketType;
    slot: BN$1;
    orderId: number;
    userOrderId: number;
    marketIndex: number;
    price: BN$1;
    baseAssetAmount: BN$1;
    baseAssetAmountFilled: BN$1;
    quoteAssetAmount: BN$1;
    quoteAssetAmountFilled: BN$1;
    direction: PositionDirection;
    reduceOnly: boolean;
    triggerPrice: BN$1;
    triggerCondition: OrderTriggerCondition;
    existingPositionDirection: PositionDirection;
    postOnly: boolean;
    immediateOrCancel: boolean;
    oraclePriceOffset: number;
    auctionDuration: number;
    auctionStartPrice: BN$1;
    auctionEndPrice: BN$1;
    maxTs: BN$1;
};
type OrderParams = {
    orderType: OrderType;
    marketType: MarketType;
    userOrderId: number;
    direction: PositionDirection;
    baseAssetAmount: BN$1;
    price: BN$1;
    marketIndex: number;
    reduceOnly: boolean;
    postOnly: boolean;
    immediateOrCancel: boolean;
    triggerPrice: BN$1 | null;
    triggerCondition: OrderTriggerCondition;
    positionLimit: BN$1;
    oraclePriceOffset: number | null;
    auctionDuration: number | null;
    maxTs: BN$1 | null;
    auctionStartPrice: BN$1 | null;
    auctionEndPrice: BN$1 | null;
};
type NecessaryOrderParams = {
    orderType: OrderType;
    marketIndex: number;
    baseAssetAmount: BN$1;
    direction: PositionDirection;
};
type OptionalOrderParams = {
    [Property in keyof OrderParams]?: OrderParams[Property];
} & NecessaryOrderParams;
declare const DefaultOrderParams: OrderParams;
type MakerInfo = {
    maker: PublicKey;
    makerStats: PublicKey;
    makerUserAccount: UserAccount;
    order: Order;
};
type TakerInfo = {
    taker: PublicKey;
    takerStats: PublicKey;
    takerUserAccount: UserAccount;
    order: Order;
};
type ReferrerInfo = {
    referrer: PublicKey;
    referrerStats: PublicKey;
};
interface IWallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
type FeeStructure = {
    feeTiers: FeeTier[];
    makerRebateNumerator: BN$1;
    makerRebateDenominator: BN$1;
    fillerRewardStructure: OrderFillerRewardStructure;
    flatFillerFee: BN$1;
    referrerRewardEpochUpperBound: BN$1;
};
type FeeTier = {
    feeNumerator: number;
    feeDenominator: number;
    makerRebateNumerator: number;
    makerRebateDenominator: number;
    referrerRewardNumerator: number;
    referrerRewardDenominator: number;
    refereeFeeNumerator: number;
    refereeFeeDenominator: number;
};
type OrderFillerRewardStructure = {
    rewardNumerator: BN$1;
    rewardDenominator: BN$1;
    timeBasedRewardLowerBound: BN$1;
};
type OracleGuardRails = {
    priceDivergence: {
        markOracleDivergenceNumerator: BN$1;
        markOracleDivergenceDenominator: BN$1;
    };
    validity: {
        slotsBeforeStaleForAmm: BN$1;
        slotsBeforeStaleForMargin: BN$1;
        confidenceIntervalMaxSize: BN$1;
        tooVolatileRatio: BN$1;
    };
};
type MarginCategory = 'Initial' | 'Maintenance';
type InsuranceFundStake = {
    marketIndex: number;
    authority: PublicKey;
    ifShares: BN$1;
    ifBase: BN$1;
    lastWithdrawRequestShares: BN$1;
    lastWithdrawRequestValue: BN$1;
    lastWithdrawRequestTs: BN$1;
};
type SerumV3FulfillmentConfigAccount = {
    fulfillmentType: SpotFulfillmentType;
    status: SpotFulfillmentStatus;
    pubkey: PublicKey;
    marketIndex: number;
    serumProgramId: PublicKey;
    serumMarket: PublicKey;
    serumRequestQueue: PublicKey;
    serumEventQueue: PublicKey;
    serumBids: PublicKey;
    serumAsks: PublicKey;
    serumBaseVault: PublicKey;
    serumQuoteVault: PublicKey;
    serumOpenOrders: PublicKey;
    serumSignerNonce: BN$1;
};

declare class TokenFaucet {
    connection: Connection;
    wallet: IWallet;
    program: Program;
    provider: AnchorProvider;
    mint: PublicKey;
    opts?: ConfirmOptions;
    constructor(connection: Connection, wallet: IWallet, programId: PublicKey, mint: PublicKey, opts?: ConfirmOptions);
    getFaucetConfigPublicKeyAndNonce(): Promise<[
        PublicKey,
        number
    ]>;
    getMintAuthority(): Promise<PublicKey>;
    getFaucetConfigPublicKey(): Promise<PublicKey>;
    initialize(): Promise<TransactionSignature>;
    fetchState(): Promise<any>;
    private mintToUserIx;
    mintToUser(userTokenAccount: PublicKey, amount: BN$1): Promise<TransactionSignature>;
    transferMintAuthority(): Promise<TransactionSignature>;
    createAssociatedTokenAccountAndMintTo(userPublicKey: PublicKey, amount: BN$1): Promise<[PublicKey, TransactionSignature]>;
    createAssociatedTokenAccountAndMintToInstructions(userPublicKey: PublicKey, amount: BN$1): Promise<[PublicKey, TransactionInstruction, TransactionInstruction]>;
    getAssosciatedMockUSDMintAddress(props: {
        userPubKey: PublicKey;
    }): Promise<anchor.web3.PublicKey>;
    getTokenAccountInfo(props: {
        userPubKey: PublicKey;
    }): Promise<AccountInfo>;
    subscribeToTokenAccount(props: {
        userPubKey: PublicKey;
        callback: (accountInfo: AccountInfo) => void;
    }): Promise<boolean>;
}

type OraclePriceData = {
    price: BN$1;
    slot: BN$1;
    confidence: BN$1;
    hasSufficientNumberOfDataPoints: boolean;
    twap?: BN$1;
    twapConfidence?: BN$1;
};
type OracleInfo = {
    publicKey: PublicKey;
    source: OracleSource;
};
interface OracleClient {
    getOraclePriceDataFromBuffer(buffer: Buffer): OraclePriceData;
    getOraclePriceData(publicKey: PublicKey): Promise<OraclePriceData>;
}

declare class PythClient implements OracleClient {
    private connection;
    constructor(connection: Connection);
    getOraclePriceData(pricePublicKey: PublicKey): Promise<OraclePriceData>;
    getOraclePriceDataFromBuffer(buffer: Buffer): OraclePriceData;
}
declare function convertPythPrice(price: number, exponent: number): BN$1;

declare class SwitchboardClient implements OracleClient {
    connection: Connection;
    constructor(connection: Connection);
    getOraclePriceData(pricePublicKey: PublicKey): Promise<OraclePriceData>;
    getOraclePriceDataFromBuffer(buffer: Buffer): OraclePriceData;
    getProgram(): Program;
}

type PerpMarketConfig = {
    fullName?: string;
    category?: string[];
    symbol: string;
    baseAssetSymbol: string;
    marketIndex: number;
    launchTs: number;
    oracle: PublicKey;
    oracleSource: OracleSource;
};
declare const DevnetPerpMarkets: PerpMarketConfig[];
declare const MainnetPerpMarkets: PerpMarketConfig[];
declare const PerpMarkets: {
    [key in DriftEnv]: PerpMarketConfig[];
};

declare function fetchUserAccounts(connection: Connection, program: Program, authority: PublicKey, limit?: number): Promise<(UserAccount | undefined)[]>;
declare function fetchUserStatsAccount(connection: Connection, program: Program, authority: PublicKey): Promise<UserStatsAccount | undefined>;

interface AccountSubscriber<T> {
    dataAndSlot?: DataAndSlot<T>;
    subscribe(onChange: (data: T) => void): Promise<void>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
}
declare class NotSubscribedError extends Error {
    name: string;
}
interface DriftClientAccountEvents {
    stateAccountUpdate: (payload: StateAccount) => void;
    perpMarketAccountUpdate: (payload: PerpMarketAccount) => void;
    spotMarketAccountUpdate: (payload: SpotMarketAccount) => void;
    oraclePriceUpdate: (publicKey: PublicKey, data: OraclePriceData) => void;
    userAccountUpdate: (payload: UserAccount) => void;
    update: void;
    error: (e: Error) => void;
}
interface DriftClientAccountSubscriber {
    eventEmitter: StrictEventEmitter<EventEmitter, DriftClientAccountEvents>;
    isSubscribed: boolean;
    subscribe(): Promise<boolean>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    addPerpMarket(marketIndex: number): Promise<boolean>;
    addSpotMarket(marketIndex: number): Promise<boolean>;
    addOracle(oracleInfo: OracleInfo): Promise<boolean>;
    getStateAccountAndSlot(): DataAndSlot<StateAccount>;
    getMarketAccountAndSlot(marketIndex: number): DataAndSlot<PerpMarketAccount> | undefined;
    getMarketAccountsAndSlots(): DataAndSlot<PerpMarketAccount>[];
    getSpotMarketAccountAndSlot(marketIndex: number): DataAndSlot<SpotMarketAccount> | undefined;
    getSpotMarketAccountsAndSlots(): DataAndSlot<SpotMarketAccount>[];
    getOraclePriceDataAndSlot(oraclePublicKey: PublicKey): DataAndSlot<OraclePriceData> | undefined;
}
interface UserAccountEvents {
    userAccountUpdate: (payload: UserAccount) => void;
    update: void;
    error: (e: Error) => void;
}
interface UserAccountSubscriber {
    eventEmitter: StrictEventEmitter<EventEmitter, UserAccountEvents>;
    isSubscribed: boolean;
    subscribe(): Promise<boolean>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    getUserAccountAndSlot(): DataAndSlot<UserAccount>;
}
interface TokenAccountEvents {
    tokenAccountUpdate: (payload: AccountInfo) => void;
    update: void;
    error: (e: Error) => void;
}
interface TokenAccountSubscriber {
    eventEmitter: StrictEventEmitter<EventEmitter, TokenAccountEvents>;
    isSubscribed: boolean;
    subscribe(): Promise<boolean>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    getTokenAccountAndSlot(): DataAndSlot<AccountInfo>;
}
interface OracleEvents {
    oracleUpdate: (payload: OraclePriceData) => void;
    update: void;
    error: (e: Error) => void;
}
interface OracleAccountSubscriber {
    eventEmitter: StrictEventEmitter<EventEmitter, OracleEvents>;
    isSubscribed: boolean;
    subscribe(): Promise<boolean>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    getOraclePriceData(): DataAndSlot<OraclePriceData>;
}
type AccountToPoll = {
    key: string;
    publicKey: PublicKey;
    eventType: string;
    callbackId?: string;
    mapKey?: number;
};
type OraclesToPoll = {
    publicKey: PublicKey;
    source: OracleSource;
    callbackId?: string;
};
type BufferAndSlot = {
    slot: number;
    buffer: Buffer | undefined;
};
type DataAndSlot<T> = {
    data: T;
    slot: number;
};
interface UserStatsAccountEvents {
    userStatsAccountUpdate: (payload: UserStatsAccount) => void;
    update: void;
    error: (e: Error) => void;
}
interface UserStatsAccountSubscriber {
    eventEmitter: StrictEventEmitter<EventEmitter, UserStatsAccountEvents>;
    isSubscribed: boolean;
    subscribe(): Promise<boolean>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    getUserStatsAccountAndSlot(): DataAndSlot<UserStatsAccount>;
}

declare class OracleClientCache {
    cache: Map<string, OracleClient>;
    constructor();
    get(oracleSource: OracleSource, connection: Connection): OracleClient;
}

declare class WebSocketDriftClientAccountSubscriber implements DriftClientAccountSubscriber {
    isSubscribed: boolean;
    program: Program;
    perpMarketIndexes: number[];
    spotMarketIndexes: number[];
    oracleInfos: OracleInfo[];
    oracleClientCache: OracleClientCache;
    eventEmitter: StrictEventEmitter<EventEmitter, DriftClientAccountEvents>;
    stateAccountSubscriber?: AccountSubscriber<StateAccount>;
    perpMarketAccountSubscribers: Map<number, AccountSubscriber<PerpMarketAccount>>;
    spotMarketAccountSubscribers: Map<number, AccountSubscriber<SpotMarketAccount>>;
    oracleSubscribers: Map<string, AccountSubscriber<OraclePriceData>>;
    private isSubscribing;
    private subscriptionPromise;
    private subscriptionPromiseResolver;
    constructor(program: Program, perpMarketIndexes: number[], spotMarketIndexes: number[], oracleInfos: OracleInfo[]);
    subscribe(): Promise<boolean>;
    subscribeToPerpMarketAccounts(): Promise<boolean>;
    subscribeToPerpMarketAccount(marketIndex: number): Promise<boolean>;
    subscribeToSpotMarketAccounts(): Promise<boolean>;
    subscribeToSpotMarketAccount(marketIndex: number): Promise<boolean>;
    subscribeToOracles(): Promise<boolean>;
    subscribeToOracle(oracleInfo: OracleInfo): Promise<boolean>;
    unsubscribeFromMarketAccounts(): Promise<void>;
    unsubscribeFromSpotMarketAccounts(): Promise<void>;
    unsubscribeFromOracles(): Promise<void>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    addSpotMarket(marketIndex: number): Promise<boolean>;
    addPerpMarket(marketIndex: number): Promise<boolean>;
    addOracle(oracleInfo: OracleInfo): Promise<boolean>;
    assertIsSubscribed(): void;
    getStateAccountAndSlot(): DataAndSlot<StateAccount>;
    getMarketAccountAndSlot(marketIndex: number): DataAndSlot<PerpMarketAccount> | undefined;
    getMarketAccountsAndSlots(): DataAndSlot<PerpMarketAccount>[];
    getSpotMarketAccountAndSlot(marketIndex: number): DataAndSlot<SpotMarketAccount> | undefined;
    getSpotMarketAccountsAndSlots(): DataAndSlot<SpotMarketAccount>[];
    getOraclePriceDataAndSlot(oraclePublicKey: PublicKey): DataAndSlot<OraclePriceData> | undefined;
}

type AccountToLoad = {
    publicKey: PublicKey;
    callbacks: Map<string, (buffer: Buffer, slot: number) => void>;
};
declare class BulkAccountLoader {
    connection: Connection;
    commitment: Commitment;
    pollingFrequency: number;
    accountsToLoad: Map<string, AccountToLoad>;
    bufferAndSlotMap: Map<string, BufferAndSlot>;
    errorCallbacks: Map<string, (e: any) => void>;
    intervalId?: NodeJS.Timer;
    loadPromise?: Promise<void>;
    loadPromiseResolver: () => void;
    lastTimeLoadingPromiseCleared: number;
    mostRecentSlot: number;
    constructor(connection: Connection, commitment: Commitment, pollingFrequency: number);
    addAccount(publicKey: PublicKey, callback: (buffer: Buffer, slot: number) => void): Promise<string>;
    removeAccount(publicKey: PublicKey, callbackId: string): void;
    addErrorCallbacks(callback: (error: Error) => void): string;
    removeErrorCallbacks(callbackId: string): void;
    chunks<T>(array: readonly T[], size: number): T[][];
    load(): Promise<void>;
    loadChunk(accountsToLoad: AccountToLoad[]): Promise<void>;
    handleAccountCallbacks(accountToLoad: AccountToLoad, buffer: Buffer, slot: number): void;
    getBufferAndSlot(publicKey: PublicKey): BufferAndSlot | undefined;
    startPolling(): void;
    stopPolling(): void;
    log(msg: string): void;
    updatePollingFrequency(pollingFrequency: number): void;
}

type TxSigAndSlot = {
    txSig: TransactionSignature;
    slot: number;
};
interface TxSender {
    provider: Provider;
    send(tx: Transaction, additionalSigners?: Array<Signer>, opts?: ConfirmOptions, preSigned?: boolean): Promise<TxSigAndSlot>;
}

type SpotMarketConfig = {
    symbol: string;
    marketIndex: number;
    oracle: PublicKey;
    mint: PublicKey;
    oracleSource: OracleSource;
    precision: BN$1;
    precisionExp: BN$1;
    serumMarket?: PublicKey;
};
declare const WRAPPED_SOL_MINT: PublicKey;
declare const DevnetSpotMarkets: SpotMarketConfig[];
declare const MainnetSpotMarkets: SpotMarketConfig[];
declare const SpotMarkets: {
    [key in DriftEnv]: SpotMarketConfig[];
};

type DriftConfig = {
    ENV: DriftEnv;
    PYTH_ORACLE_MAPPING_ADDRESS: string;
    DRIFT_PROGRAM_ID: string;
    USDC_MINT_ADDRESS: string;
    SERUM_V3: string;
    V2_ALPHA_TICKET_MINT_ADDRESS: string;
    PERP_MARKETS: PerpMarketConfig[];
    SPOT_MARKETS: SpotMarketConfig[];
};
type DriftEnv = 'devnet' | 'mainnet-beta';
declare const configs: {
    [key in DriftEnv]: DriftConfig;
};
declare const getConfig: () => DriftConfig;
/**
 * Allows customization of the SDK's environment and endpoints. You can pass individual settings to override the settings with your own presets.
 *
 * Defaults to master environment if you don't use this function.
 * @param props
 * @returns
 */
declare const initialize: (props: {
    env: DriftEnv;
    overrideEnv?: Partial<DriftConfig>;
}) => DriftConfig;
declare function getMarketsAndOraclesForSubscription(env: DriftEnv): {
    perpMarketIndexes: number[];
    spotMarketIndexes: number[];
    oracleInfos: OracleInfo[];
};

type DriftClientConfig = {
    connection: Connection;
    wallet: IWallet;
    programID: PublicKey;
    accountSubscription?: DriftClientSubscriptionConfig;
    opts?: ConfirmOptions;
    txSenderConfig?: TxSenderConfig;
    subAccountIds?: number[];
    activeSubAccountId?: number;
    perpMarketIndexes?: number[];
    spotMarketIndexes?: number[];
    oracleInfos?: OracleInfo[];
    env?: DriftEnv;
    userStats?: boolean;
    authority?: PublicKey;
};
type DriftClientSubscriptionConfig = {
    type: 'websocket';
} | {
    type: 'polling';
    accountLoader: BulkAccountLoader;
};
type TxSenderConfig = {
    type: 'retry';
    timeout?: number;
    retrySleep?: number;
    additionalConnections?: Connection[];
};

type UserConfig = {
    accountSubscription?: UserSubscriptionConfig;
    driftClient: DriftClient;
    userAccountPublicKey: PublicKey;
};
type UserSubscriptionConfig = {
    type: 'websocket';
} | {
    type: 'polling';
    accountLoader: BulkAccountLoader;
};

type UserStatsConfig = {
    accountSubscription?: UserStatsSubscriptionConfig;
    driftClient: DriftClient;
    userStatsAccountPublicKey: PublicKey;
};
type UserStatsSubscriptionConfig = {
    type: 'websocket';
} | {
    type: 'polling';
    accountLoader: BulkAccountLoader;
};

declare class UserStats {
    driftClient: DriftClient;
    userStatsAccountPublicKey: PublicKey;
    accountSubscriber: UserStatsAccountSubscriber;
    isSubscribed: boolean;
    constructor(config: UserStatsConfig);
    subscribe(): Promise<boolean>;
    fetchAccounts(): Promise<void>;
    unsubscribe(): Promise<void>;
    getAccountAndSlot(): DataAndSlot<UserStatsAccount>;
    getAccount(): UserStatsAccount;
    getReferrerInfo(): ReferrerInfo | undefined;
}

type RemainingAccountParams = {
    userAccounts: UserAccount[];
    writablePerpMarketIndexes?: number[];
    writableSpotMarketIndexes?: number[];
    readablePerpMarketIndex?: number;
    readableSpotMarketIndexes?: number[];
    useMarketLastSlotCache?: boolean;
};
/**
 * # DriftClient
 * This class is the main way to interact with Drift Protocol. It allows you to subscribe to the various accounts where the Market's state is stored, as well as: opening positions, liquidating, settling funding, depositing & withdrawing, and more.
 */
declare class DriftClient {
    connection: Connection;
    wallet: IWallet;
    program: Program;
    provider: AnchorProvider;
    opts?: ConfirmOptions;
    users: Map<number, User>;
    userStats?: UserStats;
    activeSubAccountId: number;
    userAccountSubscriptionConfig: UserSubscriptionConfig;
    accountSubscriber: DriftClientAccountSubscriber;
    eventEmitter: StrictEventEmitter<EventEmitter, DriftClientAccountEvents>;
    _isSubscribed: boolean;
    txSender: TxSender;
    perpMarketLastSlotCache: Map<number, number>;
    spotMarketLastSlotCache: Map<number, number>;
    authority: PublicKey;
    get isSubscribed(): boolean;
    set isSubscribed(val: boolean);
    constructor(config: DriftClientConfig);
    createUsers(subAccountIds: number[], accountSubscriptionConfig: UserSubscriptionConfig): void;
    createUser(subAccountId: number, accountSubscriptionConfig: UserSubscriptionConfig): User;
    subscribe(): Promise<boolean>;
    subscribeUsers(): Promise<boolean>[];
    /**
     *	Forces the accountSubscriber to fetch account updates from rpc
     */
    fetchAccounts(): Promise<void>;
    unsubscribe(): Promise<void>;
    unsubscribeUsers(): Promise<void>[];
    statePublicKey?: PublicKey;
    getStatePublicKey(): Promise<PublicKey>;
    signerPublicKey?: PublicKey;
    getSignerPublicKey(): PublicKey;
    getStateAccount(): StateAccount;
    /**
     * Forces a fetch to rpc before returning accounts. Useful for anchor tests.
     */
    forceGetStateAccount(): Promise<StateAccount>;
    getPerpMarketAccount(marketIndex: number): PerpMarketAccount | undefined;
    /**
     * Forces a fetch to rpc before returning accounts. Useful for anchor tests.
     * @param marketIndex
     */
    forceGetPerpMarketAccount(marketIndex: number): Promise<PerpMarketAccount | undefined>;
    getPerpMarketAccounts(): PerpMarketAccount[];
    getSpotMarketAccount(marketIndex: number): SpotMarketAccount | undefined;
    /**
     * Forces a fetch to rpc before returning accounts. Useful for anchor tests.
     * @param marketIndex
     */
    forceGetSpotMarketAccount(marketIndex: number): Promise<SpotMarketAccount | undefined>;
    getSpotMarketAccounts(): SpotMarketAccount[];
    getQuoteSpotMarketAccount(): SpotMarketAccount;
    getOraclePriceDataAndSlot(oraclePublicKey: PublicKey): DataAndSlot<OraclePriceData> | undefined;
    getSerumV3FulfillmentConfig(serumMarket: PublicKey): Promise<SerumV3FulfillmentConfigAccount>;
    /**
     * Update the wallet to use for drift transactions and linked user account
     * @param newWallet
     * @param subAccountIds
     * @param activeSubAccountId
     */
    updateWallet(newWallet: IWallet, subAccountIds?: number[], activeSubAccountId?: number): Promise<void>;
    switchActiveUser(subAccountId: number): Promise<void>;
    addUser(subAccountId: number): Promise<void>;
    initializeUserAccount(subAccountId?: number, name?: string, referrerInfo?: ReferrerInfo): Promise<[TransactionSignature, PublicKey]>;
    getInitializeUserInstructions(subAccountId?: number, name?: string, referrerInfo?: ReferrerInfo): Promise<[PublicKey, TransactionInstruction]>;
    getInitializeUserStatsIx(): Promise<TransactionInstruction>;
    updateUserName(name: string, subAccountId?: number): Promise<TransactionSignature>;
    updateUserCustomMarginRatio(marginRatio: number, subAccountId?: number): Promise<TransactionSignature>;
    updateUserMarginTradingEnabled(marginTradingEnabled: boolean, subAccountId?: number): Promise<TransactionSignature>;
    updateUserDelegate(delegate: PublicKey, subAccountId?: number): Promise<TransactionSignature>;
    getUserAccountsForDelegate(delegate: PublicKey): Promise<UserAccount[]>;
    getUserAccountsForAuthority(authority: PublicKey): Promise<UserAccount[]>;
    deleteUser(subAccountId?: number): Promise<TransactionSignature>;
    getUser(subAccountId?: number): User;
    getUsers(): User[];
    getUserStats(): UserStats;
    userStatsAccountPublicKey: PublicKey;
    getUserStatsAccountPublicKey(): PublicKey;
    getUserAccountPublicKey(): Promise<PublicKey>;
    getUserAccount(subAccountId?: number): UserAccount | undefined;
    /**
     * Forces a fetch to rpc before returning accounts. Useful for anchor tests.
     * @param subAccountId
     */
    forceGetUserAccount(subAccountId?: number): Promise<UserAccount | undefined>;
    getUserAccountAndSlot(subAccountId?: number): DataAndSlot<UserAccount> | undefined;
    getSpotPosition(marketIndex: number): SpotPosition | undefined;
    getQuoteAssetTokenAmount(): BN$1;
    getTokenAmount(marketIndex: number): BN$1;
    getRemainingAccounts(params: RemainingAccountParams): AccountMeta[];
    getRemainingAccountMapsForUsers(userAccounts: UserAccount[]): {
        oracleAccountMap: Map<string, AccountMeta>;
        spotMarketAccountMap: Map<number, AccountMeta>;
        perpMarketAccountMap: Map<number, AccountMeta>;
    };
    getOrder(orderId: number): Order | undefined;
    getOrderByUserId(userOrderId: number): Order | undefined;
    deposit(amount: BN$1, marketIndex: number, collateralAccountPublicKey: PublicKey, subAccountId?: number, reduceOnly?: boolean): Promise<TransactionSignature>;
    getDepositInstruction(amount: BN$1, marketIndex: number, userTokenAccount: PublicKey, subAccountId?: number, reduceOnly?: boolean, userInitialized?: boolean): Promise<TransactionInstruction>;
    private checkIfAccountExists;
    private getWrappedSolAccountCreationIxs;
    getAssociatedTokenAccountCreationIx(tokenMintAddress: PublicKey, associatedTokenAddress: PublicKey): anchor.web3.TransactionInstruction;
    /**
     * Creates the Clearing House User account for a user, and deposits some initial collateral
     * @param amount
     * @param userTokenAccount
     * @param marketIndex
     * @param subAccountId
     * @param name
     * @param fromSubAccountId
     * @returns
     */
    initializeUserAccountAndDepositCollateral(amount: BN$1, userTokenAccount: PublicKey, marketIndex?: number, subAccountId?: number, name?: string, fromSubAccountId?: number, referrerInfo?: ReferrerInfo): Promise<[TransactionSignature, PublicKey]>;
    initializeUserAccountForDevnet(subAccountId: number, name: string, marketIndex: number, tokenFaucet: TokenFaucet, amount: BN$1, referrerInfo?: ReferrerInfo): Promise<[TransactionSignature, PublicKey]>;
    withdraw(amount: BN$1, marketIndex: number, userTokenAccount: PublicKey, reduceOnly?: boolean): Promise<TransactionSignature>;
    getWithdrawIx(amount: BN$1, marketIndex: number, userTokenAccount: PublicKey, reduceOnly?: boolean): Promise<TransactionInstruction>;
    transferDeposit(amount: BN$1, marketIndex: number, fromSubAccountId: number, toSubAccountId: number): Promise<TransactionSignature>;
    getTransferDepositIx(amount: BN$1, marketIndex: number, fromSubAccountId: number, toSubAccountId: number): Promise<TransactionInstruction>;
    updateSpotMarketCumulativeInterest(marketIndex: number): Promise<TransactionSignature>;
    updateSpotMarketCumulativeInterestIx(marketIndex: number): Promise<TransactionInstruction>;
    settleLP(settleeUserAccountPublicKey: PublicKey, marketIndex: number): Promise<TransactionSignature>;
    settleLPIx(settleeUserAccountPublicKey: PublicKey, marketIndex: number): Promise<TransactionInstruction>;
    removePerpLpShares(marketIndex: number, sharesToBurn?: BN$1): Promise<TransactionSignature>;
    removePerpLpSharesInExpiringMarket(marketIndex: number, userAccountPublicKey: PublicKey, sharesToBurn?: BN$1): Promise<TransactionSignature>;
    getRemovePerpLpSharesInExpiringMarket(marketIndex: number, userAccountPublicKey: PublicKey, sharesToBurn?: BN$1): Promise<TransactionInstruction>;
    getRemovePerpLpSharesIx(marketIndex: number, sharesToBurn?: BN$1): Promise<TransactionInstruction>;
    addPerpLpShares(amount: BN$1, marketIndex: number): Promise<TransactionSignature>;
    getAddPerpLpSharesIx(amount: BN$1, marketIndex: number): Promise<TransactionInstruction>;
    openPosition(direction: PositionDirection, amount: BN$1, marketIndex: number, limitPrice?: BN$1): Promise<TransactionSignature>;
    sendSignedTx(tx: Transaction): Promise<TransactionSignature>;
    /**
     * Sends a market order and returns a signed tx which can fill the order against the vamm, which the caller can use to fill their own order if required.
     * @param orderParams
     * @param userAccountPublicKey
     * @param userAccount
     * @param makerInfo
     * @returns
     */
    sendMarketOrderAndGetSignedFillTx(orderParams: OptionalOrderParams, userAccountPublicKey: PublicKey, userAccount: UserAccount, makerInfo?: MakerInfo): Promise<{
        txSig: TransactionSignature;
        signedFillTx: Transaction;
    }>;
    placePerpOrder(orderParams: OptionalOrderParams): Promise<TransactionSignature>;
    getOrderParams(optionalOrderParams: OptionalOrderParams, marketType: MarketType): OrderParams;
    getPlacePerpOrderIx(orderParams: OptionalOrderParams): Promise<TransactionInstruction>;
    updateAMMs(marketIndexes: number[]): Promise<TransactionSignature>;
    getUpdateAMMsIx(marketIndexes: number[]): Promise<TransactionInstruction>;
    settleExpiredMarket(marketIndex: number): Promise<TransactionSignature>;
    getSettleExpiredMarketIx(marketIndex: number): Promise<TransactionInstruction>;
    settleExpiredMarketPoolsToRevenuePool(perpMarketIndex: number): Promise<TransactionSignature>;
    cancelOrder(orderId?: number): Promise<TransactionSignature>;
    getCancelOrderIx(orderId?: number): Promise<TransactionInstruction>;
    cancelOrderByUserId(userOrderId: number): Promise<TransactionSignature>;
    getCancelOrderByUserIdIx(userOrderId: number): Promise<TransactionInstruction>;
    cancelOrders(marketType?: MarketType, marketIndex?: number, direction?: PositionDirection): Promise<TransactionSignature>;
    getCancelOrdersIx(marketType: MarketType | null, marketIndex: number | null, direction: PositionDirection | null): Promise<TransactionInstruction>;
    fillPerpOrder(userAccountPublicKey: PublicKey, user: UserAccount, order?: Pick<Order, 'marketIndex' | 'orderId'>, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionSignature>;
    getFillPerpOrderIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, order: Pick<Order, 'marketIndex' | 'orderId'>, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionInstruction>;
    placeSpotOrder(orderParams: OptionalOrderParams): Promise<TransactionSignature>;
    getPlaceSpotOrderIx(orderParams: OptionalOrderParams): Promise<TransactionInstruction>;
    fillSpotOrder(userAccountPublicKey: PublicKey, user: UserAccount, order?: Order, fulfillmentConfig?: SerumV3FulfillmentConfigAccount, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionSignature>;
    getFillSpotOrderIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, order?: Order, fulfillmentConfig?: SerumV3FulfillmentConfigAccount, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionInstruction>;
    addSpotFulfillmentAccounts(marketIndex: number, remainingAccounts: AccountMeta[], fulfillmentConfig?: SerumV3FulfillmentConfigAccount): void;
    addSerumRemainingAccounts(marketIndex: number, remainingAccounts: AccountMeta[], fulfillmentConfig: SerumV3FulfillmentConfigAccount): void;
    triggerOrder(userAccountPublicKey: PublicKey, user: UserAccount, order: Order): Promise<TransactionSignature>;
    getTriggerOrderIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, order: Order): Promise<TransactionInstruction>;
    forceCancelOrders(userAccountPublicKey: PublicKey, user: UserAccount): Promise<TransactionSignature>;
    getForceCancelOrdersIx(userAccountPublicKey: PublicKey, userAccount: UserAccount): Promise<TransactionInstruction>;
    placeAndTakePerpOrder(orderParams: OptionalOrderParams, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionSignature>;
    getPlaceAndTakePerpOrderIx(orderParams: OptionalOrderParams, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionInstruction>;
    placeAndMakePerpOrder(orderParams: OptionalOrderParams, takerInfo: TakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionSignature>;
    getPlaceAndMakePerpOrderIx(orderParams: OptionalOrderParams, takerInfo: TakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionInstruction>;
    placeAndTakeSpotOrder(orderParams: OptionalOrderParams, fulfillmentConfig?: SerumV3FulfillmentConfigAccount, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionSignature>;
    getPlaceAndTakeSpotOrderIx(orderParams: OptionalOrderParams, fulfillmentConfig?: SerumV3FulfillmentConfigAccount, makerInfo?: MakerInfo, referrerInfo?: ReferrerInfo): Promise<TransactionInstruction>;
    placeAndMakeSpotOrder(orderParams: OptionalOrderParams, takerInfo: TakerInfo, fulfillmentConfig?: SerumV3FulfillmentConfigAccount, referrerInfo?: ReferrerInfo): Promise<TransactionSignature>;
    getPlaceAndMakeSpotOrderIx(orderParams: OptionalOrderParams, takerInfo: TakerInfo, fulfillmentConfig?: SerumV3FulfillmentConfigAccount, referrerInfo?: ReferrerInfo): Promise<TransactionInstruction>;
    /**
     * Close an entire position. If you want to reduce a position, use the {@link openPosition} method in the opposite direction of the current position.
     * @param marketIndex
     * @returns
     */
    closePosition(marketIndex: number, limitPrice?: BN$1): Promise<TransactionSignature>;
    /**
     * Modifies an open order by closing it and replacing it with a new order.
     * @param orderId: The open order to modify
     * @param newBaseAmount: The new base amount for the order. One of [newBaseAmount|newLimitPrice|newOraclePriceOffset] must be provided.
     * @param newLimitPice: The new limit price for the order. One of [newBaseAmount|newLimitPrice|newOraclePriceOffset] must be provided.
     * @param newOraclePriceOffset: The new oracle price offset for the order. One of [newBaseAmount|newLimitPrice|newOraclePriceOffset] must be provided.
     * @returns
     */
    modifyPerpOrder(orderId: number, newBaseAmount?: BN$1, newLimitPrice?: BN$1, newOraclePriceOffset?: number): Promise<TransactionSignature>;
    settlePNLs(users: {
        settleeUserAccountPublicKey: PublicKey;
        settleeUserAccount: UserAccount;
    }[], marketIndex: number): Promise<TransactionSignature>;
    settlePNL(settleeUserAccountPublicKey: PublicKey, settleeUserAccount: UserAccount, marketIndex: number): Promise<TransactionSignature>;
    settlePNLIx(settleeUserAccountPublicKey: PublicKey, settleeUserAccount: UserAccount, marketIndex: number): Promise<TransactionInstruction>;
    liquidatePerp(userAccountPublicKey: PublicKey, userAccount: UserAccount, marketIndex: number, maxBaseAssetAmount: BN$1, limitPrice?: BN$1): Promise<TransactionSignature>;
    getLiquidatePerpIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, marketIndex: number, maxBaseAssetAmount: BN$1, limitPrice?: BN$1): Promise<TransactionInstruction>;
    liquidateSpot(userAccountPublicKey: PublicKey, userAccount: UserAccount, assetMarketIndex: number, liabilityMarketIndex: number, maxLiabilityTransfer: BN$1, limitPrice?: BN$1): Promise<TransactionSignature>;
    getLiquidateSpotIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, assetMarketIndex: number, liabilityMarketIndex: number, maxLiabilityTransfer: BN$1, limitPrice?: BN$1): Promise<TransactionInstruction>;
    liquidateBorrowForPerpPnl(userAccountPublicKey: PublicKey, userAccount: UserAccount, perpMarketIndex: number, liabilityMarketIndex: number, maxLiabilityTransfer: BN$1, limitPrice?: BN$1): Promise<TransactionSignature>;
    getLiquidateBorrowForPerpPnlIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, perpMarketIndex: number, liabilityMarketIndex: number, maxLiabilityTransfer: BN$1, limitPrice?: BN$1): Promise<TransactionInstruction>;
    liquidatePerpPnlForDeposit(userAccountPublicKey: PublicKey, userAccount: UserAccount, perpMarketIndex: number, assetMarketIndex: number, maxPnlTransfer: BN$1, limitPrice?: BN$1): Promise<TransactionSignature>;
    getLiquidatePerpPnlForDepositIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, perpMarketIndex: number, assetMarketIndex: number, maxPnlTransfer: BN$1, limitPrice?: BN$1): Promise<TransactionInstruction>;
    resolvePerpBankruptcy(userAccountPublicKey: PublicKey, userAccount: UserAccount, marketIndex: number): Promise<TransactionSignature>;
    getResolvePerpBankruptcyIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, marketIndex: number): Promise<TransactionInstruction>;
    resolveSpotBankruptcy(userAccountPublicKey: PublicKey, userAccount: UserAccount, marketIndex: number): Promise<TransactionSignature>;
    getResolveSpotBankruptcyIx(userAccountPublicKey: PublicKey, userAccount: UserAccount, marketIndex: number): Promise<TransactionInstruction>;
    updateFundingRate(perpMarketIndex: number, oracle: PublicKey): Promise<TransactionSignature>;
    getUpdateFundingRateIx(perpMarketIndex: number, oracle: PublicKey): Promise<TransactionInstruction>;
    settleFundingPayment(userAccountPublicKey: PublicKey): Promise<TransactionSignature>;
    getSettleFundingPaymentIx(userAccountPublicKey: PublicKey): Promise<TransactionInstruction>;
    triggerEvent(eventName: keyof DriftClientAccountEvents, data?: any): void;
    getOracleDataForPerpMarket(marketIndex: number): OraclePriceData;
    getOracleDataForSpotMarket(marketIndex: number): OraclePriceData;
    initializeInsuranceFundStake(marketIndex: number): Promise<TransactionSignature>;
    getInitializeInsuranceFundStakeIx(marketIndex: number): Promise<TransactionInstruction>;
    addInsuranceFundStake(marketIndex: number, amount: BN$1, collateralAccountPublicKey: PublicKey): Promise<TransactionSignature>;
    requestRemoveInsuranceFundStake(marketIndex: number, amount: BN$1): Promise<TransactionSignature>;
    cancelRequestRemoveInsuranceFundStake(marketIndex: number): Promise<TransactionSignature>;
    removeInsuranceFundStake(marketIndex: number, collateralAccountPublicKey: PublicKey): Promise<TransactionSignature>;
    settleRevenueToInsuranceFund(marketIndex: number): Promise<TransactionSignature>;
    resolvePerpPnlDeficit(spotMarketIndex: number, perpMarketIndex: number): Promise<TransactionSignature>;
    getResolvePerpPnlDeficitIx(spotMarketIndex: number, perpMarketIndex: number): Promise<TransactionInstruction>;
}

declare class User {
    driftClient: DriftClient;
    userAccountPublicKey: PublicKey;
    accountSubscriber: UserAccountSubscriber;
    _isSubscribed: boolean;
    eventEmitter: StrictEventEmitter<EventEmitter, UserAccountEvents>;
    get isSubscribed(): boolean;
    set isSubscribed(val: boolean);
    constructor(config: UserConfig);
    /**
     * Subscribe to User state accounts
     * @returns SusbcriptionSuccess result
     */
    subscribe(): Promise<boolean>;
    /**
     *	Forces the accountSubscriber to fetch account updates from rpc
     */
    fetchAccounts(): Promise<void>;
    unsubscribe(): Promise<void>;
    getUserAccount(): UserAccount;
    getUserAccountAndSlot(): DataAndSlot<UserAccount> | undefined;
    /**
     * Gets the user's current position for a given perp market. If the user has no position returns undefined
     * @param marketIndex
     * @returns userPerpPosition
     */
    getPerpPosition(marketIndex: number): PerpPosition | undefined;
    /**
     * Gets the user's current position for a given spot market. If the user has no position returns undefined
     * @param marketIndex
     * @returns userSpotPosition
     */
    getSpotPosition(marketIndex: number): SpotPosition | undefined;
    getEmptyPosition(marketIndex: number): PerpPosition;
    getClonedPosition(position: PerpPosition): PerpPosition;
    /**
     * @param orderId
     * @returns Order
     */
    getOrder(orderId: number): Order | undefined;
    /**
     * @param userOrderId
     * @returns Order
     */
    getOrderByUserOrderId(userOrderId: number): Order | undefined;
    getUserAccountPublicKey(): PublicKey;
    exists(): Promise<boolean>;
    /**
     * calculates the total open bids/asks in a perp market (including lps)
     * @returns : open bids
     * @returns : open asks
     */
    getPerpBidAsks(marketIndex: number): [BN$1, BN$1];
    /**
     * calculates the open bids and asks for an lp
     * @returns : lp open bids
     * @returns : lp open asks
     */
    getLPBidAsks(marketIndex: number): [BN$1, BN$1];
    /**
     * calculates the market position if the lp position was settled
     * @returns : the settled userPosition
     * @returns : the dust base asset amount (ie, < stepsize)
     * @returns : pnl from settle
     */
    getSettledLPPosition(marketIndex: number): [PerpPosition, BN$1, BN$1];
    /**
     * calculates Buying Power = FC * MAX_LEVERAGE
     * @returns : Precision QUOTE_PRECISION
     */
    getBuyingPower(marketIndex: number): BN$1;
    /**
     * calculates Free Collateral = Total collateral - initial margin requirement
     * @returns : Precision QUOTE_PRECISION
     */
    getFreeCollateral(): BN$1;
    /**
     * @returns The margin requirement of a certain type (Initial or Maintenance) in USDC. : QUOTE_PRECISION
     */
    getMarginRequirement(marginCategory: MarginCategory, liquidationBuffer?: BN$1): BN$1;
    /**
     * @returns The initial margin requirement in USDC. : QUOTE_PRECISION
     */
    getInitialMarginRequirement(): BN$1;
    /**
     * @returns The maintenance margin requirement in USDC. : QUOTE_PRECISION
     */
    getMaintenanceMarginRequirement(liquidationBuffer?: BN$1): BN$1;
    getActivePerpPositions(): PerpPosition[];
    /**
     * calculates unrealized position price pnl
     * @returns : Precision QUOTE_PRECISION
     */
    getUnrealizedPNL(withFunding?: boolean, marketIndex?: number, withWeightMarginCategory?: MarginCategory): BN$1;
    /**
     * calculates unrealized funding payment pnl
     * @returns : Precision QUOTE_PRECISION
     */
    getUnrealizedFundingPNL(marketIndex?: number): BN$1;
    getSpotMarketLiabilityValue(marketIndex?: number, marginCategory?: MarginCategory, liquidationBuffer?: BN$1, includeOpenOrders?: boolean): BN$1;
    getSpotLiabilityValue(tokenAmount: BN$1, oraclePriceData: OraclePriceData, spotMarketAccount: SpotMarketAccount, marginCategory?: MarginCategory, liquidationBuffer?: BN$1): BN$1;
    getSpotMarketAssetValue(marketIndex?: number, marginCategory?: MarginCategory, includeOpenOrders?: boolean): BN$1;
    getSpotAssetValue(tokenAmount: BN$1, oraclePriceData: OraclePriceData, spotMarketAccount: SpotMarketAccount, marginCategory?: MarginCategory): BN$1;
    getNetSpotMarketValue(withWeightMarginCategory?: MarginCategory): BN$1;
    /**
     * calculates TotalCollateral: collateral + unrealized pnl
     * @returns : Precision QUOTE_PRECISION
     */
    getTotalCollateral(marginCategory?: MarginCategory): BN$1;
    /**
     * calculates User Health by comparing total collateral and maint. margin requirement
     * @returns : number (value from [0, 100])
     */
    getHealth(): number;
    /**
     * calculates sum of position value across all positions in margin system
     * @returns : Precision QUOTE_PRECISION
     */
    getTotalPerpPositionValue(marginCategory?: MarginCategory, liquidationBuffer?: BN$1, includeOpenOrders?: boolean): BN$1;
    /**
     * calculates position value in margin system
     * @returns : Precision QUOTE_PRECISION
     */
    getPerpPositionValue(marketIndex: number, oraclePriceData: OraclePriceData): BN$1;
    getPositionSide(currentPosition: Pick<PerpPosition, 'baseAssetAmount'>): PositionDirection | undefined;
    /**
     * calculates average exit price (optionally for closing up to 100% of position)
     * @returns : Precision PRICE_PRECISION
     */
    getPositionEstimatedExitPriceAndPnl(position: PerpPosition, amountToClose?: BN$1, useAMMClose?: boolean): [BN$1, BN$1];
    /**
     * calculates current user leverage across all positions
     * @returns : Precision TEN_THOUSAND
     */
    getLeverage(): BN$1;
    getTotalLiabilityValue(marginCategory?: MarginCategory): BN$1;
    getTotalAssetValue(marginCategory?: MarginCategory): BN$1;
    /**
     * calculates max allowable leverage exceeding hitting requirement category
     * @params category {Initial, Maintenance}
     * @returns : Precision TEN_THOUSAND
     */
    getMaxLeverage(marketIndex: number, category?: MarginCategory): BN$1;
    /**
     * calculates margin ratio: total collateral / |total position value|
     * @returns : Precision TEN_THOUSAND
     */
    getMarginRatio(marginCategory?: MarginCategory): BN$1;
    canBeLiquidated(): boolean;
    isBeingLiquidated(): boolean;
    isBankrupt(): boolean;
    /**
     * Checks if any user position cumulative funding differs from respective market cumulative funding
     * @returns
     */
    needsToSettleFundingPayment(): boolean;
    /**
     * Calculate the liquidation price of a perp position, with optional parameter to calculate the liquidation price after a trade
     * @param PerpPosition
     * @param positionBaseSizeChange // change in position size to calculate liquidation price for : Precision 10^13
     * @param partial
     * @returns Precision : PRICE_PRECISION
     */
    spotLiquidationPrice(spotPosition: Pick<SpotPosition, 'marketIndex'>): BN$1;
    /**
     * Calculate the liquidation price of a perp position, with optional parameter to calculate the liquidation price after a trade
     * @param PerpPosition
     * @param positionBaseSizeChange // change in position size to calculate liquidation price for : Precision 10^13
     * @param partial
     * @returns Precision : PRICE_PRECISION
     */
    liquidationPrice(perpPosition: Pick<PerpPosition, 'marketIndex'>, positionBaseSizeChange?: BN$1): BN$1;
    /**
     * Calculates the estimated liquidation price for a position after closing a quote amount of the position.
     * @param positionMarketIndex
     * @param closeQuoteAmount
     * @returns : Precision PRICE_PRECISION
     */
    liquidationPriceAfterClose(positionMarketIndex: number, closeQuoteAmount: BN$1): BN$1;
    /**
     * Get the maximum trade size for a given market, taking into account the user's current leverage, positions, collateral, etc.
     *
     * To Calculate Max Quote Available:
     *
     * Case 1: SameSide
     * 	=> Remaining quote to get to maxLeverage
     *
     * Case 2: NOT SameSide && currentLeverage <= maxLeverage
     * 	=> Current opposite position x2 + remaining to get to maxLeverage
     *
     * Case 3: NOT SameSide && currentLeverage > maxLeverage && otherPositions - currentPosition > maxLeverage
     * 	=> strictly reduce current position size
     *
     * Case 4: NOT SameSide && currentLeverage > maxLeverage && otherPositions - currentPosition < maxLeverage
     * 	=> current position + remaining to get to maxLeverage
     *
     * @param targetMarketIndex
     * @param tradeSide
     * @returns tradeSizeAllowed : Precision QUOTE_PRECISION
     */
    getMaxTradeSizeUSDC(targetMarketIndex: number, tradeSide: PositionDirection): BN$1;
    /**
     * Returns the leverage ratio for the account after adding (or subtracting) the given quote size to the given position
     * @param targetMarketIndex
     * @param positionMarketIndex
     * @param tradeQuoteAmount
     * @returns leverageRatio : Precision TEN_THOUSAND
     */
    accountLeverageRatioAfterTrade(targetMarketIndex: number, tradeQuoteAmount: BN$1, tradeSide: PositionDirection, includeOpenOrders?: boolean): BN$1;
    /**
     * Calculates how much fee will be taken for a given sized trade
     * @param quoteAmount
     * @returns feeForQuote : Precision QUOTE_PRECISION
     */
    calculateFeeForQuoteAmount(quoteAmount: BN$1): BN$1;
    /**
     * Calculates a user's max withdrawal amounts for a spot market. If reduceOnly is true,
     * it will return the max withdrawal amount without opening a liability for the user
     * @param marketIndex
     * @returns withdrawalLimit : Precision is the token precision for the chosen SpotMarket
     */
    getWithdrawalLimit(marketIndex: number, reduceOnly?: boolean): BN$1;
    /**
     * Get the total position value, excluding any position coming from the given target market
     * @param marketToIgnore
     * @returns positionValue : Precision QUOTE_PRECISION
     */
    private getTotalPerpPositionValueExcludingMarket;
    private getOracleDataForPerpMarket;
    private getOracleDataForSpotMarket;
}

/**
 * @param users
 * @param accountLoader
 */
declare function bulkPollingUserSubscribe(users: User[], accountLoader: BulkAccountLoader): Promise<void>;

/**
 * @param userStats
 * @param accountLoader
 */
declare function bulkPollingUserStatsSubscribe(userStats: UserStats[], accountLoader: BulkAccountLoader): Promise<void>;

declare class PollingDriftClientAccountSubscriber implements DriftClientAccountSubscriber {
    isSubscribed: boolean;
    program: Program;
    perpMarketIndexes: number[];
    spotMarketIndexes: number[];
    oracleInfos: OracleInfo[];
    oracleClientCache: OracleClientCache;
    eventEmitter: StrictEventEmitter<EventEmitter, DriftClientAccountEvents>;
    accountLoader: BulkAccountLoader;
    accountsToPoll: Map<string, AccountToPoll>;
    oraclesToPoll: Map<string, OraclesToPoll>;
    errorCallbackId?: string;
    state?: DataAndSlot<StateAccount>;
    perpMarket: Map<number, DataAndSlot<PerpMarketAccount>>;
    spotMarket: Map<number, DataAndSlot<SpotMarketAccount>>;
    oracles: Map<string, DataAndSlot<OraclePriceData>>;
    user?: DataAndSlot<UserAccount>;
    private isSubscribing;
    private subscriptionPromise;
    private subscriptionPromiseResolver;
    constructor(program: Program, accountLoader: BulkAccountLoader, perpMarketIndexes: number[], spotMarketIndexes: number[], oracleInfos: OracleInfo[]);
    subscribe(): Promise<boolean>;
    updateAccountsToPoll(): Promise<void>;
    updatePerpMarketAccountsToPoll(): Promise<boolean>;
    addPerpMarketAccountToPoll(marketIndex: number): Promise<boolean>;
    updateSpotMarketAccountsToPoll(): Promise<boolean>;
    addSpotMarketAccountToPoll(marketIndex: number): Promise<boolean>;
    updateOraclesToPoll(): boolean;
    addOracleToPoll(oracleInfo: OracleInfo): boolean;
    addToAccountLoader(): Promise<void>;
    addAccountToAccountLoader(accountToPoll: AccountToPoll): Promise<void>;
    addOracleToAccountLoader(oracleToPoll: OraclesToPoll): Promise<void>;
    fetch(): Promise<void>;
    didSubscriptionSucceed(): boolean;
    unsubscribe(): Promise<void>;
    addSpotMarket(marketIndex: number): Promise<boolean>;
    addPerpMarket(marketIndex: number): Promise<boolean>;
    addOracle(oracleInfo: OracleInfo): Promise<boolean>;
    assertIsSubscribed(): void;
    getStateAccountAndSlot(): DataAndSlot<StateAccount>;
    getMarketAccountAndSlot(marketIndex: number): DataAndSlot<PerpMarketAccount> | undefined;
    getMarketAccountsAndSlots(): DataAndSlot<PerpMarketAccount>[];
    getSpotMarketAccountAndSlot(marketIndex: number): DataAndSlot<SpotMarketAccount> | undefined;
    getSpotMarketAccountsAndSlots(): DataAndSlot<SpotMarketAccount>[];
    getOraclePriceDataAndSlot(oraclePublicKey: PublicKey): DataAndSlot<OraclePriceData> | undefined;
}

declare class PollingOracleAccountSubscriber implements OracleAccountSubscriber {
    isSubscribed: boolean;
    program: Program;
    eventEmitter: StrictEventEmitter<EventEmitter, OracleEvents>;
    publicKey: PublicKey;
    accountLoader: BulkAccountLoader;
    oracleClient: OracleClient;
    callbackId?: string;
    errorCallbackId?: string;
    oraclePriceData?: DataAndSlot<OraclePriceData>;
    constructor(publicKey: PublicKey, oracleClient: OracleClient, accountLoader: BulkAccountLoader);
    subscribe(): Promise<boolean>;
    addToAccountLoader(): Promise<void>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    assertIsSubscribed(): void;
    getOraclePriceData(): DataAndSlot<OraclePriceData>;
    didSubscriptionSucceed(): boolean;
}

declare class PollingTokenAccountSubscriber implements TokenAccountSubscriber {
    isSubscribed: boolean;
    program: Program;
    eventEmitter: StrictEventEmitter<EventEmitter, TokenAccountEvents>;
    publicKey: PublicKey;
    accountLoader: BulkAccountLoader;
    callbackId?: string;
    errorCallbackId?: string;
    tokenAccountAndSlot?: DataAndSlot<AccountInfo>;
    constructor(publicKey: PublicKey, accountLoader: BulkAccountLoader);
    subscribe(): Promise<boolean>;
    addToAccountLoader(): Promise<void>;
    fetch(): Promise<void>;
    unsubscribe(): Promise<void>;
    assertIsSubscribed(): void;
    getTokenAccountAndSlot(): DataAndSlot<AccountInfo>;
    didSubscriptionSucceed(): boolean;
}

declare class PollingUserAccountSubscriber implements UserAccountSubscriber {
    isSubscribed: boolean;
    program: Program;
    eventEmitter: StrictEventEmitter<EventEmitter, UserAccountEvents>;
    userAccountPublicKey: PublicKey;
    accountLoader: BulkAccountLoader;
    accountsToPoll: Map<string, AccountToPoll>;
    errorCallbackId?: string;
    user?: DataAndSlot<UserAccount>;
    constructor(program: Program, userAccountPublicKey: PublicKey, accountLoader: BulkAccountLoader);
    subscribe(): Promise<boolean>;
    addToAccountLoader(): Promise<void>;
    fetchIfUnloaded(): Promise<void>;
    fetch(): Promise<void>;
    doAccountsExist(): boolean;
    unsubscribe(): Promise<void>;
    assertIsSubscribed(): void;
    getUserAccountAndSlot(): DataAndSlot<UserAccount>;
}

declare class PollingUserStatsAccountSubscriber implements UserStatsAccountSubscriber {
    isSubscribed: boolean;
    program: Program;
    eventEmitter: StrictEventEmitter<EventEmitter, UserStatsAccountEvents>;
    userStatsAccountPublicKey: PublicKey;
    accountLoader: BulkAccountLoader;
    accountsToPoll: Map<string, AccountToPoll>;
    errorCallbackId?: string;
    userStats?: DataAndSlot<UserStatsAccount>;
    constructor(program: Program, userStatsAccountPublicKey: PublicKey, accountLoader: BulkAccountLoader);
    subscribe(): Promise<boolean>;
    addToAccountLoader(): Promise<void>;
    fetchIfUnloaded(): Promise<void>;
    fetch(): Promise<void>;
    doAccountsExist(): boolean;
    unsubscribe(): Promise<void>;
    assertIsSubscribed(): void;
    getUserStatsAccountAndSlot(): DataAndSlot<UserStatsAccount>;
}

declare function getDriftStateAccountPublicKeyAndNonce(programId: PublicKey): Promise<[PublicKey, number]>;
declare function getDriftStateAccountPublicKey(programId: PublicKey): Promise<PublicKey>;
declare function getUserAccountPublicKeyAndNonce(programId: PublicKey, authority: PublicKey, subAccountId?: number): Promise<[PublicKey, number]>;
declare function getUserAccountPublicKey(programId: PublicKey, authority: PublicKey, subAccountId?: number): Promise<PublicKey>;
declare function getUserAccountPublicKeySync(programId: PublicKey, authority: PublicKey, subAccountId?: number): PublicKey;
declare function getUserStatsAccountPublicKey(programId: PublicKey, authority: PublicKey): PublicKey;
declare function getPerpMarketPublicKey(programId: PublicKey, marketIndex: number): Promise<PublicKey>;
declare function getSpotMarketPublicKey(programId: PublicKey, marketIndex: number): Promise<PublicKey>;
declare function getSpotMarketVaultPublicKey(programId: PublicKey, marketIndex: number): Promise<PublicKey>;
declare function getInsuranceFundVaultPublicKey(programId: PublicKey, marketIndex: number): Promise<PublicKey>;
declare function getInsuranceFundStakeAccountPublicKey(programId: PublicKey, authority: PublicKey, marketIndex: number): PublicKey;
declare function getDriftSignerPublicKey(programId: PublicKey): PublicKey;
declare function getSerumOpenOrdersPublicKey(programId: PublicKey, market: PublicKey): PublicKey;
declare function getSerumSignerPublicKey(programId: PublicKey, market: PublicKey, nonce: BN$1): PublicKey;
declare function getSerumFulfillmentConfigPublicKey(programId: PublicKey, market: PublicKey): PublicKey;

declare class AdminClient extends DriftClient {
    initialize(usdcMint: PublicKey, _adminControlsPrices: boolean): Promise<[TransactionSignature]>;
    initializeSpotMarket(mint: PublicKey, optimalUtilization: number, optimalRate: number, maxRate: number, oracle: PublicKey, oracleSource: OracleSource, initialAssetWeight: number, maintenanceAssetWeight: number, initialLiabilityWeight: number, maintenanceLiabilityWeight: number, imfFactor?: number, liquidatorFee?: number, activeStatus?: boolean, name?: string): Promise<TransactionSignature>;
    initializeSerumFulfillmentConfig(marketIndex: number, serumMarket: PublicKey, serumProgram: PublicKey): Promise<TransactionSignature>;
    initializePerpMarket(priceOracle: PublicKey, baseAssetReserve: BN$1, quoteAssetReserve: BN$1, periodicity: BN$1, pegMultiplier?: BN$1, oracleSource?: OracleSource, marginRatioInitial?: number, marginRatioMaintenance?: number, liquidatorFee?: number, activeStatus?: boolean, name?: string): Promise<TransactionSignature>;
    moveAmmPrice(perpMarketIndex: number, baseAssetReserve: BN$1, quoteAssetReserve: BN$1, sqrtK?: BN$1): Promise<TransactionSignature>;
    updateK(perpMarketIndex: number, sqrtK: BN$1): Promise<TransactionSignature>;
    updatePerpMarketConcentrationScale(perpMarketIndex: number, concentrationScale: BN$1): Promise<TransactionSignature>;
    moveAmmToPrice(perpMarketIndex: number, targetPrice: BN$1): Promise<TransactionSignature>;
    repegAmmCurve(newPeg: BN$1, perpMarketIndex: number): Promise<TransactionSignature>;
    updatePerpMarketAmmOracleTwap(perpMarketIndex: number): Promise<TransactionSignature>;
    resetPerpMarketAmmOracleTwap(perpMarketIndex: number): Promise<TransactionSignature>;
    depositIntoPerpMarketFeePool(perpMarketIndex: number, amount: BN$1, sourceVault: PublicKey): Promise<TransactionSignature>;
    updateAdmin(admin: PublicKey): Promise<TransactionSignature>;
    updatePerpMarketCurveUpdateIntensity(perpMarketIndex: number, curveUpdateIntensity: number): Promise<TransactionSignature>;
    updatePerpMarketMarginRatio(perpMarketIndex: number, marginRatioInitial: number, marginRatioMaintenance: number): Promise<TransactionSignature>;
    updatePerpMarketImfFactor(perpMarketIndex: number, imfFactor: number, unrealizedPnlImfFactor: number): Promise<TransactionSignature>;
    updatePerpMarketBaseSpread(perpMarketIndex: number, baseSpread: number): Promise<TransactionSignature>;
    updateAmmJitIntensity(perpMarketIndex: number, ammJitIntensity: number): Promise<TransactionSignature>;
    updatePerpMarketName(perpMarketIndex: number, name: string): Promise<TransactionSignature>;
    updateSpotMarketName(spotMarketIndex: number, name: string): Promise<TransactionSignature>;
    updatePerpMarketMaxSpread(perpMarketIndex: number, maxSpread: number): Promise<TransactionSignature>;
    updatePerpFeeStructure(feeStructure: FeeStructure): Promise<TransactionSignature>;
    updateSpotFeeStructure(feeStructure: FeeStructure): Promise<TransactionSignature>;
    updateInitialPctToLiquidate(initialPctToLiquidate: number): Promise<TransactionSignature>;
    updateLiquidationDuration(liquidationDuration: number): Promise<TransactionSignature>;
    updateOracleGuardRails(oracleGuardRails: OracleGuardRails): Promise<TransactionSignature>;
    updateStateSettlementDuration(settlementDuration: number): Promise<TransactionSignature>;
    updateWithdrawGuardThreshold(spotMarketIndex: number, withdrawGuardThreshold: BN$1): Promise<TransactionSignature>;
    updateSpotMarketIfFactor(spotMarketIndex: number, userIfFactor: BN$1, totalIfFactor: BN$1): Promise<TransactionSignature>;
    updateSpotMarketRevenueSettlePeriod(spotMarketIndex: number, revenueSettlePeriod: BN$1): Promise<TransactionSignature>;
    updateSpotMarketMaxTokenDeposits(spotMarketIndex: number, maxTokenDeposits: BN$1): Promise<TransactionSignature>;
    updateInsuranceFundUnstakingPeriod(spotMarketIndex: number, insuranceWithdrawEscrowPeriod: BN$1): Promise<TransactionSignature>;
    updateLpCooldownTime(cooldownTime: BN$1): Promise<TransactionSignature>;
    updatePerpMarketOracle(perpMarketIndex: number, oracle: PublicKey, oracleSource: OracleSource): Promise<TransactionSignature>;
    updatePerpMarketStepSizeAndTickSize(perpMarketIndex: number, stepSize: BN$1, tickSize: BN$1): Promise<TransactionSignature>;
    updatePerpMarketMinOrderSize(perpMarketIndex: number, orderSize: BN$1): Promise<TransactionSignature>;
    updateSpotMarketStepSizeAndTickSize(spotMarketIndex: number, stepSize: BN$1, tickSize: BN$1): Promise<TransactionSignature>;
    updateSpotMarketMinOrderSize(spotMarketIndex: number, orderSize: BN$1): Promise<TransactionSignature>;
    updatePerpMarketExpiry(perpMarketIndex: number, expiryTs: BN$1): Promise<TransactionSignature>;
    updateSpotMarketOracle(spotMarketIndex: number, oracle: PublicKey, oracleSource: OracleSource): Promise<TransactionSignature>;
    updateSpotMarketOrdersEnabled(spotMarketIndex: number, ordersEnabled: boolean): Promise<TransactionSignature>;
    updateSerumFulfillmentConfigStatus(serumFulfillmentConfig: PublicKey, status: SpotFulfillmentConfigStatus): Promise<TransactionSignature>;
    updateSpotMarketExpiry(spotMarketIndex: number, expiryTs: BN$1): Promise<TransactionSignature>;
    updateWhitelistMint(whitelistMint?: PublicKey): Promise<TransactionSignature>;
    updateDiscountMint(discountMint: PublicKey): Promise<TransactionSignature>;
    updateSpotMarketMarginWeights(spotMarketIndex: number, initialAssetWeight: number, maintenanceAssetWeight: number, initialLiabilityWeight: number, maintenanceLiabilityWeight: number, imfFactor?: number): Promise<TransactionSignature>;
    updateSpotMarketBorrowRate(spotMarketIndex: number, optimalUtilization: number, optimalBorrowRate: number, optimalMaxRate: number): Promise<TransactionSignature>;
    updateSpotMarketAssetTier(spotMarketIndex: number, assetTier: AssetTier): Promise<TransactionSignature>;
    updateSpotMarketStatus(spotMarketIndex: number, marketStatus: MarketStatus): Promise<TransactionSignature>;
    updatePerpMarketStatus(perpMarketIndex: number, marketStatus: MarketStatus): Promise<TransactionSignature>;
    updatePerpMarketContractTier(perpMarketIndex: number, contractTier: ContractTier): Promise<TransactionSignature>;
    updateExchangeStatus(exchangeStatus: ExchangeStatus): Promise<TransactionSignature>;
    updatePerpAuctionDuration(minDuration: BN$1 | number): Promise<TransactionSignature>;
    updateSpotAuctionDuration(defaultAuctionDuration: number): Promise<TransactionSignature>;
    updatePerpMarketMaxFillReserveFraction(perpMarketIndex: number, maxBaseAssetAmountRatio: number): Promise<TransactionSignature>;
    updateMaxSlippageRatio(perpMarketIndex: number, maxSlippageRatio: number): Promise<TransactionSignature>;
    updatePerpMarketUnrealizedAssetWeight(perpMarketIndex: number, unrealizedInitialAssetWeight: number, unrealizedMaintenanceAssetWeight: number): Promise<TransactionSignature>;
    updatePerpMarketMaxImbalances(perpMarketIndex: number, unrealizedMaxImbalance: BN$1, maxRevenueWithdrawPerPeriod: BN$1, quoteMaxInsurance: BN$1): Promise<TransactionSignature>;
    updatePerpMarketMaxOpenInterest(perpMarketIndex: number, maxOpenInterest: BN$1): Promise<TransactionSignature>;
    updateSerumVault(srmVault: PublicKey): Promise<TransactionSignature>;
    updatePerpMarketLiquidationFee(perpMarketIndex: number, liquidatorFee: number, ifLiquidationFee: number): Promise<TransactionSignature>;
    updateSpotMarketLiquidationFee(spotMarketIndex: number, liquidatorFee: number, ifLiquidationFee: number): Promise<TransactionSignature>;
}

declare function getOracleClient(oracleSource: OracleSource, connection: Connection): OracleClient;

declare class BigNum {
    val: BN$1;
    precision: BN$1;
    static delim: string;
    static spacer: string;
    static setLocale(locale: string): void;
    constructor(val: BN$1 | number | string, precisionVal?: BN$1 | number | string);
    private bigNumFromParam;
    add(bn: BigNum): BigNum;
    sub(bn: BigNum): BigNum;
    mul(bn: BigNum | BN$1): BigNum;
    /**
     * Multiplies by another big number then scales the result down by the big number's precision so that we're in the same precision space
     * @param bn
     * @returns
     */
    scalarMul(bn: BigNum | BN$1): BigNum;
    div(bn: BigNum | BN$1): BigNum;
    /**
     * Shift precision up or down
     * @param exponent
     * @param skipAdjustingPrecision
     * @returns
     */
    shift(exponent: BN$1 | number, skipAdjustingPrecision?: boolean): BigNum;
    /**
     * Shift to a target precision
     * @param targetPrecision
     * @returns
     */
    shiftTo(targetPrecision: BN$1): BigNum;
    /**
     * Scale the number by a fraction
     * @param numerator
     * @param denominator
     * @returns
     */
    scale(numerator: BN$1 | number, denominator: BN$1 | number): BigNum;
    toPercentage(denominator: BigNum, precision: number): string;
    gt(bn: BigNum | BN$1, ignorePrecision?: boolean): boolean;
    lt(bn: BigNum | BN$1, ignorePrecision?: boolean): boolean;
    gte(bn: BigNum | BN$1, ignorePrecision?: boolean): boolean;
    lte(bn: BigNum | BN$1, ignorePrecision?: boolean): boolean;
    eq(bn: BigNum | BN$1, ignorePrecision?: boolean): boolean;
    eqZero(): any;
    gtZero(): any;
    ltZero(): any;
    gteZero(): any;
    lteZero(): any;
    abs(): BigNum;
    neg(): BigNum;
    toString: (base?: number | 'hex', length?: number) => string;
    /**
     * Pretty print the underlying value in human-readable form. Depends on precision being correct for the output string to be correct
     * @returns
     */
    print(): string;
    prettyPrint(useTradePrecision?: boolean, precisionOverride?: number): string;
    /**
     * Print and remove unnecessary trailing zeroes
     * @returns
     */
    printShort(useTradePrecision?: boolean, precisionOverride?: number): string;
    debug(): void;
    /**
     * Pretty print with the specified number of decimal places
     * @param fixedPrecision
     * @returns
     */
    toFixed(fixedPrecision: number, rounded?: boolean): string;
    private getZeroes;
    toRounded(roundingPrecision: number): BigNum;
    /**
     * Pretty print to the specified number of significant figures
     * @param fixedPrecision
     * @returns
     */
    toPrecision(fixedPrecision: number, trailingZeroes?: boolean, rounded?: boolean): string;
    toTradePrecision(rounded?: boolean): string;
    /**
     * Print dollar formatted value. Defaults to fixed decimals two unless a given precision is given.
     * @param useTradePrecision
     * @param precisionOverride
     * @returns
     */
    toNotional(useTradePrecision?: boolean, precisionOverride?: number): string;
    toMillified(precision?: number, rounded?: boolean): string;
    toJSON(): {
        val: any;
        precision: any;
    };
    isNeg(): boolean;
    isPos(): boolean;
    /**
     * Get the numerical value of the BigNum. This can break if the BigNum is too large.
     * @returns
     */
    toNum(): number;
    static fromJSON(json: {
        val: string;
        precision: string;
    }): BigNum;
    /**
     * Create a BigNum instance
     * @param val
     * @param precision
     * @returns
     */
    static from(val?: BN$1 | number | string, precision?: BN$1 | number | string): BigNum;
    /**
     * Create a BigNum instance from a printed BigNum
     * @param val
     * @param precisionOverride
     * @returns
     */
    static fromPrint(val: string, precisionShift?: BN$1): BigNum;
    static max(a: BigNum, b: BigNum): BigNum;
    static min(a: BigNum, b: BigNum): BigNum;
    static zero(precision?: BN$1 | number): BigNum;
}

type EventSubscriptionOptions = {
    eventTypes?: EventType[];
    maxEventsPerType?: number;
    orderBy?: EventSubscriptionOrderBy;
    orderDir?: EventSubscriptionOrderDirection;
    commitment?: Commitment;
    maxTx?: number;
    logProviderConfig?: LogProviderConfig;
    untilTx?: TransactionSignature;
};
declare const DefaultEventSubscriptionOptions: EventSubscriptionOptions;
type EventSubscriptionOrderBy = 'blockchain' | 'client';
type EventSubscriptionOrderDirection = 'asc' | 'desc';
type Event<T> = T & {
    txSig: TransactionSignature;
    slot: number;
};
type WrappedEvent<Type extends EventType> = EventMap[Type] & {
    eventType: Type;
};
type WrappedEvents = WrappedEvent<EventType>[];
type EventMap = {
    DepositRecord: Event<DepositRecord>;
    FundingPaymentRecord: Event<FundingPaymentRecord>;
    LiquidationRecord: Event<LiquidationRecord>;
    FundingRateRecord: Event<FundingRateRecord>;
    OrderRecord: Event<OrderRecord>;
    OrderActionRecord: Event<OrderActionRecord>;
    SettlePnlRecord: Event<SettlePnlRecord>;
    NewUserRecord: Event<NewUserRecord>;
    LPRecord: Event<LPRecord>;
    InsuranceFundRecord: Event<InsuranceFundRecord>;
    SpotInterestRecord: Event<SpotInterestRecord>;
    InsuranceFundStakeRecord: Event<InsuranceFundStakeRecord>;
    CurveRecord: Event<CurveRecord>;
};
type EventType = keyof EventMap;
interface EventSubscriberEvents {
    newEvent: (event: WrappedEvent<EventType>) => void;
}
type SortFn = (currentRecord: EventMap[EventType], newRecord: EventMap[EventType]) => 'less than' | 'greater than';
type logProviderCallback = (txSig: TransactionSignature, slot: number, logs: string[], mostRecentBlockTime: number | undefined) => void;
interface LogProvider {
    isSubscribed(): boolean;
    subscribe(callback: logProviderCallback, skipHistory?: boolean): boolean;
    unsubscribe(): Promise<boolean>;
}
type WebSocketLogProviderConfig = {
    type: 'websocket';
};
type PollingLogProviderConfig = {
    type: 'polling';
    frequency: number;
};
type LogProviderConfig = WebSocketLogProviderConfig | PollingLogProviderConfig;

declare class Node<Type extends EventType, Event extends EventMap[Type]> {
    event: Event;
    next?: Node<Type, Event>;
    prev?: Node<Type, Event>;
    constructor(event: Event, next?: Node<Type, Event>, prev?: Node<Type, Event>);
}
declare class EventList<Type extends EventType> {
    eventType: Type;
    maxSize: number;
    private sortFn;
    private orderDirection;
    size: number;
    head?: Node<Type, EventMap[Type]>;
    tail?: Node<Type, EventMap[Type]>;
    constructor(eventType: Type, maxSize: number, sortFn: SortFn, orderDirection: EventSubscriptionOrderDirection);
    insert(event: EventMap[Type]): void;
    detach(): void;
    toArray(): EventMap[Type][];
    [Symbol.iterator](): Generator<EventMap[Type], void, unknown>;
}

declare class EventSubscriber {
    private connection;
    private program;
    private options;
    private eventListMap;
    private txEventCache;
    private awaitTxPromises;
    private awaitTxResolver;
    private logProvider;
    eventEmitter: StrictEventEmitter<EventEmitter, EventSubscriberEvents>;
    private lastSeenSlot;
    private lastSeenBlockTime;
    lastSeenTxSig: string;
    constructor(connection: Connection, program: Program, options?: EventSubscriptionOptions);
    subscribe(): Promise<boolean>;
    private handleTxLogs;
    fetchPreviousTx(fetchMax?: boolean): Promise<void>;
    unsubscribe(): Promise<boolean>;
    private parseEventsFromLogs;
    awaitTx(txSig: TransactionSignature): Promise<void>;
    getEventList<Type extends keyof EventMap>(eventType: Type): EventList<Type>;
    /**
     * This requires the EventList be cast to an array, which requires reallocation of memory.
     * Would bias to using getEventList over getEvents
     *
     * @param eventType
     */
    getEventsArray<Type extends EventType>(eventType: Type): EventMap[Type][];
    getEventsByTx(txSig: TransactionSignature): WrappedEvents | undefined;
}

type Log = {
    txSig: TransactionSignature;
    slot: number;
    logs: string[];
};
type FetchLogsResponse = {
    earliestTx: string;
    mostRecentTx: string;
    earliestSlot: number;
    mostRecentSlot: number;
    transactionLogs: Log[];
    mostRecentBlockTime: number | undefined;
};
declare function fetchLogs(connection: Connection, programId: PublicKey, finality: Finality, beforeTx?: TransactionSignature, untilTx?: TransactionSignature, limit?: number): Promise<FetchLogsResponse>;
declare class LogParser {
    private program;
    constructor(program: Program);
    parseEventsFromTransaction(transaction: TransactionResponse): WrappedEvents;
    parseEventsFromLogs(event: Log): WrappedEvents;
}

declare function isAuctionComplete(order: Order, slot: number): boolean;
declare function getAuctionPrice(order: Order, slot: number, oraclePrice: BN$1): BN$1;
declare function getAuctionPriceForFixedAuction(order: Order, slot: number): BN$1;
declare function getAuctionPriceForOracleOffsetAuction(order: Order, slot: number, oraclePrice: BN$1): BN$1;

declare function castNumberToSpotPrecision(value: number, spotMarket: SpotMarketAccount): BN$1;

declare const convertToNumber: (bigNumber: BN, precision?: BN) => any;

declare function exchangePaused(state: StateAccount): boolean;
declare function fillPaused(state: StateAccount, market: PerpMarketAccount | SpotMarketAccount): boolean;
declare function ammPaused(state: StateAccount, market: PerpMarketAccount | SpotMarketAccount): boolean;

/**
 *
 * @param market
 * @param oraclePriceData
 * @param periodAdjustment
 * @returns Estimated funding rate. : Precision //TODO-PRECISION
 */
declare function calculateAllEstimatedFundingRate(market: PerpMarketAccount, oraclePriceData?: OraclePriceData, periodAdjustment?: BN$1): Promise<[BN$1, BN$1, BN$1, BN$1, BN$1]>;
/**
 *
 * @param market
 * @param oraclePriceData
 * @param periodAdjustment
 * @param estimationMethod
 * @returns Estimated funding rate. : Precision //TODO-PRECISION
 */
declare function calculateEstimatedFundingRate(market: PerpMarketAccount, oraclePriceData?: OraclePriceData, periodAdjustment?: BN$1, estimationMethod?: 'interpolated' | 'lowerbound' | 'capped'): Promise<BN$1>;
/**
 *
 * @param market
 * @param oraclePriceData
 * @param periodAdjustment
 * @returns Estimated funding rate. : Precision //TODO-PRECISION
 */
declare function calculateLongShortFundingRate(market: PerpMarketAccount, oraclePriceData?: OraclePriceData, periodAdjustment?: BN$1): Promise<[BN$1, BN$1]>;
/**
 *
 * @param market
 * @param oraclePriceData
 * @param periodAdjustment
 * @returns Estimated funding rate. : Precision //TODO-PRECISION
 */
declare function calculateLongShortFundingRateAndLiveTwaps(market: PerpMarketAccount, oraclePriceData?: OraclePriceData, periodAdjustment?: BN$1): Promise<[BN$1, BN$1, BN$1, BN$1]>;
/**
 *
 * @param market
 * @returns Estimated fee pool size
 */
declare function calculateFundingPool(market: PerpMarketAccount): BN$1;

/**
 * Calculates market mark price
 *
 * @param market
 * @return markPrice : Precision PRICE_PRECISION
 */
declare function calculateReservePrice(market: PerpMarketAccount, oraclePriceData: OraclePriceData): BN$1;
/**
 * Calculates market bid price
 *
 * @param market
 * @return bidPrice : Precision PRICE_PRECISION
 */
declare function calculateBidPrice(market: PerpMarketAccount, oraclePriceData: OraclePriceData): BN$1;
/**
 * Calculates market ask price
 *
 * @param market
 * @return askPrice : Precision PRICE_PRECISION
 */
declare function calculateAskPrice(market: PerpMarketAccount, oraclePriceData: OraclePriceData): BN$1;
declare function calculateNewMarketAfterTrade(baseAssetAmount: BN$1, direction: PositionDirection, market: PerpMarketAccount): PerpMarketAccount;
declare function calculateOracleReserveSpread(market: PerpMarketAccount, oraclePriceData: OraclePriceData): BN$1;
declare function calculateOracleSpread(price: BN$1, oraclePriceData: OraclePriceData): BN$1;
declare function calculateMarketMarginRatio(market: PerpMarketAccount, size: BN$1, marginCategory: MarginCategory): number;
declare function calculateUnrealizedAssetWeight(market: PerpMarketAccount, quoteSpotMarket: SpotMarketAccount, unrealizedPnl: BN$1, marginCategory: MarginCategory, oraclePriceData: OraclePriceData): BN$1;
declare function calculateMarketAvailablePNL(perpMarket: PerpMarketAccount, spotMarket: SpotMarketAccount): BN$1;
declare function calculateNetUserPnl(perpMarket: PerpMarketAccount, oraclePriceData: OraclePriceData): BN$1;
declare function calculateNetUserPnlImbalance(perpMarket: PerpMarketAccount, spotMarket: SpotMarketAccount, oraclePriceData: OraclePriceData): BN$1;

/**
 * calculateBaseAssetValue
 * = market value of closing entire position
 * @param market
 * @param userPosition
 * @param oraclePriceData
 * @returns Base Asset Value. : Precision QUOTE_PRECISION
 */
declare function calculateBaseAssetValue(market: PerpMarketAccount, userPosition: PerpPosition, oraclePriceData: OraclePriceData, useSpread?: boolean, skipUpdate?: boolean): BN$1;
/**
 * calculatePositionPNL
 * = BaseAssetAmount * (Avg Exit Price - Avg Entry Price)
 * @param market
 * @param PerpPosition
 * @param withFunding (adds unrealized funding payment pnl to result)
 * @param oraclePriceData
 * @returns BaseAssetAmount : Precision QUOTE_PRECISION
 */
declare function calculatePositionPNL(market: PerpMarketAccount, perpPosition: PerpPosition, withFunding: boolean, oraclePriceData: OraclePriceData): BN$1;
declare function calculateClaimablePnl(market: PerpMarketAccount, spotMarket: SpotMarketAccount, perpPosition: PerpPosition, oraclePriceData: OraclePriceData): BN$1;
/**
 *
 * @param market
 * @param PerpPosition
 * @returns // TODO-PRECISION
 */
declare function calculatePositionFundingPNL(market: PerpMarketAccount, perpPosition: PerpPosition): BN$1;
declare function positionIsAvailable(position: PerpPosition): boolean;
/**
 *
 * @param userPosition
 * @returns Precision: PRICE_PRECISION (10^6)
 */
declare function calculateBreakEvenPrice(userPosition: PerpPosition): BN$1;
/**
 *
 * @param userPosition
 * @returns Precision: PRICE_PRECISION (10^6)
 */
declare function calculateEntryPrice(userPosition: PerpPosition): BN$1;
/**
 *
 * @param userPosition
 * @returns Precision: PRICE_PRECISION (10^10)
 */
declare function calculateCostBasis(userPosition: PerpPosition): BN$1;
declare function findDirectionToClose(userPosition: PerpPosition): PositionDirection;
declare function positionCurrentDirection(userPosition: PerpPosition): PositionDirection;
declare function isEmptyPosition(userPosition: PerpPosition): boolean;

declare function oraclePriceBands(market: PerpMarketAccount, oraclePriceData: OraclePriceData): [BN$1, BN$1];
declare function isOracleValid(amm: AMM, oraclePriceData: OraclePriceData, oracleGuardRails: OracleGuardRails, slot: number): boolean;
declare function isOracleTooDivergent(amm: AMM, oraclePriceData: OraclePriceData, oracleGuardRails: OracleGuardRails, now: BN$1): boolean;
declare function calculateLiveOracleTwap(amm: AMM, oraclePriceData: OraclePriceData, now: BN$1): BN$1;
declare function calculateLiveOracleStd(amm: AMM, oraclePriceData: OraclePriceData, now: BN$1): BN$1;

declare function calculatePegFromTargetPrice(targetPrice: BN$1, baseAssetReserve: BN$1, quoteAssetReserve: BN$1): BN$1;
declare function calculateOptimalPegAndBudget(amm: AMM, oraclePriceData: OraclePriceData): [BN$1, BN$1, BN$1, boolean];
declare function calculateNewAmm(amm: AMM, oraclePriceData: OraclePriceData): [BN$1, BN$1, BN$1, BN$1];
declare function calculateUpdatedAMM(amm: AMM, oraclePriceData: OraclePriceData): AMM;
declare function calculateUpdatedAMMSpreadReserves(amm: AMM, direction: PositionDirection, oraclePriceData: OraclePriceData): {
    baseAssetReserve: BN$1;
    quoteAssetReserve: BN$1;
    sqrtK: BN$1;
    newPeg: BN$1;
};
declare function calculateBidAskPrice(amm: AMM, oraclePriceData: OraclePriceData, withUpdate?: boolean): [BN$1, BN$1];
/**
 * Calculates a price given an arbitrary base and quote amount (they must have the same precision)
 *
 * @param baseAssetReserves
 * @param quoteAssetReserves
 * @param pegMultiplier
 * @returns price : Precision PRICE_PRECISION
 */
declare function calculatePrice(baseAssetReserves: BN$1, quoteAssetReserves: BN$1, pegMultiplier: BN$1): BN$1;
type AssetType = 'quote' | 'base';
/**
 * Calculates what the amm reserves would be after swapping a quote or base asset amount.
 *
 * @param amm
 * @param inputAssetType
 * @param swapAmount
 * @param swapDirection
 * @returns quoteAssetReserve and baseAssetReserve after swap. : Precision AMM_RESERVE_PRECISION
 */
declare function calculateAmmReservesAfterSwap(amm: Pick<AMM, 'pegMultiplier' | 'quoteAssetReserve' | 'sqrtK' | 'baseAssetReserve'>, inputAssetType: AssetType, swapAmount: BN$1, swapDirection: SwapDirection): [BN$1, BN$1];
declare function calculateMarketOpenBidAsk(baseAssetReserve: BN$1, minBaseAssetReserve: BN$1, maxBaseAssetReserve: BN$1): [BN$1, BN$1];
declare function calculateInventoryScale(baseAssetAmountWithAmm: BN$1, baseAssetReserve: BN$1, minBaseAssetReserve: BN$1, maxBaseAssetReserve: BN$1, directionalSpread: number, maxSpread: number): number;
declare function calculateEffectiveLeverage(baseSpread: number, quoteAssetReserve: BN$1, terminalQuoteAssetReserve: BN$1, pegMultiplier: BN$1, netBaseAssetAmount: BN$1, reservePrice: BN$1, totalFeeMinusDistributions: BN$1): number;
declare function calculateMaxSpread(marginRatioInitial: number): number;
declare function calculateVolSpreadBN(lastOracleConfPct: BN$1, reservePrice: BN$1, markStd: BN$1, oracleStd: BN$1, longIntensity: BN$1, shortIntensity: BN$1, volume24H: BN$1): [BN$1, BN$1];
declare function calculateSpreadBN(baseSpread: number, lastOracleReservePriceSpreadPct: BN$1, lastOracleConfPct: BN$1, maxSpread: number, quoteAssetReserve: BN$1, terminalQuoteAssetReserve: BN$1, pegMultiplier: BN$1, baseAssetAmountWithAmm: BN$1, reservePrice: BN$1, totalFeeMinusDistributions: BN$1, netRevenueSinceLastFunding: BN$1, baseAssetReserve: BN$1, minBaseAssetReserve: BN$1, maxBaseAssetReserve: BN$1, markStd: BN$1, oracleStd: BN$1, longIntensity: BN$1, shortIntensity: BN$1, volume24H: BN$1, returnTerms?: boolean): number[] | {
    longVolSpread: number;
    shortVolSpread: number;
    longSpreadwPS: number;
    shortSpreadwPS: number;
    maxTargetSpread: number;
    inventorySpreadScale: number;
    longSpreadwInvScale: number;
    shortSpreadwInvScale: number;
    effectiveLeverage: number;
    effectiveLeverageCapped: number;
    longSpreadwEL: number;
    shortSpreadwEL: number;
    revenueRetreatAmount: number;
    halfRevenueRetreatAmount: number;
    longSpreadwRevRetreat: number;
    shortSpreadwRevRetreat: number;
    totalSpread: number;
    longSpread: number;
    shortSpread: number;
};
declare function calculateSpread(amm: AMM, oraclePriceData: OraclePriceData, now?: BN$1): [number, number];
declare function calculateSpreadReserves(amm: AMM, oraclePriceData: OraclePriceData, now?: BN$1): {
    baseAssetReserve: any;
    quoteAssetReserve: any;
}[];
/**
 * Helper function calculating constant product curve output. Agnostic to whether input asset is quote or base
 *
 * @param inputAssetReserve
 * @param swapAmount
 * @param swapDirection
 * @param invariant
 * @returns newInputAssetReserve and newOutputAssetReserve after swap. : Precision AMM_RESERVE_PRECISION
 */
declare function calculateSwapOutput(inputAssetReserve: BN$1, swapAmount: BN$1, swapDirection: SwapDirection, invariant: BN$1): [BN$1, BN$1];
/**
 * Translate long/shorting quote/base asset into amm operation
 *
 * @param inputAssetType
 * @param positionDirection
 */
declare function getSwapDirection(inputAssetType: AssetType, positionDirection: PositionDirection): SwapDirection;
/**
 * Helper function calculating terminal price of amm
 *
 * @param market
 * @returns cost : Precision PRICE_PRECISION
 */
declare function calculateTerminalPrice(market: PerpMarketAccount): any;
declare function calculateMaxBaseAssetAmountToTrade(amm: AMM, limit_price: BN$1, direction: PositionDirection, oraclePriceData?: OraclePriceData, now?: BN$1): [BN$1, PositionDirection];
declare function calculateQuoteAssetAmountSwapped(quoteAssetReserves: BN$1, pegMultiplier: BN$1, swapDirection: SwapDirection): BN$1;
declare function calculateMaxBaseAssetAmountFillable(amm: AMM, orderDirection: PositionDirection): BN$1;

type PriceImpactUnit = 'entryPrice' | 'maxPrice' | 'priceDelta' | 'priceDeltaAsNumber' | 'pctAvg' | 'pctMax' | 'quoteAssetAmount' | 'quoteAssetAmountPeg' | 'acquiredBaseAssetAmount' | 'acquiredQuoteAssetAmount' | 'all';
/**
 * Calculates avg/max slippage (price impact) for candidate trade
 * @param direction
 * @param amount
 * @param market
 * @param inputAssetType which asset is being traded
 * @param useSpread whether to consider spread with calculating slippage
 * @return [pctAvgSlippage, pctMaxSlippage, entryPrice, newPrice]
 *
 * 'pctAvgSlippage' =>  the percentage change to entryPrice (average est slippage in execution) : Precision PRICE_PRECISION
 *
 * 'pctMaxSlippage' =>  the percentage change to maxPrice (highest est slippage in execution) : Precision PRICE_PRECISION
 *
 * 'entryPrice' => the average price of the trade : Precision PRICE_PRECISION
 *
 * 'newPrice' => the price of the asset after the trade : Precision PRICE_PRECISION
 */
declare function calculateTradeSlippage(direction: PositionDirection, amount: BN$1, market: PerpMarketAccount, inputAssetType?: AssetType, oraclePriceData?: OraclePriceData, useSpread?: boolean): [BN$1, BN$1, BN$1, BN$1];
/**
 * Calculates acquired amounts for trade executed
 * @param direction
 * @param amount
 * @param market
 * @param inputAssetType
 * @param useSpread
 * @return
 * 	| 'acquiredBase' =>  positive/negative change in user's base : BN AMM_RESERVE_PRECISION
 * 	| 'acquiredQuote' => positive/negative change in user's quote : BN TODO-PRECISION
 */
declare function calculateTradeAcquiredAmounts(direction: PositionDirection, amount: BN$1, market: PerpMarketAccount, inputAssetType: AssetType, oraclePriceData: OraclePriceData, useSpread?: boolean): [BN$1, BN$1, BN$1];
/**
 * calculateTargetPriceTrade
 * simple function for finding arbitraging trades
 * @param market
 * @param targetPrice
 * @param pct optional default is 100% gap filling, can set smaller.
 * @param outputAssetType which asset to trade.
 * @param useSpread whether or not to consider the spread when calculating the trade size
 * @returns trade direction/size in order to push price to a targetPrice,
 *
 * [
 *   direction => direction of trade required, PositionDirection
 *   tradeSize => size of trade required, TODO-PRECISION
 *   entryPrice => the entry price for the trade, PRICE_PRECISION
 *   targetPrice => the target price PRICE_PRECISION
 * ]
 */
declare function calculateTargetPriceTrade(market: PerpMarketAccount, targetPrice: BN$1, pct?: BN$1, outputAssetType?: AssetType, oraclePriceData?: OraclePriceData, useSpread?: boolean): [PositionDirection, BN$1, BN$1, BN$1];

declare function isOrderRiskIncreasing(user: User, order: Order): boolean;
declare function isOrderRiskIncreasingInSameDirection(user: User, order: Order): boolean;
declare function isOrderReduceOnly(user: User, order: Order): boolean;
declare function standardizeBaseAssetAmount(baseAssetAmount: BN$1, stepSize: BN$1): BN$1;
declare function getLimitPrice(order: Order, oraclePriceData: OraclePriceData, slot: number, fallbackPrice?: BN$1): BN$1 | undefined;
declare function hasLimitPrice(order: Order, slot: number): boolean;
declare function hasAuctionPrice(order: Order, slot: number): boolean;
declare function isFillableByVAMM(order: Order, market: PerpMarketAccount, oraclePriceData: OraclePriceData, slot: number, ts: number): boolean;
declare function calculateBaseAssetAmountForAmmToFulfill(order: Order, market: PerpMarketAccount, oraclePriceData: OraclePriceData, slot: number): BN$1;
declare function calculateBaseAssetAmountToFillUpToLimitPrice(order: Order, amm: AMM, limitPrice: BN$1, oraclePriceData: OraclePriceData): BN$1;
declare function isOrderExpired(order: Order, ts: number): boolean;
declare function isMarketOrder(order: Order): boolean;
declare function isLimitOrder(order: Order): boolean;
declare function mustBeTriggered(order: Order): boolean;
declare function isTriggered(order: Order): boolean;

/**
 * Helper function calculating adjust k cost
 * @param amm
 * @param numerator
 * @param denomenator
 * @returns cost : Precision QUOTE_ASSET_PRECISION
 */
declare function calculateAdjustKCost(amm: AMM, numerator: BN$1, denomenator: BN$1): BN$1;
/**
 * Helper function calculating adjust pegMultiplier (repeg) cost
 *
 * @param amm
 * @param newPeg
 * @returns cost : Precision QUOTE_ASSET_PRECISION
 */
declare function calculateRepegCost(amm: AMM, newPeg: BN$1): BN$1;
declare function calculateBudgetedKBN(x: BN$1, y: BN$1, budget: BN$1, Q: BN$1, d: BN$1): [BN$1, BN$1];
declare function calculateBudgetedK(amm: AMM, cost: BN$1): [BN$1, BN$1];
declare function calculateBudgetedPeg(amm: AMM, cost: BN$1, targetPrice: BN$1): BN$1;

declare function calculateSizePremiumLiabilityWeight(size: BN$1, // AMM_RESERVE_PRECISION
imfFactor: BN$1, liabilityWeight: BN$1, precision: BN$1): BN$1;
declare function calculateSizeDiscountAssetWeight(size: BN$1, // AMM_RESERVE_PRECISION
imfFactor: BN$1, assetWeight: BN$1): BN$1;
declare function calculateOraclePriceForPerpMargin(perpPosition: PerpPosition, market: PerpMarketAccount, oraclePriceData: OraclePriceData): BN$1;
declare function calculateBaseAssetValueWithOracle(market: PerpMarketAccount, perpPosition: PerpPosition, oraclePriceData: OraclePriceData): BN$1;
declare function calculateWorstCaseBaseAssetAmount(perpPosition: PerpPosition): BN$1;

declare function stakeAmountToShares(amount: BN$1, totalIfShares: BN$1, insuranceFundVaultBalance: BN$1): BN$1;
declare function unstakeSharesToAmount(nShares: BN$1, totalIfShares: BN$1, insuranceFundVaultBalance: BN$1): BN$1;

declare function getLimitOrderParams(params: Omit<OptionalOrderParams, 'orderType' | 'marketType'> & {
    price: BN$1;
}): OptionalOrderParams;
declare function getTriggerMarketOrderParams(params: Omit<OptionalOrderParams, 'orderType' | 'marketType'> & {
    triggerCondition: OrderTriggerCondition;
    triggerPrice: BN$1;
}): OptionalOrderParams;
declare function getTriggerLimitOrderParams(params: Omit<OptionalOrderParams, 'orderType' | 'marketType'> & {
    triggerCondition: OrderTriggerCondition;
    triggerPrice: BN$1;
    price: BN$1;
}): OptionalOrderParams;
declare function getMarketOrderParams(params: Omit<OptionalOrderParams, 'orderType' | 'marketType'>): OptionalOrderParams;

type SlotSubscriberConfig = {};
interface SlotSubscriberEvents {
    newSlot: (newSlot: number) => void;
}
declare class SlotSubscriber {
    private connection;
    currentSlot: number;
    subscriptionId: number;
    eventEmitter: StrictEventEmitter$1<EventEmitter, SlotSubscriberEvents>;
    constructor(connection: Connection, _config?: SlotSubscriberConfig);
    subscribe(): Promise<void>;
    getSlot(): number;
    unsubscribe(): Promise<void>;
}

declare class Wallet implements IWallet {
    readonly payer: Keypair;
    constructor(payer: Keypair);
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey;
}

declare function clampBN(x: BN$1, min: BN$1, max: BN$1): BN$1;
declare const squareRootBN: (n: any, closeness?: any) => BN$1;

declare const ZERO: any;
declare const ONE: any;
declare const TWO: any;
declare const THREE: any;
declare const FOUR: any;
declare const FIVE: any;
declare const SIX: any;
declare const SEVEN: any;
declare const EIGHT: any;
declare const NINE: any;
declare const TEN: any;
declare const TEN_THOUSAND: any;
declare const BN_MAX: any;
declare const TEN_MILLION: any;
declare const MAX_LEVERAGE: any;
declare const PERCENTAGE_PRECISION_EXP: any;
declare const PERCENTAGE_PRECISION: any;
declare const CONCENTRATION_PRECISION: any;
declare const QUOTE_PRECISION_EXP: any;
declare const FUNDING_RATE_BUFFER_PRECISION_EXP: any;
declare const PRICE_PRECISION_EXP: any;
declare const FUNDING_RATE_PRECISION_EXP: any;
declare const PEG_PRECISION_EXP: any;
declare const AMM_RESERVE_PRECISION_EXP: any;
declare const SPOT_MARKET_RATE_PRECISION_EXP: any;
declare const SPOT_MARKET_RATE_PRECISION: any;
declare const SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION_EXP: any;
declare const SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION: any;
declare const SPOT_MARKET_UTILIZATION_PRECISION_EXP: any;
declare const SPOT_MARKET_UTILIZATION_PRECISION: any;
declare const SPOT_MARKET_WEIGHT_PRECISION: any;
declare const SPOT_MARKET_BALANCE_PRECISION_EXP: any;
declare const SPOT_MARKET_BALANCE_PRECISION: any;
declare const SPOT_MARKET_IMF_PRECISION_EXP: any;
declare const SPOT_MARKET_IMF_PRECISION: any;
declare const LIQUIDATION_FEE_PRECISION: any;
declare const QUOTE_PRECISION: any;
declare const PRICE_PRECISION: any;
declare const FUNDING_RATE_PRECISION: any;
declare const FUNDING_RATE_BUFFER_PRECISION: any;
declare const PEG_PRECISION: any;
declare const AMM_RESERVE_PRECISION: any;
declare const BASE_PRECISION: any;
declare const BASE_PRECISION_EXP: any;
declare const AMM_TO_QUOTE_PRECISION_RATIO: any;
declare const PRICE_DIV_PEG: any;
declare const PRICE_TO_QUOTE_PRECISION: any;
declare const AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO: any;
declare const MARGIN_PRECISION: any;
declare const BID_ASK_SPREAD_PRECISION: any;
declare const LIQUIDATION_PCT_PRECISION: any;
declare const ONE_YEAR: any;
declare const QUOTE_SPOT_MARKET_INDEX = 0;
declare const LAMPORTS_PRECISION: any;
declare const LAMPORTS_EXP: any;
declare const OPEN_ORDER_MARGIN_REQUIREMENT: any;
declare const DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT: any;

type SerumMarketSubscriberConfig = {
    connection: Connection;
    programId: PublicKey;
    marketAddress: PublicKey;
    accountSubscription: {
        type: 'polling';
        accountLoader: BulkAccountLoader;
    };
};

declare class SerumSubscriber {
    connection: Connection;
    programId: PublicKey;
    marketAddress: PublicKey;
    accountLoader: BulkAccountLoader;
    market: Market;
    subscribed: boolean;
    asksAddress: PublicKey;
    asks: Orderbook;
    asksCallbackId: string;
    lastAsksSlot: number;
    bidsAddress: PublicKey;
    bids: Orderbook;
    bidsCallbackId: string;
    lastBidsSlot: number;
    constructor(config: SerumMarketSubscriberConfig);
    subscribe(): Promise<void>;
    getBestBid(): BN$1 | undefined;
    getBestAsk(): BN$1 | undefined;
    unsubscribe(): Promise<void>;
}

declare class SerumFulfillmentConfigMap {
    driftClient: DriftClient;
    map: Map<number, SerumV3FulfillmentConfigAccount>;
    constructor(driftClient: DriftClient);
    add(marketIndex: number, serumMarketAddress: PublicKey): Promise<void>;
    get(marketIndex: number): SerumV3FulfillmentConfigAccount;
}

type ResolveReference = {
    resolve?: () => void;
};
declare class RetryTxSender implements TxSender {
    provider: AnchorProvider;
    timeout: number;
    retrySleep: number;
    additionalConnections: Connection[];
    constructor(provider: AnchorProvider, timeout?: number, retrySleep?: number, additionalConnections?: Connection[]);
    send(tx: Transaction, additionalSigners?: Array<Signer>, opts?: ConfirmOptions, preSigned?: boolean): Promise<TxSigAndSlot>;
    prepareTx(tx: Transaction, additionalSigners: Array<Signer>, opts: ConfirmOptions): Promise<Transaction>;
    confirmTransaction(signature: TransactionSignature, commitment?: Commitment): Promise<RpcResponseAndContext<SignatureResult>>;
    getTimestamp(): number;
    sleep(reference: ResolveReference): Promise<void>;
    promiseTimeout<T>(promises: Promise<T>[], timeoutMs: number): Promise<T | null>;
    sendToAdditionalConnections(rawTx: Buffer, opts: ConfirmOptions): void;
    addAdditionalConnection(newConnection: Connection): void;
}

declare function findComputeUnitConsumption(programId: PublicKey, connection: Connection, txSignature: string, commitment?: Finality): Promise<number[]>;

declare function estimateTps(programId: PublicKey, connection: Connection, failed: boolean): Promise<number>;

declare function promiseTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null>;

declare function getBalance(tokenAmount: BN$1, spotMarket: SpotMarketAccount, balanceType: SpotBalanceType): BN$1;
declare function getTokenAmount(balanceAmount: BN$1, spotMarket: SpotMarketAccount, balanceType: SpotBalanceType): BN$1;
declare function getSignedTokenAmount(tokenAmount: BN$1, balanceType: SpotBalanceType): BN$1;
declare function getTokenValue(tokenAmount: BN$1, spotDecimals: number, oraclePriceData: OraclePriceData): BN$1;
declare function calculateAssetWeight(balanceAmount: BN$1, spotMarket: SpotMarketAccount, marginCategory: MarginCategory): BN$1;
declare function calculateLiabilityWeight(balanceAmount: BN$1, spotMarket: SpotMarketAccount, marginCategory: MarginCategory): BN$1;
declare function calculateUtilization(bank: SpotMarketAccount): BN$1;
declare function calculateInterestRate(bank: SpotMarketAccount): BN$1;
declare function calculateDepositRate(bank: SpotMarketAccount): BN$1;
declare function calculateBorrowRate(bank: SpotMarketAccount): BN$1;
declare function calculateInterestAccumulated(bank: SpotMarketAccount, now: BN$1): {
    borrowInterest: BN$1;
    depositInterest: BN$1;
};
declare function calculateWithdrawLimit(spotMarket: SpotMarketAccount, now: BN$1): {
    borrowLimit: BN$1;
    withdrawLimit: BN$1;
};

interface DLOBNode {
    getPrice(oraclePriceData: OraclePriceData, slot: number): BN$1;
    isVammNode(): boolean;
    order: Order | undefined;
    isBaseFilled(): boolean;
    haveFilled: boolean;
    userAccount: PublicKey | undefined;
}
declare abstract class OrderNode implements DLOBNode {
    order: Order;
    userAccount: PublicKey;
    sortValue: BN$1;
    haveFilled: boolean;
    haveTrigger: boolean;
    constructor(order: Order, userAccount: PublicKey);
    abstract getSortValue(order: Order): BN$1;
    getLabel(): string;
    getPrice(oraclePriceData: OraclePriceData, slot: number): BN$1;
    isBaseFilled(): boolean;
    isVammNode(): boolean;
}
declare class LimitOrderNode extends OrderNode {
    next?: LimitOrderNode;
    previous?: LimitOrderNode;
    getSortValue(order: Order): BN$1;
}
declare class FloatingLimitOrderNode extends OrderNode {
    next?: FloatingLimitOrderNode;
    previous?: FloatingLimitOrderNode;
    getSortValue(order: Order): BN$1;
}
declare class MarketOrderNode extends OrderNode {
    next?: MarketOrderNode;
    previous?: MarketOrderNode;
    getSortValue(order: Order): BN$1;
}
declare class TriggerOrderNode extends OrderNode {
    next?: TriggerOrderNode;
    previous?: TriggerOrderNode;
    getSortValue(order: Order): BN$1;
}
type DLOBNodeMap = {
    limit: LimitOrderNode;
    floatingLimit: FloatingLimitOrderNode;
    market: MarketOrderNode;
    trigger: TriggerOrderNode;
};
type DLOBNodeType = 'limit' | 'floatingLimit' | 'market' | ('trigger' & keyof DLOBNodeMap);
declare function createNode<T extends DLOBNodeType>(nodeType: T, order: Order, userAccount: PublicKey): DLOBNodeMap[T];

type SortDirection = 'asc' | 'desc';
declare function getOrderSignature(orderId: number, userAccount: PublicKey): string;
interface DLOBNodeGenerator {
    getGenerator(): Generator<DLOBNode>;
}
declare class NodeList<NodeType extends keyof DLOBNodeMap> implements DLOBNodeGenerator {
    private nodeType;
    private sortDirection;
    head?: DLOBNodeMap[NodeType];
    length: number;
    nodeMap: Map<string, DLOBNodeMap[NodeType]>;
    constructor(nodeType: NodeType, sortDirection: SortDirection);
    clear(): void;
    insert(order: Order, marketType: MarketTypeStr, userAccount: PublicKey): void;
    prependNode(currentNode: DLOBNodeMap[NodeType], newNode: DLOBNodeMap[NodeType]): boolean;
    update(order: Order, userAccount: PublicKey): void;
    remove(order: Order, userAccount: PublicKey): void;
    getGenerator(): Generator<DLOBNode>;
    has(order: Order, userAccount: PublicKey): boolean;
    get(orderId: number, userAccount: PublicKey): DLOBNodeMap[NodeType] | undefined;
    print(): void;
    printTop(): void;
}
declare function getVammNodeGenerator(price: BN$1 | undefined): Generator<DLOBNode>;

type DLOBOrder = {
    user: PublicKey;
    order: Order;
};
type DLOBOrders = DLOBOrder[];
declare class DLOBOrdersCoder {
    private idl;
    constructor(idl: Idl);
    static create(): DLOBOrdersCoder;
    encode(dlobOrders: DLOBOrders): Buffer;
    decode(buffer: Buffer): DLOBOrders;
}

type MarketNodeLists = {
    limit: {
        ask: NodeList<'limit'>;
        bid: NodeList<'limit'>;
    };
    floatingLimit: {
        ask: NodeList<'floatingLimit'>;
        bid: NodeList<'floatingLimit'>;
    };
    market: {
        ask: NodeList<'market'>;
        bid: NodeList<'market'>;
    };
    trigger: {
        above: NodeList<'trigger'>;
        below: NodeList<'trigger'>;
    };
};
type OrderBookCallback = () => void;
type NodeToFill = {
    node: DLOBNode;
    makerNode?: DLOBNode;
};
type NodeToTrigger = {
    node: TriggerOrderNode;
};
declare class DLOB {
    openOrders: Map<MarketTypeStr, Set<string>>;
    orderLists: Map<MarketTypeStr, Map<number, MarketNodeLists>>;
    initialized: boolean;
    constructor();
    private init;
    clear(): void;
    /**
     * initializes a new DLOB instance
     *
     * @returns a promise that resolves when the DLOB is initialized
     */
    initFromUserMap(userMap: UserMap): Promise<boolean>;
    initFromOrders(dlobOrders: DLOBOrders): boolean;
    handleOrderRecord(record: OrderRecord): void;
    handleOrderActionRecord(record: OrderActionRecord): void;
    insertOrder(order: Order, userAccount: PublicKey, onInsert?: OrderBookCallback): void;
    addOrderList(marketType: MarketTypeStr, marketIndex: number): void;
    updateOrder(order: Order, userAccount: PublicKey, cumulativeBaseAssetAmountFilled: BN$1, onUpdate?: OrderBookCallback): void;
    trigger(order: Order, userAccount: PublicKey, onTrigger?: OrderBookCallback): void;
    delete(order: Order, userAccount: PublicKey, onDelete?: OrderBookCallback): void;
    getListForOrder(order: Order): NodeList<any> | undefined;
    getOrder(orderId: number, userAccount: PublicKey): Order | undefined;
    findNodesToFill(marketIndex: number, fallbackBid: BN$1 | undefined, fallbackAsk: BN$1 | undefined, slot: number, ts: number, marketType: MarketType, oraclePriceData: OraclePriceData, stateAccount: StateAccount, marketAccount: PerpMarketAccount | SpotMarketAccount): NodeToFill[];
    findLimitOrderNodesToFill(marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData, isAmmPaused: boolean, fallbackAsk: BN$1 | undefined, fallbackBid: BN$1 | undefined): NodeToFill[];
    findMarketNodesToFill(marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData, isAmmPaused: boolean, fallbackAsk: BN$1 | undefined, fallbackBid?: BN$1 | undefined): NodeToFill[];
    findMarketNodesCrossingLimitNodes(marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData, takerNodeGenerator: Generator<DLOBNode>, makerNodeGeneratorFn: (marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData) => Generator<DLOBNode>, doesCross: (takerPrice: BN$1 | undefined, makerPrice: BN$1) => boolean): NodeToFill[];
    findNodesCrossingFallbackLiquidity(marketType: MarketType, slot: number, oraclePriceData: OraclePriceData, nodeGenerator: Generator<DLOBNode>, fallbackPrice: BN$1, doesCross: (nodePrice: BN$1 | undefined, fallbackPrice: BN$1) => boolean): NodeToFill[];
    findExpiredNodesToFill(marketIndex: number, ts: number, marketType: MarketType): NodeToFill[];
    findJitAuctionNodesToFill(marketIndex: number, slot: number, marketType: MarketType): NodeToFill[];
    getMarketBids(marketIndex: number, marketType: MarketType): Generator<DLOBNode>;
    getMarketAsks(marketIndex: number, marketType: MarketType): Generator<DLOBNode>;
    private getBestNode;
    getLimitAsks(marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): Generator<DLOBNode>;
    getLimitBids(marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): Generator<DLOBNode>;
    getAsks(marketIndex: number, fallbackAsk: BN$1 | undefined, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): Generator<DLOBNode>;
    getBids(marketIndex: number, fallbackBid: BN$1 | undefined, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): Generator<DLOBNode>;
    findCrossingLimitOrders(marketIndex: number, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): NodeToFill[];
    determineMakerAndTaker(askNode: DLOBNode, bidNode: DLOBNode): {
        takerNode: DLOBNode;
        makerNode: DLOBNode;
    };
    getBestAsk(marketIndex: number, fallbackAsk: BN$1 | undefined, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): BN$1;
    getBestBid(marketIndex: number, fallbackBid: BN$1 | undefined, slot: number, marketType: MarketType, oraclePriceData: OraclePriceData): BN$1;
    findNodesToTrigger(marketIndex: number, slot: number, oraclePrice: BN$1, marketType: MarketType, stateAccount: StateAccount): NodeToTrigger[];
    printTopOfOrderLists(sdkConfig: any, driftClient: DriftClient, slotSubscriber: SlotSubscriber, marketIndex: number, marketType: MarketType): void;
    getDLOBOrders(): DLOBOrders;
    getNodeLists(): Generator<NodeList<DLOBNodeType>>;
}

interface UserMapInterface {
    fetchAllUsers(): Promise<void>;
    addPubkey(userAccountPublicKey: PublicKey): Promise<void>;
    has(key: string): boolean;
    get(key: string): User | undefined;
    mustGet(key: string): Promise<User>;
    getUserAuthority(key: string): PublicKey | undefined;
    updateWithOrderRecord(record: OrderRecord): Promise<void>;
    values(): IterableIterator<User>;
}
declare class UserMap implements UserMapInterface {
    private userMap;
    private driftClient;
    private accountSubscription;
    constructor(driftClient: DriftClient, accountSubscription: UserSubscriptionConfig);
    fetchAllUsers(): Promise<void>;
    addPubkey(userAccountPublicKey: PublicKey): Promise<void>;
    has(key: string): boolean;
    /**
     * gets the User for a particular userAccountPublicKey, if no User exists, undefined is returned
     * @param key userAccountPublicKey to get User for
     * @returns user User | undefined
     */
    get(key: string): User | undefined;
    /**
     * gets the User for a particular userAccountPublicKey, if no User exists, new one is created
     * @param key userAccountPublicKey to get User for
     * @returns  User
     */
    mustGet(key: string): Promise<User>;
    /**
     * gets the Authority for a particular userAccountPublicKey, if no User exists, undefined is returned
     * @param key userAccountPublicKey to get User for
     * @returns authority PublicKey | undefined
     */
    getUserAuthority(key: string): PublicKey | undefined;
    updateWithOrderRecord(record: OrderRecord): Promise<void>;
    updateWithEventRecord(record: WrappedEvent<any>): Promise<void>;
    values(): IterableIterator<User>;
    size(): number;
}

declare class UserStatsMap {
    /**
     * map from authority pubkey to UserStats
     */
    private userStatsMap;
    private driftClient;
    private accountSubscription;
    constructor(driftClient: DriftClient, accountSubscription: UserStatsSubscriptionConfig);
    fetchAllUserStats(): Promise<void>;
    addUserStat(authority: PublicKey): Promise<void>;
    updateWithOrderRecord(record: OrderRecord, userMap: UserMap): Promise<void>;
    updateWithEventRecord(record: WrappedEvent<any>, userMap?: UserMap): Promise<void>;
    has(authorityPublicKey: string): boolean;
    get(authorityPublicKey: string): UserStats;
    mustGet(authorityPublicKey: string): Promise<UserStats>;
    values(): IterableIterator<UserStats>;
    size(): number;
}

export { AMM, AMM_RESERVE_PRECISION, AMM_RESERVE_PRECISION_EXP, AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO, AMM_TO_QUOTE_PRECISION_RATIO, AccountSubscriber, AccountToPoll, AdminClient, AssetTier, AssetType, BASE_PRECISION, BASE_PRECISION_EXP, BID_ASK_SPREAD_PRECISION, BN_MAX, BigNum, BufferAndSlot, BulkAccountLoader, CONCENTRATION_PRECISION, CandleResolution, ContractTier, ContractType, CurveRecord, DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT, DLOB, DLOBNode, DLOBNodeGenerator, DLOBNodeMap, DLOBNodeType, DLOBOrder, DLOBOrders, DLOBOrdersCoder, DataAndSlot, DefaultEventSubscriptionOptions, DefaultOrderParams, DepositDirection, DepositExplanation, DepositRecord, DevnetPerpMarkets, DevnetSpotMarkets, DriftClient, DriftClientAccountEvents, DriftClientAccountSubscriber, DriftClientConfig, DriftConfig, DriftEnv, EIGHT, Event, EventMap, EventSubscriber, EventSubscriberEvents, EventSubscriptionOptions, EventSubscriptionOrderBy, EventSubscriptionOrderDirection, EventType, ExchangeStatus, FIVE, FOUR, FUNDING_RATE_BUFFER_PRECISION, FUNDING_RATE_BUFFER_PRECISION_EXP, FUNDING_RATE_PRECISION, FUNDING_RATE_PRECISION_EXP, FeeStructure, FeeTier, FloatingLimitOrderNode, FundingPaymentRecord, FundingRateRecord, HistoricalIndexData, HistoricalOracleData, IWallet, InsuranceFundRecord, InsuranceFundStake, InsuranceFundStakeRecord, LAMPORTS_EXP, LAMPORTS_PRECISION, LIQUIDATION_FEE_PRECISION, LIQUIDATION_PCT_PRECISION, LPAction, LPRecord, LimitOrderNode, LiquidateBorrowForPerpPnlRecord, LiquidatePerpPnlForDepositRecord, LiquidatePerpRecord, LiquidateSpotRecord, LiquidationRecord, LiquidationType, LogParser, LogProvider, LogProviderConfig, MARGIN_PRECISION, MAX_LEVERAGE, MainnetPerpMarkets, MainnetSpotMarkets, MakerInfo, MarginCategory, MarketNodeLists, MarketOrderNode, MarketStatus, MarketType, MarketTypeStr, NINE, NecessaryOrderParams, NewUserRecord, NodeList, NodeToFill, NodeToTrigger, NotSubscribedError, ONE, ONE_YEAR, OPEN_ORDER_MARGIN_REQUIREMENT, OptionalOrderParams, OracleAccountSubscriber, OracleClient, OracleEvents, OracleGuardRails, OracleInfo, OraclePriceData, OracleSource, OraclesToPoll, Order, OrderAction, OrderActionExplanation, OrderActionRecord, OrderFillerRewardStructure, OrderNode, OrderParams, OrderRecord, OrderStatus, OrderTriggerCondition, OrderType, PEG_PRECISION, PEG_PRECISION_EXP, PERCENTAGE_PRECISION, PERCENTAGE_PRECISION_EXP, PRICE_DIV_PEG, PRICE_PRECISION, PRICE_PRECISION_EXP, PRICE_TO_QUOTE_PRECISION, PerpBankruptcyRecord, PerpMarketAccount, PerpMarketConfig, PerpMarkets, PerpPosition, PollingDriftClientAccountSubscriber, PollingLogProviderConfig, PollingOracleAccountSubscriber, PollingTokenAccountSubscriber, PollingUserAccountSubscriber, PollingUserStatsAccountSubscriber, PoolBalance, PositionDirection, PriceImpactUnit, PythClient, QUOTE_PRECISION, QUOTE_PRECISION_EXP, QUOTE_SPOT_MARKET_INDEX, ReferrerInfo, RetryTxSender, SEVEN, SIX, SPOT_MARKET_BALANCE_PRECISION, SPOT_MARKET_BALANCE_PRECISION_EXP, SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION, SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION_EXP, SPOT_MARKET_IMF_PRECISION, SPOT_MARKET_IMF_PRECISION_EXP, SPOT_MARKET_RATE_PRECISION, SPOT_MARKET_RATE_PRECISION_EXP, SPOT_MARKET_UTILIZATION_PRECISION, SPOT_MARKET_UTILIZATION_PRECISION_EXP, SPOT_MARKET_WEIGHT_PRECISION, SerumFulfillmentConfigMap, SerumSubscriber, SerumV3FulfillmentConfigAccount, SettlePnlExplanation, SettlePnlRecord, SlotSubscriber, SlotSubscriberEvents, SortDirection, SortFn, SpotBalanceType, SpotBankruptcyRecord, SpotFulfillmentConfigStatus, SpotFulfillmentStatus, SpotFulfillmentType, SpotInterestRecord, SpotMarketAccount, SpotMarketConfig, SpotMarkets, SpotPosition, StakeAction, StateAccount, SwapDirection, SwitchboardClient, TEN, TEN_MILLION, TEN_THOUSAND, THREE, TWO, TakerInfo, TokenAccountEvents, TokenAccountSubscriber, TokenFaucet, TradeSide, TriggerOrderNode, User, UserAccount, UserAccountEvents, UserAccountSubscriber, UserConfig, UserMap, UserMapInterface, UserStats, UserStatsAccount, UserStatsAccountEvents, UserStatsAccountSubscriber, UserStatsConfig, UserStatsMap, UserStatsSubscriptionConfig, UserStatus, UserSubscriptionConfig, WRAPPED_SOL_MINT, Wallet, WebSocketDriftClientAccountSubscriber, WebSocketLogProviderConfig, WrappedEvent, WrappedEvents, ZERO, ammPaused, bulkPollingUserStatsSubscribe, bulkPollingUserSubscribe, calculateAdjustKCost, calculateAllEstimatedFundingRate, calculateAmmReservesAfterSwap, calculateAskPrice, calculateAssetWeight, calculateBaseAssetAmountForAmmToFulfill, calculateBaseAssetAmountToFillUpToLimitPrice, calculateBaseAssetValue, calculateBaseAssetValueWithOracle, calculateBidAskPrice, calculateBidPrice, calculateBorrowRate, calculateBreakEvenPrice, calculateBudgetedK, calculateBudgetedKBN, calculateBudgetedPeg, calculateClaimablePnl, calculateCostBasis, calculateDepositRate, calculateEffectiveLeverage, calculateEntryPrice, calculateEstimatedFundingRate, calculateFundingPool, calculateInterestAccumulated, calculateInterestRate, calculateInventoryScale, calculateLiabilityWeight, calculateLiveOracleStd, calculateLiveOracleTwap, calculateLongShortFundingRate, calculateLongShortFundingRateAndLiveTwaps, calculateMarketAvailablePNL, calculateMarketMarginRatio, calculateMarketOpenBidAsk, calculateMaxBaseAssetAmountFillable, calculateMaxBaseAssetAmountToTrade, calculateMaxSpread, calculateNetUserPnl, calculateNetUserPnlImbalance, calculateNewAmm, calculateNewMarketAfterTrade, calculateOptimalPegAndBudget, calculateOraclePriceForPerpMargin, calculateOracleReserveSpread, calculateOracleSpread, calculatePegFromTargetPrice, calculatePositionFundingPNL, calculatePositionPNL, calculatePrice, calculateQuoteAssetAmountSwapped, calculateRepegCost, calculateReservePrice, calculateSizeDiscountAssetWeight, calculateSizePremiumLiabilityWeight, calculateSpread, calculateSpreadBN, calculateSpreadReserves, calculateSwapOutput, calculateTargetPriceTrade, calculateTerminalPrice, calculateTradeAcquiredAmounts, calculateTradeSlippage, calculateUnrealizedAssetWeight, calculateUpdatedAMM, calculateUpdatedAMMSpreadReserves, calculateUtilization, calculateVolSpreadBN, calculateWithdrawLimit, calculateWorstCaseBaseAssetAmount, castNumberToSpotPrecision, clampBN, configs, convertPythPrice, convertToNumber, createNode, estimateTps, exchangePaused, fetchLogs, fetchUserAccounts, fetchUserStatsAccount, fillPaused, findComputeUnitConsumption, findDirectionToClose, getAuctionPrice, getAuctionPriceForFixedAuction, getAuctionPriceForOracleOffsetAuction, getBalance, getConfig, getDriftSignerPublicKey, getDriftStateAccountPublicKey, getDriftStateAccountPublicKeyAndNonce, getInsuranceFundStakeAccountPublicKey, getInsuranceFundVaultPublicKey, getLimitOrderParams, getLimitPrice, getMarketOrderParams, getMarketsAndOraclesForSubscription, getOracleClient, getOrderSignature, getPerpMarketPublicKey, getSerumFulfillmentConfigPublicKey, getSerumOpenOrdersPublicKey, getSerumSignerPublicKey, getSignedTokenAmount, getSpotMarketPublicKey, getSpotMarketVaultPublicKey, getSwapDirection, getTokenAmount, getTokenValue, getTriggerLimitOrderParams, getTriggerMarketOrderParams, getUserAccountPublicKey, getUserAccountPublicKeyAndNonce, getUserAccountPublicKeySync, getUserStatsAccountPublicKey, getVammNodeGenerator, getVariant, hasAuctionPrice, hasLimitPrice, initialize, isAuctionComplete, isEmptyPosition, isFillableByVAMM, isLimitOrder, isMarketOrder, isOneOfVariant, isOracleTooDivergent, isOracleValid, isOrderExpired, isOrderReduceOnly, isOrderRiskIncreasing, isOrderRiskIncreasingInSameDirection, isTriggered, isVariant, logProviderCallback, mustBeTriggered, oraclePriceBands, positionCurrentDirection, positionIsAvailable, promiseTimeout, squareRootBN, stakeAmountToShares, standardizeBaseAssetAmount, unstakeSharesToAmount };
