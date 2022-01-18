import {
  CardActionCollection,
  CardImagePositionCollection,
  CardModel,
  ComponentModel,
  ComponentTypeCollection,
  ComponentTypeMap,
  ImageSizeCollection,
  PutOneComponentWithOneCardModel,
  PutOneComponentWithoutCardModel,
  Remove,
  StyleCollection,
} from "api-shared";
import {
  defined,
  elementOf,
  equals,
  getPromise,
  gte,
  id,
  imageUrl,
  object,
  ofType,
  optional,
  runOnValuePresent,
  truthy,
} from "../core";
import { updateOneComponent } from "../database/updateOneComponent";
import { getWrappedHandler, storeAndOrGetImageUrl } from "./core";
import { putOneFactory } from "./factories";

export const putOneComponent = putOneFactory<
  PutOneComponentWithOneCardModel | PutOneComponentWithoutCardModel,
  Remove<ComponentModel, "status" | "deletedAt">
>({
  name: "putOneComponent",
  eventValidators: { resource: equals("/components/{id}") },
  putOneModelValidators: {
    id: id(),
    internalName: [truthy(), ofType("string")],
    libraryComponent: optional(ofType("boolean")),
    ad: [defined(), ofType("boolean")],
    card: optional([
      truthy(),
      object({
        action: [truthy(), elementOf(CardActionCollection.getKeys())],
        description: optional([ofType("string")]),
        id: id(),
        imageUrl: optional([imageUrl]),
        title: optional([ofType("string")]),
        url: optional([ofType("string")]),
        visible: optional([ofType("boolean")]),
      }),
    ]),
    cardImagePosition: optional(
      elementOf(CardImagePositionCollection.getKeys())
    ),
    cardImageSize: optional(elementOf(ImageSizeCollection.getKeys())),
    type: [truthy(), elementOf(ComponentTypeCollection.getKeys())],
    title: optional(ofType("string")),
    subTitle: optional(ofType("string")),
    style: [truthy(), elementOf(StyleCollection.getKeys())],
    maxCards: [truthy(), ofType("number"), gte(1)],
    viewAllText: [truthy(), ofType("string")],
    visible: optional(ofType("boolean")),
  },
  updateOneModelMapper: async (model) => {
    const {
      ad,
      id,
      internalName,
      libraryComponent,
      maxCards,
      style,
      type,
      viewAllText,
      visible,
      cardImagePosition,
      cardImageSize,
      dates,
      subTitle,
      title,
    } = model;
    const { card } = model as PutOneComponentWithOneCardModel;
    const { imageUrl } = card;

    return {
      id,
      model: {
        ad,
        id,
        internalName,
        libraryComponent,
        maxCards,
        style,
        type,
        viewAllText,
        visible,
        cards: ComponentTypeMap.get(type).supportOneCardOnly
          ? [
              {
                ...card,
                imageUrl: await getPromise(
                  runOnValuePresent(imageUrl, () =>
                    storeAndOrGetImageUrl(imageUrl)
                  )
                ),
              } as CardModel,
            ]
          : undefined,
        cardImagePosition,
        cardImageSize,
        dates,
        subTitle,
        title,
      },
    };
  },
  //  todo: replace with 2 transaction participant data calls (component and cards)
  updateOne: updateOneComponent,
});

export const handler = getWrappedHandler(putOneComponent);
