const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.TMDBAPIKey);
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadImages = require('../../../bin/downloadTMDBImage');

async function plexEpisode(tautulli) {
    // formatting data to make it easier to use
    var data = {
        "id": await cacheID.getIDFromCache(),
    }
}