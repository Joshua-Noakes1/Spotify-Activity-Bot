const fetch = require('node-fetch');

/**
 * Download an Image from the 3rd party image provider
 * 
 * @param {String} url 
 * @param {String} imageProvider 
 * @returns {Buffer} Downloaded image buffer
 */
async function downloadImage(url, imageProvider) {
    let buffer;
    // download image
    await fetch(url)
        .then(async (image) => {
            buffer = await image.buffer();
            console.log(`[Info] Grabbed image "${url}" from ${imageProvider}`);
        }).catch((e) => {
            console.error(`[Error] Failed to grab image from ${imageProvider}`);
            if (process.env.dev == 'true') console.log(e);
            buffer = false;
        });
    // return buffer
    return buffer
}

module.exports = {
    downloadImage
};