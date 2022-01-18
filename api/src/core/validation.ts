import { buildTypeMap, rfc3339_dateonly_format } from "api-shared";
import * as dayjs from "dayjs";
import { loggerFactory } from "./logging";

/**
 * todo: change event to lambdaEvent or lambda-event
 * */
type ValidationType =
  | "result"
  | "value"
  | "object"
  | "argument"
  | "model"
  | "body"
  | "event";
const ValidationTypeMap = buildTypeMap<ValidationType>({
  result: "ResultValidation",
  value: "ValueValidation",
  argument: "ArgumentValidation",
  model: "ModelValidation",
  object: "ObjectValidation",
  body: "BodyValidation",
  event: "EventValidation",
});

type ValidationErrorArgs = {
  message?: string;
  key: string;
  type: ValidationType;
  errors: ValidationErrors | ValidationErrors[];
};

function getFirstError(errors: ValidationErrors | ValidationErrors[]) {
  const a = Array.isArray(errors) ? errors : [errors];
  let f = a[0];
  while (typeof f !== "string") {
    if (Array.isArray(f)) {
      f = f[0];
    } else if (typeof f === "object") {
      f = f[Object.keys(f)[0]];
    } else {
      return "Could retrieve the first error";
    }
  }
  return f;
}

export class ValidationError extends Error {
  constructor(args: ValidationErrorArgs) {
    const { errors, key, message, type } = args;

    super(
      message ||
        `Validation for key '${key}' failed. Displaying single or first error: ${getFirstError(
          errors
        )}`
    );

    this.name = `${ValidationTypeMap.values[type]}Error`;
    this.key = key;
    this.type = type;
    this.errors = errors;
  }
  key: string;
  type: ValidationType;
  errors: ValidationErrors | ValidationErrors[];
}
export type HandleValidationResults = (
  type: ValidationType,
  errors: ValidationErrors | ObjectValidationErrors
) => void;

export type ValidationErrors = string | ObjectValidationErrors;
/**
 * @todo add async support
 */
export type Validator<T = any> = (
  value: T
) => ValidationErrors | ValidationErrors[];

/**
 * todo: fix properties validator types
 */
export type ObjectValidators<T> = {
  [Property in keyof T]?: Validator<T[Property]> | Validator<T[Property]>[];
};

//#region builitin validators
/**
 * @summary validates if value is not null or undefined
 */
export const required: Validator = (value) =>
  value === undefined || value === null ? "Value is required" : undefined;
/**
 * @summary validates if value is truthy
 */
export const truthy = (): Validator => (value) =>
  !!value ? undefined : "Value is falsy";

/**
 * Validates if a {@see string} or {@see Array} are undefined or empty (whitespace in the case of the string)
 */
export const nonEmpty = (): Validator<string | []> => (value) =>
  !value || (Array.isArray(value) && !value.length) || !value.trim()
    ? "Value is undefined or empty"
    : undefined;

/**
 * @summary validates if value is falsy
 */
export const falsy: Validator = (value) =>
  !value ? undefined : "Value is truthy";

/**
 * @TODO Rename to rfc3339DateOnly
 */
export const rfc3339fullDate: Validator<string> = (value) => {
  const date = dayjs(value, rfc3339_dateonly_format, true);
  const isValid = date.isValid();
  const parts = value.split("-");
  if (
    !isValid ||
    +parts[0] !== date.get("year") ||
    +parts[1] !== date.get("month") + 1 ||
    +parts[2] !== date.get("date")
  ) {
    return "Invalid Rfc3339 full-date string";
  }
  return undefined;
};

/**
 * @todo replace validators arg with a desconstructed []
 */
export const optional = <T>(
  validators: Validator<T> | Validator<T>[]
): Validator<T> => (value) =>
  !value ? undefined : getValidationResults(value, validators);

export const equals = <T>(other: T): Validator<T> => (value: T) =>
  other !== value ? `Values ${value} and ${other} are not equal` : undefined;

export const httpMethod = (
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
): Validator<string> => (value) =>
  value === httpMethod
    ? undefined
    : `Expected '${httpMethod}' method but got '${value}'`;

/**
 * @alias elementOf
 * @deprecated not the best name. use elementOf
 */
export const included = <T>(array: T[]): Validator<T> => (value: T) =>
  !array?.includes(value) ? "Value is not contained in the array" : undefined;

export const elementOf = included;

/**
 * @description validates if a value is a valid number gt zero
 */
export const id = (): Validator => (value) =>
  isNaN(value) || +value <= 0 ? "Value is not a valid id" : undefined;

/**
 * @deprecated use `id()`
 * @description validates if a value is a valid number gt zero
 * @param value value to be validated
 */
export const identifier: Validator = (value) =>
  isNaN(value) || +value <= 0 ? "Value is not a valid id" : undefined;
export const notNull: Validator = (value) =>
  value === null ? "Value cannot be null" : undefined;

export const gte = <T>(b: T): Validator<T> => (value) =>
  value >= b ? undefined : "Value must be greater than " + b;

export const within = <T>(a: T, b: T): Validator<T> => (value) =>
  value >= a && value <= b
    ? undefined
    : `Value must be greater or equal than ${a} and less or equal than ${b}`;

