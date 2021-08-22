const path = require('path');
const clc = require('cli-color');
const Twitter = require('twitter');
const {
    readJSON,
    saveJSON
} = require('../readWrite');

// config
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);
var client = new Twitter({
    consumer_key: config.twitter.APIKey,
    consumer_secret: config.twitter.APISecret,
    access_token_key: config.twitter.accessToken,
    access_token_secret: config.twitter.accessSecret
});

async function uploadMedia(buffer) {
    var tweetStatus = true;
    var attempt = 0;

    do {
        try {
            // upload media
            var tweet = await client.post('media/upload', {
                "media": buffer
            });
            console.log(clc.green('[Success]'), `Uploaded media to Twitter`);
            return tweet;
        } catch (err) {
            // catch errors
            if (attempt > 2) {
                console.red(clc.red('[Fail]'), `Failed to upload media to Twitter, trying again (attempt ${attempt})`);
                attempt++;
            } else {
                console.red(clc.red('[Fail]'), `Failed to upload media to Twitter`);
                console.log(err);
                return false;
            }
        }
    } while (tweetStatus == true);
}

module.exports = {
    uploadMedia
}