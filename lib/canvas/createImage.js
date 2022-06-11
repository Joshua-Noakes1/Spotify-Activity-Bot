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
        getData,
        getPreview,
        getTracks,
        getDetails
    } = require('spotify-url-info')(fetch);

async function main(data) {
    console.log(lcl.blue('[Image - Info]'), "Creating image...");

    // img res
    const width = 1920;
    const height = 1080;

    // register fonts
    registerFont(path.join(__dirname, 'fonts', 'NotoSans', 'NotoSans-Bold.ttf'), {
        family: 'NotoSansBold',
    });
    registerFont(path.join(__dirname, 'fonts', 'NotoSans', 'NotoSans-ExtraBold.ttf'), {
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

    // test background
    var background = await Jimp.read(data.data.image);
    background = await background.blur(11);

    // lower brightness if image too bright
    const avg = await getAverageColor(data.data.image);
    if (avg.isLight) {
        background = await background.brightness(-0.2);
    }
    img.src = await background.getBufferAsync(Jimp.MIME_PNG);

    // draw image
    var scale = Math.max(canvas.width / background.bitmap.width, canvas.height / background.bitmap.height);
    var x = (canvas.width / 2) - (background.bitmap.width / 2) * scale;
    var y = (canvas.height / 2) - (background.bitmap.height / 2) * scale;
    console.log({x, y})
    ctx.drawImage(img, x, y, background.bitmap.width * scale, (background.bitmap.height) * scale);

    // add image
    var albumArt = await Jimp.read(data.data.image);
    albumArt = await albumArt.resize(620, 620);
    albumArt = await roundCorners(albumArt, {
        cornerRadius: {
            global: 15
        }
    });
    img.src = await albumArt.getBufferAsync(Jimp.MIME_PNG);
    ctx.drawImage(img, width - 1600, height - 850);

    // add txt
    // canvasTxt.debug = true;
    canvasTxt.font = 'NotoSansBold, NotoSansJPBold';
    canvasTxt.align = 'left';
    canvasTxt.fontSize = '75';
    ctx.fillStyle = '#fff';

    // title and description
    canvasTxt.drawText(ctx, `${data.data.title}`, 975, 420, 1160, 80);

    canvasTxt.font = 'NotoSansMed, NotoSansJPMed';
    canvasTxt.fontSize = '45';
    canvasTxt.drawText(ctx, `${data.data.artist}`, 978, 490, 1160, 80);

    await writeFileSync(path.join(__dirname, 'test.png'), canvas.toBuffer());
}

// Debug
(async () => {
    let spotifyInfo
    try {
        spotifyInfo = await getPreview('https://open.spotify.com/track/413waXVdYeWc1iqx68Dmpm?si=93c6ae76253c44fc', {
            headers: {
                "sec-ch-ua": "\"Chromium\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Referer": "https://spotify.com/"
            }
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(spotifyInfo);

    let posterBuff = await fetch(spotifyInfo.image);
    posterBuff = await posterBuff.buffer();

    console.log(posterBuff)

    main({
        data: spotifyInfo
    });
})();