const clc = require('cli-color');
const path = require('path');
const {
    MovieDb
} = require('moviedb-promise');
const {
    existsSync,
    readFileSync
} = require('fs');
const {
    getID
} = require('../../cache/cacheID');
const {
    downloadImage
} = require('../../../bin/downloadImage');
const {
    createImage
} = require('../../images/createPlexImage');
const {
    postTweet
} = require('../../../bin/twitter/postTweet');
const {
    dateTime
} = require('../../../bin/dateTime');
const {
    readJSON,
    saveJSON
} = require('../../../bin/readWrite');
const {
    updateCache
} = require('../../cache/saveCache');
const config = readJSON(path.join(__dirname, '../', '../', '../', 'config', 'config.json'), true);
const moviedb = new MovieDb(config.movieDB);


async function plexEpisode(res, req, tautulli) {
    // format plex data
    var data = {
        "id": await getID({
            "name": tautulli.media.playback.name,
            "type": 'episode',
            "season": tautulli.media.playback.season || '0',
            "episode": tautulli.media.playback.episode || '0'
        }),
        "name": tautulli.media.playback.name,
        "tagline": `Season: ${tautulli.media.playback.season} Episode: ${tautulli.media.playback.episode} - '${tautulli.media.playback.title}'`,
        "summary": tautulli.media.playback.summary,
        "season": tautulli.media.playback.season,
        "episode": tautulli.media.playback.episode,
        "tmdbID": tautulli.media.tmdbID != '' ? tautulli.media.tmdbID : '000000',
        "URL": {
            "plex": tautulli.media.playback.plexURL,
            "tmdb": tautulli.media.tmdbID != '' ? `https://www.themoviedb.org/tv/${tautulli.media.tmdbID}/season/${tautulli.media.playback.season}/episode/${tautulli.media.playback.episode}` : '',
        },
        "images": {
            "poster": tautulli.media.playback.posterURL,
            "background": ''
        }
    }

    console.log(clc.blue('[Info]'), `New episode card request (${data.name} - Season ${data.season} Episode ${data.episode} (${data.id}))`);

    // check if image exists
    if (!existsSync(path.join(__dirname, '../', '../', '../', 'static', 'images', `image-${data.id}.png`))) {
        // download tautulli poster
        data.images.poster = await downloadImage(data.images.poster, 'Tautulli');

        // see if we can use tmdb
        if (data.tmdbID != '000000') {
            var tmdbSuccess = true;

            // get show and episode info from tmdb
            var tmdb = {
                "show": {},
                "episode": {}
            }
            await moviedb.tvInfo({
                id: data.tmdbID,
                append_to_response: 'season/' + data.season,
            }).then((tmdbData) => {
                tmdb.show = tmdbData;
                tmdb.episode = tmdbData[`season/${data.season}`].episodes[data.episode - 1];
            }).catch((err) => {
                tmdbSuccess = false;
                console.log(clc.red('[Fail]'), `Failed to grab TMDB info for "${data.name} - Season ${data.season} Episode ${data.episode}"`);
                console.log(err);
            });

            // only continue if getting data from tmdb was a success
            if (tmdbSuccess) {
                // download tmdb poster and background
                if (tmdb.show.poster_path != null) {
                    data.images.poster = await downloadImage(`https://image.tmdb.org/t/p/original${tmdb.show.poster_path}`, "TMDB");
                }
                if (tmdb.episode.still_path != null) {
                    data.images.background = await downloadImage(`https://image.tmdb.org/t/p/original${tmdb.episode.still_path}`, "TMDB");
                }

                // use TMDBs overview
                if (tmdb.episode.overview != '') {
                    data.summary = tmdb.episode.overview;
                }

                // use tmdb title for tagline
                data.tagline = `Season: ${tautulli.media.playback.season} Episode: ${tautulli.media.playback.episode} - '${tmdb.episode.name}'`;
            }
        }

        // create image
        var mediaCard = await createImage(data);

        if (config.twitter.useTwitter == true) {
            var currentTime = await dateTime();
            // attempt to post
            await postTweet({
                "status": `${config.twitter.user != "" ? config.twitter.user : "Local"} started watching ${data.name != "" ? data.name : ""} - ${data.tagline != "" ? data.tagline : ""} on ${currentTime.month} ${currentTime.date}${currentTime.ordinals}, at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
                "media": mediaCard
            });
        }

        return res.send({
            success: true,
            "id": data.id,
            "imageURL": `http://${req.get('host')}/static/images/image-${data.id}.png`
        });
    } else {
        console.log(clc.blue('[Info]'), `Image already exists (${data.name} - Season ${data.season} Episode ${data.episode} (${data.id}))`);

        // load image buffer
        var mediaCard = readFileSync(path.join(__dirname, '../', '../', '../', 'static', 'images', `image-${data.id}.png`));

        if (config.twitter.useTwitter == true) {
            var currentTime = await dateTime();
            // attempt to post
            await postTweet({
                "status": `${config.twitter.user != "" ? config.twitter.user : "Local"} started watching ${data.name != "" ? data.name : ""} - ${data.tagline != "" ? data.tagline : ""} on ${currentTime.month} ${currentTime.date}${currentTime.ordinals}, at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
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
    plexEpisode
}