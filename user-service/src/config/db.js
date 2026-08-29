const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabaseConnection() {
    const maxRetries = 10;
    const retryDelay = 3000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        let connection;

        try {
            connection = await pool.getConnection();

            console.log("MySQL database connected successfully");

            connection.release();

            return true;

        } catch (error) {
            console.error(
                `MySQL connection attempt ${attempt}/${maxRetries} failed:`,
                error.message
            );

            if (connection) {
                connection.release();
            }

            if (attempt < maxRetries) {
                console.log(
                    `Retrying MySQL connection in ${retryDelay / 1000} seconds...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, retryDelay)
                );
            }
        }
    }

    console.error(
        "Unable to connect to MySQL after maximum retries."
    );

    process.exit(1);
}

module.exports = {
    pool,
    testDatabaseConnection
};