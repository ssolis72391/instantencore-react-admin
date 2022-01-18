# Review: Database schema update using [typeorm](https://typeorm.io/#/)

### Features
- CLI tool (and also npm module/full orm), well suited for intial development, production and CD
- [Attribute based code model to db schema mapping!](https://typeorm.io/#/entities/what-is-entity)
- [Automatically generated migrations!](https://typeorm.io/#/migrations/generating-migrations)
```ts
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;

}
```
### Missing
- Still far away from a 1.0.0 release, although latest (0.2.31) [is said to be pretty stable](https://typeorm.io/#/roadmap/note-on-100-release). Also, at the time of writing [it's being downloaded 591,000+ times per week from npm.](https://www.npmjs.com/package/typeorm)


