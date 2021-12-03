const path = require('path');
const lcl = require('cli-color');
const Jimp = require('jimp');
const canvasTxt = require("canvas-txt").default;
const {
    registerFont,
    createCanvas,
    Image
} = require('canvas');
const {
    roundCorners
} = require('jimp-roundcorners');
const {
    saveCache
} = require('../cache/saveCache');
const {
    readJSON
} = require('../../bin/readWrite');

async function createImage(data) {
    console.log(lcl.blue('[Info]'), `Creating image (${data.id})`);

    // define width and height
    const width = 1920;
    const height = 1080;

    // register font family
    // Title
    registerFont(path.join(__dirname, '../', '../', 'bin', 'fonts', 'NotoSans', 'NotoSans-Bold.otf'), {
        family: "NotoSansBold"
    });
    // Tagline
    registerFont(path.join(__dirname, '../', '../', 'bin', 'fonts', 'NotoSans', 'NotoSans-Regular.otf'), {
        family: "NotoSansReg"
    });

    // create canvas base
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const canvasImg = new Image();

    // load and blur background
    console.log(lcl.blue('[Info]'), `Generating gradient background`);
    var ctxGradient = ctx.createLinearGradient(0, 0, height, width);

    // generate gradient
    const gradient = await readJSON(path.join(__dirname, 'grads.json'));
    const grad = gradient[Math.floor(Math.random() * gradient.length)];
    console.log(lcl.blue('[Info]'), `Generated gradient: "${grad.name}"`);
    ctxGradient.addColorStop(0, `#${grad.colorA}`);
    ctxGradient.addColorStop(1, `#${grad.colorB}`);

    // apply gradient
    ctx.fillStyle = ctxGradient;
    ctx.fillRect(0, 0, width, height);

    // add dropshadow
    console.log(lcl.blue('[Info]'), `Adding dropshadows`);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // add poster 
    console.log(lcl.blue('[Info]'), `Loading and rounding poster`);
    var poster = await Jimp.read(data.images.album);
    poster = await poster.resize(620, 620);
    poster = await roundCorners(poster, {
        cornerRadius: {
            global: 5
        }
    });
    canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, width - 650, height - 975);

    // apply text
    console.log(lcl.blue('[Info]'), `Applying text`);
    canvasTxt.font = 'NotoSansBold';
    canvasTxt.align = 'left';
    canvasTxt.fontSize = 50;
    // canvasTxt.debug = true;
    // canvasTxt.justify = true;
    ctx.fillStyle = '#fff';

    // apply artist 
    canvasTxt.drawText(ctx, data.title, 55, 175, 1160, 80);

    // apply artist
    canvasTxt.font = 'NotoSansReg';
    canvasTxt.fontSize = 37;

    canvasTxt.drawText(ctx, data.artist, 58, 260, 1160, 120);

    console.log(lcl.green('[Success]'), `Made image (${data.id})`);

    var imgBuffer = await canvas.toBuffer('image/png')

    await saveCache({
        "id": data.id,
        "name": data.title,
        "tagline": data.artist,
        "type": "music",
        "URL": data.URL
    }, imgBuffer);

    return imgBuffer;
}

module.exports = {
    createImage
}