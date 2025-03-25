import * as $protobuf from "protobufjs";
/** Properties of a FulfillmentAgreement. */
export interface IFulfillmentAgreement {

    /** FulfillmentAgreement nodePubkeys */
    nodePubkeys?: (Uint8Array[]|null);

    /** FulfillmentAgreement requested */
    requested?: (boolean|null);
}

/** Represents a FulfillmentAgreement. */
export class FulfillmentAgreement implements IFulfillmentAgreement {

    /**
     * Constructs a new FulfillmentAgreement.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFulfillmentAgreement);

    /** FulfillmentAgreement nodePubkeys. */
    public nodePubkeys: Uint8Array[];

    /** FulfillmentAgreement requested. */
    public requested: boolean;

    /**
     * Creates a new FulfillmentAgreement instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FulfillmentAgreement instance
     */
    public static create(properties?: IFulfillmentAgreement): FulfillmentAgreement;

    /**
     * Encodes the specified FulfillmentAgreement message. Does not implicitly {@link FulfillmentAgreement.verify|verify} messages.
     * @param message FulfillmentAgreement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFulfillmentAgreement, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FulfillmentAgreement message, length delimited. Does not implicitly {@link FulfillmentAgreement.verify|verify} messages.
     * @param message FulfillmentAgreement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFulfillmentAgreement, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FulfillmentAgreement message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FulfillmentAgreement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FulfillmentAgreement;

    /**
     * Decodes a FulfillmentAgreement message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FulfillmentAgreement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FulfillmentAgreement;

    /**
     * Verifies a FulfillmentAgreement message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FulfillmentAgreement message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FulfillmentAgreement
     */
    public static fromObject(object: { [k: string]: any }): FulfillmentAgreement;

    /**
     * Creates a plain object from a FulfillmentAgreement message. Also converts values to other types if specified.
     * @param message FulfillmentAgreement
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FulfillmentAgreement, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FulfillmentAgreement to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RoundResult. */
export interface IRoundResult {

    /** RoundResult numSuccess */
    numSuccess?: (number|null);

    /** RoundResult numError */
    numError?: (number|null);

    /** RoundResult result */
    result?: (number|null);

    /** RoundResult roundOpenSlot */
    roundOpenSlot?: (number|Long|null);

    /** RoundResult roundOpenTimestamp */
    roundOpenTimestamp?: (number|Long|null);

    /** RoundResult minResponse */
    minResponse?: (number|null);

    /** RoundResult maxResponse */
    maxResponse?: (number|null);

    /** RoundResult medians */
    medians?: (number[]|null);
}

/** Represents a RoundResult. */
export class RoundResult implements IRoundResult {

    /**
     * Constructs a new RoundResult.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRoundResult);

    /** RoundResult numSuccess. */
    public numSuccess: number;

    /** RoundResult numError. */
    public numError: number;

    /** RoundResult result. */
    public result: number;

    /** RoundResult roundOpenSlot. */
    public roundOpenSlot: (number|Long);

    /** RoundResult roundOpenTimestamp. */
    public roundOpenTimestamp: (number|Long);

    /** RoundResult minResponse. */
    public minResponse: number;

    /** RoundResult maxResponse. */
    public maxResponse: number;

    /** RoundResult medians. */
    public medians: number[];

    /**
     * Creates a new RoundResult instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RoundResult instance
     */
    public static create(properties?: IRoundResult): RoundResult;

    /**
     * Encodes the specified RoundResult message. Does not implicitly {@link RoundResult.verify|verify} messages.
     * @param message RoundResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRoundResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RoundResult message, length delimited. Does not implicitly {@link RoundResult.verify|verify} messages.
     * @param message RoundResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRoundResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RoundResult message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RoundResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RoundResult;

    /**
     * Decodes a RoundResult message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RoundResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RoundResult;

    /**
     * Verifies a RoundResult message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RoundResult message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RoundResult
     */
    public static fromObject(object: { [k: string]: any }): RoundResult;

    /**
     * Creates a plain object from a RoundResult message. Also converts values to other types if specified.
     * @param message RoundResult
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RoundResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RoundResult to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an AggregatorState. */
export interface IAggregatorState {

    /** AggregatorState version */
    version?: (number|null);

    /** AggregatorState configs */
    configs?: (AggregatorState.IConfigs|null);

    /** AggregatorState fulfillmentManagerPubkey */
    fulfillmentManagerPubkey?: (Uint8Array|null);

    /** AggregatorState jobDefinitionPubkeys */
    jobDefinitionPubkeys?: (Uint8Array[]|null);

    /** AggregatorState agreement */
    agreement?: (IFulfillmentAgreement|null);

    /** AggregatorState currentRoundResult */
    currentRoundResult?: (IRoundResult|null);

    /** AggregatorState lastRoundResult */
    lastRoundResult?: (IRoundResult|null);

    /** AggregatorState parseOptimizedResultAddress */
    parseOptimizedResultAddress?: (Uint8Array|null);

    /** AggregatorState bundleAuthAddresses */
    bundleAuthAddresses?: (Uint8Array[]|null);
}

/** Represents an AggregatorState. */
export class AggregatorState implements IAggregatorState {

    /**
     * Constructs a new AggregatorState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAggregatorState);

    /** AggregatorState version. */
    public version: number;

    /** AggregatorState configs. */
    public configs?: (AggregatorState.IConfigs|null);

    /** AggregatorState fulfillmentManagerPubkey. */
    public fulfillmentManagerPubkey: Uint8Array;

    /** AggregatorState jobDefinitionPubkeys. */
    public jobDefinitionPubkeys: Uint8Array[];

    /** AggregatorState agreement. */
    public agreement?: (IFulfillmentAgreement|null);

    /** AggregatorState currentRoundResult. */
    public currentRoundResult?: (IRoundResult|null);

    /** AggregatorState lastRoundResult. */
    public lastRoundResult?: (IRoundResult|null);

    /** AggregatorState parseOptimizedResultAddress. */
    public parseOptimizedResultAddress: Uint8Array;

    /** AggregatorState bundleAuthAddresses. */
    public bundleAuthAddresses: Uint8Array[];

    /**
     * Creates a new AggregatorState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AggregatorState instance
     */
    public static create(properties?: IAggregatorState): AggregatorState;

    /**
     * Encodes the specified AggregatorState message. Does not implicitly {@link AggregatorState.verify|verify} messages.
     * @param message AggregatorState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAggregatorState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AggregatorState message, length delimited. Does not implicitly {@link AggregatorState.verify|verify} messages.
     * @param message AggregatorState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAggregatorState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AggregatorState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AggregatorState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AggregatorState;

    /**
     * Decodes an AggregatorState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AggregatorState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AggregatorState;

    /**
     * Verifies an AggregatorState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AggregatorState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AggregatorState
     */
    public static fromObject(object: { [k: string]: any }): AggregatorState;

    /**
     * Creates a plain object from an AggregatorState message. Also converts values to other types if specified.
     * @param message AggregatorState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AggregatorState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AggregatorState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace AggregatorState {

    /** Properties of a Configs. */
    interface IConfigs {

        /** Configs locked */
        locked?: (boolean|null);

        /** Configs minConfirmations */
        minConfirmations?: (number|null);

        /** Configs minUpdateDelaySeconds */
        minUpdateDelaySeconds?: (number|Long|null);

        /** Configs schedule */
        schedule?: (string|null);
    }

    /** Represents a Configs. */
    class Configs implements IConfigs {

        /**
         * Constructs a new Configs.
         * @param [properties] Properties to set
         */
        constructor(properties?: AggregatorState.IConfigs);

        /** Configs locked. */
        public locked: boolean;

        /** Configs minConfirmations. */
        public minConfirmations: number;

        /** Configs minUpdateDelaySeconds. */
        public minUpdateDelaySeconds: (number|Long);

        /** Configs schedule. */
        public schedule: string;

        /**
         * Creates a new Configs instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Configs instance
         */
        public static create(properties?: AggregatorState.IConfigs): AggregatorState.Configs;

        /**
         * Encodes the specified Configs message. Does not implicitly {@link AggregatorState.Configs.verify|verify} messages.
         * @param message Configs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: AggregatorState.IConfigs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Configs message, length delimited. Does not implicitly {@link AggregatorState.Configs.verify|verify} messages.
         * @param message Configs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: AggregatorState.IConfigs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Configs message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Configs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AggregatorState.Configs;

        /**
         * Decodes a Configs message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Configs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AggregatorState.Configs;

        /**
         * Verifies a Configs message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Configs message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Configs
         */
        public static fromObject(object: { [k: string]: any }): AggregatorState.Configs;

        /**
         * Creates a plain object from a Configs message. Also converts values to other types if specified.
         * @param message Configs
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: AggregatorState.Configs, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Configs to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of an OracleJob. */
export interface IOracleJob {

    /** OracleJob tasks */
    tasks?: (OracleJob.ITask[]|null);
}

/** Represents an OracleJob. */
export class OracleJob implements IOracleJob {

    /**
     * Constructs a new OracleJob.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOracleJob);

    /** OracleJob tasks. */
    public tasks: OracleJob.ITask[];

    /**
     * Creates a new OracleJob instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OracleJob instance
     */
    public static create(properties?: IOracleJob): OracleJob;

    /**
     * Encodes the specified OracleJob message. Does not implicitly {@link OracleJob.verify|verify} messages.
     * @param message OracleJob message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOracleJob, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified OracleJob message, length delimited. Does not implicitly {@link OracleJob.verify|verify} messages.
     * @param message OracleJob message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOracleJob, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an OracleJob message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OracleJob
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob;

    /**
     * Decodes an OracleJob message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OracleJob
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob;

    /**
     * Verifies an OracleJob message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an OracleJob message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OracleJob
     */
    public static fromObject(object: { [k: string]: any }): OracleJob;

    /**
     * Creates a plain object from an OracleJob message. Also converts values to other types if specified.
     * @param message OracleJob
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: OracleJob, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this OracleJob to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace OracleJob {

    /** Properties of a HttpTask. */
    interface IHttpTask {

        /** HttpTask url */
        url?: (string|null);

        /** HttpTask method */
        method?: (OracleJob.HttpTask.Method|null);

        /** HttpTask headers */
        headers?: (OracleJob.HttpTask.IHeader[]|null);

        /** HttpTask body */
        body?: (string|null);
    }

    /** Represents a HttpTask. */
    class HttpTask implements IHttpTask {

        /**
         * Constructs a new HttpTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IHttpTask);

        /** HttpTask url. */
        public url: string;

        /** HttpTask method. */
        public method: OracleJob.HttpTask.Method;

        /** HttpTask headers. */
        public headers: OracleJob.HttpTask.IHeader[];

        /** HttpTask body. */
        public body: string;

        /**
         * Creates a new HttpTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HttpTask instance
         */
        public static create(properties?: OracleJob.IHttpTask): OracleJob.HttpTask;

        /**
         * Encodes the specified HttpTask message. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
         * @param message HttpTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IHttpTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HttpTask message, length delimited. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
         * @param message HttpTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IHttpTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HttpTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HttpTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.HttpTask;

        /**
         * Decodes a HttpTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HttpTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.HttpTask;

        /**
         * Verifies a HttpTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HttpTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HttpTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.HttpTask;

        /**
         * Creates a plain object from a HttpTask message. Also converts values to other types if specified.
         * @param message HttpTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.HttpTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HttpTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace HttpTask {

        /** Method enum. */
        enum Method {
            METHOD_UNKOWN = 0,
            METHOD_GET = 1,
            METHOD_POST = 2
        }

        /** Properties of a Header. */
        interface IHeader {

            /** Header key */
            key?: (string|null);

            /** Header value */
            value?: (string|null);
        }

        /** Represents a Header. */
        class Header implements IHeader {

            /**
             * Constructs a new Header.
             * @param [properties] Properties to set
             */
            constructor(properties?: OracleJob.HttpTask.IHeader);

            /** Header key. */
            public key: string;

            /** Header value. */
            public value: string;

            /**
             * Creates a new Header instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Header instance
             */
            public static create(properties?: OracleJob.HttpTask.IHeader): OracleJob.HttpTask.Header;

            /**
             * Encodes the specified Header message. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
             * @param message Header message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: OracleJob.HttpTask.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Header message, length delimited. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
             * @param message Header message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: OracleJob.HttpTask.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Header message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Header
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.HttpTask.Header;

            /**
             * Decodes a Header message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Header
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.HttpTask.Header;

            /**
             * Verifies a Header message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Header message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Header
             */
            public static fromObject(object: { [k: string]: any }): OracleJob.HttpTask.Header;

            /**
             * Creates a plain object from a Header message. Also converts values to other types if specified.
             * @param message Header
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: OracleJob.HttpTask.Header, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Header to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a JsonParseTask. */
    interface IJsonParseTask {

        /** JsonParseTask path */
        path?: (string|null);

        /** JsonParseTask aggregationMethod */
        aggregationMethod?: (OracleJob.JsonParseTask.AggregationMethod|null);
    }

    /** Represents a JsonParseTask. */
    class JsonParseTask implements IJsonParseTask {

        /**
         * Constructs a new JsonParseTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IJsonParseTask);

        /** JsonParseTask path. */
        public path: string;

        /** JsonParseTask aggregationMethod. */
        public aggregationMethod: OracleJob.JsonParseTask.AggregationMethod;

        /**
         * Creates a new JsonParseTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JsonParseTask instance
         */
        public static create(properties?: OracleJob.IJsonParseTask): OracleJob.JsonParseTask;

        /**
         * Encodes the specified JsonParseTask message. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
         * @param message JsonParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IJsonParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JsonParseTask message, length delimited. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
         * @param message JsonParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IJsonParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JsonParseTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JsonParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.JsonParseTask;

        /**
         * Decodes a JsonParseTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JsonParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.JsonParseTask;

        /**
         * Verifies a JsonParseTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JsonParseTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JsonParseTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.JsonParseTask;

        /**
         * Creates a plain object from a JsonParseTask message. Also converts values to other types if specified.
         * @param message JsonParseTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.JsonParseTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JsonParseTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace JsonParseTask {

        /** AggregationMethod enum. */
        enum AggregationMethod {
            NONE = 0,
            MIN = 1,
            MAX = 2,
            SUM = 3
        }
    }

    /** Properties of a MedianTask. */
    interface IMedianTask {

        /** MedianTask tasks */
        tasks?: (OracleJob.ITask[]|null);

        /** MedianTask jobs */
        jobs?: (IOracleJob[]|null);

        /** MedianTask minSuccessfulRequired */
        minSuccessfulRequired?: (number|null);
    }

    /** Represents a MedianTask. */
    class MedianTask implements IMedianTask {

        /**
         * Constructs a new MedianTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMedianTask);

        /** MedianTask tasks. */
        public tasks: OracleJob.ITask[];

        /** MedianTask jobs. */
        public jobs: IOracleJob[];

        /** MedianTask minSuccessfulRequired. */
        public minSuccessfulRequired: number;

        /**
         * Creates a new MedianTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MedianTask instance
         */
        public static create(properties?: OracleJob.IMedianTask): OracleJob.MedianTask;

        /**
         * Encodes the specified MedianTask message. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
         * @param message MedianTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMedianTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MedianTask message, length delimited. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
         * @param message MedianTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMedianTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MedianTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MedianTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MedianTask;

        /**
         * Decodes a MedianTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MedianTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MedianTask;

        /**
         * Verifies a MedianTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MedianTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MedianTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MedianTask;

        /**
         * Creates a plain object from a MedianTask message. Also converts values to other types if specified.
         * @param message MedianTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MedianTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MedianTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MeanTask. */
    interface IMeanTask {

        /** MeanTask tasks */
        tasks?: (OracleJob.ITask[]|null);

        /** MeanTask jobs */
        jobs?: (IOracleJob[]|null);
    }

    /** Represents a MeanTask. */
    class MeanTask implements IMeanTask {

        /**
         * Constructs a new MeanTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMeanTask);

        /** MeanTask tasks. */
        public tasks: OracleJob.ITask[];

        /** MeanTask jobs. */
        public jobs: IOracleJob[];

        /**
         * Creates a new MeanTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MeanTask instance
         */
        public static create(properties?: OracleJob.IMeanTask): OracleJob.MeanTask;

        /**
         * Encodes the specified MeanTask message. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
         * @param message MeanTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMeanTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MeanTask message, length delimited. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
         * @param message MeanTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMeanTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MeanTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MeanTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MeanTask;

        /**
         * Decodes a MeanTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MeanTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MeanTask;

        /**
         * Verifies a MeanTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MeanTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MeanTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MeanTask;

        /**
         * Creates a plain object from a MeanTask message. Also converts values to other types if specified.
         * @param message MeanTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MeanTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MeanTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MaxTask. */
    interface IMaxTask {

        /** MaxTask tasks */
        tasks?: (OracleJob.ITask[]|null);

        /** MaxTask jobs */
        jobs?: (IOracleJob[]|null);
    }

    /** Represents a MaxTask. */
    class MaxTask implements IMaxTask {

        /**
         * Constructs a new MaxTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMaxTask);

        /** MaxTask tasks. */
        public tasks: OracleJob.ITask[];

