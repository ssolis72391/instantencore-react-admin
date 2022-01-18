import {
  httpMethod,
  loggerFactory,
  object,
  object2,
  ofType,
  optional,
  truthy,
  validate,
} from "../../core";
import { DestroyOneByIdModel } from "../../core/database";
import {
  DeleteOneByIdFactoryArgs,
  DeleteOneByIdModel,
  FunctionHandler,
} from "../../core/functions";
import { identifier, mergeObjectValidators } from "../../core/validation";
import { deletedResponse } from "../core";

export const deleteOneByIdFactory = <
  TDeleteOneByIdModel extends DeleteOneByIdModel = DeleteOneByIdModel,
  TDestroyOneByIdModel extends DestroyOneByIdModel = DestroyOneByIdModel
>(
  args: DeleteOneByIdFactoryArgs<TDeleteOneByIdModel, TDestroyOneByIdModel>
) => {
  validate(
    "args",
    "argument",
    args,
    object2(args, {
      name: truthy(),
      eventValidators: truthy(),
      deleteOneByIdModelMapper: truthy(),
      destroyOneById: truthy(),
      destroyOneByIdModelMapper: truthy(),
      destroyOneByIdResultMapper: optional([ofType("function")]),
    })
  );
  const {
    name,
    eventValidators,
    deleteOneByIdModelMapper,
    deleteOneByIdModelValidators,
    destroyOneByIdModelMapper,
    destroyOneById,
    destroyOneByIdResultMapper,
  } = args;

  const deleteOneById: FunctionHandler = async (event) => {
    validate(
      "event",
      "event",
      event,
      mergeObjectValidators(
        event,
        eventValidators,
        object<any>({
          httpMethod: httpMethod("DELETE"),
          pathParameters: [truthy(), ofType("object")],
        })
      )
    );

    const logger = loggerFactory(name);

    const deleteOneByIdModel = deleteOneByIdModelMapper(event);

    if (deleteOneByIdModelValidators) {
      validate(
        "deleteOneByIdModelValidators",
        "model",
        deleteOneByIdModel,
        [object({ id: identifier })].concat(
          Array.isArray(deleteOneByIdModelValidators)
            ? deleteOneByIdModelValidators
            : [object(deleteOneByIdModelValidators)]
        )
      );
    }

    const destroyOneByIdModel = destroyOneByIdModelMapper(deleteOneByIdModel);

    const count = await destroyOneById(destroyOneByIdModel);

    const result = destroyOneByIdResultMapper
      ? await destroyOneByIdResultMapper(count)
      : { id: destroyOneByIdModel.id };

    return deletedResponse(result);
  };

  return deleteOneById;
};
