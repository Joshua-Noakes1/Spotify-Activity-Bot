const path = require('path');
const clc = require('cli-color');
const {
    writeFileSync
} = require('fs');
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);
const {
    uploadCloudinary
} = require('../../bin/thirdparty/cloudinary');


async function saveCache(data, image) {
    // write image to disk
    console.log(clc.blue('[Info]'), `Saving 'image-${data.id}.png' to disk`);
    await writeFileSync(path.join(__dirname, '../', '../', 'static', 'images', `image-${data.id}.png`), image);
    console.log(clc.green('[Success]'), `Saved 'image-${data.id}.png' to disk`);

    if (config.thridparty.useThirdparty == true) {
        // upload image to third party
        var thridparty = await uploadCloudinary(path.join(__dirname, '../', '../', 'static', 'images', `image-${data.id}.png`), data.id);

        if (thridparty.status != false) {
            data.URL.image = thridparty.data.secure_url;
        }
    }

    // load cache
    console.log(clc.blue('[Info]'), `Saving '${data.id}' to cache`);
    var cache = readJSON(path.join(__dirname, '../', 'cache.json'), true);

    // save data to cache.json
    cache.images.push(data);
    cache.recentImage = data.id;
    saveJSON(path.join(__dirname, '../', 'cache.json'), cache, true);


}

async function updateCache(data) {
    console.log(clc.blue('[Info]'), `Updating cache (${data.id})`);
    // load cache
    var cache = readJSON(path.join(__dirname, '../', 'cache.json'), true);

    // save data to cache.json
    cache.recentImage = data.id;
    saveJSON(path.join(__dirname, '../', 'cache.json'), cache, true);

    console.log(clc.green("[Success]"), `Updated cache (${data.id})`);
}

module.exports = {
    saveCache,
    updateCache
}