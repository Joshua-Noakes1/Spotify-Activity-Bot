// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const twitter = require('../tweet/send-image');
const time = require('./get-date');
const fetch = require('node-fetch');

// /hook post
router.post('/', async function (req, res, next) {
    // getting date and time 
    var cdate = time.getTime();

    // Using password to protect this
    if (req.body.key != process.env.webhook_token) {
        res.status(401).json({
            "message": "Unauthorized"
        });
        return;
    }

    if (req.body.user != process.env.user) {
        res.status(418).json({
            "message": "Unknown User"
        });
        return;
    }

    // downloading image from tautulli
    var tautulli_poster_data = await fetch(req.body.media.playback.poster_url);
    var thumb = await tautulli_poster_data.buffer();

    switch (req.body.media.type) {
        case ('episode'):
            // get episode thumb from TMDB
            var tmdb_thumb_api_data = await fetch(`https://api.themoviedb.org/3/tv/${req.body.media.ID}/season/${req.body.media.playback.season_number}/episode/${req.body.media.playback.episode_number}/images?api_key=${process.env.TMDB_API_Key}`);
            var tmdb_thumb_api_json = await tmdb_thumb_api_data.json();

            // download thumb if not we use the tautulli one
            if (tmdb_thumb_api_json.success != false && tmdb_thumb_api_json.stills.length > 0) {
                var tmdb_thumb_origin_data = await fetch(`https://www.themoviedb.org/t/p/original/${tmdb_thumb_api_json.stills[0].file_path}`);
                var thumb = await tmdb_thumb_origin_data.buffer();
            }

            var data = {
                "media": {
                    "type": "watching",
                    "show": req.body.media.playback.name,
                    "seaepi": `Season ${req.body.media.playback.season_number} Episode ${req.body.media.playback.episode_number}`,
                    "name": req.body.media.playback.episode
                }
            }

            // send tweet 
            twitter.sendImage(data, thumb, res);

            break;
        default:
            res.status(200).end();
    }
});

module.exports = router;