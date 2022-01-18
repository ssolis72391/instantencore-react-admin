import { equals, getWrappedHandler, truthy } from "../core";
import { undeleteOneByIdFactory } from "./factories/undeleteOneByIdFactory";

export const unDeleteOneComponent = undeleteOneByIdFactory({
  name: "unDeleteOneComponent",
  eventValidators: {
    resource: equals("/components/{id}/undelete"),
    pathParameters: truthy(),
  },
  unDeleteOneByIdModelMapper: (event) => ({ id: +event.pathParameters.id }),
  unDestroyOneByIdModelMapper: ({ id }) => ({ id }),
  unDestroyOneById: (model) => Promise.resolve(1),
});

export const handler = getWrappedHandler(unDeleteOneComponent);
