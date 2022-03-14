const mysql = require('mysql')

const {
    DB_HOST = "127.0.0.1",
    DB_PORT = 3306,
    DB_USER = "root",
    DB_PASSWORD = "root",
    DB_DATABASE = "warehouse",
} = process.env

const connection = module.exports = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
})
connection.connect()
