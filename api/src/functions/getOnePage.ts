import { PageModel } from "api-shared";
import { equals, getWrappedHandler, httpMethod, loggerFactory } from "../core";
import { readOnePage } from "../database/readOnePage";
import {
  defaultGetOneModelValidators,
  defaultOneModelMapper,
  defaultReadOneModelMapper,
} from "./core";
import { getOneByIdFactory } from "./factories";

export type PageDateFilterKey = "all" | "future" | "past" | "custom";

const logger = loggerFactory("getOnePage");

export const getOnePage = getOneByIdFactory<PageModel>({
  name: "getOnePage",
  eventValidators: {
    httpMethod: httpMethod("GET"),
    resource: equals("/pages/{id}"),
  },
  getOneModelMapper: defaultOneModelMapper,
  getOneModelValidators: defaultGetOneModelValidators,
  readOneModelMapper: defaultReadOneModelMapper,
  readOne: readOnePage,
});

export const handler = getWrappedHandler(getOnePage);
