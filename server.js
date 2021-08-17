require('dotenv').config();
const http = require('http');
const app = require('./app');


// defaults to port 3000 if no port can be found
const port = process.env.port || 3000;

// create server
const server = http.createServer(app);
server.listen(port);

console.log(`🚀 Started server on port ${port} 🚀`);