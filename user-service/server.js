require("dotenv").config();

const app =
    require("./src/app");

const {
    testDatabaseConnection
} = require("./src/config/db");


const PORT =
    process.env.PORT || 5001;


async function startServer() {

    await testDatabaseConnection();


    app.listen(
        PORT,
        () => {

            console.log(
                `User Service running on http://localhost:${PORT}`
            );

        }
    );
}


startServer();