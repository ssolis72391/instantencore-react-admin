import config from './config.js'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize("test", "admin", config.mysqlPassword, {
    host: 'alfredodb1.cpacomqiaq2w.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialectOptions: {
        ssl: 'Amazon RDS'
    },
    pool: { maxConnections: 5, maxIdleTime: 30 },
    language: 'en'
})

export default sequelize;