import { DataTypes, Model } from "sequelize";
import { hardDeleteInitOptions, HasIdAttribute, id } from "./core";

const tableName = "clientCustomStyles";

interface ClientCustomStyleAttributes extends HasIdAttribute {
  clientId: number;
  customCss: string;
  version: string;
}

class ClientCustomStyle
  extends Model<ClientCustomStyleAttributes>
  implements ClientCustomStyleAttributes {
  clientId: number;
  customCss: string;
  version: string;
  id: number;
}

ClientCustomStyle.init(
  {
    id,
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customCss: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...hardDeleteInitOptions,
    tableName,
  }
);

export { ClientCustomStyle };
