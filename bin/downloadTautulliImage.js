const fetch = require('node-fetch');

/**
 * Download an Image from the 3rd party image provider in Tautulli
 * 
 * @param {String} url 
 * @returns Buffer
 */
async function downloadTautulliImage(url) {
    let buffer;
    // download image
    await fetch(url).then(async (image) => {
        buffer = await image.buffer();
        console.log(`[Info] Grabbed image from Tautulli Image Provider`);
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