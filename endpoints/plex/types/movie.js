const fetch = require('node-fetch');
const image = require('./helper/image.js');
const errorMsg = require('../../helper/error');
const media = require('../../helper/media');
const tweet = require('../../helper/tweet');
const date = require('../../helper/date');

async function plexMovie(req, res, data) {
    // get date and time
    var currentTime = await date.getDate();

    // download tmdb data
    var tmdb = await fetch(`https://api.tmdb.org/3/movie/${data.tmdb_id}?api_key=${process.env.TMDBAPIKey}`);
    tmdb = await tmdb.json();

    var tmdbImage = await fetch(`https://image.tmdb.org/t/p/original/${tmdb.backdrop_path}`);
    tmdbImage = await tmdbImage.buffer();

    var tmdbImage2 = await fetch(`https://image.tmdb.org/t/p/original/${tmdb.poster_path}`);
    tmdbImage2 = await tmdbImage2.buffer();

    var imgData = {
        "tmdb_id": data.tmdb_id,
        "name": tmdb.title,
        "tagline": tmdb.tagline,
        "image": {
            "background": tmdbImage,
            "poster": tmdbImage2
        }
    }

    var bufferImg = await image.createImage(imgData);

    // uploading image to twitter 
    var twitter_media = await media.uploadMedia({
        "main": bufferImg,
        "backup": data.image.tautulli.buffer,
    }, res);

    // tweeting
    tweet.sendTweet({
        "status": `Joshua started watching "${imgData.name}" on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
        "media": twitter_media.media_id_string
    }, res);


    res.status(200).end();

    return;
}



module.exports = {
    plexMovie
}