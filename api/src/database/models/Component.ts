import { ComponentStatusKey, ComponentTypeKey, StyleKey } from "api-shared";
import { CardImagePositionKey } from "api-shared/lib/cards";
import { ImageSizeKey } from "api-shared/lib/core";
import { DataTypes, Model } from "sequelize";
import { RemoveSequelizeModelProps } from "../sequelize";
import {
  defaultModelInitOptions,
  deletedAt,
  HasDeletedAtAttribute,
  HasIdAttribute,
  id,
  OmitIdAttribute,
} from "./core";
import { Card } from "./internal";
const tableName = "components";

interface ComponentAttributes extends HasIdAttribute, HasDeletedAtAttribute {
  libraryComponent: boolean;
  ad: boolean;
  style: StyleKey;
  internalName: string;
  title?: string;
  subTitle?: string;
  cardImagePosition?: CardImagePositionKey;
  cardImageSize?: ImageSizeKey;
  visible: boolean;
  maxCards: number;
  viewAllText: string;
  status?: ComponentStatusKey;
  type: ComponentTypeKey;
}

export class Component
  extends Model<ComponentAttributes, OmitIdAttribute<ComponentAttributes>>
  implements ComponentAttributes {
  libraryComponent: boolean;
  ad: boolean;
  style: StyleKey;
  internalName: string;
  title?: string;
  subTitle?: string;
  cardImagePosition?: CardImagePositionKey;
  cardImageSize?: ImageSizeKey;
  visible: boolean;
  maxCards: number;
  viewAllText: string;
  status?: ComponentStatusKey;
  id: number;
  deletedAt?: Date;
  type: ComponentTypeKey;
  readonly cards?: RemoveSequelizeModelProps<Card>[];
}

Component.init(
  {
    id,
    deletedAt,
    libraryComponent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    ad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    style: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    internalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    subTitle: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    cardImagePosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardImageSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    maxCards: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    viewAllText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...defaultModelInitOptions,
    tableName,
  }
);
