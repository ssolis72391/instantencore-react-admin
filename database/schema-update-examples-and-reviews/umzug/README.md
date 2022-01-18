# Example: Database schema update using [umzug v2.x (stable)](https://github.com/sequelize/umzug/blob/v2.x/README.md)

### Features
- Used by [sequelize-cli](https://github.com/sequelize/cli/blob/master/README.md), well suited for progammatic migrations, CI and production.
- Faster than the [sequelize-cli example](../sequelize-cli/README.md).

### Missing
- Automatic migration generation (must be done manually)
- A `tryup` method that aborts applying a migration that has already been aplied and avoids throwing an exception. This can be solved querying for the already applied migrations.

### What does this example do
- Applies an initial migration (20210317074129-create-entity)
- Displays the status of all migrations. Applied (up) or unapplied (down)
- Applies all pending migrations
- Undoes all migrations

### Pre-requisites
- Create a MySQL database
- Set the following env variables:
  - MYSQL_PASSWORD
  - MYSQL_DATABASE
  - MYSQL_USERNAME
  - MYSQL_HOST
  - MYSQL_SSL (Set to `Amazon RDS` for RDS)

### Run it

From command line/bash/terminal run:
```bash
node .
```

