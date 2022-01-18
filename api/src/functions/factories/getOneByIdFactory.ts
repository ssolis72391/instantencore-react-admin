import { HasId } from "api-shared";
import {
  id,
  loggerFactory,
  object2,
  ReadOneByIdModel,
  truthy,
  validate,
} from "../../core";
import {
  FunctionHandler,
  GetOneByIdFactoryArgs,
  GetOneByIdModel,
} from "../../core/functions";
import { mergeObjectValidators, ofType, optional } from "../../core/validation";
import { notFound, okResult } from "../core";

export const getOneByIdFactory = <
  Model extends HasId,
  TGetOneByIdModel extends GetOneByIdModel<Model> = GetOneByIdModel<Model>,
  TReadOneByIdModel extends ReadOneByIdModel<Model> = ReadOneByIdModel<Model>
>(
  args: GetOneByIdFactoryArgs<Model, TGetOneByIdModel, TReadOneByIdModel>
) => {
  validate(
    "args",
    "argument",
    args,
    object2(args, {
      name: truthy(),
      eventValidators: truthy(),
      getOneModelMapper: truthy(),
      getOneModelValidators: optional([ofType("object")]),
      readOne: truthy(),
      readOneModelMapper: truthy(),
      resultMapper: optional([ofType("function")]),
    })
  );
  const {
    name,
    readOne,
    eventValidators,
    getOneModelMapper,
    getOneModelValidators,
    readOneModelMapper,
    resultMapper,
  } = args;
  const getOne: FunctionHandler = async (event) => {
    validate(
      "event",
      "event",
      event,
      mergeObjectValidators(event, eventValidators)
    );

    const logger = loggerFactory(name);

    const getOneModel = getOneModelMapper(event);

    validate("getOneModel", "model", getOneModel, [
      truthy(),
      object2(getOneModel, getOneModelValidators || { id: id() }),
    ]);

    const readOneModel = readOneModelMapper(getOneModel);

    const model = await readOne(readOneModel);

    if (!model) {
      return notFound();
    }

    if (resultMapper) {
      logger.debug("Mapping and sending result");
    }
    const result = okResult(resultMapper ? resultMapper(model) : model, logger);

    return result;
  };

  return getOne;
};
