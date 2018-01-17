const mysql = require('mysql2/promise')
require('dotenv').config()

const connectionLimit = process.env.DB_CONN_LIMIT || 10
const host = process.env.DB_HOST || 'localhost'
const port = process.env.DB_PORT || 3306
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_DATABASE

const pool = mysql.createPool({ connectionLimit, host, port, user, password, database })

module.exports = pool
