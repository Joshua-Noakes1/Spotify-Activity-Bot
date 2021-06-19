const Canvas, {
    registerFont,
    createCanvas
} = require('canvas');
const {
    roundCorners
} = require('jimp-roundcorners');
const canvasTxt = require("canvas-txt").default;
const Jimp = require('jimp');

async function createImage(data) {
    console.log(`[Info] Creating image for ID ${data.tmdb_id} - ${data.name}`);

    // define width and height
    var width = 1920;
    var height = 1080;

    // register noto family
    console.log(`[Info] Registering font family NotoSans`);
    registerFont('./endpoints/plex/types/helper/fonts/Noto/NotoSans-Bold.ttf', {
        family: 'NotoBold'
    });
    registerFont('./endpoints/plex/types/helper/fonts/Noto/NotoSans-Regular.ttf', {
        family: 'NotoReg'
    });

    // create canvas, get context and make placeholder image;
    console.log(`[Info] Creating Canvas`)
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const canvasImg = new Canvas.Image();

    // load, resize and blur background to 11
    console.log(`[Info] Bluring Background`);
    var background = await Jimp.read(data.image.background);
    background = await background.resize(width, height);
    background = await background.blur(11);

    // add background to canvas
    canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, 0, 0);
    l
    // add drop shadow to all further elements
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // resize poster and round it off
    console.log(`[Info] Resizing Poster`);
    var poster = await Jimp.read(data.image.poster);
    poster = await poster.resize(1000, 1500);
    poster = await roundCorners(poster, {
        cornerRadius: {
            global: 15
        }
    });

    // poster size based on text size
    var posterX = width - 650;
    if (textSize == 3) var posterX = width - 560

    // add poster to canvas
    canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, posterX, height - 975, 500, 750);

    /* Text */
    console.log(`[Info] Applying text`);

    // set text size, size 50 and color white
    canvasTxt.font = 'NotoBold';
    canvasTxt.align = 'left'
    canvasTxt.fontSize = 50;
    // if (process.env.dev == 'true') canvasTxt.debug = true;
    ctx.fillStyle = '#fff';

    // adding title
    canvasTxt.drawText(ctx, data.name, 55, 190, 1160, 100);

    // adding tagline 
    canvasTxt.fontSize = 35;
    canvasTxt.drawText(ctx, data.tagline, 58, 290, 1160, 100);

    // return buffer of canvas
    console.log(`[Info] Image successfuly generated`);
    return canvas.toBuffer('image/png');
}

module.exports = {
    createImage
}