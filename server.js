require("dotenv").config();
require("./lib/config");
const lcl = require("cli-color");
const app = require("./app");
var http = require("http").Server(app);
const { socketio } = require("./lib/sockets");

// load websockets
socketio(http);

// defaults to port 3000 if no port can be found
const port = process.env.port || 3000;

// create server
http.listen(port);

// log server start
console.log(lcl.blue("[Info]"), `Started server on port`, lcl.green(`${port}`));
