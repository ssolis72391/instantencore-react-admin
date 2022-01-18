import { CardModel, OmitId, PostOneCardModel } from "api-shared";
import { equals } from "../core";
import { createOneCard } from "../database/createOneCard";
import { readLatestCardOrderIndex } from "../database/readLatestCardOrderIndex";
import { getWrappedHandler } from "../functions/core";
import { postOneFactory } from "../functions/factories";

/**
 * @TODO add validation
 */
export const postOneCard = postOneFactory<PostOneCardModel, OmitId<CardModel>>({
  name: "postOneCard",
  eventValidators: { resource: equals("/cards") },
  postOneModelValidators: {},
  modelMapper: async (postOneModel) => {
    const {
      action,
      componentId,
      visible,
      description,
      imageUrl,
      title,
    } = postOneModel;
    const orderIndex = await readLatestCardOrderIndex(componentId);
    return {
      action,
      componentId,
      visible,
      description,
      imageUrl,
      title,
      orderIndex: orderIndex,
    };
  },
  createOne: createOneCard,
});

export const handler = getWrappedHandler(postOneCard);
