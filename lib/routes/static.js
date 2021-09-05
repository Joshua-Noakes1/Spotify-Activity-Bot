const path = require('path');
const express = require('express');
const router = express.Router();

// static folder (needed?)
router.use('/', express.static(path.join(__dirname, '../', '../', 'static')));

// generated images
router.use('/images', express.static(path.join(__dirname, '../', '../', 'static', 'images')));

// cache
router.use('/cache.json', express.static(path.join(__dirname, '../', '../', 'cache', 'cache.json'))); // cache json


module.exports = router;