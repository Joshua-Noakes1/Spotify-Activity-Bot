require('dotenv').config();
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const fs = require('fs');
const rw = require('../../../../bin/readWrite');

/**
 * Save the buffer of an image and its assocated data into the cache folder
 * 
 * @param {Object} data 
 * @param {Buffer} image 
 * @returns {null} Saved image to cache folderS
 */
async function saveCache(data, image) {


    // load in cache.json
    var cache = rw.readJSON(`${process.env.cache_dir}/cache.json`);

    // saving into cache
    console.log('[Info] Saving image to cache');

    // append data
    cache.images.push(data);
    cache.recentImage = data.id;

    // save cache to cache.json
    rw.saveJSON(`${process.env.cache_dir}/cache.json`, cache);


    // compress image
    console.log(`[Info] Compressing image "${data.name} (${data.id})"`);

    var compressedImage = await imagemin.buffer(image, {
        plugins: [
            imageminPngquant({
                quality: [0.5, 0.6]
            })
        ]
    }).catch((e) => {
        console.log(`[Error] Failed to compress image "${data.name} (${data.id})`);
        if (process.env.dev == 'true') console.log(e);
    });

    console.log(`[Success] Compressed image "${data.name}" (${data.id})`);

    // save image to disk
    return await fs.writeFileSync(`${process.env.cache_dir}/image-${data.id}.png`, compressedImage);
}

module.exports = {
    saveCache
}