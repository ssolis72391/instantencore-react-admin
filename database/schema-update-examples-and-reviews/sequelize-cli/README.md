# Exmaple: Database schema update using [sequelize-cli](https://github.com/sequelize/cli)

### Features
- CLI tool, well suited for CD pipelines
- Well suited for production
- Does not attemp to re-apply already applied migrations

### Missing
- Automatic migration generation (must be done manually)

### What does this example do
- Applies an initial migration
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
