const path = require('path');
const express = require('express');
const router = express.Router();
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');

router.get('/', async function (req, res, next) {
    res.render('index.ejs', readJSON(path.join(__dirname, '../', '../', 'cache', 'cache.json')));
});

module.exports = router;