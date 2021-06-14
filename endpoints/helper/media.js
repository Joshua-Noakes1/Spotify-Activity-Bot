const Twitter = require('twitter');
const errorMsg = require('./error');
let tweetStatus = false;
let attempt = 0;

// twitter client login
var client = new Twitter({
    consumer_key: process.env.TwitterAPIKey,
    consumer_secret: process.env.TwitterAPISecret,
    access_token_key: process.env.TwitterAccessToken,
    access_token_secret: process.env.TwitterAccessSecret
});

async function uploadMedia(media, res) {
    // resetting attempts to 0
    attempt = 0;

    var mediaString = media.main || media.backup;

    do {
        try {
            console.log(`[Info] Attempting upload media (attempt ${attempt + 1})`);
            var tweet = await client.post('media/upload', {
                "media": media.image.thumb
            });
            return tweet;
        } catch (error) {
            if (attempt < 2) {
                console.log(`[Info] Failed to upload media to Twitter, trying again... (attempt ${attempt + 1})`);
                if (attempt == 1) mediaString = media.backup;
                tweetStatus = true;
                attempt++;
            } else {
                console.log(`[Error] Failed to upload media!`)
                errorMsg(error, 415, res);
                return;
            }
        }
    } while (tweetStatus === true)
}

module.exports = {
    uploadMedia
}