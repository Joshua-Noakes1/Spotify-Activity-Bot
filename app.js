const lcl = require('cli-color'),
    compression = require('compression'),
    cors = require('cors'),
    morgan = require('morgan'),
    bodyParser = require("body-parser")
express = require('express');

// const global app object
const app = express();

// express middlewares
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/public', express.static(__dirname + '/public'));

// routers
app.use('/api', require('./api/router'));


// Start the server
const port = process.env.port || 3000;
app.listen(port, async function () {
    await require('./api/middleware/auth/createAuth.js')(true);
    console.log(lcl.blue("[Info]"), "Server started on port", lcl.yellow(port));
});