const path = require('path');
const {
    registerFont,
    createCanvas,
    Image
} = require('canvas');
const sharp = require('sharp');
const fs = require('fs');
const canvasTxt = require("canvas-txt").default;

async function makeImage() {
    // define width and height
    const width = 1920;
    const height = 1080;

    // register font family 
    // Title
    registerFont(path.join(__dirname, '../', '../', 'bin', 'fonts', 'NotoSans', 'NotoSans-Bold.ttf'), {
        family: "NotoSansBold"
    });
    // Tagline
    registerFont(path.join(__dirname, '../', '../', 'bin', 'fonts', 'NotoSans', 'NotoSans-Regular.ttf'), {
        family: "NotoSansReg"
    });

    // create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const canvasImg = new Image();

    // Load BG
    var background = await sharp(path.join(__dirname, 'defaults', 'defaultBG.png')).resize({
        width,
        height
    }).blur(11).toBuffer();
    canvasImg.src = background;
    ctx.drawImage(canvasImg, 0, 0);

    // apply text
    // setting canvasTxt perms
    canvasTxt.font = 'NotoSansBold';
    canvasTxt.align = 'left'
    canvasTxt.fontSize = 50;
    // canvasTxt.debug = true;
    ctx.fillStyle = '#fff';
    canvasTxt.drawText(ctx, 'lorem ipsum ', 55, 175, 1160, 80);

    fs.writeFileSync('test.png', canvas.toBuffer('image/png'));
}

makeImage()