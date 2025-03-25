"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const web3_js_1 = require("@solana/web3.js");
const client_1 = require("../client");
const config_1 = require("../config");
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const utils_1 = require("../utils/utils");
const groupName = process.env.GROUP || 'devnet.2';
const cluster = (process.env.CLUSTER || groupName.split('.')[0]);
const config = config_1.Config.ids();
const connection = new web3_js_1.Connection(config.cluster_urls[cluster], 'confirmed');
const groupIds = config.getGroup(cluster, groupName);
const mangoProgramId = groupIds.mangoProgramId;
const mangoGroupKey = groupIds.publicKey;
const client = new client_1.MangoClient(connection, mangoProgramId);
const payer = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.KEYPAIR ||
    fs.readFileSync(os.homedir() + '/.config/solana/devnet.json', 'utf-8'))));
const makerPk = new web3_js_1.PublicKey('6rnq9ajZpJCkDe3xP7WAs9KFgLAhQWA2gyz1zVv2cnTn');
const takerPk = new web3_js_1.PublicKey('HGaFMw6fJmTzL3wq2H9tXXj2sx3BMg7kYtJmgedvKrJy');
const referrerPk = new web3_js_1.PublicKey('DxUrnFn3GF9cK3YTv33oA4VVDP2yRa5BtS6MrHY5yFKY');
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        const group = yield client.getMangoGroup(mangoGroupKey);
        console.log('referrer mngo required', (0, utils_1.nativeToUi)(group.refMngoRequired.toNumber(), 6), 'ref share tier 1', group.refShareCentibpsTier1, 'ref surcharge tier 1', group.refSurchargeCentibpsTier1, 'ref share tier 2', group.refShareCentibpsTier2, 'ref surcharge tier 2', group.refSurchargeCentibpsTier2);
        if (groupName == 'devnet.2') {
            const perpMarketConfig = groupIds.perpMarkets.find((p) => p.baseSymbol == 'AVAX');
            const perpMarketInfo = group.perpMarkets[perpMarketConfig.marketIndex];
            const perpMarket = yield group.loadPerpMarket(connection, perpMarketConfig.marketIndex, perpMarketConfig.baseDecimals, perpMarketConfig.quoteDecimals);
            console.log('maker fee', perpMarketInfo.makerFee.toNumber(), 'taker fee', perpMarketInfo.takerFee.toNumber());
            const makerAccount = yield client.getMangoAccount(makerPk, group.dexProgramId);
            const takerAccount = yield client.getMangoAccount(takerPk, group.dexProgramId);
            const referrerAccount = yield client.getMangoAccount(referrerPk, group.dexProgramId);
            const cache = yield group.loadCache(connection);
            const mngoIndex = group.getRootBankIndex(groupIds.tokens.find((t) => t.symbol == 'MNGO').rootKey);
            console.log('referrer mngo', referrerAccount
                .getUiDeposit(cache.rootBankCache[mngoIndex], group, mngoIndex)
                .toNumber(), 'referrer avax quote', referrerAccount.perpAccounts[perpMarketConfig.marketIndex].quotePosition.toNumber());
            // No referrer
            // Place maker order
            let ts = Date.now();
            console.log('maker order', yield client.placePerpOrder2(group, makerAccount, perpMarket, payer, 'sell', 15.5, 1, { clientOrderId: ts }));
            // Place taker order that will match
            console.log('taker order', yield client.placePerpOrder2(group, takerAccount, perpMarket, payer, 'buy', 16, 1));
            yield (0, utils_1.sleep)(5000);
            // Load fills
            const fills = (yield perpMarket.loadFills(connection)).filter((f) => f.maker.equals(makerPk) && f.makerClientOrderId.toNumber() == ts);
            fills.forEach((f) => {
                console.log('fill', 'price', f.price, 'quantity', f.quantity, 'maker fee', f.makerFee.toNumber(), 'taker fee', f.takerFee.toNumber());
            });
            // With referrer
            // Place maker order
            ts = Date.now();
            console.log('maker order (ref)', yield client.placePerpOrder2(group, makerAccount, perpMarket, payer, 'sell', 15.5, 1, { referrerMangoAccountPk: referrerPk, clientOrderId: ts }));
            // Place taker order that will match
            console.log('taker order (ref)', yield client.placePerpOrder2(group, takerAccount, perpMarket, payer, 'buy', 16, 1, { referrerMangoAccountPk: referrerPk }));
            yield (0, utils_1.sleep)(5000);
            // Load fills
            const referrerFills = (yield perpMarket.loadFills(connection)).filter((f) => f.maker.equals(makerPk) && f.makerClientOrderId.toNumber() == ts);
            referrerFills.forEach((f) => {
                console.log('fill (ref)', 'price', f.price, 'quantity', f.quantity, 'maker fee', f.makerFee.toNumber(), 'taker fee', f.takerFee.toNumber());
            });
        }
    });
}
check();
//# sourceMappingURL=checkFees.js.map