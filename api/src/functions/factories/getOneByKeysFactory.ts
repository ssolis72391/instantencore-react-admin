import { HasId } from "api-shared";
import {
  loggerFactory,
  object2,
  truthy,
  validate,
  validateObject,
} from "../../core";
import {
  FunctionHandler,
  GetOneByKeysFactoryArgs,
  GetOneByKeysModel,
} from "../../core/functions";
import { okResult } from "../core";

export const getOneByKeysFactory = <Model extends HasId = HasId>(
  args: GetOneByKeysFactoryArgs<GetOneByKeysModel<Model>>
) => {
  validate(
    "args",
    "argument",
    args,
    object2(args, {
      name: truthy(),
      eventValidators: truthy(),
      getOneModelMapper: truthy(),
      readOne: truthy(),
      readOneModelMapper: truthy(),
    })
  );
  const {
    name,
    readOne,
    eventValidators,
    getOneModelMapper,
    readOneModelMapper,
  } = args;
  const getOne: FunctionHandler = async (event) => {
    validateObject("event", event, eventValidators);

    const logger = loggerFactory(name);

    const getOneModel = getOneModelMapper(event);

    const readOneModel = readOneModelMapper(getOneModel);

    const model = await readOne(readOneModel);

    const result = okResult(model);

    return result;
  };

  return getOne;
};
