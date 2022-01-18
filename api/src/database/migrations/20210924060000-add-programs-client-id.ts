import { DataTypes, QueryInterface, QueryInterfaceOptions } from "sequelize";
import { logger } from "./core";

const queryInterfaceOptions: QueryInterfaceOptions = {
  logging: (sql, timing) => logger.debug(JSON.stringify({ sql, timing })),
  benchmark: true,
};

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn(
    "programs",
    "clientId",
    { type: DataTypes.INTEGER, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.sequelize.query(
    `update programs set clientId = 1;`,
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "programs",
    "clientId",
    { type: DataTypes.INTEGER, allowNull: false },
    queryInterfaceOptions
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn(
    "programs",
    "clientId",
    queryInterfaceOptions
  );
}
