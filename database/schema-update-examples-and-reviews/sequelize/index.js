import config from './config.js'
import s from 'sequelize'
const { Sequelize, DataTypes } = s;

const sequelize = new Sequelize(config.mysqlDatabase, config.mysqlUsername, config.mysqlPassword, {
    host: config.mysqlHost,
    dialect: 'mysql',
    port: 3306,
    maxConcurrentQueries: 100,
    dialectOptions: {
        ssl: config.mysqlSsl
    },
    pool: { maxConnections: 5, maxIdleTime: 30 },
    language: 'en'
})

const model = sequelize.define('RecordWithValue', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
});

await sequelize.sync();

const modelDescription = await model.describe();

console.log(modelDescription);

await model.drop();



