const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');

router.get('/', async function (req, res, next) {
    // if cache doesnt exist create it
    if (!fs.existsSync(path.join(__dirname, '../', '../', 'cache', 'cache.json'))) {
        await saveJSON(path.join(__dirname, '../', '../', 'cache', 'cache.json'), {
            images: []
        });
    }
    // load and flip array
    var cache = await readJSON(path.join(__dirname, '../', '../', 'cache', 'cache.json'));
    await cache.images.reverse();

    // send web page
    res.render('index.ejs', cache);
});

module.exports = router;