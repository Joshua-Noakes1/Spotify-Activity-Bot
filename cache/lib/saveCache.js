const path = require('path');
const clc = require('cli-color');
const {
    writeFileSync
} = require('fs');
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');

async function saveCache(data, image) {
    console.log(clc.blue('[Info]'), `Saving '${data.id}' to cache`);
    // load cache
    var cache = readJSON(path.join(__dirname, '../', 'cache.json'), true);

    // save data to cache.json
    cache.images.push(data);
    cache.recentImage = data.id;
    saveJSON(path.join(__dirname, '../', 'cache.json'), cache, true);

    // write image to disk
    console.log(clc.blue('[Info]'), `Saving 'image-${data.id}.png' to disk`);
    writeFileSync(path.join(__dirname, '../', '../', 'static', 'images', `image-${data.id}.png`), image);
    console.log(clc.green('[Success]'), `Saved 'image-${data.id}.png' to disk`);
}

module.exports = {
    saveCache
}