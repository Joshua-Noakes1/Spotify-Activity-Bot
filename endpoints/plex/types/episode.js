const fetch = require('node-fetch');
const errorMsg = require('../../helper/error');
const image = require('./helper/image');
const media = require('../../helper/media');
const tweet = require('../../helper/tweet');
const date = require('../../helper/date');
const fs = require('fs');

async function plexEpisode(req, res, plexData) {
    // get date and time
    var currentTime = await date.getDate();

    // local ep formated data
    var data = {
        "sh_name": plexData.show_name,
        "name": plexData.episode_name || 'Example',
        "ep_num": plexData.episode || '0',
        "sn_num": plexData.season || '0',
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
        // get show and episode data from tmdb
        var tmdbEpisode = await fetch(`https://api.tmdb.org/3/tv/${data.id}/season/${data.sn_num}/episode/${data.ep_num}?api_key=${process.env.TMDBAPIKey}`).catch((error) => {
            errorMsg.errorMessage(error, res);
            return;
        });
        var tmdbShow = await fetch(`https://api.tmdb.org/3/tv/${data.id}?api_key=${process.env.TMDBAPIKey}`).catch((error) => {
            errorMsg.errorMessage(error, res);
            return;
        });

        try {
            // get json from tmdb
            tmdbEpisode = await tmdbEpisode.json();
            tmdbShow = await tmdbShow.json();

            // check if tmdb failed 
            if (!tmdbEpisode.success && !tmdbShow.success) {
                // plex metadata isnt the fastest so if it doesnt equal whats in plex or is shorter then it then we replace with the tmdb one
                data.name = tmdbEpisode.name;

                // if the still path for an ep exists then we download it
                if (tmdbEpisode.still_path) {
                    data.image.background = '';
                    data.image.background = await fetch(`https://image.tmdb.org/t/p/original/${tmdbEpisode.still_path}`);
                    data.image.background = await data.image.background.buffer();
                }

                // if poster for show exists then we download it 
                if (tmdbShow.poster_path) {
                    data.image.poster = '';
                    data.image.poster = await fetch(`https://image.tmdb.org/t/p/original/${tmdbShow.poster_path}`);
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
        "id": `${data.id}${data.sn_num}${data.ep_num}`,
        "tmdb": `${data.id}`,
        "name": data.sh_name,
        "tagline": `Season ${data.sn_num} Episode ${data.ep_num} - ${data.name}`,
        "episode": {
            "ep_num": data.ep_num,
            "sn_num": data.sn_num
        },
        "isTmdb": data.isTmdb,
        "type": "episode",
        "image": data.image
    }

    // make image from plex data
    var genImg = await image.createImage(mkImg);



    // // // uploading image to twitter 
    // // var twitter_media = await media.uploadMedia({
    // //     "main": bufferImg,
    // //     "backup": plexData.image.tautulli.buffer,
    // // }, res);

    // // // tweeting
    // // tweet.sendTweet({
    // //     "status": `Joshua started watching ${plexData.show_name} - Season ${plexData.season} Episode ${plexData.episode} - "${plexData.episode_name}" on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
    // //     "media": twitter_media.media_id_string
    // // }, res);

    // save image
    fs.writeFileSync('./ImgTesting/image-out.png', genImg);

    res.status(200).end();

    return;
}

module.exports = {
    plexEpisode
}