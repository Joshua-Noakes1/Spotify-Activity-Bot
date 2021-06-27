const {
    v4: uuidv4,
    validate: uuidValidate
} = require('uuid');
const rw = require('../../endpoints/helper/readWrite');
const fs = require('fs');

// function to return the id for a cached image from the json
async function returnID(imageData) {
    // string for ID
    var UUID = '';

    // load in cache
    var cache = await rw.readJSON('./image/cache/cache.json');

    // for loop to look for a name that matches (yes the more and more shows/movies that are added this will get worse and worse)
    for (let i = 0; i < cache.images.length; i++) {
        if (cache.images[i].name == imageData.name) {
            switch (imageData.type.media) {
                case 'episode':
                    // check to see if the season and episode numbers match
                    if (cache.images[i].episode.season == imageData.episode.seasonNumber) {
                        if (cache.images[i].episode.episode == imageData.episode.episodeNumber) {
                            // check for a valid UUID and if not return a NULL
                            if (uuidValidate(cache.images[i].id)) {
                                UUID = cache.images[i].id;
                            }
                        }
                    }
                    break;
                case 'movie':
                    // check for a valid UUID and if not return a NULL
                    if (uuidValidate(cache.images[i].id)) {
                        UUID = cache.images[i].id;
                    }
                    break;
            }
        }
    }

    if (UUID == '') {
        UUID = uuidv4();
    }

    return UUID;
}

async function saveCache(cacheData, imageBuffer) {
    // load in cache
    var cache = await rw.readJSON('./image/cache/cache.json');

    // save into cache
    console.log(`[Info] Saving image to cache`);

    // append cache data
    cache.images.push(cacheData);
    cache.recentImage = cacheData.id;

    // write file
    rw.saveJSON('./image/cache/cache.json', cache);

    // save image to cache
    return fs.writeFileSync(`./image/cache/image-${cacheData.id}.png`, imageBuffer); // image-${UUIDV4}.png
}

module.exports = {
    returnID,
    saveCache
}