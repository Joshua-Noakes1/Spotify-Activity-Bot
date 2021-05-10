// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const Twitter = require('twitter');

// twitter config
var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_Secret_Key,
    access_token_key: process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret
});


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

    // Post to twitter
    client.post('statuses/update', {
        status: `Joshua played "${data.TrackName}" by ${data.ArtistName} on ${data.PlayedAt} ${data.TrackUrl}`
    }, function (error, tweet, response) {
        // error message
        if (error) {
            console.error(error);
            res.status(500).json({
                "message": error.message
            });
            return;
        }

        console.log('Successfuly Posted Tweet')
        // success message
        res.status(200).json({
            "message": "Successfuly posted tweet"
        });
    });
});

module.exports = router;