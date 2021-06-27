const fetch = require("node-fetch");
const dateTime = require("../helper/date");
const error = require("../helper/error");
const image = require("../../image/image");
const twtMedia = require("../helper/media");
const twtTweet = require("../helper/tweet");

const fs = require("fs");

async function plexEpisode(req, res, plexData) {
    // we get the current date and time from dateTime
    var time = await dateTime.getDate();

    // formatting plex data so its easier to use
    var episodeData = {
        "name": `${req.body.media.playback.name}`,
        "type": `${req.body.media.type}`,
        "episode": {
            "episodeName": `${req.body.media.playback.episodeName}`,
            "episodeNumber": `${req.body.media.playback.episodeNumber}`,
            "seasonNumber": `${req.body.media.playback.seasonNumber}`
        },
        "tagline": `Season ${req.body.media.playback.seasonNumber} Episode `,
        "tmdb": {
            "tmdbID": `${req.body.media.tmdbID}` || '000000',
            "isTmdb": req.body.media.tmdbID != "" ? true : false,
        },
        "images": {
            "poster": "",
            "background": "",
        },
    };

    // download plex poster and store its buffer (This needs images to be enabled with a third party)
    await fetch(plexData.media.playback.posterURL)
        .then(async (tautulliPoster) => {
            episodeData.images.poster = await tautulliPoster.buffer();
        })
        .catch((e) => {
            error.errorMessage(e, res);
            return;
        });

    // check to see if the media is in tmdb
    if (episodeData.tmdb.isTmdb == true) {
        // get episode data
        var tmdbEpisode = await fetch(`https://api.tmdb.org/3/tv/${episodeData.tmdb.tmdbID}/season/${episodeData.episode.seasonNumber}/episode/${episodeData.episode.episodeNumber}?api_key=${process.env.TMDBAPIKey}`)
            .catch((e) => {
                error.errorMessage(e, res);
                return;
            });

        // get show data
        var tmdbShow = await fetch(`https://api.tmdb.org/3/tv/${episodeData.tmdb.tmdbID}?api_key=${process.env.TMDBAPIKey}`)
            .catch((e) => {
                error.errorMessage(e, res);
                return;
            });

        // try and get all the data we need from tmdb
        try {
            // get json from the tmdb
            tmdbEpisode = await tmdbEpisode.json();
            tmdbShow = await tmdbShow.json();

            // the success key doesnt exist if we succeded getting data from tmdb
            if (!tmdbEpisode.success && !tmdbShow.success) {
                // I've found that plex metadata isn't the fastest for updating if a show doesnt have correct data in the cache yet
                // so we're replacing the plex name with the name that the tmdb has
                if (tmdbEpisode.name) {
                    episodeData.episode.episodeName = tmdbEpisode.name;
                }

                // we are going to download the still path for an episode if it exisits 
                if (tmdbEpisode.still_path) {
                    await fetch(`https://image.tmdb.org/t/p/original/${tmdbEpisode.still_path}`).then(async (background) => {
                        episodeData.images.background = await background.buffer();
                    }).catch((e) => {
                        error.errorMessage(e, res);
                        return;
                    });
                }

                // we are going to download the poster for a show if it exisits 
                if (tmdbShow.poster_path) {
                    await fetch(`https://image.tmdb.org/t/p/original/${tmdbShow.poster_path}`).then(async (poster) => {
                        episodeData.images.poster = await poster.buffer();
                    }).catch((e) => {
                        error.errorMessage(e, res);
                        return;
                    });
                }
            }
        } catch (e) {
            error.errorMessage(e, res);
            return;
        }
    }

    var episodeImage = await image.createImage({
        "id": '000000',
        "type": episodeData.type,
        "name": {
            "name": episodeData.episode.episodeName,
            "showName": episodeData.name
        },
        "tagline": `Season ${episodeData.episode.seasonNumber} Episode ${episodeData.episode.episodeNumber} - '${episodeData.episode.episodeName}'`,
        "tmdb": {
            "tmdb": episodeData.tmdb.tmdbID,
            "isTmdb": episodeData.tmdb.isTmdb
        },
        "episode": {
            "episodeNumber": episodeData.episode.episodeNumber,
            "seasonNumber": episodeData.episode.seasonNumber
        },
        "image": episodeData.images
    });

    fs.writeFileSync('./image-out.png', episodeImage);

    // upload image to twitter 
    // var twitterMedia = await twtMedia.uploadMedia({
    //     "main": episodeImage,
    //     "backup": episodeData.images.background
    // }, res);

    // make tweet
    // twtTweet.sendTweet({
    //     "status": `${plexData.user} started watching ${plexData.show_name} on ${currentTime.month} ${currentTime.date.toString()}, ${currentTime.year} at ${currentTime.time.hour}:${currentTime.time.minutes}${currentTime.time.type}`,
    //     "media": twitterMedia.media_id_string
    // });

    return res.status(200).json({
        "success": true
    });
}

module.exports = {
    plexEpisode,
};