import { CardModel } from "api-shared";
import { createOneFactory } from "./factories";
import { Card } from "./models";

export const createOneCard = createOneFactory<CardModel>({
  name: "createOneCard",
  innerCreateOne: async (model) => {
    const {
      componentId,
      action,
      url,
      pageId,
      imageUrl,
      title,
      description,
      visible,
      orderIndex,
    } = model;
    const { id } = await Card.create({
      action,
      componentId,
      description,
      imageUrl,
      pageId,
      title,
      url,
      visible,
      orderIndex,
    });
    return id;
  },
  resultMapper: (result) => result,
});
