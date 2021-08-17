const fetch = require('node-fetch');

/**
 * Download an Image from the 3rd party image provider in Tautulli
 * TODO: Console TMDB down and tautulli down to one file (possibly this one)
 * 
 * @param {String} url 
 * @returns {Buffer} Downloaded image buffer
 */
async function downloadTautulliImage(url) {
    let buffer;
    // download image
    await fetch(url)
        .then(async (image) => {
            buffer = await image.buffer();
            console.log(`[Info] Grabbed image "${url}" from Tautulli Image Provider`);
        }).catch((e) => {
            console.error(`[Error] Failed to grab image from Tautulli Image Provider`);
            if (process.env.dev == 'true') console.log(e);
            buffer = '';
        });
    // return buffer
    return buffer
}

module.exports = {
    downloadTautulliImage
};