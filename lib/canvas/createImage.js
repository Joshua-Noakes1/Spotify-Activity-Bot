const lcl = require('cli-color'),
    canvasTxt = require('canvas-txt').default,
    Jimp = require('jimp'),
    {
        registerFont,
        createCanvas,
        Image
    } = require('canvas'),
    {
        roundCorners
    } = require('jimp-roundcorners');

const path = require('path'),
    {
        writeFile,
        writeFileSync
    } = require('fs'),
    fetch = require('node-fetch'),
    {
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

    // make canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // test background
    var background = await Jimp.read(data.data.image);
    background = await background.blur(11);
    img.src = await background.getBufferAsync(Jimp.MIME_PNG);

    // draw image
    // var factor  = await Math.min ( canvas.width / background.bitmap.width, canvas.height / background.bitmap.height );
    // await ctx.scale(factor, factor);
    // await ctx.drawImage(img, 0, 0);
    // await ctx.scale(1 / factor, 1 / factor);

    // get the scale
    var scale = Math.max(canvas.width / background.bitmap.width, canvas.height / background.bitmap.height);
    // get the top left position of the image
    var x = (canvas.width / 2) - (background.bitmap.width / 2) * scale;
    var y = (canvas.height / 2) - (background.bitmap.height / 2) * scale;
    ctx.drawImage(img, x, y, background.bitmap.width * scale, (background.bitmap.height) * scale);

    // add txt
    canvasTxt.align = 'left';
    canvasTxt.fontSize = '50';
    ctx.fillStyle = '#fff';

    // title and description
    canvasTxt.drawText(ctx, `${data.data.title} - ${data.data.artist}`, 55, 175, 1160, 80);

    await writeFileSync(path.join(__dirname, 'test.png'), canvas.toBuffer());
}

(async () => {
    let spotifyInfo
    try {
        spotifyInfo = await getPreview('https://open.spotify.com/track/1I6lxUUfN12tHReGTvQTsP?si=6af848981fc744c9', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
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