import {
  Filter,
  GetManyModel,
  GetManyPagedResult,
  HasId,
  Pagination,
  Remove,
  Sort,
} from "api-shared";
import { Logger } from "./logging";
import { ObjectValidators, Validator } from "./validation";

/**
 * @summary ReadOne<Model> function args (model)
 */
export type ReadOneByKeysModel<
  Model extends HasId = HasId,
  Key = keyof Model
> = {
  /**
   * @summary key or keys used to read the model
   */
  keys: [Key, unknown] | [Key, unknown][];
};

export type ReadOneByIdModel<Model extends HasId> = {
  /**
   * Id of matching record
   */
  id: number;
  /**
   * Reads (soft) deleted records
   */
  deleted?: boolean;
};

/**
 * @summary represets a database function that reads and returns one database model
 */
export type ReadOneByKeys<Model extends HasId> = (
  model: ReadOneByKeysModel<Model>
) => Promise<Model>;

export type ReadOneById<
  Model extends HasId,
  TReadOneByIdModel extends ReadOneByIdModel<Model> = ReadOneByIdModel<Model>
> = (model: TReadOneByIdModel) => Promise<Model>;

export type ReadOneByIdFactoryArgs<
  Model extends HasId,
  TReadOneByIdModel extends ReadOneByIdModel<Model>,
  InnerModel extends HasId = HasId
> = {
  name: string;
  innerReadByOneById: (model: TReadOneByIdModel) => Promise<InnerModel>;
  modelMapper: (model: InnerModel) => Model;
};

export type ReadOneByIdFactory<
  Model extends HasId,
  TReadOneByIdModel extends ReadOneByIdModel<Model> = ReadOneByIdModel<Model>
> = (
  args: ReadOneByIdFactoryArgs<Model, TReadOneByIdModel>
) => ReadOneById<Model, TReadOneByIdModel>;

/**
 * @summary represets a database function that creates and persists a database model
 */
export type CreateOne<Model = any, Result = number> = (
  model: Model
) => Promise<Result>;

export type ReadManyModel<
  Model extends HasId,
  F extends Filter<Model> = Filter<Model>
> = {
  pagination: Pagination;
  filter: F;
  sort: Sort<Model>;
};

export type ReadMany<TGetManyModel extends GetManyModel<any, Filter<any>>> = (
  args: TGetManyModel
) => Promise<
  GetManyPagedResult<
    TGetManyModel extends GetManyModel<infer Model, infer Filter>
      ? Model
      : HasId
  >
>;

export type ReadManyFactoryArgs<
  TGetManyModel extends GetManyModel<any, Filter<any>>,
  Model extends HasId = TGetManyModel extends GetManyModel<
    infer Model,
    infer Filter
  >
    ? Model
    : HasId
> = {
  name: string;
  getManyModelValidators:
    | ObjectValidators<TGetManyModel>
    | Validator<TGetManyModel>[];
  innerReadMany: (model: TGetManyModel) => Promise<GetManyPagedResult<Model>>;
};

export type ReadOneFactoryArgs = {
  name: string;
};

type DestroyMode = "soft" | "hard";
export type DestroyOneByIdModel = {
  id: number;
};

export type DestroyOneById<
  TDestroyOneByIdModel extends DestroyOneByIdModel = DestroyOneByIdModel
> = (model: TDestroyOneByIdModel) => Promise<number>;

export type DestroyOneByIdFactoryArgs<
  TDestroyOneByIdModel extends DestroyOneByIdModel = DestroyOneByIdModel
> = {
  name: string;
  innerDestroyOne: (model: TDestroyOneByIdModel) => Promise<number>;
};

export type DestroyOneByIdFactory = (
  args: DestroyOneByIdFactoryArgs
) => DestroyOneById;

//#region restore one by id
export type RestoreOneByIdModel = {
  id: number;
};

export type RestoreOneById<
  TRestoreOneByIdModel extends RestoreOneByIdModel = RestoreOneByIdModel
> = (model: TRestoreOneByIdModel) => Promise<number>;

export type RestoreOneByIdFactoryArgs<
  TRestoreOneByIdModel extends RestoreOneByIdModel = RestoreOneByIdModel
> = {
  name: string;
  innerRestoreOne: RestoreOneById<TRestoreOneByIdModel>;
};
//#endregion

//#region update one by id
/**
 * @summary update a model and returns the number of rows affected
 */
export type UpdateOneById<
  Model,
  InnerModel = unknown,
  TUpdateOneByIdModel extends Remove<
    UpdateOneByIdModel<Model>,
    "logger"
  > = Remove<UpdateOneByIdModel<Model>, "logger">,
  InnerUpdateOneByIdModel extends UpdateOneByIdModel<InnerModel> = UpdateOneByIdModel<InnerModel>
> = (model: TUpdateOneByIdModel) => Promise<number>;

export type UpdateOneByIdFactoryArgs<
  Model,
  InnerModel,
  TUpdateOneByIdModel extends UpdateOneByIdModel<Model>,
  InnerUpdateOneByIdModel extends UpdateOneByIdModel<InnerModel>
> = {
  name: string;
  updateOneByIdModelValidator?:
    | ObjectValidators<TUpdateOneByIdModel>
    | Validator<TUpdateOneByIdModel>[];
  innerUpdateOneByIdModelMapper: (
    model: TUpdateOneByIdModel
  ) => InnerUpdateOneByIdModel;
  innerUpdateOneById: (model: InnerUpdateOneByIdModel) => Promise<number>;
};

export type UpdateOneByIdModel<Model> = {
  id: number;
  /**
   * @todo rename to values
   */
  model: Model;
  /**
   * @summary logger. usually set by a factory
   */
  logger?: Logger;
};
//#endregion
