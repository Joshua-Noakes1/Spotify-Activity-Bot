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
            if (data.name != tmdbEpisode.name && data.name.length < tmdbEpisode.name.length) {
                data.name = tmdbEpisode.name;
            }

            // if the still path for an ep exists then we download it
            if (tmdbEpisode.still_path) {
                data.image.background = await fetch(`https://image.tmdb.org/t/p/original/${tmdbEpisode.still_path}`);
                data.image.background = await data.image.background.buffer();
            }

            // if poster for show exists then we download it 
            if (tmdbShow.poster_path) {
                data.image.poster = '';
                data.image.poster = await fetch(`https://image.tmdb.org/t/p/original/${tmdbShow.still_path}`);
                //data.image.poster = await data.image.poster.buffer();
                data.image.poster = data.image.background
            }
        }
    } catch (error) {
        errorMsg.errorMessage(error, res);
        return;
    }

    // make image json
    var mkImg = {
        "id": data.id,
        "name": data.sh_name,
        "tagline": `Season ${data.sn_num} Episode ${data.ep_num} - ${data.name}`,
        "image": data.image
    }


    // make image from plex data
    var genImg = await image.createImage(mkImg);


    fs.writeFileSync('./testing/image-out.png', genImg);

    res.status(200).end();
    // try {
    //     // get the buffer from tautulli poster
    //     data.images.poster = await tautulli_poster.buffer();

    //     // get the json from tmdb
    //     tmdb_episode = await tmdb_episode.json();
    //     tmdb_show = await tmdb_show.json();

    //     // check if it was successful, the success key doesnt exist when we're successful
    //     if (!tmdb_episode.success && !tmdb_show.success) {
    //         // plex metaplexData typically isnt the fastest so we're going to replace the title with the tmdb one 
    //         plexData.episode_name = tmdb.name;

    //         // download image from tmdb if it exists
    //         if (tmdb.still_path) {
    //             plexData.image.tmdb.url = `https://image.tmdb.org/t/p/original/${tmdb.still_path}`; // 'https://i.imgur.com/mIovtAb.png' // placehold mayumi background
    //             plexData.image.tmdb.buffer = await fetch(plexData.image.tmdb.url);
    //             plexData.image.tmdb.buffer = await plexData.image.tmdb.buffer.buffer();

    //             plexData.image.tmdb2.url = `https://image.tmdb.org/t/p/original/${tmdb_main.poster_path}`; // 'https://www.themoviedb.org/t/p/original/yriQ3nib4eJyHBviaw7nm5hzIpO.jpg' // placeholder pbdc poster
    //             plexData.image.tmdb2.buffer = await fetch(plexData.image.tmdb2.url);
    //             plexData.image.tmdb2.buffer = await plexData.image.tmdb2.buffer.buffer();
    //         }
    //     }
    // } catch (error) {
    //     errorMsg.errorMessage(error, res, 415);
    // }

    // var imgplexData = {
    //     "tmdb_id": plexData.tmdb_id,
    //     "name": tmdb_main.name,
    //     "tagline": `Season ${plexData.season} Episode ${plexData.episode} - ${tmdb.name}`,
    //     "image": {
    //         "background": plexData.image.tmdb.buffer,
    //         "poster": plexData.image.tmdb2.buffer
    //     }
    // }

    // var bufferImg = await image.createImage(imgplexData);

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

    // // save image
    // fs.writeFileSync('./image-out.png', bufferImg);

    // // success
    // res.status(200).end();
}

module.exports = {
    plexEpisode
}