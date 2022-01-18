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
  FunctionHandler,
  UnDeleteOneByIdFactoryArgs,
  UnDeleteOneByIdModel,
} from "../../core/functions";
import { identifier, mergeObjectValidators } from "../../core/validation";
import { okResult } from "../core";

export const undeleteOneByIdFactory = <
  TUnDeleteOneByIdModel extends UnDeleteOneByIdModel = UnDeleteOneByIdModel,
  TDestroyOneByIdModel extends DestroyOneByIdModel = DestroyOneByIdModel
>(
  args: UnDeleteOneByIdFactoryArgs<TUnDeleteOneByIdModel, TDestroyOneByIdModel>
) => {
  validate(
    "args",
    "argument",
    args,
    object2(args, {
      name: truthy(),
      eventValidators: truthy(),
      unDeleteOneByIdModelMapper: truthy(),
      unDestroyOneById: truthy(),
      unDestroyOneByIdModelMapper: truthy(),
      unDestroyOneByIdResultMapper: optional([ofType("function")]),
    })
  );
  const {
    name,
    eventValidators,
    unDeleteOneByIdModelMapper,
    unDeleteOneByIdModelValidators,
    unDestroyOneByIdModelMapper,
    unDestroyOneById,
    unDestroyOneByIdResultMapper,
  } = args;

  const undeleteOneById: FunctionHandler = async (event) => {
    validate(
      "event",
      "event",
      event,
      mergeObjectValidators(
        event,
        eventValidators,
        object<any>({
          httpMethod: httpMethod("POST"),
          pathParameters: truthy(),
        })
      )
    );

    const logger = loggerFactory(name);

    const undeleteOneByIdModel = unDeleteOneByIdModelMapper(event);

    if (unDeleteOneByIdModelValidators) {
      validate(
        "undeleteOneByIdModel",
        "model",
        undeleteOneByIdModel,
        [object<any>({ id: identifier })].concat(
          Array.isArray(unDeleteOneByIdModelValidators)
            ? unDeleteOneByIdModelValidators
            : [object2(undeleteOneByIdModel, unDeleteOneByIdModelValidators)]
        )
      );
    }

    const unDestroyOneByIdModel = unDestroyOneByIdModelMapper(
      undeleteOneByIdModel
    );

    const count = await unDestroyOneById(unDestroyOneByIdModel);

    const result = unDestroyOneByIdResultMapper
      ? await unDestroyOneByIdResultMapper(count)
      : {
          id: unDestroyOneByIdModel.id,
          message: "Deleted resource has been restored",
        };

    return okResult(result);
  };

  return undeleteOneById;
};
