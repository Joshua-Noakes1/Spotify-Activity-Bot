// config
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const nocache = require("nocache");

// routes
const plex = require("./endpoints/plex/plex");
const spotify = require("./endpoints/spotify/spotify");

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

app.use(nocache());

// endpoints
app.use("/hooks/plex", plex);
app.use("/hooks/spotify", spotify);

// status
app.get("/status", (req, res) => {
  res.status(200).json({
    message: "🚀 The rocket has launched 🚀",
  });
});

// Errors
app.use((req, res, next) => {
  const error = new Error("❌ Not Found ❌");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

module.exports = app;
