const path = require('path');
const clc = require('cli-color');
const Jimp = require('jimp');
const {
    existsSync,
    fstat,
    writeFileSync
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
    console.log(clc.blue('[Info]'), `Generating gradient background`);
    var ctxGradient = ctx.createLinearGradient(0, 0, height, width);
    ctxGradient.addColorStop(0, "#3f5efb");
    ctxGradient.addColorStop(1, "#fc466b");
    ctx.fillStyle = ctxGradient;
    ctx.fillRect(0, 0, width, height);

    // add dropshadow
    console.log(clc.blue('[Info]'), `Adding dropshadows`);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // add poster 
    console.log(clc.blue('[Info]'), `Loading, bluring and rounding poster`);
    var poster = await Jimp.read(data.images.poster);
    poster = await poster.resize(620, 620);
    poster = await roundCorners(poster, {
        cornerRadius: {
            global: 5
        }
    });
    canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, width - 650, height - 975);

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

    writeFileSync('test.png', imgBuffer);

    await saveCache({
        "id": data.id,
        "name": data.name,
        "tagline": data.tagline,
        "type": "music",
        "URL": data.URL
    }, imgBuffer);

    return imgBuffer;
}

module.exports = {
    createImage
}