const path = require("path"),
    express = require("express"),
    {
        existsSync
    } = require("fs"),
    {
        readJSON
    } = require("../lib/readWrite");

// global express router
const router = express.Router();

// Api routes
router.get("/", async function (req, res) {
    var data = await readJSON(path.join(__dirname, "../data/songs.json"), true);
    data.data = data.data.reverse();
    return res.status(200).render("home/index.ejs", data);
});

router.get("/song/:id", async function (req, res) {
    var song = await existsSync(path.join(__dirname, "../", "data", "images", `${req.params.id}.png`));
    if (song) {
        return res.render("card/card.ejs", {songID: req.params.id});
        // return res.sendFile(path.join(__dirname, "../", "data", "images", `${req.params.id}.png`));
    } else {
        return res.status(404).json({
            status: false,
            message: "Song not found."
        });
    }
});

router.get("/settings", function (req, res) {
    return res.status(200).render("settings/settings.ejs");
});

// Favicon 
router.get("/favicon.ico", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "favicon.ico"));
});
router.get("/favicon-16x16.png", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "favicon-16x16.png"));
});
router.get("/favicon-32x32.png", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "favicon-32x32.png"));
});
router.get("/apple-touch-icon.png", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "apple-touch-icon.png"));
});
router.get("/android-chrome-192x192.png", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "android-chrome-192x192.png"));
});
router.get("/android-chrome-512x512.png", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "android-chrome-512x512.png"));
});
router.get("/site.webmanifest", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "site.webmanifest"));
});
router.get("/static/bootswatch.css", function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../", "static", "css", "bootstrap.min.css"));
});
module.exports = router;