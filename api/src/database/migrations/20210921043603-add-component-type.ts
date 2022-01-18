//#region minimal imports
import { DataTypes, QueryInterface, QueryInterfaceOptions } from "sequelize";
import { logger } from "./core";
//#endregion

//#region tools
const queryInterfaceOptions: QueryInterfaceOptions = {
  logging: (sql, timing) => logger.debug(JSON.stringify({ sql, timing })),
  benchmark: true,
};

const component_table_name = "components";
const type_column_name = "type";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn(
    component_table_name,
    type_column_name,
    { type: DataTypes.STRING, allowNull: false },
    queryInterfaceOptions
  );
  await queryInterface.sequelize.query(
    `update ${component_table_name} set \`${type_column_name}\` = "thumbnail"`,
    queryInterfaceOptions
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn(
    component_table_name,
    type_column_name,
    queryInterfaceOptions
  );
}
//#endregion
