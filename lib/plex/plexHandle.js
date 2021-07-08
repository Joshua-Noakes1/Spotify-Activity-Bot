// App config
require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../../bin/checkAuth');
const episode = require('./lib/plexEpisode');
const movie = require('./lib/plexMovie');

// endpoint /hooks/plex
router.post('/', async function (req, res, next) {
    // check if the request is authencated 
    if (await auth.checkAuth(req.body.key, next) == false) return;

    // check if the user playing on plex is actually the user we want
    if (req.body.user != process.env.Tautulli_username) {
        const error = new Error("❌ Unknown User ❌");
        error.status = 404;
        next(error);
        return;
    }

    // switch for each type of plex media we support movies and episode
    switch (req.body.media.type) {
        case 'episode':
            episode.plexEpisode(res, req.body, next);
            break;
        case 'movie':
            movie.plexMovie(res, req.body, next);
            break;
        default:
            // an unknown media type is send to us
            const error = new Error("❌ Unknown Media Type ❌");
            error.status = 400;
            next(error);
            return;
    }
});

module.exports = router;