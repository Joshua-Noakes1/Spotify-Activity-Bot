const
    lcl = require("cli-color"),
    path = require("path"),
    express = require("express"),
    {
        readFileSync,
        existsSync,
        statSync
    } = require("fs");
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
    if (existsSync(path.join(__dirname, "../", "../", "../", "data", "images", `${req.params.id}.png`))) {
        console.log(lcl.blue("[Image - Info]"), `Found image "${req.params.id}", sending...`);
        var image = await readFileSync(path.join(__dirname, "../", "../", "../", "data", "images", `${req.params.id}.png`));
        var imageStats = await statSync(path.join(__dirname, "../", "../", "../", "data", "images", `${req.params.id}.png`));

        // send image
        res.contentType("image/png");
        res.header("Cache-Control", "public, max-age=31536000");
        res.header("Last-Modified", imageStats.mtime);
        return res.send(image);
    } else {
        console.log(lcl.yellow("[Image - Warn]"), `Image not found "${req.params.id}"`);
        return res.status(404).json({success: false, message: "Image not found."});
    }
});


module.exports = router;