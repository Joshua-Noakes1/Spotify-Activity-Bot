// App config
const express = require('express');
const router = express.Router();
const rw = require('../../bin/readWrite');

// endpoint /hooks/plex
router.get('/', async function (req, res, next) {
    res.render('index', {
        "recentImage": "xxx",
        "images": []
    });
});

module.exports = router;