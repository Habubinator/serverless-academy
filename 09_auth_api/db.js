const Pool = require("pg").Pool
const {DB_HOST, DB_PORT = "5432", DB_USER = "", DB_PASSWORD = "", DB_NAME = "postgres"} = require("./config/config").getEnv()
const pool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
})

module.exports = pool