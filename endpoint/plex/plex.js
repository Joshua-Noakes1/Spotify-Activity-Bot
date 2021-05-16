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

    // tautulli stuff
    var tautulli_poster_data = await fetch(req.body.media.playback.poster_url);
    var thumb = await tautulli_poster_data.buffer();
    var episode_name = req.body.media.playback.episode;

    switch (req.body.media.type) {
        case ('episode'):
            // get episode data from tmdb
            var tmdb_episode = await fetch(`https://api.themoviedb.org/3/tv/${req.body.media.ID}/season/${req.body.media.playback.season_number}/episode/${req.body.media.playback.episode_number}?api_key=${process.env.TMDB_API_Key}`);
            tmdb_episode = await tmdb_episode.json();

            // if tmdb has the episode 
            if (tmdb_episode.success != false) {
                // check episode name
                if (tmdb_episode.name != req.body.media.playback.episode) {
                    // use tmdb name for ep when is missing from plex
                    episode_name = tmdb_episode.name
                }
                if (tmdb_episode.still_path != null) {
                    // download thumb
                    var tmdb_thumb_origin_data = await fetch(`https://www.themoviedb.org/t/p/original/${tmdb_episode.still_path}`);
                    var thumb = await tmdb_thumb_origin_data.buffer();
                }
            }

            // tweet data
            var data = {
                "media": {
                    "type": "watching",
                    "show": req.body.media.playback.name,
                    "seaepi": `Season ${req.body.media.playback.season_number} Episode ${req.body.media.playback.episode_number}`,
                    "name": episode_name
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