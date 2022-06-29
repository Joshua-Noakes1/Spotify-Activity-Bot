require("dotenv").config();
const lcl = require("cli-color"),
    uploadMedia = require("./tweetMedia"),
    tweetTweet = require("./tweetTweet"),
    {
        readFileSync
    } = require("fs");

async function handle(data) {
    // try and upload media
    if (process.env.twitter !== "true") {
        console.log(lcl.blue("[Twitter - Info]"), "Twitter is disabled.");
        return {
            success: false,
            message: "Twitter is disabled."
        }
    }

    // process upload 
    var imageBuffer = await readFileSync(data.image);
    var media = await uploadMedia(imageBuffer);
    if (media.success === false) {
        return {
            success: false,
            message: "Twitter media error."
        }
    }

    // tweet
    var tweet = await tweetTweet(data.content, media);
    if (tweet.success === false) {
        return {
            success: false,
            message: "Twitter tweet error."
        }
    }

    // success
    return {
        success: true,
        message: "Tweet sent."
    }
}


module.exports = {
    handle
};