[CmdletBinding()]
param (
  [Parameter(Mandatory)]
  [string]
  $MigrationName
)



if ($MigrationName -notmatch "^[a-zA-Z0-9-]*$") {
  Write-Warning "Invalid migration name. Only characters from a[A] to z[Z], numbers or - are allowed."
  Exit 1
}

$prefix = [datetime]::UtcNow.ToString("yyyyMMddhhmmss");
# file location hard coded to be run from project root (..\..\..\..\api)
$migrationFullName = "src/database/migrations/$prefix-$MigrationName.ts"
'//#region minimal imports
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
const id: ModelAttributeColumnOptions = {
  type: DataTypes.INTEGER,
  allowNull: false,
  primaryKey: true,
  autoIncrement: true,
};

/**
 * @summary deletedAt attribute definition
 */
const deletedAt: ModelAttributeColumnOptions = {
  type: DataTypes.DATE,
  allowNull: true,
};

/**
 * @summary orderIndex attribute definition
 */
const orderIndex: ModelAttributeColumnOptions = {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: { min: 1 },
};
//#endregion

//#region model attributes types
type HasIdAttribute = { id: number };
type OmitIdAttribute<T> = Omit<T, "id">;
type HasDeletedAtAttribute = { deletedAt?: Date };
//#endregion

export async function up(queryInterface: QueryInterface) {

}

export async function down(queryInterface: QueryInterface) {
  
}
//#endregion'| Out-File -FilePath $migrationFullName -Encoding utf8

