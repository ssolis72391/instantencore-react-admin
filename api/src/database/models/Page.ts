import { ImageSizeKey, TextPositionKey } from "api-shared/lib/core";
import { DataTypes, Model } from "sequelize";
import {
  defaultModelInitOptions,
  deletedAt,
  HasDeletedAtAttribute,
  HasIdAttribute,
  id,
  OmitIdAttribute,
} from "./core";
import { PageComponent } from "./internal";

const tableName = "pages";

type PageStatusKey = "deleted" | "ok";

interface PageAttributes extends HasIdAttribute, HasDeletedAtAttribute {
  internalName: string;
  headerPreTitle?: string;
  headerTitle?: string;
  headerSubTitle?: string;
  headerImageUrl?: string;
  headerImageSize: ImageSizeKey;
  headerTextPosition: TextPositionKey;
  status: PageStatusKey;
}

class Page
  extends Model<PageAttributes, OmitIdAttribute<PageAttributes>>
  implements PageAttributes {
  headerImageSize: ImageSizeKey;
  headerTextPosition: TextPositionKey;
  status: PageStatusKey;
  internalName: string;
  headerPreTitle?: string;
  headerTitle?: string;
  headerSubTitle?: string;
  headerImageUrl?: string;
  id: number;
  deletedAt?: Date;
  pageComponents?: PageComponent[];
}

Page.init(
  {
    id,
    deletedAt,
    headerImageSize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headerTextPosition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    internalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headerImageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    headerPreTitle: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    headerSubTitle: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    headerTitle: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...defaultModelInitOptions,
    tableName,
  }
);

export { Page };
