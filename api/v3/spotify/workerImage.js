const express = require("express"),
    workerCon = require('../../../lib/pool/controller');

// global express router
const router = express.Router();


// Api routes
router.get("/", function (req, res) {
    return res.status(404).json({
        success: false,
        message: "Image not found."
    });
});
router.get("/:id.png", async function (req, res) {
    let workerPool = null;
    workerPool = workerCon.get();
    result = await workerPool.provideImage(req.params.id, res);
    console.log(result);
    if (result.success) {
        res.contentType("image/png");
        res.header("Cache-Control", "public, max-age=31536000");
        res.header("Last-Modified", result.stats.mtime);
        return res.send(result.image);
    } else {
        return res.status(404).json({
            success: false,
            message: "Image not found."
        });
    }
});


module.exports = router;