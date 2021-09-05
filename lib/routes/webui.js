const path = require('path');
const express = require('express');
const router = express.Router();
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');

router.get('/', async function (req, res, next) {
    // load and flip array
    var cache = await readJSON(path.join(__dirname, '../', '../', 'cache', 'cache.json'), true);
    await cache.images.reverse();

    // send web page
    res.render('index.ejs', cache);
});

module.exports = router;