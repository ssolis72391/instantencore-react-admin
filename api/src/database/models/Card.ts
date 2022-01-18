import { CardActionKey } from "api-shared";
import { DataTypes, Model } from "sequelize";
import { RemoveSequelizeModelProps } from "../sequelize";
import {
  hardDeleteInitOptions,
  HasIdAttribute,
  id,
  OmitIdAttribute,
  orderIndex,
} from "./core";
import { Page } from "./internal";

const tableName = "cards";

interface CardAttributes extends HasIdAttribute {
  action: CardActionKey;
  url?: string;
  pageId?: number;
  imageUrl?: string;
  title?: string;
  description?: string;
  visible?: boolean;
  orderIndex: number;
  componentId: number;
}

class Card
  extends Model<CardAttributes, OmitIdAttribute<CardAttributes>>
  implements CardAttributes {
  componentId: number;
  action: CardActionKey;
  url?: string;
  pageId?: number;
  imageUrl?: string;
  title?: string;
  description?: string;
  visible?: boolean;
  orderIndex: number;
  id: number;
  page?: Page | RemoveSequelizeModelProps<Page>;
}

Card.init(
  {
    id,
    orderIndex,
    componentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "components",
        key: "id",
      },
    },
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "RESTRICT",
      references: {
        model: typeof Page,
        key: "id",
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    ...hardDeleteInitOptions,
    tableName,
  }
);

export { Card };
