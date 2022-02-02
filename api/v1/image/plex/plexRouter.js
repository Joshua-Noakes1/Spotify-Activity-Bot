require('dotenv').config();
const lcl = require('cli-color'),
    {
        v4: uuidv4
    } = require('uuid'),
    fs = require('fs'),
    path = require('path'),
    downloadImages = require('../imgCanvas/middleware/downloadImages');

// get all media from tautulli and pass to imgCanvas //TODO Add image lookup in json file
async function plexImageRouter(tautulli) {
    if (process.env.TAUTULLI_NAME === tautulli.user) {
        // console log new image card
        console.log(lcl.blue("[Info]"), `New image card for "${tautulli.media.name}"`);

        // fetch tmdb data
        const tmdbFormatData = await require('./middleware/tmdb/tmdbDataCollection')(tautulli);

        // create image card data
        var imgData = {
            title: tautulli.media.title,
            tagline: tautulli.media.tagline,
            images: {
                poster: tautulli.media.poster_URL,
                backdrop: ''
            },
            positions: {
                poster: [550, 975, 500, 750]
            }
        }

        // add extra tmdb data to image card data
        if (tmdbFormatData.success) {
            imgData.title = tmdbFormatData.title;
            imgData.tagline = tmdbFormatData.tagline;
            imgData.images = tmdbFormatData.images;
        }

        // downloading images
        imgData.images.poster = await downloadImages(imgData.images.poster);
        if (imgData.images.backdrop != '') imgData.images.backdrop = await downloadImages(imgData.images.backdrop);

        // build image card
        var imageCard = await require('../imgCanvas/createImage')(imgData);

        if (imageCard.success) {
            await fs.writeFileSync(path.join(__dirname, '../', '../', '../', '../', 'public', 'images', `${uuidv4()}.png`), imageCard.buffer);
        }

        // save image and data of image

        return {
            success: true,
            "message": "Image Card Created"
        };
    } else {
        return {
            success: false,
            "code": 400,
            "message": "Invalid Tautulli User"
        };
    }
}

module.exports = plexImageRouter;