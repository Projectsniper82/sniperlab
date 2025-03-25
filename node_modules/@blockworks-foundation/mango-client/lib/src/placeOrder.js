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
const serum_1 = require("@project-serum/serum");
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const config_1 = require("./config");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = _1.Config.ids();
        const groupConfig = config.getGroup('devnet', 'devnet.2');
        const connection = new web3_js_1.Connection(config.cluster_urls['devnet'], 'processed');
        const owner = web3_js_1.Keypair.fromSecretKey(JSON.parse(process.env.PRIVATE_KEY));
        console.log({ owner });
        const client = new _1.MangoClient(connection, groupConfig.mangoProgramId);
        const group = yield client.getMangoGroup(groupConfig.publicKey);
        const accounts = yield client.getMangoAccountsForOwner(group, owner.publicKey);
        console.log({ account: accounts[0].publicKey.toBase58() });
        const market = yield serum_1.Market.load(connection, (0, config_1.getSpotMarketByBaseSymbol)(groupConfig, 'SOL').publicKey, undefined, groupConfig.serumProgramId);
        yield client.placeSpotOrder(group, accounts[0], group.mangoCache, market, owner, 'buy', 10, 1, 'postOnly');
    });
}
main();
//# sourceMappingURL=placeOrder.js.map