        /** MaxTask jobs. */
        public jobs: IOracleJob[];

        /**
         * Creates a new MaxTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MaxTask instance
         */
        public static create(properties?: OracleJob.IMaxTask): OracleJob.MaxTask;

        /**
         * Encodes the specified MaxTask message. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
         * @param message MaxTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMaxTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MaxTask message, length delimited. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
         * @param message MaxTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMaxTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MaxTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MaxTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MaxTask;

        /**
         * Decodes a MaxTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MaxTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MaxTask;

        /**
         * Verifies a MaxTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MaxTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MaxTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MaxTask;

        /**
         * Creates a plain object from a MaxTask message. Also converts values to other types if specified.
         * @param message MaxTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MaxTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MaxTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ValueTask. */
    interface IValueTask {

        /** ValueTask value */
        value?: (number|null);

        /** ValueTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);
    }

    /** Represents a ValueTask. */
    class ValueTask implements IValueTask {

        /**
         * Constructs a new ValueTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IValueTask);

        /** ValueTask value. */
        public value?: (number|null);

        /** ValueTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** ValueTask Value. */
        public Value?: ("value"|"aggregatorPubkey");

        /**
         * Creates a new ValueTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ValueTask instance
         */
        public static create(properties?: OracleJob.IValueTask): OracleJob.ValueTask;

        /**
         * Encodes the specified ValueTask message. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
         * @param message ValueTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IValueTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ValueTask message, length delimited. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
         * @param message ValueTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IValueTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ValueTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ValueTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.ValueTask;

        /**
         * Decodes a ValueTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ValueTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.ValueTask;

        /**
         * Verifies a ValueTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ValueTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ValueTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.ValueTask;

        /**
         * Creates a plain object from a ValueTask message. Also converts values to other types if specified.
         * @param message ValueTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.ValueTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ValueTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a WebsocketTask. */
    interface IWebsocketTask {

        /** WebsocketTask url */
        url?: (string|null);

        /** WebsocketTask subscription */
        subscription?: (string|null);

        /** WebsocketTask maxDataAgeSeconds */
        maxDataAgeSeconds?: (number|null);

        /** WebsocketTask filter */
        filter?: (string|null);
    }

    /** Represents a WebsocketTask. */
    class WebsocketTask implements IWebsocketTask {

        /**
         * Constructs a new WebsocketTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IWebsocketTask);

        /** WebsocketTask url. */
        public url: string;

        /** WebsocketTask subscription. */
        public subscription: string;

        /** WebsocketTask maxDataAgeSeconds. */
        public maxDataAgeSeconds: number;

        /** WebsocketTask filter. */
        public filter: string;

        /**
         * Creates a new WebsocketTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebsocketTask instance
         */
        public static create(properties?: OracleJob.IWebsocketTask): OracleJob.WebsocketTask;

        /**
         * Encodes the specified WebsocketTask message. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
         * @param message WebsocketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IWebsocketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WebsocketTask message, length delimited. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
         * @param message WebsocketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IWebsocketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WebsocketTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebsocketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.WebsocketTask;

        /**
         * Decodes a WebsocketTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebsocketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.WebsocketTask;

        /**
         * Verifies a WebsocketTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WebsocketTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebsocketTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.WebsocketTask;

        /**
         * Creates a plain object from a WebsocketTask message. Also converts values to other types if specified.
         * @param message WebsocketTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.WebsocketTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WebsocketTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConditionalTask. */
    interface IConditionalTask {

        /** ConditionalTask attempt */
        attempt?: (OracleJob.ITask[]|null);

        /** ConditionalTask onFailure */
        onFailure?: (OracleJob.ITask[]|null);
    }

    /** Represents a ConditionalTask. */
    class ConditionalTask implements IConditionalTask {

        /**
         * Constructs a new ConditionalTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IConditionalTask);

        /** ConditionalTask attempt. */
        public attempt: OracleJob.ITask[];

        /** ConditionalTask onFailure. */
        public onFailure: OracleJob.ITask[];

        /**
         * Creates a new ConditionalTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConditionalTask instance
         */
        public static create(properties?: OracleJob.IConditionalTask): OracleJob.ConditionalTask;

        /**
         * Encodes the specified ConditionalTask message. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
         * @param message ConditionalTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IConditionalTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConditionalTask message, length delimited. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
         * @param message ConditionalTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IConditionalTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConditionalTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConditionalTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.ConditionalTask;

        /**
         * Decodes a ConditionalTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConditionalTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.ConditionalTask;

        /**
         * Verifies a ConditionalTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConditionalTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConditionalTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.ConditionalTask;

        /**
         * Creates a plain object from a ConditionalTask message. Also converts values to other types if specified.
         * @param message ConditionalTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.ConditionalTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConditionalTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DivideTask. */
    interface IDivideTask {

        /** DivideTask scalar */
        scalar?: (number|null);

        /** DivideTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** DivideTask job */
        job?: (IOracleJob|null);
    }

    /** Represents a DivideTask. */
    class DivideTask implements IDivideTask {

        /**
         * Constructs a new DivideTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IDivideTask);

        /** DivideTask scalar. */
        public scalar?: (number|null);

        /** DivideTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** DivideTask job. */
        public job?: (IOracleJob|null);

        /** DivideTask Denominator. */
        public Denominator?: ("scalar"|"aggregatorPubkey"|"job");

        /**
         * Creates a new DivideTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DivideTask instance
         */
        public static create(properties?: OracleJob.IDivideTask): OracleJob.DivideTask;

        /**
         * Encodes the specified DivideTask message. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
         * @param message DivideTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IDivideTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DivideTask message, length delimited. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
         * @param message DivideTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IDivideTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DivideTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DivideTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.DivideTask;

        /**
         * Decodes a DivideTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DivideTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.DivideTask;

        /**
         * Verifies a DivideTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DivideTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DivideTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.DivideTask;

        /**
         * Creates a plain object from a DivideTask message. Also converts values to other types if specified.
         * @param message DivideTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.DivideTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DivideTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MultiplyTask. */
    interface IMultiplyTask {

        /** MultiplyTask scalar */
        scalar?: (number|null);

        /** MultiplyTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** MultiplyTask job */
        job?: (IOracleJob|null);
    }

    /** Represents a MultiplyTask. */
    class MultiplyTask implements IMultiplyTask {

        /**
         * Constructs a new MultiplyTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMultiplyTask);

        /** MultiplyTask scalar. */
        public scalar?: (number|null);

        /** MultiplyTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** MultiplyTask job. */
        public job?: (IOracleJob|null);

        /** MultiplyTask Multiple. */
        public Multiple?: ("scalar"|"aggregatorPubkey"|"job");

        /**
         * Creates a new MultiplyTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MultiplyTask instance
         */
        public static create(properties?: OracleJob.IMultiplyTask): OracleJob.MultiplyTask;

        /**
         * Encodes the specified MultiplyTask message. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
         * @param message MultiplyTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMultiplyTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MultiplyTask message, length delimited. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
         * @param message MultiplyTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMultiplyTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MultiplyTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MultiplyTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MultiplyTask;

        /**
         * Decodes a MultiplyTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MultiplyTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MultiplyTask;

        /**
         * Verifies a MultiplyTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MultiplyTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MultiplyTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MultiplyTask;

        /**
         * Creates a plain object from a MultiplyTask message. Also converts values to other types if specified.
         * @param message MultiplyTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MultiplyTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MultiplyTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddTask. */
    interface IAddTask {

        /** AddTask scalar */
        scalar?: (number|null);

        /** AddTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** AddTask job */
        job?: (IOracleJob|null);
    }

    /** Represents an AddTask. */
    class AddTask implements IAddTask {

        /**
         * Constructs a new AddTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IAddTask);

        /** AddTask scalar. */
        public scalar?: (number|null);

        /** AddTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** AddTask job. */
        public job?: (IOracleJob|null);

        /** AddTask Addition. */
        public Addition?: ("scalar"|"aggregatorPubkey"|"job");

        /**
         * Creates a new AddTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddTask instance
         */
        public static create(properties?: OracleJob.IAddTask): OracleJob.AddTask;

        /**
         * Encodes the specified AddTask message. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
         * @param message AddTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IAddTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddTask message, length delimited. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
         * @param message AddTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IAddTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.AddTask;

        /**
         * Decodes an AddTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.AddTask;

        /**
         * Verifies an AddTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.AddTask;

        /**
         * Creates a plain object from an AddTask message. Also converts values to other types if specified.
         * @param message AddTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.AddTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SubtractTask. */
    interface ISubtractTask {

        /** SubtractTask scalar */
        scalar?: (number|null);

        /** SubtractTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** SubtractTask job */
        job?: (IOracleJob|null);
    }

    /** Represents a SubtractTask. */
    class SubtractTask implements ISubtractTask {

        /**
         * Constructs a new SubtractTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISubtractTask);

        /** SubtractTask scalar. */
        public scalar?: (number|null);

        /** SubtractTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** SubtractTask job. */
        public job?: (IOracleJob|null);

        /** SubtractTask Subtraction. */
        public Subtraction?: ("scalar"|"aggregatorPubkey"|"job");

        /**
         * Creates a new SubtractTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubtractTask instance
         */
        public static create(properties?: OracleJob.ISubtractTask): OracleJob.SubtractTask;

        /**
         * Encodes the specified SubtractTask message. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
         * @param message SubtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISubtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubtractTask message, length delimited. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
         * @param message SubtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISubtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubtractTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SubtractTask;

        /**
         * Decodes a SubtractTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SubtractTask;

        /**
         * Verifies a SubtractTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubtractTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubtractTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SubtractTask;

        /**
         * Creates a plain object from a SubtractTask message. Also converts values to other types if specified.
         * @param message SubtractTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SubtractTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubtractTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LpTokenPriceTask. */
    interface ILpTokenPriceTask {

        /** LpTokenPriceTask mercurialPoolAddress */
        mercurialPoolAddress?: (string|null);

        /** LpTokenPriceTask saberPoolAddress */
        saberPoolAddress?: (string|null);

        /** LpTokenPriceTask orcaPoolAddress */
        orcaPoolAddress?: (string|null);

        /** LpTokenPriceTask raydiumPoolAddress */
        raydiumPoolAddress?: (string|null);

        /** LpTokenPriceTask priceFeedAddresses */
        priceFeedAddresses?: (string[]|null);

        /** LpTokenPriceTask priceFeedJobs */
        priceFeedJobs?: (IOracleJob[]|null);

        /** LpTokenPriceTask useFairPrice */
        useFairPrice?: (boolean|null);
    }

    /** Represents a LpTokenPriceTask. */
    class LpTokenPriceTask implements ILpTokenPriceTask {

        /**
         * Constructs a new LpTokenPriceTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ILpTokenPriceTask);

        /** LpTokenPriceTask mercurialPoolAddress. */
        public mercurialPoolAddress?: (string|null);

        /** LpTokenPriceTask saberPoolAddress. */
        public saberPoolAddress?: (string|null);

        /** LpTokenPriceTask orcaPoolAddress. */
        public orcaPoolAddress?: (string|null);

        /** LpTokenPriceTask raydiumPoolAddress. */
        public raydiumPoolAddress?: (string|null);

        /** LpTokenPriceTask priceFeedAddresses. */
        public priceFeedAddresses: string[];

        /** LpTokenPriceTask priceFeedJobs. */
        public priceFeedJobs: IOracleJob[];

        /** LpTokenPriceTask useFairPrice. */
        public useFairPrice: boolean;

        /** LpTokenPriceTask PoolAddress. */
        public PoolAddress?: ("mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolAddress"|"raydiumPoolAddress");

        /**
         * Creates a new LpTokenPriceTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LpTokenPriceTask instance
         */
        public static create(properties?: OracleJob.ILpTokenPriceTask): OracleJob.LpTokenPriceTask;

        /**
         * Encodes the specified LpTokenPriceTask message. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
         * @param message LpTokenPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ILpTokenPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LpTokenPriceTask message, length delimited. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
         * @param message LpTokenPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ILpTokenPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LpTokenPriceTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LpTokenPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.LpTokenPriceTask;

        /**
         * Decodes a LpTokenPriceTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LpTokenPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.LpTokenPriceTask;

        /**
         * Verifies a LpTokenPriceTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LpTokenPriceTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LpTokenPriceTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.LpTokenPriceTask;

        /**
         * Creates a plain object from a LpTokenPriceTask message. Also converts values to other types if specified.
         * @param message LpTokenPriceTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.LpTokenPriceTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LpTokenPriceTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LpExchangeRateTask. */
    interface ILpExchangeRateTask {

        /** LpExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** LpExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** LpExchangeRateTask mercurialPoolAddress */
        mercurialPoolAddress?: (string|null);

        /** LpExchangeRateTask saberPoolAddress */
        saberPoolAddress?: (string|null);

        /** LpExchangeRateTask orcaPoolTokenMintAddress */
        orcaPoolTokenMintAddress?: (string|null);

        /** LpExchangeRateTask raydiumPoolAddress */
        raydiumPoolAddress?: (string|null);
    }

    /** Represents a LpExchangeRateTask. */
    class LpExchangeRateTask implements ILpExchangeRateTask {

        /**
         * Constructs a new LpExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ILpExchangeRateTask);

        /** LpExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** LpExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** LpExchangeRateTask mercurialPoolAddress. */
        public mercurialPoolAddress?: (string|null);

        /** LpExchangeRateTask saberPoolAddress. */
        public saberPoolAddress?: (string|null);

        /** LpExchangeRateTask orcaPoolTokenMintAddress. */
        public orcaPoolTokenMintAddress?: (string|null);

        /** LpExchangeRateTask raydiumPoolAddress. */
        public raydiumPoolAddress?: (string|null);

        /** LpExchangeRateTask PoolAddress. */
        public PoolAddress?: ("mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolTokenMintAddress"|"raydiumPoolAddress");

        /**
         * Creates a new LpExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LpExchangeRateTask instance
         */
        public static create(properties?: OracleJob.ILpExchangeRateTask): OracleJob.LpExchangeRateTask;

        /**
         * Encodes the specified LpExchangeRateTask message. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
         * @param message LpExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ILpExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LpExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
         * @param message LpExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ILpExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LpExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LpExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.LpExchangeRateTask;

        /**
         * Decodes a LpExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LpExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.LpExchangeRateTask;

        /**
         * Verifies a LpExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LpExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LpExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.LpExchangeRateTask;

        /**
         * Creates a plain object from a LpExchangeRateTask message. Also converts values to other types if specified.
         * @param message LpExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.LpExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LpExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegexExtractTask. */
    interface IRegexExtractTask {

        /** RegexExtractTask pattern */
        pattern?: (string|null);

        /** RegexExtractTask groupNumber */
        groupNumber?: (number|null);
    }

    /** Represents a RegexExtractTask. */
    class RegexExtractTask implements IRegexExtractTask {

        /**
         * Constructs a new RegexExtractTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IRegexExtractTask);

        /** RegexExtractTask pattern. */
        public pattern: string;

        /** RegexExtractTask groupNumber. */
        public groupNumber: number;

        /**
         * Creates a new RegexExtractTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegexExtractTask instance
         */
        public static create(properties?: OracleJob.IRegexExtractTask): OracleJob.RegexExtractTask;

        /**
         * Encodes the specified RegexExtractTask message. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
         * @param message RegexExtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IRegexExtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegexExtractTask message, length delimited. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
         * @param message RegexExtractTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IRegexExtractTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegexExtractTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegexExtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.RegexExtractTask;

        /**
         * Decodes a RegexExtractTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegexExtractTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.RegexExtractTask;

        /**
         * Verifies a RegexExtractTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegexExtractTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegexExtractTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.RegexExtractTask;

        /**
         * Creates a plain object from a RegexExtractTask message. Also converts values to other types if specified.
         * @param message RegexExtractTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.RegexExtractTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegexExtractTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a XStepPriceTask. */
    interface IXStepPriceTask {

        /** XStepPriceTask stepJob */
        stepJob?: (OracleJob.IMedianTask|null);

        /** XStepPriceTask stepAggregatorPubkey */
        stepAggregatorPubkey?: (string|null);
    }

    /** Represents a XStepPriceTask. */
    class XStepPriceTask implements IXStepPriceTask {

        /**
         * Constructs a new XStepPriceTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IXStepPriceTask);

        /** XStepPriceTask stepJob. */
        public stepJob?: (OracleJob.IMedianTask|null);

        /** XStepPriceTask stepAggregatorPubkey. */
        public stepAggregatorPubkey?: (string|null);

        /** XStepPriceTask StepSource. */
        public StepSource?: ("stepJob"|"stepAggregatorPubkey");

        /**
         * Creates a new XStepPriceTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XStepPriceTask instance
         */
        public static create(properties?: OracleJob.IXStepPriceTask): OracleJob.XStepPriceTask;

