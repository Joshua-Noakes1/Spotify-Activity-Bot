const express = require('express');
// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    return res.status(200).json({status: true, message: "Okay but imagine that was a real UI here like close your eyes and just imagaine"});
});

router.get('/test', function (req, res) {
    return res.status(200).render('home/index.ejs');
});

module.exports = router;