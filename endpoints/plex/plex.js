require('dotenv').config()
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const episode = require('./types/episode');
const movie = require('./types/movie');

// endpoint
router.post('/', async function (req, res, next) {
    // Using password to protect this
    if (req.body.key != process.env.WebhookToken) {
        res.status(401).json({
            "message": "Unauthorized"
        });
        return;
    }

    // sending 200 okay if its not the user
    if (req.body.user != process.env.Tautulli_username) return res.status(200).end();

    // construct media data
    var data = {
        "media_type": req.body.media.type,
        "show_name": req.body.media.playback.name,
        "episode_name": req.body.media.playback.episode,
        "season": req.body.media.playback.season_number,
        "episode": req.body.media.playback.episode_number,
        "year": req.body.media.playback.year,
        "raiting": req.body.media.playback.content_raiting,
        "image": {
            "tautulli": {
                "url": req.body.media.playback.poster_url,
                "buffer": ''
            },
            "tmdb": {
                "url": '',
                "buffer": ''
            },
            "tmdb2": {}
        },
        "tmdb_id": req.body.media.ID,
        "tmdb": {}
    }

    // saving tautulli image
    data.image.tautulli.buffer = await fetch(data.image.tautulli.url);
    data.image.tautulli.buffer = await data.image.tautulli.buffer.buffer();

    // check to see what media type were dealing with episode / film
    switch (req.body.media.type) {
        case 'episode':
            // send for plex episode
            episode.plexEpisode(req, res, data);
            break;
        case 'movie':
            // send for plex movie
            movie.plexMovie(req, res, data);
            break;
        default:
            res.status(200).end();
    }

});

module.exports = router