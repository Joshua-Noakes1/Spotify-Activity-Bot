require('dotenv').config();
const lcl = require('cli-color'),
        downloadImages = require('../imgCanvas/middleware/downloadImages');

// get all media from tautulli and pass to imgCanvas
async function plexImageRouter(req, res) {
    // map req.body to variable
    const tautulli = req.body;

    if (process.env.TAUTULLI_NAME === tautulli.user) {
        // console log new image card
        console.log(lcl.blue("[Info]"), `New image card for "${tautulli.media.name}"`);

        // try tmdb lookup
        const tmdbData = await require('./middleware/tmdb/tmdbLookup')(tautulli, tautulli.tmdbID);
        if (tmdbData.success) {
            // if tmdb lookup successful, extract data
            switch (tautulli.media.type) {
                case 'movie':
                    // get movie data
                    var tmdbformatData = {
                        success: true,
                        title: tmdbData.data.title != '' ? tmdbData.data.title : tautulli.media.title,
                        tagline: tmdbData.data.tagline != '' ? tmdbData.data.tagline : tautulli.media.tagline,
                        images: {
                            poster: `https://image.tmdb.org/t/p/original${tmdbData.data.poster_path}`,
                            backdrop: `https://image.tmdb.org/t/p/original${tmdbData.data.backdrop_path}`
                        }
                    }
                    break;
                case 'episode':
                    // get episode data
                    var tmdbformatData = {
                        success: true,
                        title: tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].name != '' ? tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].name : tautulli.media.episode_name,
                        summary: tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].overview,
                        images: {
                            poster: `https://image.tmdb.org/t/p/original${tmdbData.data.poster_path}`,
                            backdrop: `https://image.tmdb.org/t/p/original${tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].still_path}`,
                        }
                    }
                    break;
                default:
                    return console.log(lcl.red("[Error]"), `9/10 times this will never happen...`);
            }
        }

        // create image card data
        var imgData = {
            title: tautulli.media.title,
            tagline: tautulli.media.tagline,
            images: {
                poster: tautulli.media.poster_URL,
                backdrop: ''
            },
            positions: {
                poster: [530, 945]
            }
        }

        // add extra tmdb data to image card data
        if (tmdbformatData.success) {
            imgData.title = tmdbformatData.title;
            imgData.tagline = tmdbformatData.tagline;
            imgData.images = tmdbformatData.images;
        }
        if (tautulli.media.type === 'episode') imgData.tagline = `Season ${tautulli.media.season_number} Episode ${tautulli.media.episode_number}`;

        // downloading images
        imgData.images.poster = await downloadImages(imgData.images.poster);
        if (imgData.images.backdrop != '') imgData.images.backdrop = await downloadImages(imgData.images.backdrop);

        // build image card
        var imageCard = await require('../imgCanvas/createImage')(imgData);

        console.log(imageCard);

        return res.send("PlexRouter");
    } else {
        return res.status(400).send(`\"${tautulli.user}\" is not authorized to use this API.`);
    }
}

module.exports = plexImageRouter;