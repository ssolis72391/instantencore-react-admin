module.exports = {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        ssl: process.env.MYSQL_SSL
    }
}