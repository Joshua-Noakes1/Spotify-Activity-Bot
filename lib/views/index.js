// App config
require('dotenv').config();
const express = require('express');
const router = express.Router();
const rw = require('../../bin/readWrite');

// endpoint /hooks/plex
router.get('/', async function (req, res, next) {
    res.render('index', rw.readJSON(`${process.env.cache_dir}/cache.json`));
});

module.exports = router;