        /**
         * Encodes the specified XStepPriceTask message. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
         * @param message XStepPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IXStepPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified XStepPriceTask message, length delimited. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
         * @param message XStepPriceTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IXStepPriceTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a XStepPriceTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XStepPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.XStepPriceTask;

        /**
         * Decodes a XStepPriceTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns XStepPriceTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.XStepPriceTask;

        /**
         * Verifies a XStepPriceTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a XStepPriceTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns XStepPriceTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.XStepPriceTask;

        /**
         * Creates a plain object from a XStepPriceTask message. Also converts values to other types if specified.
         * @param message XStepPriceTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.XStepPriceTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this XStepPriceTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TwapTask. */
    interface ITwapTask {

        /** TwapTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);

        /** TwapTask period */
        period?: (number|null);

        /** TwapTask weightByPropagationTime */
        weightByPropagationTime?: (boolean|null);

        /** TwapTask minSamples */
        minSamples?: (number|null);

        /** TwapTask endingUnixTimestamp */
        endingUnixTimestamp?: (number|null);
    }

    /** Represents a TwapTask. */
    class TwapTask implements ITwapTask {

        /**
         * Constructs a new TwapTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ITwapTask);

        /** TwapTask aggregatorPubkey. */
        public aggregatorPubkey: string;

        /** TwapTask period. */
        public period: number;

        /** TwapTask weightByPropagationTime. */
        public weightByPropagationTime: boolean;

        /** TwapTask minSamples. */
        public minSamples: number;

        /** TwapTask endingUnixTimestamp. */
        public endingUnixTimestamp: number;

        /**
         * Creates a new TwapTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TwapTask instance
         */
        public static create(properties?: OracleJob.ITwapTask): OracleJob.TwapTask;

        /**
         * Encodes the specified TwapTask message. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
         * @param message TwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ITwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TwapTask message, length delimited. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
         * @param message TwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ITwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TwapTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.TwapTask;

        /**
         * Decodes a TwapTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.TwapTask;

        /**
         * Verifies a TwapTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TwapTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TwapTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.TwapTask;

        /**
         * Creates a plain object from a TwapTask message. Also converts values to other types if specified.
         * @param message TwapTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.TwapTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TwapTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SerumSwapTask. */
    interface ISerumSwapTask {

        /** SerumSwapTask serumPoolAddress */
        serumPoolAddress?: (string|null);
    }

    /** Represents a SerumSwapTask. */
    class SerumSwapTask implements ISerumSwapTask {

        /**
         * Constructs a new SerumSwapTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISerumSwapTask);

        /** SerumSwapTask serumPoolAddress. */
        public serumPoolAddress: string;

        /**
         * Creates a new SerumSwapTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SerumSwapTask instance
         */
        public static create(properties?: OracleJob.ISerumSwapTask): OracleJob.SerumSwapTask;

        /**
         * Encodes the specified SerumSwapTask message. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
         * @param message SerumSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISerumSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SerumSwapTask message, length delimited. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
         * @param message SerumSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISerumSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SerumSwapTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SerumSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SerumSwapTask;

        /**
         * Decodes a SerumSwapTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SerumSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SerumSwapTask;

        /**
         * Verifies a SerumSwapTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SerumSwapTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SerumSwapTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SerumSwapTask;

        /**
         * Creates a plain object from a SerumSwapTask message. Also converts values to other types if specified.
         * @param message SerumSwapTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SerumSwapTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SerumSwapTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PowTask. */
    interface IPowTask {

        /** PowTask scalar */
        scalar?: (number|null);

        /** PowTask aggregatorPubkey */
        aggregatorPubkey?: (string|null);
    }

    /** Represents a PowTask. */
    class PowTask implements IPowTask {

        /**
         * Constructs a new PowTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IPowTask);

        /** PowTask scalar. */
        public scalar?: (number|null);

        /** PowTask aggregatorPubkey. */
        public aggregatorPubkey?: (string|null);

        /** PowTask Exponent. */
        public Exponent?: ("scalar"|"aggregatorPubkey");

        /**
         * Creates a new PowTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PowTask instance
         */
        public static create(properties?: OracleJob.IPowTask): OracleJob.PowTask;

        /**
         * Encodes the specified PowTask message. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
         * @param message PowTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IPowTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PowTask message, length delimited. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
         * @param message PowTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IPowTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PowTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PowTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.PowTask;

        /**
         * Decodes a PowTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PowTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.PowTask;

        /**
         * Verifies a PowTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PowTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PowTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.PowTask;

        /**
         * Creates a plain object from a PowTask message. Also converts values to other types if specified.
         * @param message PowTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.PowTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PowTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LendingRateTask. */
    interface ILendingRateTask {

        /** LendingRateTask protocol */
        protocol?: (string|null);

        /** LendingRateTask assetMint */
        assetMint?: (string|null);

        /** LendingRateTask field */
        field?: (OracleJob.LendingRateTask.Field|null);
    }

    /** Represents a LendingRateTask. */
    class LendingRateTask implements ILendingRateTask {

        /**
         * Constructs a new LendingRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ILendingRateTask);

        /** LendingRateTask protocol. */
        public protocol: string;

        /** LendingRateTask assetMint. */
        public assetMint: string;

        /** LendingRateTask field. */
        public field: OracleJob.LendingRateTask.Field;

        /**
         * Creates a new LendingRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LendingRateTask instance
         */
        public static create(properties?: OracleJob.ILendingRateTask): OracleJob.LendingRateTask;

        /**
         * Encodes the specified LendingRateTask message. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
         * @param message LendingRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ILendingRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LendingRateTask message, length delimited. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
         * @param message LendingRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ILendingRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LendingRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LendingRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.LendingRateTask;

        /**
         * Decodes a LendingRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LendingRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.LendingRateTask;

        /**
         * Verifies a LendingRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LendingRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LendingRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.LendingRateTask;

        /**
         * Creates a plain object from a LendingRateTask message. Also converts values to other types if specified.
         * @param message LendingRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.LendingRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LendingRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace LendingRateTask {

        /** Field enum. */
        enum Field {
            FIELD_DEPOSIT_RATE = 0,
            FIELD_BORROW_RATE = 1
        }
    }

    /** Properties of a MangoPerpMarketTask. */
    interface IMangoPerpMarketTask {

        /** MangoPerpMarketTask perpMarketAddress */
        perpMarketAddress?: (string|null);
    }

    /** Represents a MangoPerpMarketTask. */
    class MangoPerpMarketTask implements IMangoPerpMarketTask {

        /**
         * Constructs a new MangoPerpMarketTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IMangoPerpMarketTask);

        /** MangoPerpMarketTask perpMarketAddress. */
        public perpMarketAddress: string;

        /**
         * Creates a new MangoPerpMarketTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MangoPerpMarketTask instance
         */
        public static create(properties?: OracleJob.IMangoPerpMarketTask): OracleJob.MangoPerpMarketTask;

        /**
         * Encodes the specified MangoPerpMarketTask message. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
         * @param message MangoPerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IMangoPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MangoPerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
         * @param message MangoPerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IMangoPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MangoPerpMarketTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MangoPerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.MangoPerpMarketTask;

        /**
         * Decodes a MangoPerpMarketTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MangoPerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.MangoPerpMarketTask;

        /**
         * Verifies a MangoPerpMarketTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MangoPerpMarketTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MangoPerpMarketTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.MangoPerpMarketTask;

        /**
         * Creates a plain object from a MangoPerpMarketTask message. Also converts values to other types if specified.
         * @param message MangoPerpMarketTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.MangoPerpMarketTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MangoPerpMarketTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JupiterSwapTask. */
    interface IJupiterSwapTask {

        /** JupiterSwapTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** JupiterSwapTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** JupiterSwapTask baseAmount */
        baseAmount?: (number|null);
    }

    /** Represents a JupiterSwapTask. */
    class JupiterSwapTask implements IJupiterSwapTask {

        /**
         * Constructs a new JupiterSwapTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IJupiterSwapTask);

        /** JupiterSwapTask inTokenAddress. */
        public inTokenAddress: string;

        /** JupiterSwapTask outTokenAddress. */
        public outTokenAddress: string;

        /** JupiterSwapTask baseAmount. */
        public baseAmount: number;

        /**
         * Creates a new JupiterSwapTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JupiterSwapTask instance
         */
        public static create(properties?: OracleJob.IJupiterSwapTask): OracleJob.JupiterSwapTask;

        /**
         * Encodes the specified JupiterSwapTask message. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
         * @param message JupiterSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IJupiterSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JupiterSwapTask message, length delimited. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
         * @param message JupiterSwapTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IJupiterSwapTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JupiterSwapTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JupiterSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.JupiterSwapTask;

        /**
         * Decodes a JupiterSwapTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JupiterSwapTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.JupiterSwapTask;

        /**
         * Verifies a JupiterSwapTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JupiterSwapTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JupiterSwapTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.JupiterSwapTask;

        /**
         * Creates a plain object from a JupiterSwapTask message. Also converts values to other types if specified.
         * @param message JupiterSwapTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.JupiterSwapTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JupiterSwapTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PerpMarketTask. */
    interface IPerpMarketTask {

        /** PerpMarketTask mangoMarketAddress */
        mangoMarketAddress?: (string|null);

        /** PerpMarketTask driftMarketAddress */
        driftMarketAddress?: (string|null);

        /** PerpMarketTask zetaMarketAddress */
        zetaMarketAddress?: (string|null);

        /** PerpMarketTask zoMarketAddress */
        zoMarketAddress?: (string|null);
    }

    /** Represents a PerpMarketTask. */
    class PerpMarketTask implements IPerpMarketTask {

        /**
         * Constructs a new PerpMarketTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IPerpMarketTask);

        /** PerpMarketTask mangoMarketAddress. */
        public mangoMarketAddress?: (string|null);

        /** PerpMarketTask driftMarketAddress. */
        public driftMarketAddress?: (string|null);

        /** PerpMarketTask zetaMarketAddress. */
        public zetaMarketAddress?: (string|null);

        /** PerpMarketTask zoMarketAddress. */
        public zoMarketAddress?: (string|null);

        /** PerpMarketTask MarketAddress. */
        public MarketAddress?: ("mangoMarketAddress"|"driftMarketAddress"|"zetaMarketAddress"|"zoMarketAddress");

        /**
         * Creates a new PerpMarketTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PerpMarketTask instance
         */
        public static create(properties?: OracleJob.IPerpMarketTask): OracleJob.PerpMarketTask;

        /**
         * Encodes the specified PerpMarketTask message. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
         * @param message PerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
         * @param message PerpMarketTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IPerpMarketTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PerpMarketTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.PerpMarketTask;

        /**
         * Decodes a PerpMarketTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PerpMarketTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.PerpMarketTask;

        /**
         * Verifies a PerpMarketTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PerpMarketTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PerpMarketTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.PerpMarketTask;

        /**
         * Creates a plain object from a PerpMarketTask message. Also converts values to other types if specified.
         * @param message PerpMarketTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.PerpMarketTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PerpMarketTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OracleTask. */
    interface IOracleTask {

        /** OracleTask switchboardAddress */
        switchboardAddress?: (string|null);

        /** OracleTask pythAddress */
        pythAddress?: (string|null);

        /** OracleTask chainlinkAddress */
        chainlinkAddress?: (string|null);

        /** OracleTask pythAllowedConfidenceInterval */
        pythAllowedConfidenceInterval?: (number|null);
    }

    /** Represents an OracleTask. */
    class OracleTask implements IOracleTask {

        /**
         * Constructs a new OracleTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IOracleTask);

        /** OracleTask switchboardAddress. */
        public switchboardAddress?: (string|null);

        /** OracleTask pythAddress. */
        public pythAddress?: (string|null);

        /** OracleTask chainlinkAddress. */
        public chainlinkAddress?: (string|null);

        /** OracleTask pythAllowedConfidenceInterval. */
        public pythAllowedConfidenceInterval: number;

        /** OracleTask AggregatorAddress. */
        public AggregatorAddress?: ("switchboardAddress"|"pythAddress"|"chainlinkAddress");

        /**
         * Creates a new OracleTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OracleTask instance
         */
        public static create(properties?: OracleJob.IOracleTask): OracleJob.OracleTask;

        /**
         * Encodes the specified OracleTask message. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
         * @param message OracleTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IOracleTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OracleTask message, length delimited. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
         * @param message OracleTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IOracleTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OracleTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OracleTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.OracleTask;

        /**
         * Decodes an OracleTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OracleTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.OracleTask;

        /**
         * Verifies an OracleTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OracleTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OracleTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.OracleTask;

        /**
         * Creates a plain object from an OracleTask message. Also converts values to other types if specified.
         * @param message OracleTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.OracleTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OracleTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AnchorFetchTask. */
    interface IAnchorFetchTask {

        /** AnchorFetchTask programId */
        programId?: (string|null);

        /** AnchorFetchTask accountAddress */
        accountAddress?: (string|null);
    }

    /** Represents an AnchorFetchTask. */
    class AnchorFetchTask implements IAnchorFetchTask {

        /**
         * Constructs a new AnchorFetchTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IAnchorFetchTask);

        /** AnchorFetchTask programId. */
        public programId: string;

        /** AnchorFetchTask accountAddress. */
        public accountAddress: string;

        /**
         * Creates a new AnchorFetchTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AnchorFetchTask instance
         */
        public static create(properties?: OracleJob.IAnchorFetchTask): OracleJob.AnchorFetchTask;

        /**
         * Encodes the specified AnchorFetchTask message. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
         * @param message AnchorFetchTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IAnchorFetchTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AnchorFetchTask message, length delimited. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
         * @param message AnchorFetchTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IAnchorFetchTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AnchorFetchTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AnchorFetchTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.AnchorFetchTask;

        /**
         * Decodes an AnchorFetchTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AnchorFetchTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.AnchorFetchTask;

        /**
         * Verifies an AnchorFetchTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AnchorFetchTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AnchorFetchTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.AnchorFetchTask;

        /**
         * Creates a plain object from an AnchorFetchTask message. Also converts values to other types if specified.
         * @param message AnchorFetchTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.AnchorFetchTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AnchorFetchTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DefiKingdomsTask. */
    interface IDefiKingdomsTask {

        /** DefiKingdomsTask provider */
        provider?: (string|null);

        /** DefiKingdomsTask inToken */
        inToken?: (OracleJob.DefiKingdomsTask.IToken|null);

        /** DefiKingdomsTask outToken */
        outToken?: (OracleJob.DefiKingdomsTask.IToken|null);
    }

    /** Represents a DefiKingdomsTask. */
    class DefiKingdomsTask implements IDefiKingdomsTask {

        /**
         * Constructs a new DefiKingdomsTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IDefiKingdomsTask);

        /** DefiKingdomsTask provider. */
        public provider: string;

        /** DefiKingdomsTask inToken. */
        public inToken?: (OracleJob.DefiKingdomsTask.IToken|null);

        /** DefiKingdomsTask outToken. */
        public outToken?: (OracleJob.DefiKingdomsTask.IToken|null);

        /**
         * Creates a new DefiKingdomsTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DefiKingdomsTask instance
         */
        public static create(properties?: OracleJob.IDefiKingdomsTask): OracleJob.DefiKingdomsTask;

        /**
         * Encodes the specified DefiKingdomsTask message. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
         * @param message DefiKingdomsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IDefiKingdomsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DefiKingdomsTask message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
         * @param message DefiKingdomsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IDefiKingdomsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DefiKingdomsTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DefiKingdomsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.DefiKingdomsTask;

        /**
         * Decodes a DefiKingdomsTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DefiKingdomsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.DefiKingdomsTask;

        /**
         * Verifies a DefiKingdomsTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DefiKingdomsTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DefiKingdomsTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.DefiKingdomsTask;

        /**
         * Creates a plain object from a DefiKingdomsTask message. Also converts values to other types if specified.
         * @param message DefiKingdomsTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.DefiKingdomsTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DefiKingdomsTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace DefiKingdomsTask {

        /** Properties of a Token. */
        interface IToken {

            /** Token address */
            address?: (string|null);

            /** Token decimals */
            decimals?: (number|null);
        }

        /** Represents a Token. */
        class Token implements IToken {

            /**
             * Constructs a new Token.
             * @param [properties] Properties to set
             */
            constructor(properties?: OracleJob.DefiKingdomsTask.IToken);

            /** Token address. */
            public address: string;

            /** Token decimals. */
            public decimals: number;

            /**
             * Creates a new Token instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Token instance
             */
            public static create(properties?: OracleJob.DefiKingdomsTask.IToken): OracleJob.DefiKingdomsTask.Token;

            /**
             * Encodes the specified Token message. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
             * @param message Token message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: OracleJob.DefiKingdomsTask.IToken, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Token message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
             * @param message Token message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: OracleJob.DefiKingdomsTask.IToken, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Token message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Token
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.DefiKingdomsTask.Token;

            /**
             * Decodes a Token message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Token
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.DefiKingdomsTask.Token;

            /**
             * Verifies a Token message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Token message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Token
             */
            public static fromObject(object: { [k: string]: any }): OracleJob.DefiKingdomsTask.Token;

            /**
             * Creates a plain object from a Token message. Also converts values to other types if specified.
             * @param message Token
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: OracleJob.DefiKingdomsTask.Token, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Token to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a TpsTask. */
    interface ITpsTask {
    }

