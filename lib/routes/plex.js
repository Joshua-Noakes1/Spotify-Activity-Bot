const clc = require('cli-color');
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    checkAuth
} = require('../../bin/auth');
const {
    plexEpisode
} = require('./plexRoutes/plexEpisode');
const {readJSON, saveJSON} = require('../../bin/readWrite');
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);

// /hooks/plex
router.post('/', async function (req, res, next) {
    // Check if request is authencated
    if (await checkAuth(req.body.APIKey, next) && config.tautulliName == req.body.user) {
        // check which type of media 
        switch (req.body.media.type) {
            case 'episode':
                plexEpisode(res, req.body, next);
                break;
            case 'movie':
                res.send("Hello Movies!");
                break;
            default:
                console.log(clc.yellow('[Warn]'), `Unknown media type`);
                const error = new Error("Unknown media type");
                error.status = 400;
                next(error);
                return;
        }
    }
});

module.exports = router;