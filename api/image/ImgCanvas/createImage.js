const {
    registerFont,
    createCanvas,
    Image
} = require('canvas');
const path = require('path'),
    lcl = require('cli-color'),
    Jimp = require('jimp'),
    canvasTxt = require('canvas-txt').default,
    {
        getAverageColor
    } = require('fast-average-color-node'),
    {
        roundCorners
    } = require('jimp-roundcorners'),
    fs = require('fs');

async function createImageCard(imgData) {
    console.log(lcl.blue("[Info]"), "Creating image card...");

    // img width and height
    const width = 1920;
    const height = 1080;

    // register fonts
    //** TODO: Add fonts **/

    // create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // load image and blur
    if (imgData.images.backdrop.success) {
        console.log(lcl.blue("[Info]"), "Loading backdrop...");
        var backdrop = await Jimp.read(imgData.images.backdrop.buffer);

        // resize image
        backdrop = await backdrop.resize(width, height);
        backdrop = await backdrop.blur(11);
        img.src = await backdrop.getBufferAsync(Jimp.MIME_PNG);

        // draw image
        ctx.drawImage(img, 0, 0);
    }

    var imgBuffer = await canvas.toBuffer('image/png');
    fs.writeFileSync('./testImage.png', imgBuffer);

    return {
        success: true,
        buffer: imgBuffer
    };
}

module.exports = createImageCard;