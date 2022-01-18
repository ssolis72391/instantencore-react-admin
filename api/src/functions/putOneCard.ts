import { CardModel, PutOneCardModel, Remove } from "api-shared";
import { equals, id } from "../core";
import { updateOneCard } from "../database/updateOneCard";
import { getWrappedHandler } from "./core";
import { putOneFactory } from "./factories";

export const putOneCard = putOneFactory<
  PutOneCardModel,
  Remove<CardModel, "componentId">
>({
  name: "putOneCard",
  eventValidators: { resource: equals("/cards/{id}") },
  putOneModelValidators: { id: id() },
  updateOneModelMapper: ({
    action,
    orderIndex,
    description,
    imageUrl,
    pageId,
    title,
    url,
    visible,
    id,
  }) => ({
    id,
    model: {
      action,
      orderIndex,
      description,
      imageUrl,
      pageId,
      title,
      url,
      visible,
      id,
    },
  }),
  updateOne: updateOneCard,
});

export const handler = getWrappedHandler(putOneCard);
