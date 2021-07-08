// App config
require('dotenv').config();
const express = require('express');
const router = express.Router();
const rw = require('../../bin/readWrite');

// endpoint /hooks/plex
router.get('/', async function (req, res, next) {
    const cache = rw.readJSON(`${process.env.cache_dir}/cache.json`);

    res.render('index', cache);
});

module.exports = router;