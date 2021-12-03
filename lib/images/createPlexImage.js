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
    getAverageColor
} = require('fast-average-color-node');
const {
    roundCorners
} = require('jimp-roundcorners');
const {
    saveCache
} = require('../cache/saveCache');
const {
    readJSON
} = require('../../bin/readWrite');
var fastAvgColour = '';

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
    if (data.images.background != "") {
        console.log(lcl.blue('[Info]'), `Loading and bluring background`);
        var background = await Jimp.read(data.images.background);

        // resize to fit 1920x1080 and blur 
        background = await background.resize(width, height);
        background = await background.blur(11);
        canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);

        // draw image
        ctx.drawImage(canvasImg, 0, 0);

        // get background brightness
        fastAvgColour = await getAverageColor(await background.getBufferAsync(Jimp.MIME_PNG), {
            width,
            height
        });
    } else {
        console.log(lcl.blue('[Info]'), `Generating gradient background`);
        var ctxGradient = ctx.createLinearGradient(0, 0, height, width);

        // generate gradient
        const gradient = await readJSON(path.join(__dirname, 'grads.json'));
        const grad = gradient[Math.floor(Math.random() * gradient.length)];
        console.log(lcl.blue('[Info]'), `Generated gradient: ${grad.name}`);
        ctxGradient.addColorStop(0, `#${grad.colorA}`);
        ctxGradient.addColorStop(1, `#${grad.colorB}`);

        // draw gradient
        ctx.fillStyle = ctxGradient;
        ctx.fillRect(0, 0, width, height);
    }


    //* TODO: Remove this and add correct text color changing insted of adding dark grey box */
    // apply grey background if the background is too light
    if (fastAvgColour.isLight) {
        console.log(lcl.blue('[Info]'), `Adding grey background`);
        var greyBG = await Jimp.read(path.join(__dirname, 'greyBG.png'));
        canvasImg.src = await greyBG.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(canvasImg, 40, 180);
    }

    // add dropshadow
    console.log(lcl.blue('[Info]'), `Adding dropshadows`);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // add poster 
    console.log(lcl.blue('[Info]'), `Loading and rounding poster`);
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
    console.log(lcl.blue('[Info]'), `Applying text`);
    canvasTxt.font = 'NotoSansBold';
    canvasTxt.align = 'left';
    canvasTxt.fontSize = 50;
    // canvasTxt.debug = true;
    // canvasTxt.justify = true;
    ctx.fillStyle = '#fff';

    // apply title
    if (data.name !== "" && data.name !== undefined) {
        canvasTxt.drawText(ctx, data.name, 55, 175, 1160, 80);
    } else {
        data.name = "";
    }

    // apply tagline
    canvasTxt.font = 'NotoSansReg';
    canvasTxt.fontSize = 37;

    if (data.tagline !== "" && data.tagline !== undefined) {
        canvasTxt.drawText(ctx, data.tagline, 58, 260, 1160, 120);
    } else {
        data.tagline = "";
    }

    console.log(lcl.green('[Success]'), `Made image (${data.id})`);

    var imgBuffer = await canvas.toBuffer('image/png')

    await saveCache({
        "id": data.id,
        "name": data.name,
        "tagline": data.tagline,
        "summary": data.episode ? data.summary : '',
        "type": data.episode ? "episode" : "movie",
        "episode": data.episode ? data.episode : '',
        "season": data.episode ? data.season : '',
        "tmdbID": data.tmdbID,
        "URL": data.URL
    }, imgBuffer);

    return imgBuffer;
}

module.exports = {
    createImage
}