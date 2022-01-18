import { equals, getWrappedHandler } from "../core";
import { detroyOneProgram } from "../database/detroyOneProgram";
import { deleteOneByIdFactory } from "./factories/deleteOneByIdFactory";

/**
 * @todo fix event validation
 */
export const deleteOneProgram = deleteOneByIdFactory({
  name: "deleteOneProgram",
  eventValidators: {
    resource: equals("/programs/{id}"),
  },
  deleteOneByIdModelMapper: (event) => ({ id: +event.pathParameters.id }),
  destroyOneByIdModelMapper: ({ id }) => ({ id }),
  destroyOneById: detroyOneProgram,
});

export const handler = getWrappedHandler(deleteOneProgram);
