import { equals, getWrappedHandler, truthy } from "../core";
import { RestoreOneById, RestoreOneByIdModel } from "../core/database";
import { Page } from "../database/models";
import { undeleteOneByIdFactory } from "./factories/undeleteOneByIdFactory";

const restoreOnePage: RestoreOneById = async (model: RestoreOneByIdModel) => {
  const { id } = model;
  const [count] = await Page.update(
    { status: "ok", deletedAt: null },
    { where: { id } }
  );
  return count;
};

export const unDeleteOnePage = undeleteOneByIdFactory({
  name: "deleteOnePage",
  eventValidators: {
    resource: equals("/pages/{id}/undelete"),
    pathParameters: truthy(),
  },
  unDeleteOneByIdModelMapper: (event) => ({ id: +event.pathParameters.id }),
  unDestroyOneByIdModelMapper: ({ id }) => ({ id }),
  unDestroyOneById: restoreOnePage,
});

export const handler = getWrappedHandler(unDeleteOnePage);
