import { DataTypes, InitOptions, ModelAttributeColumnOptions } from "sequelize";
import { sequelize } from "../sequelize";

//#region model init options
/**
 * @summary soft delete enabled options
 */
export const defaultModelInitOptions: InitOptions = {
  sequelize,
  freezeTableName: false,
  createdAt: false,
  updatedAt: false,
  //#region sof-delete required props
  timestamps: true,
  paranoid: true,
  deletedAt: true,
  //#endregion
};

export const hardDeleteInitOptions: InitOptions = {
  sequelize,
  freezeTableName: false,
  createdAt: false,
  updatedAt: false,
  //#region sof-delete required props
  timestamps: false,
  paranoid: false,
  deletedAt: false,
  //#endregion
};
//#endregion

//#region model attribute definitions
/**
 * @summary id attribute definition
 */
export const id: ModelAttributeColumnOptions = {
  type: DataTypes.INTEGER,
  allowNull: false,
  primaryKey: true,
  autoIncrement: true,
};

/**
 * @summary deletedAt attribute definition
 */
export const deletedAt: ModelAttributeColumnOptions = {
  type: DataTypes.DATE,
  allowNull: true,
};

/**
 * @summary orderIndex attribute definition
 */
export const orderIndex: ModelAttributeColumnOptions = {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: { min: 1 },
};
//#endregion

//#region model attributes types
export type HasIdAttribute = { id: number };
export type OmitIdAttribute<T> = Omit<T, "id">;
export type HasDeletedAtAttribute = { deletedAt?: Date };
//#endregion

//#region reserved for future usage
/**
 * @summary reserved for future usage
 */
type EntityCommonAttributes = "id" | "deletedAt" | "orderIndex";
/**
 * @summary reserved for future usage
 */
export type Entity<
  key extends EntityCommonAttributes = "id"
  // eslint-disable-next-line @typescript-eslint/ban-types
> = (key extends "id" ? { id: number } : {}) &
  // eslint-disable-next-line @typescript-eslint/ban-types
  (key extends "deletedAt" ? { deletedAt?: Date } : {}) &
  // eslint-disable-next-line @typescript-eslint/ban-types
  (key extends "orderIndex" ? { orderIndex: number } : {});
//#endregion

//#region deprecated
/**
 * @deprecated use OmitId<T>
 */
export type CreateDbModelModel<T> = Omit<T, "id">;
/**
 * @deprecated use OmitId<T>
 */
export type ModelCreateAttributes<T> = Omit<T, "id">;
//#endregion
