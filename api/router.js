const express = require('express');
// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    res.redirect(307, '/api/v3/');
});

// v3
router.use('/v3', require('./v3/router'));

module.exports = router;