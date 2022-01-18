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

const table_name = "pageComponents";
const old_column_name = "dateOverridesMode";
const new_column_name = "datesOverrideMode";
export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn(
    table_name,
    new_column_name,
    {
      type: DataTypes.STRING,
      allowNull: false,
    },
    { ...queryInterfaceOptions }
  );
  await queryInterface.sequelize.query(
    `update ${table_name} set ${new_column_name} = ${old_column_name}`,
    { ...queryInterfaceOptions }
  );
  await queryInterface.removeColumn(table_name, old_column_name, {
    ...queryInterfaceOptions,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.addColumn(
    table_name,
    old_column_name,
    {
      type: DataTypes.STRING,
      allowNull: false,
    },
    { ...queryInterfaceOptions }
  );
  await queryInterface.sequelize.query(
    `update ${table_name} set ${old_column_name} = ${new_column_name}`,
    { ...queryInterfaceOptions }
  );
  await queryInterface.removeColumn(table_name, new_column_name, {
    ...queryInterfaceOptions,
  });
}
//#endregion
