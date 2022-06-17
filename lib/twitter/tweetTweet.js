const lcl = require('cli-color'),
    Twitter = require('twitter');

async function tweet(content, media) {
    try {
        const client = new Twitter({
            consumer_key: process.env.tweetkey,
            consumer_secret: process.env.tweetSecret,
            access_token_key: process.env.tweetToken,
            access_token_secret: process.env.tweetTSecret
        });
        const tweet = await client.post('statuses/update', {
            status: content,
            media_ids: media.media_id_string || ""
        });
        return tweet;
    } catch (err) {
        console.log(lcl.red('[Twitter - Error]'), err);
        return {
            success: false,
            message: err
        }
    }
}

module.exports = tweet;