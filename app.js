// App config
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Express dev
app.use(morgan("dev"));

// Express bodyparser
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

// Modules
const plexHandle = require('./lib/plex/plexHandle');

// Endpoints
app.use('/hooks/plex', plexHandle);

// Status endpoint
app.get("/status", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "🚀 The rocket has launched 🚀",
    });
});

// Express error handling 
app.use((req, res, next) => {
    const error = new Error("❌ Page Not Found ❌")
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        "success": false,
        "error": {
            "code": error.status || 500,
            "message": error.message,
        }
    });
    return;
});

module.exports = app;