# Database

We are using a MySQL database hosted in AWS RDS.

DB Schema updates ares handled trough Sequelize **migrations**

## Table of Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Scripts](#scripts)
- [Creating a migration](#creating-a-migration)
- [Todo](#todo)

## Prerequisites

### Setup environement variables

In the `/api` parent folder, create a `.env` file declaring the following variables and values. Can copy the `/api/.env.template` file to get default values.

```
DB_HOST=<value>
DB_PORT=<value>
DB_USER=<value>
DB_PORT=<value>
DB_NAME=<value>
```

## Scripts

**_All scripts must be run from `/api` parent folder !_**

**_You must run these commands from an IP address that is allowed by the VPC. See `known_cidrs` in [infrastructure/network/locals.tf](../../infrastructure/network/locals.tf)._**

### Create database

```bash
yarn db-create
```

### Drop database

```bash
yarn db-drop
```

### Create a new database migration

Requires [Powershell Core](https://github.com/PowerShell/PowerShell#get-powershell) to be installed.

```bash
yarn db-create-migration [migration name]
```

See [Creating a migration](#creating-a-migration) for more info.

### Build migrations

```bash
yarn db-build-migrations
```

### Rebuild migrations and apply all pending ones

```bash
yarn db-up

or

yarn db-up-prebuild
```

### Apply all pending migrations (no rebuild)

```bash
yarn db-up-noprebuild
```

### Undo last migration

```
yarn db-down
```

## Creating a migration

1. Update database models in [models](./models).
2. Create a migration.
   1. `yarn db-create-migration [migration name]`. This will create the template for your migration and put it in [migrations](./migrations).
   2. Or you can copy an existing migration file from the [migrations](./migrations) folder, rename it `[yyyymmddhhss]-[name].ts`.
3. Update the code in the `up` function. This will generate the SQL to apply the migration.
   1. See the [Sequelize documentation](https://sequelize.org/master/class/lib/dialects/abstract/query-interface.js~QueryInterface.html) for available methods.
   2. See examples from other migrations in this project.
4. Update the code in the `down` function. This will generate the SQL to undo the migration.
5. To apply the migration:
   1. Make sure the settings in your [.env](../../.env) file are pointing at the correct database.
   2. Run `yarn-db-up`. See [Scripts](#scripts) for more details, including requirements for running against AWS databases.

## Todo

- Assess to move this to api or move api migrations folder here

### Enhace database security

- Create database specific user or users so that they cannot create nor access other databases

```sql
CREATE USER `dpb-lambda`@`<vpc or subnet ip range or lambda specifc ip>` IDENTIFIED BY '<password>';
GRANT ALL ON `dpb-api-db` TO `dpb-lambda`@`<vpc or subnet ip range or lambda specifc ip>`;
FLUSH PRIVILEGES;
```

- In lambdas, encrypt database credentials using [AWS KMS](https://docs.aws.amazon.com/kms/latest/APIReference/Welcome.html)
- Make the proper updates to terraforms scripts and/or deploy pipelines to enable the former points
