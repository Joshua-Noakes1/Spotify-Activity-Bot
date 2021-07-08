require('dotenv').config();
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.moviedb_API);
const fs = require('fs');
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadTmdb = require('../../../bin/downloadTMDBImage');
const downloadTautulli = require('../../../bin/downloadTautulliImage');
const downloadFlag = require('../../../bin/downloadFlag');
const createImage = require('../../images/lib/makeImage');

/**
 * 
 * @param {Object} res - Object
 * @param {Object} tautulli - Object
 * @param {Object} next - Object
 * @returns {Object} Response to client
 */
async function plexMovie(res, tautulli, next) {
    // formatting data to make it easier to use
    var data = {
        "id": await cacheID.getIDFromCache({
            "type": 'movie',
            "name": tautulli.media.playback.name,
        }),
        "name": tautulli.media.playback.name,
        "tagline": tautulli.media.playback.tagline,
        "latestImage": `${tautulli.media.playback.name} - Season ${tautulli.media.playback.seasonNumber} Episode ${tautulli.media.playback.episodeNumber}`,
        "region": 'EN',
        "tmdb": {
            "tmdbID": tautulli.media.tmdbID != '' ? `${tautulli.media.tmdbID}` : '000000',
            "usingTmdb": tautulli.media.tmdbID != '' ? true : false
        },
        "images": {
            "poster": '',
            "background": '',
            "flag": ''
        }
    }
};

module.exports = {
    plexMovie
};