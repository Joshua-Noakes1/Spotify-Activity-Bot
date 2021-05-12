// config
require('dotenv').config()
const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
const time = require('./get-date');
const fetch = require('node-fetch');


// twitter config
var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_Secret_Key,
    access_token_key: process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret
});


// /hook post
router.post('/', async function (req, res, next) {
    // getting date and time 
    var cdate = time.getTime();

    // Using password to protect this
    if (req.body.key != process.env.webhook_token) {
        res.status(401).json({
            "message": "Unauthorized"
        });
        return;
    }

    if (req.body.user != process.env.user) {
        res.status(418).json({
            "message": "Unknown User"
        });
        return;
    }

    // downloading image from tautulli
    var tautulli_poster_data = await fetch(req.body.media.playback.poster_url);
    var thumb = await tautulli_poster_data.buffer();

    switch (req.body.media.type) {
        case ('episode'):
            // get episode thumb from TMDB
            var tmdb_thumb_api_data = await fetch(`https://api.themoviedb.org/3/tv/${req.body.media.ID}/season/${req.body.media.playback.season_number}/episode/${req.body.media.playback.episode_number}/images?api_key=${process.env.TMDB_API_Key}`);
            var tmdb_thumb_api_json = await tmdb_thumb_api_data.json();

            // download thumb if not we use the tautulli one
            if (tmdb_thumb_api_json.success != false && tmdb_thumb_api_json.stills.length > 0) {
                var tmdb_thumb_origin_data = await fetch(`https://www.themoviedb.org/t/p/original/${tmdb_thumb_api_json.stills[0].file_path}`);
                var thumb = await tmdb_thumb_origin_data.buffer();
            }

            // upload image to twitter
            client.post('media/upload', {
                media: thumb
            }, function (error, media, response) {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        "message": error.message
                    });
                    return
                }
                // get media url and craft tweet
                var status = {
                    status: `Joshua started watching ${req.body.media.playback.name} - Season ${req.body.media.playback.season_number} Episode ${req.body.media.playback.episode_number} - "${req.body.media.playback.episode}" on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`,
                    media_ids: media.media_id_string // Pass the media id string
                }

                // post tweet
                client.post('statuses/update', status, function (error, tweet, response) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            "message": error.message
                        });
                        return
                    }

                    // success message
                    res.status(200).json({
                        "message": "Successfuly Posted Tweet"
                    });
                    return;
                });


            });
            break
    }
    // res.status(200).end();
});

module.exports = router;