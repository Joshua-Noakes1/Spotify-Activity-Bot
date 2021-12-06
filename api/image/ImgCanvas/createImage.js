const path = require('path'),
    lcl = require('cli-color'),
    Jimp = require('jimp'),
    canvasTxt = require('canvas-text').default,
    {
        registerFont,
        createCanvas,
        Image
    } = require('canvas'),
    {
        getAverageColor
    } = require('fast-average-color-node'),
    {
        roundCorners
    } = require('jimp-roundcorners');