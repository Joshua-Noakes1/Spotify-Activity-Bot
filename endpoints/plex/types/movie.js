const fetch = require('node-fetch');
const errorMsg = require('../../helper/error');
const image = require('./helper/image.js');
const media = require('../../helper/media');
const tweet = require('../../helper/tweet');
const date = require('../../helper/date');
const fs = require('fs');

async function plexMovie(req, res, plexData) {
    // get date and time
    var currentTime = await date.getDate();

    // local movie formated data
    var data = {
        "name": plexData.episode_name || 'Example',
        "tagline": plexData.tagline,
        "id": plexData.tmdb_id || '000000',
        "isTmdb": plexData.tmdb_id != '' ? 'true' : 'false',
        "image": {
            "poster": '',
            "background": ''
        }
    }

    // download plex poster and store its buffer
    await fetch(plexData.tautulli_poster_url).then(async (tautulliPoster) => {
        data.image.poster = await tautulliPoster.buffer();
    }).catch((error) => {
        errorMsg.errorMessage(error, res);
        return;
    });

    // only request tmdb if we have an id
    if (data.isTmdb == 'true') {
        // download tmdb data
        var tmdb = await fetch(`https://api.tmdb.org/3/movie/${data.id}?api_key=${process.env.TMDBAPIKey}`).catch((error) => {
            errorMsg.errorMessage(error, res);
            return;
        });

        try {
            // get json from tmdb
            tmdb = await tmdb.json();

            if (!tmdb.success) {
                // plex metadata isnt the fastest so if it doesnt equal whats in plex or is shorter then it then we replace with the tmdb one
                data.name = tmdb.title;

                // if tmdb tagline exists we're going to replace the plex one
                if (tmdb.tagline != '') {
                    data.tagline = tmdb.tagline;
                }

                // if the backdrop path for an movie exists then we download it
                if (tmdb.backdrop_path) {
                    data.image.background = await fetch(`https://image.tmdb.org/t/p/original/${tmdb.backdrop_path}`);
                    data.image.background = await data.image.background.buffer();
                }

                // if poster for movie exists then we download it 
                if (tmdb.poster_path) {
                    data.image.poster = await fetch(`https://image.tmdb.org/t/p/original/${tmdb.poster_path}`);
                    data.image.poster = await data.image.poster.buffer();
                }
            }

        } catch (error) {
            errorMsg.errorMessage(error, res);
            return;
        }
    }

    // make image json
    var mkImg = {
        "id": data.id,
        "name": data.name,
        "tagline": data.tagline,
        "image": data.image
    }

    var genImg = await image.createImage(mkImg);

    // // uploading image to twitter 
    // var twitter_media = await media.uploadMedia({
    //     "main": bufferImg,
    //     "backup": data.image.tautulli.buffer,
    // }, res);

    // // tweeting
    // tweet.sendTweet({
    //     "status": `Joshua started watching "${imgData.name}" on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
    //     "media": twitter_media.media_id_string
    // }, res);

    // save image
    fs.writeFileSync('./ImgTesting/image-out.png', genImg);

    res.status(200).end();

    return;
}



module.exports = {
    plexMovie
}