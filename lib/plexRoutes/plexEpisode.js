const clc = require('cli-color');
const path = require('path');
const {
    MovieDb
} = require('moviedb-promise');
const {
    existsSync
} = require('fs');
const {
    getID
} = require('../../cache/lib/cacheID');
const {
    downloadImage
} = require('../../bin/downloadImage');
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);
const moviedb = new MovieDb(config.movieDB);


async function plexEpisode(res, tautulli, next) {
    console.log(clc.blue('[Info]'), `New episode card request`);

    // format plex data
    var data = {
        "id": await getID({
            "name": tautulli.media.playback.name,
            "season": tautulli.media.playback.season || '0',
            "episode": tautulli.media.playback.episode || '0'
        }),
        "name": tautulli.media.playback.name,
        "tagline": `Season: ${tautulli.media.playback.season} Episode: ${tautulli.media.playback.episode}`,
        "summary": tautulli.media.playback.summary,
        "season": tautulli.media.playback.season,
        "episode": tautulli.media.playback.episode,
        "plexURL": tautulli.media.playback.plexURL,
        "tmdbID": tautulli.media.tmdbID != '' ? tautulli.media.tmdbID : '000000',
        "images": {
            "poster": tautulli.media.playback.posterURL,
            "background": ''
        }
    }

    // check if image exists
    if (!existsSync(path.join(__dirname, '../', '../', 'static', 'images', `image-${data.id}.png`))) {
        // download tautulli poster
        data.images.poster = await downloadImage(data.images.poster, 'Tautulli');

        // see if we can use tmdb
        if (data.tmdbID != '000000') {
            var tmdbSuccess = true;

            // get show and episode info from tmdb
            var tmdbEpisode;
            var tmdbShow;
            await moviedb.tvInfo({
                id: data.tmdbID,
                append_to_response: 'season/' + data.season,
            }).then((tmdb) => {
                tmdbShow = tmdb;
                tmdbEpisode = tmdb[`season/${data.season}`].episodes[data.episode - 1];
            }).catch((err) => {
                var tmdbSuccess = false;
                console.log(clc.red('[Fail]'), `Failed to grab TMDB info for "${data.name} - Season ${data.season} Episode ${data.episode}"`);
                console.log(err);
            });

            // only continue if getting data from tmdb was a success
            if (tmdbSuccess) {
                console.log({"show":tmdbShow,"episode": tmdbEpisode});
            }
        }
    }

    console.log(data);
    res.send("Hello!");
}

module.exports = {
    plexEpisode
}