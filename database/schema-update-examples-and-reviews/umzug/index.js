const Sequelize = require('sequelize')
const path = require('path')
const Umzug = require('umzug')
const config = require('./config')
const chalk = require('chalk');
const log = console.log;
const pressAnyKey = require('press-any-key');

const sequelize = new Sequelize({
    ...config
})

const migrationsPath = path.join(__dirname, './migrations');

const umzug = new Umzug({
    migrations: {
        // indicates the folder containing the migration .js files
        path: migrationsPath,
        // inject sequelize's QueryInterface in the migrations
        params: [
            sequelize.getQueryInterface()
        ]
    },
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    }
})

var cmds = [
    { msg: 'Applying first migration', cmd: () => umzug.up('20210317074129-create-entity') },
    {
        msg: 'Displaying status of all migrations', cmd: async () => {
            return [... await umzug.executed(), ... await umzug.pending()]
        }
    },
    { msg: 'Applying all pending migrations', cmd: () => umzug.up() },
    { msg: 'Undoing all migrations', cmd: () => umzug.down({ to: 0 }) }];

(async () => {
    for (const item of cmds) {
        log(chalk.yellow(`${item.msg} ...`));
        var result = await item.cmd();
        log(`${result.length} migrations proccessed`);
        log();
        await pressAnyKey('Press any key to continue', {});
    }
})().then(() => process.exit(0));

