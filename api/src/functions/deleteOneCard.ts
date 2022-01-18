import { equals, getWrappedHandler, truthy } from "../core";
import { Card } from "../database/models";
import { deleteOneByIdFactory } from "./factories/deleteOneByIdFactory";

export const deleteOneCard = deleteOneByIdFactory({
  name: "deleteOneCard",
  eventValidators: {
    resource: equals("/cards/{id}"),
    pathParameters: truthy(),
  },
  deleteOneByIdModelMapper: (event) => ({ id: +event.pathParameters.id }),
  destroyOneByIdModelMapper: ({ id }) => ({ id }),
  destroyOneById: async (model) => {
    const result = await Card.destroy({
      where: {
        id: model.id,
      },
    });
    return result;
  },
});

export const handler = getWrappedHandler(deleteOneCard);
