import { ProgramSourceKey, ProgramStatusKey } from "api-shared";
import { DataTypes, Model } from "sequelize";
import {
  defaultModelInitOptions,
  deletedAt,
  HasDeletedAtAttribute,
  HasIdAttribute,
} from "./core";
import { Page } from "./internal";

const tableName = "programs";

interface ProgramAttributes extends HasIdAttribute, HasDeletedAtAttribute {
  internalNotes?: string;
  season?: string;
  venue?: string;
  localStartDate: string;
  utcStartDate: string;
  localEndDate: string;
  utcEndDate: string;
  timeZone: string;
  status: ProgramStatusKey;
  source?: ProgramSourceKey;
  sourceId?: string;
  clientId?: number;
}

class Program extends Model<ProgramAttributes> implements ProgramAttributes {
  internalNotes?: string;
  season?: string;
  venue?: string;
  localStartDate: string;
  utcStartDate: string;
  localEndDate: string;
  utcEndDate: string;
  timeZone: string;
  status: ProgramStatusKey;
  source?: ProgramSourceKey;
  sourceId?: string;
  id: number;
  deletedAt?: Date;
  clientId?: number;
  page?: Page;
}

Program.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      onDelete: "CASCADE",
      references: {
        model: typeof Page,
        key: "id",
      },
    },
    deletedAt,
    localEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return this.getDataValue("localEndDate");
      },
    },
    localStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return this.getDataValue("localStartDate");
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeZone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    utcEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return this.getDataValue("utcEndDate");
      },
    },
    utcStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        return this.getDataValue("utcStartDate");
      },
    },
    internalNotes: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },

    season: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sourceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    ...defaultModelInitOptions,
    tableName,
  }
);

export { Program };
