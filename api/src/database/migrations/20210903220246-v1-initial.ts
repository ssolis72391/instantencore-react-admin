//#region minimal imports
import {
  DataTypes,
  ModelAttributeColumnOptions,
  QueryInterface,
  QueryInterfaceOptions,
} from "sequelize";
import { logger, ModelSchema } from "./core";
//#endregion

//#region tools
const queryInterfaceOptions: QueryInterfaceOptions = {
  logging: (sql, timing) => logger.debug(JSON.stringify({ sql, timing })),
  benchmark: true,
};

function createTable<T>(
  queryInterface: QueryInterface,
  name: string,
  attributes: ModelSchema<T>
) {
  return queryInterface.createTable(name, attributes, {
    ...queryInterfaceOptions,
  });
}

function dropTable(queryInterface: QueryInterface, name: string) {
  return queryInterface.dropTable(name, { ...queryInterfaceOptions });
}

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

//#region pages
const pageTableName = "pages";
interface PageAttributes extends HasIdAttribute, HasDeletedAtAttribute {
  internalName: string;
  headerPreTitle?: string;
  headerTitle?: string;
  headerSubTitle?: string;
  headerImageUrl?: string;
  headerImageSize: string;
  headerTextPosition: string;
}

const pageAttributes: ModelSchema<PageAttributes> = {
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  headerPreTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  headerSubTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  headerTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
//#endregion

//#region programs
const programTableName = "programs";
interface ProgramAttributes extends HasIdAttribute, HasDeletedAtAttribute {
  internalNotes?: string;
  season?: string;
  venue?: string;
  localStartDate: string;
  utcStartDate: string;
  localEndDate: string;
  utcEndDate: string;
  timeZone: string;
  status: string;
  source?: string;
  sourceId?: string;
}

const programAttributes: ModelSchema<ProgramAttributes> = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    onDelete: "CASCADE",
    validate: { min: 1 },
    references: {
      model: pageTableName,
      key: "id",
    },
  },
  deletedAt,
  localEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  localStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
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
  },
  utcStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  internalNotes: {
    type: DataTypes.STRING,
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
  venue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

//#endregion

//#region components
const componentTableName = "components";

interface ComponentAttributes extends HasIdAttribute, HasDeletedAtAttribute {
  libraryComponent: boolean;
  ad: boolean;
  style: string;
  internalName: string;
  title?: string;
  subTitle?: string;
  cardImagePosition?: string;
  cardImageSize?: string;
  visible: boolean;
  maxCards: number;
  viewAllText: string;
  status?: string;
}

const componentAttributes: ModelSchema<ComponentAttributes> = {
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  subTitle: {
    type: DataTypes.STRING,
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
};

//#endregion

//#region cards
const cardTableName = "cards";

interface CardAttributes extends HasIdAttribute {
  action: string;
  url?: string;
  pageId?: number;
  imageUrl?: string;
  title?: string;
  description?: string;
  visible?: boolean;
  orderIndex: number;
  componentId: number;
}

const cardAttributes: ModelSchema<CardAttributes> = {
  id,
  orderIndex,
  componentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: componentTableName,
      key: "id",
    },
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    onDelete: "RESTRICT",
    references: {
      model: pageTableName,
      key: "id",
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
};
//#endregion

//#region pageComponents
const pageComponentTableName = "pageComponents";

interface PageComponentAttributes extends HasIdAttribute {
  pageId: number;
  componentId: number;
  orderIndex: number;
  dateOverridesMode: string;
}

const pageComponentAttributes: ModelSchema<PageComponentAttributes> = {
  id,
  orderIndex,
  componentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: componentTableName,
      key: "id",
    },
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: pageTableName,
      key: "id",
    },
  },
  dateOverridesMode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
//#endregion

export async function up(queryInterface: QueryInterface) {
  await createTable(queryInterface, pageTableName, pageAttributes);
  await createTable(queryInterface, programTableName, programAttributes);
  await createTable(queryInterface, componentTableName, componentAttributes);
  await createTable(
    queryInterface,
    pageComponentTableName,
    pageComponentAttributes
  );
  await createTable(queryInterface, cardTableName, cardAttributes);
}
export async function down(queryInterface: QueryInterface) {
  await dropTable(queryInterface, cardTableName);
  await dropTable(queryInterface, pageComponentTableName);
  await dropTable(queryInterface, componentTableName);
  await dropTable(queryInterface, programTableName);
  await dropTable(queryInterface, pageTableName);
}
