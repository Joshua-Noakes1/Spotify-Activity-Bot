const path = require("path"),
    express = require("express");

// global express router
const router = express.Router();

// Api routes
router.use("/", express.static(path.join(__dirname, "../", "../", "../", "data", "images"), {cacheControl: true, etag: true, lastModified: true, maxAge: 25200000}));

module.exports = router;