import { ModelAttributeColumnOptions } from "sequelize";
import { loggerFactory } from "../../../core/index";

/**
 * @summary do not modify!
 */
export const logger = loggerFactory("Sequelize Migrations");
/**
 * @summary do not modify!
 */
export type ModelSchema<T> = {
  [Property in keyof T]-?: ModelAttributeColumnOptions;
};
