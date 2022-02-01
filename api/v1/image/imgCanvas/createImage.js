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
    registerFont(path.join(__dirname, 'fonts', 'NotoSans-Bold.ttf'), {
        family: 'NotoBold'
    });
    registerFont(path.join(__dirname, 'fonts', 'NotoSans-Regular.ttf'), {
        family: 'NotoReg'
    });

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

        // get average light
        fastAvgColor = await getAverageColor(await backdrop.getBufferAsync(Jimp.MIME_PNG), {
            width,
            height
        });
    }

    if (fastAvgColor.isLight) {
        ctx.shadowColor = "grey";
        ctx.fillStyle = '#111';
    } else {
        ctx.shadowColor = "black";
        ctx.fillStyle = '#fff';
    }

    // add dropshadow
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // load poster
    if (imgData.images.poster.success) {
        console.log(lcl.blue("[Info]"), "Loading poster...");
        var poster = await Jimp.read(imgData.images.poster.buffer);

        // resize image
        poster = await poster.resize(1000, 1500);
        poster = await roundCorners(poster, {
            cornerRadius: {
                global: 15
            }
        });
        img.src = await poster.getBufferAsync(Jimp.MIME_PNG);

        // draw image
        ctx.drawImage(img, width - imgData.positions.poster[0], height - imgData.positions.poster[1], imgData.positions.poster[2], imgData.positions.poster[3]);
    }

    // Test add text
    canvasTxt.font = `NotoBold`;
    canvasTxt.align = 'left';
    canvasTxt.fontSize = '50';

    canvasTxt.drawText(ctx, imgData.title, 55, 175, 1160, 80);

    // add test tagline
    canvasTxt.font = `NotoReg`;
    canvasTxt.fontSize = '37';

    canvasTxt.drawText(ctx, imgData.tagline, 58, 260, 1160, 120);

    var imgBuffer = await canvas.toBuffer('image/png');

    return {
        success: true,
        buffer: imgBuffer
    };
}

module.exports = createImageCard;