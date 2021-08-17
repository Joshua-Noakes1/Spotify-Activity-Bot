require('dotenv').config();
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.moviedb_API);
const fs = require('fs');
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadTmdb = require('../../../bin/downloadTMDBImage');
const downloadTautulli = require('../../../bin/downloadTautulliImage');
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
            "name": tautulli.media.playback.episodeName,
        }),
        "name": tautulli.media.playback.episodeName,
        "tagline": tautulli.media.playback.tagline,
        "latestImage": `${tautulli.media.playback.episodeName}`,
        "region": 'EN',
        "plexURL": tautulli.media.playback.plexURL,
        "tmdb": {
            "tmdbID": tautulli.media.tmdbID != '' ? `${tautulli.media.tmdbID}` : '000000',
            "usingTmdb": tautulli.media.tmdbID != '' ? true : false
        },
        "images": {
            "poster": '',
            "background": ''
        }
    }

    // console logging that we have a new request
    console.log(`[Info] New request for "${data.name}" (${data.id})`);

    // checking if image exists 
    var imgExist = fs.existsSync(`./lib/images/cache/image-${data.id}.png`) ? true : false;

    // make image only if one doesnt already exist
    if (imgExist == false) {
        // download poster from Tautulli 
        data.images.poster = await downloadTautulli.downloadTautulliImage(tautulli.media.playback.posterURL);
    }

    // if tmdb is true we try and get info on the episode and show
    if (data.tmdb.usingTmdb == true) {
        // check to see if we get an error from tmdb
        var tmdbSuccess = true;

        // get movie info
        var tmdbMovie;
        await moviedb.movieInfo({
            id: data.tmdb.tmdbID,
            language: 'en'
        }).then((tmdbMovies) => {
            tmdbMovie = tmdbMovies;
        }).catch((e) => {
            // catch errors
            tmdbSuccess = false;
            console.error(`[Error] Failed to grab info for "${data.name}" from TMDB`);
            if (process.env.dev == 'true') console.log(e);
        });

        if (tmdbSuccess == true) {
            // plex metadata isnt the fastest to we are going to replace the show name with the tmdb one
            if (tmdbMovie.name != null && tmdbMovie.name != '') {
                data.name = tmdbMovie.name;
            }

            // downloading the poster and background
            if (tmdbMovie.poster_path != null && tmdbMovie.poster_path != '') {
                data.images.poster = await downloadTmdb.downloadTMDBImage(tmdbMovie.poster_path);
            }
            
            if (tmdbMovie.backdrop_path != null && tmdbMovie.backdrop_path != '') {
                data.images.background = await downloadTmdb.downloadTMDBImage(tmdbMovie.backdrop_path);
            }

            if (tmdbMovie.tagline != null && tmdbMovie.tagline != '') {
                data.tagline = tmdbMovie.tagline;
            }
        }
    }

    // cache data
    var cacheData = {
        "id": data.id,
        "name": data.name,
        "tagline": data.tagline,
        "overview": data.overview,
        "imageName": `image-${data.id}.png`,
        "latestImage": data.latestImage,
        "region": data.region,
        "plexURL": data.plexURL,
        "mediaType": 'movie',
        "timestamp": `${Math.floor(Date.now() / 1000)}`,
        "origin": {
            "name": tautulli.media.playback.episodeName,
        }
    }
    // add tmdb to cache
    if (data.tmdb.usingTmdb == true) {
        cacheData.tmdb = {
            "tmdbID": data.tmdb.tmdbID,
            "tmdbURL": `https://www.themoviedb.org/movie/${data.tmdb.tmdbID}`
        }
    }

    // generating image
    await createImage.createImage({
        "id": data.id,
        "name": data.name,
        "image": data.images,
        "tagline": data.tagline
    }, cacheData);

    return res.status(200).json({
        "success": true,
        "message": `Generated image for "${data.id}" - "${data.name}"`
    });
};

module.exports = {
    plexMovie
};