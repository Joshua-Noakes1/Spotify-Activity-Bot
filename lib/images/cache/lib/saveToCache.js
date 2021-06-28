const {
    imagemin
} = require('imagemin');
const fs = require('fs');
const rw = require('../../../../bin/readWrite');

/**
 * Save the buffer of an image and its assocated data into the cache folder
 * 
 * @param {Object} data 
 * @param {Buffer} image 
 * @returns A saved image into the cache folder
 */
function saveCache(data, image) {
    // load in cache.json
    var cache = rw.readJSON(`${process.env.cache_dir}/cache.json`);

    // saving into cache
    console.log('[Info] Saving image to cache');

    // append data
    cache.images.push(data);
    cache.recentImage = data.id;

    // save cache to cache.json
    rw.saveJSON(`${process.env.cache_dir}/cache.json`, cache);

    // save image to disk
    return await imagemin(image).then((minimage) => {
        fs.writeFileSync(`${process.env.cache_dir}/image-${data.id}.png`, await minimage.buffer());
    }).catch((e) => {
        console.error(`[Error] Failed to save image-${data.id}`);
        if (process.env.dev == true) console.error(e);
    });
}

module.exports = {
    saveCache
}