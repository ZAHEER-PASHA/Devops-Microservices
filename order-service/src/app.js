const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./config/db");

require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));


app.get("/health", (req, res) => {

    res.json({
        success: true,
        service: "order-service",
        status: "healthy"
    });

});


app.get("/health/db", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.json({
            success: true,
            service: "order-service",
            database: "connected"
        });

    } catch (error) {

        console.error("Database connection failed:", error);

        res.status(500).json({
            success: false,
            service: "order-service",
            database: "disconnected"
        });

    }

});


app.use("/api/orders", orderRoutes);


module.exports = app;