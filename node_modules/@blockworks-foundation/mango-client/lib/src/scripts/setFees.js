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
const instruction_1 = require("../instruction");
const bn_js_1 = require("bn.js");
const groupName = process.env.GROUP || 'devnet.3';
const cluster = (process.env.CLUSTER || groupName.split('.')[0]);
const config = config_1.Config.ids();
const connection = new web3_js_1.Connection(config.cluster_urls[cluster], 'confirmed');
const groupIds = config.getGroup(cluster, groupName);
const mangoProgramId = groupIds.mangoProgramId;
const mangoGroupKey = groupIds.publicKey;
const client = new client_1.MangoClient(connection, mangoProgramId);
const payer = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.KEYPAIR ||
    fs.readFileSync(os.homedir() + '/.config/solana/devnet.json', 'utf-8'))));
// const makerPk = new PublicKey('6rnq9ajZpJCkDe3xP7WAs9KFgLAhQWA2gyz1zVv2cnTn');
// const takerPk = new PublicKey('HGaFMw6fJmTzL3wq2H9tXXj2sx3BMg7kYtJmgedvKrJy');
// const referrerPk = new PublicKey(
//   'DxUrnFn3GF9cK3YTv33oA4VVDP2yRa5BtS6MrHY5yFKY',
// );
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield client.getMangoGroup(mangoGroupKey);
        console.log('referrer mngo required', (0, utils_1.nativeToUi)(group.refMngoRequired.toNumber(), 6), 'ref share tier 1', group.refShareCentibpsTier1, 'ref surcharge tier 1', group.refSurchargeCentibpsTier1, 'ref share tier 2', group.refShareCentibpsTier2, 'ref surcharge tier 2', group.refSurchargeCentibpsTier2);
        const ix = (0, instruction_1.makeChangeReferralFeeParams2Instruction)(groupIds.mangoProgramId, mangoGroupKey, payer.publicKey, new bn_js_1.BN(90), new bn_js_1.BN(85), new bn_js_1.BN(100), new bn_js_1.BN(90), (0, utils_1.uiToNative)(10000, 6), new bn_js_1.BN(10));
        const tx = new web3_js_1.Transaction().add(ix);
        yield client.sendTransaction(tx, payer, []);
        yield (0, utils_1.sleep)(5000);
        group = yield client.getMangoGroup(mangoGroupKey);
        console.log('referrer mngo required', (0, utils_1.nativeToUi)(group.refMngoRequired.toNumber(), 6), 'ref share tier 1', group.refShareCentibpsTier1, 'ref surcharge tier 1', group.refSurchargeCentibpsTier1, 'ref share tier 2', group.refShareCentibpsTier2, 'ref surcharge tier 2', group.refSurchargeCentibpsTier2);
    });
}
check();
//# sourceMappingURL=setFees.js.map