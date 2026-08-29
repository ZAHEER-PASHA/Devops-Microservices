const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes =
    require("./routes/authRoutes");


const app =
    express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    morgan("dev")
);


// ==========================================
// FRONTEND
// ==========================================

app.use(

    express.static(

        path.join(
            __dirname,
            "../public"
        )

    )

);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            service:
                "user-service",

            status:
                "UP"

        });

    }
);


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// 404
// ==========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found"

        });

    }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    (
        err,
        req,
        res,
        next
    ) => {

        console.error(
            err.stack
        );


        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


module.exports =
    app;