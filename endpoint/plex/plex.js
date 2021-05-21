// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const time = require('./get-date');
const twitter_image = require('../tweet/upload-image');
const twitter_tweet = require('../tweet/tweet');
const fetch = require('node-fetch');

// /hook post
router.post('/', async function (req, res, next) {
    // getting current time
    const time_date = time.getTime();

    // Using password to protect this
    if (req.body.key != process.env.webhook_token) {
        res.status(401).json({
            "message": "Unauthorized"
        });
        return;
    }

    // we dont want to post when someone else plays something
    if (req.body.user != process.env.user) {
        res.status(418).json({ // so we reply with funny tea pot error
            "message": "Unknown User"
        });
        return;
    }

    // construct media data
    var data = {
        "media_type": req.body.media.type,
        "show_name": req.body.media.playback.name,
        "episode_name": req.body.media.playback.episode,
        "season": req.body.media.playback.season_number,
        "episode": req.body.media.playback.episode_number,
        "image": {
            "tautulli_url": req.body.media.playback.poster_url,
            "tmdb_url": '',
            "thumb": ''
        },
        "tmdb_id": req.body.media.ID,
        "tmdb": {}
    }

    // download tautulli thumbnail
    data.image.thumb = await fetch(data.image.tautulli_url);
    data.image.thumb = await data.image.thumb.buffer();

    switch (req.body.media.type) {
        case ('episode'):
            // get episode data from tmdb using their v3 api
            data.tmdb = await fetch(`https://api.themoviedb.org/3/tv/${data.tmdb_id}/season/${data.season}/episode/${data.episode}?api_key=${process.env.TMDB_API_Key}`);
            data.tmdb = await data.tmdb.json();
            // put everything in a try catch block so that it doesnt error
            try {
                // check if tmdb has the episode
                if (!data.tmdb.success) {
                    // see if the episode name is different because plex is slow at updating its metadata
                    if (data.tmdb.name != data.episode_name) {
                        data.episode_name = data.tmdb.name;
                    }
                    if (data.tmdb.still_path != null) {
                        // download full res thumb from tmdb
                        data.image.tmdb_url = `https://www.themoviedb.org/t/p/original${data.tmdb.still_path}`;
                        data.image.thumb = await fetch(data.image.tmdb_url);
                        data.image.thumb = await data.image.thumb.buffer();
                    }
                }
            } catch (error) {
                console.log('[Error] TMDB API Error');
                console.log(error);
                res.status(415).json({
                    "message": "TMDB API Error"
                });
                return;
            }

            // twitter status
            var status = `Joshua started watching ${data.show_name} - Season ${data.season} Episode ${data.episode} - "${data.episode_name}" on ${time_date.Month} ${time_date.Date}, ${time_date.Year} at ${time_date.Time}`

            // upload image
            var image = await twitter_image.uploadImage(data, res);

            // send tweet
            twitter_tweet.uploadTweet(status, image, res);

            res.status(200).end();

            break;
        default:
            res.status(404).end();
    }
});

module.exports = router;