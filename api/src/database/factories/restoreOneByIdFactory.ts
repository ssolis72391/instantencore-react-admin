import {
  id,
  loggerFactory,
  object2,
  RestoreOneById,
  RestoreOneByIdFactoryArgs,
  truthy,
  validate,
} from "../../core";

export const restoreOneByIdFactory = (args: RestoreOneByIdFactoryArgs) => {
  validate("args", "argument", args, [truthy()]);
  const { innerRestoreOne, name } = args;
  const logger = loggerFactory("restoreOneByIdFactory");

  const restoreOneById: RestoreOneById = async (model) => {
    validate("model", "model", model, object2(model, { id: id() }));

    const logger = loggerFactory(name);

    logger.debug("Calling innerRestoreOne");
    const count = await innerRestoreOne(model);

    logger.debug("Returning innerRestoreOne result:" + count);
    return count;
  };

  return restoreOneById;
};
