// src/index.ts
import { BN } from "@project-serum/anchor";
import { PublicKey as PublicKey14 } from "@solana/web3.js";
import pyth from "@pythnetwork/client";

// src/tokenFaucet.ts
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import {
  SYSVAR_RENT_PUBKEY,
  Transaction
} from "@solana/web3.js";

// src/idl/token_faucet.json
var token_faucet_default = {
  version: "0.1.0",
  name: "token_faucet",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "faucetConfig",
          isMut: true,
          isSigner: false
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "mintToUser",
      accounts: [
        {
          name: "faucetConfig",
          isMut: false,
          isSigner: false
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "transferMintAuthority",
      accounts: [
        {
          name: "faucetConfig",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: "FaucetConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "publicKey"
          },
          {
            name: "mint",
            type: "publicKey"
          },
          {
            name: "mintAuthority",
            type: "publicKey"
          },
          {
            name: "mintAuthorityNonce",
            type: "u8"
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6e3,
      name: "InvalidMintAccountAuthority",
      msg: "Program not mint authority"
    }
  ]
};

// src/tokenFaucet.ts
var TokenFaucet = class {
  constructor(connection, wallet, programId, mint, opts) {
    this.connection = connection;
    this.wallet = wallet;
    this.opts = opts || AnchorProvider.defaultOptions();
    const provider = new AnchorProvider(connection, wallet, this.opts);
    this.provider = provider;
    this.program = new Program(token_faucet_default, programId, provider);
    this.mint = mint;
  }
  async getFaucetConfigPublicKeyAndNonce() {
    return anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode("faucet_config")),
        this.mint.toBuffer()
      ],
      this.program.programId
    );
  }
  async getMintAuthority() {
    return (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode("mint_authority")),
        this.mint.toBuffer()
      ],
      this.program.programId
    ))[0];
  }
  async getFaucetConfigPublicKey() {
    return (await this.getFaucetConfigPublicKeyAndNonce())[0];
  }
  async initialize() {
    const [faucetConfigPublicKey] = await this.getFaucetConfigPublicKeyAndNonce();
    return await this.program.rpc.initialize({
      accounts: {
        faucetConfig: faucetConfigPublicKey,
        admin: this.wallet.publicKey,
        mintAccount: this.mint,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });
  }
  async fetchState() {
    return await this.program.account.faucetConfig.fetch(
      await this.getFaucetConfigPublicKey()
    );
  }
  async mintToUserIx(userTokenAccount, amount) {
    return this.program.instruction.mintToUser(amount, {
      accounts: {
        faucetConfig: await this.getFaucetConfigPublicKey(),
        mintAccount: this.mint,
        userTokenAccount,
        mintAuthority: await this.getMintAuthority(),
        tokenProgram: TOKEN_PROGRAM_ID
      }
    });
  }
  async mintToUser(userTokenAccount, amount) {
    const mintIx = await this.mintToUserIx(userTokenAccount, amount);
    const tx = new Transaction().add(mintIx);
    const txSig = await this.program.provider.sendAndConfirm(tx, [], this.opts);
    return txSig;
  }
  async transferMintAuthority() {
    return await this.program.rpc.transferMintAuthority({
      accounts: {
        faucetConfig: await this.getFaucetConfigPublicKey(),
        mintAccount: this.mint,
        mintAuthority: await this.getMintAuthority(),
        tokenProgram: TOKEN_PROGRAM_ID,
        admin: this.wallet.publicKey
      }
    });
  }
  async createAssociatedTokenAccountAndMintTo(userPublicKey, amount) {
    const tx = new Transaction();
    const [associatedTokenPublicKey, createAssociatedAccountIx, mintToTx] = await this.createAssociatedTokenAccountAndMintToInstructions(
      userPublicKey,
      amount
    );
    let associatedTokenAccountExists = false;
    try {
      const assosciatedTokenAccount = await this.connection.getAccountInfo(
        associatedTokenPublicKey
      );
      associatedTokenAccountExists = !!assosciatedTokenAccount;
    } catch (e) {
      associatedTokenAccountExists = false;
    }
    const skipAccountCreation = associatedTokenAccountExists;
    if (!skipAccountCreation)
      tx.add(createAssociatedAccountIx);
    tx.add(mintToTx);
    const txSig = await this.program.provider.sendAndConfirm(tx, [], this.opts);
    return [associatedTokenPublicKey, txSig];
  }
  async createAssociatedTokenAccountAndMintToInstructions(userPublicKey, amount) {
    const state = await this.fetchState();
    const associateTokenPublicKey = await this.getAssosciatedMockUSDMintAddress(
      { userPubKey: userPublicKey }
    );
    const createAssociatedAccountIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      state.mint,
      associateTokenPublicKey,
      userPublicKey,
      this.wallet.publicKey
    );
    const mintToIx = await this.mintToUserIx(associateTokenPublicKey, amount);
    return [associateTokenPublicKey, createAssociatedAccountIx, mintToIx];
  }
  async getAssosciatedMockUSDMintAddress(props) {
    const state = await this.fetchState();
    return Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      state.mint,
      props.userPubKey
    );
  }
  async getTokenAccountInfo(props) {
    const assosciatedKey = await this.getAssosciatedMockUSDMintAddress(props);
    const state = await this.fetchState();
    const token = new Token(
      this.connection,
      state.mint,
      TOKEN_PROGRAM_ID,
      this.provider.payer
    );
    return await token.getAccountInfo(assosciatedKey);
  }
  async subscribeToTokenAccount(props) {
    try {
      const tokenAccountKey = await this.getAssosciatedMockUSDMintAddress(
        props
      );
      props.callback(await this.getTokenAccountInfo(props));
      this.connection.onAccountChange(
        tokenAccountKey,
        async (_accountInfo) => {
          props.callback(await this.getTokenAccountInfo(props));
        }
      );
      return true;
    } catch (e) {
      return false;
    }
  }
};

// src/oracles/pythClient.ts
import { parsePriceData } from "@pythnetwork/client";
import { BN as BN2 } from "@project-serum/anchor";

// src/constants/numericConstants.ts
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
var ZERO = new BN(0);
var ONE = new BN(1);
var TWO = new BN(2);
var THREE = new BN(3);
var FOUR = new BN(4);
var FIVE = new BN(5);
var SIX = new BN(6);
var SEVEN = new BN(7);
var EIGHT = new BN(8);
var NINE = new BN(9);
var TEN = new BN(10);
var TEN_THOUSAND = new BN(1e4);
var BN_MAX = new BN(Number.MAX_SAFE_INTEGER);
var TEN_MILLION = TEN_THOUSAND.mul(TEN_THOUSAND);
var MAX_LEVERAGE = new BN(5);
var PERCENTAGE_PRECISION_EXP = new BN(6);
var PERCENTAGE_PRECISION = new BN(10).pow(PERCENTAGE_PRECISION_EXP);
var CONCENTRATION_PRECISION = PERCENTAGE_PRECISION;
var QUOTE_PRECISION_EXP = new BN(6);
var FUNDING_RATE_BUFFER_PRECISION_EXP = new BN(3);
var PRICE_PRECISION_EXP = new BN(6);
var FUNDING_RATE_PRECISION_EXP = PRICE_PRECISION_EXP.add(
  FUNDING_RATE_BUFFER_PRECISION_EXP
);
var PEG_PRECISION_EXP = new BN(6);
var AMM_RESERVE_PRECISION_EXP = new BN(9);
var SPOT_MARKET_RATE_PRECISION_EXP = new BN(6);
var SPOT_MARKET_RATE_PRECISION = new BN(10).pow(
  SPOT_MARKET_RATE_PRECISION_EXP
);
var SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION_EXP = new BN(10);
var SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION = new BN(10).pow(
  SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION_EXP
);
var SPOT_MARKET_UTILIZATION_PRECISION_EXP = new BN(6);
var SPOT_MARKET_UTILIZATION_PRECISION = new BN(10).pow(
  SPOT_MARKET_UTILIZATION_PRECISION_EXP
);
var SPOT_MARKET_WEIGHT_PRECISION = new BN(1e4);
var SPOT_MARKET_BALANCE_PRECISION_EXP = new BN(9);
var SPOT_MARKET_BALANCE_PRECISION = new BN(10).pow(
  SPOT_MARKET_BALANCE_PRECISION_EXP
);
var SPOT_MARKET_IMF_PRECISION_EXP = new BN(6);
var SPOT_MARKET_IMF_PRECISION = new BN(10).pow(
  SPOT_MARKET_IMF_PRECISION_EXP
);
var LIQUIDATION_FEE_PRECISION = new BN(1e6);
var QUOTE_PRECISION = new BN(10).pow(QUOTE_PRECISION_EXP);
var PRICE_PRECISION = new BN(10).pow(PRICE_PRECISION_EXP);
var FUNDING_RATE_PRECISION = new BN(10).pow(
  FUNDING_RATE_PRECISION_EXP
);
var FUNDING_RATE_BUFFER_PRECISION = new BN(10).pow(
  FUNDING_RATE_BUFFER_PRECISION_EXP
);
var PEG_PRECISION = new BN(10).pow(PEG_PRECISION_EXP);
var AMM_RESERVE_PRECISION = new BN(10).pow(AMM_RESERVE_PRECISION_EXP);
var BASE_PRECISION = AMM_RESERVE_PRECISION;
var BASE_PRECISION_EXP = AMM_RESERVE_PRECISION_EXP;
var AMM_TO_QUOTE_PRECISION_RATIO = AMM_RESERVE_PRECISION.div(QUOTE_PRECISION);
var PRICE_DIV_PEG = PRICE_PRECISION.div(PEG_PRECISION);
var PRICE_TO_QUOTE_PRECISION = PRICE_PRECISION.div(QUOTE_PRECISION);
var AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO = AMM_RESERVE_PRECISION.mul(PEG_PRECISION).div(QUOTE_PRECISION);
var MARGIN_PRECISION = TEN_THOUSAND;
var BID_ASK_SPREAD_PRECISION = new BN(1e6);
var LIQUIDATION_PCT_PRECISION = TEN_THOUSAND;
var ONE_YEAR = new BN(31536e3);
var QUOTE_SPOT_MARKET_INDEX = 0;
var LAMPORTS_PRECISION = new BN(LAMPORTS_PER_SOL);
var LAMPORTS_EXP = new BN(Math.log10(LAMPORTS_PER_SOL));
var OPEN_ORDER_MARGIN_REQUIREMENT = QUOTE_PRECISION.div(new BN(100));
var DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT = new BN(
  -25
).mul(QUOTE_PRECISION);

// src/oracles/pythClient.ts
var PythClient = class {
  constructor(connection) {
    this.connection = connection;
  }
  async getOraclePriceData(pricePublicKey) {
    const accountInfo = await this.connection.getAccountInfo(pricePublicKey);
    return this.getOraclePriceDataFromBuffer(accountInfo.data);
  }
  getOraclePriceDataFromBuffer(buffer) {
    const priceData = parsePriceData(buffer);
    return {
      price: convertPythPrice(priceData.aggregate.price, priceData.exponent),
      slot: new BN2(priceData.lastSlot.toString()),
      confidence: convertPythPrice(priceData.confidence, priceData.exponent),
      twap: convertPythPrice(priceData.twap.value, priceData.exponent),
      twapConfidence: convertPythPrice(
        priceData.twac.value,
        priceData.exponent
      ),
      hasSufficientNumberOfDataPoints: true
    };
  }
};
function convertPythPrice(price, exponent) {
  exponent = Math.abs(exponent);
  const pythPrecision = TEN.pow(new BN2(exponent).abs());
  return new BN2(price * Math.pow(10, exponent)).mul(PRICE_PRECISION).div(pythPrecision);
}

// src/oracles/switchboardClient.ts
import { Keypair, PublicKey as PublicKey2 } from "@solana/web3.js";
import { BN as BN3, Program as Program2, AnchorProvider as AnchorProvider2 } from "@project-serum/anchor";

// src/wallet.ts
var Wallet = class {
  constructor(payer) {
    this.payer = payer;
  }
  async signTransaction(tx) {
    tx.partialSign(this.payer);
    return tx;
  }
  async signAllTransactions(txs) {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }
  get publicKey() {
    return this.payer.publicKey;
  }
};

// src/idl/switchboard_v2.json
var switchboard_v2_default = {
  version: "0.1.0",
  name: "switchboard_v2",
  instructions: [
    {
      name: "vaultTransfer",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "to",
          isMut: true,
          isSigner: false
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "VaultTransferParams"
          }
        }
      ]
    },
    {
      name: "programInit",
      accounts: [
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenMint",
          isMut: true,
          isSigner: false
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "ProgramInitParams"
          }
        }
      ]
    },
    {
      name: "programConfig",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "ProgramConfigParams"
          }
        }
      ]
    },
    {
      name: "aggregatorInit",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false
        },
        {
          name: "queue",
          isMut: false,
          isSigner: false
        },
        {
          name: "authorWallet",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorInitParams"
          }
        }
      ]
    },
    {
      name: "aggregatorLock",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorLockParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetAuthority",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "newAuthority",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetAuthorityParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetBatchSize",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetBatchSizeParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetMinJobs",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetMinJobsParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetMinOracles",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetMinOraclesParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetVarianceThreshold",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetVarianceThresholdParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetHistoryBuffer",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "buffer",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetHistoryBufferParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSetQueue",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "queue",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSetQueueParams"
          }
        }
      ]
    },
    {
      name: "aggregatorAddJob",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "job",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorAddJobParams"
          }
        }
      ]
    },
    {
      name: "aggregatorRemoveJob",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "job",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorRemoveJobParams"
          }
        }
      ]
    },
    {
      name: "aggregatorOpenRound",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "lease",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: false
        },
        {
          name: "queueAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "permission",
          isMut: true,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "payoutWallet",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "dataBuffer",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorOpenRoundParams"
          }
        }
      ]
    },
    {
      name: "aggregatorSaveResult",
      accounts: [
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleAuthority",
          isMut: false,
          isSigner: true
        },
        {
          name: "oracleQueue",
          isMut: false,
          isSigner: false
        },
        {
          name: "queueAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "feedPermission",
          isMut: true,
          isSigner: false
        },
        {
          name: "oraclePermission",
          isMut: false,
          isSigner: false
        },
        {
          name: "lease",
          isMut: true,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "historyBuffer",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "AggregatorSaveResultParams"
          }
        }
      ]
    },
    {
      name: "jobInit",
      accounts: [
        {
          name: "job",
          isMut: true,
          isSigner: false
        },
        {
          name: "authorWallet",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "JobInitParams"
          }
        }
      ]
    },
    {
      name: "permissionInit",
      accounts: [
        {
          name: "permission",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false
        },
        {
          name: "granter",
          isMut: false,
          isSigner: false
        },
        {
          name: "grantee",
          isMut: false,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "PermissionInitParams"
          }
        }
      ]
    },
    {
      name: "permissionSet",
      accounts: [
        {
          name: "permission",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "PermissionSetParams"
          }
        }
      ]
    },
    {
      name: "oracleQueueInit",
      accounts: [
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: true
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false
        },
        {
          name: "buffer",
          isMut: true,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OracleQueueInitParams"
          }
        }
      ]
    },
    {
      name: "oracleQueueSetRewards",
      accounts: [
        {
          name: "queue",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OracleQueueSetRewardsParams"
          }
        }
      ]
    },
    {
      name: "oracleQueueVrfConfig",
      accounts: [
        {
          name: "queue",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OracleQueueSetVrfSettingsParams"
          }
        }
      ]
    },
    {
      name: "oracleInit",
      accounts: [
        {
          name: "oracle",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "wallet",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "queue",
          isMut: false,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OracleInitParams"
          }
        }
      ]
    },
    {
      name: "oracleHeartbeat",
      accounts: [
        {
          name: "oracle",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleAuthority",
          isMut: false,
          isSigner: true
        },
        {
          name: "tokenAccount",
          isMut: false,
          isSigner: false
        },
        {
          name: "gcOracle",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: false
        },
        {
          name: "permission",
          isMut: false,
          isSigner: false
        },
        {
          name: "dataBuffer",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OracleHeartbeatParams"
          }
        }
      ]
    },
    {
      name: "oracleWithdraw",
      accounts: [
        {
          name: "oracle",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleAuthority",
          isMut: false,
          isSigner: true
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "withdrawAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: false
        },
        {
          name: "permission",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OracleWithdrawParams"
          }
        }
      ]
    },
    {
      name: "leaseInit",
      accounts: [
        {
          name: "lease",
          isMut: true,
          isSigner: false
        },
        {
          name: "queue",
          isMut: true,
          isSigner: false
        },
        {
          name: "aggregator",
          isMut: false,
          isSigner: false
        },
        {
          name: "funder",
          isMut: true,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "LeaseInitParams"
          }
        }
      ]
    },
    {
      name: "leaseExtend",
      accounts: [
        {
          name: "lease",
          isMut: true,
          isSigner: false
        },
        {
          name: "aggregator",
          isMut: false,
          isSigner: false
        },
        {
          name: "queue",
          isMut: false,
          isSigner: false
        },
        {
          name: "funder",
          isMut: true,
          isSigner: false
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "LeaseExtendParams"
          }
        }
      ]
    },
    {
      name: "leaseWithdraw",
      accounts: [
        {
          name: "lease",
          isMut: true,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "aggregator",
          isMut: false,
          isSigner: false
        },
        {
          name: "queue",
          isMut: false,
          isSigner: false
        },
        {
          name: "withdrawAuthority",
          isMut: false,
          isSigner: true
        },
        {
          name: "withdrawAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "LeaseWithdrawParams"
          }
        }
      ]
    },
    {
      name: "crankInit",
      accounts: [
        {
          name: "crank",
          isMut: true,
          isSigner: true
        },
        {
          name: "queue",
          isMut: false,
          isSigner: false
        },
        {
          name: "buffer",
          isMut: true,
          isSigner: false
        },
        {
          name: "payer",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "CrankInitParams"
          }
        }
      ]
    },
    {
      name: "crankPush",
      accounts: [
        {
          name: "crank",
          isMut: true,
          isSigner: false
        },
        {
          name: "aggregator",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: false
        },
        {
          name: "queueAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "permission",
          isMut: false,
          isSigner: false
        },
        {
          name: "lease",
          isMut: true,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "dataBuffer",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "CrankPushParams"
          }
        }
      ]
    },
    {
      name: "crankPop",
      accounts: [
        {
          name: "crank",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: false
        },
        {
          name: "queueAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "payoutWallet",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "crankDataBuffer",
          isMut: true,
          isSigner: false
        },
        {
          name: "queueDataBuffer",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "CrankPopParams"
          }
        }
      ]
    },
    {
      name: "vrfInit",
      accounts: [
        {
          name: "vrf",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: false,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "VrfInitParams"
          }
        }
      ]
    },
    {
      name: "vrfRequestRandomness",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "vrf",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracleQueue",
          isMut: true,
          isSigner: false
        },
        {
          name: "queueAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "dataBuffer",
          isMut: false,
          isSigner: false
        },
        {
          name: "permission",
          isMut: true,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "payerWallet",
          isMut: true,
          isSigner: false
        },
        {
          name: "payerAuthority",
          isMut: false,
          isSigner: true
        },
        {
          name: "recentBlockhashes",
          isMut: false,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "VrfRequestRandomnessParams"
          }
        }
      ]
    },
    {
      name: "vrfProve",
      accounts: [
        {
          name: "vrf",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "randomnessProducer",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "VrfProveParams"
          }
        }
      ]
    },
    {
      name: "vrfProveAndVerify",
      accounts: [
        {
          name: "vrf",
          isMut: true,
          isSigner: false
        },
        {
          name: "callbackPid",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "oracleAuthority",
          isMut: false,
          isSigner: true
        },
        {
          name: "oracleWallet",
          isMut: true,
          isSigner: false
        },
        {
          name: "instructionsSysvar",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "VrfProveAndVerifyParams"
          }
        }
      ]
    },
    {
      name: "vrfVerify",
      accounts: [
        {
          name: "vrf",
          isMut: true,
          isSigner: false
        },
        {
          name: "callbackPid",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "escrow",
          isMut: true,
          isSigner: false
        },
        {
          name: "programState",
          isMut: false,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "oracleAuthority",
          isMut: false,
          isSigner: false
        },
        {
          name: "oracleWallet",
          isMut: true,
          isSigner: false
        },
        {
          name: "instructionsSysvar",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "VrfVerifyParams"
          }
        }
      ]
    }
  ],
  accounts: [
    {
      name: "SbState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "tokenMint",
            type: "publicKey"
          },
          {
            name: "tokenVault",
            type: "publicKey"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                1024
              ]
            }
          }
        ]
      }
    },
    {
      name: "AggregatorAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                128
              ]
            }
          },
          {
            name: "authorWallet",
            type: "publicKey"
          },
          {
            name: "queuePubkey",
            type: "publicKey"
          },
          {
            name: "oracleRequestBatchSize",
            type: "u32"
          },
          {
            name: "minOracleResults",
            type: "u32"
          },
          {
            name: "minJobResults",
            type: "u32"
          },
          {
            name: "minUpdateDelaySeconds",
            type: "u32"
          },
          {
            name: "startAfter",
            type: "i64"
          },
          {
            name: "varianceThreshold",
            type: {
              defined: "SwitchboardDecimal"
            }
          },
          {
            name: "forceReportPeriod",
            type: "i64"
          },
          {
            name: "expiration",
            type: "i64"
          },
          {
            name: "consecutiveFailureCount",
            type: "u64"
          },
          {
            name: "nextAllowedUpdateTime",
            type: "i64"
          },
          {
            name: "isLocked",
            type: "bool"
          },
          {
            name: "crankPubkey",
            type: "publicKey"
          },
          {
            name: "latestConfirmedRound",
            type: {
              defined: "AggregatorRound"
            }
          },
          {
            name: "currentRound",
            type: {
              defined: "AggregatorRound"
            }
          },
          {
            name: "jobPubkeysData",
            type: {
              array: [
                "publicKey",
                16
              ]
            }
          },
          {
            name: "jobHashes",
            type: {
              array: [
                {
                  defined: "Hash"
                },
                16
              ]
            }
          },
          {
            name: "jobPubkeysSize",
            type: "u32"
          },
          {
            name: "jobsChecksum",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "historyBuffer",
            type: "publicKey"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                192
              ]
            }
          }
        ]
      }
    },
    {
      name: "PermissionAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "permissions",
            type: "u32"
          },
          {
            name: "granter",
            type: "publicKey"
          },
          {
            name: "grantee",
            type: "publicKey"
          },
          {
            name: "expiration",
            type: "i64"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      name: "LeaseAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "escrow",
            type: "publicKey"
          },
          {
            name: "queue",
            type: "publicKey"
          },
          {
            name: "aggregator",
            type: "publicKey"
          },
          {
            name: "tokenProgram",
            type: "publicKey"
          },
          {
            name: "isActive",
            type: "bool"
          },
          {
            name: "crankRowCount",
            type: "u32"
          },
          {
            name: "createdAt",
            type: "i64"
          },
          {
            name: "updateCount",
            type: "u128"
          },
          {
            name: "withdrawAuthority",
            type: "publicKey"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      name: "OracleQueueAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                64
              ]
            }
          },
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "oracleTimeout",
            type: "u32"
          },
          {
            name: "reward",
            type: "u64"
          },
          {
            name: "minStake",
            type: "u64"
          },
          {
            name: "slashingEnabled",
            type: "bool"
          },
          {
            name: "varianceToleranceMultiplier",
            type: {
              defined: "SwitchboardDecimal"
            }
          },
          {
            name: "feedProbationPeriod",
            type: "u32"
          },
          {
            name: "currIdx",
            type: "u32"
          },
          {
            name: "size",
            type: "u32"
          },
          {
            name: "gcIdx",
            type: "u32"
          },
          {
            name: "consecutiveFeedFailureLimit",
            type: "u64"
          },
          {
            name: "consecutiveOracleFailureLimit",
            type: "u64"
          },
          {
            name: "unpermissionedFeedsEnabled",
            type: "bool"
          },
          {
            name: "unpermissionedVrfEnabled",
            type: "bool"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                1022
              ]
            }
          },
          {
            name: "maxSize",
            type: "u32"
          },
          {
            name: "dataBuffer",
            type: "publicKey"
          }
        ]
      }
    },
    {
      name: "CrankAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                64
              ]
            }
          },
          {
            name: "queuePubkey",
            type: "publicKey"
          },
          {
            name: "pqSize",
            type: "u32"
          },
          {
            name: "maxRows",
            type: "u32"
          },
          {
            name: "jitterModifier",
            type: "u8"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                255
              ]
            }
          },
          {
            name: "dataBuffer",
            type: "publicKey"
          }
        ]
      }
    },
    {
      name: "OracleAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                128
              ]
            }
          },
          {
            name: "oracleAuthority",
            type: "publicKey"
          },
          {
            name: "lastHeartbeat",
            type: "i64"
          },
          {
            name: "numInUse",
            type: "u32"
          },
          {
            name: "tokenAccount",
            type: "publicKey"
          },
          {
            name: "queuePubkey",
            type: "publicKey"
          },
          {
            name: "metrics",
            type: {
              defined: "OracleMetrics"
            }
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      name: "JobAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                64
              ]
            }
          },
          {
            name: "authorWallet",
            type: "publicKey"
          },
          {
            name: "expiration",
            type: "i64"
          },
          {
            name: "hash",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "data",
            type: "bytes"
          },
          {
            name: "referenceCount",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "VrfAccountData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "status",
            type: {
              defined: "VrfStatus"
            }
          },
          {
            name: "counter",
            type: "u128"
          },
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "oracleQueue",
            type: "publicKey"
          },
          {
            name: "escrow",
            type: "publicKey"
          },
          {
            name: "callback",
            type: {
              defined: "CallbackZC"
            }
          },
          {
            name: "batchSize",
            type: "u32"
          },
          {
            name: "builders",
            type: {
              array: [
                {
                  defined: "VrfBuilder"
                },
                8
              ]
            }
          },
          {
            name: "buildersLen",
            type: "u32"
          },
          {
            name: "testMode",
            type: "bool"
          },
          {
            name: "currentRound",
            type: {
              defined: "VrfRound"
            }
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                1024
              ]
            }
          }
        ]
      }
    }
  ],
  types: [
    {
      name: "AggregatorAddJobParams",
      type: {
        kind: "struct",
        fields: []
      }
    },
    {
      name: "AggregatorInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                128
              ]
            }
          },
          {
            name: "batchSize",
            type: "u32"
          },
          {
            name: "minOracleResults",
            type: "u32"
          },
          {
            name: "minJobResults",
            type: "u32"
          },
          {
            name: "minUpdateDelaySeconds",
            type: "u32"
          },
          {
            name: "startAfter",
            type: "i64"
          },
          {
            name: "varianceThreshold",
            type: {
              defined: "BorshDecimal"
            }
          },
          {
            name: "forceReportPeriod",
            type: "i64"
          },
          {
            name: "expiration",
            type: "i64"
          },
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "AggregatorLockParams",
      type: {
        kind: "struct",
        fields: []
      }
    },
    {
      name: "AggregatorOpenRoundParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "leaseBump",
            type: "u8"
          },
          {
            name: "permissionBump",
            type: "u8"
          },
          {
            name: "jitter",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "AggregatorRemoveJobParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "jobIdx",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "AggregatorSaveResultParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "oracleIdx",
            type: "u32"
          },
          {
            name: "error",
            type: "bool"
          },
          {
            name: "value",
            type: {
              defined: "BorshDecimal"
            }
          },
          {
            name: "jobsChecksum",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "minResponse",
            type: {
              defined: "BorshDecimal"
            }
          },
          {
            name: "maxResponse",
            type: {
              defined: "BorshDecimal"
            }
          },
          {
            name: "feedPermissionBump",
            type: "u8"
          },
          {
            name: "oraclePermissionBump",
            type: "u8"
          },
          {
            name: "leaseBump",
            type: "u8"
          },
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "AggregatorSetAuthorityParams",
      type: {
        kind: "struct",
        fields: []
      }
    },
    {
      name: "AggregatorSetBatchSizeParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "batchSize",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "AggregatorSetHistoryBufferParams",
      type: {
        kind: "struct",
        fields: []
      }
    },
    {
      name: "AggregatorSetMinJobsParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "minJobResults",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "AggregatorSetMinOraclesParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "minOracleResults",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "AggregatorSetQueueParams",
      type: {
        kind: "struct",
        fields: []
      }
    },
    {
      name: "AggregatorSetVarianceThresholdParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "varianceThreshold",
            type: {
              defined: "BorshDecimal"
            }
          }
        ]
      }
    },
    {
      name: "CrankInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "bytes"
          },
          {
            name: "metadata",
            type: "bytes"
          },
          {
            name: "crankSize",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "CrankPopParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "leaseBumps",
            type: "bytes"
          },
          {
            name: "permissionBumps",
            type: "bytes"
          },
          {
            name: "nonce",
            type: {
              option: "u32"
            }
          },
          {
            name: "failOpenOnAccountMismatch",
            type: {
              option: "bool"
            }
          }
        ]
      }
    },
    {
      name: "CrankPushParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "permissionBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "JobInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "expiration",
            type: "i64"
          },
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "data",
            type: "bytes"
          }
        ]
      }
    },
    {
      name: "LeaseExtendParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "loadAmount",
            type: "u64"
          },
          {
            name: "leaseBump",
            type: "u8"
          },
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "LeaseInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "loadAmount",
            type: "u64"
          },
          {
            name: "withdrawAuthority",
            type: "publicKey"
          },
          {
            name: "leaseBump",
            type: "u8"
          },
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "LeaseWithdrawParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "leaseBump",
            type: "u8"
          },
          {
            name: "amount",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "OracleHeartbeatParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "permissionBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "OracleInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "bytes"
          },
          {
            name: "metadata",
            type: "bytes"
          },
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "oracleBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "OracleQueueInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "metadata",
            type: {
              array: [
                "u8",
                64
              ]
            }
          },
          {
            name: "reward",
            type: "u64"
          },
          {
            name: "minStake",
            type: "u64"
          },
          {
            name: "feedProbationPeriod",
            type: "u32"
          },
          {
            name: "oracleTimeout",
            type: "u32"
          },
          {
            name: "slashingEnabled",
            type: "bool"
          },
          {
            name: "varianceToleranceMultiplier",
            type: {
              defined: "BorshDecimal"
            }
          },
          {
            name: "consecutiveFeedFailureLimit",
            type: "u64"
          },
          {
            name: "consecutiveOracleFailureLimit",
            type: "u64"
          },
          {
            name: "queueSize",
            type: "u32"
          },
          {
            name: "unpermissionedFeeds",
            type: "bool"
          },
          {
            name: "unpermissionedVrf",
            type: "bool"
          }
        ]
      }
    },
    {
      name: "OracleQueueSetRewardsParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "rewards",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "OracleQueueSetVrfSettingsParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "unpermissionedVrfEnabled",
            type: "bool"
          }
        ]
      }
    },
    {
      name: "OracleWithdrawParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "permissionBump",
            type: "u8"
          },
          {
            name: "amount",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "PermissionInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "permissionBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "PermissionSetParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "permission",
            type: {
              defined: "SwitchboardPermission"
            }
          },
          {
            name: "enable",
            type: "bool"
          }
        ]
      }
    },
    {
      name: "ProgramConfigParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "token",
            type: "publicKey"
          },
          {
            name: "bump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "ProgramInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "VaultTransferParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "amount",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "VrfInitParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "callback",
            type: {
              defined: "Callback"
            }
          },
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "VrfProveParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "proof",
            type: "bytes"
          },
          {
            name: "idx",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "VrfProveAndVerifyParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: {
              option: "u32"
            }
          },
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "idx",
            type: "u32"
          },
          {
            name: "proof",
            type: "bytes"
          }
        ]
      }
    },
    {
      name: "VrfRequestRandomnessParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "permissionBump",
            type: "u8"
          },
          {
            name: "stateBump",
            type: "u8"
          }
        ]
      }
    },
    {
      name: "VrfVerifyParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: {
              option: "u32"
            }
          },
          {
            name: "stateBump",
            type: "u8"
          },
          {
            name: "idx",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "Hash",
      type: {
        kind: "struct",
        fields: [
          {
            name: "data",
            type: {
              array: [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      name: "AggregatorRound",
      type: {
        kind: "struct",
        fields: [
          {
            name: "numSuccess",
            type: "u32"
          },
          {
            name: "numError",
            type: "u32"
          },
          {
            name: "isClosed",
            type: "bool"
          },
          {
            name: "roundOpenSlot",
            type: "u64"
          },
          {
            name: "roundOpenTimestamp",
            type: "i64"
          },
          {
            name: "result",
            type: {
              defined: "SwitchboardDecimal"
            }
          },
          {
            name: "stdDeviation",
            type: {
              defined: "SwitchboardDecimal"
            }
          },
          {
            name: "minResponse",
            type: {
              defined: "SwitchboardDecimal"
            }
          },
          {
            name: "maxResponse",
            type: {
              defined: "SwitchboardDecimal"
            }
          },
          {
            name: "oraclePubkeysData",
            type: {
              array: [
                "publicKey",
                16
              ]
            }
          },
          {
            name: "mediansData",
            type: {
              array: [
                {
                  defined: "SwitchboardDecimal"
                },
                16
              ]
            }
          },
          {
            name: "currentPayout",
            type: {
              array: [
                "i64",
                16
              ]
            }
          },
          {
            name: "mediansFulfilled",
            type: {
              array: [
                "bool",
                16
              ]
            }
          },
          {
            name: "errorsFulfilled",
            type: {
              array: [
                "bool",
                16
              ]
            }
          }
        ]
      }
    },
    {
      name: "AggregatorHistoryRow",
      type: {
        kind: "struct",
        fields: [
          {
            name: "timestamp",
            type: "i64"
          },
          {
            name: "value",
            type: {
              defined: "SwitchboardDecimal"
            }
          }
        ]
      }
    },
    {
      name: "SwitchboardDecimal",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mantissa",
            type: "i128"
          },
          {
            name: "scale",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "CrankRow",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pubkey",
            type: "publicKey"
          },
          {
            name: "nextTimestamp",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "OracleMetrics",
      type: {
        kind: "struct",
        fields: [
          {
            name: "consecutiveSuccess",
            type: "u64"
          },
          {
            name: "consecutiveError",
            type: "u64"
          },
          {
            name: "consecutiveDisagreement",
            type: "u64"
          },
          {
            name: "consecutiveLateResponse",
            type: "u64"
          },
          {
            name: "consecutiveFailure",
            type: "u64"
          },
          {
            name: "totalSuccess",
            type: "u128"
          },
          {
            name: "totalError",
            type: "u128"
          },
          {
            name: "totalDisagreement",
            type: "u128"
          },
          {
            name: "totalLateResponse",
            type: "u128"
          }
        ]
      }
    },
    {
      name: "BorshDecimal",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mantissa",
            type: "i128"
          },
          {
            name: "scale",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "EcvrfProofZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "gamma",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "c",
            type: {
              defined: "Scalar"
            }
          },
          {
            name: "s",
            type: {
              defined: "Scalar"
            }
          }
        ]
      }
    },
    {
      name: "Scalar",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bytes",
            type: {
              array: [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      name: "FieldElementZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bytes",
            type: {
              array: [
                "u64",
                5
              ]
            }
          }
        ]
      }
    },
    {
      name: "CompletedPointZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "x",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "y",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "z",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "t",
            type: {
              defined: "FieldElementZC"
            }
          }
        ]
      }
    },
    {
      name: "EdwardsPointZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "x",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "y",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "z",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "t",
            type: {
              defined: "FieldElementZC"
            }
          }
        ]
      }
    },
    {
      name: "ProjectivePointZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "x",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "y",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "z",
            type: {
              defined: "FieldElementZC"
            }
          }
        ]
      }
    },
    {
      name: "EcvrfIntermediate",
      type: {
        kind: "struct",
        fields: [
          {
            name: "r",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "nS",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "d",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "t13",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "t15",
            type: {
              defined: "FieldElementZC"
            }
          }
        ]
      }
    },
    {
      name: "VrfBuilder",
      type: {
        kind: "struct",
        fields: [
          {
            name: "producer",
            type: "publicKey"
          },
          {
            name: "status",
            type: {
              defined: "VrfStatus"
            }
          },
          {
            name: "reprProof",
            type: {
              array: [
                "u8",
                80
              ]
            }
          },
          {
            name: "proof",
            type: {
              defined: "EcvrfProofZC"
            }
          },
          {
            name: "yPoint",
            type: "publicKey"
          },
          {
            name: "stage",
            type: "u32"
          },
          {
            name: "stage1Out",
            type: {
              defined: "EcvrfIntermediate"
            }
          },
          {
            name: "r1",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "r2",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "stage3Out",
            type: {
              defined: "EcvrfIntermediate"
            }
          },
          {
            name: "hPoint",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "sReduced",
            type: {
              defined: "Scalar"
            }
          },
          {
            name: "yPointBuilder",
            type: {
              array: [
                {
                  defined: "FieldElementZC"
                },
                3
              ]
            }
          },
          {
            name: "yRistrettoPoint",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "mulRound",
            type: "u8"
          },
          {
            name: "hashPointsRound",
            type: "u8"
          },
          {
            name: "mulTmp1",
            type: {
              defined: "CompletedPointZC"
            }
          },
          {
            name: "uPoint1",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "uPoint2",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "vPoint1",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "vPoint2",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "uPoint",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "vPoint",
            type: {
              defined: "EdwardsPointZC"
            }
          },
          {
            name: "u1",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "u2",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "invertee",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "y",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "z",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "p1Bytes",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "p2Bytes",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "p3Bytes",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "p4Bytes",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "cPrimeHashbuf",
            type: {
              array: [
                "u8",
                16
              ]
            }
          },
          {
            name: "m1",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "m2",
            type: {
              defined: "FieldElementZC"
            }
          },
          {
            name: "txRemaining",
            type: "u32"
          },
          {
            name: "verified",
            type: "bool"
          },
          {
            name: "result",
            type: {
              array: [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      name: "AccountMetaZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pubkey",
            type: "publicKey"
          },
          {
            name: "isSigner",
            type: "bool"
          },
          {
            name: "isWritable",
            type: "bool"
          }
        ]
      }
    },
    {
      name: "AccountMetaBorsh",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pubkey",
            type: "publicKey"
          },
          {
            name: "isSigner",
            type: "bool"
          },
          {
            name: "isWritable",
            type: "bool"
          }
        ]
      }
    },
    {
      name: "CallbackZC",
      type: {
        kind: "struct",
        fields: [
          {
            name: "programId",
            type: "publicKey"
          },
          {
            name: "accounts",
            type: {
              array: [
                {
                  defined: "AccountMetaZC"
                },
                32
              ]
            }
          },
          {
            name: "accountsLen",
            type: "u32"
          },
          {
            name: "ixData",
            type: {
              array: [
                "u8",
                1024
              ]
            }
          },
          {
            name: "ixDataLen",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "Callback",
      type: {
        kind: "struct",
        fields: [
          {
            name: "programId",
            type: "publicKey"
          },
          {
            name: "accounts",
            type: {
              vec: {
                defined: "AccountMetaBorsh"
              }
            }
          },
          {
            name: "ixData",
            type: "bytes"
          }
        ]
      }
    },
    {
      name: "VrfRound",
      type: {
        kind: "struct",
        fields: [
          {
            name: "alpha",
            type: {
              array: [
                "u8",
                256
              ]
            }
          },
          {
            name: "alphaLen",
            type: "u32"
          },
          {
            name: "requestSlot",
            type: "u64"
          },
          {
            name: "requestTimestamp",
            type: "i64"
          },
          {
            name: "result",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "numVerified",
            type: "u32"
          },
          {
            name: "ebuf",
            type: {
              array: [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      name: "Lanes",
      type: {
        kind: "enum",
        variants: [
          {
            name: "C"
          },
          {
            name: "D"
          },
          {
            name: "AB"
          },
          {
            name: "AC"
          },
          {
            name: "CD"
          },
          {
            name: "AD"
          },
          {
            name: "BC"
          },
          {
            name: "ABCD"
          }
        ]
      }
    },
    {
      name: "Shuffle",
      type: {
        kind: "enum",
        variants: [
          {
            name: "AAAA"
          },
          {
            name: "BBBB"
          },
          {
            name: "CACA"
          },
          {
            name: "DBBD"
          },
          {
            name: "ADDA"
          },
          {
            name: "CBCB"
          },
          {
            name: "ABAB"
          },
          {
            name: "BADC"
          },
          {
            name: "BACD"
          },
          {
            name: "ABDC"
          }
        ]
      }
    },
    {
      name: "Shuffle",
      type: {
        kind: "enum",
        variants: [
          {
            name: "AAAA"
          },
          {
            name: "BBBB"
          },
          {
            name: "BADC"
          },
          {
            name: "BACD"
          },
          {
            name: "ADDA"
          },
          {
            name: "CBCB"
          },
          {
            name: "ABDC"
          },
          {
            name: "ABAB"
          },
          {
            name: "DBBD"
          },
          {
            name: "CACA"
          }
        ]
      }
    },
    {
      name: "Lanes",
      type: {
        kind: "enum",
        variants: [
          {
            name: "D"
          },
          {
            name: "C"
          },
          {
            name: "AB"
          },
          {
            name: "AC"
          },
          {
            name: "AD"
          },
          {
            name: "BCD"
          }
        ]
      }
    },
    {
      name: "Error",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InvalidPublicKey"
          },
          {
            name: "SerializationError",
            fields: [
              {
                defined: "bincode::Error"
              }
            ]
          },
          {
            name: "DeserializationError",
            fields: [
              {
                defined: "bincode::Error"
              }
            ]
          },
          {
            name: "InvalidDataError"
          }
        ]
      }
    },
    {
      name: "SwitchboardPermission",
      type: {
        kind: "enum",
        variants: [
          {
            name: "PermitOracleHeartbeat"
          },
          {
            name: "PermitOracleQueueUsage"
          },
          {
            name: "PermitVrfRequests"
          }
        ]
      }
    },
    {
      name: "OracleResponseType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "TypeSuccess"
          },
          {
            name: "TypeError"
          },
          {
            name: "TypeDisagreement"
          },
          {
            name: "TypeNoResponse"
          }
        ]
      }
    },
    {
      name: "VrfStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "StatusNone"
          },
          {
            name: "StatusRequesting"
          },
          {
            name: "StatusVerifying"
          },
          {
            name: "StatusVerified"
          },
          {
            name: "StatusCallbackSuccess"
          },
          {
            name: "StatusVerifyFailure"
          }
        ]
      }
    }
  ],
  events: [
    {
      name: "AggregatorInitEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "VrfRequestRandomnessEvent",
      fields: [
        {
          name: "vrfPubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "oraclePubkeys",
          type: {
            vec: "publicKey"
          },
          index: false
        },
        {
          name: "loadAmount",
          type: "u64",
          index: false
        },
        {
          name: "existingAmount",
          type: "u64",
          index: false
        }
      ]
    },
    {
      name: "VrfRequestEvent",
      fields: [
        {
          name: "vrfPubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "oraclePubkeys",
          type: {
            vec: "publicKey"
          },
          index: false
        }
      ]
    },
    {
      name: "VrfProveEvent",
      fields: [
        {
          name: "vrfPubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "authorityPubkey",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "VrfVerifyEvent",
      fields: [
        {
          name: "vrfPubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "authorityPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        }
      ]
    },
    {
      name: "VrfCallbackPerformedEvent",
      fields: [
        {
          name: "vrfPubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: true
        },
        {
          name: "amount",
          type: "u64",
          index: false
        }
      ]
    },
    {
      name: "AggregatorOpenRoundEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "oraclePubkeys",
          type: {
            vec: "publicKey"
          },
          index: false
        },
        {
          name: "jobPubkeys",
          type: {
            vec: "publicKey"
          },
          index: false
        },
        {
          name: "remainingFunds",
          type: "u64",
          index: false
        },
        {
          name: "queueAuthority",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "AggregatorValueUpdateEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "value",
          type: {
            defined: "BorshDecimal"
          },
          index: false
        },
        {
          name: "slot",
          type: "u64",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        },
        {
          name: "oraclePubkeys",
          type: {
            vec: "publicKey"
          },
          index: false
        },
        {
          name: "oracleValues",
          type: {
            vec: {
              defined: "BorshDecimal"
            }
          },
          index: false
        }
      ]
    },
    {
      name: "OracleRewardEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "leasePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "walletPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        },
        {
          name: "roundSlot",
          type: "u64",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "OracleWithdrawEvent",
      fields: [
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "walletPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "destinationWallet",
          type: "publicKey",
          index: false
        },
        {
          name: "previousAmount",
          type: "u64",
          index: false
        },
        {
          name: "newAmount",
          type: "u64",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "LeaseWithdrawEvent",
      fields: [
        {
          name: "leasePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "walletPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "previousAmount",
          type: "u64",
          index: false
        },
        {
          name: "newAmount",
          type: "u64",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "OracleSlashEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "leasePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "walletPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        },
        {
          name: "roundSlot",
          type: "u64",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "LeaseFundEvent",
      fields: [
        {
          name: "leasePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "funder",
          type: "publicKey",
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "ProbationBrokenEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "queuePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "FeedPermissionRevokedEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "timestamp",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "GarbageCollectFailureEvent",
      fields: [
        {
          name: "queuePubkey",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "OracleBootedEvent",
      fields: [
        {
          name: "queuePubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "oraclePubkey",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "CrankLeaseInsufficientFundsEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "leasePubkey",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "CrankPopExpectedFailureEvent",
      fields: [
        {
          name: "feedPubkey",
          type: "publicKey",
          index: false
        },
        {
          name: "leasePubkey",
          type: "publicKey",
          index: false
        }
      ]
    }
  ],
  errors: [
    {
      code: 6e3,
      name: "ArrayOperationError",
      msg: "Illegal operation on a Switchboard array."
    },
    {
      code: 6001,
      name: "QueueOperationError",
      msg: "Illegal operation on a Switchboard queue."
    },
    {
      code: 6002,
      name: "IncorrectProgramOwnerError",
      msg: "An account required to be owned by the program has a different owner."
    },
    {
      code: 6003,
      name: "InvalidAggregatorRound",
      msg: "Aggregator is not currently populated with a valid round."
    },
    {
      code: 6004,
      name: "TooManyAggregatorJobs",
      msg: "Aggregator cannot fit any more jobs."
    },
    {
      code: 6005,
      name: "AggregatorCurrentRoundClosed",
      msg: "Aggregator's current round is closed. No results are being accepted."
    },
    {
      code: 6006,
      name: "AggregatorInvalidSaveResult",
      msg: "Aggregator received an invalid save result instruction."
    },
    {
      code: 6007,
      name: "InvalidStrDecimalConversion",
      msg: "Failed to convert string to decimal format."
    },
    {
      code: 6008,
      name: "AccountLoaderMissingSignature",
      msg: "AccountLoader account is missing a required signature."
    },
    {
      code: 6009,
      name: "MissingRequiredSignature",
      msg: "Account is missing a required signature."
    },
    {
      code: 6010,
      name: "ArrayOverflowError",
      msg: "The attempted action will overflow a zero-copy account array."
    },
    {
      code: 6011,
      name: "ArrayUnderflowError",
      msg: "The attempted action will underflow a zero-copy account array."
    },
    {
      code: 6012,
      name: "PubkeyNotFoundError",
      msg: "The queried public key was not found."
    },
    {
      code: 6013,
      name: "AggregatorIllegalRoundOpenCall",
      msg: "Aggregator round open called too early."
    },
    {
      code: 6014,
      name: "AggregatorIllegalRoundCloseCall",
      msg: "Aggregator round close called too early."
    },
    {
      code: 6015,
      name: "AggregatorClosedError",
      msg: "Aggregator is closed. Illegal action."
    },
    {
      code: 6016,
      name: "IllegalOracleIdxError",
      msg: "Illegal oracle index."
    },
    {
      code: 6017,
      name: "OracleAlreadyRespondedError",
      msg: "The provided oracle has already responded this round."
    },
    {
      code: 6018,
      name: "ProtoDeserializeError",
      msg: "Failed to deserialize protocol buffer."
    },
    {
      code: 6019,
      name: "UnauthorizedStateUpdateError",
      msg: "Unauthorized program state modification attempted."
    },
    {
      code: 6020,
      name: "MissingOracleAccountsError",
      msg: "Not enough oracle accounts provided to closeRounds."
    },
    {
      code: 6021,
      name: "OracleMismatchError",
      msg: "An unexpected oracle account was provided for the transaction."
    },
    {
      code: 6022,
      name: "CrankMaxCapacityError",
      msg: "Attempted to push to a Crank that's at capacity"
    },
    {
      code: 6023,
      name: "AggregatorLeaseInsufficientFunds",
      msg: "Aggregator update call attempted but attached lease has insufficient funds."
    },
    {
      code: 6024,
      name: "IncorrectTokenAccountMint",
      msg: "The provided token account does not point to the Switchboard token mint."
    },
    {
      code: 6025,
      name: "InvalidEscrowAccount",
      msg: "An invalid escrow account was provided."
    },
    {
      code: 6026,
      name: "CrankEmptyError",
      msg: "Crank empty. Pop failed."
    },
    {
      code: 6027,
      name: "PdaDeriveError",
      msg: "Failed to derive a PDA from the provided seed."
    },
    {
      code: 6028,
      name: "AggregatorAccountNotFound",
      msg: "Aggregator account missing from provided account list."
    },
    {
      code: 6029,
      name: "PermissionAccountNotFound",
      msg: "Permission account missing from provided account list."
    },
    {
      code: 6030,
      name: "LeaseAccountDeriveFailure",
      msg: "Failed to derive a lease account."
    },
    {
      code: 6031,
      name: "PermissionAccountDeriveFailure",
      msg: "Failed to derive a permission account."
    },
    {
      code: 6032,
      name: "EscrowAccountNotFound",
      msg: "Escrow account missing from provided account list."
    },
    {
      code: 6033,
      name: "LeaseAccountNotFound",
      msg: "Lease account missing from provided account list."
    },
    {
      code: 6034,
      name: "DecimalConversionError",
      msg: "Decimal conversion method failed."
    },
    {
      code: 6035,
      name: "PermissionDenied",
      msg: "Permission account is missing required flags for the given action."
    },
    {
      code: 6036,
      name: "QueueAtCapacity",
      msg: "Oracle queue is at lease capacity."
    },
    {
      code: 6037,
      name: "ExcessiveCrankRowsError",
      msg: "Data feed is already pushed on a crank."
    },
    {
      code: 6038,
      name: "AggregatorLockedError",
      msg: "Aggregator is locked, no setting modifications or job additions allowed."
    },
    {
      code: 6039,
      name: "AggregatorInvalidBatchSizeError",
      msg: "Aggregator invalid batch size."
    },
    {
      code: 6040,
      name: "AggregatorJobChecksumMismatch",
      msg: "Oracle provided an incorrect aggregator job checksum."
    },
    {
      code: 6041,
      name: "IntegerOverflowError",
      msg: "An integer overflow occurred."
    },
    {
      code: 6042,
      name: "InvalidUpdatePeriodError",
      msg: "Minimum update period is 5 seconds."
    },
    {
      code: 6043,
      name: "NoResultsError",
      msg: "Aggregator round evaluation attempted with no results."
    },
    {
      code: 6044,
      name: "InvalidExpirationError",
      msg: "An expiration constraint was broken."
    },
    {
      code: 6045,
      name: "InsufficientStakeError",
      msg: "An account provided insufficient stake for action."
    },
    {
      code: 6046,
      name: "LeaseInactiveError",
      msg: "The provided lease account is not active."
    },
    {
      code: 6047,
      name: "NoAggregatorJobsFound",
      msg: "No jobs are currently included in the aggregator."
    },
    {
      code: 6048,
      name: "IntegerUnderflowError",
      msg: "An integer underflow occurred."
    },
    {
      code: 6049,
      name: "OracleQueueMismatch",
      msg: "An invalid oracle queue account was provided."
    },
    {
      code: 6050,
      name: "OracleWalletMismatchError",
      msg: "An unexpected oracle wallet account was provided for the transaction."
    },
    {
      code: 6051,
      name: "InvalidBufferAccountError",
      msg: "An invalid buffer account was provided."
    },
    {
      code: 6052,
      name: "InsufficientOracleQueueError",
      msg: "Insufficient oracle queue size."
    },
    {
      code: 6053,
      name: "InvalidAuthorityError",
      msg: "Invalid authority account provided."
    },
    {
      code: 6054,
      name: "InvalidTokenAccountMintError",
      msg: "A provided token wallet is associated with an incorrect mint."
    },
    {
      code: 6055,
      name: "ExcessiveLeaseWithdrawlError",
      msg: "You must leave enough funds to perform at least 1 update in the lease."
    },
    {
      code: 6056,
      name: "InvalideHistoryAccountError",
      msg: "Invalid history account provided."
    },
    {
      code: 6057,
      name: "InvalidLeaseAccountEscrowError",
      msg: "Invalid lease account escrow."
    },
    {
      code: 6058,
      name: "InvalidCrankAccountError",
      msg: "Invalid crank provided."
    },
    {
      code: 6059,
      name: "CrankNoElementsReadyError",
      msg: "No elements ready to be popped."
    },
    {
      code: 6060,
      name: "IndexOutOfBoundsError",
      msg: "Index out of bounds"
    },
    {
      code: 6061,
      name: "VrfInvalidRequestError",
      msg: "Invalid vrf request params"
    },
    {
      code: 6062,
      name: "VrfInvalidProofSubmissionError",
      msg: "Vrf proof failed to verify"
    },
    {
      code: 6063,
      name: "VrfVerifyError",
      msg: "Error in verifying vrf proof."
    },
    {
      code: 6064,
      name: "VrfCallbackError",
      msg: "Vrf callback function failed."
    },
    {
      code: 6065,
      name: "VrfCallbackParamsError",
      msg: "Invalid vrf callback params provided."
    },
    {
      code: 6066,
      name: "VrfCallbackAlreadyCalledError",
      msg: "Vrf callback has already been triggered."
    },
    {
      code: 6067,
      name: "VrfInvalidPubkeyError",
      msg: "The provided pubkey is invalid to use in ecvrf proofs"
    },
    {
      code: 6068,
      name: "VrfTooManyVerifyCallsError",
      msg: "Number of required verify calls exceeded"
    },
    {
      code: 6069,
      name: "VrfRequestAlreadyLaunchedError",
      msg: "Vrf request is already pending"
    },
    {
      code: 6070,
      name: "VrfInsufficientVerificationError",
      msg: "Insufficient amount of proofs collected for VRF callback"
    },
    {
      code: 6071,
      name: "InvalidVrfProducerError",
      msg: "An incorrect oracle attempted to submit a proof"
    }
  ]
};

// src/oracles/switchboardClient.ts
var program;
var SwitchboardClient = class {
  constructor(connection) {
    this.connection = connection;
  }
  async getOraclePriceData(pricePublicKey) {
    const accountInfo = await this.connection.getAccountInfo(pricePublicKey);
    return this.getOraclePriceDataFromBuffer(accountInfo.data);
  }
  getOraclePriceDataFromBuffer(buffer) {
    const program2 = this.getProgram();
    const aggregatorAccountData = program2.account.aggregatorAccountData.coder.accounts.decode(
      "AggregatorAccountData",
      buffer
    );
    const price = convertSwitchboardDecimal(
      aggregatorAccountData.latestConfirmedRound.result
    );
    const confidence = convertSwitchboardDecimal(
      aggregatorAccountData.latestConfirmedRound.stdDeviation
    );
    const hasSufficientNumberOfDataPoints = aggregatorAccountData.latestConfirmedRound.numSuccess >= aggregatorAccountData.minOracleResults;
    const slot = aggregatorAccountData.latestConfirmedRound.roundOpenSlot;
    return {
      price,
      slot,
      confidence,
      hasSufficientNumberOfDataPoints
    };
  }
  getProgram() {
    if (program) {
      return program;
    }
    program = getSwitchboardProgram(this.connection);
    return program;
  }
};
function getSwitchboardProgram(connection) {
  const DEFAULT_KEYPAIR = Keypair.fromSeed(new Uint8Array(32).fill(1));
  const programId = PublicKey2.default;
  const wallet = new Wallet(DEFAULT_KEYPAIR);
  const provider = new AnchorProvider2(connection, wallet, {});
  return new Program2(switchboard_v2_default, programId, provider);
}
function convertSwitchboardDecimal(switchboardDecimal) {
  const switchboardPrecision = TEN.pow(new BN3(switchboardDecimal.scale));
  return switchboardDecimal.mantissa.mul(PRICE_PRECISION).div(switchboardPrecision);
}

// src/types.ts
var ExchangeStatus = class {
};
ExchangeStatus.ACTIVE = { active: {} };
ExchangeStatus.FUNDING_PAUSED = { fundingPaused: {} };
ExchangeStatus.AMM_PAUSED = { ammPaused: {} };
ExchangeStatus.FILL_PAUSED = { fillPaused: {} };
ExchangeStatus.LIQ_PAUSED = { liqPaused: {} };
ExchangeStatus.WITHDRAW_PAUSED = { withdrawPaused: {} };
ExchangeStatus.PAUSED = { paused: {} };
var MarketStatus = class {
};
MarketStatus.INITIALIZED = { initialized: {} };
MarketStatus.ACTIVE = { active: {} };
MarketStatus.FUNDING_PAUSED = { fundingPaused: {} };
MarketStatus.AMM_PAUSED = { ammPaused: {} };
MarketStatus.FILL_PAUSED = { fillPaused: {} };
MarketStatus.WITHDRAW_PAUSED = { withdrawPaused: {} };
MarketStatus.REDUCE_ONLY = { reduceOnly: {} };
MarketStatus.SETTLEMENT = { settlement: {} };
MarketStatus.DELISTED = { delisted: {} };
var UserStatus = class {
};
UserStatus.ACTIVE = { active: {} };
UserStatus.BEING_LIQUIDATED = { beingLiquidated: {} };
UserStatus.BANKRUPT = { bankrupt: {} };
var ContractType = class {
};
ContractType.PERPETUAL = { perpetual: {} };
ContractType.FUTURE = { future: {} };
var ContractTier = class {
};
ContractTier.A = { a: {} };
ContractTier.B = { b: {} };
ContractTier.C = { c: {} };
ContractTier.SPECULATIVE = { speculative: {} };
ContractTier.ISOLATED = { isolated: {} };
var AssetTier = class {
};
AssetTier.COLLATERAL = { collateral: {} };
AssetTier.PROTECTED = { protected: {} };
AssetTier.CROSS = { cross: {} };
AssetTier.ISOLATED = { isolated: {} };
AssetTier.UNLISTED = { unlisted: {} };
var SwapDirection = class {
};
SwapDirection.ADD = { add: {} };
SwapDirection.REMOVE = { remove: {} };
var SpotBalanceType = class {
};
SpotBalanceType.DEPOSIT = { deposit: {} };
SpotBalanceType.BORROW = { borrow: {} };
var PositionDirection = class {
};
PositionDirection.LONG = { long: {} };
PositionDirection.SHORT = { short: {} };
var DepositDirection = class {
};
DepositDirection.DEPOSIT = { deposit: {} };
DepositDirection.WITHDRAW = { withdraw: {} };
var OracleSource = class {
};
OracleSource.PYTH = { pyth: {} };
OracleSource.SWITCHBOARD = { switchboard: {} };
OracleSource.QUOTE_ASSET = { quoteAsset: {} };
var OrderType = class {
};
OrderType.LIMIT = { limit: {} };
OrderType.TRIGGER_MARKET = { triggerMarket: {} };
OrderType.TRIGGER_LIMIT = { triggerLimit: {} };
OrderType.MARKET = { market: {} };
OrderType.ORACLE = { oracle: {} };
var MarketType = class {
};
MarketType.SPOT = { spot: {} };
MarketType.PERP = { perp: {} };
var OrderStatus = class {
};
OrderStatus.INIT = { init: {} };
OrderStatus.OPEN = { open: {} };
var OrderAction = class {
};
OrderAction.PLACE = { place: {} };
OrderAction.CANCEL = { cancel: {} };
OrderAction.EXPIRE = { expire: {} };
OrderAction.FILL = { fill: {} };
OrderAction.TRIGGER = { trigger: {} };
var OrderActionExplanation = class {
};
OrderActionExplanation.NONE = { none: {} };
OrderActionExplanation.INSUFFICIENT_FREE_COLLATERAL = {
  insufficientFreeCollateral: {}
};
OrderActionExplanation.ORACLE_PRICE_BREACHED_LIMIT_PRICE = {
  oraclePriceBreachedLimitPrice: {}
};
OrderActionExplanation.MARKET_ORDER_FILLED_TO_LIMIT_PRICE = {
  marketOrderFilledToLimitPrice: {}
};
OrderActionExplanation.ORDER_EXPIRED = {
  orderExpired: {}
};
OrderActionExplanation.LIQUIDATION = {
  liquidation: {}
};
OrderActionExplanation.ORDER_FILLED_WITH_AMM = {
  orderFilledWithAmm: {}
};
OrderActionExplanation.ORDER_FILLED_WITH_AMM_JIT = {
  orderFilledWithAmmJit: {}
};
OrderActionExplanation.ORDER_FILLED_WITH_MATCH = {
  orderFilledWithMatch: {}
};
OrderActionExplanation.ORDER_FILLED_WITH_MATCH_JIT = {
  orderFilledWithMatchJit: {}
};
OrderActionExplanation.MARKET_EXPIRED = {
  marketExpired: {}
};
OrderActionExplanation.RISK_INCREASING_ORDER = {
  riskingIncreasingOrder: {}
};
OrderActionExplanation.ORDER_FILLED_WITH_SERUM = {
  orderFillWithSerum: {}
};
OrderActionExplanation.REDUCE_ONLY_ORDER_INCREASED_POSITION = {
  reduceOnlyOrderIncreasedPosition: {}
};
var OrderTriggerCondition = class {
};
OrderTriggerCondition.ABOVE = { above: {} };
OrderTriggerCondition.BELOW = { below: {} };
OrderTriggerCondition.TRIGGERED_ABOVE = { triggeredAbove: {} };
OrderTriggerCondition.TRIGGERED_BELOW = { triggeredBelow: {} };
var SpotFulfillmentType = class {
};
SpotFulfillmentType.SERUM_v3 = { serumV3: {} };
var SpotFulfillmentStatus = class {
};
SpotFulfillmentStatus.ENABLED = { enabled: {} };
SpotFulfillmentStatus.DISABLED = { disabled: {} };
var DepositExplanation = class {
};
DepositExplanation.NONE = { none: {} };
DepositExplanation.TRANSFER = { transfer: {} };
var SettlePnlExplanation = class {
};
SettlePnlExplanation.NONE = { none: {} };
SettlePnlExplanation.EXPIRED_POSITION = { expiredPosition: {} };
var SpotFulfillmentConfigStatus = class {
};
SpotFulfillmentConfigStatus.ENABLED = { enabled: {} };
SpotFulfillmentConfigStatus.DISABLED = { disabled: {} };
var StakeAction = class {
};
StakeAction.STAKE = { stake: {} };
StakeAction.UNSTAKE_REQUEST = { unstakeRequest: {} };
StakeAction.UNSTAKE_CANCEL_REQUEST = { unstakeCancelRequest: {} };
StakeAction.UNSTAKE = { unstake: {} };
function isVariant(object, type) {
  return object.hasOwnProperty(type);
}
function isOneOfVariant(object, types) {
  return types.reduce((result, type) => {
    return result || object.hasOwnProperty(type);
  }, false);
}
function getVariant(object) {
  return Object.keys(object)[0];
}
var TradeSide = /* @__PURE__ */ ((TradeSide2) => {
  TradeSide2[TradeSide2["None"] = 0] = "None";
  TradeSide2[TradeSide2["Buy"] = 1] = "Buy";
  TradeSide2[TradeSide2["Sell"] = 2] = "Sell";
  return TradeSide2;
})(TradeSide || {});
var LPAction = class {
};
LPAction.ADD_LIQUIDITY = { addLiquidity: {} };
LPAction.REMOVE_LIQUIDITY = { removeLiquidity: {} };
LPAction.SETTLE_LIQUIDITY = { settleLiquidity: {} };
var LiquidationType = class {
};
LiquidationType.LIQUIDATE_PERP = { liquidatePerp: {} };
LiquidationType.LIQUIDATE_BORROW_FOR_PERP_PNL = {
  liquidateBorrowForPerpPnl: {}
};
LiquidationType.LIQUIDATE_PERP_PNL_FOR_DEPOSIT = {
  liquidatePerpPnlForDeposit: {}
};
LiquidationType.PERP_BANKRUPTCY = {
  perpBankruptcy: {}
};
LiquidationType.BORROW_BANKRUPTCY = {
  borrowBankruptcy: {}
};
LiquidationType.LIQUIDATE_SPOT = {
  liquidateSpot: {}
};
var DefaultOrderParams = {
  orderType: OrderType.MARKET,
  marketType: MarketType.PERP,
  userOrderId: 0,
  direction: PositionDirection.LONG,
  baseAssetAmount: ZERO,
  price: ZERO,
  marketIndex: 0,
  reduceOnly: false,
  postOnly: false,
  immediateOrCancel: false,
  triggerPrice: null,
  triggerCondition: OrderTriggerCondition.ABOVE,
  positionLimit: ZERO,
  oraclePriceOffset: null,
  auctionDuration: null,
  maxTs: null,
  auctionStartPrice: null,
  auctionEndPrice: null
};

// src/constants/perpMarkets.ts
import { PublicKey as PublicKey3 } from "@solana/web3.js";
var DevnetPerpMarkets = [
  {
    fullName: "Solana",
    category: ["L1", "Infra"],
    symbol: "SOL-PERP",
    baseAssetSymbol: "SOL",
    marketIndex: 0,
    oracle: new PublicKey3("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    launchTs: 1655751353e3,
    oracleSource: OracleSource.PYTH
  },
  {
    fullName: "Bitcoin",
    category: ["L1", "Payment"],
    symbol: "BTC-PERP",
    baseAssetSymbol: "BTC",
    marketIndex: 1,
    oracle: new PublicKey3("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
    launchTs: 1655751353e3,
    oracleSource: OracleSource.PYTH
  },
  {
    fullName: "Ethereum",
    category: ["L1", "Infra"],
    symbol: "ETH-PERP",
    baseAssetSymbol: "ETH",
    marketIndex: 2,
    oracle: new PublicKey3("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
    launchTs: 1637691133472,
    oracleSource: OracleSource.PYTH
  }
];
var MainnetPerpMarkets = [
  {
    fullName: "Solana",
    category: ["L1", "Infra"],
    symbol: "SOL-PERP",
    baseAssetSymbol: "SOL",
    marketIndex: 0,
    oracle: new PublicKey3("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
    launchTs: 1667560505e3,
    oracleSource: OracleSource.PYTH
  },
  {
    fullName: "Bitcoin",
    category: ["L1", "Payment"],
    symbol: "BTC-PERP",
    baseAssetSymbol: "BTC",
    marketIndex: 1,
    oracle: new PublicKey3("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
    launchTs: 1670347281e3,
    oracleSource: OracleSource.PYTH
  },
  {
    fullName: "Ethereum",
    category: ["L1", "Infra"],
    symbol: "ETH-PERP",
    baseAssetSymbol: "ETH",
    marketIndex: 2,
    oracle: new PublicKey3("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
    launchTs: 1670347281e3,
    oracleSource: OracleSource.PYTH
  }
];
var PerpMarkets = {
  devnet: DevnetPerpMarkets,
  "mainnet-beta": MainnetPerpMarkets
};

// src/addresses/pda.ts
import { PublicKey as PublicKey4 } from "@solana/web3.js";
import * as anchor2 from "@project-serum/anchor";
async function getDriftStateAccountPublicKeyAndNonce(programId) {
  return PublicKey4.findProgramAddress(
    [Buffer.from(anchor2.utils.bytes.utf8.encode("drift_state"))],
    programId
  );
}
async function getDriftStateAccountPublicKey(programId) {
  return (await getDriftStateAccountPublicKeyAndNonce(programId))[0];
}
async function getUserAccountPublicKeyAndNonce(programId, authority, subAccountId = 0) {
  return PublicKey4.findProgramAddress(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("user")),
      authority.toBuffer(),
      new anchor2.BN(subAccountId).toArrayLike(Buffer, "le", 2)
    ],
    programId
  );
}
async function getUserAccountPublicKey(programId, authority, subAccountId = 0) {
  return (await getUserAccountPublicKeyAndNonce(programId, authority, subAccountId))[0];
}
function getUserAccountPublicKeySync(programId, authority, subAccountId = 0) {
  return PublicKey4.findProgramAddressSync(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("user")),
      authority.toBuffer(),
      new anchor2.BN(subAccountId).toArrayLike(Buffer, "le", 2)
    ],
    programId
  )[0];
}
function getUserStatsAccountPublicKey(programId, authority) {
  return PublicKey4.findProgramAddressSync(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("user_stats")),
      authority.toBuffer()
    ],
    programId
  )[0];
}
async function getPerpMarketPublicKey(programId, marketIndex) {
  return (await PublicKey4.findProgramAddress(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("perp_market")),
      new anchor2.BN(marketIndex).toArrayLike(Buffer, "le", 2)
    ],
    programId
  ))[0];
}
async function getSpotMarketPublicKey(programId, marketIndex) {
  return (await PublicKey4.findProgramAddress(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("spot_market")),
      new anchor2.BN(marketIndex).toArrayLike(Buffer, "le", 2)
    ],
    programId
  ))[0];
}
async function getSpotMarketVaultPublicKey(programId, marketIndex) {
  return (await PublicKey4.findProgramAddress(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("spot_market_vault")),
      new anchor2.BN(marketIndex).toArrayLike(Buffer, "le", 2)
    ],
    programId
  ))[0];
}
async function getInsuranceFundVaultPublicKey(programId, marketIndex) {
  return (await PublicKey4.findProgramAddress(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("insurance_fund_vault")),
      new anchor2.BN(marketIndex).toArrayLike(Buffer, "le", 2)
    ],
    programId
  ))[0];
}
function getInsuranceFundStakeAccountPublicKey(programId, authority, marketIndex) {
  return PublicKey4.findProgramAddressSync(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("insurance_fund_stake")),
      authority.toBuffer(),
      new anchor2.BN(marketIndex).toArrayLike(Buffer, "le", 2)
    ],
    programId
  )[0];
}
function getDriftSignerPublicKey(programId) {
  return PublicKey4.findProgramAddressSync(
    [Buffer.from(anchor2.utils.bytes.utf8.encode("drift_signer"))],
    programId
  )[0];
}
function getSerumOpenOrdersPublicKey(programId, market) {
  return PublicKey4.findProgramAddressSync(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("serum_open_orders")),
      market.toBuffer()
    ],
    programId
  )[0];
}
function getSerumSignerPublicKey(programId, market, nonce) {
  return anchor2.web3.PublicKey.createProgramAddressSync(
    [market.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
    programId
  );
}
function getSerumFulfillmentConfigPublicKey(programId, market) {
  return PublicKey4.findProgramAddressSync(
    [
      Buffer.from(anchor2.utils.bytes.utf8.encode("serum_fulfillment_config")),
      market.toBuffer()
    ],
    programId
  )[0];
}

// src/accounts/fetch.ts
async function fetchUserAccounts(connection, program2, authority, limit = 8) {
  const userAccountPublicKeys = new Array();
  for (let i = 0; i < limit; i++) {
    userAccountPublicKeys.push(
      await getUserAccountPublicKey(program2.programId, authority, i)
    );
  }
  const accountInfos = await connection.getMultipleAccountsInfo(
    userAccountPublicKeys,
    "confirmed"
  );
  return accountInfos.map((accountInfo) => {
    if (!accountInfo) {
      return void 0;
    }
    return program2.account.user.coder.accounts.decode(
      "User",
      accountInfo.data
    );
  });
}
async function fetchUserStatsAccount(connection, program2, authority) {
  const userStatsPublicKey = getUserStatsAccountPublicKey(
    program2.programId,
    authority
  );
  const accountInfo = await connection.getAccountInfo(
    userStatsPublicKey,
    "confirmed"
  );
  return accountInfo ? program2.account.user.coder.accounts.decode(
    "UserStats",
    accountInfo.data
  ) : void 0;
}

// src/accounts/types.ts
var NotSubscribedError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "NotSubscribedError";
  }
};

// src/accounts/webSocketDriftClientAccountSubscriber.ts
import { EventEmitter } from "events";

// src/accounts/utils.ts
function capitalize(value) {
  return value[0].toUpperCase() + value.slice(1);
}

// src/accounts/webSocketAccountSubscriber.ts
var WebSocketAccountSubscriber = class {
  constructor(accountName, program2, accountPublicKey, decodeBuffer) {
    this.accountName = accountName;
    this.program = program2;
    this.accountPublicKey = accountPublicKey;
    this.decodeBufferFn = decodeBuffer;
  }
  async subscribe(onChange) {
    if (this.listenerId) {
      return;
    }
    this.onChange = onChange;
    await this.fetch();
    this.listenerId = this.program.provider.connection.onAccountChange(
      this.accountPublicKey,
      (accountInfo, context) => {
        this.handleRpcResponse(context, accountInfo);
      },
      this.program.provider.opts.commitment
    );
  }
  async fetch() {
    const rpcResponse = await this.program.provider.connection.getAccountInfoAndContext(
      this.accountPublicKey,
      this.program.provider.opts.commitment
    );
    this.handleRpcResponse(rpcResponse.context, rpcResponse == null ? void 0 : rpcResponse.value);
  }
  handleRpcResponse(context, accountInfo) {
    const newSlot = context.slot;
    let newBuffer = void 0;
    if (accountInfo) {
      newBuffer = accountInfo.data;
    }
    if (!this.bufferAndSlot) {
      this.bufferAndSlot = {
        buffer: newBuffer,
        slot: newSlot
      };
      if (newBuffer) {
        const account = this.decodeBuffer(newBuffer);
        this.dataAndSlot = {
          data: account,
          slot: newSlot
        };
        this.onChange(account);
      }
      return;
    }
    if (newSlot <= this.bufferAndSlot.slot) {
      return;
    }
    const oldBuffer = this.bufferAndSlot.buffer;
    if (newBuffer && (!oldBuffer || !newBuffer.equals(oldBuffer))) {
      this.bufferAndSlot = {
        buffer: newBuffer,
        slot: newSlot
      };
      const account = this.decodeBuffer(newBuffer);
      this.dataAndSlot = {
        data: account,
        slot: newSlot
      };
      this.onChange(account);
    }
  }
  decodeBuffer(buffer) {
    if (this.decodeBufferFn) {
      return this.decodeBufferFn(buffer);
    } else {
      return this.program.account[this.accountName].coder.accounts.decode(
        capitalize(this.accountName),
        buffer
      );
    }
  }
  unsubscribe() {
    if (this.listenerId) {
      const promise = this.program.provider.connection.removeAccountChangeListener(
        this.listenerId
      );
      this.listenerId = void 0;
      return promise;
    }
  }
};

// src/accounts/webSocketDriftClientAccountSubscriber.ts
import { PublicKey as PublicKey5 } from "@solana/web3.js";

// src/oracles/quoteAssetOracleClient.ts
import { BN as BN6 } from "@project-serum/anchor";
var QUOTE_ORACLE_PRICE_DATA = {
  price: PRICE_PRECISION,
  slot: new BN6(0),
  confidence: new BN6(1),
  hasSufficientNumberOfDataPoints: true
};
var QuoteAssetOracleClient = class {
  constructor() {
  }
  async getOraclePriceData(_pricePublicKey) {
    return Promise.resolve(QUOTE_ORACLE_PRICE_DATA);
  }
  getOraclePriceDataFromBuffer(_buffer) {
    return QUOTE_ORACLE_PRICE_DATA;
  }
};

// src/factory/oracleClient.ts
function getOracleClient(oracleSource, connection) {
  if (isVariant(oracleSource, "pyth")) {
    return new PythClient(connection);
  }
  if (isVariant(oracleSource, "switchboard")) {
    return new SwitchboardClient(connection);
  }
  if (isVariant(oracleSource, "quoteAsset")) {
    return new QuoteAssetOracleClient();
  }
  throw new Error(`Unknown oracle source ${oracleSource}`);
}

// src/oracles/oracleClientCache.ts
var OracleClientCache = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
  }
  get(oracleSource, connection) {
    const key = Object.keys(oracleSource)[0];
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const client = getOracleClient(oracleSource, connection);
    this.cache.set(key, client);
    return client;
  }
};

// src/accounts/webSocketDriftClientAccountSubscriber.ts
var WebSocketDriftClientAccountSubscriber = class {
  constructor(program2, perpMarketIndexes, spotMarketIndexes, oracleInfos) {
    this.oracleClientCache = new OracleClientCache();
    this.perpMarketAccountSubscribers = /* @__PURE__ */ new Map();
    this.spotMarketAccountSubscribers = /* @__PURE__ */ new Map();
    this.oracleSubscribers = /* @__PURE__ */ new Map();
    this.isSubscribing = false;
    this.isSubscribed = false;
    this.program = program2;
    this.eventEmitter = new EventEmitter();
    this.perpMarketIndexes = perpMarketIndexes;
    this.spotMarketIndexes = spotMarketIndexes;
    this.oracleInfos = oracleInfos;
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    if (this.isSubscribing) {
      return await this.subscriptionPromise;
    }
    this.isSubscribing = true;
    this.subscriptionPromise = new Promise((res) => {
      this.subscriptionPromiseResolver = res;
    });
    const statePublicKey = await getDriftStateAccountPublicKey(
      this.program.programId
    );
    this.stateAccountSubscriber = new WebSocketAccountSubscriber(
      "state",
      this.program,
      statePublicKey
    );
    await this.stateAccountSubscriber.subscribe((data) => {
      this.eventEmitter.emit("stateAccountUpdate", data);
      this.eventEmitter.emit("update");
    });
    await this.subscribeToPerpMarketAccounts();
    await this.subscribeToSpotMarketAccounts();
    await this.subscribeToOracles();
    this.eventEmitter.emit("update");
    this.isSubscribing = false;
    this.isSubscribed = true;
    this.subscriptionPromiseResolver(true);
    return true;
  }
  async subscribeToPerpMarketAccounts() {
    for (const marketIndex of this.perpMarketIndexes) {
      await this.subscribeToPerpMarketAccount(marketIndex);
    }
    return true;
  }
  async subscribeToPerpMarketAccount(marketIndex) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      marketIndex
    );
    const accountSubscriber = new WebSocketAccountSubscriber(
      "perpMarket",
      this.program,
      perpMarketPublicKey
    );
    await accountSubscriber.subscribe((data) => {
      this.eventEmitter.emit("perpMarketAccountUpdate", data);
      this.eventEmitter.emit("update");
    });
    this.perpMarketAccountSubscribers.set(marketIndex, accountSubscriber);
    return true;
  }
  async subscribeToSpotMarketAccounts() {
    for (const marketIndex of this.spotMarketIndexes) {
      await this.subscribeToSpotMarketAccount(marketIndex);
    }
    return true;
  }
  async subscribeToSpotMarketAccount(marketIndex) {
    const marketPublicKey = await getSpotMarketPublicKey(
      this.program.programId,
      marketIndex
    );
    const accountSubscriber = new WebSocketAccountSubscriber(
      "spotMarket",
      this.program,
      marketPublicKey
    );
    await accountSubscriber.subscribe((data) => {
      this.eventEmitter.emit("spotMarketAccountUpdate", data);
      this.eventEmitter.emit("update");
    });
    this.spotMarketAccountSubscribers.set(marketIndex, accountSubscriber);
    return true;
  }
  async subscribeToOracles() {
    for (const oracleInfo of this.oracleInfos) {
      if (!oracleInfo.publicKey.equals(PublicKey5.default)) {
        await this.subscribeToOracle(oracleInfo);
      }
    }
    return true;
  }
  async subscribeToOracle(oracleInfo) {
    const client = this.oracleClientCache.get(
      oracleInfo.source,
      this.program.provider.connection
    );
    const accountSubscriber = new WebSocketAccountSubscriber(
      "oracle",
      this.program,
      oracleInfo.publicKey,
      (buffer) => {
        return client.getOraclePriceDataFromBuffer(buffer);
      }
    );
    await accountSubscriber.subscribe((data) => {
      this.eventEmitter.emit("oraclePriceUpdate", oracleInfo.publicKey, data);
      this.eventEmitter.emit("update");
    });
    this.oracleSubscribers.set(
      oracleInfo.publicKey.toString(),
      accountSubscriber
    );
    return true;
  }
  async unsubscribeFromMarketAccounts() {
    for (const accountSubscriber of this.perpMarketAccountSubscribers.values()) {
      await accountSubscriber.unsubscribe();
    }
  }
  async unsubscribeFromSpotMarketAccounts() {
    for (const accountSubscriber of this.spotMarketAccountSubscribers.values()) {
      await accountSubscriber.unsubscribe();
    }
  }
  async unsubscribeFromOracles() {
    for (const accountSubscriber of this.oracleSubscribers.values()) {
      await accountSubscriber.unsubscribe();
    }
  }
  async fetch() {
    if (!this.isSubscribed) {
      return;
    }
    const promises = [this.stateAccountSubscriber.fetch()].concat(
      Array.from(this.perpMarketAccountSubscribers.values()).map(
        (subscriber) => subscriber.fetch()
      )
    ).concat(
      Array.from(this.spotMarketAccountSubscribers.values()).map(
        (subscriber) => subscriber.fetch()
      )
    );
    await Promise.all(promises);
  }
  async unsubscribe() {
    if (!this.isSubscribed) {
      return;
    }
    await this.stateAccountSubscriber.unsubscribe();
    await this.unsubscribeFromMarketAccounts();
    await this.unsubscribeFromSpotMarketAccounts();
    await this.unsubscribeFromOracles();
    this.isSubscribed = false;
  }
  async addSpotMarket(marketIndex) {
    if (this.spotMarketAccountSubscribers.has(marketIndex)) {
      return true;
    }
    return this.subscribeToSpotMarketAccount(marketIndex);
  }
  async addPerpMarket(marketIndex) {
    if (this.perpMarketAccountSubscribers.has(marketIndex)) {
      return true;
    }
    return this.subscribeToPerpMarketAccount(marketIndex);
  }
  async addOracle(oracleInfo) {
    if (this.oracleSubscribers.has(oracleInfo.publicKey.toString())) {
      return true;
    }
    if (oracleInfo.publicKey.equals(PublicKey5.default)) {
      return true;
    }
    return this.subscribeToOracle(oracleInfo);
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getStateAccountAndSlot() {
    this.assertIsSubscribed();
    return this.stateAccountSubscriber.dataAndSlot;
  }
  getMarketAccountAndSlot(marketIndex) {
    this.assertIsSubscribed();
    return this.perpMarketAccountSubscribers.get(marketIndex).dataAndSlot;
  }
  getMarketAccountsAndSlots() {
    return Array.from(this.perpMarketAccountSubscribers.values()).map(
      (subscriber) => subscriber.dataAndSlot
    );
  }
  getSpotMarketAccountAndSlot(marketIndex) {
    this.assertIsSubscribed();
    return this.spotMarketAccountSubscribers.get(marketIndex).dataAndSlot;
  }
  getSpotMarketAccountsAndSlots() {
    return Array.from(this.spotMarketAccountSubscribers.values()).map(
      (subscriber) => subscriber.dataAndSlot
    );
  }
  getOraclePriceDataAndSlot(oraclePublicKey) {
    this.assertIsSubscribed();
    if (oraclePublicKey.equals(PublicKey5.default)) {
      return {
        data: QUOTE_ORACLE_PRICE_DATA,
        slot: 0
      };
    }
    return this.oracleSubscribers.get(oraclePublicKey.toString()).dataAndSlot;
  }
};

// src/accounts/bulkAccountLoader.ts
import { v4 as uuidv4 } from "uuid";

// src/util/promiseTimeout.ts
function promiseTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve(null), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutId);
    return result;
  });
}

// src/accounts/bulkAccountLoader.ts
var GET_MULTIPLE_ACCOUNTS_CHUNK_SIZE = 99;
var oneMinute = 60 * 1e3;
var BulkAccountLoader = class {
  constructor(connection, commitment, pollingFrequency) {
    this.accountsToLoad = /* @__PURE__ */ new Map();
    this.bufferAndSlotMap = /* @__PURE__ */ new Map();
    this.errorCallbacks = /* @__PURE__ */ new Map();
    this.lastTimeLoadingPromiseCleared = Date.now();
    this.mostRecentSlot = 0;
    this.connection = connection;
    this.commitment = commitment;
    this.pollingFrequency = pollingFrequency;
  }
  async addAccount(publicKey, callback) {
    const existingSize = this.accountsToLoad.size;
    const callbackId = uuidv4();
    const existingAccountToLoad = this.accountsToLoad.get(publicKey.toString());
    if (existingAccountToLoad) {
      existingAccountToLoad.callbacks.set(callbackId, callback);
    } else {
      const callbacks = /* @__PURE__ */ new Map();
      callbacks.set(callbackId, callback);
      const newAccountToLoad = {
        publicKey,
        callbacks
      };
      this.accountsToLoad.set(publicKey.toString(), newAccountToLoad);
    }
    if (existingSize === 0) {
      this.startPolling();
    }
    await this.loadPromise;
    return callbackId;
  }
  removeAccount(publicKey, callbackId) {
    const existingAccountToLoad = this.accountsToLoad.get(publicKey.toString());
    if (existingAccountToLoad) {
      existingAccountToLoad.callbacks.delete(callbackId);
      if (existingAccountToLoad.callbacks.size === 0) {
        this.accountsToLoad.delete(existingAccountToLoad.publicKey.toString());
      }
    }
    if (this.accountsToLoad.size === 0) {
      this.stopPolling();
    }
  }
  addErrorCallbacks(callback) {
    const callbackId = uuidv4();
    this.errorCallbacks.set(callbackId, callback);
    return callbackId;
  }
  removeErrorCallbacks(callbackId) {
    this.errorCallbacks.delete(callbackId);
  }
  chunks(array, size) {
    return new Array(Math.ceil(array.length / size)).fill(null).map((_, index) => index * size).map((begin) => array.slice(begin, begin + size));
  }
  async load() {
    if (this.loadPromise) {
      const now = Date.now();
      if (now - this.lastTimeLoadingPromiseCleared > oneMinute) {
        this.loadPromise = void 0;
      } else {
        return this.loadPromise;
      }
    }
    this.loadPromise = new Promise((resolver) => {
      this.loadPromiseResolver = resolver;
    });
    this.lastTimeLoadingPromiseCleared = Date.now();
    try {
      const chunks = this.chunks(
        Array.from(this.accountsToLoad.values()),
        GET_MULTIPLE_ACCOUNTS_CHUNK_SIZE
      );
      await Promise.all(
        chunks.map((chunk2) => {
          return this.loadChunk(chunk2);
        })
      );
    } catch (e) {
      console.error(`Error in bulkAccountLoader.load()`);
      console.error(e);
      for (const [_, callback] of this.errorCallbacks) {
        callback(e);
      }
    } finally {
      this.loadPromiseResolver();
      this.loadPromise = void 0;
    }
  }
  async loadChunk(accountsToLoad) {
    if (accountsToLoad.length === 0) {
      return;
    }
    const args = [
      accountsToLoad.map((accountToLoad) => {
        return accountToLoad.publicKey.toBase58();
      }),
      { commitment: this.commitment }
    ];
    const rpcResponse = await promiseTimeout(
      this.connection._rpcRequest("getMultipleAccounts", args),
      10 * 1e3
    );
    if (rpcResponse === null) {
      this.log("request to rpc timed out");
      return;
    }
    const newSlot = rpcResponse.result.context.slot;
    if (newSlot > this.mostRecentSlot) {
      this.mostRecentSlot = newSlot;
    }
    for (const i in accountsToLoad) {
      const accountToLoad = accountsToLoad[i];
      const key = accountToLoad.publicKey.toString();
      const oldRPCResponse = this.bufferAndSlotMap.get(key);
      let newBuffer = void 0;
      if (rpcResponse.result.value[i]) {
        const raw = rpcResponse.result.value[i].data[0];
        const dataType = rpcResponse.result.value[i].data[1];
        newBuffer = Buffer.from(raw, dataType);
      }
      if (!oldRPCResponse) {
        this.bufferAndSlotMap.set(key, {
          slot: newSlot,
          buffer: newBuffer
        });
        this.handleAccountCallbacks(accountToLoad, newBuffer, newSlot);
        continue;
      }
      if (newSlot <= oldRPCResponse.slot) {
        continue;
      }
      const oldBuffer = oldRPCResponse.buffer;
      if (newBuffer && (!oldBuffer || !newBuffer.equals(oldBuffer))) {
        this.bufferAndSlotMap.set(key, {
          slot: newSlot,
          buffer: newBuffer
        });
        this.handleAccountCallbacks(accountToLoad, newBuffer, newSlot);
      }
    }
  }
  handleAccountCallbacks(accountToLoad, buffer, slot) {
    for (const [_, callback] of accountToLoad.callbacks) {
      callback(buffer, slot);
    }
  }
  getBufferAndSlot(publicKey) {
    return this.bufferAndSlotMap.get(publicKey.toString());
  }
  startPolling() {
    if (this.intervalId) {
      return;
    }
    if (this.pollingFrequency !== 0)
      this.intervalId = setInterval(
        this.load.bind(this),
        this.pollingFrequency
      );
  }
  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = void 0;
    }
  }
  log(msg) {
    console.log(msg);
  }
  updatePollingFrequency(pollingFrequency) {
    this.stopPolling();
    this.pollingFrequency = pollingFrequency;
    if (this.accountsToLoad.size > 0) {
      this.startPolling();
    }
  }
};

// src/accounts/bulkUserSubscription.ts
async function bulkPollingUserSubscribe(users, accountLoader) {
  if (users.length === 0) {
    await accountLoader.load();
    return;
  }
  await Promise.all(
    users.map((user) => {
      return user.accountSubscriber.addToAccountLoader();
    })
  );
  await accountLoader.load();
  await Promise.all(
    users.map(async (user) => {
      return user.subscribe();
    })
  );
}

// src/accounts/bulkUserStatsSubscription.ts
async function bulkPollingUserStatsSubscribe(userStats, accountLoader) {
  if (userStats.length === 0) {
    await accountLoader.load();
    return;
  }
  await Promise.all(
    userStats.map((userStat) => {
      return userStat.accountSubscriber.addToAccountLoader();
    })
  );
  await accountLoader.load();
  await Promise.all(
    userStats.map(async (userStat) => {
      return userStat.subscribe();
    })
  );
}

// src/accounts/pollingDriftClientAccountSubscriber.ts
import { EventEmitter as EventEmitter2 } from "events";
import { PublicKey as PublicKey6 } from "@solana/web3.js";
var PollingDriftClientAccountSubscriber = class {
  constructor(program2, accountLoader, perpMarketIndexes, spotMarketIndexes, oracleInfos) {
    this.oracleClientCache = new OracleClientCache();
    this.accountsToPoll = /* @__PURE__ */ new Map();
    this.oraclesToPoll = /* @__PURE__ */ new Map();
    this.perpMarket = /* @__PURE__ */ new Map();
    this.spotMarket = /* @__PURE__ */ new Map();
    this.oracles = /* @__PURE__ */ new Map();
    this.isSubscribing = false;
    this.isSubscribed = false;
    this.program = program2;
    this.eventEmitter = new EventEmitter2();
    this.accountLoader = accountLoader;
    this.perpMarketIndexes = perpMarketIndexes;
    this.spotMarketIndexes = spotMarketIndexes;
    this.oracleInfos = oracleInfos;
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    if (this.isSubscribing) {
      return await this.subscriptionPromise;
    }
    this.isSubscribing = true;
    this.subscriptionPromise = new Promise((res) => {
      this.subscriptionPromiseResolver = res;
    });
    await this.updateAccountsToPoll();
    await this.updateOraclesToPoll();
    await this.addToAccountLoader();
    let subscriptionSucceeded = false;
    let retries = 0;
    while (!subscriptionSucceeded && retries < 5) {
      await this.fetch();
      subscriptionSucceeded = this.didSubscriptionSucceed();
      retries++;
    }
    if (subscriptionSucceeded) {
      this.eventEmitter.emit("update");
    }
    this.isSubscribing = false;
    this.isSubscribed = subscriptionSucceeded;
    this.subscriptionPromiseResolver(subscriptionSucceeded);
    return subscriptionSucceeded;
  }
  async updateAccountsToPoll() {
    if (this.accountsToPoll.size > 0) {
      return;
    }
    const statePublicKey = await getDriftStateAccountPublicKey(
      this.program.programId
    );
    this.accountsToPoll.set(statePublicKey.toString(), {
      key: "state",
      publicKey: statePublicKey,
      eventType: "stateAccountUpdate"
    });
    await this.updatePerpMarketAccountsToPoll();
    await this.updateSpotMarketAccountsToPoll();
  }
  async updatePerpMarketAccountsToPoll() {
    for (const marketIndex of this.perpMarketIndexes) {
      await this.addPerpMarketAccountToPoll(marketIndex);
    }
    return true;
  }
  async addPerpMarketAccountToPoll(marketIndex) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      marketIndex
    );
    this.accountsToPoll.set(perpMarketPublicKey.toString(), {
      key: "perpMarket",
      publicKey: perpMarketPublicKey,
      eventType: "perpMarketAccountUpdate",
      mapKey: marketIndex
    });
    return true;
  }
  async updateSpotMarketAccountsToPoll() {
    for (const marketIndex of this.spotMarketIndexes) {
      await this.addSpotMarketAccountToPoll(marketIndex);
    }
    return true;
  }
  async addSpotMarketAccountToPoll(marketIndex) {
    const marketPublicKey = await getSpotMarketPublicKey(
      this.program.programId,
      marketIndex
    );
    this.accountsToPoll.set(marketPublicKey.toString(), {
      key: "spotMarket",
      publicKey: marketPublicKey,
      eventType: "spotMarketAccountUpdate",
      mapKey: marketIndex
    });
    return true;
  }
  updateOraclesToPoll() {
    for (const oracleInfo of this.oracleInfos) {
      if (!oracleInfo.publicKey.equals(PublicKey6.default)) {
        this.addOracleToPoll(oracleInfo);
      }
    }
    return true;
  }
  addOracleToPoll(oracleInfo) {
    this.oraclesToPoll.set(oracleInfo.publicKey.toString(), {
      publicKey: oracleInfo.publicKey,
      source: oracleInfo.source
    });
    return true;
  }
  async addToAccountLoader() {
    for (const [_, accountToPoll] of this.accountsToPoll) {
      await this.addAccountToAccountLoader(accountToPoll);
    }
    for (const [_, oracleToPoll] of this.oraclesToPoll) {
      await this.addOracleToAccountLoader(oracleToPoll);
    }
    this.errorCallbackId = this.accountLoader.addErrorCallbacks((error) => {
      this.eventEmitter.emit("error", error);
    });
  }
  async addAccountToAccountLoader(accountToPoll) {
    accountToPoll.callbackId = await this.accountLoader.addAccount(
      accountToPoll.publicKey,
      (buffer, slot) => {
        if (!buffer)
          return;
        const account = this.program.account[accountToPoll.key].coder.accounts.decode(capitalize(accountToPoll.key), buffer);
        const dataAndSlot = {
          data: account,
          slot
        };
        if (accountToPoll.mapKey != void 0) {
          this[accountToPoll.key].set(accountToPoll.mapKey, dataAndSlot);
        } else {
          this[accountToPoll.key] = dataAndSlot;
        }
        this.eventEmitter.emit(accountToPoll.eventType, account);
        this.eventEmitter.emit("update");
        if (!this.isSubscribed) {
          this.isSubscribed = this.didSubscriptionSucceed();
        }
      }
    );
  }
  async addOracleToAccountLoader(oracleToPoll) {
    const oracleClient = this.oracleClientCache.get(
      oracleToPoll.source,
      this.program.provider.connection
    );
    oracleToPoll.callbackId = await this.accountLoader.addAccount(
      oracleToPoll.publicKey,
      (buffer, slot) => {
        if (!buffer)
          return;
        const oraclePriceData = oracleClient.getOraclePriceDataFromBuffer(buffer);
        const dataAndSlot = {
          data: oraclePriceData,
          slot
        };
        this.oracles.set(oracleToPoll.publicKey.toString(), dataAndSlot);
        this.eventEmitter.emit(
          "oraclePriceUpdate",
          oracleToPoll.publicKey,
          oraclePriceData
        );
        this.eventEmitter.emit("update");
      }
    );
  }
  async fetch() {
    await this.accountLoader.load();
    for (const [_, accountToPoll] of this.accountsToPoll) {
      const { buffer, slot } = this.accountLoader.getBufferAndSlot(
        accountToPoll.publicKey
      );
      if (buffer) {
        const account = this.program.account[accountToPoll.key].coder.accounts.decode(capitalize(accountToPoll.key), buffer);
        if (accountToPoll.mapKey != void 0) {
          this[accountToPoll.key].set(accountToPoll.mapKey, {
            data: account,
            slot
          });
        } else {
          this[accountToPoll.key] = {
            data: account,
            slot
          };
        }
      }
    }
    for (const [_, oracleToPoll] of this.oraclesToPoll) {
      const { buffer, slot } = this.accountLoader.getBufferAndSlot(
        oracleToPoll.publicKey
      );
      if (buffer) {
        const oracleClient = this.oracleClientCache.get(
          oracleToPoll.source,
          this.program.provider.connection
        );
        const oraclePriceData = oracleClient.getOraclePriceDataFromBuffer(buffer);
        this.oracles.set(oracleToPoll.publicKey.toString(), {
          data: oraclePriceData,
          slot
        });
      }
    }
  }
  didSubscriptionSucceed() {
    if (this.state)
      return true;
    return false;
  }
  async unsubscribe() {
    for (const [_, accountToPoll] of this.accountsToPoll) {
      this.accountLoader.removeAccount(
        accountToPoll.publicKey,
        accountToPoll.callbackId
      );
    }
    for (const [_, oracleToPoll] of this.oraclesToPoll) {
      this.accountLoader.removeAccount(
        oracleToPoll.publicKey,
        oracleToPoll.callbackId
      );
    }
    this.accountLoader.removeErrorCallbacks(this.errorCallbackId);
    this.errorCallbackId = void 0;
    this.accountsToPoll.clear();
    this.oraclesToPoll.clear();
    this.isSubscribed = false;
  }
  async addSpotMarket(marketIndex) {
    await this.addSpotMarketAccountToPoll(marketIndex);
    const accountToPoll = this.accountsToPoll.get(marketIndex.toString());
    await this.addAccountToAccountLoader(accountToPoll);
    return true;
  }
  async addPerpMarket(marketIndex) {
    await this.addPerpMarketAccountToPoll(marketIndex);
    const accountToPoll = this.accountsToPoll.get(marketIndex.toString());
    await this.addAccountToAccountLoader(accountToPoll);
    return true;
  }
  async addOracle(oracleInfo) {
    if (oracleInfo.publicKey.equals(PublicKey6.default)) {
      return true;
    }
    this.addOracleToPoll(oracleInfo);
    const oracleToPoll = this.oraclesToPoll.get(
      oracleInfo.publicKey.toString()
    );
    await this.addOracleToAccountLoader(oracleToPoll);
    return true;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getStateAccountAndSlot() {
    this.assertIsSubscribed();
    return this.state;
  }
  getMarketAccountAndSlot(marketIndex) {
    return this.perpMarket.get(marketIndex);
  }
  getMarketAccountsAndSlots() {
    return Array.from(this.perpMarket.values());
  }
  getSpotMarketAccountAndSlot(marketIndex) {
    return this.spotMarket.get(marketIndex);
  }
  getSpotMarketAccountsAndSlots() {
    return Array.from(this.spotMarket.values());
  }
  getOraclePriceDataAndSlot(oraclePublicKey) {
    this.assertIsSubscribed();
    if (oraclePublicKey.equals(PublicKey6.default)) {
      return {
        data: QUOTE_ORACLE_PRICE_DATA,
        slot: 0
      };
    }
    return this.oracles.get(oraclePublicKey.toString());
  }
};

// src/accounts/pollingOracleAccountSubscriber.ts
import { EventEmitter as EventEmitter3 } from "events";
var PollingOracleAccountSubscriber = class {
  constructor(publicKey, oracleClient, accountLoader) {
    this.isSubscribed = false;
    this.publicKey = publicKey;
    this.oracleClient = oracleClient;
    this.accountLoader = accountLoader;
    this.eventEmitter = new EventEmitter3();
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    await this.addToAccountLoader();
    let subscriptionSucceeded = false;
    let retries = 0;
    while (!subscriptionSucceeded && retries < 5) {
      await this.fetch();
      subscriptionSucceeded = this.didSubscriptionSucceed();
      retries++;
    }
    if (subscriptionSucceeded) {
      this.eventEmitter.emit("update");
    }
    this.isSubscribed = subscriptionSucceeded;
    return subscriptionSucceeded;
  }
  async addToAccountLoader() {
    if (this.callbackId) {
      return;
    }
    this.callbackId = await this.accountLoader.addAccount(
      this.publicKey,
      async (buffer, slot) => {
        const oraclePriceData = await this.oracleClient.getOraclePriceDataFromBuffer(buffer);
        this.oraclePriceData = { data: oraclePriceData, slot };
        this.eventEmitter.emit("oracleUpdate", oraclePriceData);
        this.eventEmitter.emit("update");
      }
    );
    this.errorCallbackId = this.accountLoader.addErrorCallbacks((error) => {
      this.eventEmitter.emit("error", error);
    });
  }
  async fetch() {
    await this.accountLoader.load();
    const { buffer, slot } = this.accountLoader.getBufferAndSlot(
      this.publicKey
    );
    this.oraclePriceData = {
      data: await this.oracleClient.getOraclePriceDataFromBuffer(buffer),
      slot
    };
  }
  async unsubscribe() {
    if (!this.isSubscribed) {
      return;
    }
    this.accountLoader.removeAccount(this.publicKey, this.callbackId);
    this.callbackId = void 0;
    this.accountLoader.removeErrorCallbacks(this.errorCallbackId);
    this.errorCallbackId = void 0;
    this.isSubscribed = false;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getOraclePriceData() {
    this.assertIsSubscribed();
    return this.oraclePriceData;
  }
  didSubscriptionSucceed() {
    return !!this.oraclePriceData;
  }
};

// src/accounts/pollingTokenAccountSubscriber.ts
import { EventEmitter as EventEmitter4 } from "events";

// src/token/index.ts
import { AccountLayout, u64 } from "@solana/spl-token";
import { PublicKey as PublicKey7 } from "@solana/web3.js";
function parseTokenAccount(data) {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey7(accountInfo.mint);
  accountInfo.owner = new PublicKey7(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);
  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey7(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }
  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;
  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }
  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey7(accountInfo.closeAuthority);
  }
  return accountInfo;
}

// src/accounts/pollingTokenAccountSubscriber.ts
var PollingTokenAccountSubscriber = class {
  constructor(publicKey, accountLoader) {
    this.isSubscribed = false;
    this.publicKey = publicKey;
    this.accountLoader = accountLoader;
    this.eventEmitter = new EventEmitter4();
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    await this.addToAccountLoader();
    let subscriptionSucceeded = false;
    let retries = 0;
    while (!subscriptionSucceeded && retries < 5) {
      await this.fetch();
      subscriptionSucceeded = this.didSubscriptionSucceed();
      retries++;
    }
    if (subscriptionSucceeded) {
      this.eventEmitter.emit("update");
    }
    this.isSubscribed = subscriptionSucceeded;
    return subscriptionSucceeded;
  }
  async addToAccountLoader() {
    if (this.callbackId) {
      return;
    }
    this.callbackId = await this.accountLoader.addAccount(
      this.publicKey,
      (buffer, slot) => {
        const tokenAccount = parseTokenAccount(buffer);
        this.tokenAccountAndSlot = { data: tokenAccount, slot };
        this.eventEmitter.emit("tokenAccountUpdate", tokenAccount);
        this.eventEmitter.emit("update");
      }
    );
    this.errorCallbackId = this.accountLoader.addErrorCallbacks((error) => {
      this.eventEmitter.emit("error", error);
    });
  }
  async fetch() {
    await this.accountLoader.load();
    const { buffer, slot } = this.accountLoader.getBufferAndSlot(
      this.publicKey
    );
    this.tokenAccountAndSlot = { data: parseTokenAccount(buffer), slot };
  }
  async unsubscribe() {
    if (!this.isSubscribed) {
      return;
    }
    this.accountLoader.removeAccount(this.publicKey, this.callbackId);
    this.callbackId = void 0;
    this.accountLoader.removeErrorCallbacks(this.errorCallbackId);
    this.errorCallbackId = void 0;
    this.isSubscribed = false;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getTokenAccountAndSlot() {
    this.assertIsSubscribed();
    return this.tokenAccountAndSlot;
  }
  didSubscriptionSucceed() {
    return !!this.tokenAccountAndSlot;
  }
};

// src/accounts/pollingUserAccountSubscriber.ts
import { EventEmitter as EventEmitter5 } from "events";
var PollingUserAccountSubscriber = class {
  constructor(program2, userAccountPublicKey, accountLoader) {
    this.accountsToPoll = /* @__PURE__ */ new Map();
    this.isSubscribed = false;
    this.program = program2;
    this.accountLoader = accountLoader;
    this.eventEmitter = new EventEmitter5();
    this.userAccountPublicKey = userAccountPublicKey;
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    await this.addToAccountLoader();
    await this.fetchIfUnloaded();
    if (this.doAccountsExist()) {
      this.eventEmitter.emit("update");
    }
    this.isSubscribed = true;
    return true;
  }
  async addToAccountLoader() {
    if (this.accountsToPoll.size > 0) {
      return;
    }
    this.accountsToPoll.set(this.userAccountPublicKey.toString(), {
      key: "user",
      publicKey: this.userAccountPublicKey,
      eventType: "userAccountUpdate"
    });
    for (const [_, accountToPoll] of this.accountsToPoll) {
      accountToPoll.callbackId = await this.accountLoader.addAccount(
        accountToPoll.publicKey,
        (buffer, slot) => {
          if (!buffer) {
            return;
          }
          const account = this.program.account[accountToPoll.key].coder.accounts.decode(capitalize(accountToPoll.key), buffer);
          this[accountToPoll.key] = { data: account, slot };
          this.eventEmitter.emit(accountToPoll.eventType, account);
          this.eventEmitter.emit("update");
        }
      );
    }
    this.errorCallbackId = this.accountLoader.addErrorCallbacks((error) => {
      this.eventEmitter.emit("error", error);
    });
  }
  async fetchIfUnloaded() {
    let shouldFetch = false;
    for (const [_, accountToPoll] of this.accountsToPoll) {
      if (this[accountToPoll.key] === void 0) {
        shouldFetch = true;
        break;
      }
    }
    if (shouldFetch) {
      await this.fetch();
    }
  }
  async fetch() {
    await this.accountLoader.load();
    for (const [_, accountToPoll] of this.accountsToPoll) {
      const { buffer, slot } = this.accountLoader.getBufferAndSlot(
        accountToPoll.publicKey
      );
      if (buffer) {
        const account = this.program.account[accountToPoll.key].coder.accounts.decode(capitalize(accountToPoll.key), buffer);
        this[accountToPoll.key] = { data: account, slot };
      }
    }
  }
  doAccountsExist() {
    let success = true;
    for (const [_, accountToPoll] of this.accountsToPoll) {
      if (!this[accountToPoll.key]) {
        success = false;
        break;
      }
    }
    return success;
  }
  async unsubscribe() {
    if (!this.isSubscribed) {
      return;
    }
    for (const [_, accountToPoll] of this.accountsToPoll) {
      this.accountLoader.removeAccount(
        accountToPoll.publicKey,
        accountToPoll.callbackId
      );
    }
    this.accountLoader.removeErrorCallbacks(this.errorCallbackId);
    this.errorCallbackId = void 0;
    this.accountsToPoll.clear();
    this.isSubscribed = false;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getUserAccountAndSlot() {
    this.assertIsSubscribed();
    return this.user;
  }
};

// src/accounts/pollingUserStatsAccountSubscriber.ts
import { EventEmitter as EventEmitter6 } from "events";
var PollingUserStatsAccountSubscriber = class {
  constructor(program2, userStatsAccountPublicKey, accountLoader) {
    this.accountsToPoll = /* @__PURE__ */ new Map();
    this.isSubscribed = false;
    this.program = program2;
    this.accountLoader = accountLoader;
    this.eventEmitter = new EventEmitter6();
    this.userStatsAccountPublicKey = userStatsAccountPublicKey;
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    await this.addToAccountLoader();
    await this.fetchIfUnloaded();
    if (this.doAccountsExist()) {
      this.eventEmitter.emit("update");
    }
    this.isSubscribed = true;
    return true;
  }
  async addToAccountLoader() {
    if (this.accountsToPoll.size > 0) {
      return;
    }
    this.accountsToPoll.set(this.userStatsAccountPublicKey.toString(), {
      key: "userStats",
      publicKey: this.userStatsAccountPublicKey,
      eventType: "userStatsAccountUpdate"
    });
    for (const [_, accountToPoll] of this.accountsToPoll) {
      accountToPoll.callbackId = await this.accountLoader.addAccount(
        accountToPoll.publicKey,
        (buffer, slot) => {
          if (!buffer) {
            return;
          }
          const account = this.program.account[accountToPoll.key].coder.accounts.decode(capitalize(accountToPoll.key), buffer);
          this[accountToPoll.key] = { data: account, slot };
          this.eventEmitter.emit(accountToPoll.eventType, account);
          this.eventEmitter.emit("update");
        }
      );
    }
    this.errorCallbackId = this.accountLoader.addErrorCallbacks((error) => {
      this.eventEmitter.emit("error", error);
    });
  }
  async fetchIfUnloaded() {
    let shouldFetch = false;
    for (const [_, accountToPoll] of this.accountsToPoll) {
      if (this[accountToPoll.key] === void 0) {
        shouldFetch = true;
        break;
      }
    }
    if (shouldFetch) {
      await this.fetch();
    }
  }
  async fetch() {
    await this.accountLoader.load();
    for (const [_, accountToPoll] of this.accountsToPoll) {
      const { buffer, slot } = this.accountLoader.getBufferAndSlot(
        accountToPoll.publicKey
      );
      if (buffer) {
        const account = this.program.account[accountToPoll.key].coder.accounts.decode(capitalize(accountToPoll.key), buffer);
        this[accountToPoll.key] = { data: account, slot };
      }
    }
  }
  doAccountsExist() {
    let success = true;
    for (const [_, accountToPoll] of this.accountsToPoll) {
      if (!this[accountToPoll.key]) {
        success = false;
        break;
      }
    }
    return success;
  }
  async unsubscribe() {
    for (const [_, accountToPoll] of this.accountsToPoll) {
      this.accountLoader.removeAccount(
        accountToPoll.publicKey,
        accountToPoll.callbackId
      );
    }
    this.accountLoader.removeErrorCallbacks(this.errorCallbackId);
    this.errorCallbackId = void 0;
    this.accountsToPoll.clear();
    this.isSubscribed = false;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getUserStatsAccountAndSlot() {
    this.assertIsSubscribed();
    return this.userStats;
  }
};

// src/adminClient.ts
import {
  SYSVAR_RENT_PUBKEY as SYSVAR_RENT_PUBKEY2
} from "@solana/web3.js";

// src/userName.ts
var MAX_NAME_LENGTH = 32;
var DEFAULT_USER_NAME = "Main Account";
var DEFAULT_MARKET_NAME = "Default Market Name";
function encodeName(name) {
  if (name.length > MAX_NAME_LENGTH) {
    throw Error(`Name (${name}) longer than 32 characters`);
  }
  const buffer = Buffer.alloc(32);
  buffer.fill(name);
  buffer.fill(" ", name.length);
  return Array(...buffer);
}

// src/adminClient.ts
import { BN as BN14 } from "@project-serum/anchor";
import * as anchor4 from "@project-serum/anchor";

// src/math/utils.ts
function clampBN(x, min, max) {
  return BN.max(min, BN.min(x, max));
}
var squareRootBN = (n, closeness = new BN(1)) => {
  let x = n;
  let root;
  let count = 0;
  const TWO2 = new BN(2);
  while (count < Number.MAX_SAFE_INTEGER) {
    count++;
    root = x.add(n.div(x)).div(TWO2);
    if (x.sub(root).abs().lte(closeness))
      break;
    x = root;
  }
  return root;
};

// src/adminClient.ts
import { TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID3 } from "@solana/spl-token";

// src/driftClient.ts
import { AnchorProvider as AnchorProvider3, BN as BN12, Program as Program3 } from "@project-serum/anchor";
import bs582 from "bs58";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID as ASSOCIATED_TOKEN_PROGRAM_ID2,
  Token as Token2,
  TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID2
} from "@solana/spl-token";
import * as anchor3 from "@project-serum/anchor";

// src/idl/drift.json
var drift_default = {
  version: "2.8.0-beta.2",
  name: "drift",
  instructions: [
    {
      name: "initializeUser",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "subAccountId",
          type: "u16"
        },
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      name: "initializeUserStats",
      accounts: [
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "amount",
          type: "u64"
        },
        {
          name: "reduceOnly",
          type: "bool"
        }
      ]
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "amount",
          type: "u64"
        },
        {
          name: "reduceOnly",
          type: "bool"
        }
      ]
    },
    {
      name: "transferDeposit",
      accounts: [
        {
          name: "fromUser",
          isMut: true,
          isSigner: false
        },
        {
          name: "toUser",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarketVault",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "placePerpOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OrderParams"
          }
        }
      ]
    },
    {
      name: "cancelOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "orderId",
          type: {
            option: "u32"
          }
        }
      ]
    },
    {
      name: "cancelOrderByUserId",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "userOrderId",
          type: "u8"
        }
      ]
    },
    {
      name: "cancelOrders",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "marketType",
          type: {
            option: {
              defined: "MarketType"
            }
          }
        },
        {
          name: "marketIndex",
          type: {
            option: "u16"
          }
        },
        {
          name: "direction",
          type: {
            option: {
              defined: "PositionDirection"
            }
          }
        }
      ]
    },
    {
      name: "placeAndTakePerpOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OrderParams"
          }
        },
        {
          name: "makerOrderId",
          type: {
            option: "u32"
          }
        }
      ]
    },
    {
      name: "placeAndMakePerpOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "taker",
          isMut: true,
          isSigner: false
        },
        {
          name: "takerStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OrderParams"
          }
        },
        {
          name: "takerOrderId",
          type: "u32"
        }
      ]
    },
    {
      name: "placeSpotOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OrderParams"
          }
        }
      ]
    },
    {
      name: "placeAndTakeSpotOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OrderParams"
          }
        },
        {
          name: "fulfillmentType",
          type: {
            option: {
              defined: "SpotFulfillmentType"
            }
          }
        },
        {
          name: "makerOrderId",
          type: {
            option: "u32"
          }
        }
      ]
    },
    {
      name: "placeAndMakeSpotOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "taker",
          isMut: true,
          isSigner: false
        },
        {
          name: "takerStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "OrderParams"
          }
        },
        {
          name: "takerOrderId",
          type: "u32"
        },
        {
          name: "fulfillmentType",
          type: {
            option: {
              defined: "SpotFulfillmentType"
            }
          }
        }
      ]
    },
    {
      name: "addPerpLpShares",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "nShares",
          type: "u64"
        },
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "removePerpLpShares",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "sharesToBurn",
          type: "u64"
        },
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "removePerpLpSharesInExpiringMarket",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "sharesToBurn",
          type: "u64"
        },
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "updateUserName",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "subAccountId",
          type: "u16"
        },
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      name: "updateUserCustomMarginRatio",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "subAccountId",
          type: "u16"
        },
        {
          name: "marginRatio",
          type: "u32"
        }
      ]
    },
    {
      name: "updateUserMarginTradingEnabled",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "subAccountId",
          type: "u16"
        },
        {
          name: "marginTradingEnabled",
          type: "bool"
        }
      ]
    },
    {
      name: "updateUserDelegate",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "subAccountId",
          type: "u16"
        },
        {
          name: "delegate",
          type: "publicKey"
        }
      ]
    },
    {
      name: "deleteUser",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: []
    },
    {
      name: "fillPerpOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "filler",
          isMut: true,
          isSigner: false
        },
        {
          name: "fillerStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "orderId",
          type: {
            option: "u32"
          }
        },
        {
          name: "makerOrderId",
          type: {
            option: "u32"
          }
        }
      ]
    },
    {
      name: "fillSpotOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "filler",
          isMut: true,
          isSigner: false
        },
        {
          name: "fillerStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "orderId",
          type: {
            option: "u32"
          }
        },
        {
          name: "fulfillmentType",
          type: {
            option: {
              defined: "SpotFulfillmentType"
            }
          }
        },
        {
          name: "makerOrderId",
          type: {
            option: "u32"
          }
        }
      ]
    },
    {
      name: "triggerOrder",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "filler",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "orderId",
          type: "u32"
        }
      ]
    },
    {
      name: "forceCancelOrders",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "filler",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "settlePnl",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "spotMarketVault",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "settleFundingPayment",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "settleLp",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "settleExpiredMarket",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "liquidatePerp",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "liquidator",
          isMut: true,
          isSigner: false
        },
        {
          name: "liquidatorStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "liquidatorMaxBaseAssetAmount",
          type: "u64"
        },
        {
          name: "limitPrice",
          type: {
            option: "u64"
          }
        }
      ]
    },
    {
      name: "liquidateSpot",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "liquidator",
          isMut: true,
          isSigner: false
        },
        {
          name: "liquidatorStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "assetMarketIndex",
          type: "u16"
        },
        {
          name: "liabilityMarketIndex",
          type: "u16"
        },
        {
          name: "liquidatorMaxLiabilityTransfer",
          type: "u128"
        },
        {
          name: "limitPrice",
          type: {
            option: "u64"
          }
        }
      ]
    },
    {
      name: "liquidateBorrowForPerpPnl",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "liquidator",
          isMut: true,
          isSigner: false
        },
        {
          name: "liquidatorStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "perpMarketIndex",
          type: "u16"
        },
        {
          name: "spotMarketIndex",
          type: "u16"
        },
        {
          name: "liquidatorMaxLiabilityTransfer",
          type: "u128"
        },
        {
          name: "limitPrice",
          type: {
            option: "u64"
          }
        }
      ]
    },
    {
      name: "liquidatePerpPnlForDeposit",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "liquidator",
          isMut: true,
          isSigner: false
        },
        {
          name: "liquidatorStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "perpMarketIndex",
          type: "u16"
        },
        {
          name: "spotMarketIndex",
          type: "u16"
        },
        {
          name: "liquidatorMaxPnlTransfer",
          type: "u128"
        },
        {
          name: "limitPrice",
          type: {
            option: "u64"
          }
        }
      ]
    },
    {
      name: "resolvePerpPnlDeficit",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "spotMarketIndex",
          type: "u16"
        },
        {
          name: "perpMarketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "resolvePerpBankruptcy",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "liquidator",
          isMut: true,
          isSigner: false
        },
        {
          name: "liquidatorStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "quoteSpotMarketIndex",
          type: "u16"
        },
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "resolveSpotBankruptcy",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "liquidator",
          isMut: true,
          isSigner: false
        },
        {
          name: "liquidatorStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "user",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "settleRevenueToInsuranceFund",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "spotMarketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "updateFundingRate",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "updateSpotMarketCumulativeInterest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "updateAmms",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "marketIndexes",
          type: {
            array: [
              "u16",
              5
            ]
          }
        }
      ]
    },
    {
      name: "updateSpotMarketExpiry",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "expiryTs",
          type: "i64"
        }
      ]
    },
    {
      name: "updateUserQuoteAssetInsuranceStake",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundStake",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "initializeInsuranceFundStake",
      accounts: [
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundStake",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "addInsuranceFundStake",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundStake",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "requestRemoveInsuranceFundStake",
      accounts: [
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundStake",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "cancelRequestRemoveInsuranceFundStake",
      accounts: [
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundStake",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "removeInsuranceFundStake",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundStake",
          isMut: true,
          isSigner: false
        },
        {
          name: "userStats",
          isMut: true,
          isSigner: false
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "initialize",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "quoteAssetMint",
          isMut: false,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "initializeSpotMarket",
      accounts: [
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "spotMarketMint",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "optimalUtilization",
          type: "u32"
        },
        {
          name: "optimalBorrowRate",
          type: "u32"
        },
        {
          name: "maxBorrowRate",
          type: "u32"
        },
        {
          name: "oracleSource",
          type: {
            defined: "OracleSource"
          }
        },
        {
          name: "initialAssetWeight",
          type: "u32"
        },
        {
          name: "maintenanceAssetWeight",
          type: "u32"
        },
        {
          name: "initialLiabilityWeight",
          type: "u32"
        },
        {
          name: "maintenanceLiabilityWeight",
          type: "u32"
        },
        {
          name: "imfFactor",
          type: "u32"
        },
        {
          name: "liquidatorFee",
          type: "u32"
        },
        {
          name: "activeStatus",
          type: "bool"
        },
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      name: "initializeSerumFulfillmentConfig",
      accounts: [
        {
          name: "baseSpotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "quoteSpotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "serumProgram",
          isMut: false,
          isSigner: false
        },
        {
          name: "serumMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "serumOpenOrders",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "serumFulfillmentConfig",
          isMut: true,
          isSigner: false
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        }
      ]
    },
    {
      name: "updateSerumFulfillmentConfigStatus",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "serumFulfillmentConfig",
          isMut: true,
          isSigner: false
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true
        }
      ],
      args: [
        {
          name: "status",
          type: {
            defined: "SpotFulfillmentConfigStatus"
          }
        }
      ]
    },
    {
      name: "updateSerumVault",
      accounts: [
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "srmVault",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "initializePerpMarket",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "ammBaseAssetReserve",
          type: "u128"
        },
        {
          name: "ammQuoteAssetReserve",
          type: "u128"
        },
        {
          name: "ammPeriodicity",
          type: "i64"
        },
        {
          name: "ammPegMultiplier",
          type: "u128"
        },
        {
          name: "oracleSource",
          type: {
            defined: "OracleSource"
          }
        },
        {
          name: "marginRatioInitial",
          type: "u32"
        },
        {
          name: "marginRatioMaintenance",
          type: "u32"
        },
        {
          name: "liquidatorFee",
          type: "u32"
        },
        {
          name: "activeStatus",
          type: "bool"
        },
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      name: "moveAmmPrice",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "baseAssetReserve",
          type: "u128"
        },
        {
          name: "quoteAssetReserve",
          type: "u128"
        },
        {
          name: "sqrtK",
          type: "u128"
        }
      ]
    },
    {
      name: "updatePerpMarketExpiry",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "expiryTs",
          type: "i64"
        }
      ]
    },
    {
      name: "settleExpiredMarketPoolsToRevenuePool",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: "depositIntoPerpMarketFeePool",
      accounts: [
        {
          name: "state",
          isMut: true,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "sourceVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "quoteSpotMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "spotMarketVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "repegAmmCurve",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "newPegCandidate",
          type: "u128"
        }
      ]
    },
    {
      name: "updatePerpMarketAmmOracleTwap",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: false,
          isSigner: true
        }
      ],
      args: []
    },
    {
      name: "resetPerpMarketAmmOracleTwap",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: false,
          isSigner: true
        }
      ],
      args: []
    },
    {
      name: "updateK",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "sqrtK",
          type: "u128"
        }
      ]
    },
    {
      name: "updatePerpMarketMarginRatio",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marginRatioInitial",
          type: "u32"
        },
        {
          name: "marginRatioMaintenance",
          type: "u32"
        }
      ]
    },
    {
      name: "updatePerpMarketMaxImbalances",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "unrealizedMaxImbalance",
          type: "u64"
        },
        {
          name: "maxRevenueWithdrawPerPeriod",
          type: "u64"
        },
        {
          name: "quoteMaxInsurance",
          type: "u64"
        }
      ]
    },
    {
      name: "updatePerpMarketLiquidationFee",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "liquidatorFee",
          type: "u32"
        },
        {
          name: "ifLiquidationFee",
          type: "u32"
        }
      ]
    },
    {
      name: "updateInsuranceFundUnstakingPeriod",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "insuranceFundUnstakingPeriod",
          type: "i64"
        }
      ]
    },
    {
      name: "updateSpotMarketLiquidationFee",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "liquidatorFee",
          type: "u32"
        },
        {
          name: "ifLiquidationFee",
          type: "u32"
        }
      ]
    },
    {
      name: "updateWithdrawGuardThreshold",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "withdrawGuardThreshold",
          type: "u64"
        }
      ]
    },
    {
      name: "updateSpotMarketIfFactor",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "spotMarketIndex",
          type: "u16"
        },
        {
          name: "userIfFactor",
          type: "u32"
        },
        {
          name: "totalIfFactor",
          type: "u32"
        }
      ]
    },
    {
      name: "updateSpotMarketRevenueSettlePeriod",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "revenueSettlePeriod",
          type: "i64"
        }
      ]
    },
    {
      name: "updateSpotMarketStatus",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "status",
          type: {
            defined: "MarketStatus"
          }
        }
      ]
    },
    {
      name: "updateSpotMarketAssetTier",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "assetTier",
          type: {
            defined: "AssetTier"
          }
        }
      ]
    },
    {
      name: "updateSpotMarketMarginWeights",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "initialAssetWeight",
          type: "u32"
        },
        {
          name: "maintenanceAssetWeight",
          type: "u32"
        },
        {
          name: "initialLiabilityWeight",
          type: "u32"
        },
        {
          name: "maintenanceLiabilityWeight",
          type: "u32"
        },
        {
          name: "imfFactor",
          type: "u32"
        }
      ]
    },
    {
      name: "updateSpotMarketBorrowRate",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "optimalUtilization",
          type: "u32"
        },
        {
          name: "optimalBorrowRate",
          type: "u32"
        },
        {
          name: "maxBorrowRate",
          type: "u32"
        }
      ]
    },
    {
      name: "updateSpotMarketMaxTokenDeposits",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "maxTokenDeposits",
          type: "u64"
        }
      ]
    },
    {
      name: "updateSpotMarketOracle",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "oracle",
          type: "publicKey"
        },
        {
          name: "oracleSource",
          type: {
            defined: "OracleSource"
          }
        }
      ]
    },
    {
      name: "updateSpotMarketStepSizeAndTickSize",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "stepSize",
          type: "u64"
        },
        {
          name: "tickSize",
          type: "u64"
        }
      ]
    },
    {
      name: "updateSpotMarketMinOrderSize",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "orderSize",
          type: "u64"
        }
      ]
    },
    {
      name: "updateSpotMarketOrdersEnabled",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "ordersEnabled",
          type: "bool"
        }
      ]
    },
    {
      name: "updateSpotMarketName",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      name: "updatePerpMarketStatus",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "status",
          type: {
            defined: "MarketStatus"
          }
        }
      ]
    },
    {
      name: "updatePerpMarketContractTier",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "contractTier",
          type: {
            defined: "ContractTier"
          }
        }
      ]
    },
    {
      name: "updatePerpMarketImfFactor",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "imfFactor",
          type: "u32"
        },
        {
          name: "unrealizedPnlImfFactor",
          type: "u32"
        }
      ]
    },
    {
      name: "updatePerpMarketUnrealizedAssetWeight",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "unrealizedInitialAssetWeight",
          type: "u32"
        },
        {
          name: "unrealizedMaintenanceAssetWeight",
          type: "u32"
        }
      ]
    },
    {
      name: "updatePerpMarketConcentrationCoef",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "concentrationScale",
          type: "u128"
        }
      ]
    },
    {
      name: "updatePerpMarketCurveUpdateIntensity",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "curveUpdateIntensity",
          type: "u8"
        }
      ]
    },
    {
      name: "updateLpCooldownTime",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "lpCooldownTime",
          type: "u64"
        }
      ]
    },
    {
      name: "updatePerpFeeStructure",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "feeStructure",
          type: {
            defined: "FeeStructure"
          }
        }
      ]
    },
    {
      name: "updateSpotFeeStructure",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "feeStructure",
          type: {
            defined: "FeeStructure"
          }
        }
      ]
    },
    {
      name: "updateInitialPctToLiquidate",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "initialPctToLiquidate",
          type: "u16"
        }
      ]
    },
    {
      name: "updateLiquidationDuration",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "liquidationDuration",
          type: "u8"
        }
      ]
    },
    {
      name: "updateOracleGuardRails",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "oracleGuardRails",
          type: {
            defined: "OracleGuardRails"
          }
        }
      ]
    },
    {
      name: "updateStateSettlementDuration",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "settlementDuration",
          type: "u16"
        }
      ]
    },
    {
      name: "updatePerpMarketOracle",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false
        },
        {
          name: "admin",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "oracle",
          type: "publicKey"
        },
        {
          name: "oracleSource",
          type: {
            defined: "OracleSource"
          }
        }
      ]
    },
    {
      name: "updatePerpMarketBaseSpread",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "baseSpread",
          type: "u32"
        }
      ]
    },
    {
      name: "updateAmmJitIntensity",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "ammJitIntensity",
          type: "u8"
        }
      ]
    },
    {
      name: "updatePerpMarketMaxSpread",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "maxSpread",
          type: "u32"
        }
      ]
    },
    {
      name: "updatePerpMarketStepSizeAndTickSize",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "stepSize",
          type: "u64"
        },
        {
          name: "tickSize",
          type: "u64"
        }
      ]
    },
    {
      name: "updatePerpMarketName",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      name: "updatePerpMarketMinOrderSize",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "orderSize",
          type: "u64"
        }
      ]
    },
    {
      name: "updatePerpMarketMaxSlippageRatio",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "maxSlippageRatio",
          type: "u16"
        }
      ]
    },
    {
      name: "updatePerpMarketMaxFillReserveFraction",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "maxFillReserveFraction",
          type: "u16"
        }
      ]
    },
    {
      name: "updatePerpMarketMaxOpenInterest",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "perpMarket",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "maxOpenInterest",
          type: "u128"
        }
      ]
    },
    {
      name: "updateAdmin",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "admin",
          type: "publicKey"
        }
      ]
    },
    {
      name: "updateWhitelistMint",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "whitelistMint",
          type: "publicKey"
        }
      ]
    },
    {
      name: "updateDiscountMint",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "discountMint",
          type: "publicKey"
        }
      ]
    },
    {
      name: "updateExchangeStatus",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "exchangeStatus",
          type: {
            defined: "ExchangeStatus"
          }
        }
      ]
    },
    {
      name: "updatePerpAuctionDuration",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "minPerpAuctionDuration",
          type: "u8"
        }
      ]
    },
    {
      name: "updateSpotAuctionDuration",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: "defaultSpotAuctionDuration",
          type: "u8"
        }
      ]
    },
    {
      name: "adminRemoveInsuranceFundStake",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true
        },
        {
          name: "state",
          isMut: false,
          isSigner: false
        },
        {
          name: "spotMarket",
          isMut: false,
          isSigner: false
        },
        {
          name: "insuranceFundVault",
          isMut: true,
          isSigner: false
        },
        {
          name: "driftSigner",
          isMut: false,
          isSigner: false
        },
        {
          name: "adminTokenAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "marketIndex",
          type: "u16"
        },
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "InsuranceFundStake",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "ifShares",
            type: "u128"
          },
          {
            name: "lastWithdrawRequestShares",
            type: "u128"
          },
          {
            name: "ifBase",
            type: "u128"
          },
          {
            name: "lastValidTs",
            type: "i64"
          },
          {
            name: "lastWithdrawRequestValue",
            type: "u64"
          },
          {
            name: "lastWithdrawRequestTs",
            type: "i64"
          },
          {
            name: "costBasis",
            type: "i64"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                14
              ]
            }
          }
        ]
      }
    },
    {
      name: "PerpMarket",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pubkey",
            type: "publicKey"
          },
          {
            name: "amm",
            type: {
              defined: "AMM"
            }
          },
          {
            name: "pnlPool",
            type: {
              defined: "PoolBalance"
            }
          },
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "insuranceClaim",
            type: {
              defined: "InsuranceClaim"
            }
          },
          {
            name: "unrealizedPnlMaxImbalance",
            type: "u64"
          },
          {
            name: "expiryTs",
            type: "i64"
          },
          {
            name: "expiryPrice",
            type: "i64"
          },
          {
            name: "nextFillRecordId",
            type: "u64"
          },
          {
            name: "nextFundingRateRecordId",
            type: "u64"
          },
          {
            name: "nextCurveRecordId",
            type: "u64"
          },
          {
            name: "imfFactor",
            type: "u32"
          },
          {
            name: "unrealizedPnlImfFactor",
            type: "u32"
          },
          {
            name: "liquidatorFee",
            type: "u32"
          },
          {
            name: "ifLiquidationFee",
            type: "u32"
          },
          {
            name: "marginRatioInitial",
            type: "u32"
          },
          {
            name: "marginRatioMaintenance",
            type: "u32"
          },
          {
            name: "unrealizedPnlInitialAssetWeight",
            type: "u32"
          },
          {
            name: "unrealizedPnlMaintenanceAssetWeight",
            type: "u32"
          },
          {
            name: "numberOfUsersWithBase",
            type: "u32"
          },
          {
            name: "numberOfUsers",
            type: "u32"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "status",
            type: {
              defined: "MarketStatus"
            }
          },
          {
            name: "contractType",
            type: {
              defined: "ContractType"
            }
          },
          {
            name: "contractTier",
            type: {
              defined: "ContractTier"
            }
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                51
              ]
            }
          }
        ]
      }
    },
    {
      name: "SpotMarket",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pubkey",
            type: "publicKey"
          },
          {
            name: "oracle",
            type: "publicKey"
          },
          {
            name: "mint",
            type: "publicKey"
          },
          {
            name: "vault",
            type: "publicKey"
          },
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "historicalOracleData",
            type: {
              defined: "HistoricalOracleData"
            }
          },
          {
            name: "historicalIndexData",
            type: {
              defined: "HistoricalIndexData"
            }
          },
          {
            name: "revenuePool",
            type: {
              defined: "PoolBalance"
            }
          },
          {
            name: "spotFeePool",
            type: {
              defined: "PoolBalance"
            }
          },
          {
            name: "insuranceFund",
            type: {
              defined: "InsuranceFund"
            }
          },
          {
            name: "totalSpotFee",
            type: "u128"
          },
          {
            name: "depositBalance",
            type: "u128"
          },
          {
            name: "borrowBalance",
            type: "u128"
          },
          {
            name: "cumulativeDepositInterest",
            type: "u128"
          },
          {
            name: "cumulativeBorrowInterest",
            type: "u128"
          },
          {
            name: "totalSocialLoss",
            type: "u128"
          },
          {
            name: "totalQuoteSocialLoss",
            type: "u128"
          },
          {
            name: "withdrawGuardThreshold",
            type: "u64"
          },
          {
            name: "maxTokenDeposits",
            type: "u64"
          },
          {
            name: "depositTokenTwap",
            type: "u64"
          },
          {
            name: "borrowTokenTwap",
            type: "u64"
          },
          {
            name: "utilizationTwap",
            type: "u64"
          },
          {
            name: "lastInterestTs",
            type: "u64"
          },
          {
            name: "lastTwapTs",
            type: "u64"
          },
          {
            name: "expiryTs",
            type: "i64"
          },
          {
            name: "orderStepSize",
            type: "u64"
          },
          {
            name: "orderTickSize",
            type: "u64"
          },
          {
            name: "minOrderSize",
            type: "u64"
          },
          {
            name: "maxPositionSize",
            type: "u64"
          },
          {
            name: "nextFillRecordId",
            type: "u64"
          },
          {
            name: "nextDepositRecordId",
            type: "u64"
          },
          {
            name: "initialAssetWeight",
            type: "u32"
          },
          {
            name: "maintenanceAssetWeight",
            type: "u32"
          },
          {
            name: "initialLiabilityWeight",
            type: "u32"
          },
          {
            name: "maintenanceLiabilityWeight",
            type: "u32"
          },
          {
            name: "imfFactor",
            type: "u32"
          },
          {
            name: "liquidatorFee",
            type: "u32"
          },
          {
            name: "ifLiquidationFee",
            type: "u32"
          },
          {
            name: "optimalUtilization",
            type: "u32"
          },
          {
            name: "optimalBorrowRate",
            type: "u32"
          },
          {
            name: "maxBorrowRate",
            type: "u32"
          },
          {
            name: "decimals",
            type: "u32"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "ordersEnabled",
            type: "bool"
          },
          {
            name: "oracleSource",
            type: {
              defined: "OracleSource"
            }
          },
          {
            name: "status",
            type: {
              defined: "MarketStatus"
            }
          },
          {
            name: "assetTier",
            type: {
              defined: "AssetTier"
            }
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                86
              ]
            }
          }
        ]
      }
    },
    {
      name: "SerumV3FulfillmentConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pubkey",
            type: "publicKey"
          },
          {
            name: "serumProgramId",
            type: "publicKey"
          },
          {
            name: "serumMarket",
            type: "publicKey"
          },
          {
            name: "serumRequestQueue",
            type: "publicKey"
          },
          {
            name: "serumEventQueue",
            type: "publicKey"
          },
          {
            name: "serumBids",
            type: "publicKey"
          },
          {
            name: "serumAsks",
            type: "publicKey"
          },
          {
            name: "serumBaseVault",
            type: "publicKey"
          },
          {
            name: "serumQuoteVault",
            type: "publicKey"
          },
          {
            name: "serumOpenOrders",
            type: "publicKey"
          },
          {
            name: "serumSignerNonce",
            type: "u64"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "fulfillmentType",
            type: {
              defined: "SpotFulfillmentType"
            }
          },
          {
            name: "status",
            type: {
              defined: "SpotFulfillmentConfigStatus"
            }
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                4
              ]
            }
          }
        ]
      }
    },
    {
      name: "State",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "publicKey"
          },
          {
            name: "whitelistMint",
            type: "publicKey"
          },
          {
            name: "discountMint",
            type: "publicKey"
          },
          {
            name: "signer",
            type: "publicKey"
          },
          {
            name: "srmVault",
            type: "publicKey"
          },
          {
            name: "perpFeeStructure",
            type: {
              defined: "FeeStructure"
            }
          },
          {
            name: "spotFeeStructure",
            type: {
              defined: "FeeStructure"
            }
          },
          {
            name: "oracleGuardRails",
            type: {
              defined: "OracleGuardRails"
            }
          },
          {
            name: "numberOfAuthorities",
            type: "u64"
          },
          {
            name: "numberOfSubAccounts",
            type: "u64"
          },
          {
            name: "lpCooldownTime",
            type: "u64"
          },
          {
            name: "liquidationMarginBufferRatio",
            type: "u32"
          },
          {
            name: "settlementDuration",
            type: "u16"
          },
          {
            name: "numberOfMarkets",
            type: "u16"
          },
          {
            name: "numberOfSpotMarkets",
            type: "u16"
          },
          {
            name: "signerNonce",
            type: "u8"
          },
          {
            name: "minPerpAuctionDuration",
            type: "u8"
          },
          {
            name: "defaultMarketOrderTimeInForce",
            type: "u8"
          },
          {
            name: "defaultSpotAuctionDuration",
            type: "u8"
          },
          {
            name: "exchangeStatus",
            type: {
              defined: "ExchangeStatus"
            }
          },
          {
            name: "liquidationDuration",
            type: "u8"
          },
          {
            name: "initialPctToLiquidate",
            type: "u16"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                14
              ]
            }
          }
        ]
      }
    },
    {
      name: "User",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "delegate",
            type: "publicKey"
          },
          {
            name: "name",
            type: {
              array: [
                "u8",
                32
              ]
            }
          },
          {
            name: "spotPositions",
            type: {
              array: [
                {
                  defined: "SpotPosition"
                },
                8
              ]
            }
          },
          {
            name: "perpPositions",
            type: {
              array: [
                {
                  defined: "PerpPosition"
                },
                8
              ]
            }
          },
          {
            name: "orders",
            type: {
              array: [
                {
                  defined: "Order"
                },
                32
              ]
            }
          },
          {
            name: "lastAddPerpLpSharesTs",
            type: "i64"
          },
          {
            name: "totalDeposits",
            type: "u64"
          },
          {
            name: "totalWithdraws",
            type: "u64"
          },
          {
            name: "totalSocialLoss",
            type: "u64"
          },
          {
            name: "settledPerpPnl",
            type: "i64"
          },
          {
            name: "cumulativeSpotFees",
            type: "i64"
          },
          {
            name: "cumulativePerpFunding",
            type: "i64"
          },
          {
            name: "liquidationMarginFreed",
            type: "u64"
          },
          {
            name: "liquidationStartSlot",
            type: "u64"
          },
          {
            name: "nextOrderId",
            type: "u32"
          },
          {
            name: "maxMarginRatio",
            type: "u32"
          },
          {
            name: "nextLiquidationId",
            type: "u16"
          },
          {
            name: "subAccountId",
            type: "u16"
          },
          {
            name: "status",
            type: {
              defined: "UserStatus"
            }
          },
          {
            name: "isMarginTradingEnabled",
            type: "bool"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                26
              ]
            }
          }
        ]
      }
    },
    {
      name: "UserStats",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey"
          },
          {
            name: "referrer",
            type: "publicKey"
          },
          {
            name: "fees",
            type: {
              defined: "UserFees"
            }
          },
          {
            name: "nextEpochTs",
            type: "i64"
          },
          {
            name: "makerVolume30d",
            type: "u64"
          },
          {
            name: "takerVolume30d",
            type: "u64"
          },
          {
            name: "fillerVolume30d",
            type: "u64"
          },
          {
            name: "lastMakerVolume30dTs",
            type: "i64"
          },
          {
            name: "lastTakerVolume30dTs",
            type: "i64"
          },
          {
            name: "lastFillerVolume30dTs",
            type: "i64"
          },
          {
            name: "ifStakedQuoteAssetAmount",
            type: "u64"
          },
          {
            name: "numberOfSubAccounts",
            type: "u16"
          },
          {
            name: "numberOfSubAccountsCreated",
            type: "u16"
          },
          {
            name: "isReferrer",
            type: "bool"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                51
              ]
            }
          }
        ]
      }
    }
  ],
  types: [
    {
      name: "OrderParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "orderType",
            type: {
              defined: "OrderType"
            }
          },
          {
            name: "marketType",
            type: {
              defined: "MarketType"
            }
          },
          {
            name: "direction",
            type: {
              defined: "PositionDirection"
            }
          },
          {
            name: "userOrderId",
            type: "u8"
          },
          {
            name: "baseAssetAmount",
            type: "u64"
          },
          {
            name: "price",
            type: "u64"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "reduceOnly",
            type: "bool"
          },
          {
            name: "postOnly",
            type: "bool"
          },
          {
            name: "immediateOrCancel",
            type: "bool"
          },
          {
            name: "maxTs",
            type: {
              option: "i64"
            }
          },
          {
            name: "triggerPrice",
            type: {
              option: "u64"
            }
          },
          {
            name: "triggerCondition",
            type: {
              defined: "OrderTriggerCondition"
            }
          },
          {
            name: "oraclePriceOffset",
            type: {
              option: "i32"
            }
          },
          {
            name: "auctionDuration",
            type: {
              option: "u8"
            }
          },
          {
            name: "auctionStartPrice",
            type: {
              option: "i64"
            }
          },
          {
            name: "auctionEndPrice",
            type: {
              option: "i64"
            }
          }
        ]
      }
    },
    {
      name: "LiquidatePerpRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "oraclePrice",
            type: "i64"
          },
          {
            name: "baseAssetAmount",
            type: "i64"
          },
          {
            name: "quoteAssetAmount",
            type: "i64"
          },
          {
            name: "lpShares",
            type: "u64"
          },
          {
            name: "fillRecordId",
            type: "u64"
          },
          {
            name: "userOrderId",
            type: "u32"
          },
          {
            name: "liquidatorOrderId",
            type: "u32"
          },
          {
            name: "liquidatorFee",
            type: "u64"
          },
          {
            name: "ifFee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "LiquidateSpotRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "assetMarketIndex",
            type: "u16"
          },
          {
            name: "assetPrice",
            type: "i64"
          },
          {
            name: "assetTransfer",
            type: "u128"
          },
          {
            name: "liabilityMarketIndex",
            type: "u16"
          },
          {
            name: "liabilityPrice",
            type: "i64"
          },
          {
            name: "liabilityTransfer",
            type: "u128"
          },
          {
            name: "ifFee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "LiquidateBorrowForPerpPnlRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "perpMarketIndex",
            type: "u16"
          },
          {
            name: "marketOraclePrice",
            type: "i64"
          },
          {
            name: "pnlTransfer",
            type: "u128"
          },
          {
            name: "liabilityMarketIndex",
            type: "u16"
          },
          {
            name: "liabilityPrice",
            type: "i64"
          },
          {
            name: "liabilityTransfer",
            type: "u128"
          }
        ]
      }
    },
    {
      name: "LiquidatePerpPnlForDepositRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "perpMarketIndex",
            type: "u16"
          },
          {
            name: "marketOraclePrice",
            type: "i64"
          },
          {
            name: "pnlTransfer",
            type: "u128"
          },
          {
            name: "assetMarketIndex",
            type: "u16"
          },
          {
            name: "assetPrice",
            type: "i64"
          },
          {
            name: "assetTransfer",
            type: "u128"
          }
        ]
      }
    },
    {
      name: "PerpBankruptcyRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "pnl",
            type: "i128"
          },
          {
            name: "ifPayment",
            type: "u128"
          },
          {
            name: "clawbackUser",
            type: {
              option: "publicKey"
            }
          },
          {
            name: "clawbackUserPayment",
            type: {
              option: "u128"
            }
          },
          {
            name: "cumulativeFundingRateDelta",
            type: "i128"
          }
        ]
      }
    },
    {
      name: "SpotBankruptcyRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "borrowAmount",
            type: "u128"
          },
          {
            name: "ifPayment",
            type: "u128"
          },
          {
            name: "cumulativeDepositInterestDelta",
            type: "u128"
          }
        ]
      }
    },
    {
      name: "HistoricalOracleData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "lastOraclePrice",
            type: "i64"
          },
          {
            name: "lastOracleConf",
            type: "u64"
          },
          {
            name: "lastOracleDelay",
            type: "i64"
          },
          {
            name: "lastOraclePriceTwap",
            type: "i64"
          },
          {
            name: "lastOraclePriceTwap5min",
            type: "i64"
          },
          {
            name: "lastOraclePriceTwapTs",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "HistoricalIndexData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "lastIndexBidPrice",
            type: "u64"
          },
          {
            name: "lastIndexAskPrice",
            type: "u64"
          },
          {
            name: "lastIndexPriceTwap",
            type: "u64"
          },
          {
            name: "lastIndexPriceTwap5min",
            type: "u64"
          },
          {
            name: "lastIndexPriceTwapTs",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "InsuranceClaim",
      type: {
        kind: "struct",
        fields: [
          {
            name: "revenueWithdrawSinceLastSettle",
            type: "u64"
          },
          {
            name: "maxRevenueWithdrawPerPeriod",
            type: "u64"
          },
          {
            name: "quoteMaxInsurance",
            type: "u64"
          },
          {
            name: "quoteSettledInsurance",
            type: "u64"
          },
          {
            name: "lastRevenueWithdrawTs",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "PoolBalance",
      type: {
        kind: "struct",
        fields: [
          {
            name: "scaledBalance",
            type: "u128"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                6
              ]
            }
          }
        ]
      }
    },
    {
      name: "AMM",
      type: {
        kind: "struct",
        fields: [
          {
            name: "oracle",
            type: "publicKey"
          },
          {
            name: "historicalOracleData",
            type: {
              defined: "HistoricalOracleData"
            }
          },
          {
            name: "baseAssetAmountPerLp",
            type: "i128"
          },
          {
            name: "quoteAssetAmountPerLp",
            type: "i128"
          },
          {
            name: "feePool",
            type: {
              defined: "PoolBalance"
            }
          },
          {
            name: "baseAssetReserve",
            type: "u128"
          },
          {
            name: "quoteAssetReserve",
            type: "u128"
          },
          {
            name: "concentrationCoef",
            type: "u128"
          },
          {
            name: "minBaseAssetReserve",
            type: "u128"
          },
          {
            name: "maxBaseAssetReserve",
            type: "u128"
          },
          {
            name: "sqrtK",
            type: "u128"
          },
          {
            name: "pegMultiplier",
            type: "u128"
          },
          {
            name: "terminalQuoteAssetReserve",
            type: "u128"
          },
          {
            name: "baseAssetAmountLong",
            type: "i128"
          },
          {
            name: "baseAssetAmountShort",
            type: "i128"
          },
          {
            name: "baseAssetAmountWithAmm",
            type: "i128"
          },
          {
            name: "baseAssetAmountWithUnsettledLp",
            type: "i128"
          },
          {
            name: "maxOpenInterest",
            type: "u128"
          },
          {
            name: "quoteAssetAmount",
            type: "i128"
          },
          {
            name: "quoteEntryAmountLong",
            type: "i128"
          },
          {
            name: "quoteEntryAmountShort",
            type: "i128"
          },
          {
            name: "quoteBreakEvenAmountLong",
            type: "i128"
          },
          {
            name: "quoteBreakEvenAmountShort",
            type: "i128"
          },
          {
            name: "userLpShares",
            type: "u128"
          },
          {
            name: "lastFundingRate",
            type: "i64"
          },
          {
            name: "lastFundingRateLong",
            type: "i64"
          },
          {
            name: "lastFundingRateShort",
            type: "i64"
          },
          {
            name: "last24hAvgFundingRate",
            type: "i64"
          },
          {
            name: "totalFee",
            type: "i128"
          },
          {
            name: "totalMmFee",
            type: "i128"
          },
          {
            name: "totalExchangeFee",
            type: "u128"
          },
          {
            name: "totalFeeMinusDistributions",
            type: "i128"
          },
          {
            name: "totalFeeWithdrawn",
            type: "u128"
          },
          {
            name: "totalLiquidationFee",
            type: "u128"
          },
          {
            name: "cumulativeFundingRateLong",
            type: "i128"
          },
          {
            name: "cumulativeFundingRateShort",
            type: "i128"
          },
          {
            name: "totalSocialLoss",
            type: "u128"
          },
          {
            name: "askBaseAssetReserve",
            type: "u128"
          },
          {
            name: "askQuoteAssetReserve",
            type: "u128"
          },
          {
            name: "bidBaseAssetReserve",
            type: "u128"
          },
          {
            name: "bidQuoteAssetReserve",
            type: "u128"
          },
          {
            name: "lastOracleNormalisedPrice",
            type: "i64"
          },
          {
            name: "lastOracleReservePriceSpreadPct",
            type: "i64"
          },
          {
            name: "lastBidPriceTwap",
            type: "u64"
          },
          {
            name: "lastAskPriceTwap",
            type: "u64"
          },
          {
            name: "lastMarkPriceTwap",
            type: "u64"
          },
          {
            name: "lastMarkPriceTwap5min",
            type: "u64"
          },
          {
            name: "lastUpdateSlot",
            type: "u64"
          },
          {
            name: "lastOracleConfPct",
            type: "u64"
          },
          {
            name: "netRevenueSinceLastFunding",
            type: "i64"
          },
          {
            name: "lastFundingRateTs",
            type: "i64"
          },
          {
            name: "fundingPeriod",
            type: "i64"
          },
          {
            name: "orderStepSize",
            type: "u64"
          },
          {
            name: "orderTickSize",
            type: "u64"
          },
          {
            name: "minOrderSize",
            type: "u64"
          },
          {
            name: "maxPositionSize",
            type: "u64"
          },
          {
            name: "volume24h",
            type: "u64"
          },
          {
            name: "longIntensityVolume",
            type: "u64"
          },
          {
            name: "shortIntensityVolume",
            type: "u64"
          },
          {
            name: "lastTradeTs",
            type: "i64"
          },
          {
            name: "markStd",
            type: "u64"
          },
          {
            name: "oracleStd",
            type: "u64"
          },
          {
            name: "lastMarkPriceTwapTs",
            type: "i64"
          },
          {
            name: "baseSpread",
            type: "u32"
          },
          {
            name: "maxSpread",
            type: "u32"
          },
          {
            name: "longSpread",
            type: "u32"
          },
          {
            name: "shortSpread",
            type: "u32"
          },
          {
            name: "longIntensityCount",
            type: "u32"
          },
          {
            name: "shortIntensityCount",
            type: "u32"
          },
          {
            name: "maxFillReserveFraction",
            type: "u16"
          },
          {
            name: "maxSlippageRatio",
            type: "u16"
          },
          {
            name: "curveUpdateIntensity",
            type: "u8"
          },
          {
            name: "ammJitIntensity",
            type: "u8"
          },
          {
            name: "oracleSource",
            type: {
              defined: "OracleSource"
            }
          },
          {
            name: "lastOracleValid",
            type: "bool"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                48
              ]
            }
          }
        ]
      }
    },
    {
      name: "InsuranceFund",
      type: {
        kind: "struct",
        fields: [
          {
            name: "vault",
            type: "publicKey"
          },
          {
            name: "totalShares",
            type: "u128"
          },
          {
            name: "userShares",
            type: "u128"
          },
          {
            name: "sharesBase",
            type: "u128"
          },
          {
            name: "unstakingPeriod",
            type: "i64"
          },
          {
            name: "lastRevenueSettleTs",
            type: "i64"
          },
          {
            name: "revenueSettlePeriod",
            type: "i64"
          },
          {
            name: "totalFactor",
            type: "u32"
          },
          {
            name: "userFactor",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "OracleGuardRails",
      type: {
        kind: "struct",
        fields: [
          {
            name: "priceDivergence",
            type: {
              defined: "PriceDivergenceGuardRails"
            }
          },
          {
            name: "validity",
            type: {
              defined: "ValidityGuardRails"
            }
          }
        ]
      }
    },
    {
      name: "PriceDivergenceGuardRails",
      type: {
        kind: "struct",
        fields: [
          {
            name: "markOracleDivergenceNumerator",
            type: "u64"
          },
          {
            name: "markOracleDivergenceDenominator",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "ValidityGuardRails",
      type: {
        kind: "struct",
        fields: [
          {
            name: "slotsBeforeStaleForAmm",
            type: "i64"
          },
          {
            name: "slotsBeforeStaleForMargin",
            type: "i64"
          },
          {
            name: "confidenceIntervalMaxSize",
            type: "u64"
          },
          {
            name: "tooVolatileRatio",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "FeeStructure",
      type: {
        kind: "struct",
        fields: [
          {
            name: "feeTiers",
            type: {
              array: [
                {
                  defined: "FeeTier"
                },
                10
              ]
            }
          },
          {
            name: "fillerRewardStructure",
            type: {
              defined: "OrderFillerRewardStructure"
            }
          },
          {
            name: "referrerRewardEpochUpperBound",
            type: "u64"
          },
          {
            name: "flatFillerFee",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "FeeTier",
      type: {
        kind: "struct",
        fields: [
          {
            name: "feeNumerator",
            type: "u32"
          },
          {
            name: "feeDenominator",
            type: "u32"
          },
          {
            name: "makerRebateNumerator",
            type: "u32"
          },
          {
            name: "makerRebateDenominator",
            type: "u32"
          },
          {
            name: "referrerRewardNumerator",
            type: "u32"
          },
          {
            name: "referrerRewardDenominator",
            type: "u32"
          },
          {
            name: "refereeFeeNumerator",
            type: "u32"
          },
          {
            name: "refereeFeeDenominator",
            type: "u32"
          }
        ]
      }
    },
    {
      name: "OrderFillerRewardStructure",
      type: {
        kind: "struct",
        fields: [
          {
            name: "rewardNumerator",
            type: "u32"
          },
          {
            name: "rewardDenominator",
            type: "u32"
          },
          {
            name: "timeBasedRewardLowerBound",
            type: "u128"
          }
        ]
      }
    },
    {
      name: "UserFees",
      type: {
        kind: "struct",
        fields: [
          {
            name: "totalFeePaid",
            type: "u64"
          },
          {
            name: "totalFeeRebate",
            type: "u64"
          },
          {
            name: "totalTokenDiscount",
            type: "u64"
          },
          {
            name: "totalRefereeDiscount",
            type: "u64"
          },
          {
            name: "totalReferrerReward",
            type: "u64"
          },
          {
            name: "currentEpochReferrerReward",
            type: "u64"
          }
        ]
      }
    },
    {
      name: "SpotPosition",
      type: {
        kind: "struct",
        fields: [
          {
            name: "scaledBalance",
            type: "u64"
          },
          {
            name: "openBids",
            type: "i64"
          },
          {
            name: "openAsks",
            type: "i64"
          },
          {
            name: "cumulativeDeposits",
            type: "i64"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "balanceType",
            type: {
              defined: "SpotBalanceType"
            }
          },
          {
            name: "openOrders",
            type: "u8"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                4
              ]
            }
          }
        ]
      }
    },
    {
      name: "PerpPosition",
      type: {
        kind: "struct",
        fields: [
          {
            name: "lastCumulativeFundingRate",
            type: "i64"
          },
          {
            name: "baseAssetAmount",
            type: "i64"
          },
          {
            name: "quoteAssetAmount",
            type: "i64"
          },
          {
            name: "quoteBreakEvenAmount",
            type: "i64"
          },
          {
            name: "quoteEntryAmount",
            type: "i64"
          },
          {
            name: "openBids",
            type: "i64"
          },
          {
            name: "openAsks",
            type: "i64"
          },
          {
            name: "settledPnl",
            type: "i64"
          },
          {
            name: "lpShares",
            type: "u64"
          },
          {
            name: "lastBaseAssetAmountPerLp",
            type: "i64"
          },
          {
            name: "lastQuoteAssetAmountPerLp",
            type: "i64"
          },
          {
            name: "remainderBaseAssetAmount",
            type: "i32"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "openOrders",
            type: "u8"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      name: "Order",
      type: {
        kind: "struct",
        fields: [
          {
            name: "slot",
            type: "u64"
          },
          {
            name: "price",
            type: "u64"
          },
          {
            name: "baseAssetAmount",
            type: "u64"
          },
          {
            name: "baseAssetAmountFilled",
            type: "u64"
          },
          {
            name: "quoteAssetAmountFilled",
            type: "u64"
          },
          {
            name: "triggerPrice",
            type: "u64"
          },
          {
            name: "auctionStartPrice",
            type: "i64"
          },
          {
            name: "auctionEndPrice",
            type: "i64"
          },
          {
            name: "maxTs",
            type: "i64"
          },
          {
            name: "oraclePriceOffset",
            type: "i32"
          },
          {
            name: "orderId",
            type: "u32"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "status",
            type: {
              defined: "OrderStatus"
            }
          },
          {
            name: "orderType",
            type: {
              defined: "OrderType"
            }
          },
          {
            name: "marketType",
            type: {
              defined: "MarketType"
            }
          },
          {
            name: "userOrderId",
            type: "u8"
          },
          {
            name: "existingPositionDirection",
            type: {
              defined: "PositionDirection"
            }
          },
          {
            name: "direction",
            type: {
              defined: "PositionDirection"
            }
          },
          {
            name: "reduceOnly",
            type: "bool"
          },
          {
            name: "postOnly",
            type: "bool"
          },
          {
            name: "immediateOrCancel",
            type: "bool"
          },
          {
            name: "triggerCondition",
            type: {
              defined: "OrderTriggerCondition"
            }
          },
          {
            name: "auctionDuration",
            type: "u8"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                3
              ]
            }
          }
        ]
      }
    },
    {
      name: "SwapDirection",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Add"
          },
          {
            name: "Remove"
          }
        ]
      }
    },
    {
      name: "PositionDirection",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Long"
          },
          {
            name: "Short"
          }
        ]
      }
    },
    {
      name: "SpotFulfillmentType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "SerumV3"
          },
          {
            name: "None"
          }
        ]
      }
    },
    {
      name: "TwapPeriod",
      type: {
        kind: "enum",
        variants: [
          {
            name: "FundingPeriod"
          },
          {
            name: "FiveMin"
          }
        ]
      }
    },
    {
      name: "LiquidationMultiplierType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Discount"
          },
          {
            name: "Premium"
          }
        ]
      }
    },
    {
      name: "MarginRequirementType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Initial"
          },
          {
            name: "Maintenance"
          }
        ]
      }
    },
    {
      name: "OracleValidity",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Invalid"
          },
          {
            name: "TooVolatile"
          },
          {
            name: "TooUncertain"
          },
          {
            name: "StaleForMargin"
          },
          {
            name: "InsufficientDataPoints"
          },
          {
            name: "StaleForAMM"
          },
          {
            name: "Valid"
          }
        ]
      }
    },
    {
      name: "DriftAction",
      type: {
        kind: "enum",
        variants: [
          {
            name: "UpdateFunding"
          },
          {
            name: "SettlePnl"
          },
          {
            name: "TriggerOrder"
          },
          {
            name: "FillOrderMatch"
          },
          {
            name: "FillOrderAmm"
          },
          {
            name: "Liquidate"
          },
          {
            name: "MarginCalc"
          },
          {
            name: "UpdateTwap"
          },
          {
            name: "UpdateAMMCurve"
          }
        ]
      }
    },
    {
      name: "PositionUpdateType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Open"
          },
          {
            name: "Increase"
          },
          {
            name: "Reduce"
          },
          {
            name: "Close"
          },
          {
            name: "Flip"
          }
        ]
      }
    },
    {
      name: "DepositExplanation",
      type: {
        kind: "enum",
        variants: [
          {
            name: "None"
          },
          {
            name: "Transfer"
          }
        ]
      }
    },
    {
      name: "DepositDirection",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Deposit"
          },
          {
            name: "Withdraw"
          }
        ]
      }
    },
    {
      name: "OrderAction",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Place"
          },
          {
            name: "Cancel"
          },
          {
            name: "Fill"
          },
          {
            name: "Trigger"
          },
          {
            name: "Expire"
          }
        ]
      }
    },
    {
      name: "OrderActionExplanation",
      type: {
        kind: "enum",
        variants: [
          {
            name: "None"
          },
          {
            name: "InsufficientFreeCollateral"
          },
          {
            name: "OraclePriceBreachedLimitPrice"
          },
          {
            name: "MarketOrderFilledToLimitPrice"
          },
          {
            name: "OrderExpired"
          },
          {
            name: "Liquidation"
          },
          {
            name: "OrderFilledWithAMM"
          },
          {
            name: "OrderFilledWithAMMJit"
          },
          {
            name: "OrderFilledWithMatch"
          },
          {
            name: "OrderFilledWithMatchJit"
          },
          {
            name: "MarketExpired"
          },
          {
            name: "RiskingIncreasingOrder"
          },
          {
            name: "ReduceOnlyOrderIncreasedPosition"
          },
          {
            name: "OrderFillWithSerum"
          },
          {
            name: "NoBorrowLiquidity"
          }
        ]
      }
    },
    {
      name: "LPAction",
      type: {
        kind: "enum",
        variants: [
          {
            name: "AddLiquidity"
          },
          {
            name: "RemoveLiquidity"
          },
          {
            name: "SettleLiquidity"
          }
        ]
      }
    },
    {
      name: "LiquidationType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "LiquidatePerp"
          },
          {
            name: "LiquidateSpot"
          },
          {
            name: "LiquidateBorrowForPerpPnl"
          },
          {
            name: "LiquidatePerpPnlForDeposit"
          },
          {
            name: "PerpBankruptcy"
          },
          {
            name: "SpotBankruptcy"
          }
        ]
      }
    },
    {
      name: "SettlePnlExplanation",
      type: {
        kind: "enum",
        variants: [
          {
            name: "None"
          },
          {
            name: "ExpiredPosition"
          }
        ]
      }
    },
    {
      name: "StakeAction",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Stake"
          },
          {
            name: "UnstakeRequest"
          },
          {
            name: "UnstakeCancelRequest"
          },
          {
            name: "Unstake"
          }
        ]
      }
    },
    {
      name: "PerpFulfillmentMethod",
      type: {
        kind: "enum",
        variants: [
          {
            name: "AMM",
            fields: [
              {
                option: "u64"
              }
            ]
          },
          {
            name: "Match"
          }
        ]
      }
    },
    {
      name: "SpotFulfillmentMethod",
      type: {
        kind: "enum",
        variants: [
          {
            name: "SerumV3"
          },
          {
            name: "Match"
          }
        ]
      }
    },
    {
      name: "OracleSource",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Pyth"
          },
          {
            name: "Switchboard"
          },
          {
            name: "QuoteAsset"
          }
        ]
      }
    },
    {
      name: "MarketStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Initialized"
          },
          {
            name: "Active"
          },
          {
            name: "FundingPaused"
          },
          {
            name: "AmmPaused"
          },
          {
            name: "FillPaused"
          },
          {
            name: "WithdrawPaused"
          },
          {
            name: "ReduceOnly"
          },
          {
            name: "Settlement"
          },
          {
            name: "Delisted"
          }
        ]
      }
    },
    {
      name: "ContractType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Perpetual"
          },
          {
            name: "Future"
          }
        ]
      }
    },
    {
      name: "ContractTier",
      type: {
        kind: "enum",
        variants: [
          {
            name: "A"
          },
          {
            name: "B"
          },
          {
            name: "C"
          },
          {
            name: "Speculative"
          },
          {
            name: "Isolated"
          }
        ]
      }
    },
    {
      name: "SpotBalanceType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Deposit"
          },
          {
            name: "Borrow"
          }
        ]
      }
    },
    {
      name: "SpotFulfillmentConfigStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Enabled"
          },
          {
            name: "Disabled"
          }
        ]
      }
    },
    {
      name: "AssetTier",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Collateral"
          },
          {
            name: "Protected"
          },
          {
            name: "Cross"
          },
          {
            name: "Isolated"
          },
          {
            name: "Unlisted"
          }
        ]
      }
    },
    {
      name: "ExchangeStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active"
          },
          {
            name: "FundingPaused"
          },
          {
            name: "AmmPaused"
          },
          {
            name: "FillPaused"
          },
          {
            name: "LiqPaused"
          },
          {
            name: "WithdrawPaused"
          },
          {
            name: "Paused"
          }
        ]
      }
    },
    {
      name: "UserStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active"
          },
          {
            name: "BeingLiquidated"
          },
          {
            name: "Bankrupt"
          }
        ]
      }
    },
    {
      name: "AssetType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Base"
          },
          {
            name: "Quote"
          }
        ]
      }
    },
    {
      name: "OrderStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Init"
          },
          {
            name: "Open"
          },
          {
            name: "Filled"
          },
          {
            name: "Canceled"
          }
        ]
      }
    },
    {
      name: "OrderType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Market"
          },
          {
            name: "Limit"
          },
          {
            name: "TriggerMarket"
          },
          {
            name: "TriggerLimit"
          },
          {
            name: "Oracle"
          }
        ]
      }
    },
    {
      name: "OrderTriggerCondition",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Above"
          },
          {
            name: "Below"
          },
          {
            name: "TriggeredAbove"
          },
          {
            name: "TriggeredBelow"
          }
        ]
      }
    },
    {
      name: "MarketType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Spot"
          },
          {
            name: "Perp"
          }
        ]
      }
    }
  ],
  events: [
    {
      name: "NewUserRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "userAuthority",
          type: "publicKey",
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "subAccountId",
          type: "u16",
          index: false
        },
        {
          name: "name",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "referrer",
          type: "publicKey",
          index: false
        }
      ]
    },
    {
      name: "DepositRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "userAuthority",
          type: "publicKey",
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "direction",
          type: {
            defined: "DepositDirection"
          },
          index: false
        },
        {
          name: "depositRecordId",
          type: "u64",
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "oraclePrice",
          type: "i64",
          index: false
        },
        {
          name: "marketDepositBalance",
          type: "u128",
          index: false
        },
        {
          name: "marketWithdrawBalance",
          type: "u128",
          index: false
        },
        {
          name: "marketCumulativeDepositInterest",
          type: "u128",
          index: false
        },
        {
          name: "marketCumulativeBorrowInterest",
          type: "u128",
          index: false
        },
        {
          name: "totalDepositsAfter",
          type: "u64",
          index: false
        },
        {
          name: "totalWithdrawsAfter",
          type: "u64",
          index: false
        },
        {
          name: "explanation",
          type: {
            defined: "DepositExplanation"
          },
          index: false
        },
        {
          name: "transferUser",
          type: {
            option: "publicKey"
          },
          index: false
        }
      ]
    },
    {
      name: "SpotInterestRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "depositBalance",
          type: "u128",
          index: false
        },
        {
          name: "cumulativeDepositInterest",
          type: "u128",
          index: false
        },
        {
          name: "borrowBalance",
          type: "u128",
          index: false
        },
        {
          name: "cumulativeBorrowInterest",
          type: "u128",
          index: false
        },
        {
          name: "optimalUtilization",
          type: "u32",
          index: false
        },
        {
          name: "optimalBorrowRate",
          type: "u32",
          index: false
        },
        {
          name: "maxBorrowRate",
          type: "u32",
          index: false
        }
      ]
    },
    {
      name: "FundingPaymentRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "userAuthority",
          type: "publicKey",
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "fundingPayment",
          type: "i64",
          index: false
        },
        {
          name: "baseAssetAmount",
          type: "i64",
          index: false
        },
        {
          name: "userLastCumulativeFunding",
          type: "i64",
          index: false
        },
        {
          name: "ammCumulativeFundingLong",
          type: "i128",
          index: false
        },
        {
          name: "ammCumulativeFundingShort",
          type: "i128",
          index: false
        }
      ]
    },
    {
      name: "FundingRateRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "recordId",
          type: "u64",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "fundingRate",
          type: "i64",
          index: false
        },
        {
          name: "fundingRateLong",
          type: "i128",
          index: false
        },
        {
          name: "fundingRateShort",
          type: "i128",
          index: false
        },
        {
          name: "cumulativeFundingRateLong",
          type: "i128",
          index: false
        },
        {
          name: "cumulativeFundingRateShort",
          type: "i128",
          index: false
        },
        {
          name: "oraclePriceTwap",
          type: "i64",
          index: false
        },
        {
          name: "markPriceTwap",
          type: "u64",
          index: false
        },
        {
          name: "periodRevenue",
          type: "i64",
          index: false
        },
        {
          name: "baseAssetAmountWithAmm",
          type: "i128",
          index: false
        },
        {
          name: "baseAssetAmountWithUnsettledLp",
          type: "i128",
          index: false
        }
      ]
    },
    {
      name: "CurveRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "recordId",
          type: "u64",
          index: false
        },
        {
          name: "pegMultiplierBefore",
          type: "u128",
          index: false
        },
        {
          name: "baseAssetReserveBefore",
          type: "u128",
          index: false
        },
        {
          name: "quoteAssetReserveBefore",
          type: "u128",
          index: false
        },
        {
          name: "sqrtKBefore",
          type: "u128",
          index: false
        },
        {
          name: "pegMultiplierAfter",
          type: "u128",
          index: false
        },
        {
          name: "baseAssetReserveAfter",
          type: "u128",
          index: false
        },
        {
          name: "quoteAssetReserveAfter",
          type: "u128",
          index: false
        },
        {
          name: "sqrtKAfter",
          type: "u128",
          index: false
        },
        {
          name: "baseAssetAmountLong",
          type: "u128",
          index: false
        },
        {
          name: "baseAssetAmountShort",
          type: "u128",
          index: false
        },
        {
          name: "baseAssetAmountWithAmm",
          type: "i128",
          index: false
        },
        {
          name: "totalFee",
          type: "i128",
          index: false
        },
        {
          name: "totalFeeMinusDistributions",
          type: "i128",
          index: false
        },
        {
          name: "adjustmentCost",
          type: "i128",
          index: false
        },
        {
          name: "oraclePrice",
          type: "i64",
          index: false
        },
        {
          name: "fillRecord",
          type: "u128",
          index: false
        },
        {
          name: "numberOfUsers",
          type: "u32",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        }
      ]
    },
    {
      name: "OrderRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "order",
          type: {
            defined: "Order"
          },
          index: false
        }
      ]
    },
    {
      name: "OrderActionRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "action",
          type: {
            defined: "OrderAction"
          },
          index: false
        },
        {
          name: "actionExplanation",
          type: {
            defined: "OrderActionExplanation"
          },
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "marketType",
          type: {
            defined: "MarketType"
          },
          index: false
        },
        {
          name: "filler",
          type: {
            option: "publicKey"
          },
          index: false
        },
        {
          name: "fillerReward",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "fillRecordId",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "baseAssetAmountFilled",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "quoteAssetAmountFilled",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "takerFee",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "makerFee",
          type: {
            option: "i64"
          },
          index: false
        },
        {
          name: "referrerReward",
          type: {
            option: "u32"
          },
          index: false
        },
        {
          name: "quoteAssetAmountSurplus",
          type: {
            option: "i64"
          },
          index: false
        },
        {
          name: "spotFulfillmentMethodFee",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "taker",
          type: {
            option: "publicKey"
          },
          index: false
        },
        {
          name: "takerOrderId",
          type: {
            option: "u32"
          },
          index: false
        },
        {
          name: "takerOrderDirection",
          type: {
            option: {
              defined: "PositionDirection"
            }
          },
          index: false
        },
        {
          name: "takerOrderBaseAssetAmount",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "takerOrderCumulativeBaseAssetAmountFilled",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "takerOrderCumulativeQuoteAssetAmountFilled",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "maker",
          type: {
            option: "publicKey"
          },
          index: false
        },
        {
          name: "makerOrderId",
          type: {
            option: "u32"
          },
          index: false
        },
        {
          name: "makerOrderDirection",
          type: {
            option: {
              defined: "PositionDirection"
            }
          },
          index: false
        },
        {
          name: "makerOrderBaseAssetAmount",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "makerOrderCumulativeBaseAssetAmountFilled",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "makerOrderCumulativeQuoteAssetAmountFilled",
          type: {
            option: "u64"
          },
          index: false
        },
        {
          name: "oraclePrice",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "LPRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "action",
          type: {
            defined: "LPAction"
          },
          index: false
        },
        {
          name: "nShares",
          type: "u64",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "deltaBaseAssetAmount",
          type: "i64",
          index: false
        },
        {
          name: "deltaQuoteAssetAmount",
          type: "i64",
          index: false
        },
        {
          name: "pnl",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "LiquidationRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "liquidationType",
          type: {
            defined: "LiquidationType"
          },
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "liquidator",
          type: "publicKey",
          index: false
        },
        {
          name: "marginRequirement",
          type: "u128",
          index: false
        },
        {
          name: "totalCollateral",
          type: "i128",
          index: false
        },
        {
          name: "marginFreed",
          type: "u64",
          index: false
        },
        {
          name: "liquidationId",
          type: "u16",
          index: false
        },
        {
          name: "bankrupt",
          type: "bool",
          index: false
        },
        {
          name: "canceledOrderIds",
          type: {
            vec: "u32"
          },
          index: false
        },
        {
          name: "liquidatePerp",
          type: {
            defined: "LiquidatePerpRecord"
          },
          index: false
        },
        {
          name: "liquidateSpot",
          type: {
            defined: "LiquidateSpotRecord"
          },
          index: false
        },
        {
          name: "liquidateBorrowForPerpPnl",
          type: {
            defined: "LiquidateBorrowForPerpPnlRecord"
          },
          index: false
        },
        {
          name: "liquidatePerpPnlForDeposit",
          type: {
            defined: "LiquidatePerpPnlForDepositRecord"
          },
          index: false
        },
        {
          name: "perpBankruptcy",
          type: {
            defined: "PerpBankruptcyRecord"
          },
          index: false
        },
        {
          name: "spotBankruptcy",
          type: {
            defined: "SpotBankruptcyRecord"
          },
          index: false
        }
      ]
    },
    {
      name: "SettlePnlRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "user",
          type: "publicKey",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "pnl",
          type: "i128",
          index: false
        },
        {
          name: "baseAssetAmount",
          type: "i64",
          index: false
        },
        {
          name: "quoteAssetAmountAfter",
          type: "i64",
          index: false
        },
        {
          name: "quoteEntryAmount",
          type: "i64",
          index: false
        },
        {
          name: "settlePrice",
          type: "i64",
          index: false
        },
        {
          name: "explanation",
          type: {
            defined: "SettlePnlExplanation"
          },
          index: false
        }
      ]
    },
    {
      name: "InsuranceFundRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "spotMarketIndex",
          type: "u16",
          index: false
        },
        {
          name: "perpMarketIndex",
          type: "u16",
          index: false
        },
        {
          name: "userIfFactor",
          type: "u32",
          index: false
        },
        {
          name: "totalIfFactor",
          type: "u32",
          index: false
        },
        {
          name: "vaultAmountBefore",
          type: "u64",
          index: false
        },
        {
          name: "insuranceVaultAmountBefore",
          type: "u64",
          index: false
        },
        {
          name: "totalIfSharesBefore",
          type: "u128",
          index: false
        },
        {
          name: "totalIfSharesAfter",
          type: "u128",
          index: false
        },
        {
          name: "amount",
          type: "i64",
          index: false
        }
      ]
    },
    {
      name: "InsuranceFundStakeRecord",
      fields: [
        {
          name: "ts",
          type: "i64",
          index: false
        },
        {
          name: "userAuthority",
          type: "publicKey",
          index: false
        },
        {
          name: "action",
          type: {
            defined: "StakeAction"
          },
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        },
        {
          name: "marketIndex",
          type: "u16",
          index: false
        },
        {
          name: "insuranceVaultAmountBefore",
          type: "u64",
          index: false
        },
        {
          name: "ifSharesBefore",
          type: "u128",
          index: false
        },
        {
          name: "userIfSharesBefore",
          type: "u128",
          index: false
        },
        {
          name: "totalIfSharesBefore",
          type: "u128",
          index: false
        },
        {
          name: "ifSharesAfter",
          type: "u128",
          index: false
        },
        {
          name: "userIfSharesAfter",
          type: "u128",
          index: false
        },
        {
          name: "totalIfSharesAfter",
          type: "u128",
          index: false
        }
      ]
    }
  ],
  errors: [
    {
      code: 6e3,
      name: "InvalidSpotMarketAuthority",
      msg: "Invalid Spot Market Authority"
    },
    {
      code: 6001,
      name: "InvalidInsuranceFundAuthority",
      msg: "Clearing house not insurance fund authority"
    },
    {
      code: 6002,
      name: "InsufficientDeposit",
      msg: "Insufficient deposit"
    },
    {
      code: 6003,
      name: "InsufficientCollateral",
      msg: "Insufficient collateral"
    },
    {
      code: 6004,
      name: "SufficientCollateral",
      msg: "Sufficient collateral"
    },
    {
      code: 6005,
      name: "MaxNumberOfPositions",
      msg: "Max number of positions taken"
    },
    {
      code: 6006,
      name: "AdminControlsPricesDisabled",
      msg: "Admin Controls Prices Disabled"
    },
    {
      code: 6007,
      name: "MarketDelisted",
      msg: "Market Delisted"
    },
    {
      code: 6008,
      name: "MarketIndexAlreadyInitialized",
      msg: "Market Index Already Initialized"
    },
    {
      code: 6009,
      name: "UserAccountAndUserPositionsAccountMismatch",
      msg: "User Account And User Positions Account Mismatch"
    },
    {
      code: 6010,
      name: "UserHasNoPositionInMarket",
      msg: "User Has No Position In Market"
    },
    {
      code: 6011,
      name: "InvalidInitialPeg",
      msg: "Invalid Initial Peg"
    },
    {
      code: 6012,
      name: "InvalidRepegRedundant",
      msg: "AMM repeg already configured with amt given"
    },
    {
      code: 6013,
      name: "InvalidRepegDirection",
      msg: "AMM repeg incorrect repeg direction"
    },
    {
      code: 6014,
      name: "InvalidRepegProfitability",
      msg: "AMM repeg out of bounds pnl"
    },
    {
      code: 6015,
      name: "SlippageOutsideLimit",
      msg: "Slippage Outside Limit Price"
    },
    {
      code: 6016,
      name: "OrderSizeTooSmall",
      msg: "Order Size Too Small"
    },
    {
      code: 6017,
      name: "InvalidUpdateK",
      msg: "Price change too large when updating K"
    },
    {
      code: 6018,
      name: "AdminWithdrawTooLarge",
      msg: "Admin tried to withdraw amount larger than fees collected"
    },
    {
      code: 6019,
      name: "MathError",
      msg: "Math Error"
    },
    {
      code: 6020,
      name: "BnConversionError",
      msg: "Conversion to u128/u64 failed with an overflow or underflow"
    },
    {
      code: 6021,
      name: "ClockUnavailable",
      msg: "Clock unavailable"
    },
    {
      code: 6022,
      name: "UnableToLoadOracle",
      msg: "Unable To Load Oracles"
    },
    {
      code: 6023,
      name: "PriceBandsBreached",
      msg: "Price Bands Breached"
    },
    {
      code: 6024,
      name: "ExchangePaused",
      msg: "Exchange is paused"
    },
    {
      code: 6025,
      name: "InvalidWhitelistToken",
      msg: "Invalid whitelist token"
    },
    {
      code: 6026,
      name: "WhitelistTokenNotFound",
      msg: "Whitelist token not found"
    },
    {
      code: 6027,
      name: "InvalidDiscountToken",
      msg: "Invalid discount token"
    },
    {
      code: 6028,
      name: "DiscountTokenNotFound",
      msg: "Discount token not found"
    },
    {
      code: 6029,
      name: "ReferrerNotFound",
      msg: "Referrer not found"
    },
    {
      code: 6030,
      name: "ReferrerStatsNotFound",
      msg: "ReferrerNotFound"
    },
    {
      code: 6031,
      name: "ReferrerMustBeWritable",
      msg: "ReferrerMustBeWritable"
    },
    {
      code: 6032,
      name: "ReferrerStatsMustBeWritable",
      msg: "ReferrerMustBeWritable"
    },
    {
      code: 6033,
      name: "ReferrerAndReferrerStatsAuthorityUnequal",
      msg: "ReferrerAndReferrerStatsAuthorityUnequal"
    },
    {
      code: 6034,
      name: "InvalidReferrer",
      msg: "InvalidReferrer"
    },
    {
      code: 6035,
      name: "InvalidOracle",
      msg: "InvalidOracle"
    },
    {
      code: 6036,
      name: "OracleNotFound",
      msg: "OracleNotFound"
    },
    {
      code: 6037,
      name: "LiquidationsBlockedByOracle",
      msg: "Liquidations Blocked By Oracle"
    },
    {
      code: 6038,
      name: "MaxDeposit",
      msg: "Can not deposit more than max deposit"
    },
    {
      code: 6039,
      name: "CantDeleteUserWithCollateral",
      msg: "Can not delete user that still has collateral"
    },
    {
      code: 6040,
      name: "InvalidFundingProfitability",
      msg: "AMM funding out of bounds pnl"
    },
    {
      code: 6041,
      name: "CastingFailure",
      msg: "Casting Failure"
    },
    {
      code: 6042,
      name: "InvalidOrder",
      msg: "InvalidOrder"
    },
    {
      code: 6043,
      name: "InvalidOrderMaxTs",
      msg: "InvalidOrderMaxTs"
    },
    {
      code: 6044,
      name: "InvalidOrderMarketType",
      msg: "InvalidOrderMarketType"
    },
    {
      code: 6045,
      name: "InvalidOrderForInitialMarginReq",
      msg: "InvalidOrderForInitialMarginReq"
    },
    {
      code: 6046,
      name: "InvalidOrderNotRiskReducing",
      msg: "InvalidOrderNotRiskReducing"
    },
    {
      code: 6047,
      name: "InvalidOrderSizeTooSmall",
      msg: "InvalidOrderSizeTooSmall"
    },
    {
      code: 6048,
      name: "InvalidOrderNotStepSizeMultiple",
      msg: "InvalidOrderNotStepSizeMultiple"
    },
    {
      code: 6049,
      name: "InvalidOrderBaseQuoteAsset",
      msg: "InvalidOrderBaseQuoteAsset"
    },
    {
      code: 6050,
      name: "InvalidOrderIOC",
      msg: "InvalidOrderIOC"
    },
    {
      code: 6051,
      name: "InvalidOrderPostOnly",
      msg: "InvalidOrderPostOnly"
    },
    {
      code: 6052,
      name: "InvalidOrderIOCPostOnly",
      msg: "InvalidOrderIOCPostOnly"
    },
    {
      code: 6053,
      name: "InvalidOrderTrigger",
      msg: "InvalidOrderTrigger"
    },
    {
      code: 6054,
      name: "InvalidOrderAuction",
      msg: "InvalidOrderAuction"
    },
    {
      code: 6055,
      name: "InvalidOrderOracleOffset",
      msg: "InvalidOrderOracleOffset"
    },
    {
      code: 6056,
      name: "InvalidOrderMinOrderSize",
      msg: "InvalidOrderMinOrderSize"
    },
    {
      code: 6057,
      name: "PlacePostOnlyLimitFailure",
      msg: "Failed to Place Post-Only Limit Order"
    },
    {
      code: 6058,
      name: "UserHasNoOrder",
      msg: "User has no order"
    },
    {
      code: 6059,
      name: "OrderAmountTooSmall",
      msg: "Order Amount Too Small"
    },
    {
      code: 6060,
      name: "MaxNumberOfOrders",
      msg: "Max number of orders taken"
    },
    {
      code: 6061,
      name: "OrderDoesNotExist",
      msg: "Order does not exist"
    },
    {
      code: 6062,
      name: "OrderNotOpen",
      msg: "Order not open"
    },
    {
      code: 6063,
      name: "FillOrderDidNotUpdateState",
      msg: "FillOrderDidNotUpdateState"
    },
    {
      code: 6064,
      name: "ReduceOnlyOrderIncreasedRisk",
      msg: "Reduce only order increased risk"
    },
    {
      code: 6065,
      name: "UnableToLoadAccountLoader",
      msg: "Unable to load AccountLoader"
    },
    {
      code: 6066,
      name: "TradeSizeTooLarge",
      msg: "Trade Size Too Large"
    },
    {
      code: 6067,
      name: "UserCantReferThemselves",
      msg: "User cant refer themselves"
    },
    {
      code: 6068,
      name: "DidNotReceiveExpectedReferrer",
      msg: "Did not receive expected referrer"
    },
    {
      code: 6069,
      name: "CouldNotDeserializeReferrer",
      msg: "Could not deserialize referrer"
    },
    {
      code: 6070,
      name: "CouldNotDeserializeReferrerStats",
      msg: "Could not deserialize referrer stats"
    },
    {
      code: 6071,
      name: "UserOrderIdAlreadyInUse",
      msg: "User Order Id Already In Use"
    },
    {
      code: 6072,
      name: "NoPositionsLiquidatable",
      msg: "No positions liquidatable"
    },
    {
      code: 6073,
      name: "InvalidMarginRatio",
      msg: "Invalid Margin Ratio"
    },
    {
      code: 6074,
      name: "CantCancelPostOnlyOrder",
      msg: "Cant Cancel Post Only Order"
    },
    {
      code: 6075,
      name: "InvalidOracleOffset",
      msg: "InvalidOracleOffset"
    },
    {
      code: 6076,
      name: "CantExpireOrders",
      msg: "CantExpireOrders"
    },
    {
      code: 6077,
      name: "CouldNotLoadMarketData",
      msg: "CouldNotLoadMarketData"
    },
    {
      code: 6078,
      name: "PerpMarketNotFound",
      msg: "PerpMarketNotFound"
    },
    {
      code: 6079,
      name: "InvalidMarketAccount",
      msg: "InvalidMarketAccount"
    },
    {
      code: 6080,
      name: "UnableToLoadPerpMarketAccount",
      msg: "UnableToLoadMarketAccount"
    },
    {
      code: 6081,
      name: "MarketWrongMutability",
      msg: "MarketWrongMutability"
    },
    {
      code: 6082,
      name: "UnableToCastUnixTime",
      msg: "UnableToCastUnixTime"
    },
    {
      code: 6083,
      name: "CouldNotFindSpotPosition",
      msg: "CouldNotFindSpotPosition"
    },
    {
      code: 6084,
      name: "NoSpotPositionAvailable",
      msg: "NoSpotPositionAvailable"
    },
    {
      code: 6085,
      name: "InvalidSpotMarketInitialization",
      msg: "InvalidSpotMarketInitialization"
    },
    {
      code: 6086,
      name: "CouldNotLoadSpotMarketData",
      msg: "CouldNotLoadSpotMarketData"
    },
    {
      code: 6087,
      name: "SpotMarketNotFound",
      msg: "SpotMarketNotFound"
    },
    {
      code: 6088,
      name: "InvalidSpotMarketAccount",
      msg: "InvalidSpotMarketAccount"
    },
    {
      code: 6089,
      name: "UnableToLoadSpotMarketAccount",
      msg: "UnableToLoadSpotMarketAccount"
    },
    {
      code: 6090,
      name: "SpotMarketWrongMutability",
      msg: "SpotMarketWrongMutability"
    },
    {
      code: 6091,
      name: "SpotMarketInterestNotUpToDate",
      msg: "SpotInterestNotUpToDate"
    },
    {
      code: 6092,
      name: "SpotMarketInsufficientDeposits",
      msg: "SpotMarketInsufficientDeposits"
    },
    {
      code: 6093,
      name: "UserMustSettleTheirOwnPositiveUnsettledPNL",
      msg: "UserMustSettleTheirOwnPositiveUnsettledPNL"
    },
    {
      code: 6094,
      name: "CantUpdatePoolBalanceType",
      msg: "CantUpdatePoolBalanceType"
    },
    {
      code: 6095,
      name: "InsufficientCollateralForSettlingPNL",
      msg: "InsufficientCollateralForSettlingPNL"
    },
    {
      code: 6096,
      name: "AMMNotUpdatedInSameSlot",
      msg: "AMMNotUpdatedInSameSlot"
    },
    {
      code: 6097,
      name: "AuctionNotComplete",
      msg: "AuctionNotComplete"
    },
    {
      code: 6098,
      name: "MakerNotFound",
      msg: "MakerNotFound"
    },
    {
      code: 6099,
      name: "MakerStatsNotFound",
      msg: "MakerNotFound"
    },
    {
      code: 6100,
      name: "MakerMustBeWritable",
      msg: "MakerMustBeWritable"
    },
    {
      code: 6101,
      name: "MakerStatsMustBeWritable",
      msg: "MakerMustBeWritable"
    },
    {
      code: 6102,
      name: "MakerOrderNotFound",
      msg: "MakerOrderNotFound"
    },
    {
      code: 6103,
      name: "CouldNotDeserializeMaker",
      msg: "CouldNotDeserializeMaker"
    },
    {
      code: 6104,
      name: "CouldNotDeserializeMakerStats",
      msg: "CouldNotDeserializeMaker"
    },
    {
      code: 6105,
      name: "AuctionPriceDoesNotSatisfyMaker",
      msg: "AuctionPriceDoesNotSatisfyMaker"
    },
    {
      code: 6106,
      name: "MakerCantFulfillOwnOrder",
      msg: "MakerCantFulfillOwnOrder"
    },
    {
      code: 6107,
      name: "MakerOrderMustBePostOnly",
      msg: "MakerOrderMustBePostOnly"
    },
    {
      code: 6108,
      name: "CantMatchTwoPostOnlys",
      msg: "CantMatchTwoPostOnlys"
    },
    {
      code: 6109,
      name: "OrderBreachesOraclePriceLimits",
      msg: "OrderBreachesOraclePriceLimits"
    },
    {
      code: 6110,
      name: "OrderMustBeTriggeredFirst",
      msg: "OrderMustBeTriggeredFirst"
    },
    {
      code: 6111,
      name: "OrderNotTriggerable",
      msg: "OrderNotTriggerable"
    },
    {
      code: 6112,
      name: "OrderDidNotSatisfyTriggerCondition",
      msg: "OrderDidNotSatisfyTriggerCondition"
    },
    {
      code: 6113,
      name: "PositionAlreadyBeingLiquidated",
      msg: "PositionAlreadyBeingLiquidated"
    },
    {
      code: 6114,
      name: "PositionDoesntHaveOpenPositionOrOrders",
      msg: "PositionDoesntHaveOpenPositionOrOrders"
    },
    {
      code: 6115,
      name: "AllOrdersAreAlreadyLiquidations",
      msg: "AllOrdersAreAlreadyLiquidations"
    },
    {
      code: 6116,
      name: "CantCancelLiquidationOrder",
      msg: "CantCancelLiquidationOrder"
    },
    {
      code: 6117,
      name: "UserIsBeingLiquidated",
      msg: "UserIsBeingLiquidated"
    },
    {
      code: 6118,
      name: "LiquidationsOngoing",
      msg: "LiquidationsOngoing"
    },
    {
      code: 6119,
      name: "WrongSpotBalanceType",
      msg: "WrongSpotBalanceType"
    },
    {
      code: 6120,
      name: "UserCantLiquidateThemself",
      msg: "UserCantLiquidateThemself"
    },
    {
      code: 6121,
      name: "InvalidPerpPositionToLiquidate",
      msg: "InvalidPerpPositionToLiquidate"
    },
    {
      code: 6122,
      name: "InvalidBaseAssetAmountForLiquidatePerp",
      msg: "InvalidBaseAssetAmountForLiquidatePerp"
    },
    {
      code: 6123,
      name: "InvalidPositionLastFundingRate",
      msg: "InvalidPositionLastFundingRate"
    },
    {
      code: 6124,
      name: "InvalidPositionDelta",
      msg: "InvalidPositionDelta"
    },
    {
      code: 6125,
      name: "UserBankrupt",
      msg: "UserBankrupt"
    },
    {
      code: 6126,
      name: "UserNotBankrupt",
      msg: "UserNotBankrupt"
    },
    {
      code: 6127,
      name: "UserHasInvalidBorrow",
      msg: "UserHasInvalidBorrow"
    },
    {
      code: 6128,
      name: "DailyWithdrawLimit",
      msg: "DailyWithdrawLimit"
    },
    {
      code: 6129,
      name: "DefaultError",
      msg: "DefaultError"
    },
    {
      code: 6130,
      name: "InsufficientLPTokens",
      msg: "Insufficient LP tokens"
    },
    {
      code: 6131,
      name: "CantLPWithPerpPosition",
      msg: "Cant LP with a market position"
    },
    {
      code: 6132,
      name: "UnableToBurnLPTokens",
      msg: "Unable to burn LP tokens"
    },
    {
      code: 6133,
      name: "TryingToRemoveLiquidityTooFast",
      msg: "Trying to remove liqudity too fast after adding it"
    },
    {
      code: 6134,
      name: "InvalidSpotMarketVault",
      msg: "Invalid Spot Market Vault"
    },
    {
      code: 6135,
      name: "InvalidSpotMarketState",
      msg: "Invalid Spot Market State"
    },
    {
      code: 6136,
      name: "InvalidSerumProgram",
      msg: "InvalidSerumProgram"
    },
    {
      code: 6137,
      name: "InvalidSerumMarket",
      msg: "InvalidSerumMarket"
    },
    {
      code: 6138,
      name: "InvalidSerumBids",
      msg: "InvalidSerumBids"
    },
    {
      code: 6139,
      name: "InvalidSerumAsks",
      msg: "InvalidSerumAsks"
    },
    {
      code: 6140,
      name: "InvalidSerumOpenOrders",
      msg: "InvalidSerumOpenOrders"
    },
    {
      code: 6141,
      name: "FailedSerumCPI",
      msg: "FailedSerumCPI"
    },
    {
      code: 6142,
      name: "FailedToFillOnSerum",
      msg: "FailedToFillOnSerum"
    },
    {
      code: 6143,
      name: "InvalidSerumFulfillmentConfig",
      msg: "InvalidSerumFulfillmentConfig"
    },
    {
      code: 6144,
      name: "InvalidFeeStructure",
      msg: "InvalidFeeStructure"
    },
    {
      code: 6145,
      name: "InsufficientIFShares",
      msg: "Insufficient IF shares"
    },
    {
      code: 6146,
      name: "MarketActionPaused",
      msg: "the Market has paused this action"
    },
    {
      code: 6147,
      name: "MarketPlaceOrderPaused",
      msg: "the Market status doesnt allow placing orders"
    },
    {
      code: 6148,
      name: "MarketFillOrderPaused",
      msg: "the Market status doesnt allow filling orders"
    },
    {
      code: 6149,
      name: "MarketWithdrawPaused",
      msg: "the Market status doesnt allow withdraws"
    },
    {
      code: 6150,
      name: "ProtectedAssetTierViolation",
      msg: "Action violates the Protected Asset Tier rules"
    },
    {
      code: 6151,
      name: "IsolatedAssetTierViolation",
      msg: "Action violates the Isolated Asset Tier rules"
    },
    {
      code: 6152,
      name: "UserCantBeDeleted",
      msg: "User Cant Be Deleted"
    },
    {
      code: 6153,
      name: "ReduceOnlyWithdrawIncreasedRisk",
      msg: "Reduce Only Withdraw Increased Risk"
    },
    {
      code: 6154,
      name: "MaxOpenInterest",
      msg: "Max Open Interest"
    },
    {
      code: 6155,
      name: "CantResolvePerpBankruptcy",
      msg: "Cant Resolve Perp Bankruptcy"
    },
    {
      code: 6156,
      name: "LiquidationDoesntSatisfyLimitPrice",
      msg: "Liquidation Doesnt Satisfy Limit Price"
    },
    {
      code: 6157,
      name: "MarginTradingDisabled",
      msg: "Margin Trading Disabled"
    },
    {
      code: 6158,
      name: "InvalidMarketStatusToSettlePnl",
      msg: "Invalid Market Status to Settle Perp Pnl"
    },
    {
      code: 6159,
      name: "PerpMarketNotInSettlement",
      msg: "PerpMarketNotInSettlement"
    },
    {
      code: 6160,
      name: "PerpMarketNotInReduceOnly",
      msg: "PerpMarketNotInReduceOnly"
    },
    {
      code: 6161,
      name: "PerpMarketSettlementBufferNotReached",
      msg: "PerpMarketSettlementBufferNotReached"
    },
    {
      code: 6162,
      name: "PerpMarketSettlementUserHasOpenOrders",
      msg: "PerpMarketSettlementUserHasOpenOrders"
    },
    {
      code: 6163,
      name: "PerpMarketSettlementUserHasActiveLP",
      msg: "PerpMarketSettlementUserHasActiveLP"
    },
    {
      code: 6164,
      name: "UnableToSettleExpiredUserPosition",
      msg: "UnableToSettleExpiredUserPosition"
    },
    {
      code: 6165,
      name: "UnequalMarketIndexForSpotTransfer",
      msg: "UnequalMarketIndexForSpotTransfer"
    },
    {
      code: 6166,
      name: "InvalidPerpPositionDetected",
      msg: "InvalidPerpPositionDetected"
    },
    {
      code: 6167,
      name: "InvalidSpotPositionDetected",
      msg: "InvalidSpotPositionDetected"
    },
    {
      code: 6168,
      name: "InvalidAmmDetected",
      msg: "InvalidAmmDetected"
    },
    {
      code: 6169,
      name: "InvalidAmmForFillDetected",
      msg: "InvalidAmmForFillDetected"
    },
    {
      code: 6170,
      name: "InvalidAmmLimitPriceOverride",
      msg: "InvalidAmmLimitPriceOverride"
    },
    {
      code: 6171,
      name: "InvalidOrderFillPrice",
      msg: "InvalidOrderFillPrice"
    },
    {
      code: 6172,
      name: "SpotMarketBalanceInvariantViolated",
      msg: "SpotMarketBalanceInvariantViolated"
    },
    {
      code: 6173,
      name: "SpotMarketVaultInvariantViolated",
      msg: "SpotMarketVaultInvariantViolated"
    },
    {
      code: 6174,
      name: "InvalidPDA",
      msg: "InvalidPDA"
    },
    {
      code: 6175,
      name: "InvalidPDASigner",
      msg: "InvalidPDASigner"
    },
    {
      code: 6176,
      name: "RevenueSettingsCannotSettleToIF",
      msg: "RevenueSettingsCannotSettleToIF"
    },
    {
      code: 6177,
      name: "NoRevenueToSettleToIF",
      msg: "NoRevenueToSettleToIF"
    },
    {
      code: 6178,
      name: "NoAmmPerpPnlDeficit",
      msg: "NoAmmPerpPnlDeficit"
    },
    {
      code: 6179,
      name: "SufficientPerpPnlPool",
      msg: "SufficientPerpPnlPool"
    },
    {
      code: 6180,
      name: "InsufficientPerpPnlPool",
      msg: "InsufficientPerpPnlPool"
    },
    {
      code: 6181,
      name: "PerpPnlDeficitBelowThreshold",
      msg: "PerpPnlDeficitBelowThreshold"
    },
    {
      code: 6182,
      name: "MaxRevenueWithdrawPerPeriodReached",
      msg: "MaxRevenueWithdrawPerPeriodReached"
    },
    {
      code: 6183,
      name: "MaxIFWithdrawReached",
      msg: "InvalidSpotPositionDetected"
    },
    {
      code: 6184,
      name: "NoIFWithdrawAvailable",
      msg: "NoIFWithdrawAvailable"
    },
    {
      code: 6185,
      name: "InvalidIFUnstake",
      msg: "InvalidIFUnstake"
    },
    {
      code: 6186,
      name: "InvalidIFUnstakeSize",
      msg: "InvalidIFUnstakeSize"
    },
    {
      code: 6187,
      name: "InvalidIFUnstakeCancel",
      msg: "InvalidIFUnstakeCancel"
    },
    {
      code: 6188,
      name: "InvalidIFForNewStakes",
      msg: "InvalidIFForNewStakes"
    },
    {
      code: 6189,
      name: "InvalidIFRebase",
      msg: "InvalidIFRebase"
    },
    {
      code: 6190,
      name: "InvalidInsuranceUnstakeSize",
      msg: "InvalidInsuranceUnstakeSize"
    },
    {
      code: 6191,
      name: "InvalidOrderLimitPrice",
      msg: "InvalidOrderLimitPrice"
    },
    {
      code: 6192,
      name: "InvalidIFDetected",
      msg: "InvalidIFDetected"
    },
    {
      code: 6193,
      name: "InvalidAmmMaxSpreadDetected",
      msg: "InvalidAmmMaxSpreadDetected"
    },
    {
      code: 6194,
      name: "InvalidConcentrationCoef",
      msg: "InvalidConcentrationCoef"
    },
    {
      code: 6195,
      name: "InvalidSrmVault",
      msg: "InvalidSrmVault"
    },
    {
      code: 6196,
      name: "InvalidVaultOwner",
      msg: "InvalidVaultOwner"
    },
    {
      code: 6197,
      name: "InvalidMarketStatusForFills",
      msg: "InvalidMarketStatusForFills"
    },
    {
      code: 6198,
      name: "IFWithdrawRequestInProgress",
      msg: "IFWithdrawRequestInProgress"
    },
    {
      code: 6199,
      name: "NoIFWithdrawRequestInProgress",
      msg: "NoIFWithdrawRequestInProgress"
    },
    {
      code: 6200,
      name: "IFWithdrawRequestTooSmall",
      msg: "IFWithdrawRequestTooSmall"
    },
    {
      code: 6201,
      name: "IncorrectSpotMarketAccountPassed",
      msg: "IncorrectSpotMarketAccountPassed"
    },
    {
      code: 6202,
      name: "BlockchainClockInconsistency",
      msg: "BlockchainClockInconsistency"
    },
    {
      code: 6203,
      name: "InvalidIFSharesDetected",
      msg: "InvalidIFSharesDetected"
    },
    {
      code: 6204,
      name: "NewLPSizeTooSmall",
      msg: "NewLPSizeTooSmall"
    },
    {
      code: 6205,
      name: "MarketStatusInvalidForNewLP",
      msg: "MarketStatusInvalidForNewLP"
    },
    {
      code: 6206,
      name: "InvalidMarkTwapUpdateDetected",
      msg: "InvalidMarkTwapUpdateDetected"
    },
    {
      code: 6207,
      name: "MarketSettlementAttemptOnActiveMarket",
      msg: "MarketSettlementAttemptOnActiveMarket"
    },
    {
      code: 6208,
      name: "MarketSettlementRequiresSettledLP",
      msg: "MarketSettlementRequiresSettledLP"
    },
    {
      code: 6209,
      name: "MarketSettlementAttemptTooEarly",
      msg: "MarketSettlementAttemptTooEarly"
    },
    {
      code: 6210,
      name: "MarketSettlementTargetPriceInvalid",
      msg: "MarketSettlementTargetPriceInvalid"
    },
    {
      code: 6211,
      name: "UnsupportedSpotMarket",
      msg: "UnsupportedSpotMarket"
    },
    {
      code: 6212,
      name: "SpotOrdersDisabled",
      msg: "SpotOrdersDisabled"
    },
    {
      code: 6213,
      name: "MarketBeingInitialized",
      msg: "Market Being Initialized"
    },
    {
      code: 6214,
      name: "InvalidUserSubAccountId",
      msg: "Invalid Sub Account Id"
    },
    {
      code: 6215,
      name: "InvalidTriggerOrderCondition",
      msg: "Invalid Trigger Order Condition"
    },
    {
      code: 6216,
      name: "InvalidSpotPosition",
      msg: "Invalid Spot Position"
    },
    {
      code: 6217,
      name: "CantTransferBetweenSameUserAccount",
      msg: "Cant transfer between same user account"
    },
    {
      code: 6218,
      name: "InvalidPerpPosition",
      msg: "Invalid Perp Position"
    },
    {
      code: 6219,
      name: "UnableToGetLimitPrice",
      msg: "Unable To Get Limit Price"
    },
    {
      code: 6220,
      name: "InvalidLiquidation",
      msg: "Invalid Liquidation"
    },
    {
      code: 6221,
      name: "SpotFulfillmentConfigDisabled",
      msg: "Spot Fulfullment Config Disabled"
    },
    {
      code: 6222,
      name: "InvalidMaker",
      msg: "Invalid Maker"
    }
  ]
};

// src/driftClient.ts
import {
  PublicKey as PublicKey10,
  Transaction as Transaction3,
  Keypair as Keypair2,
  LAMPORTS_PER_SOL as LAMPORTS_PER_SOL2,
  SystemProgram,
  ComputeBudgetProgram as ComputeBudgetProgram2
} from "@solana/web3.js";

// src/tx/utils.ts
import {
  Transaction as Transaction2,
  ComputeBudgetProgram
} from "@solana/web3.js";
var COMPUTE_UNITS_DEFAULT = 2e5;
function wrapInTx(instruction, computeUnits = 6e5) {
  const tx = new Transaction2();
  if (computeUnits != COMPUTE_UNITS_DEFAULT) {
    tx.add(
      ComputeBudgetProgram.requestUnits({
        units: computeUnits,
        additionalFee: 0
      })
    );
  }
  return tx.add(instruction);
}

// src/math/amm.ts
import { BN as BN8 } from "@project-serum/anchor";

// src/assert/assert.ts
function assert(condition, error) {
  if (!condition) {
    throw new Error(error || "Unspecified AssertionError");
  }
}

// src/math/repeg.ts
import { BN as BN7 } from "@project-serum/anchor";
function calculateAdjustKCost(amm, numerator, denomenator) {
  const x = amm.baseAssetReserve;
  const y = amm.quoteAssetReserve;
  const d = amm.baseAssetAmountWithAmm;
  const Q = amm.pegMultiplier;
  const quoteScale = y.mul(d).mul(Q);
  const p = numerator.mul(PRICE_PRECISION).div(denomenator);
  const cost = quoteScale.div(x.add(d)).sub(
    quoteScale.mul(p).div(PRICE_PRECISION).div(x.mul(p).div(PRICE_PRECISION).add(d))
  ).div(AMM_TO_QUOTE_PRECISION_RATIO).div(PEG_PRECISION);
  return cost.mul(new BN7(-1));
}
function calculateRepegCost(amm, newPeg) {
  const dqar = amm.quoteAssetReserve.sub(amm.terminalQuoteAssetReserve);
  const cost = dqar.mul(newPeg.sub(amm.pegMultiplier)).div(AMM_TO_QUOTE_PRECISION_RATIO).div(PEG_PRECISION);
  return cost;
}
function calculateBudgetedKBN(x, y, budget, Q, d) {
  assert(Q.gt(new BN7(0)));
  const C = budget.mul(new BN7(-1));
  let dSign = new BN7(1);
  if (d.lt(new BN7(0))) {
    dSign = new BN7(-1);
  }
  const pegged_y_d_d = y.mul(d).mul(d).mul(Q).div(AMM_RESERVE_PRECISION).div(AMM_RESERVE_PRECISION).div(PEG_PRECISION);
  const numer1 = pegged_y_d_d;
  const numer2 = C.mul(d).div(QUOTE_PRECISION).mul(x.add(d)).div(AMM_RESERVE_PRECISION).mul(dSign);
  const denom1 = C.mul(x).mul(x.add(d)).div(AMM_RESERVE_PRECISION).div(QUOTE_PRECISION);
  const denom2 = pegged_y_d_d;
  if (C.lt(ZERO)) {
    if (denom1.abs().gt(denom2.abs())) {
      console.log("denom1 > denom2", denom1.toString(), denom2.toString());
      console.log("budget cost exceeds stable K solution");
      return [new BN7(1e4), new BN7(1)];
    }
  }
  const numerator = numer1.sub(numer2).div(AMM_TO_QUOTE_PRECISION_RATIO);
  const denominator = denom1.add(denom2).div(AMM_TO_QUOTE_PRECISION_RATIO);
  return [numerator, denominator];
}
function calculateBudgetedK(amm, cost) {
  const x = amm.baseAssetReserve;
  const y = amm.quoteAssetReserve;
  const d = amm.baseAssetAmountWithAmm;
  const Q = amm.pegMultiplier;
  const [numerator, denominator] = calculateBudgetedKBN(x, y, cost, Q, d);
  return [numerator, denominator];
}
function calculateBudgetedPeg(amm, cost, targetPrice) {
  const targetPeg = targetPrice.mul(amm.baseAssetReserve).div(amm.quoteAssetReserve).div(PRICE_DIV_PEG);
  const k = amm.sqrtK.mul(amm.sqrtK);
  const x = amm.baseAssetReserve;
  const y = amm.quoteAssetReserve;
  const d = amm.baseAssetAmountWithAmm;
  const Q = amm.pegMultiplier;
  const C = cost.mul(new BN7(-1));
  const deltaQuoteAssetReserves = y.sub(k.div(x.add(d)));
  const pegChangeDirection = targetPeg.sub(Q);
  const useTargetPeg = deltaQuoteAssetReserves.lt(ZERO) && pegChangeDirection.gt(ZERO) || deltaQuoteAssetReserves.gt(ZERO) && pegChangeDirection.lt(ZERO);
  if (deltaQuoteAssetReserves.eq(ZERO) || useTargetPeg) {
    return targetPeg;
  }
  const deltaPegMultiplier = C.mul(PRICE_PRECISION).div(
    deltaQuoteAssetReserves.div(AMM_TO_QUOTE_PRECISION_RATIO)
  );
  const newPeg = Q.sub(
    deltaPegMultiplier.mul(PEG_PRECISION).div(PRICE_PRECISION)
  );
  return newPeg;
}

// src/math/oracles.ts
function oraclePriceBands(market, oraclePriceData) {
  const maxPercentDiff = market.marginRatioInitial - market.marginRatioMaintenance;
  const offset = oraclePriceData.price.mul(new BN(maxPercentDiff)).div(MARGIN_PRECISION);
  assert(offset.gt(ZERO));
  return [oraclePriceData.price.sub(offset), oraclePriceData.price.add(offset)];
}
function isOracleValid(amm, oraclePriceData, oracleGuardRails, slot) {
  const isOraclePriceNonPositive = oraclePriceData.price.lte(ZERO);
  const isOraclePriceTooVolatile = oraclePriceData.price.div(BN.max(ONE, amm.historicalOracleData.lastOraclePriceTwap)).gt(oracleGuardRails.validity.tooVolatileRatio) || amm.historicalOracleData.lastOraclePriceTwap.div(BN.max(ONE, oraclePriceData.price)).gt(oracleGuardRails.validity.tooVolatileRatio);
  const isConfidenceTooLarge = new BN(amm.baseSpread).add(BN.max(ONE, oraclePriceData.confidence)).mul(BID_ASK_SPREAD_PRECISION).div(oraclePriceData.price).gt(new BN(amm.maxSpread));
  const oracleIsStale = oraclePriceData.slot.sub(new BN(slot)).gt(oracleGuardRails.validity.slotsBeforeStaleForAmm);
  return !(!oraclePriceData.hasSufficientNumberOfDataPoints || oracleIsStale || isOraclePriceNonPositive || isOraclePriceTooVolatile || isConfidenceTooLarge);
}
function isOracleTooDivergent(amm, oraclePriceData, oracleGuardRails, now) {
  const sinceLastUpdate = now.sub(
    amm.historicalOracleData.lastOraclePriceTwapTs
  );
  const sinceStart = BN.max(ZERO, new BN(60 * 5).sub(sinceLastUpdate));
  const oracleTwap5min = amm.historicalOracleData.lastOraclePriceTwap5Min.mul(sinceStart).add(oraclePriceData.price).mul(sinceLastUpdate).div(sinceStart.add(sinceLastUpdate));
  const oracleSpread = oracleTwap5min.sub(oraclePriceData.price);
  const oracleSpreadPct = oracleSpread.mul(PRICE_PRECISION).div(oracleTwap5min);
  const tooDivergent = oracleSpreadPct.abs().gte(
    BID_ASK_SPREAD_PRECISION.mul(
      oracleGuardRails.priceDivergence.markOracleDivergenceNumerator
    ).div(oracleGuardRails.priceDivergence.markOracleDivergenceDenominator)
  );
  return tooDivergent;
}
function calculateLiveOracleTwap(amm, oraclePriceData, now) {
  const sinceLastUpdate = now.sub(
    amm.historicalOracleData.lastOraclePriceTwapTs
  );
  const sinceStart = BN.max(ZERO, amm.fundingPeriod.sub(sinceLastUpdate));
  const clampRange = amm.historicalOracleData.lastOraclePriceTwap.div(
    new BN(3)
  );
  const clampedOraclePrice = BN.min(
    amm.historicalOracleData.lastOraclePriceTwap.add(clampRange),
    BN.max(
      oraclePriceData.price,
      amm.historicalOracleData.lastOraclePriceTwap.sub(clampRange)
    )
  );
  const newOracleTwap = amm.historicalOracleData.lastOraclePriceTwap.mul(sinceStart).add(clampedOraclePrice.mul(sinceLastUpdate)).div(sinceStart.add(sinceLastUpdate));
  return newOracleTwap;
}
function calculateLiveOracleStd(amm, oraclePriceData, now) {
  const sinceLastUpdate = now.sub(
    amm.historicalOracleData.lastOraclePriceTwapTs
  );
  const sinceStart = BN.max(ZERO, amm.fundingPeriod.sub(sinceLastUpdate));
  const liveOracleTwap = calculateLiveOracleTwap(amm, oraclePriceData, now);
  const priceDeltaVsTwap = oraclePriceData.price.sub(liveOracleTwap).abs();
  const oracleStd = priceDeltaVsTwap.add(
    amm.oracleStd.mul(sinceStart).div(sinceStart.add(sinceLastUpdate))
  );
  return oracleStd;
}

// src/math/amm.ts
function calculatePegFromTargetPrice(targetPrice, baseAssetReserve, quoteAssetReserve) {
  return BN8.max(
    targetPrice.mul(baseAssetReserve).div(quoteAssetReserve).add(PRICE_DIV_PEG.div(new BN8(2))).div(PRICE_DIV_PEG),
    ONE
  );
}
function calculateOptimalPegAndBudget(amm, oraclePriceData) {
  const reservePriceBefore = calculatePrice(
    amm.baseAssetReserve,
    amm.quoteAssetReserve,
    amm.pegMultiplier
  );
  const targetPrice = oraclePriceData.price;
  const newPeg = calculatePegFromTargetPrice(
    targetPrice,
    amm.baseAssetReserve,
    amm.quoteAssetReserve
  );
  const prePegCost = calculateRepegCost(amm, newPeg);
  const totalFeeLB = amm.totalExchangeFee.div(new BN8(2));
  const budget = BN8.max(ZERO, amm.totalFeeMinusDistributions.sub(totalFeeLB));
  if (budget.lt(prePegCost)) {
    const halfMaxPriceSpread = new BN8(amm.maxSpread).div(new BN8(2)).mul(targetPrice).div(BID_ASK_SPREAD_PRECISION);
    let newTargetPrice;
    let newOptimalPeg;
    let newBudget;
    const targetPriceGap = reservePriceBefore.sub(targetPrice);
    if (targetPriceGap.abs().gt(halfMaxPriceSpread)) {
      const markAdj = targetPriceGap.abs().sub(halfMaxPriceSpread);
      if (targetPriceGap.lt(new BN8(0))) {
        newTargetPrice = reservePriceBefore.add(markAdj);
      } else {
        newTargetPrice = reservePriceBefore.sub(markAdj);
      }
      newOptimalPeg = calculatePegFromTargetPrice(
        newTargetPrice,
        amm.baseAssetReserve,
        amm.quoteAssetReserve
      );
      newBudget = calculateRepegCost(amm, newOptimalPeg);
      return [newTargetPrice, newOptimalPeg, newBudget, false];
    }
  }
  return [targetPrice, newPeg, budget, true];
}
function calculateNewAmm(amm, oraclePriceData) {
  let pKNumer = new BN8(1);
  let pKDenom = new BN8(1);
  const [targetPrice, _newPeg, budget, checkLowerBound] = calculateOptimalPegAndBudget(amm, oraclePriceData);
  let prePegCost = calculateRepegCost(amm, _newPeg);
  let newPeg = _newPeg;
  if (prePegCost.gt(budget) && checkLowerBound) {
    [pKNumer, pKDenom] = [new BN8(999), new BN8(1e3)];
    const deficitMadeup = calculateAdjustKCost(amm, pKNumer, pKDenom);
    assert(deficitMadeup.lte(new BN8(0)));
    prePegCost = budget.add(deficitMadeup.abs());
    const newAmm = Object.assign({}, amm);
    newAmm.baseAssetReserve = newAmm.baseAssetReserve.mul(pKNumer).div(pKDenom);
    newAmm.sqrtK = newAmm.sqrtK.mul(pKNumer).div(pKDenom);
    const invariant = newAmm.sqrtK.mul(newAmm.sqrtK);
    newAmm.quoteAssetReserve = invariant.div(newAmm.baseAssetReserve);
    const directionToClose = amm.baseAssetAmountWithAmm.gt(ZERO) ? PositionDirection.SHORT : PositionDirection.LONG;
    const [newQuoteAssetReserve, _newBaseAssetReserve] = calculateAmmReservesAfterSwap(
      newAmm,
      "base",
      amm.baseAssetAmountWithAmm.abs(),
      getSwapDirection("base", directionToClose)
    );
    newAmm.terminalQuoteAssetReserve = newQuoteAssetReserve;
    newPeg = calculateBudgetedPeg(newAmm, prePegCost, targetPrice);
    prePegCost = calculateRepegCost(newAmm, newPeg);
  }
  return [prePegCost, pKNumer, pKDenom, newPeg];
}
function calculateUpdatedAMM(amm, oraclePriceData) {
  if (amm.curveUpdateIntensity == 0) {
    return amm;
  }
  const newAmm = Object.assign({}, amm);
  const [prepegCost, pKNumer, pKDenom, newPeg] = calculateNewAmm(
    amm,
    oraclePriceData
  );
  newAmm.baseAssetReserve = newAmm.baseAssetReserve.mul(pKNumer).div(pKDenom);
  newAmm.sqrtK = newAmm.sqrtK.mul(pKNumer).div(pKDenom);
  const invariant = newAmm.sqrtK.mul(newAmm.sqrtK);
  newAmm.quoteAssetReserve = invariant.div(newAmm.baseAssetReserve);
  newAmm.pegMultiplier = newPeg;
  const directionToClose = amm.baseAssetAmountWithAmm.gt(ZERO) ? PositionDirection.SHORT : PositionDirection.LONG;
  const [newQuoteAssetReserve, _newBaseAssetReserve] = calculateAmmReservesAfterSwap(
    newAmm,
    "base",
    amm.baseAssetAmountWithAmm.abs(),
    getSwapDirection("base", directionToClose)
  );
  newAmm.terminalQuoteAssetReserve = newQuoteAssetReserve;
  newAmm.totalFeeMinusDistributions = newAmm.totalFeeMinusDistributions.sub(prepegCost);
  newAmm.netRevenueSinceLastFunding = newAmm.netRevenueSinceLastFunding.sub(prepegCost);
  return newAmm;
}
function calculateUpdatedAMMSpreadReserves(amm, direction, oraclePriceData) {
  const newAmm = calculateUpdatedAMM(amm, oraclePriceData);
  const [shortReserves, longReserves] = calculateSpreadReserves(
    newAmm,
    oraclePriceData
  );
  const dirReserves = isVariant(direction, "long") ? longReserves : shortReserves;
  const result = {
    baseAssetReserve: dirReserves.baseAssetReserve,
    quoteAssetReserve: dirReserves.quoteAssetReserve,
    sqrtK: newAmm.sqrtK,
    newPeg: newAmm.pegMultiplier
  };
  return result;
}
function calculateBidAskPrice(amm, oraclePriceData, withUpdate = true) {
  let newAmm;
  if (withUpdate) {
    newAmm = calculateUpdatedAMM(amm, oraclePriceData);
  } else {
    newAmm = amm;
  }
  const [bidReserves, askReserves] = calculateSpreadReserves(
    newAmm,
    oraclePriceData
  );
  const askPrice = calculatePrice(
    askReserves.baseAssetReserve,
    askReserves.quoteAssetReserve,
    newAmm.pegMultiplier
  );
  const bidPrice = calculatePrice(
    bidReserves.baseAssetReserve,
    bidReserves.quoteAssetReserve,
    newAmm.pegMultiplier
  );
  return [bidPrice, askPrice];
}
function calculatePrice(baseAssetReserves, quoteAssetReserves, pegMultiplier) {
  if (baseAssetReserves.abs().lte(ZERO)) {
    return new BN8(0);
  }
  return quoteAssetReserves.mul(PRICE_PRECISION).mul(pegMultiplier).div(PEG_PRECISION).div(baseAssetReserves);
}
function calculateAmmReservesAfterSwap(amm, inputAssetType, swapAmount, swapDirection) {
  assert(swapAmount.gte(ZERO), "swapAmount must be greater than 0");
  let newQuoteAssetReserve;
  let newBaseAssetReserve;
  if (inputAssetType === "quote") {
    swapAmount = swapAmount.mul(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO).div(amm.pegMultiplier);
    [newQuoteAssetReserve, newBaseAssetReserve] = calculateSwapOutput(
      amm.quoteAssetReserve,
      swapAmount,
      swapDirection,
      amm.sqrtK.mul(amm.sqrtK)
    );
  } else {
    [newBaseAssetReserve, newQuoteAssetReserve] = calculateSwapOutput(
      amm.baseAssetReserve,
      swapAmount,
      swapDirection,
      amm.sqrtK.mul(amm.sqrtK)
    );
  }
  return [newQuoteAssetReserve, newBaseAssetReserve];
}
function calculateMarketOpenBidAsk(baseAssetReserve, minBaseAssetReserve, maxBaseAssetReserve) {
  let openAsks;
  if (maxBaseAssetReserve.gt(baseAssetReserve)) {
    openAsks = maxBaseAssetReserve.sub(baseAssetReserve).mul(new BN8(-1));
  } else {
    openAsks = ZERO;
  }
  let openBids;
  if (minBaseAssetReserve.lt(baseAssetReserve)) {
    openBids = baseAssetReserve.sub(minBaseAssetReserve);
  } else {
    openBids = ZERO;
  }
  return [openBids, openAsks];
}
function calculateInventoryScale(baseAssetAmountWithAmm, baseAssetReserve, minBaseAssetReserve, maxBaseAssetReserve, directionalSpread, maxSpread) {
  if (baseAssetAmountWithAmm.eq(ZERO)) {
    return 0;
  }
  const defaultLargeBidAskFactor = BID_ASK_SPREAD_PRECISION.mul(new BN8(10));
  const [openBids, openAsks] = calculateMarketOpenBidAsk(
    baseAssetReserve,
    minBaseAssetReserve,
    maxBaseAssetReserve
  );
  const minSideLiquidity = BN8.max(
    new BN8(1),
    BN8.min(openBids.abs(), openAsks.abs())
  );
  const inventoryScaleMaxBN = BN8.max(
    defaultLargeBidAskFactor,
    new BN8(maxSpread / 2).mul(BID_ASK_SPREAD_PRECISION).div(new BN8(Math.max(directionalSpread, 1)))
  );
  const inventoryScaleBN = baseAssetAmountWithAmm.mul(BN8.max(baseAssetAmountWithAmm.abs(), BASE_PRECISION)).div(BASE_PRECISION).mul(defaultLargeBidAskFactor).div(minSideLiquidity).abs();
  const inventoryScale = BN8.min(inventoryScaleMaxBN, inventoryScaleBN).toNumber() / BID_ASK_SPREAD_PRECISION.toNumber();
  const inventoryScaleMax = inventoryScaleMaxBN.toNumber() / BID_ASK_SPREAD_PRECISION.toNumber();
  const inventorySpreadScale = Math.min(inventoryScaleMax, 1 + inventoryScale);
  return inventorySpreadScale;
}
function calculateEffectiveLeverage(baseSpread, quoteAssetReserve, terminalQuoteAssetReserve, pegMultiplier, netBaseAssetAmount, reservePrice, totalFeeMinusDistributions) {
  const netBaseAssetValue = quoteAssetReserve.sub(terminalQuoteAssetReserve).mul(pegMultiplier).div(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO);
  const localBaseAssetValue = netBaseAssetAmount.mul(reservePrice).div(AMM_TO_QUOTE_PRECISION_RATIO.mul(PRICE_PRECISION));
  const effectiveGap = Math.max(
    0,
    localBaseAssetValue.sub(netBaseAssetValue).toNumber()
  );
  const effectiveLeverage = effectiveGap / (Math.max(0, totalFeeMinusDistributions.toNumber()) + 1) + 1 / QUOTE_PRECISION.toNumber();
  return effectiveLeverage;
}
function calculateMaxSpread(marginRatioInitial) {
  const maxTargetSpread = new BN8(marginRatioInitial).mul(BID_ASK_SPREAD_PRECISION.div(MARGIN_PRECISION)).toNumber();
  return maxTargetSpread;
}
function calculateVolSpreadBN(lastOracleConfPct, reservePrice, markStd, oracleStd, longIntensity, shortIntensity, volume24H) {
  const marketAvgStdPct = markStd.add(oracleStd).mul(PERCENTAGE_PRECISION).div(reservePrice).div(new BN8(2));
  const volSpread = BN8.max(lastOracleConfPct, marketAvgStdPct.div(new BN8(2)));
  const clampMin = PERCENTAGE_PRECISION.div(new BN8(100));
  const clampMax = PERCENTAGE_PRECISION.mul(new BN8(16)).div(new BN8(10));
  const longVolSpreadFactor = clampBN(
    longIntensity.mul(PERCENTAGE_PRECISION).div(BN8.max(ONE, volume24H)),
    clampMin,
    clampMax
  );
  const shortVolSpreadFactor = clampBN(
    shortIntensity.mul(PERCENTAGE_PRECISION).div(BN8.max(ONE, volume24H)),
    clampMin,
    clampMax
  );
  const longVolSpread = BN8.max(
    lastOracleConfPct,
    volSpread.mul(longVolSpreadFactor).div(PERCENTAGE_PRECISION)
  );
  const shortVolSpread = BN8.max(
    lastOracleConfPct,
    volSpread.mul(shortVolSpreadFactor).div(PERCENTAGE_PRECISION)
  );
  return [longVolSpread, shortVolSpread];
}
function calculateSpreadBN(baseSpread, lastOracleReservePriceSpreadPct, lastOracleConfPct, maxSpread, quoteAssetReserve, terminalQuoteAssetReserve, pegMultiplier, baseAssetAmountWithAmm, reservePrice, totalFeeMinusDistributions, netRevenueSinceLastFunding, baseAssetReserve, minBaseAssetReserve, maxBaseAssetReserve, markStd, oracleStd, longIntensity, shortIntensity, volume24H, returnTerms = false) {
  assert(Number.isInteger(baseSpread));
  assert(Number.isInteger(maxSpread));
  const spreadTerms = {
    longVolSpread: 0,
    shortVolSpread: 0,
    longSpreadwPS: 0,
    shortSpreadwPS: 0,
    maxTargetSpread: 0,
    inventorySpreadScale: 0,
    longSpreadwInvScale: 0,
    shortSpreadwInvScale: 0,
    effectiveLeverage: 0,
    effectiveLeverageCapped: 0,
    longSpreadwEL: 0,
    shortSpreadwEL: 0,
    revenueRetreatAmount: 0,
    halfRevenueRetreatAmount: 0,
    longSpreadwRevRetreat: 0,
    shortSpreadwRevRetreat: 0,
    totalSpread: 0,
    longSpread: 0,
    shortSpread: 0
  };
  const [longVolSpread, shortVolSpread] = calculateVolSpreadBN(
    lastOracleConfPct,
    reservePrice,
    markStd,
    oracleStd,
    longIntensity,
    shortIntensity,
    volume24H
  );
  spreadTerms.longVolSpread = longVolSpread.toNumber();
  spreadTerms.shortVolSpread = shortVolSpread.toNumber();
  let longSpread = Math.max(baseSpread / 2, longVolSpread.toNumber());
  let shortSpread = Math.max(baseSpread / 2, shortVolSpread.toNumber());
  if (lastOracleReservePriceSpreadPct.gt(ZERO)) {
    shortSpread = Math.max(
      shortSpread,
      lastOracleReservePriceSpreadPct.abs().toNumber() + shortVolSpread.toNumber()
    );
  } else if (lastOracleReservePriceSpreadPct.lt(ZERO)) {
    longSpread = Math.max(
      longSpread,
      lastOracleReservePriceSpreadPct.abs().toNumber() + longVolSpread.toNumber()
    );
  }
  spreadTerms.longSpreadwPS = longSpread;
  spreadTerms.shortSpreadwPS = shortSpread;
  const maxTargetSpread = Math.floor(
    Math.max(maxSpread, lastOracleReservePriceSpreadPct.abs().toNumber())
  );
  const inventorySpreadScale = calculateInventoryScale(
    baseAssetAmountWithAmm,
    baseAssetReserve,
    minBaseAssetReserve,
    maxBaseAssetReserve,
    baseAssetAmountWithAmm.gt(ZERO) ? longSpread : shortSpread,
    maxTargetSpread
  );
  if (baseAssetAmountWithAmm.gt(ZERO)) {
    longSpread *= inventorySpreadScale;
  } else if (baseAssetAmountWithAmm.lt(ZERO)) {
    shortSpread *= inventorySpreadScale;
  }
  spreadTerms.maxTargetSpread = maxTargetSpread;
  spreadTerms.inventorySpreadScale = inventorySpreadScale;
  spreadTerms.longSpreadwInvScale = longSpread;
  spreadTerms.shortSpreadwInvScale = shortSpread;
  const MAX_SPREAD_SCALE = 10;
  if (totalFeeMinusDistributions.gt(ZERO)) {
    const effectiveLeverage = calculateEffectiveLeverage(
      baseSpread,
      quoteAssetReserve,
      terminalQuoteAssetReserve,
      pegMultiplier,
      baseAssetAmountWithAmm,
      reservePrice,
      totalFeeMinusDistributions
    );
    spreadTerms.effectiveLeverage = effectiveLeverage;
    const spreadScale = Math.min(MAX_SPREAD_SCALE, 1 + effectiveLeverage);
    spreadTerms.effectiveLeverageCapped = spreadScale;
    if (baseAssetAmountWithAmm.gt(ZERO)) {
      longSpread *= spreadScale;
      longSpread = Math.floor(longSpread);
    } else {
      shortSpread *= spreadScale;
      shortSpread = Math.floor(shortSpread);
    }
  } else {
    longSpread *= MAX_SPREAD_SCALE;
    shortSpread *= MAX_SPREAD_SCALE;
  }
  spreadTerms.longSpreadwEL = longSpread;
  spreadTerms.shortSpreadwEL = shortSpread;
  if (netRevenueSinceLastFunding.lt(
    DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT
  )) {
    const revenueRetreatAmount = Math.min(
      maxTargetSpread / 10,
      Math.floor(
        baseSpread * netRevenueSinceLastFunding.abs().toNumber() / DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT.abs().toNumber()
      )
    );
    const halfRevenueRetreatAmount = Math.floor(revenueRetreatAmount / 2);
    spreadTerms.revenueRetreatAmount = revenueRetreatAmount;
    spreadTerms.halfRevenueRetreatAmount = halfRevenueRetreatAmount;
    if (baseAssetAmountWithAmm.gt(ZERO)) {
      longSpread += revenueRetreatAmount;
      shortSpread += halfRevenueRetreatAmount;
    } else if (baseAssetAmountWithAmm.lt(ZERO)) {
      longSpread += halfRevenueRetreatAmount;
      shortSpread += revenueRetreatAmount;
    } else {
      longSpread += halfRevenueRetreatAmount;
      shortSpread += halfRevenueRetreatAmount;
    }
  }
  spreadTerms.longSpreadwRevRetreat = longSpread;
  spreadTerms.shortSpreadwRevRetreat = shortSpread;
  const totalSpread = longSpread + shortSpread;
  if (totalSpread > maxTargetSpread) {
    if (longSpread > shortSpread) {
      longSpread = Math.ceil(longSpread * maxTargetSpread / totalSpread);
      shortSpread = Math.floor(maxTargetSpread - longSpread);
    } else {
      shortSpread = Math.ceil(shortSpread * maxTargetSpread / totalSpread);
      longSpread = Math.floor(maxTargetSpread - shortSpread);
    }
  }
  spreadTerms.totalSpread = totalSpread;
  spreadTerms.longSpread = longSpread;
  spreadTerms.shortSpread = shortSpread;
  if (returnTerms) {
    return spreadTerms;
  }
  return [longSpread, shortSpread];
}
function calculateSpread(amm, oraclePriceData, now) {
  if (amm.baseSpread == 0 || amm.curveUpdateIntensity == 0) {
    return [amm.baseSpread / 2, amm.baseSpread / 2];
  }
  const reservePrice = calculatePrice(
    amm.baseAssetReserve,
    amm.quoteAssetReserve,
    amm.pegMultiplier
  );
  const targetPrice = (oraclePriceData == null ? void 0 : oraclePriceData.price) || reservePrice;
  const confInterval = oraclePriceData.confidence || ZERO;
  const targetMarkSpreadPct = reservePrice.sub(targetPrice).mul(BID_ASK_SPREAD_PRECISION).div(reservePrice);
  const confIntervalPct = confInterval.mul(BID_ASK_SPREAD_PRECISION).div(reservePrice);
  now = now || new BN8(new Date().getTime() / 1e3);
  const liveOracleStd = calculateLiveOracleStd(amm, oraclePriceData, now);
  const spreads = calculateSpreadBN(
    amm.baseSpread,
    targetMarkSpreadPct,
    confIntervalPct,
    amm.maxSpread,
    amm.quoteAssetReserve,
    amm.terminalQuoteAssetReserve,
    amm.pegMultiplier,
    amm.baseAssetAmountWithAmm,
    reservePrice,
    amm.totalFeeMinusDistributions,
    amm.netRevenueSinceLastFunding,
    amm.baseAssetReserve,
    amm.minBaseAssetReserve,
    amm.maxBaseAssetReserve,
    amm.markStd,
    liveOracleStd,
    amm.longIntensityVolume,
    amm.shortIntensityVolume,
    amm.volume24H
  );
  const longSpread = spreads[0];
  const shortSpread = spreads[1];
  return [longSpread, shortSpread];
}
function calculateSpreadReserves(amm, oraclePriceData, now) {
  function calculateSpreadReserve(spread, direction, amm2) {
    if (spread === 0) {
      return {
        baseAssetReserve: amm2.baseAssetReserve,
        quoteAssetReserve: amm2.quoteAssetReserve
      };
    }
    const quoteAssetReserveDelta = amm2.quoteAssetReserve.div(
      BID_ASK_SPREAD_PRECISION.div(new BN8(spread / 2))
    );
    let quoteAssetReserve;
    if (isVariant(direction, "long")) {
      quoteAssetReserve = amm2.quoteAssetReserve.add(quoteAssetReserveDelta);
    } else {
      quoteAssetReserve = amm2.quoteAssetReserve.sub(quoteAssetReserveDelta);
    }
    const baseAssetReserve = amm2.sqrtK.mul(amm2.sqrtK).div(quoteAssetReserve);
    return {
      baseAssetReserve,
      quoteAssetReserve
    };
  }
  const [longSpread, shortSpread] = calculateSpread(amm, oraclePriceData, now);
  const askReserves = calculateSpreadReserve(
    longSpread,
    PositionDirection.LONG,
    amm
  );
  const bidReserves = calculateSpreadReserve(
    shortSpread,
    PositionDirection.SHORT,
    amm
  );
  return [bidReserves, askReserves];
}
function calculateSwapOutput(inputAssetReserve, swapAmount, swapDirection, invariant) {
  let newInputAssetReserve;
  if (swapDirection === SwapDirection.ADD) {
    newInputAssetReserve = inputAssetReserve.add(swapAmount);
  } else {
    newInputAssetReserve = inputAssetReserve.sub(swapAmount);
  }
  const newOutputAssetReserve = invariant.div(newInputAssetReserve);
  return [newInputAssetReserve, newOutputAssetReserve];
}
function getSwapDirection(inputAssetType, positionDirection) {
  if (isVariant(positionDirection, "long") && inputAssetType === "base") {
    return SwapDirection.REMOVE;
  }
  if (isVariant(positionDirection, "short") && inputAssetType === "quote") {
    return SwapDirection.REMOVE;
  }
  return SwapDirection.ADD;
}
function calculateTerminalPrice(market) {
  const directionToClose = market.amm.baseAssetAmountWithAmm.gt(ZERO) ? PositionDirection.SHORT : PositionDirection.LONG;
  const [newQuoteAssetReserve, newBaseAssetReserve] = calculateAmmReservesAfterSwap(
    market.amm,
    "base",
    market.amm.baseAssetAmountWithAmm.abs(),
    getSwapDirection("base", directionToClose)
  );
  const terminalPrice = newQuoteAssetReserve.mul(PRICE_PRECISION).mul(market.amm.pegMultiplier).div(PEG_PRECISION).div(newBaseAssetReserve);
  return terminalPrice;
}
function calculateMaxBaseAssetAmountToTrade(amm, limit_price, direction, oraclePriceData, now) {
  const invariant = amm.sqrtK.mul(amm.sqrtK);
  const newBaseAssetReserveSquared = invariant.mul(PRICE_PRECISION).mul(amm.pegMultiplier).div(limit_price).div(PEG_PRECISION);
  const newBaseAssetReserve = squareRootBN(newBaseAssetReserveSquared);
  const [shortSpreadReserves, longSpreadReserves] = calculateSpreadReserves(
    amm,
    oraclePriceData,
    now
  );
  const baseAssetReserveBefore = isVariant(direction, "long") ? longSpreadReserves.baseAssetReserve : shortSpreadReserves.baseAssetReserve;
  if (newBaseAssetReserve.gt(baseAssetReserveBefore)) {
    return [
      newBaseAssetReserve.sub(baseAssetReserveBefore),
      PositionDirection.SHORT
    ];
  } else if (newBaseAssetReserve.lt(baseAssetReserveBefore)) {
    return [
      baseAssetReserveBefore.sub(newBaseAssetReserve),
      PositionDirection.LONG
    ];
  } else {
    console.log("tradeSize Too Small");
    return [new BN8(0), PositionDirection.LONG];
  }
}
function calculateQuoteAssetAmountSwapped(quoteAssetReserves, pegMultiplier, swapDirection) {
  if (isVariant(swapDirection, "remove")) {
    quoteAssetReserves = quoteAssetReserves.add(ONE);
  }
  let quoteAssetAmount = quoteAssetReserves.mul(pegMultiplier).div(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO);
  if (isVariant(swapDirection, "remove")) {
    quoteAssetAmount = quoteAssetAmount.add(ONE);
  }
  return quoteAssetAmount;
}
function calculateMaxBaseAssetAmountFillable(amm, orderDirection) {
  const maxFillSize = amm.baseAssetReserve.div(
    new BN8(amm.maxFillReserveFraction)
  );
  let maxBaseAssetAmountOnSide;
  if (isVariant(orderDirection, "long")) {
    maxBaseAssetAmountOnSide = BN8.max(
      ZERO,
      amm.baseAssetReserve.sub(amm.minBaseAssetReserve)
    );
  } else {
    maxBaseAssetAmountOnSide = BN8.max(
      ZERO,
      amm.maxBaseAssetReserve.sub(amm.baseAssetReserve)
    );
  }
  return standardizeBaseAssetAmount(
    BN8.min(maxFillSize, maxBaseAssetAmountOnSide),
    amm.orderStepSize
  );
}

// src/math/margin.ts
import { BN as BN9 } from "@project-serum/anchor";
function calculateSizePremiumLiabilityWeight(size, imfFactor, liabilityWeight, precision) {
  if (imfFactor.eq(ZERO)) {
    return liabilityWeight;
  }
  const sizeSqrt = squareRootBN(size.mul(new BN9(10)).add(new BN9(1)));
  const denom0 = BN9.max(new BN9(1), SPOT_MARKET_IMF_PRECISION.div(imfFactor));
  assert(denom0.gt(ZERO));
  const liabilityWeightNumerator = liabilityWeight.sub(
    liabilityWeight.div(
      BN9.max(new BN9(1), SPOT_MARKET_IMF_PRECISION.div(imfFactor))
    )
  );
  const denom = new BN9(1e5).mul(SPOT_MARKET_IMF_PRECISION).div(precision);
  assert(denom.gt(ZERO));
  const sizePremiumLiabilityWeight = liabilityWeightNumerator.add(
    sizeSqrt.mul(imfFactor).div(denom)
  );
  const maxLiabilityWeight = BN9.max(
    liabilityWeight,
    sizePremiumLiabilityWeight
  );
  return maxLiabilityWeight;
}
function calculateSizeDiscountAssetWeight(size, imfFactor, assetWeight) {
  if (imfFactor.eq(ZERO)) {
    return assetWeight;
  }
  const sizeSqrt = squareRootBN(size.mul(new BN9(10)).add(new BN9(1)));
  const imfNumerator = SPOT_MARKET_IMF_PRECISION.add(
    SPOT_MARKET_IMF_PRECISION.div(new BN9(10))
  );
  const sizeDiscountAssetWeight = imfNumerator.mul(SPOT_MARKET_WEIGHT_PRECISION).div(
    SPOT_MARKET_IMF_PRECISION.add(
      sizeSqrt.mul(imfFactor).div(new BN9(1e5))
    )
  );
  const minAssetWeight = BN9.min(assetWeight, sizeDiscountAssetWeight);
  return minAssetWeight;
}
function calculateOraclePriceForPerpMargin(perpPosition, market, oraclePriceData) {
  const oraclePriceOffset = BN9.min(
    new BN9(market.amm.maxSpread).mul(oraclePriceData.price).div(BID_ASK_SPREAD_PRECISION),
    oraclePriceData.confidence.add(
      new BN9(market.amm.baseSpread).mul(oraclePriceData.price).div(BID_ASK_SPREAD_PRECISION)
    )
  );
  let marginPrice;
  if (perpPosition.baseAssetAmount.gt(ZERO)) {
    marginPrice = oraclePriceData.price.sub(oraclePriceOffset);
  } else {
    marginPrice = oraclePriceData.price.add(oraclePriceOffset);
  }
  return marginPrice;
}
function calculateBaseAssetValueWithOracle(market, perpPosition, oraclePriceData) {
  let price = oraclePriceData.price;
  if (isVariant(market.status, "settlement")) {
    price = market.expiryPrice;
  }
  return perpPosition.baseAssetAmount.abs().mul(price).div(AMM_RESERVE_PRECISION);
}
function calculateWorstCaseBaseAssetAmount(perpPosition) {
  const allBids = perpPosition.baseAssetAmount.add(perpPosition.openBids);
  const allAsks = perpPosition.baseAssetAmount.add(perpPosition.openAsks);
  if (allBids.abs().gt(allAsks.abs())) {
    return allBids;
  } else {
    return allAsks;
  }
}

// src/math/market.ts
import { BN as BN11 } from "@project-serum/anchor";

// src/math/spotBalance.ts
import { BN as BN10 } from "@project-serum/anchor";
function getBalance(tokenAmount, spotMarket, balanceType) {
  const precisionIncrease = TEN.pow(new BN10(19 - spotMarket.decimals));
  const cumulativeInterest = isVariant(balanceType, "deposit") ? spotMarket.cumulativeDepositInterest : spotMarket.cumulativeBorrowInterest;
  let balance = tokenAmount.mul(precisionIncrease).div(cumulativeInterest);
  if (!balance.eq(ZERO) && isVariant(balanceType, "borrow")) {
    balance = balance.add(ONE);
  }
  return balance;
}
function getTokenAmount(balanceAmount, spotMarket, balanceType) {
  const precisionDecrease = TEN.pow(new BN10(19 - spotMarket.decimals));
  const cumulativeInterest = isVariant(balanceType, "deposit") ? spotMarket.cumulativeDepositInterest : spotMarket.cumulativeBorrowInterest;
  return balanceAmount.mul(cumulativeInterest).div(precisionDecrease);
}
function getSignedTokenAmount(tokenAmount, balanceType) {
  if (isVariant(balanceType, "deposit")) {
    return tokenAmount;
  } else {
    return tokenAmount.abs().neg();
  }
}
function getTokenValue(tokenAmount, spotDecimals, oraclePriceData) {
  if (tokenAmount.eq(ZERO)) {
    return ZERO;
  }
  const precisionDecrease = TEN.pow(new BN10(spotDecimals));
  return tokenAmount.mul(oraclePriceData.price).div(precisionDecrease);
}
function calculateAssetWeight(balanceAmount, spotMarket, marginCategory) {
  const sizePrecision = TEN.pow(new BN10(spotMarket.decimals));
  let sizeInAmmReservePrecision;
  if (sizePrecision.gt(AMM_RESERVE_PRECISION)) {
    sizeInAmmReservePrecision = balanceAmount.div(
      sizePrecision.div(AMM_RESERVE_PRECISION)
    );
  } else {
    sizeInAmmReservePrecision = balanceAmount.mul(AMM_RESERVE_PRECISION).div(sizePrecision);
  }
  let assetWeight;
  switch (marginCategory) {
    case "Initial":
      assetWeight = calculateSizeDiscountAssetWeight(
        sizeInAmmReservePrecision,
        new BN10(spotMarket.imfFactor),
        new BN10(spotMarket.initialAssetWeight)
      );
      break;
    case "Maintenance":
      assetWeight = calculateSizeDiscountAssetWeight(
        sizeInAmmReservePrecision,
        new BN10(spotMarket.imfFactor),
        new BN10(spotMarket.maintenanceAssetWeight)
      );
      break;
    default:
      assetWeight = new BN10(spotMarket.initialAssetWeight);
      break;
  }
  return assetWeight;
}
function calculateLiabilityWeight(balanceAmount, spotMarket, marginCategory) {
  const sizePrecision = TEN.pow(new BN10(spotMarket.decimals));
  let sizeInAmmReservePrecision;
  if (sizePrecision.gt(AMM_RESERVE_PRECISION)) {
    sizeInAmmReservePrecision = balanceAmount.div(
      sizePrecision.div(AMM_RESERVE_PRECISION)
    );
  } else {
    sizeInAmmReservePrecision = balanceAmount.mul(AMM_RESERVE_PRECISION).div(sizePrecision);
  }
  let assetWeight;
  switch (marginCategory) {
    case "Initial":
      assetWeight = calculateSizePremiumLiabilityWeight(
        sizeInAmmReservePrecision,
        new BN10(spotMarket.imfFactor),
        new BN10(spotMarket.initialLiabilityWeight),
        SPOT_MARKET_WEIGHT_PRECISION
      );
      break;
    case "Maintenance":
      assetWeight = calculateSizePremiumLiabilityWeight(
        sizeInAmmReservePrecision,
        new BN10(spotMarket.imfFactor),
        new BN10(spotMarket.maintenanceLiabilityWeight),
        SPOT_MARKET_WEIGHT_PRECISION
      );
      break;
    default:
      assetWeight = spotMarket.initialLiabilityWeight;
      break;
  }
  return assetWeight;
}
function calculateUtilization(bank) {
  const tokenDepositAmount = getTokenAmount(
    bank.depositBalance,
    bank,
    SpotBalanceType.DEPOSIT
  );
  const tokenBorrowAmount = getTokenAmount(
    bank.borrowBalance,
    bank,
    SpotBalanceType.BORROW
  );
  let utilization;
  if (tokenBorrowAmount.eq(ZERO) && tokenDepositAmount.eq(ZERO)) {
    utilization = ZERO;
  } else if (tokenDepositAmount.eq(ZERO)) {
    utilization = SPOT_MARKET_UTILIZATION_PRECISION;
  } else {
    utilization = tokenBorrowAmount.mul(SPOT_MARKET_UTILIZATION_PRECISION).div(tokenDepositAmount);
  }
  return utilization;
}
function calculateInterestRate(bank) {
  const utilization = calculateUtilization(bank);
  let interestRate;
  if (utilization.gt(new BN10(bank.optimalUtilization))) {
    const surplusUtilization = utilization.sub(new BN10(bank.optimalUtilization));
    const borrowRateSlope = new BN10(bank.maxBorrowRate - bank.optimalBorrowRate).mul(SPOT_MARKET_UTILIZATION_PRECISION).div(
      SPOT_MARKET_UTILIZATION_PRECISION.sub(new BN10(bank.optimalUtilization))
    );
    interestRate = new BN10(bank.optimalBorrowRate).add(
      surplusUtilization.mul(borrowRateSlope).div(SPOT_MARKET_UTILIZATION_PRECISION)
    );
  } else {
    const borrowRateSlope = new BN10(bank.optimalBorrowRate).mul(SPOT_MARKET_UTILIZATION_PRECISION).div(
      SPOT_MARKET_UTILIZATION_PRECISION.sub(new BN10(bank.optimalUtilization))
    );
    interestRate = utilization.mul(borrowRateSlope).div(SPOT_MARKET_UTILIZATION_PRECISION);
  }
  return interestRate;
}
function calculateDepositRate(bank) {
  const utilization = calculateUtilization(bank);
  const borrowRate = calculateBorrowRate(bank);
  const depositRate = borrowRate.mul(PERCENTAGE_PRECISION.sub(new BN10(bank.insuranceFund.totalFactor))).mul(utilization).div(SPOT_MARKET_UTILIZATION_PRECISION).div(PERCENTAGE_PRECISION);
  return depositRate;
}
function calculateBorrowRate(bank) {
  return calculateInterestRate(bank);
}
function calculateInterestAccumulated(bank, now) {
  const interestRate = calculateInterestRate(bank);
  const timeSinceLastUpdate = now.sub(bank.lastInterestTs);
  const modifiedBorrowRate = interestRate.mul(timeSinceLastUpdate);
  const utilization = calculateUtilization(bank);
  const modifiedDepositRate = modifiedBorrowRate.mul(utilization).div(SPOT_MARKET_UTILIZATION_PRECISION);
  const borrowInterest = bank.cumulativeBorrowInterest.mul(modifiedBorrowRate).div(ONE_YEAR).div(SPOT_MARKET_RATE_PRECISION).add(ONE);
  const depositInterest = bank.cumulativeDepositInterest.mul(modifiedDepositRate).div(ONE_YEAR).div(SPOT_MARKET_RATE_PRECISION);
  return { borrowInterest, depositInterest };
}
function calculateWithdrawLimit(spotMarket, now) {
  const marketDepositTokenAmount = getTokenAmount(
    spotMarket.depositBalance,
    spotMarket,
    SpotBalanceType.DEPOSIT
  );
  const marketBorrowTokenAmount = getTokenAmount(
    spotMarket.borrowBalance,
    spotMarket,
    SpotBalanceType.BORROW
  );
  const twentyFourHours = new BN10(60 * 60 * 24);
  const sinceLast = now.sub(spotMarket.lastTwapTs);
  const sinceStart = BN10.max(ZERO, twentyFourHours.sub(sinceLast));
  const borrowTokenTwapLive = spotMarket.borrowTokenTwap.mul(sinceStart).add(marketBorrowTokenAmount.mul(sinceLast)).div(sinceLast.add(sinceStart));
  const depositTokenTwapLive = spotMarket.depositTokenTwap.mul(sinceStart).add(marketDepositTokenAmount.mul(sinceLast)).div(sinceLast.add(sinceStart));
  const maxBorrowTokens = BN10.min(
    BN10.max(
      marketDepositTokenAmount.div(new BN10(6)),
      borrowTokenTwapLive.add(borrowTokenTwapLive.div(new BN10(5)))
    ),
    marketDepositTokenAmount.sub(marketDepositTokenAmount.div(new BN10(5)))
  );
  const minDepositTokens = depositTokenTwapLive.sub(
    BN10.min(
      BN10.max(
        depositTokenTwapLive.div(new BN10(5)),
        spotMarket.withdrawGuardThreshold
      ),
      depositTokenTwapLive
    )
  );
  return {
    borrowLimit: maxBorrowTokens.sub(marketBorrowTokenAmount),
    withdrawLimit: marketDepositTokenAmount.sub(minDepositTokens)
  };
}

// src/math/market.ts
function calculateReservePrice(market, oraclePriceData) {
  const newAmm = calculateUpdatedAMM(market.amm, oraclePriceData);
  return calculatePrice(
    newAmm.baseAssetReserve,
    newAmm.quoteAssetReserve,
    newAmm.pegMultiplier
  );
}
function calculateBidPrice(market, oraclePriceData) {
  const { baseAssetReserve, quoteAssetReserve, newPeg } = calculateUpdatedAMMSpreadReserves(
    market.amm,
    PositionDirection.SHORT,
    oraclePriceData
  );
  return calculatePrice(baseAssetReserve, quoteAssetReserve, newPeg);
}
function calculateAskPrice(market, oraclePriceData) {
  const { baseAssetReserve, quoteAssetReserve, newPeg } = calculateUpdatedAMMSpreadReserves(
    market.amm,
    PositionDirection.LONG,
    oraclePriceData
  );
  return calculatePrice(baseAssetReserve, quoteAssetReserve, newPeg);
}
function calculateNewMarketAfterTrade(baseAssetAmount, direction, market) {
  const [newQuoteAssetReserve, newBaseAssetReserve] = calculateAmmReservesAfterSwap(
    market.amm,
    "base",
    baseAssetAmount.abs(),
    getSwapDirection("base", direction)
  );
  const newAmm = Object.assign({}, market.amm);
  const newMarket = Object.assign({}, market);
  newMarket.amm = newAmm;
  newMarket.amm.quoteAssetReserve = newQuoteAssetReserve;
  newMarket.amm.baseAssetReserve = newBaseAssetReserve;
  return newMarket;
}
function calculateOracleReserveSpread(market, oraclePriceData) {
  const reservePrice = calculateReservePrice(market, oraclePriceData);
  return calculateOracleSpread(reservePrice, oraclePriceData);
}
function calculateOracleSpread(price, oraclePriceData) {
  return price.sub(oraclePriceData.price);
}
function calculateMarketMarginRatio(market, size, marginCategory) {
  let marginRatio;
  switch (marginCategory) {
    case "Initial":
      marginRatio = calculateSizePremiumLiabilityWeight(
        size,
        new BN11(market.imfFactor),
        new BN11(market.marginRatioInitial),
        MARGIN_PRECISION
      ).toNumber();
      break;
    case "Maintenance":
      marginRatio = calculateSizePremiumLiabilityWeight(
        size,
        new BN11(market.imfFactor),
        new BN11(market.marginRatioMaintenance),
        MARGIN_PRECISION
      ).toNumber();
      break;
  }
  return marginRatio;
}
function calculateUnrealizedAssetWeight(market, quoteSpotMarket, unrealizedPnl, marginCategory, oraclePriceData) {
  let assetWeight;
  switch (marginCategory) {
    case "Initial":
      assetWeight = new BN11(market.unrealizedPnlInitialAssetWeight);
      if (market.unrealizedPnlMaxImbalance.gt(ZERO)) {
        const netUnsettledPnl = calculateNetUserPnlImbalance(
          market,
          quoteSpotMarket,
          oraclePriceData
        );
        if (netUnsettledPnl.gt(market.unrealizedPnlMaxImbalance)) {
          assetWeight = assetWeight.mul(market.unrealizedPnlMaxImbalance).div(netUnsettledPnl);
        }
      }
      assetWeight = calculateSizeDiscountAssetWeight(
        unrealizedPnl,
        new BN11(market.unrealizedPnlImfFactor),
        assetWeight
      );
      break;
    case "Maintenance":
      assetWeight = new BN11(market.unrealizedPnlMaintenanceAssetWeight);
      break;
  }
  return assetWeight;
}
function calculateMarketAvailablePNL(perpMarket, spotMarket) {
  return getTokenAmount(
    perpMarket.pnlPool.scaledBalance,
    spotMarket,
    SpotBalanceType.DEPOSIT
  );
}
function calculateNetUserPnl(perpMarket, oraclePriceData) {
  const netUserPositionValue = perpMarket.amm.baseAssetAmountWithAmm.mul(oraclePriceData.price).div(BASE_PRECISION).div(PRICE_TO_QUOTE_PRECISION);
  const netUserCostBasis = perpMarket.amm.quoteAssetAmount;
  const netUserPnl = netUserPositionValue.add(netUserCostBasis);
  return netUserPnl;
}
function calculateNetUserPnlImbalance(perpMarket, spotMarket, oraclePriceData) {
  const netUserPnl = calculateNetUserPnl(perpMarket, oraclePriceData);
  const pnlPool = getTokenAmount(
    perpMarket.pnlPool.scaledBalance,
    spotMarket,
    SpotBalanceType.DEPOSIT
  );
  const imbalance = netUserPnl.sub(pnlPool);
  return imbalance;
}

// src/math/position.ts
function calculateBaseAssetValue(market, userPosition, oraclePriceData, useSpread = true, skipUpdate = false) {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }
  const directionToClose = findDirectionToClose(userPosition);
  let prepegAmm;
  if (!skipUpdate) {
    if (market.amm.baseSpread > 0 && useSpread) {
      const { baseAssetReserve, quoteAssetReserve, sqrtK, newPeg } = calculateUpdatedAMMSpreadReserves(
        market.amm,
        directionToClose,
        oraclePriceData
      );
      prepegAmm = {
        baseAssetReserve,
        quoteAssetReserve,
        sqrtK,
        pegMultiplier: newPeg
      };
    } else {
      prepegAmm = calculateUpdatedAMM(market.amm, oraclePriceData);
    }
  } else {
    prepegAmm = market.amm;
  }
  const [newQuoteAssetReserve, _] = calculateAmmReservesAfterSwap(
    prepegAmm,
    "base",
    userPosition.baseAssetAmount.abs(),
    getSwapDirection("base", directionToClose)
  );
  switch (directionToClose) {
    case PositionDirection.SHORT:
      return prepegAmm.quoteAssetReserve.sub(newQuoteAssetReserve).mul(prepegAmm.pegMultiplier).div(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO);
    case PositionDirection.LONG:
      return newQuoteAssetReserve.sub(prepegAmm.quoteAssetReserve).mul(prepegAmm.pegMultiplier).div(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO).add(ONE);
  }
}
function calculatePositionPNL(market, perpPosition, withFunding = false, oraclePriceData) {
  if (perpPosition.baseAssetAmount.eq(ZERO)) {
    return perpPosition.quoteAssetAmount;
  }
  const baseAssetValue = calculateBaseAssetValueWithOracle(
    market,
    perpPosition,
    oraclePriceData
  );
  const baseAssetValueSign = perpPosition.baseAssetAmount.isNeg() ? new BN(-1) : new BN(1);
  let pnl = baseAssetValue.mul(baseAssetValueSign).add(perpPosition.quoteAssetAmount);
  if (withFunding) {
    const fundingRatePnL = calculatePositionFundingPNL(market, perpPosition);
    pnl = pnl.add(fundingRatePnL);
  }
  return pnl;
}
function calculateClaimablePnl(market, spotMarket, perpPosition, oraclePriceData) {
  const unrealizedPnl = calculatePositionPNL(
    market,
    perpPosition,
    true,
    oraclePriceData
  );
  const fundingPnL = calculatePositionFundingPNL(market, perpPosition);
  let unsettledPnl = unrealizedPnl.add(fundingPnL);
  if (unrealizedPnl.gt(ZERO)) {
    const excessPnlPool = BN.max(
      ZERO,
      calculateNetUserPnlImbalance(market, spotMarket, oraclePriceData).mul(
        new BN(-1)
      )
    );
    const maxPositivePnl = BN.max(
      perpPosition.quoteAssetAmount.sub(perpPosition.quoteEntryAmount),
      ZERO
    ).add(excessPnlPool);
    unsettledPnl = BN.min(maxPositivePnl, unrealizedPnl);
  }
  return unsettledPnl;
}
function calculatePositionFundingPNL(market, perpPosition) {
  if (perpPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }
  let ammCumulativeFundingRate;
  if (perpPosition.baseAssetAmount.gt(ZERO)) {
    ammCumulativeFundingRate = market.amm.cumulativeFundingRateLong;
  } else {
    ammCumulativeFundingRate = market.amm.cumulativeFundingRateShort;
  }
  const perPositionFundingRate = ammCumulativeFundingRate.sub(perpPosition.lastCumulativeFundingRate).mul(perpPosition.baseAssetAmount).div(AMM_RESERVE_PRECISION).div(FUNDING_RATE_BUFFER_PRECISION).mul(new BN(-1));
  return perPositionFundingRate;
}
function positionIsAvailable(position) {
  return position.baseAssetAmount.eq(ZERO) && position.openOrders === 0 && position.quoteAssetAmount.eq(ZERO) && position.lpShares.eq(ZERO);
}
function calculateBreakEvenPrice(userPosition) {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }
  return userPosition.quoteBreakEvenAmount.mul(PRICE_PRECISION).mul(AMM_TO_QUOTE_PRECISION_RATIO).div(userPosition.baseAssetAmount).abs();
}
function calculateEntryPrice(userPosition) {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }
  return userPosition.quoteEntryAmount.mul(PRICE_PRECISION).mul(AMM_TO_QUOTE_PRECISION_RATIO).div(userPosition.baseAssetAmount).abs();
}
function calculateCostBasis(userPosition) {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }
  return userPosition.quoteAssetAmount.mul(PRICE_PRECISION).mul(AMM_TO_QUOTE_PRECISION_RATIO).div(userPosition.baseAssetAmount).abs();
}
function findDirectionToClose(userPosition) {
  return userPosition.baseAssetAmount.gt(ZERO) ? PositionDirection.SHORT : PositionDirection.LONG;
}
function positionCurrentDirection(userPosition) {
  return userPosition.baseAssetAmount.gte(ZERO) ? PositionDirection.LONG : PositionDirection.SHORT;
}
function isEmptyPosition(userPosition) {
  return userPosition.baseAssetAmount.eq(ZERO) && userPosition.openOrders === 0;
}

// src/tx/retryTxSender.ts
import assert2 from "assert";
import bs58 from "bs58";
var DEFAULT_TIMEOUT = 35e3;
var DEFAULT_RETRY = 8e3;
var RetryTxSender = class {
  constructor(provider, timeout, retrySleep, additionalConnections = new Array()) {
    this.provider = provider;
    this.timeout = timeout != null ? timeout : DEFAULT_TIMEOUT;
    this.retrySleep = retrySleep != null ? retrySleep : DEFAULT_RETRY;
    this.additionalConnections = additionalConnections;
  }
  async send(tx, additionalSigners, opts, preSigned) {
    if (additionalSigners === void 0) {
      additionalSigners = [];
    }
    if (opts === void 0) {
      opts = this.provider.opts;
    }
    if (!preSigned) {
      await this.prepareTx(tx, additionalSigners, opts);
    }
    const rawTransaction = tx.serialize();
    const startTime = this.getTimestamp();
    let txid;
    try {
      txid = await this.provider.connection.sendRawTransaction(
        rawTransaction,
        opts
      );
      this.sendToAdditionalConnections(rawTransaction, opts);
    } catch (e) {
      console.error(e);
      throw e;
    }
    let done = false;
    const resolveReference = {
      resolve: void 0
    };
    const stopWaiting = () => {
      done = true;
      if (resolveReference.resolve) {
        resolveReference.resolve();
      }
    };
    (async () => {
      while (!done && this.getTimestamp() - startTime < this.timeout) {
        await this.sleep(resolveReference);
        if (!done) {
          this.provider.connection.sendRawTransaction(rawTransaction, opts).catch((e) => {
            console.error(e);
            stopWaiting();
          });
          this.sendToAdditionalConnections(rawTransaction, opts);
        }
      }
    })();
    let slot;
    try {
      const result = await this.confirmTransaction(txid, opts.commitment);
      slot = result.context.slot;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      stopWaiting();
    }
    return { txSig: txid, slot };
  }
  async prepareTx(tx, additionalSigners, opts) {
    tx.feePayer = this.provider.wallet.publicKey;
    tx.recentBlockhash = (await this.provider.connection.getRecentBlockhash(
      opts.preflightCommitment
    )).blockhash;
    await this.provider.wallet.signTransaction(tx);
    additionalSigners.filter((s) => s !== void 0).forEach((kp) => {
      tx.partialSign(kp);
    });
    return tx;
  }
  async confirmTransaction(signature, commitment) {
    let decodedSignature;
    try {
      decodedSignature = bs58.decode(signature);
    } catch (err) {
      throw new Error("signature must be base58 encoded: " + signature);
    }
    assert2(decodedSignature.length === 64, "signature has invalid length");
    const start = Date.now();
    const subscriptionCommitment = commitment || this.provider.opts.commitment;
    const subscriptionIds = new Array();
    const connections = [
      this.provider.connection,
      ...this.additionalConnections
    ];
    let response = null;
    const promises = connections.map((connection, i) => {
      let subscriptionId;
      const confirmPromise = new Promise((resolve, reject) => {
        try {
          subscriptionId = connection.onSignature(
            signature,
            (result, context) => {
              subscriptionIds[i] = void 0;
              response = {
                context,
                value: result
              };
              resolve(null);
            },
            subscriptionCommitment
          );
        } catch (err) {
          reject(err);
        }
      });
      subscriptionIds.push(subscriptionId);
      return confirmPromise;
    });
    try {
      await this.promiseTimeout(promises, this.timeout);
    } finally {
      for (const [i, subscriptionId] of subscriptionIds.entries()) {
        if (subscriptionId) {
          connections[i].removeSignatureListener(subscriptionId);
        }
      }
    }
    if (response === null) {
      const duration = (Date.now() - start) / 1e3;
      throw new Error(
        `Transaction was not confirmed in ${duration.toFixed(
          2
        )} seconds. It is unknown if it succeeded or failed. Check signature ${signature} using the Solana Explorer or CLI tools.`
      );
    }
    return response;
  }
  getTimestamp() {
    return new Date().getTime();
  }
  async sleep(reference) {
    return new Promise((resolve) => {
      reference.resolve = resolve;
      setTimeout(resolve, this.retrySleep);
    });
  }
  promiseTimeout(promises, timeoutMs) {
    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(null), timeoutMs);
    });
    return Promise.race([...promises, timeoutPromise]).then(
      (result) => {
        clearTimeout(timeoutId);
        return result;
      }
    );
  }
  sendToAdditionalConnections(rawTx, opts) {
    this.additionalConnections.map((connection) => {
      connection.sendRawTransaction(rawTx, opts).catch((e) => {
        console.error(
          `error sending tx to additional connection ${connection._rpcEndpoint}`
        );
        console.error(e);
      });
    });
  }
  addAdditionalConnection(newConnection) {
    const alreadyUsingConnection = this.additionalConnections.filter((connection) => {
      return connection._rpcEndpoint === newConnection.rpcEndpoint;
    }).length > 0;
    if (!alreadyUsingConnection) {
      this.additionalConnections.push(newConnection);
    }
  }
};

// src/accounts/webSocketUserAccountSubscriber.ts
import { EventEmitter as EventEmitter7 } from "events";
var WebSocketUserAccountSubscriber = class {
  constructor(program2, userAccountPublicKey) {
    this.isSubscribed = false;
    this.program = program2;
    this.userAccountPublicKey = userAccountPublicKey;
    this.eventEmitter = new EventEmitter7();
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    this.userDataAccountSubscriber = new WebSocketAccountSubscriber(
      "user",
      this.program,
      this.userAccountPublicKey
    );
    await this.userDataAccountSubscriber.subscribe((data) => {
      this.eventEmitter.emit("userAccountUpdate", data);
      this.eventEmitter.emit("update");
    });
    this.eventEmitter.emit("update");
    this.isSubscribed = true;
    return true;
  }
  async fetch() {
    await Promise.all([this.userDataAccountSubscriber.fetch()]);
  }
  async unsubscribe() {
    if (!this.isSubscribed) {
      return;
    }
    await Promise.all([this.userDataAccountSubscriber.unsubscribe()]);
    this.isSubscribed = false;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getUserAccountAndSlot() {
    this.assertIsSubscribed();
    return this.userDataAccountSubscriber.dataAndSlot;
  }
};

// src/math/spotPosition.ts
function isSpotPositionAvailable(position) {
  return position.scaledBalance.eq(ZERO) && position.openOrders === 0;
}
function getWorstCaseTokenAmounts(spotPosition, spotMarketAccount, oraclePriceData) {
  const tokenAmount = getSignedTokenAmount(
    getTokenAmount(
      spotPosition.scaledBalance,
      spotMarketAccount,
      spotPosition.balanceType
    ),
    spotPosition.balanceType
  );
  const tokenAmountAllBidsFill = tokenAmount.add(spotPosition.openBids);
  const tokenAmountAllAsksFill = tokenAmount.add(spotPosition.openAsks);
  if (tokenAmountAllAsksFill.abs().gt(tokenAmountAllBidsFill.abs())) {
    const worstCaseQuoteTokenAmount = getTokenValue(
      spotPosition.openAsks.neg(),
      spotMarketAccount.decimals,
      oraclePriceData
    );
    return [tokenAmountAllBidsFill, worstCaseQuoteTokenAmount];
  } else {
    const worstCaseQuoteTokenAmount = getTokenValue(
      spotPosition.openBids.neg(),
      spotMarketAccount.decimals,
      oraclePriceData
    );
    return [tokenAmountAllAsksFill, worstCaseQuoteTokenAmount];
  }
}

// src/user.ts
var User = class {
  constructor(config) {
    this._isSubscribed = false;
    var _a;
    this.driftClient = config.driftClient;
    this.userAccountPublicKey = config.userAccountPublicKey;
    if (((_a = config.accountSubscription) == null ? void 0 : _a.type) === "polling") {
      this.accountSubscriber = new PollingUserAccountSubscriber(
        config.driftClient.program,
        config.userAccountPublicKey,
        config.accountSubscription.accountLoader
      );
    } else {
      this.accountSubscriber = new WebSocketUserAccountSubscriber(
        config.driftClient.program,
        config.userAccountPublicKey
      );
    }
    this.eventEmitter = this.accountSubscriber.eventEmitter;
  }
  get isSubscribed() {
    return this._isSubscribed && this.accountSubscriber.isSubscribed;
  }
  set isSubscribed(val) {
    this._isSubscribed = val;
  }
  async subscribe() {
    this.isSubscribed = await this.accountSubscriber.subscribe();
    return this.isSubscribed;
  }
  async fetchAccounts() {
    await this.accountSubscriber.fetch();
  }
  async unsubscribe() {
    await this.accountSubscriber.unsubscribe();
    this.isSubscribed = false;
  }
  getUserAccount() {
    return this.accountSubscriber.getUserAccountAndSlot().data;
  }
  getUserAccountAndSlot() {
    return this.accountSubscriber.getUserAccountAndSlot();
  }
  getPerpPosition(marketIndex) {
    return this.getUserAccount().perpPositions.find(
      (position) => position.marketIndex === marketIndex
    );
  }
  getSpotPosition(marketIndex) {
    return this.getUserAccount().spotPositions.find(
      (position) => position.marketIndex === marketIndex
    );
  }
  getEmptyPosition(marketIndex) {
    return {
      baseAssetAmount: ZERO,
      remainderBaseAssetAmount: 0,
      lastCumulativeFundingRate: ZERO,
      marketIndex,
      quoteAssetAmount: ZERO,
      quoteEntryAmount: ZERO,
      quoteBreakEvenAmount: ZERO,
      openOrders: 0,
      openBids: ZERO,
      openAsks: ZERO,
      settledPnl: ZERO,
      lpShares: ZERO,
      lastBaseAssetAmountPerLp: ZERO,
      lastQuoteAssetAmountPerLp: ZERO
    };
  }
  getClonedPosition(position) {
    const clonedPosition = Object.assign({}, position);
    return clonedPosition;
  }
  getOrder(orderId) {
    return this.getUserAccount().orders.find(
      (order) => order.orderId === orderId
    );
  }
  getOrderByUserOrderId(userOrderId) {
    return this.getUserAccount().orders.find(
      (order) => order.userOrderId === userOrderId
    );
  }
  getUserAccountPublicKey() {
    return this.userAccountPublicKey;
  }
  async exists() {
    const userAccountRPCResponse = await this.driftClient.connection.getParsedAccountInfo(
      this.userAccountPublicKey
    );
    return userAccountRPCResponse.value !== null;
  }
  getPerpBidAsks(marketIndex) {
    const position = this.getPerpPosition(marketIndex);
    const [lpOpenBids, lpOpenAsks] = this.getLPBidAsks(marketIndex);
    const totalOpenBids = lpOpenBids.add(position.openBids);
    const totalOpenAsks = lpOpenAsks.add(position.openAsks);
    return [totalOpenBids, totalOpenAsks];
  }
  getLPBidAsks(marketIndex) {
    const position = this.getPerpPosition(marketIndex);
    if (position === void 0 || position.lpShares.eq(ZERO)) {
      return [ZERO, ZERO];
    }
    const market = this.driftClient.getPerpMarketAccount(marketIndex);
    const [marketOpenBids, marketOpenAsks] = calculateMarketOpenBidAsk(
      market.amm.baseAssetReserve,
      market.amm.minBaseAssetReserve,
      market.amm.maxBaseAssetReserve
    );
    const lpOpenBids = marketOpenBids.mul(position.lpShares).div(market.amm.sqrtK);
    const lpOpenAsks = marketOpenAsks.mul(position.lpShares).div(market.amm.sqrtK);
    return [lpOpenBids, lpOpenAsks];
  }
  getSettledLPPosition(marketIndex) {
    const _position = this.getPerpPosition(marketIndex);
    const position = this.getClonedPosition(_position);
    if (position.lpShares.eq(ZERO)) {
      return [position, ZERO, ZERO];
    }
    const market = this.driftClient.getPerpMarketAccount(position.marketIndex);
    const nShares = position.lpShares;
    const deltaBaa = market.amm.baseAssetAmountPerLp.sub(position.lastBaseAssetAmountPerLp).mul(nShares).div(AMM_RESERVE_PRECISION);
    const deltaQaa = market.amm.quoteAssetAmountPerLp.sub(position.lastQuoteAssetAmountPerLp).mul(nShares).div(AMM_RESERVE_PRECISION);
    function sign(v) {
      const sign2 = { true: new BN(1), false: new BN(-1) }[v.gte(ZERO).toString()];
      return sign2;
    }
    function standardize(amount, stepsize) {
      const remainder = amount.abs().mod(stepsize).mul(sign(amount));
      const standardizedAmount = amount.sub(remainder);
      return [standardizedAmount, remainder];
    }
    const [standardizedBaa, remainderBaa] = standardize(
      deltaBaa,
      market.amm.orderStepSize
    );
    position.remainderBaseAssetAmount += remainderBaa.toNumber();
    if (Math.abs(position.remainderBaseAssetAmount) > market.amm.orderStepSize.toNumber()) {
      const [newStandardizedBaa, newRemainderBaa] = standardize(
        new BN(position.remainderBaseAssetAmount),
        market.amm.orderStepSize
      );
      position.baseAssetAmount = position.baseAssetAmount.add(newStandardizedBaa);
      position.remainderBaseAssetAmount = newRemainderBaa.toNumber();
    }
    let updateType;
    if (position.baseAssetAmount.eq(ZERO)) {
      updateType = "open";
    } else if (sign(position.baseAssetAmount).eq(sign(deltaBaa))) {
      updateType = "increase";
    } else if (position.baseAssetAmount.abs().gt(deltaBaa.abs())) {
      updateType = "reduce";
    } else if (position.baseAssetAmount.abs().eq(deltaBaa.abs())) {
      updateType = "close";
    } else {
      updateType = "flip";
    }
    let newQuoteEntry;
    let pnl;
    if (updateType == "open" || updateType == "increase") {
      newQuoteEntry = position.quoteEntryAmount.add(deltaQaa);
      pnl = 0;
    } else if (updateType == "reduce" || updateType == "close") {
      newQuoteEntry = position.quoteEntryAmount.sub(
        position.quoteEntryAmount.mul(deltaBaa.abs()).div(position.baseAssetAmount.abs())
      );
      pnl = position.quoteEntryAmount.sub(newQuoteEntry).add(deltaQaa);
    } else {
      newQuoteEntry = deltaQaa.sub(
        deltaQaa.mul(position.baseAssetAmount.abs()).div(deltaBaa.abs())
      );
      pnl = position.quoteEntryAmount.add(deltaQaa.sub(newQuoteEntry));
    }
    position.quoteEntryAmount = newQuoteEntry;
    position.baseAssetAmount = position.baseAssetAmount.add(standardizedBaa);
    position.quoteAssetAmount = position.quoteAssetAmount.add(deltaQaa);
    if (position.baseAssetAmount.gt(ZERO)) {
      position.lastCumulativeFundingRate = market.amm.cumulativeFundingRateLong;
    } else if (position.baseAssetAmount.lt(ZERO)) {
      position.lastCumulativeFundingRate = market.amm.cumulativeFundingRateShort;
    } else {
      position.lastCumulativeFundingRate = ZERO;
    }
    return [position, remainderBaa, pnl];
  }
  getBuyingPower(marketIndex) {
    return this.getFreeCollateral().mul(this.getMaxLeverage(marketIndex, "Initial")).div(TEN_THOUSAND);
  }
  getFreeCollateral() {
    const totalCollateral = this.getTotalCollateral();
    const initialMarginRequirement = this.getInitialMarginRequirement();
    const freeCollateral = totalCollateral.sub(initialMarginRequirement);
    return freeCollateral.gte(ZERO) ? freeCollateral : ZERO;
  }
  getMarginRequirement(marginCategory, liquidationBuffer) {
    return this.getTotalPerpPositionValue(
      marginCategory,
      liquidationBuffer,
      true
    ).add(
      this.getSpotMarketLiabilityValue(
        void 0,
        marginCategory,
        liquidationBuffer,
        true
      )
    );
  }
  getInitialMarginRequirement() {
    return this.getMarginRequirement("Initial");
  }
  getMaintenanceMarginRequirement(liquidationBuffer) {
    return this.getMarginRequirement("Maintenance", liquidationBuffer);
  }
  getActivePerpPositions() {
    return this.getUserAccount().perpPositions.filter(
      (pos) => !pos.baseAssetAmount.eq(ZERO) || !pos.quoteAssetAmount.eq(ZERO) || !(pos.openOrders == 0) || !pos.lpShares.eq(ZERO)
    );
  }
  getUnrealizedPNL(withFunding, marketIndex, withWeightMarginCategory) {
    const quoteSpotMarket = this.driftClient.getQuoteSpotMarketAccount();
    return this.getActivePerpPositions().filter((pos) => marketIndex ? pos.marketIndex === marketIndex : true).reduce((unrealizedPnl, perpPosition) => {
      const market = this.driftClient.getPerpMarketAccount(
        perpPosition.marketIndex
      );
      const oraclePriceData = this.getOracleDataForPerpMarket(
        market.marketIndex
      );
      let positionUnrealizedPnl = calculatePositionPNL(
        market,
        perpPosition,
        withFunding,
        oraclePriceData
      );
      if (withWeightMarginCategory !== void 0) {
        if (positionUnrealizedPnl.gt(ZERO)) {
          positionUnrealizedPnl = positionUnrealizedPnl.mul(
            calculateUnrealizedAssetWeight(
              market,
              quoteSpotMarket,
              positionUnrealizedPnl,
              withWeightMarginCategory,
              oraclePriceData
            )
          ).div(new BN(SPOT_MARKET_WEIGHT_PRECISION));
        }
      }
      return unrealizedPnl.add(positionUnrealizedPnl);
    }, ZERO);
  }
  getUnrealizedFundingPNL(marketIndex) {
    return this.getUserAccount().perpPositions.filter(
      (pos) => marketIndex ? pos.marketIndex === marketIndex : true
    ).reduce((pnl, perpPosition) => {
      const market = this.driftClient.getPerpMarketAccount(
        perpPosition.marketIndex
      );
      return pnl.add(calculatePositionFundingPNL(market, perpPosition));
    }, ZERO);
  }
  getSpotMarketLiabilityValue(marketIndex, marginCategory, liquidationBuffer, includeOpenOrders) {
    return this.getUserAccount().spotPositions.reduce(
      (totalLiabilityValue, spotPosition) => {
        if (isSpotPositionAvailable(spotPosition) || marketIndex !== void 0 && spotPosition.marketIndex !== marketIndex) {
          return totalLiabilityValue;
        }
        const spotMarketAccount = this.driftClient.getSpotMarketAccount(spotPosition.marketIndex);
        if (spotPosition.marketIndex === QUOTE_SPOT_MARKET_INDEX) {
          if (isVariant(spotPosition.balanceType, "borrow")) {
            const tokenAmount = getTokenAmount(
              spotPosition.scaledBalance,
              spotMarketAccount,
              spotPosition.balanceType
            );
            let weight = SPOT_MARKET_WEIGHT_PRECISION;
            if (marginCategory === "Initial") {
              weight = BN.max(
                weight,
                new BN(this.getUserAccount().maxMarginRatio)
              );
            }
            const weightedTokenValue = tokenAmount.mul(weight).div(SPOT_MARKET_WEIGHT_PRECISION);
            return totalLiabilityValue.add(weightedTokenValue);
          } else {
            return totalLiabilityValue;
          }
        }
        const oraclePriceData = this.getOracleDataForSpotMarket(
          spotPosition.marketIndex
        );
        if (!includeOpenOrders) {
          if (isVariant(spotPosition.balanceType, "borrow")) {
            const tokenAmount = getTokenAmount(
              spotPosition.scaledBalance,
              spotMarketAccount,
              spotPosition.balanceType
            );
            const liabilityValue = this.getSpotLiabilityValue(
              tokenAmount,
              oraclePriceData,
              spotMarketAccount,
              marginCategory,
              liquidationBuffer
            );
            return totalLiabilityValue.add(liabilityValue);
          } else {
            return totalLiabilityValue;
          }
        }
        const [worstCaseTokenAmount, worstCaseQuoteTokenAmount] = getWorstCaseTokenAmounts(
          spotPosition,
          spotMarketAccount,
          this.getOracleDataForSpotMarket(spotPosition.marketIndex)
        );
        let newTotalLiabilityValue = totalLiabilityValue;
        if (worstCaseTokenAmount.lt(ZERO)) {
          const baseLiabilityValue = this.getSpotLiabilityValue(
            worstCaseTokenAmount.abs(),
            oraclePriceData,
            spotMarketAccount,
            marginCategory,
            liquidationBuffer
          );
          newTotalLiabilityValue = newTotalLiabilityValue.add(baseLiabilityValue);
        }
        if (worstCaseQuoteTokenAmount.lt(ZERO)) {
          let weight = SPOT_MARKET_WEIGHT_PRECISION;
          if (marginCategory === "Initial") {
            weight = BN.max(
              weight,
              new BN(this.getUserAccount().maxMarginRatio)
            );
          }
          const weightedTokenValue = worstCaseQuoteTokenAmount.abs().mul(weight).div(SPOT_MARKET_WEIGHT_PRECISION);
          newTotalLiabilityValue = newTotalLiabilityValue.add(weightedTokenValue);
        }
        newTotalLiabilityValue = newTotalLiabilityValue.add(
          new BN(spotPosition.openOrders).mul(OPEN_ORDER_MARGIN_REQUIREMENT)
        );
        return newTotalLiabilityValue;
      },
      ZERO
    );
  }
  getSpotLiabilityValue(tokenAmount, oraclePriceData, spotMarketAccount, marginCategory, liquidationBuffer) {
    let liabilityValue = getTokenValue(
      tokenAmount,
      spotMarketAccount.decimals,
      oraclePriceData
    );
    if (marginCategory !== void 0) {
      let weight = calculateLiabilityWeight(
        tokenAmount,
        spotMarketAccount,
        marginCategory
      );
      if (marginCategory === "Initial") {
        weight = BN.max(weight, new BN(this.getUserAccount().maxMarginRatio));
      }
      if (liquidationBuffer !== void 0) {
        weight = weight.add(liquidationBuffer);
      }
      liabilityValue = liabilityValue.mul(weight).div(SPOT_MARKET_WEIGHT_PRECISION);
    }
    return liabilityValue;
  }
  getSpotMarketAssetValue(marketIndex, marginCategory, includeOpenOrders) {
    return this.getUserAccount().spotPositions.reduce(
      (totalAssetValue, spotPosition) => {
        if (isSpotPositionAvailable(spotPosition) || marketIndex !== void 0 && spotPosition.marketIndex !== marketIndex) {
          return totalAssetValue;
        }
        const spotMarketAccount = this.driftClient.getSpotMarketAccount(spotPosition.marketIndex);
        if (spotPosition.marketIndex === QUOTE_SPOT_MARKET_INDEX) {
          if (isVariant(spotPosition.balanceType, "deposit")) {
            const tokenAmount = getTokenAmount(
              spotPosition.scaledBalance,
              spotMarketAccount,
              spotPosition.balanceType
            );
            return totalAssetValue.add(tokenAmount);
          } else {
            return totalAssetValue;
          }
        }
        const oraclePriceData = this.getOracleDataForSpotMarket(
          spotPosition.marketIndex
        );
        if (!includeOpenOrders) {
          if (isVariant(spotPosition.balanceType, "deposit")) {
            const tokenAmount = getTokenAmount(
              spotPosition.scaledBalance,
              spotMarketAccount,
              spotPosition.balanceType
            );
            const assetValue = this.getSpotAssetValue(
              tokenAmount,
              oraclePriceData,
              spotMarketAccount,
              marginCategory
            );
            return totalAssetValue.add(assetValue);
          } else {
            return totalAssetValue;
          }
        }
        const [worstCaseTokenAmount, worstCaseQuoteTokenAmount] = getWorstCaseTokenAmounts(
          spotPosition,
          spotMarketAccount,
          this.getOracleDataForSpotMarket(spotPosition.marketIndex)
        );
        let newTotalAssetValue = totalAssetValue;
        if (worstCaseTokenAmount.gt(ZERO)) {
          const baseAssetValue = this.getSpotAssetValue(
            worstCaseTokenAmount,
            oraclePriceData,
            spotMarketAccount,
            marginCategory
          );
          newTotalAssetValue = newTotalAssetValue.add(baseAssetValue);
        }
        if (worstCaseQuoteTokenAmount.gt(ZERO)) {
          newTotalAssetValue = newTotalAssetValue.add(
            worstCaseQuoteTokenAmount
          );
        }
        return newTotalAssetValue;
      },
      ZERO
    );
  }
  getSpotAssetValue(tokenAmount, oraclePriceData, spotMarketAccount, marginCategory) {
    let assetValue = getTokenValue(
      tokenAmount,
      spotMarketAccount.decimals,
      oraclePriceData
    );
    if (marginCategory !== void 0) {
      const weight = calculateAssetWeight(
        tokenAmount,
        spotMarketAccount,
        marginCategory
      );
      assetValue = assetValue.mul(weight).div(SPOT_MARKET_WEIGHT_PRECISION);
    }
    return assetValue;
  }
  getNetSpotMarketValue(withWeightMarginCategory) {
    return this.getSpotMarketAssetValue(
      void 0,
      withWeightMarginCategory
    ).sub(
      this.getSpotMarketLiabilityValue(void 0, withWeightMarginCategory)
    );
  }
  getTotalCollateral(marginCategory = "Initial") {
    return this.getSpotMarketAssetValue(void 0, marginCategory, true).add(
      this.getUnrealizedPNL(true, void 0, marginCategory)
    );
  }
  getHealth() {
    const userAccount = this.getUserAccount();
    if (isVariant(userAccount.status, "beingLiquidated") || isVariant(userAccount.status, "bankrupt")) {
      return 0;
    }
    const totalCollateral = this.getTotalCollateral("Maintenance");
    const maintenanceMarginReq = this.getMaintenanceMarginRequirement();
    let health;
    if (maintenanceMarginReq.eq(ZERO) && totalCollateral.gte(ZERO)) {
      health = 100;
    } else if (totalCollateral.lte(ZERO)) {
      health = 0;
    } else {
      const marginRatio = this.getMarginRatio().toNumber() / MARGIN_PRECISION.toNumber();
      const maintenanceRatio = maintenanceMarginReq.toNumber() / totalCollateral.toNumber() * marginRatio;
      const healthP1 = Math.max(0, (marginRatio - maintenanceRatio) * 100) + 1;
      health = Math.min(1, Math.log(healthP1) / Math.log(100)) * 100;
      if (health > 1) {
        health = Math.round(health);
      } else {
        health = Math.round(health * 100) / 100;
      }
    }
    return health;
  }
  getTotalPerpPositionValue(marginCategory, liquidationBuffer, includeOpenOrders) {
    return this.getActivePerpPositions().reduce(
      (totalPerpValue, perpPosition) => {
        const market = this.driftClient.getPerpMarketAccount(
          perpPosition.marketIndex
        );
        if (perpPosition.lpShares.gt(ZERO)) {
          perpPosition = this.getClonedPosition(perpPosition);
          const [settledPosition, dustBaa, _] = this.getSettledLPPosition(
            market.marketIndex
          );
          perpPosition.baseAssetAmount = settledPosition.baseAssetAmount.add(dustBaa);
          perpPosition.quoteAssetAmount = settledPosition.quoteAssetAmount;
          const [totalOpenBids, totalOpenAsks] = this.getPerpBidAsks(
            market.marketIndex
          );
          perpPosition.openAsks = totalOpenAsks;
          perpPosition.openBids = totalOpenBids;
        }
        let valuationPrice = this.getOracleDataForPerpMarket(
          market.marketIndex
        ).price;
        if (isVariant(market.status, "settlement")) {
          valuationPrice = market.expiryPrice;
        }
        const baseAssetAmount = includeOpenOrders ? calculateWorstCaseBaseAssetAmount(perpPosition) : perpPosition.baseAssetAmount;
        let baseAssetValue = baseAssetAmount.abs().mul(valuationPrice).div(AMM_TO_QUOTE_PRECISION_RATIO.mul(PRICE_PRECISION));
        if (marginCategory) {
          let marginRatio = new BN(
            calculateMarketMarginRatio(
              market,
              baseAssetAmount.abs(),
              marginCategory
            )
          );
          if (marginCategory === "Initial") {
            marginRatio = BN.max(
              marginRatio,
              new BN(this.getUserAccount().maxMarginRatio)
            );
          }
          if (liquidationBuffer !== void 0) {
            marginRatio = marginRatio.add(liquidationBuffer);
          }
          if (isVariant(market.status, "settlement")) {
            marginRatio = ZERO;
          }
          baseAssetValue = baseAssetValue.mul(marginRatio).div(MARGIN_PRECISION);
          if (includeOpenOrders) {
            baseAssetValue = baseAssetValue.add(
              new BN(perpPosition.openOrders).mul(OPEN_ORDER_MARGIN_REQUIREMENT)
            );
          }
        }
        return totalPerpValue.add(baseAssetValue);
      },
      ZERO
    );
  }
  getPerpPositionValue(marketIndex, oraclePriceData) {
    const userPosition = this.getPerpPosition(marketIndex) || this.getEmptyPosition(marketIndex);
    const market = this.driftClient.getPerpMarketAccount(
      userPosition.marketIndex
    );
    return calculateBaseAssetValueWithOracle(
      market,
      userPosition,
      oraclePriceData
    );
  }
  getPositionSide(currentPosition) {
    if (currentPosition.baseAssetAmount.gt(ZERO)) {
      return PositionDirection.LONG;
    } else if (currentPosition.baseAssetAmount.lt(ZERO)) {
      return PositionDirection.SHORT;
    } else {
      return void 0;
    }
  }
  getPositionEstimatedExitPriceAndPnl(position, amountToClose, useAMMClose = false) {
    const market = this.driftClient.getPerpMarketAccount(position.marketIndex);
    const entryPrice = calculateEntryPrice(position);
    const oraclePriceData = this.getOracleDataForPerpMarket(
      position.marketIndex
    );
    if (amountToClose) {
      if (amountToClose.eq(ZERO)) {
        return [calculateReservePrice(market, oraclePriceData), ZERO];
      }
      position = {
        baseAssetAmount: amountToClose,
        lastCumulativeFundingRate: position.lastCumulativeFundingRate,
        marketIndex: position.marketIndex,
        quoteAssetAmount: position.quoteAssetAmount
      };
    }
    let baseAssetValue;
    if (useAMMClose) {
      baseAssetValue = calculateBaseAssetValue(
        market,
        position,
        oraclePriceData
      );
    } else {
      baseAssetValue = calculateBaseAssetValueWithOracle(
        market,
        position,
        oraclePriceData
      );
    }
    if (position.baseAssetAmount.eq(ZERO)) {
      return [ZERO, ZERO];
    }
    const exitPrice = baseAssetValue.mul(AMM_TO_QUOTE_PRECISION_RATIO).mul(PRICE_PRECISION).div(position.baseAssetAmount.abs());
    const pnlPerBase = exitPrice.sub(entryPrice);
    const pnl = pnlPerBase.mul(position.baseAssetAmount).div(PRICE_PRECISION).div(AMM_TO_QUOTE_PRECISION_RATIO);
    return [exitPrice, pnl];
  }
  getLeverage() {
    const totalLiabilityValue = this.getTotalLiabilityValue();
    const totalAssetValue = this.getTotalAssetValue();
    if (totalAssetValue.eq(ZERO) && totalLiabilityValue.eq(ZERO)) {
      return ZERO;
    }
    return totalLiabilityValue.mul(TEN_THOUSAND).div(totalAssetValue);
  }
  getTotalLiabilityValue(marginCategory) {
    return this.getTotalPerpPositionValue(marginCategory, void 0, true).add(
      this.getSpotMarketLiabilityValue(
        void 0,
        marginCategory,
        void 0,
        true
      )
    );
  }
  getTotalAssetValue(marginCategory) {
    return this.getSpotMarketAssetValue(void 0, marginCategory, true).add(
      this.getUnrealizedPNL(true, void 0, marginCategory)
    );
  }
  getMaxLeverage(marketIndex, category = "Initial") {
    const market = this.driftClient.getPerpMarketAccount(marketIndex);
    const totalAssetValue = this.getTotalAssetValue();
    if (totalAssetValue.eq(ZERO)) {
      return ZERO;
    }
    const totalLiabilityValue = this.getTotalLiabilityValue();
    const marginRatio = calculateMarketMarginRatio(
      market,
      ZERO,
      category
    );
    const freeCollateral = this.getFreeCollateral();
    const additionalLiabilities = freeCollateral.mul(MARGIN_PRECISION).div(new BN(marginRatio));
    return totalLiabilityValue.add(additionalLiabilities).mul(TEN_THOUSAND).div(totalAssetValue);
  }
  getMarginRatio(marginCategory) {
    const totalLiabilityValue = this.getTotalLiabilityValue(marginCategory);
    if (totalLiabilityValue.eq(ZERO)) {
      return BN_MAX;
    }
    const totalAssetValue = this.getTotalAssetValue(marginCategory);
    return totalAssetValue.mul(TEN_THOUSAND).div(totalLiabilityValue);
  }
  canBeLiquidated() {
    const totalCollateral = this.getTotalCollateral("Maintenance");
    let liquidationBuffer = void 0;
    const isBeingLiquidated = isVariant(
      this.getUserAccount().status,
      "beingLiquidated"
    );
    if (isBeingLiquidated) {
      liquidationBuffer = new BN(
        this.driftClient.getStateAccount().liquidationMarginBufferRatio
      );
    }
    const maintenanceRequirement = this.getMaintenanceMarginRequirement(liquidationBuffer);
    return totalCollateral.lt(maintenanceRequirement);
  }
  isBeingLiquidated() {
    return isOneOfVariant(this.getUserAccount().status, [
      "beingLiquidated",
      "bankrupt"
    ]);
  }
  isBankrupt() {
    return isVariant(this.getUserAccount().status, "bankrupt");
  }
  needsToSettleFundingPayment() {
    for (const userPosition of this.getUserAccount().perpPositions) {
      if (userPosition.baseAssetAmount.eq(ZERO)) {
        continue;
      }
      const market = this.driftClient.getPerpMarketAccount(
        userPosition.marketIndex
      );
      if (market.amm.cumulativeFundingRateLong.eq(
        userPosition.lastCumulativeFundingRate
      ) || market.amm.cumulativeFundingRateShort.eq(
        userPosition.lastCumulativeFundingRate
      )) {
        continue;
      }
      return true;
    }
    return false;
  }
  spotLiquidationPrice(spotPosition) {
    const currentSpotPosition = this.getSpotPosition(spotPosition.marketIndex);
    const mtc = this.getTotalCollateral("Maintenance");
    const mmr = this.getMaintenanceMarginRequirement();
    const deltaValueToLiq = mtc.sub(mmr);
    const currentSpotMarket = this.driftClient.getSpotMarketAccount(
      spotPosition.marketIndex
    );
    const tokenAmount = getTokenAmount(
      currentSpotPosition.scaledBalance,
      currentSpotMarket,
      currentSpotPosition.balanceType
    );
    const tokenAmountQP = tokenAmount.mul(QUOTE_PRECISION).div(new BN(10 ** currentSpotMarket.decimals));
    if (tokenAmountQP.abs().eq(ZERO)) {
      return new BN(-1);
    }
    let liqPriceDelta;
    if (isVariant(currentSpotPosition.balanceType, "borrow")) {
      liqPriceDelta = deltaValueToLiq.mul(PRICE_PRECISION).mul(SPOT_MARKET_WEIGHT_PRECISION).div(tokenAmountQP).div(new BN(currentSpotMarket.maintenanceLiabilityWeight));
    } else {
      liqPriceDelta = deltaValueToLiq.mul(PRICE_PRECISION).mul(SPOT_MARKET_WEIGHT_PRECISION).div(tokenAmountQP).div(new BN(currentSpotMarket.maintenanceAssetWeight)).mul(new BN(-1));
    }
    const currentPrice = this.driftClient.getOracleDataForSpotMarket(
      spotPosition.marketIndex
    ).price;
    const liqPrice = currentPrice.add(liqPriceDelta);
    return liqPrice;
  }
  liquidationPrice(perpPosition, positionBaseSizeChange = ZERO) {
    const totalCollateral = this.getTotalCollateral();
    const totalPositionValueExcludingTargetMarket = this.getTotalPerpPositionValueExcludingMarket(perpPosition.marketIndex);
    const currentPerpPosition = this.getPerpPosition(perpPosition.marketIndex) || this.getEmptyPosition(perpPosition.marketIndex);
    const currentPerpPositionBaseSize = currentPerpPosition.baseAssetAmount;
    const proposedBaseAssetAmount = currentPerpPositionBaseSize.add(
      positionBaseSizeChange
    );
    const proposedPerpPosition = {
      marketIndex: perpPosition.marketIndex,
      baseAssetAmount: proposedBaseAssetAmount,
      remainderBaseAssetAmount: 0,
      quoteAssetAmount: new BN(0),
      lastCumulativeFundingRate: ZERO,
      quoteBreakEvenAmount: new BN(0),
      quoteEntryAmount: new BN(0),
      openOrders: 0,
      openBids: new BN(0),
      openAsks: new BN(0),
      settledPnl: ZERO,
      lpShares: ZERO,
      lastBaseAssetAmountPerLp: ZERO,
      lastQuoteAssetAmountPerLp: ZERO
    };
    if (proposedBaseAssetAmount.eq(ZERO))
      return new BN(-1);
    const market = this.driftClient.getPerpMarketAccount(
      proposedPerpPosition.marketIndex
    );
    const proposedPerpPositionValue = calculateBaseAssetValueWithOracle(
      market,
      proposedPerpPosition,
      this.getOracleDataForPerpMarket(market.marketIndex)
    );
    const totalPositionValueAfterTrade = totalPositionValueExcludingTargetMarket.add(proposedPerpPositionValue);
    const marginRequirementExcludingTargetMarket = this.getUserAccount().perpPositions.reduce(
      (totalMarginRequirement, position) => {
        if (position.marketIndex !== perpPosition.marketIndex) {
          const market2 = this.driftClient.getPerpMarketAccount(
            position.marketIndex
          );
          const positionValue = calculateBaseAssetValueWithOracle(
            market2,
            position,
            this.getOracleDataForPerpMarket(market2.marketIndex)
          );
          const marketMarginRequirement = positionValue.mul(
            new BN(
              calculateMarketMarginRatio(
                market2,
                position.baseAssetAmount.abs(),
                "Maintenance"
              )
            )
          ).div(MARGIN_PRECISION);
          totalMarginRequirement = totalMarginRequirement.add(
            marketMarginRequirement
          );
        }
        return totalMarginRequirement;
      },
      ZERO
    );
    const freeCollateralExcludingTargetMarket = totalCollateral.sub(
      marginRequirementExcludingTargetMarket
    );
    if (totalPositionValueAfterTrade.lte(freeCollateralExcludingTargetMarket) && proposedPerpPosition.baseAssetAmount.abs().gt(ZERO)) {
      return new BN(-1);
    }
    const marginRequirementAfterTrade = marginRequirementExcludingTargetMarket.add(
      proposedPerpPositionValue.mul(
        new BN(
          calculateMarketMarginRatio(
            market,
            proposedPerpPosition.baseAssetAmount.abs(),
            "Maintenance"
          )
        )
      ).div(MARGIN_PRECISION)
    );
    const freeCollateralAfterTrade = totalCollateral.sub(
      marginRequirementAfterTrade
    );
    const marketMaxLeverage = this.getMaxLeverage(
      proposedPerpPosition.marketIndex,
      "Maintenance"
    );
    let priceDelta;
    if (proposedBaseAssetAmount.lt(ZERO)) {
      priceDelta = freeCollateralAfterTrade.mul(marketMaxLeverage).div(marketMaxLeverage.add(TEN_THOUSAND)).mul(PRICE_TO_QUOTE_PRECISION).mul(AMM_RESERVE_PRECISION).div(proposedBaseAssetAmount);
    } else {
      priceDelta = freeCollateralAfterTrade.mul(marketMaxLeverage).div(marketMaxLeverage.sub(TEN_THOUSAND)).mul(PRICE_TO_QUOTE_PRECISION).mul(AMM_RESERVE_PRECISION).div(proposedBaseAssetAmount);
    }
    let markPriceAfterTrade;
    if (positionBaseSizeChange.eq(ZERO)) {
      markPriceAfterTrade = calculateReservePrice(
        this.driftClient.getPerpMarketAccount(perpPosition.marketIndex),
        this.getOracleDataForPerpMarket(perpPosition.marketIndex)
      );
    } else {
      const direction = positionBaseSizeChange.gt(ZERO) ? PositionDirection.LONG : PositionDirection.SHORT;
      markPriceAfterTrade = calculateTradeSlippage(
        direction,
        positionBaseSizeChange.abs(),
        this.driftClient.getPerpMarketAccount(perpPosition.marketIndex),
        "base",
        this.getOracleDataForPerpMarket(perpPosition.marketIndex)
      )[3];
    }
    if (priceDelta.gt(markPriceAfterTrade)) {
      return new BN(-1);
    }
    return markPriceAfterTrade.sub(priceDelta);
  }
  liquidationPriceAfterClose(positionMarketIndex, closeQuoteAmount) {
    const currentPosition = this.getPerpPosition(positionMarketIndex) || this.getEmptyPosition(positionMarketIndex);
    const closeBaseAmount = currentPosition.baseAssetAmount.mul(closeQuoteAmount).div(currentPosition.quoteAssetAmount.abs()).add(
      currentPosition.baseAssetAmount.mul(closeQuoteAmount).mod(currentPosition.quoteAssetAmount.abs())
    ).neg();
    return this.liquidationPrice(
      {
        marketIndex: positionMarketIndex
      },
      closeBaseAmount
    );
  }
  getMaxTradeSizeUSDC(targetMarketIndex, tradeSide) {
    const currentPosition = this.getPerpPosition(targetMarketIndex) || this.getEmptyPosition(targetMarketIndex);
    const targetSide = isVariant(tradeSide, "short") ? "short" : "long";
    const currentPositionSide = (currentPosition == null ? void 0 : currentPosition.baseAssetAmount.isNeg()) ? "short" : "long";
    const targetingSameSide = !currentPosition ? true : targetSide === currentPositionSide;
    const oracleData = this.getOracleDataForPerpMarket(targetMarketIndex);
    const oppositeSizeValueUSDC = targetingSameSide ? ZERO : this.getPerpPositionValue(targetMarketIndex, oracleData);
    let maxPositionSize = this.getBuyingPower(targetMarketIndex);
    if (maxPositionSize.gte(ZERO)) {
      if (oppositeSizeValueUSDC.eq(ZERO)) {
      } else {
        maxPositionSize = maxPositionSize.add(
          oppositeSizeValueUSDC.mul(new BN(2))
        );
      }
    } else {
      if (!targetingSameSide) {
        const market = this.driftClient.getPerpMarketAccount(targetMarketIndex);
        const perpPositionValue = this.getPerpPositionValue(
          targetMarketIndex,
          oracleData
        );
        const totalCollateral = this.getTotalCollateral();
        const marginRequirement = this.getInitialMarginRequirement();
        const marginFreedByClosing = perpPositionValue.mul(new BN(market.marginRatioInitial)).div(MARGIN_PRECISION);
        const marginRequirementAfterClosing = marginRequirement.sub(marginFreedByClosing);
        if (marginRequirementAfterClosing.gt(totalCollateral)) {
          maxPositionSize = perpPositionValue;
        } else {
          const freeCollateralAfterClose = totalCollateral.sub(
            marginRequirementAfterClosing
          );
          const buyingPowerAfterClose = freeCollateralAfterClose.mul(this.getMaxLeverage(targetMarketIndex)).div(TEN_THOUSAND);
          maxPositionSize = perpPositionValue.add(buyingPowerAfterClose);
        }
      } else {
      }
    }
    const oneMilli = maxPositionSize.div(QUOTE_PRECISION);
    return maxPositionSize.sub(oneMilli);
  }
  accountLeverageRatioAfterTrade(targetMarketIndex, tradeQuoteAmount, tradeSide, includeOpenOrders = true) {
    const currentPosition = this.getPerpPosition(targetMarketIndex) || this.getEmptyPosition(targetMarketIndex);
    const oracleData = this.getOracleDataForPerpMarket(targetMarketIndex);
    let currentPositionQuoteAmount = this.getPerpPositionValue(
      targetMarketIndex,
      oracleData
    );
    const currentSide = currentPosition && currentPosition.baseAssetAmount.isNeg() ? PositionDirection.SHORT : PositionDirection.LONG;
    if (currentSide === PositionDirection.SHORT)
      currentPositionQuoteAmount = currentPositionQuoteAmount.neg();
    if (tradeSide === PositionDirection.SHORT)
      tradeQuoteAmount = tradeQuoteAmount.neg();
    const currentPerpPositionAfterTrade = currentPositionQuoteAmount.add(tradeQuoteAmount).abs();
    const totalPositionAfterTradeExcludingTargetMarket = this.getTotalPerpPositionValueExcludingMarket(
      targetMarketIndex,
      void 0,
      void 0,
      includeOpenOrders
    );
    const totalAssetValue = this.getTotalAssetValue();
    const totalPerpPositionValue = currentPerpPositionAfterTrade.add(totalPositionAfterTradeExcludingTargetMarket).abs();
    const totalLiabilitiesAfterTrade = totalPerpPositionValue.add(
      this.getSpotMarketLiabilityValue(void 0, void 0, void 0, false)
    );
    if (totalAssetValue.eq(ZERO) && totalLiabilitiesAfterTrade.eq(ZERO)) {
      return ZERO;
    }
    const newLeverage = totalLiabilitiesAfterTrade.mul(TEN_THOUSAND).div(totalAssetValue);
    return newLeverage;
  }
  calculateFeeForQuoteAmount(quoteAmount) {
    const feeTier = this.driftClient.getStateAccount().perpFeeStructure.feeTiers[0];
    return quoteAmount.mul(new BN(feeTier.feeNumerator)).div(new BN(feeTier.feeDenominator));
  }
  getWithdrawalLimit(marketIndex, reduceOnly) {
    const nowTs = new BN(Math.floor(Date.now() / 1e3));
    const spotMarket = this.driftClient.getSpotMarketAccount(marketIndex);
    const { borrowLimit, withdrawLimit } = calculateWithdrawLimit(
      spotMarket,
      nowTs
    );
    const freeCollateral = this.getFreeCollateral();
    const oracleData = this.getOracleDataForSpotMarket(marketIndex);
    const precisionIncrease = TEN.pow(new BN(spotMarket.decimals - 6));
    const amountWithdrawable = freeCollateral.mul(MARGIN_PRECISION).div(new BN(spotMarket.initialAssetWeight)).mul(PRICE_PRECISION).div(oracleData.price).mul(precisionIncrease);
    const userSpotPosition = this.getUserAccount().spotPositions.find(
      (spotPosition) => isVariant(spotPosition.balanceType, "deposit") && spotPosition.marketIndex == marketIndex
    );
    const userSpotBalance = userSpotPosition ? getTokenAmount(
      userSpotPosition.scaledBalance,
      this.driftClient.getSpotMarketAccount(marketIndex),
      SpotBalanceType.DEPOSIT
    ) : ZERO;
    const maxWithdrawValue = BN.min(
      BN.min(amountWithdrawable, userSpotBalance),
      withdrawLimit.abs()
    );
    if (reduceOnly) {
      return BN.max(maxWithdrawValue, ZERO);
    } else {
      const weightedAssetValue = this.getSpotMarketAssetValue(
        marketIndex,
        "Initial",
        false
      );
      const freeCollatAfterWithdraw = userSpotBalance.gt(ZERO) ? freeCollateral.sub(weightedAssetValue) : freeCollateral;
      const maxLiabilityAllowed = freeCollatAfterWithdraw.mul(MARGIN_PRECISION).div(new BN(spotMarket.initialLiabilityWeight)).mul(PRICE_PRECISION).div(oracleData.price).mul(precisionIncrease);
      const maxBorrowValue = BN.min(
        maxWithdrawValue.add(maxLiabilityAllowed),
        borrowLimit.abs()
      );
      return BN.max(maxBorrowValue, ZERO);
    }
  }
  getTotalPerpPositionValueExcludingMarket(marketToIgnore, marginCategory, liquidationBuffer, includeOpenOrders) {
    const currentPerpPosition = this.getPerpPosition(marketToIgnore) || this.getEmptyPosition(marketToIgnore);
    const oracleData = this.getOracleDataForPerpMarket(marketToIgnore);
    let currentPerpPositionValueUSDC = ZERO;
    if (currentPerpPosition) {
      currentPerpPositionValueUSDC = this.getPerpPositionValue(
        marketToIgnore,
        oracleData
      );
    }
    return this.getTotalPerpPositionValue(
      marginCategory,
      liquidationBuffer,
      includeOpenOrders
    ).sub(currentPerpPositionValueUSDC);
  }
  getOracleDataForPerpMarket(marketIndex) {
    const oracleKey = this.driftClient.getPerpMarketAccount(marketIndex).amm.oracle;
    const oracleData = this.driftClient.getOraclePriceDataAndSlot(oracleKey).data;
    return oracleData;
  }
  getOracleDataForSpotMarket(marketIndex) {
    const oracleKey = this.driftClient.getSpotMarketAccount(marketIndex).oracle;
    const oracleData = this.driftClient.getOraclePriceDataAndSlot(oracleKey).data;
    return oracleData;
  }
};

// src/constants/spotMarkets.ts
import { PublicKey as PublicKey8 } from "@solana/web3.js";
var WRAPPED_SOL_MINT = new PublicKey8(
  "So11111111111111111111111111111111111111112"
);
var DevnetSpotMarkets = [
  {
    symbol: "USDC",
    marketIndex: 0,
    oracle: PublicKey8.default,
    oracleSource: OracleSource.QUOTE_ASSET,
    mint: new PublicKey8("8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2"),
    precision: new BN(10).pow(SIX),
    precisionExp: SIX
  },
  {
    symbol: "SOL",
    marketIndex: 1,
    oracle: new PublicKey8("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    oracleSource: OracleSource.PYTH,
    mint: new PublicKey8(WRAPPED_SOL_MINT),
    precision: LAMPORTS_PRECISION,
    precisionExp: LAMPORTS_EXP,
    serumMarket: new PublicKey8("8N37SsnTu8RYxtjrV9SStjkkwVhmU8aCWhLvwduAPEKW")
  },
  {
    symbol: "BTC",
    marketIndex: 2,
    oracle: new PublicKey8("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
    oracleSource: OracleSource.PYTH,
    mint: new PublicKey8("3BZPwbcqB5kKScF3TEXxwNfx5ipV13kbRVDvfVp5c6fv"),
    precision: new BN(10).pow(SIX),
    precisionExp: SIX,
    serumMarket: new PublicKey8("AGsmbVu3MS9u68GEYABWosQQCZwmLcBHu4pWEuBYH7Za")
  }
];
var MainnetSpotMarkets = [
  {
    symbol: "USDC",
    marketIndex: 0,
    oracle: PublicKey8.default,
    oracleSource: OracleSource.QUOTE_ASSET,
    mint: new PublicKey8("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    precision: QUOTE_PRECISION,
    precisionExp: QUOTE_PRECISION_EXP
  },
  {
    symbol: "SOL",
    marketIndex: 1,
    oracle: new PublicKey8("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
    oracleSource: OracleSource.PYTH,
    mint: new PublicKey8(WRAPPED_SOL_MINT),
    precision: LAMPORTS_PRECISION,
    precisionExp: LAMPORTS_EXP,
    serumMarket: new PublicKey8("8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6")
  }
];
var SpotMarkets = {
  devnet: DevnetSpotMarkets,
  "mainnet-beta": MainnetSpotMarkets
};

// src/config.ts
var configs = {
  devnet: {
    ENV: "devnet",
    PYTH_ORACLE_MAPPING_ADDRESS: "BmA9Z6FjioHJPpjT39QazZyhDRUdZy2ezwx4GiDdE2u2",
    DRIFT_PROGRAM_ID: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
    USDC_MINT_ADDRESS: "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2",
    SERUM_V3: "DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY",
    V2_ALPHA_TICKET_MINT_ADDRESS: "DeEiGWfCMP9psnLGkxGrBBMEAW5Jv8bBGMN8DCtFRCyB",
    PERP_MARKETS: DevnetPerpMarkets,
    SPOT_MARKETS: DevnetSpotMarkets
  },
  "mainnet-beta": {
    ENV: "mainnet-beta",
    PYTH_ORACLE_MAPPING_ADDRESS: "AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J",
    DRIFT_PROGRAM_ID: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
    USDC_MINT_ADDRESS: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    SERUM_V3: "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
    V2_ALPHA_TICKET_MINT_ADDRESS: "Cmvhycb6LQvvzaShGw4iDHRLzeSSryioAsU98DSSkMNa",
    PERP_MARKETS: MainnetPerpMarkets,
    SPOT_MARKETS: MainnetSpotMarkets
  }
};
var currentConfig = configs.devnet;
var getConfig = () => currentConfig;
var initialize = (props) => {
  var _a, _b;
  if (props.env === "master")
    return { ...configs["devnet"], ...(_a = props.overrideEnv) != null ? _a : {} };
  currentConfig = { ...configs[props.env], ...(_b = props.overrideEnv) != null ? _b : {} };
  return currentConfig;
};
function getMarketsAndOraclesForSubscription(env) {
  const perpMarketIndexes = [];
  const spotMarketIndexes = [];
  const oracleInfos = /* @__PURE__ */ new Map();
  for (const market of PerpMarkets[env]) {
    perpMarketIndexes.push(market.marketIndex);
    oracleInfos.set(market.oracle.toString(), {
      publicKey: market.oracle,
      source: market.oracleSource
    });
  }
  for (const spotMarket of SpotMarkets[env]) {
    spotMarketIndexes.push(spotMarket.marketIndex);
    oracleInfos.set(spotMarket.oracle.toString(), {
      publicKey: spotMarket.oracle,
      source: spotMarket.oracleSource
    });
  }
  return {
    perpMarketIndexes,
    spotMarketIndexes,
    oracleInfos: Array.from(oracleInfos.values())
  };
}

// src/userStats.ts
import { PublicKey as PublicKey9 } from "@solana/web3.js";

// src/accounts/webSocketUserStatsAccountSubsriber.ts
import { EventEmitter as EventEmitter8 } from "events";
var WebSocketUserStatsAccountSubscriber = class {
  constructor(program2, userStatsAccountPublicKey) {
    this.isSubscribed = false;
    this.program = program2;
    this.userStatsAccountPublicKey = userStatsAccountPublicKey;
    this.eventEmitter = new EventEmitter8();
  }
  async subscribe() {
    if (this.isSubscribed) {
      return true;
    }
    this.userStatsAccountSubscriber = new WebSocketAccountSubscriber(
      "userStats",
      this.program,
      this.userStatsAccountPublicKey
    );
    await this.userStatsAccountSubscriber.subscribe(
      (data) => {
        this.eventEmitter.emit("userStatsAccountUpdate", data);
        this.eventEmitter.emit("update");
      }
    );
    this.eventEmitter.emit("update");
    this.isSubscribed = true;
    return true;
  }
  async fetch() {
    await Promise.all([this.userStatsAccountSubscriber.fetch()]);
  }
  async unsubscribe() {
    if (!this.isSubscribed) {
      return;
    }
    await Promise.all([this.userStatsAccountSubscriber.unsubscribe()]);
    this.isSubscribed = false;
  }
  assertIsSubscribed() {
    if (!this.isSubscribed) {
      throw new NotSubscribedError(
        "You must call `subscribe` before using this function"
      );
    }
  }
  getUserStatsAccountAndSlot() {
    this.assertIsSubscribed();
    return this.userStatsAccountSubscriber.dataAndSlot;
  }
};

// src/userStats.ts
var UserStats = class {
  constructor(config) {
    var _a;
    this.driftClient = config.driftClient;
    this.userStatsAccountPublicKey = config.userStatsAccountPublicKey;
    if (((_a = config.accountSubscription) == null ? void 0 : _a.type) === "polling") {
      this.accountSubscriber = new PollingUserStatsAccountSubscriber(
        config.driftClient.program,
        config.userStatsAccountPublicKey,
        config.accountSubscription.accountLoader
      );
    } else {
      this.accountSubscriber = new WebSocketUserStatsAccountSubscriber(
        config.driftClient.program,
        config.userStatsAccountPublicKey
      );
    }
  }
  async subscribe() {
    this.isSubscribed = await this.accountSubscriber.subscribe();
    return this.isSubscribed;
  }
  async fetchAccounts() {
    await this.accountSubscriber.fetch();
  }
  async unsubscribe() {
    await this.accountSubscriber.unsubscribe();
    this.isSubscribed = false;
  }
  getAccountAndSlot() {
    return this.accountSubscriber.getUserStatsAccountAndSlot();
  }
  getAccount() {
    return this.accountSubscriber.getUserStatsAccountAndSlot().data;
  }
  getReferrerInfo() {
    if (this.getAccount().referrer.equals(PublicKey9.default)) {
      return void 0;
    } else {
      return {
        referrer: getUserAccountPublicKeySync(
          this.driftClient.program.programId,
          this.getAccount().referrer,
          0
        ),
        referrerStats: getUserStatsAccountPublicKey(
          this.driftClient.program.programId,
          this.getAccount().referrer
        )
      };
    }
  }
};

// src/driftClient.ts
var DriftClient = class {
  constructor(config) {
    this.users = /* @__PURE__ */ new Map();
    this._isSubscribed = false;
    this.perpMarketLastSlotCache = /* @__PURE__ */ new Map();
    this.spotMarketLastSlotCache = /* @__PURE__ */ new Map();
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    this.connection = config.connection;
    this.wallet = config.wallet;
    this.opts = config.opts || AnchorProvider3.defaultOptions();
    this.provider = new AnchorProvider3(
      config.connection,
      config.wallet,
      this.opts
    );
    this.program = new Program3(
      drift_default,
      config.programID,
      this.provider
    );
    this.authority = (_a = config.authority) != null ? _a : this.wallet.publicKey;
    const subAccountIds = (_b = config.subAccountIds) != null ? _b : [0];
    this.activeSubAccountId = (_c = config.activeSubAccountId) != null ? _c : subAccountIds[0];
    this.userAccountSubscriptionConfig = ((_d = config.accountSubscription) == null ? void 0 : _d.type) === "polling" ? {
      type: "polling",
      accountLoader: config.accountSubscription.accountLoader
    } : {
      type: "websocket"
    };
    this.createUsers(subAccountIds, this.userAccountSubscriptionConfig);
    if (config.userStats) {
      this.userStats = new UserStats({
        driftClient: this,
        userStatsAccountPublicKey: getUserStatsAccountPublicKey(
          this.program.programId,
          this.authority
        ),
        accountSubscription: this.userAccountSubscriptionConfig
      });
    }
    let perpMarketIndexes = config.perpMarketIndexes;
    let spotMarketIndexes = config.spotMarketIndexes;
    let oracleInfos = config.oracleInfos;
    if (config.env) {
      const {
        perpMarketIndexes: envPerpMarketIndexes,
        spotMarketIndexes: envSpotMarketIndexes,
        oracleInfos: envOralceInfos
      } = getMarketsAndOraclesForSubscription(config.env);
      perpMarketIndexes = perpMarketIndexes ? perpMarketIndexes : envPerpMarketIndexes;
      spotMarketIndexes = spotMarketIndexes ? spotMarketIndexes : envSpotMarketIndexes;
      oracleInfos = oracleInfos ? oracleInfos : envOralceInfos;
    }
    if (((_e = config.accountSubscription) == null ? void 0 : _e.type) === "polling") {
      this.accountSubscriber = new PollingDriftClientAccountSubscriber(
        this.program,
        config.accountSubscription.accountLoader,
        perpMarketIndexes != null ? perpMarketIndexes : [],
        spotMarketIndexes != null ? spotMarketIndexes : [],
        oracleInfos != null ? oracleInfos : []
      );
    } else {
      this.accountSubscriber = new WebSocketDriftClientAccountSubscriber(
        this.program,
        (_f = config.perpMarketIndexes) != null ? _f : [],
        (_g = config.spotMarketIndexes) != null ? _g : [],
        (_h = config.oracleInfos) != null ? _h : []
      );
    }
    this.eventEmitter = this.accountSubscriber.eventEmitter;
    this.txSender = new RetryTxSender(
      this.provider,
      (_i = config.txSenderConfig) == null ? void 0 : _i.timeout,
      (_j = config.txSenderConfig) == null ? void 0 : _j.retrySleep,
      (_k = config.txSenderConfig) == null ? void 0 : _k.additionalConnections
    );
  }
  get isSubscribed() {
    return this._isSubscribed && this.accountSubscriber.isSubscribed;
  }
  set isSubscribed(val) {
    this._isSubscribed = val;
  }
  createUsers(subAccountIds, accountSubscriptionConfig) {
    for (const subAccountId of subAccountIds) {
      const user = this.createUser(subAccountId, accountSubscriptionConfig);
      this.users.set(subAccountId, user);
    }
  }
  createUser(subAccountId, accountSubscriptionConfig) {
    const userAccountPublicKey = getUserAccountPublicKeySync(
      this.program.programId,
      this.authority,
      subAccountId
    );
    return new User({
      driftClient: this,
      userAccountPublicKey,
      accountSubscription: accountSubscriptionConfig
    });
  }
  async subscribe() {
    let subscribePromises = this.subscribeUsers().concat(
      this.accountSubscriber.subscribe()
    );
    if (this.userStats !== void 0) {
      subscribePromises = subscribePromises.concat(this.userStats.subscribe());
    }
    this.isSubscribed = (await Promise.all(subscribePromises)).reduce(
      (success, prevSuccess) => success && prevSuccess
    );
    return this.isSubscribed;
  }
  subscribeUsers() {
    return [...this.users.values()].map((user) => user.subscribe());
  }
  async fetchAccounts() {
    let promises = [...this.users.values()].map((user) => user.fetchAccounts()).concat(this.accountSubscriber.fetch());
    if (this.userStats) {
      promises = promises.concat(this.userStats.fetchAccounts());
    }
    await Promise.all(promises);
  }
  async unsubscribe() {
    let unsubscribePromises = this.unsubscribeUsers().concat(
      this.accountSubscriber.unsubscribe()
    );
    if (this.userStats !== void 0) {
      unsubscribePromises = unsubscribePromises.concat(
        this.userStats.unsubscribe()
      );
    }
    await Promise.all(unsubscribePromises);
    this.isSubscribed = false;
  }
  unsubscribeUsers() {
    return [...this.users.values()].map((user) => user.unsubscribe());
  }
  async getStatePublicKey() {
    if (this.statePublicKey) {
      return this.statePublicKey;
    }
    this.statePublicKey = await getDriftStateAccountPublicKey(
      this.program.programId
    );
    return this.statePublicKey;
  }
  getSignerPublicKey() {
    if (this.signerPublicKey) {
      return this.signerPublicKey;
    }
    this.signerPublicKey = getDriftSignerPublicKey(this.program.programId);
    return this.signerPublicKey;
  }
  getStateAccount() {
    return this.accountSubscriber.getStateAccountAndSlot().data;
  }
  async forceGetStateAccount() {
    await this.accountSubscriber.fetch();
    return this.accountSubscriber.getStateAccountAndSlot().data;
  }
  getPerpMarketAccount(marketIndex) {
    var _a;
    return (_a = this.accountSubscriber.getMarketAccountAndSlot(marketIndex)) == null ? void 0 : _a.data;
  }
  async forceGetPerpMarketAccount(marketIndex) {
    var _a;
    await this.accountSubscriber.fetch();
    return (_a = this.accountSubscriber.getMarketAccountAndSlot(marketIndex)) == null ? void 0 : _a.data;
  }
  getPerpMarketAccounts() {
    return this.accountSubscriber.getMarketAccountsAndSlots().map((value) => value.data);
  }
  getSpotMarketAccount(marketIndex) {
    return this.accountSubscriber.getSpotMarketAccountAndSlot(marketIndex).data;
  }
  async forceGetSpotMarketAccount(marketIndex) {
    await this.accountSubscriber.fetch();
    return this.accountSubscriber.getSpotMarketAccountAndSlot(marketIndex).data;
  }
  getSpotMarketAccounts() {
    return this.accountSubscriber.getSpotMarketAccountsAndSlots().map((value) => value.data);
  }
  getQuoteSpotMarketAccount() {
    return this.accountSubscriber.getSpotMarketAccountAndSlot(
      QUOTE_SPOT_MARKET_INDEX
    ).data;
  }
  getOraclePriceDataAndSlot(oraclePublicKey) {
    return this.accountSubscriber.getOraclePriceDataAndSlot(oraclePublicKey);
  }
  async getSerumV3FulfillmentConfig(serumMarket) {
    const address = await getSerumFulfillmentConfigPublicKey(
      this.program.programId,
      serumMarket
    );
    return await this.program.account.serumV3FulfillmentConfig.fetch(
      address
    );
  }
  async updateWallet(newWallet, subAccountIds = [0], activeSubAccountId = 0) {
    const newProvider = new AnchorProvider3(
      this.connection,
      newWallet,
      this.opts
    );
    const newProgram = new Program3(
      drift_default,
      this.program.programId,
      newProvider
    );
    this.txSender.provider = newProvider;
    this.wallet = newWallet;
    this.provider = newProvider;
    this.program = newProgram;
    this.authority = newWallet.publicKey;
    if (this.isSubscribed) {
      await Promise.all(this.unsubscribeUsers());
      if (this.userStats) {
        await this.userStats.unsubscribe();
        this.userStats = new UserStats({
          driftClient: this,
          userStatsAccountPublicKey: getUserStatsAccountPublicKey(
            this.program.programId,
            this.authority
          ),
          accountSubscription: this.userAccountSubscriptionConfig
        });
      }
    }
    this.users.clear();
    this.createUsers(subAccountIds, this.userAccountSubscriptionConfig);
    if (this.isSubscribed) {
      await Promise.all(this.subscribeUsers());
      if (this.userStats) {
        await this.userStats.subscribe();
      }
    }
    this.activeSubAccountId = activeSubAccountId;
    this.userStatsAccountPublicKey = void 0;
  }
  async switchActiveUser(subAccountId) {
    this.activeSubAccountId = subAccountId;
  }
  async addUser(subAccountId) {
    if (this.users.has(subAccountId)) {
      return;
    }
    const user = this.createUser(
      subAccountId,
      this.userAccountSubscriptionConfig
    );
    await user.subscribe();
    this.users.set(subAccountId, user);
  }
  async initializeUserAccount(subAccountId = 0, name = DEFAULT_USER_NAME, referrerInfo) {
    const [userAccountPublicKey, initializeUserAccountIx] = await this.getInitializeUserInstructions(
      subAccountId,
      name,
      referrerInfo
    );
    const tx = new Transaction3();
    if (subAccountId === 0) {
      if (!await this.checkIfAccountExists(this.getUserStatsAccountPublicKey())) {
        tx.add(await this.getInitializeUserStatsIx());
      }
    }
    tx.add(initializeUserAccountIx);
    const { txSig } = await this.txSender.send(tx, [], this.opts);
    return [txSig, userAccountPublicKey];
  }
  async getInitializeUserInstructions(subAccountId = 0, name = DEFAULT_USER_NAME, referrerInfo) {
    const userAccountPublicKey = await getUserAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      subAccountId
    );
    const remainingAccounts = new Array();
    if (referrerInfo !== void 0) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    const state = this.getStateAccount();
    if (!state.whitelistMint.equals(PublicKey10.default)) {
      const associatedTokenPublicKey = await Token2.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID2,
        TOKEN_PROGRAM_ID2,
        state.whitelistMint,
        this.wallet.publicKey
      );
      remainingAccounts.push({
        pubkey: associatedTokenPublicKey,
        isWritable: false,
        isSigner: false
      });
    }
    const nameBuffer = encodeName(name);
    const initializeUserAccountIx = await this.program.instruction.initializeUser(subAccountId, nameBuffer, {
      accounts: {
        user: userAccountPublicKey,
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey,
        payer: this.wallet.publicKey,
        rent: anchor3.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor3.web3.SystemProgram.programId,
        state: await this.getStatePublicKey()
      },
      remainingAccounts
    });
    return [userAccountPublicKey, initializeUserAccountIx];
  }
  async getInitializeUserStatsIx() {
    return await this.program.instruction.initializeUserStats({
      accounts: {
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey,
        payer: this.wallet.publicKey,
        rent: anchor3.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor3.web3.SystemProgram.programId,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updateUserName(name, subAccountId = 0) {
    const userAccountPublicKey = getUserAccountPublicKeySync(
      this.program.programId,
      this.wallet.publicKey,
      subAccountId
    );
    const nameBuffer = encodeName(name);
    return await this.program.rpc.updateUserName(subAccountId, nameBuffer, {
      accounts: {
        user: userAccountPublicKey,
        authority: this.wallet.publicKey
      }
    });
  }
  async updateUserCustomMarginRatio(marginRatio, subAccountId = 0) {
    return await this.program.rpc.updateUserCustomMarginRatio(
      subAccountId,
      marginRatio,
      {
        accounts: {
          user: await this.getUserAccountPublicKey(),
          authority: this.wallet.publicKey
        }
      }
    );
  }
  async updateUserMarginTradingEnabled(marginTradingEnabled, subAccountId = 0) {
    const userAccountPublicKey = getUserAccountPublicKeySync(
      this.program.programId,
      this.wallet.publicKey,
      subAccountId
    );
    return await this.program.rpc.updateUserMarginTradingEnabled(
      subAccountId,
      marginTradingEnabled,
      {
        accounts: {
          user: userAccountPublicKey,
          authority: this.wallet.publicKey
        }
      }
    );
  }
  async updateUserDelegate(delegate, subAccountId = 0) {
    return await this.program.rpc.updateUserDelegate(subAccountId, delegate, {
      accounts: {
        user: await this.getUserAccountPublicKey(),
        authority: this.wallet.publicKey
      }
    });
  }
  async getUserAccountsForDelegate(delegate) {
    const programAccounts = await this.program.account.user.all([
      {
        memcmp: {
          offset: 40,
          bytes: bs582.encode(delegate.toBuffer())
        }
      }
    ]);
    return programAccounts.map(
      (programAccount) => programAccount.account
    );
  }
  async getUserAccountsForAuthority(authority) {
    const programAccounts = await this.program.account.user.all([
      {
        memcmp: {
          offset: 8,
          bytes: bs582.encode(authority.toBuffer())
        }
      }
    ]);
    return programAccounts.map(
      (programAccount) => programAccount.account
    );
  }
  async deleteUser(subAccountId = 0) {
    var _a;
    const userAccountPublicKey = getUserAccountPublicKeySync(
      this.program.programId,
      this.wallet.publicKey,
      subAccountId
    );
    const txSig = await this.program.rpc.deleteUser({
      accounts: {
        user: userAccountPublicKey,
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
    await ((_a = this.users.get(subAccountId)) == null ? void 0 : _a.unsubscribe());
    this.users.delete(subAccountId);
    return txSig;
  }
  getUser(subAccountId) {
    subAccountId = subAccountId != null ? subAccountId : this.activeSubAccountId;
    if (!this.users.has(subAccountId)) {
      throw new Error(`Clearing House has no user for user id ${subAccountId}`);
    }
    return this.users.get(subAccountId);
  }
  getUsers() {
    return [...this.users.values()];
  }
  getUserStats() {
    return this.userStats;
  }
  getUserStatsAccountPublicKey() {
    if (this.userStatsAccountPublicKey) {
      return this.userStatsAccountPublicKey;
    }
    this.userStatsAccountPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      this.authority
    );
    return this.userStatsAccountPublicKey;
  }
  async getUserAccountPublicKey() {
    return this.getUser().userAccountPublicKey;
  }
  getUserAccount(subAccountId) {
    return this.getUser(subAccountId).getUserAccount();
  }
  async forceGetUserAccount(subAccountId) {
    await this.getUser(subAccountId).fetchAccounts();
    return this.getUser(subAccountId).getUserAccount();
  }
  getUserAccountAndSlot(subAccountId) {
    return this.getUser(subAccountId).getUserAccountAndSlot();
  }
  getSpotPosition(marketIndex) {
    return this.getUserAccount().spotPositions.find(
      (spotPosition) => spotPosition.marketIndex === marketIndex
    );
  }
  getQuoteAssetTokenAmount() {
    const spotMarket = this.getSpotMarketAccount(QUOTE_SPOT_MARKET_INDEX);
    const spotPosition = this.getSpotPosition(QUOTE_SPOT_MARKET_INDEX);
    return getTokenAmount(
      spotPosition.scaledBalance,
      spotMarket,
      spotPosition.balanceType
    );
  }
  getTokenAmount(marketIndex) {
    const spotPosition = this.getSpotPosition(marketIndex);
    if (spotPosition === void 0) {
      return ZERO;
    }
    const spotMarket = this.getSpotMarketAccount(marketIndex);
    return getTokenAmount(
      spotPosition.scaledBalance,
      spotMarket,
      spotPosition.balanceType
    );
  }
  getRemainingAccounts(params) {
    var _a;
    const { oracleAccountMap, spotMarketAccountMap, perpMarketAccountMap } = this.getRemainingAccountMapsForUsers(params.userAccounts);
    if (params.useMarketLastSlotCache) {
      const lastUserSlot = (_a = this.getUserAccountAndSlot()) == null ? void 0 : _a.slot;
      for (const [
        marketIndex,
        slot
      ] of this.perpMarketLastSlotCache.entries()) {
        if (slot > lastUserSlot) {
          const marketAccount = this.getPerpMarketAccount(marketIndex);
          perpMarketAccountMap.set(marketIndex, {
            pubkey: marketAccount.pubkey,
            isSigner: false,
            isWritable: false
          });
          oracleAccountMap.set(marketAccount.amm.oracle.toString(), {
            pubkey: marketAccount.amm.oracle,
            isSigner: false,
            isWritable: false
          });
        } else {
          this.perpMarketLastSlotCache.delete(marketIndex);
        }
      }
      for (const [
        marketIndex,
        slot
      ] of this.spotMarketLastSlotCache.entries()) {
        if (slot > lastUserSlot) {
          const marketAccount = this.getSpotMarketAccount(marketIndex);
          spotMarketAccountMap.set(marketIndex, {
            pubkey: marketAccount.pubkey,
            isSigner: false,
            isWritable: false
          });
          if (!marketAccount.oracle.equals(PublicKey10.default)) {
            oracleAccountMap.set(marketAccount.oracle.toString(), {
              pubkey: marketAccount.oracle,
              isSigner: false,
              isWritable: false
            });
          }
        } else {
          this.spotMarketLastSlotCache.delete(marketIndex);
        }
      }
    }
    if (params.readablePerpMarketIndex !== void 0) {
      const marketAccount = this.getPerpMarketAccount(
        params.readablePerpMarketIndex
      );
      perpMarketAccountMap.set(params.readablePerpMarketIndex, {
        pubkey: marketAccount.pubkey,
        isSigner: false,
        isWritable: false
      });
      oracleAccountMap.set(marketAccount.amm.oracle.toString(), {
        pubkey: marketAccount.amm.oracle,
        isSigner: false,
        isWritable: false
      });
    }
    if (params.writablePerpMarketIndexes !== void 0) {
      for (const writablePerpMarketIndex of params.writablePerpMarketIndexes) {
        const marketAccount = this.getPerpMarketAccount(
          writablePerpMarketIndex
        );
        perpMarketAccountMap.set(writablePerpMarketIndex, {
          pubkey: marketAccount.pubkey,
          isSigner: false,
          isWritable: true
        });
        oracleAccountMap.set(marketAccount.amm.oracle.toString(), {
          pubkey: marketAccount.amm.oracle,
          isSigner: false,
          isWritable: false
        });
      }
    }
    if (params.readableSpotMarketIndexes !== void 0) {
      for (const readableSpotMarketIndex of params.readableSpotMarketIndexes) {
        const spotMarketAccount = this.getSpotMarketAccount(
          readableSpotMarketIndex
        );
        spotMarketAccountMap.set(readableSpotMarketIndex, {
          pubkey: spotMarketAccount.pubkey,
          isSigner: false,
          isWritable: false
        });
        if (spotMarketAccount.marketIndex !== 0) {
          oracleAccountMap.set(spotMarketAccount.oracle.toString(), {
            pubkey: spotMarketAccount.oracle,
            isSigner: false,
            isWritable: false
          });
        }
      }
    }
    if (params.writableSpotMarketIndexes !== void 0) {
      for (const writableSpotMarketIndex of params.writableSpotMarketIndexes) {
        const spotMarketAccount = this.getSpotMarketAccount(
          writableSpotMarketIndex
        );
        spotMarketAccountMap.set(spotMarketAccount.marketIndex, {
          pubkey: spotMarketAccount.pubkey,
          isSigner: false,
          isWritable: true
        });
        if (!spotMarketAccount.oracle.equals(PublicKey10.default)) {
          oracleAccountMap.set(spotMarketAccount.oracle.toString(), {
            pubkey: spotMarketAccount.oracle,
            isSigner: false,
            isWritable: false
          });
        }
      }
    }
    return [
      ...oracleAccountMap.values(),
      ...spotMarketAccountMap.values(),
      ...perpMarketAccountMap.values()
    ];
  }
  getRemainingAccountMapsForUsers(userAccounts) {
    const oracleAccountMap = /* @__PURE__ */ new Map();
    const spotMarketAccountMap = /* @__PURE__ */ new Map();
    const perpMarketAccountMap = /* @__PURE__ */ new Map();
    for (const userAccount of userAccounts) {
      for (const spotPosition of userAccount.spotPositions) {
        if (!isSpotPositionAvailable(spotPosition)) {
          const spotMarket = this.getSpotMarketAccount(
            spotPosition.marketIndex
          );
          spotMarketAccountMap.set(spotPosition.marketIndex, {
            pubkey: spotMarket.pubkey,
            isSigner: false,
            isWritable: false
          });
          if (!spotMarket.oracle.equals(PublicKey10.default)) {
            oracleAccountMap.set(spotMarket.oracle.toString(), {
              pubkey: spotMarket.oracle,
              isSigner: false,
              isWritable: false
            });
          }
          if (!spotPosition.openAsks.eq(ZERO) || !spotPosition.openBids.eq(ZERO)) {
            spotMarketAccountMap.set(QUOTE_SPOT_MARKET_INDEX, {
              pubkey: this.getQuoteSpotMarketAccount().pubkey,
              isSigner: false,
              isWritable: false
            });
          }
        }
      }
      for (const position of userAccount.perpPositions) {
        if (!positionIsAvailable(position)) {
          const market = this.getPerpMarketAccount(position.marketIndex);
          perpMarketAccountMap.set(position.marketIndex, {
            pubkey: market.pubkey,
            isWritable: false,
            isSigner: false
          });
          oracleAccountMap.set(market.amm.oracle.toString(), {
            pubkey: market.amm.oracle,
            isWritable: false,
            isSigner: false
          });
        }
      }
    }
    return {
      oracleAccountMap,
      spotMarketAccountMap,
      perpMarketAccountMap
    };
  }
  getOrder(orderId) {
    var _a;
    return (_a = this.getUserAccount()) == null ? void 0 : _a.orders.find(
      (order) => order.orderId === orderId
    );
  }
  getOrderByUserId(userOrderId) {
    var _a;
    return (_a = this.getUserAccount()) == null ? void 0 : _a.orders.find(
      (order) => order.userOrderId === userOrderId
    );
  }
  async deposit(amount, marketIndex, collateralAccountPublicKey, subAccountId, reduceOnly = false) {
    const tx = new Transaction3();
    tx.add(
      ComputeBudgetProgram2.requestUnits({
        units: 6e5,
        additionalFee: 0
      })
    );
    const additionalSigners = [];
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    const isSolMarket = spotMarketAccount.mint.equals(WRAPPED_SOL_MINT);
    const authority = this.authority;
    const createWSOLTokenAccount = isSolMarket && collateralAccountPublicKey.equals(authority);
    if (createWSOLTokenAccount) {
      const { ixs, signers, pubkey } = await this.getWrappedSolAccountCreationIxs(amount, true);
      collateralAccountPublicKey = pubkey;
      ixs.forEach((ix) => {
        tx.add(ix);
      });
      signers.forEach((signer) => additionalSigners.push(signer));
    }
    const depositCollateralIx = await this.getDepositInstruction(
      amount,
      marketIndex,
      collateralAccountPublicKey,
      subAccountId,
      reduceOnly,
      true
    );
    tx.add(depositCollateralIx);
    if (createWSOLTokenAccount) {
      tx.add(
        Token2.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID2,
          collateralAccountPublicKey,
          authority,
          authority,
          []
        )
      );
    }
    const { txSig, slot } = await this.txSender.send(
      tx,
      additionalSigners,
      this.opts
    );
    this.spotMarketLastSlotCache.set(marketIndex, slot);
    return txSig;
  }
  async getDepositInstruction(amount, marketIndex, userTokenAccount, subAccountId, reduceOnly = false, userInitialized = true) {
    const userAccountPublicKey = subAccountId ? await getUserAccountPublicKey(
      this.program.programId,
      this.authority,
      subAccountId
    ) : await this.getUserAccountPublicKey();
    let remainingAccounts = [];
    if (userInitialized) {
      remainingAccounts = this.getRemainingAccounts({
        userAccounts: [this.getUserAccount()],
        useMarketLastSlotCache: true,
        writableSpotMarketIndexes: [marketIndex]
      });
    } else {
      remainingAccounts = this.getRemainingAccounts({
        userAccounts: [],
        writableSpotMarketIndexes: [marketIndex]
      });
    }
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    return await this.program.instruction.deposit(
      marketIndex,
      amount,
      reduceOnly,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          spotMarket: spotMarketAccount.pubkey,
          spotMarketVault: spotMarketAccount.vault,
          user: userAccountPublicKey,
          userStats: this.getUserStatsAccountPublicKey(),
          userTokenAccount,
          authority: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID2
        },
        remainingAccounts
      }
    );
  }
  async checkIfAccountExists(account) {
    try {
      const accountInfo = await this.connection.getAccountInfo(account);
      return accountInfo != null;
    } catch (e) {
      return false;
    }
  }
  async getWrappedSolAccountCreationIxs(amount, isDeposit) {
    const wrappedSolAccount = new Keypair2();
    const result = {
      ixs: [],
      signers: [],
      pubkey: wrappedSolAccount.publicKey
    };
    const rentSpaceLamports = new BN12(LAMPORTS_PER_SOL2 / 100);
    const lamports = isDeposit ? amount.add(rentSpaceLamports) : rentSpaceLamports;
    const authority = this.wallet.publicKey;
    result.ixs.push(
      SystemProgram.createAccount({
        fromPubkey: authority,
        newAccountPubkey: wrappedSolAccount.publicKey,
        lamports: lamports.toNumber(),
        space: 165,
        programId: TOKEN_PROGRAM_ID2
      })
    );
    result.ixs.push(
      Token2.createInitAccountInstruction(
        TOKEN_PROGRAM_ID2,
        WRAPPED_SOL_MINT,
        wrappedSolAccount.publicKey,
        authority
      )
    );
    result.signers.push(wrappedSolAccount);
    return result;
  }
  getAssociatedTokenAccountCreationIx(tokenMintAddress, associatedTokenAddress) {
    const createAssociatedAccountIx = Token2.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID2,
      TOKEN_PROGRAM_ID2,
      tokenMintAddress,
      associatedTokenAddress,
      this.wallet.publicKey,
      this.wallet.publicKey
    );
    return createAssociatedAccountIx;
  }
  async initializeUserAccountAndDepositCollateral(amount, userTokenAccount, marketIndex = 0, subAccountId = 0, name = DEFAULT_USER_NAME, fromSubAccountId, referrerInfo) {
    const [userAccountPublicKey, initializeUserAccountIx] = await this.getInitializeUserInstructions(
      subAccountId,
      name,
      referrerInfo
    );
    const additionalSigners = [];
    const spotMarket = this.getSpotMarketAccount(marketIndex);
    const isSolMarket = spotMarket.mint.equals(WRAPPED_SOL_MINT);
    const tx = new Transaction3();
    const authority = this.wallet.publicKey;
    const createWSOLTokenAccount = isSolMarket && userTokenAccount.equals(authority);
    if (createWSOLTokenAccount) {
      const {
        ixs: startIxs,
        signers,
        pubkey
      } = await this.getWrappedSolAccountCreationIxs(amount, true);
      userTokenAccount = pubkey;
      startIxs.forEach((ix) => {
        tx.add(ix);
      });
      signers.forEach((signer) => additionalSigners.push(signer));
    }
    const depositCollateralIx = fromSubAccountId != null ? await this.getTransferDepositIx(
      amount,
      marketIndex,
      fromSubAccountId,
      subAccountId
    ) : await this.getDepositInstruction(
      amount,
      marketIndex,
      userTokenAccount,
      subAccountId,
      false,
      false
    );
    if (subAccountId === 0) {
      if (!await this.checkIfAccountExists(this.getUserStatsAccountPublicKey())) {
        tx.add(await this.getInitializeUserStatsIx());
      }
    }
    tx.add(initializeUserAccountIx).add(depositCollateralIx);
    if (createWSOLTokenAccount) {
      tx.add(
        Token2.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID2,
          userTokenAccount,
          authority,
          authority,
          []
        )
      );
    }
    const { txSig, slot } = await this.txSender.send(
      tx,
      additionalSigners,
      this.opts
    );
    this.spotMarketLastSlotCache.set(marketIndex, slot);
    return [txSig, userAccountPublicKey];
  }
  async initializeUserAccountForDevnet(subAccountId = 0, name = DEFAULT_USER_NAME, marketIndex, tokenFaucet, amount, referrerInfo) {
    const [associateTokenPublicKey, createAssociatedAccountIx, mintToIx] = await tokenFaucet.createAssociatedTokenAccountAndMintToInstructions(
      this.wallet.publicKey,
      amount
    );
    const [userAccountPublicKey, initializeUserAccountIx] = await this.getInitializeUserInstructions(
      subAccountId,
      name,
      referrerInfo
    );
    const depositCollateralIx = await this.getDepositInstruction(
      amount,
      marketIndex,
      associateTokenPublicKey,
      subAccountId,
      false,
      false
    );
    const tx = new Transaction3().add(createAssociatedAccountIx).add(mintToIx);
    if (subAccountId === 0) {
      if (!await this.checkIfAccountExists(this.getUserStatsAccountPublicKey())) {
        tx.add(await this.getInitializeUserStatsIx());
      }
    }
    tx.add(initializeUserAccountIx).add(depositCollateralIx);
    const txSig = await this.program.provider.sendAndConfirm(tx, []);
    return [txSig, userAccountPublicKey];
  }
  async withdraw(amount, marketIndex, userTokenAccount, reduceOnly = false) {
    const tx = new Transaction3();
    tx.add(
      ComputeBudgetProgram2.requestUnits({
        units: 6e5,
        additionalFee: 0
      })
    );
    const additionalSigners = [];
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    const isSolMarket = spotMarketAccount.mint.equals(WRAPPED_SOL_MINT);
    const authority = this.wallet.publicKey;
    const createWSOLTokenAccount = isSolMarket && userTokenAccount.equals(authority);
    if (createWSOLTokenAccount) {
      const { ixs, signers, pubkey } = await this.getWrappedSolAccountCreationIxs(amount, false);
      userTokenAccount = pubkey;
      ixs.forEach((ix) => {
        tx.add(ix);
      });
      signers.forEach((signer) => additionalSigners.push(signer));
    } else {
      const accountExists = await this.checkIfAccountExists(userTokenAccount);
      if (!accountExists) {
        const createAssociatedTokenAccountIx = this.getAssociatedTokenAccountCreationIx(
          spotMarketAccount.mint,
          userTokenAccount
        );
        tx.add(createAssociatedTokenAccountIx);
      }
    }
    const withdrawCollateral = await this.getWithdrawIx(
      amount,
      spotMarketAccount.marketIndex,
      userTokenAccount,
      reduceOnly
    );
    tx.add(withdrawCollateral);
    if (createWSOLTokenAccount) {
      tx.add(
        Token2.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID2,
          userTokenAccount,
          authority,
          authority,
          []
        )
      );
    }
    const { txSig, slot } = await this.txSender.send(
      tx,
      additionalSigners,
      this.opts
    );
    this.spotMarketLastSlotCache.set(marketIndex, slot);
    return txSig;
  }
  async getWithdrawIx(amount, marketIndex, userTokenAccount, reduceOnly = false) {
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [marketIndex],
      readableSpotMarketIndexes: [QUOTE_SPOT_MARKET_INDEX]
    });
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    return await this.program.instruction.withdraw(
      marketIndex,
      amount,
      reduceOnly,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          spotMarket: spotMarketAccount.pubkey,
          spotMarketVault: spotMarketAccount.vault,
          driftSigner: this.getSignerPublicKey(),
          user: userAccountPublicKey,
          userStats: this.getUserStatsAccountPublicKey(),
          userTokenAccount,
          authority: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID2
        },
        remainingAccounts
      }
    );
  }
  async transferDeposit(amount, marketIndex, fromSubAccountId, toSubAccountId) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getTransferDepositIx(
          amount,
          marketIndex,
          fromSubAccountId,
          toSubAccountId
        )
      ),
      [],
      this.opts
    );
    if (fromSubAccountId === this.activeSubAccountId || toSubAccountId === this.activeSubAccountId) {
      this.spotMarketLastSlotCache.set(marketIndex, slot);
    }
    return txSig;
  }
  async getTransferDepositIx(amount, marketIndex, fromSubAccountId, toSubAccountId) {
    const fromUser = await getUserAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      fromSubAccountId
    );
    const toUser = await getUserAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      toSubAccountId
    );
    let remainingAccounts;
    if (this.users.has(fromSubAccountId)) {
      remainingAccounts = this.getRemainingAccounts({
        userAccounts: [this.users.get(fromSubAccountId).getUserAccount()],
        useMarketLastSlotCache: true,
        writableSpotMarketIndexes: [marketIndex]
      });
    } else {
      const userAccountPublicKey = getUserAccountPublicKeySync(
        this.program.programId,
        this.authority,
        fromSubAccountId
      );
      const fromUserAccount = await this.program.account.user.fetch(
        userAccountPublicKey
      );
      remainingAccounts = this.getRemainingAccounts({
        userAccounts: [fromUserAccount],
        useMarketLastSlotCache: true,
        writableSpotMarketIndexes: [marketIndex]
      });
    }
    return await this.program.instruction.transferDeposit(marketIndex, amount, {
      accounts: {
        authority: this.wallet.publicKey,
        fromUser,
        toUser,
        userStats: this.getUserStatsAccountPublicKey(),
        state: await this.getStatePublicKey(),
        spotMarketVault: this.getSpotMarketAccount(marketIndex).vault
      },
      remainingAccounts
    });
  }
  async updateSpotMarketCumulativeInterest(marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.updateSpotMarketCumulativeInterestIx(marketIndex)),
      [],
      this.opts
    );
    return txSig;
  }
  async updateSpotMarketCumulativeInterestIx(marketIndex) {
    const spotMarket = this.getSpotMarketAccount(marketIndex);
    return await this.program.instruction.updateSpotMarketCumulativeInterest({
      accounts: {
        state: await this.getStatePublicKey(),
        spotMarket: spotMarket.pubkey,
        oracle: spotMarket.oracle
      }
    });
  }
  async settleLP(settleeUserAccountPublicKey, marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.settleLPIx(settleeUserAccountPublicKey, marketIndex)),
      [],
      this.opts
    );
    return txSig;
  }
  async settleLPIx(settleeUserAccountPublicKey, marketIndex) {
    const settleeUserAccount = await this.program.account.user.fetch(
      settleeUserAccountPublicKey
    );
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [settleeUserAccount],
      writablePerpMarketIndexes: [marketIndex]
    });
    return this.program.instruction.settleLp(marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        user: settleeUserAccountPublicKey
      },
      remainingAccounts
    });
  }
  async removePerpLpShares(marketIndex, sharesToBurn) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getRemovePerpLpSharesIx(marketIndex, sharesToBurn)),
      [],
      this.opts
    );
    return txSig;
  }
  async removePerpLpSharesInExpiringMarket(marketIndex, userAccountPublicKey, sharesToBurn) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getRemovePerpLpSharesInExpiringMarket(
          marketIndex,
          userAccountPublicKey,
          sharesToBurn
        )
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getRemovePerpLpSharesInExpiringMarket(marketIndex, userAccountPublicKey, sharesToBurn) {
    const userAccount = await this.program.account.user.fetch(
      userAccountPublicKey
    );
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [userAccount],
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [marketIndex]
    });
    if (sharesToBurn == void 0) {
      const perpPosition = userAccount.perpPositions.filter(
        (position) => position.marketIndex === marketIndex
      )[0];
      sharesToBurn = perpPosition.lpShares;
      console.log("burning lp shares:", sharesToBurn.toString());
    }
    return this.program.instruction.removePerpLpSharesInExpiringMarket(
      sharesToBurn,
      marketIndex,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey
        },
        remainingAccounts
      }
    );
  }
  async getRemovePerpLpSharesIx(marketIndex, sharesToBurn) {
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [marketIndex]
    });
    if (sharesToBurn == void 0) {
      const userAccount = this.getUserAccount();
      const perpPosition = userAccount.perpPositions.filter(
        (position) => position.marketIndex === marketIndex
      )[0];
      sharesToBurn = perpPosition.lpShares;
      console.log("burning lp shares:", sharesToBurn.toString());
    }
    return this.program.instruction.removePerpLpShares(
      sharesToBurn,
      marketIndex,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  async addPerpLpShares(amount, marketIndex) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(await this.getAddPerpLpSharesIx(amount, marketIndex)),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(marketIndex, slot);
    return txSig;
  }
  async getAddPerpLpSharesIx(amount, marketIndex) {
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [marketIndex]
    });
    return this.program.instruction.addPerpLpShares(amount, marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        user: userAccountPublicKey,
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async openPosition(direction, amount, marketIndex, limitPrice) {
    return await this.placeAndTakePerpOrder({
      orderType: OrderType.MARKET,
      marketIndex,
      direction,
      baseAssetAmount: amount,
      price: limitPrice
    });
  }
  async sendSignedTx(tx) {
    const { txSig } = await this.txSender.send(tx, void 0, this.opts, true);
    return txSig;
  }
  async sendMarketOrderAndGetSignedFillTx(orderParams, userAccountPublicKey, userAccount, makerInfo) {
    const marketIndex = orderParams.marketIndex;
    const orderId = userAccount.nextOrderId;
    const marketOrderTx = wrapInTx(await this.getPlacePerpOrderIx(orderParams));
    const fillTx = wrapInTx(
      await this.getFillPerpOrderIx(
        userAccountPublicKey,
        userAccount,
        {
          orderId,
          marketIndex
        },
        makerInfo
      )
    );
    const currentBlockHash = (await this.connection.getLatestBlockhash("finalized")).blockhash;
    marketOrderTx.recentBlockhash = currentBlockHash;
    fillTx.recentBlockhash = currentBlockHash;
    marketOrderTx.feePayer = userAccount.authority;
    fillTx.feePayer = userAccount.authority;
    const [signedMarketOrderTx, signedFillTx] = await this.provider.wallet.signAllTransactions([marketOrderTx, fillTx]);
    const { txSig, slot } = await this.txSender.send(
      signedMarketOrderTx,
      [],
      this.opts,
      true
    );
    this.perpMarketLastSlotCache.set(orderParams.marketIndex, slot);
    return { txSig, signedFillTx };
  }
  async placePerpOrder(orderParams) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(await this.getPlacePerpOrderIx(orderParams)),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(orderParams.marketIndex, slot);
    return txSig;
  }
  getOrderParams(optionalOrderParams, marketType) {
    return Object.assign({}, DefaultOrderParams, optionalOrderParams, {
      marketType
    });
  }
  async getPlacePerpOrderIx(orderParams) {
    orderParams = this.getOrderParams(orderParams, MarketType.PERP);
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      readablePerpMarketIndex: orderParams.marketIndex
    });
    return await this.program.instruction.placePerpOrder(orderParams, {
      accounts: {
        state: await this.getStatePublicKey(),
        user: userAccountPublicKey,
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async updateAMMs(marketIndexes) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getUpdateAMMsIx(marketIndexes)),
      [],
      this.opts
    );
    return txSig;
  }
  async getUpdateAMMsIx(marketIndexes) {
    for (let i = marketIndexes.length; i < 5; i++) {
      marketIndexes.push(100);
    }
    const marketAccountInfos = [];
    const oracleAccountInfos = [];
    for (const marketIndex of marketIndexes) {
      if (marketIndex !== 100) {
        const market = this.getPerpMarketAccount(marketIndex);
        marketAccountInfos.push({
          pubkey: market.pubkey,
          isWritable: true,
          isSigner: false
        });
        oracleAccountInfos.push({
          pubkey: market.amm.oracle,
          isWritable: false,
          isSigner: false
        });
      }
    }
    const remainingAccounts = oracleAccountInfos.concat(marketAccountInfos);
    return await this.program.instruction.updateAmms(marketIndexes, {
      accounts: {
        state: await this.getStatePublicKey(),
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async settleExpiredMarket(marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getSettleExpiredMarketIx(marketIndex)),
      [],
      this.opts
    );
    return txSig;
  }
  async getSettleExpiredMarketIx(marketIndex) {
    const marketAccountInfos = [];
    const oracleAccountInfos = [];
    const spotMarketAccountInfos = [];
    const market = this.getPerpMarketAccount(marketIndex);
    marketAccountInfos.push({
      pubkey: market.pubkey,
      isWritable: true,
      isSigner: false
    });
    oracleAccountInfos.push({
      pubkey: market.amm.oracle,
      isWritable: false,
      isSigner: false
    });
    spotMarketAccountInfos.push({
      pubkey: this.getSpotMarketAccount(QUOTE_SPOT_MARKET_INDEX).pubkey,
      isSigner: false,
      isWritable: true
    });
    const remainingAccounts = oracleAccountInfos.concat(spotMarketAccountInfos).concat(marketAccountInfos);
    return await this.program.instruction.settleExpiredMarket(marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async settleExpiredMarketPoolsToRevenuePool(perpMarketIndex) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    const spotMarketPublicKey = await getSpotMarketPublicKey(
      this.program.programId,
      QUOTE_SPOT_MARKET_INDEX
    );
    const ix = await this.program.instruction.settleExpiredMarketPoolsToRevenuePool({
      accounts: {
        state: await this.getStatePublicKey(),
        admin: this.wallet.publicKey,
        spotMarket: spotMarketPublicKey,
        perpMarket: perpMarketPublicKey
      }
    });
    const { txSig } = await this.txSender.send(wrapInTx(ix), [], this.opts);
    return txSig;
  }
  async cancelOrder(orderId) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getCancelOrderIx(orderId)),
      [],
      this.opts
    );
    return txSig;
  }
  async getCancelOrderIx(orderId) {
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true
    });
    return await this.program.instruction.cancelOrder(orderId != null ? orderId : null, {
      accounts: {
        state: await this.getStatePublicKey(),
        user: userAccountPublicKey,
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async cancelOrderByUserId(userOrderId) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getCancelOrderByUserIdIx(userOrderId)),
      [],
      this.opts
    );
    return txSig;
  }
  async getCancelOrderByUserIdIx(userOrderId) {
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const order = this.getOrderByUserId(userOrderId);
    const oracle = this.getPerpMarketAccount(order.marketIndex).amm.oracle;
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true
    });
    return await this.program.instruction.cancelOrderByUserId(userOrderId, {
      accounts: {
        state: await this.getStatePublicKey(),
        user: userAccountPublicKey,
        authority: this.wallet.publicKey,
        oracle
      },
      remainingAccounts
    });
  }
  async cancelOrders(marketType, marketIndex, direction) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getCancelOrdersIx(marketType, marketIndex, direction)
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getCancelOrdersIx(marketType, marketIndex, direction) {
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true
    });
    return await this.program.instruction.cancelOrders(
      marketType != null ? marketType : null,
      marketIndex != null ? marketIndex : null,
      direction != null ? direction : null,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  async fillPerpOrder(userAccountPublicKey, user, order, makerInfo, referrerInfo) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getFillPerpOrderIx(
          userAccountPublicKey,
          user,
          order,
          makerInfo,
          referrerInfo
        )
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getFillPerpOrderIx(userAccountPublicKey, userAccount, order, makerInfo, referrerInfo) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const fillerPublicKey = await this.getUserAccountPublicKey();
    const fillerStatsPublicKey = this.getUserStatsAccountPublicKey();
    const marketIndex = order ? order.marketIndex : userAccount.orders.find(
      (order2) => order2.orderId === userAccount.nextOrderId - 1
    ).marketIndex;
    const userAccounts = [userAccount];
    if (makerInfo !== void 0) {
      userAccounts.push(makerInfo.makerUserAccount);
    }
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts,
      writablePerpMarketIndexes: [marketIndex]
    });
    if (makerInfo) {
      remainingAccounts.push({
        pubkey: makerInfo.maker,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: makerInfo.makerStats,
        isWritable: true,
        isSigner: false
      });
    }
    if (referrerInfo) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    const orderId = order.orderId;
    const makerOrderId = makerInfo ? makerInfo.order.orderId : null;
    return await this.program.instruction.fillPerpOrder(orderId, makerOrderId, {
      accounts: {
        state: await this.getStatePublicKey(),
        filler: fillerPublicKey,
        fillerStats: fillerStatsPublicKey,
        user: userAccountPublicKey,
        userStats: userStatsPublicKey,
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async placeSpotOrder(orderParams) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(await this.getPlaceSpotOrderIx(orderParams)),
      [],
      this.opts
    );
    this.spotMarketLastSlotCache.set(orderParams.marketIndex, slot);
    this.spotMarketLastSlotCache.set(QUOTE_SPOT_MARKET_INDEX, slot);
    return txSig;
  }
  async getPlaceSpotOrderIx(orderParams) {
    orderParams = this.getOrderParams(orderParams, MarketType.SPOT);
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      readableSpotMarketIndexes: [
        orderParams.marketIndex,
        QUOTE_SPOT_MARKET_INDEX
      ]
    });
    return await this.program.instruction.placeSpotOrder(orderParams, {
      accounts: {
        state: await this.getStatePublicKey(),
        user: userAccountPublicKey,
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async fillSpotOrder(userAccountPublicKey, user, order, fulfillmentConfig, makerInfo, referrerInfo) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getFillSpotOrderIx(
          userAccountPublicKey,
          user,
          order,
          fulfillmentConfig,
          makerInfo,
          referrerInfo
        )
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getFillSpotOrderIx(userAccountPublicKey, userAccount, order, fulfillmentConfig, makerInfo, referrerInfo) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const fillerPublicKey = await this.getUserAccountPublicKey();
    const fillerStatsPublicKey = this.getUserStatsAccountPublicKey();
    const marketIndex = order ? order.marketIndex : userAccount.orders.find(
      (order2) => order2.orderId === userAccount.nextOrderId - 1
    ).marketIndex;
    const userAccounts = [userAccount];
    if (makerInfo !== void 0) {
      userAccounts.push(makerInfo.makerUserAccount);
    }
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts,
      writableSpotMarketIndexes: [marketIndex, QUOTE_SPOT_MARKET_INDEX]
    });
    if (makerInfo) {
      remainingAccounts.push({
        pubkey: makerInfo.maker,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: makerInfo.makerStats,
        isWritable: true,
        isSigner: false
      });
    }
    if (referrerInfo) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    const orderId = order.orderId;
    const makerOrderId = makerInfo ? makerInfo.order.orderId : null;
    this.addSpotFulfillmentAccounts(
      marketIndex,
      remainingAccounts,
      fulfillmentConfig
    );
    return await this.program.instruction.fillSpotOrder(
      orderId,
      fulfillmentConfig ? fulfillmentConfig.fulfillmentType : null,
      makerOrderId,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          filler: fillerPublicKey,
          fillerStats: fillerStatsPublicKey,
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  addSpotFulfillmentAccounts(marketIndex, remainingAccounts, fulfillmentConfig) {
    if (fulfillmentConfig) {
      this.addSerumRemainingAccounts(
        marketIndex,
        remainingAccounts,
        fulfillmentConfig
      );
    } else {
      remainingAccounts.push({
        pubkey: this.getSpotMarketAccount(marketIndex).vault,
        isWritable: false,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: this.getQuoteSpotMarketAccount().vault,
        isWritable: false,
        isSigner: false
      });
    }
  }
  addSerumRemainingAccounts(marketIndex, remainingAccounts, fulfillmentConfig) {
    remainingAccounts.push({
      pubkey: fulfillmentConfig.pubkey,
      isWritable: false,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumProgramId,
      isWritable: false,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumMarket,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumRequestQueue,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumEventQueue,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumBids,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumAsks,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumBaseVault,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumQuoteVault,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: fulfillmentConfig.serumOpenOrders,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: getSerumSignerPublicKey(
        fulfillmentConfig.serumProgramId,
        fulfillmentConfig.serumMarket,
        fulfillmentConfig.serumSignerNonce
      ),
      isWritable: false,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: this.getSignerPublicKey(),
      isWritable: false,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: TOKEN_PROGRAM_ID2,
      isWritable: false,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: this.getSpotMarketAccount(marketIndex).vault,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: this.getQuoteSpotMarketAccount().vault,
      isWritable: true,
      isSigner: false
    });
    remainingAccounts.push({
      pubkey: this.getStateAccount().srmVault,
      isWritable: false,
      isSigner: false
    });
  }
  async triggerOrder(userAccountPublicKey, user, order) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getTriggerOrderIx(userAccountPublicKey, user, order)),
      [],
      this.opts
    );
    return txSig;
  }
  async getTriggerOrderIx(userAccountPublicKey, userAccount, order) {
    const fillerPublicKey = await this.getUserAccountPublicKey();
    let remainingAccountsParams;
    if (isVariant(order.marketType, "perp")) {
      remainingAccountsParams = {
        userAccounts: [userAccount],
        writablePerpMarketIndexes: [order.marketIndex]
      };
    } else {
      remainingAccountsParams = {
        userAccounts: [userAccount],
        writableSpotMarketIndexes: [order.marketIndex, QUOTE_SPOT_MARKET_INDEX]
      };
    }
    const remainingAccounts = this.getRemainingAccounts(
      remainingAccountsParams
    );
    const orderId = order.orderId;
    return await this.program.instruction.triggerOrder(orderId, {
      accounts: {
        state: await this.getStatePublicKey(),
        filler: fillerPublicKey,
        user: userAccountPublicKey,
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async forceCancelOrders(userAccountPublicKey, user) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getForceCancelOrdersIx(userAccountPublicKey, user)),
      [],
      this.opts
    );
    return txSig;
  }
  async getForceCancelOrdersIx(userAccountPublicKey, userAccount) {
    const fillerPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [userAccount],
      writableSpotMarketIndexes: [QUOTE_SPOT_MARKET_INDEX]
    });
    return await this.program.instruction.forceCancelOrders({
      accounts: {
        state: await this.getStatePublicKey(),
        filler: fillerPublicKey,
        user: userAccountPublicKey,
        authority: this.wallet.publicKey
      },
      remainingAccounts
    });
  }
  async placeAndTakePerpOrder(orderParams, makerInfo, referrerInfo) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getPlaceAndTakePerpOrderIx(
          orderParams,
          makerInfo,
          referrerInfo
        )
      ),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(orderParams.marketIndex, slot);
    return txSig;
  }
  async getPlaceAndTakePerpOrderIx(orderParams, makerInfo, referrerInfo) {
    orderParams = this.getOrderParams(orderParams, MarketType.PERP);
    const userStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const userAccounts = [this.getUserAccount()];
    if (makerInfo !== void 0) {
      userAccounts.push(makerInfo.makerUserAccount);
    }
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts,
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [orderParams.marketIndex]
    });
    let makerOrderId = null;
    if (makerInfo) {
      makerOrderId = makerInfo.order.orderId;
      remainingAccounts.push({
        pubkey: makerInfo.maker,
        isSigner: false,
        isWritable: true
      });
      remainingAccounts.push({
        pubkey: makerInfo.makerStats,
        isSigner: false,
        isWritable: true
      });
    }
    if (referrerInfo) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    return await this.program.instruction.placeAndTakePerpOrder(
      orderParams,
      makerOrderId,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  async placeAndMakePerpOrder(orderParams, takerInfo, referrerInfo) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getPlaceAndMakePerpOrderIx(
          orderParams,
          takerInfo,
          referrerInfo
        )
      ),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(orderParams.marketIndex, slot);
    return txSig;
  }
  async getPlaceAndMakePerpOrderIx(orderParams, takerInfo, referrerInfo) {
    orderParams = this.getOrderParams(orderParams, MarketType.PERP);
    const userStatsPublicKey = this.getUserStatsAccountPublicKey();
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), takerInfo.takerUserAccount],
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [orderParams.marketIndex]
    });
    if (referrerInfo) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    const takerOrderId = takerInfo.order.orderId;
    return await this.program.instruction.placeAndMakePerpOrder(
      orderParams,
      takerOrderId,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          taker: takerInfo.taker,
          takerStats: takerInfo.takerStats,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  async placeAndTakeSpotOrder(orderParams, fulfillmentConfig, makerInfo, referrerInfo) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getPlaceAndTakeSpotOrderIx(
          orderParams,
          fulfillmentConfig,
          makerInfo,
          referrerInfo
        )
      ),
      [],
      this.opts
    );
    this.spotMarketLastSlotCache.set(orderParams.marketIndex, slot);
    this.spotMarketLastSlotCache.set(QUOTE_SPOT_MARKET_INDEX, slot);
    return txSig;
  }
  async getPlaceAndTakeSpotOrderIx(orderParams, fulfillmentConfig, makerInfo, referrerInfo) {
    orderParams = this.getOrderParams(orderParams, MarketType.SPOT);
    const userStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const userAccounts = [this.getUserAccount()];
    if (makerInfo !== void 0) {
      userAccounts.push(makerInfo.makerUserAccount);
    }
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts,
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [
        orderParams.marketIndex,
        QUOTE_SPOT_MARKET_INDEX
      ]
    });
    let makerOrderId = null;
    if (makerInfo) {
      makerOrderId = makerInfo.order.orderId;
      remainingAccounts.push({
        pubkey: makerInfo.maker,
        isSigner: false,
        isWritable: true
      });
      remainingAccounts.push({
        pubkey: makerInfo.makerStats,
        isSigner: false,
        isWritable: true
      });
    }
    if (referrerInfo) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    this.addSpotFulfillmentAccounts(
      orderParams.marketIndex,
      remainingAccounts,
      fulfillmentConfig
    );
    return await this.program.instruction.placeAndTakeSpotOrder(
      orderParams,
      fulfillmentConfig ? fulfillmentConfig.fulfillmentType : null,
      makerOrderId,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  async placeAndMakeSpotOrder(orderParams, takerInfo, fulfillmentConfig, referrerInfo) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getPlaceAndMakeSpotOrderIx(
          orderParams,
          takerInfo,
          fulfillmentConfig,
          referrerInfo
        )
      ),
      [],
      this.opts
    );
    this.spotMarketLastSlotCache.set(orderParams.marketIndex, slot);
    this.spotMarketLastSlotCache.set(QUOTE_SPOT_MARKET_INDEX, slot);
    return txSig;
  }
  async getPlaceAndMakeSpotOrderIx(orderParams, takerInfo, fulfillmentConfig, referrerInfo) {
    orderParams = this.getOrderParams(orderParams, MarketType.SPOT);
    const userStatsPublicKey = this.getUserStatsAccountPublicKey();
    const userAccountPublicKey = await this.getUserAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), takerInfo.takerUserAccount],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [
        orderParams.marketIndex,
        QUOTE_SPOT_MARKET_INDEX
      ]
    });
    if (referrerInfo) {
      remainingAccounts.push({
        pubkey: referrerInfo.referrer,
        isWritable: true,
        isSigner: false
      });
      remainingAccounts.push({
        pubkey: referrerInfo.referrerStats,
        isWritable: true,
        isSigner: false
      });
    }
    this.addSpotFulfillmentAccounts(
      orderParams.marketIndex,
      remainingAccounts,
      fulfillmentConfig
    );
    const takerOrderId = takerInfo.order.orderId;
    return await this.program.instruction.placeAndMakeSpotOrder(
      orderParams,
      takerOrderId,
      fulfillmentConfig ? fulfillmentConfig.fulfillmentType : null,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          taker: takerInfo.taker,
          takerStats: takerInfo.takerStats,
          authority: this.wallet.publicKey
        },
        remainingAccounts
      }
    );
  }
  async closePosition(marketIndex, limitPrice) {
    const userPosition = this.getUser().getPerpPosition(marketIndex);
    if (!userPosition) {
      throw Error(`No position in market ${marketIndex.toString()}`);
    }
    return await this.placeAndTakePerpOrder({
      orderType: OrderType.MARKET,
      marketIndex,
      direction: findDirectionToClose(userPosition),
      baseAssetAmount: userPosition.baseAssetAmount.abs(),
      reduceOnly: true,
      price: limitPrice
    });
  }
  async modifyPerpOrder(orderId, newBaseAmount, newLimitPrice, newOraclePriceOffset) {
    if (!newBaseAmount && !newLimitPrice && !newOraclePriceOffset) {
      throw new Error(
        `Must provide newBaseAmount or newLimitPrice or newOraclePriceOffset to modify order`
      );
    }
    const openOrder = this.getUser().getOrder(orderId);
    if (!openOrder) {
      throw new Error(`No open order with id ${orderId.toString()}`);
    }
    const cancelOrderIx = await this.getCancelOrderIx(orderId);
    const newOrderParams = {
      orderType: openOrder.orderType,
      marketType: openOrder.marketType,
      direction: openOrder.direction,
      baseAssetAmount: newBaseAmount || openOrder.baseAssetAmount,
      price: newLimitPrice || openOrder.price,
      marketIndex: openOrder.marketIndex,
      reduceOnly: openOrder.reduceOnly,
      postOnly: openOrder.postOnly,
      immediateOrCancel: openOrder.immediateOrCancel,
      triggerPrice: openOrder.triggerPrice,
      triggerCondition: openOrder.triggerCondition,
      oraclePriceOffset: newOraclePriceOffset || openOrder.oraclePriceOffset,
      auctionDuration: openOrder.auctionDuration,
      maxTs: openOrder.maxTs,
      auctionStartPrice: openOrder.auctionStartPrice,
      auctionEndPrice: openOrder.auctionEndPrice
    };
    const placeOrderIx = await this.getPlacePerpOrderIx(newOrderParams);
    const tx = new Transaction3();
    tx.add(
      ComputeBudgetProgram2.requestUnits({
        units: 1e6,
        additionalFee: 0
      })
    );
    tx.add(cancelOrderIx);
    tx.add(placeOrderIx);
    const { txSig, slot } = await this.txSender.send(tx, [], this.opts);
    this.perpMarketLastSlotCache.set(newOrderParams.marketIndex, slot);
    return txSig;
  }
  async settlePNLs(users, marketIndex) {
    const ixs = [];
    for (const { settleeUserAccountPublicKey, settleeUserAccount } of users) {
      ixs.push(
        await this.settlePNLIx(
          settleeUserAccountPublicKey,
          settleeUserAccount,
          marketIndex
        )
      );
    }
    const tx = new Transaction3().add(
      ComputeBudgetProgram2.requestUnits({
        units: 1e6,
        additionalFee: 0
      })
    ).add(...ixs);
    const { txSig } = await this.txSender.send(tx, [], this.opts);
    return txSig;
  }
  async settlePNL(settleeUserAccountPublicKey, settleeUserAccount, marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.settlePNLIx(
          settleeUserAccountPublicKey,
          settleeUserAccount,
          marketIndex
        )
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async settlePNLIx(settleeUserAccountPublicKey, settleeUserAccount, marketIndex) {
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [settleeUserAccount],
      writablePerpMarketIndexes: [marketIndex],
      writableSpotMarketIndexes: [QUOTE_SPOT_MARKET_INDEX]
    });
    return await this.program.instruction.settlePnl(marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        authority: this.wallet.publicKey,
        user: settleeUserAccountPublicKey,
        spotMarketVault: this.getQuoteSpotMarketAccount().vault
      },
      remainingAccounts
    });
  }
  async liquidatePerp(userAccountPublicKey, userAccount, marketIndex, maxBaseAssetAmount, limitPrice) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getLiquidatePerpIx(
          userAccountPublicKey,
          userAccount,
          marketIndex,
          maxBaseAssetAmount,
          limitPrice
        )
      ),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(marketIndex, slot);
    return txSig;
  }
  async getLiquidatePerpIx(userAccountPublicKey, userAccount, marketIndex, maxBaseAssetAmount, limitPrice) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const liquidatorPublicKey = await this.getUserAccountPublicKey();
    const liquidatorStatsPublicKey = this.getUserStatsAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), userAccount],
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [marketIndex]
    });
    return await this.program.instruction.liquidatePerp(
      marketIndex,
      maxBaseAssetAmount,
      limitPrice != null ? limitPrice : null,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          authority: this.wallet.publicKey,
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          liquidator: liquidatorPublicKey,
          liquidatorStats: liquidatorStatsPublicKey
        },
        remainingAccounts
      }
    );
  }
  async liquidateSpot(userAccountPublicKey, userAccount, assetMarketIndex, liabilityMarketIndex, maxLiabilityTransfer, limitPrice) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getLiquidateSpotIx(
          userAccountPublicKey,
          userAccount,
          assetMarketIndex,
          liabilityMarketIndex,
          maxLiabilityTransfer,
          limitPrice
        )
      ),
      [],
      this.opts
    );
    this.spotMarketLastSlotCache.set(assetMarketIndex, slot);
    this.spotMarketLastSlotCache.set(liabilityMarketIndex, slot);
    return txSig;
  }
  async getLiquidateSpotIx(userAccountPublicKey, userAccount, assetMarketIndex, liabilityMarketIndex, maxLiabilityTransfer, limitPrice) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const liquidatorPublicKey = await this.getUserAccountPublicKey();
    const liquidatorStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), userAccount],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [liabilityMarketIndex, assetMarketIndex]
    });
    return await this.program.instruction.liquidateSpot(
      assetMarketIndex,
      liabilityMarketIndex,
      maxLiabilityTransfer,
      limitPrice || null,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          authority: this.wallet.publicKey,
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          liquidator: liquidatorPublicKey,
          liquidatorStats: liquidatorStatsPublicKey
        },
        remainingAccounts
      }
    );
  }
  async liquidateBorrowForPerpPnl(userAccountPublicKey, userAccount, perpMarketIndex, liabilityMarketIndex, maxLiabilityTransfer, limitPrice) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getLiquidateBorrowForPerpPnlIx(
          userAccountPublicKey,
          userAccount,
          perpMarketIndex,
          liabilityMarketIndex,
          maxLiabilityTransfer,
          limitPrice
        )
      ),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(perpMarketIndex, slot);
    this.spotMarketLastSlotCache.set(liabilityMarketIndex, slot);
    return txSig;
  }
  async getLiquidateBorrowForPerpPnlIx(userAccountPublicKey, userAccount, perpMarketIndex, liabilityMarketIndex, maxLiabilityTransfer, limitPrice) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const liquidatorPublicKey = await this.getUserAccountPublicKey();
    const liquidatorStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), userAccount],
      writablePerpMarketIndexes: [perpMarketIndex],
      writableSpotMarketIndexes: [liabilityMarketIndex]
    });
    return await this.program.instruction.liquidateBorrowForPerpPnl(
      perpMarketIndex,
      liabilityMarketIndex,
      maxLiabilityTransfer,
      limitPrice || null,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          authority: this.wallet.publicKey,
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          liquidator: liquidatorPublicKey,
          liquidatorStats: liquidatorStatsPublicKey
        },
        remainingAccounts
      }
    );
  }
  async liquidatePerpPnlForDeposit(userAccountPublicKey, userAccount, perpMarketIndex, assetMarketIndex, maxPnlTransfer, limitPrice) {
    const { txSig, slot } = await this.txSender.send(
      wrapInTx(
        await this.getLiquidatePerpPnlForDepositIx(
          userAccountPublicKey,
          userAccount,
          perpMarketIndex,
          assetMarketIndex,
          maxPnlTransfer,
          limitPrice
        )
      ),
      [],
      this.opts
    );
    this.perpMarketLastSlotCache.set(perpMarketIndex, slot);
    this.spotMarketLastSlotCache.set(assetMarketIndex, slot);
    return txSig;
  }
  async getLiquidatePerpPnlForDepositIx(userAccountPublicKey, userAccount, perpMarketIndex, assetMarketIndex, maxPnlTransfer, limitPrice) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const liquidatorPublicKey = await this.getUserAccountPublicKey();
    const liquidatorStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), userAccount],
      writablePerpMarketIndexes: [perpMarketIndex],
      writableSpotMarketIndexes: [assetMarketIndex]
    });
    return await this.program.instruction.liquidatePerpPnlForDeposit(
      perpMarketIndex,
      assetMarketIndex,
      maxPnlTransfer,
      limitPrice || null,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          authority: this.wallet.publicKey,
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          liquidator: liquidatorPublicKey,
          liquidatorStats: liquidatorStatsPublicKey
        },
        remainingAccounts
      }
    );
  }
  async resolvePerpBankruptcy(userAccountPublicKey, userAccount, marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getResolvePerpBankruptcyIx(
          userAccountPublicKey,
          userAccount,
          marketIndex
        )
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getResolvePerpBankruptcyIx(userAccountPublicKey, userAccount, marketIndex) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const liquidatorPublicKey = await this.getUserAccountPublicKey();
    const liquidatorStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), userAccount],
      writablePerpMarketIndexes: [marketIndex],
      writableSpotMarketIndexes: [QUOTE_SPOT_MARKET_INDEX]
    });
    const spotMarket = this.getSpotMarketAccount(marketIndex);
    return await this.program.instruction.resolvePerpBankruptcy(
      QUOTE_SPOT_MARKET_INDEX,
      marketIndex,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          authority: this.wallet.publicKey,
          user: userAccountPublicKey,
          userStats: userStatsPublicKey,
          liquidator: liquidatorPublicKey,
          liquidatorStats: liquidatorStatsPublicKey,
          spotMarketVault: spotMarket.vault,
          insuranceFundVault: spotMarket.insuranceFund.vault,
          driftSigner: this.getSignerPublicKey(),
          tokenProgram: TOKEN_PROGRAM_ID2
        },
        remainingAccounts
      }
    );
  }
  async resolveSpotBankruptcy(userAccountPublicKey, userAccount, marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getResolveSpotBankruptcyIx(
          userAccountPublicKey,
          userAccount,
          marketIndex
        )
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getResolveSpotBankruptcyIx(userAccountPublicKey, userAccount, marketIndex) {
    const userStatsPublicKey = getUserStatsAccountPublicKey(
      this.program.programId,
      userAccount.authority
    );
    const liquidatorPublicKey = await this.getUserAccountPublicKey();
    const liquidatorStatsPublicKey = await this.getUserStatsAccountPublicKey();
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount(), userAccount],
      writableSpotMarketIndexes: [marketIndex]
    });
    const spotMarket = this.getSpotMarketAccount(marketIndex);
    return await this.program.instruction.resolveSpotBankruptcy(marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        authority: this.wallet.publicKey,
        user: userAccountPublicKey,
        userStats: userStatsPublicKey,
        liquidatorStats: liquidatorStatsPublicKey,
        liquidator: liquidatorPublicKey,
        spotMarketVault: spotMarket.vault,
        insuranceFundVault: spotMarket.insuranceFund.vault,
        driftSigner: this.getSignerPublicKey(),
        tokenProgram: TOKEN_PROGRAM_ID2
      },
      remainingAccounts
    });
  }
  async updateFundingRate(perpMarketIndex, oracle) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getUpdateFundingRateIx(perpMarketIndex, oracle)),
      [],
      this.opts
    );
    return txSig;
  }
  async getUpdateFundingRateIx(perpMarketIndex, oracle) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    return await this.program.instruction.updateFundingRate(perpMarketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        perpMarket: perpMarketPublicKey,
        oracle
      }
    });
  }
  async settleFundingPayment(userAccountPublicKey) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getSettleFundingPaymentIx(userAccountPublicKey)),
      [],
      this.opts
    );
    return txSig;
  }
  async getSettleFundingPaymentIx(userAccountPublicKey) {
    const userAccount = await this.program.account.user.fetch(
      userAccountPublicKey
    );
    const writablePerpMarketIndexes = [];
    for (const position of userAccount.perpPositions) {
      if (!positionIsAvailable(position)) {
        writablePerpMarketIndexes.push(position.marketIndex);
      }
    }
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [userAccount],
      writablePerpMarketIndexes
    });
    return await this.program.instruction.settleFundingPayment({
      accounts: {
        state: await this.getStatePublicKey(),
        user: userAccountPublicKey
      },
      remainingAccounts
    });
  }
  triggerEvent(eventName, data) {
    this.eventEmitter.emit(eventName, data);
  }
  getOracleDataForPerpMarket(marketIndex) {
    const oracleKey = this.getPerpMarketAccount(marketIndex).amm.oracle;
    const oracleData = this.getOraclePriceDataAndSlot(oracleKey).data;
    return oracleData;
  }
  getOracleDataForSpotMarket(marketIndex) {
    const oracleKey = this.getSpotMarketAccount(marketIndex).oracle;
    const oracleData = this.getOraclePriceDataAndSlot(oracleKey).data;
    return oracleData;
  }
  async initializeInsuranceFundStake(marketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(await this.getInitializeInsuranceFundStakeIx(marketIndex)),
      [],
      this.opts
    );
    return txSig;
  }
  async getInitializeInsuranceFundStakeIx(marketIndex) {
    const ifStakeAccountPublicKey = getInsuranceFundStakeAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      marketIndex
    );
    return await this.program.instruction.initializeInsuranceFundStake(
      marketIndex,
      {
        accounts: {
          insuranceFundStake: ifStakeAccountPublicKey,
          spotMarket: this.getSpotMarketAccount(marketIndex).pubkey,
          userStats: this.getUserStatsAccountPublicKey(),
          authority: this.wallet.publicKey,
          payer: this.wallet.publicKey,
          rent: anchor3.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor3.web3.SystemProgram.programId,
          state: await this.getStatePublicKey()
        }
      }
    );
  }
  async addInsuranceFundStake(marketIndex, amount, collateralAccountPublicKey) {
    const spotMarket = this.getSpotMarketAccount(marketIndex);
    const ifStakeAccountPublicKey = getInsuranceFundStakeAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      marketIndex
    );
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [marketIndex]
    });
    return await this.program.rpc.addInsuranceFundStake(marketIndex, amount, {
      accounts: {
        state: await this.getStatePublicKey(),
        spotMarket: spotMarket.pubkey,
        insuranceFundStake: ifStakeAccountPublicKey,
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey,
        spotMarketVault: spotMarket.vault,
        insuranceFundVault: spotMarket.insuranceFund.vault,
        driftSigner: this.getSignerPublicKey(),
        userTokenAccount: collateralAccountPublicKey,
        tokenProgram: TOKEN_PROGRAM_ID2
      },
      remainingAccounts
    });
  }
  async requestRemoveInsuranceFundStake(marketIndex, amount) {
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    const ifStakeAccountPublicKey = getInsuranceFundStakeAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      marketIndex
    );
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [marketIndex]
    });
    return await this.program.rpc.requestRemoveInsuranceFundStake(
      marketIndex,
      amount,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          spotMarket: spotMarketAccount.pubkey,
          insuranceFundStake: ifStakeAccountPublicKey,
          userStats: this.getUserStatsAccountPublicKey(),
          authority: this.wallet.publicKey,
          insuranceFundVault: spotMarketAccount.insuranceFund.vault
        },
        remainingAccounts
      }
    );
  }
  async cancelRequestRemoveInsuranceFundStake(marketIndex) {
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    const ifStakeAccountPublicKey = getInsuranceFundStakeAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      marketIndex
    );
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [marketIndex]
    });
    return await this.program.rpc.cancelRequestRemoveInsuranceFundStake(
      marketIndex,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          spotMarket: spotMarketAccount.pubkey,
          insuranceFundStake: ifStakeAccountPublicKey,
          userStats: this.getUserStatsAccountPublicKey(),
          authority: this.wallet.publicKey,
          insuranceFundVault: spotMarketAccount.insuranceFund.vault
        },
        remainingAccounts
      }
    );
  }
  async removeInsuranceFundStake(marketIndex, collateralAccountPublicKey) {
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    const ifStakeAccountPublicKey = getInsuranceFundStakeAccountPublicKey(
      this.program.programId,
      this.wallet.publicKey,
      marketIndex
    );
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [marketIndex]
    });
    return await this.program.rpc.removeInsuranceFundStake(marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        spotMarket: spotMarketAccount.pubkey,
        insuranceFundStake: ifStakeAccountPublicKey,
        userStats: this.getUserStatsAccountPublicKey(),
        authority: this.wallet.publicKey,
        insuranceFundVault: spotMarketAccount.insuranceFund.vault,
        driftSigner: this.getSignerPublicKey(),
        userTokenAccount: collateralAccountPublicKey,
        tokenProgram: TOKEN_PROGRAM_ID2
      },
      remainingAccounts
    });
  }
  async settleRevenueToInsuranceFund(marketIndex) {
    const spotMarketAccount = this.getSpotMarketAccount(marketIndex);
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writableSpotMarketIndexes: [marketIndex]
    });
    return await this.program.rpc.settleRevenueToInsuranceFund(marketIndex, {
      accounts: {
        state: await this.getStatePublicKey(),
        spotMarket: spotMarketAccount.pubkey,
        spotMarketVault: spotMarketAccount.vault,
        driftSigner: this.getSignerPublicKey(),
        insuranceFundVault: spotMarketAccount.insuranceFund.vault,
        tokenProgram: TOKEN_PROGRAM_ID2
      },
      remainingAccounts
    });
  }
  async resolvePerpPnlDeficit(spotMarketIndex, perpMarketIndex) {
    const { txSig } = await this.txSender.send(
      wrapInTx(
        await this.getResolvePerpPnlDeficitIx(spotMarketIndex, perpMarketIndex)
      ),
      [],
      this.opts
    );
    return txSig;
  }
  async getResolvePerpPnlDeficitIx(spotMarketIndex, perpMarketIndex) {
    const remainingAccounts = this.getRemainingAccounts({
      userAccounts: [this.getUserAccount()],
      useMarketLastSlotCache: true,
      writablePerpMarketIndexes: [perpMarketIndex],
      writableSpotMarketIndexes: [spotMarketIndex]
    });
    const spotMarket = this.getSpotMarketAccount(spotMarketIndex);
    return await this.program.instruction.resolvePerpPnlDeficit(
      spotMarketIndex,
      perpMarketIndex,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          authority: this.wallet.publicKey,
          spotMarketVault: spotMarket.vault,
          insuranceFundVault: spotMarket.insuranceFund.vault,
          driftSigner: this.getSignerPublicKey(),
          tokenProgram: TOKEN_PROGRAM_ID2
        },
        remainingAccounts
      }
    );
  }
};

// src/math/trade.ts
import { BN as BN13 } from "@project-serum/anchor";
var MAXPCT = new BN13(1e3);
function calculateTradeSlippage(direction, amount, market, inputAssetType = "quote", oraclePriceData, useSpread = true) {
  let oldPrice;
  if (useSpread && market.amm.baseSpread > 0) {
    if (isVariant(direction, "long")) {
      oldPrice = calculateAskPrice(market, oraclePriceData);
    } else {
      oldPrice = calculateBidPrice(market, oraclePriceData);
    }
  } else {
    oldPrice = calculateReservePrice(market, oraclePriceData);
  }
  if (amount.eq(ZERO)) {
    return [ZERO, ZERO, oldPrice, oldPrice];
  }
  const [acquiredBaseReserve, acquiredQuoteReserve, acquiredQuoteAssetAmount] = calculateTradeAcquiredAmounts(
    direction,
    amount,
    market,
    inputAssetType,
    oraclePriceData,
    useSpread
  );
  const entryPrice = acquiredQuoteAssetAmount.mul(AMM_TO_QUOTE_PRECISION_RATIO).mul(PRICE_PRECISION).div(acquiredBaseReserve.abs());
  let amm;
  if (useSpread && market.amm.baseSpread > 0) {
    const { baseAssetReserve, quoteAssetReserve, sqrtK, newPeg } = calculateUpdatedAMMSpreadReserves(market.amm, direction, oraclePriceData);
    amm = {
      baseAssetReserve,
      quoteAssetReserve,
      sqrtK,
      pegMultiplier: newPeg
    };
  } else {
    amm = market.amm;
  }
  const newPrice = calculatePrice(
    amm.baseAssetReserve.sub(acquiredBaseReserve),
    amm.quoteAssetReserve.sub(acquiredQuoteReserve),
    amm.pegMultiplier
  );
  if (direction == PositionDirection.SHORT) {
    assert(newPrice.lte(oldPrice));
  } else {
    assert(oldPrice.lte(newPrice));
  }
  const pctMaxSlippage = newPrice.sub(oldPrice).mul(PRICE_PRECISION).div(oldPrice).abs();
  const pctAvgSlippage = entryPrice.sub(oldPrice).mul(PRICE_PRECISION).div(oldPrice).abs();
  return [pctAvgSlippage, pctMaxSlippage, entryPrice, newPrice];
}
function calculateTradeAcquiredAmounts(direction, amount, market, inputAssetType = "quote", oraclePriceData, useSpread = true) {
  if (amount.eq(ZERO)) {
    return [ZERO, ZERO, ZERO];
  }
  const swapDirection = getSwapDirection(inputAssetType, direction);
  let amm;
  if (useSpread && market.amm.baseSpread > 0) {
    const { baseAssetReserve, quoteAssetReserve, sqrtK, newPeg } = calculateUpdatedAMMSpreadReserves(market.amm, direction, oraclePriceData);
    amm = {
      baseAssetReserve,
      quoteAssetReserve,
      sqrtK,
      pegMultiplier: newPeg
    };
  } else {
    amm = market.amm;
  }
  const [newQuoteAssetReserve, newBaseAssetReserve] = calculateAmmReservesAfterSwap(amm, inputAssetType, amount, swapDirection);
  const acquiredBase = amm.baseAssetReserve.sub(newBaseAssetReserve);
  const acquiredQuote = amm.quoteAssetReserve.sub(newQuoteAssetReserve);
  const acquiredQuoteAssetAmount = calculateQuoteAssetAmountSwapped(
    acquiredQuote.abs(),
    amm.pegMultiplier,
    swapDirection
  );
  return [acquiredBase, acquiredQuote, acquiredQuoteAssetAmount];
}
function calculateTargetPriceTrade(market, targetPrice, pct = MAXPCT, outputAssetType = "quote", oraclePriceData, useSpread = true) {
  assert(market.amm.baseAssetReserve.gt(ZERO));
  assert(targetPrice.gt(ZERO));
  assert(pct.lte(MAXPCT) && pct.gt(ZERO));
  const reservePriceBefore = calculateReservePrice(market, oraclePriceData);
  const bidPriceBefore = calculateBidPrice(market, oraclePriceData);
  const askPriceBefore = calculateAskPrice(market, oraclePriceData);
  let direction;
  if (targetPrice.gt(reservePriceBefore)) {
    const priceGap = targetPrice.sub(reservePriceBefore);
    const priceGapScaled = priceGap.mul(pct).div(MAXPCT);
    targetPrice = reservePriceBefore.add(priceGapScaled);
    direction = PositionDirection.LONG;
  } else {
    const priceGap = reservePriceBefore.sub(targetPrice);
    const priceGapScaled = priceGap.mul(pct).div(MAXPCT);
    targetPrice = reservePriceBefore.sub(priceGapScaled);
    direction = PositionDirection.SHORT;
  }
  let tradeSize;
  let baseSize;
  let baseAssetReserveBefore;
  let quoteAssetReserveBefore;
  let peg = market.amm.pegMultiplier;
  if (useSpread && market.amm.baseSpread > 0) {
    const { baseAssetReserve, quoteAssetReserve, newPeg } = calculateUpdatedAMMSpreadReserves(market.amm, direction, oraclePriceData);
    baseAssetReserveBefore = baseAssetReserve;
    quoteAssetReserveBefore = quoteAssetReserve;
    peg = newPeg;
  } else {
    baseAssetReserveBefore = market.amm.baseAssetReserve;
    quoteAssetReserveBefore = market.amm.quoteAssetReserve;
  }
  const invariant = market.amm.sqrtK.mul(market.amm.sqrtK);
  const k = invariant.mul(PRICE_PRECISION);
  let baseAssetReserveAfter;
  let quoteAssetReserveAfter;
  const biasModifier = new BN13(1);
  let markPriceAfter;
  if (useSpread && targetPrice.lt(askPriceBefore) && targetPrice.gt(bidPriceBefore)) {
    if (reservePriceBefore.gt(targetPrice)) {
      direction = PositionDirection.SHORT;
    } else {
      direction = PositionDirection.LONG;
    }
    tradeSize = ZERO;
    return [direction, tradeSize, targetPrice, targetPrice];
  } else if (reservePriceBefore.gt(targetPrice)) {
    baseAssetReserveAfter = squareRootBN(
      k.div(targetPrice).mul(peg).div(PEG_PRECISION).sub(biasModifier)
    ).sub(new BN13(1));
    quoteAssetReserveAfter = k.div(PRICE_PRECISION).div(baseAssetReserveAfter);
    markPriceAfter = calculatePrice(
      baseAssetReserveAfter,
      quoteAssetReserveAfter,
      peg
    );
    direction = PositionDirection.SHORT;
    tradeSize = quoteAssetReserveBefore.sub(quoteAssetReserveAfter).mul(peg).div(PEG_PRECISION).div(AMM_TO_QUOTE_PRECISION_RATIO);
    baseSize = baseAssetReserveAfter.sub(baseAssetReserveBefore);
  } else if (reservePriceBefore.lt(targetPrice)) {
    baseAssetReserveAfter = squareRootBN(
      k.div(targetPrice).mul(peg).div(PEG_PRECISION).add(biasModifier)
    ).add(new BN13(1));
    quoteAssetReserveAfter = k.div(PRICE_PRECISION).div(baseAssetReserveAfter);
    markPriceAfter = calculatePrice(
      baseAssetReserveAfter,
      quoteAssetReserveAfter,
      peg
    );
    direction = PositionDirection.LONG;
    tradeSize = quoteAssetReserveAfter.sub(quoteAssetReserveBefore).mul(peg).div(PEG_PRECISION).div(AMM_TO_QUOTE_PRECISION_RATIO);
    baseSize = baseAssetReserveBefore.sub(baseAssetReserveAfter);
  } else {
    direction = PositionDirection.LONG;
    tradeSize = ZERO;
    return [direction, tradeSize, targetPrice, targetPrice];
  }
  let tp1 = targetPrice;
  let tp2 = markPriceAfter;
  let originalDiff = targetPrice.sub(reservePriceBefore);
  if (direction == PositionDirection.SHORT) {
    tp1 = markPriceAfter;
    tp2 = targetPrice;
    originalDiff = reservePriceBefore.sub(targetPrice);
  }
  const entryPrice = tradeSize.mul(AMM_TO_QUOTE_PRECISION_RATIO).mul(PRICE_PRECISION).div(baseSize.abs());
  assert(tp1.sub(tp2).lte(originalDiff), "Target Price Calculation incorrect");
  assert(
    tp2.lte(tp1) || tp2.sub(tp1).abs() < 1e5,
    "Target Price Calculation incorrect" + tp2.toString() + ">=" + tp1.toString() + "err: " + tp2.sub(tp1).abs().toString()
  );
  if (outputAssetType == "quote") {
    return [direction, tradeSize, entryPrice, targetPrice];
  } else {
    return [direction, baseSize, entryPrice, targetPrice];
  }
}

// src/adminClient.ts
var AdminClient = class extends DriftClient {
  async initialize(usdcMint, _adminControlsPrices) {
    const stateAccountRPCResponse = await this.connection.getParsedAccountInfo(
      await this.getStatePublicKey()
    );
    if (stateAccountRPCResponse.value !== null) {
      throw new Error("Clearing house already initialized");
    }
    const [driftStatePublicKey] = await getDriftStateAccountPublicKeyAndNonce(
      this.program.programId
    );
    const initializeTx = await this.program.transaction.initialize({
      accounts: {
        admin: this.wallet.publicKey,
        state: driftStatePublicKey,
        quoteAssetMint: usdcMint,
        rent: SYSVAR_RENT_PUBKEY2,
        driftSigner: this.getSignerPublicKey(),
        systemProgram: anchor4.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID3
      }
    });
    const { txSig: initializeTxSig } = await this.txSender.send(
      initializeTx,
      [],
      this.opts
    );
    return [initializeTxSig];
  }
  async initializeSpotMarket(mint, optimalUtilization, optimalRate, maxRate, oracle, oracleSource, initialAssetWeight, maintenanceAssetWeight, initialLiabilityWeight, maintenanceLiabilityWeight, imfFactor = 0, liquidatorFee = 0, activeStatus = true, name = DEFAULT_MARKET_NAME) {
    const spotMarketIndex = this.getStateAccount().numberOfSpotMarkets;
    const spotMarket = await getSpotMarketPublicKey(
      this.program.programId,
      spotMarketIndex
    );
    const spotMarketVault = await getSpotMarketVaultPublicKey(
      this.program.programId,
      spotMarketIndex
    );
    const insuranceFundVault = await getInsuranceFundVaultPublicKey(
      this.program.programId,
      spotMarketIndex
    );
    const nameBuffer = encodeName(name);
    const initializeTx = await this.program.transaction.initializeSpotMarket(
      optimalUtilization,
      optimalRate,
      maxRate,
      oracleSource,
      initialAssetWeight,
      maintenanceAssetWeight,
      initialLiabilityWeight,
      maintenanceLiabilityWeight,
      imfFactor,
      liquidatorFee,
      activeStatus,
      nameBuffer,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket,
          spotMarketVault,
          insuranceFundVault,
          driftSigner: this.getSignerPublicKey(),
          spotMarketMint: mint,
          oracle,
          rent: SYSVAR_RENT_PUBKEY2,
          systemProgram: anchor4.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID3
        }
      }
    );
    const { txSig } = await this.txSender.send(initializeTx, [], this.opts);
    await this.accountSubscriber.addSpotMarket(spotMarketIndex);
    await this.accountSubscriber.addOracle({
      source: oracleSource,
      publicKey: oracle
    });
    return txSig;
  }
  async initializeSerumFulfillmentConfig(marketIndex, serumMarket, serumProgram) {
    const serumOpenOrders = getSerumOpenOrdersPublicKey(
      this.program.programId,
      serumMarket
    );
    const serumFulfillmentConfig = getSerumFulfillmentConfigPublicKey(
      this.program.programId,
      serumMarket
    );
    return await this.program.rpc.initializeSerumFulfillmentConfig(
      marketIndex,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          baseSpotMarket: this.getSpotMarketAccount(marketIndex).pubkey,
          quoteSpotMarket: this.getQuoteSpotMarketAccount().pubkey,
          driftSigner: this.getSignerPublicKey(),
          serumProgram,
          serumMarket,
          serumOpenOrders,
          rent: SYSVAR_RENT_PUBKEY2,
          systemProgram: anchor4.web3.SystemProgram.programId,
          serumFulfillmentConfig
        }
      }
    );
  }
  async initializePerpMarket(priceOracle, baseAssetReserve, quoteAssetReserve, periodicity, pegMultiplier = PEG_PRECISION, oracleSource = OracleSource.PYTH, marginRatioInitial = 2e3, marginRatioMaintenance = 500, liquidatorFee = 0, activeStatus = true, name = DEFAULT_MARKET_NAME) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      this.getStateAccount().numberOfMarkets
    );
    const nameBuffer = encodeName(name);
    const initializeMarketTx = await this.program.transaction.initializePerpMarket(
      baseAssetReserve,
      quoteAssetReserve,
      periodicity,
      pegMultiplier,
      oracleSource,
      marginRatioInitial,
      marginRatioMaintenance,
      liquidatorFee,
      activeStatus,
      nameBuffer,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          admin: this.wallet.publicKey,
          oracle: priceOracle,
          perpMarket: perpMarketPublicKey,
          rent: SYSVAR_RENT_PUBKEY2,
          systemProgram: anchor4.web3.SystemProgram.programId
        }
      }
    );
    const { txSig } = await this.txSender.send(
      initializeMarketTx,
      [],
      this.opts
    );
    await this.accountSubscriber.addPerpMarket(
      this.getStateAccount().numberOfMarkets
    );
    await this.accountSubscriber.addOracle({
      source: oracleSource,
      publicKey: priceOracle
    });
    return txSig;
  }
  async moveAmmPrice(perpMarketIndex, baseAssetReserve, quoteAssetReserve, sqrtK) {
    const marketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    if (sqrtK == void 0) {
      sqrtK = squareRootBN(baseAssetReserve.mul(quoteAssetReserve));
    }
    return await this.program.rpc.moveAmmPrice(
      baseAssetReserve,
      quoteAssetReserve,
      sqrtK,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          admin: this.wallet.publicKey,
          perpMarket: marketPublicKey
        }
      }
    );
  }
  async updateK(perpMarketIndex, sqrtK) {
    return await this.program.rpc.updateK(sqrtK, {
      accounts: {
        state: await this.getStatePublicKey(),
        admin: this.wallet.publicKey,
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        ),
        oracle: this.getPerpMarketAccount(perpMarketIndex).amm.oracle
      }
    });
  }
  async updatePerpMarketConcentrationScale(perpMarketIndex, concentrationScale) {
    return await this.program.rpc.updatePerpMarketConcentrationCoef(
      concentrationScale,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          admin: this.wallet.publicKey,
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async moveAmmToPrice(perpMarketIndex, targetPrice) {
    const perpMarket = this.getPerpMarketAccount(perpMarketIndex);
    const [direction, tradeSize, _] = calculateTargetPriceTrade(
      perpMarket,
      targetPrice,
      new BN14(1e3),
      "quote",
      void 0
    );
    const [newQuoteAssetAmount, newBaseAssetAmount] = calculateAmmReservesAfterSwap(
      perpMarket.amm,
      "quote",
      tradeSize,
      getSwapDirection("quote", direction)
    );
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    return await this.program.rpc.moveAmmPrice(
      newBaseAssetAmount,
      newQuoteAssetAmount,
      perpMarket.amm.sqrtK,
      {
        accounts: {
          state: await this.getStatePublicKey(),
          admin: this.wallet.publicKey,
          perpMarket: perpMarketPublicKey
        }
      }
    );
  }
  async repegAmmCurve(newPeg, perpMarketIndex) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    const ammData = this.getPerpMarketAccount(perpMarketIndex).amm;
    return await this.program.rpc.repegAmmCurve(newPeg, {
      accounts: {
        state: await this.getStatePublicKey(),
        admin: this.wallet.publicKey,
        oracle: ammData.oracle,
        perpMarket: perpMarketPublicKey
      }
    });
  }
  async updatePerpMarketAmmOracleTwap(perpMarketIndex) {
    const ammData = this.getPerpMarketAccount(perpMarketIndex).amm;
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    return await this.program.rpc.updatePerpMarketAmmOracleTwap({
      accounts: {
        state: await this.getStatePublicKey(),
        admin: this.wallet.publicKey,
        oracle: ammData.oracle,
        perpMarket: perpMarketPublicKey
      }
    });
  }
  async resetPerpMarketAmmOracleTwap(perpMarketIndex) {
    const ammData = this.getPerpMarketAccount(perpMarketIndex).amm;
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    return await this.program.rpc.resetPerpMarketAmmOracleTwap({
      accounts: {
        state: await this.getStatePublicKey(),
        admin: this.wallet.publicKey,
        oracle: ammData.oracle,
        perpMarket: perpMarketPublicKey
      }
    });
  }
  async depositIntoPerpMarketFeePool(perpMarketIndex, amount, sourceVault) {
    const spotMarket = this.getQuoteSpotMarketAccount();
    return await this.program.rpc.depositIntoPerpMarketFeePool(amount, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        ),
        sourceVault,
        driftSigner: this.getSignerPublicKey(),
        quoteSpotMarket: spotMarket.pubkey,
        spotMarketVault: spotMarket.vault,
        tokenProgram: TOKEN_PROGRAM_ID3
      }
    });
  }
  async updateAdmin(admin) {
    return await this.program.rpc.updateAdmin(admin, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updatePerpMarketCurveUpdateIntensity(perpMarketIndex, curveUpdateIntensity) {
    return await this.program.rpc.updatePerpMarketCurveUpdateIntensity(
      curveUpdateIntensity,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updatePerpMarketMarginRatio(perpMarketIndex, marginRatioInitial, marginRatioMaintenance) {
    return await this.program.rpc.updatePerpMarketMarginRatio(
      marginRatioInitial,
      marginRatioMaintenance,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updatePerpMarketImfFactor(perpMarketIndex, imfFactor, unrealizedPnlImfFactor) {
    return await this.program.rpc.updatePerpMarketImfFactor(
      imfFactor,
      unrealizedPnlImfFactor,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updatePerpMarketBaseSpread(perpMarketIndex, baseSpread) {
    return await this.program.rpc.updatePerpMarketBaseSpread(baseSpread, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updateAmmJitIntensity(perpMarketIndex, ammJitIntensity) {
    return await this.program.rpc.updateAmmJitIntensity(ammJitIntensity, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updatePerpMarketName(perpMarketIndex, name) {
    const nameBuffer = encodeName(name);
    return await this.program.rpc.updatePerpMarketName(nameBuffer, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updateSpotMarketName(spotMarketIndex, name) {
    const nameBuffer = encodeName(name);
    return await this.program.rpc.updateSpotMarketName(nameBuffer, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        )
      }
    });
  }
  async updatePerpMarketMaxSpread(perpMarketIndex, maxSpread) {
    const perpMarketPublicKey = await getPerpMarketPublicKey(
      this.program.programId,
      perpMarketIndex
    );
    return await this.program.rpc.updatePerpMarketMaxSpread(maxSpread, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: perpMarketPublicKey
      }
    });
  }
  async updatePerpFeeStructure(feeStructure) {
    return await this.program.rpc.updatePerpFeeStructure(feeStructure, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updateSpotFeeStructure(feeStructure) {
    return await this.program.rpc.updateSpotFeeStructure(feeStructure, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updateInitialPctToLiquidate(initialPctToLiquidate) {
    return await this.program.rpc.updateInitialPctToLiquidate(
      initialPctToLiquidate,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey()
        }
      }
    );
  }
  async updateLiquidationDuration(liquidationDuration) {
    return await this.program.rpc.updateLiquidationDuration(
      liquidationDuration,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey()
        }
      }
    );
  }
  async updateOracleGuardRails(oracleGuardRails) {
    return await this.program.rpc.updateOracleGuardRails(oracleGuardRails, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updateStateSettlementDuration(settlementDuration) {
    return await this.program.rpc.updateStateSettlementDuration(
      settlementDuration,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey()
        }
      }
    );
  }
  async updateWithdrawGuardThreshold(spotMarketIndex, withdrawGuardThreshold) {
    return await this.program.rpc.updateWithdrawGuardThreshold(
      withdrawGuardThreshold,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketIfFactor(spotMarketIndex, userIfFactor, totalIfFactor) {
    return await this.program.rpc.updateSpotMarketIfFactor(
      spotMarketIndex,
      userIfFactor,
      totalIfFactor,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketRevenueSettlePeriod(spotMarketIndex, revenueSettlePeriod) {
    return await this.program.rpc.updateSpotMarketRevenueSettlePeriod(
      revenueSettlePeriod,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketMaxTokenDeposits(spotMarketIndex, maxTokenDeposits) {
    return await this.program.rpc.updateSpotMarketMaxTokenDeposits(
      maxTokenDeposits,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateInsuranceFundUnstakingPeriod(spotMarketIndex, insuranceWithdrawEscrowPeriod) {
    return await this.program.rpc.updateInsuranceFundUnstakingPeriod(
      insuranceWithdrawEscrowPeriod,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateLpCooldownTime(cooldownTime) {
    return await this.program.rpc.updateLpCooldownTime(cooldownTime, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updatePerpMarketOracle(perpMarketIndex, oracle, oracleSource) {
    return await this.program.rpc.updatePerpMarketOracle(oracle, oracleSource, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        ),
        oracle
      }
    });
  }
  async updatePerpMarketStepSizeAndTickSize(perpMarketIndex, stepSize, tickSize) {
    return await this.program.rpc.updatePerpMarketStepSizeAndTickSize(
      stepSize,
      tickSize,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updatePerpMarketMinOrderSize(perpMarketIndex, orderSize) {
    return await this.program.rpc.updatePerpMarketMinOrderSize(orderSize, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updateSpotMarketStepSizeAndTickSize(spotMarketIndex, stepSize, tickSize) {
    return await this.program.rpc.updateSpotMarketStepSizeAndTickSize(
      stepSize,
      tickSize,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketMinOrderSize(spotMarketIndex, orderSize) {
    return await this.program.rpc.updateSpotMarketMinOrderSize(orderSize, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        )
      }
    });
  }
  async updatePerpMarketExpiry(perpMarketIndex, expiryTs) {
    return await this.program.rpc.updatePerpMarketExpiry(expiryTs, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updateSpotMarketOracle(spotMarketIndex, oracle, oracleSource) {
    return await this.program.rpc.updateSpotMarketOracle(oracle, oracleSource, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        ),
        oracle
      }
    });
  }
  async updateSpotMarketOrdersEnabled(spotMarketIndex, ordersEnabled) {
    return await this.program.rpc.updateSpotMarketOrdersEnabled(ordersEnabled, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        )
      }
    });
  }
  async updateSerumFulfillmentConfigStatus(serumFulfillmentConfig, status) {
    return await this.program.rpc.updateSerumFulfillmentConfigStatus(status, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        serumFulfillmentConfig
      }
    });
  }
  async updateSpotMarketExpiry(spotMarketIndex, expiryTs) {
    return await this.program.rpc.updateSpotMarketExpiry(expiryTs, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        )
      }
    });
  }
  async updateWhitelistMint(whitelistMint) {
    return await this.program.rpc.updateWhitelistMint(whitelistMint, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updateDiscountMint(discountMint) {
    return await this.program.rpc.updateDiscountMint(discountMint, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updateSpotMarketMarginWeights(spotMarketIndex, initialAssetWeight, maintenanceAssetWeight, initialLiabilityWeight, maintenanceLiabilityWeight, imfFactor = 0) {
    return await this.program.rpc.updateSpotMarketMarginWeights(
      initialAssetWeight,
      maintenanceAssetWeight,
      initialLiabilityWeight,
      maintenanceLiabilityWeight,
      imfFactor,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketBorrowRate(spotMarketIndex, optimalUtilization, optimalBorrowRate, optimalMaxRate) {
    return await this.program.rpc.updateSpotMarketBorrowRate(
      optimalUtilization,
      optimalBorrowRate,
      optimalMaxRate,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketAssetTier(spotMarketIndex, assetTier) {
    return await this.program.rpc.updateSpotMarketAssetTier(assetTier, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        )
      }
    });
  }
  async updateSpotMarketStatus(spotMarketIndex, marketStatus) {
    return await this.program.rpc.updateSpotMarketStatus(marketStatus, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        spotMarket: await getSpotMarketPublicKey(
          this.program.programId,
          spotMarketIndex
        )
      }
    });
  }
  async updatePerpMarketStatus(perpMarketIndex, marketStatus) {
    return await this.program.rpc.updatePerpMarketStatus(marketStatus, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updatePerpMarketContractTier(perpMarketIndex, contractTier) {
    return await this.program.rpc.updatePerpMarketContractTier(contractTier, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: await getPerpMarketPublicKey(
          this.program.programId,
          perpMarketIndex
        )
      }
    });
  }
  async updateExchangeStatus(exchangeStatus) {
    return await this.program.rpc.updateExchangeStatus(exchangeStatus, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey()
      }
    });
  }
  async updatePerpAuctionDuration(minDuration) {
    return await this.program.rpc.updatePerpAuctionDuration(
      typeof minDuration === "number" ? minDuration : minDuration.toNumber(),
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey()
        }
      }
    );
  }
  async updateSpotAuctionDuration(defaultAuctionDuration) {
    return await this.program.rpc.updateSpotAuctionDuration(
      defaultAuctionDuration,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey()
        }
      }
    );
  }
  async updatePerpMarketMaxFillReserveFraction(perpMarketIndex, maxBaseAssetAmountRatio) {
    return await this.program.rpc.updatePerpMarketMaxFillReserveFraction(
      maxBaseAssetAmountRatio,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updateMaxSlippageRatio(perpMarketIndex, maxSlippageRatio) {
    return await this.program.rpc.updateMaxSlippageRatio(maxSlippageRatio, {
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        perpMarket: this.getPerpMarketAccount(perpMarketIndex).pubkey
      }
    });
  }
  async updatePerpMarketUnrealizedAssetWeight(perpMarketIndex, unrealizedInitialAssetWeight, unrealizedMaintenanceAssetWeight) {
    return await this.program.rpc.updatePerpMarketUnrealizedAssetWeight(
      unrealizedInitialAssetWeight,
      unrealizedMaintenanceAssetWeight,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updatePerpMarketMaxImbalances(perpMarketIndex, unrealizedMaxImbalance, maxRevenueWithdrawPerPeriod, quoteMaxInsurance) {
    return await this.program.rpc.updatePerpMarketMaxImbalances(
      unrealizedMaxImbalance,
      maxRevenueWithdrawPerPeriod,
      quoteMaxInsurance,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updatePerpMarketMaxOpenInterest(perpMarketIndex, maxOpenInterest) {
    return await this.program.rpc.updatePerpMarketMaxOpenInterest(
      maxOpenInterest,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updateSerumVault(srmVault) {
    return await this.program.rpc.updateSerumVault({
      accounts: {
        admin: this.wallet.publicKey,
        state: await this.getStatePublicKey(),
        srmVault
      }
    });
  }
  async updatePerpMarketLiquidationFee(perpMarketIndex, liquidatorFee, ifLiquidationFee) {
    return await this.program.rpc.updatePerpMarketLiquidationFee(
      liquidatorFee,
      ifLiquidationFee,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          perpMarket: await getPerpMarketPublicKey(
            this.program.programId,
            perpMarketIndex
          )
        }
      }
    );
  }
  async updateSpotMarketLiquidationFee(spotMarketIndex, liquidatorFee, ifLiquidationFee) {
    return await this.program.rpc.updateSpotMarketLiquidationFee(
      liquidatorFee,
      ifLiquidationFee,
      {
        accounts: {
          admin: this.wallet.publicKey,
          state: await this.getStatePublicKey(),
          spotMarket: await getSpotMarketPublicKey(
            this.program.programId,
            spotMarketIndex
          )
        }
      }
    );
  }
};

// src/factory/bigNum.ts
import { BN as BN15 } from "@project-serum/anchor";
var _BigNum = class {
  constructor(val, precisionVal = new BN15(0)) {
    this.toString = (base, length) => this.val.toString(base, length);
    this.val = new BN15(val);
    this.precision = new BN15(precisionVal);
  }
  static setLocale(locale) {
    _BigNum.delim = 1.1 .toLocaleString(locale).slice(1, 2) || ".";
    _BigNum.spacer = 1e3 .toLocaleString(locale).slice(1, 2) || ",";
  }
  bigNumFromParam(bn) {
    return BN15.isBN(bn) ? _BigNum.from(bn) : bn;
  }
  add(bn) {
    assert(bn.precision.eq(this.precision), "Adding unequal precisions");
    return _BigNum.from(this.val.add(bn.val), this.precision);
  }
  sub(bn) {
    assert(bn.precision.eq(this.precision), "Subtracting unequal precisions");
    return _BigNum.from(this.val.sub(bn.val), this.precision);
  }
  mul(bn) {
    const mulVal = this.bigNumFromParam(bn);
    return _BigNum.from(
      this.val.mul(mulVal.val),
      this.precision.add(mulVal.precision)
    );
  }
  scalarMul(bn) {
    if (BN15.isBN(bn))
      return _BigNum.from(this.val.mul(bn), this.precision);
    return _BigNum.from(
      this.val.mul(bn.val),
      this.precision.add(bn.precision)
    ).shift(bn.precision.neg());
  }
  div(bn) {
    if (BN15.isBN(bn))
      return _BigNum.from(this.val.div(bn), this.precision);
    return _BigNum.from(this.val.div(bn.val), this.precision.sub(bn.precision));
  }
  shift(exponent, skipAdjustingPrecision = false) {
    const shiftVal = typeof exponent === "number" ? new BN15(exponent) : exponent;
    return _BigNum.from(
      shiftVal.isNeg() ? this.val.div(new BN15(10).pow(shiftVal)) : this.val.mul(new BN15(10).pow(shiftVal)),
      skipAdjustingPrecision ? this.precision : this.precision.add(shiftVal)
    );
  }
  shiftTo(targetPrecision) {
    return this.shift(targetPrecision.sub(this.precision));
  }
  scale(numerator, denominator) {
    return this.mul(_BigNum.from(new BN15(numerator))).div(new BN15(denominator));
  }
  toPercentage(denominator, precision) {
    return this.shift(precision).shift(2, true).div(denominator).toPrecision(precision);
  }
  gt(bn, ignorePrecision) {
    const comparisonVal = this.bigNumFromParam(bn);
    if (!ignorePrecision && !comparisonVal.eq(ZERO)) {
      assert(
        comparisonVal.precision.eq(this.precision),
        "Trying to compare numbers with different precision. Yo can opt to ignore precision using the ignorePrecision parameter"
      );
    }
    return this.val.gt(comparisonVal.val);
  }
  lt(bn, ignorePrecision) {
    const comparisonVal = this.bigNumFromParam(bn);
    if (!ignorePrecision && !comparisonVal.val.eq(ZERO)) {
      assert(
        comparisonVal.precision.eq(this.precision),
        "Trying to compare numbers with different precision. Yo can opt to ignore precision using the ignorePrecision parameter"
      );
    }
    return this.val.lt(comparisonVal.val);
  }
  gte(bn, ignorePrecision) {
    const comparisonVal = this.bigNumFromParam(bn);
    if (!ignorePrecision && !comparisonVal.val.eq(ZERO)) {
      assert(
        comparisonVal.precision.eq(this.precision),
        "Trying to compare numbers with different precision. Yo can opt to ignore precision using the ignorePrecision parameter"
      );
    }
    return this.val.gte(comparisonVal.val);
  }
  lte(bn, ignorePrecision) {
    const comparisonVal = this.bigNumFromParam(bn);
    if (!ignorePrecision && !comparisonVal.val.eq(ZERO)) {
      assert(
        comparisonVal.precision.eq(this.precision),
        "Trying to compare numbers with different precision. Yo can opt to ignore precision using the ignorePrecision parameter"
      );
    }
    return this.val.lte(comparisonVal.val);
  }
  eq(bn, ignorePrecision) {
    const comparisonVal = this.bigNumFromParam(bn);
    if (!ignorePrecision && !comparisonVal.val.eq(ZERO)) {
      assert(
        comparisonVal.precision.eq(this.precision),
        "Trying to compare numbers with different precision. Yo can opt to ignore precision using the ignorePrecision parameter"
      );
    }
    return this.val.eq(comparisonVal.val);
  }
  eqZero() {
    return this.val.eq(ZERO);
  }
  gtZero() {
    return this.val.gt(ZERO);
  }
  ltZero() {
    return this.val.lt(ZERO);
  }
  gteZero() {
    return this.val.gte(ZERO);
  }
  lteZero() {
    return this.val.lte(ZERO);
  }
  abs() {
    return new _BigNum(this.val.abs(), this.precision);
  }
  neg() {
    return new _BigNum(this.val.neg(), this.precision);
  }
  print() {
    assert(
      this.precision.gte(ZERO),
      "Tried to print a BN with precision lower than zero"
    );
    const isNeg = this.isNeg();
    const plainString = this.abs().toString();
    const precisionNum = this.precision.toNumber();
    let printString = [
      ...Array(this.precision.toNumber()).fill(0),
      ...plainString.split("")
    ].join("");
    printString = printString.substring(0, printString.length - precisionNum) + _BigNum.delim + printString.substring(printString.length - precisionNum);
    printString = printString.replace(/^0+/, "");
    if (printString[0] === _BigNum.delim)
      printString = `0${printString}`;
    if (isNeg)
      printString = `-${printString}`;
    if (printString[printString.length - 1] === _BigNum.delim)
      printString = printString.slice(0, printString.length - 1);
    return printString;
  }
  prettyPrint(useTradePrecision, precisionOverride) {
    const [leftSide, rightSide] = this.printShort(
      useTradePrecision,
      precisionOverride
    ).split(_BigNum.delim);
    let formattedLeftSide = leftSide;
    const isNeg = formattedLeftSide.includes("-");
    if (isNeg) {
      formattedLeftSide = formattedLeftSide.replace("-", "");
    }
    let index = formattedLeftSide.length - 3;
    while (index >= 1) {
      const formattedLeftSideArray = formattedLeftSide.split("");
      formattedLeftSideArray.splice(index, 0, _BigNum.spacer);
      formattedLeftSide = formattedLeftSideArray.join("");
      index -= 3;
    }
    return `${isNeg ? "-" : ""}${formattedLeftSide}${rightSide ? `${_BigNum.delim}${rightSide}` : ""}`;
  }
  printShort(useTradePrecision, precisionOverride) {
    const printVal = precisionOverride ? this.toPrecision(precisionOverride) : useTradePrecision ? this.toTradePrecision() : this.print();
    if (!printVal.includes(_BigNum.delim))
      return printVal;
    return printVal.replace(/0+$/g, "").replace(/\.$/, "").replace(/,$/, "");
  }
  debug() {
    console.log(
      `${this.toString()} | ${this.print()} | ${this.precision.toString()}`
    );
  }
  toFixed(fixedPrecision, rounded = false) {
    if (rounded) {
      return this.toRounded(fixedPrecision).toFixed(fixedPrecision);
    }
    const printString = this.print();
    const [leftSide, rightSide] = printString.split(_BigNum.delim);
    const filledRightSide = [
      ...(rightSide != null ? rightSide : "").slice(0, fixedPrecision),
      ...Array(fixedPrecision).fill("0")
    ].slice(0, fixedPrecision).join("");
    return `${leftSide}${_BigNum.delim}${filledRightSide}`;
  }
  getZeroes(count) {
    return new Array(Math.max(count, 0)).fill("0").join("");
  }
  toRounded(roundingPrecision) {
    const printString = this.toString();
    let shouldRoundUp = false;
    const roundingDigitChar = printString[roundingPrecision];
    if (roundingDigitChar) {
      const roundingDigitVal = Number(roundingDigitChar);
      if (roundingDigitVal >= 5)
        shouldRoundUp = true;
    }
    if (shouldRoundUp) {
      const valueWithRoundedPrecisionAdded = this.add(
        _BigNum.from(
          new BN15(10).pow(new BN15(printString.length - roundingPrecision)),
          this.precision
        )
      );
      const roundedUpPrintString = valueWithRoundedPrecisionAdded.toString().slice(0, roundingPrecision) + this.getZeroes(printString.length - roundingPrecision);
      return _BigNum.from(roundedUpPrintString, this.precision);
    } else {
      const roundedDownPrintString = printString.slice(0, roundingPrecision) + this.getZeroes(printString.length - roundingPrecision);
      return _BigNum.from(roundedDownPrintString, this.precision);
    }
  }
  toPrecision(fixedPrecision, trailingZeroes = false, rounded = false) {
    if (rounded) {
      return this.toRounded(fixedPrecision).toPrecision(
        fixedPrecision,
        trailingZeroes
      );
    }
    const isNeg = this.isNeg();
    const printString = this.abs().print();
    const thisString = this.abs().toString();
    let precisionPrintString = printString.slice(0, fixedPrecision + 1);
    if (!printString.includes(_BigNum.delim) && thisString.length < fixedPrecision) {
      const precisionMismatch = fixedPrecision - thisString.length;
      return _BigNum.from(
        (isNeg ? "-" : "") + thisString + this.getZeroes(precisionMismatch),
        precisionMismatch
      ).toPrecision(fixedPrecision, trailingZeroes);
    }
    if (!precisionPrintString.includes(_BigNum.delim) || precisionPrintString[precisionPrintString.length - 1] === _BigNum.delim) {
      precisionPrintString = printString.slice(0, fixedPrecision);
    }
    const pointsOfPrecision = precisionPrintString.replace(
      _BigNum.delim,
      ""
    ).length;
    if (pointsOfPrecision < fixedPrecision) {
      precisionPrintString = [
        ...precisionPrintString.split(""),
        ...Array(fixedPrecision - pointsOfPrecision).fill("0")
      ].join("");
    }
    if (!precisionPrintString.includes(_BigNum.delim)) {
      const delimFullStringLocation = printString.indexOf(_BigNum.delim);
      let skipExponent = false;
      if (delimFullStringLocation === -1) {
        skipExponent = true;
      }
      if (precisionPrintString[precisionPrintString.length - 1] === _BigNum.delim) {
        skipExponent = true;
      }
      if (printString.indexOf(_BigNum.delim) === fixedPrecision) {
        skipExponent = true;
      }
      if (!skipExponent) {
        const exponent = delimFullStringLocation - fixedPrecision;
        if (trailingZeroes) {
          precisionPrintString = `${precisionPrintString}${Array(exponent).fill("0").join("")}`;
        } else {
          precisionPrintString = `${precisionPrintString}e${exponent}`;
        }
      }
    }
    return `${isNeg ? "-" : ""}${precisionPrintString}`;
  }
  toTradePrecision(rounded = false) {
    return this.toPrecision(6, true, rounded);
  }
  toNotional(useTradePrecision, precisionOverride) {
    var _a;
    const prefix = `${this.lt(_BigNum.zero()) ? `-` : ``}$`;
    const usingCustomPrecision = useTradePrecision || precisionOverride;
    let val = usingCustomPrecision ? this.prettyPrint(useTradePrecision, precisionOverride) : _BigNum.fromPrint(this.toFixed(2), new BN15(2)).prettyPrint();
    if (!usingCustomPrecision) {
      const [_, rightSide] = val.split(_BigNum.delim);
      const trailingLength = (_a = rightSide == null ? void 0 : rightSide.length) != null ? _a : 0;
      if (trailingLength === 0) {
        val = `${val}${_BigNum.delim}00`;
      } else if (trailingLength === 1) {
        val = `${val}0`;
      }
    }
    return `${prefix}${val.replace("-", "")}`;
  }
  toMillified(precision = 3, rounded = false) {
    if (rounded) {
      return this.toRounded(precision).toMillified(precision);
    }
    const isNeg = this.isNeg();
    const stringVal = this.abs().print();
    const [leftSide] = stringVal.split(_BigNum.delim);
    if (!leftSide) {
      return this.shift(new BN15(precision)).toPrecision(precision, true);
    }
    if (leftSide.length <= precision) {
      return this.toPrecision(precision);
    }
    if (leftSide.length <= 3) {
      return this.shift(new BN15(precision)).toPrecision(precision, true);
    }
    const unitTicks = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
    const unitNumber = Math.floor((leftSide.length - 1) / 3);
    const unit = unitTicks[unitNumber];
    let leadDigits = leftSide.slice(0, precision);
    if (leadDigits.length < precision) {
      leadDigits = [
        ...leadDigits.split(""),
        ...Array(precision - leadDigits.length).fill("0")
      ].join("");
    }
    const decimalLocation = leftSide.length - 3 * unitNumber;
    let leadString = "";
    if (decimalLocation >= precision) {
      leadString = `${leadDigits}`;
    } else {
      leadString = `${leadDigits.slice(0, decimalLocation)}${_BigNum.delim}${leadDigits.slice(decimalLocation)}`;
    }
    return `${isNeg ? "-" : ""}${leadString}${unit}`;
  }
  toJSON() {
    return {
      val: this.val.toString(),
      precision: this.precision.toString()
    };
  }
  isNeg() {
    return this.lt(ZERO, true);
  }
  isPos() {
    return !this.isNeg();
  }
  toNum() {
    let printedValue = this.print();
    if (_BigNum.delim !== "." || _BigNum.spacer !== ",") {
      printedValue = printedValue.split("").map((char) => {
        if (char === _BigNum.delim)
          return ".";
        if (char === _BigNum.spacer)
          return ",";
        return char;
      }).join("");
    }
    return parseFloat(printedValue);
  }
  static fromJSON(json) {
    return _BigNum.from(new BN15(json.val), new BN15(json.precision));
  }
  static from(val = ZERO, precision) {
    assert(
      new BN15(precision).lt(new BN15(100)),
      "Tried to create a bignum with precision higher than 10^100"
    );
    return new _BigNum(val, precision);
  }
  static fromPrint(val, precisionShift) {
    var _a;
    if (!val)
      return _BigNum.from(ZERO, precisionShift);
    if (!val.replace(_BigNum.delim, "")) {
      return _BigNum.from(ZERO, precisionShift);
    }
    const sides = val.split(_BigNum.delim);
    const rightSide = sides[1];
    const leftSide = sides[0].replace(/\s/g, "");
    const bnInput = `${leftSide != null ? leftSide : ""}${rightSide != null ? rightSide : ""}`;
    const rawBn = new BN15(bnInput);
    const rightSideLength = (_a = rightSide == null ? void 0 : rightSide.length) != null ? _a : 0;
    const totalShift = precisionShift ? precisionShift.sub(new BN15(rightSideLength)) : ZERO;
    return _BigNum.from(rawBn, precisionShift).shift(totalShift, true);
  }
  static max(a, b) {
    return a.gt(b) ? a : b;
  }
  static min(a, b) {
    return a.lt(b) ? a : b;
  }
  static zero(precision) {
    return _BigNum.from(0, precision);
  }
};
var BigNum = _BigNum;
BigNum.delim = ".";
BigNum.spacer = ",";

// src/events/types.ts
var DefaultEventSubscriptionOptions = {
  eventTypes: [
    "DepositRecord",
    "FundingPaymentRecord",
    "LiquidationRecord",
    "OrderRecord",
    "OrderActionRecord",
    "FundingRateRecord",
    "NewUserRecord",
    "SettlePnlRecord",
    "LPRecord",
    "InsuranceFundRecord",
    "SpotInterestRecord",
    "InsuranceFundStakeRecord",
    "CurveRecord"
  ],
  maxEventsPerType: 4096,
  orderBy: "blockchain",
  orderDir: "asc",
  commitment: "confirmed",
  maxTx: 4096,
  logProviderConfig: {
    type: "websocket"
  }
};

// src/events/txEventCache.ts
var Node = class {
  constructor(key, value, next, prev) {
    this.key = key;
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
};
var TxEventCache = class {
  constructor(maxTx = 1024) {
    this.maxTx = maxTx;
    this.size = 0;
    this.cacheMap = {};
  }
  add(key, events) {
    const existingNode = this.cacheMap[key];
    if (existingNode) {
      this.detach(existingNode);
      this.size--;
    } else if (this.size === this.maxTx) {
      delete this.cacheMap[this.tail.key];
      this.detach(this.tail);
      this.size--;
    }
    if (!this.head) {
      this.head = this.tail = new Node(key, events);
    } else {
      const node = new Node(key, events, this.head);
      this.head.prev = node;
      this.head = node;
    }
    this.cacheMap[key] = this.head;
    this.size++;
  }
  has(key) {
    return this.cacheMap.hasOwnProperty(key);
  }
  get(key) {
    var _a;
    return (_a = this.cacheMap[key]) == null ? void 0 : _a.value;
  }
  detach(node) {
    if (node.prev !== void 0) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next !== void 0) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }
  clear() {
    this.head = void 0;
    this.tail = void 0;
    this.size = 0;
    this.cacheMap = {};
  }
};

// src/events/eventList.ts
var Node2 = class {
  constructor(event, next, prev) {
    this.event = event;
    this.next = next;
    this.prev = prev;
  }
};
var EventList = class {
  constructor(eventType, maxSize, sortFn, orderDirection) {
    this.eventType = eventType;
    this.maxSize = maxSize;
    this.sortFn = sortFn;
    this.orderDirection = orderDirection;
    this.size = 0;
  }
  insert(event) {
    this.size++;
    const newNode = new Node2(event);
    if (this.head === void 0) {
      this.head = this.tail = newNode;
      return;
    }
    if (this.sortFn(this.head.event, newNode.event) === (this.orderDirection === "asc" ? "less than" : "greater than")) {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let currentNode = this.head;
      while (currentNode.next !== void 0 && this.sortFn(currentNode.next.event, newNode.event) !== (this.orderDirection === "asc" ? "less than" : "greater than")) {
        currentNode = currentNode.next;
      }
      newNode.next = currentNode.next;
      if (currentNode.next !== void 0) {
        newNode.next.prev = newNode;
      } else {
        this.tail = newNode;
      }
      currentNode.next = newNode;
      newNode.prev = currentNode;
    }
    if (this.size > this.maxSize) {
      this.detach();
    }
  }
  detach() {
    const node = this.tail;
    if (node.prev !== void 0) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next !== void 0) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    this.size--;
  }
  toArray() {
    return Array.from(this);
  }
  *[Symbol.iterator]() {
    let node = this.head;
    while (node) {
      yield node.event;
      node = node.next;
    }
  }
};

// src/events/fetchLogs.ts
function mapTransactionResponseToLog(transaction) {
  return {
    txSig: transaction.transaction.signatures[0],
    slot: transaction.slot,
    logs: transaction.meta.logMessages
  };
}
async function fetchLogs(connection, programId, finality, beforeTx, untilTx, limit) {
  const signatures = await connection.getSignaturesForAddress(
    programId,
    {
      before: beforeTx,
      until: untilTx,
      limit
    },
    finality
  );
  const sortedSignatures = signatures.sort(
    (a, b) => a.slot === b.slot ? 0 : a.slot < b.slot ? -1 : 1
  );
  const filteredSignatures = sortedSignatures.filter(
    (signature) => !signature.err
  );
  if (filteredSignatures.length === 0) {
    return void 0;
  }
  const chunkedSignatures = chunk(filteredSignatures, 100);
  const transactionLogs = (await Promise.all(
    chunkedSignatures.map(async (chunk2) => {
      const transactions = await connection.getTransactions(
        chunk2.map((confirmedSignature) => confirmedSignature.signature),
        finality
      );
      return transactions.reduce((logs, transaction) => {
        if (transaction) {
          logs.push(mapTransactionResponseToLog(transaction));
        }
        return logs;
      }, new Array());
    })
  )).flat();
  const earliest = filteredSignatures[0];
  const mostRecent = filteredSignatures[filteredSignatures.length - 1];
  return {
    transactionLogs,
    earliestTx: earliest.signature,
    mostRecentTx: mostRecent.signature,
    earliestSlot: earliest.slot,
    mostRecentSlot: mostRecent.slot,
    mostRecentBlockTime: mostRecent.blockTime
  };
}
function chunk(array, size) {
  return new Array(Math.ceil(array.length / size)).fill(null).map((_, index) => index * size).map((begin) => array.slice(begin, begin + size));
}
var LogParser = class {
  constructor(program2) {
    this.program = program2;
  }
  parseEventsFromTransaction(transaction) {
    const transactionLogObject = mapTransactionResponseToLog(transaction);
    return this.parseEventsFromLogs(transactionLogObject);
  }
  parseEventsFromLogs(event) {
    const records = [];
    this.program._events._eventParser.parseLogs(event.logs, (eventLog) => {
      eventLog.data.txSig = event.txSig;
      eventLog.data.slot = event.slot;
      eventLog.data.eventType = eventLog.name;
      records.push(eventLog.data);
    });
    return records;
  }
};

// src/events/pollingLogProvider.ts
var PollingLogProvider = class {
  constructor(connection, programId, commitment, frequency = 15 * 1e3) {
    this.connection = connection;
    this.programId = programId;
    this.frequency = frequency;
    this.firstFetch = true;
    this.finality = commitment === "finalized" ? "finalized" : "confirmed";
  }
  subscribe(callback, skipHistory) {
    if (this.intervalId) {
      return true;
    }
    this.intervalId = setInterval(async () => {
      if (this.mutex === 1) {
        return;
      }
      this.mutex = 1;
      try {
        const response = await fetchLogs(
          this.connection,
          this.programId,
          this.finality,
          void 0,
          this.mostRecentSeenTx,
          skipHistory && this.firstFetch ? 1 : void 0
        );
        if (response === void 0) {
          return;
        }
        this.firstFetch = false;
        const { mostRecentTx, transactionLogs } = response;
        for (const { txSig, slot, logs } of transactionLogs) {
          callback(txSig, slot, logs, response.mostRecentBlockTime);
        }
        this.mostRecentSeenTx = mostRecentTx;
      } catch (e) {
        console.error("PollingLogProvider threw an Error");
        console.error(e);
      } finally {
        this.mutex = 0;
      }
    }, this.frequency);
    return true;
  }
  isSubscribed() {
    return this.intervalId !== void 0;
  }
  async unsubscribe() {
    if (this.intervalId !== void 0) {
      clearInterval(this.intervalId);
      this.intervalId = void 0;
    }
    return true;
  }
};

// src/events/webSocketLogProvider.ts
var WebSocketLogProvider = class {
  constructor(connection, programId, commitment) {
    this.connection = connection;
    this.programId = programId;
    this.commitment = commitment;
  }
  subscribe(callback) {
    if (this.subscriptionId) {
      return true;
    }
    this.subscriptionId = this.connection.onLogs(
      this.programId,
      (logs, ctx) => {
        callback(logs.signature, ctx.slot, logs.logs, void 0);
      },
      this.commitment
    );
    return true;
  }
  isSubscribed() {
    return this.subscriptionId !== void 0;
  }
  async unsubscribe() {
    if (this.subscriptionId !== void 0) {
      await this.connection.removeOnLogsListener(this.subscriptionId);
      this.subscriptionId = void 0;
    }
    return true;
  }
};

// src/events/eventSubscriber.ts
import { EventEmitter as EventEmitter9 } from "events";

// src/events/sort.ts
function clientSortAscFn() {
  return "less than";
}
function clientSortDescFn() {
  return "greater than";
}
function defaultBlockchainSortFn(currentEvent, newEvent) {
  return currentEvent.slot <= newEvent.slot ? "less than" : "greater than";
}
function orderActionRecordSortFn(currentEvent, newEvent) {
  var _a, _b;
  const currentEventMarketIndex = currentEvent.marketIndex;
  const newEventMarketIndex = newEvent.marketIndex;
  if (currentEventMarketIndex !== newEventMarketIndex) {
    return currentEvent.ts.lte(newEvent.ts) ? "less than" : "greater than";
  }
  if (((_a = currentEvent.fillRecordId) == null ? void 0 : _a.gt(ZERO)) && ((_b = newEvent.fillRecordId) == null ? void 0 : _b.gt(ZERO))) {
    return currentEvent.fillRecordId.lte(newEvent.fillRecordId) ? "less than" : "greater than";
  } else {
    return currentEvent.ts.lte(newEvent.ts) ? "less than" : "greater than";
  }
}
function getSortFn(orderBy, orderDir, eventType) {
  if (orderBy === "client") {
    return orderDir === "asc" ? clientSortAscFn : clientSortDescFn;
  }
  switch (eventType) {
    case "OrderActionRecord":
      return orderActionRecordSortFn;
    default:
      return defaultBlockchainSortFn;
  }
}

// src/events/eventSubscriber.ts
var EventSubscriber = class {
  constructor(connection, program2, options = DefaultEventSubscriptionOptions) {
    this.connection = connection;
    this.program = program2;
    this.options = options;
    this.awaitTxPromises = /* @__PURE__ */ new Map();
    this.awaitTxResolver = /* @__PURE__ */ new Map();
    this.options = Object.assign({}, DefaultEventSubscriptionOptions, options);
    this.txEventCache = new TxEventCache(this.options.maxTx);
    this.eventListMap = /* @__PURE__ */ new Map();
    for (const eventType of this.options.eventTypes) {
      this.eventListMap.set(
        eventType,
        new EventList(
          eventType,
          this.options.maxEventsPerType,
          getSortFn(this.options.orderBy, this.options.orderDir, eventType),
          this.options.orderDir
        )
      );
    }
    this.eventEmitter = new EventEmitter9();
    if (this.options.logProviderConfig.type === "websocket") {
      this.logProvider = new WebSocketLogProvider(
        this.connection,
        this.program.programId,
        this.options.commitment
      );
    } else {
      this.logProvider = new PollingLogProvider(
        this.connection,
        this.program.programId,
        options.commitment,
        this.options.logProviderConfig.frequency
      );
    }
  }
  async subscribe() {
    try {
      if (this.logProvider.isSubscribed()) {
        return true;
      }
      this.logProvider.subscribe((txSig, slot, logs, mostRecentBlockTime) => {
        this.handleTxLogs(txSig, slot, logs, mostRecentBlockTime);
      }, true);
      return true;
    } catch (e) {
      console.error("Error fetching previous txs in event subscriber");
      console.error(e);
      return false;
    }
  }
  handleTxLogs(txSig, slot, logs, mostRecentBlockTime) {
    if (this.txEventCache.has(txSig)) {
      return;
    }
    const wrappedEvents = this.parseEventsFromLogs(txSig, slot, logs);
    for (const wrappedEvent of wrappedEvents) {
      this.eventListMap.get(wrappedEvent.eventType).insert(wrappedEvent);
    }
    for (const wrappedEvent of wrappedEvents) {
      this.eventEmitter.emit("newEvent", wrappedEvent);
    }
    if (this.awaitTxPromises.has(txSig)) {
      this.awaitTxPromises.delete(txSig);
      this.awaitTxResolver.get(txSig)();
      this.awaitTxResolver.delete(txSig);
    }
    if (!this.lastSeenSlot || slot > this.lastSeenSlot) {
      this.lastSeenTxSig = txSig;
    }
    if (this.lastSeenBlockTime === void 0 || mostRecentBlockTime > this.lastSeenBlockTime) {
      this.lastSeenBlockTime = mostRecentBlockTime;
    }
    this.txEventCache.add(txSig, wrappedEvents);
  }
  async fetchPreviousTx(fetchMax) {
    if (!this.options.untilTx && !fetchMax) {
      return;
    }
    let txFetched = 0;
    let beforeTx = void 0;
    const untilTx = this.options.untilTx;
    while (txFetched < this.options.maxTx) {
      const response = await fetchLogs(
        this.connection,
        this.program.programId,
        this.options.commitment === "finalized" ? "finalized" : "confirmed",
        beforeTx,
        untilTx
      );
      if (response === void 0) {
        break;
      }
      txFetched += response.transactionLogs.length;
      beforeTx = response.earliestTx;
      for (const { txSig, slot, logs } of response.transactionLogs) {
        this.handleTxLogs(txSig, slot, logs, response.mostRecentBlockTime);
      }
    }
  }
  async unsubscribe() {
    return await this.logProvider.unsubscribe();
  }
  parseEventsFromLogs(txSig, slot, logs) {
    const records = [];
    this.program._events._eventParser.parseLogs(logs, (event) => {
      const expectRecordType = this.eventListMap.has(event.name);
      if (expectRecordType) {
        event.data.txSig = txSig;
        event.data.slot = slot;
        event.data.eventType = event.name;
        records.push(event.data);
      }
    });
    return records;
  }
  awaitTx(txSig) {
    if (this.awaitTxPromises.has(txSig)) {
      return this.awaitTxPromises.get(txSig);
    }
    if (this.txEventCache.has(txSig)) {
      return Promise.resolve();
    }
    const promise = new Promise((resolve) => {
      this.awaitTxResolver.set(txSig, resolve);
    });
    this.awaitTxPromises.set(txSig, promise);
    return promise;
  }
  getEventList(eventType) {
    return this.eventListMap.get(eventType);
  }
  getEventsArray(eventType) {
    return this.eventListMap.get(eventType).toArray();
  }
  getEventsByTx(txSig) {
    return this.txEventCache.get(txSig);
  }
};

// src/math/auction.ts
function isAuctionComplete(order, slot) {
  if (order.auctionDuration === 0) {
    return true;
  }
  return new BN(slot).sub(order.slot).gt(new BN(order.auctionDuration));
}
function getAuctionPrice(order, slot, oraclePrice) {
  if (isOneOfVariant(order.orderType, ["market", "triggerMarket"])) {
    return getAuctionPriceForFixedAuction(order, slot);
  } else if (isVariant(order.orderType, "oracle")) {
    return getAuctionPriceForOracleOffsetAuction(order, slot, oraclePrice);
  } else {
    throw Error(`Cant get auction price for order type ${order.orderType}`);
  }
}
function getAuctionPriceForFixedAuction(order, slot) {
  const slotsElapsed = new BN(slot).sub(order.slot);
  const deltaDenominator = new BN(order.auctionDuration);
  const deltaNumerator = BN.min(slotsElapsed, deltaDenominator);
  if (deltaDenominator.eq(ZERO)) {
    return order.auctionEndPrice;
  }
  let priceDelta;
  if (isVariant(order.direction, "long")) {
    priceDelta = order.auctionEndPrice.sub(order.auctionStartPrice).mul(deltaNumerator).div(deltaDenominator);
  } else {
    priceDelta = order.auctionStartPrice.sub(order.auctionEndPrice).mul(deltaNumerator).div(deltaDenominator);
  }
  let price;
  if (isVariant(order.direction, "long")) {
    price = order.auctionStartPrice.add(priceDelta);
  } else {
    price = order.auctionStartPrice.sub(priceDelta);
  }
  return price;
}
function getAuctionPriceForOracleOffsetAuction(order, slot, oraclePrice) {
  const slotsElapsed = new BN(slot).sub(order.slot);
  const deltaDenominator = new BN(order.auctionDuration);
  const deltaNumerator = BN.min(slotsElapsed, deltaDenominator);
  if (deltaDenominator.eq(ZERO)) {
    return order.auctionEndPrice.add(order.auctionEndPrice);
  }
  let priceOffsetDelta;
  if (isVariant(order.direction, "long")) {
    priceOffsetDelta = order.auctionEndPrice.sub(order.auctionStartPrice).mul(deltaNumerator).div(deltaDenominator);
  } else {
    priceOffsetDelta = order.auctionStartPrice.sub(order.auctionEndPrice).mul(deltaNumerator).div(deltaDenominator);
  }
  let priceOffset;
  if (isVariant(order.direction, "long")) {
    priceOffset = order.auctionStartPrice.add(priceOffsetDelta);
  } else {
    priceOffset = order.auctionStartPrice.sub(priceOffsetDelta);
  }
  return oraclePrice.add(priceOffset);
}

// src/math/spotMarket.ts
import { BN as BN16 } from "@project-serum/anchor";
function castNumberToSpotPrecision(value, spotMarket) {
  return new BN16(value * Math.pow(10, spotMarket.decimals));
}

// src/math/conversion.ts
var convertToNumber = (bigNumber, precision = PRICE_PRECISION) => {
  if (!bigNumber)
    return 0;
  return bigNumber.div(precision).toNumber() + bigNumber.mod(precision).toNumber() / precision.toNumber();
};

// src/math/exchangeStatus.ts
function exchangePaused(state) {
  return isVariant(state.exchangeStatus, "paused");
}
function fillPaused(state, market) {
  return isOneOfVariant(state.exchangeStatus, ["paused", "fillPaused"]) || isOneOfVariant(market.status, ["paused", "fillPaused"]);
}
function ammPaused(state, market) {
  return isOneOfVariant(state.exchangeStatus, ["paused", "ammPaused"]) || isOneOfVariant(market.status, ["paused", "ammPaused"]);
}

// src/math/funding.ts
import { BN as BN17 } from "@project-serum/anchor";
async function calculateAllEstimatedFundingRate(market, oraclePriceData, periodAdjustment = new BN17(1)) {
  const secondsInHour = new BN17(3600);
  const hoursInDay = new BN17(24);
  const ONE2 = new BN17(1);
  if (isVariant(market.status, "uninitialized")) {
    return [ZERO, ZERO, ZERO, ZERO, ZERO];
  }
  const payFreq = new BN17(market.amm.fundingPeriod);
  const now = new BN17((Date.now() / 1e3).toFixed(0));
  const timeSinceLastUpdate = now.sub(market.amm.lastFundingRateTs);
  const lastMarkTwapWithMantissa = market.amm.lastMarkPriceTwap;
  const lastMarkPriceTwapTs = market.amm.lastMarkPriceTwapTs;
  const timeSinceLastMarkChange = now.sub(lastMarkPriceTwapTs);
  const markTwapTimeSinceLastUpdate = BN17.max(
    secondsInHour,
    BN17.max(ZERO, secondsInHour.sub(timeSinceLastMarkChange))
  );
  const [bid, ask] = calculateBidAskPrice(market.amm, oraclePriceData);
  const baseAssetPriceWithMantissa = bid.add(ask).div(new BN17(2));
  const markTwapWithMantissa = markTwapTimeSinceLastUpdate.mul(lastMarkTwapWithMantissa).add(timeSinceLastMarkChange.mul(baseAssetPriceWithMantissa)).div(timeSinceLastMarkChange.add(markTwapTimeSinceLastUpdate));
  const lastOracleTwapWithMantissa = market.amm.historicalOracleData.lastOraclePriceTwap;
  const lastOraclePriceTwapTs = market.amm.historicalOracleData.lastOraclePriceTwapTs;
  const oracleInvalidDuration = BN17.max(
    ZERO,
    lastMarkPriceTwapTs.sub(lastOraclePriceTwapTs)
  );
  const timeSinceLastOracleTwapUpdate = now.sub(lastOraclePriceTwapTs);
  const oracleTwapTimeSinceLastUpdate = BN17.max(
    ONE2,
    BN17.min(
      secondsInHour,
      BN17.max(ONE2, secondsInHour.sub(timeSinceLastOracleTwapUpdate))
    )
  );
  let oracleTwapWithMantissa = lastOracleTwapWithMantissa;
  if (oraclePriceData) {
    const oraclePrice = oraclePriceData.price;
    const oracleLiveVsTwap = oraclePrice.sub(lastOracleTwapWithMantissa).abs().mul(PRICE_PRECISION).mul(new BN17(100)).div(lastOracleTwapWithMantissa);
    if (oracleLiveVsTwap.lte(PRICE_PRECISION.mul(new BN17(10)))) {
      oracleTwapWithMantissa = oracleTwapTimeSinceLastUpdate.mul(lastOracleTwapWithMantissa).add(timeSinceLastMarkChange.mul(oraclePrice)).div(timeSinceLastMarkChange.add(oracleTwapTimeSinceLastUpdate));
    }
  }
  const shrunkLastOracleTwapwithMantissa = oracleTwapTimeSinceLastUpdate.mul(lastOracleTwapWithMantissa).add(oracleInvalidDuration.mul(lastMarkTwapWithMantissa)).div(oracleTwapTimeSinceLastUpdate.add(oracleInvalidDuration));
  const twapSpread = lastMarkTwapWithMantissa.sub(
    shrunkLastOracleTwapwithMantissa
  );
  const twapSpreadPct = twapSpread.mul(PRICE_PRECISION).mul(new BN17(100)).div(shrunkLastOracleTwapwithMantissa);
  const lowerboundEst = twapSpreadPct.mul(payFreq).mul(BN17.min(secondsInHour, timeSinceLastUpdate)).mul(periodAdjustment).div(secondsInHour).div(secondsInHour).div(hoursInDay);
  const interpEst = twapSpreadPct.mul(periodAdjustment).div(hoursInDay);
  const interpRateQuote = twapSpreadPct.mul(periodAdjustment).div(hoursInDay).div(PRICE_PRECISION.div(QUOTE_PRECISION));
  let feePoolSize = calculateFundingPool(market);
  if (interpRateQuote.lt(new BN17(0))) {
    feePoolSize = feePoolSize.mul(new BN17(-1));
  }
  let cappedAltEst;
  let largerSide;
  let smallerSide;
  if (market.amm.baseAssetAmountLong.gt(market.amm.baseAssetAmountShort.abs())) {
    largerSide = market.amm.baseAssetAmountLong.abs();
    smallerSide = market.amm.baseAssetAmountShort.abs();
    if (twapSpread.gt(new BN17(0))) {
      return [
        markTwapWithMantissa,
        oracleTwapWithMantissa,
        lowerboundEst,
        interpEst,
        interpEst
      ];
    }
  } else if (market.amm.baseAssetAmountLong.lt(market.amm.baseAssetAmountShort.abs())) {
    largerSide = market.amm.baseAssetAmountShort.abs();
    smallerSide = market.amm.baseAssetAmountLong.abs();
    if (twapSpread.lt(new BN17(0))) {
      return [
        markTwapWithMantissa,
        oracleTwapWithMantissa,
        lowerboundEst,
        interpEst,
        interpEst
      ];
    }
  } else {
    return [
      markTwapWithMantissa,
      oracleTwapWithMantissa,
      lowerboundEst,
      interpEst,
      interpEst
    ];
  }
  if (largerSide.gt(ZERO)) {
    cappedAltEst = smallerSide.mul(twapSpread).div(hoursInDay);
    const feePoolTopOff = feePoolSize.mul(PRICE_PRECISION.div(QUOTE_PRECISION)).mul(AMM_RESERVE_PRECISION);
    cappedAltEst = cappedAltEst.add(feePoolTopOff).div(largerSide);
    cappedAltEst = cappedAltEst.mul(PRICE_PRECISION).mul(new BN17(100)).div(oracleTwapWithMantissa).mul(periodAdjustment);
    if (cappedAltEst.abs().gte(interpEst.abs())) {
      cappedAltEst = interpEst;
    }
  } else {
    cappedAltEst = interpEst;
  }
  return [
    markTwapWithMantissa,
    oracleTwapWithMantissa,
    lowerboundEst,
    cappedAltEst,
    interpEst
  ];
}
async function calculateEstimatedFundingRate(market, oraclePriceData, periodAdjustment = new BN17(1), estimationMethod) {
  const [_1, _2, lowerboundEst, cappedAltEst, interpEst] = await calculateAllEstimatedFundingRate(
    market,
    oraclePriceData,
    periodAdjustment
  );
  if (estimationMethod == "lowerbound") {
    return lowerboundEst;
  } else if (estimationMethod == "capped") {
    return cappedAltEst;
  } else {
    return interpEst;
  }
}
async function calculateLongShortFundingRate(market, oraclePriceData, periodAdjustment = new BN17(1)) {
  const [_1, _2, _, cappedAltEst, interpEst] = await calculateAllEstimatedFundingRate(
    market,
    oraclePriceData,
    periodAdjustment
  );
  if (market.amm.baseAssetAmountLong.gt(market.amm.baseAssetAmountShort)) {
    return [cappedAltEst, interpEst];
  } else if (market.amm.baseAssetAmountLong.lt(market.amm.baseAssetAmountShort)) {
    return [interpEst, cappedAltEst];
  } else {
    return [interpEst, interpEst];
  }
}
async function calculateLongShortFundingRateAndLiveTwaps(market, oraclePriceData, periodAdjustment = new BN17(1)) {
  const [markTwapLive, oracleTwapLive, _2, cappedAltEst, interpEst] = await calculateAllEstimatedFundingRate(
    market,
    oraclePriceData,
    periodAdjustment
  );
  if (market.amm.baseAssetAmountLong.gt(market.amm.baseAssetAmountShort.abs())) {
    return [markTwapLive, oracleTwapLive, cappedAltEst, interpEst];
  } else if (market.amm.baseAssetAmountLong.lt(market.amm.baseAssetAmountShort.abs())) {
    return [markTwapLive, oracleTwapLive, interpEst, cappedAltEst];
  } else {
    return [markTwapLive, oracleTwapLive, interpEst, interpEst];
  }
}
function calculateFundingPool(market) {
  const totalFeeLB = market.amm.totalExchangeFee.div(new BN17(2));
  const feePool = BN17.max(
    ZERO,
    market.amm.totalFeeMinusDistributions.sub(totalFeeLB).mul(new BN17(1)).div(new BN17(3))
  );
  return feePool;
}

// src/math/orders.ts
import { BN as BN18 } from "@project-serum/anchor";
function isOrderRiskIncreasing(user, order) {
  if (isVariant(order.status, "init")) {
    return false;
  }
  const position = user.getPerpPosition(order.marketIndex) || user.getEmptyPosition(order.marketIndex);
  if (position.baseAssetAmount.eq(ZERO)) {
    return true;
  }
  if (position.baseAssetAmount.gt(ZERO) && isVariant(order.direction, "long")) {
    return true;
  }
  if (position.baseAssetAmount.lt(ZERO) && isVariant(order.direction, "short")) {
    return true;
  }
  const baseAssetAmountToFill = order.baseAssetAmount.sub(
    order.baseAssetAmountFilled
  );
  if (baseAssetAmountToFill.gt(position.baseAssetAmount.abs().mul(TWO))) {
    return true;
  }
  return false;
}
function isOrderRiskIncreasingInSameDirection(user, order) {
  if (isVariant(order.status, "init")) {
    return false;
  }
  const position = user.getPerpPosition(order.marketIndex) || user.getEmptyPosition(order.marketIndex);
  if (position.baseAssetAmount.eq(ZERO)) {
    return true;
  }
  if (position.baseAssetAmount.gt(ZERO) && isVariant(order.direction, "long")) {
    return true;
  }
  if (position.baseAssetAmount.lt(ZERO) && isVariant(order.direction, "short")) {
    return true;
  }
  return false;
}
function isOrderReduceOnly(user, order) {
  if (isVariant(order.status, "init")) {
    return false;
  }
  const position = user.getPerpPosition(order.marketIndex) || user.getEmptyPosition(order.marketIndex);
  if (position.baseAssetAmount.gte(ZERO) && isVariant(order.direction, "long")) {
    return false;
  }
  if (position.baseAssetAmount.lte(ZERO) && isVariant(order.direction, "short")) {
    return false;
  }
  return true;
}
function standardizeBaseAssetAmount(baseAssetAmount, stepSize) {
  const remainder = baseAssetAmount.mod(stepSize);
  return baseAssetAmount.sub(remainder);
}
function getLimitPrice(order, oraclePriceData, slot, fallbackPrice) {
  let limitPrice;
  if (hasAuctionPrice(order, slot)) {
    limitPrice = getAuctionPrice(order, slot, oraclePriceData.price);
  } else if (order.oraclePriceOffset !== 0) {
    limitPrice = oraclePriceData.price.add(new BN18(order.oraclePriceOffset));
  } else if (order.price.eq(ZERO)) {
    limitPrice = fallbackPrice;
  } else {
    limitPrice = order.price;
  }
  return limitPrice;
}
function hasLimitPrice(order, slot) {
  return order.price.gt(ZERO) || order.oraclePriceOffset != 0 || !isAuctionComplete(order, slot);
}
function hasAuctionPrice(order, slot) {
  return isMarketOrder(order) && !isAuctionComplete(order, slot);
}
function isFillableByVAMM(order, market, oraclePriceData, slot, ts) {
  return isAuctionComplete(order, slot) && !calculateBaseAssetAmountForAmmToFulfill(
    order,
    market,
    oraclePriceData,
    slot
  ).eq(ZERO) || isOrderExpired(order, ts);
}
function calculateBaseAssetAmountForAmmToFulfill(order, market, oraclePriceData, slot) {
  if (mustBeTriggered(order) && !isTriggered(order)) {
    return ZERO;
  }
  const limitPrice = getLimitPrice(order, oraclePriceData, slot);
  let baseAssetAmount;
  const updatedAMM = calculateUpdatedAMM(market.amm, oraclePriceData);
  if (limitPrice !== void 0) {
    baseAssetAmount = calculateBaseAssetAmountToFillUpToLimitPrice(
      order,
      updatedAMM,
      limitPrice,
      oraclePriceData
    );
  } else {
    baseAssetAmount = order.baseAssetAmount.sub(order.baseAssetAmountFilled);
  }
  const maxBaseAssetAmount = calculateMaxBaseAssetAmountFillable(
    updatedAMM,
    order.direction
  );
  return BN18.min(maxBaseAssetAmount, baseAssetAmount);
}
function calculateBaseAssetAmountToFillUpToLimitPrice(order, amm, limitPrice, oraclePriceData) {
  const [maxAmountToTrade, direction] = calculateMaxBaseAssetAmountToTrade(
    amm,
    limitPrice,
    order.direction,
    oraclePriceData
  );
  const baseAssetAmount = standardizeBaseAssetAmount(
    maxAmountToTrade,
    amm.orderStepSize
  );
  const sameDirection = isSameDirection(direction, order.direction);
  if (!sameDirection) {
    return ZERO;
  }
  const baseAssetAmountUnfilled = order.baseAssetAmount.sub(
    order.baseAssetAmountFilled
  );
  return baseAssetAmount.gt(baseAssetAmountUnfilled) ? baseAssetAmountUnfilled : baseAssetAmount;
}
function isSameDirection(firstDirection, secondDirection) {
  return isVariant(firstDirection, "long") && isVariant(secondDirection, "long") || isVariant(firstDirection, "short") && isVariant(secondDirection, "short");
}
function isOrderExpired(order, ts) {
  if (mustBeTriggered(order) || !isVariant(order.status, "open") || order.maxTs.eq(ZERO)) {
    return false;
  }
  return new BN18(ts).gt(order.maxTs);
}
function isMarketOrder(order) {
  return isOneOfVariant(order.orderType, ["market", "triggerMarket", "oracle"]);
}
function isLimitOrder(order) {
  return isOneOfVariant(order.orderType, ["limit", "triggerLimit"]);
}
function mustBeTriggered(order) {
  return isOneOfVariant(order.orderType, ["triggerMarket", "triggerLimit"]);
}
function isTriggered(order) {
  return isOneOfVariant(order.triggerCondition, [
    "triggeredAbove",
    "triggeredBelow"
  ]);
}

// src/math/insurance.ts
function stakeAmountToShares(amount, totalIfShares, insuranceFundVaultBalance) {
  let nShares;
  if (insuranceFundVaultBalance.gt(ZERO)) {
    nShares = amount.mul(totalIfShares).div(insuranceFundVaultBalance);
  } else {
    nShares = amount;
  }
  return nShares;
}
function unstakeSharesToAmount(nShares, totalIfShares, insuranceFundVaultBalance) {
  let amount;
  if (totalIfShares.gt(ZERO)) {
    amount = BN.max(
      ZERO,
      nShares.mul(insuranceFundVaultBalance).div(totalIfShares)
    );
  } else {
    amount = ZERO;
  }
  return amount;
}

// src/orderParams.ts
function getLimitOrderParams(params) {
  return Object.assign({}, params, {
    orderType: OrderType.LIMIT
  });
}
function getTriggerMarketOrderParams(params) {
  return Object.assign({}, params, {
    orderType: OrderType.TRIGGER_MARKET
  });
}
function getTriggerLimitOrderParams(params) {
  return Object.assign({}, params, {
    orderType: OrderType.TRIGGER_LIMIT
  });
}
function getMarketOrderParams(params) {
  return Object.assign({}, params, {
    orderType: OrderType.MARKET
  });
}

// src/slot/SlotSubscriber.ts
import { EventEmitter as EventEmitter10 } from "events";
var SlotSubscriber = class {
  constructor(connection, _config) {
    this.connection = connection;
    this.eventEmitter = new EventEmitter10();
  }
  async subscribe() {
    this.currentSlot = await this.connection.getSlot("confirmed");
    this.subscriptionId = this.connection.onSlotChange((slotInfo) => {
      this.currentSlot = slotInfo.slot;
      this.eventEmitter.emit("newSlot", slotInfo.slot);
    });
  }
  getSlot() {
    return this.currentSlot;
  }
  async unsubscribe() {
    if (this.subscriptionId) {
      await this.connection.removeSlotChangeListener(this.subscriptionId);
    }
  }
};

// src/serum/serumSubscriber.ts
import { Market, Orderbook } from "@project-serum/serum";
import { BN as BN19 } from "@project-serum/anchor";
var SerumSubscriber = class {
  constructor(config) {
    this.connection = config.connection;
    this.programId = config.programId;
    this.marketAddress = config.marketAddress;
    this.accountLoader = config.accountSubscription.accountLoader;
  }
  async subscribe() {
    if (this.subscribed) {
      return;
    }
    this.market = await Market.load(
      this.connection,
      this.marketAddress,
      void 0,
      this.programId
    );
    this.asksAddress = this.market.asksAddress;
    this.asks = await this.market.loadAsks(this.connection);
    this.asksCallbackId = await this.accountLoader.addAccount(
      this.asksAddress,
      (buffer, slot) => {
        this.lastAsksSlot = slot;
        this.asks = Orderbook.decode(this.market, buffer);
      }
    );
    this.bidsAddress = this.market.bidsAddress;
    this.bids = await this.market.loadBids(this.connection);
    this.bidsCallbackId = await this.accountLoader.addAccount(
      this.bidsAddress,
      (buffer, slot) => {
        this.lastBidsSlot = slot;
        this.bids = Orderbook.decode(this.market, buffer);
      }
    );
    this.subscribed = true;
  }
  getBestBid() {
    const bestBid = this.bids.getL2(1)[0];
    if (!bestBid) {
      return void 0;
    }
    return new BN19(bestBid[0] * PRICE_PRECISION.toNumber());
  }
  getBestAsk() {
    const bestAsk = this.asks.getL2(1)[0];
    if (!bestAsk) {
      return void 0;
    }
    return new BN19(bestAsk[0] * PRICE_PRECISION.toNumber());
  }
  async unsubscribe() {
    if (!this.subscribed) {
      return;
    }
    this.accountLoader.removeAccount(this.asksAddress, this.asksCallbackId);
    this.accountLoader.removeAccount(this.bidsAddress, this.bidsCallbackId);
    this.subscribed = false;
  }
};

// src/serum/serumFulfillmentConfigMap.ts
var SerumFulfillmentConfigMap = class {
  constructor(driftClient) {
    this.map = /* @__PURE__ */ new Map();
    this.driftClient = driftClient;
  }
  async add(marketIndex, serumMarketAddress) {
    const account = await this.driftClient.getSerumV3FulfillmentConfig(
      serumMarketAddress
    );
    this.map.set(marketIndex, account);
  }
  get(marketIndex) {
    return this.map.get(marketIndex);
  }
};

// src/util/computeUnits.ts
async function findComputeUnitConsumption(programId, connection, txSignature, commitment = "confirmed") {
  const tx = await connection.getTransaction(txSignature, { commitment });
  const computeUnits = [];
  const regex = new RegExp(
    `Program ${programId.toString()} consumed ([0-9]{0,6}) of ([0-9]{0,7}) compute units`
  );
  tx.meta.logMessages.forEach((logMessage) => {
    const match = logMessage.match(regex);
    if (match && match[1]) {
      computeUnits.push(match[1]);
    }
  });
  return computeUnits;
}

// src/util/tps.ts
async function estimateTps(programId, connection, failed) {
  let signatures = await connection.getSignaturesForAddress(
    programId,
    void 0,
    "finalized"
  );
  if (failed) {
    signatures = signatures.filter((signature) => signature.err);
  }
  const numberOfSignatures = signatures.length;
  if (numberOfSignatures === 0) {
    return 0;
  }
  return numberOfSignatures / (signatures[0].blockTime - signatures[numberOfSignatures - 1].blockTime);
}

// src/dlob/DLOBNode.ts
var OrderNode = class {
  constructor(order, userAccount) {
    this.haveFilled = false;
    this.haveTrigger = false;
    this.order = { ...order };
    this.userAccount = userAccount;
    this.sortValue = this.getSortValue(order);
  }
  getLabel() {
    let msg = `Order ${getOrderSignature(
      this.order.orderId,
      this.userAccount
    )}`;
    msg += ` ${isVariant(this.order.direction, "long") ? "LONG" : "SHORT"} `;
    msg += `${convertToNumber(
      this.order.baseAssetAmount,
      AMM_RESERVE_PRECISION
    ).toFixed(3)}`;
    if (this.order.price.gt(ZERO)) {
      msg += ` @ ${convertToNumber(this.order.price, PRICE_PRECISION).toFixed(
        3
      )}`;
    }
    if (this.order.triggerPrice.gt(ZERO)) {
      msg += ` ${isVariant(this.order.triggerCondition, "below") ? "BELOW" : "ABOVE"}`;
      msg += ` ${convertToNumber(
        this.order.triggerPrice,
        PRICE_PRECISION
      ).toFixed(3)}`;
    }
    return msg;
  }
  getPrice(oraclePriceData, slot) {
    return getLimitPrice(this.order, oraclePriceData, slot);
  }
  isBaseFilled() {
    return this.order.baseAssetAmountFilled.eq(this.order.baseAssetAmount);
  }
  isVammNode() {
    return false;
  }
};
var LimitOrderNode = class extends OrderNode {
  getSortValue(order) {
    return order.price;
  }
};
var FloatingLimitOrderNode = class extends OrderNode {
  getSortValue(order) {
    return new BN(order.oraclePriceOffset);
  }
};
var MarketOrderNode = class extends OrderNode {
  getSortValue(order) {
    return order.slot;
  }
};
var TriggerOrderNode = class extends OrderNode {
  getSortValue(order) {
    return order.triggerPrice;
  }
};
function createNode(nodeType, order, userAccount) {
  switch (nodeType) {
    case "floatingLimit":
      return new FloatingLimitOrderNode(order, userAccount);
    case "limit":
      return new LimitOrderNode(order, userAccount);
    case "market":
      return new MarketOrderNode(order, userAccount);
    case "trigger":
      return new TriggerOrderNode(order, userAccount);
    default:
      throw Error(`Unknown DLOBNode type ${nodeType}`);
  }
}

// src/dlob/NodeList.ts
function getOrderSignature(orderId, userAccount) {
  return `${userAccount.toString()}-${orderId.toString()}`;
}
var NodeList = class {
  constructor(nodeType, sortDirection) {
    this.nodeType = nodeType;
    this.sortDirection = sortDirection;
    this.length = 0;
    this.nodeMap = /* @__PURE__ */ new Map();
  }
  clear() {
    this.head = void 0;
    this.length = 0;
    this.nodeMap.clear();
  }
  insert(order, marketType, userAccount) {
    if (isVariant(order.status, "init")) {
      return;
    }
    const newNode = createNode(this.nodeType, order, userAccount);
    const orderSignature = getOrderSignature(order.orderId, userAccount);
    if (this.nodeMap.has(orderSignature)) {
      return;
    }
    this.nodeMap.set(orderSignature, newNode);
    this.length += 1;
    if (this.head === void 0) {
      this.head = newNode;
      return;
    }
    if (this.prependNode(this.head, newNode)) {
      this.head.previous = newNode;
      newNode.next = this.head;
      this.head = newNode;
      return;
    }
    let currentNode = this.head;
    while (currentNode.next !== void 0 && !this.prependNode(currentNode.next, newNode)) {
      currentNode = currentNode.next;
    }
    newNode.next = currentNode.next;
    if (currentNode.next !== void 0) {
      newNode.next.previous = newNode;
    }
    currentNode.next = newNode;
    newNode.previous = currentNode;
  }
  prependNode(currentNode, newNode) {
    const currentOrder = currentNode.order;
    const newOrder = newNode.order;
    const currentOrderSortPrice = currentNode.sortValue;
    const newOrderSortPrice = newNode.sortValue;
    if (newOrderSortPrice.eq(currentOrderSortPrice)) {
      return newOrder.slot.lt(currentOrder.slot);
    }
    if (this.sortDirection === "asc") {
      return newOrderSortPrice.lt(currentOrderSortPrice);
    } else {
      return newOrderSortPrice.gt(currentOrderSortPrice);
    }
  }
  update(order, userAccount) {
    const orderId = getOrderSignature(order.orderId, userAccount);
    if (this.nodeMap.has(orderId)) {
      const node = this.nodeMap.get(orderId);
      Object.assign(node.order, order);
      node.haveFilled = false;
    }
  }
  remove(order, userAccount) {
    const orderId = getOrderSignature(order.orderId, userAccount);
    if (this.nodeMap.has(orderId)) {
      const node = this.nodeMap.get(orderId);
      if (node.next) {
        node.next.previous = node.previous;
      }
      if (node.previous) {
        node.previous.next = node.next;
      }
      if (this.head && node.order.orderId === this.head.order.orderId) {
        this.head = node.next;
      }
      node.previous = void 0;
      node.next = void 0;
      this.nodeMap.delete(orderId);
      this.length--;
    }
  }
  *getGenerator() {
    let node = this.head;
    while (node !== void 0) {
      yield node;
      node = node.next;
    }
  }
  has(order, userAccount) {
    return this.nodeMap.has(getOrderSignature(order.orderId, userAccount));
  }
  get(orderId, userAccount) {
    return this.nodeMap.get(getOrderSignature(orderId, userAccount));
  }
  print() {
    let currentNode = this.head;
    while (currentNode !== void 0) {
      console.log(currentNode.getLabel());
      currentNode = currentNode.next;
    }
  }
  printTop() {
    if (this.head) {
      console.log(this.sortDirection.toUpperCase(), this.head.getLabel());
    } else {
      console.log("---");
    }
  }
};
function* getVammNodeGenerator(price) {
  if (!price) {
    return;
  }
  yield {
    getPrice: () => price,
    isVammNode: () => true,
    order: void 0,
    userAccount: void 0,
    isBaseFilled: () => false,
    haveFilled: false
  };
}

// src/dlob/DLOB.ts
var SUPPORTED_ORDER_TYPES = [
  "market",
  "limit",
  "triggerMarket",
  "triggerLimit",
  "oracle"
];
var DLOB = class {
  constructor() {
    this.openOrders = /* @__PURE__ */ new Map();
    this.orderLists = /* @__PURE__ */ new Map();
    this.initialized = false;
    this.init();
  }
  init() {
    this.openOrders.set("perp", /* @__PURE__ */ new Set());
    this.openOrders.set("spot", /* @__PURE__ */ new Set());
    this.orderLists.set("perp", /* @__PURE__ */ new Map());
    this.orderLists.set("spot", /* @__PURE__ */ new Map());
  }
  clear() {
    for (const marketType of this.openOrders.keys()) {
      this.openOrders.get(marketType).clear();
    }
    this.openOrders.clear();
    for (const marketType of this.orderLists.keys()) {
      for (const marketIndex of this.orderLists.get(marketType).keys()) {
        const marketNodeLists = this.orderLists.get(marketType).get(marketIndex);
        for (const side of Object.keys(marketNodeLists)) {
          for (const orderType of Object.keys(marketNodeLists[side])) {
            marketNodeLists[side][orderType].clear();
          }
        }
      }
    }
    this.orderLists.clear();
    this.init();
  }
  async initFromUserMap(userMap) {
    if (this.initialized) {
      return false;
    }
    for (const user of userMap.values()) {
      const userAccount = user.getUserAccount();
      const userAccountPubkey = user.getUserAccountPublicKey();
      for (const order of userAccount.orders) {
        this.insertOrder(order, userAccountPubkey);
      }
    }
    this.initialized = true;
    return true;
  }
  initFromOrders(dlobOrders) {
    if (this.initialized) {
      return false;
    }
    for (const { user, order } of dlobOrders) {
      this.insertOrder(order, user);
    }
    this.initialized = true;
    return true;
  }
  handleOrderRecord(record) {
    this.insertOrder(record.order, record.user);
  }
  handleOrderActionRecord(record) {
    if (isOneOfVariant(record.action, ["place", "expire"])) {
      return;
    }
    if (isVariant(record.action, "trigger")) {
      if (record.taker !== null) {
        const takerOrder = this.getOrder(record.takerOrderId, record.taker);
        if (takerOrder) {
          this.trigger(takerOrder, record.taker);
        }
      }
      if (record.maker !== null) {
        const makerOrder = this.getOrder(record.makerOrderId, record.maker);
        if (makerOrder) {
          this.trigger(makerOrder, record.maker);
        }
      }
    } else if (isVariant(record.action, "fill")) {
      if (record.taker !== null) {
        const takerOrder = this.getOrder(record.takerOrderId, record.taker);
        if (takerOrder) {
          this.updateOrder(
            takerOrder,
            record.taker,
            record.takerOrderCumulativeBaseAssetAmountFilled
          );
        }
      }
      if (record.maker !== null) {
        const makerOrder = this.getOrder(record.makerOrderId, record.maker);
        if (makerOrder) {
          this.updateOrder(
            makerOrder,
            record.maker,
            record.makerOrderCumulativeBaseAssetAmountFilled
          );
        }
      }
    } else if (isVariant(record.action, "cancel")) {
      if (record.taker !== null) {
        const takerOrder = this.getOrder(record.takerOrderId, record.taker);
        if (takerOrder) {
          this.delete(takerOrder, record.taker);
        }
      }
      if (record.maker !== null) {
        const makerOrder = this.getOrder(record.makerOrderId, record.maker);
        if (makerOrder) {
          this.delete(makerOrder, record.maker);
        }
      }
    }
  }
  insertOrder(order, userAccount, onInsert) {
    var _a;
    if (isVariant(order.status, "init")) {
      return;
    }
    if (!isOneOfVariant(order.orderType, SUPPORTED_ORDER_TYPES)) {
      return;
    }
    const marketType = getVariant(order.marketType);
    if (!this.orderLists.get(marketType).has(order.marketIndex)) {
      this.addOrderList(marketType, order.marketIndex);
    }
    if (isVariant(order.status, "open")) {
      this.openOrders.get(marketType).add(getOrderSignature(order.orderId, userAccount));
    }
    (_a = this.getListForOrder(order)) == null ? void 0 : _a.insert(order, marketType, userAccount);
    if (onInsert) {
      onInsert();
    }
  }
  addOrderList(marketType, marketIndex) {
    this.orderLists.get(marketType).set(marketIndex, {
      limit: {
        ask: new NodeList("limit", "asc"),
        bid: new NodeList("limit", "desc")
      },
      floatingLimit: {
        ask: new NodeList("floatingLimit", "asc"),
        bid: new NodeList("floatingLimit", "desc")
      },
      market: {
        ask: new NodeList("market", "asc"),
        bid: new NodeList("market", "asc")
      },
      trigger: {
        above: new NodeList("trigger", "asc"),
        below: new NodeList("trigger", "desc")
      }
    });
  }
  updateOrder(order, userAccount, cumulativeBaseAssetAmountFilled, onUpdate) {
    var _a;
    if (order.baseAssetAmount.eq(cumulativeBaseAssetAmountFilled)) {
      this.delete(order, userAccount);
      return;
    }
    if (order.baseAssetAmountFilled.eq(cumulativeBaseAssetAmountFilled)) {
      return;
    }
    const newOrder = {
      ...order
    };
    newOrder.baseAssetAmountFilled = cumulativeBaseAssetAmountFilled;
    (_a = this.getListForOrder(order)) == null ? void 0 : _a.update(newOrder, userAccount);
    if (onUpdate) {
      onUpdate();
    }
  }
  trigger(order, userAccount, onTrigger) {
    var _a;
    if (isVariant(order.status, "init")) {
      return;
    }
    if (isTriggered(order)) {
      return;
    }
    const marketType = getVariant(order.marketType);
    const triggerList = this.orderLists.get(marketType).get(order.marketIndex).trigger[isVariant(order.triggerCondition, "above") ? "above" : "below"];
    triggerList.remove(order, userAccount);
    (_a = this.getListForOrder(order)) == null ? void 0 : _a.insert(order, marketType, userAccount);
    if (onTrigger) {
      onTrigger();
    }
  }
  delete(order, userAccount, onDelete) {
    var _a;
    if (isVariant(order.status, "init")) {
      return;
    }
    (_a = this.getListForOrder(order)) == null ? void 0 : _a.remove(order, userAccount);
    if (onDelete) {
      onDelete();
    }
  }
  getListForOrder(order) {
    const isInactiveTriggerOrder = mustBeTriggered(order) && !isTriggered(order);
    let type;
    if (isInactiveTriggerOrder) {
      type = "trigger";
    } else if (isOneOfVariant(order.orderType, ["market", "triggerMarket", "oracle"])) {
      type = "market";
    } else if (order.oraclePriceOffset !== 0) {
      type = "floatingLimit";
    } else {
      type = "limit";
    }
    let subType;
    if (isInactiveTriggerOrder) {
      subType = isVariant(order.triggerCondition, "above") ? "above" : "below";
    } else {
      subType = isVariant(order.direction, "long") ? "bid" : "ask";
    }
    const marketType = getVariant(order.marketType);
    if (!this.orderLists.has(marketType)) {
      return void 0;
    }
    return this.orderLists.get(marketType).get(order.marketIndex)[type][subType];
  }
  getOrder(orderId, userAccount) {
    for (const nodeList of this.getNodeLists()) {
      const node = nodeList.get(orderId, userAccount);
      if (node) {
        return node.order;
      }
    }
    return void 0;
  }
  findNodesToFill(marketIndex, fallbackBid, fallbackAsk, slot, ts, marketType, oraclePriceData, stateAccount, marketAccount) {
    if (fillPaused(stateAccount, marketAccount)) {
      return [];
    }
    const isAmmPaused = ammPaused(stateAccount, marketAccount);
    const marketOrderNodesToFill = this.findMarketNodesToFill(
      marketIndex,
      slot,
      marketType,
      oraclePriceData,
      isAmmPaused,
      fallbackAsk,
      fallbackBid
    );
    const limitOrderNodesToFill = this.findLimitOrderNodesToFill(
      marketIndex,
      slot,
      marketType,
      oraclePriceData,
      isAmmPaused,
      fallbackAsk,
      fallbackBid
    );
    const expiredNodesToFill = this.findExpiredNodesToFill(
      marketIndex,
      ts,
      marketType
    );
    return marketOrderNodesToFill.concat(
      limitOrderNodesToFill,
      expiredNodesToFill
    );
  }
  findLimitOrderNodesToFill(marketIndex, slot, marketType, oraclePriceData, isAmmPaused, fallbackAsk, fallbackBid) {
    const nodesToFill = new Array();
    const crossingNodes = this.findCrossingLimitOrders(
      marketIndex,
      slot,
      marketType,
      oraclePriceData
    );
    for (const crossingNode of crossingNodes) {
      nodesToFill.push(crossingNode);
    }
    if (fallbackBid && !isAmmPaused) {
      const askGenerator = this.getLimitAsks(
        marketIndex,
        slot,
        marketType,
        oraclePriceData
      );
      const asksCrossingFallback = this.findNodesCrossingFallbackLiquidity(
        marketType,
        slot,
        oraclePriceData,
        askGenerator,
        fallbackBid,
        (askPrice, fallbackPrice) => {
          return askPrice.lte(fallbackPrice);
        }
      );
      for (const askCrossingFallback of asksCrossingFallback) {
        nodesToFill.push(askCrossingFallback);
      }
    }
    if (fallbackAsk && !isAmmPaused) {
      const bidGenerator = this.getLimitBids(
        marketIndex,
        slot,
        marketType,
        oraclePriceData
      );
      const bidsCrossingFallback = this.findNodesCrossingFallbackLiquidity(
        marketType,
        slot,
        oraclePriceData,
        bidGenerator,
        fallbackAsk,
        (bidPrice, fallbackPrice) => {
          return bidPrice.gte(fallbackPrice);
        }
      );
      for (const bidCrossingFallback of bidsCrossingFallback) {
        nodesToFill.push(bidCrossingFallback);
      }
    }
    return nodesToFill;
  }
  findMarketNodesToFill(marketIndex, slot, marketType, oraclePriceData, isAmmPaused, fallbackAsk, fallbackBid) {
    const nodesToFill = new Array();
    let marketOrderGenerator = this.getMarketAsks(marketIndex, marketType);
    const marketAsksCrossingBids = this.findMarketNodesCrossingLimitNodes(
      marketIndex,
      slot,
      marketType,
      oraclePriceData,
      marketOrderGenerator,
      this.getLimitBids.bind(this),
      (takerPrice, makerPrice) => {
        return takerPrice === void 0 || takerPrice.lte(makerPrice);
      }
    );
    for (const marketAskCrossingBid of marketAsksCrossingBids) {
      nodesToFill.push(marketAskCrossingBid);
    }
    if (fallbackBid && !isAmmPaused) {
      marketOrderGenerator = this.getMarketAsks(marketIndex, marketType);
      const marketAsksCrossingFallback = this.findNodesCrossingFallbackLiquidity(
        marketType,
        slot,
        oraclePriceData,
        marketOrderGenerator,
        fallbackBid,
        (takerPrice, fallbackPrice) => {
          return takerPrice === void 0 || takerPrice.lte(fallbackPrice);
        }
      );
      for (const marketAskCrossingFallback of marketAsksCrossingFallback) {
        nodesToFill.push(marketAskCrossingFallback);
      }
    }
    marketOrderGenerator = this.getMarketBids(marketIndex, marketType);
    const marketBidsToFill = this.findMarketNodesCrossingLimitNodes(
      marketIndex,
      slot,
      marketType,
      oraclePriceData,
      marketOrderGenerator,
      this.getLimitAsks.bind(this),
      (takerPrice, fallbackPrice) => {
        return takerPrice === void 0 || takerPrice.gte(fallbackPrice);
      }
    );
    for (const marketBidToFill of marketBidsToFill) {
      nodesToFill.push(marketBidToFill);
    }
    if (fallbackAsk && !isAmmPaused) {
      marketOrderGenerator = this.getMarketBids(marketIndex, marketType);
      const marketBidsCrossingFallback = this.findNodesCrossingFallbackLiquidity(
        marketType,
        slot,
        oraclePriceData,
        marketOrderGenerator,
        fallbackAsk,
        (takerPrice, fallbackPrice) => {
          return takerPrice === void 0 || takerPrice.gte(fallbackPrice);
        }
      );
      for (const marketBidCrossingFallback of marketBidsCrossingFallback) {
        nodesToFill.push(marketBidCrossingFallback);
      }
    }
    return nodesToFill;
  }
  findMarketNodesCrossingLimitNodes(marketIndex, slot, marketType, oraclePriceData, takerNodeGenerator, makerNodeGeneratorFn, doesCross) {
    const nodesToFill = new Array();
    for (const takerNode of takerNodeGenerator) {
      const makerNodeGenerator = makerNodeGeneratorFn(
        marketIndex,
        slot,
        marketType,
        oraclePriceData
      );
      for (const makerNode of makerNodeGenerator) {
        const sameUser = takerNode.userAccount.equals(makerNode.userAccount);
        if (sameUser) {
          continue;
        }
        const makerPrice = makerNode.getPrice(oraclePriceData, slot);
        const takerPrice = takerNode.getPrice(oraclePriceData, slot);
        const ordersCross = doesCross(takerPrice, makerPrice);
        if (!ordersCross) {
          break;
        }
        nodesToFill.push({
          node: takerNode,
          makerNode
        });
        const makerOrder = makerNode.order;
        const takerOrder = takerNode.order;
        const makerBaseRemaining = makerOrder.baseAssetAmount.sub(
          makerOrder.baseAssetAmountFilled
        );
        const takerBaseRemaining = takerOrder.baseAssetAmount.sub(
          takerOrder.baseAssetAmountFilled
        );
        const baseFilled = BN.min(makerBaseRemaining, takerBaseRemaining);
        const newMakerOrder = { ...makerOrder };
        newMakerOrder.baseAssetAmountFilled = makerOrder.baseAssetAmountFilled.add(baseFilled);
        this.getListForOrder(newMakerOrder).update(
          newMakerOrder,
          makerNode.userAccount
        );
        const newTakerOrder = { ...takerOrder };
        newTakerOrder.baseAssetAmountFilled = takerOrder.baseAssetAmountFilled.add(baseFilled);
        this.getListForOrder(newTakerOrder).update(
          newTakerOrder,
          takerNode.userAccount
        );
        if (newTakerOrder.baseAssetAmountFilled.eq(takerOrder.baseAssetAmount)) {
          break;
        }
      }
    }
    return nodesToFill;
  }
  findNodesCrossingFallbackLiquidity(marketType, slot, oraclePriceData, nodeGenerator, fallbackPrice, doesCross) {
    var _a;
    const nodesToFill = new Array();
    let nextNode = nodeGenerator.next();
    while (!nextNode.done) {
      const node = nextNode.value;
      if (isVariant(marketType, "spot") && ((_a = node.order) == null ? void 0 : _a.postOnly)) {
        nextNode = nodeGenerator.next();
        continue;
      }
      const nodePrice = getLimitPrice(node.order, oraclePriceData, slot);
      const crosses = doesCross(nodePrice, fallbackPrice);
      const fallbackAvailable = isVariant(marketType, "spot") || isAuctionComplete(node.order, slot);
      if (crosses && fallbackAvailable) {
        nodesToFill.push({
          node,
          makerNode: void 0
        });
      }
      nextNode = nodeGenerator.next();
    }
    return nodesToFill;
  }
  findExpiredNodesToFill(marketIndex, ts, marketType) {
    const nodesToFill = new Array();
    const marketTypeStr = getVariant(marketType);
    const nodeLists = this.orderLists.get(marketTypeStr).get(marketIndex);
    if (!nodeLists) {
      return nodesToFill;
    }
    const bidGenerators = [
      nodeLists.limit.bid.getGenerator(),
      nodeLists.floatingLimit.bid.getGenerator(),
      nodeLists.market.bid.getGenerator()
    ];
    const askGenerators = [
      nodeLists.limit.ask.getGenerator(),
      nodeLists.floatingLimit.ask.getGenerator(),
      nodeLists.market.ask.getGenerator()
    ];
    for (const bidGenerator of bidGenerators) {
      for (const bid of bidGenerator) {
        if (isOrderExpired(bid.order, ts)) {
          nodesToFill.push({
            node: bid
          });
        }
      }
    }
    for (const askGenerator of askGenerators) {
      for (const ask of askGenerator) {
        if (isOrderExpired(ask.order, ts)) {
          nodesToFill.push({
            node: ask
          });
        }
      }
    }
    return nodesToFill;
  }
  findJitAuctionNodesToFill(marketIndex, slot, marketType) {
    const nodesToFill = new Array();
    for (const marketBid of this.getMarketBids(marketIndex, marketType)) {
      if (!isAuctionComplete(marketBid.order, slot)) {
        nodesToFill.push({
          node: marketBid
        });
      }
    }
    for (const marketAsk of this.getMarketAsks(marketIndex, marketType)) {
      if (!isAuctionComplete(marketAsk.order, slot)) {
        nodesToFill.push({
          node: marketAsk
        });
      }
    }
    return nodesToFill;
  }
  *getMarketBids(marketIndex, marketType) {
    const marketTypeStr = getVariant(marketType);
    const orderLists = this.orderLists.get(marketTypeStr).get(marketIndex);
    if (!orderLists) {
      return;
    }
    const generator = orderLists.market.bid.getGenerator();
    for (const marketBidNode of generator) {
      if (marketBidNode.isBaseFilled()) {
        continue;
      }
      yield marketBidNode;
    }
  }
  *getMarketAsks(marketIndex, marketType) {
    const marketTypeStr = getVariant(marketType);
    const orderLists = this.orderLists.get(marketTypeStr).get(marketIndex);
    if (!orderLists) {
      return;
    }
    const generator = orderLists.market.ask.getGenerator();
    for (const marketAskNode of generator) {
      if (marketAskNode.isBaseFilled()) {
        continue;
      }
      yield marketAskNode;
    }
  }
  *getBestNode(generatorList, oraclePriceData, slot, compareFcn) {
    const generators = generatorList.map((generator) => {
      return {
        next: generator.next(),
        generator
      };
    });
    let sideExhausted = false;
    while (!sideExhausted) {
      const bestGenerator = generators.reduce(
        (bestGenerator2, currentGenerator) => {
          if (currentGenerator.next.done) {
            return bestGenerator2;
          }
          if (bestGenerator2.next.done) {
            return currentGenerator;
          }
          const bestValue = bestGenerator2.next.value;
          const currentValue = currentGenerator.next.value;
          if (bestValue.order && isMarketOrder(bestValue.order)) {
            return bestGenerator2;
          }
          if (currentValue.order && isMarketOrder(currentValue.order)) {
            return currentGenerator;
          }
          const bestPrice = bestValue.getPrice(oraclePriceData, slot);
          const currentPrice = currentValue.getPrice(oraclePriceData, slot);
          return compareFcn(bestPrice, currentPrice) ? bestGenerator2 : currentGenerator;
        }
      );
      if (!bestGenerator.next.done) {
        if (bestGenerator.next.value.isBaseFilled()) {
          bestGenerator.next = bestGenerator.generator.next();
          continue;
        }
        yield bestGenerator.next.value;
        bestGenerator.next = bestGenerator.generator.next();
      } else {
        sideExhausted = true;
      }
    }
  }
  *getLimitAsks(marketIndex, slot, marketType, oraclePriceData) {
    if (isVariant(marketType, "spot") && !oraclePriceData) {
      throw new Error("Must provide OraclePriceData to get spot asks");
    }
    const marketTypeStr = getVariant(marketType);
    const nodeLists = this.orderLists.get(marketTypeStr).get(marketIndex);
    if (!nodeLists) {
      return;
    }
    const generatorList = [
      nodeLists.limit.ask.getGenerator(),
      nodeLists.floatingLimit.ask.getGenerator()
    ];
    yield* this.getBestNode(
      generatorList,
      oraclePriceData,
      slot,
      (bestPrice, currentPrice) => {
        return bestPrice.lt(currentPrice);
      }
    );
  }
  *getLimitBids(marketIndex, slot, marketType, oraclePriceData) {
    if (isVariant(marketType, "spot") && !oraclePriceData) {
      throw new Error("Must provide OraclePriceData to get spot bids");
    }
    const marketTypeStr = getVariant(marketType);
    const nodeLists = this.orderLists.get(marketTypeStr).get(marketIndex);
    if (!nodeLists) {
      return;
    }
    const generatorList = [
      nodeLists.limit.bid.getGenerator(),
      nodeLists.floatingLimit.bid.getGenerator()
    ];
    yield* this.getBestNode(
      generatorList,
      oraclePriceData,
      slot,
      (bestPrice, currentPrice) => {
        return bestPrice.gt(currentPrice);
      }
    );
  }
  *getAsks(marketIndex, fallbackAsk, slot, marketType, oraclePriceData) {
    if (isVariant(marketType, "spot") && !oraclePriceData) {
      throw new Error("Must provide OraclePriceData to get spot asks");
    }
    const generatorList = [
      this.getMarketAsks(marketIndex, marketType),
      this.getLimitAsks(marketIndex, slot, marketType, oraclePriceData)
    ];
    const marketTypeStr = getVariant(marketType);
    if (marketTypeStr === "perp" && fallbackAsk) {
      generatorList.push(getVammNodeGenerator(fallbackAsk));
    }
    yield* this.getBestNode(
      generatorList,
      oraclePriceData,
      slot,
      (bestPrice, currentPrice) => {
        return bestPrice.lt(currentPrice);
      }
    );
  }
  *getBids(marketIndex, fallbackBid, slot, marketType, oraclePriceData) {
    if (isVariant(marketType, "spot") && !oraclePriceData) {
      throw new Error("Must provide OraclePriceData to get spot bids");
    }
    const generatorList = [
      this.getMarketBids(marketIndex, marketType),
      this.getLimitBids(marketIndex, slot, marketType, oraclePriceData)
    ];
    const marketTypeStr = getVariant(marketType);
    if (marketTypeStr === "perp" && fallbackBid) {
      generatorList.push(getVammNodeGenerator(fallbackBid));
    }
    yield* this.getBestNode(
      generatorList,
      oraclePriceData,
      slot,
      (bestPrice, currentPrice) => {
        return bestPrice.gt(currentPrice);
      }
    );
  }
  findCrossingLimitOrders(marketIndex, slot, marketType, oraclePriceData) {
    const nodesToFill = new Array();
    for (const askNode of this.getLimitAsks(
      marketIndex,
      slot,
      marketType,
      oraclePriceData
    )) {
      for (const bidNode of this.getLimitBids(
        marketIndex,
        slot,
        marketType,
        oraclePriceData
      )) {
        const bidPrice = bidNode.getPrice(oraclePriceData, slot);
        const askPrice = askNode.getPrice(oraclePriceData, slot);
        if (bidPrice.lt(askPrice)) {
          return nodesToFill;
        }
        const bidOrder = bidNode.order;
        const askOrder = askNode.order;
        const sameUser = bidNode.userAccount.equals(askNode.userAccount);
        if (sameUser || bidOrder.postOnly && askOrder.postOnly) {
          continue;
        }
        const { takerNode, makerNode } = this.determineMakerAndTaker(
          askNode,
          bidNode
        );
        const bidBaseRemaining = bidOrder.baseAssetAmount.sub(
          bidOrder.baseAssetAmountFilled
        );
        const askBaseRemaining = askOrder.baseAssetAmount.sub(
          askOrder.baseAssetAmountFilled
        );
        const baseFilled = BN.min(bidBaseRemaining, askBaseRemaining);
        const newBidOrder = { ...bidOrder };
        newBidOrder.baseAssetAmountFilled = bidOrder.baseAssetAmountFilled.add(baseFilled);
        this.getListForOrder(newBidOrder).update(
          newBidOrder,
          bidNode.userAccount
        );
        const newAskOrder = { ...askOrder };
        newAskOrder.baseAssetAmountFilled = askOrder.baseAssetAmountFilled.add(baseFilled);
        this.getListForOrder(newAskOrder).update(
          newAskOrder,
          askNode.userAccount
        );
        nodesToFill.push({
          node: takerNode,
          makerNode
        });
        if (newAskOrder.baseAssetAmount.eq(newAskOrder.baseAssetAmountFilled)) {
          break;
        }
      }
    }
    return nodesToFill;
  }
  determineMakerAndTaker(askNode, bidNode) {
    if (bidNode.order.postOnly) {
      return {
        takerNode: askNode,
        makerNode: bidNode
      };
    } else if (askNode.order.postOnly) {
      return {
        takerNode: bidNode,
        makerNode: askNode
      };
    } else if (askNode.order.slot.lt(bidNode.order.slot)) {
      return {
        takerNode: bidNode,
        makerNode: askNode
      };
    } else {
      return {
        takerNode: askNode,
        makerNode: bidNode
      };
    }
  }
  getBestAsk(marketIndex, fallbackAsk, slot, marketType, oraclePriceData) {
    return this.getAsks(
      marketIndex,
      fallbackAsk,
      slot,
      marketType,
      oraclePriceData
    ).next().value.getPrice(oraclePriceData, slot);
  }
  getBestBid(marketIndex, fallbackBid, slot, marketType, oraclePriceData) {
    return this.getBids(
      marketIndex,
      fallbackBid,
      slot,
      marketType,
      oraclePriceData
    ).next().value.getPrice(oraclePriceData, slot);
  }
  findNodesToTrigger(marketIndex, slot, oraclePrice, marketType, stateAccount) {
    if (exchangePaused(stateAccount)) {
      return [];
    }
    const nodesToTrigger = [];
    const marketTypeStr = getVariant(marketType);
    const marketNodeLists = this.orderLists.get(marketTypeStr).get(marketIndex);
    const triggerAboveList = marketNodeLists ? marketNodeLists.trigger.above : void 0;
    if (triggerAboveList) {
      for (const node of triggerAboveList.getGenerator()) {
        if (oraclePrice.gt(node.order.triggerPrice)) {
          if (isAuctionComplete(node.order, slot)) {
            nodesToTrigger.push({
              node
            });
          }
        } else {
          break;
        }
      }
    }
    const triggerBelowList = marketNodeLists ? marketNodeLists.trigger.below : void 0;
    if (triggerBelowList) {
      for (const node of triggerBelowList.getGenerator()) {
        if (oraclePrice.lt(node.order.triggerPrice)) {
          if (isAuctionComplete(node.order, slot)) {
            nodesToTrigger.push({
              node
            });
          }
        } else {
          break;
        }
      }
    }
    return nodesToTrigger;
  }
  printTopOfOrderLists(sdkConfig, driftClient, slotSubscriber, marketIndex, marketType) {
    if (isVariant(marketType, "perp")) {
      const market = driftClient.getPerpMarketAccount(marketIndex);
      const slot = slotSubscriber.getSlot();
      const oraclePriceData = driftClient.getOracleDataForPerpMarket(marketIndex);
      const fallbackAsk = calculateAskPrice(market, oraclePriceData);
      const fallbackBid = calculateBidPrice(market, oraclePriceData);
      const bestAsk = this.getBestAsk(
        marketIndex,
        fallbackAsk,
        slot,
        marketType,
        oraclePriceData
      );
      const bestBid = this.getBestBid(
        marketIndex,
        fallbackBid,
        slot,
        marketType,
        oraclePriceData
      );
      const mid = bestAsk.add(bestBid).div(new BN(2));
      const bidSpread = (convertToNumber(bestBid, PRICE_PRECISION) / convertToNumber(oraclePriceData.price, PRICE_PRECISION) - 1) * 100;
      const askSpread = (convertToNumber(bestAsk, PRICE_PRECISION) / convertToNumber(oraclePriceData.price, PRICE_PRECISION) - 1) * 100;
      console.log(`Market ${sdkConfig.MARKETS[marketIndex].symbol} Orders`);
      console.log(
        `  Ask`,
        convertToNumber(bestAsk, PRICE_PRECISION).toFixed(3),
        `(${askSpread.toFixed(4)}%)`
      );
      console.log(`  Mid`, convertToNumber(mid, PRICE_PRECISION).toFixed(3));
      console.log(
        `  Bid`,
        convertToNumber(bestBid, PRICE_PRECISION).toFixed(3),
        `(${bidSpread.toFixed(4)}%)`
      );
    } else if (isVariant(marketType, "spot")) {
      const slot = slotSubscriber.getSlot();
      const oraclePriceData = driftClient.getOracleDataForPerpMarket(marketIndex);
      const bestAsk = this.getBestAsk(
        marketIndex,
        void 0,
        slot,
        marketType,
        oraclePriceData
      );
      const bestBid = this.getBestBid(
        marketIndex,
        void 0,
        slot,
        marketType,
        oraclePriceData
      );
      const mid = bestAsk.add(bestBid).div(new BN(2));
      const bidSpread = (convertToNumber(bestBid, PRICE_PRECISION) / convertToNumber(oraclePriceData.price, PRICE_PRECISION) - 1) * 100;
      const askSpread = (convertToNumber(bestAsk, PRICE_PRECISION) / convertToNumber(oraclePriceData.price, PRICE_PRECISION) - 1) * 100;
      console.log(`Market ${sdkConfig.MARKETS[marketIndex].symbol} Orders`);
      console.log(
        `  Ask`,
        convertToNumber(bestAsk, PRICE_PRECISION).toFixed(3),
        `(${askSpread.toFixed(4)}%)`
      );
      console.log(`  Mid`, convertToNumber(mid, PRICE_PRECISION).toFixed(3));
      console.log(
        `  Bid`,
        convertToNumber(bestBid, PRICE_PRECISION).toFixed(3),
        `(${bidSpread.toFixed(4)}%)`
      );
    }
  }
  getDLOBOrders() {
    const dlobOrders = [];
    for (const nodeList of this.getNodeLists()) {
      for (const node of nodeList.getGenerator()) {
        dlobOrders.push({
          user: node.userAccount,
          order: node.order
        });
      }
    }
    return dlobOrders;
  }
  *getNodeLists() {
    for (const [_, nodeLists] of this.orderLists.get("perp")) {
      yield nodeLists.limit.bid;
      yield nodeLists.limit.ask;
      yield nodeLists.market.bid;
      yield nodeLists.market.ask;
      yield nodeLists.floatingLimit.bid;
      yield nodeLists.floatingLimit.ask;
      yield nodeLists.trigger.above;
      yield nodeLists.trigger.below;
    }
    for (const [_, nodeLists] of this.orderLists.get("spot")) {
      yield nodeLists.limit.bid;
      yield nodeLists.limit.ask;
      yield nodeLists.market.bid;
      yield nodeLists.market.ask;
      yield nodeLists.floatingLimit.bid;
      yield nodeLists.floatingLimit.ask;
      yield nodeLists.trigger.above;
      yield nodeLists.trigger.below;
    }
  }
};

// src/dlob/DLOBOrders.ts
import { IdlCoder } from "@project-serum/anchor/dist/cjs/coder/borsh/idl";

// src/dlob/dlobIdl.json
var dlobIdl_default = {
  version: "2.0.0",
  name: "dlob",
  instructions: [],
  accounts: [],
  types: [
    {
      name: "DLOBOrders",
      type: {
        vec: {
          defined: "DLOBOrder"
        }
      }
    },
    {
      name: "DLOBOrder",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "publicKey"
          },
          {
            name: "order",
            type: {
              defined: "Order"
            }
          }
        ]
      }
    },
    {
      name: "Order",
      type: {
        kind: "struct",
        fields: [
          {
            name: "slot",
            type: "u64"
          },
          {
            name: "price",
            type: "u64"
          },
          {
            name: "baseAssetAmount",
            type: "u64"
          },
          {
            name: "baseAssetAmountFilled",
            type: "u64"
          },
          {
            name: "quoteAssetAmountFilled",
            type: "u64"
          },
          {
            name: "triggerPrice",
            type: "u64"
          },
          {
            name: "auctionStartPrice",
            type: "u64"
          },
          {
            name: "auctionEndPrice",
            type: "u64"
          },
          {
            name: "maxTs",
            type: "i64"
          },
          {
            name: "oraclePriceOffset",
            type: "i32"
          },
          {
            name: "orderId",
            type: "u32"
          },
          {
            name: "marketIndex",
            type: "u16"
          },
          {
            name: "status",
            type: {
              defined: "OrderStatus"
            }
          },
          {
            name: "orderType",
            type: {
              defined: "OrderType"
            }
          },
          {
            name: "marketType",
            type: {
              defined: "MarketType"
            }
          },
          {
            name: "userOrderId",
            type: "u8"
          },
          {
            name: "existingPositionDirection",
            type: {
              defined: "PositionDirection"
            }
          },
          {
            name: "direction",
            type: {
              defined: "PositionDirection"
            }
          },
          {
            name: "reduceOnly",
            type: "bool"
          },
          {
            name: "postOnly",
            type: "bool"
          },
          {
            name: "immediateOrCancel",
            type: "bool"
          },
          {
            name: "triggerCondition",
            type: {
              defined: "OrderTriggerCondition"
            }
          },
          {
            name: "auctionDuration",
            type: "u8"
          },
          {
            name: "padding",
            type: {
              array: [
                "u8",
                3
              ]
            }
          }
        ]
      }
    },
    {
      name: "OrderStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Init"
          },
          {
            name: "Open"
          },
          {
            name: "Filled"
          },
          {
            name: "Canceled"
          }
        ]
      }
    },
    {
      name: "OrderType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Market"
          },
          {
            name: "Limit"
          },
          {
            name: "TriggerMarket"
          },
          {
            name: "TriggerLimit"
          },
          {
            name: "Oracle"
          }
        ]
      }
    },
    {
      name: "OrderTriggerCondition",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Above"
          },
          {
            name: "Below"
          },
          {
            name: "TriggeredAbove"
          },
          {
            name: "TriggeredBelow"
          }
        ]
      }
    },
    {
      name: "MarketType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Spot"
          },
          {
            name: "Perp"
          }
        ]
      }
    },
    {
      name: "PositionDirection",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Long"
          },
          {
            name: "Short"
          }
        ]
      }
    }
  ],
  events: [],
  errors: []
};

// src/dlob/DLOBOrders.ts
var DLOBOrdersCoder = class {
  constructor(idl) {
    this.idl = idl;
  }
  static create() {
    return new DLOBOrdersCoder(dlobIdl_default);
  }
  encode(dlobOrders) {
    const layout = IdlCoder.fieldLayout(
      {
        type: {
          vec: {
            defined: "DLOBOrder"
          }
        }
      },
      this.idl.types
    );
    const size = 150 * dlobOrders.length;
    const buffer = Buffer.alloc(size);
    const len = layout.encode(dlobOrders, buffer);
    return buffer.slice(0, len);
  }
  decode(buffer) {
    const layout = IdlCoder.fieldLayout(
      {
        type: {
          vec: {
            defined: "DLOBOrder"
          }
        }
      },
      this.idl.types
    );
    return layout.decode(buffer);
  }
};

// src/userMap/userMap.ts
import { PublicKey as PublicKey12 } from "@solana/web3.js";
var UserMap2 = class {
  constructor(driftClient, accountSubscription) {
    this.userMap = /* @__PURE__ */ new Map();
    this.driftClient = driftClient;
    this.accountSubscription = accountSubscription;
  }
  async fetchAllUsers() {
    const userArray = [];
    const programUserAccounts = await this.driftClient.program.account.user.all();
    for (const programUserAccount of programUserAccounts) {
      if (this.userMap.has(programUserAccount.publicKey.toString())) {
        continue;
      }
      const user = new User({
        driftClient: this.driftClient,
        userAccountPublicKey: programUserAccount.publicKey,
        accountSubscription: this.accountSubscription
      });
      userArray.push(user);
    }
    if (this.accountSubscription.type === "polling") {
      await bulkPollingUserSubscribe(
        userArray,
        this.accountSubscription.accountLoader
      );
    }
    for (const user of userArray) {
      this.userMap.set(user.getUserAccountPublicKey().toString(), user);
    }
  }
  async addPubkey(userAccountPublicKey) {
    const user = new User({
      driftClient: this.driftClient,
      userAccountPublicKey,
      accountSubscription: this.accountSubscription
    });
    await user.subscribe();
    this.userMap.set(userAccountPublicKey.toString(), user);
  }
  has(key) {
    return this.userMap.has(key);
  }
  get(key) {
    return this.userMap.get(key);
  }
  async mustGet(key) {
    if (!this.has(key)) {
      await this.addPubkey(new PublicKey12(key));
    }
    const user = this.userMap.get(key);
    await user.fetchAccounts();
    return user;
  }
  getUserAuthority(key) {
    const chUser = this.userMap.get(key);
    if (!chUser) {
      return void 0;
    }
    return chUser.getUserAccount().authority;
  }
  async updateWithOrderRecord(record) {
    if (!this.has(record.user.toString())) {
      await this.addPubkey(record.user);
    }
  }
  async updateWithEventRecord(record) {
    if (record.eventType === "DepositRecord") {
      const depositRecord = record;
      await this.mustGet(depositRecord.user.toString());
    } else if (record.eventType === "FundingPaymentRecord") {
      const fundingPaymentRecord = record;
      await this.mustGet(fundingPaymentRecord.user.toString());
    } else if (record.eventType === "LiquidationRecord") {
      const liqRecord = record;
      await this.mustGet(liqRecord.user.toString());
      await this.mustGet(liqRecord.liquidator.toString());
    } else if (record.eventType === "OrderRecord") {
      const orderRecord = record;
      await this.updateWithOrderRecord(orderRecord);
    } else if (record.eventType === "OrderActionRecord") {
      const actionRecord = record;
      if (actionRecord.taker) {
        await this.mustGet(actionRecord.taker.toString());
      }
      if (actionRecord.maker) {
        await this.mustGet(actionRecord.maker.toString());
      }
    } else if (record.eventType === "SettlePnlRecord") {
      const settlePnlRecord = record;
      await this.mustGet(settlePnlRecord.user.toString());
    } else if (record.eventType === "NewUserRecord") {
      const newUserRecord = record;
      await this.mustGet(newUserRecord.user.toString());
    } else if (record.eventType === "LPRecord") {
      const lpRecord = record;
      await this.mustGet(lpRecord.user.toString());
    }
  }
  values() {
    return this.userMap.values();
  }
  size() {
    return this.userMap.size;
  }
};

// src/userMap/userStatsMap.ts
import { PublicKey as PublicKey13 } from "@solana/web3.js";
var UserStatsMap = class {
  constructor(driftClient, accountSubscription) {
    this.userStatsMap = /* @__PURE__ */ new Map();
    this.driftClient = driftClient;
    this.accountSubscription = accountSubscription;
  }
  async fetchAllUserStats() {
    const userStatArray = [];
    const programUserAccounts = await this.driftClient.program.account.userStats.all();
    for (const programUserAccount of programUserAccounts) {
      const userStat = programUserAccount.account;
      if (this.userStatsMap.has(userStat.authority.toString())) {
        continue;
      }
      const chUserStat = new UserStats({
        driftClient: this.driftClient,
        userStatsAccountPublicKey: getUserStatsAccountPublicKey(
          this.driftClient.program.programId,
          userStat.authority
        ),
        accountSubscription: this.accountSubscription
      });
      userStatArray.push(chUserStat);
    }
    if (this.accountSubscription.type === "polling") {
      await bulkPollingUserStatsSubscribe(
        userStatArray,
        this.accountSubscription.accountLoader
      );
    }
    for (const userStat of userStatArray) {
      this.userStatsMap.set(
        userStat.getAccount().authority.toString(),
        userStat
      );
    }
  }
  async addUserStat(authority) {
    const userStat = new UserStats({
      driftClient: this.driftClient,
      userStatsAccountPublicKey: getUserStatsAccountPublicKey(
        this.driftClient.program.programId,
        authority
      ),
      accountSubscription: this.accountSubscription
    });
    await userStat.subscribe();
    this.userStatsMap.set(authority.toString(), userStat);
  }
  async updateWithOrderRecord(record, userMap) {
    const user = await userMap.mustGet(record.user.toString());
    if (!this.has(user.getUserAccount().authority.toString())) {
      this.addUserStat(user.getUserAccount().authority);
    }
  }
  async updateWithEventRecord(record, userMap) {
    if (record.eventType === "DepositRecord") {
      const depositRecord = record;
      await this.mustGet(depositRecord.userAuthority.toString());
    } else if (record.eventType === "FundingPaymentRecord") {
      const fundingPaymentRecord = record;
      await this.mustGet(fundingPaymentRecord.userAuthority.toString());
    } else if (record.eventType === "LiquidationRecord") {
      if (!userMap) {
        return;
      }
      const liqRecord = record;
      const user = await userMap.mustGet(liqRecord.user.toString());
      await this.mustGet(user.getUserAccount().authority.toString());
      const liquidatorUser = await userMap.mustGet(
        liqRecord.liquidator.toString()
      );
      await this.mustGet(liquidatorUser.getUserAccount().authority.toString());
    } else if (record.eventType === "OrderRecord") {
      if (!userMap) {
        return;
      }
      const orderRecord = record;
      await userMap.updateWithOrderRecord(orderRecord);
    } else if (record.eventType === "OrderActionRecord") {
      if (!userMap) {
        return;
      }
      const actionRecord = record;
      if (actionRecord.taker) {
        const taker = await userMap.mustGet(actionRecord.taker.toString());
        await this.mustGet(taker.getUserAccount().authority.toString());
      }
      if (actionRecord.maker) {
        const maker = await userMap.mustGet(actionRecord.maker.toString());
        await this.mustGet(maker.getUserAccount().authority.toString());
      }
    } else if (record.eventType === "SettlePnlRecord") {
      if (!userMap) {
        return;
      }
      const settlePnlRecord = record;
      const user = await userMap.mustGet(settlePnlRecord.user.toString());
      await this.mustGet(user.getUserAccount().authority.toString());
    } else if (record.eventType === "NewUserRecord") {
      const newUserRecord = record;
      await this.mustGet(newUserRecord.userAuthority.toString());
    } else if (record.eventType === "LPRecord") {
      if (!userMap) {
        return;
      }
      const lpRecord = record;
      const user = await userMap.mustGet(lpRecord.user.toString());
      await this.mustGet(user.getUserAccount().authority.toString());
    } else if (record.eventType === "InsuranceFundStakeRecord") {
      const ifStakeRecord = record;
      await this.mustGet(ifStakeRecord.userAuthority.toString());
    }
  }
  has(authorityPublicKey) {
    return this.userStatsMap.has(authorityPublicKey);
  }
  get(authorityPublicKey) {
    return this.userStatsMap.get(authorityPublicKey);
  }
  async mustGet(authorityPublicKey) {
    if (!this.has(authorityPublicKey)) {
      await this.addUserStat(new PublicKey13(authorityPublicKey));
    }
    return this.get(authorityPublicKey);
  }
  values() {
    return this.userStatsMap.values();
  }
  size() {
    return this.userStatsMap.size;
  }
};
export {
  AMM_RESERVE_PRECISION,
  AMM_RESERVE_PRECISION_EXP,
  AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO,
  AMM_TO_QUOTE_PRECISION_RATIO,
  AdminClient,
  AssetTier,
  BASE_PRECISION,
  BASE_PRECISION_EXP,
  BID_ASK_SPREAD_PRECISION,
  BN,
  BN_MAX,
  BigNum,
  BulkAccountLoader,
  CONCENTRATION_PRECISION,
  ContractTier,
  ContractType,
  DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT,
  DLOB,
  DLOBOrdersCoder,
  DefaultEventSubscriptionOptions,
  DefaultOrderParams,
  DepositDirection,
  DepositExplanation,
  DevnetPerpMarkets,
  DevnetSpotMarkets,
  DriftClient,
  EIGHT,
  EventSubscriber,
  ExchangeStatus,
  FIVE,
  FOUR,
  FUNDING_RATE_BUFFER_PRECISION,
  FUNDING_RATE_BUFFER_PRECISION_EXP,
  FUNDING_RATE_PRECISION,
  FUNDING_RATE_PRECISION_EXP,
  FloatingLimitOrderNode,
  LAMPORTS_EXP,
  LAMPORTS_PRECISION,
  LIQUIDATION_FEE_PRECISION,
  LIQUIDATION_PCT_PRECISION,
  LPAction,
  LimitOrderNode,
  LiquidationType,
  LogParser,
  MARGIN_PRECISION,
  MAX_LEVERAGE,
  MainnetPerpMarkets,
  MainnetSpotMarkets,
  MarketOrderNode,
  MarketStatus,
  MarketType,
  NINE,
  NodeList,
  NotSubscribedError,
  ONE,
  ONE_YEAR,
  OPEN_ORDER_MARGIN_REQUIREMENT,
  OracleSource,
  OrderAction,
  OrderActionExplanation,
  OrderNode,
  OrderStatus,
  OrderTriggerCondition,
  OrderType,
  PEG_PRECISION,
  PEG_PRECISION_EXP,
  PERCENTAGE_PRECISION,
  PERCENTAGE_PRECISION_EXP,
  PRICE_DIV_PEG,
  PRICE_PRECISION,
  PRICE_PRECISION_EXP,
  PRICE_TO_QUOTE_PRECISION,
  PerpMarkets,
  PollingDriftClientAccountSubscriber,
  PollingOracleAccountSubscriber,
  PollingTokenAccountSubscriber,
  PollingUserAccountSubscriber,
  PollingUserStatsAccountSubscriber,
  PositionDirection,
  PublicKey14 as PublicKey,
  PythClient,
  QUOTE_PRECISION,
  QUOTE_PRECISION_EXP,
  QUOTE_SPOT_MARKET_INDEX,
  RetryTxSender,
  SEVEN,
  SIX,
  SPOT_MARKET_BALANCE_PRECISION,
  SPOT_MARKET_BALANCE_PRECISION_EXP,
  SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION,
  SPOT_MARKET_CUMULATIVE_INTEREST_PRECISION_EXP,
  SPOT_MARKET_IMF_PRECISION,
  SPOT_MARKET_IMF_PRECISION_EXP,
  SPOT_MARKET_RATE_PRECISION,
  SPOT_MARKET_RATE_PRECISION_EXP,
  SPOT_MARKET_UTILIZATION_PRECISION,
  SPOT_MARKET_UTILIZATION_PRECISION_EXP,
  SPOT_MARKET_WEIGHT_PRECISION,
  SerumFulfillmentConfigMap,
  SerumSubscriber,
  SettlePnlExplanation,
  SlotSubscriber,
  SpotBalanceType,
  SpotFulfillmentConfigStatus,
  SpotFulfillmentStatus,
  SpotFulfillmentType,
  SpotMarkets,
  StakeAction,
  SwapDirection,
  SwitchboardClient,
  TEN,
  TEN_MILLION,
  TEN_THOUSAND,
  THREE,
  TWO,
  TokenFaucet,
  TradeSide,
  TriggerOrderNode,
  User,
  UserMap2 as UserMap,
  UserStats,
  UserStatsMap,
  UserStatus,
  WRAPPED_SOL_MINT,
  Wallet,
  WebSocketDriftClientAccountSubscriber,
  ZERO,
  ammPaused,
  bulkPollingUserStatsSubscribe,
  bulkPollingUserSubscribe,
  calculateAdjustKCost,
  calculateAllEstimatedFundingRate,
  calculateAmmReservesAfterSwap,
  calculateAskPrice,
  calculateAssetWeight,
  calculateBaseAssetAmountForAmmToFulfill,
  calculateBaseAssetAmountToFillUpToLimitPrice,
  calculateBaseAssetValue,
  calculateBaseAssetValueWithOracle,
  calculateBidAskPrice,
  calculateBidPrice,
  calculateBorrowRate,
  calculateBreakEvenPrice,
  calculateBudgetedK,
  calculateBudgetedKBN,
  calculateBudgetedPeg,
  calculateClaimablePnl,
  calculateCostBasis,
  calculateDepositRate,
  calculateEffectiveLeverage,
  calculateEntryPrice,
  calculateEstimatedFundingRate,
  calculateFundingPool,
  calculateInterestAccumulated,
  calculateInterestRate,
  calculateInventoryScale,
  calculateLiabilityWeight,
  calculateLiveOracleStd,
  calculateLiveOracleTwap,
  calculateLongShortFundingRate,
  calculateLongShortFundingRateAndLiveTwaps,
  calculateMarketAvailablePNL,
  calculateMarketMarginRatio,
  calculateMarketOpenBidAsk,
  calculateMaxBaseAssetAmountFillable,
  calculateMaxBaseAssetAmountToTrade,
  calculateMaxSpread,
  calculateNetUserPnl,
  calculateNetUserPnlImbalance,
  calculateNewAmm,
  calculateNewMarketAfterTrade,
  calculateOptimalPegAndBudget,
  calculateOraclePriceForPerpMargin,
  calculateOracleReserveSpread,
  calculateOracleSpread,
  calculatePegFromTargetPrice,
  calculatePositionFundingPNL,
  calculatePositionPNL,
  calculatePrice,
  calculateQuoteAssetAmountSwapped,
  calculateRepegCost,
  calculateReservePrice,
  calculateSizeDiscountAssetWeight,
  calculateSizePremiumLiabilityWeight,
  calculateSpread,
  calculateSpreadBN,
  calculateSpreadReserves,
  calculateSwapOutput,
  calculateTargetPriceTrade,
  calculateTerminalPrice,
  calculateTradeAcquiredAmounts,
  calculateTradeSlippage,
  calculateUnrealizedAssetWeight,
  calculateUpdatedAMM,
  calculateUpdatedAMMSpreadReserves,
  calculateUtilization,
  calculateVolSpreadBN,
  calculateWithdrawLimit,
  calculateWorstCaseBaseAssetAmount,
  castNumberToSpotPrecision,
  clampBN,
  configs,
  convertPythPrice,
  convertToNumber,
  createNode,
  estimateTps,
  exchangePaused,
  fetchLogs,
  fetchUserAccounts,
  fetchUserStatsAccount,
  fillPaused,
  findComputeUnitConsumption,
  findDirectionToClose,
  getAuctionPrice,
  getAuctionPriceForFixedAuction,
  getAuctionPriceForOracleOffsetAuction,
  getBalance,
  getConfig,
  getDriftSignerPublicKey,
  getDriftStateAccountPublicKey,
  getDriftStateAccountPublicKeyAndNonce,
  getInsuranceFundStakeAccountPublicKey,
  getInsuranceFundVaultPublicKey,
  getLimitOrderParams,
  getLimitPrice,
  getMarketOrderParams,
  getMarketsAndOraclesForSubscription,
  getOracleClient,
  getOrderSignature,
  getPerpMarketPublicKey,
  getSerumFulfillmentConfigPublicKey,
  getSerumOpenOrdersPublicKey,
  getSerumSignerPublicKey,
  getSignedTokenAmount,
  getSpotMarketPublicKey,
  getSpotMarketVaultPublicKey,
  getSwapDirection,
  getTokenAmount,
  getTokenValue,
  getTriggerLimitOrderParams,
  getTriggerMarketOrderParams,
  getUserAccountPublicKey,
  getUserAccountPublicKeyAndNonce,
  getUserAccountPublicKeySync,
  getUserStatsAccountPublicKey,
  getVammNodeGenerator,
  getVariant,
  hasAuctionPrice,
  hasLimitPrice,
  initialize,
  isAuctionComplete,
  isEmptyPosition,
  isFillableByVAMM,
  isLimitOrder,
  isMarketOrder,
  isOneOfVariant,
  isOracleTooDivergent,
  isOracleValid,
  isOrderExpired,
  isOrderReduceOnly,
  isOrderRiskIncreasing,
  isOrderRiskIncreasingInSameDirection,
  isTriggered,
  isVariant,
  mustBeTriggered,
  oraclePriceBands,
  positionCurrentDirection,
  positionIsAvailable,
  promiseTimeout,
  pyth,
  squareRootBN,
  stakeAmountToShares,
  standardizeBaseAssetAmount,
  unstakeSharesToAmount
};
//# sourceMappingURL=index.mjs.map