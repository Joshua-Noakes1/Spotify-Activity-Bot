const path = require('path'),
    express = require('express'),
    {
        readJSON
    } = require('../lib/readWrite');

// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    return res.status(200).json({
        status: true,
        message: "Okay but imagine that was a real UI here like close your eyes and just imagaine"
    });
});

router.get('/test', async function (req, res) {
    var data = await readJSON(path.join(__dirname, '../data/songs.json'), true);
    data.data = data.data.reverse();
    return res.status(200).render('home/index.ejs', data);
});

// Favicon 
router.get('/favicon.ico', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'favicon.ico'));
});
router.get('/favicon-16x16.png', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'favicon-16x16.png'));
});
router.get('/favicon-32x32.png', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'favicon-32x32.png'));
});
router.get('/apple-touch-icon.png', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'apple-touch-icon.png'));
});
router.get('/android-chrome-192x192.png', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'android-chrome-192x192.png'));
});
router.get('/android-chrome-512x512.png', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'android-chrome-512x512.png'));
});
router.get('/site.webmanifest', function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../', 'static', 'site.webmanifest'));
});

module.exports = router;