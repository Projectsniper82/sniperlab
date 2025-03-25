"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminSetNewFeesInstruction = exports.createAdminCommitNewAdminInstruction = exports.createAdminApplyNewAdminInstruction = exports.createAdminSetFeeAccountInstruction = exports.createAdminUnpauseInstruction = exports.createAdminPauseInstruction = exports.createAdminStopRampAInstruction = exports.createAdminRampAInstruction = exports.AdminInstruction = void 0;
const tslib_1 = require("tslib");
const BufferLayout = tslib_1.__importStar(require("@solana/buffer-layout"));
const fees_js_1 = require("../state/fees.js");
const common_js_1 = require("./common.js");
const layouts_js_1 = require("./layouts.js");
/**
 * Admin instruction.
 */
var AdminInstruction;
(function (AdminInstruction) {
    AdminInstruction[AdminInstruction["RAMP_A"] = 100] = "RAMP_A";
    AdminInstruction[AdminInstruction["STOP_RAMP_A"] = 101] = "STOP_RAMP_A";
    AdminInstruction[AdminInstruction["PAUSE"] = 102] = "PAUSE";
    AdminInstruction[AdminInstruction["UNPAUSE"] = 103] = "UNPAUSE";
    AdminInstruction[AdminInstruction["SET_FEE_ACCOUNT"] = 104] = "SET_FEE_ACCOUNT";
    AdminInstruction[AdminInstruction["APPLY_NEW_ADMIN"] = 105] = "APPLY_NEW_ADMIN";
    AdminInstruction[AdminInstruction["COMMIT_NEW_ADMIN"] = 106] = "COMMIT_NEW_ADMIN";
    AdminInstruction[AdminInstruction["SET_NEW_FEES"] = 107] = "SET_NEW_FEES";
})(AdminInstruction = exports.AdminInstruction || (exports.AdminInstruction = {}));
/**
 * Creates a ramp A instruction.
 */
const createAdminRampAInstruction = ({ config, state: { adminAccount }, targetAmp, stopRamp, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
    ];
    const data = Buffer.alloc(layouts_js_1.RampAIXLayout.span);
    layouts_js_1.RampAIXLayout.encode({
        instruction: AdminInstruction.RAMP_A,
        targetAmp: targetAmp.toBuffer(),
        stopRampTS: Math.floor(stopRamp.getTime() / 1000),
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminRampAInstruction = createAdminRampAInstruction;
/**
 * Creates a stop ramp A instruction.
 */
const createAdminStopRampAInstruction = ({ config, state: { adminAccount }, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
    ];
    let data = Buffer.alloc(layouts_js_1.StopRampAIXLayout.span);
    const encodeLength = layouts_js_1.StopRampAIXLayout.encode({
        instruction: AdminInstruction.STOP_RAMP_A,
    }, data);
    data = data.slice(0, encodeLength);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminStopRampAInstruction = createAdminStopRampAInstruction;
/**
 * Creates a pause instruction.
 */
const createAdminPauseInstruction = ({ config, state: { adminAccount }, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
    ];
    const data = Buffer.alloc(layouts_js_1.PauseIXLayout.span);
    layouts_js_1.PauseIXLayout.encode({
        instruction: AdminInstruction.PAUSE,
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminPauseInstruction = createAdminPauseInstruction;
/**
 * Creates an unpause instruction.
 */
const createAdminUnpauseInstruction = ({ config, state: { adminAccount }, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
    ];
    const data = Buffer.alloc(layouts_js_1.UnpauseIXLayout.span);
    layouts_js_1.UnpauseIXLayout.encode({
        instruction: AdminInstruction.UNPAUSE,
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminUnpauseInstruction = createAdminUnpauseInstruction;
/**
 * Creates a set fee account instruction.
 */
const createAdminSetFeeAccountInstruction = ({ config, state: { adminAccount }, tokenAccount, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
        { pubkey: tokenAccount, isSigner: false, isWritable: false },
    ];
    const data = Buffer.alloc(layouts_js_1.SetFeeAccountIXLayout.span);
    layouts_js_1.SetFeeAccountIXLayout.encode({
        instruction: AdminInstruction.SET_FEE_ACCOUNT,
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminSetFeeAccountInstruction = createAdminSetFeeAccountInstruction;
/**
 * Creates a set new fees instruction.
 */
const createAdminApplyNewAdminInstruction = ({ config, state: { adminAccount }, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
    ];
    const data = Buffer.alloc(layouts_js_1.ApplyNewAdminIXLayout.span);
    layouts_js_1.ApplyNewAdminIXLayout.encode({
        instruction: AdminInstruction.APPLY_NEW_ADMIN,
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminApplyNewAdminInstruction = createAdminApplyNewAdminInstruction;
/**
 * Creates a set new fees instruction.
 */
const createAdminCommitNewAdminInstruction = ({ config, state: { adminAccount }, newAdminAccount, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
        { pubkey: newAdminAccount, isSigner: false, isWritable: false },
    ];
    const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: AdminInstruction.COMMIT_NEW_ADMIN,
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminCommitNewAdminInstruction = createAdminCommitNewAdminInstruction;
/**
 * Creates a set new fees instruction.
 */
const createAdminSetNewFeesInstruction = ({ config, state: { adminAccount }, fees = fees_js_1.ZERO_FEES, }) => {
    const keys = [
        { pubkey: config.swapAccount, isSigner: false, isWritable: true },
        { pubkey: adminAccount, isSigner: true, isWritable: false },
    ];
    const data = Buffer.alloc(layouts_js_1.SetNewFeesIXLayout.span);
    layouts_js_1.SetNewFeesIXLayout.encode({
        instruction: AdminInstruction.SET_NEW_FEES,
        fees: (0, fees_js_1.encodeFees)(fees),
    }, data);
    return (0, common_js_1.buildInstruction)({
        config,
        keys,
        data,
    });
};
exports.createAdminSetNewFeesInstruction = createAdminSetNewFeesInstruction;
//# sourceMappingURL=admin.js.map