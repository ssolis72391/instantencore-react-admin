import { DataTypes, QueryInterface, QueryInterfaceOptions } from "sequelize";
import { logger } from "./core";

const queryInterfaceOptions: QueryInterfaceOptions = {
  logging: (sql, timing) => logger.debug(JSON.stringify({ sql, timing })),
  benchmark: true,
};

export async function up(queryInterface: QueryInterface) {
  // CARDS
  await queryInterface.changeColumn(
    "cards",
    "description",
    { type: DataTypes.TEXT, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "cards",
    "title",
    { type: DataTypes.STRING(2000), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "cards",
    "imageUrl",
    { type: DataTypes.STRING(1000), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "cards",
    "url",
    { type: DataTypes.STRING(1000), allowNull: true },
    queryInterfaceOptions
  );
  // COMPONENTS
  await queryInterface.changeColumn(
    "components",
    "title",
    { type: DataTypes.STRING(2000), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "components",
    "subTitle",
    { type: DataTypes.STRING(2000), allowNull: true },
    queryInterfaceOptions
  );
  // PAGES
  await queryInterface.changeColumn(
    "pages",
    "headerImageUrl",
    { type: DataTypes.STRING(1000), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "pages",
    "headerPreTitle",
    { type: DataTypes.STRING(2000), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "pages",
    "headerSubTitle",
    { type: DataTypes.STRING(2000), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "pages",
    "headerTitle",
    { type: DataTypes.STRING(2000), allowNull: true },
    queryInterfaceOptions
  );
  // PROGRAMS
  await queryInterface.changeColumn(
    "programs",
    "internalNotes",
    { type: DataTypes.STRING(5000), allowNull: true },
    queryInterfaceOptions
  );
}

export async function down(queryInterface: QueryInterface) {
  // CARDS
  await queryInterface.changeColumn(
    "cards",
    "description",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "cards",
    "title",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "cards",
    "imageUrl",
    { type: DataTypes.STRING(255), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "cards",
    "url",
    { type: DataTypes.STRING(255), allowNull: true },
    queryInterfaceOptions
  );
  // COMPONENTS
  await queryInterface.changeColumn(
    "components",
    "title",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "components",
    "subTitle",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  // PAGES
  await queryInterface.changeColumn(
    "pages",
    "headerImageUrl",
    { type: DataTypes.STRING(255), allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "pages",
    "headerPreTitle",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "pages",
    "headerSubTitle",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  await queryInterface.changeColumn(
    "pages",
    "headerTitle",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
  // PROGRAMS
  await queryInterface.changeColumn(
    "programs",
    "internalNotes",
    { type: DataTypes.STRING, allowNull: true },
    queryInterfaceOptions
  );
}
