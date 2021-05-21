// date and time
const Twitter = require('twitter');
const fetch = require('node-fetch');
let upload_logic = {
    tweet_media: {
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

async function uploadImage(data, res) {
    // logic to retry upload if it fails.
    do {
        try {
            var twitter_image = await client.post('media/upload', {
                media: data.image.thumb
            });
            return twitter_image;
        } catch (error) {
            // more than 3 time and we stop
            if (upload_logic.tweet_media.attempt < 3) {
                console.error(`[Info] Failed to upload image to twitter, trying again...`);
                console.error(error);
                upload_logic.tweet_media.failed = true;
                if (upload_logic.tweet_media.attempt == 2) {
                    // replace tmdb image with tautulli incase their image is broken
                    console.error(`[Info] Failed to upload TMDB image to twitter Using plex image as fallback`);
                    data.image.thumb = await fetch(data.image.tautulli_url);
                    data.image.thumb = await data.image.thumb.buffer();
                }
                upload_logic.tweet_media.attempt++;
            } else {
                console.error(`[Error] Failed to upload image to Twitter`);
                console.error(error);
                res.status(415).json({
                    "message": "Failed to upload image to Twitter"
                });
                break;
            }
        }
    } while (upload_logic.tweet_media.failed === true)
}

module.exports = {
    uploadImage
}