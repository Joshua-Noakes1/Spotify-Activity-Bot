const lcl = require('cli-color'),
    fetch = require('node-fetch'),
    createImage = require('../../../lib/canvas/createImage'),
    express = require('express'),
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
    // get song from spotify api
    var song;
    try {
        song = await getPreview(`https://open.spotify.com/track/${req.body.trackId}`);
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

    res.contentType('image/png');
    res.send(image.image);

    // return res.status(200).json({
    //     success: true,
    //     message: "Image created!",
    //     url: "https://example.com"
    // });
});

module.exports = router;