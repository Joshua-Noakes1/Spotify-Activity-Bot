const fetch = require('node-fetch'),
    lcl = require('cli-color');

async function downloadImage(url) {
    // console log the download
    console.log(lcl.blue("[Info]"), `Attempting to download image (${url})`);

    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        return {
            success: true,
            buffer
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

module.exports = downloadImage;