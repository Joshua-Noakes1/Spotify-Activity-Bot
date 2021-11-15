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
    updateCache
} = require('../../cache/saveCache');
const {
    existsSync,
    readFileSync
} = require('fs');
const {
    getID
} = require('../../cache/cacheID');
const {
    createImage
} = require('../../images/createSpotifyImage');
const {
    postTweet
} = require('../../../bin/twitter/postTweet');
const {
    dateTime
} = require('../../../bin/dateTime');
const {
    downloadImage
} = require('../../../bin/downloadImage');
const config = readJSON(path.join(__dirname, '../', '../', '../', 'config', 'config.json'), true);

async function spotify(res, req, iftttData) {
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

    // check if image exists
    if (!existsSync(path.join(__dirname, '../', '../', '../', 'static', 'images', `image-${data.id}.png`))) {
        console.log(clc.blue('[Info]'), `New spotify card request (${data.title} (${data.id}))`);

        // download album art
        data.images.album = await downloadImage(data.images.album, "Spotify");

        var mediaCard = await createImage(data);

        if (config.twitter.useTwitter == true) {
            var currentTime = await dateTime();
            // attempt to post
            await postTweet({
                "status": `${config.twitter.user != "" ? config.twitter.user : "Local"} played "${data.title != "" ? data.title : ""}" by ${data.artist != "" ? data.artist : ""} on ${currentTime.month} ${currentTime.date}${currentTime.ordinals}, at ${iftttDateTime.time}`,
                "media": mediaCard
            });
        }

        res.send({
            success: true,
            "id": data.id,
            "imageURL": `http://${req.get('host')}/static/images/image-${data.id}.png`
        });
    } else {
        console.log(clc.blue('[Info]'), `Image already exists (${data.title} (${data.id}))`);

        // load image buffer
        var mediaCard = readFileSync(path.join(__dirname, '../', '../', '../', 'static', 'images', `image-${data.id}.png`));

        if (config.twitter.useTwitter == true) {
            console.log(iftttData.time);
            // attempt to post
            await postTweet({
                "status": `${config.twitter.user != "" ? config.twitter.user : "Local"} played "${data.title != "" ? data.title : ""}" by ${data.artist != "" ? data.artist : ""} on ${iftttData.time}`,
                "media": mediaCard
            });
        }

        // update cache
        await updateCache(data);

        res.send({
            success: true,
            "id": data.id,
            "imageURL": `http://${req.get('host')}/static/images/image-${data.id}.png`
        });
    }
}

module.exports = {
    spotify
}
