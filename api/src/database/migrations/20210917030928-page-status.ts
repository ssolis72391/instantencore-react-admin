//#region minimal imports
import { DataTypes, QueryInterface, QueryInterfaceOptions } from "sequelize";
import { logger } from "./core";
//#endregion

//#region tools
const queryInterfaceOptions: QueryInterfaceOptions = {
  logging: (sql, timing) => logger.debug(JSON.stringify({ sql, timing })),
  benchmark: true,
};
//#endregion

const page_table_name = "pages";
const status_column_name = "status";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn(
    page_table_name,
    status_column_name,
    { type: DataTypes.STRING, allowNull: false },
    queryInterfaceOptions
  );
  await queryInterface.sequelize.query(
    `update ${page_table_name} set status = "ok"`,
    queryInterfaceOptions
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn(
    page_table_name,
    status_column_name,
    queryInterfaceOptions
  );
}
//#endregion
