const fs = require('fs'),
    path = require('path'),
    verifyAuth = require('../middleware/auth/checkAuth'),
    express = require('express');

// global express router
const router = express.Router();

router.get('/', async function (req, res) {
    return res.redirect(307, 'https://github.com/joshua-noakes1/ressie');
});

// Images
router.post('/image/create', verifyAuth, async function (req, res) { // /api/v1/image/create
    switch (req.body.service) {
        case 'plex':
            return await require('./plex/plexRouter')(req, res);
        case 'spotify':
            return res.status(404).send('Not Implemented');
        default:
            return res.status(400).send('Bad Request - Method not supported');
    }
});

router.get('/image/get', verifyAuth, async function (req, res) { // /api/v1/image/get
    // look to see if img exists
    const imgID = req.query.imgID !== undefined ? req.query.imgID : null;
    if (fs.existsSync(path.join(__dirname, '../', '../', 'public', 'images', `${imgID}.png`))) {
        // set header and send img to client
        res.setHeader('Content-Type', 'image/png');
        return res.sendFile(path.join(__dirname, '../', '../', 'public', 'images', `${imgID}.png`));
    }
    return res.status(404).send('Image not found');
});

module.exports = router;