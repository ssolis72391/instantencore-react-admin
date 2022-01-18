# Digital Program Book Client Web <!-- omit in toc -->

This website is a SPA for hosting the [@instantencore/digital-program-book](https://dev.azure.com/switchcasegroup/SCG/_packaging?_a=package&feed=SwitchCase&protocolType=Npm&package=%40instantencore%2Fdigital-program-book) npm package that is created in [client-core](../client-core). Examples:

- Production: https://dpb-web.instantencore.com (not deployed yet)
- Sandbox Copper: https://dpb-web.copper.instantencore.com

## Table of Contents <!-- omit in toc -->

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Run](#run)
- [Tests](#tests)
- [Upgrading @instantencore/digital-program-book](#upgrading-instantencoredigital-program-book)
- [Rapid development with local version of @instantencore/digital-program-book](#rapid-development-with-local-version-of-instantencoredigital-program-book)
- [Build](#build)
- [Deployment](#deployment)
- [Local Deployment](#local-deployment)
- [Options](#options)
- [Known Issues](#known-issues)

## Prerequisites

- Setup environment to host the client-web if it doesn't exist yet. Follow the instructions in [infrastructure/cdn](../infrastructure/cdn) to setup AWS S3, CloudFront, ACM and Route 53.
  - TODO: Link to how we use [Azure DevOps environment](https://dev.azure.com/switchcasegroup/SCG/_environments) with our Azure Agents, eg: `<sandbox>-instantencore-pipe-env`.
- npmrc credentials to access SwitchCase's private npm repo on Azure DevOps.
  - https://docs.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops
  - .npmrc file already exists in this repo. You just need to setup your machine's user .npmrc file.
  - Your credentials need to be renewed every 90 days.

## Installation

```
yarn install
```

### Troubleshooting

#### Couldn't find package "@instantencore/digital-program-book" on the "npm" registry.

- Verify that your npmrc is configured correctly to connect to the private npm registry. See [switchcase-engineering-docs/private-npm-registry.md](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/artifacts/private-npm-registry.md).

## Run

```
yarn start
```

- Hot reloading is enabled so any change to the files located in the `/src` folder will automatically refresh the browser.

## Tests

See the [/test](test) folder for tests.

```
yarn test
```

## Upgrading @instantencore/digital-program-book

```
yarn upgrade @instantencore/digital-program-book@<version>
```

This will upgrade `@instantencore/digital-program-book` from a [private npm repo](https://dev.azure.com/switchcasegroup/SCG/_packaging?_a=package&feed=SwitchCase&package=%40instantencore%2Fdigital-program-book&protocolType=Npm) hosted on Azure Dev Ops. New artifacts are added to this repo from the CI in `client-core`.

## Rapid development with local version of @instantencore/digital-program-book

To do rapid development against `client-core` without waiting for CI/CD to build the latest @instantencore/digital-program-book artifact you can use the script in `tools/updateLocalClientCore.js`. After making changes to `client-core` run this command:

```
yarn update-local-client-core
```

This will build `client-core` and create a `pack` file. Then it will add it to your dependencies using `yarn add`. See the script for details.

This is meant to be temporary and should not be checked into CI/CD. To revert back to using the proper `@instantencore/digital-program-book` artifact you can revert changes to `package.json` and run `yarn install`, or do the following:

```
yarn remove @instantencore/digital-program-book
yarn add @instantencore/digital-program-book@<version>
```

## Build

```
yarn build
```

## Deployment

The deployment process copies the fully-built website to an S3/Cloud Front website that users can access.

### Build

Azure DevOps pipeline [instantencore-digital-program-book-workspace-client-web](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=205) ([azure-pipelines.yml](azure-pipelines.yml)) generate the static artifacts that can be deployed to the s3 bucket.

### Deploy pipeline

Azure DevOps pipeline [instantencore-digital-program-book-workspace-client-web deploy](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=206) ([azure-pipelines-deploy.yml](azure-pipelines-deploy.yml)) to deploy the built static artifacts to the s3 bucket.

## Local Deployment

You can deploy the application without the need to go trough the build and deploy pipelines.

- [Build](#build) the application
- Set proper environment variables in `deploy.env`
- Run the following script:
  ```bash
  yarn deploy-dev <sandox>
  ```

## Options

The following url query string parameters are available:

| Field    | Type | Required | Description                                                                                                           |
| -------- | ---- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| useMocks | bool |          | Will pass be passed to `DigitalProgramBookComponent`. If true, the component will use mocked data instead of the api. |
| debug    | bool |          | If `true`, the version of `DigitalProgramBookComponent` will be displayed at the top of the page.                     |

## Known Issues

### Full Cloudfront distribution

- Current downside is that this uses a full cloudfront distribution to host a very small SPA. A better hosting option is likely available.
- Using an edge lambda to route to the correct default page based uri components may enable multiple apps on one cloudfront distribution.

### Configuration

- Configuration is currently done by reading the domain (for `apiBasePath`) and using query string parameters (ex: `useMocks`). The values are determined and then passed into the constructions for `DigitalProgramBookComponent`.
- This works well for these simple values.
- When we need to use proper environment variables (i.e. Sentry key) we should have CI create a `Config.js` file that is used to populate these variables. [gallus-mobile-checkin-website](https://github.com/SwitchCaseGroup/gallus-mobile-checkin-website) can be used an example.

### CSS in index.html

- The CSS for the parent application is defined directly in index.html.
- This should be moved to it's own file. Note that we use the `base` element so the file needs to be relative to this.
- Or look at example of how [instantencore-livenote-embed](https://github.com/SwitchCaseGroup/instantencore-livenote-embed) loads it's stylesheet via js `require`.
