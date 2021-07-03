const fetch = require('node-fetch');

/**
 *  Download an Image from TMDB
 *  
 * @param {String} imagePath 
 * @returns Buffer
 */
async function downloadTMDBImage(imagePath) {
    let buffer;
    // download image
    await fetch('https://image.tmdb.org/t/p/original' + imagePath).then(async (image) => {
        buffer = await image.buffer();
        console.log(`[Info] Grabbed image "${imagePath}" from TMDB`);
    }).catch((e) => {
        console.error(`[Error] Failed to grab image "${imagePath}" from TMDB`);
        if (process.env.dev == 'true') console.error(e);
        buffer = '';
    });
    // return buffer
    return buffer;
}

module.exports = {
    downloadTMDBImage
};