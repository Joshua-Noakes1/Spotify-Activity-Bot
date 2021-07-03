require('dotenv').config();
const {
    v4: uuidv4
} = require('uuid');
const rw = require('../../../../bin/readWrite');

/**
 * Returns a UUID for an image
 * 
 * @param {Object} data 
 * @returns UUID:String
 */
function getIDFromCache(data) {
    var UUID = '';

    // load cache.json
    var cache = rw.readJSON(`${process.env.cache_dir}/cache.json`);

    // loop over all items until we find a match
    for (let i = 0; i < cache.images.length; i++) {
        if (cache.images[i].name == data.name) {
            switch (data.type) {
                case 'episode':
                    // check to see if episode and season match
                    if (cache.images[i].episode.seasonNumber == data.seasonNumber && cache.images[i].episode.episodeNumber == data.episodeNumber) {
                        UUID = cache.images[i].id;
                    }
                    break;
                case 'movie':
                    // store movie id
                    UUID = cache.images[i].id;
                    break;
            }
        }
    }

    // assign random UUID if one cant be found
    if (UUID == '') UUID = uuidv4();

    return UUID;
}

module.exports = {
    getIDFromCache
}