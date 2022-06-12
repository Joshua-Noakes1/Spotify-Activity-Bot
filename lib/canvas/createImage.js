const lcl = require('cli-color'),
    path = require('path'),
    canvasTxt = require('canvas-txt').default,
    Jimp = require('jimp'),
    {
        registerFont,
        createCanvas,
        Image
    } = require('canvas'),
    {
        roundCorners
    } = require('jimp-roundcorners'),
    {
        getAverageColor
    } = require('fast-average-color-node');

const {
    writeFile,
    writeFileSync
} = require('fs'),
    fetch = require('node-fetch'), {
        getPreview
    } = require('spotify-url-info')(fetch);

async function main(data) {
    console.log(lcl.blue('[Image - Info]'), "Creating image...");
    try {
        // img res
        const width = 1920;
        const height = 1080;

        // register fonts
        registerFont(path.join(__dirname, 'fonts', 'NotoSans', 'NotoSans-Bold.ttf'), {
            family: 'NotoSansBold',
        });
        registerFont(path.join(__dirname, 'fonts', 'NotoSans', 'NotoSans-Medium.ttf'), {
            family: 'NotoSansMed',
        });
        registerFont(path.join(__dirname, 'fonts', 'NotoSansJP', 'NotoSansJP-Bold.otf'), {
            family: 'NotoSansJPBold'
        });
        registerFont(path.join(__dirname, 'fonts', 'NotoSansJP', 'NotoSansJP-Medium.otf'), {
            family: 'NotoSansJPMed'
        });

        // make canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // load background, blur, darken, scale and draw
        var background = await Jimp.read(data.image);
        background = await background.blur(11);
        const avg = await getAverageColor(data.image);
        if (avg.isLight) {
            background = await background.brightness(-0.2);
        }
        // being totally honest i dont really know what this does or how it works but it works
        var scale = Math.max(canvas.width / background.bitmap.width, canvas.height / background.bitmap.height);
        var x = (canvas.width / 2) - (background.bitmap.width / 2) * scale;
        var y = (canvas.height / 2) - (background.bitmap.height / 2) * scale;
        img.src = await background.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(img, x, y, background.bitmap.width * scale, (background.bitmap.height) * scale);

        // drop shadow
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 7;
        ctx.shadowOffsetY = 7;

        // add cover image, scale, round corners and draw
        var albumArt = await Jimp.read(data.image);
        albumArt = await albumArt.resize(420, 420);
        albumArt = await roundCorners(albumArt, {
            cornerRadius: {
                global: 15
            }
        });
        img.src = await albumArt.getBufferAsync(Jimp.MIME_PNG);
        ctx.drawImage(img, width - 1430, height - 790);

        // add text
        canvasTxt.font = 'NotoSansBold, NotoSansJPBold';
        canvasTxt.align = 'left';
        canvasTxt.fontSize = '65';
        ctx.fillStyle = '#fff';

        // song title
        canvasTxt.drawText(ctx, `${data.title}`, 938, 405, 1000, 80);

        // song artist
        canvasTxt.font = 'NotoSansMed, NotoSansJPMed';
        canvasTxt.fontSize = '43';
        canvasTxt.drawText(ctx, `${data.artist}`, 941, 505, 1000, 80);

        console.log(lcl.green('[Image - Success]'), "Image created!");
        return {
            success: true,
            image: canvas.toBuffer('image/png')
        };
    } catch (err) {
        console.log(lcl.red('[Image - Error]'), err);
        return {
            success: false
        }
    }
}

module.exports = main;