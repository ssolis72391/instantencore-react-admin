# DPB System software development process

`Last update: 04/29/21`

The purpose of this document is to:

- Define a common and easy to remember set of terms that will be used trough user stories and documentation
- Detail the development strategy and roadmap
- Set rules for project magement elements: milestones, epics and user stories

`This document SHOULD be updated on a regular basis`

## Contents <!-- omit in toc -->

- [Glossary](#glossary)
- [Glossary mappings to C4 model](#glossary-mappings-to-c4-model)
- [Development strategy](#development-strategy)
- [Development roadmap](#development-roadmap)
- [Code patterns](#code-patterns)
- [Mocking](#mocking)
- [Project Management rules](#project-management-rules)
- [Todo](#todo)

## Glossary

To be used both in user stories, epics and the c4 model. The goal is to use short well defined easy to recognize terms.

| Term         | Description                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| client-core  | The client-core package                                                                                                          |
| client-web   | The client-web application                                                                                                       |
| any client   | Any client application that renders client-core package                                                                          |
| other client | Any client application, not neccesarily based on client-core, that can consume the api                                           |
| cms          | The CMS application                                                                                                              |
| api          | The API application                                                                                                              |
| db           | The database                                                                                                                     |
| db-model     | Conceptual (software code) model that describes and maps to the database schema                                                  |
| db-schema    | Database schema                                                                                                                  |
| migration    | Database migration script(s) or function(s)                                                                                      |
| org          | Instant Encore customer                                                                                                          |
| user         | CMS application user                                                                                                             |
| patron       | Client (SPA) application user                                                                                                    |
| endpoint     | API REST endpoint composed by the verb, path and otionally query parameters (Eg. GET /users[?[param1=value],[param2=value],...]) |
| client-ser   | client-core package service instance                                                                                             |
| cms-ser      | Service instance within the CMS application                                                                                      |
| api-ser      | Service instance within the API application                                                                                      |
| logic        | Business or application rules. General code.                                                                                     |

## Glossary mappings to C4 model

| Term         | C4 Model element type |
| ------------ | --------------------- |
| client-core  | container             |
| client-web   | container             |
| any client   | container             |
| other client | container             |
| cms          | container             |
| api          | container             |
| db           | container             |
| db-model     | component             |
| db-schema    | component             |
| org          | person                |
| user         | person                |
| patron       | person                |
| migration    | component             |
| endpoint     | component             |
| client-ser   | component             |
| cms-ser      | component             |
| api-ser      | component             |
| logic        | code                  |

## Development strategy

- cms development will be the starting project to work on
- api and client-core development will follow in parallel to cms
- Functionality comes first, UI styling comes last
- Each feature should include all unit tests required

### Development tools

- [Markdown table generator](https://www.tablesgenerator.com/markdown_tables)
- [API schema genetor](https://app.swaggerhub.com/home)
- [Mocks generator](https://www.mockaroo.com/)

### Research

Research is part of development, however it SHOULD NOT take more than 3 hours per epic including any POC(s) or it will become a time eater. If more time is required a user story MUST be created and set maximum priority. If such prioritazion is not possible then it should stay in the backlog in order to re-assess it in the next iteration.

### Development stages

| Stage   | Includes                                       | Excludes                      |
| ------- | ---------------------------------------------- | ----------------------------- |
| Alpha   | Unit tests                                     | Integration tests, Load tests |
| Beta    | Integration tests, black box tests, UI Styling | Load tests                    |
| Release | Load testing                                   | Nothing                       |

### Code coverage

| Stage   | Code coverage |
| ------- | ------------- |
| Alpha   | 50%           |
| Beta    | 70%           |
| Release | 80%           |

## Development roadmap

### Considerations

- Time eaters: 5% (2 hours per iteration)
- Risk buffer: 10% (4 hours per iteration)

Risk buffer values are super optimisic based on the work done during the Hello World epic

### Original

| Stage   | Deadline |
| ------- | -------- |
| Release | 08/08/21 |

### Current

| Stage   | Deadline |
| ------- | -------- |
| Alpha   | 06/13/21 |
| Beta    | 07/18/21 |
| Release | 08/08/21 |

- Both roadmaps based on 5 months ballpark estimation starting 03/08/21 (2 initial half time weeks merged into 1)
- Deadlines expand to sunday to be able to cope with out of buffer risks

## Code patterns

### API

- An endpoint SHOULD try to call only 1 service function

## Mocking

- Mocking should be kept to a minimum and done with re-usability in mind (for unit tests)

## Project Management rules

### Iterations

- First implicit task MUST be to update the C4 model so that it includes all the changes that will result from the commited user stories
- SHOULD include at least 1 epic
- Epics willa act as project milestones

### Milestones

- We will only use one: [Digital Program Book](https://app.clubhouse.io/switchcase/milestone/78178/).

### Epics

Epics represent a complete feature (not set of) being implemented in different ways depending of the type of application. We will use epics as custom (non clubhouse) milestones to track and display development progress.

- MUST be part of the [Digital Program Book](https://app.clubhouse.io/switchcase/milestone/78178/) milestone
- SHOULD include:
  - All user stories required to develop a single feature in cms, api or client-core
  - Or, all user stories required to leverage, connect or consume an already finished feature across cms, api or client-core
  - Or, all user stories required to develop UI features only across related UI components in client-core or cms
- Titles SHOULD avoid generic terms whenever is possible. EG:
  - Application (Use _external application_)
  - Service (Use _external service_)
- Titles CAN make usage of glossary terms
- Epics MUST implicitly include updates to the proper README(s)

#### "DPB: Todo" epic

- The [DPB: Todo](https://app.clubhouse.io/switchcase/epic/50205/dpb-todo?ct_workflow=all) epic contains stories for the [Digital Program Book](https://app.clubhouse.io/switchcase/milestone/78178/) milestone that we may want to do in the future, but aren't part of a specific epic yet. See the epic description for details on using this epic.

### User stories

- Every user story SHOULD be part of an epic
- SHOULD be kept short: maximum 2 points but mostly 1 point
- Titles SHOULD avoid generic lone terms whenever is possible. EG:
  - Application (Use _external application_)
  - Service (Use _external service_)
- Titles SHOULD make usage of glossary terms as much as possible
- Valid subjects (Ie. _As "x"_)
  - any container (_application, database, etc_)
  - any component (_class, instance, UI element, etc_)
  - developer
  - any project management role
  - **`Why not persons (users)?`** We already have UX wireframes and prototypes in place which themselves describe features and user requirements so user driven stories have already been portrayed.

#### SPA (client-core and cms)

- UI bases stories SHOULD include in the Acceptance Criteria a link to the wireframe or UI mock that MUST be followed
- Create stories per form or (React) component to develop
- Create stories per element that trigger an action:
  - Detail what the action does
  - For CRUD oriented actions (Create, Read, Update, Delete) the user story MUST implicitly include the development of the proper client service instance(s) and/or call(s)

#### API

- SHOULD create user stories per endpoint
- SHOULD create user stories per call made by an endpoint to api-sers
- Updating the API schema MUST be an implicit task when creating new endpoints
- API schema must be referenced in each endpoint user story
- User stories for api service calls MUST implicitly include calls to the datastores layer whenever neccesary.
- User stories for api service calls MUST implicitly include calls to other services whenever neccesary.
- User stories for creation of db-models implicitly MUST:
  - Include migrations scripts to generate the data store component(s)
  - Include validation rules


#### DB

- SHOULD create stories only for optimization such as indexing, replacement of auto generated queries by hand written ones, scaling, etc.

## Todo

- Define the rules to update each of the document sections
  - Define the process to re-assess and update, if necessary, the [deadlines of stages](#current)
- Apply glosary terms to rest of the document or move it to the bottom
- Augment [Code patterns](#Code-patterns)
