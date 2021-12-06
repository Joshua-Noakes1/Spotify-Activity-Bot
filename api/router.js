const verifyAuth = require('./middleware/auth/checkAuth');
const express = require('express');

// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    res.redirect(307, '/api/v1/');
});

router.get('/v1', verifyAuth, async function (req, res) {
    return res.redirect(307, 'https://github.com/joshua-noakes1/ressie/blob/trunk/docs/API.md');
});

// Images
router.use('/v1/image/create', require('./image/imageCreateRouter'));
router.use('/v1/image/get/', require('./image/imageGetRouter.js'));

module.exports = router;