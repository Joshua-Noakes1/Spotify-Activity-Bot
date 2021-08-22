const clc = require('cli-color');
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    checkAuth
} = require('../../bin/auth');
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);

// /hooks/spotify
router.post('/', async function (req, res, next) {
    res.send("hello!");
});

module.exports = router;