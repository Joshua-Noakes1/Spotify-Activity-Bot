const clc = require('cli-color');
const path = require('path');
const {
    getPreview
} = require('spotify-url-info');
const {
    readJSON,
    saveJSON
} = require('../../../bin/readWrite');
const {
    getID
} = require('../../../cache/lib/cacheID');
const {
    createImage
} = require('../../images/createSpotifyImage');
const {
    downloadImage
} = require('../../../bin/downloadImage');

async function spotify(res, req, iftttData) {
    var iftttData = readJSON(path.join(__dirname, 'ifttt.json'), true);
    var spotifyData = await getPreview(`https://open.spotify.com/track/${iftttData.TrackId}`);

    var data = {
        "id": await getID({
            "name": spotifyData.title,
            "type": "music" 
        }),
        "type": "music",
        "title": spotifyData.title,
        "artist": spotifyData.artist,
        "images": {
            "album": spotifyData.image
        },
        "URL": {
            "spotify": spotifyData.link
        }
    }

    console.log(data);

    data.images.album = await downloadImage(data.images.album, "Spotify");

    await createImage({
        "id": data.id,
        "name": data.title,
        "tagline": data.artist,
        "images": {
            "poster": data.images.album
        },
        "URL": data.URL
    });

    res.send("Hello World!");
}

module.exports = {
    spotify
}