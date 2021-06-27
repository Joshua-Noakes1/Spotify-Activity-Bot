const fetch = require("node-fetch");
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.TMDBAPIKey);
const dateTime = require("../helper/date");
const error = require("../helper/error");
const image = require("../../image/image");
const cache = require('../../image/cache/cache');
const twtMedia = require("../helper/media");
const twtTweet = require("../helper/tweet");

async function plexMovie(req, res, plexData) {
    // we get the current date and time from dateTime
    var time = await dateTime.getDate();

    // formatting plex data so its easier to use
    var movieData = {
        "id": await cache.returnID({
            "name": req.body.media.playback.name,
            "type": req.body.media.type,
        }),
        "name": `${req.body.media.playback.name}`,
        "type": `${req.body.media.type}`,
        "tagline": `${plexData.media.playback.tagline}`,
        "tmdb": {
            "tmdbID": `${req.body.media.tmdbID}` || '000000',
            "isTmdb": req.body.media.tmdbID != "" ? true : false,
        },
        "images": {
            "poster": "",
            "background": "",
        },
    };

    // // download plex poster and store its buffer (This needs images to be enabled with a third party)
    await fetch(plexData.media.playback.posterURL)
        .then(async (tautulliPoster) => {
            movieData.images.poster = await tautulliPoster.buffer();
        })
        .catch((e) => {
            error.errorMessage(e, res);
            return;
        });

    // only request tmdb if we have an id
    if (movieData.tmdb.isTmdb == true) {
        // download tmdb data
        var tmdbMovie = await moviedb.movieInfo(movieData.tmdb.tmdbID)
            .catch((e) => {
                error.errorMessage(e, res);
            });
    }

    //    // get movie data
    try {
        if (tmdbMovie.title) {
            // plex metadata isnt the fastest so if it doesnt equal whats in plex or is shorter then it then we replace with the tmdb one
            movieData.name = tmdbMovie.title;
        }

        // if tmdb tagline exists we're going to replace the plex one
        if (tmdbMovie.tagline != '') {
            movieData.tagline = tmdbMovie.tagline;
        }

        // if the backdrop path for an movie exists then we download it
        if (tmdbMovie.backdrop_path) {
            await fetch(`https://image.tmdb.org/t/p/original/${tmdbMovie.backdrop_path}`).then(async (background) => {
                movieData.images.background = await background.buffer();
            }).catch((e) => {
                error.errorMessage(e, res);
                return;
            });
        }

        // if poster for movie exists then we download it 
        if (tmdbMovie.poster_path) {
            await fetch(`https://image.tmdb.org/t/p/original/${tmdbMovie.poster_path}`).then(async (poster) => {
                movieData.images.poster = await poster.buffer();
            }).catch((e) => {
                error.errorMessage(e, res);
                return;
            });
        }
    } catch (e) {
        error.errorMessage(e, res);
        return;
    }

    // cache JSON
    var cacheJSON = {
        "id": `${movieData.id}`,
        "name": `${movieData.name}`,
        "imageName": `image-${movieData.id}.png`,
        "FileSystemURL": `cache/image-${movieData.id}.png`,
        "mediaType": `${movieData.type}`

    }
    if (movieData.tmdb.isTmdb == true) cacheJSON.tmdbURL = `https://www.themoviedb.org/movie/${movieData.tmdb.tmdbID}`

    // make image json
    var movieImage = await image.createImage({
        "id": `${movieData.id}`,
        "type": {
            "media": movieData.type,
            "from": 'plex'
        },
        "name": {
            "showName": movieData.name
        },
        "tagline": `${movieData.tagline}`,
        "tmdb": {
            "tmdbID": movieData.tmdb.tmdbID,
            "isTmdb": movieData.tmdb.isTmdb
        },
        "image": movieData.images,
        "cache": cacheJSON
    });

    // // // uploading image to twitter 
    // // var twitter_media = await media.uploadMedia({
    // //     "main": bufferImg,
    // //     "backup": data.image.tautulli.buffer,
    // // }, res);

    // // // tweeting
    // // tweet.sendTweet({
    // //     "status": `Joshua started watching "${imgData.name}" on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
    // //     "media": twitter_media.media_id_string
    // // }, res);

    // // save image
    // fs.writeFileSync('./ImgTesting/image-out.png', genImg);

    res.status(200).end();

    return;
}



module.exports = {
    plexMovie
}