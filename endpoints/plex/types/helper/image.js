const Canvas = require('canvas');
const {
    registerFont,
    createCanvas
} = require('canvas');
const {
    roundCorners
} = require('jimp-roundcorners');
const canvasTxt = require("canvas-txt").default;
const Jimp = require('jimp');
const {
    getAverageColor
} = require('fast-average-color-node');
const fs = require('fs');

async function createImage(data) {
    if (process.env.cache == 'false' || !fs.existsSync(`./endpoints/plex/types/helper/cache/image-${data.id}.png`)) {
    console.log(`[Info] Creating image for ID ${data.id} - "${data.name}"`);

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
    canvasImg.src = './endpoints/plex/types/helper/default.png'; // default background
    if (data.image.background != '') canvasImg.src = await background.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(canvasImg, 0, 0);

    // checking if the background is light or dark
    var avgColor = await getAverageColor(data.image.background, {
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
    ctx.drawImage(canvasImg, width - 650, height - 975, 500, 750);

    // add transparent dark background behind text if image is bright
    if (avgColor.isLight) {
        console.log(`[Info] Applying Lightmode Background`)
        canvasImg.src = './endpoints/plex/types/helper/lightModeBG.png';
        ctx.drawImage(canvasImg, 40, 180);
    }

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

    // return buffer of canvas and save it 
    console.log(`[Info] Image successfuly generated`);
    var madeImg = await canvas.toBuffer('image/png');
    fs.writeFileSync(`./endpoints/plex/types/helper/cache/image-${data.id}.png`, madeImg); // image-${TMDBID}${SeasonNumber}${EpisodeNumber}.png
    return madeImg;
} else {
    console.log(`[Info] Image ID ${data.id} - "${data.name}" already exists. Using cached version`);
    var cacheImage = fs.readFileSync(`./endpoints/plex/types/helper/cache/image-${data.id}.png`); // this breaks if we get manual shows or shows that arnt in TMDB added into plex
    return cacheImage;
}
}

module.exports = {
    createImage
}