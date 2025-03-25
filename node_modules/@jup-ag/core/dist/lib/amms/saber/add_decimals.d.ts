export type AddDecimals = {
    version: '0.0.1';
    name: 'add_decimals';
    instructions: [];
    accounts: [
        {
            name: 'wrappedToken';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'decimals';
                        type: 'u8';
                    },
                    {
                        name: 'multiplier';
                        type: 'u64';
                    },
                    {
                        name: 'wrappedUnderlyingMint';
                        type: 'publicKey';
                    },
                    {
                        name: 'wrappedUnderlyingTokens';
                        type: 'publicKey';
                    },
                    {
                        name: 'wrapperMint';
                        type: 'publicKey';
                    },
                    {
                        name: 'nonce';
                        type: 'u8';
                    }
                ];
            };
        }
    ];
    errors: [];
};
export declare const IDL: AddDecimals;
