const lcl = require('cli-color'),
    fetch = require('node-fetch'),
    path = require('path'),
    createImage = require('../../../lib/canvas/createImage'),
    express = require('express'),
    {
        readFileSync,
        writeFileSync,
        existsSync
    } = require('fs'),
    {
        getPreview
    } = require('spotify-url-info')(fetch);

// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    res.status(400).json({
        success: false,
        message: 'This endpoint only supports POST requests.'
    });
});
router.post('/', async function (req, res) {
    if (existsSync(path.join(__dirname, '../', '../', '../', 'data', 'images', `${req.body.trackId}.png`))) {
        console.log(lcl.blue('[Image - Info]'), "Image already exists, sending...");
        var localImage = await readFileSync(path.join(__dirname, '../', '../', '../', 'data', 'images', `${req.body.trackId}.png`));
        res.contentType('image/png');
        return res.send(localImage);
    }

    // get song from spotify api
    var song;
    try {
        song = await getPreview(`https://open.spotify.com/track/${req.body.trackId}`, {
            // came from the official spotify 1.185 windows app
            headers: {
                "sec-ch-ua": "\"Chromium\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Referer": "https://spotify.com/"
            }
        });
    } catch (err) {
        console.log(lcl.red('[Spotify - Playback]'), "Error getting song preview:", err);
        return res.status(500).json({
            success: false,
            message: "Error getting song preview."
        });
    }

    console.log(lcl.blue("[Spotify - Info]"), `Creating image for "${song.title}" by ${song.artist}`);

    // create image
    const image = await createImage(song);

     // write image to file
     writeFileSync(path.join(__dirname, '../', '../', '../', 'data', 'images', `${req.body.trackId}.png`), image.image);

    res.contentType('image/png');
    res.send(image.image);

    // return res.status(200).json({
    //     success: true,
    //     message: "Image created!",
    //     url: "https://example.com"
    // });
});

module.exports = router;