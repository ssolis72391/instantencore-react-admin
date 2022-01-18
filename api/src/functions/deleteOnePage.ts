import { equals, getWrappedHandler } from "../core";
import { updateOnePage } from "../database/updateOnePage";
import { deleteOneByIdFactory } from "./factories/deleteOneByIdFactory";

export const deleteOnePage = deleteOneByIdFactory({
  name: "deleteOnePage",
  eventValidators: {
    resource: equals("/pages/{id}"),
  },
  deleteOneByIdModelMapper: ({ pathParameters }) => ({
    id: +pathParameters.id,
  }),
  destroyOneByIdModelMapper: ({ id }) => ({ id }),
  destroyOneById: ({ id }) =>
    updateOnePage({ id, model: { status: "deleted" } }),
});

export const handler = getWrappedHandler(deleteOnePage);
