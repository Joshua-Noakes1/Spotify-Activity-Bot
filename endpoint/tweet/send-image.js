// date and time
const time = require('../plex/get-date');
const Twitter = require('twitter');
const fetch = require('node-fetch');
let upload_logic = {
    image: {
        failed: false,
        attempt: 0
    },
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
            if (upload_logic.image.attempt < 3) {
                console.error(`Failed to upload image to twitter, trying again`);
                console.error(error);
                upload_logic.image.failed = true;
                if (upload_logic.image.attempt == 2) {
                    // replace tmdb image with tautulli incase their image is broken
                    console.error(`Failed to upload TMDB image to twitter Using plex image as fallback`);
                    data.image.thumb = await fetch(data.image.tautulli_url);
                    data.image.thumb = await data.image.thumb.buffer();
                }
                upload_logic.image.attempt++;
            } else {
                console.error(`Failed to upload`);
                console.error(error);
                res.status(415).json({
                    "message": "Failed to upload image to Twitter"
                });
                break;
            }
        }
    } while (upload_logic.image.failed === true)
}

async function uploadTweet(media, res, data, cdate) {
    // logic to retry upload if it fails.
    do {
        try {
            var tweet = await client.post('statuses/update', {
                status: `Joshua started watching ${data.show_name} - Season ${data.season} Episode ${data.episode} - "${data.episode_name}" on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`,
                media_ids: media.media_id_string // Pass the media id string    
            });
            return tweet;
        } catch (error) {
            // more than 3 time and we stop
            if (upload_logic.tweet.attempt < 2) {
                console.error(`Failed to post to twitter, trying again`);
                console.error(error);
                upload_logic.tweet.failed = true;
                upload_logic.tweet.attempt++;
            } else {
                console.error(`Failed to post`);
                console.error(error);
                res.status(415).json({
                    "message": "Failed to post to Twitter"
                });
                break;
            }
        }
    } while (upload_logic.tweet.failed === true)
}

async function sendImage(data, res) {
    // get time
    var cdate = time.getTime();

    // uploading tweet media
    var tweet_media = await uploadImage(data, res);

    // posting tweet
    await uploadTweet(tweet_media, res, data, cdate);

    res.status(200).json({
        "message": "Posted Tweet"
    });
}

module.exports = {
    sendImage
}