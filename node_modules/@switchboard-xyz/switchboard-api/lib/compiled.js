/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.FulfillmentAgreement = (function() {
    
        /**
         * Properties of a FulfillmentAgreement.
         * @exports IFulfillmentAgreement
         * @interface IFulfillmentAgreement
         * @property {Array.<Uint8Array>|null} [nodePubkeys] FulfillmentAgreement nodePubkeys
         * @property {boolean|null} [requested] FulfillmentAgreement requested
         */
    
        /**
         * Constructs a new FulfillmentAgreement.
         * @exports FulfillmentAgreement
         * @classdesc Represents a FulfillmentAgreement.
         * @implements IFulfillmentAgreement
         * @constructor
         * @param {IFulfillmentAgreement=} [properties] Properties to set
         */
        function FulfillmentAgreement(properties) {
            this.nodePubkeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * FulfillmentAgreement nodePubkeys.
         * @member {Array.<Uint8Array>} nodePubkeys
         * @memberof FulfillmentAgreement
         * @instance
         */
        FulfillmentAgreement.prototype.nodePubkeys = $util.emptyArray;
    
        /**
         * FulfillmentAgreement requested.
         * @member {boolean} requested
         * @memberof FulfillmentAgreement
         * @instance
         */
        FulfillmentAgreement.prototype.requested = false;
    
        /**
         * Creates a new FulfillmentAgreement instance using the specified properties.
         * @function create
         * @memberof FulfillmentAgreement
         * @static
         * @param {IFulfillmentAgreement=} [properties] Properties to set
         * @returns {FulfillmentAgreement} FulfillmentAgreement instance
         */
        FulfillmentAgreement.create = function create(properties) {
            return new FulfillmentAgreement(properties);
        };
    
        /**
         * Encodes the specified FulfillmentAgreement message. Does not implicitly {@link FulfillmentAgreement.verify|verify} messages.
         * @function encode
         * @memberof FulfillmentAgreement
         * @static
         * @param {IFulfillmentAgreement} message FulfillmentAgreement message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentAgreement.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodePubkeys != null && message.nodePubkeys.length)
                for (var i = 0; i < message.nodePubkeys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.nodePubkeys[i]);
            if (message.requested != null && Object.hasOwnProperty.call(message, "requested"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.requested);
            return writer;
        };
    
        /**
         * Encodes the specified FulfillmentAgreement message, length delimited. Does not implicitly {@link FulfillmentAgreement.verify|verify} messages.
         * @function encodeDelimited
         * @memberof FulfillmentAgreement
         * @static
         * @param {IFulfillmentAgreement} message FulfillmentAgreement message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentAgreement.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a FulfillmentAgreement message from the specified reader or buffer.
         * @function decode
         * @memberof FulfillmentAgreement
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FulfillmentAgreement} FulfillmentAgreement
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentAgreement.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FulfillmentAgreement();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.nodePubkeys && message.nodePubkeys.length))
                        message.nodePubkeys = [];
                    message.nodePubkeys.push(reader.bytes());
                    break;
                case 3:
                    message.requested = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a FulfillmentAgreement message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof FulfillmentAgreement
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {FulfillmentAgreement} FulfillmentAgreement
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentAgreement.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a FulfillmentAgreement message.
         * @function verify
         * @memberof FulfillmentAgreement
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FulfillmentAgreement.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodePubkeys != null && message.hasOwnProperty("nodePubkeys")) {
                if (!Array.isArray(message.nodePubkeys))
                    return "nodePubkeys: array expected";
                for (var i = 0; i < message.nodePubkeys.length; ++i)
                    if (!(message.nodePubkeys[i] && typeof message.nodePubkeys[i].length === "number" || $util.isString(message.nodePubkeys[i])))
                        return "nodePubkeys: buffer[] expected";
            }
            if (message.requested != null && message.hasOwnProperty("requested"))
                if (typeof message.requested !== "boolean")
                    return "requested: boolean expected";
            return null;
        };
    
        /**
         * Creates a FulfillmentAgreement message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof FulfillmentAgreement
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {FulfillmentAgreement} FulfillmentAgreement
         */
        FulfillmentAgreement.fromObject = function fromObject(object) {
            if (object instanceof $root.FulfillmentAgreement)
                return object;
            var message = new $root.FulfillmentAgreement();
            if (object.nodePubkeys) {
                if (!Array.isArray(object.nodePubkeys))
                    throw TypeError(".FulfillmentAgreement.nodePubkeys: array expected");
                message.nodePubkeys = [];
                for (var i = 0; i < object.nodePubkeys.length; ++i)
                    if (typeof object.nodePubkeys[i] === "string")
                        $util.base64.decode(object.nodePubkeys[i], message.nodePubkeys[i] = $util.newBuffer($util.base64.length(object.nodePubkeys[i])), 0);
                    else if (object.nodePubkeys[i].length)
                        message.nodePubkeys[i] = object.nodePubkeys[i];
            }
            if (object.requested != null)
                message.requested = Boolean(object.requested);
            return message;
        };
    
        /**
         * Creates a plain object from a FulfillmentAgreement message. Also converts values to other types if specified.
         * @function toObject
         * @memberof FulfillmentAgreement
         * @static
         * @param {FulfillmentAgreement} message FulfillmentAgreement
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FulfillmentAgreement.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.nodePubkeys = [];
            if (options.defaults)
                object.requested = false;
            if (message.nodePubkeys && message.nodePubkeys.length) {
                object.nodePubkeys = [];
                for (var j = 0; j < message.nodePubkeys.length; ++j)
                    object.nodePubkeys[j] = options.bytes === String ? $util.base64.encode(message.nodePubkeys[j], 0, message.nodePubkeys[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.nodePubkeys[j]) : message.nodePubkeys[j];
            }
            if (message.requested != null && message.hasOwnProperty("requested"))
                object.requested = message.requested;
            return object;
        };
    
        /**
         * Converts this FulfillmentAgreement to JSON.
         * @function toJSON
         * @memberof FulfillmentAgreement
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FulfillmentAgreement.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return FulfillmentAgreement;
    })();
    
    $root.RoundResult = (function() {
    
        /**
         * Properties of a RoundResult.
         * @exports IRoundResult
         * @interface IRoundResult
         * @property {number|null} [numSuccess] RoundResult numSuccess
         * @property {number|null} [numError] RoundResult numError
         * @property {number|null} [result] RoundResult result
         * @property {number|Long|null} [roundOpenSlot] RoundResult roundOpenSlot
         * @property {number|Long|null} [roundOpenTimestamp] RoundResult roundOpenTimestamp
         * @property {number|null} [minResponse] RoundResult minResponse
         * @property {number|null} [maxResponse] RoundResult maxResponse
         * @property {Array.<number>|null} [medians] RoundResult medians
         */
    
        /**
         * Constructs a new RoundResult.
         * @exports RoundResult
         * @classdesc Represents a RoundResult.
         * @implements IRoundResult
         * @constructor
         * @param {IRoundResult=} [properties] Properties to set
         */
        function RoundResult(properties) {
            this.medians = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * RoundResult numSuccess.
         * @member {number} numSuccess
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.numSuccess = 0;
    
        /**
         * RoundResult numError.
         * @member {number} numError
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.numError = 0;
    
        /**
         * RoundResult result.
         * @member {number} result
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.result = 0;
    
        /**
         * RoundResult roundOpenSlot.
         * @member {number|Long} roundOpenSlot
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.roundOpenSlot = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
        /**
         * RoundResult roundOpenTimestamp.
         * @member {number|Long} roundOpenTimestamp
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.roundOpenTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
        /**
         * RoundResult minResponse.
         * @member {number} minResponse
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.minResponse = 0;
    
        /**
         * RoundResult maxResponse.
         * @member {number} maxResponse
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.maxResponse = 0;
    
        /**
         * RoundResult medians.
         * @member {Array.<number>} medians
         * @memberof RoundResult
         * @instance
         */
        RoundResult.prototype.medians = $util.emptyArray;
    
        /**
         * Creates a new RoundResult instance using the specified properties.
         * @function create
         * @memberof RoundResult
         * @static
         * @param {IRoundResult=} [properties] Properties to set
         * @returns {RoundResult} RoundResult instance
         */
        RoundResult.create = function create(properties) {
            return new RoundResult(properties);
        };
    
        /**
         * Encodes the specified RoundResult message. Does not implicitly {@link RoundResult.verify|verify} messages.
         * @function encode
         * @memberof RoundResult
         * @static
         * @param {IRoundResult} message RoundResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoundResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numSuccess != null && Object.hasOwnProperty.call(message, "numSuccess"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.numSuccess);
            if (message.numError != null && Object.hasOwnProperty.call(message, "numError"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.numError);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.result);
            if (message.roundOpenSlot != null && Object.hasOwnProperty.call(message, "roundOpenSlot"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.roundOpenSlot);
            if (message.roundOpenTimestamp != null && Object.hasOwnProperty.call(message, "roundOpenTimestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.roundOpenTimestamp);
            if (message.minResponse != null && Object.hasOwnProperty.call(message, "minResponse"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.minResponse);
            if (message.maxResponse != null && Object.hasOwnProperty.call(message, "maxResponse"))
                writer.uint32(/* id 7, wireType 1 =*/57).double(message.maxResponse);
            if (message.medians != null && message.medians.length)
                for (var i = 0; i < message.medians.length; ++i)
                    writer.uint32(/* id 8, wireType 1 =*/65).double(message.medians[i]);
            return writer;
        };
    
        /**
         * Encodes the specified RoundResult message, length delimited. Does not implicitly {@link RoundResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof RoundResult
         * @static
         * @param {IRoundResult} message RoundResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoundResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a RoundResult message from the specified reader or buffer.
         * @function decode
         * @memberof RoundResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {RoundResult} RoundResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoundResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RoundResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numSuccess = reader.int32();
                    break;
                case 2:
                    message.numError = reader.int32();
                    break;
                case 3:
                    message.result = reader.double();
                    break;
                case 4:
                    message.roundOpenSlot = reader.uint64();
                    break;
                case 5:
                    message.roundOpenTimestamp = reader.int64();
                    break;
                case 6:
                    message.minResponse = reader.double();
                    break;
                case 7:
                    message.maxResponse = reader.double();
                    break;
                case 8:
                    if (!(message.medians && message.medians.length))
                        message.medians = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.medians.push(reader.double());
                    } else
                        message.medians.push(reader.double());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a RoundResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof RoundResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {RoundResult} RoundResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoundResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a RoundResult message.
         * @function verify
         * @memberof RoundResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoundResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numSuccess != null && message.hasOwnProperty("numSuccess"))
                if (!$util.isInteger(message.numSuccess))
                    return "numSuccess: integer expected";
            if (message.numError != null && message.hasOwnProperty("numError"))
                if (!$util.isInteger(message.numError))
                    return "numError: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (typeof message.result !== "number")
                    return "result: number expected";
            if (message.roundOpenSlot != null && message.hasOwnProperty("roundOpenSlot"))
                if (!$util.isInteger(message.roundOpenSlot) && !(message.roundOpenSlot && $util.isInteger(message.roundOpenSlot.low) && $util.isInteger(message.roundOpenSlot.high)))
                    return "roundOpenSlot: integer|Long expected";
            if (message.roundOpenTimestamp != null && message.hasOwnProperty("roundOpenTimestamp"))
                if (!$util.isInteger(message.roundOpenTimestamp) && !(message.roundOpenTimestamp && $util.isInteger(message.roundOpenTimestamp.low) && $util.isInteger(message.roundOpenTimestamp.high)))
                    return "roundOpenTimestamp: integer|Long expected";
            if (message.minResponse != null && message.hasOwnProperty("minResponse"))
                if (typeof message.minResponse !== "number")
                    return "minResponse: number expected";
            if (message.maxResponse != null && message.hasOwnProperty("maxResponse"))
                if (typeof message.maxResponse !== "number")
                    return "maxResponse: number expected";
            if (message.medians != null && message.hasOwnProperty("medians")) {
                if (!Array.isArray(message.medians))
                    return "medians: array expected";
                for (var i = 0; i < message.medians.length; ++i)
                    if (typeof message.medians[i] !== "number")
                        return "medians: number[] expected";
            }
            return null;
        };
    
        /**
         * Creates a RoundResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof RoundResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {RoundResult} RoundResult
         */
        RoundResult.fromObject = function fromObject(object) {
            if (object instanceof $root.RoundResult)
                return object;
            var message = new $root.RoundResult();
            if (object.numSuccess != null)
                message.numSuccess = object.numSuccess | 0;
            if (object.numError != null)
                message.numError = object.numError | 0;
            if (object.result != null)
                message.result = Number(object.result);
            if (object.roundOpenSlot != null)
                if ($util.Long)
                    (message.roundOpenSlot = $util.Long.fromValue(object.roundOpenSlot)).unsigned = true;
                else if (typeof object.roundOpenSlot === "string")
                    message.roundOpenSlot = parseInt(object.roundOpenSlot, 10);
                else if (typeof object.roundOpenSlot === "number")
                    message.roundOpenSlot = object.roundOpenSlot;
                else if (typeof object.roundOpenSlot === "object")
                    message.roundOpenSlot = new $util.LongBits(object.roundOpenSlot.low >>> 0, object.roundOpenSlot.high >>> 0).toNumber(true);
            if (object.roundOpenTimestamp != null)
                if ($util.Long)
                    (message.roundOpenTimestamp = $util.Long.fromValue(object.roundOpenTimestamp)).unsigned = false;
                else if (typeof object.roundOpenTimestamp === "string")
                    message.roundOpenTimestamp = parseInt(object.roundOpenTimestamp, 10);
                else if (typeof object.roundOpenTimestamp === "number")
                    message.roundOpenTimestamp = object.roundOpenTimestamp;
                else if (typeof object.roundOpenTimestamp === "object")
                    message.roundOpenTimestamp = new $util.LongBits(object.roundOpenTimestamp.low >>> 0, object.roundOpenTimestamp.high >>> 0).toNumber();
            if (object.minResponse != null)
                message.minResponse = Number(object.minResponse);
            if (object.maxResponse != null)
                message.maxResponse = Number(object.maxResponse);
            if (object.medians) {
                if (!Array.isArray(object.medians))
                    throw TypeError(".RoundResult.medians: array expected");
                message.medians = [];
                for (var i = 0; i < object.medians.length; ++i)
                    message.medians[i] = Number(object.medians[i]);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a RoundResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof RoundResult
         * @static
         * @param {RoundResult} message RoundResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoundResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.medians = [];
            if (options.defaults) {
                object.numSuccess = 0;
                object.numError = 0;
                object.result = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.roundOpenSlot = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.roundOpenSlot = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.roundOpenTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.roundOpenTimestamp = options.longs === String ? "0" : 0;
                object.minResponse = 0;
                object.maxResponse = 0;
            }
            if (message.numSuccess != null && message.hasOwnProperty("numSuccess"))
                object.numSuccess = message.numSuccess;
            if (message.numError != null && message.hasOwnProperty("numError"))
                object.numError = message.numError;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.json && !isFinite(message.result) ? String(message.result) : message.result;
            if (message.roundOpenSlot != null && message.hasOwnProperty("roundOpenSlot"))
                if (typeof message.roundOpenSlot === "number")
                    object.roundOpenSlot = options.longs === String ? String(message.roundOpenSlot) : message.roundOpenSlot;
                else
                    object.roundOpenSlot = options.longs === String ? $util.Long.prototype.toString.call(message.roundOpenSlot) : options.longs === Number ? new $util.LongBits(message.roundOpenSlot.low >>> 0, message.roundOpenSlot.high >>> 0).toNumber(true) : message.roundOpenSlot;
            if (message.roundOpenTimestamp != null && message.hasOwnProperty("roundOpenTimestamp"))
                if (typeof message.roundOpenTimestamp === "number")
                    object.roundOpenTimestamp = options.longs === String ? String(message.roundOpenTimestamp) : message.roundOpenTimestamp;
                else
                    object.roundOpenTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.roundOpenTimestamp) : options.longs === Number ? new $util.LongBits(message.roundOpenTimestamp.low >>> 0, message.roundOpenTimestamp.high >>> 0).toNumber() : message.roundOpenTimestamp;
            if (message.minResponse != null && message.hasOwnProperty("minResponse"))
                object.minResponse = options.json && !isFinite(message.minResponse) ? String(message.minResponse) : message.minResponse;
            if (message.maxResponse != null && message.hasOwnProperty("maxResponse"))
                object.maxResponse = options.json && !isFinite(message.maxResponse) ? String(message.maxResponse) : message.maxResponse;
            if (message.medians && message.medians.length) {
                object.medians = [];
                for (var j = 0; j < message.medians.length; ++j)
                    object.medians[j] = options.json && !isFinite(message.medians[j]) ? String(message.medians[j]) : message.medians[j];
            }
            return object;
        };
    
        /**
         * Converts this RoundResult to JSON.
         * @function toJSON
         * @memberof RoundResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoundResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return RoundResult;
    })();
    
    $root.AggregatorState = (function() {
    
        /**
         * Properties of an AggregatorState.
         * @exports IAggregatorState
         * @interface IAggregatorState
         * @property {number|null} [version] AggregatorState version
         * @property {AggregatorState.IConfigs|null} [configs] AggregatorState configs
         * @property {Uint8Array|null} [fulfillmentManagerPubkey] AggregatorState fulfillmentManagerPubkey
         * @property {Array.<Uint8Array>|null} [jobDefinitionPubkeys] AggregatorState jobDefinitionPubkeys
         * @property {IFulfillmentAgreement|null} [agreement] AggregatorState agreement
         * @property {IRoundResult|null} [currentRoundResult] AggregatorState currentRoundResult
         * @property {IRoundResult|null} [lastRoundResult] AggregatorState lastRoundResult
         * @property {Uint8Array|null} [parseOptimizedResultAddress] AggregatorState parseOptimizedResultAddress
         * @property {Array.<Uint8Array>|null} [bundleAuthAddresses] AggregatorState bundleAuthAddresses
         */
    
        /**
         * Constructs a new AggregatorState.
         * @exports AggregatorState
         * @classdesc Represents an AggregatorState.
         * @implements IAggregatorState
         * @constructor
         * @param {IAggregatorState=} [properties] Properties to set
         */
        function AggregatorState(properties) {
            this.jobDefinitionPubkeys = [];
            this.bundleAuthAddresses = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AggregatorState version.
         * @member {number} version
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.version = 0;
    
        /**
         * AggregatorState configs.
         * @member {AggregatorState.IConfigs|null|undefined} configs
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.configs = null;
    
        /**
         * AggregatorState fulfillmentManagerPubkey.
         * @member {Uint8Array} fulfillmentManagerPubkey
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.fulfillmentManagerPubkey = $util.newBuffer([]);
    
        /**
         * AggregatorState jobDefinitionPubkeys.
         * @member {Array.<Uint8Array>} jobDefinitionPubkeys
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.jobDefinitionPubkeys = $util.emptyArray;
    
        /**
         * AggregatorState agreement.
         * @member {IFulfillmentAgreement|null|undefined} agreement
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.agreement = null;
    
        /**
         * AggregatorState currentRoundResult.
         * @member {IRoundResult|null|undefined} currentRoundResult
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.currentRoundResult = null;
    
        /**
         * AggregatorState lastRoundResult.
         * @member {IRoundResult|null|undefined} lastRoundResult
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.lastRoundResult = null;
    
        /**
         * AggregatorState parseOptimizedResultAddress.
         * @member {Uint8Array} parseOptimizedResultAddress
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.parseOptimizedResultAddress = $util.newBuffer([]);
    
        /**
         * AggregatorState bundleAuthAddresses.
         * @member {Array.<Uint8Array>} bundleAuthAddresses
         * @memberof AggregatorState
         * @instance
         */
        AggregatorState.prototype.bundleAuthAddresses = $util.emptyArray;
    
        /**
         * Creates a new AggregatorState instance using the specified properties.
         * @function create
         * @memberof AggregatorState
         * @static
         * @param {IAggregatorState=} [properties] Properties to set
         * @returns {AggregatorState} AggregatorState instance
         */
        AggregatorState.create = function create(properties) {
            return new AggregatorState(properties);
        };
    
        /**
         * Encodes the specified AggregatorState message. Does not implicitly {@link AggregatorState.verify|verify} messages.
         * @function encode
         * @memberof AggregatorState
         * @static
         * @param {IAggregatorState} message AggregatorState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AggregatorState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.configs != null && Object.hasOwnProperty.call(message, "configs"))
                $root.AggregatorState.Configs.encode(message.configs, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.fulfillmentManagerPubkey != null && Object.hasOwnProperty.call(message, "fulfillmentManagerPubkey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.fulfillmentManagerPubkey);
            if (message.jobDefinitionPubkeys != null && message.jobDefinitionPubkeys.length)
                for (var i = 0; i < message.jobDefinitionPubkeys.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.jobDefinitionPubkeys[i]);
            if (message.agreement != null && Object.hasOwnProperty.call(message, "agreement"))
                $root.FulfillmentAgreement.encode(message.agreement, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.currentRoundResult != null && Object.hasOwnProperty.call(message, "currentRoundResult"))
                $root.RoundResult.encode(message.currentRoundResult, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.lastRoundResult != null && Object.hasOwnProperty.call(message, "lastRoundResult"))
                $root.RoundResult.encode(message.lastRoundResult, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.parseOptimizedResultAddress != null && Object.hasOwnProperty.call(message, "parseOptimizedResultAddress"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.parseOptimizedResultAddress);
            if (message.bundleAuthAddresses != null && message.bundleAuthAddresses.length)
                for (var i = 0; i < message.bundleAuthAddresses.length; ++i)
                    writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.bundleAuthAddresses[i]);
            return writer;
        };
    
        /**
         * Encodes the specified AggregatorState message, length delimited. Does not implicitly {@link AggregatorState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AggregatorState
         * @static
         * @param {IAggregatorState} message AggregatorState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AggregatorState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AggregatorState message from the specified reader or buffer.
         * @function decode
         * @memberof AggregatorState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AggregatorState} AggregatorState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AggregatorState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AggregatorState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.uint32();
                    break;
                case 2:
                    message.configs = $root.AggregatorState.Configs.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.fulfillmentManagerPubkey = reader.bytes();
                    break;
                case 4:
                    if (!(message.jobDefinitionPubkeys && message.jobDefinitionPubkeys.length))
                        message.jobDefinitionPubkeys = [];
                    message.jobDefinitionPubkeys.push(reader.bytes());
                    break;
                case 5:
                    message.agreement = $root.FulfillmentAgreement.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.currentRoundResult = $root.RoundResult.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.lastRoundResult = $root.RoundResult.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.parseOptimizedResultAddress = reader.bytes();
                    break;
                case 9:
                    if (!(message.bundleAuthAddresses && message.bundleAuthAddresses.length))
                        message.bundleAuthAddresses = [];
                    message.bundleAuthAddresses.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AggregatorState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AggregatorState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AggregatorState} AggregatorState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AggregatorState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AggregatorState message.
         * @function verify
         * @memberof AggregatorState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AggregatorState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.configs != null && message.hasOwnProperty("configs")) {
                var error = $root.AggregatorState.Configs.verify(message.configs);
                if (error)
                    return "configs." + error;
            }
            if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                if (!(message.fulfillmentManagerPubkey && typeof message.fulfillmentManagerPubkey.length === "number" || $util.isString(message.fulfillmentManagerPubkey)))
                    return "fulfillmentManagerPubkey: buffer expected";
            if (message.jobDefinitionPubkeys != null && message.hasOwnProperty("jobDefinitionPubkeys")) {
                if (!Array.isArray(message.jobDefinitionPubkeys))
                    return "jobDefinitionPubkeys: array expected";
                for (var i = 0; i < message.jobDefinitionPubkeys.length; ++i)
                    if (!(message.jobDefinitionPubkeys[i] && typeof message.jobDefinitionPubkeys[i].length === "number" || $util.isString(message.jobDefinitionPubkeys[i])))
                        return "jobDefinitionPubkeys: buffer[] expected";
            }
            if (message.agreement != null && message.hasOwnProperty("agreement")) {
                var error = $root.FulfillmentAgreement.verify(message.agreement);
                if (error)
                    return "agreement." + error;
            }
            if (message.currentRoundResult != null && message.hasOwnProperty("currentRoundResult")) {
                var error = $root.RoundResult.verify(message.currentRoundResult);
                if (error)
                    return "currentRoundResult." + error;
            }
            if (message.lastRoundResult != null && message.hasOwnProperty("lastRoundResult")) {
                var error = $root.RoundResult.verify(message.lastRoundResult);
                if (error)
                    return "lastRoundResult." + error;
            }
            if (message.parseOptimizedResultAddress != null && message.hasOwnProperty("parseOptimizedResultAddress"))
                if (!(message.parseOptimizedResultAddress && typeof message.parseOptimizedResultAddress.length === "number" || $util.isString(message.parseOptimizedResultAddress)))
                    return "parseOptimizedResultAddress: buffer expected";
            if (message.bundleAuthAddresses != null && message.hasOwnProperty("bundleAuthAddresses")) {
                if (!Array.isArray(message.bundleAuthAddresses))
                    return "bundleAuthAddresses: array expected";
                for (var i = 0; i < message.bundleAuthAddresses.length; ++i)
                    if (!(message.bundleAuthAddresses[i] && typeof message.bundleAuthAddresses[i].length === "number" || $util.isString(message.bundleAuthAddresses[i])))
                        return "bundleAuthAddresses: buffer[] expected";
            }
            return null;
        };
    
        /**
         * Creates an AggregatorState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AggregatorState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AggregatorState} AggregatorState
         */
        AggregatorState.fromObject = function fromObject(object) {
            if (object instanceof $root.AggregatorState)
                return object;
            var message = new $root.AggregatorState();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.configs != null) {
                if (typeof object.configs !== "object")
                    throw TypeError(".AggregatorState.configs: object expected");
                message.configs = $root.AggregatorState.Configs.fromObject(object.configs);
            }
            if (object.fulfillmentManagerPubkey != null)
                if (typeof object.fulfillmentManagerPubkey === "string")
                    $util.base64.decode(object.fulfillmentManagerPubkey, message.fulfillmentManagerPubkey = $util.newBuffer($util.base64.length(object.fulfillmentManagerPubkey)), 0);
                else if (object.fulfillmentManagerPubkey.length)
                    message.fulfillmentManagerPubkey = object.fulfillmentManagerPubkey;
            if (object.jobDefinitionPubkeys) {
                if (!Array.isArray(object.jobDefinitionPubkeys))
                    throw TypeError(".AggregatorState.jobDefinitionPubkeys: array expected");
                message.jobDefinitionPubkeys = [];
                for (var i = 0; i < object.jobDefinitionPubkeys.length; ++i)
                    if (typeof object.jobDefinitionPubkeys[i] === "string")
                        $util.base64.decode(object.jobDefinitionPubkeys[i], message.jobDefinitionPubkeys[i] = $util.newBuffer($util.base64.length(object.jobDefinitionPubkeys[i])), 0);
                    else if (object.jobDefinitionPubkeys[i].length)
                        message.jobDefinitionPubkeys[i] = object.jobDefinitionPubkeys[i];
            }
            if (object.agreement != null) {
                if (typeof object.agreement !== "object")
                    throw TypeError(".AggregatorState.agreement: object expected");
                message.agreement = $root.FulfillmentAgreement.fromObject(object.agreement);
            }
            if (object.currentRoundResult != null) {
                if (typeof object.currentRoundResult !== "object")
                    throw TypeError(".AggregatorState.currentRoundResult: object expected");
                message.currentRoundResult = $root.RoundResult.fromObject(object.currentRoundResult);
            }
            if (object.lastRoundResult != null) {
                if (typeof object.lastRoundResult !== "object")
                    throw TypeError(".AggregatorState.lastRoundResult: object expected");
                message.lastRoundResult = $root.RoundResult.fromObject(object.lastRoundResult);
            }
            if (object.parseOptimizedResultAddress != null)
                if (typeof object.parseOptimizedResultAddress === "string")
                    $util.base64.decode(object.parseOptimizedResultAddress, message.parseOptimizedResultAddress = $util.newBuffer($util.base64.length(object.parseOptimizedResultAddress)), 0);
                else if (object.parseOptimizedResultAddress.length)
                    message.parseOptimizedResultAddress = object.parseOptimizedResultAddress;
            if (object.bundleAuthAddresses) {
                if (!Array.isArray(object.bundleAuthAddresses))
                    throw TypeError(".AggregatorState.bundleAuthAddresses: array expected");
                message.bundleAuthAddresses = [];
                for (var i = 0; i < object.bundleAuthAddresses.length; ++i)
                    if (typeof object.bundleAuthAddresses[i] === "string")
                        $util.base64.decode(object.bundleAuthAddresses[i], message.bundleAuthAddresses[i] = $util.newBuffer($util.base64.length(object.bundleAuthAddresses[i])), 0);
                    else if (object.bundleAuthAddresses[i].length)
                        message.bundleAuthAddresses[i] = object.bundleAuthAddresses[i];
            }
            return message;
        };
    
        /**
         * Creates a plain object from an AggregatorState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AggregatorState
         * @static
         * @param {AggregatorState} message AggregatorState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AggregatorState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.jobDefinitionPubkeys = [];
                object.bundleAuthAddresses = [];
            }
            if (options.defaults) {
                object.version = 0;
                object.configs = null;
                if (options.bytes === String)
                    object.fulfillmentManagerPubkey = "";
                else {
                    object.fulfillmentManagerPubkey = [];
                    if (options.bytes !== Array)
                        object.fulfillmentManagerPubkey = $util.newBuffer(object.fulfillmentManagerPubkey);
                }
                object.agreement = null;
                object.currentRoundResult = null;
                object.lastRoundResult = null;
                if (options.bytes === String)
                    object.parseOptimizedResultAddress = "";
                else {
                    object.parseOptimizedResultAddress = [];
                    if (options.bytes !== Array)
                        object.parseOptimizedResultAddress = $util.newBuffer(object.parseOptimizedResultAddress);
                }
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.configs != null && message.hasOwnProperty("configs"))
                object.configs = $root.AggregatorState.Configs.toObject(message.configs, options);
            if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                object.fulfillmentManagerPubkey = options.bytes === String ? $util.base64.encode(message.fulfillmentManagerPubkey, 0, message.fulfillmentManagerPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.fulfillmentManagerPubkey) : message.fulfillmentManagerPubkey;
            if (message.jobDefinitionPubkeys && message.jobDefinitionPubkeys.length) {
                object.jobDefinitionPubkeys = [];
                for (var j = 0; j < message.jobDefinitionPubkeys.length; ++j)
                    object.jobDefinitionPubkeys[j] = options.bytes === String ? $util.base64.encode(message.jobDefinitionPubkeys[j], 0, message.jobDefinitionPubkeys[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.jobDefinitionPubkeys[j]) : message.jobDefinitionPubkeys[j];
            }
            if (message.agreement != null && message.hasOwnProperty("agreement"))
                object.agreement = $root.FulfillmentAgreement.toObject(message.agreement, options);
            if (message.currentRoundResult != null && message.hasOwnProperty("currentRoundResult"))
                object.currentRoundResult = $root.RoundResult.toObject(message.currentRoundResult, options);
            if (message.lastRoundResult != null && message.hasOwnProperty("lastRoundResult"))
                object.lastRoundResult = $root.RoundResult.toObject(message.lastRoundResult, options);
            if (message.parseOptimizedResultAddress != null && message.hasOwnProperty("parseOptimizedResultAddress"))
                object.parseOptimizedResultAddress = options.bytes === String ? $util.base64.encode(message.parseOptimizedResultAddress, 0, message.parseOptimizedResultAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.parseOptimizedResultAddress) : message.parseOptimizedResultAddress;
            if (message.bundleAuthAddresses && message.bundleAuthAddresses.length) {
                object.bundleAuthAddresses = [];
                for (var j = 0; j < message.bundleAuthAddresses.length; ++j)
                    object.bundleAuthAddresses[j] = options.bytes === String ? $util.base64.encode(message.bundleAuthAddresses[j], 0, message.bundleAuthAddresses[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.bundleAuthAddresses[j]) : message.bundleAuthAddresses[j];
            }
            return object;
        };
    
        /**
         * Converts this AggregatorState to JSON.
         * @function toJSON
         * @memberof AggregatorState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AggregatorState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        AggregatorState.Configs = (function() {
    
            /**
             * Properties of a Configs.
             * @memberof AggregatorState
             * @interface IConfigs
             * @property {boolean|null} [locked] Configs locked
             * @property {number|null} [minConfirmations] Configs minConfirmations
             * @property {number|Long|null} [minUpdateDelaySeconds] Configs minUpdateDelaySeconds
             * @property {string|null} [schedule] Configs schedule
             */
    
            /**
             * Constructs a new Configs.
             * @memberof AggregatorState
             * @classdesc Represents a Configs.
             * @implements IConfigs
             * @constructor
             * @param {AggregatorState.IConfigs=} [properties] Properties to set
             */
            function Configs(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Configs locked.
             * @member {boolean} locked
             * @memberof AggregatorState.Configs
             * @instance
             */
            Configs.prototype.locked = false;
    
            /**
             * Configs minConfirmations.
             * @member {number} minConfirmations
             * @memberof AggregatorState.Configs
             * @instance
             */
            Configs.prototype.minConfirmations = 0;
    
            /**
             * Configs minUpdateDelaySeconds.
             * @member {number|Long} minUpdateDelaySeconds
             * @memberof AggregatorState.Configs
             * @instance
             */
            Configs.prototype.minUpdateDelaySeconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Configs schedule.
             * @member {string} schedule
             * @memberof AggregatorState.Configs
             * @instance
             */
            Configs.prototype.schedule = "";
    
            /**
             * Creates a new Configs instance using the specified properties.
             * @function create
             * @memberof AggregatorState.Configs
             * @static
             * @param {AggregatorState.IConfigs=} [properties] Properties to set
             * @returns {AggregatorState.Configs} Configs instance
             */
            Configs.create = function create(properties) {
                return new Configs(properties);
            };
    
            /**
             * Encodes the specified Configs message. Does not implicitly {@link AggregatorState.Configs.verify|verify} messages.
             * @function encode
             * @memberof AggregatorState.Configs
             * @static
             * @param {AggregatorState.IConfigs} message Configs message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Configs.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.locked != null && Object.hasOwnProperty.call(message, "locked"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.locked);
                if (message.minConfirmations != null && Object.hasOwnProperty.call(message, "minConfirmations"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.minConfirmations);
                if (message.minUpdateDelaySeconds != null && Object.hasOwnProperty.call(message, "minUpdateDelaySeconds"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.minUpdateDelaySeconds);
                if (message.schedule != null && Object.hasOwnProperty.call(message, "schedule"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.schedule);
                return writer;
            };
    
            /**
             * Encodes the specified Configs message, length delimited. Does not implicitly {@link AggregatorState.Configs.verify|verify} messages.
             * @function encodeDelimited
             * @memberof AggregatorState.Configs
             * @static
             * @param {AggregatorState.IConfigs} message Configs message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Configs.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Configs message from the specified reader or buffer.
             * @function decode
             * @memberof AggregatorState.Configs
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {AggregatorState.Configs} Configs
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Configs.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AggregatorState.Configs();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.locked = reader.bool();
                        break;
                    case 2:
                        message.minConfirmations = reader.int32();
                        break;
                    case 3:
                        message.minUpdateDelaySeconds = reader.int64();
                        break;
                    case 5:
                        message.schedule = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Configs message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof AggregatorState.Configs
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {AggregatorState.Configs} Configs
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Configs.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Configs message.
             * @function verify
             * @memberof AggregatorState.Configs
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Configs.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.locked != null && message.hasOwnProperty("locked"))
                    if (typeof message.locked !== "boolean")
                        return "locked: boolean expected";
                if (message.minConfirmations != null && message.hasOwnProperty("minConfirmations"))
                    if (!$util.isInteger(message.minConfirmations))
                        return "minConfirmations: integer expected";
                if (message.minUpdateDelaySeconds != null && message.hasOwnProperty("minUpdateDelaySeconds"))
                    if (!$util.isInteger(message.minUpdateDelaySeconds) && !(message.minUpdateDelaySeconds && $util.isInteger(message.minUpdateDelaySeconds.low) && $util.isInteger(message.minUpdateDelaySeconds.high)))
                        return "minUpdateDelaySeconds: integer|Long expected";
                if (message.schedule != null && message.hasOwnProperty("schedule"))
                    if (!$util.isString(message.schedule))
                        return "schedule: string expected";
                return null;
            };
    
            /**
             * Creates a Configs message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof AggregatorState.Configs
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {AggregatorState.Configs} Configs
             */
            Configs.fromObject = function fromObject(object) {
                if (object instanceof $root.AggregatorState.Configs)
                    return object;
                var message = new $root.AggregatorState.Configs();
                if (object.locked != null)
                    message.locked = Boolean(object.locked);
                if (object.minConfirmations != null)
                    message.minConfirmations = object.minConfirmations | 0;
                if (object.minUpdateDelaySeconds != null)
                    if ($util.Long)
                        (message.minUpdateDelaySeconds = $util.Long.fromValue(object.minUpdateDelaySeconds)).unsigned = false;
                    else if (typeof object.minUpdateDelaySeconds === "string")
                        message.minUpdateDelaySeconds = parseInt(object.minUpdateDelaySeconds, 10);
                    else if (typeof object.minUpdateDelaySeconds === "number")
                        message.minUpdateDelaySeconds = object.minUpdateDelaySeconds;
                    else if (typeof object.minUpdateDelaySeconds === "object")
                        message.minUpdateDelaySeconds = new $util.LongBits(object.minUpdateDelaySeconds.low >>> 0, object.minUpdateDelaySeconds.high >>> 0).toNumber();
                if (object.schedule != null)
                    message.schedule = String(object.schedule);
                return message;
            };
    
            /**
             * Creates a plain object from a Configs message. Also converts values to other types if specified.
             * @function toObject
             * @memberof AggregatorState.Configs
             * @static
             * @param {AggregatorState.Configs} message Configs
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Configs.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.locked = false;
                    object.minConfirmations = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.minUpdateDelaySeconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.minUpdateDelaySeconds = options.longs === String ? "0" : 0;
                    object.schedule = "";
                }
                if (message.locked != null && message.hasOwnProperty("locked"))
                    object.locked = message.locked;
                if (message.minConfirmations != null && message.hasOwnProperty("minConfirmations"))
                    object.minConfirmations = message.minConfirmations;
                if (message.minUpdateDelaySeconds != null && message.hasOwnProperty("minUpdateDelaySeconds"))
                    if (typeof message.minUpdateDelaySeconds === "number")
                        object.minUpdateDelaySeconds = options.longs === String ? String(message.minUpdateDelaySeconds) : message.minUpdateDelaySeconds;
                    else
                        object.minUpdateDelaySeconds = options.longs === String ? $util.Long.prototype.toString.call(message.minUpdateDelaySeconds) : options.longs === Number ? new $util.LongBits(message.minUpdateDelaySeconds.low >>> 0, message.minUpdateDelaySeconds.high >>> 0).toNumber() : message.minUpdateDelaySeconds;
                if (message.schedule != null && message.hasOwnProperty("schedule"))
                    object.schedule = message.schedule;
                return object;
            };
    
            /**
             * Converts this Configs to JSON.
             * @function toJSON
             * @memberof AggregatorState.Configs
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Configs.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Configs;
        })();
    
        return AggregatorState;
    })();
    
    $root.OracleJob = (function() {
    
        /**
         * Properties of an OracleJob.
         * @exports IOracleJob
         * @interface IOracleJob
         * @property {Array.<OracleJob.ITask>|null} [tasks] OracleJob tasks
         */
    
        /**
         * Constructs a new OracleJob.
         * @exports OracleJob
         * @classdesc Represents an OracleJob.
         * @implements IOracleJob
         * @constructor
         * @param {IOracleJob=} [properties] Properties to set
         */
        function OracleJob(properties) {
            this.tasks = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * OracleJob tasks.
         * @member {Array.<OracleJob.ITask>} tasks
         * @memberof OracleJob
         * @instance
         */
        OracleJob.prototype.tasks = $util.emptyArray;
    
        /**
         * Creates a new OracleJob instance using the specified properties.
         * @function create
         * @memberof OracleJob
         * @static
         * @param {IOracleJob=} [properties] Properties to set
         * @returns {OracleJob} OracleJob instance
         */
        OracleJob.create = function create(properties) {
            return new OracleJob(properties);
        };
    
        /**
         * Encodes the specified OracleJob message. Does not implicitly {@link OracleJob.verify|verify} messages.
         * @function encode
         * @memberof OracleJob
         * @static
         * @param {IOracleJob} message OracleJob message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OracleJob.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tasks != null && message.tasks.length)
                for (var i = 0; i < message.tasks.length; ++i)
                    $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified OracleJob message, length delimited. Does not implicitly {@link OracleJob.verify|verify} messages.
         * @function encodeDelimited
         * @memberof OracleJob
         * @static
         * @param {IOracleJob} message OracleJob message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OracleJob.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an OracleJob message from the specified reader or buffer.
         * @function decode
         * @memberof OracleJob
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {OracleJob} OracleJob
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OracleJob.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.tasks && message.tasks.length))
                        message.tasks = [];
                    message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an OracleJob message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof OracleJob
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {OracleJob} OracleJob
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OracleJob.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an OracleJob message.
         * @function verify
         * @memberof OracleJob
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OracleJob.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tasks != null && message.hasOwnProperty("tasks")) {
                if (!Array.isArray(message.tasks))
                    return "tasks: array expected";
                for (var i = 0; i < message.tasks.length; ++i) {
                    var error = $root.OracleJob.Task.verify(message.tasks[i]);
                    if (error)
                        return "tasks." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates an OracleJob message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof OracleJob
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {OracleJob} OracleJob
         */
        OracleJob.fromObject = function fromObject(object) {
            if (object instanceof $root.OracleJob)
                return object;
            var message = new $root.OracleJob();
            if (object.tasks) {
                if (!Array.isArray(object.tasks))
                    throw TypeError(".OracleJob.tasks: array expected");
                message.tasks = [];
                for (var i = 0; i < object.tasks.length; ++i) {
                    if (typeof object.tasks[i] !== "object")
                        throw TypeError(".OracleJob.tasks: object expected");
                    message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from an OracleJob message. Also converts values to other types if specified.
         * @function toObject
         * @memberof OracleJob
         * @static
         * @param {OracleJob} message OracleJob
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OracleJob.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.tasks = [];
            if (message.tasks && message.tasks.length) {
                object.tasks = [];
                for (var j = 0; j < message.tasks.length; ++j)
                    object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
            }
            return object;
        };
    
        /**
         * Converts this OracleJob to JSON.
         * @function toJSON
         * @memberof OracleJob
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OracleJob.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        OracleJob.HttpTask = (function() {
    
            /**
             * Properties of a HttpTask.
             * @memberof OracleJob
             * @interface IHttpTask
             * @property {string|null} [url] HttpTask url
             * @property {OracleJob.HttpTask.Method|null} [method] HttpTask method
             * @property {Array.<OracleJob.HttpTask.IHeader>|null} [headers] HttpTask headers
             * @property {string|null} [body] HttpTask body
             */
    
            /**
             * Constructs a new HttpTask.
             * @memberof OracleJob
             * @classdesc Represents a HttpTask.
             * @implements IHttpTask
             * @constructor
             * @param {OracleJob.IHttpTask=} [properties] Properties to set
             */
            function HttpTask(properties) {
                this.headers = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * HttpTask url.
             * @member {string} url
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.url = "";
    
            /**
             * HttpTask method.
             * @member {OracleJob.HttpTask.Method} method
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.method = 0;
    
            /**
             * HttpTask headers.
             * @member {Array.<OracleJob.HttpTask.IHeader>} headers
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.headers = $util.emptyArray;
    
            /**
             * HttpTask body.
             * @member {string} body
             * @memberof OracleJob.HttpTask
             * @instance
             */
            HttpTask.prototype.body = "";
    
            /**
             * Creates a new HttpTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.IHttpTask=} [properties] Properties to set
             * @returns {OracleJob.HttpTask} HttpTask instance
             */
            HttpTask.create = function create(properties) {
                return new HttpTask(properties);
            };
    
            /**
             * Encodes the specified HttpTask message. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.IHttpTask} message HttpTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HttpTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.method != null && Object.hasOwnProperty.call(message, "method"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.method);
                if (message.headers != null && message.headers.length)
                    for (var i = 0; i < message.headers.length; ++i)
                        $root.OracleJob.HttpTask.Header.encode(message.headers[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.body);
                return writer;
            };
    
            /**
             * Encodes the specified HttpTask message, length delimited. Does not implicitly {@link OracleJob.HttpTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.IHttpTask} message HttpTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HttpTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a HttpTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.HttpTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.HttpTask} HttpTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HttpTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.HttpTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.url = reader.string();
                        break;
                    case 2:
                        message.method = reader.int32();
                        break;
                    case 3:
                        if (!(message.headers && message.headers.length))
                            message.headers = [];
                        message.headers.push($root.OracleJob.HttpTask.Header.decode(reader, reader.uint32()));
                        break;
                    case 4:
                        message.body = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a HttpTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.HttpTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.HttpTask} HttpTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HttpTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a HttpTask message.
             * @function verify
             * @memberof OracleJob.HttpTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HttpTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.method != null && message.hasOwnProperty("method"))
                    switch (message.method) {
                    default:
                        return "method: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    if (!Array.isArray(message.headers))
                        return "headers: array expected";
                    for (var i = 0; i < message.headers.length; ++i) {
                        var error = $root.OracleJob.HttpTask.Header.verify(message.headers[i]);
                        if (error)
                            return "headers." + error;
                    }
                }
                if (message.body != null && message.hasOwnProperty("body"))
                    if (!$util.isString(message.body))
                        return "body: string expected";
                return null;
            };
    
            /**
             * Creates a HttpTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.HttpTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.HttpTask} HttpTask
             */
            HttpTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.HttpTask)
                    return object;
                var message = new $root.OracleJob.HttpTask();
                if (object.url != null)
                    message.url = String(object.url);
                switch (object.method) {
                case "METHOD_UNKOWN":
                case 0:
                    message.method = 0;
                    break;
                case "METHOD_GET":
                case 1:
                    message.method = 1;
                    break;
                case "METHOD_POST":
                case 2:
                    message.method = 2;
                    break;
                }
                if (object.headers) {
                    if (!Array.isArray(object.headers))
                        throw TypeError(".OracleJob.HttpTask.headers: array expected");
                    message.headers = [];
                    for (var i = 0; i < object.headers.length; ++i) {
                        if (typeof object.headers[i] !== "object")
                            throw TypeError(".OracleJob.HttpTask.headers: object expected");
                        message.headers[i] = $root.OracleJob.HttpTask.Header.fromObject(object.headers[i]);
                    }
                }
                if (object.body != null)
                    message.body = String(object.body);
                return message;
            };
    
            /**
             * Creates a plain object from a HttpTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.HttpTask
             * @static
             * @param {OracleJob.HttpTask} message HttpTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HttpTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.headers = [];
                if (options.defaults) {
                    object.url = "";
                    object.method = options.enums === String ? "METHOD_UNKOWN" : 0;
                    object.body = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.method != null && message.hasOwnProperty("method"))
                    object.method = options.enums === String ? $root.OracleJob.HttpTask.Method[message.method] : message.method;
                if (message.headers && message.headers.length) {
                    object.headers = [];
                    for (var j = 0; j < message.headers.length; ++j)
                        object.headers[j] = $root.OracleJob.HttpTask.Header.toObject(message.headers[j], options);
                }
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = message.body;
                return object;
            };
    
            /**
             * Converts this HttpTask to JSON.
             * @function toJSON
             * @memberof OracleJob.HttpTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HttpTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Method enum.
             * @name OracleJob.HttpTask.Method
             * @enum {number}
             * @property {number} METHOD_UNKOWN=0 METHOD_UNKOWN value
             * @property {number} METHOD_GET=1 METHOD_GET value
             * @property {number} METHOD_POST=2 METHOD_POST value
             */
            HttpTask.Method = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "METHOD_UNKOWN"] = 0;
                values[valuesById[1] = "METHOD_GET"] = 1;
                values[valuesById[2] = "METHOD_POST"] = 2;
                return values;
            })();
    
            HttpTask.Header = (function() {
    
                /**
                 * Properties of a Header.
                 * @memberof OracleJob.HttpTask
                 * @interface IHeader
                 * @property {string|null} [key] Header key
                 * @property {string|null} [value] Header value
                 */
    
                /**
                 * Constructs a new Header.
                 * @memberof OracleJob.HttpTask
                 * @classdesc Represents a Header.
                 * @implements IHeader
                 * @constructor
                 * @param {OracleJob.HttpTask.IHeader=} [properties] Properties to set
                 */
                function Header(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Header key.
                 * @member {string} key
                 * @memberof OracleJob.HttpTask.Header
                 * @instance
                 */
                Header.prototype.key = "";
    
                /**
                 * Header value.
                 * @member {string} value
                 * @memberof OracleJob.HttpTask.Header
                 * @instance
                 */
                Header.prototype.value = "";
    
                /**
                 * Creates a new Header instance using the specified properties.
                 * @function create
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.IHeader=} [properties] Properties to set
                 * @returns {OracleJob.HttpTask.Header} Header instance
                 */
                Header.create = function create(properties) {
                    return new Header(properties);
                };
    
                /**
                 * Encodes the specified Header message. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
                 * @function encode
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.IHeader} message Header message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Header.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified Header message, length delimited. Does not implicitly {@link OracleJob.HttpTask.Header.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.IHeader} message Header message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Header.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Header message from the specified reader or buffer.
                 * @function decode
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {OracleJob.HttpTask.Header} Header
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Header.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.HttpTask.Header();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.key = reader.string();
                            break;
                        case 2:
                            message.value = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Header message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {OracleJob.HttpTask.Header} Header
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Header.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Header message.
                 * @function verify
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Header.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.key != null && message.hasOwnProperty("key"))
                        if (!$util.isString(message.key))
                            return "key: string expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isString(message.value))
                            return "value: string expected";
                    return null;
                };
    
                /**
                 * Creates a Header message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {OracleJob.HttpTask.Header} Header
                 */
                Header.fromObject = function fromObject(object) {
                    if (object instanceof $root.OracleJob.HttpTask.Header)
                        return object;
                    var message = new $root.OracleJob.HttpTask.Header();
                    if (object.key != null)
                        message.key = String(object.key);
                    if (object.value != null)
                        message.value = String(object.value);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Header message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof OracleJob.HttpTask.Header
                 * @static
                 * @param {OracleJob.HttpTask.Header} message Header
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Header.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.key = "";
                        object.value = "";
                    }
                    if (message.key != null && message.hasOwnProperty("key"))
                        object.key = message.key;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };
    
                /**
                 * Converts this Header to JSON.
                 * @function toJSON
                 * @memberof OracleJob.HttpTask.Header
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Header.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Header;
            })();
    
            return HttpTask;
        })();
    
        OracleJob.JsonParseTask = (function() {
    
            /**
             * Properties of a JsonParseTask.
             * @memberof OracleJob
             * @interface IJsonParseTask
             * @property {string|null} [path] JsonParseTask path
             * @property {OracleJob.JsonParseTask.AggregationMethod|null} [aggregationMethod] JsonParseTask aggregationMethod
             */
    
            /**
             * Constructs a new JsonParseTask.
             * @memberof OracleJob
             * @classdesc Represents a JsonParseTask.
             * @implements IJsonParseTask
             * @constructor
             * @param {OracleJob.IJsonParseTask=} [properties] Properties to set
             */
            function JsonParseTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * JsonParseTask path.
             * @member {string} path
             * @memberof OracleJob.JsonParseTask
             * @instance
             */
            JsonParseTask.prototype.path = "";
    
            /**
             * JsonParseTask aggregationMethod.
             * @member {OracleJob.JsonParseTask.AggregationMethod} aggregationMethod
             * @memberof OracleJob.JsonParseTask
             * @instance
             */
            JsonParseTask.prototype.aggregationMethod = 0;
    
            /**
             * Creates a new JsonParseTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.IJsonParseTask=} [properties] Properties to set
             * @returns {OracleJob.JsonParseTask} JsonParseTask instance
             */
            JsonParseTask.create = function create(properties) {
                return new JsonParseTask(properties);
            };
    
            /**
             * Encodes the specified JsonParseTask message. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.IJsonParseTask} message JsonParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JsonParseTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
                if (message.aggregationMethod != null && Object.hasOwnProperty.call(message, "aggregationMethod"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.aggregationMethod);
                return writer;
            };
    
            /**
             * Encodes the specified JsonParseTask message, length delimited. Does not implicitly {@link OracleJob.JsonParseTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.IJsonParseTask} message JsonParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JsonParseTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a JsonParseTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.JsonParseTask} JsonParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JsonParseTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.JsonParseTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.path = reader.string();
                        break;
                    case 2:
                        message.aggregationMethod = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a JsonParseTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.JsonParseTask} JsonParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JsonParseTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a JsonParseTask message.
             * @function verify
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JsonParseTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.path != null && message.hasOwnProperty("path"))
                    if (!$util.isString(message.path))
                        return "path: string expected";
                if (message.aggregationMethod != null && message.hasOwnProperty("aggregationMethod"))
                    switch (message.aggregationMethod) {
                    default:
                        return "aggregationMethod: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a JsonParseTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.JsonParseTask} JsonParseTask
             */
            JsonParseTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.JsonParseTask)
                    return object;
                var message = new $root.OracleJob.JsonParseTask();
                if (object.path != null)
                    message.path = String(object.path);
                switch (object.aggregationMethod) {
                case "NONE":
                case 0:
                    message.aggregationMethod = 0;
                    break;
                case "MIN":
                case 1:
                    message.aggregationMethod = 1;
                    break;
                case "MAX":
                case 2:
                    message.aggregationMethod = 2;
                    break;
                case "SUM":
                case 3:
                    message.aggregationMethod = 3;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a JsonParseTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.JsonParseTask
             * @static
             * @param {OracleJob.JsonParseTask} message JsonParseTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JsonParseTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.path = "";
                    object.aggregationMethod = options.enums === String ? "NONE" : 0;
                }
                if (message.path != null && message.hasOwnProperty("path"))
                    object.path = message.path;
                if (message.aggregationMethod != null && message.hasOwnProperty("aggregationMethod"))
                    object.aggregationMethod = options.enums === String ? $root.OracleJob.JsonParseTask.AggregationMethod[message.aggregationMethod] : message.aggregationMethod;
                return object;
            };
    
            /**
             * Converts this JsonParseTask to JSON.
             * @function toJSON
             * @memberof OracleJob.JsonParseTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JsonParseTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * AggregationMethod enum.
             * @name OracleJob.JsonParseTask.AggregationMethod
             * @enum {number}
             * @property {number} NONE=0 NONE value
             * @property {number} MIN=1 MIN value
             * @property {number} MAX=2 MAX value
             * @property {number} SUM=3 SUM value
             */
            JsonParseTask.AggregationMethod = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "NONE"] = 0;
                values[valuesById[1] = "MIN"] = 1;
                values[valuesById[2] = "MAX"] = 2;
                values[valuesById[3] = "SUM"] = 3;
                return values;
            })();
    
            return JsonParseTask;
        })();
    
        OracleJob.MedianTask = (function() {
    
            /**
             * Properties of a MedianTask.
             * @memberof OracleJob
             * @interface IMedianTask
             * @property {Array.<OracleJob.ITask>|null} [tasks] MedianTask tasks
             * @property {Array.<IOracleJob>|null} [jobs] MedianTask jobs
             * @property {number|null} [minSuccessfulRequired] MedianTask minSuccessfulRequired
             */
    
            /**
             * Constructs a new MedianTask.
             * @memberof OracleJob
             * @classdesc Represents a MedianTask.
             * @implements IMedianTask
             * @constructor
             * @param {OracleJob.IMedianTask=} [properties] Properties to set
             */
            function MedianTask(properties) {
                this.tasks = [];
                this.jobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MedianTask tasks.
             * @member {Array.<OracleJob.ITask>} tasks
             * @memberof OracleJob.MedianTask
             * @instance
             */
            MedianTask.prototype.tasks = $util.emptyArray;
    
            /**
             * MedianTask jobs.
             * @member {Array.<IOracleJob>} jobs
             * @memberof OracleJob.MedianTask
             * @instance
             */
            MedianTask.prototype.jobs = $util.emptyArray;
    
            /**
             * MedianTask minSuccessfulRequired.
             * @member {number} minSuccessfulRequired
             * @memberof OracleJob.MedianTask
             * @instance
             */
            MedianTask.prototype.minSuccessfulRequired = 0;
    
            /**
             * Creates a new MedianTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.IMedianTask=} [properties] Properties to set
             * @returns {OracleJob.MedianTask} MedianTask instance
             */
            MedianTask.create = function create(properties) {
                return new MedianTask(properties);
            };
    
            /**
             * Encodes the specified MedianTask message. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.IMedianTask} message MedianTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MedianTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tasks != null && message.tasks.length)
                    for (var i = 0; i < message.tasks.length; ++i)
                        $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jobs != null && message.jobs.length)
                    for (var i = 0; i < message.jobs.length; ++i)
                        $root.OracleJob.encode(message.jobs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.minSuccessfulRequired != null && Object.hasOwnProperty.call(message, "minSuccessfulRequired"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.minSuccessfulRequired);
                return writer;
            };
    
            /**
             * Encodes the specified MedianTask message, length delimited. Does not implicitly {@link OracleJob.MedianTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.IMedianTask} message MedianTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MedianTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MedianTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MedianTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MedianTask} MedianTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MedianTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MedianTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.tasks && message.tasks.length))
                            message.tasks = [];
                        message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.jobs && message.jobs.length))
                            message.jobs = [];
                        message.jobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        message.minSuccessfulRequired = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MedianTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MedianTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MedianTask} MedianTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MedianTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MedianTask message.
             * @function verify
             * @memberof OracleJob.MedianTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MedianTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tasks != null && message.hasOwnProperty("tasks")) {
                    if (!Array.isArray(message.tasks))
                        return "tasks: array expected";
                    for (var i = 0; i < message.tasks.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.tasks[i]);
                        if (error)
                            return "tasks." + error;
                    }
                }
                if (message.jobs != null && message.hasOwnProperty("jobs")) {
                    if (!Array.isArray(message.jobs))
                        return "jobs: array expected";
                    for (var i = 0; i < message.jobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.jobs[i]);
                        if (error)
                            return "jobs." + error;
                    }
                }
                if (message.minSuccessfulRequired != null && message.hasOwnProperty("minSuccessfulRequired"))
                    if (!$util.isInteger(message.minSuccessfulRequired))
                        return "minSuccessfulRequired: integer expected";
                return null;
            };
    
            /**
             * Creates a MedianTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MedianTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MedianTask} MedianTask
             */
            MedianTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MedianTask)
                    return object;
                var message = new $root.OracleJob.MedianTask();
                if (object.tasks) {
                    if (!Array.isArray(object.tasks))
                        throw TypeError(".OracleJob.MedianTask.tasks: array expected");
                    message.tasks = [];
                    for (var i = 0; i < object.tasks.length; ++i) {
                        if (typeof object.tasks[i] !== "object")
                            throw TypeError(".OracleJob.MedianTask.tasks: object expected");
                        message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                    }
                }
                if (object.jobs) {
                    if (!Array.isArray(object.jobs))
                        throw TypeError(".OracleJob.MedianTask.jobs: array expected");
                    message.jobs = [];
                    for (var i = 0; i < object.jobs.length; ++i) {
                        if (typeof object.jobs[i] !== "object")
                            throw TypeError(".OracleJob.MedianTask.jobs: object expected");
                        message.jobs[i] = $root.OracleJob.fromObject(object.jobs[i]);
                    }
                }
                if (object.minSuccessfulRequired != null)
                    message.minSuccessfulRequired = object.minSuccessfulRequired | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a MedianTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MedianTask
             * @static
             * @param {OracleJob.MedianTask} message MedianTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MedianTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.tasks = [];
                    object.jobs = [];
                }
                if (options.defaults)
                    object.minSuccessfulRequired = 0;
                if (message.tasks && message.tasks.length) {
                    object.tasks = [];
                    for (var j = 0; j < message.tasks.length; ++j)
                        object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
                }
                if (message.jobs && message.jobs.length) {
                    object.jobs = [];
                    for (var j = 0; j < message.jobs.length; ++j)
                        object.jobs[j] = $root.OracleJob.toObject(message.jobs[j], options);
                }
                if (message.minSuccessfulRequired != null && message.hasOwnProperty("minSuccessfulRequired"))
                    object.minSuccessfulRequired = message.minSuccessfulRequired;
                return object;
            };
    
            /**
             * Converts this MedianTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MedianTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MedianTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MedianTask;
        })();
    
        OracleJob.MeanTask = (function() {
    
            /**
             * Properties of a MeanTask.
             * @memberof OracleJob
             * @interface IMeanTask
             * @property {Array.<OracleJob.ITask>|null} [tasks] MeanTask tasks
             * @property {Array.<IOracleJob>|null} [jobs] MeanTask jobs
             */
    
            /**
             * Constructs a new MeanTask.
             * @memberof OracleJob
             * @classdesc Represents a MeanTask.
             * @implements IMeanTask
             * @constructor
             * @param {OracleJob.IMeanTask=} [properties] Properties to set
             */
            function MeanTask(properties) {
                this.tasks = [];
                this.jobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MeanTask tasks.
             * @member {Array.<OracleJob.ITask>} tasks
             * @memberof OracleJob.MeanTask
             * @instance
             */
            MeanTask.prototype.tasks = $util.emptyArray;
    
            /**
             * MeanTask jobs.
             * @member {Array.<IOracleJob>} jobs
             * @memberof OracleJob.MeanTask
             * @instance
             */
            MeanTask.prototype.jobs = $util.emptyArray;
    
            /**
             * Creates a new MeanTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.IMeanTask=} [properties] Properties to set
             * @returns {OracleJob.MeanTask} MeanTask instance
             */
            MeanTask.create = function create(properties) {
                return new MeanTask(properties);
            };
    
            /**
             * Encodes the specified MeanTask message. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.IMeanTask} message MeanTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MeanTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tasks != null && message.tasks.length)
                    for (var i = 0; i < message.tasks.length; ++i)
                        $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jobs != null && message.jobs.length)
                    for (var i = 0; i < message.jobs.length; ++i)
                        $root.OracleJob.encode(message.jobs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified MeanTask message, length delimited. Does not implicitly {@link OracleJob.MeanTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.IMeanTask} message MeanTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MeanTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MeanTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MeanTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MeanTask} MeanTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MeanTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MeanTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.tasks && message.tasks.length))
                            message.tasks = [];
                        message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.jobs && message.jobs.length))
                            message.jobs = [];
                        message.jobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MeanTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MeanTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MeanTask} MeanTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MeanTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MeanTask message.
             * @function verify
             * @memberof OracleJob.MeanTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MeanTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tasks != null && message.hasOwnProperty("tasks")) {
                    if (!Array.isArray(message.tasks))
                        return "tasks: array expected";
                    for (var i = 0; i < message.tasks.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.tasks[i]);
                        if (error)
                            return "tasks." + error;
                    }
                }
                if (message.jobs != null && message.hasOwnProperty("jobs")) {
                    if (!Array.isArray(message.jobs))
                        return "jobs: array expected";
                    for (var i = 0; i < message.jobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.jobs[i]);
                        if (error)
                            return "jobs." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a MeanTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MeanTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MeanTask} MeanTask
             */
            MeanTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MeanTask)
                    return object;
                var message = new $root.OracleJob.MeanTask();
                if (object.tasks) {
                    if (!Array.isArray(object.tasks))
                        throw TypeError(".OracleJob.MeanTask.tasks: array expected");
                    message.tasks = [];
                    for (var i = 0; i < object.tasks.length; ++i) {
                        if (typeof object.tasks[i] !== "object")
                            throw TypeError(".OracleJob.MeanTask.tasks: object expected");
                        message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                    }
                }
                if (object.jobs) {
                    if (!Array.isArray(object.jobs))
                        throw TypeError(".OracleJob.MeanTask.jobs: array expected");
                    message.jobs = [];
                    for (var i = 0; i < object.jobs.length; ++i) {
                        if (typeof object.jobs[i] !== "object")
                            throw TypeError(".OracleJob.MeanTask.jobs: object expected");
                        message.jobs[i] = $root.OracleJob.fromObject(object.jobs[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a MeanTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MeanTask
             * @static
             * @param {OracleJob.MeanTask} message MeanTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MeanTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.tasks = [];
                    object.jobs = [];
                }
                if (message.tasks && message.tasks.length) {
                    object.tasks = [];
                    for (var j = 0; j < message.tasks.length; ++j)
                        object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
                }
                if (message.jobs && message.jobs.length) {
                    object.jobs = [];
                    for (var j = 0; j < message.jobs.length; ++j)
                        object.jobs[j] = $root.OracleJob.toObject(message.jobs[j], options);
                }
                return object;
            };
    
            /**
             * Converts this MeanTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MeanTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MeanTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MeanTask;
        })();
    
        OracleJob.MaxTask = (function() {
    
            /**
             * Properties of a MaxTask.
             * @memberof OracleJob
             * @interface IMaxTask
             * @property {Array.<OracleJob.ITask>|null} [tasks] MaxTask tasks
             * @property {Array.<IOracleJob>|null} [jobs] MaxTask jobs
             */
    
            /**
             * Constructs a new MaxTask.
             * @memberof OracleJob
             * @classdesc Represents a MaxTask.
             * @implements IMaxTask
             * @constructor
             * @param {OracleJob.IMaxTask=} [properties] Properties to set
             */
            function MaxTask(properties) {
                this.tasks = [];
                this.jobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MaxTask tasks.
             * @member {Array.<OracleJob.ITask>} tasks
             * @memberof OracleJob.MaxTask
             * @instance
             */
            MaxTask.prototype.tasks = $util.emptyArray;
    
            /**
             * MaxTask jobs.
             * @member {Array.<IOracleJob>} jobs
             * @memberof OracleJob.MaxTask
             * @instance
             */
            MaxTask.prototype.jobs = $util.emptyArray;
    
            /**
             * Creates a new MaxTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.IMaxTask=} [properties] Properties to set
             * @returns {OracleJob.MaxTask} MaxTask instance
             */
            MaxTask.create = function create(properties) {
                return new MaxTask(properties);
            };
    
            /**
             * Encodes the specified MaxTask message. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.IMaxTask} message MaxTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MaxTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tasks != null && message.tasks.length)
                    for (var i = 0; i < message.tasks.length; ++i)
                        $root.OracleJob.Task.encode(message.tasks[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jobs != null && message.jobs.length)
                    for (var i = 0; i < message.jobs.length; ++i)
                        $root.OracleJob.encode(message.jobs[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified MaxTask message, length delimited. Does not implicitly {@link OracleJob.MaxTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.IMaxTask} message MaxTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MaxTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MaxTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MaxTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MaxTask} MaxTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MaxTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MaxTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.tasks && message.tasks.length))
                            message.tasks = [];
                        message.tasks.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.jobs && message.jobs.length))
                            message.jobs = [];
                        message.jobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MaxTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MaxTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MaxTask} MaxTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MaxTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MaxTask message.
             * @function verify
             * @memberof OracleJob.MaxTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MaxTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.tasks != null && message.hasOwnProperty("tasks")) {
                    if (!Array.isArray(message.tasks))
                        return "tasks: array expected";
                    for (var i = 0; i < message.tasks.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.tasks[i]);
                        if (error)
                            return "tasks." + error;
                    }
                }
                if (message.jobs != null && message.hasOwnProperty("jobs")) {
                    if (!Array.isArray(message.jobs))
                        return "jobs: array expected";
                    for (var i = 0; i < message.jobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.jobs[i]);
                        if (error)
                            return "jobs." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a MaxTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MaxTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MaxTask} MaxTask
             */
            MaxTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MaxTask)
                    return object;
                var message = new $root.OracleJob.MaxTask();
                if (object.tasks) {
                    if (!Array.isArray(object.tasks))
                        throw TypeError(".OracleJob.MaxTask.tasks: array expected");
                    message.tasks = [];
                    for (var i = 0; i < object.tasks.length; ++i) {
                        if (typeof object.tasks[i] !== "object")
                            throw TypeError(".OracleJob.MaxTask.tasks: object expected");
                        message.tasks[i] = $root.OracleJob.Task.fromObject(object.tasks[i]);
                    }
                }
                if (object.jobs) {
                    if (!Array.isArray(object.jobs))
                        throw TypeError(".OracleJob.MaxTask.jobs: array expected");
                    message.jobs = [];
                    for (var i = 0; i < object.jobs.length; ++i) {
                        if (typeof object.jobs[i] !== "object")
                            throw TypeError(".OracleJob.MaxTask.jobs: object expected");
                        message.jobs[i] = $root.OracleJob.fromObject(object.jobs[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a MaxTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MaxTask
             * @static
             * @param {OracleJob.MaxTask} message MaxTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MaxTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.tasks = [];
                    object.jobs = [];
                }
                if (message.tasks && message.tasks.length) {
                    object.tasks = [];
                    for (var j = 0; j < message.tasks.length; ++j)
                        object.tasks[j] = $root.OracleJob.Task.toObject(message.tasks[j], options);
                }
                if (message.jobs && message.jobs.length) {
                    object.jobs = [];
                    for (var j = 0; j < message.jobs.length; ++j)
                        object.jobs[j] = $root.OracleJob.toObject(message.jobs[j], options);
                }
                return object;
            };
    
            /**
             * Converts this MaxTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MaxTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MaxTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MaxTask;
        })();
    
        OracleJob.ValueTask = (function() {
    
            /**
             * Properties of a ValueTask.
             * @memberof OracleJob
             * @interface IValueTask
             * @property {number|null} [value] ValueTask value
             * @property {string|null} [aggregatorPubkey] ValueTask aggregatorPubkey
             */
    
            /**
             * Constructs a new ValueTask.
             * @memberof OracleJob
             * @classdesc Represents a ValueTask.
             * @implements IValueTask
             * @constructor
             * @param {OracleJob.IValueTask=} [properties] Properties to set
             */
            function ValueTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ValueTask value.
             * @member {number|null|undefined} value
             * @memberof OracleJob.ValueTask
             * @instance
             */
            ValueTask.prototype.value = null;
    
            /**
             * ValueTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.ValueTask
             * @instance
             */
            ValueTask.prototype.aggregatorPubkey = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * ValueTask Value.
             * @member {"value"|"aggregatorPubkey"|undefined} Value
             * @memberof OracleJob.ValueTask
             * @instance
             */
            Object.defineProperty(ValueTask.prototype, "Value", {
                get: $util.oneOfGetter($oneOfFields = ["value", "aggregatorPubkey"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new ValueTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.IValueTask=} [properties] Properties to set
             * @returns {OracleJob.ValueTask} ValueTask instance
             */
            ValueTask.create = function create(properties) {
                return new ValueTask(properties);
            };
    
            /**
             * Encodes the specified ValueTask message. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.IValueTask} message ValueTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                return writer;
            };
    
            /**
             * Encodes the specified ValueTask message, length delimited. Does not implicitly {@link OracleJob.ValueTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.IValueTask} message ValueTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValueTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ValueTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.ValueTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.ValueTask} ValueTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.ValueTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ValueTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.ValueTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.ValueTask} ValueTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ValueTask message.
             * @function verify
             * @memberof OracleJob.ValueTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ValueTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.value != null && message.hasOwnProperty("value")) {
                    properties.Value = 1;
                    if (typeof message.value !== "number")
                        return "value: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Value === 1)
                        return "Value: multiple values";
                    properties.Value = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                return null;
            };
    
            /**
             * Creates a ValueTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.ValueTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.ValueTask} ValueTask
             */
            ValueTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.ValueTask)
                    return object;
                var message = new $root.OracleJob.ValueTask();
                if (object.value != null)
                    message.value = Number(object.value);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a ValueTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.ValueTask
             * @static
             * @param {OracleJob.ValueTask} message ValueTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ValueTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.value != null && message.hasOwnProperty("value")) {
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                    if (options.oneofs)
                        object.Value = "value";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Value = "aggregatorPubkey";
                }
                return object;
            };
    
            /**
             * Converts this ValueTask to JSON.
             * @function toJSON
             * @memberof OracleJob.ValueTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ValueTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ValueTask;
        })();
    
        OracleJob.WebsocketTask = (function() {
    
            /**
             * Properties of a WebsocketTask.
             * @memberof OracleJob
             * @interface IWebsocketTask
             * @property {string|null} [url] WebsocketTask url
             * @property {string|null} [subscription] WebsocketTask subscription
             * @property {number|null} [maxDataAgeSeconds] WebsocketTask maxDataAgeSeconds
             * @property {string|null} [filter] WebsocketTask filter
             */
    
            /**
             * Constructs a new WebsocketTask.
             * @memberof OracleJob
             * @classdesc Represents a WebsocketTask.
             * @implements IWebsocketTask
             * @constructor
             * @param {OracleJob.IWebsocketTask=} [properties] Properties to set
             */
            function WebsocketTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * WebsocketTask url.
             * @member {string} url
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.url = "";
    
            /**
             * WebsocketTask subscription.
             * @member {string} subscription
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.subscription = "";
    
            /**
             * WebsocketTask maxDataAgeSeconds.
             * @member {number} maxDataAgeSeconds
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.maxDataAgeSeconds = 0;
    
            /**
             * WebsocketTask filter.
             * @member {string} filter
             * @memberof OracleJob.WebsocketTask
             * @instance
             */
            WebsocketTask.prototype.filter = "";
    
            /**
             * Creates a new WebsocketTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.IWebsocketTask=} [properties] Properties to set
             * @returns {OracleJob.WebsocketTask} WebsocketTask instance
             */
            WebsocketTask.create = function create(properties) {
                return new WebsocketTask(properties);
            };
    
            /**
             * Encodes the specified WebsocketTask message. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.IWebsocketTask} message WebsocketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WebsocketTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                if (message.subscription != null && Object.hasOwnProperty.call(message, "subscription"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.subscription);
                if (message.maxDataAgeSeconds != null && Object.hasOwnProperty.call(message, "maxDataAgeSeconds"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.maxDataAgeSeconds);
                if (message.filter != null && Object.hasOwnProperty.call(message, "filter"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.filter);
                return writer;
            };
    
            /**
             * Encodes the specified WebsocketTask message, length delimited. Does not implicitly {@link OracleJob.WebsocketTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.IWebsocketTask} message WebsocketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WebsocketTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a WebsocketTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.WebsocketTask} WebsocketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WebsocketTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.WebsocketTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.url = reader.string();
                        break;
                    case 2:
                        message.subscription = reader.string();
                        break;
                    case 3:
                        message.maxDataAgeSeconds = reader.int32();
                        break;
                    case 4:
                        message.filter = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a WebsocketTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.WebsocketTask} WebsocketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WebsocketTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a WebsocketTask message.
             * @function verify
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WebsocketTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.subscription != null && message.hasOwnProperty("subscription"))
                    if (!$util.isString(message.subscription))
                        return "subscription: string expected";
                if (message.maxDataAgeSeconds != null && message.hasOwnProperty("maxDataAgeSeconds"))
                    if (!$util.isInteger(message.maxDataAgeSeconds))
                        return "maxDataAgeSeconds: integer expected";
                if (message.filter != null && message.hasOwnProperty("filter"))
                    if (!$util.isString(message.filter))
                        return "filter: string expected";
                return null;
            };
    
            /**
             * Creates a WebsocketTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.WebsocketTask} WebsocketTask
             */
            WebsocketTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.WebsocketTask)
                    return object;
                var message = new $root.OracleJob.WebsocketTask();
                if (object.url != null)
                    message.url = String(object.url);
                if (object.subscription != null)
                    message.subscription = String(object.subscription);
                if (object.maxDataAgeSeconds != null)
                    message.maxDataAgeSeconds = object.maxDataAgeSeconds | 0;
                if (object.filter != null)
                    message.filter = String(object.filter);
                return message;
            };
    
            /**
             * Creates a plain object from a WebsocketTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.WebsocketTask
             * @static
             * @param {OracleJob.WebsocketTask} message WebsocketTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WebsocketTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.url = "";
                    object.subscription = "";
                    object.maxDataAgeSeconds = 0;
                    object.filter = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.subscription != null && message.hasOwnProperty("subscription"))
                    object.subscription = message.subscription;
                if (message.maxDataAgeSeconds != null && message.hasOwnProperty("maxDataAgeSeconds"))
                    object.maxDataAgeSeconds = message.maxDataAgeSeconds;
                if (message.filter != null && message.hasOwnProperty("filter"))
                    object.filter = message.filter;
                return object;
            };
    
            /**
             * Converts this WebsocketTask to JSON.
             * @function toJSON
             * @memberof OracleJob.WebsocketTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WebsocketTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return WebsocketTask;
        })();
    
        OracleJob.ConditionalTask = (function() {
    
            /**
             * Properties of a ConditionalTask.
             * @memberof OracleJob
             * @interface IConditionalTask
             * @property {Array.<OracleJob.ITask>|null} [attempt] ConditionalTask attempt
             * @property {Array.<OracleJob.ITask>|null} [onFailure] ConditionalTask onFailure
             */
    
            /**
             * Constructs a new ConditionalTask.
             * @memberof OracleJob
             * @classdesc Represents a ConditionalTask.
             * @implements IConditionalTask
             * @constructor
             * @param {OracleJob.IConditionalTask=} [properties] Properties to set
             */
            function ConditionalTask(properties) {
                this.attempt = [];
                this.onFailure = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ConditionalTask attempt.
             * @member {Array.<OracleJob.ITask>} attempt
             * @memberof OracleJob.ConditionalTask
             * @instance
             */
            ConditionalTask.prototype.attempt = $util.emptyArray;
    
            /**
             * ConditionalTask onFailure.
             * @member {Array.<OracleJob.ITask>} onFailure
             * @memberof OracleJob.ConditionalTask
             * @instance
             */
            ConditionalTask.prototype.onFailure = $util.emptyArray;
    
            /**
             * Creates a new ConditionalTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.IConditionalTask=} [properties] Properties to set
             * @returns {OracleJob.ConditionalTask} ConditionalTask instance
             */
            ConditionalTask.create = function create(properties) {
                return new ConditionalTask(properties);
            };
    
            /**
             * Encodes the specified ConditionalTask message. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.IConditionalTask} message ConditionalTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConditionalTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.attempt != null && message.attempt.length)
                    for (var i = 0; i < message.attempt.length; ++i)
                        $root.OracleJob.Task.encode(message.attempt[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.onFailure != null && message.onFailure.length)
                    for (var i = 0; i < message.onFailure.length; ++i)
                        $root.OracleJob.Task.encode(message.onFailure[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified ConditionalTask message, length delimited. Does not implicitly {@link OracleJob.ConditionalTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.IConditionalTask} message ConditionalTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConditionalTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ConditionalTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.ConditionalTask} ConditionalTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConditionalTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.ConditionalTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.attempt && message.attempt.length))
                            message.attempt = [];
                        message.attempt.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.onFailure && message.onFailure.length))
                            message.onFailure = [];
                        message.onFailure.push($root.OracleJob.Task.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ConditionalTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.ConditionalTask} ConditionalTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConditionalTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ConditionalTask message.
             * @function verify
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ConditionalTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.attempt != null && message.hasOwnProperty("attempt")) {
                    if (!Array.isArray(message.attempt))
                        return "attempt: array expected";
                    for (var i = 0; i < message.attempt.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.attempt[i]);
                        if (error)
                            return "attempt." + error;
                    }
                }
                if (message.onFailure != null && message.hasOwnProperty("onFailure")) {
                    if (!Array.isArray(message.onFailure))
                        return "onFailure: array expected";
                    for (var i = 0; i < message.onFailure.length; ++i) {
                        var error = $root.OracleJob.Task.verify(message.onFailure[i]);
                        if (error)
                            return "onFailure." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a ConditionalTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.ConditionalTask} ConditionalTask
             */
            ConditionalTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.ConditionalTask)
                    return object;
                var message = new $root.OracleJob.ConditionalTask();
                if (object.attempt) {
                    if (!Array.isArray(object.attempt))
                        throw TypeError(".OracleJob.ConditionalTask.attempt: array expected");
                    message.attempt = [];
                    for (var i = 0; i < object.attempt.length; ++i) {
                        if (typeof object.attempt[i] !== "object")
                            throw TypeError(".OracleJob.ConditionalTask.attempt: object expected");
                        message.attempt[i] = $root.OracleJob.Task.fromObject(object.attempt[i]);
                    }
                }
                if (object.onFailure) {
                    if (!Array.isArray(object.onFailure))
                        throw TypeError(".OracleJob.ConditionalTask.onFailure: array expected");
                    message.onFailure = [];
                    for (var i = 0; i < object.onFailure.length; ++i) {
                        if (typeof object.onFailure[i] !== "object")
                            throw TypeError(".OracleJob.ConditionalTask.onFailure: object expected");
                        message.onFailure[i] = $root.OracleJob.Task.fromObject(object.onFailure[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a ConditionalTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.ConditionalTask
             * @static
             * @param {OracleJob.ConditionalTask} message ConditionalTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ConditionalTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.attempt = [];
                    object.onFailure = [];
                }
                if (message.attempt && message.attempt.length) {
                    object.attempt = [];
                    for (var j = 0; j < message.attempt.length; ++j)
                        object.attempt[j] = $root.OracleJob.Task.toObject(message.attempt[j], options);
                }
                if (message.onFailure && message.onFailure.length) {
                    object.onFailure = [];
                    for (var j = 0; j < message.onFailure.length; ++j)
                        object.onFailure[j] = $root.OracleJob.Task.toObject(message.onFailure[j], options);
                }
                return object;
            };
    
            /**
             * Converts this ConditionalTask to JSON.
             * @function toJSON
             * @memberof OracleJob.ConditionalTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ConditionalTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ConditionalTask;
        })();
    
        OracleJob.DivideTask = (function() {
    
            /**
             * Properties of a DivideTask.
             * @memberof OracleJob
             * @interface IDivideTask
             * @property {number|null} [scalar] DivideTask scalar
             * @property {string|null} [aggregatorPubkey] DivideTask aggregatorPubkey
             * @property {IOracleJob|null} [job] DivideTask job
             */
    
            /**
             * Constructs a new DivideTask.
             * @memberof OracleJob
             * @classdesc Represents a DivideTask.
             * @implements IDivideTask
             * @constructor
             * @param {OracleJob.IDivideTask=} [properties] Properties to set
             */
            function DivideTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * DivideTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.scalar = null;
    
            /**
             * DivideTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.aggregatorPubkey = null;
    
            /**
             * DivideTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.DivideTask
             * @instance
             */
            DivideTask.prototype.job = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * DivideTask Denominator.
             * @member {"scalar"|"aggregatorPubkey"|"job"|undefined} Denominator
             * @memberof OracleJob.DivideTask
             * @instance
             */
            Object.defineProperty(DivideTask.prototype, "Denominator", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new DivideTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.IDivideTask=} [properties] Properties to set
             * @returns {OracleJob.DivideTask} DivideTask instance
             */
            DivideTask.create = function create(properties) {
                return new DivideTask(properties);
            };
    
            /**
             * Encodes the specified DivideTask message. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.IDivideTask} message DivideTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DivideTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified DivideTask message, length delimited. Does not implicitly {@link OracleJob.DivideTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.IDivideTask} message DivideTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DivideTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a DivideTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.DivideTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.DivideTask} DivideTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DivideTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.DivideTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a DivideTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.DivideTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.DivideTask} DivideTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DivideTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a DivideTask message.
             * @function verify
             * @memberof OracleJob.DivideTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DivideTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Denominator = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Denominator === 1)
                        return "Denominator: multiple values";
                    properties.Denominator = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Denominator === 1)
                        return "Denominator: multiple values";
                    properties.Denominator = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a DivideTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.DivideTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.DivideTask} DivideTask
             */
            DivideTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.DivideTask)
                    return object;
                var message = new $root.OracleJob.DivideTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.DivideTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a DivideTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.DivideTask
             * @static
             * @param {OracleJob.DivideTask} message DivideTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DivideTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Denominator = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Denominator = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Denominator = "job";
                }
                return object;
            };
    
            /**
             * Converts this DivideTask to JSON.
             * @function toJSON
             * @memberof OracleJob.DivideTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DivideTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return DivideTask;
        })();
    
        OracleJob.MultiplyTask = (function() {
    
            /**
             * Properties of a MultiplyTask.
             * @memberof OracleJob
             * @interface IMultiplyTask
             * @property {number|null} [scalar] MultiplyTask scalar
             * @property {string|null} [aggregatorPubkey] MultiplyTask aggregatorPubkey
             * @property {IOracleJob|null} [job] MultiplyTask job
             */
    
            /**
             * Constructs a new MultiplyTask.
             * @memberof OracleJob
             * @classdesc Represents a MultiplyTask.
             * @implements IMultiplyTask
             * @constructor
             * @param {OracleJob.IMultiplyTask=} [properties] Properties to set
             */
            function MultiplyTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MultiplyTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.scalar = null;
    
            /**
             * MultiplyTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.aggregatorPubkey = null;
    
            /**
             * MultiplyTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            MultiplyTask.prototype.job = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * MultiplyTask Multiple.
             * @member {"scalar"|"aggregatorPubkey"|"job"|undefined} Multiple
             * @memberof OracleJob.MultiplyTask
             * @instance
             */
            Object.defineProperty(MultiplyTask.prototype, "Multiple", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new MultiplyTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.IMultiplyTask=} [properties] Properties to set
             * @returns {OracleJob.MultiplyTask} MultiplyTask instance
             */
            MultiplyTask.create = function create(properties) {
                return new MultiplyTask(properties);
            };
    
            /**
             * Encodes the specified MultiplyTask message. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.IMultiplyTask} message MultiplyTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MultiplyTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified MultiplyTask message, length delimited. Does not implicitly {@link OracleJob.MultiplyTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.IMultiplyTask} message MultiplyTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MultiplyTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MultiplyTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MultiplyTask} MultiplyTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MultiplyTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MultiplyTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MultiplyTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MultiplyTask} MultiplyTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MultiplyTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MultiplyTask message.
             * @function verify
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MultiplyTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Multiple = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Multiple === 1)
                        return "Multiple: multiple values";
                    properties.Multiple = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Multiple === 1)
                        return "Multiple: multiple values";
                    properties.Multiple = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a MultiplyTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MultiplyTask} MultiplyTask
             */
            MultiplyTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MultiplyTask)
                    return object;
                var message = new $root.OracleJob.MultiplyTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.MultiplyTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a MultiplyTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MultiplyTask
             * @static
             * @param {OracleJob.MultiplyTask} message MultiplyTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MultiplyTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Multiple = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Multiple = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Multiple = "job";
                }
                return object;
            };
    
            /**
             * Converts this MultiplyTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MultiplyTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MultiplyTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MultiplyTask;
        })();
    
        OracleJob.AddTask = (function() {
    
            /**
             * Properties of an AddTask.
             * @memberof OracleJob
             * @interface IAddTask
             * @property {number|null} [scalar] AddTask scalar
             * @property {string|null} [aggregatorPubkey] AddTask aggregatorPubkey
             * @property {IOracleJob|null} [job] AddTask job
             */
    
            /**
             * Constructs a new AddTask.
             * @memberof OracleJob
             * @classdesc Represents an AddTask.
             * @implements IAddTask
             * @constructor
             * @param {OracleJob.IAddTask=} [properties] Properties to set
             */
            function AddTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AddTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.scalar = null;
    
            /**
             * AddTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.aggregatorPubkey = null;
    
            /**
             * AddTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.AddTask
             * @instance
             */
            AddTask.prototype.job = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * AddTask Addition.
             * @member {"scalar"|"aggregatorPubkey"|"job"|undefined} Addition
             * @memberof OracleJob.AddTask
             * @instance
             */
            Object.defineProperty(AddTask.prototype, "Addition", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new AddTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.IAddTask=} [properties] Properties to set
             * @returns {OracleJob.AddTask} AddTask instance
             */
            AddTask.create = function create(properties) {
                return new AddTask(properties);
            };
    
            /**
             * Encodes the specified AddTask message. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.IAddTask} message AddTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified AddTask message, length delimited. Does not implicitly {@link OracleJob.AddTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.IAddTask} message AddTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AddTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.AddTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.AddTask} AddTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.AddTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AddTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.AddTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.AddTask} AddTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AddTask message.
             * @function verify
             * @memberof OracleJob.AddTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Addition = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Addition === 1)
                        return "Addition: multiple values";
                    properties.Addition = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Addition === 1)
                        return "Addition: multiple values";
                    properties.Addition = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates an AddTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.AddTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.AddTask} AddTask
             */
            AddTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.AddTask)
                    return object;
                var message = new $root.OracleJob.AddTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.AddTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                return message;
            };
    
            /**
             * Creates a plain object from an AddTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.AddTask
             * @static
             * @param {OracleJob.AddTask} message AddTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Addition = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Addition = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Addition = "job";
                }
                return object;
            };
    
            /**
             * Converts this AddTask to JSON.
             * @function toJSON
             * @memberof OracleJob.AddTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AddTask;
        })();
    
        OracleJob.SubtractTask = (function() {
    
            /**
             * Properties of a SubtractTask.
             * @memberof OracleJob
             * @interface ISubtractTask
             * @property {number|null} [scalar] SubtractTask scalar
             * @property {string|null} [aggregatorPubkey] SubtractTask aggregatorPubkey
             * @property {IOracleJob|null} [job] SubtractTask job
             */
    
            /**
             * Constructs a new SubtractTask.
             * @memberof OracleJob
             * @classdesc Represents a SubtractTask.
             * @implements ISubtractTask
             * @constructor
             * @param {OracleJob.ISubtractTask=} [properties] Properties to set
             */
            function SubtractTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SubtractTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.scalar = null;
    
            /**
             * SubtractTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.aggregatorPubkey = null;
    
            /**
             * SubtractTask job.
             * @member {IOracleJob|null|undefined} job
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            SubtractTask.prototype.job = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * SubtractTask Subtraction.
             * @member {"scalar"|"aggregatorPubkey"|"job"|undefined} Subtraction
             * @memberof OracleJob.SubtractTask
             * @instance
             */
            Object.defineProperty(SubtractTask.prototype, "Subtraction", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey", "job"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new SubtractTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.ISubtractTask=} [properties] Properties to set
             * @returns {OracleJob.SubtractTask} SubtractTask instance
             */
            SubtractTask.create = function create(properties) {
                return new SubtractTask(properties);
            };
    
            /**
             * Encodes the specified SubtractTask message. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.ISubtractTask} message SubtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubtractTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified SubtractTask message, length delimited. Does not implicitly {@link OracleJob.SubtractTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.ISubtractTask} message SubtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubtractTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SubtractTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SubtractTask} SubtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubtractTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SubtractTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 3:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SubtractTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SubtractTask} SubtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubtractTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SubtractTask message.
             * @function verify
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubtractTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Subtraction = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Subtraction === 1)
                        return "Subtraction: multiple values";
                    properties.Subtraction = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    if (properties.Subtraction === 1)
                        return "Subtraction: multiple values";
                    properties.Subtraction = 1;
                    {
                        var error = $root.OracleJob.verify(message.job);
                        if (error)
                            return "job." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a SubtractTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SubtractTask} SubtractTask
             */
            SubtractTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SubtractTask)
                    return object;
                var message = new $root.OracleJob.SubtractTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".OracleJob.SubtractTask.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a SubtractTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SubtractTask
             * @static
             * @param {OracleJob.SubtractTask} message SubtractTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubtractTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Subtraction = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Subtraction = "aggregatorPubkey";
                }
                if (message.job != null && message.hasOwnProperty("job")) {
                    object.job = $root.OracleJob.toObject(message.job, options);
                    if (options.oneofs)
                        object.Subtraction = "job";
                }
                return object;
            };
    
            /**
             * Converts this SubtractTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SubtractTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubtractTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SubtractTask;
        })();
    
        OracleJob.LpTokenPriceTask = (function() {
    
            /**
             * Properties of a LpTokenPriceTask.
             * @memberof OracleJob
             * @interface ILpTokenPriceTask
             * @property {string|null} [mercurialPoolAddress] LpTokenPriceTask mercurialPoolAddress
             * @property {string|null} [saberPoolAddress] LpTokenPriceTask saberPoolAddress
             * @property {string|null} [orcaPoolAddress] LpTokenPriceTask orcaPoolAddress
             * @property {string|null} [raydiumPoolAddress] LpTokenPriceTask raydiumPoolAddress
             * @property {Array.<string>|null} [priceFeedAddresses] LpTokenPriceTask priceFeedAddresses
             * @property {Array.<IOracleJob>|null} [priceFeedJobs] LpTokenPriceTask priceFeedJobs
             * @property {boolean|null} [useFairPrice] LpTokenPriceTask useFairPrice
             */
    
            /**
             * Constructs a new LpTokenPriceTask.
             * @memberof OracleJob
             * @classdesc Represents a LpTokenPriceTask.
             * @implements ILpTokenPriceTask
             * @constructor
             * @param {OracleJob.ILpTokenPriceTask=} [properties] Properties to set
             */
            function LpTokenPriceTask(properties) {
                this.priceFeedAddresses = [];
                this.priceFeedJobs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LpTokenPriceTask mercurialPoolAddress.
             * @member {string|null|undefined} mercurialPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.mercurialPoolAddress = null;
    
            /**
             * LpTokenPriceTask saberPoolAddress.
             * @member {string|null|undefined} saberPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.saberPoolAddress = null;
    
            /**
             * LpTokenPriceTask orcaPoolAddress.
             * @member {string|null|undefined} orcaPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.orcaPoolAddress = null;
    
            /**
             * LpTokenPriceTask raydiumPoolAddress.
             * @member {string|null|undefined} raydiumPoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.raydiumPoolAddress = null;
    
            /**
             * LpTokenPriceTask priceFeedAddresses.
             * @member {Array.<string>} priceFeedAddresses
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.priceFeedAddresses = $util.emptyArray;
    
            /**
             * LpTokenPriceTask priceFeedJobs.
             * @member {Array.<IOracleJob>} priceFeedJobs
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.priceFeedJobs = $util.emptyArray;
    
            /**
             * LpTokenPriceTask useFairPrice.
             * @member {boolean} useFairPrice
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            LpTokenPriceTask.prototype.useFairPrice = false;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * LpTokenPriceTask PoolAddress.
             * @member {"mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolAddress"|"raydiumPoolAddress"|undefined} PoolAddress
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             */
            Object.defineProperty(LpTokenPriceTask.prototype, "PoolAddress", {
                get: $util.oneOfGetter($oneOfFields = ["mercurialPoolAddress", "saberPoolAddress", "orcaPoolAddress", "raydiumPoolAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new LpTokenPriceTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.ILpTokenPriceTask=} [properties] Properties to set
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask instance
             */
            LpTokenPriceTask.create = function create(properties) {
                return new LpTokenPriceTask(properties);
            };
    
            /**
             * Encodes the specified LpTokenPriceTask message. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.ILpTokenPriceTask} message LpTokenPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpTokenPriceTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.mercurialPoolAddress != null && Object.hasOwnProperty.call(message, "mercurialPoolAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.mercurialPoolAddress);
                if (message.saberPoolAddress != null && Object.hasOwnProperty.call(message, "saberPoolAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.saberPoolAddress);
                if (message.orcaPoolAddress != null && Object.hasOwnProperty.call(message, "orcaPoolAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.orcaPoolAddress);
                if (message.raydiumPoolAddress != null && Object.hasOwnProperty.call(message, "raydiumPoolAddress"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.raydiumPoolAddress);
                if (message.priceFeedAddresses != null && message.priceFeedAddresses.length)
                    for (var i = 0; i < message.priceFeedAddresses.length; ++i)
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.priceFeedAddresses[i]);
                if (message.priceFeedJobs != null && message.priceFeedJobs.length)
                    for (var i = 0; i < message.priceFeedJobs.length; ++i)
                        $root.OracleJob.encode(message.priceFeedJobs[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.useFairPrice != null && Object.hasOwnProperty.call(message, "useFairPrice"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.useFairPrice);
                return writer;
            };
    
            /**
             * Encodes the specified LpTokenPriceTask message, length delimited. Does not implicitly {@link OracleJob.LpTokenPriceTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.ILpTokenPriceTask} message LpTokenPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpTokenPriceTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LpTokenPriceTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpTokenPriceTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.LpTokenPriceTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.mercurialPoolAddress = reader.string();
                        break;
                    case 2:
                        message.saberPoolAddress = reader.string();
                        break;
                    case 3:
                        message.orcaPoolAddress = reader.string();
                        break;
                    case 4:
                        message.raydiumPoolAddress = reader.string();
                        break;
                    case 5:
                        if (!(message.priceFeedAddresses && message.priceFeedAddresses.length))
                            message.priceFeedAddresses = [];
                        message.priceFeedAddresses.push(reader.string());
                        break;
                    case 6:
                        if (!(message.priceFeedJobs && message.priceFeedJobs.length))
                            message.priceFeedJobs = [];
                        message.priceFeedJobs.push($root.OracleJob.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        message.useFairPrice = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LpTokenPriceTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpTokenPriceTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LpTokenPriceTask message.
             * @function verify
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LpTokenPriceTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.mercurialPoolAddress))
                        return "mercurialPoolAddress: string expected";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.saberPoolAddress))
                        return "saberPoolAddress: string expected";
                }
                if (message.orcaPoolAddress != null && message.hasOwnProperty("orcaPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.orcaPoolAddress))
                        return "orcaPoolAddress: string expected";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.raydiumPoolAddress))
                        return "raydiumPoolAddress: string expected";
                }
                if (message.priceFeedAddresses != null && message.hasOwnProperty("priceFeedAddresses")) {
                    if (!Array.isArray(message.priceFeedAddresses))
                        return "priceFeedAddresses: array expected";
                    for (var i = 0; i < message.priceFeedAddresses.length; ++i)
                        if (!$util.isString(message.priceFeedAddresses[i]))
                            return "priceFeedAddresses: string[] expected";
                }
                if (message.priceFeedJobs != null && message.hasOwnProperty("priceFeedJobs")) {
                    if (!Array.isArray(message.priceFeedJobs))
                        return "priceFeedJobs: array expected";
                    for (var i = 0; i < message.priceFeedJobs.length; ++i) {
                        var error = $root.OracleJob.verify(message.priceFeedJobs[i]);
                        if (error)
                            return "priceFeedJobs." + error;
                    }
                }
                if (message.useFairPrice != null && message.hasOwnProperty("useFairPrice"))
                    if (typeof message.useFairPrice !== "boolean")
                        return "useFairPrice: boolean expected";
                return null;
            };
    
            /**
             * Creates a LpTokenPriceTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.LpTokenPriceTask} LpTokenPriceTask
             */
            LpTokenPriceTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.LpTokenPriceTask)
                    return object;
                var message = new $root.OracleJob.LpTokenPriceTask();
                if (object.mercurialPoolAddress != null)
                    message.mercurialPoolAddress = String(object.mercurialPoolAddress);
                if (object.saberPoolAddress != null)
                    message.saberPoolAddress = String(object.saberPoolAddress);
                if (object.orcaPoolAddress != null)
                    message.orcaPoolAddress = String(object.orcaPoolAddress);
                if (object.raydiumPoolAddress != null)
                    message.raydiumPoolAddress = String(object.raydiumPoolAddress);
                if (object.priceFeedAddresses) {
                    if (!Array.isArray(object.priceFeedAddresses))
                        throw TypeError(".OracleJob.LpTokenPriceTask.priceFeedAddresses: array expected");
                    message.priceFeedAddresses = [];
                    for (var i = 0; i < object.priceFeedAddresses.length; ++i)
                        message.priceFeedAddresses[i] = String(object.priceFeedAddresses[i]);
                }
                if (object.priceFeedJobs) {
                    if (!Array.isArray(object.priceFeedJobs))
                        throw TypeError(".OracleJob.LpTokenPriceTask.priceFeedJobs: array expected");
                    message.priceFeedJobs = [];
                    for (var i = 0; i < object.priceFeedJobs.length; ++i) {
                        if (typeof object.priceFeedJobs[i] !== "object")
                            throw TypeError(".OracleJob.LpTokenPriceTask.priceFeedJobs: object expected");
                        message.priceFeedJobs[i] = $root.OracleJob.fromObject(object.priceFeedJobs[i]);
                    }
                }
                if (object.useFairPrice != null)
                    message.useFairPrice = Boolean(object.useFairPrice);
                return message;
            };
    
            /**
             * Creates a plain object from a LpTokenPriceTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.LpTokenPriceTask
             * @static
             * @param {OracleJob.LpTokenPriceTask} message LpTokenPriceTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LpTokenPriceTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.priceFeedAddresses = [];
                    object.priceFeedJobs = [];
                }
                if (options.defaults)
                    object.useFairPrice = false;
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    object.mercurialPoolAddress = message.mercurialPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "mercurialPoolAddress";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    object.saberPoolAddress = message.saberPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "saberPoolAddress";
                }
                if (message.orcaPoolAddress != null && message.hasOwnProperty("orcaPoolAddress")) {
                    object.orcaPoolAddress = message.orcaPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "orcaPoolAddress";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    object.raydiumPoolAddress = message.raydiumPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "raydiumPoolAddress";
                }
                if (message.priceFeedAddresses && message.priceFeedAddresses.length) {
                    object.priceFeedAddresses = [];
                    for (var j = 0; j < message.priceFeedAddresses.length; ++j)
                        object.priceFeedAddresses[j] = message.priceFeedAddresses[j];
                }
                if (message.priceFeedJobs && message.priceFeedJobs.length) {
                    object.priceFeedJobs = [];
                    for (var j = 0; j < message.priceFeedJobs.length; ++j)
                        object.priceFeedJobs[j] = $root.OracleJob.toObject(message.priceFeedJobs[j], options);
                }
                if (message.useFairPrice != null && message.hasOwnProperty("useFairPrice"))
                    object.useFairPrice = message.useFairPrice;
                return object;
            };
    
            /**
             * Converts this LpTokenPriceTask to JSON.
             * @function toJSON
             * @memberof OracleJob.LpTokenPriceTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LpTokenPriceTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LpTokenPriceTask;
        })();
    
        OracleJob.LpExchangeRateTask = (function() {
    
            /**
             * Properties of a LpExchangeRateTask.
             * @memberof OracleJob
             * @interface ILpExchangeRateTask
             * @property {string|null} [inTokenAddress] LpExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] LpExchangeRateTask outTokenAddress
             * @property {string|null} [mercurialPoolAddress] LpExchangeRateTask mercurialPoolAddress
             * @property {string|null} [saberPoolAddress] LpExchangeRateTask saberPoolAddress
             * @property {string|null} [orcaPoolTokenMintAddress] LpExchangeRateTask orcaPoolTokenMintAddress
             * @property {string|null} [raydiumPoolAddress] LpExchangeRateTask raydiumPoolAddress
             */
    
            /**
             * Constructs a new LpExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents a LpExchangeRateTask.
             * @implements ILpExchangeRateTask
             * @constructor
             * @param {OracleJob.ILpExchangeRateTask=} [properties] Properties to set
             */
            function LpExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LpExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * LpExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * LpExchangeRateTask mercurialPoolAddress.
             * @member {string|null|undefined} mercurialPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.mercurialPoolAddress = null;
    
            /**
             * LpExchangeRateTask saberPoolAddress.
             * @member {string|null|undefined} saberPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.saberPoolAddress = null;
    
            /**
             * LpExchangeRateTask orcaPoolTokenMintAddress.
             * @member {string|null|undefined} orcaPoolTokenMintAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.orcaPoolTokenMintAddress = null;
    
            /**
             * LpExchangeRateTask raydiumPoolAddress.
             * @member {string|null|undefined} raydiumPoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            LpExchangeRateTask.prototype.raydiumPoolAddress = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * LpExchangeRateTask PoolAddress.
             * @member {"mercurialPoolAddress"|"saberPoolAddress"|"orcaPoolTokenMintAddress"|"raydiumPoolAddress"|undefined} PoolAddress
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             */
            Object.defineProperty(LpExchangeRateTask.prototype, "PoolAddress", {
                get: $util.oneOfGetter($oneOfFields = ["mercurialPoolAddress", "saberPoolAddress", "orcaPoolTokenMintAddress", "raydiumPoolAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new LpExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.ILpExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask instance
             */
            LpExchangeRateTask.create = function create(properties) {
                return new LpExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified LpExchangeRateTask message. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.ILpExchangeRateTask} message LpExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.mercurialPoolAddress != null && Object.hasOwnProperty.call(message, "mercurialPoolAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.mercurialPoolAddress);
                if (message.saberPoolAddress != null && Object.hasOwnProperty.call(message, "saberPoolAddress"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.saberPoolAddress);
                if (message.orcaPoolTokenMintAddress != null && Object.hasOwnProperty.call(message, "orcaPoolTokenMintAddress"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.orcaPoolTokenMintAddress);
                if (message.raydiumPoolAddress != null && Object.hasOwnProperty.call(message, "raydiumPoolAddress"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.raydiumPoolAddress);
                return writer;
            };
    
            /**
             * Encodes the specified LpExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.LpExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.ILpExchangeRateTask} message LpExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LpExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LpExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.LpExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.mercurialPoolAddress = reader.string();
                        break;
                    case 4:
                        message.saberPoolAddress = reader.string();
                        break;
                    case 5:
                        message.orcaPoolTokenMintAddress = reader.string();
                        break;
                    case 6:
                        message.raydiumPoolAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LpExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LpExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LpExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LpExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.mercurialPoolAddress))
                        return "mercurialPoolAddress: string expected";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.saberPoolAddress))
                        return "saberPoolAddress: string expected";
                }
                if (message.orcaPoolTokenMintAddress != null && message.hasOwnProperty("orcaPoolTokenMintAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.orcaPoolTokenMintAddress))
                        return "orcaPoolTokenMintAddress: string expected";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    if (properties.PoolAddress === 1)
                        return "PoolAddress: multiple values";
                    properties.PoolAddress = 1;
                    if (!$util.isString(message.raydiumPoolAddress))
                        return "raydiumPoolAddress: string expected";
                }
                return null;
            };
    
            /**
             * Creates a LpExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.LpExchangeRateTask} LpExchangeRateTask
             */
            LpExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.LpExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.LpExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.mercurialPoolAddress != null)
                    message.mercurialPoolAddress = String(object.mercurialPoolAddress);
                if (object.saberPoolAddress != null)
                    message.saberPoolAddress = String(object.saberPoolAddress);
                if (object.orcaPoolTokenMintAddress != null)
                    message.orcaPoolTokenMintAddress = String(object.orcaPoolTokenMintAddress);
                if (object.raydiumPoolAddress != null)
                    message.raydiumPoolAddress = String(object.raydiumPoolAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a LpExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.LpExchangeRateTask
             * @static
             * @param {OracleJob.LpExchangeRateTask} message LpExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LpExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.mercurialPoolAddress != null && message.hasOwnProperty("mercurialPoolAddress")) {
                    object.mercurialPoolAddress = message.mercurialPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "mercurialPoolAddress";
                }
                if (message.saberPoolAddress != null && message.hasOwnProperty("saberPoolAddress")) {
                    object.saberPoolAddress = message.saberPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "saberPoolAddress";
                }
                if (message.orcaPoolTokenMintAddress != null && message.hasOwnProperty("orcaPoolTokenMintAddress")) {
                    object.orcaPoolTokenMintAddress = message.orcaPoolTokenMintAddress;
                    if (options.oneofs)
                        object.PoolAddress = "orcaPoolTokenMintAddress";
                }
                if (message.raydiumPoolAddress != null && message.hasOwnProperty("raydiumPoolAddress")) {
                    object.raydiumPoolAddress = message.raydiumPoolAddress;
                    if (options.oneofs)
                        object.PoolAddress = "raydiumPoolAddress";
                }
                return object;
            };
    
            /**
             * Converts this LpExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.LpExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LpExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LpExchangeRateTask;
        })();
    
        OracleJob.RegexExtractTask = (function() {
    
            /**
             * Properties of a RegexExtractTask.
             * @memberof OracleJob
             * @interface IRegexExtractTask
             * @property {string|null} [pattern] RegexExtractTask pattern
             * @property {number|null} [groupNumber] RegexExtractTask groupNumber
             */
    
            /**
             * Constructs a new RegexExtractTask.
             * @memberof OracleJob
             * @classdesc Represents a RegexExtractTask.
             * @implements IRegexExtractTask
             * @constructor
             * @param {OracleJob.IRegexExtractTask=} [properties] Properties to set
             */
            function RegexExtractTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * RegexExtractTask pattern.
             * @member {string} pattern
             * @memberof OracleJob.RegexExtractTask
             * @instance
             */
            RegexExtractTask.prototype.pattern = "";
    
            /**
             * RegexExtractTask groupNumber.
             * @member {number} groupNumber
             * @memberof OracleJob.RegexExtractTask
             * @instance
             */
            RegexExtractTask.prototype.groupNumber = 0;
    
            /**
             * Creates a new RegexExtractTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.IRegexExtractTask=} [properties] Properties to set
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask instance
             */
            RegexExtractTask.create = function create(properties) {
                return new RegexExtractTask(properties);
            };
    
            /**
             * Encodes the specified RegexExtractTask message. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.IRegexExtractTask} message RegexExtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegexExtractTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pattern != null && Object.hasOwnProperty.call(message, "pattern"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pattern);
                if (message.groupNumber != null && Object.hasOwnProperty.call(message, "groupNumber"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.groupNumber);
                return writer;
            };
    
            /**
             * Encodes the specified RegexExtractTask message, length delimited. Does not implicitly {@link OracleJob.RegexExtractTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.IRegexExtractTask} message RegexExtractTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegexExtractTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RegexExtractTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegexExtractTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.RegexExtractTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.pattern = reader.string();
                        break;
                    case 2:
                        message.groupNumber = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RegexExtractTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegexExtractTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RegexExtractTask message.
             * @function verify
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RegexExtractTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pattern != null && message.hasOwnProperty("pattern"))
                    if (!$util.isString(message.pattern))
                        return "pattern: string expected";
                if (message.groupNumber != null && message.hasOwnProperty("groupNumber"))
                    if (!$util.isInteger(message.groupNumber))
                        return "groupNumber: integer expected";
                return null;
            };
    
            /**
             * Creates a RegexExtractTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.RegexExtractTask} RegexExtractTask
             */
            RegexExtractTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.RegexExtractTask)
                    return object;
                var message = new $root.OracleJob.RegexExtractTask();
                if (object.pattern != null)
                    message.pattern = String(object.pattern);
                if (object.groupNumber != null)
                    message.groupNumber = object.groupNumber | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a RegexExtractTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.RegexExtractTask
             * @static
             * @param {OracleJob.RegexExtractTask} message RegexExtractTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RegexExtractTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.pattern = "";
                    object.groupNumber = 0;
                }
                if (message.pattern != null && message.hasOwnProperty("pattern"))
                    object.pattern = message.pattern;
                if (message.groupNumber != null && message.hasOwnProperty("groupNumber"))
                    object.groupNumber = message.groupNumber;
                return object;
            };
    
            /**
             * Converts this RegexExtractTask to JSON.
             * @function toJSON
             * @memberof OracleJob.RegexExtractTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RegexExtractTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RegexExtractTask;
        })();
    
        OracleJob.XStepPriceTask = (function() {
    
            /**
             * Properties of a XStepPriceTask.
             * @memberof OracleJob
             * @interface IXStepPriceTask
             * @property {OracleJob.IMedianTask|null} [stepJob] XStepPriceTask stepJob
             * @property {string|null} [stepAggregatorPubkey] XStepPriceTask stepAggregatorPubkey
             */
    
            /**
             * Constructs a new XStepPriceTask.
             * @memberof OracleJob
             * @classdesc Represents a XStepPriceTask.
             * @implements IXStepPriceTask
             * @constructor
             * @param {OracleJob.IXStepPriceTask=} [properties] Properties to set
             */
            function XStepPriceTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * XStepPriceTask stepJob.
             * @member {OracleJob.IMedianTask|null|undefined} stepJob
             * @memberof OracleJob.XStepPriceTask
             * @instance
             */
            XStepPriceTask.prototype.stepJob = null;
    
            /**
             * XStepPriceTask stepAggregatorPubkey.
             * @member {string|null|undefined} stepAggregatorPubkey
             * @memberof OracleJob.XStepPriceTask
             * @instance
             */
            XStepPriceTask.prototype.stepAggregatorPubkey = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * XStepPriceTask StepSource.
             * @member {"stepJob"|"stepAggregatorPubkey"|undefined} StepSource
             * @memberof OracleJob.XStepPriceTask
             * @instance
             */
            Object.defineProperty(XStepPriceTask.prototype, "StepSource", {
                get: $util.oneOfGetter($oneOfFields = ["stepJob", "stepAggregatorPubkey"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new XStepPriceTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.IXStepPriceTask=} [properties] Properties to set
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask instance
             */
            XStepPriceTask.create = function create(properties) {
                return new XStepPriceTask(properties);
            };
    
            /**
             * Encodes the specified XStepPriceTask message. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.IXStepPriceTask} message XStepPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XStepPriceTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.stepJob != null && Object.hasOwnProperty.call(message, "stepJob"))
                    $root.OracleJob.MedianTask.encode(message.stepJob, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.stepAggregatorPubkey != null && Object.hasOwnProperty.call(message, "stepAggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.stepAggregatorPubkey);
                return writer;
            };
    
            /**
             * Encodes the specified XStepPriceTask message, length delimited. Does not implicitly {@link OracleJob.XStepPriceTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.IXStepPriceTask} message XStepPriceTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            XStepPriceTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a XStepPriceTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XStepPriceTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.XStepPriceTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.stepJob = $root.OracleJob.MedianTask.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.stepAggregatorPubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a XStepPriceTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            XStepPriceTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a XStepPriceTask message.
             * @function verify
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            XStepPriceTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.stepJob != null && message.hasOwnProperty("stepJob")) {
                    properties.StepSource = 1;
                    {
                        var error = $root.OracleJob.MedianTask.verify(message.stepJob);
                        if (error)
                            return "stepJob." + error;
                    }
                }
                if (message.stepAggregatorPubkey != null && message.hasOwnProperty("stepAggregatorPubkey")) {
                    if (properties.StepSource === 1)
                        return "StepSource: multiple values";
                    properties.StepSource = 1;
                    if (!$util.isString(message.stepAggregatorPubkey))
                        return "stepAggregatorPubkey: string expected";
                }
                return null;
            };
    
            /**
             * Creates a XStepPriceTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.XStepPriceTask} XStepPriceTask
             */
            XStepPriceTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.XStepPriceTask)
                    return object;
                var message = new $root.OracleJob.XStepPriceTask();
                if (object.stepJob != null) {
                    if (typeof object.stepJob !== "object")
                        throw TypeError(".OracleJob.XStepPriceTask.stepJob: object expected");
                    message.stepJob = $root.OracleJob.MedianTask.fromObject(object.stepJob);
                }
                if (object.stepAggregatorPubkey != null)
                    message.stepAggregatorPubkey = String(object.stepAggregatorPubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a XStepPriceTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.XStepPriceTask
             * @static
             * @param {OracleJob.XStepPriceTask} message XStepPriceTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            XStepPriceTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.stepJob != null && message.hasOwnProperty("stepJob")) {
                    object.stepJob = $root.OracleJob.MedianTask.toObject(message.stepJob, options);
                    if (options.oneofs)
                        object.StepSource = "stepJob";
                }
                if (message.stepAggregatorPubkey != null && message.hasOwnProperty("stepAggregatorPubkey")) {
                    object.stepAggregatorPubkey = message.stepAggregatorPubkey;
                    if (options.oneofs)
                        object.StepSource = "stepAggregatorPubkey";
                }
                return object;
            };
    
            /**
             * Converts this XStepPriceTask to JSON.
             * @function toJSON
             * @memberof OracleJob.XStepPriceTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            XStepPriceTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return XStepPriceTask;
        })();
    
        OracleJob.TwapTask = (function() {
    
            /**
             * Properties of a TwapTask.
             * @memberof OracleJob
             * @interface ITwapTask
             * @property {string|null} [aggregatorPubkey] TwapTask aggregatorPubkey
             * @property {number|null} [period] TwapTask period
             * @property {boolean|null} [weightByPropagationTime] TwapTask weightByPropagationTime
             * @property {number|null} [minSamples] TwapTask minSamples
             * @property {number|null} [endingUnixTimestamp] TwapTask endingUnixTimestamp
             */
    
            /**
             * Constructs a new TwapTask.
             * @memberof OracleJob
             * @classdesc Represents a TwapTask.
             * @implements ITwapTask
             * @constructor
             * @param {OracleJob.ITwapTask=} [properties] Properties to set
             */
            function TwapTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TwapTask aggregatorPubkey.
             * @member {string} aggregatorPubkey
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.aggregatorPubkey = "";
    
            /**
             * TwapTask period.
             * @member {number} period
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.period = 0;
    
            /**
             * TwapTask weightByPropagationTime.
             * @member {boolean} weightByPropagationTime
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.weightByPropagationTime = false;
    
            /**
             * TwapTask minSamples.
             * @member {number} minSamples
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.minSamples = 0;
    
            /**
             * TwapTask endingUnixTimestamp.
             * @member {number} endingUnixTimestamp
             * @memberof OracleJob.TwapTask
             * @instance
             */
            TwapTask.prototype.endingUnixTimestamp = 0;
    
            /**
             * Creates a new TwapTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.ITwapTask=} [properties] Properties to set
             * @returns {OracleJob.TwapTask} TwapTask instance
             */
            TwapTask.create = function create(properties) {
                return new TwapTask(properties);
            };
    
            /**
             * Encodes the specified TwapTask message. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.ITwapTask} message TwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TwapTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.aggregatorPubkey);
                if (message.period != null && Object.hasOwnProperty.call(message, "period"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.period);
                if (message.weightByPropagationTime != null && Object.hasOwnProperty.call(message, "weightByPropagationTime"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.weightByPropagationTime);
                if (message.minSamples != null && Object.hasOwnProperty.call(message, "minSamples"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.minSamples);
                if (message.endingUnixTimestamp != null && Object.hasOwnProperty.call(message, "endingUnixTimestamp"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.endingUnixTimestamp);
                return writer;
            };
    
            /**
             * Encodes the specified TwapTask message, length delimited. Does not implicitly {@link OracleJob.TwapTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.ITwapTask} message TwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TwapTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TwapTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.TwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.TwapTask} TwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TwapTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.TwapTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.aggregatorPubkey = reader.string();
                        break;
                    case 2:
                        message.period = reader.int32();
                        break;
                    case 3:
                        message.weightByPropagationTime = reader.bool();
                        break;
                    case 4:
                        message.minSamples = reader.uint32();
                        break;
                    case 5:
                        message.endingUnixTimestamp = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TwapTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.TwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.TwapTask} TwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TwapTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TwapTask message.
             * @function verify
             * @memberof OracleJob.TwapTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TwapTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey"))
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                if (message.period != null && message.hasOwnProperty("period"))
                    if (!$util.isInteger(message.period))
                        return "period: integer expected";
                if (message.weightByPropagationTime != null && message.hasOwnProperty("weightByPropagationTime"))
                    if (typeof message.weightByPropagationTime !== "boolean")
                        return "weightByPropagationTime: boolean expected";
                if (message.minSamples != null && message.hasOwnProperty("minSamples"))
                    if (!$util.isInteger(message.minSamples))
                        return "minSamples: integer expected";
                if (message.endingUnixTimestamp != null && message.hasOwnProperty("endingUnixTimestamp"))
                    if (!$util.isInteger(message.endingUnixTimestamp))
                        return "endingUnixTimestamp: integer expected";
                return null;
            };
    
            /**
             * Creates a TwapTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.TwapTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.TwapTask} TwapTask
             */
            TwapTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.TwapTask)
                    return object;
                var message = new $root.OracleJob.TwapTask();
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                if (object.period != null)
                    message.period = object.period | 0;
                if (object.weightByPropagationTime != null)
                    message.weightByPropagationTime = Boolean(object.weightByPropagationTime);
                if (object.minSamples != null)
                    message.minSamples = object.minSamples >>> 0;
                if (object.endingUnixTimestamp != null)
                    message.endingUnixTimestamp = object.endingUnixTimestamp | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a TwapTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.TwapTask
             * @static
             * @param {OracleJob.TwapTask} message TwapTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TwapTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.aggregatorPubkey = "";
                    object.period = 0;
                    object.weightByPropagationTime = false;
                    object.minSamples = 0;
                    object.endingUnixTimestamp = 0;
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey"))
                    object.aggregatorPubkey = message.aggregatorPubkey;
                if (message.period != null && message.hasOwnProperty("period"))
                    object.period = message.period;
                if (message.weightByPropagationTime != null && message.hasOwnProperty("weightByPropagationTime"))
                    object.weightByPropagationTime = message.weightByPropagationTime;
                if (message.minSamples != null && message.hasOwnProperty("minSamples"))
                    object.minSamples = message.minSamples;
                if (message.endingUnixTimestamp != null && message.hasOwnProperty("endingUnixTimestamp"))
                    object.endingUnixTimestamp = message.endingUnixTimestamp;
                return object;
            };
    
            /**
             * Converts this TwapTask to JSON.
             * @function toJSON
             * @memberof OracleJob.TwapTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TwapTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TwapTask;
        })();
    
        OracleJob.SerumSwapTask = (function() {
    
            /**
             * Properties of a SerumSwapTask.
             * @memberof OracleJob
             * @interface ISerumSwapTask
             * @property {string|null} [serumPoolAddress] SerumSwapTask serumPoolAddress
             */
    
            /**
             * Constructs a new SerumSwapTask.
             * @memberof OracleJob
             * @classdesc Represents a SerumSwapTask.
             * @implements ISerumSwapTask
             * @constructor
             * @param {OracleJob.ISerumSwapTask=} [properties] Properties to set
             */
            function SerumSwapTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SerumSwapTask serumPoolAddress.
             * @member {string} serumPoolAddress
             * @memberof OracleJob.SerumSwapTask
             * @instance
             */
            SerumSwapTask.prototype.serumPoolAddress = "";
    
            /**
             * Creates a new SerumSwapTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.ISerumSwapTask=} [properties] Properties to set
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask instance
             */
            SerumSwapTask.create = function create(properties) {
                return new SerumSwapTask(properties);
            };
    
            /**
             * Encodes the specified SerumSwapTask message. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.ISerumSwapTask} message SerumSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SerumSwapTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.serumPoolAddress != null && Object.hasOwnProperty.call(message, "serumPoolAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.serumPoolAddress);
                return writer;
            };
    
            /**
             * Encodes the specified SerumSwapTask message, length delimited. Does not implicitly {@link OracleJob.SerumSwapTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.ISerumSwapTask} message SerumSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SerumSwapTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SerumSwapTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SerumSwapTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SerumSwapTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.serumPoolAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SerumSwapTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SerumSwapTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SerumSwapTask message.
             * @function verify
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SerumSwapTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.serumPoolAddress != null && message.hasOwnProperty("serumPoolAddress"))
                    if (!$util.isString(message.serumPoolAddress))
                        return "serumPoolAddress: string expected";
                return null;
            };
    
            /**
             * Creates a SerumSwapTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SerumSwapTask} SerumSwapTask
             */
            SerumSwapTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SerumSwapTask)
                    return object;
                var message = new $root.OracleJob.SerumSwapTask();
                if (object.serumPoolAddress != null)
                    message.serumPoolAddress = String(object.serumPoolAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a SerumSwapTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SerumSwapTask
             * @static
             * @param {OracleJob.SerumSwapTask} message SerumSwapTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SerumSwapTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.serumPoolAddress = "";
                if (message.serumPoolAddress != null && message.hasOwnProperty("serumPoolAddress"))
                    object.serumPoolAddress = message.serumPoolAddress;
                return object;
            };
    
            /**
             * Converts this SerumSwapTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SerumSwapTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SerumSwapTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SerumSwapTask;
        })();
    
        OracleJob.PowTask = (function() {
    
            /**
             * Properties of a PowTask.
             * @memberof OracleJob
             * @interface IPowTask
             * @property {number|null} [scalar] PowTask scalar
             * @property {string|null} [aggregatorPubkey] PowTask aggregatorPubkey
             */
    
            /**
             * Constructs a new PowTask.
             * @memberof OracleJob
             * @classdesc Represents a PowTask.
             * @implements IPowTask
             * @constructor
             * @param {OracleJob.IPowTask=} [properties] Properties to set
             */
            function PowTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * PowTask scalar.
             * @member {number|null|undefined} scalar
             * @memberof OracleJob.PowTask
             * @instance
             */
            PowTask.prototype.scalar = null;
    
            /**
             * PowTask aggregatorPubkey.
             * @member {string|null|undefined} aggregatorPubkey
             * @memberof OracleJob.PowTask
             * @instance
             */
            PowTask.prototype.aggregatorPubkey = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * PowTask Exponent.
             * @member {"scalar"|"aggregatorPubkey"|undefined} Exponent
             * @memberof OracleJob.PowTask
             * @instance
             */
            Object.defineProperty(PowTask.prototype, "Exponent", {
                get: $util.oneOfGetter($oneOfFields = ["scalar", "aggregatorPubkey"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new PowTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.IPowTask=} [properties] Properties to set
             * @returns {OracleJob.PowTask} PowTask instance
             */
            PowTask.create = function create(properties) {
                return new PowTask(properties);
            };
    
            /**
             * Encodes the specified PowTask message. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.IPowTask} message PowTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PowTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.scalar);
                if (message.aggregatorPubkey != null && Object.hasOwnProperty.call(message, "aggregatorPubkey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.aggregatorPubkey);
                return writer;
            };
    
            /**
             * Encodes the specified PowTask message, length delimited. Does not implicitly {@link OracleJob.PowTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.IPowTask} message PowTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PowTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a PowTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.PowTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.PowTask} PowTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PowTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.PowTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.scalar = reader.double();
                        break;
                    case 2:
                        message.aggregatorPubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a PowTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.PowTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.PowTask} PowTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PowTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a PowTask message.
             * @function verify
             * @memberof OracleJob.PowTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PowTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    properties.Exponent = 1;
                    if (typeof message.scalar !== "number")
                        return "scalar: number expected";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    if (properties.Exponent === 1)
                        return "Exponent: multiple values";
                    properties.Exponent = 1;
                    if (!$util.isString(message.aggregatorPubkey))
                        return "aggregatorPubkey: string expected";
                }
                return null;
            };
    
            /**
             * Creates a PowTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.PowTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.PowTask} PowTask
             */
            PowTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.PowTask)
                    return object;
                var message = new $root.OracleJob.PowTask();
                if (object.scalar != null)
                    message.scalar = Number(object.scalar);
                if (object.aggregatorPubkey != null)
                    message.aggregatorPubkey = String(object.aggregatorPubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a PowTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.PowTask
             * @static
             * @param {OracleJob.PowTask} message PowTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PowTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.scalar != null && message.hasOwnProperty("scalar")) {
                    object.scalar = options.json && !isFinite(message.scalar) ? String(message.scalar) : message.scalar;
                    if (options.oneofs)
                        object.Exponent = "scalar";
                }
                if (message.aggregatorPubkey != null && message.hasOwnProperty("aggregatorPubkey")) {
                    object.aggregatorPubkey = message.aggregatorPubkey;
                    if (options.oneofs)
                        object.Exponent = "aggregatorPubkey";
                }
                return object;
            };
    
            /**
             * Converts this PowTask to JSON.
             * @function toJSON
             * @memberof OracleJob.PowTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PowTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return PowTask;
        })();
    
        OracleJob.LendingRateTask = (function() {
    
            /**
             * Properties of a LendingRateTask.
             * @memberof OracleJob
             * @interface ILendingRateTask
             * @property {string|null} [protocol] LendingRateTask protocol
             * @property {string|null} [assetMint] LendingRateTask assetMint
             * @property {OracleJob.LendingRateTask.Field|null} [field] LendingRateTask field
             */
    
            /**
             * Constructs a new LendingRateTask.
             * @memberof OracleJob
             * @classdesc Represents a LendingRateTask.
             * @implements ILendingRateTask
             * @constructor
             * @param {OracleJob.ILendingRateTask=} [properties] Properties to set
             */
            function LendingRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LendingRateTask protocol.
             * @member {string} protocol
             * @memberof OracleJob.LendingRateTask
             * @instance
             */
            LendingRateTask.prototype.protocol = "";
    
            /**
             * LendingRateTask assetMint.
             * @member {string} assetMint
             * @memberof OracleJob.LendingRateTask
             * @instance
             */
            LendingRateTask.prototype.assetMint = "";
    
            /**
             * LendingRateTask field.
             * @member {OracleJob.LendingRateTask.Field} field
             * @memberof OracleJob.LendingRateTask
             * @instance
             */
            LendingRateTask.prototype.field = 0;
    
            /**
             * Creates a new LendingRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.ILendingRateTask=} [properties] Properties to set
             * @returns {OracleJob.LendingRateTask} LendingRateTask instance
             */
            LendingRateTask.create = function create(properties) {
                return new LendingRateTask(properties);
            };
    
            /**
             * Encodes the specified LendingRateTask message. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.ILendingRateTask} message LendingRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LendingRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.protocol != null && Object.hasOwnProperty.call(message, "protocol"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.protocol);
                if (message.assetMint != null && Object.hasOwnProperty.call(message, "assetMint"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.assetMint);
                if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.field);
                return writer;
            };
    
            /**
             * Encodes the specified LendingRateTask message, length delimited. Does not implicitly {@link OracleJob.LendingRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.ILendingRateTask} message LendingRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LendingRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LendingRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.LendingRateTask} LendingRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LendingRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.LendingRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.protocol = reader.string();
                        break;
                    case 2:
                        message.assetMint = reader.string();
                        break;
                    case 3:
                        message.field = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LendingRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.LendingRateTask} LendingRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LendingRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LendingRateTask message.
             * @function verify
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LendingRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.protocol != null && message.hasOwnProperty("protocol"))
                    if (!$util.isString(message.protocol))
                        return "protocol: string expected";
                if (message.assetMint != null && message.hasOwnProperty("assetMint"))
                    if (!$util.isString(message.assetMint))
                        return "assetMint: string expected";
                if (message.field != null && message.hasOwnProperty("field"))
                    switch (message.field) {
                    default:
                        return "field: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a LendingRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.LendingRateTask} LendingRateTask
             */
            LendingRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.LendingRateTask)
                    return object;
                var message = new $root.OracleJob.LendingRateTask();
                if (object.protocol != null)
                    message.protocol = String(object.protocol);
                if (object.assetMint != null)
                    message.assetMint = String(object.assetMint);
                switch (object.field) {
                case "FIELD_DEPOSIT_RATE":
                case 0:
                    message.field = 0;
                    break;
                case "FIELD_BORROW_RATE":
                case 1:
                    message.field = 1;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a LendingRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.LendingRateTask
             * @static
             * @param {OracleJob.LendingRateTask} message LendingRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LendingRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.protocol = "";
                    object.assetMint = "";
                    object.field = options.enums === String ? "FIELD_DEPOSIT_RATE" : 0;
                }
                if (message.protocol != null && message.hasOwnProperty("protocol"))
                    object.protocol = message.protocol;
                if (message.assetMint != null && message.hasOwnProperty("assetMint"))
                    object.assetMint = message.assetMint;
                if (message.field != null && message.hasOwnProperty("field"))
                    object.field = options.enums === String ? $root.OracleJob.LendingRateTask.Field[message.field] : message.field;
                return object;
            };
    
            /**
             * Converts this LendingRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.LendingRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LendingRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Field enum.
             * @name OracleJob.LendingRateTask.Field
             * @enum {number}
             * @property {number} FIELD_DEPOSIT_RATE=0 FIELD_DEPOSIT_RATE value
             * @property {number} FIELD_BORROW_RATE=1 FIELD_BORROW_RATE value
             */
            LendingRateTask.Field = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "FIELD_DEPOSIT_RATE"] = 0;
                values[valuesById[1] = "FIELD_BORROW_RATE"] = 1;
                return values;
            })();
    
            return LendingRateTask;
        })();
    
        OracleJob.MangoPerpMarketTask = (function() {
    
            /**
             * Properties of a MangoPerpMarketTask.
             * @memberof OracleJob
             * @interface IMangoPerpMarketTask
             * @property {string|null} [perpMarketAddress] MangoPerpMarketTask perpMarketAddress
             */
    
            /**
             * Constructs a new MangoPerpMarketTask.
             * @memberof OracleJob
             * @classdesc Represents a MangoPerpMarketTask.
             * @implements IMangoPerpMarketTask
             * @constructor
             * @param {OracleJob.IMangoPerpMarketTask=} [properties] Properties to set
             */
            function MangoPerpMarketTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MangoPerpMarketTask perpMarketAddress.
             * @member {string} perpMarketAddress
             * @memberof OracleJob.MangoPerpMarketTask
             * @instance
             */
            MangoPerpMarketTask.prototype.perpMarketAddress = "";
    
            /**
             * Creates a new MangoPerpMarketTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.IMangoPerpMarketTask=} [properties] Properties to set
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask instance
             */
            MangoPerpMarketTask.create = function create(properties) {
                return new MangoPerpMarketTask(properties);
            };
    
            /**
             * Encodes the specified MangoPerpMarketTask message. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.IMangoPerpMarketTask} message MangoPerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MangoPerpMarketTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.perpMarketAddress != null && Object.hasOwnProperty.call(message, "perpMarketAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.perpMarketAddress);
                return writer;
            };
    
            /**
             * Encodes the specified MangoPerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.MangoPerpMarketTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.IMangoPerpMarketTask} message MangoPerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MangoPerpMarketTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MangoPerpMarketTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MangoPerpMarketTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.MangoPerpMarketTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.perpMarketAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MangoPerpMarketTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MangoPerpMarketTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MangoPerpMarketTask message.
             * @function verify
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MangoPerpMarketTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.perpMarketAddress != null && message.hasOwnProperty("perpMarketAddress"))
                    if (!$util.isString(message.perpMarketAddress))
                        return "perpMarketAddress: string expected";
                return null;
            };
    
            /**
             * Creates a MangoPerpMarketTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.MangoPerpMarketTask} MangoPerpMarketTask
             */
            MangoPerpMarketTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.MangoPerpMarketTask)
                    return object;
                var message = new $root.OracleJob.MangoPerpMarketTask();
                if (object.perpMarketAddress != null)
                    message.perpMarketAddress = String(object.perpMarketAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a MangoPerpMarketTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.MangoPerpMarketTask
             * @static
             * @param {OracleJob.MangoPerpMarketTask} message MangoPerpMarketTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MangoPerpMarketTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.perpMarketAddress = "";
                if (message.perpMarketAddress != null && message.hasOwnProperty("perpMarketAddress"))
                    object.perpMarketAddress = message.perpMarketAddress;
                return object;
            };
    
            /**
             * Converts this MangoPerpMarketTask to JSON.
             * @function toJSON
             * @memberof OracleJob.MangoPerpMarketTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MangoPerpMarketTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MangoPerpMarketTask;
        })();
    
        OracleJob.JupiterSwapTask = (function() {
    
            /**
             * Properties of a JupiterSwapTask.
             * @memberof OracleJob
             * @interface IJupiterSwapTask
             * @property {string|null} [inTokenAddress] JupiterSwapTask inTokenAddress
             * @property {string|null} [outTokenAddress] JupiterSwapTask outTokenAddress
             * @property {number|null} [baseAmount] JupiterSwapTask baseAmount
             */
    
            /**
             * Constructs a new JupiterSwapTask.
             * @memberof OracleJob
             * @classdesc Represents a JupiterSwapTask.
             * @implements IJupiterSwapTask
             * @constructor
             * @param {OracleJob.IJupiterSwapTask=} [properties] Properties to set
             */
            function JupiterSwapTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * JupiterSwapTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             */
            JupiterSwapTask.prototype.inTokenAddress = "";
    
            /**
             * JupiterSwapTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             */
            JupiterSwapTask.prototype.outTokenAddress = "";
    
            /**
             * JupiterSwapTask baseAmount.
             * @member {number} baseAmount
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             */
            JupiterSwapTask.prototype.baseAmount = 0;
    
            /**
             * Creates a new JupiterSwapTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.IJupiterSwapTask=} [properties] Properties to set
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask instance
             */
            JupiterSwapTask.create = function create(properties) {
                return new JupiterSwapTask(properties);
            };
    
            /**
             * Encodes the specified JupiterSwapTask message. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.IJupiterSwapTask} message JupiterSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JupiterSwapTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.baseAmount != null && Object.hasOwnProperty.call(message, "baseAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.baseAmount);
                return writer;
            };
    
            /**
             * Encodes the specified JupiterSwapTask message, length delimited. Does not implicitly {@link OracleJob.JupiterSwapTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.IJupiterSwapTask} message JupiterSwapTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JupiterSwapTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a JupiterSwapTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JupiterSwapTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.JupiterSwapTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.baseAmount = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a JupiterSwapTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JupiterSwapTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a JupiterSwapTask message.
             * @function verify
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JupiterSwapTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.baseAmount != null && message.hasOwnProperty("baseAmount"))
                    if (typeof message.baseAmount !== "number")
                        return "baseAmount: number expected";
                return null;
            };
    
            /**
             * Creates a JupiterSwapTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.JupiterSwapTask} JupiterSwapTask
             */
            JupiterSwapTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.JupiterSwapTask)
                    return object;
                var message = new $root.OracleJob.JupiterSwapTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.baseAmount != null)
                    message.baseAmount = Number(object.baseAmount);
                return message;
            };
    
            /**
             * Creates a plain object from a JupiterSwapTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.JupiterSwapTask
             * @static
             * @param {OracleJob.JupiterSwapTask} message JupiterSwapTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JupiterSwapTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.baseAmount = 0;
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.baseAmount != null && message.hasOwnProperty("baseAmount"))
                    object.baseAmount = options.json && !isFinite(message.baseAmount) ? String(message.baseAmount) : message.baseAmount;
                return object;
            };
    
            /**
             * Converts this JupiterSwapTask to JSON.
             * @function toJSON
             * @memberof OracleJob.JupiterSwapTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JupiterSwapTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return JupiterSwapTask;
        })();
    
        OracleJob.PerpMarketTask = (function() {
    
            /**
             * Properties of a PerpMarketTask.
             * @memberof OracleJob
             * @interface IPerpMarketTask
             * @property {string|null} [mangoMarketAddress] PerpMarketTask mangoMarketAddress
             * @property {string|null} [driftMarketAddress] PerpMarketTask driftMarketAddress
             * @property {string|null} [zetaMarketAddress] PerpMarketTask zetaMarketAddress
             * @property {string|null} [zoMarketAddress] PerpMarketTask zoMarketAddress
             */
    
            /**
             * Constructs a new PerpMarketTask.
             * @memberof OracleJob
             * @classdesc Represents a PerpMarketTask.
             * @implements IPerpMarketTask
             * @constructor
             * @param {OracleJob.IPerpMarketTask=} [properties] Properties to set
             */
            function PerpMarketTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * PerpMarketTask mangoMarketAddress.
             * @member {string|null|undefined} mangoMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.mangoMarketAddress = null;
    
            /**
             * PerpMarketTask driftMarketAddress.
             * @member {string|null|undefined} driftMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.driftMarketAddress = null;
    
            /**
             * PerpMarketTask zetaMarketAddress.
             * @member {string|null|undefined} zetaMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.zetaMarketAddress = null;
    
            /**
             * PerpMarketTask zoMarketAddress.
             * @member {string|null|undefined} zoMarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            PerpMarketTask.prototype.zoMarketAddress = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * PerpMarketTask MarketAddress.
             * @member {"mangoMarketAddress"|"driftMarketAddress"|"zetaMarketAddress"|"zoMarketAddress"|undefined} MarketAddress
             * @memberof OracleJob.PerpMarketTask
             * @instance
             */
            Object.defineProperty(PerpMarketTask.prototype, "MarketAddress", {
                get: $util.oneOfGetter($oneOfFields = ["mangoMarketAddress", "driftMarketAddress", "zetaMarketAddress", "zoMarketAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new PerpMarketTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.IPerpMarketTask=} [properties] Properties to set
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask instance
             */
            PerpMarketTask.create = function create(properties) {
                return new PerpMarketTask(properties);
            };
    
            /**
             * Encodes the specified PerpMarketTask message. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.IPerpMarketTask} message PerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PerpMarketTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.mangoMarketAddress != null && Object.hasOwnProperty.call(message, "mangoMarketAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.mangoMarketAddress);
                if (message.driftMarketAddress != null && Object.hasOwnProperty.call(message, "driftMarketAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.driftMarketAddress);
                if (message.zetaMarketAddress != null && Object.hasOwnProperty.call(message, "zetaMarketAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.zetaMarketAddress);
                if (message.zoMarketAddress != null && Object.hasOwnProperty.call(message, "zoMarketAddress"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.zoMarketAddress);
                return writer;
            };
    
            /**
             * Encodes the specified PerpMarketTask message, length delimited. Does not implicitly {@link OracleJob.PerpMarketTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.IPerpMarketTask} message PerpMarketTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PerpMarketTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a PerpMarketTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PerpMarketTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.PerpMarketTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.mangoMarketAddress = reader.string();
                        break;
                    case 2:
                        message.driftMarketAddress = reader.string();
                        break;
                    case 3:
                        message.zetaMarketAddress = reader.string();
                        break;
                    case 4:
                        message.zoMarketAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a PerpMarketTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PerpMarketTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a PerpMarketTask message.
             * @function verify
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PerpMarketTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.mangoMarketAddress != null && message.hasOwnProperty("mangoMarketAddress")) {
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.mangoMarketAddress))
                        return "mangoMarketAddress: string expected";
                }
                if (message.driftMarketAddress != null && message.hasOwnProperty("driftMarketAddress")) {
                    if (properties.MarketAddress === 1)
                        return "MarketAddress: multiple values";
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.driftMarketAddress))
                        return "driftMarketAddress: string expected";
                }
                if (message.zetaMarketAddress != null && message.hasOwnProperty("zetaMarketAddress")) {
                    if (properties.MarketAddress === 1)
                        return "MarketAddress: multiple values";
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.zetaMarketAddress))
                        return "zetaMarketAddress: string expected";
                }
                if (message.zoMarketAddress != null && message.hasOwnProperty("zoMarketAddress")) {
                    if (properties.MarketAddress === 1)
                        return "MarketAddress: multiple values";
                    properties.MarketAddress = 1;
                    if (!$util.isString(message.zoMarketAddress))
                        return "zoMarketAddress: string expected";
                }
                return null;
            };
    
            /**
             * Creates a PerpMarketTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.PerpMarketTask} PerpMarketTask
             */
            PerpMarketTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.PerpMarketTask)
                    return object;
                var message = new $root.OracleJob.PerpMarketTask();
                if (object.mangoMarketAddress != null)
                    message.mangoMarketAddress = String(object.mangoMarketAddress);
                if (object.driftMarketAddress != null)
                    message.driftMarketAddress = String(object.driftMarketAddress);
                if (object.zetaMarketAddress != null)
                    message.zetaMarketAddress = String(object.zetaMarketAddress);
                if (object.zoMarketAddress != null)
                    message.zoMarketAddress = String(object.zoMarketAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a PerpMarketTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.PerpMarketTask
             * @static
             * @param {OracleJob.PerpMarketTask} message PerpMarketTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PerpMarketTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.mangoMarketAddress != null && message.hasOwnProperty("mangoMarketAddress")) {
                    object.mangoMarketAddress = message.mangoMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "mangoMarketAddress";
                }
                if (message.driftMarketAddress != null && message.hasOwnProperty("driftMarketAddress")) {
                    object.driftMarketAddress = message.driftMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "driftMarketAddress";
                }
                if (message.zetaMarketAddress != null && message.hasOwnProperty("zetaMarketAddress")) {
                    object.zetaMarketAddress = message.zetaMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "zetaMarketAddress";
                }
                if (message.zoMarketAddress != null && message.hasOwnProperty("zoMarketAddress")) {
                    object.zoMarketAddress = message.zoMarketAddress;
                    if (options.oneofs)
                        object.MarketAddress = "zoMarketAddress";
                }
                return object;
            };
    
            /**
             * Converts this PerpMarketTask to JSON.
             * @function toJSON
             * @memberof OracleJob.PerpMarketTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PerpMarketTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return PerpMarketTask;
        })();
    
        OracleJob.OracleTask = (function() {
    
            /**
             * Properties of an OracleTask.
             * @memberof OracleJob
             * @interface IOracleTask
             * @property {string|null} [switchboardAddress] OracleTask switchboardAddress
             * @property {string|null} [pythAddress] OracleTask pythAddress
             * @property {string|null} [chainlinkAddress] OracleTask chainlinkAddress
             * @property {number|null} [pythAllowedConfidenceInterval] OracleTask pythAllowedConfidenceInterval
             */
    
            /**
             * Constructs a new OracleTask.
             * @memberof OracleJob
             * @classdesc Represents an OracleTask.
             * @implements IOracleTask
             * @constructor
             * @param {OracleJob.IOracleTask=} [properties] Properties to set
             */
            function OracleTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * OracleTask switchboardAddress.
             * @member {string|null|undefined} switchboardAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.switchboardAddress = null;
    
            /**
             * OracleTask pythAddress.
             * @member {string|null|undefined} pythAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.pythAddress = null;
    
            /**
             * OracleTask chainlinkAddress.
             * @member {string|null|undefined} chainlinkAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.chainlinkAddress = null;
    
            /**
             * OracleTask pythAllowedConfidenceInterval.
             * @member {number} pythAllowedConfidenceInterval
             * @memberof OracleJob.OracleTask
             * @instance
             */
            OracleTask.prototype.pythAllowedConfidenceInterval = 0;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * OracleTask AggregatorAddress.
             * @member {"switchboardAddress"|"pythAddress"|"chainlinkAddress"|undefined} AggregatorAddress
             * @memberof OracleJob.OracleTask
             * @instance
             */
            Object.defineProperty(OracleTask.prototype, "AggregatorAddress", {
                get: $util.oneOfGetter($oneOfFields = ["switchboardAddress", "pythAddress", "chainlinkAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new OracleTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.IOracleTask=} [properties] Properties to set
             * @returns {OracleJob.OracleTask} OracleTask instance
             */
            OracleTask.create = function create(properties) {
                return new OracleTask(properties);
            };
    
            /**
             * Encodes the specified OracleTask message. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.IOracleTask} message OracleTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OracleTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.switchboardAddress != null && Object.hasOwnProperty.call(message, "switchboardAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.switchboardAddress);
                if (message.pythAddress != null && Object.hasOwnProperty.call(message, "pythAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.pythAddress);
                if (message.chainlinkAddress != null && Object.hasOwnProperty.call(message, "chainlinkAddress"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.chainlinkAddress);
                if (message.pythAllowedConfidenceInterval != null && Object.hasOwnProperty.call(message, "pythAllowedConfidenceInterval"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.pythAllowedConfidenceInterval);
                return writer;
            };
    
            /**
             * Encodes the specified OracleTask message, length delimited. Does not implicitly {@link OracleJob.OracleTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.IOracleTask} message OracleTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OracleTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an OracleTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.OracleTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.OracleTask} OracleTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OracleTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.OracleTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.switchboardAddress = reader.string();
                        break;
                    case 2:
                        message.pythAddress = reader.string();
                        break;
                    case 3:
                        message.chainlinkAddress = reader.string();
                        break;
                    case 4:
                        message.pythAllowedConfidenceInterval = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an OracleTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.OracleTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.OracleTask} OracleTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OracleTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an OracleTask message.
             * @function verify
             * @memberof OracleJob.OracleTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OracleTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.switchboardAddress != null && message.hasOwnProperty("switchboardAddress")) {
                    properties.AggregatorAddress = 1;
                    if (!$util.isString(message.switchboardAddress))
                        return "switchboardAddress: string expected";
                }
                if (message.pythAddress != null && message.hasOwnProperty("pythAddress")) {
                    if (properties.AggregatorAddress === 1)
                        return "AggregatorAddress: multiple values";
                    properties.AggregatorAddress = 1;
                    if (!$util.isString(message.pythAddress))
                        return "pythAddress: string expected";
                }
                if (message.chainlinkAddress != null && message.hasOwnProperty("chainlinkAddress")) {
                    if (properties.AggregatorAddress === 1)
                        return "AggregatorAddress: multiple values";
                    properties.AggregatorAddress = 1;
                    if (!$util.isString(message.chainlinkAddress))
                        return "chainlinkAddress: string expected";
                }
                if (message.pythAllowedConfidenceInterval != null && message.hasOwnProperty("pythAllowedConfidenceInterval"))
                    if (typeof message.pythAllowedConfidenceInterval !== "number")
                        return "pythAllowedConfidenceInterval: number expected";
                return null;
            };
    
            /**
             * Creates an OracleTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.OracleTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.OracleTask} OracleTask
             */
            OracleTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.OracleTask)
                    return object;
                var message = new $root.OracleJob.OracleTask();
                if (object.switchboardAddress != null)
                    message.switchboardAddress = String(object.switchboardAddress);
                if (object.pythAddress != null)
                    message.pythAddress = String(object.pythAddress);
                if (object.chainlinkAddress != null)
                    message.chainlinkAddress = String(object.chainlinkAddress);
                if (object.pythAllowedConfidenceInterval != null)
                    message.pythAllowedConfidenceInterval = Number(object.pythAllowedConfidenceInterval);
                return message;
            };
    
            /**
             * Creates a plain object from an OracleTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.OracleTask
             * @static
             * @param {OracleJob.OracleTask} message OracleTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OracleTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pythAllowedConfidenceInterval = 0;
                if (message.switchboardAddress != null && message.hasOwnProperty("switchboardAddress")) {
                    object.switchboardAddress = message.switchboardAddress;
                    if (options.oneofs)
                        object.AggregatorAddress = "switchboardAddress";
                }
                if (message.pythAddress != null && message.hasOwnProperty("pythAddress")) {
                    object.pythAddress = message.pythAddress;
                    if (options.oneofs)
                        object.AggregatorAddress = "pythAddress";
                }
                if (message.chainlinkAddress != null && message.hasOwnProperty("chainlinkAddress")) {
                    object.chainlinkAddress = message.chainlinkAddress;
                    if (options.oneofs)
                        object.AggregatorAddress = "chainlinkAddress";
                }
                if (message.pythAllowedConfidenceInterval != null && message.hasOwnProperty("pythAllowedConfidenceInterval"))
                    object.pythAllowedConfidenceInterval = options.json && !isFinite(message.pythAllowedConfidenceInterval) ? String(message.pythAllowedConfidenceInterval) : message.pythAllowedConfidenceInterval;
                return object;
            };
    
            /**
             * Converts this OracleTask to JSON.
             * @function toJSON
             * @memberof OracleJob.OracleTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OracleTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return OracleTask;
        })();
    
        OracleJob.AnchorFetchTask = (function() {
    
            /**
             * Properties of an AnchorFetchTask.
             * @memberof OracleJob
             * @interface IAnchorFetchTask
             * @property {string|null} [programId] AnchorFetchTask programId
             * @property {string|null} [accountAddress] AnchorFetchTask accountAddress
             */
    
            /**
             * Constructs a new AnchorFetchTask.
             * @memberof OracleJob
             * @classdesc Represents an AnchorFetchTask.
             * @implements IAnchorFetchTask
             * @constructor
             * @param {OracleJob.IAnchorFetchTask=} [properties] Properties to set
             */
            function AnchorFetchTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AnchorFetchTask programId.
             * @member {string} programId
             * @memberof OracleJob.AnchorFetchTask
             * @instance
             */
            AnchorFetchTask.prototype.programId = "";
    
            /**
             * AnchorFetchTask accountAddress.
             * @member {string} accountAddress
             * @memberof OracleJob.AnchorFetchTask
             * @instance
             */
            AnchorFetchTask.prototype.accountAddress = "";
    
            /**
             * Creates a new AnchorFetchTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.IAnchorFetchTask=} [properties] Properties to set
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask instance
             */
            AnchorFetchTask.create = function create(properties) {
                return new AnchorFetchTask(properties);
            };
    
            /**
             * Encodes the specified AnchorFetchTask message. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.IAnchorFetchTask} message AnchorFetchTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AnchorFetchTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.programId != null && Object.hasOwnProperty.call(message, "programId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.programId);
                if (message.accountAddress != null && Object.hasOwnProperty.call(message, "accountAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.accountAddress);
                return writer;
            };
    
            /**
             * Encodes the specified AnchorFetchTask message, length delimited. Does not implicitly {@link OracleJob.AnchorFetchTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.IAnchorFetchTask} message AnchorFetchTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AnchorFetchTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AnchorFetchTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AnchorFetchTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.AnchorFetchTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.programId = reader.string();
                        break;
                    case 2:
                        message.accountAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AnchorFetchTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AnchorFetchTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AnchorFetchTask message.
             * @function verify
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AnchorFetchTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.programId != null && message.hasOwnProperty("programId"))
                    if (!$util.isString(message.programId))
                        return "programId: string expected";
                if (message.accountAddress != null && message.hasOwnProperty("accountAddress"))
                    if (!$util.isString(message.accountAddress))
                        return "accountAddress: string expected";
                return null;
            };
    
            /**
             * Creates an AnchorFetchTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.AnchorFetchTask} AnchorFetchTask
             */
            AnchorFetchTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.AnchorFetchTask)
                    return object;
                var message = new $root.OracleJob.AnchorFetchTask();
                if (object.programId != null)
                    message.programId = String(object.programId);
                if (object.accountAddress != null)
                    message.accountAddress = String(object.accountAddress);
                return message;
            };
    
            /**
             * Creates a plain object from an AnchorFetchTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.AnchorFetchTask
             * @static
             * @param {OracleJob.AnchorFetchTask} message AnchorFetchTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AnchorFetchTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.programId = "";
                    object.accountAddress = "";
                }
                if (message.programId != null && message.hasOwnProperty("programId"))
                    object.programId = message.programId;
                if (message.accountAddress != null && message.hasOwnProperty("accountAddress"))
                    object.accountAddress = message.accountAddress;
                return object;
            };
    
            /**
             * Converts this AnchorFetchTask to JSON.
             * @function toJSON
             * @memberof OracleJob.AnchorFetchTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AnchorFetchTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AnchorFetchTask;
        })();
    
        OracleJob.DefiKingdomsTask = (function() {
    
            /**
             * Properties of a DefiKingdomsTask.
             * @memberof OracleJob
             * @interface IDefiKingdomsTask
             * @property {string|null} [provider] DefiKingdomsTask provider
             * @property {OracleJob.DefiKingdomsTask.IToken|null} [inToken] DefiKingdomsTask inToken
             * @property {OracleJob.DefiKingdomsTask.IToken|null} [outToken] DefiKingdomsTask outToken
             */
    
            /**
             * Constructs a new DefiKingdomsTask.
             * @memberof OracleJob
             * @classdesc Represents a DefiKingdomsTask.
             * @implements IDefiKingdomsTask
             * @constructor
             * @param {OracleJob.IDefiKingdomsTask=} [properties] Properties to set
             */
            function DefiKingdomsTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * DefiKingdomsTask provider.
             * @member {string} provider
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             */
            DefiKingdomsTask.prototype.provider = "";
    
            /**
             * DefiKingdomsTask inToken.
             * @member {OracleJob.DefiKingdomsTask.IToken|null|undefined} inToken
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             */
            DefiKingdomsTask.prototype.inToken = null;
    
            /**
             * DefiKingdomsTask outToken.
             * @member {OracleJob.DefiKingdomsTask.IToken|null|undefined} outToken
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             */
            DefiKingdomsTask.prototype.outToken = null;
    
            /**
             * Creates a new DefiKingdomsTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.IDefiKingdomsTask=} [properties] Properties to set
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask instance
             */
            DefiKingdomsTask.create = function create(properties) {
                return new DefiKingdomsTask(properties);
            };
    
            /**
             * Encodes the specified DefiKingdomsTask message. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.IDefiKingdomsTask} message DefiKingdomsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DefiKingdomsTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.provider);
                if (message.inToken != null && Object.hasOwnProperty.call(message, "inToken"))
                    $root.OracleJob.DefiKingdomsTask.Token.encode(message.inToken, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.outToken != null && Object.hasOwnProperty.call(message, "outToken"))
                    $root.OracleJob.DefiKingdomsTask.Token.encode(message.outToken, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified DefiKingdomsTask message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.IDefiKingdomsTask} message DefiKingdomsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DefiKingdomsTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a DefiKingdomsTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DefiKingdomsTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.DefiKingdomsTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.provider = reader.string();
                        break;
                    case 2:
                        message.inToken = $root.OracleJob.DefiKingdomsTask.Token.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.outToken = $root.OracleJob.DefiKingdomsTask.Token.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a DefiKingdomsTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DefiKingdomsTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a DefiKingdomsTask message.
             * @function verify
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DefiKingdomsTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                if (message.inToken != null && message.hasOwnProperty("inToken")) {
                    var error = $root.OracleJob.DefiKingdomsTask.Token.verify(message.inToken);
                    if (error)
                        return "inToken." + error;
                }
                if (message.outToken != null && message.hasOwnProperty("outToken")) {
                    var error = $root.OracleJob.DefiKingdomsTask.Token.verify(message.outToken);
                    if (error)
                        return "outToken." + error;
                }
                return null;
            };
    
            /**
             * Creates a DefiKingdomsTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.DefiKingdomsTask} DefiKingdomsTask
             */
            DefiKingdomsTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.DefiKingdomsTask)
                    return object;
                var message = new $root.OracleJob.DefiKingdomsTask();
                if (object.provider != null)
                    message.provider = String(object.provider);
                if (object.inToken != null) {
                    if (typeof object.inToken !== "object")
                        throw TypeError(".OracleJob.DefiKingdomsTask.inToken: object expected");
                    message.inToken = $root.OracleJob.DefiKingdomsTask.Token.fromObject(object.inToken);
                }
                if (object.outToken != null) {
                    if (typeof object.outToken !== "object")
                        throw TypeError(".OracleJob.DefiKingdomsTask.outToken: object expected");
                    message.outToken = $root.OracleJob.DefiKingdomsTask.Token.fromObject(object.outToken);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a DefiKingdomsTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.DefiKingdomsTask
             * @static
             * @param {OracleJob.DefiKingdomsTask} message DefiKingdomsTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DefiKingdomsTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.provider = "";
                    object.inToken = null;
                    object.outToken = null;
                }
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                if (message.inToken != null && message.hasOwnProperty("inToken"))
                    object.inToken = $root.OracleJob.DefiKingdomsTask.Token.toObject(message.inToken, options);
                if (message.outToken != null && message.hasOwnProperty("outToken"))
                    object.outToken = $root.OracleJob.DefiKingdomsTask.Token.toObject(message.outToken, options);
                return object;
            };
    
            /**
             * Converts this DefiKingdomsTask to JSON.
             * @function toJSON
             * @memberof OracleJob.DefiKingdomsTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DefiKingdomsTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            DefiKingdomsTask.Token = (function() {
    
                /**
                 * Properties of a Token.
                 * @memberof OracleJob.DefiKingdomsTask
                 * @interface IToken
                 * @property {string|null} [address] Token address
                 * @property {number|null} [decimals] Token decimals
                 */
    
                /**
                 * Constructs a new Token.
                 * @memberof OracleJob.DefiKingdomsTask
                 * @classdesc Represents a Token.
                 * @implements IToken
                 * @constructor
                 * @param {OracleJob.DefiKingdomsTask.IToken=} [properties] Properties to set
                 */
                function Token(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Token address.
                 * @member {string} address
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @instance
                 */
                Token.prototype.address = "";
    
                /**
                 * Token decimals.
                 * @member {number} decimals
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @instance
                 */
                Token.prototype.decimals = 0;
    
                /**
                 * Creates a new Token instance using the specified properties.
                 * @function create
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.IToken=} [properties] Properties to set
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token instance
                 */
                Token.create = function create(properties) {
                    return new Token(properties);
                };
    
                /**
                 * Encodes the specified Token message. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
                 * @function encode
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.IToken} message Token message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Token.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.address);
                    if (message.decimals != null && Object.hasOwnProperty.call(message, "decimals"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.decimals);
                    return writer;
                };
    
                /**
                 * Encodes the specified Token message, length delimited. Does not implicitly {@link OracleJob.DefiKingdomsTask.Token.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.IToken} message Token message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Token.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Token message from the specified reader or buffer.
                 * @function decode
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Token.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.DefiKingdomsTask.Token();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.address = reader.string();
                            break;
                        case 2:
                            message.decimals = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Token message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Token.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Token message.
                 * @function verify
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Token.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.address != null && message.hasOwnProperty("address"))
                        if (!$util.isString(message.address))
                            return "address: string expected";
                    if (message.decimals != null && message.hasOwnProperty("decimals"))
                        if (!$util.isInteger(message.decimals))
                            return "decimals: integer expected";
                    return null;
                };
    
                /**
                 * Creates a Token message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {OracleJob.DefiKingdomsTask.Token} Token
                 */
                Token.fromObject = function fromObject(object) {
                    if (object instanceof $root.OracleJob.DefiKingdomsTask.Token)
                        return object;
                    var message = new $root.OracleJob.DefiKingdomsTask.Token();
                    if (object.address != null)
                        message.address = String(object.address);
                    if (object.decimals != null)
                        message.decimals = object.decimals | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Token message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @static
                 * @param {OracleJob.DefiKingdomsTask.Token} message Token
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Token.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.address = "";
                        object.decimals = 0;
                    }
                    if (message.address != null && message.hasOwnProperty("address"))
                        object.address = message.address;
                    if (message.decimals != null && message.hasOwnProperty("decimals"))
                        object.decimals = message.decimals;
                    return object;
                };
    
                /**
                 * Converts this Token to JSON.
                 * @function toJSON
                 * @memberof OracleJob.DefiKingdomsTask.Token
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Token.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Token;
            })();
    
            return DefiKingdomsTask;
        })();
    
        OracleJob.TpsTask = (function() {
    
            /**
             * Properties of a TpsTask.
             * @memberof OracleJob
             * @interface ITpsTask
             */
    
            /**
             * Constructs a new TpsTask.
             * @memberof OracleJob
             * @classdesc Represents a TpsTask.
             * @implements ITpsTask
             * @constructor
             * @param {OracleJob.ITpsTask=} [properties] Properties to set
             */
            function TpsTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new TpsTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.ITpsTask=} [properties] Properties to set
             * @returns {OracleJob.TpsTask} TpsTask instance
             */
            TpsTask.create = function create(properties) {
                return new TpsTask(properties);
            };
    
            /**
             * Encodes the specified TpsTask message. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.ITpsTask} message TpsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TpsTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified TpsTask message, length delimited. Does not implicitly {@link OracleJob.TpsTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.ITpsTask} message TpsTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TpsTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TpsTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.TpsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.TpsTask} TpsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TpsTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.TpsTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TpsTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.TpsTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.TpsTask} TpsTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TpsTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TpsTask message.
             * @function verify
             * @memberof OracleJob.TpsTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TpsTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a TpsTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.TpsTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.TpsTask} TpsTask
             */
            TpsTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.TpsTask)
                    return object;
                return new $root.OracleJob.TpsTask();
            };
    
            /**
             * Creates a plain object from a TpsTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.TpsTask
             * @static
             * @param {OracleJob.TpsTask} message TpsTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TpsTask.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this TpsTask to JSON.
             * @function toJSON
             * @memberof OracleJob.TpsTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TpsTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TpsTask;
        })();
    
        OracleJob.SplStakePoolTask = (function() {
    
            /**
             * Properties of a SplStakePoolTask.
             * @memberof OracleJob
             * @interface ISplStakePoolTask
             * @property {string|null} [pubkey] SplStakePoolTask pubkey
             */
    
            /**
             * Constructs a new SplStakePoolTask.
             * @memberof OracleJob
             * @classdesc Represents a SplStakePoolTask.
             * @implements ISplStakePoolTask
             * @constructor
             * @param {OracleJob.ISplStakePoolTask=} [properties] Properties to set
             */
            function SplStakePoolTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SplStakePoolTask pubkey.
             * @member {string} pubkey
             * @memberof OracleJob.SplStakePoolTask
             * @instance
             */
            SplStakePoolTask.prototype.pubkey = "";
    
            /**
             * Creates a new SplStakePoolTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.ISplStakePoolTask=} [properties] Properties to set
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask instance
             */
            SplStakePoolTask.create = function create(properties) {
                return new SplStakePoolTask(properties);
            };
    
            /**
             * Encodes the specified SplStakePoolTask message. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.ISplStakePoolTask} message SplStakePoolTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplStakePoolTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pubkey != null && Object.hasOwnProperty.call(message, "pubkey"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pubkey);
                return writer;
            };
    
            /**
             * Encodes the specified SplStakePoolTask message, length delimited. Does not implicitly {@link OracleJob.SplStakePoolTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.ISplStakePoolTask} message SplStakePoolTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplStakePoolTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SplStakePoolTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplStakePoolTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SplStakePoolTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.pubkey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SplStakePoolTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplStakePoolTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SplStakePoolTask message.
             * @function verify
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SplStakePoolTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                    if (!$util.isString(message.pubkey))
                        return "pubkey: string expected";
                return null;
            };
    
            /**
             * Creates a SplStakePoolTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SplStakePoolTask} SplStakePoolTask
             */
            SplStakePoolTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SplStakePoolTask)
                    return object;
                var message = new $root.OracleJob.SplStakePoolTask();
                if (object.pubkey != null)
                    message.pubkey = String(object.pubkey);
                return message;
            };
    
            /**
             * Creates a plain object from a SplStakePoolTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SplStakePoolTask
             * @static
             * @param {OracleJob.SplStakePoolTask} message SplStakePoolTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SplStakePoolTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pubkey = "";
                if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                    object.pubkey = message.pubkey;
                return object;
            };
    
            /**
             * Converts this SplStakePoolTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SplStakePoolTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SplStakePoolTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SplStakePoolTask;
        })();
    
        OracleJob.SplTokenParseTask = (function() {
    
            /**
             * Properties of a SplTokenParseTask.
             * @memberof OracleJob
             * @interface ISplTokenParseTask
             * @property {string|null} [tokenAccountAddress] SplTokenParseTask tokenAccountAddress
             * @property {string|null} [mintAddress] SplTokenParseTask mintAddress
             */
    
            /**
             * Constructs a new SplTokenParseTask.
             * @memberof OracleJob
             * @classdesc Represents a SplTokenParseTask.
             * @implements ISplTokenParseTask
             * @constructor
             * @param {OracleJob.ISplTokenParseTask=} [properties] Properties to set
             */
            function SplTokenParseTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SplTokenParseTask tokenAccountAddress.
             * @member {string|null|undefined} tokenAccountAddress
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             */
            SplTokenParseTask.prototype.tokenAccountAddress = null;
    
            /**
             * SplTokenParseTask mintAddress.
             * @member {string|null|undefined} mintAddress
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             */
            SplTokenParseTask.prototype.mintAddress = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * SplTokenParseTask AccountAddress.
             * @member {"tokenAccountAddress"|"mintAddress"|undefined} AccountAddress
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             */
            Object.defineProperty(SplTokenParseTask.prototype, "AccountAddress", {
                get: $util.oneOfGetter($oneOfFields = ["tokenAccountAddress", "mintAddress"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new SplTokenParseTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.ISplTokenParseTask=} [properties] Properties to set
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask instance
             */
            SplTokenParseTask.create = function create(properties) {
                return new SplTokenParseTask(properties);
            };
    
            /**
             * Encodes the specified SplTokenParseTask message. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.ISplTokenParseTask} message SplTokenParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplTokenParseTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.tokenAccountAddress != null && Object.hasOwnProperty.call(message, "tokenAccountAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.tokenAccountAddress);
                if (message.mintAddress != null && Object.hasOwnProperty.call(message, "mintAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.mintAddress);
                return writer;
            };
    
            /**
             * Encodes the specified SplTokenParseTask message, length delimited. Does not implicitly {@link OracleJob.SplTokenParseTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.ISplTokenParseTask} message SplTokenParseTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SplTokenParseTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SplTokenParseTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplTokenParseTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SplTokenParseTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.tokenAccountAddress = reader.string();
                        break;
                    case 2:
                        message.mintAddress = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SplTokenParseTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SplTokenParseTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SplTokenParseTask message.
             * @function verify
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SplTokenParseTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.tokenAccountAddress != null && message.hasOwnProperty("tokenAccountAddress")) {
                    properties.AccountAddress = 1;
                    if (!$util.isString(message.tokenAccountAddress))
                        return "tokenAccountAddress: string expected";
                }
                if (message.mintAddress != null && message.hasOwnProperty("mintAddress")) {
                    if (properties.AccountAddress === 1)
                        return "AccountAddress: multiple values";
                    properties.AccountAddress = 1;
                    if (!$util.isString(message.mintAddress))
                        return "mintAddress: string expected";
                }
                return null;
            };
    
            /**
             * Creates a SplTokenParseTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SplTokenParseTask} SplTokenParseTask
             */
            SplTokenParseTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SplTokenParseTask)
                    return object;
                var message = new $root.OracleJob.SplTokenParseTask();
                if (object.tokenAccountAddress != null)
                    message.tokenAccountAddress = String(object.tokenAccountAddress);
                if (object.mintAddress != null)
                    message.mintAddress = String(object.mintAddress);
                return message;
            };
    
            /**
             * Creates a plain object from a SplTokenParseTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SplTokenParseTask
             * @static
             * @param {OracleJob.SplTokenParseTask} message SplTokenParseTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SplTokenParseTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.tokenAccountAddress != null && message.hasOwnProperty("tokenAccountAddress")) {
                    object.tokenAccountAddress = message.tokenAccountAddress;
                    if (options.oneofs)
                        object.AccountAddress = "tokenAccountAddress";
                }
                if (message.mintAddress != null && message.hasOwnProperty("mintAddress")) {
                    object.mintAddress = message.mintAddress;
                    if (options.oneofs)
                        object.AccountAddress = "mintAddress";
                }
                return object;
            };
    
            /**
             * Converts this SplTokenParseTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SplTokenParseTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SplTokenParseTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SplTokenParseTask;
        })();
    
        OracleJob.UniswapExchangeRateTask = (function() {
    
            /**
             * Properties of an UniswapExchangeRateTask.
             * @memberof OracleJob
             * @interface IUniswapExchangeRateTask
             * @property {string|null} [inTokenAddress] UniswapExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] UniswapExchangeRateTask outTokenAddress
             * @property {number|null} [inTokenAmount] UniswapExchangeRateTask inTokenAmount
             * @property {number|null} [slippage] UniswapExchangeRateTask slippage
             * @property {string|null} [provider] UniswapExchangeRateTask provider
             */
    
            /**
             * Constructs a new UniswapExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents an UniswapExchangeRateTask.
             * @implements IUniswapExchangeRateTask
             * @constructor
             * @param {OracleJob.IUniswapExchangeRateTask=} [properties] Properties to set
             */
            function UniswapExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * UniswapExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * UniswapExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * UniswapExchangeRateTask inTokenAmount.
             * @member {number} inTokenAmount
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.inTokenAmount = 0;
    
            /**
             * UniswapExchangeRateTask slippage.
             * @member {number} slippage
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.slippage = 0;
    
            /**
             * UniswapExchangeRateTask provider.
             * @member {string} provider
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             */
            UniswapExchangeRateTask.prototype.provider = "";
    
            /**
             * Creates a new UniswapExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.IUniswapExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask instance
             */
            UniswapExchangeRateTask.create = function create(properties) {
                return new UniswapExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified UniswapExchangeRateTask message. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.IUniswapExchangeRateTask} message UniswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UniswapExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.inTokenAmount != null && Object.hasOwnProperty.call(message, "inTokenAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.inTokenAmount);
                if (message.slippage != null && Object.hasOwnProperty.call(message, "slippage"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.slippage);
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.provider);
                return writer;
            };
    
            /**
             * Encodes the specified UniswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.UniswapExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.IUniswapExchangeRateTask} message UniswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UniswapExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an UniswapExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UniswapExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.UniswapExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.inTokenAmount = reader.double();
                        break;
                    case 4:
                        message.slippage = reader.double();
                        break;
                    case 5:
                        message.provider = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an UniswapExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UniswapExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an UniswapExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UniswapExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    if (typeof message.inTokenAmount !== "number")
                        return "inTokenAmount: number expected";
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    if (typeof message.slippage !== "number")
                        return "slippage: number expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                return null;
            };
    
            /**
             * Creates an UniswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.UniswapExchangeRateTask} UniswapExchangeRateTask
             */
            UniswapExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.UniswapExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.UniswapExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.inTokenAmount != null)
                    message.inTokenAmount = Number(object.inTokenAmount);
                if (object.slippage != null)
                    message.slippage = Number(object.slippage);
                if (object.provider != null)
                    message.provider = String(object.provider);
                return message;
            };
    
            /**
             * Creates a plain object from an UniswapExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.UniswapExchangeRateTask
             * @static
             * @param {OracleJob.UniswapExchangeRateTask} message UniswapExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UniswapExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.inTokenAmount = 0;
                    object.slippage = 0;
                    object.provider = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    object.inTokenAmount = options.json && !isFinite(message.inTokenAmount) ? String(message.inTokenAmount) : message.inTokenAmount;
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    object.slippage = options.json && !isFinite(message.slippage) ? String(message.slippage) : message.slippage;
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                return object;
            };
    
            /**
             * Converts this UniswapExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.UniswapExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UniswapExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return UniswapExchangeRateTask;
        })();
    
        OracleJob.SushiswapExchangeRateTask = (function() {
    
            /**
             * Properties of a SushiswapExchangeRateTask.
             * @memberof OracleJob
             * @interface ISushiswapExchangeRateTask
             * @property {string|null} [inTokenAddress] SushiswapExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] SushiswapExchangeRateTask outTokenAddress
             * @property {number|null} [inTokenAmount] SushiswapExchangeRateTask inTokenAmount
             * @property {number|null} [slippage] SushiswapExchangeRateTask slippage
             * @property {string|null} [provider] SushiswapExchangeRateTask provider
             */
    
            /**
             * Constructs a new SushiswapExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents a SushiswapExchangeRateTask.
             * @implements ISushiswapExchangeRateTask
             * @constructor
             * @param {OracleJob.ISushiswapExchangeRateTask=} [properties] Properties to set
             */
            function SushiswapExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SushiswapExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * SushiswapExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * SushiswapExchangeRateTask inTokenAmount.
             * @member {number} inTokenAmount
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.inTokenAmount = 0;
    
            /**
             * SushiswapExchangeRateTask slippage.
             * @member {number} slippage
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.slippage = 0;
    
            /**
             * SushiswapExchangeRateTask provider.
             * @member {string} provider
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             */
            SushiswapExchangeRateTask.prototype.provider = "";
    
            /**
             * Creates a new SushiswapExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.ISushiswapExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask instance
             */
            SushiswapExchangeRateTask.create = function create(properties) {
                return new SushiswapExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified SushiswapExchangeRateTask message. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.ISushiswapExchangeRateTask} message SushiswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SushiswapExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.inTokenAmount != null && Object.hasOwnProperty.call(message, "inTokenAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.inTokenAmount);
                if (message.slippage != null && Object.hasOwnProperty.call(message, "slippage"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.slippage);
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.provider);
                return writer;
            };
    
            /**
             * Encodes the specified SushiswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.SushiswapExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.ISushiswapExchangeRateTask} message SushiswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SushiswapExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SushiswapExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SushiswapExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.inTokenAmount = reader.double();
                        break;
                    case 4:
                        message.slippage = reader.double();
                        break;
                    case 5:
                        message.provider = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SushiswapExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SushiswapExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SushiswapExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SushiswapExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    if (typeof message.inTokenAmount !== "number")
                        return "inTokenAmount: number expected";
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    if (typeof message.slippage !== "number")
                        return "slippage: number expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                return null;
            };
    
            /**
             * Creates a SushiswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SushiswapExchangeRateTask} SushiswapExchangeRateTask
             */
            SushiswapExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SushiswapExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.SushiswapExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.inTokenAmount != null)
                    message.inTokenAmount = Number(object.inTokenAmount);
                if (object.slippage != null)
                    message.slippage = Number(object.slippage);
                if (object.provider != null)
                    message.provider = String(object.provider);
                return message;
            };
    
            /**
             * Creates a plain object from a SushiswapExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @static
             * @param {OracleJob.SushiswapExchangeRateTask} message SushiswapExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SushiswapExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.inTokenAmount = 0;
                    object.slippage = 0;
                    object.provider = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    object.inTokenAmount = options.json && !isFinite(message.inTokenAmount) ? String(message.inTokenAmount) : message.inTokenAmount;
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    object.slippage = options.json && !isFinite(message.slippage) ? String(message.slippage) : message.slippage;
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                return object;
            };
    
            /**
             * Converts this SushiswapExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SushiswapExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SushiswapExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SushiswapExchangeRateTask;
        })();
    
        OracleJob.PancakeswapExchangeRateTask = (function() {
    
            /**
             * Properties of a PancakeswapExchangeRateTask.
             * @memberof OracleJob
             * @interface IPancakeswapExchangeRateTask
             * @property {string|null} [inTokenAddress] PancakeswapExchangeRateTask inTokenAddress
             * @property {string|null} [outTokenAddress] PancakeswapExchangeRateTask outTokenAddress
             * @property {number|null} [inTokenAmount] PancakeswapExchangeRateTask inTokenAmount
             * @property {number|null} [slippage] PancakeswapExchangeRateTask slippage
             * @property {string|null} [provider] PancakeswapExchangeRateTask provider
             */
    
            /**
             * Constructs a new PancakeswapExchangeRateTask.
             * @memberof OracleJob
             * @classdesc Represents a PancakeswapExchangeRateTask.
             * @implements IPancakeswapExchangeRateTask
             * @constructor
             * @param {OracleJob.IPancakeswapExchangeRateTask=} [properties] Properties to set
             */
            function PancakeswapExchangeRateTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * PancakeswapExchangeRateTask inTokenAddress.
             * @member {string} inTokenAddress
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.inTokenAddress = "";
    
            /**
             * PancakeswapExchangeRateTask outTokenAddress.
             * @member {string} outTokenAddress
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.outTokenAddress = "";
    
            /**
             * PancakeswapExchangeRateTask inTokenAmount.
             * @member {number} inTokenAmount
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.inTokenAmount = 0;
    
            /**
             * PancakeswapExchangeRateTask slippage.
             * @member {number} slippage
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.slippage = 0;
    
            /**
             * PancakeswapExchangeRateTask provider.
             * @member {string} provider
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             */
            PancakeswapExchangeRateTask.prototype.provider = "";
    
            /**
             * Creates a new PancakeswapExchangeRateTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.IPancakeswapExchangeRateTask=} [properties] Properties to set
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask instance
             */
            PancakeswapExchangeRateTask.create = function create(properties) {
                return new PancakeswapExchangeRateTask(properties);
            };
    
            /**
             * Encodes the specified PancakeswapExchangeRateTask message. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.IPancakeswapExchangeRateTask} message PancakeswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PancakeswapExchangeRateTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.inTokenAddress != null && Object.hasOwnProperty.call(message, "inTokenAddress"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.inTokenAddress);
                if (message.outTokenAddress != null && Object.hasOwnProperty.call(message, "outTokenAddress"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.outTokenAddress);
                if (message.inTokenAmount != null && Object.hasOwnProperty.call(message, "inTokenAmount"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.inTokenAmount);
                if (message.slippage != null && Object.hasOwnProperty.call(message, "slippage"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.slippage);
                if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.provider);
                return writer;
            };
    
            /**
             * Encodes the specified PancakeswapExchangeRateTask message, length delimited. Does not implicitly {@link OracleJob.PancakeswapExchangeRateTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.IPancakeswapExchangeRateTask} message PancakeswapExchangeRateTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PancakeswapExchangeRateTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PancakeswapExchangeRateTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.PancakeswapExchangeRateTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.inTokenAddress = reader.string();
                        break;
                    case 2:
                        message.outTokenAddress = reader.string();
                        break;
                    case 3:
                        message.inTokenAmount = reader.double();
                        break;
                    case 4:
                        message.slippage = reader.double();
                        break;
                    case 5:
                        message.provider = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a PancakeswapExchangeRateTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PancakeswapExchangeRateTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a PancakeswapExchangeRateTask message.
             * @function verify
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PancakeswapExchangeRateTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    if (!$util.isString(message.inTokenAddress))
                        return "inTokenAddress: string expected";
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    if (!$util.isString(message.outTokenAddress))
                        return "outTokenAddress: string expected";
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    if (typeof message.inTokenAmount !== "number")
                        return "inTokenAmount: number expected";
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    if (typeof message.slippage !== "number")
                        return "slippage: number expected";
                if (message.provider != null && message.hasOwnProperty("provider"))
                    if (!$util.isString(message.provider))
                        return "provider: string expected";
                return null;
            };
    
            /**
             * Creates a PancakeswapExchangeRateTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.PancakeswapExchangeRateTask} PancakeswapExchangeRateTask
             */
            PancakeswapExchangeRateTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.PancakeswapExchangeRateTask)
                    return object;
                var message = new $root.OracleJob.PancakeswapExchangeRateTask();
                if (object.inTokenAddress != null)
                    message.inTokenAddress = String(object.inTokenAddress);
                if (object.outTokenAddress != null)
                    message.outTokenAddress = String(object.outTokenAddress);
                if (object.inTokenAmount != null)
                    message.inTokenAmount = Number(object.inTokenAmount);
                if (object.slippage != null)
                    message.slippage = Number(object.slippage);
                if (object.provider != null)
                    message.provider = String(object.provider);
                return message;
            };
    
            /**
             * Creates a plain object from a PancakeswapExchangeRateTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @static
             * @param {OracleJob.PancakeswapExchangeRateTask} message PancakeswapExchangeRateTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PancakeswapExchangeRateTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.inTokenAddress = "";
                    object.outTokenAddress = "";
                    object.inTokenAmount = 0;
                    object.slippage = 0;
                    object.provider = "";
                }
                if (message.inTokenAddress != null && message.hasOwnProperty("inTokenAddress"))
                    object.inTokenAddress = message.inTokenAddress;
                if (message.outTokenAddress != null && message.hasOwnProperty("outTokenAddress"))
                    object.outTokenAddress = message.outTokenAddress;
                if (message.inTokenAmount != null && message.hasOwnProperty("inTokenAmount"))
                    object.inTokenAmount = options.json && !isFinite(message.inTokenAmount) ? String(message.inTokenAmount) : message.inTokenAmount;
                if (message.slippage != null && message.hasOwnProperty("slippage"))
                    object.slippage = options.json && !isFinite(message.slippage) ? String(message.slippage) : message.slippage;
                if (message.provider != null && message.hasOwnProperty("provider"))
                    object.provider = message.provider;
                return object;
            };
    
            /**
             * Converts this PancakeswapExchangeRateTask to JSON.
             * @function toJSON
             * @memberof OracleJob.PancakeswapExchangeRateTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PancakeswapExchangeRateTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return PancakeswapExchangeRateTask;
        })();
    
        OracleJob.CacheTask = (function() {
    
            /**
             * Properties of a CacheTask.
             * @memberof OracleJob
             * @interface ICacheTask
             * @property {string|null} [name] CacheTask name
             * @property {OracleJob.CacheTask.Method|null} [method] CacheTask method
             */
    
            /**
             * Constructs a new CacheTask.
             * @memberof OracleJob
             * @classdesc Represents a CacheTask.
             * @implements ICacheTask
             * @constructor
             * @param {OracleJob.ICacheTask=} [properties] Properties to set
             */
            function CacheTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CacheTask name.
             * @member {string} name
             * @memberof OracleJob.CacheTask
             * @instance
             */
            CacheTask.prototype.name = "";
    
            /**
             * CacheTask method.
             * @member {OracleJob.CacheTask.Method} method
             * @memberof OracleJob.CacheTask
             * @instance
             */
            CacheTask.prototype.method = 0;
    
            /**
             * Creates a new CacheTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.ICacheTask=} [properties] Properties to set
             * @returns {OracleJob.CacheTask} CacheTask instance
             */
            CacheTask.create = function create(properties) {
                return new CacheTask(properties);
            };
    
            /**
             * Encodes the specified CacheTask message. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.ICacheTask} message CacheTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CacheTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.method != null && Object.hasOwnProperty.call(message, "method"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.method);
                return writer;
            };
    
            /**
             * Encodes the specified CacheTask message, length delimited. Does not implicitly {@link OracleJob.CacheTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.ICacheTask} message CacheTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CacheTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CacheTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.CacheTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.CacheTask} CacheTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CacheTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.CacheTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.method = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CacheTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.CacheTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.CacheTask} CacheTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CacheTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CacheTask message.
             * @function verify
             * @memberof OracleJob.CacheTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CacheTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.method != null && message.hasOwnProperty("method"))
                    switch (message.method) {
                    default:
                        return "method: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a CacheTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.CacheTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.CacheTask} CacheTask
             */
            CacheTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.CacheTask)
                    return object;
                var message = new $root.OracleJob.CacheTask();
                if (object.name != null)
                    message.name = String(object.name);
                switch (object.method) {
                case "METHOD_GET":
                case 0:
                    message.method = 0;
                    break;
                case "METHOD_SET":
                case 1:
                    message.method = 1;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a CacheTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.CacheTask
             * @static
             * @param {OracleJob.CacheTask} message CacheTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CacheTask.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.method = options.enums === String ? "METHOD_GET" : 0;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.method != null && message.hasOwnProperty("method"))
                    object.method = options.enums === String ? $root.OracleJob.CacheTask.Method[message.method] : message.method;
                return object;
            };
    
            /**
             * Converts this CacheTask to JSON.
             * @function toJSON
             * @memberof OracleJob.CacheTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CacheTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Method enum.
             * @name OracleJob.CacheTask.Method
             * @enum {number}
             * @property {number} METHOD_GET=0 METHOD_GET value
             * @property {number} METHOD_SET=1 METHOD_SET value
             */
            CacheTask.Method = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "METHOD_GET"] = 0;
                values[valuesById[1] = "METHOD_SET"] = 1;
                return values;
            })();
    
            return CacheTask;
        })();
    
        OracleJob.SysclockOffsetTask = (function() {
    
            /**
             * Properties of a SysclockOffsetTask.
             * @memberof OracleJob
             * @interface ISysclockOffsetTask
             */
    
            /**
             * Constructs a new SysclockOffsetTask.
             * @memberof OracleJob
             * @classdesc Represents a SysclockOffsetTask.
             * @implements ISysclockOffsetTask
             * @constructor
             * @param {OracleJob.ISysclockOffsetTask=} [properties] Properties to set
             */
            function SysclockOffsetTask(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new SysclockOffsetTask instance using the specified properties.
             * @function create
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.ISysclockOffsetTask=} [properties] Properties to set
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask instance
             */
            SysclockOffsetTask.create = function create(properties) {
                return new SysclockOffsetTask(properties);
            };
    
            /**
             * Encodes the specified SysclockOffsetTask message. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.ISysclockOffsetTask} message SysclockOffsetTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SysclockOffsetTask.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified SysclockOffsetTask message, length delimited. Does not implicitly {@link OracleJob.SysclockOffsetTask.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.ISysclockOffsetTask} message SysclockOffsetTask message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SysclockOffsetTask.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SysclockOffsetTask message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SysclockOffsetTask.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.SysclockOffsetTask();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SysclockOffsetTask message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SysclockOffsetTask.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SysclockOffsetTask message.
             * @function verify
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SysclockOffsetTask.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a SysclockOffsetTask message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.SysclockOffsetTask} SysclockOffsetTask
             */
            SysclockOffsetTask.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.SysclockOffsetTask)
                    return object;
                return new $root.OracleJob.SysclockOffsetTask();
            };
    
            /**
             * Creates a plain object from a SysclockOffsetTask message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.SysclockOffsetTask
             * @static
             * @param {OracleJob.SysclockOffsetTask} message SysclockOffsetTask
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SysclockOffsetTask.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this SysclockOffsetTask to JSON.
             * @function toJSON
             * @memberof OracleJob.SysclockOffsetTask
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SysclockOffsetTask.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SysclockOffsetTask;
        })();
    
        OracleJob.Task = (function() {
    
            /**
             * Properties of a Task.
             * @memberof OracleJob
             * @interface ITask
             * @property {OracleJob.IHttpTask|null} [httpTask] Task httpTask
             * @property {OracleJob.IJsonParseTask|null} [jsonParseTask] Task jsonParseTask
             * @property {OracleJob.IMedianTask|null} [medianTask] Task medianTask
             * @property {OracleJob.IMeanTask|null} [meanTask] Task meanTask
             * @property {OracleJob.IWebsocketTask|null} [websocketTask] Task websocketTask
             * @property {OracleJob.IDivideTask|null} [divideTask] Task divideTask
             * @property {OracleJob.IMultiplyTask|null} [multiplyTask] Task multiplyTask
             * @property {OracleJob.ILpTokenPriceTask|null} [lpTokenPriceTask] Task lpTokenPriceTask
             * @property {OracleJob.ILpExchangeRateTask|null} [lpExchangeRateTask] Task lpExchangeRateTask
             * @property {OracleJob.IConditionalTask|null} [conditionalTask] Task conditionalTask
             * @property {OracleJob.IValueTask|null} [valueTask] Task valueTask
             * @property {OracleJob.IMaxTask|null} [maxTask] Task maxTask
             * @property {OracleJob.IRegexExtractTask|null} [regexExtractTask] Task regexExtractTask
             * @property {OracleJob.IXStepPriceTask|null} [xstepPriceTask] Task xstepPriceTask
             * @property {OracleJob.IAddTask|null} [addTask] Task addTask
             * @property {OracleJob.ISubtractTask|null} [subtractTask] Task subtractTask
             * @property {OracleJob.ITwapTask|null} [twapTask] Task twapTask
             * @property {OracleJob.ISerumSwapTask|null} [serumSwapTask] Task serumSwapTask
             * @property {OracleJob.IPowTask|null} [powTask] Task powTask
             * @property {OracleJob.ILendingRateTask|null} [lendingRateTask] Task lendingRateTask
             * @property {OracleJob.IMangoPerpMarketTask|null} [mangoPerpMarketTask] Task mangoPerpMarketTask
             * @property {OracleJob.IJupiterSwapTask|null} [jupiterSwapTask] Task jupiterSwapTask
             * @property {OracleJob.IPerpMarketTask|null} [perpMarketTask] Task perpMarketTask
             * @property {OracleJob.IOracleTask|null} [oracleTask] Task oracleTask
             * @property {OracleJob.IAnchorFetchTask|null} [anchorFetchTask] Task anchorFetchTask
             * @property {OracleJob.IDefiKingdomsTask|null} [defiKingdomsTask] Task defiKingdomsTask
             * @property {OracleJob.ITpsTask|null} [tpsTask] Task tpsTask
             * @property {OracleJob.ISplStakePoolTask|null} [splStakePoolTask] Task splStakePoolTask
             * @property {OracleJob.ISplTokenParseTask|null} [splTokenParseTask] Task splTokenParseTask
             * @property {OracleJob.IUniswapExchangeRateTask|null} [uniswapExchangeRateTask] Task uniswapExchangeRateTask
             * @property {OracleJob.ISushiswapExchangeRateTask|null} [sushiswapExchangeRateTask] Task sushiswapExchangeRateTask
             * @property {OracleJob.IPancakeswapExchangeRateTask|null} [pancakeswapExchangeRateTask] Task pancakeswapExchangeRateTask
             * @property {OracleJob.ICacheTask|null} [cacheTask] Task cacheTask
             * @property {OracleJob.ISysclockOffsetTask|null} [sysclockOffsetTask] Task sysclockOffsetTask
             */
    
            /**
             * Constructs a new Task.
             * @memberof OracleJob
             * @classdesc Represents a Task.
             * @implements ITask
             * @constructor
             * @param {OracleJob.ITask=} [properties] Properties to set
             */
            function Task(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Task httpTask.
             * @member {OracleJob.IHttpTask|null|undefined} httpTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.httpTask = null;
    
            /**
             * Task jsonParseTask.
             * @member {OracleJob.IJsonParseTask|null|undefined} jsonParseTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.jsonParseTask = null;
    
            /**
             * Task medianTask.
             * @member {OracleJob.IMedianTask|null|undefined} medianTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.medianTask = null;
    
            /**
             * Task meanTask.
             * @member {OracleJob.IMeanTask|null|undefined} meanTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.meanTask = null;
    
            /**
             * Task websocketTask.
             * @member {OracleJob.IWebsocketTask|null|undefined} websocketTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.websocketTask = null;
    
            /**
             * Task divideTask.
             * @member {OracleJob.IDivideTask|null|undefined} divideTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.divideTask = null;
    
            /**
             * Task multiplyTask.
             * @member {OracleJob.IMultiplyTask|null|undefined} multiplyTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.multiplyTask = null;
    
            /**
             * Task lpTokenPriceTask.
             * @member {OracleJob.ILpTokenPriceTask|null|undefined} lpTokenPriceTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.lpTokenPriceTask = null;
    
            /**
             * Task lpExchangeRateTask.
             * @member {OracleJob.ILpExchangeRateTask|null|undefined} lpExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.lpExchangeRateTask = null;
    
            /**
             * Task conditionalTask.
             * @member {OracleJob.IConditionalTask|null|undefined} conditionalTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.conditionalTask = null;
    
            /**
             * Task valueTask.
             * @member {OracleJob.IValueTask|null|undefined} valueTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.valueTask = null;
    
            /**
             * Task maxTask.
             * @member {OracleJob.IMaxTask|null|undefined} maxTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.maxTask = null;
    
            /**
             * Task regexExtractTask.
             * @member {OracleJob.IRegexExtractTask|null|undefined} regexExtractTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.regexExtractTask = null;
    
            /**
             * Task xstepPriceTask.
             * @member {OracleJob.IXStepPriceTask|null|undefined} xstepPriceTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.xstepPriceTask = null;
    
            /**
             * Task addTask.
             * @member {OracleJob.IAddTask|null|undefined} addTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.addTask = null;
    
            /**
             * Task subtractTask.
             * @member {OracleJob.ISubtractTask|null|undefined} subtractTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.subtractTask = null;
    
            /**
             * Task twapTask.
             * @member {OracleJob.ITwapTask|null|undefined} twapTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.twapTask = null;
    
            /**
             * Task serumSwapTask.
             * @member {OracleJob.ISerumSwapTask|null|undefined} serumSwapTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.serumSwapTask = null;
    
            /**
             * Task powTask.
             * @member {OracleJob.IPowTask|null|undefined} powTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.powTask = null;
    
            /**
             * Task lendingRateTask.
             * @member {OracleJob.ILendingRateTask|null|undefined} lendingRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.lendingRateTask = null;
    
            /**
             * Task mangoPerpMarketTask.
             * @member {OracleJob.IMangoPerpMarketTask|null|undefined} mangoPerpMarketTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.mangoPerpMarketTask = null;
    
            /**
             * Task jupiterSwapTask.
             * @member {OracleJob.IJupiterSwapTask|null|undefined} jupiterSwapTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.jupiterSwapTask = null;
    
            /**
             * Task perpMarketTask.
             * @member {OracleJob.IPerpMarketTask|null|undefined} perpMarketTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.perpMarketTask = null;
    
            /**
             * Task oracleTask.
             * @member {OracleJob.IOracleTask|null|undefined} oracleTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.oracleTask = null;
    
            /**
             * Task anchorFetchTask.
             * @member {OracleJob.IAnchorFetchTask|null|undefined} anchorFetchTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.anchorFetchTask = null;
    
            /**
             * Task defiKingdomsTask.
             * @member {OracleJob.IDefiKingdomsTask|null|undefined} defiKingdomsTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.defiKingdomsTask = null;
    
            /**
             * Task tpsTask.
             * @member {OracleJob.ITpsTask|null|undefined} tpsTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.tpsTask = null;
    
            /**
             * Task splStakePoolTask.
             * @member {OracleJob.ISplStakePoolTask|null|undefined} splStakePoolTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.splStakePoolTask = null;
    
            /**
             * Task splTokenParseTask.
             * @member {OracleJob.ISplTokenParseTask|null|undefined} splTokenParseTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.splTokenParseTask = null;
    
            /**
             * Task uniswapExchangeRateTask.
             * @member {OracleJob.IUniswapExchangeRateTask|null|undefined} uniswapExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.uniswapExchangeRateTask = null;
    
            /**
             * Task sushiswapExchangeRateTask.
             * @member {OracleJob.ISushiswapExchangeRateTask|null|undefined} sushiswapExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.sushiswapExchangeRateTask = null;
    
            /**
             * Task pancakeswapExchangeRateTask.
             * @member {OracleJob.IPancakeswapExchangeRateTask|null|undefined} pancakeswapExchangeRateTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.pancakeswapExchangeRateTask = null;
    
            /**
             * Task cacheTask.
             * @member {OracleJob.ICacheTask|null|undefined} cacheTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.cacheTask = null;
    
            /**
             * Task sysclockOffsetTask.
             * @member {OracleJob.ISysclockOffsetTask|null|undefined} sysclockOffsetTask
             * @memberof OracleJob.Task
             * @instance
             */
            Task.prototype.sysclockOffsetTask = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * Task Task.
             * @member {"httpTask"|"jsonParseTask"|"medianTask"|"meanTask"|"websocketTask"|"divideTask"|"multiplyTask"|"lpTokenPriceTask"|"lpExchangeRateTask"|"conditionalTask"|"valueTask"|"maxTask"|"regexExtractTask"|"xstepPriceTask"|"addTask"|"subtractTask"|"twapTask"|"serumSwapTask"|"powTask"|"lendingRateTask"|"mangoPerpMarketTask"|"jupiterSwapTask"|"perpMarketTask"|"oracleTask"|"anchorFetchTask"|"defiKingdomsTask"|"tpsTask"|"splStakePoolTask"|"splTokenParseTask"|"uniswapExchangeRateTask"|"sushiswapExchangeRateTask"|"pancakeswapExchangeRateTask"|"cacheTask"|"sysclockOffsetTask"|undefined} Task
             * @memberof OracleJob.Task
             * @instance
             */
            Object.defineProperty(Task.prototype, "Task", {
                get: $util.oneOfGetter($oneOfFields = ["httpTask", "jsonParseTask", "medianTask", "meanTask", "websocketTask", "divideTask", "multiplyTask", "lpTokenPriceTask", "lpExchangeRateTask", "conditionalTask", "valueTask", "maxTask", "regexExtractTask", "xstepPriceTask", "addTask", "subtractTask", "twapTask", "serumSwapTask", "powTask", "lendingRateTask", "mangoPerpMarketTask", "jupiterSwapTask", "perpMarketTask", "oracleTask", "anchorFetchTask", "defiKingdomsTask", "tpsTask", "splStakePoolTask", "splTokenParseTask", "uniswapExchangeRateTask", "sushiswapExchangeRateTask", "pancakeswapExchangeRateTask", "cacheTask", "sysclockOffsetTask"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new Task instance using the specified properties.
             * @function create
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.ITask=} [properties] Properties to set
             * @returns {OracleJob.Task} Task instance
             */
            Task.create = function create(properties) {
                return new Task(properties);
            };
    
            /**
             * Encodes the specified Task message. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
             * @function encode
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.ITask} message Task message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Task.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.httpTask != null && Object.hasOwnProperty.call(message, "httpTask"))
                    $root.OracleJob.HttpTask.encode(message.httpTask, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.jsonParseTask != null && Object.hasOwnProperty.call(message, "jsonParseTask"))
                    $root.OracleJob.JsonParseTask.encode(message.jsonParseTask, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.medianTask != null && Object.hasOwnProperty.call(message, "medianTask"))
                    $root.OracleJob.MedianTask.encode(message.medianTask, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.meanTask != null && Object.hasOwnProperty.call(message, "meanTask"))
                    $root.OracleJob.MeanTask.encode(message.meanTask, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.websocketTask != null && Object.hasOwnProperty.call(message, "websocketTask"))
                    $root.OracleJob.WebsocketTask.encode(message.websocketTask, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.divideTask != null && Object.hasOwnProperty.call(message, "divideTask"))
                    $root.OracleJob.DivideTask.encode(message.divideTask, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.multiplyTask != null && Object.hasOwnProperty.call(message, "multiplyTask"))
                    $root.OracleJob.MultiplyTask.encode(message.multiplyTask, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.lpTokenPriceTask != null && Object.hasOwnProperty.call(message, "lpTokenPriceTask"))
                    $root.OracleJob.LpTokenPriceTask.encode(message.lpTokenPriceTask, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.lpExchangeRateTask != null && Object.hasOwnProperty.call(message, "lpExchangeRateTask"))
                    $root.OracleJob.LpExchangeRateTask.encode(message.lpExchangeRateTask, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.conditionalTask != null && Object.hasOwnProperty.call(message, "conditionalTask"))
                    $root.OracleJob.ConditionalTask.encode(message.conditionalTask, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.valueTask != null && Object.hasOwnProperty.call(message, "valueTask"))
                    $root.OracleJob.ValueTask.encode(message.valueTask, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.maxTask != null && Object.hasOwnProperty.call(message, "maxTask"))
                    $root.OracleJob.MaxTask.encode(message.maxTask, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.regexExtractTask != null && Object.hasOwnProperty.call(message, "regexExtractTask"))
                    $root.OracleJob.RegexExtractTask.encode(message.regexExtractTask, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                if (message.xstepPriceTask != null && Object.hasOwnProperty.call(message, "xstepPriceTask"))
                    $root.OracleJob.XStepPriceTask.encode(message.xstepPriceTask, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                if (message.addTask != null && Object.hasOwnProperty.call(message, "addTask"))
                    $root.OracleJob.AddTask.encode(message.addTask, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                if (message.subtractTask != null && Object.hasOwnProperty.call(message, "subtractTask"))
                    $root.OracleJob.SubtractTask.encode(message.subtractTask, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
                if (message.twapTask != null && Object.hasOwnProperty.call(message, "twapTask"))
                    $root.OracleJob.TwapTask.encode(message.twapTask, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
                if (message.serumSwapTask != null && Object.hasOwnProperty.call(message, "serumSwapTask"))
                    $root.OracleJob.SerumSwapTask.encode(message.serumSwapTask, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
                if (message.powTask != null && Object.hasOwnProperty.call(message, "powTask"))
                    $root.OracleJob.PowTask.encode(message.powTask, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                if (message.lendingRateTask != null && Object.hasOwnProperty.call(message, "lendingRateTask"))
                    $root.OracleJob.LendingRateTask.encode(message.lendingRateTask, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                if (message.mangoPerpMarketTask != null && Object.hasOwnProperty.call(message, "mangoPerpMarketTask"))
                    $root.OracleJob.MangoPerpMarketTask.encode(message.mangoPerpMarketTask, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
                if (message.jupiterSwapTask != null && Object.hasOwnProperty.call(message, "jupiterSwapTask"))
                    $root.OracleJob.JupiterSwapTask.encode(message.jupiterSwapTask, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
                if (message.perpMarketTask != null && Object.hasOwnProperty.call(message, "perpMarketTask"))
                    $root.OracleJob.PerpMarketTask.encode(message.perpMarketTask, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
                if (message.oracleTask != null && Object.hasOwnProperty.call(message, "oracleTask"))
                    $root.OracleJob.OracleTask.encode(message.oracleTask, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
                if (message.anchorFetchTask != null && Object.hasOwnProperty.call(message, "anchorFetchTask"))
                    $root.OracleJob.AnchorFetchTask.encode(message.anchorFetchTask, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
                if (message.defiKingdomsTask != null && Object.hasOwnProperty.call(message, "defiKingdomsTask"))
                    $root.OracleJob.DefiKingdomsTask.encode(message.defiKingdomsTask, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
                if (message.tpsTask != null && Object.hasOwnProperty.call(message, "tpsTask"))
                    $root.OracleJob.TpsTask.encode(message.tpsTask, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
                if (message.splStakePoolTask != null && Object.hasOwnProperty.call(message, "splStakePoolTask"))
                    $root.OracleJob.SplStakePoolTask.encode(message.splStakePoolTask, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
                if (message.splTokenParseTask != null && Object.hasOwnProperty.call(message, "splTokenParseTask"))
                    $root.OracleJob.SplTokenParseTask.encode(message.splTokenParseTask, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
                if (message.uniswapExchangeRateTask != null && Object.hasOwnProperty.call(message, "uniswapExchangeRateTask"))
                    $root.OracleJob.UniswapExchangeRateTask.encode(message.uniswapExchangeRateTask, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
                if (message.sushiswapExchangeRateTask != null && Object.hasOwnProperty.call(message, "sushiswapExchangeRateTask"))
                    $root.OracleJob.SushiswapExchangeRateTask.encode(message.sushiswapExchangeRateTask, writer.uint32(/* id 32, wireType 2 =*/258).fork()).ldelim();
                if (message.pancakeswapExchangeRateTask != null && Object.hasOwnProperty.call(message, "pancakeswapExchangeRateTask"))
                    $root.OracleJob.PancakeswapExchangeRateTask.encode(message.pancakeswapExchangeRateTask, writer.uint32(/* id 33, wireType 2 =*/266).fork()).ldelim();
                if (message.cacheTask != null && Object.hasOwnProperty.call(message, "cacheTask"))
                    $root.OracleJob.CacheTask.encode(message.cacheTask, writer.uint32(/* id 34, wireType 2 =*/274).fork()).ldelim();
                if (message.sysclockOffsetTask != null && Object.hasOwnProperty.call(message, "sysclockOffsetTask"))
                    $root.OracleJob.SysclockOffsetTask.encode(message.sysclockOffsetTask, writer.uint32(/* id 35, wireType 2 =*/282).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified Task message, length delimited. Does not implicitly {@link OracleJob.Task.verify|verify} messages.
             * @function encodeDelimited
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.ITask} message Task message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Task.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Task message from the specified reader or buffer.
             * @function decode
             * @memberof OracleJob.Task
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {OracleJob.Task} Task
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Task.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OracleJob.Task();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.httpTask = $root.OracleJob.HttpTask.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.jsonParseTask = $root.OracleJob.JsonParseTask.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.medianTask = $root.OracleJob.MedianTask.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.meanTask = $root.OracleJob.MeanTask.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.websocketTask = $root.OracleJob.WebsocketTask.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.divideTask = $root.OracleJob.DivideTask.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.multiplyTask = $root.OracleJob.MultiplyTask.decode(reader, reader.uint32());
                        break;
                    case 9:
                        message.lpTokenPriceTask = $root.OracleJob.LpTokenPriceTask.decode(reader, reader.uint32());
                        break;
                    case 10:
                        message.lpExchangeRateTask = $root.OracleJob.LpExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 11:
                        message.conditionalTask = $root.OracleJob.ConditionalTask.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.valueTask = $root.OracleJob.ValueTask.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.maxTask = $root.OracleJob.MaxTask.decode(reader, reader.uint32());
                        break;
                    case 14:
                        message.regexExtractTask = $root.OracleJob.RegexExtractTask.decode(reader, reader.uint32());
                        break;
                    case 15:
                        message.xstepPriceTask = $root.OracleJob.XStepPriceTask.decode(reader, reader.uint32());
                        break;
                    case 16:
                        message.addTask = $root.OracleJob.AddTask.decode(reader, reader.uint32());
                        break;
                    case 17:
                        message.subtractTask = $root.OracleJob.SubtractTask.decode(reader, reader.uint32());
                        break;
                    case 18:
                        message.twapTask = $root.OracleJob.TwapTask.decode(reader, reader.uint32());
                        break;
                    case 19:
                        message.serumSwapTask = $root.OracleJob.SerumSwapTask.decode(reader, reader.uint32());
                        break;
                    case 20:
                        message.powTask = $root.OracleJob.PowTask.decode(reader, reader.uint32());
                        break;
                    case 21:
                        message.lendingRateTask = $root.OracleJob.LendingRateTask.decode(reader, reader.uint32());
                        break;
                    case 22:
                        message.mangoPerpMarketTask = $root.OracleJob.MangoPerpMarketTask.decode(reader, reader.uint32());
                        break;
                    case 23:
                        message.jupiterSwapTask = $root.OracleJob.JupiterSwapTask.decode(reader, reader.uint32());
                        break;
                    case 24:
                        message.perpMarketTask = $root.OracleJob.PerpMarketTask.decode(reader, reader.uint32());
                        break;
                    case 25:
                        message.oracleTask = $root.OracleJob.OracleTask.decode(reader, reader.uint32());
                        break;
                    case 26:
                        message.anchorFetchTask = $root.OracleJob.AnchorFetchTask.decode(reader, reader.uint32());
                        break;
                    case 27:
                        message.defiKingdomsTask = $root.OracleJob.DefiKingdomsTask.decode(reader, reader.uint32());
                        break;
                    case 28:
                        message.tpsTask = $root.OracleJob.TpsTask.decode(reader, reader.uint32());
                        break;
                    case 29:
                        message.splStakePoolTask = $root.OracleJob.SplStakePoolTask.decode(reader, reader.uint32());
                        break;
                    case 30:
                        message.splTokenParseTask = $root.OracleJob.SplTokenParseTask.decode(reader, reader.uint32());
                        break;
                    case 31:
                        message.uniswapExchangeRateTask = $root.OracleJob.UniswapExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 32:
                        message.sushiswapExchangeRateTask = $root.OracleJob.SushiswapExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 33:
                        message.pancakeswapExchangeRateTask = $root.OracleJob.PancakeswapExchangeRateTask.decode(reader, reader.uint32());
                        break;
                    case 34:
                        message.cacheTask = $root.OracleJob.CacheTask.decode(reader, reader.uint32());
                        break;
                    case 35:
                        message.sysclockOffsetTask = $root.OracleJob.SysclockOffsetTask.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Task message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof OracleJob.Task
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {OracleJob.Task} Task
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Task.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Task message.
             * @function verify
             * @memberof OracleJob.Task
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Task.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.httpTask != null && message.hasOwnProperty("httpTask")) {
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.HttpTask.verify(message.httpTask);
                        if (error)
                            return "httpTask." + error;
                    }
                }
                if (message.jsonParseTask != null && message.hasOwnProperty("jsonParseTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.JsonParseTask.verify(message.jsonParseTask);
                        if (error)
                            return "jsonParseTask." + error;
                    }
                }
                if (message.medianTask != null && message.hasOwnProperty("medianTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MedianTask.verify(message.medianTask);
                        if (error)
                            return "medianTask." + error;
                    }
                }
                if (message.meanTask != null && message.hasOwnProperty("meanTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MeanTask.verify(message.meanTask);
                        if (error)
                            return "meanTask." + error;
                    }
                }
                if (message.websocketTask != null && message.hasOwnProperty("websocketTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.WebsocketTask.verify(message.websocketTask);
                        if (error)
                            return "websocketTask." + error;
                    }
                }
                if (message.divideTask != null && message.hasOwnProperty("divideTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.DivideTask.verify(message.divideTask);
                        if (error)
                            return "divideTask." + error;
                    }
                }
                if (message.multiplyTask != null && message.hasOwnProperty("multiplyTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MultiplyTask.verify(message.multiplyTask);
                        if (error)
                            return "multiplyTask." + error;
                    }
                }
                if (message.lpTokenPriceTask != null && message.hasOwnProperty("lpTokenPriceTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.LpTokenPriceTask.verify(message.lpTokenPriceTask);
                        if (error)
                            return "lpTokenPriceTask." + error;
                    }
                }
                if (message.lpExchangeRateTask != null && message.hasOwnProperty("lpExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.LpExchangeRateTask.verify(message.lpExchangeRateTask);
                        if (error)
                            return "lpExchangeRateTask." + error;
                    }
                }
                if (message.conditionalTask != null && message.hasOwnProperty("conditionalTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.ConditionalTask.verify(message.conditionalTask);
                        if (error)
                            return "conditionalTask." + error;
                    }
                }
                if (message.valueTask != null && message.hasOwnProperty("valueTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.ValueTask.verify(message.valueTask);
                        if (error)
                            return "valueTask." + error;
                    }
                }
                if (message.maxTask != null && message.hasOwnProperty("maxTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MaxTask.verify(message.maxTask);
                        if (error)
                            return "maxTask." + error;
                    }
                }
                if (message.regexExtractTask != null && message.hasOwnProperty("regexExtractTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.RegexExtractTask.verify(message.regexExtractTask);
                        if (error)
                            return "regexExtractTask." + error;
                    }
                }
                if (message.xstepPriceTask != null && message.hasOwnProperty("xstepPriceTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.XStepPriceTask.verify(message.xstepPriceTask);
                        if (error)
                            return "xstepPriceTask." + error;
                    }
                }
                if (message.addTask != null && message.hasOwnProperty("addTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.AddTask.verify(message.addTask);
                        if (error)
                            return "addTask." + error;
                    }
                }
                if (message.subtractTask != null && message.hasOwnProperty("subtractTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SubtractTask.verify(message.subtractTask);
                        if (error)
                            return "subtractTask." + error;
                    }
                }
                if (message.twapTask != null && message.hasOwnProperty("twapTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.TwapTask.verify(message.twapTask);
                        if (error)
                            return "twapTask." + error;
                    }
                }
                if (message.serumSwapTask != null && message.hasOwnProperty("serumSwapTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SerumSwapTask.verify(message.serumSwapTask);
                        if (error)
                            return "serumSwapTask." + error;
                    }
                }
                if (message.powTask != null && message.hasOwnProperty("powTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.PowTask.verify(message.powTask);
                        if (error)
                            return "powTask." + error;
                    }
                }
                if (message.lendingRateTask != null && message.hasOwnProperty("lendingRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.LendingRateTask.verify(message.lendingRateTask);
                        if (error)
                            return "lendingRateTask." + error;
                    }
                }
                if (message.mangoPerpMarketTask != null && message.hasOwnProperty("mangoPerpMarketTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.MangoPerpMarketTask.verify(message.mangoPerpMarketTask);
                        if (error)
                            return "mangoPerpMarketTask." + error;
                    }
                }
                if (message.jupiterSwapTask != null && message.hasOwnProperty("jupiterSwapTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.JupiterSwapTask.verify(message.jupiterSwapTask);
                        if (error)
                            return "jupiterSwapTask." + error;
                    }
                }
                if (message.perpMarketTask != null && message.hasOwnProperty("perpMarketTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.PerpMarketTask.verify(message.perpMarketTask);
                        if (error)
                            return "perpMarketTask." + error;
                    }
                }
                if (message.oracleTask != null && message.hasOwnProperty("oracleTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.OracleTask.verify(message.oracleTask);
                        if (error)
                            return "oracleTask." + error;
                    }
                }
                if (message.anchorFetchTask != null && message.hasOwnProperty("anchorFetchTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.AnchorFetchTask.verify(message.anchorFetchTask);
                        if (error)
                            return "anchorFetchTask." + error;
                    }
                }
                if (message.defiKingdomsTask != null && message.hasOwnProperty("defiKingdomsTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.DefiKingdomsTask.verify(message.defiKingdomsTask);
                        if (error)
                            return "defiKingdomsTask." + error;
                    }
                }
                if (message.tpsTask != null && message.hasOwnProperty("tpsTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.TpsTask.verify(message.tpsTask);
                        if (error)
                            return "tpsTask." + error;
                    }
                }
                if (message.splStakePoolTask != null && message.hasOwnProperty("splStakePoolTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SplStakePoolTask.verify(message.splStakePoolTask);
                        if (error)
                            return "splStakePoolTask." + error;
                    }
                }
                if (message.splTokenParseTask != null && message.hasOwnProperty("splTokenParseTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SplTokenParseTask.verify(message.splTokenParseTask);
                        if (error)
                            return "splTokenParseTask." + error;
                    }
                }
                if (message.uniswapExchangeRateTask != null && message.hasOwnProperty("uniswapExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.UniswapExchangeRateTask.verify(message.uniswapExchangeRateTask);
                        if (error)
                            return "uniswapExchangeRateTask." + error;
                    }
                }
                if (message.sushiswapExchangeRateTask != null && message.hasOwnProperty("sushiswapExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SushiswapExchangeRateTask.verify(message.sushiswapExchangeRateTask);
                        if (error)
                            return "sushiswapExchangeRateTask." + error;
                    }
                }
                if (message.pancakeswapExchangeRateTask != null && message.hasOwnProperty("pancakeswapExchangeRateTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.PancakeswapExchangeRateTask.verify(message.pancakeswapExchangeRateTask);
                        if (error)
                            return "pancakeswapExchangeRateTask." + error;
                    }
                }
                if (message.cacheTask != null && message.hasOwnProperty("cacheTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.CacheTask.verify(message.cacheTask);
                        if (error)
                            return "cacheTask." + error;
                    }
                }
                if (message.sysclockOffsetTask != null && message.hasOwnProperty("sysclockOffsetTask")) {
                    if (properties.Task === 1)
                        return "Task: multiple values";
                    properties.Task = 1;
                    {
                        var error = $root.OracleJob.SysclockOffsetTask.verify(message.sysclockOffsetTask);
                        if (error)
                            return "sysclockOffsetTask." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a Task message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof OracleJob.Task
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {OracleJob.Task} Task
             */
            Task.fromObject = function fromObject(object) {
                if (object instanceof $root.OracleJob.Task)
                    return object;
                var message = new $root.OracleJob.Task();
                if (object.httpTask != null) {
                    if (typeof object.httpTask !== "object")
                        throw TypeError(".OracleJob.Task.httpTask: object expected");
                    message.httpTask = $root.OracleJob.HttpTask.fromObject(object.httpTask);
                }
                if (object.jsonParseTask != null) {
                    if (typeof object.jsonParseTask !== "object")
                        throw TypeError(".OracleJob.Task.jsonParseTask: object expected");
                    message.jsonParseTask = $root.OracleJob.JsonParseTask.fromObject(object.jsonParseTask);
                }
                if (object.medianTask != null) {
                    if (typeof object.medianTask !== "object")
                        throw TypeError(".OracleJob.Task.medianTask: object expected");
                    message.medianTask = $root.OracleJob.MedianTask.fromObject(object.medianTask);
                }
                if (object.meanTask != null) {
                    if (typeof object.meanTask !== "object")
                        throw TypeError(".OracleJob.Task.meanTask: object expected");
                    message.meanTask = $root.OracleJob.MeanTask.fromObject(object.meanTask);
                }
                if (object.websocketTask != null) {
                    if (typeof object.websocketTask !== "object")
                        throw TypeError(".OracleJob.Task.websocketTask: object expected");
                    message.websocketTask = $root.OracleJob.WebsocketTask.fromObject(object.websocketTask);
                }
                if (object.divideTask != null) {
                    if (typeof object.divideTask !== "object")
                        throw TypeError(".OracleJob.Task.divideTask: object expected");
                    message.divideTask = $root.OracleJob.DivideTask.fromObject(object.divideTask);
                }
                if (object.multiplyTask != null) {
                    if (typeof object.multiplyTask !== "object")
                        throw TypeError(".OracleJob.Task.multiplyTask: object expected");
                    message.multiplyTask = $root.OracleJob.MultiplyTask.fromObject(object.multiplyTask);
                }
                if (object.lpTokenPriceTask != null) {
                    if (typeof object.lpTokenPriceTask !== "object")
                        throw TypeError(".OracleJob.Task.lpTokenPriceTask: object expected");
                    message.lpTokenPriceTask = $root.OracleJob.LpTokenPriceTask.fromObject(object.lpTokenPriceTask);
                }
                if (object.lpExchangeRateTask != null) {
                    if (typeof object.lpExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.lpExchangeRateTask: object expected");
                    message.lpExchangeRateTask = $root.OracleJob.LpExchangeRateTask.fromObject(object.lpExchangeRateTask);
                }
                if (object.conditionalTask != null) {
                    if (typeof object.conditionalTask !== "object")
                        throw TypeError(".OracleJob.Task.conditionalTask: object expected");
                    message.conditionalTask = $root.OracleJob.ConditionalTask.fromObject(object.conditionalTask);
                }
                if (object.valueTask != null) {
                    if (typeof object.valueTask !== "object")
                        throw TypeError(".OracleJob.Task.valueTask: object expected");
                    message.valueTask = $root.OracleJob.ValueTask.fromObject(object.valueTask);
                }
                if (object.maxTask != null) {
                    if (typeof object.maxTask !== "object")
                        throw TypeError(".OracleJob.Task.maxTask: object expected");
                    message.maxTask = $root.OracleJob.MaxTask.fromObject(object.maxTask);
                }
                if (object.regexExtractTask != null) {
                    if (typeof object.regexExtractTask !== "object")
                        throw TypeError(".OracleJob.Task.regexExtractTask: object expected");
                    message.regexExtractTask = $root.OracleJob.RegexExtractTask.fromObject(object.regexExtractTask);
                }
                if (object.xstepPriceTask != null) {
                    if (typeof object.xstepPriceTask !== "object")
                        throw TypeError(".OracleJob.Task.xstepPriceTask: object expected");
                    message.xstepPriceTask = $root.OracleJob.XStepPriceTask.fromObject(object.xstepPriceTask);
                }
                if (object.addTask != null) {
                    if (typeof object.addTask !== "object")
                        throw TypeError(".OracleJob.Task.addTask: object expected");
                    message.addTask = $root.OracleJob.AddTask.fromObject(object.addTask);
                }
                if (object.subtractTask != null) {
                    if (typeof object.subtractTask !== "object")
                        throw TypeError(".OracleJob.Task.subtractTask: object expected");
                    message.subtractTask = $root.OracleJob.SubtractTask.fromObject(object.subtractTask);
                }
                if (object.twapTask != null) {
                    if (typeof object.twapTask !== "object")
                        throw TypeError(".OracleJob.Task.twapTask: object expected");
                    message.twapTask = $root.OracleJob.TwapTask.fromObject(object.twapTask);
                }
                if (object.serumSwapTask != null) {
                    if (typeof object.serumSwapTask !== "object")
                        throw TypeError(".OracleJob.Task.serumSwapTask: object expected");
                    message.serumSwapTask = $root.OracleJob.SerumSwapTask.fromObject(object.serumSwapTask);
                }
                if (object.powTask != null) {
                    if (typeof object.powTask !== "object")
                        throw TypeError(".OracleJob.Task.powTask: object expected");
                    message.powTask = $root.OracleJob.PowTask.fromObject(object.powTask);
                }
                if (object.lendingRateTask != null) {
                    if (typeof object.lendingRateTask !== "object")
                        throw TypeError(".OracleJob.Task.lendingRateTask: object expected");
                    message.lendingRateTask = $root.OracleJob.LendingRateTask.fromObject(object.lendingRateTask);
                }
                if (object.mangoPerpMarketTask != null) {
                    if (typeof object.mangoPerpMarketTask !== "object")
                        throw TypeError(".OracleJob.Task.mangoPerpMarketTask: object expected");
                    message.mangoPerpMarketTask = $root.OracleJob.MangoPerpMarketTask.fromObject(object.mangoPerpMarketTask);
                }
                if (object.jupiterSwapTask != null) {
                    if (typeof object.jupiterSwapTask !== "object")
                        throw TypeError(".OracleJob.Task.jupiterSwapTask: object expected");
                    message.jupiterSwapTask = $root.OracleJob.JupiterSwapTask.fromObject(object.jupiterSwapTask);
                }
                if (object.perpMarketTask != null) {
                    if (typeof object.perpMarketTask !== "object")
                        throw TypeError(".OracleJob.Task.perpMarketTask: object expected");
                    message.perpMarketTask = $root.OracleJob.PerpMarketTask.fromObject(object.perpMarketTask);
                }
                if (object.oracleTask != null) {
                    if (typeof object.oracleTask !== "object")
                        throw TypeError(".OracleJob.Task.oracleTask: object expected");
                    message.oracleTask = $root.OracleJob.OracleTask.fromObject(object.oracleTask);
                }
                if (object.anchorFetchTask != null) {
                    if (typeof object.anchorFetchTask !== "object")
                        throw TypeError(".OracleJob.Task.anchorFetchTask: object expected");
                    message.anchorFetchTask = $root.OracleJob.AnchorFetchTask.fromObject(object.anchorFetchTask);
                }
                if (object.defiKingdomsTask != null) {
                    if (typeof object.defiKingdomsTask !== "object")
                        throw TypeError(".OracleJob.Task.defiKingdomsTask: object expected");
                    message.defiKingdomsTask = $root.OracleJob.DefiKingdomsTask.fromObject(object.defiKingdomsTask);
                }
                if (object.tpsTask != null) {
                    if (typeof object.tpsTask !== "object")
                        throw TypeError(".OracleJob.Task.tpsTask: object expected");
                    message.tpsTask = $root.OracleJob.TpsTask.fromObject(object.tpsTask);
                }
                if (object.splStakePoolTask != null) {
                    if (typeof object.splStakePoolTask !== "object")
                        throw TypeError(".OracleJob.Task.splStakePoolTask: object expected");
                    message.splStakePoolTask = $root.OracleJob.SplStakePoolTask.fromObject(object.splStakePoolTask);
                }
                if (object.splTokenParseTask != null) {
                    if (typeof object.splTokenParseTask !== "object")
                        throw TypeError(".OracleJob.Task.splTokenParseTask: object expected");
                    message.splTokenParseTask = $root.OracleJob.SplTokenParseTask.fromObject(object.splTokenParseTask);
                }
                if (object.uniswapExchangeRateTask != null) {
                    if (typeof object.uniswapExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.uniswapExchangeRateTask: object expected");
                    message.uniswapExchangeRateTask = $root.OracleJob.UniswapExchangeRateTask.fromObject(object.uniswapExchangeRateTask);
                }
                if (object.sushiswapExchangeRateTask != null) {
                    if (typeof object.sushiswapExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.sushiswapExchangeRateTask: object expected");
                    message.sushiswapExchangeRateTask = $root.OracleJob.SushiswapExchangeRateTask.fromObject(object.sushiswapExchangeRateTask);
                }
                if (object.pancakeswapExchangeRateTask != null) {
                    if (typeof object.pancakeswapExchangeRateTask !== "object")
                        throw TypeError(".OracleJob.Task.pancakeswapExchangeRateTask: object expected");
                    message.pancakeswapExchangeRateTask = $root.OracleJob.PancakeswapExchangeRateTask.fromObject(object.pancakeswapExchangeRateTask);
                }
                if (object.cacheTask != null) {
                    if (typeof object.cacheTask !== "object")
                        throw TypeError(".OracleJob.Task.cacheTask: object expected");
                    message.cacheTask = $root.OracleJob.CacheTask.fromObject(object.cacheTask);
                }
                if (object.sysclockOffsetTask != null) {
                    if (typeof object.sysclockOffsetTask !== "object")
                        throw TypeError(".OracleJob.Task.sysclockOffsetTask: object expected");
                    message.sysclockOffsetTask = $root.OracleJob.SysclockOffsetTask.fromObject(object.sysclockOffsetTask);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a Task message. Also converts values to other types if specified.
             * @function toObject
             * @memberof OracleJob.Task
             * @static
             * @param {OracleJob.Task} message Task
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Task.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.httpTask != null && message.hasOwnProperty("httpTask")) {
                    object.httpTask = $root.OracleJob.HttpTask.toObject(message.httpTask, options);
                    if (options.oneofs)
                        object.Task = "httpTask";
                }
                if (message.jsonParseTask != null && message.hasOwnProperty("jsonParseTask")) {
                    object.jsonParseTask = $root.OracleJob.JsonParseTask.toObject(message.jsonParseTask, options);
                    if (options.oneofs)
                        object.Task = "jsonParseTask";
                }
                if (message.medianTask != null && message.hasOwnProperty("medianTask")) {
                    object.medianTask = $root.OracleJob.MedianTask.toObject(message.medianTask, options);
                    if (options.oneofs)
                        object.Task = "medianTask";
                }
                if (message.meanTask != null && message.hasOwnProperty("meanTask")) {
                    object.meanTask = $root.OracleJob.MeanTask.toObject(message.meanTask, options);
                    if (options.oneofs)
                        object.Task = "meanTask";
                }
                if (message.websocketTask != null && message.hasOwnProperty("websocketTask")) {
                    object.websocketTask = $root.OracleJob.WebsocketTask.toObject(message.websocketTask, options);
                    if (options.oneofs)
                        object.Task = "websocketTask";
                }
                if (message.divideTask != null && message.hasOwnProperty("divideTask")) {
                    object.divideTask = $root.OracleJob.DivideTask.toObject(message.divideTask, options);
                    if (options.oneofs)
                        object.Task = "divideTask";
                }
                if (message.multiplyTask != null && message.hasOwnProperty("multiplyTask")) {
                    object.multiplyTask = $root.OracleJob.MultiplyTask.toObject(message.multiplyTask, options);
                    if (options.oneofs)
                        object.Task = "multiplyTask";
                }
                if (message.lpTokenPriceTask != null && message.hasOwnProperty("lpTokenPriceTask")) {
                    object.lpTokenPriceTask = $root.OracleJob.LpTokenPriceTask.toObject(message.lpTokenPriceTask, options);
                    if (options.oneofs)
                        object.Task = "lpTokenPriceTask";
                }
                if (message.lpExchangeRateTask != null && message.hasOwnProperty("lpExchangeRateTask")) {
                    object.lpExchangeRateTask = $root.OracleJob.LpExchangeRateTask.toObject(message.lpExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "lpExchangeRateTask";
                }
                if (message.conditionalTask != null && message.hasOwnProperty("conditionalTask")) {
                    object.conditionalTask = $root.OracleJob.ConditionalTask.toObject(message.conditionalTask, options);
                    if (options.oneofs)
                        object.Task = "conditionalTask";
                }
                if (message.valueTask != null && message.hasOwnProperty("valueTask")) {
                    object.valueTask = $root.OracleJob.ValueTask.toObject(message.valueTask, options);
                    if (options.oneofs)
                        object.Task = "valueTask";
                }
                if (message.maxTask != null && message.hasOwnProperty("maxTask")) {
                    object.maxTask = $root.OracleJob.MaxTask.toObject(message.maxTask, options);
                    if (options.oneofs)
                        object.Task = "maxTask";
                }
                if (message.regexExtractTask != null && message.hasOwnProperty("regexExtractTask")) {
                    object.regexExtractTask = $root.OracleJob.RegexExtractTask.toObject(message.regexExtractTask, options);
                    if (options.oneofs)
                        object.Task = "regexExtractTask";
                }
                if (message.xstepPriceTask != null && message.hasOwnProperty("xstepPriceTask")) {
                    object.xstepPriceTask = $root.OracleJob.XStepPriceTask.toObject(message.xstepPriceTask, options);
                    if (options.oneofs)
                        object.Task = "xstepPriceTask";
                }
                if (message.addTask != null && message.hasOwnProperty("addTask")) {
                    object.addTask = $root.OracleJob.AddTask.toObject(message.addTask, options);
                    if (options.oneofs)
                        object.Task = "addTask";
                }
                if (message.subtractTask != null && message.hasOwnProperty("subtractTask")) {
                    object.subtractTask = $root.OracleJob.SubtractTask.toObject(message.subtractTask, options);
                    if (options.oneofs)
                        object.Task = "subtractTask";
                }
                if (message.twapTask != null && message.hasOwnProperty("twapTask")) {
                    object.twapTask = $root.OracleJob.TwapTask.toObject(message.twapTask, options);
                    if (options.oneofs)
                        object.Task = "twapTask";
                }
                if (message.serumSwapTask != null && message.hasOwnProperty("serumSwapTask")) {
                    object.serumSwapTask = $root.OracleJob.SerumSwapTask.toObject(message.serumSwapTask, options);
                    if (options.oneofs)
                        object.Task = "serumSwapTask";
                }
                if (message.powTask != null && message.hasOwnProperty("powTask")) {
                    object.powTask = $root.OracleJob.PowTask.toObject(message.powTask, options);
                    if (options.oneofs)
                        object.Task = "powTask";
                }
                if (message.lendingRateTask != null && message.hasOwnProperty("lendingRateTask")) {
                    object.lendingRateTask = $root.OracleJob.LendingRateTask.toObject(message.lendingRateTask, options);
                    if (options.oneofs)
                        object.Task = "lendingRateTask";
                }
                if (message.mangoPerpMarketTask != null && message.hasOwnProperty("mangoPerpMarketTask")) {
                    object.mangoPerpMarketTask = $root.OracleJob.MangoPerpMarketTask.toObject(message.mangoPerpMarketTask, options);
                    if (options.oneofs)
                        object.Task = "mangoPerpMarketTask";
                }
                if (message.jupiterSwapTask != null && message.hasOwnProperty("jupiterSwapTask")) {
                    object.jupiterSwapTask = $root.OracleJob.JupiterSwapTask.toObject(message.jupiterSwapTask, options);
                    if (options.oneofs)
                        object.Task = "jupiterSwapTask";
                }
                if (message.perpMarketTask != null && message.hasOwnProperty("perpMarketTask")) {
                    object.perpMarketTask = $root.OracleJob.PerpMarketTask.toObject(message.perpMarketTask, options);
                    if (options.oneofs)
                        object.Task = "perpMarketTask";
                }
                if (message.oracleTask != null && message.hasOwnProperty("oracleTask")) {
                    object.oracleTask = $root.OracleJob.OracleTask.toObject(message.oracleTask, options);
                    if (options.oneofs)
                        object.Task = "oracleTask";
                }
                if (message.anchorFetchTask != null && message.hasOwnProperty("anchorFetchTask")) {
                    object.anchorFetchTask = $root.OracleJob.AnchorFetchTask.toObject(message.anchorFetchTask, options);
                    if (options.oneofs)
                        object.Task = "anchorFetchTask";
                }
                if (message.defiKingdomsTask != null && message.hasOwnProperty("defiKingdomsTask")) {
                    object.defiKingdomsTask = $root.OracleJob.DefiKingdomsTask.toObject(message.defiKingdomsTask, options);
                    if (options.oneofs)
                        object.Task = "defiKingdomsTask";
                }
                if (message.tpsTask != null && message.hasOwnProperty("tpsTask")) {
                    object.tpsTask = $root.OracleJob.TpsTask.toObject(message.tpsTask, options);
                    if (options.oneofs)
                        object.Task = "tpsTask";
                }
                if (message.splStakePoolTask != null && message.hasOwnProperty("splStakePoolTask")) {
                    object.splStakePoolTask = $root.OracleJob.SplStakePoolTask.toObject(message.splStakePoolTask, options);
                    if (options.oneofs)
                        object.Task = "splStakePoolTask";
                }
                if (message.splTokenParseTask != null && message.hasOwnProperty("splTokenParseTask")) {
                    object.splTokenParseTask = $root.OracleJob.SplTokenParseTask.toObject(message.splTokenParseTask, options);
                    if (options.oneofs)
                        object.Task = "splTokenParseTask";
                }
                if (message.uniswapExchangeRateTask != null && message.hasOwnProperty("uniswapExchangeRateTask")) {
                    object.uniswapExchangeRateTask = $root.OracleJob.UniswapExchangeRateTask.toObject(message.uniswapExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "uniswapExchangeRateTask";
                }
                if (message.sushiswapExchangeRateTask != null && message.hasOwnProperty("sushiswapExchangeRateTask")) {
                    object.sushiswapExchangeRateTask = $root.OracleJob.SushiswapExchangeRateTask.toObject(message.sushiswapExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "sushiswapExchangeRateTask";
                }
                if (message.pancakeswapExchangeRateTask != null && message.hasOwnProperty("pancakeswapExchangeRateTask")) {
                    object.pancakeswapExchangeRateTask = $root.OracleJob.PancakeswapExchangeRateTask.toObject(message.pancakeswapExchangeRateTask, options);
                    if (options.oneofs)
                        object.Task = "pancakeswapExchangeRateTask";
                }
                if (message.cacheTask != null && message.hasOwnProperty("cacheTask")) {
                    object.cacheTask = $root.OracleJob.CacheTask.toObject(message.cacheTask, options);
                    if (options.oneofs)
                        object.Task = "cacheTask";
                }
                if (message.sysclockOffsetTask != null && message.hasOwnProperty("sysclockOffsetTask")) {
                    object.sysclockOffsetTask = $root.OracleJob.SysclockOffsetTask.toObject(message.sysclockOffsetTask, options);
                    if (options.oneofs)
                        object.Task = "sysclockOffsetTask";
                }
                return object;
            };
    
            /**
             * Converts this Task to JSON.
             * @function toJSON
             * @memberof OracleJob.Task
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Task.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Task;
        })();
    
        return OracleJob;
    })();
    
    $root.JobPosting = (function() {
    
        /**
         * Properties of a JobPosting.
         * @exports IJobPosting
         * @interface IJobPosting
         * @property {Uint8Array|null} [aggregatorStatePubkey] JobPosting aggregatorStatePubkey
         * @property {Array.<Uint8Array>|null} [nodePubkeys] JobPosting nodePubkeys
         * @property {number|Long|null} [slot] JobPosting slot
         */
    
        /**
         * Constructs a new JobPosting.
         * @exports JobPosting
         * @classdesc Represents a JobPosting.
         * @implements IJobPosting
         * @constructor
         * @param {IJobPosting=} [properties] Properties to set
         */
        function JobPosting(properties) {
            this.nodePubkeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * JobPosting aggregatorStatePubkey.
         * @member {Uint8Array} aggregatorStatePubkey
         * @memberof JobPosting
         * @instance
         */
        JobPosting.prototype.aggregatorStatePubkey = $util.newBuffer([]);
    
        /**
         * JobPosting nodePubkeys.
         * @member {Array.<Uint8Array>} nodePubkeys
         * @memberof JobPosting
         * @instance
         */
        JobPosting.prototype.nodePubkeys = $util.emptyArray;
    
        /**
         * JobPosting slot.
         * @member {number|Long} slot
         * @memberof JobPosting
         * @instance
         */
        JobPosting.prototype.slot = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
        /**
         * Creates a new JobPosting instance using the specified properties.
         * @function create
         * @memberof JobPosting
         * @static
         * @param {IJobPosting=} [properties] Properties to set
         * @returns {JobPosting} JobPosting instance
         */
        JobPosting.create = function create(properties) {
            return new JobPosting(properties);
        };
    
        /**
         * Encodes the specified JobPosting message. Does not implicitly {@link JobPosting.verify|verify} messages.
         * @function encode
         * @memberof JobPosting
         * @static
         * @param {IJobPosting} message JobPosting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JobPosting.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.aggregatorStatePubkey != null && Object.hasOwnProperty.call(message, "aggregatorStatePubkey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.aggregatorStatePubkey);
            if (message.nodePubkeys != null && message.nodePubkeys.length)
                for (var i = 0; i < message.nodePubkeys.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.nodePubkeys[i]);
            if (message.slot != null && Object.hasOwnProperty.call(message, "slot"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.slot);
            return writer;
        };
    
        /**
         * Encodes the specified JobPosting message, length delimited. Does not implicitly {@link JobPosting.verify|verify} messages.
         * @function encodeDelimited
         * @memberof JobPosting
         * @static
         * @param {IJobPosting} message JobPosting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JobPosting.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a JobPosting message from the specified reader or buffer.
         * @function decode
         * @memberof JobPosting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {JobPosting} JobPosting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JobPosting.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.JobPosting();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.aggregatorStatePubkey = reader.bytes();
                    break;
                case 2:
                    if (!(message.nodePubkeys && message.nodePubkeys.length))
                        message.nodePubkeys = [];
                    message.nodePubkeys.push(reader.bytes());
                    break;
                case 3:
                    message.slot = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a JobPosting message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof JobPosting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {JobPosting} JobPosting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JobPosting.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a JobPosting message.
         * @function verify
         * @memberof JobPosting
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JobPosting.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.aggregatorStatePubkey != null && message.hasOwnProperty("aggregatorStatePubkey"))
                if (!(message.aggregatorStatePubkey && typeof message.aggregatorStatePubkey.length === "number" || $util.isString(message.aggregatorStatePubkey)))
                    return "aggregatorStatePubkey: buffer expected";
            if (message.nodePubkeys != null && message.hasOwnProperty("nodePubkeys")) {
                if (!Array.isArray(message.nodePubkeys))
                    return "nodePubkeys: array expected";
                for (var i = 0; i < message.nodePubkeys.length; ++i)
                    if (!(message.nodePubkeys[i] && typeof message.nodePubkeys[i].length === "number" || $util.isString(message.nodePubkeys[i])))
                        return "nodePubkeys: buffer[] expected";
            }
            if (message.slot != null && message.hasOwnProperty("slot"))
                if (!$util.isInteger(message.slot) && !(message.slot && $util.isInteger(message.slot.low) && $util.isInteger(message.slot.high)))
                    return "slot: integer|Long expected";
            return null;
        };
    
        /**
         * Creates a JobPosting message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof JobPosting
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {JobPosting} JobPosting
         */
        JobPosting.fromObject = function fromObject(object) {
            if (object instanceof $root.JobPosting)
                return object;
            var message = new $root.JobPosting();
            if (object.aggregatorStatePubkey != null)
                if (typeof object.aggregatorStatePubkey === "string")
                    $util.base64.decode(object.aggregatorStatePubkey, message.aggregatorStatePubkey = $util.newBuffer($util.base64.length(object.aggregatorStatePubkey)), 0);
                else if (object.aggregatorStatePubkey.length)
                    message.aggregatorStatePubkey = object.aggregatorStatePubkey;
            if (object.nodePubkeys) {
                if (!Array.isArray(object.nodePubkeys))
                    throw TypeError(".JobPosting.nodePubkeys: array expected");
                message.nodePubkeys = [];
                for (var i = 0; i < object.nodePubkeys.length; ++i)
                    if (typeof object.nodePubkeys[i] === "string")
                        $util.base64.decode(object.nodePubkeys[i], message.nodePubkeys[i] = $util.newBuffer($util.base64.length(object.nodePubkeys[i])), 0);
                    else if (object.nodePubkeys[i].length)
                        message.nodePubkeys[i] = object.nodePubkeys[i];
            }
            if (object.slot != null)
                if ($util.Long)
                    (message.slot = $util.Long.fromValue(object.slot)).unsigned = true;
                else if (typeof object.slot === "string")
                    message.slot = parseInt(object.slot, 10);
                else if (typeof object.slot === "number")
                    message.slot = object.slot;
                else if (typeof object.slot === "object")
                    message.slot = new $util.LongBits(object.slot.low >>> 0, object.slot.high >>> 0).toNumber(true);
            return message;
        };
    
        /**
         * Creates a plain object from a JobPosting message. Also converts values to other types if specified.
         * @function toObject
         * @memberof JobPosting
         * @static
         * @param {JobPosting} message JobPosting
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JobPosting.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.nodePubkeys = [];
            if (options.defaults) {
                if (options.bytes === String)
                    object.aggregatorStatePubkey = "";
                else {
                    object.aggregatorStatePubkey = [];
                    if (options.bytes !== Array)
                        object.aggregatorStatePubkey = $util.newBuffer(object.aggregatorStatePubkey);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.slot = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.slot = options.longs === String ? "0" : 0;
            }
            if (message.aggregatorStatePubkey != null && message.hasOwnProperty("aggregatorStatePubkey"))
                object.aggregatorStatePubkey = options.bytes === String ? $util.base64.encode(message.aggregatorStatePubkey, 0, message.aggregatorStatePubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.aggregatorStatePubkey) : message.aggregatorStatePubkey;
            if (message.nodePubkeys && message.nodePubkeys.length) {
                object.nodePubkeys = [];
                for (var j = 0; j < message.nodePubkeys.length; ++j)
                    object.nodePubkeys[j] = options.bytes === String ? $util.base64.encode(message.nodePubkeys[j], 0, message.nodePubkeys[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.nodePubkeys[j]) : message.nodePubkeys[j];
            }
            if (message.slot != null && message.hasOwnProperty("slot"))
                if (typeof message.slot === "number")
                    object.slot = options.longs === String ? String(message.slot) : message.slot;
                else
                    object.slot = options.longs === String ? $util.Long.prototype.toString.call(message.slot) : options.longs === Number ? new $util.LongBits(message.slot.low >>> 0, message.slot.high >>> 0).toNumber(true) : message.slot;
            return object;
        };
    
        /**
         * Converts this JobPosting to JSON.
         * @function toJSON
         * @memberof JobPosting
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JobPosting.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return JobPosting;
    })();
    
    $root.JobResult = (function() {
    
        /**
         * Properties of a JobResult.
         * @exports IJobResult
         * @interface IJobResult
         * @property {Uint8Array|null} [nodePubkey] JobResult nodePubkey
         * @property {number|null} [result] JobResult result
         * @property {boolean|null} [error] JobResult error
         */
    
        /**
         * Constructs a new JobResult.
         * @exports JobResult
         * @classdesc Represents a JobResult.
         * @implements IJobResult
         * @constructor
         * @param {IJobResult=} [properties] Properties to set
         */
        function JobResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * JobResult nodePubkey.
         * @member {Uint8Array} nodePubkey
         * @memberof JobResult
         * @instance
         */
        JobResult.prototype.nodePubkey = $util.newBuffer([]);
    
        /**
         * JobResult result.
         * @member {number} result
         * @memberof JobResult
         * @instance
         */
        JobResult.prototype.result = 0;
    
        /**
         * JobResult error.
         * @member {boolean} error
         * @memberof JobResult
         * @instance
         */
        JobResult.prototype.error = false;
    
        /**
         * Creates a new JobResult instance using the specified properties.
         * @function create
         * @memberof JobResult
         * @static
         * @param {IJobResult=} [properties] Properties to set
         * @returns {JobResult} JobResult instance
         */
        JobResult.create = function create(properties) {
            return new JobResult(properties);
        };
    
        /**
         * Encodes the specified JobResult message. Does not implicitly {@link JobResult.verify|verify} messages.
         * @function encode
         * @memberof JobResult
         * @static
         * @param {IJobResult} message JobResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JobResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodePubkey != null && Object.hasOwnProperty.call(message, "nodePubkey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.nodePubkey);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.result);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.error);
            return writer;
        };
    
        /**
         * Encodes the specified JobResult message, length delimited. Does not implicitly {@link JobResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof JobResult
         * @static
         * @param {IJobResult} message JobResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JobResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a JobResult message from the specified reader or buffer.
         * @function decode
         * @memberof JobResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {JobResult} JobResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JobResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.JobResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.nodePubkey = reader.bytes();
                    break;
                case 3:
                    message.result = reader.double();
                    break;
                case 4:
                    message.error = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a JobResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof JobResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {JobResult} JobResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JobResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a JobResult message.
         * @function verify
         * @memberof JobResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JobResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodePubkey != null && message.hasOwnProperty("nodePubkey"))
                if (!(message.nodePubkey && typeof message.nodePubkey.length === "number" || $util.isString(message.nodePubkey)))
                    return "nodePubkey: buffer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (typeof message.result !== "number")
                    return "result: number expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (typeof message.error !== "boolean")
                    return "error: boolean expected";
            return null;
        };
    
        /**
         * Creates a JobResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof JobResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {JobResult} JobResult
         */
        JobResult.fromObject = function fromObject(object) {
            if (object instanceof $root.JobResult)
                return object;
            var message = new $root.JobResult();
            if (object.nodePubkey != null)
                if (typeof object.nodePubkey === "string")
                    $util.base64.decode(object.nodePubkey, message.nodePubkey = $util.newBuffer($util.base64.length(object.nodePubkey)), 0);
                else if (object.nodePubkey.length)
                    message.nodePubkey = object.nodePubkey;
            if (object.result != null)
                message.result = Number(object.result);
            if (object.error != null)
                message.error = Boolean(object.error);
            return message;
        };
    
        /**
         * Creates a plain object from a JobResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof JobResult
         * @static
         * @param {JobResult} message JobResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JobResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.nodePubkey = "";
                else {
                    object.nodePubkey = [];
                    if (options.bytes !== Array)
                        object.nodePubkey = $util.newBuffer(object.nodePubkey);
                }
                object.result = 0;
                object.error = false;
            }
            if (message.nodePubkey != null && message.hasOwnProperty("nodePubkey"))
                object.nodePubkey = options.bytes === String ? $util.base64.encode(message.nodePubkey, 0, message.nodePubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.nodePubkey) : message.nodePubkey;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.json && !isFinite(message.result) ? String(message.result) : message.result;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            return object;
        };
    
        /**
         * Converts this JobResult to JSON.
         * @function toJSON
         * @memberof JobResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JobResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return JobResult;
    })();
    
    $root.VrfAccountData = (function() {
    
        /**
         * Properties of a VrfAccountData.
         * @exports IVrfAccountData
         * @interface IVrfAccountData
         * @property {Uint8Array|null} [selfPubkey] VrfAccountData selfPubkey
         * @property {Uint8Array|null} [randomnessProducerPubkey] VrfAccountData randomnessProducerPubkey
         * @property {Uint8Array|null} [fulfillmentManagerPubkey] VrfAccountData fulfillmentManagerPubkey
         * @property {number|null} [minProofConfirmations] VrfAccountData minProofConfirmations
         * @property {boolean|null} [lockConfigs] VrfAccountData lockConfigs
         * @property {number|Long|null} [counter] VrfAccountData counter
         * @property {Uint8Array|null} [msg] VrfAccountData msg
         * @property {Uint8Array|null} [value] VrfAccountData value
         * @property {Uint8Array|null} [proof] VrfAccountData proof
         * @property {number|null} [numProofConfirmations] VrfAccountData numProofConfirmations
         * @property {number|Long|null} [lastRequestTimestamp] VrfAccountData lastRequestTimestamp
         * @property {Array.<Uint8Array>|null} [verifierPubkeys] VrfAccountData verifierPubkeys
         */
    
        /**
         * Constructs a new VrfAccountData.
         * @exports VrfAccountData
         * @classdesc Represents a VrfAccountData.
         * @implements IVrfAccountData
         * @constructor
         * @param {IVrfAccountData=} [properties] Properties to set
         */
        function VrfAccountData(properties) {
            this.verifierPubkeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * VrfAccountData selfPubkey.
         * @member {Uint8Array} selfPubkey
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.selfPubkey = $util.newBuffer([]);
    
        /**
         * VrfAccountData randomnessProducerPubkey.
         * @member {Uint8Array} randomnessProducerPubkey
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.randomnessProducerPubkey = $util.newBuffer([]);
    
        /**
         * VrfAccountData fulfillmentManagerPubkey.
         * @member {Uint8Array} fulfillmentManagerPubkey
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.fulfillmentManagerPubkey = $util.newBuffer([]);
    
        /**
         * VrfAccountData minProofConfirmations.
         * @member {number} minProofConfirmations
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.minProofConfirmations = 0;
    
        /**
         * VrfAccountData lockConfigs.
         * @member {boolean} lockConfigs
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.lockConfigs = false;
    
        /**
         * VrfAccountData counter.
         * @member {number|Long} counter
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.counter = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
        /**
         * VrfAccountData msg.
         * @member {Uint8Array} msg
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.msg = $util.newBuffer([]);
    
        /**
         * VrfAccountData value.
         * @member {Uint8Array} value
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.value = $util.newBuffer([]);
    
        /**
         * VrfAccountData proof.
         * @member {Uint8Array} proof
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.proof = $util.newBuffer([]);
    
        /**
         * VrfAccountData numProofConfirmations.
         * @member {number} numProofConfirmations
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.numProofConfirmations = 0;
    
        /**
         * VrfAccountData lastRequestTimestamp.
         * @member {number|Long} lastRequestTimestamp
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.lastRequestTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
        /**
         * VrfAccountData verifierPubkeys.
         * @member {Array.<Uint8Array>} verifierPubkeys
         * @memberof VrfAccountData
         * @instance
         */
        VrfAccountData.prototype.verifierPubkeys = $util.emptyArray;
    
        /**
         * Creates a new VrfAccountData instance using the specified properties.
         * @function create
         * @memberof VrfAccountData
         * @static
         * @param {IVrfAccountData=} [properties] Properties to set
         * @returns {VrfAccountData} VrfAccountData instance
         */
        VrfAccountData.create = function create(properties) {
            return new VrfAccountData(properties);
        };
    
        /**
         * Encodes the specified VrfAccountData message. Does not implicitly {@link VrfAccountData.verify|verify} messages.
         * @function encode
         * @memberof VrfAccountData
         * @static
         * @param {IVrfAccountData} message VrfAccountData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VrfAccountData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.selfPubkey != null && Object.hasOwnProperty.call(message, "selfPubkey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.selfPubkey);
            if (message.randomnessProducerPubkey != null && Object.hasOwnProperty.call(message, "randomnessProducerPubkey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.randomnessProducerPubkey);
            if (message.fulfillmentManagerPubkey != null && Object.hasOwnProperty.call(message, "fulfillmentManagerPubkey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.fulfillmentManagerPubkey);
            if (message.minProofConfirmations != null && Object.hasOwnProperty.call(message, "minProofConfirmations"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.minProofConfirmations);
            if (message.lockConfigs != null && Object.hasOwnProperty.call(message, "lockConfigs"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.lockConfigs);
            if (message.counter != null && Object.hasOwnProperty.call(message, "counter"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.counter);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.msg);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.value);
            if (message.proof != null && Object.hasOwnProperty.call(message, "proof"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.proof);
            if (message.numProofConfirmations != null && Object.hasOwnProperty.call(message, "numProofConfirmations"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.numProofConfirmations);
            if (message.lastRequestTimestamp != null && Object.hasOwnProperty.call(message, "lastRequestTimestamp"))
                writer.uint32(/* id 11, wireType 0 =*/88).int64(message.lastRequestTimestamp);
            if (message.verifierPubkeys != null && message.verifierPubkeys.length)
                for (var i = 0; i < message.verifierPubkeys.length; ++i)
                    writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.verifierPubkeys[i]);
            return writer;
        };
    
        /**
         * Encodes the specified VrfAccountData message, length delimited. Does not implicitly {@link VrfAccountData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VrfAccountData
         * @static
         * @param {IVrfAccountData} message VrfAccountData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VrfAccountData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a VrfAccountData message from the specified reader or buffer.
         * @function decode
         * @memberof VrfAccountData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VrfAccountData} VrfAccountData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VrfAccountData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VrfAccountData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.selfPubkey = reader.bytes();
                    break;
                case 2:
                    message.randomnessProducerPubkey = reader.bytes();
                    break;
                case 3:
                    message.fulfillmentManagerPubkey = reader.bytes();
                    break;
                case 4:
                    message.minProofConfirmations = reader.int32();
                    break;
                case 5:
                    message.lockConfigs = reader.bool();
                    break;
                case 6:
                    message.counter = reader.uint64();
                    break;
                case 7:
                    message.msg = reader.bytes();
                    break;
                case 8:
                    message.value = reader.bytes();
                    break;
                case 9:
                    message.proof = reader.bytes();
                    break;
                case 10:
                    message.numProofConfirmations = reader.int32();
                    break;
                case 11:
                    message.lastRequestTimestamp = reader.int64();
                    break;
                case 12:
                    if (!(message.verifierPubkeys && message.verifierPubkeys.length))
                        message.verifierPubkeys = [];
                    message.verifierPubkeys.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a VrfAccountData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VrfAccountData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VrfAccountData} VrfAccountData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VrfAccountData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a VrfAccountData message.
         * @function verify
         * @memberof VrfAccountData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VrfAccountData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.selfPubkey != null && message.hasOwnProperty("selfPubkey"))
                if (!(message.selfPubkey && typeof message.selfPubkey.length === "number" || $util.isString(message.selfPubkey)))
                    return "selfPubkey: buffer expected";
            if (message.randomnessProducerPubkey != null && message.hasOwnProperty("randomnessProducerPubkey"))
                if (!(message.randomnessProducerPubkey && typeof message.randomnessProducerPubkey.length === "number" || $util.isString(message.randomnessProducerPubkey)))
                    return "randomnessProducerPubkey: buffer expected";
            if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                if (!(message.fulfillmentManagerPubkey && typeof message.fulfillmentManagerPubkey.length === "number" || $util.isString(message.fulfillmentManagerPubkey)))
                    return "fulfillmentManagerPubkey: buffer expected";
            if (message.minProofConfirmations != null && message.hasOwnProperty("minProofConfirmations"))
                if (!$util.isInteger(message.minProofConfirmations))
                    return "minProofConfirmations: integer expected";
            if (message.lockConfigs != null && message.hasOwnProperty("lockConfigs"))
                if (typeof message.lockConfigs !== "boolean")
                    return "lockConfigs: boolean expected";
            if (message.counter != null && message.hasOwnProperty("counter"))
                if (!$util.isInteger(message.counter) && !(message.counter && $util.isInteger(message.counter.low) && $util.isInteger(message.counter.high)))
                    return "counter: integer|Long expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!(message.msg && typeof message.msg.length === "number" || $util.isString(message.msg)))
                    return "msg: buffer expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                    return "value: buffer expected";
            if (message.proof != null && message.hasOwnProperty("proof"))
                if (!(message.proof && typeof message.proof.length === "number" || $util.isString(message.proof)))
                    return "proof: buffer expected";
            if (message.numProofConfirmations != null && message.hasOwnProperty("numProofConfirmations"))
                if (!$util.isInteger(message.numProofConfirmations))
                    return "numProofConfirmations: integer expected";
            if (message.lastRequestTimestamp != null && message.hasOwnProperty("lastRequestTimestamp"))
                if (!$util.isInteger(message.lastRequestTimestamp) && !(message.lastRequestTimestamp && $util.isInteger(message.lastRequestTimestamp.low) && $util.isInteger(message.lastRequestTimestamp.high)))
                    return "lastRequestTimestamp: integer|Long expected";
            if (message.verifierPubkeys != null && message.hasOwnProperty("verifierPubkeys")) {
                if (!Array.isArray(message.verifierPubkeys))
                    return "verifierPubkeys: array expected";
                for (var i = 0; i < message.verifierPubkeys.length; ++i)
                    if (!(message.verifierPubkeys[i] && typeof message.verifierPubkeys[i].length === "number" || $util.isString(message.verifierPubkeys[i])))
                        return "verifierPubkeys: buffer[] expected";
            }
            return null;
        };
    
        /**
         * Creates a VrfAccountData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VrfAccountData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VrfAccountData} VrfAccountData
         */
        VrfAccountData.fromObject = function fromObject(object) {
            if (object instanceof $root.VrfAccountData)
                return object;
            var message = new $root.VrfAccountData();
            if (object.selfPubkey != null)
                if (typeof object.selfPubkey === "string")
                    $util.base64.decode(object.selfPubkey, message.selfPubkey = $util.newBuffer($util.base64.length(object.selfPubkey)), 0);
                else if (object.selfPubkey.length)
                    message.selfPubkey = object.selfPubkey;
            if (object.randomnessProducerPubkey != null)
                if (typeof object.randomnessProducerPubkey === "string")
                    $util.base64.decode(object.randomnessProducerPubkey, message.randomnessProducerPubkey = $util.newBuffer($util.base64.length(object.randomnessProducerPubkey)), 0);
                else if (object.randomnessProducerPubkey.length)
                    message.randomnessProducerPubkey = object.randomnessProducerPubkey;
            if (object.fulfillmentManagerPubkey != null)
                if (typeof object.fulfillmentManagerPubkey === "string")
                    $util.base64.decode(object.fulfillmentManagerPubkey, message.fulfillmentManagerPubkey = $util.newBuffer($util.base64.length(object.fulfillmentManagerPubkey)), 0);
                else if (object.fulfillmentManagerPubkey.length)
                    message.fulfillmentManagerPubkey = object.fulfillmentManagerPubkey;
            if (object.minProofConfirmations != null)
                message.minProofConfirmations = object.minProofConfirmations | 0;
            if (object.lockConfigs != null)
                message.lockConfigs = Boolean(object.lockConfigs);
            if (object.counter != null)
                if ($util.Long)
                    (message.counter = $util.Long.fromValue(object.counter)).unsigned = true;
                else if (typeof object.counter === "string")
                    message.counter = parseInt(object.counter, 10);
                else if (typeof object.counter === "number")
                    message.counter = object.counter;
                else if (typeof object.counter === "object")
                    message.counter = new $util.LongBits(object.counter.low >>> 0, object.counter.high >>> 0).toNumber(true);
            if (object.msg != null)
                if (typeof object.msg === "string")
                    $util.base64.decode(object.msg, message.msg = $util.newBuffer($util.base64.length(object.msg)), 0);
                else if (object.msg.length)
                    message.msg = object.msg;
            if (object.value != null)
                if (typeof object.value === "string")
                    $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                else if (object.value.length)
                    message.value = object.value;
            if (object.proof != null)
                if (typeof object.proof === "string")
                    $util.base64.decode(object.proof, message.proof = $util.newBuffer($util.base64.length(object.proof)), 0);
                else if (object.proof.length)
                    message.proof = object.proof;
            if (object.numProofConfirmations != null)
                message.numProofConfirmations = object.numProofConfirmations | 0;
            if (object.lastRequestTimestamp != null)
                if ($util.Long)
                    (message.lastRequestTimestamp = $util.Long.fromValue(object.lastRequestTimestamp)).unsigned = false;
                else if (typeof object.lastRequestTimestamp === "string")
                    message.lastRequestTimestamp = parseInt(object.lastRequestTimestamp, 10);
                else if (typeof object.lastRequestTimestamp === "number")
                    message.lastRequestTimestamp = object.lastRequestTimestamp;
                else if (typeof object.lastRequestTimestamp === "object")
                    message.lastRequestTimestamp = new $util.LongBits(object.lastRequestTimestamp.low >>> 0, object.lastRequestTimestamp.high >>> 0).toNumber();
            if (object.verifierPubkeys) {
                if (!Array.isArray(object.verifierPubkeys))
                    throw TypeError(".VrfAccountData.verifierPubkeys: array expected");
                message.verifierPubkeys = [];
                for (var i = 0; i < object.verifierPubkeys.length; ++i)
                    if (typeof object.verifierPubkeys[i] === "string")
                        $util.base64.decode(object.verifierPubkeys[i], message.verifierPubkeys[i] = $util.newBuffer($util.base64.length(object.verifierPubkeys[i])), 0);
                    else if (object.verifierPubkeys[i].length)
                        message.verifierPubkeys[i] = object.verifierPubkeys[i];
            }
            return message;
        };
    
        /**
         * Creates a plain object from a VrfAccountData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VrfAccountData
         * @static
         * @param {VrfAccountData} message VrfAccountData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VrfAccountData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.verifierPubkeys = [];
            if (options.defaults) {
                if (options.bytes === String)
                    object.selfPubkey = "";
                else {
                    object.selfPubkey = [];
                    if (options.bytes !== Array)
                        object.selfPubkey = $util.newBuffer(object.selfPubkey);
                }
                if (options.bytes === String)
                    object.randomnessProducerPubkey = "";
                else {
                    object.randomnessProducerPubkey = [];
                    if (options.bytes !== Array)
                        object.randomnessProducerPubkey = $util.newBuffer(object.randomnessProducerPubkey);
                }
                if (options.bytes === String)
                    object.fulfillmentManagerPubkey = "";
                else {
                    object.fulfillmentManagerPubkey = [];
                    if (options.bytes !== Array)
                        object.fulfillmentManagerPubkey = $util.newBuffer(object.fulfillmentManagerPubkey);
                }
                object.minProofConfirmations = 0;
                object.lockConfigs = false;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.counter = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.counter = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.msg = "";
                else {
                    object.msg = [];
                    if (options.bytes !== Array)
                        object.msg = $util.newBuffer(object.msg);
                }
                if (options.bytes === String)
                    object.value = "";
                else {
                    object.value = [];
                    if (options.bytes !== Array)
                        object.value = $util.newBuffer(object.value);
                }
                if (options.bytes === String)
                    object.proof = "";
                else {
                    object.proof = [];
                    if (options.bytes !== Array)
                        object.proof = $util.newBuffer(object.proof);
                }
                object.numProofConfirmations = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.lastRequestTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lastRequestTimestamp = options.longs === String ? "0" : 0;
            }
            if (message.selfPubkey != null && message.hasOwnProperty("selfPubkey"))
                object.selfPubkey = options.bytes === String ? $util.base64.encode(message.selfPubkey, 0, message.selfPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.selfPubkey) : message.selfPubkey;
            if (message.randomnessProducerPubkey != null && message.hasOwnProperty("randomnessProducerPubkey"))
                object.randomnessProducerPubkey = options.bytes === String ? $util.base64.encode(message.randomnessProducerPubkey, 0, message.randomnessProducerPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.randomnessProducerPubkey) : message.randomnessProducerPubkey;
            if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                object.fulfillmentManagerPubkey = options.bytes === String ? $util.base64.encode(message.fulfillmentManagerPubkey, 0, message.fulfillmentManagerPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.fulfillmentManagerPubkey) : message.fulfillmentManagerPubkey;
            if (message.minProofConfirmations != null && message.hasOwnProperty("minProofConfirmations"))
                object.minProofConfirmations = message.minProofConfirmations;
            if (message.lockConfigs != null && message.hasOwnProperty("lockConfigs"))
                object.lockConfigs = message.lockConfigs;
            if (message.counter != null && message.hasOwnProperty("counter"))
                if (typeof message.counter === "number")
                    object.counter = options.longs === String ? String(message.counter) : message.counter;
                else
                    object.counter = options.longs === String ? $util.Long.prototype.toString.call(message.counter) : options.longs === Number ? new $util.LongBits(message.counter.low >>> 0, message.counter.high >>> 0).toNumber(true) : message.counter;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = options.bytes === String ? $util.base64.encode(message.msg, 0, message.msg.length) : options.bytes === Array ? Array.prototype.slice.call(message.msg) : message.msg;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
            if (message.proof != null && message.hasOwnProperty("proof"))
                object.proof = options.bytes === String ? $util.base64.encode(message.proof, 0, message.proof.length) : options.bytes === Array ? Array.prototype.slice.call(message.proof) : message.proof;
            if (message.numProofConfirmations != null && message.hasOwnProperty("numProofConfirmations"))
                object.numProofConfirmations = message.numProofConfirmations;
            if (message.lastRequestTimestamp != null && message.hasOwnProperty("lastRequestTimestamp"))
                if (typeof message.lastRequestTimestamp === "number")
                    object.lastRequestTimestamp = options.longs === String ? String(message.lastRequestTimestamp) : message.lastRequestTimestamp;
                else
                    object.lastRequestTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.lastRequestTimestamp) : options.longs === Number ? new $util.LongBits(message.lastRequestTimestamp.low >>> 0, message.lastRequestTimestamp.high >>> 0).toNumber() : message.lastRequestTimestamp;
            if (message.verifierPubkeys && message.verifierPubkeys.length) {
                object.verifierPubkeys = [];
                for (var j = 0; j < message.verifierPubkeys.length; ++j)
                    object.verifierPubkeys[j] = options.bytes === String ? $util.base64.encode(message.verifierPubkeys[j], 0, message.verifierPubkeys[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.verifierPubkeys[j]) : message.verifierPubkeys[j];
            }
            return object;
        };
    
        /**
         * Converts this VrfAccountData to JSON.
         * @function toJSON
         * @memberof VrfAccountData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VrfAccountData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return VrfAccountData;
    })();
    
    $root.VrfPermitAccountData = (function() {
    
        /**
         * Properties of a VrfPermitAccountData.
         * @exports IVrfPermitAccountData
         * @interface IVrfPermitAccountData
         * @property {Uint8Array|null} [granter] VrfPermitAccountData granter
         * @property {Uint8Array|null} [grantee] VrfPermitAccountData grantee
         * @property {boolean|null} [enabled] VrfPermitAccountData enabled
         */
    
        /**
         * Constructs a new VrfPermitAccountData.
         * @exports VrfPermitAccountData
         * @classdesc Represents a VrfPermitAccountData.
         * @implements IVrfPermitAccountData
         * @constructor
         * @param {IVrfPermitAccountData=} [properties] Properties to set
         */
        function VrfPermitAccountData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * VrfPermitAccountData granter.
         * @member {Uint8Array} granter
         * @memberof VrfPermitAccountData
         * @instance
         */
        VrfPermitAccountData.prototype.granter = $util.newBuffer([]);
    
        /**
         * VrfPermitAccountData grantee.
         * @member {Uint8Array} grantee
         * @memberof VrfPermitAccountData
         * @instance
         */
        VrfPermitAccountData.prototype.grantee = $util.newBuffer([]);
    
        /**
         * VrfPermitAccountData enabled.
         * @member {boolean} enabled
         * @memberof VrfPermitAccountData
         * @instance
         */
        VrfPermitAccountData.prototype.enabled = false;
    
        /**
         * Creates a new VrfPermitAccountData instance using the specified properties.
         * @function create
         * @memberof VrfPermitAccountData
         * @static
         * @param {IVrfPermitAccountData=} [properties] Properties to set
         * @returns {VrfPermitAccountData} VrfPermitAccountData instance
         */
        VrfPermitAccountData.create = function create(properties) {
            return new VrfPermitAccountData(properties);
        };
    
        /**
         * Encodes the specified VrfPermitAccountData message. Does not implicitly {@link VrfPermitAccountData.verify|verify} messages.
         * @function encode
         * @memberof VrfPermitAccountData
         * @static
         * @param {IVrfPermitAccountData} message VrfPermitAccountData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VrfPermitAccountData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.granter != null && Object.hasOwnProperty.call(message, "granter"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.granter);
            if (message.grantee != null && Object.hasOwnProperty.call(message, "grantee"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.grantee);
            if (message.enabled != null && Object.hasOwnProperty.call(message, "enabled"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.enabled);
            return writer;
        };
    
        /**
         * Encodes the specified VrfPermitAccountData message, length delimited. Does not implicitly {@link VrfPermitAccountData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VrfPermitAccountData
         * @static
         * @param {IVrfPermitAccountData} message VrfPermitAccountData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VrfPermitAccountData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a VrfPermitAccountData message from the specified reader or buffer.
         * @function decode
         * @memberof VrfPermitAccountData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VrfPermitAccountData} VrfPermitAccountData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VrfPermitAccountData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VrfPermitAccountData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.granter = reader.bytes();
                    break;
                case 2:
                    message.grantee = reader.bytes();
                    break;
                case 3:
                    message.enabled = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a VrfPermitAccountData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VrfPermitAccountData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VrfPermitAccountData} VrfPermitAccountData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VrfPermitAccountData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a VrfPermitAccountData message.
         * @function verify
         * @memberof VrfPermitAccountData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VrfPermitAccountData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.granter != null && message.hasOwnProperty("granter"))
                if (!(message.granter && typeof message.granter.length === "number" || $util.isString(message.granter)))
                    return "granter: buffer expected";
            if (message.grantee != null && message.hasOwnProperty("grantee"))
                if (!(message.grantee && typeof message.grantee.length === "number" || $util.isString(message.grantee)))
                    return "grantee: buffer expected";
            if (message.enabled != null && message.hasOwnProperty("enabled"))
                if (typeof message.enabled !== "boolean")
                    return "enabled: boolean expected";
            return null;
        };
    
        /**
         * Creates a VrfPermitAccountData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VrfPermitAccountData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VrfPermitAccountData} VrfPermitAccountData
         */
        VrfPermitAccountData.fromObject = function fromObject(object) {
            if (object instanceof $root.VrfPermitAccountData)
                return object;
            var message = new $root.VrfPermitAccountData();
            if (object.granter != null)
                if (typeof object.granter === "string")
                    $util.base64.decode(object.granter, message.granter = $util.newBuffer($util.base64.length(object.granter)), 0);
                else if (object.granter.length)
                    message.granter = object.granter;
            if (object.grantee != null)
                if (typeof object.grantee === "string")
                    $util.base64.decode(object.grantee, message.grantee = $util.newBuffer($util.base64.length(object.grantee)), 0);
                else if (object.grantee.length)
                    message.grantee = object.grantee;
            if (object.enabled != null)
                message.enabled = Boolean(object.enabled);
            return message;
        };
    
        /**
         * Creates a plain object from a VrfPermitAccountData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VrfPermitAccountData
         * @static
         * @param {VrfPermitAccountData} message VrfPermitAccountData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VrfPermitAccountData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.granter = "";
                else {
                    object.granter = [];
                    if (options.bytes !== Array)
                        object.granter = $util.newBuffer(object.granter);
                }
                if (options.bytes === String)
                    object.grantee = "";
                else {
                    object.grantee = [];
                    if (options.bytes !== Array)
                        object.grantee = $util.newBuffer(object.grantee);
                }
                object.enabled = false;
            }
            if (message.granter != null && message.hasOwnProperty("granter"))
                object.granter = options.bytes === String ? $util.base64.encode(message.granter, 0, message.granter.length) : options.bytes === Array ? Array.prototype.slice.call(message.granter) : message.granter;
            if (message.grantee != null && message.hasOwnProperty("grantee"))
                object.grantee = options.bytes === String ? $util.base64.encode(message.grantee, 0, message.grantee.length) : options.bytes === Array ? Array.prototype.slice.call(message.grantee) : message.grantee;
            if (message.enabled != null && message.hasOwnProperty("enabled"))
                object.enabled = message.enabled;
            return object;
        };
    
        /**
         * Converts this VrfPermitAccountData to JSON.
         * @function toJSON
         * @memberof VrfPermitAccountData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VrfPermitAccountData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return VrfPermitAccountData;
    })();
    
    $root.BundleAuth = (function() {
    
        /**
         * Properties of a BundleAuth.
         * @exports IBundleAuth
         * @interface IBundleAuth
         * @property {number|null} [version] BundleAuth version
         * @property {Uint8Array|null} [aggregatorAddress] BundleAuth aggregatorAddress
         * @property {Uint8Array|null} [bundleAddress] BundleAuth bundleAddress
         * @property {number|null} [idx] BundleAuth idx
         */
    
        /**
         * Constructs a new BundleAuth.
         * @exports BundleAuth
         * @classdesc Represents a BundleAuth.
         * @implements IBundleAuth
         * @constructor
         * @param {IBundleAuth=} [properties] Properties to set
         */
        function BundleAuth(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * BundleAuth version.
         * @member {number} version
         * @memberof BundleAuth
         * @instance
         */
        BundleAuth.prototype.version = 0;
    
        /**
         * BundleAuth aggregatorAddress.
         * @member {Uint8Array} aggregatorAddress
         * @memberof BundleAuth
         * @instance
         */
        BundleAuth.prototype.aggregatorAddress = $util.newBuffer([]);
    
        /**
         * BundleAuth bundleAddress.
         * @member {Uint8Array} bundleAddress
         * @memberof BundleAuth
         * @instance
         */
        BundleAuth.prototype.bundleAddress = $util.newBuffer([]);
    
        /**
         * BundleAuth idx.
         * @member {number} idx
         * @memberof BundleAuth
         * @instance
         */
        BundleAuth.prototype.idx = 0;
    
        /**
         * Creates a new BundleAuth instance using the specified properties.
         * @function create
         * @memberof BundleAuth
         * @static
         * @param {IBundleAuth=} [properties] Properties to set
         * @returns {BundleAuth} BundleAuth instance
         */
        BundleAuth.create = function create(properties) {
            return new BundleAuth(properties);
        };
    
        /**
         * Encodes the specified BundleAuth message. Does not implicitly {@link BundleAuth.verify|verify} messages.
         * @function encode
         * @memberof BundleAuth
         * @static
         * @param {IBundleAuth} message BundleAuth message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BundleAuth.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.aggregatorAddress != null && Object.hasOwnProperty.call(message, "aggregatorAddress"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.aggregatorAddress);
            if (message.bundleAddress != null && Object.hasOwnProperty.call(message, "bundleAddress"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.bundleAddress);
            if (message.idx != null && Object.hasOwnProperty.call(message, "idx"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.idx);
            return writer;
        };
    
        /**
         * Encodes the specified BundleAuth message, length delimited. Does not implicitly {@link BundleAuth.verify|verify} messages.
         * @function encodeDelimited
         * @memberof BundleAuth
         * @static
         * @param {IBundleAuth} message BundleAuth message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BundleAuth.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a BundleAuth message from the specified reader or buffer.
         * @function decode
         * @memberof BundleAuth
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {BundleAuth} BundleAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BundleAuth.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BundleAuth();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.uint32();
                    break;
                case 2:
                    message.aggregatorAddress = reader.bytes();
                    break;
                case 3:
                    message.bundleAddress = reader.bytes();
                    break;
                case 4:
                    message.idx = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a BundleAuth message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof BundleAuth
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {BundleAuth} BundleAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BundleAuth.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a BundleAuth message.
         * @function verify
         * @memberof BundleAuth
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BundleAuth.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.aggregatorAddress != null && message.hasOwnProperty("aggregatorAddress"))
                if (!(message.aggregatorAddress && typeof message.aggregatorAddress.length === "number" || $util.isString(message.aggregatorAddress)))
                    return "aggregatorAddress: buffer expected";
            if (message.bundleAddress != null && message.hasOwnProperty("bundleAddress"))
                if (!(message.bundleAddress && typeof message.bundleAddress.length === "number" || $util.isString(message.bundleAddress)))
                    return "bundleAddress: buffer expected";
            if (message.idx != null && message.hasOwnProperty("idx"))
                if (!$util.isInteger(message.idx))
                    return "idx: integer expected";
            return null;
        };
    
        /**
         * Creates a BundleAuth message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof BundleAuth
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {BundleAuth} BundleAuth
         */
        BundleAuth.fromObject = function fromObject(object) {
            if (object instanceof $root.BundleAuth)
                return object;
            var message = new $root.BundleAuth();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.aggregatorAddress != null)
                if (typeof object.aggregatorAddress === "string")
                    $util.base64.decode(object.aggregatorAddress, message.aggregatorAddress = $util.newBuffer($util.base64.length(object.aggregatorAddress)), 0);
                else if (object.aggregatorAddress.length)
                    message.aggregatorAddress = object.aggregatorAddress;
            if (object.bundleAddress != null)
                if (typeof object.bundleAddress === "string")
                    $util.base64.decode(object.bundleAddress, message.bundleAddress = $util.newBuffer($util.base64.length(object.bundleAddress)), 0);
                else if (object.bundleAddress.length)
                    message.bundleAddress = object.bundleAddress;
            if (object.idx != null)
                message.idx = object.idx | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a BundleAuth message. Also converts values to other types if specified.
         * @function toObject
         * @memberof BundleAuth
         * @static
         * @param {BundleAuth} message BundleAuth
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BundleAuth.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.version = 0;
                if (options.bytes === String)
                    object.aggregatorAddress = "";
                else {
                    object.aggregatorAddress = [];
                    if (options.bytes !== Array)
                        object.aggregatorAddress = $util.newBuffer(object.aggregatorAddress);
                }
                if (options.bytes === String)
                    object.bundleAddress = "";
                else {
                    object.bundleAddress = [];
                    if (options.bytes !== Array)
                        object.bundleAddress = $util.newBuffer(object.bundleAddress);
                }
                object.idx = 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.aggregatorAddress != null && message.hasOwnProperty("aggregatorAddress"))
                object.aggregatorAddress = options.bytes === String ? $util.base64.encode(message.aggregatorAddress, 0, message.aggregatorAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.aggregatorAddress) : message.aggregatorAddress;
            if (message.bundleAddress != null && message.hasOwnProperty("bundleAddress"))
                object.bundleAddress = options.bytes === String ? $util.base64.encode(message.bundleAddress, 0, message.bundleAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.bundleAddress) : message.bundleAddress;
            if (message.idx != null && message.hasOwnProperty("idx"))
                object.idx = message.idx;
            return object;
        };
    
        /**
         * Converts this BundleAuth to JSON.
         * @function toJSON
         * @memberof BundleAuth
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BundleAuth.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return BundleAuth;
    })();
    
    $root.FulfillmentEntry = (function() {
    
        /**
         * Properties of a FulfillmentEntry.
         * @exports IFulfillmentEntry
         * @interface IFulfillmentEntry
         * @property {Uint8Array|null} [nodePubkey] FulfillmentEntry nodePubkey
         * @property {number|null} [leaseCount] FulfillmentEntry leaseCount
         * @property {number|null} [slotExpiration] FulfillmentEntry slotExpiration
         */
    
        /**
         * Constructs a new FulfillmentEntry.
         * @exports FulfillmentEntry
         * @classdesc Represents a FulfillmentEntry.
         * @implements IFulfillmentEntry
         * @constructor
         * @param {IFulfillmentEntry=} [properties] Properties to set
         */
        function FulfillmentEntry(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * FulfillmentEntry nodePubkey.
         * @member {Uint8Array} nodePubkey
         * @memberof FulfillmentEntry
         * @instance
         */
        FulfillmentEntry.prototype.nodePubkey = $util.newBuffer([]);
    
        /**
         * FulfillmentEntry leaseCount.
         * @member {number} leaseCount
         * @memberof FulfillmentEntry
         * @instance
         */
        FulfillmentEntry.prototype.leaseCount = 0;
    
        /**
         * FulfillmentEntry slotExpiration.
         * @member {number} slotExpiration
         * @memberof FulfillmentEntry
         * @instance
         */
        FulfillmentEntry.prototype.slotExpiration = 0;
    
        /**
         * Creates a new FulfillmentEntry instance using the specified properties.
         * @function create
         * @memberof FulfillmentEntry
         * @static
         * @param {IFulfillmentEntry=} [properties] Properties to set
         * @returns {FulfillmentEntry} FulfillmentEntry instance
         */
        FulfillmentEntry.create = function create(properties) {
            return new FulfillmentEntry(properties);
        };
    
        /**
         * Encodes the specified FulfillmentEntry message. Does not implicitly {@link FulfillmentEntry.verify|verify} messages.
         * @function encode
         * @memberof FulfillmentEntry
         * @static
         * @param {IFulfillmentEntry} message FulfillmentEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodePubkey != null && Object.hasOwnProperty.call(message, "nodePubkey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.nodePubkey);
            if (message.leaseCount != null && Object.hasOwnProperty.call(message, "leaseCount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.leaseCount);
            if (message.slotExpiration != null && Object.hasOwnProperty.call(message, "slotExpiration"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.slotExpiration);
            return writer;
        };
    
        /**
         * Encodes the specified FulfillmentEntry message, length delimited. Does not implicitly {@link FulfillmentEntry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof FulfillmentEntry
         * @static
         * @param {IFulfillmentEntry} message FulfillmentEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentEntry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a FulfillmentEntry message from the specified reader or buffer.
         * @function decode
         * @memberof FulfillmentEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FulfillmentEntry} FulfillmentEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentEntry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FulfillmentEntry();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nodePubkey = reader.bytes();
                    break;
                case 2:
                    message.leaseCount = reader.int32();
                    break;
                case 3:
                    message.slotExpiration = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a FulfillmentEntry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof FulfillmentEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {FulfillmentEntry} FulfillmentEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentEntry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a FulfillmentEntry message.
         * @function verify
         * @memberof FulfillmentEntry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FulfillmentEntry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodePubkey != null && message.hasOwnProperty("nodePubkey"))
                if (!(message.nodePubkey && typeof message.nodePubkey.length === "number" || $util.isString(message.nodePubkey)))
                    return "nodePubkey: buffer expected";
            if (message.leaseCount != null && message.hasOwnProperty("leaseCount"))
                if (!$util.isInteger(message.leaseCount))
                    return "leaseCount: integer expected";
            if (message.slotExpiration != null && message.hasOwnProperty("slotExpiration"))
                if (!$util.isInteger(message.slotExpiration))
                    return "slotExpiration: integer expected";
            return null;
        };
    
        /**
         * Creates a FulfillmentEntry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof FulfillmentEntry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {FulfillmentEntry} FulfillmentEntry
         */
        FulfillmentEntry.fromObject = function fromObject(object) {
            if (object instanceof $root.FulfillmentEntry)
                return object;
            var message = new $root.FulfillmentEntry();
            if (object.nodePubkey != null)
                if (typeof object.nodePubkey === "string")
                    $util.base64.decode(object.nodePubkey, message.nodePubkey = $util.newBuffer($util.base64.length(object.nodePubkey)), 0);
                else if (object.nodePubkey.length)
                    message.nodePubkey = object.nodePubkey;
            if (object.leaseCount != null)
                message.leaseCount = object.leaseCount | 0;
            if (object.slotExpiration != null)
                message.slotExpiration = object.slotExpiration | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a FulfillmentEntry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof FulfillmentEntry
         * @static
         * @param {FulfillmentEntry} message FulfillmentEntry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FulfillmentEntry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.nodePubkey = "";
                else {
                    object.nodePubkey = [];
                    if (options.bytes !== Array)
                        object.nodePubkey = $util.newBuffer(object.nodePubkey);
                }
                object.leaseCount = 0;
                object.slotExpiration = 0;
            }
            if (message.nodePubkey != null && message.hasOwnProperty("nodePubkey"))
                object.nodePubkey = options.bytes === String ? $util.base64.encode(message.nodePubkey, 0, message.nodePubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.nodePubkey) : message.nodePubkey;
            if (message.leaseCount != null && message.hasOwnProperty("leaseCount"))
                object.leaseCount = message.leaseCount;
            if (message.slotExpiration != null && message.hasOwnProperty("slotExpiration"))
                object.slotExpiration = message.slotExpiration;
            return object;
        };
    
        /**
         * Converts this FulfillmentEntry to JSON.
         * @function toJSON
         * @memberof FulfillmentEntry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FulfillmentEntry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return FulfillmentEntry;
    })();
    
    $root.FulfillmentManagerAuth = (function() {
    
        /**
         * Properties of a FulfillmentManagerAuth.
         * @exports IFulfillmentManagerAuth
         * @interface IFulfillmentManagerAuth
         * @property {Uint8Array|null} [nomineePubkey] FulfillmentManagerAuth nomineePubkey
         * @property {Uint8Array|null} [fulfillmentManagerPubkey] FulfillmentManagerAuth fulfillmentManagerPubkey
         * @property {boolean|null} [authorizeHeartbeat] FulfillmentManagerAuth authorizeHeartbeat
         * @property {boolean|null} [authorizeUsage] FulfillmentManagerAuth authorizeUsage
         */
    
        /**
         * Constructs a new FulfillmentManagerAuth.
         * @exports FulfillmentManagerAuth
         * @classdesc Represents a FulfillmentManagerAuth.
         * @implements IFulfillmentManagerAuth
         * @constructor
         * @param {IFulfillmentManagerAuth=} [properties] Properties to set
         */
        function FulfillmentManagerAuth(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * FulfillmentManagerAuth nomineePubkey.
         * @member {Uint8Array} nomineePubkey
         * @memberof FulfillmentManagerAuth
         * @instance
         */
        FulfillmentManagerAuth.prototype.nomineePubkey = $util.newBuffer([]);
    
        /**
         * FulfillmentManagerAuth fulfillmentManagerPubkey.
         * @member {Uint8Array} fulfillmentManagerPubkey
         * @memberof FulfillmentManagerAuth
         * @instance
         */
        FulfillmentManagerAuth.prototype.fulfillmentManagerPubkey = $util.newBuffer([]);
    
        /**
         * FulfillmentManagerAuth authorizeHeartbeat.
         * @member {boolean} authorizeHeartbeat
         * @memberof FulfillmentManagerAuth
         * @instance
         */
        FulfillmentManagerAuth.prototype.authorizeHeartbeat = false;
    
        /**
         * FulfillmentManagerAuth authorizeUsage.
         * @member {boolean} authorizeUsage
         * @memberof FulfillmentManagerAuth
         * @instance
         */
        FulfillmentManagerAuth.prototype.authorizeUsage = false;
    
        /**
         * Creates a new FulfillmentManagerAuth instance using the specified properties.
         * @function create
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {IFulfillmentManagerAuth=} [properties] Properties to set
         * @returns {FulfillmentManagerAuth} FulfillmentManagerAuth instance
         */
        FulfillmentManagerAuth.create = function create(properties) {
            return new FulfillmentManagerAuth(properties);
        };
    
        /**
         * Encodes the specified FulfillmentManagerAuth message. Does not implicitly {@link FulfillmentManagerAuth.verify|verify} messages.
         * @function encode
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {IFulfillmentManagerAuth} message FulfillmentManagerAuth message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentManagerAuth.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nomineePubkey != null && Object.hasOwnProperty.call(message, "nomineePubkey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.nomineePubkey);
            if (message.fulfillmentManagerPubkey != null && Object.hasOwnProperty.call(message, "fulfillmentManagerPubkey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.fulfillmentManagerPubkey);
            if (message.authorizeHeartbeat != null && Object.hasOwnProperty.call(message, "authorizeHeartbeat"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.authorizeHeartbeat);
            if (message.authorizeUsage != null && Object.hasOwnProperty.call(message, "authorizeUsage"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.authorizeUsage);
            return writer;
        };
    
        /**
         * Encodes the specified FulfillmentManagerAuth message, length delimited. Does not implicitly {@link FulfillmentManagerAuth.verify|verify} messages.
         * @function encodeDelimited
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {IFulfillmentManagerAuth} message FulfillmentManagerAuth message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentManagerAuth.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a FulfillmentManagerAuth message from the specified reader or buffer.
         * @function decode
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FulfillmentManagerAuth} FulfillmentManagerAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentManagerAuth.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FulfillmentManagerAuth();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nomineePubkey = reader.bytes();
                    break;
                case 2:
                    message.fulfillmentManagerPubkey = reader.bytes();
                    break;
                case 3:
                    message.authorizeHeartbeat = reader.bool();
                    break;
                case 4:
                    message.authorizeUsage = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a FulfillmentManagerAuth message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {FulfillmentManagerAuth} FulfillmentManagerAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentManagerAuth.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a FulfillmentManagerAuth message.
         * @function verify
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FulfillmentManagerAuth.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nomineePubkey != null && message.hasOwnProperty("nomineePubkey"))
                if (!(message.nomineePubkey && typeof message.nomineePubkey.length === "number" || $util.isString(message.nomineePubkey)))
                    return "nomineePubkey: buffer expected";
            if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                if (!(message.fulfillmentManagerPubkey && typeof message.fulfillmentManagerPubkey.length === "number" || $util.isString(message.fulfillmentManagerPubkey)))
                    return "fulfillmentManagerPubkey: buffer expected";
            if (message.authorizeHeartbeat != null && message.hasOwnProperty("authorizeHeartbeat"))
                if (typeof message.authorizeHeartbeat !== "boolean")
                    return "authorizeHeartbeat: boolean expected";
            if (message.authorizeUsage != null && message.hasOwnProperty("authorizeUsage"))
                if (typeof message.authorizeUsage !== "boolean")
                    return "authorizeUsage: boolean expected";
            return null;
        };
    
        /**
         * Creates a FulfillmentManagerAuth message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {FulfillmentManagerAuth} FulfillmentManagerAuth
         */
        FulfillmentManagerAuth.fromObject = function fromObject(object) {
            if (object instanceof $root.FulfillmentManagerAuth)
                return object;
            var message = new $root.FulfillmentManagerAuth();
            if (object.nomineePubkey != null)
                if (typeof object.nomineePubkey === "string")
                    $util.base64.decode(object.nomineePubkey, message.nomineePubkey = $util.newBuffer($util.base64.length(object.nomineePubkey)), 0);
                else if (object.nomineePubkey.length)
                    message.nomineePubkey = object.nomineePubkey;
            if (object.fulfillmentManagerPubkey != null)
                if (typeof object.fulfillmentManagerPubkey === "string")
                    $util.base64.decode(object.fulfillmentManagerPubkey, message.fulfillmentManagerPubkey = $util.newBuffer($util.base64.length(object.fulfillmentManagerPubkey)), 0);
                else if (object.fulfillmentManagerPubkey.length)
                    message.fulfillmentManagerPubkey = object.fulfillmentManagerPubkey;
            if (object.authorizeHeartbeat != null)
                message.authorizeHeartbeat = Boolean(object.authorizeHeartbeat);
            if (object.authorizeUsage != null)
                message.authorizeUsage = Boolean(object.authorizeUsage);
            return message;
        };
    
        /**
         * Creates a plain object from a FulfillmentManagerAuth message. Also converts values to other types if specified.
         * @function toObject
         * @memberof FulfillmentManagerAuth
         * @static
         * @param {FulfillmentManagerAuth} message FulfillmentManagerAuth
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FulfillmentManagerAuth.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.nomineePubkey = "";
                else {
                    object.nomineePubkey = [];
                    if (options.bytes !== Array)
                        object.nomineePubkey = $util.newBuffer(object.nomineePubkey);
                }
                if (options.bytes === String)
                    object.fulfillmentManagerPubkey = "";
                else {
                    object.fulfillmentManagerPubkey = [];
                    if (options.bytes !== Array)
                        object.fulfillmentManagerPubkey = $util.newBuffer(object.fulfillmentManagerPubkey);
                }
                object.authorizeHeartbeat = false;
                object.authorizeUsage = false;
            }
            if (message.nomineePubkey != null && message.hasOwnProperty("nomineePubkey"))
                object.nomineePubkey = options.bytes === String ? $util.base64.encode(message.nomineePubkey, 0, message.nomineePubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.nomineePubkey) : message.nomineePubkey;
            if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                object.fulfillmentManagerPubkey = options.bytes === String ? $util.base64.encode(message.fulfillmentManagerPubkey, 0, message.fulfillmentManagerPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.fulfillmentManagerPubkey) : message.fulfillmentManagerPubkey;
            if (message.authorizeHeartbeat != null && message.hasOwnProperty("authorizeHeartbeat"))
                object.authorizeHeartbeat = message.authorizeHeartbeat;
            if (message.authorizeUsage != null && message.hasOwnProperty("authorizeUsage"))
                object.authorizeUsage = message.authorizeUsage;
            return object;
        };
    
        /**
         * Converts this FulfillmentManagerAuth to JSON.
         * @function toJSON
         * @memberof FulfillmentManagerAuth
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FulfillmentManagerAuth.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return FulfillmentManagerAuth;
    })();
    
    $root.FulfillmentManagerState = (function() {
    
        /**
         * Properties of a FulfillmentManagerState.
         * @exports IFulfillmentManagerState
         * @interface IFulfillmentManagerState
         * @property {number|null} [version] FulfillmentManagerState version
         * @property {FulfillmentManagerState.IConfigs|null} [configs] FulfillmentManagerState configs
         * @property {Array.<IFulfillmentEntry>|null} [entries] FulfillmentManagerState entries
         */
    
        /**
         * Constructs a new FulfillmentManagerState.
         * @exports FulfillmentManagerState
         * @classdesc Represents a FulfillmentManagerState.
         * @implements IFulfillmentManagerState
         * @constructor
         * @param {IFulfillmentManagerState=} [properties] Properties to set
         */
        function FulfillmentManagerState(properties) {
            this.entries = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * FulfillmentManagerState version.
         * @member {number} version
         * @memberof FulfillmentManagerState
         * @instance
         */
        FulfillmentManagerState.prototype.version = 0;
    
        /**
         * FulfillmentManagerState configs.
         * @member {FulfillmentManagerState.IConfigs|null|undefined} configs
         * @memberof FulfillmentManagerState
         * @instance
         */
        FulfillmentManagerState.prototype.configs = null;
    
        /**
         * FulfillmentManagerState entries.
         * @member {Array.<IFulfillmentEntry>} entries
         * @memberof FulfillmentManagerState
         * @instance
         */
        FulfillmentManagerState.prototype.entries = $util.emptyArray;
    
        /**
         * Creates a new FulfillmentManagerState instance using the specified properties.
         * @function create
         * @memberof FulfillmentManagerState
         * @static
         * @param {IFulfillmentManagerState=} [properties] Properties to set
         * @returns {FulfillmentManagerState} FulfillmentManagerState instance
         */
        FulfillmentManagerState.create = function create(properties) {
            return new FulfillmentManagerState(properties);
        };
    
        /**
         * Encodes the specified FulfillmentManagerState message. Does not implicitly {@link FulfillmentManagerState.verify|verify} messages.
         * @function encode
         * @memberof FulfillmentManagerState
         * @static
         * @param {IFulfillmentManagerState} message FulfillmentManagerState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentManagerState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.version);
            if (message.configs != null && Object.hasOwnProperty.call(message, "configs"))
                $root.FulfillmentManagerState.Configs.encode(message.configs, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.entries != null && message.entries.length)
                for (var i = 0; i < message.entries.length; ++i)
                    $root.FulfillmentEntry.encode(message.entries[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified FulfillmentManagerState message, length delimited. Does not implicitly {@link FulfillmentManagerState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof FulfillmentManagerState
         * @static
         * @param {IFulfillmentManagerState} message FulfillmentManagerState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FulfillmentManagerState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a FulfillmentManagerState message from the specified reader or buffer.
         * @function decode
         * @memberof FulfillmentManagerState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FulfillmentManagerState} FulfillmentManagerState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentManagerState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FulfillmentManagerState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.int32();
                    break;
                case 2:
                    message.configs = $root.FulfillmentManagerState.Configs.decode(reader, reader.uint32());
                    break;
                case 3:
                    if (!(message.entries && message.entries.length))
                        message.entries = [];
                    message.entries.push($root.FulfillmentEntry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a FulfillmentManagerState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof FulfillmentManagerState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {FulfillmentManagerState} FulfillmentManagerState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FulfillmentManagerState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a FulfillmentManagerState message.
         * @function verify
         * @memberof FulfillmentManagerState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FulfillmentManagerState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.configs != null && message.hasOwnProperty("configs")) {
                var error = $root.FulfillmentManagerState.Configs.verify(message.configs);
                if (error)
                    return "configs." + error;
            }
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (var i = 0; i < message.entries.length; ++i) {
                    var error = $root.FulfillmentEntry.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a FulfillmentManagerState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof FulfillmentManagerState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {FulfillmentManagerState} FulfillmentManagerState
         */
        FulfillmentManagerState.fromObject = function fromObject(object) {
            if (object instanceof $root.FulfillmentManagerState)
                return object;
            var message = new $root.FulfillmentManagerState();
            if (object.version != null)
                message.version = object.version | 0;
            if (object.configs != null) {
                if (typeof object.configs !== "object")
                    throw TypeError(".FulfillmentManagerState.configs: object expected");
                message.configs = $root.FulfillmentManagerState.Configs.fromObject(object.configs);
            }
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".FulfillmentManagerState.entries: array expected");
                message.entries = [];
                for (var i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".FulfillmentManagerState.entries: object expected");
                    message.entries[i] = $root.FulfillmentEntry.fromObject(object.entries[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a FulfillmentManagerState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof FulfillmentManagerState
         * @static
         * @param {FulfillmentManagerState} message FulfillmentManagerState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FulfillmentManagerState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.version = 0;
                object.configs = null;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.configs != null && message.hasOwnProperty("configs"))
                object.configs = $root.FulfillmentManagerState.Configs.toObject(message.configs, options);
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (var j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.FulfillmentEntry.toObject(message.entries[j], options);
            }
            return object;
        };
    
        /**
         * Converts this FulfillmentManagerState to JSON.
         * @function toJSON
         * @memberof FulfillmentManagerState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FulfillmentManagerState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        FulfillmentManagerState.Configs = (function() {
    
            /**
             * Properties of a Configs.
             * @memberof FulfillmentManagerState
             * @interface IConfigs
             * @property {boolean|null} [heartbeatAuthRequired] Configs heartbeatAuthRequired
             * @property {boolean|null} [usageAuthRequired] Configs usageAuthRequired
             * @property {boolean|null} [locked] Configs locked
             */
    
            /**
             * Constructs a new Configs.
             * @memberof FulfillmentManagerState
             * @classdesc Represents a Configs.
             * @implements IConfigs
             * @constructor
             * @param {FulfillmentManagerState.IConfigs=} [properties] Properties to set
             */
            function Configs(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Configs heartbeatAuthRequired.
             * @member {boolean} heartbeatAuthRequired
             * @memberof FulfillmentManagerState.Configs
             * @instance
             */
            Configs.prototype.heartbeatAuthRequired = false;
    
            /**
             * Configs usageAuthRequired.
             * @member {boolean} usageAuthRequired
             * @memberof FulfillmentManagerState.Configs
             * @instance
             */
            Configs.prototype.usageAuthRequired = false;
    
            /**
             * Configs locked.
             * @member {boolean} locked
             * @memberof FulfillmentManagerState.Configs
             * @instance
             */
            Configs.prototype.locked = false;
    
            /**
             * Creates a new Configs instance using the specified properties.
             * @function create
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {FulfillmentManagerState.IConfigs=} [properties] Properties to set
             * @returns {FulfillmentManagerState.Configs} Configs instance
             */
            Configs.create = function create(properties) {
                return new Configs(properties);
            };
    
            /**
             * Encodes the specified Configs message. Does not implicitly {@link FulfillmentManagerState.Configs.verify|verify} messages.
             * @function encode
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {FulfillmentManagerState.IConfigs} message Configs message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Configs.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.heartbeatAuthRequired != null && Object.hasOwnProperty.call(message, "heartbeatAuthRequired"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.heartbeatAuthRequired);
                if (message.usageAuthRequired != null && Object.hasOwnProperty.call(message, "usageAuthRequired"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.usageAuthRequired);
                if (message.locked != null && Object.hasOwnProperty.call(message, "locked"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.locked);
                return writer;
            };
    
            /**
             * Encodes the specified Configs message, length delimited. Does not implicitly {@link FulfillmentManagerState.Configs.verify|verify} messages.
             * @function encodeDelimited
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {FulfillmentManagerState.IConfigs} message Configs message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Configs.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Configs message from the specified reader or buffer.
             * @function decode
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {FulfillmentManagerState.Configs} Configs
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Configs.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FulfillmentManagerState.Configs();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.heartbeatAuthRequired = reader.bool();
                        break;
                    case 2:
                        message.usageAuthRequired = reader.bool();
                        break;
                    case 3:
                        message.locked = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Configs message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {FulfillmentManagerState.Configs} Configs
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Configs.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Configs message.
             * @function verify
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Configs.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.heartbeatAuthRequired != null && message.hasOwnProperty("heartbeatAuthRequired"))
                    if (typeof message.heartbeatAuthRequired !== "boolean")
                        return "heartbeatAuthRequired: boolean expected";
                if (message.usageAuthRequired != null && message.hasOwnProperty("usageAuthRequired"))
                    if (typeof message.usageAuthRequired !== "boolean")
                        return "usageAuthRequired: boolean expected";
                if (message.locked != null && message.hasOwnProperty("locked"))
                    if (typeof message.locked !== "boolean")
                        return "locked: boolean expected";
                return null;
            };
    
            /**
             * Creates a Configs message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {FulfillmentManagerState.Configs} Configs
             */
            Configs.fromObject = function fromObject(object) {
                if (object instanceof $root.FulfillmentManagerState.Configs)
                    return object;
                var message = new $root.FulfillmentManagerState.Configs();
                if (object.heartbeatAuthRequired != null)
                    message.heartbeatAuthRequired = Boolean(object.heartbeatAuthRequired);
                if (object.usageAuthRequired != null)
                    message.usageAuthRequired = Boolean(object.usageAuthRequired);
                if (object.locked != null)
                    message.locked = Boolean(object.locked);
                return message;
            };
    
            /**
             * Creates a plain object from a Configs message. Also converts values to other types if specified.
             * @function toObject
             * @memberof FulfillmentManagerState.Configs
             * @static
             * @param {FulfillmentManagerState.Configs} message Configs
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Configs.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.heartbeatAuthRequired = false;
                    object.usageAuthRequired = false;
                    object.locked = false;
                }
                if (message.heartbeatAuthRequired != null && message.hasOwnProperty("heartbeatAuthRequired"))
                    object.heartbeatAuthRequired = message.heartbeatAuthRequired;
                if (message.usageAuthRequired != null && message.hasOwnProperty("usageAuthRequired"))
                    object.usageAuthRequired = message.usageAuthRequired;
                if (message.locked != null && message.hasOwnProperty("locked"))
                    object.locked = message.locked;
                return object;
            };
    
            /**
             * Converts this Configs to JSON.
             * @function toJSON
             * @memberof FulfillmentManagerState.Configs
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Configs.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Configs;
        })();
    
        return FulfillmentManagerState;
    })();
    
    $root.SwitchboardInstruction = (function() {
    
        /**
         * Properties of a SwitchboardInstruction.
         * @exports ISwitchboardInstruction
         * @interface ISwitchboardInstruction
         * @property {SwitchboardInstruction.IInitInstruction|null} [initInstruction] SwitchboardInstruction initInstruction
         * @property {SwitchboardInstruction.IRegisterJobInstruction|null} [registerJobInstruction] SwitchboardInstruction registerJobInstruction
         * @property {SwitchboardInstruction.IUnregisterJobInstruction|null} [unregisterJobInstruction] SwitchboardInstruction unregisterJobInstruction
         * @property {SwitchboardInstruction.IUpdateAggregateInstruction|null} [updateAggregateInstruction] SwitchboardInstruction updateAggregateInstruction
         * @property {SwitchboardInstruction.IGetAggregateInstruction|null} [getAggregateInstruction] SwitchboardInstruction getAggregateInstruction
         * @property {SwitchboardInstruction.ISaveResultInstruction|null} [saveResultInstruction] SwitchboardInstruction saveResultInstruction
         * @property {SwitchboardInstruction.ISetAggregatorConfigsInstruction|null} [setAggregatorConfigsInstruction] SwitchboardInstruction setAggregatorConfigsInstruction
         * @property {SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction|null} [setFulfillmentManagerConfigsInstruction] SwitchboardInstruction setFulfillmentManagerConfigsInstruction
         * @property {SwitchboardInstruction.IHeartbeatInstruction|null} [heartbeatInstruction] SwitchboardInstruction heartbeatInstruction
         * @property {SwitchboardInstruction.IRegisterAuthInstruction|null} [registerAuthInstruction] SwitchboardInstruction registerAuthInstruction
         * @property {SwitchboardInstruction.IReachFulfillerAgreementInstruction|null} [reachFulfillerAgreementInstruction] SwitchboardInstruction reachFulfillerAgreementInstruction
         * @property {SwitchboardInstruction.IRemoveFulfillerInstruction|null} [removeFulfillerInstruction] SwitchboardInstruction removeFulfillerInstruction
         * @property {SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction|null} [linkParseOptimizedAccountInstruction] SwitchboardInstruction linkParseOptimizedAccountInstruction
         * @property {SwitchboardInstruction.ISetBundleAuthConfigsInstruction|null} [setBundleAuthConfigsInstruction] SwitchboardInstruction setBundleAuthConfigsInstruction
         * @property {SwitchboardInstruction.IAddBundleAuthInstruction|null} [addBundleAuthInstruction] SwitchboardInstruction addBundleAuthInstruction
         * @property {SwitchboardInstruction.IRemoveBundleAuthInstruction|null} [removeBundleAuthInstruction] SwitchboardInstruction removeBundleAuthInstruction
         * @property {SwitchboardInstruction.ISaveBundleResultInstruction|null} [saveBundleResultInstruction] SwitchboardInstruction saveBundleResultInstruction
         * @property {SwitchboardInstruction.ISetVrfConfigsInstruction|null} [setVrfConfigsInstruction] SwitchboardInstruction setVrfConfigsInstruction
         * @property {SwitchboardInstruction.IRequestRandomnessInstruction|null} [requestRandomnessInstruction] SwitchboardInstruction requestRandomnessInstruction
         * @property {SwitchboardInstruction.IRespondRandomnessInstruction|null} [respondRandomnessInstruction] SwitchboardInstruction respondRandomnessInstruction
         * @property {SwitchboardInstruction.IConfirmRandomnessProofInstruction|null} [confirmRandomnessProofInstruction] SwitchboardInstruction confirmRandomnessProofInstruction
         * @property {SwitchboardInstruction.ISetVrfPermitInstruction|null} [setVrfPermitInstruction] SwitchboardInstruction setVrfPermitInstruction
         */
    
        /**
         * Constructs a new SwitchboardInstruction.
         * @exports SwitchboardInstruction
         * @classdesc Represents a SwitchboardInstruction.
         * @implements ISwitchboardInstruction
         * @constructor
         * @param {ISwitchboardInstruction=} [properties] Properties to set
         */
        function SwitchboardInstruction(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SwitchboardInstruction initInstruction.
         * @member {SwitchboardInstruction.IInitInstruction|null|undefined} initInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.initInstruction = null;
    
        /**
         * SwitchboardInstruction registerJobInstruction.
         * @member {SwitchboardInstruction.IRegisterJobInstruction|null|undefined} registerJobInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.registerJobInstruction = null;
    
        /**
         * SwitchboardInstruction unregisterJobInstruction.
         * @member {SwitchboardInstruction.IUnregisterJobInstruction|null|undefined} unregisterJobInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.unregisterJobInstruction = null;
    
        /**
         * SwitchboardInstruction updateAggregateInstruction.
         * @member {SwitchboardInstruction.IUpdateAggregateInstruction|null|undefined} updateAggregateInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.updateAggregateInstruction = null;
    
        /**
         * SwitchboardInstruction getAggregateInstruction.
         * @member {SwitchboardInstruction.IGetAggregateInstruction|null|undefined} getAggregateInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.getAggregateInstruction = null;
    
        /**
         * SwitchboardInstruction saveResultInstruction.
         * @member {SwitchboardInstruction.ISaveResultInstruction|null|undefined} saveResultInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.saveResultInstruction = null;
    
        /**
         * SwitchboardInstruction setAggregatorConfigsInstruction.
         * @member {SwitchboardInstruction.ISetAggregatorConfigsInstruction|null|undefined} setAggregatorConfigsInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.setAggregatorConfigsInstruction = null;
    
        /**
         * SwitchboardInstruction setFulfillmentManagerConfigsInstruction.
         * @member {SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction|null|undefined} setFulfillmentManagerConfigsInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.setFulfillmentManagerConfigsInstruction = null;
    
        /**
         * SwitchboardInstruction heartbeatInstruction.
         * @member {SwitchboardInstruction.IHeartbeatInstruction|null|undefined} heartbeatInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.heartbeatInstruction = null;
    
        /**
         * SwitchboardInstruction registerAuthInstruction.
         * @member {SwitchboardInstruction.IRegisterAuthInstruction|null|undefined} registerAuthInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.registerAuthInstruction = null;
    
        /**
         * SwitchboardInstruction reachFulfillerAgreementInstruction.
         * @member {SwitchboardInstruction.IReachFulfillerAgreementInstruction|null|undefined} reachFulfillerAgreementInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.reachFulfillerAgreementInstruction = null;
    
        /**
         * SwitchboardInstruction removeFulfillerInstruction.
         * @member {SwitchboardInstruction.IRemoveFulfillerInstruction|null|undefined} removeFulfillerInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.removeFulfillerInstruction = null;
    
        /**
         * SwitchboardInstruction linkParseOptimizedAccountInstruction.
         * @member {SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction|null|undefined} linkParseOptimizedAccountInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.linkParseOptimizedAccountInstruction = null;
    
        /**
         * SwitchboardInstruction setBundleAuthConfigsInstruction.
         * @member {SwitchboardInstruction.ISetBundleAuthConfigsInstruction|null|undefined} setBundleAuthConfigsInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.setBundleAuthConfigsInstruction = null;
    
        /**
         * SwitchboardInstruction addBundleAuthInstruction.
         * @member {SwitchboardInstruction.IAddBundleAuthInstruction|null|undefined} addBundleAuthInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.addBundleAuthInstruction = null;
    
        /**
         * SwitchboardInstruction removeBundleAuthInstruction.
         * @member {SwitchboardInstruction.IRemoveBundleAuthInstruction|null|undefined} removeBundleAuthInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.removeBundleAuthInstruction = null;
    
        /**
         * SwitchboardInstruction saveBundleResultInstruction.
         * @member {SwitchboardInstruction.ISaveBundleResultInstruction|null|undefined} saveBundleResultInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.saveBundleResultInstruction = null;
    
        /**
         * SwitchboardInstruction setVrfConfigsInstruction.
         * @member {SwitchboardInstruction.ISetVrfConfigsInstruction|null|undefined} setVrfConfigsInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.setVrfConfigsInstruction = null;
    
        /**
         * SwitchboardInstruction requestRandomnessInstruction.
         * @member {SwitchboardInstruction.IRequestRandomnessInstruction|null|undefined} requestRandomnessInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.requestRandomnessInstruction = null;
    
        /**
         * SwitchboardInstruction respondRandomnessInstruction.
         * @member {SwitchboardInstruction.IRespondRandomnessInstruction|null|undefined} respondRandomnessInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.respondRandomnessInstruction = null;
    
        /**
         * SwitchboardInstruction confirmRandomnessProofInstruction.
         * @member {SwitchboardInstruction.IConfirmRandomnessProofInstruction|null|undefined} confirmRandomnessProofInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.confirmRandomnessProofInstruction = null;
    
        /**
         * SwitchboardInstruction setVrfPermitInstruction.
         * @member {SwitchboardInstruction.ISetVrfPermitInstruction|null|undefined} setVrfPermitInstruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        SwitchboardInstruction.prototype.setVrfPermitInstruction = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * SwitchboardInstruction instruction.
         * @member {"initInstruction"|"registerJobInstruction"|"unregisterJobInstruction"|"updateAggregateInstruction"|"getAggregateInstruction"|"saveResultInstruction"|"setAggregatorConfigsInstruction"|"setFulfillmentManagerConfigsInstruction"|"heartbeatInstruction"|"registerAuthInstruction"|"reachFulfillerAgreementInstruction"|"removeFulfillerInstruction"|"linkParseOptimizedAccountInstruction"|"setBundleAuthConfigsInstruction"|"addBundleAuthInstruction"|"removeBundleAuthInstruction"|"saveBundleResultInstruction"|"setVrfConfigsInstruction"|"requestRandomnessInstruction"|"respondRandomnessInstruction"|"confirmRandomnessProofInstruction"|"setVrfPermitInstruction"|undefined} instruction
         * @memberof SwitchboardInstruction
         * @instance
         */
        Object.defineProperty(SwitchboardInstruction.prototype, "instruction", {
            get: $util.oneOfGetter($oneOfFields = ["initInstruction", "registerJobInstruction", "unregisterJobInstruction", "updateAggregateInstruction", "getAggregateInstruction", "saveResultInstruction", "setAggregatorConfigsInstruction", "setFulfillmentManagerConfigsInstruction", "heartbeatInstruction", "registerAuthInstruction", "reachFulfillerAgreementInstruction", "removeFulfillerInstruction", "linkParseOptimizedAccountInstruction", "setBundleAuthConfigsInstruction", "addBundleAuthInstruction", "removeBundleAuthInstruction", "saveBundleResultInstruction", "setVrfConfigsInstruction", "requestRandomnessInstruction", "respondRandomnessInstruction", "confirmRandomnessProofInstruction", "setVrfPermitInstruction"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new SwitchboardInstruction instance using the specified properties.
         * @function create
         * @memberof SwitchboardInstruction
         * @static
         * @param {ISwitchboardInstruction=} [properties] Properties to set
         * @returns {SwitchboardInstruction} SwitchboardInstruction instance
         */
        SwitchboardInstruction.create = function create(properties) {
            return new SwitchboardInstruction(properties);
        };
    
        /**
         * Encodes the specified SwitchboardInstruction message. Does not implicitly {@link SwitchboardInstruction.verify|verify} messages.
         * @function encode
         * @memberof SwitchboardInstruction
         * @static
         * @param {ISwitchboardInstruction} message SwitchboardInstruction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SwitchboardInstruction.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.initInstruction != null && Object.hasOwnProperty.call(message, "initInstruction"))
                $root.SwitchboardInstruction.InitInstruction.encode(message.initInstruction, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.registerJobInstruction != null && Object.hasOwnProperty.call(message, "registerJobInstruction"))
                $root.SwitchboardInstruction.RegisterJobInstruction.encode(message.registerJobInstruction, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.unregisterJobInstruction != null && Object.hasOwnProperty.call(message, "unregisterJobInstruction"))
                $root.SwitchboardInstruction.UnregisterJobInstruction.encode(message.unregisterJobInstruction, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.updateAggregateInstruction != null && Object.hasOwnProperty.call(message, "updateAggregateInstruction"))
                $root.SwitchboardInstruction.UpdateAggregateInstruction.encode(message.updateAggregateInstruction, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.getAggregateInstruction != null && Object.hasOwnProperty.call(message, "getAggregateInstruction"))
                $root.SwitchboardInstruction.GetAggregateInstruction.encode(message.getAggregateInstruction, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.saveResultInstruction != null && Object.hasOwnProperty.call(message, "saveResultInstruction"))
                $root.SwitchboardInstruction.SaveResultInstruction.encode(message.saveResultInstruction, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.setAggregatorConfigsInstruction != null && Object.hasOwnProperty.call(message, "setAggregatorConfigsInstruction"))
                $root.SwitchboardInstruction.SetAggregatorConfigsInstruction.encode(message.setAggregatorConfigsInstruction, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.setFulfillmentManagerConfigsInstruction != null && Object.hasOwnProperty.call(message, "setFulfillmentManagerConfigsInstruction"))
                $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.encode(message.setFulfillmentManagerConfigsInstruction, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.heartbeatInstruction != null && Object.hasOwnProperty.call(message, "heartbeatInstruction"))
                $root.SwitchboardInstruction.HeartbeatInstruction.encode(message.heartbeatInstruction, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.registerAuthInstruction != null && Object.hasOwnProperty.call(message, "registerAuthInstruction"))
                $root.SwitchboardInstruction.RegisterAuthInstruction.encode(message.registerAuthInstruction, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.reachFulfillerAgreementInstruction != null && Object.hasOwnProperty.call(message, "reachFulfillerAgreementInstruction"))
                $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction.encode(message.reachFulfillerAgreementInstruction, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.removeFulfillerInstruction != null && Object.hasOwnProperty.call(message, "removeFulfillerInstruction"))
                $root.SwitchboardInstruction.RemoveFulfillerInstruction.encode(message.removeFulfillerInstruction, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.linkParseOptimizedAccountInstruction != null && Object.hasOwnProperty.call(message, "linkParseOptimizedAccountInstruction"))
                $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.encode(message.linkParseOptimizedAccountInstruction, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.setBundleAuthConfigsInstruction != null && Object.hasOwnProperty.call(message, "setBundleAuthConfigsInstruction"))
                $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction.encode(message.setBundleAuthConfigsInstruction, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.addBundleAuthInstruction != null && Object.hasOwnProperty.call(message, "addBundleAuthInstruction"))
                $root.SwitchboardInstruction.AddBundleAuthInstruction.encode(message.addBundleAuthInstruction, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.removeBundleAuthInstruction != null && Object.hasOwnProperty.call(message, "removeBundleAuthInstruction"))
                $root.SwitchboardInstruction.RemoveBundleAuthInstruction.encode(message.removeBundleAuthInstruction, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.saveBundleResultInstruction != null && Object.hasOwnProperty.call(message, "saveBundleResultInstruction"))
                $root.SwitchboardInstruction.SaveBundleResultInstruction.encode(message.saveBundleResultInstruction, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.setVrfConfigsInstruction != null && Object.hasOwnProperty.call(message, "setVrfConfigsInstruction"))
                $root.SwitchboardInstruction.SetVrfConfigsInstruction.encode(message.setVrfConfigsInstruction, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            if (message.requestRandomnessInstruction != null && Object.hasOwnProperty.call(message, "requestRandomnessInstruction"))
                $root.SwitchboardInstruction.RequestRandomnessInstruction.encode(message.requestRandomnessInstruction, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
            if (message.respondRandomnessInstruction != null && Object.hasOwnProperty.call(message, "respondRandomnessInstruction"))
                $root.SwitchboardInstruction.RespondRandomnessInstruction.encode(message.respondRandomnessInstruction, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.confirmRandomnessProofInstruction != null && Object.hasOwnProperty.call(message, "confirmRandomnessProofInstruction"))
                $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction.encode(message.confirmRandomnessProofInstruction, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
            if (message.setVrfPermitInstruction != null && Object.hasOwnProperty.call(message, "setVrfPermitInstruction"))
                $root.SwitchboardInstruction.SetVrfPermitInstruction.encode(message.setVrfPermitInstruction, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified SwitchboardInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SwitchboardInstruction
         * @static
         * @param {ISwitchboardInstruction} message SwitchboardInstruction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SwitchboardInstruction.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SwitchboardInstruction message from the specified reader or buffer.
         * @function decode
         * @memberof SwitchboardInstruction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SwitchboardInstruction} SwitchboardInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SwitchboardInstruction.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.initInstruction = $root.SwitchboardInstruction.InitInstruction.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.registerJobInstruction = $root.SwitchboardInstruction.RegisterJobInstruction.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.unregisterJobInstruction = $root.SwitchboardInstruction.UnregisterJobInstruction.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.updateAggregateInstruction = $root.SwitchboardInstruction.UpdateAggregateInstruction.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.getAggregateInstruction = $root.SwitchboardInstruction.GetAggregateInstruction.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.saveResultInstruction = $root.SwitchboardInstruction.SaveResultInstruction.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.setAggregatorConfigsInstruction = $root.SwitchboardInstruction.SetAggregatorConfigsInstruction.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.setFulfillmentManagerConfigsInstruction = $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.heartbeatInstruction = $root.SwitchboardInstruction.HeartbeatInstruction.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.registerAuthInstruction = $root.SwitchboardInstruction.RegisterAuthInstruction.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.reachFulfillerAgreementInstruction = $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.removeFulfillerInstruction = $root.SwitchboardInstruction.RemoveFulfillerInstruction.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.linkParseOptimizedAccountInstruction = $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.setBundleAuthConfigsInstruction = $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.addBundleAuthInstruction = $root.SwitchboardInstruction.AddBundleAuthInstruction.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.removeBundleAuthInstruction = $root.SwitchboardInstruction.RemoveBundleAuthInstruction.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.saveBundleResultInstruction = $root.SwitchboardInstruction.SaveBundleResultInstruction.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.setVrfConfigsInstruction = $root.SwitchboardInstruction.SetVrfConfigsInstruction.decode(reader, reader.uint32());
                    break;
                case 19:
                    message.requestRandomnessInstruction = $root.SwitchboardInstruction.RequestRandomnessInstruction.decode(reader, reader.uint32());
                    break;
                case 20:
                    message.respondRandomnessInstruction = $root.SwitchboardInstruction.RespondRandomnessInstruction.decode(reader, reader.uint32());
                    break;
                case 21:
                    message.confirmRandomnessProofInstruction = $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction.decode(reader, reader.uint32());
                    break;
                case 22:
                    message.setVrfPermitInstruction = $root.SwitchboardInstruction.SetVrfPermitInstruction.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SwitchboardInstruction message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SwitchboardInstruction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SwitchboardInstruction} SwitchboardInstruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SwitchboardInstruction.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SwitchboardInstruction message.
         * @function verify
         * @memberof SwitchboardInstruction
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SwitchboardInstruction.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.initInstruction != null && message.hasOwnProperty("initInstruction")) {
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.InitInstruction.verify(message.initInstruction);
                    if (error)
                        return "initInstruction." + error;
                }
            }
            if (message.registerJobInstruction != null && message.hasOwnProperty("registerJobInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.RegisterJobInstruction.verify(message.registerJobInstruction);
                    if (error)
                        return "registerJobInstruction." + error;
                }
            }
            if (message.unregisterJobInstruction != null && message.hasOwnProperty("unregisterJobInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.UnregisterJobInstruction.verify(message.unregisterJobInstruction);
                    if (error)
                        return "unregisterJobInstruction." + error;
                }
            }
            if (message.updateAggregateInstruction != null && message.hasOwnProperty("updateAggregateInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.UpdateAggregateInstruction.verify(message.updateAggregateInstruction);
                    if (error)
                        return "updateAggregateInstruction." + error;
                }
            }
            if (message.getAggregateInstruction != null && message.hasOwnProperty("getAggregateInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.GetAggregateInstruction.verify(message.getAggregateInstruction);
                    if (error)
                        return "getAggregateInstruction." + error;
                }
            }
            if (message.saveResultInstruction != null && message.hasOwnProperty("saveResultInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SaveResultInstruction.verify(message.saveResultInstruction);
                    if (error)
                        return "saveResultInstruction." + error;
                }
            }
            if (message.setAggregatorConfigsInstruction != null && message.hasOwnProperty("setAggregatorConfigsInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SetAggregatorConfigsInstruction.verify(message.setAggregatorConfigsInstruction);
                    if (error)
                        return "setAggregatorConfigsInstruction." + error;
                }
            }
            if (message.setFulfillmentManagerConfigsInstruction != null && message.hasOwnProperty("setFulfillmentManagerConfigsInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.verify(message.setFulfillmentManagerConfigsInstruction);
                    if (error)
                        return "setFulfillmentManagerConfigsInstruction." + error;
                }
            }
            if (message.heartbeatInstruction != null && message.hasOwnProperty("heartbeatInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.HeartbeatInstruction.verify(message.heartbeatInstruction);
                    if (error)
                        return "heartbeatInstruction." + error;
                }
            }
            if (message.registerAuthInstruction != null && message.hasOwnProperty("registerAuthInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.RegisterAuthInstruction.verify(message.registerAuthInstruction);
                    if (error)
                        return "registerAuthInstruction." + error;
                }
            }
            if (message.reachFulfillerAgreementInstruction != null && message.hasOwnProperty("reachFulfillerAgreementInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction.verify(message.reachFulfillerAgreementInstruction);
                    if (error)
                        return "reachFulfillerAgreementInstruction." + error;
                }
            }
            if (message.removeFulfillerInstruction != null && message.hasOwnProperty("removeFulfillerInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.RemoveFulfillerInstruction.verify(message.removeFulfillerInstruction);
                    if (error)
                        return "removeFulfillerInstruction." + error;
                }
            }
            if (message.linkParseOptimizedAccountInstruction != null && message.hasOwnProperty("linkParseOptimizedAccountInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.verify(message.linkParseOptimizedAccountInstruction);
                    if (error)
                        return "linkParseOptimizedAccountInstruction." + error;
                }
            }
            if (message.setBundleAuthConfigsInstruction != null && message.hasOwnProperty("setBundleAuthConfigsInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction.verify(message.setBundleAuthConfigsInstruction);
                    if (error)
                        return "setBundleAuthConfigsInstruction." + error;
                }
            }
            if (message.addBundleAuthInstruction != null && message.hasOwnProperty("addBundleAuthInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.AddBundleAuthInstruction.verify(message.addBundleAuthInstruction);
                    if (error)
                        return "addBundleAuthInstruction." + error;
                }
            }
            if (message.removeBundleAuthInstruction != null && message.hasOwnProperty("removeBundleAuthInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.RemoveBundleAuthInstruction.verify(message.removeBundleAuthInstruction);
                    if (error)
                        return "removeBundleAuthInstruction." + error;
                }
            }
            if (message.saveBundleResultInstruction != null && message.hasOwnProperty("saveBundleResultInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SaveBundleResultInstruction.verify(message.saveBundleResultInstruction);
                    if (error)
                        return "saveBundleResultInstruction." + error;
                }
            }
            if (message.setVrfConfigsInstruction != null && message.hasOwnProperty("setVrfConfigsInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SetVrfConfigsInstruction.verify(message.setVrfConfigsInstruction);
                    if (error)
                        return "setVrfConfigsInstruction." + error;
                }
            }
            if (message.requestRandomnessInstruction != null && message.hasOwnProperty("requestRandomnessInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.RequestRandomnessInstruction.verify(message.requestRandomnessInstruction);
                    if (error)
                        return "requestRandomnessInstruction." + error;
                }
            }
            if (message.respondRandomnessInstruction != null && message.hasOwnProperty("respondRandomnessInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.RespondRandomnessInstruction.verify(message.respondRandomnessInstruction);
                    if (error)
                        return "respondRandomnessInstruction." + error;
                }
            }
            if (message.confirmRandomnessProofInstruction != null && message.hasOwnProperty("confirmRandomnessProofInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction.verify(message.confirmRandomnessProofInstruction);
                    if (error)
                        return "confirmRandomnessProofInstruction." + error;
                }
            }
            if (message.setVrfPermitInstruction != null && message.hasOwnProperty("setVrfPermitInstruction")) {
                if (properties.instruction === 1)
                    return "instruction: multiple values";
                properties.instruction = 1;
                {
                    var error = $root.SwitchboardInstruction.SetVrfPermitInstruction.verify(message.setVrfPermitInstruction);
                    if (error)
                        return "setVrfPermitInstruction." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a SwitchboardInstruction message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SwitchboardInstruction
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SwitchboardInstruction} SwitchboardInstruction
         */
        SwitchboardInstruction.fromObject = function fromObject(object) {
            if (object instanceof $root.SwitchboardInstruction)
                return object;
            var message = new $root.SwitchboardInstruction();
            if (object.initInstruction != null) {
                if (typeof object.initInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.initInstruction: object expected");
                message.initInstruction = $root.SwitchboardInstruction.InitInstruction.fromObject(object.initInstruction);
            }
            if (object.registerJobInstruction != null) {
                if (typeof object.registerJobInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.registerJobInstruction: object expected");
                message.registerJobInstruction = $root.SwitchboardInstruction.RegisterJobInstruction.fromObject(object.registerJobInstruction);
            }
            if (object.unregisterJobInstruction != null) {
                if (typeof object.unregisterJobInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.unregisterJobInstruction: object expected");
                message.unregisterJobInstruction = $root.SwitchboardInstruction.UnregisterJobInstruction.fromObject(object.unregisterJobInstruction);
            }
            if (object.updateAggregateInstruction != null) {
                if (typeof object.updateAggregateInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.updateAggregateInstruction: object expected");
                message.updateAggregateInstruction = $root.SwitchboardInstruction.UpdateAggregateInstruction.fromObject(object.updateAggregateInstruction);
            }
            if (object.getAggregateInstruction != null) {
                if (typeof object.getAggregateInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.getAggregateInstruction: object expected");
                message.getAggregateInstruction = $root.SwitchboardInstruction.GetAggregateInstruction.fromObject(object.getAggregateInstruction);
            }
            if (object.saveResultInstruction != null) {
                if (typeof object.saveResultInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.saveResultInstruction: object expected");
                message.saveResultInstruction = $root.SwitchboardInstruction.SaveResultInstruction.fromObject(object.saveResultInstruction);
            }
            if (object.setAggregatorConfigsInstruction != null) {
                if (typeof object.setAggregatorConfigsInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.setAggregatorConfigsInstruction: object expected");
                message.setAggregatorConfigsInstruction = $root.SwitchboardInstruction.SetAggregatorConfigsInstruction.fromObject(object.setAggregatorConfigsInstruction);
            }
            if (object.setFulfillmentManagerConfigsInstruction != null) {
                if (typeof object.setFulfillmentManagerConfigsInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.setFulfillmentManagerConfigsInstruction: object expected");
                message.setFulfillmentManagerConfigsInstruction = $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.fromObject(object.setFulfillmentManagerConfigsInstruction);
            }
            if (object.heartbeatInstruction != null) {
                if (typeof object.heartbeatInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.heartbeatInstruction: object expected");
                message.heartbeatInstruction = $root.SwitchboardInstruction.HeartbeatInstruction.fromObject(object.heartbeatInstruction);
            }
            if (object.registerAuthInstruction != null) {
                if (typeof object.registerAuthInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.registerAuthInstruction: object expected");
                message.registerAuthInstruction = $root.SwitchboardInstruction.RegisterAuthInstruction.fromObject(object.registerAuthInstruction);
            }
            if (object.reachFulfillerAgreementInstruction != null) {
                if (typeof object.reachFulfillerAgreementInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.reachFulfillerAgreementInstruction: object expected");
                message.reachFulfillerAgreementInstruction = $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction.fromObject(object.reachFulfillerAgreementInstruction);
            }
            if (object.removeFulfillerInstruction != null) {
                if (typeof object.removeFulfillerInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.removeFulfillerInstruction: object expected");
                message.removeFulfillerInstruction = $root.SwitchboardInstruction.RemoveFulfillerInstruction.fromObject(object.removeFulfillerInstruction);
            }
            if (object.linkParseOptimizedAccountInstruction != null) {
                if (typeof object.linkParseOptimizedAccountInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.linkParseOptimizedAccountInstruction: object expected");
                message.linkParseOptimizedAccountInstruction = $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.fromObject(object.linkParseOptimizedAccountInstruction);
            }
            if (object.setBundleAuthConfigsInstruction != null) {
                if (typeof object.setBundleAuthConfigsInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.setBundleAuthConfigsInstruction: object expected");
                message.setBundleAuthConfigsInstruction = $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction.fromObject(object.setBundleAuthConfigsInstruction);
            }
            if (object.addBundleAuthInstruction != null) {
                if (typeof object.addBundleAuthInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.addBundleAuthInstruction: object expected");
                message.addBundleAuthInstruction = $root.SwitchboardInstruction.AddBundleAuthInstruction.fromObject(object.addBundleAuthInstruction);
            }
            if (object.removeBundleAuthInstruction != null) {
                if (typeof object.removeBundleAuthInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.removeBundleAuthInstruction: object expected");
                message.removeBundleAuthInstruction = $root.SwitchboardInstruction.RemoveBundleAuthInstruction.fromObject(object.removeBundleAuthInstruction);
            }
            if (object.saveBundleResultInstruction != null) {
                if (typeof object.saveBundleResultInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.saveBundleResultInstruction: object expected");
                message.saveBundleResultInstruction = $root.SwitchboardInstruction.SaveBundleResultInstruction.fromObject(object.saveBundleResultInstruction);
            }
            if (object.setVrfConfigsInstruction != null) {
                if (typeof object.setVrfConfigsInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.setVrfConfigsInstruction: object expected");
                message.setVrfConfigsInstruction = $root.SwitchboardInstruction.SetVrfConfigsInstruction.fromObject(object.setVrfConfigsInstruction);
            }
            if (object.requestRandomnessInstruction != null) {
                if (typeof object.requestRandomnessInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.requestRandomnessInstruction: object expected");
                message.requestRandomnessInstruction = $root.SwitchboardInstruction.RequestRandomnessInstruction.fromObject(object.requestRandomnessInstruction);
            }
            if (object.respondRandomnessInstruction != null) {
                if (typeof object.respondRandomnessInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.respondRandomnessInstruction: object expected");
                message.respondRandomnessInstruction = $root.SwitchboardInstruction.RespondRandomnessInstruction.fromObject(object.respondRandomnessInstruction);
            }
            if (object.confirmRandomnessProofInstruction != null) {
                if (typeof object.confirmRandomnessProofInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.confirmRandomnessProofInstruction: object expected");
                message.confirmRandomnessProofInstruction = $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction.fromObject(object.confirmRandomnessProofInstruction);
            }
            if (object.setVrfPermitInstruction != null) {
                if (typeof object.setVrfPermitInstruction !== "object")
                    throw TypeError(".SwitchboardInstruction.setVrfPermitInstruction: object expected");
                message.setVrfPermitInstruction = $root.SwitchboardInstruction.SetVrfPermitInstruction.fromObject(object.setVrfPermitInstruction);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a SwitchboardInstruction message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SwitchboardInstruction
         * @static
         * @param {SwitchboardInstruction} message SwitchboardInstruction
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SwitchboardInstruction.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.initInstruction != null && message.hasOwnProperty("initInstruction")) {
                object.initInstruction = $root.SwitchboardInstruction.InitInstruction.toObject(message.initInstruction, options);
                if (options.oneofs)
                    object.instruction = "initInstruction";
            }
            if (message.registerJobInstruction != null && message.hasOwnProperty("registerJobInstruction")) {
                object.registerJobInstruction = $root.SwitchboardInstruction.RegisterJobInstruction.toObject(message.registerJobInstruction, options);
                if (options.oneofs)
                    object.instruction = "registerJobInstruction";
            }
            if (message.unregisterJobInstruction != null && message.hasOwnProperty("unregisterJobInstruction")) {
                object.unregisterJobInstruction = $root.SwitchboardInstruction.UnregisterJobInstruction.toObject(message.unregisterJobInstruction, options);
                if (options.oneofs)
                    object.instruction = "unregisterJobInstruction";
            }
            if (message.updateAggregateInstruction != null && message.hasOwnProperty("updateAggregateInstruction")) {
                object.updateAggregateInstruction = $root.SwitchboardInstruction.UpdateAggregateInstruction.toObject(message.updateAggregateInstruction, options);
                if (options.oneofs)
                    object.instruction = "updateAggregateInstruction";
            }
            if (message.getAggregateInstruction != null && message.hasOwnProperty("getAggregateInstruction")) {
                object.getAggregateInstruction = $root.SwitchboardInstruction.GetAggregateInstruction.toObject(message.getAggregateInstruction, options);
                if (options.oneofs)
                    object.instruction = "getAggregateInstruction";
            }
            if (message.saveResultInstruction != null && message.hasOwnProperty("saveResultInstruction")) {
                object.saveResultInstruction = $root.SwitchboardInstruction.SaveResultInstruction.toObject(message.saveResultInstruction, options);
                if (options.oneofs)
                    object.instruction = "saveResultInstruction";
            }
            if (message.setAggregatorConfigsInstruction != null && message.hasOwnProperty("setAggregatorConfigsInstruction")) {
                object.setAggregatorConfigsInstruction = $root.SwitchboardInstruction.SetAggregatorConfigsInstruction.toObject(message.setAggregatorConfigsInstruction, options);
                if (options.oneofs)
                    object.instruction = "setAggregatorConfigsInstruction";
            }
            if (message.setFulfillmentManagerConfigsInstruction != null && message.hasOwnProperty("setFulfillmentManagerConfigsInstruction")) {
                object.setFulfillmentManagerConfigsInstruction = $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.toObject(message.setFulfillmentManagerConfigsInstruction, options);
                if (options.oneofs)
                    object.instruction = "setFulfillmentManagerConfigsInstruction";
            }
            if (message.heartbeatInstruction != null && message.hasOwnProperty("heartbeatInstruction")) {
                object.heartbeatInstruction = $root.SwitchboardInstruction.HeartbeatInstruction.toObject(message.heartbeatInstruction, options);
                if (options.oneofs)
                    object.instruction = "heartbeatInstruction";
            }
            if (message.registerAuthInstruction != null && message.hasOwnProperty("registerAuthInstruction")) {
                object.registerAuthInstruction = $root.SwitchboardInstruction.RegisterAuthInstruction.toObject(message.registerAuthInstruction, options);
                if (options.oneofs)
                    object.instruction = "registerAuthInstruction";
            }
            if (message.reachFulfillerAgreementInstruction != null && message.hasOwnProperty("reachFulfillerAgreementInstruction")) {
                object.reachFulfillerAgreementInstruction = $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction.toObject(message.reachFulfillerAgreementInstruction, options);
                if (options.oneofs)
                    object.instruction = "reachFulfillerAgreementInstruction";
            }
            if (message.removeFulfillerInstruction != null && message.hasOwnProperty("removeFulfillerInstruction")) {
                object.removeFulfillerInstruction = $root.SwitchboardInstruction.RemoveFulfillerInstruction.toObject(message.removeFulfillerInstruction, options);
                if (options.oneofs)
                    object.instruction = "removeFulfillerInstruction";
            }
            if (message.linkParseOptimizedAccountInstruction != null && message.hasOwnProperty("linkParseOptimizedAccountInstruction")) {
                object.linkParseOptimizedAccountInstruction = $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.toObject(message.linkParseOptimizedAccountInstruction, options);
                if (options.oneofs)
                    object.instruction = "linkParseOptimizedAccountInstruction";
            }
            if (message.setBundleAuthConfigsInstruction != null && message.hasOwnProperty("setBundleAuthConfigsInstruction")) {
                object.setBundleAuthConfigsInstruction = $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction.toObject(message.setBundleAuthConfigsInstruction, options);
                if (options.oneofs)
                    object.instruction = "setBundleAuthConfigsInstruction";
            }
            if (message.addBundleAuthInstruction != null && message.hasOwnProperty("addBundleAuthInstruction")) {
                object.addBundleAuthInstruction = $root.SwitchboardInstruction.AddBundleAuthInstruction.toObject(message.addBundleAuthInstruction, options);
                if (options.oneofs)
                    object.instruction = "addBundleAuthInstruction";
            }
            if (message.removeBundleAuthInstruction != null && message.hasOwnProperty("removeBundleAuthInstruction")) {
                object.removeBundleAuthInstruction = $root.SwitchboardInstruction.RemoveBundleAuthInstruction.toObject(message.removeBundleAuthInstruction, options);
                if (options.oneofs)
                    object.instruction = "removeBundleAuthInstruction";
            }
            if (message.saveBundleResultInstruction != null && message.hasOwnProperty("saveBundleResultInstruction")) {
                object.saveBundleResultInstruction = $root.SwitchboardInstruction.SaveBundleResultInstruction.toObject(message.saveBundleResultInstruction, options);
                if (options.oneofs)
                    object.instruction = "saveBundleResultInstruction";
            }
            if (message.setVrfConfigsInstruction != null && message.hasOwnProperty("setVrfConfigsInstruction")) {
                object.setVrfConfigsInstruction = $root.SwitchboardInstruction.SetVrfConfigsInstruction.toObject(message.setVrfConfigsInstruction, options);
                if (options.oneofs)
                    object.instruction = "setVrfConfigsInstruction";
            }
            if (message.requestRandomnessInstruction != null && message.hasOwnProperty("requestRandomnessInstruction")) {
                object.requestRandomnessInstruction = $root.SwitchboardInstruction.RequestRandomnessInstruction.toObject(message.requestRandomnessInstruction, options);
                if (options.oneofs)
                    object.instruction = "requestRandomnessInstruction";
            }
            if (message.respondRandomnessInstruction != null && message.hasOwnProperty("respondRandomnessInstruction")) {
                object.respondRandomnessInstruction = $root.SwitchboardInstruction.RespondRandomnessInstruction.toObject(message.respondRandomnessInstruction, options);
                if (options.oneofs)
                    object.instruction = "respondRandomnessInstruction";
            }
            if (message.confirmRandomnessProofInstruction != null && message.hasOwnProperty("confirmRandomnessProofInstruction")) {
                object.confirmRandomnessProofInstruction = $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction.toObject(message.confirmRandomnessProofInstruction, options);
                if (options.oneofs)
                    object.instruction = "confirmRandomnessProofInstruction";
            }
            if (message.setVrfPermitInstruction != null && message.hasOwnProperty("setVrfPermitInstruction")) {
                object.setVrfPermitInstruction = $root.SwitchboardInstruction.SetVrfPermitInstruction.toObject(message.setVrfPermitInstruction, options);
                if (options.oneofs)
                    object.instruction = "setVrfPermitInstruction";
            }
            return object;
        };
    
        /**
         * Converts this SwitchboardInstruction to JSON.
         * @function toJSON
         * @memberof SwitchboardInstruction
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SwitchboardInstruction.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        SwitchboardInstruction.InitInstruction = (function() {
    
            /**
             * Properties of an InitInstruction.
             * @memberof SwitchboardInstruction
             * @interface IInitInstruction
             * @property {SwitchboardAccountType|null} [type] InitInstruction type
             */
    
            /**
             * Constructs a new InitInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents an InitInstruction.
             * @implements IInitInstruction
             * @constructor
             * @param {SwitchboardInstruction.IInitInstruction=} [properties] Properties to set
             */
            function InitInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * InitInstruction type.
             * @member {SwitchboardAccountType} type
             * @memberof SwitchboardInstruction.InitInstruction
             * @instance
             */
            InitInstruction.prototype.type = 0;
    
            /**
             * Creates a new InitInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {SwitchboardInstruction.IInitInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.InitInstruction} InitInstruction instance
             */
            InitInstruction.create = function create(properties) {
                return new InitInstruction(properties);
            };
    
            /**
             * Encodes the specified InitInstruction message. Does not implicitly {@link SwitchboardInstruction.InitInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {SwitchboardInstruction.IInitInstruction} message InitInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InitInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                return writer;
            };
    
            /**
             * Encodes the specified InitInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.InitInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {SwitchboardInstruction.IInitInstruction} message InitInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InitInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an InitInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.InitInstruction} InitInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InitInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.InitInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an InitInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.InitInstruction} InitInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InitInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an InitInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InitInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates an InitInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.InitInstruction} InitInstruction
             */
            InitInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.InitInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.InitInstruction();
                switch (object.type) {
                case "TYPE_UNINITIALIZED":
                case 0:
                    message.type = 0;
                    break;
                case "TYPE_AGGREGATOR":
                case 1:
                    message.type = 1;
                    break;
                case "TYPE_FULFILLMENT_MANAGER":
                case 2:
                    message.type = 2;
                    break;
                case "TYPE_JOB_DEFINITION":
                case 3:
                    message.type = 3;
                    break;
                case "TYPE_FULFILLMENT_MANAGER_AUTH":
                case 4:
                    message.type = 4;
                    break;
                case "TYPE_AGGREGATOR_RESULT_PARSE_OPTIMIZED":
                case 5:
                    message.type = 5;
                    break;
                case "TYPE_BUNDLE":
                case 6:
                    message.type = 6;
                    break;
                case "TYPE_BUNDLE_AUTH":
                case 7:
                    message.type = 7;
                    break;
                case "TYPE_VRF":
                case 8:
                    message.type = 8;
                    break;
                case "TYPE_VRF_PERMIT":
                case 9:
                    message.type = 9;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from an InitInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.InitInstruction
             * @static
             * @param {SwitchboardInstruction.InitInstruction} message InitInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InitInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.type = options.enums === String ? "TYPE_UNINITIALIZED" : 0;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.SwitchboardAccountType[message.type] : message.type;
                return object;
            };
    
            /**
             * Converts this InitInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.InitInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InitInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return InitInstruction;
        })();
    
        SwitchboardInstruction.RegisterJobInstruction = (function() {
    
            /**
             * Properties of a RegisterJobInstruction.
             * @memberof SwitchboardInstruction
             * @interface IRegisterJobInstruction
             * @property {IOracleJob|null} [job] RegisterJobInstruction job
             */
    
            /**
             * Constructs a new RegisterJobInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a RegisterJobInstruction.
             * @implements IRegisterJobInstruction
             * @constructor
             * @param {SwitchboardInstruction.IRegisterJobInstruction=} [properties] Properties to set
             */
            function RegisterJobInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * RegisterJobInstruction job.
             * @member {IOracleJob|null|undefined} job
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @instance
             */
            RegisterJobInstruction.prototype.job = null;
    
            /**
             * Creates a new RegisterJobInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.IRegisterJobInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.RegisterJobInstruction} RegisterJobInstruction instance
             */
            RegisterJobInstruction.create = function create(properties) {
                return new RegisterJobInstruction(properties);
            };
    
            /**
             * Encodes the specified RegisterJobInstruction message. Does not implicitly {@link SwitchboardInstruction.RegisterJobInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.IRegisterJobInstruction} message RegisterJobInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegisterJobInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.job != null && Object.hasOwnProperty.call(message, "job"))
                    $root.OracleJob.encode(message.job, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified RegisterJobInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RegisterJobInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.IRegisterJobInstruction} message RegisterJobInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegisterJobInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RegisterJobInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.RegisterJobInstruction} RegisterJobInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegisterJobInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.RegisterJobInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.job = $root.OracleJob.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RegisterJobInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.RegisterJobInstruction} RegisterJobInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegisterJobInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RegisterJobInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RegisterJobInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.job != null && message.hasOwnProperty("job")) {
                    var error = $root.OracleJob.verify(message.job);
                    if (error)
                        return "job." + error;
                }
                return null;
            };
    
            /**
             * Creates a RegisterJobInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.RegisterJobInstruction} RegisterJobInstruction
             */
            RegisterJobInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.RegisterJobInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.RegisterJobInstruction();
                if (object.job != null) {
                    if (typeof object.job !== "object")
                        throw TypeError(".SwitchboardInstruction.RegisterJobInstruction.job: object expected");
                    message.job = $root.OracleJob.fromObject(object.job);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a RegisterJobInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.RegisterJobInstruction} message RegisterJobInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RegisterJobInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.job = null;
                if (message.job != null && message.hasOwnProperty("job"))
                    object.job = $root.OracleJob.toObject(message.job, options);
                return object;
            };
    
            /**
             * Converts this RegisterJobInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.RegisterJobInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RegisterJobInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RegisterJobInstruction;
        })();
    
        SwitchboardInstruction.UnregisterJobInstruction = (function() {
    
            /**
             * Properties of an UnregisterJobInstruction.
             * @memberof SwitchboardInstruction
             * @interface IUnregisterJobInstruction
             * @property {Uint8Array|null} [jobPubkey] UnregisterJobInstruction jobPubkey
             */
    
            /**
             * Constructs a new UnregisterJobInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents an UnregisterJobInstruction.
             * @implements IUnregisterJobInstruction
             * @constructor
             * @param {SwitchboardInstruction.IUnregisterJobInstruction=} [properties] Properties to set
             */
            function UnregisterJobInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * UnregisterJobInstruction jobPubkey.
             * @member {Uint8Array} jobPubkey
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @instance
             */
            UnregisterJobInstruction.prototype.jobPubkey = $util.newBuffer([]);
    
            /**
             * Creates a new UnregisterJobInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.IUnregisterJobInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.UnregisterJobInstruction} UnregisterJobInstruction instance
             */
            UnregisterJobInstruction.create = function create(properties) {
                return new UnregisterJobInstruction(properties);
            };
    
            /**
             * Encodes the specified UnregisterJobInstruction message. Does not implicitly {@link SwitchboardInstruction.UnregisterJobInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.IUnregisterJobInstruction} message UnregisterJobInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UnregisterJobInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.jobPubkey != null && Object.hasOwnProperty.call(message, "jobPubkey"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.jobPubkey);
                return writer;
            };
    
            /**
             * Encodes the specified UnregisterJobInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.UnregisterJobInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.IUnregisterJobInstruction} message UnregisterJobInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UnregisterJobInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an UnregisterJobInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.UnregisterJobInstruction} UnregisterJobInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UnregisterJobInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.UnregisterJobInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.jobPubkey = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an UnregisterJobInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.UnregisterJobInstruction} UnregisterJobInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UnregisterJobInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an UnregisterJobInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UnregisterJobInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.jobPubkey != null && message.hasOwnProperty("jobPubkey"))
                    if (!(message.jobPubkey && typeof message.jobPubkey.length === "number" || $util.isString(message.jobPubkey)))
                        return "jobPubkey: buffer expected";
                return null;
            };
    
            /**
             * Creates an UnregisterJobInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.UnregisterJobInstruction} UnregisterJobInstruction
             */
            UnregisterJobInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.UnregisterJobInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.UnregisterJobInstruction();
                if (object.jobPubkey != null)
                    if (typeof object.jobPubkey === "string")
                        $util.base64.decode(object.jobPubkey, message.jobPubkey = $util.newBuffer($util.base64.length(object.jobPubkey)), 0);
                    else if (object.jobPubkey.length)
                        message.jobPubkey = object.jobPubkey;
                return message;
            };
    
            /**
             * Creates a plain object from an UnregisterJobInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @static
             * @param {SwitchboardInstruction.UnregisterJobInstruction} message UnregisterJobInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UnregisterJobInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.jobPubkey = "";
                    else {
                        object.jobPubkey = [];
                        if (options.bytes !== Array)
                            object.jobPubkey = $util.newBuffer(object.jobPubkey);
                    }
                if (message.jobPubkey != null && message.hasOwnProperty("jobPubkey"))
                    object.jobPubkey = options.bytes === String ? $util.base64.encode(message.jobPubkey, 0, message.jobPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.jobPubkey) : message.jobPubkey;
                return object;
            };
    
            /**
             * Converts this UnregisterJobInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.UnregisterJobInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UnregisterJobInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return UnregisterJobInstruction;
        })();
    
        SwitchboardInstruction.UpdateAggregateInstruction = (function() {
    
            /**
             * Properties of an UpdateAggregateInstruction.
             * @memberof SwitchboardInstruction
             * @interface IUpdateAggregateInstruction
             */
    
            /**
             * Constructs a new UpdateAggregateInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents an UpdateAggregateInstruction.
             * @implements IUpdateAggregateInstruction
             * @constructor
             * @param {SwitchboardInstruction.IUpdateAggregateInstruction=} [properties] Properties to set
             */
            function UpdateAggregateInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new UpdateAggregateInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.IUpdateAggregateInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.UpdateAggregateInstruction} UpdateAggregateInstruction instance
             */
            UpdateAggregateInstruction.create = function create(properties) {
                return new UpdateAggregateInstruction(properties);
            };
    
            /**
             * Encodes the specified UpdateAggregateInstruction message. Does not implicitly {@link SwitchboardInstruction.UpdateAggregateInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.IUpdateAggregateInstruction} message UpdateAggregateInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateAggregateInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified UpdateAggregateInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.UpdateAggregateInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.IUpdateAggregateInstruction} message UpdateAggregateInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateAggregateInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an UpdateAggregateInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.UpdateAggregateInstruction} UpdateAggregateInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateAggregateInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.UpdateAggregateInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an UpdateAggregateInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.UpdateAggregateInstruction} UpdateAggregateInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateAggregateInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an UpdateAggregateInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateAggregateInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates an UpdateAggregateInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.UpdateAggregateInstruction} UpdateAggregateInstruction
             */
            UpdateAggregateInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.UpdateAggregateInstruction)
                    return object;
                return new $root.SwitchboardInstruction.UpdateAggregateInstruction();
            };
    
            /**
             * Creates a plain object from an UpdateAggregateInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.UpdateAggregateInstruction} message UpdateAggregateInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateAggregateInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this UpdateAggregateInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.UpdateAggregateInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateAggregateInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return UpdateAggregateInstruction;
        })();
    
        SwitchboardInstruction.GetAggregateInstruction = (function() {
    
            /**
             * Properties of a GetAggregateInstruction.
             * @memberof SwitchboardInstruction
             * @interface IGetAggregateInstruction
             */
    
            /**
             * Constructs a new GetAggregateInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a GetAggregateInstruction.
             * @implements IGetAggregateInstruction
             * @constructor
             * @param {SwitchboardInstruction.IGetAggregateInstruction=} [properties] Properties to set
             */
            function GetAggregateInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new GetAggregateInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.IGetAggregateInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.GetAggregateInstruction} GetAggregateInstruction instance
             */
            GetAggregateInstruction.create = function create(properties) {
                return new GetAggregateInstruction(properties);
            };
    
            /**
             * Encodes the specified GetAggregateInstruction message. Does not implicitly {@link SwitchboardInstruction.GetAggregateInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.IGetAggregateInstruction} message GetAggregateInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetAggregateInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified GetAggregateInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.GetAggregateInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.IGetAggregateInstruction} message GetAggregateInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetAggregateInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a GetAggregateInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.GetAggregateInstruction} GetAggregateInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetAggregateInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.GetAggregateInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a GetAggregateInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.GetAggregateInstruction} GetAggregateInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetAggregateInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a GetAggregateInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetAggregateInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a GetAggregateInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.GetAggregateInstruction} GetAggregateInstruction
             */
            GetAggregateInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.GetAggregateInstruction)
                    return object;
                return new $root.SwitchboardInstruction.GetAggregateInstruction();
            };
    
            /**
             * Creates a plain object from a GetAggregateInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @static
             * @param {SwitchboardInstruction.GetAggregateInstruction} message GetAggregateInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetAggregateInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this GetAggregateInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.GetAggregateInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetAggregateInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return GetAggregateInstruction;
        })();
    
        SwitchboardInstruction.SetAggregatorConfigsInstruction = (function() {
    
            /**
             * Properties of a SetAggregatorConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISetAggregatorConfigsInstruction
             * @property {number|null} [minConfirmations] SetAggregatorConfigsInstruction minConfirmations
             * @property {number|Long|null} [minUpdateDelaySeconds] SetAggregatorConfigsInstruction minUpdateDelaySeconds
             * @property {Uint8Array|null} [fulfillmentManagerPubkey] SetAggregatorConfigsInstruction fulfillmentManagerPubkey
             * @property {boolean|null} [lock] SetAggregatorConfigsInstruction lock
             */
    
            /**
             * Constructs a new SetAggregatorConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SetAggregatorConfigsInstruction.
             * @implements ISetAggregatorConfigsInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISetAggregatorConfigsInstruction=} [properties] Properties to set
             */
            function SetAggregatorConfigsInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SetAggregatorConfigsInstruction minConfirmations.
             * @member {number} minConfirmations
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @instance
             */
            SetAggregatorConfigsInstruction.prototype.minConfirmations = 0;
    
            /**
             * SetAggregatorConfigsInstruction minUpdateDelaySeconds.
             * @member {number|Long} minUpdateDelaySeconds
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @instance
             */
            SetAggregatorConfigsInstruction.prototype.minUpdateDelaySeconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * SetAggregatorConfigsInstruction fulfillmentManagerPubkey.
             * @member {Uint8Array} fulfillmentManagerPubkey
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @instance
             */
            SetAggregatorConfigsInstruction.prototype.fulfillmentManagerPubkey = $util.newBuffer([]);
    
            /**
             * SetAggregatorConfigsInstruction lock.
             * @member {boolean} lock
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @instance
             */
            SetAggregatorConfigsInstruction.prototype.lock = false;
    
            /**
             * Creates a new SetAggregatorConfigsInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetAggregatorConfigsInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SetAggregatorConfigsInstruction} SetAggregatorConfigsInstruction instance
             */
            SetAggregatorConfigsInstruction.create = function create(properties) {
                return new SetAggregatorConfigsInstruction(properties);
            };
    
            /**
             * Encodes the specified SetAggregatorConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetAggregatorConfigsInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetAggregatorConfigsInstruction} message SetAggregatorConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetAggregatorConfigsInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.minConfirmations != null && Object.hasOwnProperty.call(message, "minConfirmations"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.minConfirmations);
                if (message.minUpdateDelaySeconds != null && Object.hasOwnProperty.call(message, "minUpdateDelaySeconds"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.minUpdateDelaySeconds);
                if (message.fulfillmentManagerPubkey != null && Object.hasOwnProperty.call(message, "fulfillmentManagerPubkey"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.fulfillmentManagerPubkey);
                if (message.lock != null && Object.hasOwnProperty.call(message, "lock"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.lock);
                return writer;
            };
    
            /**
             * Encodes the specified SetAggregatorConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetAggregatorConfigsInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetAggregatorConfigsInstruction} message SetAggregatorConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetAggregatorConfigsInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SetAggregatorConfigsInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SetAggregatorConfigsInstruction} SetAggregatorConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetAggregatorConfigsInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SetAggregatorConfigsInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.minConfirmations = reader.int32();
                        break;
                    case 2:
                        message.minUpdateDelaySeconds = reader.int64();
                        break;
                    case 3:
                        message.fulfillmentManagerPubkey = reader.bytes();
                        break;
                    case 5:
                        message.lock = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SetAggregatorConfigsInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SetAggregatorConfigsInstruction} SetAggregatorConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetAggregatorConfigsInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SetAggregatorConfigsInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetAggregatorConfigsInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.minConfirmations != null && message.hasOwnProperty("minConfirmations"))
                    if (!$util.isInteger(message.minConfirmations))
                        return "minConfirmations: integer expected";
                if (message.minUpdateDelaySeconds != null && message.hasOwnProperty("minUpdateDelaySeconds"))
                    if (!$util.isInteger(message.minUpdateDelaySeconds) && !(message.minUpdateDelaySeconds && $util.isInteger(message.minUpdateDelaySeconds.low) && $util.isInteger(message.minUpdateDelaySeconds.high)))
                        return "minUpdateDelaySeconds: integer|Long expected";
                if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                    if (!(message.fulfillmentManagerPubkey && typeof message.fulfillmentManagerPubkey.length === "number" || $util.isString(message.fulfillmentManagerPubkey)))
                        return "fulfillmentManagerPubkey: buffer expected";
                if (message.lock != null && message.hasOwnProperty("lock"))
                    if (typeof message.lock !== "boolean")
                        return "lock: boolean expected";
                return null;
            };
    
            /**
             * Creates a SetAggregatorConfigsInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SetAggregatorConfigsInstruction} SetAggregatorConfigsInstruction
             */
            SetAggregatorConfigsInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SetAggregatorConfigsInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.SetAggregatorConfigsInstruction();
                if (object.minConfirmations != null)
                    message.minConfirmations = object.minConfirmations | 0;
                if (object.minUpdateDelaySeconds != null)
                    if ($util.Long)
                        (message.minUpdateDelaySeconds = $util.Long.fromValue(object.minUpdateDelaySeconds)).unsigned = false;
                    else if (typeof object.minUpdateDelaySeconds === "string")
                        message.minUpdateDelaySeconds = parseInt(object.minUpdateDelaySeconds, 10);
                    else if (typeof object.minUpdateDelaySeconds === "number")
                        message.minUpdateDelaySeconds = object.minUpdateDelaySeconds;
                    else if (typeof object.minUpdateDelaySeconds === "object")
                        message.minUpdateDelaySeconds = new $util.LongBits(object.minUpdateDelaySeconds.low >>> 0, object.minUpdateDelaySeconds.high >>> 0).toNumber();
                if (object.fulfillmentManagerPubkey != null)
                    if (typeof object.fulfillmentManagerPubkey === "string")
                        $util.base64.decode(object.fulfillmentManagerPubkey, message.fulfillmentManagerPubkey = $util.newBuffer($util.base64.length(object.fulfillmentManagerPubkey)), 0);
                    else if (object.fulfillmentManagerPubkey.length)
                        message.fulfillmentManagerPubkey = object.fulfillmentManagerPubkey;
                if (object.lock != null)
                    message.lock = Boolean(object.lock);
                return message;
            };
    
            /**
             * Creates a plain object from a SetAggregatorConfigsInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.SetAggregatorConfigsInstruction} message SetAggregatorConfigsInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetAggregatorConfigsInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.minConfirmations = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.minUpdateDelaySeconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.minUpdateDelaySeconds = options.longs === String ? "0" : 0;
                    if (options.bytes === String)
                        object.fulfillmentManagerPubkey = "";
                    else {
                        object.fulfillmentManagerPubkey = [];
                        if (options.bytes !== Array)
                            object.fulfillmentManagerPubkey = $util.newBuffer(object.fulfillmentManagerPubkey);
                    }
                    object.lock = false;
                }
                if (message.minConfirmations != null && message.hasOwnProperty("minConfirmations"))
                    object.minConfirmations = message.minConfirmations;
                if (message.minUpdateDelaySeconds != null && message.hasOwnProperty("minUpdateDelaySeconds"))
                    if (typeof message.minUpdateDelaySeconds === "number")
                        object.minUpdateDelaySeconds = options.longs === String ? String(message.minUpdateDelaySeconds) : message.minUpdateDelaySeconds;
                    else
                        object.minUpdateDelaySeconds = options.longs === String ? $util.Long.prototype.toString.call(message.minUpdateDelaySeconds) : options.longs === Number ? new $util.LongBits(message.minUpdateDelaySeconds.low >>> 0, message.minUpdateDelaySeconds.high >>> 0).toNumber() : message.minUpdateDelaySeconds;
                if (message.fulfillmentManagerPubkey != null && message.hasOwnProperty("fulfillmentManagerPubkey"))
                    object.fulfillmentManagerPubkey = options.bytes === String ? $util.base64.encode(message.fulfillmentManagerPubkey, 0, message.fulfillmentManagerPubkey.length) : options.bytes === Array ? Array.prototype.slice.call(message.fulfillmentManagerPubkey) : message.fulfillmentManagerPubkey;
                if (message.lock != null && message.hasOwnProperty("lock"))
                    object.lock = message.lock;
                return object;
            };
    
            /**
             * Converts this SetAggregatorConfigsInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SetAggregatorConfigsInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetAggregatorConfigsInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SetAggregatorConfigsInstruction;
        })();
    
        SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction = (function() {
    
            /**
             * Properties of a SetFulfillmentManagerConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISetFulfillmentManagerConfigsInstruction
             * @property {boolean|null} [heartbeatAuthRequired] SetFulfillmentManagerConfigsInstruction heartbeatAuthRequired
             * @property {boolean|null} [usageAuthRequired] SetFulfillmentManagerConfigsInstruction usageAuthRequired
             * @property {boolean|null} [lock] SetFulfillmentManagerConfigsInstruction lock
             */
    
            /**
             * Constructs a new SetFulfillmentManagerConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SetFulfillmentManagerConfigsInstruction.
             * @implements ISetFulfillmentManagerConfigsInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction=} [properties] Properties to set
             */
            function SetFulfillmentManagerConfigsInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SetFulfillmentManagerConfigsInstruction heartbeatAuthRequired.
             * @member {boolean} heartbeatAuthRequired
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @instance
             */
            SetFulfillmentManagerConfigsInstruction.prototype.heartbeatAuthRequired = false;
    
            /**
             * SetFulfillmentManagerConfigsInstruction usageAuthRequired.
             * @member {boolean} usageAuthRequired
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @instance
             */
            SetFulfillmentManagerConfigsInstruction.prototype.usageAuthRequired = false;
    
            /**
             * SetFulfillmentManagerConfigsInstruction lock.
             * @member {boolean} lock
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @instance
             */
            SetFulfillmentManagerConfigsInstruction.prototype.lock = false;
    
            /**
             * Creates a new SetFulfillmentManagerConfigsInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction} SetFulfillmentManagerConfigsInstruction instance
             */
            SetFulfillmentManagerConfigsInstruction.create = function create(properties) {
                return new SetFulfillmentManagerConfigsInstruction(properties);
            };
    
            /**
             * Encodes the specified SetFulfillmentManagerConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction} message SetFulfillmentManagerConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetFulfillmentManagerConfigsInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.heartbeatAuthRequired != null && Object.hasOwnProperty.call(message, "heartbeatAuthRequired"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.heartbeatAuthRequired);
                if (message.usageAuthRequired != null && Object.hasOwnProperty.call(message, "usageAuthRequired"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.usageAuthRequired);
                if (message.lock != null && Object.hasOwnProperty.call(message, "lock"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.lock);
                return writer;
            };
    
            /**
             * Encodes the specified SetFulfillmentManagerConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetFulfillmentManagerConfigsInstruction} message SetFulfillmentManagerConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetFulfillmentManagerConfigsInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SetFulfillmentManagerConfigsInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction} SetFulfillmentManagerConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetFulfillmentManagerConfigsInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.heartbeatAuthRequired = reader.bool();
                        break;
                    case 2:
                        message.usageAuthRequired = reader.bool();
                        break;
                    case 3:
                        message.lock = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SetFulfillmentManagerConfigsInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction} SetFulfillmentManagerConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetFulfillmentManagerConfigsInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SetFulfillmentManagerConfigsInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetFulfillmentManagerConfigsInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.heartbeatAuthRequired != null && message.hasOwnProperty("heartbeatAuthRequired"))
                    if (typeof message.heartbeatAuthRequired !== "boolean")
                        return "heartbeatAuthRequired: boolean expected";
                if (message.usageAuthRequired != null && message.hasOwnProperty("usageAuthRequired"))
                    if (typeof message.usageAuthRequired !== "boolean")
                        return "usageAuthRequired: boolean expected";
                if (message.lock != null && message.hasOwnProperty("lock"))
                    if (typeof message.lock !== "boolean")
                        return "lock: boolean expected";
                return null;
            };
    
            /**
             * Creates a SetFulfillmentManagerConfigsInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction} SetFulfillmentManagerConfigsInstruction
             */
            SetFulfillmentManagerConfigsInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction();
                if (object.heartbeatAuthRequired != null)
                    message.heartbeatAuthRequired = Boolean(object.heartbeatAuthRequired);
                if (object.usageAuthRequired != null)
                    message.usageAuthRequired = Boolean(object.usageAuthRequired);
                if (object.lock != null)
                    message.lock = Boolean(object.lock);
                return message;
            };
    
            /**
             * Creates a plain object from a SetFulfillmentManagerConfigsInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction} message SetFulfillmentManagerConfigsInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetFulfillmentManagerConfigsInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.heartbeatAuthRequired = false;
                    object.usageAuthRequired = false;
                    object.lock = false;
                }
                if (message.heartbeatAuthRequired != null && message.hasOwnProperty("heartbeatAuthRequired"))
                    object.heartbeatAuthRequired = message.heartbeatAuthRequired;
                if (message.usageAuthRequired != null && message.hasOwnProperty("usageAuthRequired"))
                    object.usageAuthRequired = message.usageAuthRequired;
                if (message.lock != null && message.hasOwnProperty("lock"))
                    object.lock = message.lock;
                return object;
            };
    
            /**
             * Converts this SetFulfillmentManagerConfigsInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SetFulfillmentManagerConfigsInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetFulfillmentManagerConfigsInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SetFulfillmentManagerConfigsInstruction;
        })();
    
        SwitchboardInstruction.SaveResultInstruction = (function() {
    
            /**
             * Properties of a SaveResultInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISaveResultInstruction
             * @property {number|null} [nodeIdx] SaveResultInstruction nodeIdx
             * @property {number|null} [result] SaveResultInstruction result
             * @property {boolean|null} [error] SaveResultInstruction error
             * @property {number|Long|null} [roundSlot] SaveResultInstruction roundSlot
             * @property {number|null} [minResponse] SaveResultInstruction minResponse
             * @property {number|null} [maxResponse] SaveResultInstruction maxResponse
             */
    
            /**
             * Constructs a new SaveResultInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SaveResultInstruction.
             * @implements ISaveResultInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISaveResultInstruction=} [properties] Properties to set
             */
            function SaveResultInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SaveResultInstruction nodeIdx.
             * @member {number} nodeIdx
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             */
            SaveResultInstruction.prototype.nodeIdx = 0;
    
            /**
             * SaveResultInstruction result.
             * @member {number} result
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             */
            SaveResultInstruction.prototype.result = 0;
    
            /**
             * SaveResultInstruction error.
             * @member {boolean} error
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             */
            SaveResultInstruction.prototype.error = false;
    
            /**
             * SaveResultInstruction roundSlot.
             * @member {number|Long} roundSlot
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             */
            SaveResultInstruction.prototype.roundSlot = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * SaveResultInstruction minResponse.
             * @member {number} minResponse
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             */
            SaveResultInstruction.prototype.minResponse = 0;
    
            /**
             * SaveResultInstruction maxResponse.
             * @member {number} maxResponse
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             */
            SaveResultInstruction.prototype.maxResponse = 0;
    
            /**
             * Creates a new SaveResultInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {SwitchboardInstruction.ISaveResultInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SaveResultInstruction} SaveResultInstruction instance
             */
            SaveResultInstruction.create = function create(properties) {
                return new SaveResultInstruction(properties);
            };
    
            /**
             * Encodes the specified SaveResultInstruction message. Does not implicitly {@link SwitchboardInstruction.SaveResultInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {SwitchboardInstruction.ISaveResultInstruction} message SaveResultInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SaveResultInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.nodeIdx != null && Object.hasOwnProperty.call(message, "nodeIdx"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.nodeIdx);
                if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.result);
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.error);
                if (message.roundSlot != null && Object.hasOwnProperty.call(message, "roundSlot"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.roundSlot);
                if (message.minResponse != null && Object.hasOwnProperty.call(message, "minResponse"))
                    writer.uint32(/* id 7, wireType 1 =*/57).double(message.minResponse);
                if (message.maxResponse != null && Object.hasOwnProperty.call(message, "maxResponse"))
                    writer.uint32(/* id 8, wireType 1 =*/65).double(message.maxResponse);
                return writer;
            };
    
            /**
             * Encodes the specified SaveResultInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SaveResultInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {SwitchboardInstruction.ISaveResultInstruction} message SaveResultInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SaveResultInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SaveResultInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SaveResultInstruction} SaveResultInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SaveResultInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SaveResultInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2:
                        message.nodeIdx = reader.uint32();
                        break;
                    case 4:
                        message.result = reader.double();
                        break;
                    case 5:
                        message.error = reader.bool();
                        break;
                    case 6:
                        message.roundSlot = reader.uint64();
                        break;
                    case 7:
                        message.minResponse = reader.double();
                        break;
                    case 8:
                        message.maxResponse = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SaveResultInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SaveResultInstruction} SaveResultInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SaveResultInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SaveResultInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SaveResultInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.nodeIdx != null && message.hasOwnProperty("nodeIdx"))
                    if (!$util.isInteger(message.nodeIdx))
                        return "nodeIdx: integer expected";
                if (message.result != null && message.hasOwnProperty("result"))
                    if (typeof message.result !== "number")
                        return "result: number expected";
                if (message.error != null && message.hasOwnProperty("error"))
                    if (typeof message.error !== "boolean")
                        return "error: boolean expected";
                if (message.roundSlot != null && message.hasOwnProperty("roundSlot"))
                    if (!$util.isInteger(message.roundSlot) && !(message.roundSlot && $util.isInteger(message.roundSlot.low) && $util.isInteger(message.roundSlot.high)))
                        return "roundSlot: integer|Long expected";
                if (message.minResponse != null && message.hasOwnProperty("minResponse"))
                    if (typeof message.minResponse !== "number")
                        return "minResponse: number expected";
                if (message.maxResponse != null && message.hasOwnProperty("maxResponse"))
                    if (typeof message.maxResponse !== "number")
                        return "maxResponse: number expected";
                return null;
            };
    
            /**
             * Creates a SaveResultInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SaveResultInstruction} SaveResultInstruction
             */
            SaveResultInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SaveResultInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.SaveResultInstruction();
                if (object.nodeIdx != null)
                    message.nodeIdx = object.nodeIdx >>> 0;
                if (object.result != null)
                    message.result = Number(object.result);
                if (object.error != null)
                    message.error = Boolean(object.error);
                if (object.roundSlot != null)
                    if ($util.Long)
                        (message.roundSlot = $util.Long.fromValue(object.roundSlot)).unsigned = true;
                    else if (typeof object.roundSlot === "string")
                        message.roundSlot = parseInt(object.roundSlot, 10);
                    else if (typeof object.roundSlot === "number")
                        message.roundSlot = object.roundSlot;
                    else if (typeof object.roundSlot === "object")
                        message.roundSlot = new $util.LongBits(object.roundSlot.low >>> 0, object.roundSlot.high >>> 0).toNumber(true);
                if (object.minResponse != null)
                    message.minResponse = Number(object.minResponse);
                if (object.maxResponse != null)
                    message.maxResponse = Number(object.maxResponse);
                return message;
            };
    
            /**
             * Creates a plain object from a SaveResultInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @static
             * @param {SwitchboardInstruction.SaveResultInstruction} message SaveResultInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SaveResultInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.nodeIdx = 0;
                    object.result = 0;
                    object.error = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.roundSlot = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.roundSlot = options.longs === String ? "0" : 0;
                    object.minResponse = 0;
                    object.maxResponse = 0;
                }
                if (message.nodeIdx != null && message.hasOwnProperty("nodeIdx"))
                    object.nodeIdx = message.nodeIdx;
                if (message.result != null && message.hasOwnProperty("result"))
                    object.result = options.json && !isFinite(message.result) ? String(message.result) : message.result;
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = message.error;
                if (message.roundSlot != null && message.hasOwnProperty("roundSlot"))
                    if (typeof message.roundSlot === "number")
                        object.roundSlot = options.longs === String ? String(message.roundSlot) : message.roundSlot;
                    else
                        object.roundSlot = options.longs === String ? $util.Long.prototype.toString.call(message.roundSlot) : options.longs === Number ? new $util.LongBits(message.roundSlot.low >>> 0, message.roundSlot.high >>> 0).toNumber(true) : message.roundSlot;
                if (message.minResponse != null && message.hasOwnProperty("minResponse"))
                    object.minResponse = options.json && !isFinite(message.minResponse) ? String(message.minResponse) : message.minResponse;
                if (message.maxResponse != null && message.hasOwnProperty("maxResponse"))
                    object.maxResponse = options.json && !isFinite(message.maxResponse) ? String(message.maxResponse) : message.maxResponse;
                return object;
            };
    
            /**
             * Converts this SaveResultInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SaveResultInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SaveResultInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SaveResultInstruction;
        })();
    
        SwitchboardInstruction.HeartbeatInstruction = (function() {
    
            /**
             * Properties of a HeartbeatInstruction.
             * @memberof SwitchboardInstruction
             * @interface IHeartbeatInstruction
             * @property {number|Long|null} [leaseCount] HeartbeatInstruction leaseCount
             * @property {number|Long|null} [slotExpiration] HeartbeatInstruction slotExpiration
             */
    
            /**
             * Constructs a new HeartbeatInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a HeartbeatInstruction.
             * @implements IHeartbeatInstruction
             * @constructor
             * @param {SwitchboardInstruction.IHeartbeatInstruction=} [properties] Properties to set
             */
            function HeartbeatInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * HeartbeatInstruction leaseCount.
             * @member {number|Long} leaseCount
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @instance
             */
            HeartbeatInstruction.prototype.leaseCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * HeartbeatInstruction slotExpiration.
             * @member {number|Long} slotExpiration
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @instance
             */
            HeartbeatInstruction.prototype.slotExpiration = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Creates a new HeartbeatInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {SwitchboardInstruction.IHeartbeatInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.HeartbeatInstruction} HeartbeatInstruction instance
             */
            HeartbeatInstruction.create = function create(properties) {
                return new HeartbeatInstruction(properties);
            };
    
            /**
             * Encodes the specified HeartbeatInstruction message. Does not implicitly {@link SwitchboardInstruction.HeartbeatInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {SwitchboardInstruction.IHeartbeatInstruction} message HeartbeatInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HeartbeatInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.leaseCount != null && Object.hasOwnProperty.call(message, "leaseCount"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.leaseCount);
                if (message.slotExpiration != null && Object.hasOwnProperty.call(message, "slotExpiration"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.slotExpiration);
                return writer;
            };
    
            /**
             * Encodes the specified HeartbeatInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.HeartbeatInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {SwitchboardInstruction.IHeartbeatInstruction} message HeartbeatInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HeartbeatInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a HeartbeatInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.HeartbeatInstruction} HeartbeatInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HeartbeatInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.HeartbeatInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.leaseCount = reader.int64();
                        break;
                    case 2:
                        message.slotExpiration = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a HeartbeatInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.HeartbeatInstruction} HeartbeatInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HeartbeatInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a HeartbeatInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HeartbeatInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.leaseCount != null && message.hasOwnProperty("leaseCount"))
                    if (!$util.isInteger(message.leaseCount) && !(message.leaseCount && $util.isInteger(message.leaseCount.low) && $util.isInteger(message.leaseCount.high)))
                        return "leaseCount: integer|Long expected";
                if (message.slotExpiration != null && message.hasOwnProperty("slotExpiration"))
                    if (!$util.isInteger(message.slotExpiration) && !(message.slotExpiration && $util.isInteger(message.slotExpiration.low) && $util.isInteger(message.slotExpiration.high)))
                        return "slotExpiration: integer|Long expected";
                return null;
            };
    
            /**
             * Creates a HeartbeatInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.HeartbeatInstruction} HeartbeatInstruction
             */
            HeartbeatInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.HeartbeatInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.HeartbeatInstruction();
                if (object.leaseCount != null)
                    if ($util.Long)
                        (message.leaseCount = $util.Long.fromValue(object.leaseCount)).unsigned = false;
                    else if (typeof object.leaseCount === "string")
                        message.leaseCount = parseInt(object.leaseCount, 10);
                    else if (typeof object.leaseCount === "number")
                        message.leaseCount = object.leaseCount;
                    else if (typeof object.leaseCount === "object")
                        message.leaseCount = new $util.LongBits(object.leaseCount.low >>> 0, object.leaseCount.high >>> 0).toNumber();
                if (object.slotExpiration != null)
                    if ($util.Long)
                        (message.slotExpiration = $util.Long.fromValue(object.slotExpiration)).unsigned = false;
                    else if (typeof object.slotExpiration === "string")
                        message.slotExpiration = parseInt(object.slotExpiration, 10);
                    else if (typeof object.slotExpiration === "number")
                        message.slotExpiration = object.slotExpiration;
                    else if (typeof object.slotExpiration === "object")
                        message.slotExpiration = new $util.LongBits(object.slotExpiration.low >>> 0, object.slotExpiration.high >>> 0).toNumber();
                return message;
            };
    
            /**
             * Creates a plain object from a HeartbeatInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @static
             * @param {SwitchboardInstruction.HeartbeatInstruction} message HeartbeatInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HeartbeatInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.leaseCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.leaseCount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.slotExpiration = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.slotExpiration = options.longs === String ? "0" : 0;
                }
                if (message.leaseCount != null && message.hasOwnProperty("leaseCount"))
                    if (typeof message.leaseCount === "number")
                        object.leaseCount = options.longs === String ? String(message.leaseCount) : message.leaseCount;
                    else
                        object.leaseCount = options.longs === String ? $util.Long.prototype.toString.call(message.leaseCount) : options.longs === Number ? new $util.LongBits(message.leaseCount.low >>> 0, message.leaseCount.high >>> 0).toNumber() : message.leaseCount;
                if (message.slotExpiration != null && message.hasOwnProperty("slotExpiration"))
                    if (typeof message.slotExpiration === "number")
                        object.slotExpiration = options.longs === String ? String(message.slotExpiration) : message.slotExpiration;
                    else
                        object.slotExpiration = options.longs === String ? $util.Long.prototype.toString.call(message.slotExpiration) : options.longs === Number ? new $util.LongBits(message.slotExpiration.low >>> 0, message.slotExpiration.high >>> 0).toNumber() : message.slotExpiration;
                return object;
            };
    
            /**
             * Converts this HeartbeatInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.HeartbeatInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HeartbeatInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return HeartbeatInstruction;
        })();
    
        SwitchboardInstruction.RegisterAuthInstruction = (function() {
    
            /**
             * Properties of a RegisterAuthInstruction.
             * @memberof SwitchboardInstruction
             * @interface IRegisterAuthInstruction
             * @property {boolean|null} [authorizeHeartbeat] RegisterAuthInstruction authorizeHeartbeat
             * @property {boolean|null} [authorizeUsage] RegisterAuthInstruction authorizeUsage
             */
    
            /**
             * Constructs a new RegisterAuthInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a RegisterAuthInstruction.
             * @implements IRegisterAuthInstruction
             * @constructor
             * @param {SwitchboardInstruction.IRegisterAuthInstruction=} [properties] Properties to set
             */
            function RegisterAuthInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * RegisterAuthInstruction authorizeHeartbeat.
             * @member {boolean} authorizeHeartbeat
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @instance
             */
            RegisterAuthInstruction.prototype.authorizeHeartbeat = false;
    
            /**
             * RegisterAuthInstruction authorizeUsage.
             * @member {boolean} authorizeUsage
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @instance
             */
            RegisterAuthInstruction.prototype.authorizeUsage = false;
    
            /**
             * Creates a new RegisterAuthInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IRegisterAuthInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.RegisterAuthInstruction} RegisterAuthInstruction instance
             */
            RegisterAuthInstruction.create = function create(properties) {
                return new RegisterAuthInstruction(properties);
            };
    
            /**
             * Encodes the specified RegisterAuthInstruction message. Does not implicitly {@link SwitchboardInstruction.RegisterAuthInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IRegisterAuthInstruction} message RegisterAuthInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegisterAuthInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.authorizeHeartbeat != null && Object.hasOwnProperty.call(message, "authorizeHeartbeat"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.authorizeHeartbeat);
                if (message.authorizeUsage != null && Object.hasOwnProperty.call(message, "authorizeUsage"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.authorizeUsage);
                return writer;
            };
    
            /**
             * Encodes the specified RegisterAuthInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RegisterAuthInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IRegisterAuthInstruction} message RegisterAuthInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RegisterAuthInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RegisterAuthInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.RegisterAuthInstruction} RegisterAuthInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegisterAuthInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.RegisterAuthInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.authorizeHeartbeat = reader.bool();
                        break;
                    case 2:
                        message.authorizeUsage = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RegisterAuthInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.RegisterAuthInstruction} RegisterAuthInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RegisterAuthInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RegisterAuthInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RegisterAuthInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.authorizeHeartbeat != null && message.hasOwnProperty("authorizeHeartbeat"))
                    if (typeof message.authorizeHeartbeat !== "boolean")
                        return "authorizeHeartbeat: boolean expected";
                if (message.authorizeUsage != null && message.hasOwnProperty("authorizeUsage"))
                    if (typeof message.authorizeUsage !== "boolean")
                        return "authorizeUsage: boolean expected";
                return null;
            };
    
            /**
             * Creates a RegisterAuthInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.RegisterAuthInstruction} RegisterAuthInstruction
             */
            RegisterAuthInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.RegisterAuthInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.RegisterAuthInstruction();
                if (object.authorizeHeartbeat != null)
                    message.authorizeHeartbeat = Boolean(object.authorizeHeartbeat);
                if (object.authorizeUsage != null)
                    message.authorizeUsage = Boolean(object.authorizeUsage);
                return message;
            };
    
            /**
             * Creates a plain object from a RegisterAuthInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @static
             * @param {SwitchboardInstruction.RegisterAuthInstruction} message RegisterAuthInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RegisterAuthInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.authorizeHeartbeat = false;
                    object.authorizeUsage = false;
                }
                if (message.authorizeHeartbeat != null && message.hasOwnProperty("authorizeHeartbeat"))
                    object.authorizeHeartbeat = message.authorizeHeartbeat;
                if (message.authorizeUsage != null && message.hasOwnProperty("authorizeUsage"))
                    object.authorizeUsage = message.authorizeUsage;
                return object;
            };
    
            /**
             * Converts this RegisterAuthInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.RegisterAuthInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RegisterAuthInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RegisterAuthInstruction;
        })();
    
        SwitchboardInstruction.ReachFulfillerAgreementInstruction = (function() {
    
            /**
             * Properties of a ReachFulfillerAgreementInstruction.
             * @memberof SwitchboardInstruction
             * @interface IReachFulfillerAgreementInstruction
             */
    
            /**
             * Constructs a new ReachFulfillerAgreementInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a ReachFulfillerAgreementInstruction.
             * @implements IReachFulfillerAgreementInstruction
             * @constructor
             * @param {SwitchboardInstruction.IReachFulfillerAgreementInstruction=} [properties] Properties to set
             */
            function ReachFulfillerAgreementInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new ReachFulfillerAgreementInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {SwitchboardInstruction.IReachFulfillerAgreementInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.ReachFulfillerAgreementInstruction} ReachFulfillerAgreementInstruction instance
             */
            ReachFulfillerAgreementInstruction.create = function create(properties) {
                return new ReachFulfillerAgreementInstruction(properties);
            };
    
            /**
             * Encodes the specified ReachFulfillerAgreementInstruction message. Does not implicitly {@link SwitchboardInstruction.ReachFulfillerAgreementInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {SwitchboardInstruction.IReachFulfillerAgreementInstruction} message ReachFulfillerAgreementInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReachFulfillerAgreementInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified ReachFulfillerAgreementInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.ReachFulfillerAgreementInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {SwitchboardInstruction.IReachFulfillerAgreementInstruction} message ReachFulfillerAgreementInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReachFulfillerAgreementInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ReachFulfillerAgreementInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.ReachFulfillerAgreementInstruction} ReachFulfillerAgreementInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReachFulfillerAgreementInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ReachFulfillerAgreementInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.ReachFulfillerAgreementInstruction} ReachFulfillerAgreementInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReachFulfillerAgreementInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ReachFulfillerAgreementInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ReachFulfillerAgreementInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a ReachFulfillerAgreementInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.ReachFulfillerAgreementInstruction} ReachFulfillerAgreementInstruction
             */
            ReachFulfillerAgreementInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction)
                    return object;
                return new $root.SwitchboardInstruction.ReachFulfillerAgreementInstruction();
            };
    
            /**
             * Creates a plain object from a ReachFulfillerAgreementInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @static
             * @param {SwitchboardInstruction.ReachFulfillerAgreementInstruction} message ReachFulfillerAgreementInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ReachFulfillerAgreementInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this ReachFulfillerAgreementInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.ReachFulfillerAgreementInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ReachFulfillerAgreementInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ReachFulfillerAgreementInstruction;
        })();
    
        SwitchboardInstruction.RemoveFulfillerInstruction = (function() {
    
            /**
             * Properties of a RemoveFulfillerInstruction.
             * @memberof SwitchboardInstruction
             * @interface IRemoveFulfillerInstruction
             */
    
            /**
             * Constructs a new RemoveFulfillerInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a RemoveFulfillerInstruction.
             * @implements IRemoveFulfillerInstruction
             * @constructor
             * @param {SwitchboardInstruction.IRemoveFulfillerInstruction=} [properties] Properties to set
             */
            function RemoveFulfillerInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new RemoveFulfillerInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {SwitchboardInstruction.IRemoveFulfillerInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.RemoveFulfillerInstruction} RemoveFulfillerInstruction instance
             */
            RemoveFulfillerInstruction.create = function create(properties) {
                return new RemoveFulfillerInstruction(properties);
            };
    
            /**
             * Encodes the specified RemoveFulfillerInstruction message. Does not implicitly {@link SwitchboardInstruction.RemoveFulfillerInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {SwitchboardInstruction.IRemoveFulfillerInstruction} message RemoveFulfillerInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveFulfillerInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified RemoveFulfillerInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RemoveFulfillerInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {SwitchboardInstruction.IRemoveFulfillerInstruction} message RemoveFulfillerInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveFulfillerInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RemoveFulfillerInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.RemoveFulfillerInstruction} RemoveFulfillerInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveFulfillerInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.RemoveFulfillerInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RemoveFulfillerInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.RemoveFulfillerInstruction} RemoveFulfillerInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveFulfillerInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RemoveFulfillerInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RemoveFulfillerInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a RemoveFulfillerInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.RemoveFulfillerInstruction} RemoveFulfillerInstruction
             */
            RemoveFulfillerInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.RemoveFulfillerInstruction)
                    return object;
                return new $root.SwitchboardInstruction.RemoveFulfillerInstruction();
            };
    
            /**
             * Creates a plain object from a RemoveFulfillerInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @static
             * @param {SwitchboardInstruction.RemoveFulfillerInstruction} message RemoveFulfillerInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RemoveFulfillerInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this RemoveFulfillerInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.RemoveFulfillerInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RemoveFulfillerInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RemoveFulfillerInstruction;
        })();
    
        SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction = (function() {
    
            /**
             * Properties of a LinkedParseOptimizedResultAccountInstruction.
             * @memberof SwitchboardInstruction
             * @interface ILinkedParseOptimizedResultAccountInstruction
             */
    
            /**
             * Constructs a new LinkedParseOptimizedResultAccountInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a LinkedParseOptimizedResultAccountInstruction.
             * @implements ILinkedParseOptimizedResultAccountInstruction
             * @constructor
             * @param {SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction=} [properties] Properties to set
             */
            function LinkedParseOptimizedResultAccountInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new LinkedParseOptimizedResultAccountInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction} LinkedParseOptimizedResultAccountInstruction instance
             */
            LinkedParseOptimizedResultAccountInstruction.create = function create(properties) {
                return new LinkedParseOptimizedResultAccountInstruction(properties);
            };
    
            /**
             * Encodes the specified LinkedParseOptimizedResultAccountInstruction message. Does not implicitly {@link SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction} message LinkedParseOptimizedResultAccountInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LinkedParseOptimizedResultAccountInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified LinkedParseOptimizedResultAccountInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {SwitchboardInstruction.ILinkedParseOptimizedResultAccountInstruction} message LinkedParseOptimizedResultAccountInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LinkedParseOptimizedResultAccountInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LinkedParseOptimizedResultAccountInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction} LinkedParseOptimizedResultAccountInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LinkedParseOptimizedResultAccountInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LinkedParseOptimizedResultAccountInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction} LinkedParseOptimizedResultAccountInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LinkedParseOptimizedResultAccountInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LinkedParseOptimizedResultAccountInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LinkedParseOptimizedResultAccountInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a LinkedParseOptimizedResultAccountInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction} LinkedParseOptimizedResultAccountInstruction
             */
            LinkedParseOptimizedResultAccountInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction)
                    return object;
                return new $root.SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction();
            };
    
            /**
             * Creates a plain object from a LinkedParseOptimizedResultAccountInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @static
             * @param {SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction} message LinkedParseOptimizedResultAccountInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LinkedParseOptimizedResultAccountInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this LinkedParseOptimizedResultAccountInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.LinkedParseOptimizedResultAccountInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LinkedParseOptimizedResultAccountInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LinkedParseOptimizedResultAccountInstruction;
        })();
    
        SwitchboardInstruction.SetBundleAuthConfigsInstruction = (function() {
    
            /**
             * Properties of a SetBundleAuthConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISetBundleAuthConfigsInstruction
             * @property {number|null} [idx] SetBundleAuthConfigsInstruction idx
             */
    
            /**
             * Constructs a new SetBundleAuthConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SetBundleAuthConfigsInstruction.
             * @implements ISetBundleAuthConfigsInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISetBundleAuthConfigsInstruction=} [properties] Properties to set
             */
            function SetBundleAuthConfigsInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SetBundleAuthConfigsInstruction idx.
             * @member {number} idx
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @instance
             */
            SetBundleAuthConfigsInstruction.prototype.idx = 0;
    
            /**
             * Creates a new SetBundleAuthConfigsInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetBundleAuthConfigsInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SetBundleAuthConfigsInstruction} SetBundleAuthConfigsInstruction instance
             */
            SetBundleAuthConfigsInstruction.create = function create(properties) {
                return new SetBundleAuthConfigsInstruction(properties);
            };
    
            /**
             * Encodes the specified SetBundleAuthConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetBundleAuthConfigsInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetBundleAuthConfigsInstruction} message SetBundleAuthConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetBundleAuthConfigsInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.idx != null && Object.hasOwnProperty.call(message, "idx"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.idx);
                return writer;
            };
    
            /**
             * Encodes the specified SetBundleAuthConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetBundleAuthConfigsInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetBundleAuthConfigsInstruction} message SetBundleAuthConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetBundleAuthConfigsInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SetBundleAuthConfigsInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SetBundleAuthConfigsInstruction} SetBundleAuthConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetBundleAuthConfigsInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.idx = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SetBundleAuthConfigsInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SetBundleAuthConfigsInstruction} SetBundleAuthConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetBundleAuthConfigsInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SetBundleAuthConfigsInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetBundleAuthConfigsInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.idx != null && message.hasOwnProperty("idx"))
                    if (!$util.isInteger(message.idx))
                        return "idx: integer expected";
                return null;
            };
    
            /**
             * Creates a SetBundleAuthConfigsInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SetBundleAuthConfigsInstruction} SetBundleAuthConfigsInstruction
             */
            SetBundleAuthConfigsInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.SetBundleAuthConfigsInstruction();
                if (object.idx != null)
                    message.idx = object.idx | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a SetBundleAuthConfigsInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.SetBundleAuthConfigsInstruction} message SetBundleAuthConfigsInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetBundleAuthConfigsInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.idx = 0;
                if (message.idx != null && message.hasOwnProperty("idx"))
                    object.idx = message.idx;
                return object;
            };
    
            /**
             * Converts this SetBundleAuthConfigsInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SetBundleAuthConfigsInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetBundleAuthConfigsInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SetBundleAuthConfigsInstruction;
        })();
    
        SwitchboardInstruction.AddBundleAuthInstruction = (function() {
    
            /**
             * Properties of an AddBundleAuthInstruction.
             * @memberof SwitchboardInstruction
             * @interface IAddBundleAuthInstruction
             */
    
            /**
             * Constructs a new AddBundleAuthInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents an AddBundleAuthInstruction.
             * @implements IAddBundleAuthInstruction
             * @constructor
             * @param {SwitchboardInstruction.IAddBundleAuthInstruction=} [properties] Properties to set
             */
            function AddBundleAuthInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new AddBundleAuthInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IAddBundleAuthInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.AddBundleAuthInstruction} AddBundleAuthInstruction instance
             */
            AddBundleAuthInstruction.create = function create(properties) {
                return new AddBundleAuthInstruction(properties);
            };
    
            /**
             * Encodes the specified AddBundleAuthInstruction message. Does not implicitly {@link SwitchboardInstruction.AddBundleAuthInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IAddBundleAuthInstruction} message AddBundleAuthInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddBundleAuthInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified AddBundleAuthInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.AddBundleAuthInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IAddBundleAuthInstruction} message AddBundleAuthInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddBundleAuthInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AddBundleAuthInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.AddBundleAuthInstruction} AddBundleAuthInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddBundleAuthInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.AddBundleAuthInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AddBundleAuthInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.AddBundleAuthInstruction} AddBundleAuthInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddBundleAuthInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AddBundleAuthInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddBundleAuthInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates an AddBundleAuthInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.AddBundleAuthInstruction} AddBundleAuthInstruction
             */
            AddBundleAuthInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.AddBundleAuthInstruction)
                    return object;
                return new $root.SwitchboardInstruction.AddBundleAuthInstruction();
            };
    
            /**
             * Creates a plain object from an AddBundleAuthInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.AddBundleAuthInstruction} message AddBundleAuthInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddBundleAuthInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this AddBundleAuthInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.AddBundleAuthInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddBundleAuthInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AddBundleAuthInstruction;
        })();
    
        SwitchboardInstruction.RemoveBundleAuthInstruction = (function() {
    
            /**
             * Properties of a RemoveBundleAuthInstruction.
             * @memberof SwitchboardInstruction
             * @interface IRemoveBundleAuthInstruction
             */
    
            /**
             * Constructs a new RemoveBundleAuthInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a RemoveBundleAuthInstruction.
             * @implements IRemoveBundleAuthInstruction
             * @constructor
             * @param {SwitchboardInstruction.IRemoveBundleAuthInstruction=} [properties] Properties to set
             */
            function RemoveBundleAuthInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new RemoveBundleAuthInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IRemoveBundleAuthInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.RemoveBundleAuthInstruction} RemoveBundleAuthInstruction instance
             */
            RemoveBundleAuthInstruction.create = function create(properties) {
                return new RemoveBundleAuthInstruction(properties);
            };
    
            /**
             * Encodes the specified RemoveBundleAuthInstruction message. Does not implicitly {@link SwitchboardInstruction.RemoveBundleAuthInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IRemoveBundleAuthInstruction} message RemoveBundleAuthInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveBundleAuthInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified RemoveBundleAuthInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RemoveBundleAuthInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.IRemoveBundleAuthInstruction} message RemoveBundleAuthInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveBundleAuthInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RemoveBundleAuthInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.RemoveBundleAuthInstruction} RemoveBundleAuthInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveBundleAuthInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.RemoveBundleAuthInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RemoveBundleAuthInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.RemoveBundleAuthInstruction} RemoveBundleAuthInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveBundleAuthInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RemoveBundleAuthInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RemoveBundleAuthInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a RemoveBundleAuthInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.RemoveBundleAuthInstruction} RemoveBundleAuthInstruction
             */
            RemoveBundleAuthInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.RemoveBundleAuthInstruction)
                    return object;
                return new $root.SwitchboardInstruction.RemoveBundleAuthInstruction();
            };
    
            /**
             * Creates a plain object from a RemoveBundleAuthInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @static
             * @param {SwitchboardInstruction.RemoveBundleAuthInstruction} message RemoveBundleAuthInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RemoveBundleAuthInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this RemoveBundleAuthInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.RemoveBundleAuthInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RemoveBundleAuthInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RemoveBundleAuthInstruction;
        })();
    
        SwitchboardInstruction.SaveBundleResultInstruction = (function() {
    
            /**
             * Properties of a SaveBundleResultInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISaveBundleResultInstruction
             */
    
            /**
             * Constructs a new SaveBundleResultInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SaveBundleResultInstruction.
             * @implements ISaveBundleResultInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISaveBundleResultInstruction=} [properties] Properties to set
             */
            function SaveBundleResultInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new SaveBundleResultInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {SwitchboardInstruction.ISaveBundleResultInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SaveBundleResultInstruction} SaveBundleResultInstruction instance
             */
            SaveBundleResultInstruction.create = function create(properties) {
                return new SaveBundleResultInstruction(properties);
            };
    
            /**
             * Encodes the specified SaveBundleResultInstruction message. Does not implicitly {@link SwitchboardInstruction.SaveBundleResultInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {SwitchboardInstruction.ISaveBundleResultInstruction} message SaveBundleResultInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SaveBundleResultInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified SaveBundleResultInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SaveBundleResultInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {SwitchboardInstruction.ISaveBundleResultInstruction} message SaveBundleResultInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SaveBundleResultInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SaveBundleResultInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SaveBundleResultInstruction} SaveBundleResultInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SaveBundleResultInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SaveBundleResultInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SaveBundleResultInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SaveBundleResultInstruction} SaveBundleResultInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SaveBundleResultInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SaveBundleResultInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SaveBundleResultInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a SaveBundleResultInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SaveBundleResultInstruction} SaveBundleResultInstruction
             */
            SaveBundleResultInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SaveBundleResultInstruction)
                    return object;
                return new $root.SwitchboardInstruction.SaveBundleResultInstruction();
            };
    
            /**
             * Creates a plain object from a SaveBundleResultInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @static
             * @param {SwitchboardInstruction.SaveBundleResultInstruction} message SaveBundleResultInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SaveBundleResultInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this SaveBundleResultInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SaveBundleResultInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SaveBundleResultInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SaveBundleResultInstruction;
        })();
    
        SwitchboardInstruction.SetVrfConfigsInstruction = (function() {
    
            /**
             * Properties of a SetVrfConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISetVrfConfigsInstruction
             * @property {number|null} [minProofConfirmations] SetVrfConfigsInstruction minProofConfirmations
             * @property {boolean|null} [lockConfigs] SetVrfConfigsInstruction lockConfigs
             */
    
            /**
             * Constructs a new SetVrfConfigsInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SetVrfConfigsInstruction.
             * @implements ISetVrfConfigsInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISetVrfConfigsInstruction=} [properties] Properties to set
             */
            function SetVrfConfigsInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SetVrfConfigsInstruction minProofConfirmations.
             * @member {number} minProofConfirmations
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @instance
             */
            SetVrfConfigsInstruction.prototype.minProofConfirmations = 0;
    
            /**
             * SetVrfConfigsInstruction lockConfigs.
             * @member {boolean} lockConfigs
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @instance
             */
            SetVrfConfigsInstruction.prototype.lockConfigs = false;
    
            /**
             * Creates a new SetVrfConfigsInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetVrfConfigsInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SetVrfConfigsInstruction} SetVrfConfigsInstruction instance
             */
            SetVrfConfigsInstruction.create = function create(properties) {
                return new SetVrfConfigsInstruction(properties);
            };
    
            /**
             * Encodes the specified SetVrfConfigsInstruction message. Does not implicitly {@link SwitchboardInstruction.SetVrfConfigsInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetVrfConfigsInstruction} message SetVrfConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetVrfConfigsInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.minProofConfirmations != null && Object.hasOwnProperty.call(message, "minProofConfirmations"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.minProofConfirmations);
                if (message.lockConfigs != null && Object.hasOwnProperty.call(message, "lockConfigs"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.lockConfigs);
                return writer;
            };
    
            /**
             * Encodes the specified SetVrfConfigsInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetVrfConfigsInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.ISetVrfConfigsInstruction} message SetVrfConfigsInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetVrfConfigsInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SetVrfConfigsInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SetVrfConfigsInstruction} SetVrfConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetVrfConfigsInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SetVrfConfigsInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 3:
                        message.minProofConfirmations = reader.int32();
                        break;
                    case 4:
                        message.lockConfigs = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SetVrfConfigsInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SetVrfConfigsInstruction} SetVrfConfigsInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetVrfConfigsInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SetVrfConfigsInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetVrfConfigsInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.minProofConfirmations != null && message.hasOwnProperty("minProofConfirmations"))
                    if (!$util.isInteger(message.minProofConfirmations))
                        return "minProofConfirmations: integer expected";
                if (message.lockConfigs != null && message.hasOwnProperty("lockConfigs"))
                    if (typeof message.lockConfigs !== "boolean")
                        return "lockConfigs: boolean expected";
                return null;
            };
    
            /**
             * Creates a SetVrfConfigsInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SetVrfConfigsInstruction} SetVrfConfigsInstruction
             */
            SetVrfConfigsInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SetVrfConfigsInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.SetVrfConfigsInstruction();
                if (object.minProofConfirmations != null)
                    message.minProofConfirmations = object.minProofConfirmations | 0;
                if (object.lockConfigs != null)
                    message.lockConfigs = Boolean(object.lockConfigs);
                return message;
            };
    
            /**
             * Creates a plain object from a SetVrfConfigsInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @static
             * @param {SwitchboardInstruction.SetVrfConfigsInstruction} message SetVrfConfigsInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetVrfConfigsInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.minProofConfirmations = 0;
                    object.lockConfigs = false;
                }
                if (message.minProofConfirmations != null && message.hasOwnProperty("minProofConfirmations"))
                    object.minProofConfirmations = message.minProofConfirmations;
                if (message.lockConfigs != null && message.hasOwnProperty("lockConfigs"))
                    object.lockConfigs = message.lockConfigs;
                return object;
            };
    
            /**
             * Converts this SetVrfConfigsInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SetVrfConfigsInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetVrfConfigsInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SetVrfConfigsInstruction;
        })();
    
        SwitchboardInstruction.RequestRandomnessInstruction = (function() {
    
            /**
             * Properties of a RequestRandomnessInstruction.
             * @memberof SwitchboardInstruction
             * @interface IRequestRandomnessInstruction
             */
    
            /**
             * Constructs a new RequestRandomnessInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a RequestRandomnessInstruction.
             * @implements IRequestRandomnessInstruction
             * @constructor
             * @param {SwitchboardInstruction.IRequestRandomnessInstruction=} [properties] Properties to set
             */
            function RequestRandomnessInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Creates a new RequestRandomnessInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.IRequestRandomnessInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.RequestRandomnessInstruction} RequestRandomnessInstruction instance
             */
            RequestRandomnessInstruction.create = function create(properties) {
                return new RequestRandomnessInstruction(properties);
            };
    
            /**
             * Encodes the specified RequestRandomnessInstruction message. Does not implicitly {@link SwitchboardInstruction.RequestRandomnessInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.IRequestRandomnessInstruction} message RequestRandomnessInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestRandomnessInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };
    
            /**
             * Encodes the specified RequestRandomnessInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RequestRandomnessInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.IRequestRandomnessInstruction} message RequestRandomnessInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RequestRandomnessInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RequestRandomnessInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.RequestRandomnessInstruction} RequestRandomnessInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestRandomnessInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.RequestRandomnessInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RequestRandomnessInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.RequestRandomnessInstruction} RequestRandomnessInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RequestRandomnessInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RequestRandomnessInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RequestRandomnessInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };
    
            /**
             * Creates a RequestRandomnessInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.RequestRandomnessInstruction} RequestRandomnessInstruction
             */
            RequestRandomnessInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.RequestRandomnessInstruction)
                    return object;
                return new $root.SwitchboardInstruction.RequestRandomnessInstruction();
            };
    
            /**
             * Creates a plain object from a RequestRandomnessInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.RequestRandomnessInstruction} message RequestRandomnessInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RequestRandomnessInstruction.toObject = function toObject() {
                return {};
            };
    
            /**
             * Converts this RequestRandomnessInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.RequestRandomnessInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RequestRandomnessInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RequestRandomnessInstruction;
        })();
    
        SwitchboardInstruction.RespondRandomnessInstruction = (function() {
    
            /**
             * Properties of a RespondRandomnessInstruction.
             * @memberof SwitchboardInstruction
             * @interface IRespondRandomnessInstruction
             * @property {Uint8Array|null} [value] RespondRandomnessInstruction value
             * @property {Uint8Array|null} [proof] RespondRandomnessInstruction proof
             */
    
            /**
             * Constructs a new RespondRandomnessInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a RespondRandomnessInstruction.
             * @implements IRespondRandomnessInstruction
             * @constructor
             * @param {SwitchboardInstruction.IRespondRandomnessInstruction=} [properties] Properties to set
             */
            function RespondRandomnessInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * RespondRandomnessInstruction value.
             * @member {Uint8Array} value
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @instance
             */
            RespondRandomnessInstruction.prototype.value = $util.newBuffer([]);
    
            /**
             * RespondRandomnessInstruction proof.
             * @member {Uint8Array} proof
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @instance
             */
            RespondRandomnessInstruction.prototype.proof = $util.newBuffer([]);
    
            /**
             * Creates a new RespondRandomnessInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.IRespondRandomnessInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.RespondRandomnessInstruction} RespondRandomnessInstruction instance
             */
            RespondRandomnessInstruction.create = function create(properties) {
                return new RespondRandomnessInstruction(properties);
            };
    
            /**
             * Encodes the specified RespondRandomnessInstruction message. Does not implicitly {@link SwitchboardInstruction.RespondRandomnessInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.IRespondRandomnessInstruction} message RespondRandomnessInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RespondRandomnessInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
                if (message.proof != null && Object.hasOwnProperty.call(message, "proof"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.proof);
                return writer;
            };
    
            /**
             * Encodes the specified RespondRandomnessInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.RespondRandomnessInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.IRespondRandomnessInstruction} message RespondRandomnessInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RespondRandomnessInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a RespondRandomnessInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.RespondRandomnessInstruction} RespondRandomnessInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RespondRandomnessInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.RespondRandomnessInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bytes();
                        break;
                    case 2:
                        message.proof = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a RespondRandomnessInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.RespondRandomnessInstruction} RespondRandomnessInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RespondRandomnessInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a RespondRandomnessInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RespondRandomnessInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                if (message.proof != null && message.hasOwnProperty("proof"))
                    if (!(message.proof && typeof message.proof.length === "number" || $util.isString(message.proof)))
                        return "proof: buffer expected";
                return null;
            };
    
            /**
             * Creates a RespondRandomnessInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.RespondRandomnessInstruction} RespondRandomnessInstruction
             */
            RespondRandomnessInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.RespondRandomnessInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.RespondRandomnessInstruction();
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                if (object.proof != null)
                    if (typeof object.proof === "string")
                        $util.base64.decode(object.proof, message.proof = $util.newBuffer($util.base64.length(object.proof)), 0);
                    else if (object.proof.length)
                        message.proof = object.proof;
                return message;
            };
    
            /**
             * Creates a plain object from a RespondRandomnessInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @static
             * @param {SwitchboardInstruction.RespondRandomnessInstruction} message RespondRandomnessInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RespondRandomnessInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                    if (options.bytes === String)
                        object.proof = "";
                    else {
                        object.proof = [];
                        if (options.bytes !== Array)
                            object.proof = $util.newBuffer(object.proof);
                    }
                }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                if (message.proof != null && message.hasOwnProperty("proof"))
                    object.proof = options.bytes === String ? $util.base64.encode(message.proof, 0, message.proof.length) : options.bytes === Array ? Array.prototype.slice.call(message.proof) : message.proof;
                return object;
            };
    
            /**
             * Converts this RespondRandomnessInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.RespondRandomnessInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RespondRandomnessInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return RespondRandomnessInstruction;
        })();
    
        SwitchboardInstruction.ConfirmRandomnessProofInstruction = (function() {
    
            /**
             * Properties of a ConfirmRandomnessProofInstruction.
             * @memberof SwitchboardInstruction
             * @interface IConfirmRandomnessProofInstruction
             * @property {Uint8Array|null} [proof] ConfirmRandomnessProofInstruction proof
             */
    
            /**
             * Constructs a new ConfirmRandomnessProofInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a ConfirmRandomnessProofInstruction.
             * @implements IConfirmRandomnessProofInstruction
             * @constructor
             * @param {SwitchboardInstruction.IConfirmRandomnessProofInstruction=} [properties] Properties to set
             */
            function ConfirmRandomnessProofInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ConfirmRandomnessProofInstruction proof.
             * @member {Uint8Array} proof
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @instance
             */
            ConfirmRandomnessProofInstruction.prototype.proof = $util.newBuffer([]);
    
            /**
             * Creates a new ConfirmRandomnessProofInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {SwitchboardInstruction.IConfirmRandomnessProofInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.ConfirmRandomnessProofInstruction} ConfirmRandomnessProofInstruction instance
             */
            ConfirmRandomnessProofInstruction.create = function create(properties) {
                return new ConfirmRandomnessProofInstruction(properties);
            };
    
            /**
             * Encodes the specified ConfirmRandomnessProofInstruction message. Does not implicitly {@link SwitchboardInstruction.ConfirmRandomnessProofInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {SwitchboardInstruction.IConfirmRandomnessProofInstruction} message ConfirmRandomnessProofInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConfirmRandomnessProofInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.proof != null && Object.hasOwnProperty.call(message, "proof"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.proof);
                return writer;
            };
    
            /**
             * Encodes the specified ConfirmRandomnessProofInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.ConfirmRandomnessProofInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {SwitchboardInstruction.IConfirmRandomnessProofInstruction} message ConfirmRandomnessProofInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConfirmRandomnessProofInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ConfirmRandomnessProofInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.ConfirmRandomnessProofInstruction} ConfirmRandomnessProofInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConfirmRandomnessProofInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.proof = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ConfirmRandomnessProofInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.ConfirmRandomnessProofInstruction} ConfirmRandomnessProofInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConfirmRandomnessProofInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ConfirmRandomnessProofInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ConfirmRandomnessProofInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.proof != null && message.hasOwnProperty("proof"))
                    if (!(message.proof && typeof message.proof.length === "number" || $util.isString(message.proof)))
                        return "proof: buffer expected";
                return null;
            };
    
            /**
             * Creates a ConfirmRandomnessProofInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.ConfirmRandomnessProofInstruction} ConfirmRandomnessProofInstruction
             */
            ConfirmRandomnessProofInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.ConfirmRandomnessProofInstruction();
                if (object.proof != null)
                    if (typeof object.proof === "string")
                        $util.base64.decode(object.proof, message.proof = $util.newBuffer($util.base64.length(object.proof)), 0);
                    else if (object.proof.length)
                        message.proof = object.proof;
                return message;
            };
    
            /**
             * Creates a plain object from a ConfirmRandomnessProofInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @static
             * @param {SwitchboardInstruction.ConfirmRandomnessProofInstruction} message ConfirmRandomnessProofInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ConfirmRandomnessProofInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.proof = "";
                    else {
                        object.proof = [];
                        if (options.bytes !== Array)
                            object.proof = $util.newBuffer(object.proof);
                    }
                if (message.proof != null && message.hasOwnProperty("proof"))
                    object.proof = options.bytes === String ? $util.base64.encode(message.proof, 0, message.proof.length) : options.bytes === Array ? Array.prototype.slice.call(message.proof) : message.proof;
                return object;
            };
    
            /**
             * Converts this ConfirmRandomnessProofInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.ConfirmRandomnessProofInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ConfirmRandomnessProofInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ConfirmRandomnessProofInstruction;
        })();
    
        SwitchboardInstruction.SetVrfPermitInstruction = (function() {
    
            /**
             * Properties of a SetVrfPermitInstruction.
             * @memberof SwitchboardInstruction
             * @interface ISetVrfPermitInstruction
             * @property {boolean|null} [enabled] SetVrfPermitInstruction enabled
             */
    
            /**
             * Constructs a new SetVrfPermitInstruction.
             * @memberof SwitchboardInstruction
             * @classdesc Represents a SetVrfPermitInstruction.
             * @implements ISetVrfPermitInstruction
             * @constructor
             * @param {SwitchboardInstruction.ISetVrfPermitInstruction=} [properties] Properties to set
             */
            function SetVrfPermitInstruction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SetVrfPermitInstruction enabled.
             * @member {boolean} enabled
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @instance
             */
            SetVrfPermitInstruction.prototype.enabled = false;
    
            /**
             * Creates a new SetVrfPermitInstruction instance using the specified properties.
             * @function create
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {SwitchboardInstruction.ISetVrfPermitInstruction=} [properties] Properties to set
             * @returns {SwitchboardInstruction.SetVrfPermitInstruction} SetVrfPermitInstruction instance
             */
            SetVrfPermitInstruction.create = function create(properties) {
                return new SetVrfPermitInstruction(properties);
            };
    
            /**
             * Encodes the specified SetVrfPermitInstruction message. Does not implicitly {@link SwitchboardInstruction.SetVrfPermitInstruction.verify|verify} messages.
             * @function encode
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {SwitchboardInstruction.ISetVrfPermitInstruction} message SetVrfPermitInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetVrfPermitInstruction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.enabled != null && Object.hasOwnProperty.call(message, "enabled"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.enabled);
                return writer;
            };
    
            /**
             * Encodes the specified SetVrfPermitInstruction message, length delimited. Does not implicitly {@link SwitchboardInstruction.SetVrfPermitInstruction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {SwitchboardInstruction.ISetVrfPermitInstruction} message SetVrfPermitInstruction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SetVrfPermitInstruction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SetVrfPermitInstruction message from the specified reader or buffer.
             * @function decode
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {SwitchboardInstruction.SetVrfPermitInstruction} SetVrfPermitInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetVrfPermitInstruction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SwitchboardInstruction.SetVrfPermitInstruction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.enabled = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SetVrfPermitInstruction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {SwitchboardInstruction.SetVrfPermitInstruction} SetVrfPermitInstruction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SetVrfPermitInstruction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SetVrfPermitInstruction message.
             * @function verify
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SetVrfPermitInstruction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.enabled != null && message.hasOwnProperty("enabled"))
                    if (typeof message.enabled !== "boolean")
                        return "enabled: boolean expected";
                return null;
            };
    
            /**
             * Creates a SetVrfPermitInstruction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {SwitchboardInstruction.SetVrfPermitInstruction} SetVrfPermitInstruction
             */
            SetVrfPermitInstruction.fromObject = function fromObject(object) {
                if (object instanceof $root.SwitchboardInstruction.SetVrfPermitInstruction)
                    return object;
                var message = new $root.SwitchboardInstruction.SetVrfPermitInstruction();
                if (object.enabled != null)
                    message.enabled = Boolean(object.enabled);
                return message;
            };
    
            /**
             * Creates a plain object from a SetVrfPermitInstruction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @static
             * @param {SwitchboardInstruction.SetVrfPermitInstruction} message SetVrfPermitInstruction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SetVrfPermitInstruction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.enabled = false;
                if (message.enabled != null && message.hasOwnProperty("enabled"))
                    object.enabled = message.enabled;
                return object;
            };
    
            /**
             * Converts this SetVrfPermitInstruction to JSON.
             * @function toJSON
             * @memberof SwitchboardInstruction.SetVrfPermitInstruction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SetVrfPermitInstruction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SetVrfPermitInstruction;
        })();
    
        return SwitchboardInstruction;
    })();
    
    /**
     * SwitchboardAccountType enum.
     * @exports SwitchboardAccountType
     * @enum {number}
     * @property {number} TYPE_UNINITIALIZED=0 TYPE_UNINITIALIZED value
     * @property {number} TYPE_AGGREGATOR=1 TYPE_AGGREGATOR value
     * @property {number} TYPE_FULFILLMENT_MANAGER=2 TYPE_FULFILLMENT_MANAGER value
     * @property {number} TYPE_JOB_DEFINITION=3 TYPE_JOB_DEFINITION value
     * @property {number} TYPE_FULFILLMENT_MANAGER_AUTH=4 TYPE_FULFILLMENT_MANAGER_AUTH value
     * @property {number} TYPE_AGGREGATOR_RESULT_PARSE_OPTIMIZED=5 TYPE_AGGREGATOR_RESULT_PARSE_OPTIMIZED value
     * @property {number} TYPE_BUNDLE=6 result replicas.
     * @property {number} TYPE_BUNDLE_AUTH=7 Denotes an authorization account that lets an aggregator write to a bundle.
     * @property {number} TYPE_VRF=8 TYPE_VRF value
     * @property {number} TYPE_VRF_PERMIT=9 TYPE_VRF_PERMIT value
     */
    $root.SwitchboardAccountType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TYPE_UNINITIALIZED"] = 0;
        values[valuesById[1] = "TYPE_AGGREGATOR"] = 1;
        values[valuesById[2] = "TYPE_FULFILLMENT_MANAGER"] = 2;
        values[valuesById[3] = "TYPE_JOB_DEFINITION"] = 3;
        values[valuesById[4] = "TYPE_FULFILLMENT_MANAGER_AUTH"] = 4;
        values[valuesById[5] = "TYPE_AGGREGATOR_RESULT_PARSE_OPTIMIZED"] = 5;
        values[valuesById[6] = "TYPE_BUNDLE"] = 6;
        values[valuesById[7] = "TYPE_BUNDLE_AUTH"] = 7;
        values[valuesById[8] = "TYPE_VRF"] = 8;
        values[valuesById[9] = "TYPE_VRF_PERMIT"] = 9;
        return values;
    })();

    return $root;
});
