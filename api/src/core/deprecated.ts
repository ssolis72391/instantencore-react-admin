/**
 * @deprecated
 */
export const CONSTANTS = {
  rfc3339DateOnlyFormat: "YYYY-MM-DD",
};

/**
 * @deprecated
 */
export enum DateFilter {
  Future = "future",
  Past = "past",
  All = "all",
  Custom = "custom",
}

/**
 * @deprecated
 */
export function getDateFilterValues() {
  const a: string[] = [];
  const dateFilter = DateFilter as any;
  for (const key in dateFilter) {
    a.push(dateFilter[key]);
  }
  return a;
}

import { APIGatewayProxyResult } from "aws-lambda";
import * as Validator from "validatorjs";

/**
 * @deprecated
 */
type Errors = {
  [key: string]: string[];
};

/**
 * @deprecated
 */
export class ValidatorJsError extends Error {
  constructor(
    message?: string,
    validatorOrErrors?: Validator.Validator<any> | Errors
  ) {
    super(message ?? "Validation failed");
    if (validatorOrErrors) {
      if (validatorOrErrors.errorCount) {
        this.errors = (validatorOrErrors as Validator.Validator<any>).errors.errors;
      } else {
        this.errors = validatorOrErrors as Errors;
      }
    }
  }
  errors: Errors;
}
ValidatorJsError.prototype.name = "ValidationError";

/**
 * @deprecated
 * */
export const getManyResult = async <T>(
  records: T[],
  totalCount: number,
  requestModel?: any
): Promise<APIGatewayProxyResult> =>
  await new Promise((resolve) =>
    resolve({
      statusCode: 200,
      headers: {
        "X-Total-Count": totalCount.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count,X-Request-Model",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "X-Request-Model": requestModel
          ? JSON.stringify(requestModel)
          : undefined,
      },
      body: JSON.stringify(records),
    })
  );
