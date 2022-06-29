const lcl = require("cli-color"),
    compression = require("compression"),
    cors = require("cors"),
    morgan = require("morgan"),
    path = require("path"),
    favicon = require("serve-favicon"),
    bodyParser = require("body-parser"),
    {
        getAuth
    } = require("./api/middleware/auth/apiKey"),
    express = require("express");

// global express
const app = express();

// express middlewares
app.use(compression());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(favicon(path.join(__dirname, "static", "favicon.ico")));
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({
    extended: true
}));

// express routes
app.use("/", require("./views/router"));
app.use("/api", require("./api/router"));
app.use("/static", express.static(path.join(__dirname, "static")));

// express error handler
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


// start express server
const port = process.env.PORT || 3000;
app.listen(port, async function () {
    await getAuth(true);
    console.log(lcl.blue("[Express - Info]"), "Started on port", lcl.yellow(port));
});