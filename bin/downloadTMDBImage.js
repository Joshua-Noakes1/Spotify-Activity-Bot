const fetch = require('node-fetch');

/**
 *  Download image from TMDB and return its buffer
 *  
 * @param {string} imagePath 
 * @returns buffer
 */
async function downloadTMDBImage(imagePath) {
    let buffer;
    await fetch('https://image.tmdb.org/t/p/original' + imagePath).then(async (image) => {
        buffer = await image.buffer();
    }).catch((e) => {
        console.error(`[Error] Failed to grab image ${imagePath} from TMDB`);
        if (process.env.dev == true) console.error(e);
    });
    return buffer;
}

module.exports = {
    downloadTMDBImage
};