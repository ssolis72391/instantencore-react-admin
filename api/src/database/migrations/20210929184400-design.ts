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

//#endregion

//#region model attributes types
export type HasIdAttribute = { id: number };
export type OmitIdAttribute<T> = Omit<T, "id">;
export type HasDeletedAtAttribute = { deletedAt?: Date };
//#endregion

//#region designVariables

const designVariablesTableName = "designVariables";
interface DesignVariableAttributes
  extends HasIdAttribute,
    HasDeletedAtAttribute {
  name: string;
  description?: string;
  defaultValue?: string;
  type: string;
  order: number;
}

const designVariableAttributes: ModelSchema<DesignVariableAttributes> = {
  id,
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
};

//#endregion

//#region clientDesignVariables
const clientDesignVariablesTableName = "clientDesignVariables";

interface ClientDesignVariableAttributes extends HasIdAttribute {
  clientId: number;
  designVariableId: number;
  value: string;
}

const clientDesignVariableAttributes: ModelSchema<ClientDesignVariableAttributes> = {
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
};
//#endregion

//#region clientCustomStyle

const clientCustomStyleTableName = "clientCustomStyles";

interface ClientCustomStyleAttributes extends HasIdAttribute {
  clientId: number;
  customCss: string;
  version: string;
}

const clientCustomStyleAttributes: ModelSchema<ClientCustomStyleAttributes> = {
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
};
//#endregion

class DesignVariableRowData {
  name: string;
  description: string;
  defaultValue: string;
  type: string;
}

export async function up(queryInterface: QueryInterface) {
  await createTable(
    queryInterface,
    designVariablesTableName,
    designVariableAttributes
  );
  await createTable(
    queryInterface,
    clientDesignVariablesTableName,
    clientDesignVariableAttributes
  );
  await createTable(
    queryInterface,
    clientCustomStyleTableName,
    clientCustomStyleAttributes
  );

  const designVariableRows: DesignVariableRowData[] = [
    {
      name: "Page background color",
      description: "Main background color.",
      defaultValue: "#fff",
      type: "color",
    },
    {
      name: "Page text color",
      description: "Text color on top of the background.",
      defaultValue: "#333",
      type: "color",
    },
    {
      name: "Card background color",
      description: "Color of the background of a card.",
      defaultValue: "#f0f3f6",
      type: "color",
    },
    {
      name: "Card image background color",
      description:
        "Color of the background of an image on a card. Visible when the card is using Image Size contain.",
      defaultValue: "#fff",
      type: "color",
    },
    {
      name: "Card round corners",
      description: "How much the corner of cards are rounded.",
      defaultValue: "5",
      type: "other",
    },
    {
      name: "Group title color",
      description: "Color of the title of a group on a Grouping Page.",
      defaultValue: "#333",
      type: "color",
    },
    {
      name: "Spotlight background color",
      description: "Background color of the component Spotlight style.",
      defaultValue: "#a62f31",
      type: "color",
    },
    {
      name: "Spotlight text color",
      description: "Text color on top of the Spotlight style.",
      defaultValue: "#fff",
      type: "color",
    },
    {
      name: "Link color",
      description: "Color of hyperlinks.",
      defaultValue: "#851619",
      type: "color",
    },
    {
      name: "Font families",
      description: "Font used throughout the program.",
      defaultValue: "Roboto",
      type: "other",
    },
  ];

  let index = 1;
  designVariableRows.forEach(async (designVariableRow) => {
    await queryInterface.sequelize.query(
      `INSERT INTO designVariables (name, description, defaultValue, \`order\`, \`type\`) VALUES ( '${
        designVariableRow.name
      }', '${designVariableRow.description}', '${
        designVariableRow.defaultValue
      }', ${index++}, '${designVariableRow.type}')`,
      queryInterfaceOptions
    );
  });
}

export async function down(queryInterface: QueryInterface) {
  await dropTable(queryInterface, clientCustomStyleTableName);
  await dropTable(queryInterface, clientDesignVariablesTableName);
  await dropTable(queryInterface, designVariablesTableName);
}
//#endregion
