const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.TMDBAPIKey);
const downloadImages = require('../../../bin/downloadTMDBImage');

async function plexEpisode(data) {
    // formatting data to make it easier to use
}