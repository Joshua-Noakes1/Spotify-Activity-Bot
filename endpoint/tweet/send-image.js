// date and time
const time = require('../plex/get-date');
const Twitter = require('twitter');

// twitter config
var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_Secret_Key,
    access_token_key: process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret
});

async function sendImage(data, res) {
    // get time
    var cdate = time.getTime();

    try {
        // upload image to twitter
        client.post('media/upload', {
            media: data.image.thumb // upload buffer
        }, function (error, media, response) {
            // catch error
            if (error) {
                console.log(error);
                res.status(500).json({
                    "message": `Failed to post tweet on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`
                });
                return
            }
            // get media url and craft tweet
            var status = {
                status: `Joshua started watching ${data.show_name} - Season ${data.season} Episode ${data.episode} - "${data.episode_name}" on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`,
                media_ids: media.media_id_string // Pass the media id string
            }

            // post tweet
            client.post('statuses/update', status, function (error, tweet, response) {
                // catch error
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        "message": `Failed to post tweet on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`
                    });
                    return
                }

                // success message
                res.status(200).json({
                    "message": `Successfuly posted tweet on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`
                });
                console.log(`Successfuly posted tweet on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`);
                return;
            });


        });
    } catch (error) {
        // catch error
        console.log(error)
        res.status(500).json({
            "message": `Failed to post tweet on ${cdate.Month} ${cdate.Date}, ${cdate.Year} at ${cdate.Time}`
        });
        return;
    }
}

module.exports = {
    sendImage
}