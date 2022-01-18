import { CardModel } from "api-shared";
import { updateOneByIdFactory } from "./factories";
import { Card } from "./models";

export const updateOneCard = updateOneByIdFactory<
  Partial<CardModel>,
  Partial<Card>
>({
  name: "updateOneCard",
  innerUpdateOneByIdModelMapper: ({ id, model }) => {
    const {
      action,
      orderIndex,
      description,
      imageUrl,
      pageId,
      title,
      url,
      visible,
    } = model;

    return {
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
      },
    };
  },
  innerUpdateOneById: async ({ id, model }) => {
    const result = await Card.update(model, { where: { id } });
    return result[0];
  },
});
