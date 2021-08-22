const path = require('path');
const clc = require('cli-color');
const Twitter = require('twitter');
const {
    readJSON,
    saveJSON
} = require('../readWrite');
const {
    uploadMedia
} = require('./uploadMedia');

// config
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);
var client = new Twitter({
    consumer_key: config.twitter.APIKey,
    consumer_secret: config.twitter.APISecret,
    access_token_key: config.twitter.accessToken,
    access_token_secret: config.twitter.accessSecret
});

async function postTweet(data) {
    var tweetStatus = true;
    var attempt = 0;

    var twtmedia = await uploadMedia(data.media);

    if (config.twitter.useTwitter == true) {
        do {
            try {
                var tweet = await client.post('statuses/update', {
                    "status": data.status,
                    "media_ids": twtmedia.media_id_string != '' ? twtmedia.media_id_string : ""
                });
                console.log(clc.blue('[Info]'), `Posted tweet`);
                return tweet;
            } catch (err) {
                if (attempt > 2) {
                    console.log(clc.red('[Fail]'), `Failed to post tweet, trying again (attempt ${attempt})`);
                    attempt++;
                } else {
                    console.log(clc.red('[Fail]'), `Failed to post tweet`);
                    console.log(err);
                    return false;
                }
            }
        } while (tweetStatus == true);
    } else {
        console.log(clc.blue('[Info]'), `Twitter disabled`);
    }
}
module.exports = {
    postTweet
}