    /** Represents a TpsTask. */
    class TpsTask implements ITpsTask {

        /**
         * Constructs a new TpsTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ITpsTask);

        /**
         * Creates a new TpsTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TpsTask instance
         */
        public static create(properties?: OracleJob.ITpsTask): OracleJob.TpsTask;

        /**
         * Encodes the specified TpsTask message. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
         * @param message TpsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ITpsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TpsTask message, length delimited. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
         * @param message TpsTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ITpsTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TpsTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TpsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.TpsTask;

        /**
         * Decodes a TpsTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TpsTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.TpsTask;

        /**
         * Verifies a TpsTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TpsTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TpsTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.TpsTask;

        /**
         * Creates a plain object from a TpsTask message. Also converts values to other types if specified.
         * @param message TpsTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.TpsTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TpsTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SplStakePoolTask. */
    interface ISplStakePoolTask {

        /** SplStakePoolTask pubkey */
        pubkey?: (string|null);
    }

    /** Represents a SplStakePoolTask. */
    class SplStakePoolTask implements ISplStakePoolTask {

        /**
         * Constructs a new SplStakePoolTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISplStakePoolTask);

        /** SplStakePoolTask pubkey. */
        public pubkey: string;

        /**
         * Creates a new SplStakePoolTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SplStakePoolTask instance
         */
        public static create(properties?: OracleJob.ISplStakePoolTask): OracleJob.SplStakePoolTask;

        /**
         * Encodes the specified SplStakePoolTask message. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
         * @param message SplStakePoolTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISplStakePoolTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SplStakePoolTask message, length delimited. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
         * @param message SplStakePoolTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISplStakePoolTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SplStakePoolTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SplStakePoolTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SplStakePoolTask;

        /**
         * Decodes a SplStakePoolTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SplStakePoolTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SplStakePoolTask;

        /**
         * Verifies a SplStakePoolTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SplStakePoolTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SplStakePoolTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SplStakePoolTask;

        /**
         * Creates a plain object from a SplStakePoolTask message. Also converts values to other types if specified.
         * @param message SplStakePoolTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SplStakePoolTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SplStakePoolTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SplTokenParseTask. */
    interface ISplTokenParseTask {

        /** SplTokenParseTask tokenAccountAddress */
        tokenAccountAddress?: (string|null);

        /** SplTokenParseTask mintAddress */
        mintAddress?: (string|null);
    }

    /** Represents a SplTokenParseTask. */
    class SplTokenParseTask implements ISplTokenParseTask {

        /**
         * Constructs a new SplTokenParseTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISplTokenParseTask);

        /** SplTokenParseTask tokenAccountAddress. */
        public tokenAccountAddress?: (string|null);

        /** SplTokenParseTask mintAddress. */
        public mintAddress?: (string|null);

        /** SplTokenParseTask AccountAddress. */
        public AccountAddress?: ("tokenAccountAddress"|"mintAddress");

        /**
         * Creates a new SplTokenParseTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SplTokenParseTask instance
         */
        public static create(properties?: OracleJob.ISplTokenParseTask): OracleJob.SplTokenParseTask;

        /**
         * Encodes the specified SplTokenParseTask message. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
         * @param message SplTokenParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISplTokenParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SplTokenParseTask message, length delimited. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
         * @param message SplTokenParseTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISplTokenParseTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SplTokenParseTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SplTokenParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SplTokenParseTask;

        /**
         * Decodes a SplTokenParseTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SplTokenParseTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SplTokenParseTask;

        /**
         * Verifies a SplTokenParseTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SplTokenParseTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SplTokenParseTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SplTokenParseTask;

        /**
         * Creates a plain object from a SplTokenParseTask message. Also converts values to other types if specified.
         * @param message SplTokenParseTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SplTokenParseTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SplTokenParseTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UniswapExchangeRateTask. */
    interface IUniswapExchangeRateTask {

        /** UniswapExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** UniswapExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** UniswapExchangeRateTask inTokenAmount */
        inTokenAmount?: (number|null);

        /** UniswapExchangeRateTask slippage */
        slippage?: (number|null);

        /** UniswapExchangeRateTask provider */
        provider?: (string|null);
    }

    /** Represents an UniswapExchangeRateTask. */
    class UniswapExchangeRateTask implements IUniswapExchangeRateTask {

        /**
         * Constructs a new UniswapExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IUniswapExchangeRateTask);

        /** UniswapExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** UniswapExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** UniswapExchangeRateTask inTokenAmount. */
        public inTokenAmount: number;

        /** UniswapExchangeRateTask slippage. */
        public slippage: number;

        /** UniswapExchangeRateTask provider. */
        public provider: string;

        /**
         * Creates a new UniswapExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UniswapExchangeRateTask instance
         */
        public static create(properties?: OracleJob.IUniswapExchangeRateTask): OracleJob.UniswapExchangeRateTask;

        /**
         * Encodes the specified UniswapExchangeRateTask message. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
         * @param message UniswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IUniswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UniswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
         * @param message UniswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IUniswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UniswapExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UniswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.UniswapExchangeRateTask;

        /**
         * Decodes an UniswapExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UniswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.UniswapExchangeRateTask;

        /**
         * Verifies an UniswapExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UniswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UniswapExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.UniswapExchangeRateTask;

        /**
         * Creates a plain object from an UniswapExchangeRateTask message. Also converts values to other types if specified.
         * @param message UniswapExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.UniswapExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UniswapExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SushiswapExchangeRateTask. */
    interface ISushiswapExchangeRateTask {

        /** SushiswapExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** SushiswapExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** SushiswapExchangeRateTask inTokenAmount */
        inTokenAmount?: (number|null);

        /** SushiswapExchangeRateTask slippage */
        slippage?: (number|null);

        /** SushiswapExchangeRateTask provider */
        provider?: (string|null);
    }

    /** Represents a SushiswapExchangeRateTask. */
    class SushiswapExchangeRateTask implements ISushiswapExchangeRateTask {

        /**
         * Constructs a new SushiswapExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISushiswapExchangeRateTask);

        /** SushiswapExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** SushiswapExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** SushiswapExchangeRateTask inTokenAmount. */
        public inTokenAmount: number;

        /** SushiswapExchangeRateTask slippage. */
        public slippage: number;

        /** SushiswapExchangeRateTask provider. */
        public provider: string;

        /**
         * Creates a new SushiswapExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SushiswapExchangeRateTask instance
         */
        public static create(properties?: OracleJob.ISushiswapExchangeRateTask): OracleJob.SushiswapExchangeRateTask;

        /**
         * Encodes the specified SushiswapExchangeRateTask message. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
         * @param message SushiswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISushiswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SushiswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
         * @param message SushiswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISushiswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SushiswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SushiswapExchangeRateTask;

        /**
         * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SushiswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SushiswapExchangeRateTask;

        /**
         * Verifies a SushiswapExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SushiswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SushiswapExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SushiswapExchangeRateTask;

        /**
         * Creates a plain object from a SushiswapExchangeRateTask message. Also converts values to other types if specified.
         * @param message SushiswapExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SushiswapExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SushiswapExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PancakeswapExchangeRateTask. */
    interface IPancakeswapExchangeRateTask {

        /** PancakeswapExchangeRateTask inTokenAddress */
        inTokenAddress?: (string|null);

        /** PancakeswapExchangeRateTask outTokenAddress */
        outTokenAddress?: (string|null);

        /** PancakeswapExchangeRateTask inTokenAmount */
        inTokenAmount?: (number|null);

        /** PancakeswapExchangeRateTask slippage */
        slippage?: (number|null);

        /** PancakeswapExchangeRateTask provider */
        provider?: (string|null);
    }

    /** Represents a PancakeswapExchangeRateTask. */
    class PancakeswapExchangeRateTask implements IPancakeswapExchangeRateTask {

        /**
         * Constructs a new PancakeswapExchangeRateTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.IPancakeswapExchangeRateTask);

        /** PancakeswapExchangeRateTask inTokenAddress. */
        public inTokenAddress: string;

        /** PancakeswapExchangeRateTask outTokenAddress. */
        public outTokenAddress: string;

        /** PancakeswapExchangeRateTask inTokenAmount. */
        public inTokenAmount: number;

        /** PancakeswapExchangeRateTask slippage. */
        public slippage: number;

        /** PancakeswapExchangeRateTask provider. */
        public provider: string;

        /**
         * Creates a new PancakeswapExchangeRateTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PancakeswapExchangeRateTask instance
         */
        public static create(properties?: OracleJob.IPancakeswapExchangeRateTask): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Encodes the specified PancakeswapExchangeRateTask message. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
         * @param message PancakeswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.IPancakeswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PancakeswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
         * @param message PancakeswapExchangeRateTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.IPancakeswapExchangeRateTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PancakeswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PancakeswapExchangeRateTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Verifies a PancakeswapExchangeRateTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PancakeswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PancakeswapExchangeRateTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.PancakeswapExchangeRateTask;

        /**
         * Creates a plain object from a PancakeswapExchangeRateTask message. Also converts values to other types if specified.
         * @param message PancakeswapExchangeRateTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.PancakeswapExchangeRateTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PancakeswapExchangeRateTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CacheTask. */
    interface ICacheTask {

        /** CacheTask name */
        name?: (string|null);

        /** CacheTask method */
        method?: (OracleJob.CacheTask.Method|null);
    }

    /** Represents a CacheTask. */
    class CacheTask implements ICacheTask {

        /**
         * Constructs a new CacheTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ICacheTask);

        /** CacheTask name. */
        public name: string;

        /** CacheTask method. */
        public method: OracleJob.CacheTask.Method;

        /**
         * Creates a new CacheTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CacheTask instance
         */
        public static create(properties?: OracleJob.ICacheTask): OracleJob.CacheTask;

        /**
         * Encodes the specified CacheTask message. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
         * @param message CacheTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ICacheTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CacheTask message, length delimited. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
         * @param message CacheTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ICacheTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CacheTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CacheTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.CacheTask;

        /**
         * Decodes a CacheTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CacheTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.CacheTask;

        /**
         * Verifies a CacheTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CacheTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CacheTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.CacheTask;

        /**
         * Creates a plain object from a CacheTask message. Also converts values to other types if specified.
         * @param message CacheTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.CacheTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CacheTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace CacheTask {

        /** Method enum. */
        enum Method {
            METHOD_GET = 0,
            METHOD_SET = 1
        }
    }

    /** Properties of a SysclockOffsetTask. */
    interface ISysclockOffsetTask {
    }

    /** Represents a SysclockOffsetTask. */
    class SysclockOffsetTask implements ISysclockOffsetTask {

        /**
         * Constructs a new SysclockOffsetTask.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ISysclockOffsetTask);

        /**
         * Creates a new SysclockOffsetTask instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SysclockOffsetTask instance
         */
        public static create(properties?: OracleJob.ISysclockOffsetTask): OracleJob.SysclockOffsetTask;

        /**
         * Encodes the specified SysclockOffsetTask message. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
         * @param message SysclockOffsetTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ISysclockOffsetTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SysclockOffsetTask message, length delimited. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
         * @param message SysclockOffsetTask message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ISysclockOffsetTask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SysclockOffsetTask message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SysclockOffsetTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.SysclockOffsetTask;

        /**
         * Decodes a SysclockOffsetTask message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SysclockOffsetTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.SysclockOffsetTask;

        /**
         * Verifies a SysclockOffsetTask message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SysclockOffsetTask message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SysclockOffsetTask
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.SysclockOffsetTask;

        /**
         * Creates a plain object from a SysclockOffsetTask message. Also converts values to other types if specified.
         * @param message SysclockOffsetTask
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.SysclockOffsetTask, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SysclockOffsetTask to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Task. */
    interface ITask {

        /** Task httpTask */
        httpTask?: (OracleJob.IHttpTask|null);

        /** Task jsonParseTask */
        jsonParseTask?: (OracleJob.IJsonParseTask|null);

        /** Task medianTask */
        medianTask?: (OracleJob.IMedianTask|null);

        /** Task meanTask */
        meanTask?: (OracleJob.IMeanTask|null);

        /** Task websocketTask */
        websocketTask?: (OracleJob.IWebsocketTask|null);

        /** Task divideTask */
        divideTask?: (OracleJob.IDivideTask|null);

        /** Task multiplyTask */
        multiplyTask?: (OracleJob.IMultiplyTask|null);

        /** Task lpTokenPriceTask */
        lpTokenPriceTask?: (OracleJob.ILpTokenPriceTask|null);

        /** Task lpExchangeRateTask */
        lpExchangeRateTask?: (OracleJob.ILpExchangeRateTask|null);

        /** Task conditionalTask */
        conditionalTask?: (OracleJob.IConditionalTask|null);

        /** Task valueTask */
        valueTask?: (OracleJob.IValueTask|null);

        /** Task maxTask */
        maxTask?: (OracleJob.IMaxTask|null);

        /** Task regexExtractTask */
        regexExtractTask?: (OracleJob.IRegexExtractTask|null);

        /** Task xstepPriceTask */
        xstepPriceTask?: (OracleJob.IXStepPriceTask|null);

        /** Task addTask */
        addTask?: (OracleJob.IAddTask|null);

        /** Task subtractTask */
        subtractTask?: (OracleJob.ISubtractTask|null);

        /** Task twapTask */
        twapTask?: (OracleJob.ITwapTask|null);

        /** Task serumSwapTask */
        serumSwapTask?: (OracleJob.ISerumSwapTask|null);

        /** Task powTask */
        powTask?: (OracleJob.IPowTask|null);

        /** Task lendingRateTask */
        lendingRateTask?: (OracleJob.ILendingRateTask|null);

        /** Task mangoPerpMarketTask */
        mangoPerpMarketTask?: (OracleJob.IMangoPerpMarketTask|null);

        /** Task jupiterSwapTask */
        jupiterSwapTask?: (OracleJob.IJupiterSwapTask|null);

        /** Task perpMarketTask */
        perpMarketTask?: (OracleJob.IPerpMarketTask|null);

        /** Task oracleTask */
        oracleTask?: (OracleJob.IOracleTask|null);

        /** Task anchorFetchTask */
        anchorFetchTask?: (OracleJob.IAnchorFetchTask|null);

        /** Task defiKingdomsTask */
        defiKingdomsTask?: (OracleJob.IDefiKingdomsTask|null);

        /** Task tpsTask */
        tpsTask?: (OracleJob.ITpsTask|null);

        /** Task splStakePoolTask */
        splStakePoolTask?: (OracleJob.ISplStakePoolTask|null);

        /** Task splTokenParseTask */
        splTokenParseTask?: (OracleJob.ISplTokenParseTask|null);

        /** Task uniswapExchangeRateTask */
        uniswapExchangeRateTask?: (OracleJob.IUniswapExchangeRateTask|null);

        /** Task sushiswapExchangeRateTask */
        sushiswapExchangeRateTask?: (OracleJob.ISushiswapExchangeRateTask|null);

        /** Task pancakeswapExchangeRateTask */
        pancakeswapExchangeRateTask?: (OracleJob.IPancakeswapExchangeRateTask|null);

        /** Task cacheTask */
        cacheTask?: (OracleJob.ICacheTask|null);

        /** Task sysclockOffsetTask */
        sysclockOffsetTask?: (OracleJob.ISysclockOffsetTask|null);
    }

    /** Represents a Task. */
    class Task implements ITask {

        /**
         * Constructs a new Task.
         * @param [properties] Properties to set
         */
        constructor(properties?: OracleJob.ITask);

        /** Task httpTask. */
        public httpTask?: (OracleJob.IHttpTask|null);

        /** Task jsonParseTask. */
        public jsonParseTask?: (OracleJob.IJsonParseTask|null);

        /** Task medianTask. */
        public medianTask?: (OracleJob.IMedianTask|null);

        /** Task meanTask. */
        public meanTask?: (OracleJob.IMeanTask|null);

        /** Task websocketTask. */
        public websocketTask?: (OracleJob.IWebsocketTask|null);

        /** Task divideTask. */
        public divideTask?: (OracleJob.IDivideTask|null);

        /** Task multiplyTask. */
        public multiplyTask?: (OracleJob.IMultiplyTask|null);

        /** Task lpTokenPriceTask. */
        public lpTokenPriceTask?: (OracleJob.ILpTokenPriceTask|null);

        /** Task lpExchangeRateTask. */
        public lpExchangeRateTask?: (OracleJob.ILpExchangeRateTask|null);

        /** Task conditionalTask. */
        public conditionalTask?: (OracleJob.IConditionalTask|null);

        /** Task valueTask. */
        public valueTask?: (OracleJob.IValueTask|null);

        /** Task maxTask. */
        public maxTask?: (OracleJob.IMaxTask|null);

        /** Task regexExtractTask. */
        public regexExtractTask?: (OracleJob.IRegexExtractTask|null);

        /** Task xstepPriceTask. */
        public xstepPriceTask?: (OracleJob.IXStepPriceTask|null);

        /** Task addTask. */
        public addTask?: (OracleJob.IAddTask|null);

