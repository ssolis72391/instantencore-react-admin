import { HasId, ProgramModel } from "api-shared";
import { equals, getWrappedHandler } from "../core";
import { id, ofType, truthy } from "../core/validation";
import { updateOneProgram } from "../database/updateOneProgram";
import { putOneFactory } from "./factories";

export const putRestoreOneProgram = putOneFactory<HasId, Partial<ProgramModel>>(
  {
    name: "putRestoreOneProgram",
    putOneModelMapper: ({ pathParameters }) => ({ id: +pathParameters.id }),
    putOneModelValidators: { id: id() },
    updateOneModelMapper: ({ id }) => ({ id, model: { status: "draft" } }),
    eventValidators: {
      pathParameters: [truthy(), ofType("object")],
      resource: equals("/programs/{id}/restore"),
    },
    updateOne: updateOneProgram,
  }
);

export const handler = getWrappedHandler(putRestoreOneProgram);
