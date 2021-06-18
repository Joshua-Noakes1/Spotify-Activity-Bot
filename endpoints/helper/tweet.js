const Twitter = require('twitter');
const errorMsg = require('./error');
const rw = require('./readWrite');
let tweetStatus = false;
let attempt = 0;
let prevTweet = rw.readJSON('./tweets/prevTweet.json');

// twitter client login
var client = new Twitter({
    consumer_key: process.env.TwitterAPIKey,
    consumer_secret: process.env.TwitterAPISecret,
    access_token_key: process.env.TwitterAccessToken,
    access_token_secret: process.env.TwitterAccessSecret
});

async function sendTweet(status, res) {
    if (prevTweet.status != status.status) {
        // resetting attempts to 0
        attempt = 0;

        // twitter status
        var tweetContent = {
            "status": status.status,
        }
        // appending media if it exists
        if (status.media != undefined || status.media != '') {
            tweetContent.media_ids = status.media
        }

        // try and tweet
        do {
            try {
                console.log(`[Info] Attempting tweet (attempt ${attempt + 1})`);
                var tweet = await client.post('statuses/update', tweetContent);
                return tweet;
            } catch (error) {
                if (attempt < 2) {
                    console.log(`[Info] Failed to post to Twitter, trying again... (attempt ${attempt + 1})`);
                    tweetStatus = true;
                    attempt++;
                } else {
                    console.log(`[Error] Failed to post tweet!`)
                    errorMsg(error, 415, res);
                    return;
                }
            }
        } while (tweetStatus === true)

        // write tweet to local fs
        rw.saveJSON('./tweets/prevTweet.json', tweetContent);
    }
}

module.exports = {
    sendTweet
}