import { HasId } from "api-shared";
import {
  FunctionHandler,
  FunctionHandlerEvent,
  FunctionHandlerFactoryArgs,
  getPromise,
  loggerFactory,
  object2,
  ObjectValidators,
  truthy,
  validate,
  Validator,
} from "../../core";
import { UpdateOneById, UpdateOneByIdModel } from "../../core/database";
import {
  httpMethod,
  mergeObjectValidators,
  object,
  ofType,
  optional,
} from "../../core/validation";
import { putOkResponse } from "../core";

interface PutOneModelContext<PutOneModel> {
  putOneModel: PutOneModel;
  event: FunctionHandlerEvent;
  id: number;
}

export interface PutOneFactoryArgs<PutOneModel extends HasId, Model>
  extends FunctionHandlerFactoryArgs {
  putOneModelMapper?: (
    event: FunctionHandlerEvent
  ) => PutOneModel | Promise<PutOneModel>;
  putOneModelValidators:
    | ObjectValidators<PutOneModel>
    | Validator<PutOneModel>[];
  updateOneModelMapper: (
    model: PutOneModel
  ) => Promise<UpdateOneByIdModel<Model>> | UpdateOneByIdModel<Model>;
  updateOne: UpdateOneById<Model>;
  updateOneResultValidators?: Validator<number> | Validator<number>[];
}

export const putOneFactory = <PutOneModel extends HasId, Model>(
  args: PutOneFactoryArgs<PutOneModel, Model>
) => {
  validate(
    "args",
    "argument",
    args,
    object2(args, {
      name: truthy(),
      eventValidators: truthy(),
      putOneModelMapper: optional(ofType("function")),
      putOneModelValidators: optional([ofType("object")]),
      updateOne: ofType("function"),
      updateOneModelMapper: ofType("function"),
      updateOneResultValidators: optional((value) =>
        (Array.isArray(value) && value.length
          ? typeof value[0] === "function"
          : true) || typeof value === "function"
          ? undefined
          : "Invalid validators"
      ),
    })
  );
  const {
    name,
    eventValidators,
    putOneModelMapper,
    putOneModelValidators,
    updateOneModelMapper,
    updateOne,
    updateOneResultValidators,
  } = args;
  const putOne: FunctionHandler = async (event) => {
    validate(
      "event",
      "event",
      event,
      mergeObjectValidators(
        event,
        eventValidators,
        object({ httpMethod: httpMethod("PUT") })
      )
    );

    const logger = loggerFactory(name);

    const putOneModel = await getPromise(
      (
        putOneModelMapper ||
        ((event) =>
          ({
            ...JSON.parse(event.body),
            id: +event.pathParameters.id,
          } as PutOneModel))
      )(event)
    );

    validate(
      "putOneModel",
      "model",
      putOneModel,
      Array.isArray(putOneModelValidators)
        ? putOneModelValidators
        : [object(putOneModelValidators)]
    );

    const updateOneModel = await updateOneModelMapper(putOneModel);

    const updateOneResult = await updateOne(updateOneModel);

    if (updateOneResultValidators) {
      validate(
        "updateOneResult",
        "result",
        updateOneResult,
        updateOneResultValidators
      );
    }

    const { id } = putOneModel;
    const result = putOkResponse({ id });

    return result;
  };

  return putOne;
};
