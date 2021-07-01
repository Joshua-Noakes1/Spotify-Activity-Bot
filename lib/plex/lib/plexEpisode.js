require('dotenv').config();
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.moviedb_API1);
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadTmdb = require('../../../bin/downloadTMDBImage');
const downloadTautulli = require('../../../bin/downloadTautulliImage');

async function plexEpisode(res, tautulli, next) {
    // formatting data to make it easier to use
    var data = {
        "id": await cacheID.getIDFromCache(),
        "name": tautulli.media.playback.name,
        "tagline": tautulli.media.playback.tagline,
        "episode": {
            "name": tautulli.media.playback.episodeName,
            "seasonNumber": tautulli.media.playback.seasonNumber,
            "episodeNumber": tautulli.media.playback.episodeNumber
        },
        "tmdb": {
            "tmdbID": tautulli.media.tmdbID != '' ? `${tautulli.media.tmdbID}` : '000000',
            "usingTmdb": tautulli.media.tmdbID != '' ? true : false
        },
        "images": {
            "poster": '',
            "background": ''
        },
        "cache": {
            "id": '',
            "name": tautulli.media.playback.name,
            "imageName": '',
            "mediaType": 'episode',
            "episode": {
                "name": tautulli.media.playback.episodeName,
                "seasonNumber": tautulli.media.playback.seasonNumber,
                "episodeNumber": tautulli.media.playback.episodeNumber
            }
        }
    }

    // adding id and tmdb data to data.cache 
    data.cache.id = data.id;
    data.cache.imageName = `image-${data.id}.png`;
    if (data.tmdb.usingTmdb == true) {
        data.cache.tmdb = {
            "data.cache.tmdb.tmdbID": data.tmdb.tmdbID,
            "data.cache.tmdb.tmdbURL": `https://www.themoviedb.org/tv/${data.tmdb.tmdbID}/season/${data.episode.seasonNumber}/episode/${data.episode.episodeNumber}`
        }
    }

    // download poster from Tautulli 
    data.images.poster = await downloadTautulli.downloadTautulliImage(tautulli.media.playback.posterURL);

    // if tmdb is true we try and get info on the episode and show
    if (data.tmdb.usingTmdb == true) {
        var tmdbShow = await moviedb.tvInfo(data.tmdb.tmdbID).catch((e) => {
            const error = new Error("❌ Failed to contect the TMDB API ❌");
            error.status = 500;
            next(error);
            return;
        });

        var tmdbEpisode = await moviedb.tvInfo({
            id: data.tmdb.tmdbID,
            append_to_response: `season/${data.episode.seasonNumber}/episode/${data.episode.episodeNumber}`
        }).catch((e) => {
            const error = new Error("❌ Failed to contect the TMDB API ❌");
            error.status = 500;
            next(error);
            return;
        });
    }

    return res.status(200).json({
        "success": true,
        "message": `Generated image for "${data.id}" - "${data.name}"`
    });
}

module.exports = {
    plexEpisode
};