import {
  GetManyProgramsModel,
  ProgramDateFilterCollection,
  ProgramModel,
  SortDirection,
} from "api-shared";
import {
  elementOf,
  equals,
  getClientIdFromHeader,
  getWrappedHandler,
  gte,
  httpMethod,
  id,
  loggerFactory,
  object,
  ofType,
  optional,
  rfc3339fullDate,
  truthy,
  within,
} from "../core";
import { readManyPrograms } from "../database/readManyPrograms";
import { readOneProgram } from "../database/readOneProgram";
import { getManyHandlerFactory, getOneByIdFactory } from "./factories";

export type ProgramDateFilterKey = "all" | "future" | "past" | "custom";

const logger = loggerFactory("getManyPrograms");

export const getManyPrograms = getManyHandlerFactory<GetManyProgramsModel>({
  name: "getManyPrograms",
  eventValidators: {
    httpMethod: httpMethod("GET"),
    resource: equals("/programs"),
    queryStringParameters: [truthy()],
    multiValueQueryStringParameters: truthy(),
  },
  getManyModelMapper: (event) => {
    const { queryStringParameters, multiValueQueryStringParameters } = event;
    const { sort } = multiValueQueryStringParameters;
    const clientId = getClientIdFromHeader(event.headers);

    const [key, direction] = sort || ["id", "asc"];

    return {
      filter: {
        dateFilter: queryStringParameters[
          "filter[dateFilter]"
        ] as ProgramDateFilterKey,
        deleted:
          queryStringParameters["filter[deleted]"] === "true" ? true : false,
        localEndDate: queryStringParameters["filter[localEndDate]"],
        localStartDate: queryStringParameters["filter[localStartDate]"],
        text: queryStringParameters["filter[text]"],
        clientId: clientId,
      },
      pagination: {
        pageIndex: +queryStringParameters["pagination[pageIndex]"] || 0,
        pageSize: +queryStringParameters["pagination[pageSize]"] || 10,
      },
      sort: [
        key === "dates" ? "localStartDate" : key,
        direction as SortDirection,
      ],
    };
  },
  getManyModelValidation: {
    filter: optional([
      object<any>({
        dateFilter: [
          truthy(),
          elementOf(ProgramDateFilterCollection.getKeys()),
        ],
        localStartDate: optional([rfc3339fullDate]),
        localEndDate: optional([rfc3339fullDate]),
        text: optional([ofType("string")]),
        deleted: ofType("boolean"),
      }),
    ]),
    pagination: object({ pageIndex: gte(0), pageSize: within(1, 10) }),
    sort: optional([
      ofType("object"),
      (value) =>
        Array.isArray(value) &&
        value.length === 2 &&
        !!value[0] &&
        ["asc", "desc"].includes(value[1])
          ? undefined
          : "Invalid sort",
    ]),
  },
  readMany: readManyPrograms,
});

export const getOneProgram = getOneByIdFactory<ProgramModel>({
  name: "getOneProgram",
  eventValidators: {
    httpMethod: httpMethod("GET"),
    resource: equals("/programs/{id}"),
  },
  getOneModelMapper: ({ pathParameters, queryStringParameters }) => ({
    id: +pathParameters.id,
    deleted: queryStringParameters?.deleted === "true",
  }),
  getOneModelValidators: { id: id(), deleted: optional([ofType("boolean")]) },
  readOneModelMapper: ({ id, deleted }) => ({ id, deleted }),
  readOne: readOneProgram,
});

export const handler = getWrappedHandler((event) => {
  const resource = event.resource.replace(/^\/[0-9]+/, "");
  switch (resource) {
    case "/programs": {
      return getManyPrograms(event);
    }
    case "/programs/{id}": {
      return getOneProgram(event);
    }
    default:
      throw new Error(`Resource ${resource} is not recognized`);
  }
});
