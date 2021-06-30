const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.TMDBAPIKey);
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadTmdb = require('../../../bin/downloadTMDBImage');
const downloadTautulli = require('../../../bin/downloadTautulliImage');

async function plexEpisode(tautulli) {
    // formatting data to make it easier to use
    var data = {
        "id": await cacheID.getIDFromCache(),
        "name": tautulli.media.playback.name,
        "tagline": '',
        "episode": {
            "name": '',
            "episodeNumber": '',
            "seasonNumber": ''
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
                "episodeNumber": tautulli.media.playback.episodeNumber,
                "seasonNumber": tautulli.media.playback.seasonNumber,
            }
        }
    }

    // adding id and tmdb data to data.cache 
    data.cache.id = data.id;
    data.cache.imageName = `image-${data.id}.png`;


    
    // download poster from Tautulli 
    data.images.poster = await downloadTautulli.downloadTautulliImage(tautulli.media.playback.posterURL);
}