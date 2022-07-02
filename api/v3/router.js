const express = require("express");
// global express router
const router = express.Router();

// Api routes
router.get("/", function (req, res) {
    res.redirect(307, "https://github.com/joshua-noakes1/IRyS");
});

router.use("/spotify/playback", require("./spotify/playback"));
router.use("/spotify/image", require("./spotify/image"));
router.use("/spotify/wImage", require("./spotify/workerImage"));

module.exports = router;