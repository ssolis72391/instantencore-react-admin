import  sequelize  from './sequelize.js';

sequelize.query("select 'hello world from mysql'")
    .then(data => console.log(data));