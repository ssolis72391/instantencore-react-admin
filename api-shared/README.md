# InstantEncore Digital Program Book API Shared package <!-- omit in toc -->

## Table of Contents

<!-- toc -->

- [Description](#description)
- [Scripts](#scripts)
- [Development guidelines](#development-guidelines)
  - [Visual Studio Code](#visual-studio-code)
  - [Coding rules](#coding-rules)
  - [Naming conventions](#naming-conventions)
  - [Api request models types conventions](#api-request-models-types-conventions)
    - [Samples](#samples)
  - [Roadmap](#roadmap)
  - [Module structure](#module-structure)
  - [Enums replacement pattern](#enums-replacement-pattern)
  - [Folder structure](#folder-structure)
- [Roadmap](#roadmap-1)
- [Todo](#todo)

<!-- tocstop -->

## Description

This package exports contracts and utilities used by both `api` and `clients` (Eg. CMS). This to ensure the latter keep in sync with the former.

## Scripts

| Script         | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| yarn build     | Build project                                                               |
| yarn start     | Build project in watch mode                                                 |
| yarn lint      | Run linting and formatting (ESLint+Prettier)                                |
| yarn lint-fix  | Run linting and formatting (ESLint+Prettier) with --fix                     |
| yarn docs      | Builds and display code documentation using [TypeDoc](https://typedoc.org/) |
| yarn test-file | Test a single file by path                                                  |
| yarn toc       | Generates or updates this README toc                                        |

## Development guidelines

### Visual Studio Code

Press `CTRL+F5` to start compilation on watch mode

### Coding rules

- We SHOULD NOT need to explicitely define return types for functions. That's why Eslint `explicit-function-return-type` is turned off.

### Naming conventions

- `classes`, `interfaces` and `types` SHOULD be **PascalCase**
- `variables` and `functions` MUST be **camelCase**.
- `NamedCollection` (to be renamed) class instances MUST be **PascalCase**.
- API models MUST be sufixed with model. Eg: `ProgramModel`.

### Api request models types conventions

REST operation request models types MUST:

- Be prefixed with the Http operation verb.
- Signal if the operation involves one or more resources prefixing the resource name with `One` or `Many`.
- Pluralize the resource name if it involves many.
- End with the `Model` suffix. Eg:
- Format:
  `[Http verb]["One"|"Many"][resource[s|]]"Model"`

#### Samples

- GetOneProgramModel
- PostManyComponentsModel
- etc

### Roadmap

- Remove `One` or `Many` and replace it with `List` in case of many resources. Eg:
  - GetProgram
  - GetProgramList
- Move code to api project and keep this one from symlinks to the formers

### Module structure

- Create a file per domain model. Eg: `programs.ts` for `program`.
- `core.ts` stores no domain model specific code like tools and types.
- `index.ts` is the entry point. All other modules should get imported and exported here. No peer module should import anything from `index.ts`.

### Enums replacement pattern

- Enums are nice but limited so we choose to use types based on union of strings to shape a record and the `NamedCollection` to agument its capabilities. Intellisense will limit the values assignable to the properties or arguments typed with those. Eg:

  ```ts
  type Key = "key1" | "key2";
  // optional, string can be anything
  const Key: Record<Key, string> = {
    key1: "Some value for key1",
    key2: "Some value for key2",
  } as const;
  const KeyCollection = new NamedCollection(Key);

  type A = {
    key: Key;
  };

  const a: A = { key: "key1" }; // or key: "key2"
  function b(key: Key) {
    // do something
  }
  b("key1"); // or b("key2");
  ```

### Folder structure

- `src/`: Source code single folder. No subfolders needed for now.
- `lib/`: Compiled code gets outputted here.

## Roadmap

This package may be renamed to api-core, its files extracted from api or be merged with api-client-sdk.

## Todo

- Remove code marked as deprecated unless is still used
- Replace deprecated code with new implementations
