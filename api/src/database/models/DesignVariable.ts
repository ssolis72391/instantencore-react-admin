import { DesignVariableTypeKey } from "api-shared";
import { DataTypes, Model } from "sequelize";
import {
  defaultModelInitOptions,
  deletedAt,
  HasDeletedAtAttribute,
  HasIdAttribute,
  OmitIdAttribute,
} from "./core";

const tableName = "designVariables";

interface DesignVariableAttributes
  extends HasIdAttribute,
    HasDeletedAtAttribute {
  name: string;
  description?: string;
  defaultValue?: string;
  type: DesignVariableTypeKey;
  order: number;
}

class DesignVariable
  extends Model<
    DesignVariableAttributes,
    OmitIdAttribute<DesignVariableAttributes>
  >
  implements DesignVariableAttributes {
  name: string;
  description?: string;
  defaultValue?: string;
  type: DesignVariableTypeKey;
  order: number;
  id: number;
  deletedAt?: Date;
  //readonly clientDesignVariables?: RemoveSequelizeModelProps<ClientDesignVariable>[];
}

DesignVariable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      onDelete: "CASCADE",
    },
    deletedAt,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    defaultValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    ...defaultModelInitOptions,
    tableName,
  }
);

export { DesignVariable };
