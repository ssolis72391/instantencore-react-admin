# InstantEncore Digital Program Book API Lambdas

## Table of Contents <!-- omit in toc -->

<!-- toc -->

- [Depends on](#depends-on)
- [Running commands via `yarn`](#running-commands-via-yarn)
- [Build](#build)
- [Deploy](#deploy)
- [Build Pipeline](#build-pipeline)
- [Deployment Pipeline](#deployment-pipeline)
- [Documentation](#documentation)
- [Software License Report](#software-license-report)
- [Sequelize](#sequelize)
- [Database](#database)
- [Code](#code)
- [Folder structure](#folder-structure)
  - [Current](#current)
  - [Future](#future)
- [Codespace](#codespace)
  - [Local Database](#local-database)
- [Add an endpoint](#add-an-endpoint)
- [Testing and Debugging Lambdas](#testing-and-debugging-lambdas)
  - [Snapshots](#snapshots)
- [Development guidelines](#development-guidelines)
  - [Naming conventions](#naming-conventions)
  - [Service patterns](#service-patterns)
  - [Testing guidelines](#testing-guidelines)
    - [General recommendations](#general-recommendations)
    - [Unit tests](#unit-tests)
      - [Mocking](#mocking)
    - [Integration tests](#integration-tests)
  - [Sequelize](#sequelize)
  - [Sequelize Errors](#sequelize-errors)
  - [Unhandled promise rejections](#unhandled-promise-rejections)
  - [Todo](#todo)
- [API Schema (Work in progress)](#api-schema-work-in-progress)
  - [Open API Definition (Work in progress)](#open-api-definition-work-in-progress)
  - [Swagger UI](#swagger-ui)
- [Todo](#todo-1)

<!-- tocstop -->

## Depends on

- [AWS CommandLine Interface](https://aws.amazon.com/cli/)
- [node 12.x](https://nodejs.org/download/release/latest-v12.x/) - Limited to the available [AWS Lambda Runtime](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)
  ```bash
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- [Yarn 2](https://yarnpkg.com/)

  ```bash
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  ```

- IAM credentials for Amazon AWS
  install via aws configure

- Environment Variables
  - Database connection variables
    > currently required for tests to pass
    - `DB_HOST`
      - using a vanity dns string of "`dpb-db.<workspace>.instantencore.com`" helps to separate direct coupling of database and api configuration
    - `DB_USER`
    - `DB_PASSWORD`
    - `DB_NAME`
    - `DB_PORT`
  - Sentry logging variables
    - `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORGANIZATION`, `SENTRY_PROJECT`

### Ubuntu 20.04

- zip

### Windows

- [zip for bash](https://sourceforge.net/projects/gnuwin32/files/zip/)

## Commands

Run these commands using `yarn <command>`.

| Command            | Description                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| audit              |                                                                                                                                                                                                        |
| build              | Alias for `build-dev`                                                                                                                                                                                  |
| build-api-document | Builds the Open API document and writes it to `./openapi/openapi.yaml`                                                                                                                                 |
| build-deploy-dev   | Create **development** builds for all lambdas **(multi threaded)** and deploys them                                                                                                                    |
| build-dev          | Create **development** builds for all lambdas **(multi threaded)**                                                                                                                                     |
| build-one-dev      | Create **one development** for **one** lambda. **Lambda name has to be passed as unnamed argument**. Eg. `yarn build-dev-one get-user` or `yarn build-dev-one get-user --watch` for incremental builds |
| build-prod         | Create **production** builds for all lambdas **(multi threaded)**                                                                                                                                      |
| build-prod-classic | Create production builds for all lambdas **(single threaded)**                                                                                                                                         |
| clean              | Clean build output                                                                                                                                                                                     |
| deploy-dev         | Deploy **development** builds for all lambdas (required building them first)                                                                                                                           |
| docs               | Builds and displays code documentation                                                                                                                                                                 |
| format:code        |                                                                                                                                                                                                        |
| format:package     |                                                                                                                                                                                                        |
| lint               | Lint (read-only)                                                                                                                                                                                       |
| lint:fix           | Fix linting errors                                                                                                                                                                                     |
| test               | Alias for test-unit                                                                                                                                                                                    |
| test-all           | Run all tests                                                                                                                                                                                          |
| test-file          | Runs a test file                                                                                                                                                                                       |
| test-integration   | Run all integration tests                                                                                                                                                                              |
| test-unit          | Runs all unit tests                                                                                                                                                                                    |
| test:debug         |                                                                                                                                                                                                        |
| toc                | Generates or updates this README TOC                                                                                                                                                                   |
| update             | Zips all lambdas (no args passed), or deploys one lamda. Eg. `yarn update get-user`                                                                                                                    |
| watch              |                                                                                                                                                                                                        |                                                                                                                                                                                 |

Generally `yarn build` and `yarn update` are all that are needed.

## Build

```
# Build `api-shared` (not needed if no changes since last build)
cd path/to/api-shared
yarn
yarn build

# Build this project
cd path/to/api
yarn build
```

We use [parallel-webpack](https://www.npmjs.com/package/parallel-webpack) to speed up builds.

## Deploy to your AWS environment from your local development environment

To deploy a single lambda, you can use `yarn update <lambda>` where the lambda name is the name of the file in `src/functions` without the extension.

```bash
export AWS_PROFILE=sandbox
yarn update helloworld
```

## Build Pipeline

- Defined in the following files:
  - [azure-pipelines.yml](azure-pipelines.yml)
  - [templates\jobs\build_yarn.yml](templates\jobs\build_yarn.yml)
- Switched to a custom local template (_`templates\jobs\build_yarn.yml`_) in order to speed up build and avoiding duplicate builds and refetching of npm packages.
- <b>To speed up development we're using a `dev build`</b>. `This is a temporary meassure.`

## Deployment Pipeline

Deployment from Azure Pipelines depends on an azure_agent running from [SwitchCaseGroup/switchcase-pipelines-terraform](https://github.com/SwitchCaseGroup/switchcase-pipelines-terraform)

**TODO:** Azure Devops deploy pipeline [instantencore-dpb-api-lambdas deploy]

- If the stage that you want to deploy to does not exist, one needs to be created.
  - **TODO:** Describe how to set the Agent pool, within "Agent job", to the `?????-<env>`
- Each stage in the pipeline does need to set the AWS Region because the agent may not be in the same region as a given company's primary region

## Documentation

Code documentation can be generated by running `yarn docs` which will output documentation in `./artifacts/docs`

**NOTE:** `yarn docs` is currently in a broken state due to unresolved dependency issues.

## Software License Report

You can get a license report via [npm-license-crawler](https://github.com/mwittig/npm-license-crawler)

```
npm -g install npm-license-crawler
npm-license-crawler --dependencies --csv license.csv <project>
```

## Sequelize

- Only supports creation with nested associations (relationships). Updates must be done in various operations. [More information.](https://sequelize.org/master/manual/creating-with-associations.html)

## Database

See [Codespace: Local Database](#local-database) for local database development details.

See [database/README.md](src/database/README.md) for steps to create and migrate the database.

## Folder structure

### Current

```bash
- bin (to be renamed to tools)
- src
  - core
  - functions (posibily to be renamed to lambdas after v1)
    - factories
  - lambdas (to be removed)
  - database
    - factories
- test-unit
- test-integration
- test-tools
```

### Future

To be done

## Codespace

This repository maintains a `devcontainer` definition to provide a fast, consistent development environment. Relevant details are highlighted here.

### Local Database

Codespaces does not have access to our AWS databases because we restrict the ip addresses that can connect to the database. Therefore a local db must be used if you want to have a database connection.

- A local `mysql:8.0` service is available
- A VS Code Extension (`cweijan.vscode-mysql-client2`) with a friendly GUI is installed.
- To use the local db you will want to edit your `.env` to look like:

```
DB_HOST="127.0.0.1"
DB_USER="root"
DB_PASSWORD="root"
DB_NAME="dpb-dev"
DB_PORT=3306
```

- The `.env` can be used when running migrations or running tests.

## Add an endpoint

See [Add an API endpoint](../docs/add-api-endpoint.md) for details on adding a new API endpoint.

## Testing and Debugging Lambdas

If you write unit tests ([test-unit/functions](test-unit/functions/)) for the lambda function using LambdaTester, when you run your tests (`yarn test`) your code will execute.

If you write integration tests ([test-integration/functions](test-integration/functions/)) for the lambda function using LambdaTester, when you run your tests (`yarn test-integration`) your code will execute.

NOTE: `package.json@scripts:test` defines a `--testMatch` pattern so the filename and location is critical. (Eg `*.ts_` will not match)

### Snapshots

Unit test snapshots are stored in `__snapshots__` folder besides the tests.

If the unit test uses snapshots and your snapshot needs to be updated:

1. Run `yarn <test|test-integration> -u` to update the snapshot.
2. Verify the new snapshot has the correct data
3. Run `yarn <test|test-integration>` to run against the new snapshot.

## Development guidelines

### Coding patterns

- Use [`getWrappedHandler(FunctionHandler)`](src/core/getWrappedHandler.ts) function to add error handling and more.

### Naming conventions

Where `[]` denotes a required fragment, `[/]` and optional one, `[|]` a fragment with multiple values and `""` encloses fixed text:

- Functions (Lambdas):

  - `["Post"|"Get"|"Put"|"Patch"|"Delete"]["One"|"Many"][Resource|Resources]][/Action].ts`

    Eg. `GetOneProgram.ts`

- Database functions:

  - `["Create"|"Read"|"Update"|"Destroy"]["One"|"Many"][Resource|Resources].ts`

    Eg. `ReadOneProgram.ts`

### Service patterns

- A `service` is an object or function that stands between the lambdas (API layer) and the data access layer. This is most of the business logic should be passed. Currently the latter is mostly implemented in the lambdas. We should target moving business logic from the lambdas to the services.
- Since services can be re-utilizable by various lambdas or other services their [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle) should not be limited to just 1 function but to bring a complete set of functions for a given (single) domain model. Ie. Instead of creating a service just for finding 1 model, we could create one that exposes multiple functions for such model. Eg.

  ```ts
  interface ModelService {
    findModel(args);
    updateModel(args);
    deleteModel(args);
    ...
  }
  ```

- All functions SHOULD not be limited to only map equivalent Api or Data layer functions. In fact they SHOULD expose custom functions as required. Eg.

  ```ts
  import { readProgramCount } from "../database/programs/readProgramCount";

  export const programService = {
    async exists({ id }: { id: number }) {
      return (
        (await readProgramCount({
          id,
          status: "all",
        })) > 0
      );
    },
  };
  ```

### Testing guidelines

#### General recommendations

- Use `parseJson<T>(string)` to parse a json value as a type `T`.
- When using `LambdaTester.expectResolve(event)` type the event to leverage intellisense. Eg.

  ```ts
  .expectResolve(async ({ statusCode, body }: FunctionHandlerResult) => ...
  ```

- Ensure the body is truthy before parsing it from JSON. Eg.

  ```ts
  expect(body).toBeTruthy();
  ```

- Create tests that assert both success and failures. Eg:

  ```ts
  it("works", ()=>...)
  it("fails", ()=>...)
  ```

- Do not limit to ensure snapshots match. Ensure trough assertions that the returned values are the expected ones.

#### Unit tests

##### Mocking

- Avoid going trough a module that re-exports the desired one to avoid mocking more modules than the desired one. Eg.

  ```ts
  // suggested
  jest.Mock("./core/submodule");
  // not suggested
  jest.Mock("./core");
  ```

- Validate mocked returns values to ensure mocking is working properly. This will also leave a richer template for a future integration test. Eg.

  ```ts
  // arrange
  getMockedFunction(createOneProgram).mockImplementation(() =>
    Promise.resolve(1)
  );
  // action
  ...
  // assert
  expect(parseJson<HasId>(body).id).toBe(1);
  ```

- Use the `getMockedFunction(Function)` to get the mocked jest function.

#### Integration tests

- When testing creation of resources ensure the resource has actually been created. Eg.

  ```ts
  expect(await programService.exists({ id })).toBeTruthy();
  ```

- Do proper cleanup of created resources to avoid filling the database or leaving obsolete records.

  ```ts
  expect(await programService.delete({ id }));
  ```

### Sequelize

- When filtering using associations (Eg. `where: { ["$association.column$"]: "value"` }) ensure the association `include` has `required` set to **true**. This will convert the query to an inner join. Otherwise the association alias will be declared after the (SQL) where clause and sequelize will throw an error due an invalid column. Eg:

  ```ts
  where: { "$page.internalName": "text" },
  include: [
           {
             association: "page",
             required: true,
  ```

### Sequelize Errors

- When doing various updates within a [`managed transaction`](https://sequelize.org/v5/manual/transactions.html#managed-transaction--auto-callback-) sequelize will throw something like `cannot commit or rollback using transaction {guid} since it has alreay been commited`. One possible solution is switch to [`unmanaged transactions`](https://sequelize.org/v5/manual/transactions.html#unmanaged-transaction--then-callback-) or, if possible, to use `Promise.all([...{sequelize calls}])`.

### Unhandled promise rejections

- You may encounter an `unhandled promise rejection` error. **This can easily happen if you do an async call out of a try catch block**. You can use the `runTryCatch({runable,message,logger})` helper function which will run, handle and log any possible error or just use the classic `try catch` pattern. Eg.

  ```ts
  await runTryCatch({
    runnable: ()=> Function|Promise,
    message: "string",
    logger: logger name|Logger instance
  });
  ```

### Todo

- Mapping between lambda functions and database functions.

## API Schema (Work in progress)

- We use the [Open API Specification (OAS) version 3](https://swagger.io/specification/) to develop our API schema ([Open API Definition](#open-api-definition-work-in-progress)).
- [swagger-inline](https://www.npmjs.com/package/swagger-inline) is used to build the API definition document from [JSDoc](https://jsdoc.app/) comments added to the code in this and the `api-shared` project but we may switch to another strategy. Eg: [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc), custom one, etc.

### Open API Definition (Work in progress)

- To generate the definition document run the `yarn build-api-definition` script.
- The definition document will be stored in the `./openapi/openapi.yaml` file.
  - This file has a symbolic link in `./swagger-ui/dist/openapi.yaml` so that it can be used by Swagger UI (see below).
- **The aformentioned file is not used by terraform**. We update the latter with code generated from the former.

### Swagger UI

- Swagger UI displays the API schema reading the API document generated before.
- Run `yarn swagger-ui` to start a server and open a browser.

## Todo

- ~~Add development guidelines~~
- ~~Move database migration scripts and code files to `~/database` folder~~
- ~~Restore and /or add new:~~
  - ~~test snapshots update scripts~~
- Add debugging instructions
- Replace `bin/update_lambda.sh` with a cross platform script
  - Remove code marked as deprecated unless is still used
  - Replace deprecated code with new implementations
  - split sequelize resources from src/database/ to a diff folder (ie. src/sequelize or src/datase-sequelize)
  - fix/update/uncomment test code from /test/ folder and move it in appropriate new folders:
    - test-unit
    - test-integration
    - test-e2e (if applicable)
  - move /src/tools folder into /src/core/
  - move /src/headers folder into /src/core/
  - move /src/validation folder into /src/core/
  - move /src/lambdas/get-user.ts into src/functions
  - Salvage useful code from /src/lambdas, delete the rest and move all from /src/functions (this returning to the original folder for lambdas)
  - assess if /src/errors brings value. if it does convert it to typescript, if not remove it all
  - Follow naming conventions for files and folders
  - Rename undelete* functions/lambdas with putRestore*. This might affect terraform api definition file.
  - Set `strictNullChecks` to true in `tsconfig.json`
