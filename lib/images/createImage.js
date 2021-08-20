const path = require('path');
const clc = require('cli-color');
const Jimp = require('jimp');
const fs = require('fs');
const canvasTxt = require("canvas-txt").default;
const {
    registerFont,
    createCanvas,
    Image
} = require('canvas');
const {
    getAverageColor
} = require('fast-average-color-node');
const {
    roundCorners
} = require('jimp-roundcorners');

async function createImage(data, cache) {
    console.log(clc.blue('[Info]'), `Creating image (${data.id})`);

    // define width and height
    const width = 1920;
    const height = 1080;

    // create canvas base
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const canvasImg = new Image();

    // load and blur background
    console.log(clc.blue('[Info]'), `Loading and bluring background`);
    var background = await Jimp.read(data.images.background);
    background = await background.resize(width, height);
    background = await background.blur(11);
    canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, 0, 0);

    // add poster 
    console.log(clc.blue('[Info]'), `Loading, bluring and rounding poster`);
    var poster = await Jimp.read(data.images.poster);
    poster = await poster.resize(500, 750);
    poster = await roundCorners(poster, {
        cornerRadius: {
            global: 15
        }
    });
    canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, width - 550, height - 975);

    // apply text
    console.log(clc.blue('[Info]'), `Applying text`);
    // canvasTxt.font = 'NotoSansBold';
    canvasTxt.align = 'left'
    canvasTxt.fontSize = 50;
    canvasTxt.debug = true;
    ctx.fillStyle = '#fff';

    // apply title
    canvasTxt.drawText(ctx, data.name, 55, 175, 1160, 80);

    // apply tagline
    canvasTxt.fontSize = 37;
    canvasTxt.drawText(ctx, data.tagline, 58, 260, 1160, 120);


    console.log(clc.green('[Success]'), `Made image (${data.id})`);
    // save
    fs.writeFileSync('test.png', canvas.toBuffer('image/png'));
}

module.exports = {
    createImage
}