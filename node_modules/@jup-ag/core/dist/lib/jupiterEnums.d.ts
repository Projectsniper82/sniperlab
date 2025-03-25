import BN from 'bn.js';
export type SideType = typeof Side.Ask | typeof Side.Bid;
export declare const Side: {
    Bid: {
        bid: {};
    };
    Ask: {
        ask: {};
    };
};
export type SwapType = ReturnType<(typeof Swap)[keyof typeof Swap]>;
export declare const Swap: {
    Mercurial: () => {
        mercurial: {};
    };
    Cykura: () => {
        cykura: {};
    };
    Serum: (side: SideType) => {
        serum: {
            side: SideType;
        };
    };
    Saber: () => {
        saber: {};
    };
    SaberAddDecimalsDeposit: () => {
        saberAddDecimalsDeposit: {};
    };
    SaberAddDecimalsWithdraw: () => {
        saberAddDecimalsWithdraw: {};
    };
    TokenSwap: () => {
        tokenSwap: {};
    };
    Sencha: () => {
        sencha: {};
    };
    Step: () => {
        step: {};
    };
    Cropper: () => {
        cropper: {};
    };
    Raydium: () => {
        raydium: {};
    };
    Crema: (aToB: boolean) => {
        crema: {
            aToB: boolean;
        };
    };
    Lifinity: () => {
        lifinity: {};
    };
    MarinadeDeposit: () => {
        marinadeDeposit: {};
    };
    MarinadeUnstake: () => {
        marinadeUnstake: {};
    };
    Aldrin: (side: SideType) => {
        aldrin: {
            side: SideType;
        };
    };
    AldrinV2: (side: SideType) => {
        aldrinV2: {
            side: SideType;
        };
    };
    Whirlpool: (aToB: boolean) => {
        whirlpool: {
            aToB: boolean;
        };
    };
    Invariant: (xToY: boolean) => {
        invariant: {
            xToY: boolean;
        };
    };
    Meteora: () => {
        meteora: {};
    };
    GooseFX: () => {
        gooseFx: {};
    };
    DeltaFi: (stable: boolean) => {
        deltaFi: {
            stable: boolean;
        };
    };
    Dradex: (side: SideType) => {
        dradex: {
            side: SideType;
        };
    };
    MarcoPolo: (xToY: boolean) => {
        marcoPolo: {
            xToY: boolean;
        };
    };
    Balansol: () => {
        balansol: {};
    };
    LifinityV2: () => {
        lifinityV2: {};
    };
    RaydiumClmm: () => {
        raydiumClmm: {};
    };
    Openbook: (side: SideType) => {
        openbook: {
            side: SideType;
        };
    };
    Phoenix: (side: SideType) => {
        phoenix: {
            side: SideType;
        };
    };
    Symmetry: (fromTokenId: BN, toTokenId: BN) => {
        symmetry: {
            fromTokenId: BN;
            toTokenId: BN;
        };
    };
};
export interface SwapLegType {
    chain?: {
        swapLegs: SwapLegType[];
    };
    split?: {
        splitLegs: SplitLegType[];
    };
    swap?: {
        swap: SwapType;
    };
}
export declare const SwapLeg: {
    Chain: (swapLegs: SwapLegType[]) => {
        chain: {
            swapLegs: SwapLegType[];
        };
    };
    Split: (splitLegs: SplitLegType[]) => {
        split: {
            splitLegs: {
                percent: number;
                swapLeg: SwapLegType;
            }[];
        };
    };
    Swap: (swap: SwapType) => {
        swap: {
            swap: SwapType;
        };
    };
};
export type SplitLegType = ReturnType<typeof SplitLeg>;
export declare const SplitLeg: (percent: number, swapLeg: SwapLegType) => {
    percent: number;
    swapLeg: SwapLegType;
};
