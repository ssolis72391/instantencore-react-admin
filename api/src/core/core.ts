import { Logger, loggerFactory } from "./logging";

export type Mapper<Source, Target> = (source: Source) => Target;
export function getPromise<T>(t: T | Promise<T>): Promise<T> {
  return t instanceof Promise ? t : Promise.resolve(t);
}
export async function runTryCatch<T>({
  runnable,
  message,
  loggerOrName,
}: {
  runnable: () => Promise<T> | T;
  message: string;
  loggerOrName?: Logger | string;
}) {
  const logger = !loggerOrName
    ? loggerFactory("runTryCatch")
    : typeof loggerOrName === "object" &&
      typeof loggerOrName.debug === "function"
    ? loggerOrName
    : typeof loggerOrName === "string"
    ? loggerFactory(loggerOrName)
    : undefined;

  if (!logger) {
    throw Error("Invalid 'loggerOrName' argument'");
  }

  try {
    logger.debug(message);
    return await getPromise(runnable());
  } catch (error) {
    logger.error(message, error);
    throw error;
  }
}

/**
 * Runs a callback of value is null or undefined
 */
export function runOnValuePresent<T>(
  value: T,
  runnable: () => T | Promise<T>
): T | Promise<T> {
  if (value === undefined || value === null) {
    return value;
  } else {
    return runnable();
  }
}

/**
 * To avoid asserting objects as {@link Object}
 */
export interface ToString {
  toString(): string;
}

/**
 * Runs a callback for each element of ^source`. Optionally can run them in parallel
 * @param source array
 * @param callback async function
 * @param parallel if true runs the callbacks in parallel, otherwise in serial fashion
 * @returns An array with results (undefined if callbacks are void)
 */
export async function forEachAsync<T, R>(
  source: T[],
  callback: (element: T) => Promise<R>,
  parallel = false
): Promise<R[]> {
  if (parallel) {
    return await Promise.all(source.map((item) => callback(item)));
  }
  const results: R[] = [];
  const { length } = source;
  for (let i = 0; i < length; i++) {
    const element = source[i];
    results.push(await callback(element));
  }
  return results;
}
