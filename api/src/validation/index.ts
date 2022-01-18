/**
 * todo: remove
 */
import { APIGatewayProxyEvent } from "aws-lambda";
import * as Validator from "validatorjs";
import { Errors, ValidationErrors } from "validatorjs";
import { ValidatorJsError } from "../core";

/**
 * @deprecated
 */
class APIGatewayProxyEventValidationError extends Error {
  constructor() {
    super("Event could not pass validation");
  }
}
APIGatewayProxyEventValidationError.prototype.name =
  "APIGatewayProxyEventValidationError";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * @deprecated
 */
interface validateAPIGatewayProxyEventModel {
  event: APIGatewayProxyEvent;
  httpMethod: HttpMethod;
  resource: string;
}

/**
 * @deprecated
 */
function validateAPIGatewayProxyEvent(
  event: APIGatewayProxyEvent,
  resource: string
): void;
/** Current */
function validateAPIGatewayProxyEvent(
  model: validateAPIGatewayProxyEventModel
): void;
function validateAPIGatewayProxyEvent(a: any, b?: any): void {
  if (typeof a === "object" && typeof b === "string") {
    _validateAPIGatewayProxyEvent1(a as APIGatewayProxyEvent, b as string);
  } else if (typeof b === "object") {
    _validateAPIGatewayProxyEvent2(a as validateAPIGatewayProxyEventModel);
  }
}

/**
 * @deprecated
 */
function _validateAPIGatewayProxyEvent1(
  event: APIGatewayProxyEvent,
  resource: string
): void {
  if (event.resource !== resource) {
    throw new APIGatewayProxyEventValidationError();
  }
}

/**
 * @deprecated
 */
function _validateAPIGatewayProxyEvent2(
  model: validateAPIGatewayProxyEventModel
): void {
  const { event, httpMethod, resource } = model;
  console.debug({ fn: _validateAPIGatewayProxyEvent2.name, model });
  if (event.resource !== resource || event.httpMethod !== httpMethod) {
    throw new APIGatewayProxyEventValidationError();
  }
}

/**
 * @deprecated
 */
class BodyValidationError extends ValidatorJsError {
  constructor(errors: Errors) {
    super("Body validation failed");
    this.errors = errors.errors;
  }
  errors: ValidationErrors;
}
BodyValidationError.prototype.name = "BodyValidationError";

/**
 * @deprecated
 */
Validator.register(
  "eq",
  (value: any, requirement: any, attribute: string) => value === requirement
);

/**
 * @deprecated
 */
export function validateBody<T>(body: T, rules: Validator.Rules) {
  const validator = new Validator<T>(body, rules);
  if (validator.fails()) {
    throw new BodyValidationError(validator.errors);
  }
}

export {
  validateAPIGatewayProxyEvent,
  validateAPIGatewayProxyEventModel,
  HttpMethod,
};
