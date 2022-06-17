const lcl = require('cli-color'),
    Twitter = require('twitter');

async function uploadMedia(buffer) {
    try {
        const client = new Twitter({
            consumer_key: process.env.tweetkey,
            consumer_secret: process.env.tweetSecret,
            access_token_key: process.env.tweetToken,
            access_token_secret: process.env.tweetTSecret
        });
        const media = await client.post('media/upload', {
            media: buffer
        });
        return media;
    } catch (err) {
        console.log(lcl.red('[Twitter - Error]'), err);
        return {
            success: false,
            message: err
        }
    }
}

module.exports = uploadMedia;