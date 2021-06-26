const {
    v4: uuidv4,
    validate: uuidValidate
} = require('uuid');
const rw = require('../../../../helper/readWrite');
const fs = require('fs');

// function to return the id for a cached image from the json
async function returnID(imageData) {
    // string for ID
    var UUID = '';

    // load in cache
    var cache = await rw.readJSON('./endpoints/plex/types/images/cache/cache.json');

    // for loop to look for a name that matches (yes the more and more shows/movies that are added this will get worse and worse)
    for (let i = 0; i < cache.images.length; i++) {
        if (cache.images[i].name == imageData.name) {
            switch (imageData.type) {
                case 'episode':
                    // check to see if the season and episode numbers match
                    if (cache.images[i].episode.season == imageData.episode.sn_num) {
                        if (cache.images[i].episode.episode == imageData.episode.ep_num) {
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

async function saveCache(imageData, imageBuffer) {
    // load in cache
    var cache = await rw.readJSON('./endpoints/plex/types/images/cache/cache.json');

    // save into cache
    console.log(`[Info] Saving image to cache`);

    // if image is already in the cache dont save it again
    if (imageData.imgExist == 'false') {
        // data for the cache
        var cacheData = {
            "id": `${imageData.id}`,
            "name": `${imageData.name}`,
            "imageName": `image-${imageData.id}.png`,
            "FileSystemURL": `cache/image-${imageData.id}.png`,
            "mediaType": `${imageData.type}`,
            "tmdbURL": `UNKNOWN`
        }

        // if this is in the tmdb then we add its url, ID and episode data
        if (imageData.isTmdb == 'true') {
            cacheData.tmdb = `${imageData.tmdb}`;
            switch (imageData.type) {
                case 'movie':
                    cacheData.tmdbURL = `https://www.themoviedb.org/movie/${imageData.tmdb}`;
                    break;
                case 'episode':
                    cacheData.tmdbURL = `https://www.themoviedb.org/tv/${imageData.tmdb}/season/${imageData.episode.sn_num}/episode/${imageData.episode.ep_num}`;
                    cacheData.episode = {
                        "episode": imageData.episode.ep_num,
                        "season": imageData.episode.sn_num
                    }
                    break;
            }
        }

        // append cache data
        cache.images.push(cacheData);
        cache.recentImage = imageData.id;

        // write file
        rw.saveJSON('./endpoints/plex/types/images/cache/cache.json', cache);

        // save image to cache
        fs.writeFileSync(`./endpoints/plex/types/images/cache/image-${imageData.id}.png`, imageBuffer); // image-${UUIDV4}.png
    }

    return;
}

module.exports = {
    returnID,
    saveCache
}