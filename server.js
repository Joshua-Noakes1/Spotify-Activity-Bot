require("dotenv").config();
const lcl = require("cli-color");
const app = require("./app");
var http = require("http").Server(app);
const { setupConfig } = require("./lib/config");
const { socketio } = require("./lib/sockets");

(async () => {
  await socketio(http);
  await setupConfig();

  // defaults to port 3000 if no port can be found
  const port = process.env.port || 3000;

  // create server
  http.listen(port);

  // log server start
  console.log(
    lcl.blue("[Info]"),
    `Started server on port`,
    lcl.green(`${port}`)
  );
})();
