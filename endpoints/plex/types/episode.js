const fetch = require('node-fetch');
const errorMsg = require('../../helper/error');
const image = require('./helper/image');
const media = require('../../helper/media');
const tweet = require('../../helper/tweet');
const date = require('../../helper/date');
// const fs = require('fs');

async function plexEpisode(req, res, data) {
    // get date and time
    var currentTime = await date.getDate();

    // get data from tmdb
    var tmdb = await fetch(`https://api.tmdb.org/3/tv/${data.tmdb_id}/season/${data.season}/episode/${data.episode}?api_key=${process.env.TMDBAPIKey}`)

    var tmdb_main = await fetch(`https://api.tmdb.org/3/tv/${data.tmdb_id}?api_key=${process.env.TMDBAPIKey}`)
    tmdb_main = await tmdb_main.json();

    try {
        // get the json from tmdb
        tmdb = await tmdb.json();

        // check if it was successful
        if (!tmdb.success) {
            // plex metadata typically isnt the fastest so we're going to replace the title with the tmdb one 
            data.episode_name = tmdb.name;

            // download image from tmdb if it exists
            if (tmdb.still_path) {
                data.image.tmdb.url = `https://image.tmdb.org/t/p/original/${tmdb.still_path}`; // 'https://i.imgur.com/mIovtAb.png' // placehold mayumi background
                data.image.tmdb.buffer = await fetch(data.image.tmdb.url);
                data.image.tmdb.buffer = await data.image.tmdb.buffer.buffer();

                data.image.tmdb2.url = `https://image.tmdb.org/t/p/original/${tmdb_main.poster_path}`; // 'https://www.themoviedb.org/t/p/original/yriQ3nib4eJyHBviaw7nm5hzIpO.jpg' // placeholder pbdc poster
                data.image.tmdb2.buffer = await fetch(data.image.tmdb2.url);
                data.image.tmdb2.buffer = await data.image.tmdb2.buffer.buffer();
            }
        }
    } catch (error) {
        errorMsg.errorMessage(error, res, 415);
    }

    var imgData = {
        "tmdb_id": data.tmdb_id,
        "name": tmdb_main.name,
        "tagline": `Season ${data.season} Episode ${data.episode} - ${tmdb.name}`,
        "image": {
            "background": data.image.tmdb.buffer,
            "poster": data.image.tmdb2.buffer
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
        "status": `Joshua started watching ${data.show_name} - Season ${data.season} Episode ${data.episode} - "${data.episode_name}" on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
        "media": twitter_media.media_id_string
    }, res);

    // save image
    // fs.writeFileSync('./image-out.png', bufferImg);

    // success
    res.status(200).end();
}

module.exports = {
    plexEpisode
}