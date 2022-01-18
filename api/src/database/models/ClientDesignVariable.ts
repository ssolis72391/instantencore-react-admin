import { DataTypes, Model } from "sequelize";
import {
  hardDeleteInitOptions,
  HasIdAttribute,
  id,
  OmitIdAttribute,
} from "./core";

const tableName = "clientDesignVariables";

interface ClientDesignVariableAttributes extends HasIdAttribute {
  clientId: number;
  designVariableId: number;
  value: string;
}

class ClientDesignVariable
  extends Model<
    ClientDesignVariableAttributes,
    OmitIdAttribute<ClientDesignVariableAttributes>
  >
  implements ClientDesignVariableAttributes {
  clientId: number;
  designVariableId: number;
  value: string;
  id: number;
}

ClientDesignVariable.init(
  {
    id,
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    designVariableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "designVariables",
        key: "id",
      },
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    ...hardDeleteInitOptions,
    tableName,
  }
);

export { ClientDesignVariable };
