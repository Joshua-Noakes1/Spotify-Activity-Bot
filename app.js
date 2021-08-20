// App config
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require('path');
const favicon = require('serve-favicon');

// Express dev
app.use(morgan("dev"));

// favicon
app.use(favicon(path.join(__dirname, 'static', 'favicon', 'favicon.ico')));

// register ejs
app.set('view engine', 'ejs');

// Express bodyparser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);


// modules
const plex = require('./lib/routes/plex');
const static = require('./lib/routes/static');

// endpoints
app.use('/hooks/plex', plex);
app.use('/static', static);

// static endpoints


// webui
// app.use('/', webUI);


// status endpoint
app.get("/status", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "The rocket has launched",
    });
});

// 500 and 404 error
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        "success": false,
        "message": error.message,
    });
});

module.exports = app;