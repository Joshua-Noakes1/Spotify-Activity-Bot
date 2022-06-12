const express = require('express');
// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    res.redirect(307, 'https://github.com/joshua-noakes1/IRyS');
});

router.use('/spotify/playback', require('./spotify/playback'));

module.exports = router;