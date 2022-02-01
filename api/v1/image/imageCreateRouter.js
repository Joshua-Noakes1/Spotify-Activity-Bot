const fs = require('fs'),
    path = require('path'),
    verifyAuth = require('../../middleware/auth/checkAuth'),
    express = require('express');

// global express router
const router = express.Router();

// look to see if img exists; then send to client
router.post('/', verifyAuth, async function (req, res) {
    switch (req.body.service) {
        case 'plex':
            return await require('./plex/plexRouter')(req, res);
        case 'spotify':
            return res.status(404).send('Not Implemented');
        default:
            return res.status(400).send('Bad Request - Method not supported');
    }
}).get('/', verifyAuth, async function (req, res) {
    res.status(400).send('Bad Request - Use POST');
});




module.exports = router;