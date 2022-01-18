import { CardModel } from "api-shared";
import { equals, getWrappedHandler, httpMethod } from "../core";
import {
  defaultGetOneModelValidators,
  defaultOneModelMapper,
  defaultReadOneModelMapper,
} from "./core";
import { getOneByIdFactory } from "./factories";
import { readOneCard } from "../database/readOneCard";

export const getOneCard = getOneByIdFactory<CardModel>({
  name: "getOneCard",
  eventValidators: {
    httpMethod: httpMethod("GET"),
    resource: equals("/cards/{id}"),
  },
  getOneModelMapper: defaultOneModelMapper,
  getOneModelValidators: defaultGetOneModelValidators,
  readOneModelMapper: defaultReadOneModelMapper,
  readOne: readOneCard,
});

export const handler = getWrappedHandler(getOneCard);
