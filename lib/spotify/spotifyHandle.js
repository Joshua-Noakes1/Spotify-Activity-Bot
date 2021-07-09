// App config
require('dotenv').config();
const express = require('express');
const router = express.Router();
const spotify = require('./lib/spotify');

// endpoint /hooks/spotify
router.post('/', async function (req, res, next) { 

    spotify.makeSpotify(res, req.body);

});

module.exports = router;