export class UndefinedArgumentError extends Error {
  constructor(argumentName: string) {
    super(`Argument ${argumentName} is undefined`);
  }
}

UndefinedArgumentError.prototype.name = "UndefinedArgumentError";

export class UndefinedOrWrongArgumentError extends Error {
  constructor(argumentName: string) {
    super(`Argument ${argumentName} is undefined`);
  }
}

UndefinedOrWrongArgumentError.prototype.name = "UndefinedOrWrongArgumentError";

/**
 * @todo update methods to accept objects
 */
export interface Logger {
  name: string;
  error(error: Error): void;
  error(message: string): void;
  /**
   * @todo: add support for both  Error or object
   */
  error(message: string, e: Error): void;
  info(messsage: string): void;
  warn(message: string): void;
  debug(message: string): void;
  trace(message: string): void;
}

class CoreLogger implements Logger {
  private readonly prefix: string;
  constructor(public readonly name: string) {
    this.prefix = `[${name}]`;
  }
  error(message: string): void;
  error(error: Error): void;
  error(message: string, e: Error): void;
  error(a: any, b?: any) {
    if (!b) {
      console.error(a);
    } else {
      console.error({ message: a, innerError: b });
    }
  }
  debug(message: string) {
    console.debug(`${this.prefix}: ${message}`);
  }
  info(message: string) {
    console.info(`${this.prefix}: ${message}`);
  }
  /**
   * @todo make this trace, not just an alias for debug
   */
  trace(message: string) {
    console.debug(`${this.prefix}: ${message}`);
  }
  warn(message: string) {
    console.warn(`${this.prefix}: ${message}`);
  }
  skip(message: unknown) {
    // to nothing
  }
}

type Named = { name: string };
// eslint-disable-next-line @typescript-eslint/ban-types
type LoggerFactory = (namedOrName: Named | string) => Logger;

const loggerFactoryCache: { [name: string]: Logger } = {};

const loggerFactoryLogger = new CoreLogger("loggerFactory");
/**
 * @todo do not accept a function anymore since build will rename them
 */
export const loggerFactory: LoggerFactory = (namedOrName) => {
  if (
    !namedOrName ||
    Array.isArray(namedOrName) ||
    (typeof namedOrName === "object" && !namedOrName.name)
  ) {
    throw new UndefinedArgumentError("namedOrName");
  }

  const name =
    typeof namedOrName === "function"
      ? namedOrName.name || "Anonymous or arrow function"
      : (namedOrName as string);

  if (!loggerFactoryCache[name]) {
    const prefix = `[${name}]`;
    loggerFactoryCache[name] = new CoreLogger(name);
  }
  loggerFactoryLogger.skip(`Returning logger '${name}}'`);
  return loggerFactoryCache[name];
};
