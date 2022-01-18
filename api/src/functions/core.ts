import { ImagePayload, rfc3339_dateonly_format } from "api-shared";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  defined,
  getWrappedHandler,
  identifier,
  Logger,
  loggerFactory,
  ofType,
  rfc3339fullDate,
  storeImage,
  truthy,
  validate,
  ValidationErrors,
  Validator,
  within,
} from "../core";
import {
  validateAPIGatewayProxyEvent,
  validateAPIGatewayProxyEventModel,
  validateBody,
} from "../validation";
import dayjs = require("dayjs");

export {
  validateAPIGatewayProxyEvent,
  validateAPIGatewayProxyEventModel,
  validateBody,
};
export { defaultHeaders, DefaultHeaders, getWrappedHandler };

type DefaultHeaders = {
  "Access-Control-Allow-Headers"?: string;
  "Access-Control-Allow-Origin"?: string;
  "Access-Control-Allow-Methods"?: string;
};

const defaultHeaders: DefaultHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export function putOkResponse(body: unknown): APIGatewayProxyResult {
  const headers: DefaultHeaders = {
    ...defaultHeaders,
    "Access-Control-Allow-Methods": "GET,OPTIONS,PUT",
  };

  return {
    body: JSON.stringify(body),
    statusCode: 200,
    headers,
  };
}

export function postOkResponse(body: any): APIGatewayProxyResult {
  const headers: DefaultHeaders = {
    ...defaultHeaders,
    "Access-Control-Allow-Methods": "POST",
  };

  return {
    body: JSON.stringify(body),
    statusCode: 200,
    headers,
  };
}

export function notFound(): APIGatewayProxyResult {
  return {
    statusCode: 404,
    body: JSON.stringify({
      errorMessage: "A resource was not found",
      errorType: "NotFoundError",
    }),
    headers: defaultHeaders,
  };
}

/**
 * @todo rename to okResult
 * @param body payload to be sent as JSON in the body
 * @param loggerOrName (optional) logger or logger name that will handle the messages. If falsy an internal logger will be used.
 * @returns an `APIGatewayProxyResult` instance
 */
export function okResult(
  body: unknown,
  loggerOrName?: Logger | string
): APIGatewayProxyResult {
  const logger = !loggerOrName
    ? loggerFactory("okResult")
    : typeof loggerOrName === "object" &&
      typeof loggerOrName.debug === "function"
    ? loggerOrName
    : loggerFactory(loggerOrName);
  logger.debug("Returning APIGatewayProxyResult");
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    //  todo: check if we don't need more headers or augment them
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
  };
}

export function deletedResponse(body: unknown): APIGatewayProxyResult {
  const headers: DefaultHeaders = {
    ...defaultHeaders,
    "Access-Control-Allow-Methods": "DELETE",
  };

  return {
    body: JSON.stringify(body),
    statusCode: 200,
    headers,
  };
}

/**
 * @deprecated
 */
export const handleImagePayload = async ({
  imageUrl: payloadImageUrl,
  isImageDataUrl,
}: ImagePayload) =>
  isImageDataUrl === true
    ? await storeImage(payloadImageUrl)
    : payloadImageUrl || null;

export const HttpMethods = {
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
  GET: "GET",
  OPTIONS: "OPTIONS",
};

export type ModelHandling<Model> =
  | ((model: Model) => void | any)
  | ((model: Model) => void | any)[];

// interface HandlerFactoryArgs {
//   eventValidators:
//     | Validator<APIGatewayProxyEvent>
//     | Validator<APIGatewayProxyEvent>[];
//   name: string;
// }

interface AcceptsDalResultValidator<Model> {
  dalResultValidators?: Validator<Model> | Validator<Model>[];
  /**
   * Future usage
   */
  dalResultValidatorResultsHandlers?: (
    errors: ValidationErrors | ValidationErrors[]
  ) => void | APIGatewayProxyResult;
}

export function createdResult(body: unknown): APIGatewayProxyResult {
  const headers: DefaultHeaders = {
    ...defaultHeaders,
    "Access-Control-Allow-Methods": "POST",
  };

  return {
    body: JSON.stringify(body),
    statusCode: 201,
    headers,
  };
}

export function modelCreatedResult(id: number) {
  validate("id", "argument", id, identifier, "modelCreatedResult");
  return createdResult({ id });
}

/**
 * @todo
 * - validate image extension
 * - validate image data url is well formed
 * - validate image is not local
 */
export async function storeAndOrGetImageUrl(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  } else {
    return await storeImage(imageUrl);
  }
}

//#region todo: type these!
export const defaultOneModelMapper = (event) => {
  const id = +event.pathParameters.id;
  return {
    id,
  } as const;
};

export const defaultGetOneModelValidators = { id: truthy() } as const;
export const defaultReadOneModelMapper = ({ id }) => ({ id } as const);
//#endregion

export function toUtc(value: string, offset: number) {
  validate("value", "argument", value, [truthy(), rfc3339fullDate]);
  validate("offset", "argument", offset, [
    defined(),
    ofType("number"),
    within(-11, 14),
  ]);

  const date = dayjs(value, rfc3339_dateonly_format, true);
  date.add(offset, "hours");

  return date.format(rfc3339_dateonly_format);
}
