const chalk = require('chalk');
const log = console.log;
const pressAnyKey = require('press-any-key');
const { execSync } = require('child_process');

var cmds = [
    { msg: 'Applying first migration', cmd: 'yarn sequelize db:migrate --to 20210317074129-create-entity.js' },
    { msg: 'Displaying status of all migrations', cmd: 'yarn sequelize db:migrate:status' },
    { msg: 'Applying all pending migrations', cmd: 'yarn sequelize db:migrate' },
    { msg: 'Undoing all migrations', cmd: 'yarn sequelize db:migrate:undo:all' }];

(async () => {
    for (const item of cmds) {
        log(chalk.yellow(`${item.msg} ...`));
        log(execSync(item.cmd).toString());
        await pressAnyKey('Press any key to continue');
    }
})();

