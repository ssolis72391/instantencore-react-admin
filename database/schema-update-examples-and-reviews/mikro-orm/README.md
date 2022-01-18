# Review: Database schema update using [mikro-orm](https://mikro-orm.io/)

### Features
- Uses [umzug](../umzug/README.md) for migrations but [adds its own migration API](https://mikro-orm.io/docs/migrations#migration-class)
- Both programmatic and cli based migrations, well suited for intial development, production and CD
- [Attribute based code model to db schema mapping plus at least one additional approach!](https://typeorm.io/#/entities/what-is-entity)
- [Automatically generated migrations!](https://mikro-orm.io/docs/migrations)

### Missing
- More acceptance, as the time of writing [it's only being download 16714 times a week](https://www.npmjs.com/package/mikro-orm)

### Todos
- [Who uses MikroORM in production?](https://github.com/mikro-orm/mikro-orm/issues/296)
- Reasons to consider it over [typeorm](https://typeorm.io/): https://github.com/mikro-orm/mikro-orm/issues/296#issuecomment-719047783


