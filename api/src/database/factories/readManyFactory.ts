import { Filter, GetManyModel, HasId } from "api-shared";
import {
  loggerFactory,
  object,
  ofType,
  truthy,
  validate,
  validateObject,
} from "../../core";
import {
  ReadMany,
  ReadManyFactoryArgs,
  ReadManyModel,
} from "../../core/database";
import { nonEmpty } from "../../core/validation";
import { Model, SequelizeModelAttributes } from "../sequelize";

export type ReadManyUsingSequelizeModel<
  M extends Model & HasId,
  F extends Filter<SequelizeModelAttributes<M>>
> = ReadManyModel<M, F>;

export function readManyFactory<TGetManyModel extends GetManyModel<any, any>>(
  args: ReadManyFactoryArgs<TGetManyModel>
): ReadMany<TGetManyModel> {
  validate(
    "args",
    "argument",
    args,
    object({
      getManyModelValidators: [truthy(), ofType("object")],
      innerReadMany: [truthy(), ofType("function")],
      name: [nonEmpty(), ofType("string")],
    })
  );
  const logger = loggerFactory("readManyFactory");
  const { getManyModelValidators, innerReadMany, name } = args;
  const readMany: ReadMany<TGetManyModel> = (model) => {
    validateObject("model", model, getManyModelValidators);
    const logger = loggerFactory(name);
    return innerReadMany(model);
  };

  return readMany;
}
