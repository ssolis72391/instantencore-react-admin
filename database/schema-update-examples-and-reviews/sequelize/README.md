# Example: Database schema update using [sequelize](https://sequelize.org/)

### Features
- Programmatic schema update
- Best suited for initial/quick development, not for production

### What does it do
- A code model is defined
- A database table mapped to the model is created
- A query is done to describe the table
- The table is dropped

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
