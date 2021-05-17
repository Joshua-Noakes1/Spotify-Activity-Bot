// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const twitter = require('../tweet/send-image');
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
            /* var data = {
                 "media": {
                     "type": "watching",
                     "show": req.body.media.playback.name,
                     "seaepi": `Season ${req.body.media.playback.season_number} Episode ${req.body.media.playback.episode_number}`,
                     "name": episode_name
                 }
             } */

            // send tweet 
            // twitter.sendImage(data, thumb, res);

            break;
        default:
            res.status(404).end();
    }
});

module.exports = router;