/**
 * @summary use `object2` to get better type inferance
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const object = <T extends {}>(
  validators: ObjectValidators<T>
): Validator<T> => (value: T) => getObjectValidationErrors(value, validators);

// eslint-disable-next-line @typescript-eslint/ban-types
function getObjectValidationErrors<T extends {}>(
  obj: T,
  validators: ObjectValidators<T>
) {
  validate("obj", "argument", obj, [truthy(), ofType("object")]);
  validate("validators", "argument", validators, [truthy(), ofType("object")]);

  const logger = loggerFactory("getObjectValidationErrors");

  const errors: ObjectValidationErrors<T> = {};
  Object.entries(validators).forEach(
    ([key, validators]: [string, Validator | Validator[]]) => {
      const keyErrors: (ValidationErrors | ValidationErrors[])[] = [];
      if (!Array.isArray(validators)) {
        validators = [validators];
      }
      validators.forEach((item) => {
        const e = item(obj[key]);
        if (e && !(Array.isArray(e) && !e.length)) {
          keyErrors.push(e);
        }
      });
      if (keyErrors.length) {
        errors[key] = keyErrors;
      }
    }
  );
  return Object.entries(errors).length ? errors : undefined;
}
/**
 * @summary replacement of object. accepts a model to infer `T`
 */
export function object2<T>(
  model: T,
  validators: ObjectValidators<T>
): Validator<T> {
  return (value) => {
    validate("value", "argument", value, [truthy(), equals(model)]);
    return getObjectValidationErrors(value, validators);
  };
}

/**
 * @todo assess if `obj` is neccesary for type inference
 */
export function mergeObjectValidators<T>(
  obj: T,
  objectValidators: ObjectValidators<T> | Validator<T>[],
  ...additionalValidators: Validator<T>[]
): Validator<T>[] {
  const validators: Validator<T>[] = [];
  if (Array.isArray(objectValidators)) {
    objectValidators.forEach((item) => validators.push(item));
  } else {
    validators.push(object(objectValidators));
  }
  if (additionalValidators.length) {
    additionalValidators.forEach((item) => validators.push(item));
  }
  return validators;
}

/**
 * @deprecated use `validate` + `mergeObjectValidators`
 */
export function validateObject<T>(
  key: string,
  obj: T,
  validators: ObjectValidators<T> | Validator<T>[]
) {
  validate("key", "argument", key, truthy());
  validate("obj", "argument", obj, truthy());
  validate("validators", "argument", validators, [truthy(), ofType("object")]);

  if (Array.isArray(validators)) {
    validate(key, "object", obj, validators);
  } else if (typeof validators === "object") {
    validate(key, "object", obj, object(validators));
  }
}

const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

export const url: Validator<string> = (value) =>
  !value?.match(url_regex) ? "URL is not valid" : undefined;

const data_image_url_regex = /data:image\/([a-zA-Z]*);base64,([^\"]*)/g;
const image_url_regex = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/g;
export const imageUrl: Validator<string> = (value) =>
  value?.match(data_image_url_regex) || value?.match(image_url_regex)
    ? undefined
    : "Image URL is no valid";

/**
 * @summary validates whether a value is defined or not (`value eq undefined or typeof value eq "undefined"`)
 */
export const defined = (): Validator => (value) =>
  value !== undefined ? undefined : "Value is undefined";

export const ofType = (
  type: "function" | "object" | "string" | "number" | "boolean",
  skipIfFalsy = true
): Validator => (value) =>
  (!value && skipIfFalsy === true) || typeof value === type
    ? undefined
    : `Value is not of type '${type}' but '${typeof value}'`;

export const requiredIfOtherFalsy = (
  other: any,
  otherName: string
): Validator => (value) =>
  !value && !other ? `Value is required if ${otherName} is falsy` : undefined;

//#endregion

type ObjectValidationErrors<T = any> = {
  [Property in keyof T]?: ValidationErrors;
};

export function getValidationResults<T>(
  value: T,
  validators: Validator<T> | Validator<T>[]
): ValidationErrors[] {
  const logger = loggerFactory("validator");
  const errors: ValidationErrors[] = [];
  if (!Array.isArray(validators)) {
    validators = [validators];
  }
  // logger.debug(`Using ${validators.length} validators`);
  validators.forEach((item) => {
    try {
      //  todo: find a way to get validators name
      const error = item(value);
      if (error) {
        if (Array.isArray(error)) {
          error.forEach((item) => errors.push(item));
        } else {
          errors.push(error);
        }
      }
    } catch (e: any) {
      // todo: log the faulty validator name
      logger.error(e);
      throw e;
    }
  });
  return errors;
}

export const validate /*: Validate */ = <T>(
  key: string,
  type: ValidationType,
  value: T,
  validators: Validator<T> | Validator<T>[],
  /**
   * @todo implement
   */
  loggerName?: string
) => {
  const logger = loggerName
    ? loggerFactory(loggerName)
    : loggerFactory("validate function");
  const errors = getValidationResults(value, validators);
  if (errors.length) {
    throw new ValidationError({ errors, key, type });
  }
};

/**
 * @deprecated
 * @todo remove
 */
export class InvalidValueError extends Error {
  constructor(value: any, type: string) {
    super(`Value ${value} of type ${type} is invalid`);
  }
}
InvalidValueError.prototype.name = "InvalidValueError";
