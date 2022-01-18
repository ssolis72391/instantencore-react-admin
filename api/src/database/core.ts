import { Model as SequelizeModel } from "sequelize";
import { Mapper } from "../core";
import { RemoveSequelizeModelProps } from "./sequelize";

/**
 * Exposes methods to a Model (business/api model) to an InnerModel (sequelize model) and vice versa.
 * @typeParam Model business model
 * @typeParam InnerModel sequelize model
 * @todo rename {InnerModel} to something like {SequelizeModel}
 * @todo move this to a sequelize specific module
 */
export interface ModelMapper<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Model extends object,
  InnerModel extends SequelizeModel
> {
  mapInnerModel: Mapper<Model, RemoveSequelizeModelProps<InnerModel>>;
  mapModel: Mapper<RemoveSequelizeModelProps<InnerModel>, Model>;
}
