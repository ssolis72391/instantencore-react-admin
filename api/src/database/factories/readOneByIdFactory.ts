import { HasId } from "api-shared";
import { loggerFactory, object2, truthy, validate } from "../../core";
import {
  ReadOneById,
  ReadOneByIdFactoryArgs,
  ReadOneByIdModel,
} from "../../core/database";

/**
 * @todo consider placing `InnerModel` before `TReadOneByIdModel`
 */
export function readOneByIdFactory<
  Model extends HasId,
  TReadOneByIdModel extends ReadOneByIdModel<Model>,
  InnerModel extends HasId
>(args: ReadOneByIdFactoryArgs<Model, TReadOneByIdModel, InnerModel>) {
  validate("args", "argument", args, object2(args, { name: truthy() }));
  const logger = loggerFactory("readOneByIdFactory");

  const { innerReadByOneById, modelMapper, name } = args;
  const readOneById: ReadOneById<Model, TReadOneByIdModel> = async (model) => {
    const logger = loggerFactory(name);
    const innerModel = await innerReadByOneById(model);
    const result = modelMapper(innerModel);
    return result;
  };
  return readOneById;
}
