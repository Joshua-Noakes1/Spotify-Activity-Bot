const Twitter = require('twitter');
let upload_logic = {
    tweet: {
        failed: false,
        attempt: 0
    }
}

// twitter config
var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_Secret_Key,
    access_token_key: process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret
});

// function to send tweet
async function uploadTweet(status, media, res) {
    // set attempts to 0
    upload_logic.tweet.attempt = 0

    // setting the status
    var twitter_status = {
        "status": status
    }

    // if media add it to the upload
    if (media) {
        twitter_status.media_ids = media.media_id_string
    }

    // logic to retry upload if it fails.
    do {
        try {
            var tweet = await client.post('statuses/update', twitter_status);
            return tweet;
        } catch (error) {
            // more than 3 time and we stop
            if (upload_logic.tweet.attempt < 2) {
                console.error(`[Info] Failed to post to Twitter, trying again...`);
                console.error(error);
                upload_logic.tweet.failed = true;
                upload_logic.tweet.attempt++;
            } else {
                console.error(`[Error] Failed to post to Twitter`);
                console.error(error);
                res.status(415).json({
                    "message": "Failed to post to Twitter"
                });
                break;
            }
        }
    } while (upload_logic.tweet.failed === true)
}

module.exports = {
    uploadTweet
}