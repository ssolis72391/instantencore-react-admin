import { ValidationError } from ".";
import { ValidatorJsError } from "../core";
import { ToString } from "./core";
import { FunctionHandler } from "./functions";
import { loggerFactory } from "./logging";

export class ErrorResult {
  constructor(
    public message: string,
    public trace: string = "",
    public errorType: string = "",
    ...additionalFields: [string, unknown][]
  ) {
    additionalFields?.forEach((item) => (this[item[0]] = item[1]));
  }
  get errorMessage() {
    return this.message;
  }
  toString() {
    return JSON.stringify(this);
  }
  /**
   * @summary deserializes value into a ErrorResult instance
   * @param value
   */
  static parse(value: string) {
    const { errorType, message, trace } = JSON.parse(value) as ErrorResult;
    return new ErrorResult(message, trace, errorType);
  }
  [name: string]: unknown;
}

/**
 * Wraps a function handler so that errors can be properly handled
 * @param handler The function handler to wrap
 * @returns A function handler wrapping the input function handler
 *
 * @todo rename to wrapHandler
 * @todo add sentry
 * @todo allow custom cors headers
 * @todo remove ValidatorJs assertion
 */
export function getWrappedHandler(handler: FunctionHandler): FunctionHandler {
  return async (event) => {
    const logger = loggerFactory("getWrappedHandler");
    try {
      logger.debug("Running wrapped function handler");
      return await handler(event);
    } catch (e: unknown) {
      logger.error(
        "An exception has been thrown by the wrapped function handler",
        e instanceof Error ? e : undefined
      );
      let errorResult: ErrorResult;
      if (e instanceof Error || typeof e === "object") {
        errorResult = new ErrorResult(
          e["message"] || e["errorMessage"] || e["code"],
          e["stack"],
          e["name"],
          e instanceof ValidationError
            ? ["errors", e.errors]
            : // workaround until strictNullChecks is set to true
              [undefined, undefined]
        );
      } else if (typeof e === "string") {
        errorResult = new ErrorResult(e);
      } else {
        errorResult = new ErrorResult((e as ToString).toString());
      }
      if (!errorResult.message) {
        errorResult.message = "Unkown error";
      }
      if (!errorResult.errorType) {
        errorResult.errorType = "GenericError";
      }
      if (!errorResult.trace) {
        const stackTarget: { stack?: string } = {};
        Error.captureStackTrace(stackTarget);
        errorResult.trace = stackTarget.stack;
      }
      return {
        body: errorResult.toString(),
        statusCode:
          e instanceof ValidatorJsError || e instanceof ValidationError
            ? 400
            : 500,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        },
      };
    }
  };
}
