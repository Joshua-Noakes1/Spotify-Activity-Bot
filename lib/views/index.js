// App config
const express = require('express');
const router = express.Router();
const rw = require('../../bin/readWrite');
const {checkAuth} = require('../../bin/auth');

// endpoint /hooks/plex
router.get('/', async function (req, res, next) {
    res.render('index', {
        "recentImage": "xxx",
        "images": []
    });
});

router.post('/auth', async function (req, res, next) {
    if (await checkAuth(req.body.APIKey, next)) {
        res.send("Works");
    }
});

module.exports = router;