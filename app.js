// config
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// dev
app.use(morgan("dev"));

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST");
        return;
    }
    next();
});


// status
app.get("/status", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "🚀 The rocket has launched 🚀",
    });
});

// Errors
app.use((req, res, next) => {
    const error = new Error({
        "success": false,
        "error": {
            "message": "❌ Page Not Found ❌"
        }
    });
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        "success": false,
        "error": {
            "message": error.message,
        }
    });
});

module.exports = app;