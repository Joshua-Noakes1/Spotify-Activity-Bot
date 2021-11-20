const lcl = require("cli-color");
const fs = require("fs");
const path = require("path");
const { readJSON } = require("../bin/readWrite");

function socketio(http) {
  const io = require("socket.io")(http);

  // log new socketio connection
  io.on("connection", function (client) {
    console.log(
      lcl.blue("[Info]"),
      `New socketio connection (ID: "${client.id}" IP: "${client.handshake.address}")`
    );
  });

  // check for updated cache.json
  fs.watchFile(path.join(__dirname, "../", "cache", "cache.json"), function () {
    const cache = readJSON(
      path.join(__dirname, "../", "cache", "cache.json"),
      true
    );

    // send client new image
    io.emit("fileChanged", cache.images[cache.images.length - 1]);
  });
}

module.exports = { socketio };
