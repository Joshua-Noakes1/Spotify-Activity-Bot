const path = require('path');
const clc = require('cli-color');
const Jimp = require('jimp');
const {
    existsSync
} = require('fs');
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
const {
    saveCache
} = require('../../cache/lib/saveCache');


async function createImage(data) {
    console.log(clc.blue('[Info]'), `Creating image (${data.id})`);

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
    console.log(clc.blue('[Info]'), `Loading and bluring background`);
    var background = await Jimp.read(data.images.background);
    background = await background.resize(width, height);
    background = await background.blur(11);
    canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, 0, 0);

    // get average colour from background
    var fastAvgColour = await getAverageColor(await background.getBufferAsync(Jimp.MIME_PNG), {
        width,
        height
    });

    // apply grey background if the background is too light
    if (fastAvgColour.isLight) {
        console.log(clc.blue('[Info]'), `Adding grey background`);
        var greyBG = await Jimp.read(path.join(__dirname, 'greyBG.png'));
        canvasImg.src = await greyBG.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(canvasImg, 40, 180);
    }

    // add dropshadow
    console.log(clc.blue('[Info]'), `Adding dropshadows`);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // add poster 
    console.log(clc.blue('[Info]'), `Loading, bluring and rounding poster`);
    var poster = await Jimp.read(data.images.poster);
    poster = await poster.resize(1000, 1500);
    poster = await roundCorners(poster, {
        cornerRadius: {
            global: 15
        }
    });
    canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, width - 550, height - 975, 500, 750);

    // apply text
    console.log(clc.blue('[Info]'), `Applying text`);
    canvasTxt.font = 'NotoSansBold';
    canvasTxt.align = 'left';
    canvasTxt.fontSize = 50;
    // canvasTxt.debug = true;
    // canvasTxt.justify = true;
    ctx.fillStyle = '#fff';

    // apply title
    canvasTxt.drawText(ctx, data.name, 55, 175, 1160, 80);

    // apply tagline
    canvasTxt.font = 'NotoSansReg';
    canvasTxt.fontSize = 37;

    canvasTxt.drawText(ctx, data.tagline, 58, 260, 1160, 120);

    console.log(clc.green('[Success]'), `Made image (${data.id})`);

    var imgBuffer = await canvas.toBuffer('image/png')

    await saveCache({
        "id": data.id,
        "name": data.name,
        "tagline": data.tagline,
        "summary": data.summary ? data.summary : '',
        "type": data.summary ? "episode" : "movie",
        "episode": data.summary ? data.episode : '',
        "season": data.summary ? data.season : '',
        "tmdbID": data.tmdbID,
        "URL": data.URL
    }, imgBuffer);

    return imgBuffer;
}

module.exports = {
    createImage
}