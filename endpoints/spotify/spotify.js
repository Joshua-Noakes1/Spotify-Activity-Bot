require('dotenv').config()
const express = require('express');
const router = express.Router();
const tweet = require('../helper/tweet');

// /hook post
router.post('/', (req, res, next) => {
    // Using password to protect this
    if (req.body.key != process.env.WebhookToken) {
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
    tweet.sendTweet({
        "status": `Joshua played "${data.TrackName}" by ${data.ArtistName} on ${data.PlayedAt} ${data.TrackUrl}`
    }, res);

    res.status(200).end();
});

module.exports = router;
