# InstantEncore Digital Program Book Workspace

## Organization

We're using a monorepro structure to leverage the following:
- Single source of truth
- Code re-usage
- Transparency
- Atomic changes
- Linked local (both published and non published) npm packages
- Future:
  - Shared npm packages cache once migration to yarn2 is done

## Current folder structure

```
├── docs/
├── infrastructure/
├── shared
├── database/
├── client-core/
├── client-web/
├── cms/
├── api/
├── api-client-sdk/
├── api-shared/
```

## Documentation

- [docs](/docs): High level documentation for the monorepo
  - [Add an API endpoint](docs/add-api-endpoint.md)
  - [Linting and Formatting](docs/linting-and-formatting.md)
  - [System Deployment](docs/system-deployment.md)
  - [System Design and Development Log](docs/system-design-and-development-log.md)
  - [System Software Development Process](docs/system-software-development-process.md)
- `README.md` files in each directory
  - [api/README.md](api/README.md)
  - [client-core/README.md](client-core/README.md)
  - [client-web/README.md](client-web/README.md)
  - [cms/README.md](cms/README.md)
  - [database/README.md](database/README.md)
  - [infrastructure/README.md](infrastructure/README.md)
