import {
  DestroyOneById,
  DestroyOneByIdFactory,
  identifier,
  loggerFactory,
  object2,
  truthy,
  validate,
} from "../../core";

export const destroyOneByIdFactory: DestroyOneByIdFactory = (args) => {
  validate("args", "argument", args, [
    truthy(),
    object2(args, { innerDestroyOne: truthy(), name: truthy() }),
  ]);
  const { innerDestroyOne, name } = args;
  const logger = loggerFactory("destroyOneByIdFactory");

  const destroyOneById: DestroyOneById = async (model) => {
    validate("model", "model", model, object2(model, { id: identifier }));

    const logger = loggerFactory(name);

    logger.debug("Calling innerDestroyOne");
    const count = await innerDestroyOne(model);

    logger.debug("Returnin innerDestroyOne result:" + count);
    return count;
  };

  return destroyOneById;
};
