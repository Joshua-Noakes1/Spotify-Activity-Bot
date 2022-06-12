const lcl = require('cli-color'),
    fetch = require('node-fetch'),
    path = require('path'),
    createImage = require('../../../lib/canvas/createImage'),
    express = require('express'),
    {
        readJSON,
        writeJSON
    } = require('../../../lib/readWrite'),
    {
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
    res.status(405).json({
        success: false,
        message: 'This endpoint only supports POST requests.'
    });
});
router.post('/', async function (req, res) {
    // send already made images
    if (existsSync(path.join(__dirname, '../', '../', '../', 'data', 'images', `${req.body.trackId}.png`))) {
        console.log(lcl.blue('[Image - Info]'), "Image already exists, sending...");
        return res.status(200).json({
            success: true,
            url: '/api/v3/spotify/image/' + req.body.trackId
        });
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

    // save song info to file
    var songJson = await readJSON(path.join(__dirname, '../', '../', '../', 'data', 'songs.json'));
    if (!songJson.success) var songJson = {
        success: true,
        data: []
    };
    songJson.data.push({
        id: req.body.trackId,
        title: song.title,
        artist: song.artist
    });
    await writeJSON(path.join(__dirname, '../', '../', '../', 'data', 'songs.json'), songJson);

    return res.status(200).json({
        success: true,
        url: '/api/v3/spotify/image/' + req.body.trackId
    });
});

module.exports = router;