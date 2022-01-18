import { Filter, GetManyModel, HasId } from "api-shared";
import {
  FunctionHandler,
  loggerFactory,
  object,
  ofType,
  truthy,
  validate,
  validateObject,
} from "../../core";
import { GetManyHandlerFactoryArgs } from "../../core/functions";
import { nonEmpty } from "../../core/validation";
import { okResult } from "../core";

export function getManyHandlerFactory<
  TGetManyModel extends GetManyModel<any, Filter<any>>,
  OneModel extends HasId = TGetManyModel extends GetManyModel<
    infer Model,
    infer Filter
  >
    ? Model
    : HasId
>(args: GetManyHandlerFactoryArgs<TGetManyModel, OneModel>): FunctionHandler {
  validate("args", "argument", args, [
    truthy(),
    object({
      name: nonEmpty(),
      getManyModelMapper: [truthy(), ofType("function")],
      readMany: [truthy(), ofType("function")],
      eventValidators: [truthy(), ofType("object")],
      getManyModelValidation: [truthy(), ofType("object")],
    }),
  ]);

  const {
    readMany,
    eventValidators,
    getManyModelMapper,
    name,
    getManyModelValidation,
  } = args;

  const logger = loggerFactory(getManyHandlerFactory);
  logger.debug(`Building getManyHandler '${name}'`);

  const handler: FunctionHandler = async (event) => {
    const logger = loggerFactory(name);

    validateObject("event", event, eventValidators);

    const getManyModel = getManyModelMapper(event);

    validate(
      "getManyModel",
      "model",
      getManyModel,
      [truthy()].concat(object(getManyModelValidation))
    );

    const result = await readMany(getManyModel);
    return okResult(result);
  };
  logger.debug(`getManyHandler '${name}' has been built`);
  return handler;
}
