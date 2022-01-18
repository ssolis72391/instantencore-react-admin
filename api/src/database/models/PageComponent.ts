import { DatesOverrideModeKey } from "api-shared";
import { DataTypes, Model } from "sequelize";
import { RemoveSequelizeModelProps } from "../sequelize";
import {
  hardDeleteInitOptions,
  HasIdAttribute,
  id,
  OmitIdAttribute,
  orderIndex,
} from "./core";
import { Component, Page } from "./internal";
const tableName = "pageComponents";

interface PageComponentAttributes extends HasIdAttribute {
  pageId: number;
  componentId: number;
  orderIndex: number;
  datesOverrideMode: DatesOverrideModeKey;
  component?: RemoveSequelizeModelProps<Component>;
}

export class PageComponent
  extends Model<
    PageComponentAttributes,
    OmitIdAttribute<PageComponentAttributes>
  >
  implements PageComponentAttributes {
  pageId: number;
  componentId: number;
  orderIndex: number;
  datesOverrideMode: DatesOverrideModeKey;
  id: number;
  component?: RemoveSequelizeModelProps<Component>;
}

PageComponent.init(
  {
    id,
    orderIndex,
    componentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "DELETE",
      references: {
        model: typeof Component,
        key: "id",
      },
    },
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "DELETE",
      references: {
        model: typeof Page,
        key: "id",
      },
    },
    datesOverrideMode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...hardDeleteInitOptions,
    tableName,
  }
);
