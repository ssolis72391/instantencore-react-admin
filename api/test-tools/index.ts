import { ObjectRecord, ProgramModel } from "api-shared";
import {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import * as dayjs from "dayjs";
import * as faker from "faker";
import { CONSTANTS, FunctionHandlerEvent } from "../src/core";
import { ToString } from "../src/core/core";

const randomFutureDate = faker.date.future;
const randomPastDate = faker.date.past;

function toRfc3339StringDateOnlyString(value: Date): string {
  return dayjs(value).format(CONSTANTS.rfc3339DateOnlyFormat);
}

function randomPastRfc3339DateOnlyString() {
  return dayjs(randomPastDate()).format(CONSTANTS.rfc3339DateOnlyFormat);
}
function randomFutureRfc3339DateOnlyString() {
  return dayjs(randomFutureDate()).format(CONSTANTS.rfc3339DateOnlyFormat);
}

function validateInteger(value: number) {
  if (!Number.isInteger(value)) {
    throw Error("Not an integer");
  }
}

function randomWords(count?: number) {
  return faker.random.words(count);
}
const randomNumber = faker.datatype.number;
function randomPositiveInteger(max?: number) {
  if (max) {
    validateInteger(max);
  }

  return randomNumber({ min: 1, max, precision: 0 });
}

const randomProgram = (): ProgramModel => ({
  imageUrl: faker.internet.url(),
  localStartDate: randomPastRfc3339DateOnlyString(),
  localEndDate: randomFutureRfc3339DateOnlyString(),
  internalName: randomWords(3),
  orgId: randomNumber({ min: 1, max: 100 }),
  status: Math.random() == 0 ? "draft" : "published",
  timeZone: "America/Lima",
  headerTitle: randomWords(3),
  utcEndDate: randomPastRfc3339DateOnlyString(),
  utcStartDate: randomFutureRfc3339DateOnlyString(),
  id: randomNumber({ min: 1, max: 100 }),
  isDeleted: Math.random() == 0,
  notes: randomWords(3),
  headerPreTitle: randomWords(3),
  season: randomWords(3),
  headerSubTitle: randomWords(5),
  headerImageSize: "contain",
  headerTextPosition: "above",
});

export {
  randomProgram,
  randomFutureDate,
  randomPastDate,
  randomPastRfc3339DateOnlyString,
  randomFutureRfc3339DateOnlyString,
  randomPositiveInteger,
  randomWords,
  randomNumber,
  toRfc3339StringDateOnlyString,
};

export function parseJson<T>(json: string) {
  return JSON.parse(json) as T;
}

/**
 * Gets the a function mock. This requires the function module to have been mockec previosuly with `jest.mock("module path")`
 */
export function getMockedFunction<T extends (...args: any[]) => any>(value: T) {
  return value as jest.MockedFunction<typeof value>;
}

/**
 * Transforms a record (object) into path APIGatewayProxyEventPathParameters
 */
export function toPathParameters(
  model: Record<string, unknown>
): APIGatewayProxyEventPathParameters {
  const result: APIGatewayProxyEventPathParameters = {};
  Object.entries(model).forEach(
    (item) => (result[item[0]] = (item[1] as ToString).toString())
  );
  return result;
}

export function toQueryStringParameters(
  model: ObjectRecord
): APIGatewayProxyEventQueryStringParameters {
  const result: APIGatewayProxyEventPathParameters = {};
  Object.entries(model).forEach(
    (item) => (result[item[0]] = (item[1] as ToString).toString())
  );
  return result;
}

export function getNewValueForDefined<T, N>(
  value: T | undefined,
  valueFactory: () => N
) {
  if (value !== undefined) {
    return valueFactory();
  } else {
    return undefined;
  }
}

/**
 * Helper to build a lambda event object
 * @deprecated
 * @TODO Replace with typed object
 * @param httpMethod
 * @param resource
 * @param pathParameters
 * @param body
 */
export function buildLambdaEvent<T = unknown>(
  httpMethod: "POST" | "GET" | "PUT" | "DELETE",
  resource:
    | "/components"
    | "/components/{id}"
    | "/components/{id}/restore"
    | string,
  pathParameters: ObjectRecord,
  body?: T,
  queryStringParameters?: ObjectRecord
): FunctionHandlerEvent {
  return {
    httpMethod,
    resource,
    pathParameters: getNewValueForDefined(pathParameters, () =>
      toPathParameters(pathParameters)
    ),
    body: getNewValueForDefined(body, () => JSON.stringify(body)),
    queryStringParameters: getNewValueForDefined(queryStringParameters, () =>
      toQueryStringParameters(queryStringParameters)
    ),
  };
}

/**
 * Parses JSON and expect to match object t
 * @param json JSON payload
 * @param t object to match, can be partial
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function expectJsonToMatchObject<T extends object>(
  json: string,
  t: Partial<T>
) {
  expect(parseJson<T>(json)).toMatchObject(t);
}

/**
 * Helper function that allows you to set the type first
 * @param value
 */
export function toJson<T>(value: T) {
  return JSON.stringify(value);
}
