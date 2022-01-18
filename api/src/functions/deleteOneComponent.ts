import { equals, getWrappedHandler, truthy } from "../core";
import { deleteOneByIdFactory } from "./factories/deleteOneByIdFactory";

export const deleteOneComponent = deleteOneByIdFactory({
  name: "deleteOneComponent",
  eventValidators: {
    resource: equals("/components/{id}"),
    pathParameters: truthy(),
  },
  deleteOneByIdModelMapper: (event) => ({ id: +event.pathParameters.id }),
  destroyOneByIdModelMapper: ({ id }) => ({ id }),
  destroyOneById: (model) => Promise.resolve(1),
});

export const handler = getWrappedHandler(deleteOneComponent);
