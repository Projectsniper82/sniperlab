# Installation
> `npm install --save @types/promise-retry`

# Summary
This package contains type definitions for promise-retry (https://github.com/IndigoUnited/node-promise-retry).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/promise-retry.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/promise-retry/index.d.ts)
````ts
import { OperationOptions } from "retry";
/**
 * A function that is retryable, by having implicitly-bound params for both an error handler and an attempt number.
 *
 * @param retry The retry callback upon any rejection. Essentially throws the error on in the form of a { retried: err }
 * wrapper, and tags it with a 'code' field of value "EPROMISERETRY" so that it is recognised as needing retrying. Call
 * this from the catch() block when you want to retry a rejected attempt.
 * @param attempt The number of the attempt.
 * @returns A Promise for anything (eg. a HTTP response).
 */
type RetryableFn<ResolutionType> = (retry: (error: any) => never, attempt: number) => Promise<ResolutionType>;
/**
 * Wrap all functions of the object with retry. The params can be entered in either order, just like in the original library.
 *
 * @param retryableFn The function to retry.
 * @param options The options for how long/often to retry the function for.
 * @returns The Promise resolved by the input retryableFn, or rejected (if not retried) from its catch block.
 */
declare function promiseRetry<ResolutionType>(
    retryableFn: RetryableFn<ResolutionType>,
    options?: OperationOptions,
): Promise<ResolutionType>;
declare function promiseRetry<ResolutionType>(
    options: OperationOptions,
    retryableFn: RetryableFn<ResolutionType>,
): Promise<ResolutionType>;
export = promiseRetry;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 09:09:39 GMT
 * Dependencies: [@types/retry](https://npmjs.com/package/@types/retry)

# Credits
These definitions were written by [Jamie Birch](https://github.com/shirakaba).
