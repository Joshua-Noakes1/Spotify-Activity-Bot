const Canvas = require('canvas');
const {
    registerFont,
    createCanvas
} = require('canvas');
const {
    roundCorners
} = require('jimp-roundcorners');
const Jimp = require('jimp');

async function createImage(data) {
    console.log(`[Info] Creating image for ID ${data.tmdb_id} - ${data.name}`);

    // checking the size of the text so i can move the poster around it
    if (data.name.length >= 40) {
        var textSize = 3;
        //ctx.font = '40pt NotoBold';
    } else if (data.name.length >= 20) {
        var textSize = 2;
        //ctx.font = '15pt NotoBold'
    } else {
        var textSize = 1;
    }

    // define width n' height
    var width = 1920;
    var height = 1080;

    // register noto family
    console.log(`[Info] Registering font family NotoSans`);
    registerFont('./endpoints/plex/types/helper/fonts/Noto/NotoSans-Bold.ttf', {
        family: 'NotoBold'
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

    // set font to 65pt and NotoBold
    ctx.font = '65pt NotoBold';
    ctx.fillStyle = '#fff';

    // making font size smaller if title is larger than 20 chars
    if (textSize == 2) {
        ctx.font = '40pt NotoBold';
    } else if (textSize == 3) {
        ctx.font = '35pt NotoBold'
    }

    // Title and tag from the left X
    var spaceX = 75;
    if (textSize == 3) spaceX = 25;

    // adding title
    ctx.fillText(data.name, spaceX, 300);

    // add tagline at 20pt and NotoBold Font
    ctx.font = '20pt NotoBold';
    ctx.fillText(data.tagline, spaceX + 3, 345);

    console.log(`[Info] Image successfuly generated`);
    // return buffer of canvas
    return canvas.toBuffer('image/png');
}

module.exports = {
    createImage
}