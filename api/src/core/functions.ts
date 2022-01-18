import { HasId, PartialWithRequired } from "api-shared";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Mapper } from "./core";
import {
  DestroyOneById,
  DestroyOneByIdModel,
  ReadMany,
  ReadOneById,
  ReadOneByIdModel,
  ReadOneByKeys,
  ReadOneByKeysModel,
  RestoreOneByIdModel,
} from "./database";
import { ObjectValidators, Validator } from "./validation";

export type FunctionHandlerEvent = PartialWithRequired<
  APIGatewayProxyEvent,
  "httpMethod" | "resource"
>;

export type FunctionHandlerResult =
  | PartialWithRequired<APIGatewayProxyResult, "statusCode">
  | APIGatewayProxyResult;

export type FunctionHandler = (
  event: FunctionHandlerEvent
) => Promise<FunctionHandlerResult>;

export interface FunctionHandlerFactoryArgs {
  name: string;
  eventValidators?:
    | ObjectValidators<FunctionHandlerEvent>
    | Validator<FunctionHandlerEvent>[];
}

export interface GetOneByIdFactoryArgs<
  Model extends HasId,
  TGetOneByIdModel extends GetOneByIdModel<Model> = GetOneByIdModel<Model>,
  TReadOneByIdModel extends ReadOneByIdModel<Model> = ReadOneByIdModel<Model>
> extends FunctionHandlerFactoryArgs {
  getOneModelMapper: (event: FunctionHandlerEvent) => TGetOneByIdModel;
  getOneModelValidators: ObjectValidators<TGetOneByIdModel>;
  readOneModelMapper: (model: TGetOneByIdModel) => TReadOneByIdModel;
  readOne: ReadOneById<Model, TReadOneByIdModel>;
  resultMapper?: Mapper<Model, unknown>;
}

export type GetOneByIdFactory<Model extends HasId = HasId> = (
  args: GetOneByIdFactoryArgs<Model>
) => FunctionHandler;

export interface GetOneByIdModel<Model extends HasId> {
  id: number;
  /**
   * If true gets deleted (soft) record
   */
  deleted?: boolean;
}

/**
 * @summary get one with keys handler model
 */
export type GetOneByKeysModel<Model extends any = any, Key = keyof Model> = {
  /**
   * @summary key or keys used to get the model
   */
  keys: [Key, unknown] | [Key, unknown][];
};

/**
 * @summary future usage
 */
export interface GetOneByKeysFactoryArgs<
  TGetOneByKeysModel extends GetOneByKeysModel
> extends FunctionHandlerFactoryArgs {
  getOneModelMapper: (event: FunctionHandlerEvent) => TGetOneByKeysModel;
  readOneModelMapper: (
    model: TGetOneByKeysModel
  ) => ReadOneByKeysModel<
    TGetOneByKeysModel extends GetOneByKeysModel<infer Model> ? Model : any
  >;
  readOne: ReadOneByKeys<
    TGetOneByKeysModel extends GetOneByKeysModel<infer Model> ? Model : any
  >;
}

export type GetOneByKeysFactory<Model extends HasId = HasId> = (
  args: GetOneByKeysFactoryArgs<GetOneByKeysModel<Model>>
) => FunctionHandler;

export interface GetManyHandlerFactoryArgs<GetManyModel, OneModel>
  extends FunctionHandlerFactoryArgs {
  name: string;
  getManyModelMapper: (event: FunctionHandlerEvent) => GetManyModel;
  getManyModelValidation: ObjectValidators<GetManyModel>;
  readMany: ReadMany<GetManyModel>;
}

export type DeleteOneByIdModel = {
  id: number;
};

export interface DeleteOneByIdFactoryArgs<
  TDeleteOneByIdModel extends DeleteOneByIdModel,
  TDestroyOneByIdModel extends DestroyOneByIdModel
> extends FunctionHandlerFactoryArgs {
  deleteOneByIdModelMapper: (
    event: FunctionHandlerEvent
  ) => TDeleteOneByIdModel;
  deleteOneByIdModelValidators?:
    | ObjectValidators<TDeleteOneByIdModel>
    | Validator<TDeleteOneByIdModel>[];
  destroyOneByIdModelMapper: (
    model: TDeleteOneByIdModel
  ) => TDestroyOneByIdModel;
  destroyOneById: DestroyOneById<TDestroyOneByIdModel>;
  destroyOneByIdResultMapper?: (count: number) => unknown;
}

export type UnDeleteOneByIdModel = {
  id: number;
};

/**
 * @TODO Rename to PostRestoreOneByIdFactoryArgs
 */
export interface UnDeleteOneByIdFactoryArgs<
  TUnDeleteOneByIdModel extends UnDeleteOneByIdModel,
  TRestoreOneByIdModel extends RestoreOneByIdModel
> extends FunctionHandlerFactoryArgs {
  unDeleteOneByIdModelMapper: (
    event: FunctionHandlerEvent
  ) => TUnDeleteOneByIdModel;
  unDeleteOneByIdModelValidators?:
    | ObjectValidators<TUnDeleteOneByIdModel>
    | Validator<TUnDeleteOneByIdModel>[];
  unDestroyOneByIdModelMapper: (
    model: TUnDeleteOneByIdModel
  ) => TRestoreOneByIdModel;
  unDestroyOneById: DestroyOneById<TRestoreOneByIdModel>;
  unDestroyOneByIdResultMapper?: (count: number) => unknown;
}
