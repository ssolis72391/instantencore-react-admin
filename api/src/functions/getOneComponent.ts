import {
  ComponentModel,
  ComponentTypeMap,
  ComponentWithOneCardModel,
} from "api-shared";
import { equals, getWrappedHandler, httpMethod } from "../core";
import { readOneComponent } from "../database/readOneComponent";
import {
  defaultGetOneModelValidators,
  defaultOneModelMapper,
  defaultReadOneModelMapper,
} from "./core";
import { getOneByIdFactory } from "./factories";

export const getOneComponent = getOneByIdFactory<ComponentModel>({
  name: "getOneComponent",
  eventValidators: {
    httpMethod: httpMethod("GET"),
    resource: equals("/components/{id}"),
  },
  getOneModelMapper: defaultOneModelMapper,
  getOneModelValidators: defaultGetOneModelValidators,
  readOneModelMapper: defaultReadOneModelMapper,
  readOne: readOneComponent,
  resultMapper: ({
    ad,
    id,
    internalName,
    libraryComponent,
    maxCards,
    status,
    style,
    type,
    viewAllText,
    visible,
    cardImagePosition,
    cardImageSize,
    cards,
    dates,
    subTitle,
    title,
  }) => {
    if (ComponentTypeMap.get(type).isList) {
      return {
        ad,
        id,
        internalName,
        libraryComponent,
        maxCards,
        status,
        style,
        type,
        viewAllText,
        visible,
        cardImagePosition,
        cardImageSize,
        cards,
        dates,
        subTitle,
        title,
      } as ComponentModel;
    } else {
      return {
        ad,
        id,
        internalName,
        libraryComponent,
        maxCards,
        status,
        style,
        type,
        viewAllText,
        visible,
        cardImagePosition,
        cardImageSize,
        card: cards[0],
        dates,
        subTitle,
        title,
      } as ComponentWithOneCardModel;
    }
  },
});

export const handler = getWrappedHandler(getOneComponent);
