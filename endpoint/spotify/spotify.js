// TODO Move this code over to use the function send feature
// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const twitter = require('../tweet/tweet');

// /hook post
router.post('/', (req, res, next) => {
    // Using password to protect this
    if (req.body.key != process.env.webhook_token) {
        res.status(401).json({
            "message": "Unauthorized"
        });
        return;
    }

    // ifttt webhook data
    const data = {
        "TrackName": req.body.TrackName,
        "ArtistName": req.body.ArtistName,
        "PlayedAt": req.body.PlayedAt,
        "TrackUrl": req.body.TrackUrl
    }

    // send tweet
    twitter.uploadTweet(`Joshua played "${data.TrackName}" by ${data.ArtistName} on ${data.PlayedAt} ${data.TrackUrl}`, res);

    // success
    res.status(200).end();
});

module.exports = router;