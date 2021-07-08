require('dotenv').config();
const {
    v4: uuidv4
} = require('uuid');
const rw = require('../../../../bin/readWrite');

/**
 * Returns a UUID for an image
 * 
 * @param {Object} data 
 * @returns {String} UUID
 */
function getIDFromCache(data) {
    var UUID = '';

    // load cache.json
    var cache = rw.readJSON(`${process.env.cache_dir}/cache.json`);

    // loop over all items until we find a match
    cache.images.forEach((cacheImages) => {
        if (cacheImages.name == data.name) {
            switch (data.type) {
                case 'episode':
                    // check to see if episode and season match
                    if (cacheImages.episode.seasonNumber == data.seasonNumber && cacheImages.episode.episodeNumber == data.episodeNumber) {
                        UUID = cacheImages.id;
                    }
                    break;
                case 'movie':
                    // store movie id
                    UUID = cacheImages.id;
                    break;
            }
        }
    })

    // assign random UUID if one cant be found
    if (UUID == '') UUID = uuidv4();

    return UUID;
}

module.exports = {
    getIDFromCache
}