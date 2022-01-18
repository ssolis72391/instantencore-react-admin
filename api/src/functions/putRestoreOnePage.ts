import { HasId, PageModel } from "api-shared";
import { equals, getWrappedHandler } from "../core";
import { id, ofType, truthy } from "../core/validation";
import { updateOnePage } from "../database/updateOnePage";
import { putOneFactory } from "./factories";

export const putRestoreOnePage = putOneFactory<
  HasId,
  Pick<Partial<PageModel>, "status">
>({
  name: "putRestoreOnePage",
  putOneModelMapper: ({ pathParameters }) => ({ id: +pathParameters.id }),
  putOneModelValidators: { id: id() },
  updateOneModelMapper: ({ id }) => ({ id, model: { status: "ok" } }),
  eventValidators: {
    pathParameters: [truthy(), ofType("object")],
    resource: equals("/pages/{id}/restore"),
  },
  updateOne: updateOnePage,
});

export const handler = getWrappedHandler(putRestoreOnePage);
