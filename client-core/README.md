# Client Core <!-- omit in toc -->

- This delivers the core functionality of the end user experience for the Digital Program Book service. [Project Requirements and Documentation](https://switchcasegroup.atlassian.net/wiki/spaces/IE/pages/1655177275/Digital+Program+Book)

- This is a ReactJS Single Page Application (SPA), packaged and published as an NPM package to make it possible to consume in different environments. It is designed to be embedded in either a static HTML page or a hybrid native application.

## Contents <!-- omit in toc -->

- [Development Standards / Tools](#development-standards--tools)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Linter](#running-linter)
- [Running Tests](#running-tests)
- [Building](#building)
- [CI and Publishing](#ci-and-publishing)
- [Using the Package](#using-the-package)
- [Constructor](#constructor)
- [Mock Data](#mock-data)
- [Releases](#releases)

## Development Standards / Tools

| Type                 | Standard /Tool                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package Management   | [yarn](https://yarnpkg.com/en/)                                                                                                                   |
| Testing              | Use the built in [testing tools in nwb](https://github.com/insin/nwb/blob/master/docs/Testing.md#testing)                                         |
| HTML/SCSS/CSS        | [BEM - Block Element Modifier](http://getbem.com/)                                                                                                |
| Development Workflow | [Git Feature Branch Workflow](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/git/git-feature-branch-workflow.md) |
| Coding Standards     | [SwitchCase Coding Standards](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/coding-standards/README.md)         |

## Prerequisites

- [Node.js](http://nodejs.org/) 14.X
- [yarn](https://yarnpkg.com/en/) >= 1.22.10

## Installation

- Running `yarn install` in the component's root directory will install everything you need for development.

## Project Structure

- This repo was initialized using the [nwb](https://github.com/insin/nwb) toolkit. This makes it easier to create React libraries. For details see [Developing React Components and Libraries with nwb](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb).

- The React module's source goes in the `/src` folder. This is the code that is built into the package when you run `yarn build`.

- Further details on other folders and files can be found in the `nwb` documentation:
  https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#project-layout

## Running Linter

- `yarn lint` will run the linter.

- `yarn lint:fix` will run the linter fix what can be auto fixed.

## Running Tests

- `yarn test` will run the tests once.

- `yarn test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `yarn test:debug` will run the tests for debugging in vscode.

- `yarn test:watch` will run the tests on every change.

## Run locally

- `yarn start` will start the demo server using the code in `/demo`.

## Building

- `yarn build` will build the component for publishing and also bundle the demo app.

- `yarn clean` will delete built resources.

## CI and Publishing

[Azure DevOps build pipeline](https://dev.azure.com/switchcasegroup/SCG/_build?definitionId=197)

- The Azure DevOps build pipeline configuration is in [azure-pipelines.yml](azure-pipelines.yml).

- Builds are automatically started for Pull Requests that are ready for review. Please check to make sure you don't break the build.

- A new version of the npm package is added to [InstantEncore's private repository](https://dev.azure.com/switchcasegroup/SCG/_packaging?_a=package&feed=SwitchCase&package=%40instantencore%2Fdigital-program-book&protocolType=Npm) hosted on Azure DevOps when code is merged into the `master` branch.

## Using the Package

### Using Private NPM Repo

- Must setup your .npmrc file to access. [Instructions](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/artifacts/private-npm-registry.md)
- `yarn add @instantencore/digital-program-book@X.X.X` to add the package to your application.
- `package.json` will look like:
  ```
  "dependencies": {
    ...
    "@instantencore/digital-program-book": "X.X.X",
    ...
  }
  ```

### Rapid Development

The CI process is set to automatically create new versions of the package in the npm repository for each successful build. However, during development this may add extra time and make it hard to quickly test.

Here are a couple of options for doing quick iterative development and testing.

Please note that if you use one of the options below, before committing to `master` or a release branch you should reference npm packages from the private repo.

#### yarn pack

- Run the following commands to build the project and create a `*.tgz` file in `/client-core` that can be used to consume this application.
  ```
  cd /path/to/client-core
  yarn build
  yarn pack
  ```
- Add the package to your parent application:
  ```
  yarn add <path to *.tgz file>
  ```
- To ensure you have the latest version rename the `*.tgz` so that yarn doesn't use a previous version of the file from its cache.
- See `/client-web/tools/updateLocalClientCore.js` for an example script that uses this technique.

#### Reference local package

Run the following command:
`yarn add link:../client-core` to add the package to your application.

`package.json` will look like:

```json
"dependencies": {
  "@instantencore/digital-program-book": "link:../client-core"
},
```

#### Copy build files

- Build this project using `yarn build`
- Copy the appropriate `umd/` files (`digital-program-book.min.js` and `main.css`) directly to the project that is consuming this package.

### Consuming the Package in Code

- Reference the package in `index.html` or your app's entry point

  ```
  <link rel="stylesheet" type="text/css" href="/path/to/package/in-app-payments.min.css">
  <script type="text/javascript" src="/path/to/package/in-app-payments.min.js"></script>
  ```

- In your code, initialize and display:

  ```
  var app = new DigitalProgramBookComponent({
    target: 'root',
    ...
  });

  app.display();
  ```

- A complete example can be found in [instantencore-cordova-test](https://github.com/SwitchCaseGroup/instantencore-cordova-test).

## Constructor

The constructor expects an object with the following fields:

| Field            | Type   | Required | Description                                                                                                           |
| ---------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| target           | string |          | ID of the html element to render this component in. If not specified will default to `root`.                          |
| apiBasePath      | string | yes      | Base path for calls to the API to retrieve data. Ex: `https://dpb-api.instantencore.com/1`                            |
| useBrowserRouter | bool   |          | If `true`, BrowserRouter will be used instead of MemoryRoute. Defaults to `false`.                                    |
| useMocks         | bool   |          | If `true`, local mock data will be used instead of calling the API. Defaults to `false`. See [Mock Data](#mock-data). |

## Mock Data

- Use the mock data files in `src/mocks` to test locally without using the server API.
- See `src/mocks/mocker-creator.js` to generate a details mocking file for a program.

## CSS and Styling

### Dependencies

Base styles are meant to be inherited from a parent application hosting this package (including the demo in this project). This includes `html`, `body` styling.

Styles specifically for this application are in the appropriate `.scss` files in the project.

### Font Awesome

This application uses Font Awesome icons. See https://fontawesome.com/how-to-use/on-the-web/using-with/react. Followed the same pattern as used with `in-app-payments`.

### Scoping

To prevent conflict with other components, all styles should be nested under the class `.ie-dpb`.

#### Example

App.scss

```scss
.ie-dpb {
  .some-class-1 {
    ...
  }
  .some-class-2 {
    ...
  }
  ...
}
```

## Releases

After merging into `master`, follow the instructions in [GitHub Releases](https://github.com/SwitchCaseGroup/switchcase-engineering-docs/blob/master/docs/versioning/github-releases.md) to create the release in GitHub.
