const {
    registerFont,
    createCanvas,
    Image
} = require('canvas');
const Jimp = require('jimp');
const {
    roundCorners
} = require('jimp-roundcorners');
const canvasTxt = require("canvas-txt").default;
const {
    getAverageColor
} = require('fast-average-color-node');
const fs = require('fs');
const saveCache = require('../cache/lib/saveToCache.js');

/**
 * 
 * @param {Object} imgData - Object 
 * @param {Object} cacheData - Object
 * @returns {Buffer} Image buffer
 */
async function createImage(imgData, cacheData) {
    // check if image exists
    var imgExist = fs.existsSync(`${process.env.cache_dir}/image-${imgData.id}.png`) ? true : false;

    if (process.env.cache == 'false' || imgExist == false) {
        console.log(`[Info] Creating image for "${imgData.name}" (${imgData.id})`);

        // define image width and height 1920x1080
        const width = 1920;
        const height = 1080;

        // register NotoSans font family
        console.log(`[Info] Registering font family NotoSans`);
        // Title
        registerFont('./bin/fonts/NotoSans/NotoSans-Bold.ttf', {
            family: "NotoSansBold"
        });
        // Tagline
        registerFont('./bin/fonts/NotoSans/NotoSans-Regular.ttf', {
            family: "NotoSansReg"
        });

        // create canvas and context and make placeholder image
        console.log(`[Info] Creating canvas and context`);
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const canvasImg = new Image();

        // load background, resize and blur it to 15
        console.log(`[Info] Loading and bluring background`);
        // use TMDB background or the default one in the defaults folder
        var background = await Jimp.read(imgData.image.background || './lib/images/lib/defaults/defaultBG.png');
        background = await background.resize(width, height);
        background = await background.blur(11);

        // add background to canvas
        console.log(`[Info] Adding background to canvas`);
        canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(canvasImg, 0, 0);

        // checking if the image is light or dark
        console.log(`[Info] Checking brightness levels of background`);
        var avgColor = await getAverageColor(await background.getBufferAsync(Jimp.MIME_PNG), {
            width: width,
            height: height
        });

        // adding dropshadow to all future objects poster, text, ect...
        console.log(`[Info] Adding dropshadow`);
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // resizing poster to 1000 x 1500 so all posters fit in the background
        console.log(`[Info] Resizing and rounding poster to 1000 x 1500`);
        var poster = await Jimp.read(imgData.image.poster);
        poster = await poster.resize(1000, 1500);
        poster = await roundCorners(poster, {
            cornerRadius: {
                global: 15
            }
        });

        // add poster to canvas
        console.log(`[Info] Adding poster to canvas`);
        canvasImg.src = await poster.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(canvasImg, width - 550, height - 975, 500, 750);

        // apply lightmode text background if its light
        if (avgColor.isLight && imgData.image.background != '') {
            console.log(`[Info] Applying lightmode text background`);
            canvasImg.src = './lib/images/lib/defaults/lightmodeBG.png';
            ctx.drawImage(canvasImg, 40, 180);
        }

        // adding text
        console.log(`[Info] Applying text`);
        // setting canvasTxt perms
        canvasTxt.font = 'NotoSansBold';
        canvasTxt.align = 'left'
        canvasTxt.fontSize = 50;
        // canvasTxt.debug = true;
        ctx.fillStyle = '#fff';

        // applying title
        console.log(`[Info] Applying title`);
        // adding title (context, 'text', widht on page, height on page, how far text goes, how high it goes)
        canvasTxt.drawText(ctx, imgData.name, 55, 175, 1160, 80);

        // applying tagline
        console.log(`[Info] Applying tagline`);
        canvasTxt.font = 'NotoSansReg';
        canvasTxt.fontSize = 37;
        canvasTxt.drawText(ctx, imgData.tagline, 58, 260, 1160, 120);

        // canvas to buffer
        console.log(`[Success] Created image for "${imgData.name}" (${imgData.id})`)
        var madeImg = canvas.toBuffer('image/png');

        // save to cache
        await saveCache.saveCache(cacheData, madeImg);

        //fs.writeFileSync('./image.png', madeImg);

        // return buffer of image
        return madeImg;
    } else {
        console.log(`[Success] "${imgData.name}" (${imgData.id}) already exists using cached version`);
        return fs.readFileSync(`./lib/images/cache/image-${imgData.id}.png`);
    }
}

module.exports = {
    createImage
};