        /** Task subtractTask. */
        public subtractTask?: (OracleJob.ISubtractTask|null);

        /** Task twapTask. */
        public twapTask?: (OracleJob.ITwapTask|null);

        /** Task serumSwapTask. */
        public serumSwapTask?: (OracleJob.ISerumSwapTask|null);

        /** Task powTask. */
        public powTask?: (OracleJob.IPowTask|null);

        /** Task lendingRateTask. */
        public lendingRateTask?: (OracleJob.ILendingRateTask|null);

        /** Task mangoPerpMarketTask. */
        public mangoPerpMarketTask?: (OracleJob.IMangoPerpMarketTask|null);

        /** Task jupiterSwapTask. */
        public jupiterSwapTask?: (OracleJob.IJupiterSwapTask|null);

        /** Task perpMarketTask. */
        public perpMarketTask?: (OracleJob.IPerpMarketTask|null);

        /** Task oracleTask. */
        public oracleTask?: (OracleJob.IOracleTask|null);

        /** Task anchorFetchTask. */
        public anchorFetchTask?: (OracleJob.IAnchorFetchTask|null);

        /** Task defiKingdomsTask. */
        public defiKingdomsTask?: (OracleJob.IDefiKingdomsTask|null);

        /** Task tpsTask. */
        public tpsTask?: (OracleJob.ITpsTask|null);

        /** Task splStakePoolTask. */
        public splStakePoolTask?: (OracleJob.ISplStakePoolTask|null);

        /** Task splTokenParseTask. */
        public splTokenParseTask?: (OracleJob.ISplTokenParseTask|null);

        /** Task uniswapExchangeRateTask. */
        public uniswapExchangeRateTask?: (OracleJob.IUniswapExchangeRateTask|null);

        /** Task sushiswapExchangeRateTask. */
        public sushiswapExchangeRateTask?: (OracleJob.ISushiswapExchangeRateTask|null);

        /** Task pancakeswapExchangeRateTask. */
        public pancakeswapExchangeRateTask?: (OracleJob.IPancakeswapExchangeRateTask|null);

        /** Task cacheTask. */
        public cacheTask?: (OracleJob.ICacheTask|null);

        /** Task sysclockOffsetTask. */
        public sysclockOffsetTask?: (OracleJob.ISysclockOffsetTask|null);

        /** Task Task. */
        public Task?: ("httpTask"|"jsonParseTask"|"medianTask"|"meanTask"|"websocketTask"|"divideTask"|"multiplyTask"|"lpTokenPriceTask"|"lpExchangeRateTask"|"conditionalTask"|"valueTask"|"maxTask"|"regexExtractTask"|"xstepPriceTask"|"addTask"|"subtractTask"|"twapTask"|"serumSwapTask"|"powTask"|"lendingRateTask"|"mangoPerpMarketTask"|"jupiterSwapTask"|"perpMarketTask"|"oracleTask"|"anchorFetchTask"|"defiKingdomsTask"|"tpsTask"|"splStakePoolTask"|"splTokenParseTask"|"uniswapExchangeRateTask"|"sushiswapExchangeRateTask"|"pancakeswapExchangeRateTask"|"cacheTask"|"sysclockOffsetTask");

        /**
         * Creates a new Task instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Task instance
         */
        public static create(properties?: OracleJob.ITask): OracleJob.Task;

        /**
         * Encodes the specified Task message. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
         * @param message Task message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OracleJob.ITask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Task message, length delimited. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
         * @param message Task message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OracleJob.ITask, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Task message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Task
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OracleJob.Task;

        /**
         * Decodes a Task message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Task
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OracleJob.Task;

        /**
         * Verifies a Task message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Task message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Task
         */
        public static fromObject(object: { [k: string]: any }): OracleJob.Task;

        /**
         * Creates a plain object from a Task message. Also converts values to other types if specified.
         * @param message Task
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OracleJob.Task, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Task to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a JobPosting. */
export interface IJobPosting {

    /** JobPosting aggregatorStatePubkey */
    aggregatorStatePubkey?: (Uint8Array|null);

    /** JobPosting nodePubkeys */
    nodePubkeys?: (Uint8Array[]|null);

    /** JobPosting slot */
    slot?: (number|Long|null);
}

/** Represents a JobPosting. */
export class JobPosting implements IJobPosting {

    /**
     * Constructs a new JobPosting.
     * @param [properties] Properties to set
     */
    constructor(properties?: IJobPosting);

    /** JobPosting aggregatorStatePubkey. */
    public aggregatorStatePubkey: Uint8Array;

    /** JobPosting nodePubkeys. */
    public nodePubkeys: Uint8Array[];

    /** JobPosting slot. */
    public slot: (number|Long);

    /**
     * Creates a new JobPosting instance using the specified properties.
     * @param [properties] Properties to set
     * @returns JobPosting instance
     */
    public static create(properties?: IJobPosting): JobPosting;

    /**
     * Encodes the specified JobPosting message. Does not implicitly {@link JobPosting.verify|verify} messages.
     * @param message JobPosting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IJobPosting, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified JobPosting message, length delimited. Does not implicitly {@link JobPosting.verify|verify} messages.
     * @param message JobPosting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IJobPosting, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a JobPosting message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns JobPosting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): JobPosting;

    /**
     * Decodes a JobPosting message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns JobPosting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): JobPosting;

    /**
     * Verifies a JobPosting message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a JobPosting message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns JobPosting
     */
    public static fromObject(object: { [k: string]: any }): JobPosting;

    /**
     * Creates a plain object from a JobPosting message. Also converts values to other types if specified.
     * @param message JobPosting
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: JobPosting, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this JobPosting to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a JobResult. */
export interface IJobResult {

    /** JobResult nodePubkey */
    nodePubkey?: (Uint8Array|null);

    /** JobResult result */
    result?: (number|null);

    /** JobResult error */
    error?: (boolean|null);
}

/** Represents a JobResult. */
export class JobResult implements IJobResult {

    /**
     * Constructs a new JobResult.
     * @param [properties] Properties to set
     */
    constructor(properties?: IJobResult);

    /** JobResult nodePubkey. */
    public nodePubkey: Uint8Array;

    /** JobResult result. */
    public result: number;

    /** JobResult error. */
    public error: boolean;

    /**
     * Creates a new JobResult instance using the specified properties.
     * @param [properties] Properties to set
     * @returns JobResult instance
     */
    public static create(properties?: IJobResult): JobResult;

    /**
     * Encodes the specified JobResult message. Does not implicitly {@link JobResult.verify|verify} messages.
     * @param message JobResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IJobResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified JobResult message, length delimited. Does not implicitly {@link JobResult.verify|verify} messages.
     * @param message JobResult message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IJobResult, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a JobResult message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns JobResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): JobResult;

    /**
     * Decodes a JobResult message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns JobResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): JobResult;

    /**
     * Verifies a JobResult message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a JobResult message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns JobResult
     */
    public static fromObject(object: { [k: string]: any }): JobResult;

    /**
     * Creates a plain object from a JobResult message. Also converts values to other types if specified.
     * @param message JobResult
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: JobResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this JobResult to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a VrfAccountData. */
export interface IVrfAccountData {

    /** VrfAccountData selfPubkey */
    selfPubkey?: (Uint8Array|null);

    /** VrfAccountData randomnessProducerPubkey */
    randomnessProducerPubkey?: (Uint8Array|null);

    /** VrfAccountData fulfillmentManagerPubkey */
    fulfillmentManagerPubkey?: (Uint8Array|null);

    /** VrfAccountData minProofConfirmations */
    minProofConfirmations?: (number|null);

    /** VrfAccountData lockConfigs */
    lockConfigs?: (boolean|null);

    /** VrfAccountData counter */
    counter?: (number|Long|null);

    /** VrfAccountData msg */
    msg?: (Uint8Array|null);

    /** VrfAccountData value */
    value?: (Uint8Array|null);

    /** VrfAccountData proof */
    proof?: (Uint8Array|null);

    /** VrfAccountData numProofConfirmations */
    numProofConfirmations?: (number|null);

    /** VrfAccountData lastRequestTimestamp */
    lastRequestTimestamp?: (number|Long|null);

    /** VrfAccountData verifierPubkeys */
    verifierPubkeys?: (Uint8Array[]|null);
}

/** Represents a VrfAccountData. */
export class VrfAccountData implements IVrfAccountData {

    /**
     * Constructs a new VrfAccountData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVrfAccountData);

    /** VrfAccountData selfPubkey. */
    public selfPubkey: Uint8Array;

    /** VrfAccountData randomnessProducerPubkey. */
    public randomnessProducerPubkey: Uint8Array;

    /** VrfAccountData fulfillmentManagerPubkey. */
    public fulfillmentManagerPubkey: Uint8Array;

    /** VrfAccountData minProofConfirmations. */
    public minProofConfirmations: number;

    /** VrfAccountData lockConfigs. */
    public lockConfigs: boolean;

    /** VrfAccountData counter. */
    public counter: (number|Long);

    /** VrfAccountData msg. */
    public msg: Uint8Array;

    /** VrfAccountData value. */
    public value: Uint8Array;

    /** VrfAccountData proof. */
    public proof: Uint8Array;

    /** VrfAccountData numProofConfirmations. */
    public numProofConfirmations: number;

    /** VrfAccountData lastRequestTimestamp. */
    public lastRequestTimestamp: (number|Long);

    /** VrfAccountData verifierPubkeys. */
    public verifierPubkeys: Uint8Array[];

    /**
     * Creates a new VrfAccountData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VrfAccountData instance
     */
    public static create(properties?: IVrfAccountData): VrfAccountData;

    /**
     * Encodes the specified VrfAccountData message. Does not implicitly {@link VrfAccountData.verify|verify} messages.
     * @param message VrfAccountData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVrfAccountData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified VrfAccountData message, length delimited. Does not implicitly {@link VrfAccountData.verify|verify} messages.
     * @param message VrfAccountData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IVrfAccountData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a VrfAccountData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VrfAccountData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VrfAccountData;

    /**
     * Decodes a VrfAccountData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VrfAccountData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VrfAccountData;

    /**
     * Verifies a VrfAccountData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a VrfAccountData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VrfAccountData
     */
    public static fromObject(object: { [k: string]: any }): VrfAccountData;

    /**
     * Creates a plain object from a VrfAccountData message. Also converts values to other types if specified.
     * @param message VrfAccountData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: VrfAccountData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this VrfAccountData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a VrfPermitAccountData. */
export interface IVrfPermitAccountData {

    /** VrfPermitAccountData granter */
    granter?: (Uint8Array|null);

    /** VrfPermitAccountData grantee */
    grantee?: (Uint8Array|null);

    /** VrfPermitAccountData enabled */
    enabled?: (boolean|null);
}

/** Represents a VrfPermitAccountData. */
export class VrfPermitAccountData implements IVrfPermitAccountData {

    /**
     * Constructs a new VrfPermitAccountData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVrfPermitAccountData);

    /** VrfPermitAccountData granter. */
    public granter: Uint8Array;

    /** VrfPermitAccountData grantee. */
    public grantee: Uint8Array;

    /** VrfPermitAccountData enabled. */
    public enabled: boolean;

    /**
     * Creates a new VrfPermitAccountData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VrfPermitAccountData instance
     */
    public static create(properties?: IVrfPermitAccountData): VrfPermitAccountData;

    /**
     * Encodes the specified VrfPermitAccountData message. Does not implicitly {@link VrfPermitAccountData.verify|verify} messages.
     * @param message VrfPermitAccountData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVrfPermitAccountData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified VrfPermitAccountData message, length delimited. Does not implicitly {@link VrfPermitAccountData.verify|verify} messages.
     * @param message VrfPermitAccountData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IVrfPermitAccountData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a VrfPermitAccountData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VrfPermitAccountData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VrfPermitAccountData;

    /**
     * Decodes a VrfPermitAccountData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VrfPermitAccountData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VrfPermitAccountData;

    /**
     * Verifies a VrfPermitAccountData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a VrfPermitAccountData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VrfPermitAccountData
     */
    public static fromObject(object: { [k: string]: any }): VrfPermitAccountData;

    /**
     * Creates a plain object from a VrfPermitAccountData message. Also converts values to other types if specified.
     * @param message VrfPermitAccountData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: VrfPermitAccountData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this VrfPermitAccountData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a BundleAuth. */
export interface IBundleAuth {

    /** BundleAuth version */
    version?: (number|null);

    /** BundleAuth aggregatorAddress */
    aggregatorAddress?: (Uint8Array|null);

    /** BundleAuth bundleAddress */
    bundleAddress?: (Uint8Array|null);

    /** BundleAuth idx */
    idx?: (number|null);
}

/** Represents a BundleAuth. */
export class BundleAuth implements IBundleAuth {

    /**
     * Constructs a new BundleAuth.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBundleAuth);

    /** BundleAuth version. */
    public version: number;

    /** BundleAuth aggregatorAddress. */
    public aggregatorAddress: Uint8Array;

    /** BundleAuth bundleAddress. */
    public bundleAddress: Uint8Array;

    /** BundleAuth idx. */
    public idx: number;

    /**
     * Creates a new BundleAuth instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BundleAuth instance
     */
    public static create(properties?: IBundleAuth): BundleAuth;

    /**
     * Encodes the specified BundleAuth message. Does not implicitly {@link BundleAuth.verify|verify} messages.
     * @param message BundleAuth message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBundleAuth, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BundleAuth message, length delimited. Does not implicitly {@link BundleAuth.verify|verify} messages.
     * @param message BundleAuth message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBundleAuth, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BundleAuth message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BundleAuth
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BundleAuth;

    /**
     * Decodes a BundleAuth message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BundleAuth
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BundleAuth;

    /**
     * Verifies a BundleAuth message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BundleAuth message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BundleAuth
     */
    public static fromObject(object: { [k: string]: any }): BundleAuth;

    /**
     * Creates a plain object from a BundleAuth message. Also converts values to other types if specified.
     * @param message BundleAuth
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BundleAuth, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BundleAuth to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a FulfillmentEntry. */
export interface IFulfillmentEntry {

    /** FulfillmentEntry nodePubkey */
    nodePubkey?: (Uint8Array|null);

    /** FulfillmentEntry leaseCount */
    leaseCount?: (number|null);

    /** FulfillmentEntry slotExpiration */
    slotExpiration?: (number|null);
}

/** Represents a FulfillmentEntry. */
export class FulfillmentEntry implements IFulfillmentEntry {

    /**
     * Constructs a new FulfillmentEntry.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFulfillmentEntry);

    /** FulfillmentEntry nodePubkey. */
    public nodePubkey: Uint8Array;

    /** FulfillmentEntry leaseCount. */
    public leaseCount: number;

    /** FulfillmentEntry slotExpiration. */
    public slotExpiration: number;

    /**
     * Creates a new FulfillmentEntry instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FulfillmentEntry instance
     */
    public static create(properties?: IFulfillmentEntry): FulfillmentEntry;

    /**
     * Encodes the specified FulfillmentEntry message. Does not implicitly {@link FulfillmentEntry.verify|verify} messages.
     * @param message FulfillmentEntry message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFulfillmentEntry, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FulfillmentEntry message, length delimited. Does not implicitly {@link FulfillmentEntry.verify|verify} messages.
     * @param message FulfillmentEntry message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFulfillmentEntry, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FulfillmentEntry message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FulfillmentEntry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FulfillmentEntry;

    /**
     * Decodes a FulfillmentEntry message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FulfillmentEntry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FulfillmentEntry;

    /**
     * Verifies a FulfillmentEntry message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FulfillmentEntry message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FulfillmentEntry
     */
    public static fromObject(object: { [k: string]: any }): FulfillmentEntry;

    /**
     * Creates a plain object from a FulfillmentEntry message. Also converts values to other types if specified.
     * @param message FulfillmentEntry
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FulfillmentEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FulfillmentEntry to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a FulfillmentManagerAuth. */
export interface IFulfillmentManagerAuth {

    /** FulfillmentManagerAuth nomineePubkey */
    nomineePubkey?: (Uint8Array|null);

    /** FulfillmentManagerAuth fulfillmentManagerPubkey */
    fulfillmentManagerPubkey?: (Uint8Array|null);

    /** FulfillmentManagerAuth authorizeHeartbeat */
    authorizeHeartbeat?: (boolean|null);

    /** FulfillmentManagerAuth authorizeUsage */
    authorizeUsage?: (boolean|null);
}

/** Represents a FulfillmentManagerAuth. */
export class FulfillmentManagerAuth implements IFulfillmentManagerAuth {

    /**
     * Constructs a new FulfillmentManagerAuth.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFulfillmentManagerAuth);

    /** FulfillmentManagerAuth nomineePubkey. */
    public nomineePubkey: Uint8Array;

    /** FulfillmentManagerAuth fulfillmentManagerPubkey. */
    public fulfillmentManagerPubkey: Uint8Array;

    /** FulfillmentManagerAuth authorizeHeartbeat. */
    public authorizeHeartbeat: boolean;

    /** FulfillmentManagerAuth authorizeUsage. */
    public authorizeUsage: boolean;

