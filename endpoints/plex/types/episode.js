const fetch = require('node-fetch');
const errorMsg = require('../../helper/error');
const media = require('../../helper/media');
const tweet = require('../../helper/tweet');
const date = require('../../helper/date');

async function plexEpisode(req, res, data) {
    // get date and time
    var currentTime = await date.getDate();

    // get data from tmdb
    var tmdb = await fetch(`https://api.themoviedb.org/3/tv/${data.tmdb_id}/season/${data.season}/episode/${data.episode}?api_key=${process.env.TMDBAPIKey}`)

    try {
        // get the json from tmdb
        tmdb = await tmdb.json();

        // check if it was successful
        if (!tmdb.success) {
            // plex metadata typically isnt the fastest so we're going to replace the title with the tmdb one 
            data.episode_name = tmdb.name;

            // download image from tmdb if it exists
            if (tmdb.still_path) {
                data.image.tmdb.url = `https://www.themoviedb.org/t/p/original${tmdb.still_path}`;
                data.image.tmdb.buffer = await fetch(data.image.tmdb.url);
                data.image.tmdb.buffer = await data.image.tmdb.buffer.buffer();
            }
        }
    } catch (error) {
        errorMsg.errorMessage(error, res, 415);
    }

    // uploading image to twitter 
    var twitter_media = await media.uploadMedia({
        "main": data.image.tmdb.buffer,
        "backup": data.image.tautulli.buffer,
    }, res);

    // tweeting
    tweet.sendTweet({
        "status": `Joshua started watching ${data.show_name} - Season ${data.season} Episode ${data.episode} - "${data.episode_name}" on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
        "media": twitter_media.media_id_string
    }, res);

    // success
    res.status(200).end();
}

module.exports = {
    plexEpisode
}