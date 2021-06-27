require('dotenv').config()
const express = require('express');
const router = express.Router();
const episode = require('./plexEpisode');
const movie = require('./plexMovie');
const fs = require('fs');

// endpoint
router.post('/', async function (req, res, next) {
    // we are going to use a password to protect this endpoint
    if (req.body.key != process.env.WebhookToken) {
        res.status(401).json({
            "message": "Unauthorized"
        });
        return;
    }

    // if the user thats playing in plex isnt the user in the env file
    // then we just want to respond with a 200.end as some apps will keep sending data till they get a 200
    if (req.body.user != process.env.Tautulli_username) return res.status(200).end();

    // switch to see what type of media we are dealing with episode or movie
    switch (req.body.media.type) {
        case 'episode':
            episode.plexEpisode(req, res, req.body);
            break;
        case 'movie':
            movie.plexMovie(req, res, req.body);
            break;
        default: // similar to the name in env we return 200 so they dont keep sending data
            res.status(200).end();
    }
});

module.exports = router