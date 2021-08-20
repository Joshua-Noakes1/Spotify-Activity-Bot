require('dotenv').config();
const clc = require('cli-color');
const http = require('http');
const app = require('./app');

// defaults to port 3000 if no port can be found
const PORT = process.env.PORT || 3000;

// create server
const server = http.createServer(app);
server.listen(PORT);

console.log(clc.blue('[Info]'), `Started server on port`, clc.green(`${PORT}`),);