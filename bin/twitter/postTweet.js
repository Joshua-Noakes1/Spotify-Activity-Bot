const path = require('path');
const lcl = require('cli-color');
const Twitter = require('twitter');
const {
    readJSON
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

    if (data.media != "") {
        var twtmedia = await uploadMedia(data.media);
    }

    do {
        try {
            // tweet
            var tweet = await client.post('statuses/update', {
                "status": data.status,
                "media_ids": twtmedia.media_id_string != '' ? twtmedia.media_id_string : ""
            });
            console.log(lcl.green('[Success]'), `Posted tweet - https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
            return tweet;
        } catch (err) {
            // catch errors
            if (attempt > 2) {
                console.log(lcl.red('[Fail]'), `Failed to post tweet, trying again (attempt ${attempt})`);
                attempt++;
            } else {
                console.log(lcl.red('[Fail]'), `Failed to post tweet`);
                console.log(err);
                return false;
            }
        }
    } while (tweetStatus == true);
}
module.exports = {
    postTweet
}