    /**
     * Creates a new FulfillmentManagerAuth instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FulfillmentManagerAuth instance
     */
    public static create(properties?: IFulfillmentManagerAuth): FulfillmentManagerAuth;

    /**
     * Encodes the specified FulfillmentManagerAuth message. Does not implicitly {@link FulfillmentManagerAuth.verify|verify} messages.
     * @param message FulfillmentManagerAuth message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFulfillmentManagerAuth, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FulfillmentManagerAuth message, length delimited. Does not implicitly {@link FulfillmentManagerAuth.verify|verify} messages.
     * @param message FulfillmentManagerAuth message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFulfillmentManagerAuth, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FulfillmentManagerAuth message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FulfillmentManagerAuth
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FulfillmentManagerAuth;

    /**
     * Decodes a FulfillmentManagerAuth message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FulfillmentManagerAuth
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FulfillmentManagerAuth;

    /**
     * Verifies a FulfillmentManagerAuth message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FulfillmentManagerAuth message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FulfillmentManagerAuth
     */
    public static fromObject(object: { [k: string]: any }): FulfillmentManagerAuth;

    /**
     * Creates a plain object from a FulfillmentManagerAuth message. Also converts values to other types if specified.
     * @param message FulfillmentManagerAuth
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FulfillmentManagerAuth, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FulfillmentManagerAuth to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a FulfillmentManagerState. */
export interface IFulfillmentManagerState {

    /** FulfillmentManagerState version */
    version?: (number|null);

    /** FulfillmentManagerState configs */
    configs?: (FulfillmentManagerState.IConfigs|null);

    /** FulfillmentManagerState entries */
    entries?: (IFulfillmentEntry[]|null);
}

/** Represents a FulfillmentManagerState. */
export class FulfillmentManagerState implements IFulfillmentManagerState {

    /**
     * Constructs a new FulfillmentManagerState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFulfillmentManagerState);

    /** FulfillmentManagerState version. */
    public version: number;

    /** FulfillmentManagerState configs. */
    public configs?: (FulfillmentManagerState.IConfigs|null);

    /** FulfillmentManagerState entries. */
    public entries: IFulfillmentEntry[];

    /**
     * Creates a new FulfillmentManagerState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FulfillmentManagerState instance
     */
    public static create(properties?: IFulfillmentManagerState): FulfillmentManagerState;

    /**
     * Encodes the specified FulfillmentManagerState message. Does not implicitly {@link FulfillmentManagerState.verify|verify} messages.
     * @param message FulfillmentManagerState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFulfillmentManagerState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FulfillmentManagerState message, length delimited. Does not implicitly {@link FulfillmentManagerState.verify|verify} messages.
     * @param message FulfillmentManagerState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFulfillmentManagerState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FulfillmentManagerState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FulfillmentManagerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FulfillmentManagerState;

    /**
     * Decodes a FulfillmentManagerState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FulfillmentManagerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FulfillmentManagerState;

    /**
     * Verifies a FulfillmentManagerState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FulfillmentManagerState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FulfillmentManagerState
     */
    public static fromObject(object: { [k: string]: any }): FulfillmentManagerState;

    /**
     * Creates a plain object from a FulfillmentManagerState message. Also converts values to other types if specified.
     * @param message FulfillmentManagerState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FulfillmentManagerState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FulfillmentManagerState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace FulfillmentManagerState {

    /** Properties of a Configs. */
    interface IConfigs {

        /** Configs heartbeatAuthRequired */
        heartbeatAuthRequired?: (boolean|null);

        /** Configs usageAuthRequired */
        usageAuthRequired?: (boolean|null);

        /** Configs locked */
        locked?: (boolean|null);
    }

    /** Represents a Configs. */
    class Configs implements IConfigs {

        /**
         * Constructs a new Configs.
         * @param [properties] Properties to set
         */
        constructor(properties?: FulfillmentManagerState.IConfigs);

        /** Configs heartbeatAuthRequired. */
        public heartbeatAuthRequired: boolean;

        /** Configs usageAuthRequired. */
        public usageAuthRequired: boolean;

        /** Configs locked. */
        public locked: boolean;

        /**
         * Creates a new Configs instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Configs instance
         */
        public static create(properties?: FulfillmentManagerState.IConfigs): FulfillmentManagerState.Configs;

        /**
         * Encodes the specified Configs message. Does not implicitly {@link FulfillmentManagerState.Configs.verify|verify} messages.
         * @param message Configs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: FulfillmentManagerState.IConfigs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Configs message, length delimited. Does not implicitly {@link FulfillmentManagerState.Configs.verify|verify} messages.
         * @param message Configs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: FulfillmentManagerState.IConfigs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Configs message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Configs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FulfillmentManagerState.Configs;

        /**
         * Decodes a Configs message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Configs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FulfillmentManagerState.Configs;

        /**
         * Verifies a Configs message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Configs message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Configs
         */
        public static fromObject(object: { [k: string]: any }): FulfillmentManagerState.Configs;

        /**
         * Creates a plain object from a Configs message. Also converts values to other types if specified.
         * @param message Configs
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: FulfillmentManagerState.Configs, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Configs to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a SwitchboardInstruction. */
export interface ISwitchboardInstruction {

    /** SwitchboardInstruction initInstruction */
    initInstruction?: (SwitchboardInstruction.IInitInstruction|null);

    /** SwitchboardInstruction registerJobInstruction */
    registerJobInstruction?: (SwitchboardInstruction.IRegisterJobInstruction|null);

    /** SwitchboardInstruction unregisterJobInstruction */
    unregisterJobInstruction?: (SwitchboardInstruction.IUnregisterJobInstruction|null);

    /** SwitchboardInstruction updateAggregateInstruction */
    updateAggregateInstruction?: (SwitchboardInstruction.IUpdateAggregateInstruction|null);

    /** SwitchboardInstruction getAggregateInstruction */
    getAggregateInstruction?: (SwitchboardInstruction.IGetAggregateInstruction|null);

    /** SwitchboardInstruction saveResultInstruction */
    saveResultInstruction?: (SwitchboardInstruction.ISaveResultInstruction|null);

    /** SwitchboardInstruction setAggregatorConfigsInstruction */
    setAggregatorConfigsInstruction?: (SwitchboardInstruction.ISetAggregatorConfigsInstruction|null);

    /** SwitchboardInstruction setFulfillmentManagerConfigsInstruction */
    setFulfillmentManagerConfigsInstruction?: (SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction|null);

    /** SwitchboardInstruction heartbeatInstruction */
    heartbeatInstruction?: (SwitchboardInstruction.IHeartbeatInstruction|null);

    /** SwitchboardInstruction registerAuthInstruction */
    registerAuthInstruction?: (SwitchboardInstruction.IRegisterAuthInstruction|null);

    /** SwitchboardInstruction reachFulfillerAgreementInstruction */
    reachFulfillerAgreementInstruction?: (SwitchboardInstruction.IReachFulfillerAgreementInstruction|null);

    /** SwitchboardInstruction removeFulfillerInstruction */
    removeFulfillerInstruction?: (SwitchboardInstruction.IRemoveFulfillerInstruction|null);

    /** SwitchboardInstruction linkParseOptimizedAccountInstruction */
    linkParseOptimizedAccountInstruction?: (SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction|null);

    /** SwitchboardInstruction setBundleAuthConfigsInstruction */
    setBundleAuthConfigsInstruction?: (SwitchboardInstruction.ISetBundleAuthConfigsInstruction|null);

    /** SwitchboardInstruction addBundleAuthInstruction */
    addBundleAuthInstruction?: (SwitchboardInstruction.IAddBundleAuthInstruction|null);

    /** SwitchboardInstruction removeBundleAuthInstruction */
    removeBundleAuthInstruction?: (SwitchboardInstruction.IRemoveBundleAuthInstruction|null);

    /** SwitchboardInstruction saveBundleResultInstruction */
    saveBundleResultInstruction?: (SwitchboardInstruction.ISaveBundleResultInstruction|null);

    /** SwitchboardInstruction setVrfConfigsInstruction */
    setVrfConfigsInstruction?: (SwitchboardInstruction.ISetVrfConfigsInstruction|null);

    /** SwitchboardInstruction requestRandomnessInstruction */
    requestRandomnessInstruction?: (SwitchboardInstruction.IRequestRandomnessInstruction|null);

    /** SwitchboardInstruction respondRandomnessInstruction */
    respondRandomnessInstruction?: (SwitchboardInstruction.IRespondRandomnessInstruction|null);

    /** SwitchboardInstruction confirmRandomnessProofInstruction */
    confirmRandomnessProofInstruction?: (SwitchboardInstruction.IConfirmRandomnessProofInstruction|null);

    /** SwitchboardInstruction setVrfPermitInstruction */
    setVrfPermitInstruction?: (SwitchboardInstruction.ISetVrfPermitInstruction|null);
}

/** Represents a SwitchboardInstruction. */
export class SwitchboardInstruction implements ISwitchboardInstruction {

    /**
     * Constructs a new SwitchboardInstruction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISwitchboardInstruction);

    /** SwitchboardInstruction initInstruction. */
    public initInstruction?: (SwitchboardInstruction.IInitInstruction|null);

    /** SwitchboardInstruction registerJobInstruction. */
    public registerJobInstruction?: (SwitchboardInstruction.IRegisterJobInstruction|null);

    /** SwitchboardInstruction unregisterJobInstruction. */
    public unregisterJobInstruction?: (SwitchboardInstruction.IUnregisterJobInstruction|null);

    /** SwitchboardInstruction updateAggregateInstruction. */
    public updateAggregateInstruction?: (SwitchboardInstruction.IUpdateAggregateInstruction|null);

    /** SwitchboardInstruction getAggregateInstruction. */
    public getAggregateInstruction?: (SwitchboardInstruction.IGetAggregateInstruction|null);

    /** SwitchboardInstruction saveResultInstruction. */
    public saveResultInstruction?: (SwitchboardInstruction.ISaveResultInstruction|null);

    /** SwitchboardInstruction setAggregatorConfigsInstruction. */
    public setAggregatorConfigsInstruction?: (SwitchboardInstruction.ISetAggregatorConfigsInstruction|null);

    /** SwitchboardInstruction setFulfillmentManagerConfigsInstruction. */
    public setFulfillmentManagerConfigsInstruction?: (SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction|null);

    /** SwitchboardInstruction heartbeatInstruction. */
    public heartbeatInstruction?: (SwitchboardInstruction.IHeartbeatInstruction|null);

    /** SwitchboardInstruction registerAuthInstruction. */
    public registerAuthInstruction?: (SwitchboardInstruction.IRegisterAuthInstruction|null);

    /** SwitchboardInstruction reachFulfillerAgreementInstruction. */
    public reachFulfillerAgreementInstruction?: (SwitchboardInstruction.IReachFulfillerAgreementInstruction|null);

    /** SwitchboardInstruction removeFulfillerInstruction. */
    public removeFulfillerInstruction?: (SwitchboardInstruction.IRemoveFulfillerInstruction|null);

    /** SwitchboardInstruction linkParseOptimizedAccountInstruction. */
    public linkParseOptimizedAccountInstruction?: (SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction|null);

    /** SwitchboardInstruction setBundleAuthConfigsInstruction. */
    public setBundleAuthConfigsInstruction?: (SwitchboardInstruction.ISetBundleAuthConfigsInstruction|null);

    /** SwitchboardInstruction addBundleAuthInstruction. */
    public addBundleAuthInstruction?: (SwitchboardInstruction.IAddBundleAuthInstruction|null);

    /** SwitchboardInstruction removeBundleAuthInstruction. */
    public removeBundleAuthInstruction?: (SwitchboardInstruction.IRemoveBundleAuthInstruction|null);

    /** SwitchboardInstruction saveBundleResultInstruction. */
    public saveBundleResultInstruction?: (SwitchboardInstruction.ISaveBundleResultInstruction|null);

    /** SwitchboardInstruction setVrfConfigsInstruction. */
    public setVrfConfigsInstruction?: (SwitchboardInstruction.ISetVrfConfigsInstruction|null);

    /** SwitchboardInstruction requestRandomnessInstruction. */
    public requestRandomnessInstruction?: (SwitchboardInstruction.IRequestRandomnessInstruction|null);

    /** SwitchboardInstruction respondRandomnessInstruction. */
    public respondRandomnessInstruction?: (SwitchboardInstruction.IRespondRandomnessInstruction|null);

    /** SwitchboardInstruction confirmRandomnessProofInstruction. */
    public confirmRandomnessProofInstruction?: (SwitchboardInstruction.IConfirmRandomnessProofInstruction|null);

    /** SwitchboardInstruction setVrfPermitInstruction. */
    public setVrfPermitInstruction?: (SwitchboardInstruction.ISetVrfPermitInstruction|null);

    /** SwitchboardInstruction instruction. */
    public instruction?: ("initInstruction"|"registerJobInstruction"|"unregisterJobInstruction"|"updateAggregateInstruction"|"getAggregateInstruction"|"saveResultInstruction"|"setAggregatorConfigsInstruction"|"setFulfillmentManagerConfigsInstruction"|"heartbeatInstruction"|"registerAuthInstruction"|"reachFulfillerAgreementInstruction"|"removeFulfillerInstruction"|"linkParseOptimizedAccountInstruction"|"setBundleAuthConfigsInstruction"|"addBundleAuthInstruction"|"removeBundleAuthInstruction"|"saveBundleResultInstruction"|"setVrfConfigsInstruction"|"requestRandomnessInstruction"|"respondRandomnessInstruction"|"confirmRandomnessProofInstruction"|"setVrfPermitInstruction");

    /**
     * Creates a new SwitchboardInstruction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SwitchboardInstruction instance
     */
    public static create(properties?: ISwitchboardInstruction): SwitchboardInstruction;

    /**
     * Encodes the specified SwitchboardInstruction message. Does not implicitly {@link SwitchboardInstruction.verify|verify} messages.
     * @param message SwitchboardInstruction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISwitchboardInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SwitchboardInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.verify|verify} messages.
     * @param message SwitchboardInstruction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISwitchboardInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SwitchboardInstruction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SwitchboardInstruction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction;

    /**
     * Decodes a SwitchboardInstruction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SwitchboardInstruction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction;

    /**
     * Verifies a SwitchboardInstruction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SwitchboardInstruction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SwitchboardInstruction
     */
    public static fromObject(object: { [k: string]: any }): SwitchboardInstruction;

    /**
     * Creates a plain object from a SwitchboardInstruction message. Also converts values to other types if specified.
     * @param message SwitchboardInstruction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SwitchboardInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SwitchboardInstruction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace SwitchboardInstruction {

    /** Properties of an InitInstruction. */
    interface IInitInstruction {

        /** InitInstruction type */
        type?: (SwitchboardAccountType|null);
    }

    /** Represents an InitInstruction. */
    class InitInstruction implements IInitInstruction {

        /**
         * Constructs a new InitInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IInitInstruction);

        /** InitInstruction type. */
        public type: SwitchboardAccountType;

        /**
         * Creates a new InitInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InitInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IInitInstruction): SwitchboardInstruction.InitInstruction;

        /**
         * Encodes the specified InitInstruction message. Does not implicitly {@link SwitchboardInstruction.InitInstruction.verify|verify} messages.
         * @param message InitInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IInitInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InitInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.InitInstruction.verify|verify} messages.
         * @param message InitInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IInitInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InitInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InitInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.InitInstruction;

        /**
         * Decodes an InitInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InitInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.InitInstruction;

        /**
         * Verifies an InitInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InitInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InitInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.InitInstruction;

        /**
         * Creates a plain object from an InitInstruction message. Also converts values to other types if specified.
         * @param message InitInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.InitInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InitInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegisterJobInstruction. */
    interface IRegisterJobInstruction {

        /** RegisterJobInstruction job */
        job?: (IOracleJob|null);
    }

    /** Represents a RegisterJobInstruction. */
    class RegisterJobInstruction implements IRegisterJobInstruction {

        /**
         * Constructs a new RegisterJobInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IRegisterJobInstruction);

        /** RegisterJobInstruction job. */
        public job?: (IOracleJob|null);

        /**
         * Creates a new RegisterJobInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterJobInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IRegisterJobInstruction): SwitchboardInstruction.RegisterJobInstruction;

        /**
         * Encodes the specified RegisterJobInstruction message. Does not implicitly {@link SwitchboardInstruction.RegisterJobInstruction.verify|verify} messages.
         * @param message RegisterJobInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IRegisterJobInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterJobInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RegisterJobInstruction.verify|verify} messages.
         * @param message RegisterJobInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IRegisterJobInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterJobInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterJobInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.RegisterJobInstruction;

        /**
         * Decodes a RegisterJobInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterJobInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.RegisterJobInstruction;

        /**
         * Verifies a RegisterJobInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterJobInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterJobInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.RegisterJobInstruction;

        /**
         * Creates a plain object from a RegisterJobInstruction message. Also converts values to other types if specified.
         * @param message RegisterJobInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.RegisterJobInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterJobInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UnregisterJobInstruction. */
    interface IUnregisterJobInstruction {

