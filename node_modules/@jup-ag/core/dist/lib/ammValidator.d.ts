import { Amm } from './amm';
type AmmValidator = {
    [key in Amm['label'] | '*']?: boolean | AmmValidator;
};
export type SingleLevelAmmValidator = {
    [key in Amm['label']]?: boolean;
};
export declare const RESTRICTED_SPLIT_TRADE_AMMS_CONFIG: AmmValidator;
export declare const RESTRICTED_LEGACY_SPLIT_TRADE_AMMS_CONFIG: AmmValidator;
export declare const SINGLE_TX_RESTRICTED_AMMS: AmmValidator;
export declare const checkConfig: (config: AmmValidator, ammA: string, ammB?: string) => boolean;
export {};
