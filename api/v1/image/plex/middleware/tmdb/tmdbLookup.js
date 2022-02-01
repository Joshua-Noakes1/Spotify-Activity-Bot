require('dotenv').config();
const lcl = require('cli-color'),
    {
        MovieDb
    } = require('moviedb-promise');

const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

async function lookupTMDB(tautulli) {
    const tmdbID = tautulli.tmdbID;

    // catch missing id
    if (tmdbID === '') return {
        success: false,
        message: 'No TMDB ID found'
    };

    // try and lookup id
    try {
        console.log(lcl.blue("[Info]"), "Looking up TMDB ID:", tmdbID, `(\"${tautulli.media.name}\")`);
        switch (tautulli.media.type) {
            case 'movie':
                const movie = await moviedb.movieInfo({
                    id: tmdbID
                });
                return {
                    success: true, data: movie
                };
            case 'episode':
                const show = await moviedb.tvInfo({
                    id: tmdbID,
                    append_to_response: 'season/' + tautulli.media.season_number + '/episode/' + tautulli.media.episode_number
                });
                return {
                    success: true, data: show
                };
            default:
                return {
                    success: false, message: 'Unsupported media type'
                };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = lookupTMDB;