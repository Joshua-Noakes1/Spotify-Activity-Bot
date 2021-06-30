// App config
const express = require('express');
const router = express.Router();
const auth = require('../../bin/checkAuth');

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

    // console log that a plex type has been it
    console.log(`[Info] New Plex ${req.body.media.type} request`);

    // switch for each type of plex media we support movies and episode
    switch (req.body.media.type) {
        case 'episode':
            break;
        case 'movie':
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