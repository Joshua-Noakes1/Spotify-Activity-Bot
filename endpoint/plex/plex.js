// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const twitter = require('../tweet/send');
const fetch = require('node-fetch');

// /hook post
router.post('/', async function (req, res, next) {
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
                        data.image.tmdb_url = `https://www.themoviedb.org/t/p/original/${data.tmdb.still_path}`;
                        data.image.thumb = await fetch(data.image.tmdb_url);
                        data.image.thumb = await data.image.thumb.buffer();
                    }
                }
            } catch (error) {
                console.log(error);
                res.send(500).json({
                    "message": "TMDB API Error"
                });
                return;
            }
            // send tweet
            twitter.sendImage(data, res);

            break;
        default:
            res.status(404).end();
    }
});

module.exports = router;