        /** UnregisterJobInstruction jobPubkey */
        jobPubkey?: (Uint8Array|null);
    }

    /** Represents an UnregisterJobInstruction. */
    class UnregisterJobInstruction implements IUnregisterJobInstruction {

        /**
         * Constructs a new UnregisterJobInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IUnregisterJobInstruction);

        /** UnregisterJobInstruction jobPubkey. */
        public jobPubkey: Uint8Array;

        /**
         * Creates a new UnregisterJobInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UnregisterJobInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IUnregisterJobInstruction): SwitchboardInstruction.UnregisterJobInstruction;

        /**
         * Encodes the specified UnregisterJobInstruction message. Does not implicitly {@link SwitchboardInstruction.UnregisterJobInstruction.verify|verify} messages.
         * @param message UnregisterJobInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IUnregisterJobInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UnregisterJobInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.UnregisterJobInstruction.verify|verify} messages.
         * @param message UnregisterJobInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IUnregisterJobInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UnregisterJobInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UnregisterJobInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.UnregisterJobInstruction;

        /**
         * Decodes an UnregisterJobInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UnregisterJobInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.UnregisterJobInstruction;

        /**
         * Verifies an UnregisterJobInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UnregisterJobInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UnregisterJobInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.UnregisterJobInstruction;

        /**
         * Creates a plain object from an UnregisterJobInstruction message. Also converts values to other types if specified.
         * @param message UnregisterJobInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.UnregisterJobInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UnregisterJobInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateAggregateInstruction. */
    interface IUpdateAggregateInstruction {
    }

    /** Represents an UpdateAggregateInstruction. */
    class UpdateAggregateInstruction implements IUpdateAggregateInstruction {

        /**
         * Constructs a new UpdateAggregateInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IUpdateAggregateInstruction);

        /**
         * Creates a new UpdateAggregateInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateAggregateInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IUpdateAggregateInstruction): SwitchboardInstruction.UpdateAggregateInstruction;

        /**
         * Encodes the specified UpdateAggregateInstruction message. Does not implicitly {@link SwitchboardInstruction.UpdateAggregateInstruction.verify|verify} messages.
         * @param message UpdateAggregateInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IUpdateAggregateInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateAggregateInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.UpdateAggregateInstruction.verify|verify} messages.
         * @param message UpdateAggregateInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IUpdateAggregateInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateAggregateInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateAggregateInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.UpdateAggregateInstruction;

        /**
         * Decodes an UpdateAggregateInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateAggregateInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.UpdateAggregateInstruction;

        /**
         * Verifies an UpdateAggregateInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateAggregateInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateAggregateInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.UpdateAggregateInstruction;

        /**
         * Creates a plain object from an UpdateAggregateInstruction message. Also converts values to other types if specified.
         * @param message UpdateAggregateInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.UpdateAggregateInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateAggregateInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetAggregateInstruction. */
    interface IGetAggregateInstruction {
    }

    /** Represents a GetAggregateInstruction. */
    class GetAggregateInstruction implements IGetAggregateInstruction {

        /**
         * Constructs a new GetAggregateInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IGetAggregateInstruction);

        /**
         * Creates a new GetAggregateInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetAggregateInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IGetAggregateInstruction): SwitchboardInstruction.GetAggregateInstruction;

        /**
         * Encodes the specified GetAggregateInstruction message. Does not implicitly {@link SwitchboardInstruction.GetAggregateInstruction.verify|verify} messages.
         * @param message GetAggregateInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IGetAggregateInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetAggregateInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.GetAggregateInstruction.verify|verify} messages.
         * @param message GetAggregateInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IGetAggregateInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetAggregateInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetAggregateInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.GetAggregateInstruction;

        /**
         * Decodes a GetAggregateInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetAggregateInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.GetAggregateInstruction;

        /**
         * Verifies a GetAggregateInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetAggregateInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetAggregateInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.GetAggregateInstruction;

        /**
         * Creates a plain object from a GetAggregateInstruction message. Also converts values to other types if specified.
         * @param message GetAggregateInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.GetAggregateInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetAggregateInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetAggregatorConfigsInstruction. */
    interface ISetAggregatorConfigsInstruction {

        /** SetAggregatorConfigsInstruction minConfirmations */
        minConfirmations?: (number|null);

        /** SetAggregatorConfigsInstruction minUpdateDelaySeconds */
        minUpdateDelaySeconds?: (number|Long|null);

        /** SetAggregatorConfigsInstruction fulfillmentManagerPubkey */
        fulfillmentManagerPubkey?: (Uint8Array|null);

        /** SetAggregatorConfigsInstruction lock */
        lock?: (boolean|null);
    }

    /** Represents a SetAggregatorConfigsInstruction. */
    class SetAggregatorConfigsInstruction implements ISetAggregatorConfigsInstruction {

        /**
         * Constructs a new SetAggregatorConfigsInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISetAggregatorConfigsInstruction);

        /** SetAggregatorConfigsInstruction minConfirmations. */
        public minConfirmations: number;

        /** SetAggregatorConfigsInstruction minUpdateDelaySeconds. */
        public minUpdateDelaySeconds: (number|Long);

        /** SetAggregatorConfigsInstruction fulfillmentManagerPubkey. */
        public fulfillmentManagerPubkey: Uint8Array;

        /** SetAggregatorConfigsInstruction lock. */
        public lock: boolean;

        /**
         * Creates a new SetAggregatorConfigsInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetAggregatorConfigsInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISetAggregatorConfigsInstruction): SwitchboardInstruction.SetAggregatorConfigsInstruction;

        /**
         * Encodes the specified SetAggregatorConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetAggregatorConfigsInstruction.verify|verify} messages.
         * @param message SetAggregatorConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISetAggregatorConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetAggregatorConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetAggregatorConfigsInstruction.verify|verify} messages.
         * @param message SetAggregatorConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISetAggregatorConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetAggregatorConfigsInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetAggregatorConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SetAggregatorConfigsInstruction;

        /**
         * Decodes a SetAggregatorConfigsInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetAggregatorConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SetAggregatorConfigsInstruction;

        /**
         * Verifies a SetAggregatorConfigsInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetAggregatorConfigsInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetAggregatorConfigsInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SetAggregatorConfigsInstruction;

        /**
         * Creates a plain object from a SetAggregatorConfigsInstruction message. Also converts values to other types if specified.
         * @param message SetAggregatorConfigsInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SetAggregatorConfigsInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetAggregatorConfigsInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetFulfillmentManagerConfigsInstruction. */
    interface ISetFulfillmentManagerConfigsInstruction {

        /** SetFulfillmentManagerConfigsInstruction heartbeatAuthRequired */
        heartbeatAuthRequired?: (boolean|null);

        /** SetFulfillmentManagerConfigsInstruction usageAuthRequired */
        usageAuthRequired?: (boolean|null);

        /** SetFulfillmentManagerConfigsInstruction lock */
        lock?: (boolean|null);
    }

    /** Represents a SetFulfillmentManagerConfigsInstruction. */
    class SetFulfillmentManagerConfigsInstruction implements ISetFulfillmentManagerConfigsInstruction {

        /**
         * Constructs a new SetFulfillmentManagerConfigsInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction);

        /** SetFulfillmentManagerConfigsInstruction heartbeatAuthRequired. */
        public heartbeatAuthRequired: boolean;

        /** SetFulfillmentManagerConfigsInstruction usageAuthRequired. */
        public usageAuthRequired: boolean;

        /** SetFulfillmentManagerConfigsInstruction lock. */
        public lock: boolean;

        /**
         * Creates a new SetFulfillmentManagerConfigsInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetFulfillmentManagerConfigsInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction): SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction;

        /**
         * Encodes the specified SetFulfillmentManagerConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.verify|verify} messages.
         * @param message SetFulfillmentManagerConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetFulfillmentManagerConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.verify|verify} messages.
         * @param message SetFulfillmentManagerConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetFulfillmentManagerConfigsInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetFulfillmentManagerConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction;

        /**
         * Decodes a SetFulfillmentManagerConfigsInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetFulfillmentManagerConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction;

        /**
         * Verifies a SetFulfillmentManagerConfigsInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetFulfillmentManagerConfigsInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetFulfillmentManagerConfigsInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction;

        /**
         * Creates a plain object from a SetFulfillmentManagerConfigsInstruction message. Also converts values to other types if specified.
         * @param message SetFulfillmentManagerConfigsInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetFulfillmentManagerConfigsInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SaveResultInstruction. */
    interface ISaveResultInstruction {

        /** SaveResultInstruction nodeIdx */
        nodeIdx?: (number|null);

        /** SaveResultInstruction result */
        result?: (number|null);

        /** SaveResultInstruction error */
        error?: (boolean|null);

        /** SaveResultInstruction roundSlot */
        roundSlot?: (number|Long|null);

        /** SaveResultInstruction minResponse */
        minResponse?: (number|null);

        /** SaveResultInstruction maxResponse */
        maxResponse?: (number|null);
    }

    /** Represents a SaveResultInstruction. */
    class SaveResultInstruction implements ISaveResultInstruction {

        /**
         * Constructs a new SaveResultInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISaveResultInstruction);

        /** SaveResultInstruction nodeIdx. */
        public nodeIdx: number;

        /** SaveResultInstruction result. */
        public result: number;

        /** SaveResultInstruction error. */
        public error: boolean;

        /** SaveResultInstruction roundSlot. */
        public roundSlot: (number|Long);

        /** SaveResultInstruction minResponse. */
        public minResponse: number;

        /** SaveResultInstruction maxResponse. */
        public maxResponse: number;

        /**
         * Creates a new SaveResultInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SaveResultInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISaveResultInstruction): SwitchboardInstruction.SaveResultInstruction;

        /**
         * Encodes the specified SaveResultInstruction message. Does not implicitly {@link SwitchboardInstruction.SaveResultInstruction.verify|verify} messages.
         * @param message SaveResultInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISaveResultInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SaveResultInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SaveResultInstruction.verify|verify} messages.
         * @param message SaveResultInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISaveResultInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SaveResultInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SaveResultInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SaveResultInstruction;

        /**
         * Decodes a SaveResultInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SaveResultInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SaveResultInstruction;

        /**
         * Verifies a SaveResultInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SaveResultInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SaveResultInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SaveResultInstruction;

        /**
         * Creates a plain object from a SaveResultInstruction message. Also converts values to other types if specified.
         * @param message SaveResultInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SaveResultInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SaveResultInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HeartbeatInstruction. */
    interface IHeartbeatInstruction {

        /** HeartbeatInstruction leaseCount */
        leaseCount?: (number|Long|null);

        /** HeartbeatInstruction slotExpiration */
        slotExpiration?: (number|Long|null);
    }

    /** Represents a HeartbeatInstruction. */
    class HeartbeatInstruction implements IHeartbeatInstruction {

        /**
         * Constructs a new HeartbeatInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IHeartbeatInstruction);

        /** HeartbeatInstruction leaseCount. */
        public leaseCount: (number|Long);

        /** HeartbeatInstruction slotExpiration. */
        public slotExpiration: (number|Long);

        /**
         * Creates a new HeartbeatInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IHeartbeatInstruction): SwitchboardInstruction.HeartbeatInstruction;

        /**
         * Encodes the specified HeartbeatInstruction message. Does not implicitly {@link SwitchboardInstruction.HeartbeatInstruction.verify|verify} messages.
         * @param message HeartbeatInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IHeartbeatInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.HeartbeatInstruction.verify|verify} messages.
         * @param message HeartbeatInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IHeartbeatInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.HeartbeatInstruction;

        /**
         * Decodes a HeartbeatInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.HeartbeatInstruction;

        /**
         * Verifies a HeartbeatInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.HeartbeatInstruction;

        /**
         * Creates a plain object from a HeartbeatInstruction message. Also converts values to other types if specified.
         * @param message HeartbeatInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.HeartbeatInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegisterAuthInstruction. */
    interface IRegisterAuthInstruction {

        /** RegisterAuthInstruction authorizeHeartbeat */
        authorizeHeartbeat?: (boolean|null);

        /** RegisterAuthInstruction authorizeUsage */
        authorizeUsage?: (boolean|null);
    }

    /** Represents a RegisterAuthInstruction. */
    class RegisterAuthInstruction implements IRegisterAuthInstruction {

        /**
         * Constructs a new RegisterAuthInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IRegisterAuthInstruction);

        /** RegisterAuthInstruction authorizeHeartbeat. */
        public authorizeHeartbeat: boolean;

        /** RegisterAuthInstruction authorizeUsage. */
        public authorizeUsage: boolean;

        /**
         * Creates a new RegisterAuthInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterAuthInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IRegisterAuthInstruction): SwitchboardInstruction.RegisterAuthInstruction;

        /**
         * Encodes the specified RegisterAuthInstruction message. Does not implicitly {@link SwitchboardInstruction.RegisterAuthInstruction.verify|verify} messages.
         * @param message RegisterAuthInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IRegisterAuthInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterAuthInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RegisterAuthInstruction.verify|verify} messages.
         * @param message RegisterAuthInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IRegisterAuthInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterAuthInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterAuthInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.RegisterAuthInstruction;

        /**
         * Decodes a RegisterAuthInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterAuthInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.RegisterAuthInstruction;

        /**
         * Verifies a RegisterAuthInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterAuthInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterAuthInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.RegisterAuthInstruction;

        /**
         * Creates a plain object from a RegisterAuthInstruction message. Also converts values to other types if specified.
         * @param message RegisterAuthInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.RegisterAuthInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterAuthInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ReachFulfillerAgreementInstruction. */
    interface IReachFulfillerAgreementInstruction {
    }

    /** Represents a ReachFulfillerAgreementInstruction. */
    class ReachFulfillerAgreementInstruction implements IReachFulfillerAgreementInstruction {

        /**
         * Constructs a new ReachFulfillerAgreementInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IReachFulfillerAgreementInstruction);

        /**
         * Creates a new ReachFulfillerAgreementInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReachFulfillerAgreementInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IReachFulfillerAgreementInstruction): SwitchboardInstruction.ReachFulfillerAgreementInstruction;

        /**
         * Encodes the specified ReachFulfillerAgreementInstruction message. Does not implicitly {@link SwitchboardInstruction.ReachFulfillerAgreementInstruction.verify|verify} messages.
         * @param message ReachFulfillerAgreementInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IReachFulfillerAgreementInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReachFulfillerAgreementInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.ReachFulfillerAgreementInstruction.verify|verify} messages.
         * @param message ReachFulfillerAgreementInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IReachFulfillerAgreementInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReachFulfillerAgreementInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReachFulfillerAgreementInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.ReachFulfillerAgreementInstruction;

        /**
         * Decodes a ReachFulfillerAgreementInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReachFulfillerAgreementInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.ReachFulfillerAgreementInstruction;

        /**
         * Verifies a ReachFulfillerAgreementInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReachFulfillerAgreementInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReachFulfillerAgreementInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.ReachFulfillerAgreementInstruction;

        /**
         * Creates a plain object from a ReachFulfillerAgreementInstruction message. Also converts values to other types if specified.
         * @param message ReachFulfillerAgreementInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.ReachFulfillerAgreementInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReachFulfillerAgreementInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RemoveFulfillerInstruction. */
    interface IRemoveFulfillerInstruction {
    }

    /** Represents a RemoveFulfillerInstruction. */
    class RemoveFulfillerInstruction implements IRemoveFulfillerInstruction {

        /**
         * Constructs a new RemoveFulfillerInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IRemoveFulfillerInstruction);

        /**
         * Creates a new RemoveFulfillerInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RemoveFulfillerInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IRemoveFulfillerInstruction): SwitchboardInstruction.RemoveFulfillerInstruction;

        /**
         * Encodes the specified RemoveFulfillerInstruction message. Does not implicitly {@link SwitchboardInstruction.RemoveFulfillerInstruction.verify|verify} messages.
         * @param message RemoveFulfillerInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IRemoveFulfillerInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RemoveFulfillerInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RemoveFulfillerInstruction.verify|verify} messages.
         * @param message RemoveFulfillerInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IRemoveFulfillerInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RemoveFulfillerInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RemoveFulfillerInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.RemoveFulfillerInstruction;

        /**
         * Decodes a RemoveFulfillerInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RemoveFulfillerInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.RemoveFulfillerInstruction;

        /**
         * Verifies a RemoveFulfillerInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RemoveFulfillerInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RemoveFulfillerInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.RemoveFulfillerInstruction;

        /**
         * Creates a plain object from a RemoveFulfillerInstruction message. Also converts values to other types if specified.
         * @param message RemoveFulfillerInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.RemoveFulfillerInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RemoveFulfillerInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LinkedParseOptimizedResultAccountInstruction. */
    interface ILinkedParseOptimizedResultAccountInstruction {
    }

