export type FundsIDL = {
    version: '0.1.0';
    name: 'funds';
    instructions: [
        {
            name: 'createFund';
            accounts: [
                {
                    name: 'manager';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'fundToken';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'createFeeSweeper';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'messageDigestFive';
                    type: {
                        array: ['u8', 16];
                    };
                },
                {
                    name: 'managerFee';
                    type: 'u64';
                },
                {
                    name: 'hostPubkey';
                    type: 'publicKey';
                },
                {
                    name: 'hostFee';
                    type: 'u64';
                },
                {
                    name: 'activelyManaged';
                    type: 'u64';
                },
                {
                    name: 'assetPool';
                    type: {
                        array: ['u8', 256];
                    };
                },
                {
                    name: 'refilterInterval';
                    type: 'u64';
                },
                {
                    name: 'reweightInterval';
                    type: 'u64';
                },
                {
                    name: 'rebalanceInterval';
                    type: 'u64';
                },
                {
                    name: 'rebalanceThreshold';
                    type: 'u64';
                },
                {
                    name: 'rebalanceSlippage';
                    type: 'u64';
                },
                {
                    name: 'lpOffsetThreshold';
                    type: 'u64';
                },
                {
                    name: 'fundLpFee';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'closeFund';
            accounts: [
                {
                    name: 'manager';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundToken';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'setRules';
            accounts: [
                {
                    name: 'manager';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'numOfRules';
                    type: 'u64';
                },
                {
                    name: 'rulesData';
                    type: {
                        array: ['u8', 512];
                    };
                },
                {
                    name: 'ruleWeights';
                    type: {
                        array: ['u64', 20];
                    };
                },
                {
                    name: 'ruleExpos';
                    type: {
                        array: ['i64', 20];
                    };
                }
            ];
        },
        {
            name: 'fundEdit';
            accounts: [
                {
                    name: 'manager';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'messageDigestFive';
                    type: {
                        array: ['u8', 16];
                    };
                },
                {
                    name: 'managerFee';
                    type: 'u64';
                },
                {
                    name: 'activelyManaged';
                    type: 'u64';
                },
                {
                    name: 'assetPool';
                    type: {
                        array: ['u8', 256];
                    };
                },
                {
                    name: 'refilterInterval';
                    type: 'u64';
                },
                {
                    name: 'reweightInterval';
                    type: 'u64';
                },
                {
                    name: 'rebalanceInterval';
                    type: 'u64';
                },
                {
                    name: 'rebalanceThreshold';
                    type: 'u64';
                },
                {
                    name: 'rebalanceSlippage';
                    type: 'u64';
                },
                {
                    name: 'lpOffsetThreshold';
                    type: 'u64';
                },
                {
                    name: 'fundLpFee';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'buyFund';
            accounts: [
                {
                    name: 'buyer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyerUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'managerUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'smfFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'hostUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyerFundTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyState';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'amount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'mintFund';
            accounts: [
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'buyer';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'buyState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'buyerFundTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fundToken';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'swapFundTokens';
            accounts: [
                {
                    name: 'buyer';
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaFromTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyerFromTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaToTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyerToTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'swapFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'hostFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'managerFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'curveData';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'fromTokenId';
                    type: 'u64';
                },
                {
                    name: 'toTokenId';
                    type: 'u64';
                },
                {
                    name: 'fromAmount';
                    type: 'u64';
                },
                {
                    name: 'minimumToAmount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'sellFund';
            accounts: [
                {
                    name: 'seller';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'newFundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'sellerFundTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fundToken';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'amount';
                    type: 'u64';
                },
                {
                    name: 'rebalance';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'claimToken';
            accounts: [
                {
                    name: 'manager';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'sellerTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenId';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'claimTokenFromBuyState';
            accounts: [
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'buyer';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'buyerTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenId';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'updateCurrentWeights';
            accounts: [
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'buyStateRebalance';
            accounts: [
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'buyState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pythToken';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pythUsdc';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rebalanceFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'prismProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenId';
                    type: 'u8';
                },
                {
                    name: 'instructionId';
                    type: {
                        array: ['u8', 8];
                    };
                },
                {
                    name: 'instructionSize';
                    type: 'u8';
                },
                {
                    name: 'instructionData';
                    type: {
                        array: ['u8', 28];
                    };
                }
            ];
        },
        {
            name: 'rebalanceToUsdc';
            accounts: [
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pythToken';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pythUsdc';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rebalanceFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'prismProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenId';
                    type: 'u8';
                },
                {
                    name: 'maxAmountToSell';
                    type: 'u64';
                },
                {
                    name: 'instructionId';
                    type: {
                        array: ['u8', 8];
                    };
                },
                {
                    name: 'instructionSize';
                    type: 'u8';
                },
                {
                    name: 'instructionData';
                    type: {
                        array: ['u8', 28];
                    };
                }
            ];
        },
        {
            name: 'rebalanceFromUsdc';
            accounts: [
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenInfo';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pythToken';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pythUsdc';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'pdaTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'pdaUsdcAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rebalanceFeeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'prismProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenId';
                    type: 'u8';
                },
                {
                    name: 'maxAmountToSpend';
                    type: 'u64';
                },
                {
                    name: 'instructionId';
                    type: {
                        array: ['u8', 8];
                    };
                },
                {
                    name: 'instructionSize';
                    type: 'u8';
                },
                {
                    name: 'instructionData';
                    type: {
                        array: ['u8', 28];
                    };
                }
            ];
        },
        {
            name: 'reweight';
            accounts: [
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenStats';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'refilter';
            accounts: [
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fundState';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenStats';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'addToken';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenMint';
                    type: 'publicKey';
                },
                {
                    name: 'pdaTokenAccount';
                    type: 'publicKey';
                },
                {
                    name: 'coingeckoId';
                    type: {
                        array: ['u8', 30];
                    };
                },
                {
                    name: 'pyth';
                    type: 'publicKey';
                },
                {
                    name: 'decimals';
                    type: 'u8';
                },
                {
                    name: 'index';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'updateDatabase';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'database';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'tokenId';
                    type: 'u64';
                },
                {
                    name: 'price';
                    type: 'u64';
                },
                {
                    name: 'circulatingSupply';
                    type: 'u64';
                },
                {
                    name: 'volume';
                    type: 'u64';
                },
                {
                    name: 'timestamp';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'updateTokenStats';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenStats';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'database';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'startIndex';
                    type: 'u8';
                },
                {
                    name: 'endIndex';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'updateCurveData';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'curveData';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'startIndex';
                    type: 'u8';
                },
                {
                    name: 'endIndex';
                    type: 'u8';
                },
                {
                    name: 'priceData';
                    type: {
                        array: [
                            {
                                array: [
                                    {
                                        array: [
                                            {
                                                array: ['u64', 2];
                                            },
                                            10
                                        ];
                                    },
                                    2
                                ];
                            },
                            3
                        ];
                    };
                }
            ];
        },
        {
            name: 'initializeTokenInfo';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'initializeDatabase';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'database';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'initializeTokenStats';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenStats';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'initializeCurveData';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'curveData';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'closeDatabase';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'database';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'closeTokenStats';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenStats';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'closeTokenInfo';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'closeToken';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'pdaAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'closeOpenOrders';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'pdaAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'openOrders';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'market';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'serumDex';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'serumSwapProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: 'fundState';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'version';
                        type: 'u64';
                    },
                    {
                        name: 'manager';
                        type: 'publicKey';
                    },
                    {
                        name: 'fundToken';
                        type: 'publicKey';
                    },
                    {
                        name: 'managerFee';
                        type: 'u64';
                    },
                    {
                        name: 'supplyOutsanding';
                        type: 'u64';
                    },
                    {
                        name: 'activelyManaged';
                        type: 'u64';
                    },
                    {
                        name: 'activeBuyStates';
                        type: 'u64';
                    },
                    {
                        name: 'sellState';
                        type: 'u64';
                    },
                    {
                        name: 'rebalanceSellState';
                        type: 'u64';
                    },
                    {
                        name: 'hostPubkey';
                        type: 'publicKey';
                    },
                    {
                        name: 'hostFee';
                        type: 'u64';
                    },
                    {
                        name: 'numOfTokens';
                        type: 'u64';
                    },
                    {
                        name: 'currentCompToken';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'currentCompAmount';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'lastRebalanceTime';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'targetWeight';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'weightSum';
                        type: 'u64';
                    },
                    {
                        name: 'currentWeight';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'fundWorth';
                        type: 'u64';
                    },
                    {
                        name: 'lastUpdateTime';
                        type: 'u64';
                    },
                    {
                        name: 'refilterInterval';
                        type: 'u64';
                    },
                    {
                        name: 'reweightInterval';
                        type: 'u64';
                    },
                    {
                        name: 'rebalanceInterval';
                        type: 'u64';
                    },
                    {
                        name: 'rebalanceThreshold';
                        type: 'u64';
                    },
                    {
                        name: 'rebalanceSlippage';
                        type: 'u64';
                    },
                    {
                        name: 'lpOffsetThreshold';
                        type: 'u64';
                    },
                    {
                        name: 'lastRefilterTime';
                        type: 'u64';
                    },
                    {
                        name: 'lastReweightTime';
                        type: 'u64';
                    },
                    {
                        name: 'rulesReady';
                        type: 'u64';
                    },
                    {
                        name: 'assetPool';
                        type: {
                            array: ['u64', 200];
                        };
                    },
                    {
                        name: 'numOfRules';
                        type: 'u64';
                    },
                    {
                        name: 'rules';
                        type: {
                            array: [
                                {
                                    defined: 'Rule';
                                },
                                20
                            ];
                        };
                    },
                    {
                        name: 'numRuleTokens';
                        type: 'u64';
                    },
                    {
                        name: 'ruleTokens';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'ruleTokenWeights';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'messageDigestFive';
                        type: {
                            array: ['u8', 16];
                        };
                    },
                    {
                        name: 'fundLpFee';
                        type: 'u64';
                    },
                    {
                        name: 'symmetryLpFee';
                        type: 'u64';
                    },
                    {
                        name: 'extraBytes';
                        type: {
                            array: ['u64', 96];
                        };
                    }
                ];
            };
        },
        {
            name: 'buyState';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'fund';
                        type: 'publicKey';
                    },
                    {
                        name: 'buyer';
                        type: 'publicKey';
                    },
                    {
                        name: 'fundManager';
                        type: 'publicKey';
                    },
                    {
                        name: 'hostPlatform';
                        type: 'publicKey';
                    },
                    {
                        name: 'buyerFundTokenAccount';
                        type: 'publicKey';
                    },
                    {
                        name: 'usdcContributed';
                        type: 'u64';
                    },
                    {
                        name: 'usdcLeft';
                        type: 'u64';
                    },
                    {
                        name: 'token';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'amountToSpend';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'amountBought';
                        type: {
                            array: ['u64', 20];
                        };
                    },
                    {
                        name: 'creationTimestamp';
                        type: 'u64';
                    },
                    {
                        name: 'contributedValue';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'tokenInfo';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'numTokens';
                        type: 'u64';
                    },
                    {
                        name: 'tokenMint';
                        type: {
                            array: ['publicKey', 200];
                        };
                    },
                    {
                        name: 'pdaTokenAccount';
                        type: {
                            array: ['publicKey', 200];
                        };
                    },
                    {
                        name: 'coingeckoIds';
                        type: {
                            array: [
                                {
                                    array: ['u8', 30];
                                },
                                200
                            ];
                        };
                    },
                    {
                        name: 'pyth';
                        type: {
                            array: ['publicKey', 200];
                        };
                    },
                    {
                        name: 'decimals';
                        type: {
                            array: ['u8', 200];
                        };
                    }
                ];
            };
        },
        {
            name: 'database';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'data';
                        type: {
                            array: [
                                {
                                    defined: 'TokenData';
                                },
                                200
                            ];
                        };
                    },
                    {
                        name: 'numberOfTokens';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'tokenStats';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'stats';
                        type: {
                            array: [
                                {
                                    array: [
                                        {
                                            defined: 'Stats';
                                        },
                                        6
                                    ];
                                },
                                200
                            ];
                        };
                    }
                ];
            };
        },
        {
            name: 'prismData';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'buy';
                        type: {
                            array: [
                                {
                                    defined: 'TokenPriceData';
                                },
                                200
                            ];
                        };
                    },
                    {
                        name: 'sell';
                        type: {
                            array: [
                                {
                                    defined: 'TokenPriceData';
                                },
                                200
                            ];
                        };
                    }
                ];
            };
        }
    ];
    types: [
        {
            name: 'Rule';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'filterBy';
                        type: 'u64';
                    },
                    {
                        name: 'filterDays';
                        type: 'u64';
                    },
                    {
                        name: 'sortBy';
                        type: 'u64';
                    },
                    {
                        name: 'totalWeight';
                        type: 'u64';
                    },
                    {
                        name: 'fixedAsset';
                        type: 'u64';
                    },
                    {
                        name: 'numAssets';
                        type: 'u64';
                    },
                    {
                        name: 'weightBy';
                        type: 'u64';
                    },
                    {
                        name: 'weightDays';
                        type: 'u64';
                    },
                    {
                        name: 'weightExpo';
                        type: 'i64';
                    },
                    {
                        name: 'excludeNum';
                        type: 'u64';
                    },
                    {
                        name: 'excludeAssets';
                        type: {
                            array: ['u64', 10];
                        };
                    },
                    {
                        name: 'ruleAssets';
                        type: {
                            array: ['u64', 20];
                        };
                    }
                ];
            };
        },
        {
            name: 'TokenData';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'price';
                        type: {
                            array: ['u64', 460];
                        };
                    },
                    {
                        name: 'circulatingSupply';
                        type: {
                            array: ['u64', 460];
                        };
                    },
                    {
                        name: 'volume';
                        type: {
                            array: ['u64', 460];
                        };
                    },
                    {
                        name: 'timestamp';
                        type: {
                            array: ['u64', 460];
                        };
                    },
                    {
                        name: 'index';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'Stats';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'days';
                        type: 'u64';
                    },
                    {
                        name: 'performance';
                        type: 'u64';
                    },
                    {
                        name: 'volume';
                        type: 'u64';
                    },
                    {
                        name: 'mcap';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'TokenPriceData';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'amount';
                        type: {
                            array: ['u64', 10];
                        };
                    },
                    {
                        name: 'price';
                        type: {
                            array: ['u64', 10];
                        };
                    }
                ];
            };
        },
        {
            name: 'PriceStatus';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'Unknown';
                    },
                    {
                        name: 'Trading';
                    },
                    {
                        name: 'Halted';
                    },
                    {
                        name: 'Auction';
                    }
                ];
            };
        },
        {
            name: 'CorpAction';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'NoCorpAct';
                    }
                ];
            };
        },
        {
            name: 'PriceType';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'Unknown';
                    },
                    {
                        name: 'Price';
                    },
                    {
                        name: 'TWAP';
                    },
                    {
                        name: 'Volatility';
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'AlreadySet';
            msg: 'Rules are already set';
        },
        {
            code: 6001;
            name: 'IncorrectPdaUsdcAccount';
            msg: 'Incorrect pda_usdc_account';
        },
        {
            code: 6002;
            name: 'IncorrectPythAccount';
            msg: 'Incorrect pyth account provided';
        },
        {
            code: 6003;
            name: 'IncorrectSellState';
            msg: 'Fund_state is provided instead of sell_state';
        },
        {
            code: 6004;
            name: 'IncorrectPdaTokenAccount';
            msg: 'Incorrect pda_token_account';
        },
        {
            code: 6005;
            name: 'UpdateCurrentWeights';
            msg: 'Current weights need to be updated';
        },
        {
            code: 6006;
            name: 'TimeHasntPassed';
            msg: "Enough time hasn't passed yet";
        },
        {
            code: 6007;
            name: 'InThreshold';
            msg: 'weight is in rebalance threshold';
        },
        {
            code: 6008;
            name: 'MoreThan20Assets';
            msg: 'Number of Assets must be less or equal to 20';
        },
        {
            code: 6009;
            name: 'ConstraintError';
            msg: 'Constraint error';
        },
        {
            code: 6010;
            name: 'NotActivelyManaged';
            msg: "Fund isn't actively managed";
        },
        {
            code: 6011;
            name: 'IncorrectSmfFeeAccount';
            msg: 'Incorrect smf_fee_account';
        },
        {
            code: 6012;
            name: 'ExpoRangeError';
            msg: 'Expo must be in [0;1] range';
        },
        {
            code: 6013;
            name: 'NoRefilterAndReweightForSellState';
            msg: "Refilter or Reweight shouldn't be called for sell_state";
        },
        {
            code: 6014;
            name: 'IncorrectRebalanceFeeAccount';
            msg: 'Incorrect rebalance_fee_account';
        },
        {
            code: 6015;
            name: 'TokenIsAlreadyBought';
            msg: 'Rebalance function already bought this token';
        },
        {
            code: 6016;
            name: 'FundStateMustBeUpdated';
            msg: 'Fund state must be updated';
        },
        {
            code: 6017;
            name: 'RuleWeightLimitError';
            msg: 'Rule weight is more than 1000';
        },
        {
            code: 6018;
            name: 'IntervalLimitsAreIncorrect';
            msg: 'Refilter, Reweight or Rebalance interval limits are incorrect';
        },
        {
            code: 6019;
            name: 'SlippageError';
            msg: 'Swap Exceeded FundState Rebalance Slippage';
        },
        {
            code: 6020;
            name: 'TokenIsntPresentInState';
            msg: 'Passed token is not present in buy_state';
        },
        {
            code: 6021;
            name: 'LessTokenInFund';
            msg: 'There are less free tokens Tokens in fund_state than buyer wants';
        },
        {
            code: 6022;
            name: 'UsdcIsntEnough';
            msg: 'USDC worth is less than token worth';
        },
        {
            code: 6023;
            name: 'ExceedsTargetWeight';
            msg: 'Token weight after swap exceeds target weight';
        },
        {
            code: 6024;
            name: 'FundWorthDecreasing';
            msg: 'Fund worth fill decrease after swap';
        },
        {
            code: 6025;
            name: 'SlippageExceeded';
            msg: 'Swap slippage exceeded';
        },
        {
            code: 6026;
            name: 'IncorrectManagerAccount';
            msg: 'manager_usdc_account doesnt belong to manager';
        },
        {
            code: 6027;
            name: 'WrongSigner';
            msg: 'Sell state rebalance should be executed by manager';
        },
        {
            code: 6028;
            name: 'ClaimTokens';
            msg: 'Only ClaimTokens function is available on this sellState';
        },
        {
            code: 6029;
            name: 'FilterOrWeightByError';
            msg: 'filter_by and weight_by should be in [0;3] range';
        },
        {
            code: 6030;
            name: 'FilterOrWeightDaysError';
            msg: 'filter_days and weight_days should be in [0;5] range';
        },
        {
            code: 6031;
            name: 'SortByError';
            msg: 'sort_by must be 0 or 1';
        },
        {
            code: 6032;
            name: 'IncorrectRefferalFeeAccount';
            msg: 'Incorrect refferal USDC account';
        },
        {
            code: 6033;
            name: 'IncorrectTokenAccount';
            msg: 'Incorrect Buyer Token account';
        },
        {
            code: 6034;
            name: 'TokenStatsShouldBeUpdated';
            msg: 'To call refilter/reweight function token stats must be updated';
        },
        {
            code: 6035;
            name: 'SellState';
            msg: 'Fund is a SellState';
        },
        {
            code: 6036;
            name: 'ProgramFreezed';
            msg: 'Program is freezed. Contact developer support.';
        },
        {
            code: 6037;
            name: 'TvlLimitReached';
            msg: 'TVL Limit reached as symmetry funds are in beta mode.';
        },
        {
            code: 6038;
            name: 'BuyLimit';
            msg: 'Max allowed contribution is limited to 5000 USDC';
        },
        {
            code: 6039;
            name: 'PythStatus';
            msg: 'Pyth status should be Trading';
        },
        {
            code: 6040;
            name: 'PythConfidence';
            msg: 'Pyth status should be Trading';
        },
        {
            code: 6041;
            name: 'PythNegativePrice';
            msg: 'Pyth price can not be negative';
        },
        {
            code: 6042;
            name: 'AssetPool';
            msg: "Asset Pool shouldn't contain repeating tokens and should contain USDC";
        },
        {
            code: 6043;
            name: 'InvalidInstructionData';
            msg: 'Invalid instruction data was provided';
        },
        {
            code: 6044;
            name: 'NotAssociatedTokenAccount';
            msg: 'Fee account is not associated';
        },
        {
            code: 6045;
            name: 'CouldNotSwap';
            msg: 'Could not swap enough amount';
        },
        {
            code: 6046;
            name: 'IncorrectTokenId';
            msg: 'Incorrect token Id';
        },
        {
            code: 6047;
            name: 'FixedRule';
            msg: 'Fixed rule should contain only 1 asset';
        },
        {
            code: 6048;
            name: 'FundIsActive';
            msg: 'Fund is still active';
        },
        {
            code: 6049;
            name: 'BuyStateIsBeingClaimed';
            msg: 'Buy state is being claimed';
        },
        {
            code: 6050;
            name: 'AssetPoolContainsOfflinePythToken';
            msg: 'Asset pool contains token with offline pyth status';
        }
    ];
};
export declare const IDL: FundsIDL;
