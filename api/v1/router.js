const verifyAuth = require('../middleware/auth/checkAuth'),
    express = require('express');

// global express router
const router = express.Router();

router.get('/', async function (req, res) {
    return res.redirect(307, 'https://github.com/joshua-noakes1/ressie');
});

// Images
router.use('/image/create', require('./image/imageCreateRouter'));
router.use('/image/get', require('./image/imageGetRouter'));

module.exports = router;