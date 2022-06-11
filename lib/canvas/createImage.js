const lcl = require('cli-color'),
    canvasTxt = require('canvas-txt').default,
    path = require('path'),
    {writeFile, writeFileSync} = require('fs'),
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


async function main() {
    console.log(lcl.blue('[Image - Info]'), "Creating image...");

    // img res
    const width = 1920;
    const height = 1080;

    // make canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // add txt
    canvasTxt.align = 'left';
    canvasTxt.fontSize = '50';

    // title and description
    canvasTxt.drawText(ctx, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 55, 175, 1160, 80);

    await writeFileSync(path.join(__dirname, 'test.png'), canvas.toBuffer());
}

main()