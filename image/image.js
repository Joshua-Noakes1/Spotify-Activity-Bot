const Canvas = require('canvas');
const {
    registerFont,
    createCanvas
} = require('canvas');
const {
    getAverageColor
} = require('fast-average-color-node');
const Jimp = require('jimp');
const {
    roundCorners
} = require('jimp-roundcorners');
const canvasTxt = require("canvas-txt").default;
const fs = require('fs');
const cache = require('./cache/cache');

async function createImage(data) {
    // check if id exists in cache
    var imgExist = await fs.existsSync(`./image/cache/image-${data.id}.png`) ? true : false

    if (process.env.cache == 'false' || imgExist == false) {
        console.log(`[Info] Creating image for ID "${data.id}" - "${data.name.showName}"`);

        // define width and height
        var width = 1920;
        var height = 1080;

        // register noto family
        console.log(`[Info] Registering font family "NotoSans"`);
        registerFont('./image/fonts/NotoSans/NotoSans-Bold.ttf', {
            family: 'NotoBold'
        });
        registerFont('./image/fonts/NotoSans/NotoSans-Regular.ttf', {
            family: 'NotoReg'
        });

        // create canvas, get context and make placeholder image;
        console.log(`[Info] Creating Canvas`)
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const canvasImg = new Canvas.Image();

        // load, resize and blur background to 11
        console.log(`[Info] Bluring Background`);
        var background = await Jimp.read(data.image.background || './image/images/default.png');
        background = await background.resize(width, height);
        background = await background.blur(11);

        // add background to canvas
        canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(canvasImg, 0, 0);

        // checking if the background is light or dark
        var avgColor = await getAverageColor(await background.getBufferAsync(Jimp.MIME_PNG), {
            width: 1920,
            height: 1080
        });

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

        // add poster to canvas
        canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(canvasImg, width - 530, height - 975, 500, 750);

        // add transparent dark background behind text if image is bright
        if (avgColor.isLight && data.image.background != '') {
            console.log(`[Info] Applying Lightmode Background`)
            canvasImg.src = './image/images/lightModeBG.png';
            ctx.drawImage(canvasImg, 40, 180);
        }

        /* Text */
        console.log(`[Info] Applying text`);

        // set text size, size 50 and color white
        canvasTxt.font = 'NotoBold';
        canvasTxt.align = 'left'
        canvasTxt.fontSize = 50;
        ctx.fillStyle = '#fff';
        if (process.env.dev == 'true') canvasTxt.debug = true;

        // adding title
        canvasTxt.drawText(ctx, data.name.showName, 55, 190, 1275, 100);

        // adding tagline 
        canvasTxt.fontSize = 35;
        canvasTxt.drawText(ctx, data.tagline, 58, 290, 1275, 100);

        // return buffer of canvas and save it 
        console.log(`[Info] Image successfuly generated`);
        var madeImg = await canvas.toBuffer('image/png');

        // save to cache
        await cache.saveCache(data.cache, madeImg);

        // return buffer
        console.log(`[Success] Generated Image`);
        return madeImg;
    } else {
        console.log(`[Info] Image ID "${data.id}" - "${data.name.showName}" already exists. Using cached version`);
        var cacheImage = fs.readFileSync(`./image/cache/image-${data.id}.png`);
        return cacheImage;
    }
}

module.exports = {
    createImage
}