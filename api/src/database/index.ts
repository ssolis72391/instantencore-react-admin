import { HasId } from "api-shared";
import {
  identifier,
  loggerFactory,
  object,
  ofType,
  required,
  validate,
  Validator,
} from "../core";
import { DestroyOneById, ReadOneById, UpdateOneById } from "../core/database";

type DestroyOneUsingSequelizeFactory = (
  sequelizeModelClass: any
) => DestroyOneById;

export const destroyOneUsingSequelizeFactory: DestroyOneUsingSequelizeFactory = (
  type
) => {
  if (typeof type !== "function" || typeof type.destroy !== "function") {
    throw Error("Invalid Model");
  }
  const destroyOne: DestroyOneById = async (id) => {
    return await type.destroy({ where: { id } });
  };
  return destroyOne;
};

type SequelizeModelClass<SequelizeModel> = {
  findByPk(param: number | string): Promise<SequelizeModel>;
  update(
    model: Partial<SequelizeModel>,
    {
      where: {},
    }
  ): Promise<[number, SequelizeModel[] | any[]]>;
};

export type ReadOneUsingSequelizeFactory = <T extends HasId, DalModel>(
  staticDalModel: SequelizeModelClass<DalModel>,
  mapper: (dalModel: DalModel) => T
) => ReadOneById<T>;

/**
 * @summary Factory function. Returns a readOne function
 * @param staticDalModel Sequelize Model implementation
 * @param mapper mapping function that takes a Sequelize Model instance as input and ouputs a Model instance
 */
export const readOneUsingSequelizeFactory: ReadOneUsingSequelizeFactory = <
  Model extends HasId,
  SequelizeModel
>(
  staticDalModel: SequelizeModelClass<SequelizeModel>,
  mapper: (dalModel: SequelizeModel) => Model
) => {
  const readOne: ReadOneById<Model> = async ({ id }) => {
    const result = await staticDalModel.findByPk(id);
    return mapper(result);
  };

  return readOne;
};

/**
 * @deprecated
 */
interface MayHaveId {
  id?: number;
}

// // todo: uncomment and update
// export const updateUsingSequelizeOneFactory = <
//   Model extends HasId,
//   DalModel extends HasId
// >(
//   name: string,
//   staticDalModel: SequelizeModelClass<DalModel>,
//   key: keyof DalModel = "id",
//   mapper: (model: Partial<Model>) => DalModel
// ): UpdateOneById<Model> => {
//   const logger = loggerFactory(name);
//   const updateOne: UpdateOneById<Model> = async (model) => {
//     const where = { [key]: model[key as string] };
//     logger.debug(`Updating model with where ${JSON.stringify(where)} clause`);
//     const dalModel = mapper(model);

//     const [rows] = await staticDalModel.update(dalModel, {
//       where,
//     });
//     logger.debug(`Model was updated. Rows returned: ${rows}`);
//     return rows;
//   };

//   return updateOne;
// };

// interface ReadOneFactoryBareArgs<Model> {
//   name: string;
//   innerReadOne: (id: number) => Promise<Model>;
//   // mapper: (dalModel: DalModel) => Model;
// }
// export function readOneFactoryBare<Model extends HasId>(
//   args: ReadOneFactoryBareArgs<Model>
// ): ReadOne<Model> {
//   const logger = loggerFactory("readOneFactoryBare");
//   logger.debug("Validating argument");
//   validate("args", "argument", args, [
//     required,
//     object<ReadOneFactoryBareArgs<Model>>({
//       innerReadOne: [required, ofType("function")],
//       name: [required, ofType("string")],
//     }) as Validator,
//   ]);
//   const { /*mapper,*/ name, innerReadOne } = args;
//   logger.debug("Building readOne");
//   const readOne: ReadOne<Model> = async ({ id }) => {
//     validate("id", "argument", id, [required, identifier]);
//     const logger = loggerFactory(name);
//     logger.debug(`Calling innerReadOne with id ${id}`);
//     const dalModel = await innerReadOne(id);
//     if (!dalModel) {
//       logger.warn("dalModel is falsy. Skipping mapper");
//       return undefined;
//     }

//     return dalModel;
//   };
//   return readOne;
// }

/**
 * @deprecated
 */
interface UpdateOneFactoryBareArgs<Model extends HasId> {
  name: string;
  innerUpdateOne: UpdateOneById<Model>;
}

/**
 * @deprecated
 */
export function updateOneFactoryBare<Model extends HasId>(
  args: UpdateOneFactoryBareArgs<Model>
): UpdateOneById<Model> {
  const logger = loggerFactory("updateOneFactoryBare");
  validate("args", "argument", args, [
    required,
    object<UpdateOneFactoryBareArgs<Model>>({
      innerUpdateOne: [required, ofType("function")],
      name: [required, ofType("string")],
    }) as Validator,
  ]);
  const { /*mapper,*/ name, innerUpdateOne } = args;
  logger.debug("Building updateOne");
  const updateOne: UpdateOneById<Model> = async (model) => {
    validate("id", "argument", model, [identifier]);
    const logger = loggerFactory(name);
    logger.trace(`Calling innerUpdateOne with model ${JSON.stringify(model)}`);
    const rowCount = await innerUpdateOne(model);
    if (!rowCount) {
      logger.warn("rowCount is falsy.");
    }
    logger.trace("Returning rowCount");
    return rowCount;
  };
  return updateOne;
}