    /** Represents a LinkedParseOptimizedResultAccountInstruction. */
    class LinkedParseOptimizedResultAccountInstruction implements ILinkedParseOptimizedResultAccountInstruction {

        /**
         * Constructs a new LinkedParseOptimizedResultAccountInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction);

        /**
         * Creates a new LinkedParseOptimizedResultAccountInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LinkedParseOptimizedResultAccountInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction): SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction;

        /**
         * Encodes the specified LinkedParseOptimizedResultAccountInstruction message. Does not implicitly {@link SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.verify|verify} messages.
         * @param message LinkedParseOptimizedResultAccountInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LinkedParseOptimizedResultAccountInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.verify|verify} messages.
         * @param message LinkedParseOptimizedResultAccountInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LinkedParseOptimizedResultAccountInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LinkedParseOptimizedResultAccountInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction;

        /**
         * Decodes a LinkedParseOptimizedResultAccountInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LinkedParseOptimizedResultAccountInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction;

        /**
         * Verifies a LinkedParseOptimizedResultAccountInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LinkedParseOptimizedResultAccountInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LinkedParseOptimizedResultAccountInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction;

        /**
         * Creates a plain object from a LinkedParseOptimizedResultAccountInstruction message. Also converts values to other types if specified.
         * @param message LinkedParseOptimizedResultAccountInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LinkedParseOptimizedResultAccountInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetBundleAuthConfigsInstruction. */
    interface ISetBundleAuthConfigsInstruction {

        /** SetBundleAuthConfigsInstruction idx */
        idx?: (number|null);
    }

    /** Represents a SetBundleAuthConfigsInstruction. */
    class SetBundleAuthConfigsInstruction implements ISetBundleAuthConfigsInstruction {

        /**
         * Constructs a new SetBundleAuthConfigsInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISetBundleAuthConfigsInstruction);

        /** SetBundleAuthConfigsInstruction idx. */
        public idx: number;

        /**
         * Creates a new SetBundleAuthConfigsInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetBundleAuthConfigsInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISetBundleAuthConfigsInstruction): SwitchboardInstruction.SetBundleAuthConfigsInstruction;

        /**
         * Encodes the specified SetBundleAuthConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetBundleAuthConfigsInstruction.verify|verify} messages.
         * @param message SetBundleAuthConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISetBundleAuthConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetBundleAuthConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetBundleAuthConfigsInstruction.verify|verify} messages.
         * @param message SetBundleAuthConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISetBundleAuthConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetBundleAuthConfigsInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetBundleAuthConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SetBundleAuthConfigsInstruction;

        /**
         * Decodes a SetBundleAuthConfigsInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetBundleAuthConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SetBundleAuthConfigsInstruction;

        /**
         * Verifies a SetBundleAuthConfigsInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetBundleAuthConfigsInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetBundleAuthConfigsInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SetBundleAuthConfigsInstruction;

        /**
         * Creates a plain object from a SetBundleAuthConfigsInstruction message. Also converts values to other types if specified.
         * @param message SetBundleAuthConfigsInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SetBundleAuthConfigsInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetBundleAuthConfigsInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddBundleAuthInstruction. */
    interface IAddBundleAuthInstruction {
    }

    /** Represents an AddBundleAuthInstruction. */
    class AddBundleAuthInstruction implements IAddBundleAuthInstruction {

        /**
         * Constructs a new AddBundleAuthInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IAddBundleAuthInstruction);

        /**
         * Creates a new AddBundleAuthInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddBundleAuthInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IAddBundleAuthInstruction): SwitchboardInstruction.AddBundleAuthInstruction;

        /**
         * Encodes the specified AddBundleAuthInstruction message. Does not implicitly {@link SwitchboardInstruction.AddBundleAuthInstruction.verify|verify} messages.
         * @param message AddBundleAuthInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IAddBundleAuthInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddBundleAuthInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.AddBundleAuthInstruction.verify|verify} messages.
         * @param message AddBundleAuthInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IAddBundleAuthInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddBundleAuthInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddBundleAuthInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.AddBundleAuthInstruction;

        /**
         * Decodes an AddBundleAuthInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddBundleAuthInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.AddBundleAuthInstruction;

        /**
         * Verifies an AddBundleAuthInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddBundleAuthInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddBundleAuthInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.AddBundleAuthInstruction;

        /**
         * Creates a plain object from an AddBundleAuthInstruction message. Also converts values to other types if specified.
         * @param message AddBundleAuthInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.AddBundleAuthInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddBundleAuthInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RemoveBundleAuthInstruction. */
    interface IRemoveBundleAuthInstruction {
    }

    /** Represents a RemoveBundleAuthInstruction. */
    class RemoveBundleAuthInstruction implements IRemoveBundleAuthInstruction {

        /**
         * Constructs a new RemoveBundleAuthInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IRemoveBundleAuthInstruction);

        /**
         * Creates a new RemoveBundleAuthInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RemoveBundleAuthInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IRemoveBundleAuthInstruction): SwitchboardInstruction.RemoveBundleAuthInstruction;

        /**
         * Encodes the specified RemoveBundleAuthInstruction message. Does not implicitly {@link SwitchboardInstruction.RemoveBundleAuthInstruction.verify|verify} messages.
         * @param message RemoveBundleAuthInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IRemoveBundleAuthInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RemoveBundleAuthInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RemoveBundleAuthInstruction.verify|verify} messages.
         * @param message RemoveBundleAuthInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IRemoveBundleAuthInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RemoveBundleAuthInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RemoveBundleAuthInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.RemoveBundleAuthInstruction;

        /**
         * Decodes a RemoveBundleAuthInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RemoveBundleAuthInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.RemoveBundleAuthInstruction;

        /**
         * Verifies a RemoveBundleAuthInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RemoveBundleAuthInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RemoveBundleAuthInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.RemoveBundleAuthInstruction;

        /**
         * Creates a plain object from a RemoveBundleAuthInstruction message. Also converts values to other types if specified.
         * @param message RemoveBundleAuthInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.RemoveBundleAuthInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RemoveBundleAuthInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SaveBundleResultInstruction. */
    interface ISaveBundleResultInstruction {
    }

    /** Represents a SaveBundleResultInstruction. */
    class SaveBundleResultInstruction implements ISaveBundleResultInstruction {

        /**
         * Constructs a new SaveBundleResultInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISaveBundleResultInstruction);

        /**
         * Creates a new SaveBundleResultInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SaveBundleResultInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISaveBundleResultInstruction): SwitchboardInstruction.SaveBundleResultInstruction;

        /**
         * Encodes the specified SaveBundleResultInstruction message. Does not implicitly {@link SwitchboardInstruction.SaveBundleResultInstruction.verify|verify} messages.
         * @param message SaveBundleResultInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISaveBundleResultInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SaveBundleResultInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SaveBundleResultInstruction.verify|verify} messages.
         * @param message SaveBundleResultInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISaveBundleResultInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SaveBundleResultInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SaveBundleResultInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SaveBundleResultInstruction;

        /**
         * Decodes a SaveBundleResultInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SaveBundleResultInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SaveBundleResultInstruction;

        /**
         * Verifies a SaveBundleResultInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SaveBundleResultInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SaveBundleResultInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SaveBundleResultInstruction;

        /**
         * Creates a plain object from a SaveBundleResultInstruction message. Also converts values to other types if specified.
         * @param message SaveBundleResultInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SaveBundleResultInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SaveBundleResultInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetVrfConfigsInstruction. */
    interface ISetVrfConfigsInstruction {

        /** SetVrfConfigsInstruction minProofConfirmations */
        minProofConfirmations?: (number|null);

        /** SetVrfConfigsInstruction lockConfigs */
        lockConfigs?: (boolean|null);
    }

    /** Represents a SetVrfConfigsInstruction. */
    class SetVrfConfigsInstruction implements ISetVrfConfigsInstruction {

        /**
         * Constructs a new SetVrfConfigsInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISetVrfConfigsInstruction);

        /** SetVrfConfigsInstruction minProofConfirmations. */
        public minProofConfirmations: number;

        /** SetVrfConfigsInstruction lockConfigs. */
        public lockConfigs: boolean;

        /**
         * Creates a new SetVrfConfigsInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetVrfConfigsInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISetVrfConfigsInstruction): SwitchboardInstruction.SetVrfConfigsInstruction;

        /**
         * Encodes the specified SetVrfConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetVrfConfigsInstruction.verify|verify} messages.
         * @param message SetVrfConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISetVrfConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetVrfConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetVrfConfigsInstruction.verify|verify} messages.
         * @param message SetVrfConfigsInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISetVrfConfigsInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetVrfConfigsInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetVrfConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SetVrfConfigsInstruction;

        /**
         * Decodes a SetVrfConfigsInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetVrfConfigsInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SetVrfConfigsInstruction;

        /**
         * Verifies a SetVrfConfigsInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetVrfConfigsInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetVrfConfigsInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SetVrfConfigsInstruction;

        /**
         * Creates a plain object from a SetVrfConfigsInstruction message. Also converts values to other types if specified.
         * @param message SetVrfConfigsInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SetVrfConfigsInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetVrfConfigsInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RequestRandomnessInstruction. */
    interface IRequestRandomnessInstruction {
    }

    /** Represents a RequestRandomnessInstruction. */
    class RequestRandomnessInstruction implements IRequestRandomnessInstruction {

        /**
         * Constructs a new RequestRandomnessInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IRequestRandomnessInstruction);

        /**
         * Creates a new RequestRandomnessInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RequestRandomnessInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IRequestRandomnessInstruction): SwitchboardInstruction.RequestRandomnessInstruction;

        /**
         * Encodes the specified RequestRandomnessInstruction message. Does not implicitly {@link SwitchboardInstruction.RequestRandomnessInstruction.verify|verify} messages.
         * @param message RequestRandomnessInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IRequestRandomnessInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RequestRandomnessInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RequestRandomnessInstruction.verify|verify} messages.
         * @param message RequestRandomnessInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IRequestRandomnessInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RequestRandomnessInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RequestRandomnessInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.RequestRandomnessInstruction;

        /**
         * Decodes a RequestRandomnessInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RequestRandomnessInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.RequestRandomnessInstruction;

        /**
         * Verifies a RequestRandomnessInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RequestRandomnessInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RequestRandomnessInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.RequestRandomnessInstruction;

        /**
         * Creates a plain object from a RequestRandomnessInstruction message. Also converts values to other types if specified.
         * @param message RequestRandomnessInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.RequestRandomnessInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RequestRandomnessInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RespondRandomnessInstruction. */
    interface IRespondRandomnessInstruction {

        /** RespondRandomnessInstruction value */
        value?: (Uint8Array|null);

        /** RespondRandomnessInstruction proof */
        proof?: (Uint8Array|null);
    }

    /** Represents a RespondRandomnessInstruction. */
    class RespondRandomnessInstruction implements IRespondRandomnessInstruction {

        /**
         * Constructs a new RespondRandomnessInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IRespondRandomnessInstruction);

        /** RespondRandomnessInstruction value. */
        public value: Uint8Array;

        /** RespondRandomnessInstruction proof. */
        public proof: Uint8Array;

        /**
         * Creates a new RespondRandomnessInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RespondRandomnessInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IRespondRandomnessInstruction): SwitchboardInstruction.RespondRandomnessInstruction;

        /**
         * Encodes the specified RespondRandomnessInstruction message. Does not implicitly {@link SwitchboardInstruction.RespondRandomnessInstruction.verify|verify} messages.
         * @param message RespondRandomnessInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IRespondRandomnessInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RespondRandomnessInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RespondRandomnessInstruction.verify|verify} messages.
         * @param message RespondRandomnessInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IRespondRandomnessInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RespondRandomnessInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RespondRandomnessInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.RespondRandomnessInstruction;

        /**
         * Decodes a RespondRandomnessInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RespondRandomnessInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.RespondRandomnessInstruction;

        /**
         * Verifies a RespondRandomnessInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RespondRandomnessInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RespondRandomnessInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.RespondRandomnessInstruction;

        /**
         * Creates a plain object from a RespondRandomnessInstruction message. Also converts values to other types if specified.
         * @param message RespondRandomnessInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.RespondRandomnessInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RespondRandomnessInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConfirmRandomnessProofInstruction. */
    interface IConfirmRandomnessProofInstruction {

        /** ConfirmRandomnessProofInstruction proof */
        proof?: (Uint8Array|null);
    }

    /** Represents a ConfirmRandomnessProofInstruction. */
    class ConfirmRandomnessProofInstruction implements IConfirmRandomnessProofInstruction {

        /**
         * Constructs a new ConfirmRandomnessProofInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.IConfirmRandomnessProofInstruction);

        /** ConfirmRandomnessProofInstruction proof. */
        public proof: Uint8Array;

        /**
         * Creates a new ConfirmRandomnessProofInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConfirmRandomnessProofInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.IConfirmRandomnessProofInstruction): SwitchboardInstruction.ConfirmRandomnessProofInstruction;

        /**
         * Encodes the specified ConfirmRandomnessProofInstruction message. Does not implicitly {@link SwitchboardInstruction.ConfirmRandomnessProofInstruction.verify|verify} messages.
         * @param message ConfirmRandomnessProofInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.IConfirmRandomnessProofInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConfirmRandomnessProofInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.ConfirmRandomnessProofInstruction.verify|verify} messages.
         * @param message ConfirmRandomnessProofInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.IConfirmRandomnessProofInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConfirmRandomnessProofInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConfirmRandomnessProofInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.ConfirmRandomnessProofInstruction;

        /**
         * Decodes a ConfirmRandomnessProofInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConfirmRandomnessProofInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.ConfirmRandomnessProofInstruction;

        /**
         * Verifies a ConfirmRandomnessProofInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConfirmRandomnessProofInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConfirmRandomnessProofInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.ConfirmRandomnessProofInstruction;

        /**
         * Creates a plain object from a ConfirmRandomnessProofInstruction message. Also converts values to other types if specified.
         * @param message ConfirmRandomnessProofInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.ConfirmRandomnessProofInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConfirmRandomnessProofInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetVrfPermitInstruction. */
    interface ISetVrfPermitInstruction {

        /** SetVrfPermitInstruction enabled */
        enabled?: (boolean|null);
    }

    /** Represents a SetVrfPermitInstruction. */
    class SetVrfPermitInstruction implements ISetVrfPermitInstruction {

        /**
         * Constructs a new SetVrfPermitInstruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: SwitchboardInstruction.ISetVrfPermitInstruction);

        /** SetVrfPermitInstruction enabled. */
        public enabled: boolean;

        /**
         * Creates a new SetVrfPermitInstruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetVrfPermitInstruction instance
         */
        public static create(properties?: SwitchboardInstruction.ISetVrfPermitInstruction): SwitchboardInstruction.SetVrfPermitInstruction;

        /**
         * Encodes the specified SetVrfPermitInstruction message. Does not implicitly {@link SwitchboardInstruction.SetVrfPermitInstruction.verify|verify} messages.
         * @param message SetVrfPermitInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SwitchboardInstruction.ISetVrfPermitInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetVrfPermitInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetVrfPermitInstruction.verify|verify} messages.
         * @param message SetVrfPermitInstruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SwitchboardInstruction.ISetVrfPermitInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetVrfPermitInstruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetVrfPermitInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwitchboardInstruction.SetVrfPermitInstruction;

        /**
         * Decodes a SetVrfPermitInstruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetVrfPermitInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwitchboardInstruction.SetVrfPermitInstruction;

        /**
         * Verifies a SetVrfPermitInstruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetVrfPermitInstruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetVrfPermitInstruction
         */
        public static fromObject(object: { [k: string]: any }): SwitchboardInstruction.SetVrfPermitInstruction;

        /**
         * Creates a plain object from a SetVrfPermitInstruction message. Also converts values to other types if specified.
         * @param message SetVrfPermitInstruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SwitchboardInstruction.SetVrfPermitInstruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetVrfPermitInstruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** SwitchboardAccountType enum. */
export enum SwitchboardAccountType {
    TYPE_UNINITIALIZED = 0,
    TYPE_AGGREGATOR = 1,
    TYPE_FULFILLMENT_MANAGER = 2,
    TYPE_JOB_DEFINITION = 3,
    TYPE_FULFILLMENT_MANAGER_AUTH = 4,
    TYPE_AGGREGATOR_RESULT_PARSE_OPTIMIZED = 5,
    TYPE_BUNDLE = 6,
    TYPE_BUNDLE_AUTH = 7,
    TYPE_VRF = 8,
    TYPE_VRF_PERMIT = 9
}
